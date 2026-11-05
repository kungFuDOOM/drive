// AI driving helpers: speed profile along the track, pure-pursuit steering, speed control.
import { clamp, wrapAngle, wrapDelta, cornerSpeed, steerCurvature, gripFactor } from './physics.js';

const profiles = new Map();
/** Dry-grip target speed (m/s) at each track sample with look-ahead braking. */
export function speedProfile(track, cls) {
  const key = cls.id + ':' + track.length;
  if (profiles.has(key)) return profiles.get(key);
  const N = track.n, v = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    let k = 0;
    for (let q = -3; q <= 3; q++) k = Math.max(k, Math.abs(track.kappa[(i + q + N) % N]));
    v[i] = Math.min(cls.vTop * 1.05, cornerSpeed(cls, k, track.squeeze[i] ? 0.62 : 0.88));
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
  return track._lerpAt(prof, s);
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

const sgn = (x) => (x >= 0 ? 1 : -1);

/** Nearest opponents ahead (within 40 m) and behind (within 28 m). */
function neighbours(car, race, out) {
  const L = race.track.length;
  out.ahead = null; out.behind = null; out.aGap = 99; out.bGap = 99;
  const cars = race.cars;
  for (let i = 0; i < cars.length; i++) {
    const o = cars[i];
    if (o === car || o.pit.stage) continue;
    const g = wrapDelta(o.s - car.s, L);
    if (g > 0 && g < out.aGap && g < 40) { out.aGap = g; out.ahead = o; }
    else if (g <= 0 && -g < out.bGap && -g < 28) { out.bGap = -g; out.behind = o; }
  }
  return out;
}
const nb = { ahead: null, behind: null, aGap: 99, bGap: 99 };

/**
 * Full AI controller: racing line + wander, traffic avoidance, slipstream attack
 * (draft, then pull out and pass), one-move defence, and occasional mistakes
 * (late braking / running wide / lock-up) whose frequency scales with difficulty.
 */
export function driveAI(car, race, dt, tmp) {
  const track = race.track, cls = car.cls, inp = car.input, diff = race.diff, ai = car.ai;
  const prof = race.profiles[cls.id];
  car.noiseT += dt;
  ai.t -= dt; ai.defendT -= dt;
  const wander = Math.sin(car.noiseT * 0.35 + car.noisePhase) * 1.2 + Math.sin(car.noiseT * 0.9 + car.noisePhase * 2) * 0.5;
  const look = 7 + car.v * 0.32;
  const hw = track.halfAt(car.s + look);
  const kLook = Math.abs(track.kappaS[track._idx(car.s + look * 2.5)[0]]);
  const straight = kLook < 0.003;
  const open = !track.squeeze[car.idx];
  const spread = open ? 1 : 0.25; // squeeze: stay near the line, queue single-file instead of fanning out into the walls
  let targetD = track.lineAt(car.s + look) * 0.9 + (car.lineBias + wander * car.wander) * spread;
  neighbours(car, race, nb);
  const { ahead, behind } = nb;
  let attacking = false, passing = false;

  // ---- attack: draft behind, then pull out beside the car in front ----
  if (ahead && !ahead.finished && nb.aGap < 28 && Math.abs(ahead.d - car.d) < 4.5 && car.progress > 0) {
    if (ai.t <= 0 && ai.mode !== 'pass') {
      ai.t = 0.8;
      const room = hw - 2;
      const left = room - ahead.d, right = room + ahead.d; // free lateral space each side
      ai.side = left > right ? 1 : -1;
      if (Math.abs(ahead.d - car.d) > 1.2) ai.side = sgn(car.d - ahead.d); // already beside one side
      ai.fight = Math.random() < 0.25 + 0.75 * diff.aggression;
    }
    if (ai.fight) {
      attacking = true;
      if (nb.aGap > 12 || !open) {
        if (straight) targetD = ahead.d;                                  // tuck into the tow
      } else {
        passing = true; ai.mode = 'pass'; ai.passT = 1.6;
        targetD = ahead.d + ai.side * 3.4;
      }
    }
  }
  if (ai.mode === 'pass' && !passing) { ai.passT -= dt; if (ai.passT > 0 && ahead && nb.aGap < 18) { passing = true; targetD = ahead.d + ai.side * 3.4; } else ai.mode = 'free'; }

  // ---- defend: one move toward the attacker on a straight ----
  if (behind && !behind.finished && nb.bGap < 14 && Math.abs(behind.d - car.d) < 5 && straight && !passing) {
    if (ai.defendT < -4 && Math.random() < 0.02 + 0.06 * diff.aggression) ai.defendT = 1.3;
    if (ai.defendT > 0) { targetD = car.d + clamp(behind.d - car.d, -3, 3); ai.defending = true; }
  } else ai.defending = false;

  // ---- plain traffic avoidance (when not deliberately racing alongside) ----
  let want = 0;
  if (!passing && !ai.defending && ahead && nb.aGap < 22 && Math.abs(ahead.d - car.d) < 2.8 && !(attacking && straight)) {
    want = (ahead.d >= car.d ? -1 : 1) * (open ? 3.0 : 1.2) * (1 - nb.aGap / 24);
    if (Math.abs(ahead.d - car.d) < 0.3) want = (track.lineAt(car.s) > 0 ? -1 : 1) * (open ? 3 : 1.4);
  }
  car.avoid += (want - car.avoid) * Math.min(1, dt * 2.5);
  targetD += car.avoid;

  // ---- mistakes ----
  ai.mistakeIn -= dt / Math.max(0.3, diff.mistakes);
  const vAhead = profileAt(track, prof, car.s + 70);
  if (ai.mistake) {
    ai.mistake.t -= dt;
    if (ai.mistake.t <= 0) { ai.mistake = null; ai.mistakeIn = 25 + Math.random() * 45; }
  } else if (ai.mistakeIn <= 0 && open && car.progress > 100 && !car.finished && vAhead < car.v - 12 && !car.pit.stage) {
    const r = Math.random();
    ai.mistake = r < 0.5 ? { type: 'late', t: 1.5 } : r < 0.8 ? { type: 'wide', t: 2.2 } : { type: 'lock', t: 0.9 };
    ai.mistake.out = -sgn(track.kappaS[track._idx(car.s + 40)[0]]);
  }
  if (ai.mistake?.type === 'wide') targetD += ai.mistake.out * 3.2;

  const lim = Math.max(hw - (open ? 1.6 : 2.4), 1.2);
  targetD = clamp(targetD, -lim, lim);
  inp.steer = steerTo(track, car, cls, targetD, look, tmp);
  const g = Math.min(1, Math.sqrt(Math.max(0.25, car.grip || 1)));
  let vt = profileAt(track, prof, car.s + car.v * 0.25) * car.skill * g;
  if (car.surface === 'grass' || car.surface === 'gravel') vt = Math.min(vt, 28);
  if (passing && nb.aGap < 14) vt *= 1.04;                  // dive-bomb: brake a touch later than usual
  if (ai.mistake?.type === 'late') vt *= 1.22;
  else if (ai.mistake?.type === 'lock') vt *= 0.7;
  // don't ram the car in front when stuck behind it in the same lane
  if (ahead && !passing && nb.aGap < 14 && Math.abs(ahead.d - car.d) < 2.4) vt = Math.min(vt, Math.max(ahead.v + clamp((nb.aGap - 6) * 0.8, -1.5, 8), vt * 0.6)); // follow, but never crawl: a floor stops stop-cascades in queues
  // mild, fair rubber band: stragglers get up to +2.5% pace, a runaway leader gives back up to 2%; the human is never touched
  const lead = race.order?.[0], second = race.order?.[1];
  if (lead && car.progress > 0 && !car.finished) {
    if (car !== lead) vt *= 1 + 0.025 * clamp((lead.progress - car.progress - 40) / 220, 0, 1);
    else if (second) vt *= 1 - 0.02 * clamp((car.progress - second.progress - 60) / 150, 0, 1);
  }
  // pack racing: a car with a tow and a car alongside-or-just-behind keeps its nerve (tiny pace trim so queues bunch instead of stretch)
  if (ahead && nb.aGap < 25 && straight && !passing) vt *= 1 + 0.012 * (1 - nb.aGap / 25) * (0.5 + 0.5 * diff.aggression);
  if (car.finished) vt = Math.min(vt, 38);
  speedControl(car, vt, inp);
  const tow = ahead && nb.aGap < 25 && straight;
  inp.boost = (car.boost > (tow ? 0.15 : 0.55)) && kLook < 0.0025 && car.v > 40 && !car.finished;
}

export { gripFactor };
