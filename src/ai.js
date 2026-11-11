// AI driving helpers: speed profile along the track, pure-pursuit steering, speed control.
import { clamp, wrapAngle, wrapDelta, steerCurvature, gripFactor, brakeCapacity, brakePressure } from './physics.js';
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
export function brakeLaw(car, track, prof, vt, base, lead = 0.25) {
  const cls = car.cls, cap = brakeCapacity(cls, Math.max(car.v, 10), Math.min(1, car.grip || 1));
  const v0 = profileAt(track, prof, car.s + car.v * lead), v1 = profileAt(track, prof, car.s + car.v * lead + 15);
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

/**
 * Stuck recovery: after 1.2 s below 2.5 m/s (or 0.3 s facing more than 1.5 rad off the road direction), reverse (a short burst, shorter between walls) while the car points well away
 * from the road or is on a wall, then drive out toward the line at up to 14 m/s. Returns true while it owns the inputs.
 */
function recover(car, race, dt, tmp, open) {
  const ai = car.ai, inp = car.input, track = race.track;
  if (car.finished || race.time < 3) { ai.stuckT = 0; ai.recoverT = 0; ai.revT = 0; return false; }
  const err = wrapAngle(track.thetaAt(car.s) - car.theta);
  if (ai.recoverT <= 0) {
    // stuck = (nearly) stopped, or pointing the wrong way (a spun car would otherwise floor it backwards round the lap)
    const wrongWay = Math.abs(err) > 1.5;
    ai.stuckT = car.v < 2.5 || wrongWay ? ai.stuckT + dt : 0;
    if (ai.stuckT > (wrongWay ? 0.3 : 1.2)) { ai.recoverT = 3; ai.stuckT = 0; ai.revT = 0; ai.recAll = 0; ai.recRot = 0; }
    else return false;
  }
  ai.recoverT -= dt; ai.recAll += dt;
  // still facing well away from the road when the timer ends: keep turning (no second reverse), up to 8 s in all
  if (ai.recoverT <= 0 && Math.abs(err) > 1.0 && ai.recAll < 8) ai.recoverT = dt;
  if ((car.v > 8 && Math.abs(err) < 0.4) || ai.recoverT <= 0) { ai.recoverT = 0; ai.revT = 0; return false; }
  inp.boost = false;
  // facing mostly backwards: rotate the way that swings the nose toward the road, not out over the edge
  // (forward steer -1 turns left = theta up; reversing flips that)
  if (Math.abs(err) > 2.0 && !ai.recRot) ai.recRot = -sgn(car.d - track.lineAt(car.s)); // chosen once per recovery
  const rot = Math.abs(err) > 2.0 ? ai.recRot : -sgn(err); // forward steer (-1 = left)
  // reverse when nosed into a wall or sideways; facing straight back on open road, a forward U-turn is quicker (no wall to back off)
  const backwards = Math.abs(err) > 2.0 && open && !(car.scrape > 0);
  if ((Math.abs(err) > 1.0 || car.scrape > 0) && !backwards && car.v < 3 && ai.revT < (open ? 1.2 : 0.8)) { // only from (near) standstill
    inp.throttle = 0; inp.brake = 1; inp.steer = Math.abs(err) > 2.0 ? -rot : clamp(err * 2, -1, 1); ai.revT += dt;
    return true;
  }
  const lineD = track.lineAt(car.s + 10);
  // pointing well away from the road: turn toward its direction (pure pursuit barely steers at a target behind the car)
  inp.steer = Math.abs(err) > 2.0 ? rot : Math.abs(err) > 1.0 ? clamp(-err * 2, -1, 1) : steerTo(track, car, car.cls, open ? lineD : 0.5 * lineD, 10, tmp);
  inp.brake = 0; inp.throttle = car.v < 14 ? 1 : 0;
  return true;
}

/** Nearest opponents ahead (within 40 m) and behind (within 28 m), the nearest car alongside (|ds| < 6, 1.6 < |dd| < 4.5), and the nearest stopped (< 4 m/s) car ahead. */
function neighbours(car, race, out) {
  const L = race.track.length;
  out.ahead = null; out.behind = null; out.aGap = 99; out.bGap = 99; out.beside = null; out.stopped = null; out.sGap = 99;
  let bs = 99;
  const cars = race.cars;
  for (let i = 0; i < cars.length; i++) {
    const o = cars[i];
    if (o === car || o.pit.stage) continue;
    const g = wrapDelta(o.s - car.s, L);
    if (g > 0 && g < out.aGap && g < 40) { out.aGap = g; out.ahead = o; }
    if (g > 0 && g < out.sGap && g < 40 && o.v < 4) { out.sGap = g; out.stopped = o; }
    else if (g <= 0 && -g < out.bGap && -g < 28) { out.bGap = -g; out.behind = o; }
    const dd = Math.abs(o.d - car.d);
    if (Math.abs(g) < 6 && dd > 1.6 && dd < 4.5 && Math.abs(g) < bs) { bs = Math.abs(g); out.beside = o; }
  }
  return out;
}
const nb = { ahead: null, behind: null, aGap: 99, bGap: 99, beside: null, stopped: null, sGap: 99 };

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
  const open = !track.squeeze[car.idx];
  if (recover(car, race, dt, tmp, open)) return;
  const wander = Math.sin(car.noiseT * 0.35 + car.noisePhase) * 1.2 + Math.sin(car.noiseT * 0.9 + car.noisePhase * 2) * 0.5;
  // dynamic look-ahead: long on straights, short in tight corners so the pursuit point does not cut the corner
  const kNear = Math.max(Math.abs(track.lineKappaAt(car.s + 4)), Math.abs(track.lineKappaAt(car.s + 4 + car.v * 0.35)));
  const look = clamp(4.5 + 0.3 * car.v - 1500 * Math.max(0, kNear - 0.004), 4.5, 32);
  const hw = track.halfAt(car.s + look);
  const kLook = Math.abs(track.kappaS[track._idx(car.s + look * 2.5)[0]]);
  const straight = kLook < 0.003;
  const spread = open ? 1 : 0.25; // squeeze: stay near the line, queue single-file instead of fanning out into the walls
  // personal offsets (bias + wander) fade in corners: the line itself is the apex/clearance solution there
  const slack = 1 - clamp((kNear - 0.002) / 0.006, 0, 0.7);
  const lineD = track.lineAt(car.s + look);
  let targetD = lineD + (car.lineBias + wander * car.wander) * spread * slack;
  neighbours(car, race, nb);
  const { ahead, behind, beside } = nb;
  let attacking = false, passing = false;
  // a stopped or near-stopped car ahead (spun, stalled, a parked human): go round it on the roomier side, never ram it.
  // The nearest stopped car counts even when a moving car (already going round it) is nearer.
  const stopped = nb.stopped, sGap = nb.sGap;
  const obstacle = race.time >= 3 && !car.finished && !!stopped && sGap < (open ? 14 : 30);
  if (obstacle) {
    if (ai.obst !== stopped) { const room = hw - 1.6; ai.obst = stopped; ai.side = room - stopped.d >= room + stopped.d ? 1 : -1; }
  } else ai.obst = null;
  // approaching a braking zone / corner: personal offsets, passes and avoidance fade so the car arrives on the line (passes continue after the corner)
  const vP = Math.min(profileAt(track, prof, car.s + 35), profileAt(track, prof, car.s + 80)) * car.skill;
  const cornerZone = Math.max(clamp((car.v - vP - 3) / 14, 0, 1), clamp((kNear - 0.003) / 0.004, 0, 1));
  // staggered braking points: a follower in the same lane looks further down the plan, so it brakes a touch earlier than the car ahead
  // (a per-car 0.20-0.30 s spread from noisePhase was tried and dropped: it broke the seeded aiRace / brake lock-up tests)
  let lead = 0.25;
  if (ahead && nb.aGap < 20 && ((Math.abs(ahead.d - car.d) < 2.4 && cornerZone > 0.3) || !open)) lead += 0.06; // walled: always brake early behind a car
  // pass on the exit: a pass given up in a corner is retried once the road straightens (the timer holds through walled stretches)
  if (open) ai.exitAttackT -= dt;
  const exitAttack = ai.exitAttackT > 0 && kNear < 0.004 && ahead && nb.aGap < 18;
  const passOk = open && kNear < 0.006 && cornerZone < 0.3; // no dive at the apex: passes start on the approach / straight only

  // ---- attack: draft behind, then pull out beside the car in front ----
  if (!obstacle && ahead && !ahead.finished && nb.aGap < 28 && Math.abs(ahead.d - car.d) < 4.5 && car.progress > 0) {
    if (ai.t <= 0 && ai.mode !== 'pass') {
      ai.t = 0.8;
      const room = hw - 2;
      const left = room - ahead.d, right = room + ahead.d; // free lateral space each side
      ai.side = left > right ? 1 : -1;
      if (Math.abs(ahead.d - car.d) > 1.2) ai.side = sgn(car.d - ahead.d); // already beside one side
      ai.fight = race.rng() < 0.25 + 0.75 * diff.aggression;
    }
    if (exitAttack) ai.fight = true;
    if (ai.fight) {
      attacking = true;
      if (nb.aGap > 12 || !passOk) {
        if (straight) targetD = ahead.d;                                  // tuck into the tow
      } else {
        passing = true; ai.mode = 'pass'; ai.passT = 1.6;
        targetD = ahead.d + ai.side * 3.4;
      }
    }
  }
  if (obstacle) ai.mode = 'free';
  if (ai.mode === 'pass' && !passing) { ai.passT -= dt; if (ai.passT > 0 && ahead && nb.aGap < 18) { passing = true; targetD = ahead.d + ai.side * 3.4; } else ai.mode = 'free'; }
  // walled stretch 40 m ahead, or its first metre: no passing inside, a pass that is not yet alongside falls back in line (retried on the exit)
  const wallGate = open ? !!track.squeeze[track._idx(car.s + 40)[0]] : ai.wasOpen !== false;
  ai.wasOpen = open;
  if (ai.mode === 'pass' && wallGate && nb.aGap > 3) { ai.mode = 'free'; passing = false; ai.exitAttackT = 4; targetD = lineD + (car.lineBias + wander * car.wander) * spread * slack; }
  // a pass still behind (not alongside) when the corner arrives is given up and retried on the exit
  if (ai.mode === 'pass' && cornerZone > 0.5 && nb.aGap > 3) { ai.mode = 'free'; passing = false; ai.exitAttackT = 2.5; targetD = lineD + (car.lineBias + wander * car.wander) * spread * slack; }

  // ---- defend: one move toward the attacker on a straight ----
  if (!obstacle && behind && !behind.finished && nb.bGap < 14 && Math.abs(behind.d - car.d) < 5 && straight && !passing) {
    if (ai.defendT < -4 && race.rng() < 0.02 + 0.06 * diff.aggression) ai.defendT = 1.3;
    if (ai.defendT > 0 && open) { targetD = car.d + clamp(behind.d - car.d, -3, 3); ai.defending = true; }
  } else ai.defending = false;

  // ---- plain traffic avoidance (when not deliberately racing alongside) ----
  let want = 0;
  if (!passing && !ai.defending && ahead && nb.aGap < 22 && Math.abs(ahead.d - car.d) < 2.8 && !(attacking && straight)) {
    want = (ahead.d >= car.d ? -1 : 1) * (open ? 3.0 : 2.0) * (1 - nb.aGap / 24);
    if (Math.abs(ahead.d - car.d) < 0.3) want = (track.lineAt(car.s) > 0 ? -1 : 1) * (open ? 3 : 2.0);
  }
  car.avoid += (want - car.avoid) * Math.min(1, dt * 2.5);
  if (obstacle) car.avoid = 0;
  if (open) targetD += car.avoid; // walled: added after the corner fade below (the squeeze is all corner)

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
  targetD = lineD + (targetD - lineD) * (1 - 0.85 * cornerZone);
  if (!open) targetD += car.avoid;
  if (ai.mistake?.type === 'wide') targetD += ai.mistake.out * 2.0;

  // walled and pinned against a wall for > 0.3 s: back toward the middle at a modest speed until clear of it
  const pin = (car.scrape || 0) > 0 || car.d > track.leftWall[car.idx] - 1.4 || car.d < -(track.rightWall[car.idx] - 1.4);
  ai.pinT = !open && pin ? (ai.pinT || 0) + dt : 0;
  if (ai.pinT > 0.3) ai.unpin = true;
  if (ai.unpin && (open || Math.abs(car.d) < hw - 2.4)) ai.unpin = false;
  if (ai.unpin) targetD = 0.5 * lineD;
  const lim = Math.max(hw - (open ? 2.0 : 2.4) - 0.012 * car.v, 1.2); // keep clear of the edge: more at speed (heading carries the car past its target)
  targetD = obstacle ? clamp(stopped.d + ai.side * 3.2, -(hw - 1.6), hw - 1.6) : clamp(targetD, -lim, lim); // the only place allowed to use hw - 1.6
  // side by side in a corner: the car behind on progress gives way a little (a lane-hold move to beside.d +- 2.8 m was tried
  // and dropped: it pushed cars off the line in corners and failed the seeded aiRace spread limit)
  const holdLane = beside && cornerZone > 0.3;
  // a slow car (spun, damaged, recovering) with someone close behind leaves the line toward the outside of the next corner
  const vPlan = profileAt(track, prof, car.s);
  if (car.v < 0.6 * vPlan && car.progress > 30) ai.slowT += dt; else ai.slowT = Math.max(0, ai.slowT - 2 * dt);
  if (ai.slowT > 0.7 && behind && nb.bGap < 15) ai.slowOut = -sgn(track.lineKappaAt(car.s + 30));
  if (ai.slowOut && car.v > 0.85 * vPlan) ai.slowOut = 0;
  if (ai.slowOut) targetD = clamp(targetD + ai.slowOut * (open ? 3 : 2), -lim, lim);
  const raw = steerRaw(track, car, cls, targetD, look, tmp);
  inp.steer = clamp(raw, -1, 1);
  const saturated = clamp((Math.abs(raw) - 0.85) / 0.6, 0, 1); // the line needs more steering than the tyres/lock give: slow down
  const g = Math.min(1, Math.sqrt(Math.max(0.25, car.grip || 1)));
  const skillEff = car.skill;
  let vt = profileAt(track, prof, car.s + car.v * lead) * skillEff * g;
  vt *= 1 - 0.12 * saturated;
  vt *= 1 - 0.4 * clamp((Math.abs(car.d - track.lineAt(car.s)) - 1.5) / 6, 0, 1) * clamp((kNear - 0.002) / 0.004, 0, 1); // off the line in a corner: the line's speed is not available
  if (car.surface === 'grass' || car.surface === 'gravel') vt = Math.min(vt, 28);
  if (passing && nb.aGap < 14 && kNear < 0.004) vt *= 1.04;                 // dive-bomb: brake a touch later than usual
  if (ai.mistake?.type === 'late') vt *= 1.1;
  if (holdLane && car.progress < beside.progress) vt *= open ? 0.95 : 0.90;
  // don't ram the car in front when stuck behind it in the same lane
  if (obstacle) {
    if (Math.abs(car.d - stopped.d) < 2.4) vt = Math.min(vt, Math.max(5, (sGap - 7) * 1.2)); // still in its lane: creep up while moving across (no follow floor)
    else vt = Math.min(vt, 14);                                                              // laterally clear: go by at a safe speed
  } else if (ahead && !passing && nb.aGap < (open ? 14 : 18) && Math.abs(ahead.d - car.d) < 2.4) {
    vt = Math.min(vt, Math.max(ahead.v + clamp((nb.aGap - (open ? 6 : 8)) * 0.8, -1.5, 8), vt * 0.6)); // walled: longer gap for blind corners // follow, but never crawl: a floor stops stop-cascades in queues
    if (cornerZone > 0.5) ai.exitAttackT = 2.5;                // held up into a corner: have a go on the exit
  }
  // mild, fair rubber band: stragglers get up to +4% pace, a runaway leader gives back up to 2%; the human is never touched
  const leader = race.order?.[0], second = race.order?.[1];
  if (leader && car.progress > 0 && !car.finished) {
    if (car !== leader) vt *= 1 + 0.04 * clamp((leader.progress - car.progress - 40) / 180, 0, 1);
    else if (second) vt *= 1 - 0.02 * clamp((car.progress - second.progress - 60) / 150, 0, 1);
  }
  // pack racing: a car with a tow and a car alongside-or-just-behind keeps its nerve (tiny pace trim so queues bunch instead of stretch)
  if (ahead && nb.aGap < 25 && straight && !passing) vt *= 1 + 0.012 * (1 - nb.aGap / 25) * (0.5 + 0.5 * diff.aggression);
  if (ai.unpin) vt = Math.min(vt, 16);
  if (car.finished) vt = Math.min(vt, 38);
  speedControl(car, vt, inp);
  if (inp.brake > 0) inp.brake = brakeLaw(car, track, prof, vt, inp.brake, lead);
  // lock-up mistake: stamp on the pedal at a braking point and lock the front tyres (no anti-lock for a moment).
  // It waits (timer held, up to 15 s) for a braking point where a full pedal really locks them (turn-in load / low grip):
  // in a high-speed straight-line stop the downforce-loaded tyres cannot lock, so a stamp there was a silent no-op.
  const lockMs = ai.mistake?.type === 'lock' ? ai.mistake : null;
  const braking = car.v > 35 && inp.brake > 0;
  if (lockMs && !lockMs.bit) {
    if (braking && brakePressure(cls, car.v, car.grip || 1, 1, Math.min(1, car.latFrac || 0)) > 1) lockMs.bit = true;
    else if ((lockMs.wait = (lockMs.wait || 0) + dt) < 15) lockMs.t += dt;
  }
  ai.forceLock = !!lockMs && braking && (lockMs.bit || lockMs.wait >= 15);
  if (ai.forceLock) inp.brake = 1;
  const tow = ahead && nb.aGap < 25 && straight;
  inp.boost = (car.boost > (tow ? 0.15 : 0.55)) && kLook < 0.0025 && car.v > 40 && !car.finished;
}

export { gripFactor };
