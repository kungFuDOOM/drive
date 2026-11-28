// Which circuit and twist each day gets. A pure function of the day ID, so every device agrees without a server.
// Pure logic; no clock, no Math.random.
import { addDays, dayNumber } from './date.js';

/**
 * Frozen track pools. The daily does NOT read the live TRACKS list: adding a circuit there would reshuffle
 * every past day. To bring a new circuit into the daily, APPEND an entry with a future `from` date
 * and the full new pool. Never edit an entry that has already started, and keep the hash below unchanged.
 */
export const ROTATIONS = [
  { from: '2026-01-01', tracks: ['citadel', 'highpine', 'dripwood', 'desert', 'lampwick', 'coastal'] },
];

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
export function dailyMap(id, rotations = ROTATIONS) {
  let rotation = rotations[0];
  for (const r of rotations) if (r.from <= id) rotation = r;
  const n = rotation.tracks.length;
  const day = dayNumber(id) - dayNumber(rotation.from);
  const cycle = Math.floor(day / n);
  const trackId = cycleOrder(rotation, cycle)[day - cycle * n];
  const twist = hashString(`drive-daily:twist:${id}`) % RAIN_ONE_IN === 0 ? 'rain' : 'dry';
  return { dayId: id, trackId, twist };
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
