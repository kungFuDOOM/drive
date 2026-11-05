// Pure game logic (no DOM / three.js) so it can be unit tested.
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const mod = (i, n) => ((i % n) + n) % n;
export function angDiff(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}

/**
 * Lap counting. `idx` is the float track index (0..N). Cars start behind the
 * line with lap = -1; crossing the line forward makes lap 0 (= running lap 1).
 * A forward wrap (big drop in idx) is +1, a backward wrap is -1.
 */
export function advanceLap(state, idx, N) {
  let lap = state.lap;
  const d = idx - state.idx;
  if (d < -N / 2) lap += 1;
  else if (d > N / 2) lap -= 1;
  return { lap, idx, progress: lap * N + idx };
}
export const lapDisplay = (lap, total) => clamp(lap + 1, 1, total);
export const hasFinished = (lap, total) => lap >= total;

/** Grip multiplier from tire compound, wear (0..1) and rain (0..1). */
export function tireGrip(tire, wear, rain) {
  const w = clamp(wear, 0, 1);
  const r = clamp(rain, 0, 1);
  const base = tire === 'wet' ? 0.86 + 0.12 * r : 1 - 0.45 * r;
  return base * (1 - 0.35 * Math.pow(w, 1.3));
}

/** Wear per second. load 0..1 = cornering/speed load. */
export function wearRate(tire, rain, load) {
  const r = clamp(rain, 0, 1);
  const base = 0.004 + 0.007 * clamp(load, 0, 1);
  const mult = tire === 'wet' ? 1 + 1.2 * (1 - r) : 1 + 0.2 * r;
  return base * mult;
}

/**
 * Slipstream strength 0..1. ahead = distance (units) from my nose to the car in
 * front along my heading; lateral = sideways offset.
 */
export function slipstream(ahead, lateral, range = 25, width = 3.5) {
  if (ahead < 2 || ahead > range) return 0;
  const l = Math.abs(lateral);
  if (l >= width) return 0;
  return (1 - ahead / range) * (1 - l / width);
}

export const rainLevel = (t, startAt, ramp = 10) => clamp((t - startAt) / ramp, 0, 1);

/** Race order: finished cars by finish time, others by progress. */
export function rankCars(cars) {
  return [...cars].sort((a, b) => {
    const fa = a.finishTime != null, fb = b.finishTime != null;
    if (fa && fb) return a.finishTime - b.finishTime;
    if (fa) return -1;
    if (fb) return 1;
    return b.progress - a.progress;
  });
}

// ---- pit lane geometry (in track sample indices around the start line) ----
export const PIT = { pre: 25, post: 25, flare: 8, width: 9, box: 6 };
const pitRel = (idx, N) => mod(idx + PIT.pre, N);
export const inPitRange = (idx, N) => pitRel(idx, N) <= PIT.pre + PIT.post;
export function pitLaneWidth(idx, N) {
  const rel = pitRel(idx, N);
  const len = PIT.pre + PIT.post;
  if (rel > len) return 0;
  return PIT.width * clamp(Math.min(rel, len - rel) / PIT.flare, 0, 1);
}
export const inPitBox = (idx, N) => Math.min(mod(idx, N), N - mod(idx, N)) <= PIT.box;

export function formatTime(s) {
  if (s == null || !isFinite(s)) return '--:--.--';
  const m = Math.floor(s / 60);
  const r = s - m * 60;
  return `${m}:${r.toFixed(2).padStart(5, '0')}`;
}
