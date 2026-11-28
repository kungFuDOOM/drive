// Daily best times and streaks, kept apart from the Time Trial / career saves. Storage is injected.
import { addDays } from './date.js';
import { isPlayable } from './schedule.js';
import { ghostStorageKey } from '../ghostStore.js';

export const DAILY_SAVE_KEY = 'drive-daily-v1';

export function defaultDailySave() {
  return { v: 1, bests: {}, official: {}, streak: { current: 0, longest: 0, lastDay: null } };
}
export function loadDailySave(storage) {
  const d = defaultDailySave();
  try {
    const o = JSON.parse(storage?.getItem(DAILY_SAVE_KEY));
    if (!o || typeof o !== 'object') return d;
    return { ...d, bests: { ...(o.bests || {}) }, official: { ...(o.official || {}) }, streak: { ...d.streak, ...(o.streak || {}) } };
  } catch { return d; }
}
export function persistDailySave(storage, save) {
  try { storage?.setItem(DAILY_SAVE_KEY, JSON.stringify(save)); return true; } catch { return false; }
}

/** { time, sectors } for a day, or null. */
export function getDailyBest(save, id) {
  const row = save.bests[id];
  return row && Number.isFinite(row.time) ? row : null;
}

/** Seed for the lap timer, so the HUD best, sector colours and ghost all compare against this day's best. */
export function dailyTimerSeed(save, id) {
  const b = getDailyBest(save, id);
  if (!b) return {};
  const sectors = b.sectors || [];
  return { bestLap: b.time, bestSectors: sectors.slice(), refSectors: sectors.slice() };
}

/**
 * A "finish" is a completed lap. Only the first one on the day that is current at that moment counts,
 * so replaying a past day (or crossing the line after the reset) never changes the streak.
 * Returns true if the streak advanced.
 */
export function recordStreak(save, id, todayId) {
  const s = save.streak;
  if (id !== todayId) return false;
  if (s.lastDay && s.lastDay >= id) return false; // already counted (or the device clock was wound back)
  s.current = s.lastDay === addDays(id, -1) ? s.current + 1 : 1;
  s.longest = Math.max(s.longest, s.current);
  s.lastDay = id;
  return true;
}

/** What to show: a run that missed yesterday is over, even before the next finish restarts it at 1. */
export function streakStatus(save, todayId) {
  const { current, longest, lastDay } = save.streak;
  const doneToday = lastDay === todayId;
  const alive = doneToday || lastDay === addDays(todayId, -1);
  return { current: alive ? current : 0, longest, doneToday };
}

/** Record a completed lap on day `id`. Returns { newBest, streakAdvanced }. */
export function recordDailyLap(save, id, lap, todayId) {
  if (!Number.isFinite(lap?.time) || lap.time <= 0) return { newBest: false, streakAdvanced: false };
  const cur = getDailyBest(save, id);
  const newBest = !cur || lap.time < cur.time;
  if (newBest) save.bests[id] = { time: lap.time, sectors: (lap.sectors || []).slice() };
  return { newBest, streakAdvanced: recordStreak(save, id, todayId) };
}

/** Ghost "track id" for a day: each daily has its own ghost, never mixed with Time Trial ghosts. */
export const dailyGhostId = (id) => `daily:${id}`;

/** Drop ghosts for days that can no longer be raced (they are the only bulky daily data). */
export function pruneDailyGhosts(storage, todayId) {
  const prefix = ghostStorageKey('daily', ''); // '<ghost key>:daily:' then '<day>:<class>'
  const stale = [];
  try {
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (!key?.startsWith(prefix)) continue;
      const id = key.slice(prefix.length).split(':')[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(id) && !isPlayable(id, todayId)) stale.push(key);
    }
    for (const key of stale) storage.removeItem(key);
  } catch { /* storage unavailable */ }
  return stale.length;
}
