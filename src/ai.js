// AI driving helpers: speed profile along the track, pure-pursuit steering, speed control.
import { clamp, wrapAngle, wrapDelta, steerCurvature, gripFactor, brakeCapacity } from './physics.js';
import { lineProfile } from './racingLine.js';

/** Planned speed (m/s) at each track sample along the racing line (curvature-limited, braking-limited). Cached per class/track. */
export function speedProfile(track, cls) { return lineProfile(track, cls).v; }
export function profileAt(track, prof, s) {
  return track._lerpAt(prof, s);
}

/** Unclamped steering demand (-1 left .. +1 right; |x| > 1 = the target needs more curvature than the car can give) to reach lateral offset targetD at lookahead. */
export function steerRaw(track, car, cls, targetD, look, tmp) {
  const s = car.s + look;
  track.at(s, targetD, tmp);
  const dx = tmp.x - car.x, dz = tmp.z - car.z;
  const err = wrapAngle(Math.atan2(dx, dz) - car.theta);
  const kReq = (2 * Math.sin(err)) / Math.max(Math.hypot(dx, dz), 1); // + = left
  const kMax = Math.max(Math.abs(steerCurvature(cls, 1, Math.max(car.v, 3), car.grip || 1)), 1e-4);
  return -kReq / kMax;
}
/** Steering input (-1 left .. +1 right) to reach lateral offset targetD at lookahead. */
export function steerTo(track, car, cls, targetD, look, tmp) {
  return clamp(steerRaw(track, car, cls, targetD, look, tmp), -1, 1);
}

/**
 * Mid/hard braking: pedal = deceleration the plan asks for (feed-forward from the speed profile gradient, share of the
 * car's brake capacity) plus a proportional term on the speed error. Soft when only slightly fast, firm at braking points.
 */
export function brakeLaw(car, track, prof, vt, base) {
  const cls = car.cls, cap = brakeCapacity(cls, Math.max(car.v, 10), Math.min(1, car.grip || 1));
  const v0 = profileAt(track, prof, car.s + car.v * 0.25), v1 = profileAt(track, prof, car.s + car.v * 0.25 + 15);
  const aff = Math.max(0, (v0 * v0 - v1 * v1) / 30) * car.skill;
  const err = Math.max(0, car.v - vt);
  return clamp(Math.max(base * 0.6, aff / cap * 1.1 + err / 9), 0.2, 0.9);
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
  // dynamic look-ahead: long on straights, short in tight corners so the pursuit point does not cut the corner
  const kNear = Math.max(Math.abs(track.lineKappaAt(car.s + 4)), Math.abs(track.lineKappaAt(car.s + 4 + car.v * 0.35)));
  const look = clamp(4.5 + 0.3 * car.v - 1500 * Math.max(0, kNear - 0.004), 4.5, 32);
  const hw = track.halfAt(car.s + look);
  const kLook = Math.abs(track.kappaS[track._idx(car.s + look * 2.5)[0]]);
  const straight = kLook < 0.003;
  const open = !track.squeeze[car.idx];
  const spread = open ? 1 : 0.25; // squeeze: stay near the line, queue single-file instead of fanning out into the walls
  // personal offsets (bias + wander) fade in corners: the line itself is the apex/clearance solution there
  const slack = 1 - clamp((kNear - 0.002) / 0.006, 0, 0.7);
  const lineD = track.lineAt(car.s + look);
  let targetD = lineD + (car.lineBias + wander * car.wander) * spread * slack;
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
      ai.fight = race.rng() < 0.25 + 0.75 * diff.aggression;
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
    if (ai.defendT < -4 && race.rng() < 0.02 + 0.06 * diff.aggression) ai.defendT = 1.3;
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
    if (ai.mistake.t <= 0) { ai.mistake = null; ai.mistakeIn = 25 + race.rng() * 45; }
  } else if (ai.mistakeIn <= 0 && open && car.progress > 100 && !car.finished && vAhead < car.v - 12 && !car.pit.stage) {
    const r = race.rng();
    ai.mistake = r < 0.5 ? { type: 'late', t: 1.2 } : r < 0.8 ? { type: 'wide', t: 2.2 } : { type: 'lock', t: 0.9 };
    ai.mistake.out = -sgn(track.kappaS[track._idx(car.s + 40)[0]]);
  }
  // approaching a braking zone / corner: personal offsets, passes and avoidance fade so the car arrives on the line (passes continue after the corner)
  const vP = Math.min(profileAt(track, prof, car.s + 35), profileAt(track, prof, car.s + 80)) * car.skill;
  const cornerZone = Math.max(clamp((car.v - vP - 3) / 14, 0, 1), clamp((kNear - 0.003) / 0.004, 0, 1));
  targetD = lineD + (targetD - lineD) * (1 - 0.85 * cornerZone);
  if (ai.mistake?.type === 'wide') targetD += ai.mistake.out * 2.0;

  const lim = Math.max(hw - (open ? 2.0 : 2.4) - 0.012 * car.v, 1.2); // keep clear of the edge: more at speed (heading carries the car past its target)
  targetD = clamp(targetD, -lim, lim);
  const raw = steerRaw(track, car, cls, targetD, look, tmp);
  inp.steer = clamp(raw, -1, 1);
  const saturated = clamp((Math.abs(raw) - 0.85) / 0.6, 0, 1); // the line needs more steering than the tyres/lock give: slow down
  const g = Math.min(1, Math.sqrt(Math.max(0.25, car.grip || 1)));
  const skillEff = car.skill;
  let vt = profileAt(track, prof, car.s + car.v * 0.25) * skillEff * g;
  vt *= 1 - 0.12 * saturated;
  vt *= 1 - 0.4 * clamp((Math.abs(car.d - track.lineAt(car.s)) - 1.5) / 6, 0, 1) * clamp((kNear - 0.002) / 0.004, 0, 1); // off the line in a corner: the line's speed is not available
  if (car.surface === 'grass' || car.surface === 'gravel') vt = Math.min(vt, 28);
  if (passing && nb.aGap < 14) vt *= 1.04;                  // dive-bomb: brake a touch later than usual
  if (ai.mistake?.type === 'late') vt *= 1.1;
  // don't ram the car in front when stuck behind it in the same lane
  if (ahead && !passing && nb.aGap < 14 && Math.abs(ahead.d - car.d) < 2.4) vt = Math.min(vt, Math.max(ahead.v + clamp((nb.aGap - 6) * 0.8, -1.5, 8), vt * 0.6)); // follow, but never crawl: a floor stops stop-cascades in queues
  // mild, fair rubber band: stragglers get up to +4% pace, a runaway leader gives back up to 2%; the human is never touched
  const lead = race.order?.[0], second = race.order?.[1];
  if (lead && car.progress > 0 && !car.finished) {
    if (car !== lead) vt *= 1 + 0.04 * clamp((lead.progress - car.progress - 40) / 180, 0, 1);
    else if (second) vt *= 1 - 0.02 * clamp((car.progress - second.progress - 60) / 150, 0, 1);
  }
  // pack racing: a car with a tow and a car alongside-or-just-behind keeps its nerve (tiny pace trim so queues bunch instead of stretch)
  if (ahead && nb.aGap < 25 && straight && !passing) vt *= 1 + 0.012 * (1 - nb.aGap / 25) * (0.5 + 0.5 * diff.aggression);
  if (car.finished) vt = Math.min(vt, 38);
  speedControl(car, vt, inp);
  if (inp.brake > 0) inp.brake = brakeLaw(car, track, prof, vt, inp.brake);
  // lock-up mistake: stamp on the pedal at a braking point and lock the front tyres (no anti-lock for a moment)
  ai.forceLock = ai.mistake?.type === 'lock' && car.v > 35 && inp.brake > 0;
  if (ai.forceLock) inp.brake = 1;
  const tow = ahead && nb.aGap < 25 && straight;
  inp.boost = (car.boost > (tow ? 0.15 : 0.55)) && kLook < 0.0025 && car.v > 40 && !car.finished;
}

export { gripFactor };
