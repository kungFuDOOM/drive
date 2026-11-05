// Persistent progress: best laps, class unlocks, goals. Pure logic; storage is injected
// (window.localStorage in the browser, a Map-like stub in tests).
import { formatTime } from './timing.js';

export const SAVE_KEY = 'drive-save-v1';
export const GHOST_KEY = 'drive-ghost-v1';

export const DIFFICULTY = {
  easy: { id: 'easy', name: 'Easy', skill: 0.90, spread: 0.04, mistakes: 1.6, aggression: 0.35, goalPos: 3 },
  normal: { id: 'normal', name: 'Normal', skill: 0.955, spread: 0.035, mistakes: 1.0, aggression: 0.65, goalPos: 3 },
  hard: { id: 'hard', name: 'Hard', skill: 0.99, spread: 0.025, mistakes: 0.5, aggression: 1.0, goalPos: 2 },
};

/** Classes that start locked and what unlocks them. */
export const UNLOCKS = {
  speedway: { name: 'Speedway', requires: 'gp', podium: 3 },
};

export function defaultSave() {
  return { v: 1, unlocked: { gp: true }, bests: {}, podiums: 0, races: 0 };
}
export function loadSave(storage) {
  const d = defaultSave();
  try {
    const raw = storage?.getItem(SAVE_KEY);
    if (!raw) return d;
    const o = JSON.parse(raw);
    if (!o || typeof o !== 'object') return d;
    return { ...d, ...o, unlocked: { ...d.unlocked, ...(o.unlocked || {}) }, bests: { ...(o.bests || {}) } };
  } catch { return d; }
}
export function persist(storage, save) {
  try { storage?.setItem(SAVE_KEY, JSON.stringify(save)); return true; } catch { return false; }
}

export function isUnlocked(save, cls) {
  return !UNLOCKS[cls] || !!save.unlocked[cls];
}
export function lockMessage(cls) {
  const u = UNLOCKS[cls];
  if (!u) return '';
  return `${u.name.toUpperCase()} LOCKED - finish on the podium (top ${u.podium}) in a ${u.requires.toUpperCase()} race to unlock`;
}

// ---- best laps ---------------------------------------------------------------
export const getBest = (save, cls) => save.bests[cls] || null;
/** Store a finished lap if it is a new best (or improves a best sector). Returns true if lap record. */
export function recordLap(save, cls, lap) {
  const cur = save.bests[cls] || { bestLap: Infinity, bestSectors: [], refSectors: [] };
  let record = false;
  if (lap.time < cur.bestLap) { cur.bestLap = lap.time; cur.refSectors = lap.sectors.slice(); record = true; }
  lap.sectors.forEach((s, i) => { const b = cur.bestSectors[i]; if (b == null || s < b) cur.bestSectors[i] = s; });
  save.bests[cls] = cur;
  return record;
}
/** JSON stores Infinity as null: restore it when feeding the timer. */
export function timerSeed(save, cls) {
  const b = getBest(save, cls);
  if (!b || !isFinite(b.bestLap ?? NaN)) return {};
  return { bestLap: b.bestLap, bestSectors: b.bestSectors.map((x) => x ?? Infinity), refSectors: b.refSectors };
}

// ---- goals ---------------------------------------------------------------------
export function goalFor({ mode, difficulty = 'normal', cls = 'gp' }, save) {
  if (mode === 'tt') {
    const b = getBest(save, cls);
    if (b && isFinite(b.bestLap ?? NaN)) return { kind: 'lap', target: b.bestLap, text: `Beat your best lap: ${formatTime(b.bestLap)}` };
    return { kind: 'lap', target: Infinity, text: 'Set a lap time, then beat it' };
  }
  const n = (DIFFICULTY[difficulty] || DIFFICULTY.normal).goalPos;
  return { kind: 'pos', target: n, text: n === 1 ? 'Win the race' : `Finish top ${n}` };
}
/** result: { pos, bestLapBefore, bestLap } */
export function evaluateGoal(goal, result) {
  if (goal.kind === 'pos') {
    const met = result.pos != null && result.pos <= goal.target;
    return { met, text: met ? `GOAL MET - P${result.pos}` : `GOAL MISSED - P${result.pos} (needed top ${goal.target})` };
  }
  const t = result.bestLap;
  if (!isFinite(t ?? NaN)) return { met: false, text: 'GOAL MISSED - no lap completed' };
  const met = t < goal.target;
  return { met, text: met ? `GOAL MET - ${formatTime(t)}` : `GOAL MISSED - ${formatTime(t)} vs ${formatTime(goal.target)}` };
}

// ---- progression ---------------------------------------------------------------
/** Record a finished race. Time trials never count. Returns { unlocked:[cls], messages:[] }. */
export function recordRace(save, { mode, cls, pos }) {
  const out = { unlocked: [], messages: [] };
  if (mode !== 'race') return out;
  save.races = (save.races || 0) + 1;
  for (const [id, u] of Object.entries(UNLOCKS)) {
    if (save.unlocked[id]) continue;
    if (cls === u.requires && pos != null && pos <= u.podium) {
      save.unlocked[id] = true; out.unlocked.push(id);
      out.messages.push(`${u.name.toUpperCase()} CLASS UNLOCKED!`);
    }
  }
  if (cls === 'gp' && pos != null && pos <= 3) save.podiums = (save.podiums || 0) + 1;
  if (!out.unlocked.length) {
    for (const [id, u] of Object.entries(UNLOCKS)) if (!save.unlocked[id]) out.messages.push(lockMessage(id));
  }
  return out;
}
