// Pure racing-line maths (no DOM / three.js): geometric minimum-curvature line, the speed profile along it
// (braking-limited), and the driver-guide colour logic. Shared by the AI, the track and the on-screen guide.
import { clamp, wrapAngle, cornerSpeed, brakeCapacity, longGripLimit, ELLIPSE_FLOOR, lateralAccelLimit } from './physics.js';

/** Car centre clearance from the road edge on the racing line (m): beyond the kerb/white line, wall-safe in the squeeze. */
export const LINE_MARGIN = 1.7;
export const LINE_MARGIN_SQUEEZE = 2.3;

const lineCache = new Map();

/**
 * Minimum-curvature line inside the corridor [-(half-margin), +(half-margin)] around the centre line.
 * Solves  min sum |P[i-1] - 2P[i] + P[i+1]|^2  with P[i] = C[i] + d[i]*n[i]  by clamped Gauss-Seidel/SOR on the
 * bi-harmonic stencil, which produces outside - apex - outside lines per corner and flattens esses (no oscillation).
 * Returns { d, kappa } (Float32Array per track sample). Cached per track geometry (the track is a constant).
 */
export function computeRacingLine(track) {
  const key = track.n + ':' + track.length.toFixed(3);
  const hit = lineCache.get(key);
  if (hit) return hit;
  const N = track.n, px = track.px, pz = track.pz, nx = track.nx, nz = track.nz, ds = track.ds;
  const lim = new Float64Array(N), d = new Float64Array(N);
  const X = new Float64Array(N), Z = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    lim[i] = Math.max(0.5, track.half[i] - (track.squeeze[i] ? LINE_MARGIN_SQUEEZE : LINE_MARGIN));
    X[i] = px[i]; Z[i] = pz[i];
  }
  const w = 1.7, iters = 2400;
  for (let it = 0; it < iters; it++) {
    for (let i = 0; i < N; i++) {
      const a = (i + N - 1) % N, b = (i + 1) % N, a2 = (i + N - 2) % N, b2 = (i + 2) % N;
      const tx = (4 * (X[a] + X[b]) - (X[a2] + X[b2])) / 6 - px[i];
      const tz = (4 * (Z[a] + Z[b]) - (Z[a2] + Z[b2])) / 6 - pz[i];
      const target = tx * nx[i] + tz * nz[i];
      const nd = clamp(d[i] + w * (target - d[i]), -lim[i], lim[i]);
      d[i] = nd; X[i] = px[i] + nx[i] * nd; Z[i] = pz[i] + nz[i] * nd;
    }
  }
  // path curvature of the resulting line: heading change over arc length (+ = left, same as track.kappa)
  const hd = new Float64Array(N), arc = new Float64Array(N), k = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const b = (i + 1) % N, dx = X[b] - X[i], dz = Z[b] - Z[i];
    hd[i] = Math.atan2(dx, dz); arc[i] = Math.hypot(dx, dz) || ds;
  }
  for (let i = 0; i < N; i++) {
    const a = (i + N - 1) % N;
    k[i] = wrapAngle(hd[i] - hd[a]) / ((arc[i] + arc[a]) / 2);
  }
  const ks = smooth(k, 2), out = { d: Float32Array.from(d), kappa: ks, x: Float32Array.from(X), z: Float32Array.from(Z) };
  lineCache.set(key, out);
  return out;
}
function smooth(arr, w) {
  const N = arr.length, o = new Float32Array(N);
  for (let i = 0; i < N; i++) { let s = 0; for (let q = -w; q <= w; q++) s += arr[(i + q + N) % N]; o[i] = s / (2 * w + 1); }
  return o;
}

// ---- speed profile along the line ------------------------------------------------------
export const PLAN_GRIP = 0.88; // dry planning grip (open road); the squeeze uses less
export const PLAN_GRIP_SQUEEZE = 0.85;
export const BRAKE_PLAN = 0.8; // share of pedal capacity the plan uses (leaves margin for lock-free trail braking)

const profCache = new Map();
/**
 * Planned speed (m/s) at every sample: corner-limited from the line curvature, then braking-limited backwards with a
 * speed-dependent brake capacity and the friction ellipse (trail-braking decel shrinks with lateral load).
 * Also returns `corner` (the un-propagated corner limit) for the guide / braking boards.
 */
export function lineProfile(track, cls) {
  const key = cls.id + ':' + track.n + ':' + track.length.toFixed(3);
  const hit = profCache.get(key);
  if (hit) return hit;
  const N = track.n, kap = computeRacingLine(track).kappa, corner = new Float32Array(N), v = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    let kk = 0;
    for (let q = -3; q <= 3; q++) kk = Math.max(kk, Math.abs(kap[(i + q + N) % N]));
    // grip limit, and the steering-lock limit (max curvature = cls.steer / (1 + (v/28)^2)) with a reserve so the car can still correct
    const vLock = 28 * Math.sqrt(Math.max(0.04, (0.9 * cls.steer) / Math.max(kk, 1e-4) - 1));
    corner[i] = Math.min(cls.vTop * 1.05, vLock, cornerSpeed(cls, kk, track.squeeze[i] ? PLAN_GRIP_SQUEEZE : PLAN_GRIP));
    v[i] = corner[i];
  }
  for (let it = 0; it < 2 * N; it++) {
    const i = (N - 1 - (it % N)), j = (i + 1) % N, vj = v[j];
    const g = track.squeeze[j] ? PLAN_GRIP_SQUEEZE : PLAN_GRIP;
    const latLim = lateralAccelLimit(cls, vj, g), latFrac = clamp(vj * vj * Math.abs(kap[j]) / Math.max(latLim, 1), 0, 1);
    const ellipse = Math.max(ELLIPSE_FLOOR, Math.sqrt(1 - latFrac * latFrac));
    const ab = Math.min(brakeCapacity(cls, vj, g) * BRAKE_PLAN, longGripLimit(cls, vj, g) * 0.9 * ellipse);
    const lim = Math.sqrt(vj * vj + 2 * ab * track.ds);
    if (lim < v[i]) v[i] = lim;
  }
  const out = { v, corner };
  profCache.set(key, out);
  return out;
}

// ---- driver guide colours ----------------------------------------------------------------
/** Thresholds as a share of the pedal brake capacity at the current speed (testable, see racingLine.test.js). */
export const GUIDE = { RED: 0.5, YELLOW: 0.12, MIN_YELLOW: 2.0, BLEND: 0.35, MIN_DIST: 4 };
export const GUIDE_GREEN = [0.2, 0.95, 0.32], GUIDE_YELLOW = [1, 0.84, 0.08], GUIDE_RED = [1, 0.14, 0.1];

/** Deceleration (m/s^2) needed to be at speed `vt` after `dist` metres when travelling at `v`. 0 when already slow enough. */
export function requiredDecel(v, vt, dist) {
  if (v <= vt) return 0;
  return (v * v - vt * vt) / (2 * Math.max(dist, GUIDE.MIN_DIST));
}
/** Guide level: 0 green (throttle / ample margin), 1 yellow (lift, coast, caution), 2 red (brake firmly now). cap = brake capacity (m/s^2). */
export function guideLevel(aReq, cap) {
  if (aReq >= GUIDE.RED * cap) return 2;
  if (aReq >= Math.max(GUIDE.MIN_YELLOW, GUIDE.YELLOW * cap)) return 1;
  return 0;
}
/** Smooth RGB for a required decel (green -> yellow -> red); returns the level. */
export function guideColor(aReq, cap, out, o = 0) {
  const yT = Math.max(GUIDE.MIN_YELLOW, GUIDE.YELLOW * cap), rT = GUIDE.RED * cap, bl = GUIDE.BLEND;
  let A = GUIDE_GREEN, B = GUIDE_GREEN, t = 0;
  if (aReq >= rT) { A = B = GUIDE_RED; }
  else if (aReq >= rT * (1 - bl * 0.5)) { A = GUIDE_YELLOW; B = GUIDE_RED; t = (aReq - rT * (1 - bl * 0.5)) / (rT * bl * 0.5); }
  else if (aReq >= yT) { A = B = GUIDE_YELLOW; }
  else if (aReq >= yT * (1 - bl)) { A = GUIDE_GREEN; B = GUIDE_YELLOW; t = (aReq - yT * (1 - bl)) / (yT * bl); }
  out[o] = A[0] + (B[0] - A[0]) * t; out[o + 1] = A[1] + (B[1] - A[1]) * t; out[o + 2] = A[2] + (B[2] - A[2]) * t;
  return guideLevel(aReq, cap);
}

export const GUIDE_BACK = 8, GUIDE_AHEAD = 140, GUIDE_HALF_W = 0.75, GUIDE_LIFT = 0.07;
export const guideSamples = (track) => Math.ceil((GUIDE_BACK + GUIDE_AHEAD) / track.ds) + 1;

/**
 * Fill typed buffers with the guide ribbon for a car at path position s with speed v. Two vertices per sample
 * (left/right of the line). pos: 3 floats/vertex, col: 4 floats/vertex (rgb + fade alpha). No allocation.
 * `gripScale` mirrors the AI (sqrt grip); `cap` is the car's brake capacity at the current speed.
 * Returns the number of samples written.
 */
export function fillGuide(track, cls, s, v, grip, pos, col, count = guideSamples(track)) {
  const N = track.n, ds = track.ds, line = computeRacingLine(track), prof = lineProfile(track, cls).v;
  const scale = Math.sqrt(Math.max(0.25, grip));
  const cap = brakeCapacity(cls, Math.max(v, 8), Math.min(1, grip));
  const f0 = Math.floor((s - GUIDE_BACK) / ds);
  const rgb = _rgb;
  for (let k = 0; k < count; k++) {
    const i = (((f0 + k) % N) + N) % N;
    let dist = (f0 + k) * ds - s;
    const vt = prof[i] * scale;
    const aReq = dist < 0 ? 0 : requiredDecel(v, vt, dist);
    guideColor(aReq, cap, rgb);
    const dl = line.d[i] + GUIDE_HALF_W, dr = line.d[i] - GUIDE_HALF_W, y = track.py[i] + GUIDE_LIFT;
    const o = k * 6, c = k * 8;
    pos[o] = track.px[i] + track.nx[i] * dl; pos[o + 1] = y; pos[o + 2] = track.pz[i] + track.nz[i] * dl;
    pos[o + 3] = track.px[i] + track.nx[i] * dr; pos[o + 4] = y; pos[o + 5] = track.pz[i] + track.nz[i] * dr;
    const fade = Math.min(1, Math.max(0, (dist + GUIDE_BACK) / 6)) * Math.min(1, Math.max(0, (GUIDE_AHEAD - dist) / 30));
    col[c] = col[c + 4] = rgb[0]; col[c + 1] = col[c + 5] = rgb[1]; col[c + 2] = col[c + 6] = rgb[2];
    col[c + 3] = col[c + 7] = 0.9 * fade;
  }
  return count;
}
const _rgb = [0, 0, 0];

/** Whether the guide is allowed: HARD never has it (even if the saved setting says on); Easy/Normal follow the setting (default on). */
export function lineGuideEnabled(difficulty, saved) {
  if (difficulty === 'hard') return false;
  return saved === undefined || saved === null ? true : !!saved;
}
