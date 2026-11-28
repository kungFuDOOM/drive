// Which circuit and twist each day gets. A pure function of the day ID, so every device agrees without a server.
// Pure logic; no clock, no Math.random.
//
// To give a day a new daily-only map: add the track file and register it (steps in src/tracks/daily/index.js),
// then add one line to FIXED_DAYS below. Days without a fixed line follow the rotation, so a missed day is harmless.
import { addDays, dayNumber } from './date.js';
import { dailyTracks } from '../tracks/daily/index.js';

/**
 * Frozen track pools. The daily does NOT read the live TRACKS list: adding a circuit there would reshuffle
 * every past day. To bring a new circuit into the daily, APPEND an entry with a future `from` date
 * and the full new pool. Never edit an entry that has already started, and keep the hash below unchanged.
 */
export const ROTATIONS = [
  { from: '2026-01-01', tracks: ['citadel', 'highpine', 'dripwood', 'desert', 'lampwick', 'coastal'] },
];

/**
 * Fixed assignments, oldest first: { day: 'YYYY-MM-DD', trackId, twist? }. A line overrides the rotation for
 * that day only (the rotation of every other day is unaffected). Without `twist` the day keeps its usual one.
 * Only add lines for days that have not started: never add, edit or remove a line for today or the past.
 */
export const FIXED_DAYS = [
  // { day: '2026-11-28', trackId: 'harbourloop', twist: 'dry' },
];

/** Daily #1. */
export const FIRST_DAILY_DAY = '2026-11-27';
export const dailyNumber = (id) => dayNumber(id) - dayNumber(FIRST_DAILY_DAY) + 1;

/** Daily twists. `rain`: starts on a wet track, player on wet tyres. */
export const TWISTS = {
  dry: { id: 'dry', label: 'DRY' },
  rain: { id: 'rain', label: 'RAIN' },
};
const RAIN_ONE_IN = 3;

export const PAST_DAYS = 14;

/** FNV-1a with a final avalanche mix -> uint32. Integer maths only: identical on every engine. */
export function hashString(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
}

function shuffled(list, seed) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = hashString(`${seed}:${i}`) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Play order for one pass through a pool. Never opens on the circuit that closed the previous pass. */
function cycleOrder(rotation, cycle) {
  const raw = (c) => shuffled(rotation.tracks, `drive-daily:${rotation.from}:${c}`);
  const order = raw(cycle);
  const n = order.length;
  // The swap below only moves slots 0 and 1, so with 3+ circuits the previous pass's last slot is its raw one.
  if (cycle > 0 && n > 2 && order[0] === raw(cycle - 1)[n - 1]) [order[0], order[1]] = [order[1], order[0]];
  return order;
}

/** { dayId, trackId, twist } for a day. */
export function dailyMap(id, rotations = ROTATIONS, fixed = FIXED_DAYS) {
  const usual = hashString(`drive-daily:twist:${id}`) % RAIN_ONE_IN === 0 ? 'rain' : 'dry';
  const set = fixed.find((f) => f.day === id);
  if (set) return { dayId: id, trackId: set.trackId, twist: set.twist || usual };
  let rotation = rotations[0];
  for (const r of rotations) if (r.from <= id) rotation = r;
  const n = rotation.tracks.length;
  const day = dayNumber(id) - dayNumber(rotation.from);
  const cycle = Math.floor(day / n);
  const trackId = cycleOrder(rotation, cycle)[day - cycle * n];
  return { dayId: id, trackId, twist: usual };
}

/** The playable past days, newest first (today is not included). */
export function pastMaps(todayId, count = PAST_DAYS) {
  return Array.from({ length: count }, (_, i) => dailyMap(addDays(todayId, -(i + 1))));
}

/** Today and the previous PAST_DAYS days can be raced; the future cannot. */
export function isPlayable(id, todayId) {
  const age = dayNumber(todayId) - dayNumber(id);
  return age >= 0 && age <= PAST_DAYS;
}

/**
 * Fetch the daily-only track of day `id` if it needs one. Resolves true when that day's circuit is ready to
 * draw and race, false for a day that cannot be shown yet (the future is never fetched) or a failed download.
 * Circuits in the main game are always ready.
 */
export function loadDayTrack(id, todayId, { map = dailyMap(id), tracks = dailyTracks } = {}) {
  if (id > todayId) return Promise.resolve(false);
  return tracks.has(map.trackId) ? tracks.load(map.trackId) : Promise.resolve(true);
}
