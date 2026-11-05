// AI driving helpers: speed profile along the track, pure-pursuit steering, speed control.
import { clamp, wrapAngle, cornerSpeed, steerCurvature, gripFactor } from './physics.js';

const profiles = new Map();
/** Dry-grip target speed (m/s) at each track sample with look-ahead braking. */
export function speedProfile(track, cls) {
  const key = cls.id + ':' + track.length;
  if (profiles.has(key)) return profiles.get(key);
  const N = track.n, v = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    let k = 0;
    for (let q = -3; q <= 3; q++) k = Math.max(k, Math.abs(track.kappa[(i + q + N) % N]));
    v[i] = Math.min(cls.vTop * 1.05, cornerSpeed(cls, k, 0.9));
  }
  const ab = cls.brake * 0.7;
  for (let it = 0; it < 2 * N; it++) {
    const i = (N - 1 - (it % N)), j = (i + 1) % N;
    const lim = Math.sqrt(v[j] * v[j] + 2 * ab * track.ds);
    if (lim < v[i]) v[i] = lim;
  }
  profiles.set(key, v);
  return v;
}
export function profileAt(track, prof, s) {
  const [a, b, u] = track._idx(s);
  return prof[a] + (prof[b] - prof[a]) * u;
}

/** Steering input (-1 left .. +1 right) to reach lateral offset targetD at lookahead. */
export function steerTo(track, car, cls, targetD, look, tmp) {
  const s = car.s + look;
  track.at(s, targetD, tmp);
  const dx = tmp.x - car.x, dz = tmp.z - car.z;
  const err = wrapAngle(Math.atan2(dx, dz) - car.theta);
  const kReq = (2 * Math.sin(err)) / Math.max(Math.hypot(dx, dz), 1); // + = left
  const kMax = Math.max(Math.abs(steerCurvature(cls, 1, Math.max(car.v, 3), car.grip || 1)), 1e-4);
  return clamp(-kReq / kMax, -1, 1);
}

/** Throttle/brake from current vs target speed. */
export function speedControl(car, vt, input) {
  const dv = vt - car.v;
  if (dv > 0.5) { input.throttle = clamp(dv / 3, 0.35, 1); input.brake = 0; }
  else if (dv < -1.5) { input.throttle = 0; input.brake = clamp(-dv / 8, 0.25, 1); }
  else { input.throttle = clamp(0.35 + dv * 0.2, 0, 0.5); input.brake = 0; }
}

/** Full AI controller (racing line + variation + traffic avoidance). */
export function driveAI(car, race, dt, tmp) {
  const track = race.track, cls = car.cls, inp = car.input;
  const prof = race.profiles[cls.id];
  car.noiseT += dt;
  const wander = Math.sin(car.noiseT * 0.35 + car.noisePhase) * 1.2 + Math.sin(car.noiseT * 0.9 + car.noisePhase * 2) * 0.5;
  const look = 7 + car.v * 0.32;
  const hw = track.halfAt(car.s + look);
  let targetD = track.lineAt(car.s + look) * 0.9 + car.lineBias + wander * car.wander;
  // traffic avoidance
  let ahead = null, aheadGap = 1e9;
  for (const o of race.cars) {
    if (o === car || o.pit.stage) continue;
    const gap = ((o.s - car.s) % track.length + track.length) % track.length;
    if (gap < aheadGap && gap < 22) { aheadGap = gap; ahead = o; }
  }
  let want = 0;
  if (ahead && Math.abs(ahead.d - car.d) < 2.8) {
    want = (ahead.d >= car.d ? -1 : 1) * 3.0 * (1 - aheadGap / 24);
    if (Math.abs(ahead.d - car.d) < 0.3) want = (track.lineAt(car.s) > 0 ? -1 : 1) * 3;
  }
  car.avoid += (want - car.avoid) * Math.min(1, dt * 2.5);
  targetD += car.avoid;
  const lim = Math.max(hw - 1.6, 1.2);
  targetD = clamp(targetD, -lim, lim);
  inp.steer = steerTo(track, car, cls, targetD, look, tmp);
  const g = Math.min(1, Math.sqrt(Math.max(0.25, car.grip || 1)));
  let vt = profileAt(track, prof, car.s + car.v * 0.25) * car.skill * g;
  const surfaceSlow = car.surface === 'grass' || car.surface === 'gravel' ? 0.6 : 1;
  vt *= surfaceSlow;
  if (car.finished) vt = Math.min(vt, 38);
  speedControl(car, vt, inp);
  inp.boost = car.boost > 0.55 && Math.abs(track.kappaS[track._idx(car.s)[0]]) < 0.0025 && car.v > 40 && !car.finished;
}

export { gripFactor };
