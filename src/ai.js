// AI driving helpers: speed profile along the track, pure-pursuit steering, speed control.
import { clamp, wrapAngle, wrapDelta, steerCurvature, gripFactor, brakeCapacity, brakePressure, lateralAccelLimit, longGripLimit, ELLIPSE_FLOOR, cornerSpeed } from './physics.js';
import { lineProfile, computeRacingLine, PLAN_GRIP, PLAN_GRIP_SQUEEZE, BRAKE_PLAN } from './racingLine.js';

/** Planned speed (m/s) at each track sample along the racing line (curvature-limited, braking-limited). Cached per class/track. */
export function speedProfile(track, cls) { return lineProfile(track, cls).v; }
export function profileAt(track, prof, s) {
  return track._lerpAt(prof, s);
}

// ---- per-driver pace model ---------------------------------------------------------------------------------------
// A driver's pace is three factors on the shared plan (lineProfile, which the player's line guide also reads and which
// is never changed here): corner (speed through corners), brake (deceleration used into them: how late and how hard)
// and exit (how quickly full throttle comes back). Straights are always flat out: a slower driver loses time in braking
// zones and corners, not by lifting on a straight.
const PHYS_GRIP = 1.2; // dry new-tyre grip (1.0) less a small margin
const FLAT = 1.25; // straight-line target as a share of vTop: always above anything the car can reach (boost + tow)
const drvCache = new Map();
/** Driver speed plan (m/s per track sample) for corner factor cF and brake factor bF. Cached. */
export function driverProfile(track, cls, cF, bF) {
  cF = Math.round(cF * 1e5) / 1e5; bF = Math.round(bF * 1e5) / 1e5; // compute with exactly what the cache key holds
  const key = `${track.id}:${cls.id}:${track.n}:${cF.toFixed(5)}:${bF.toFixed(5)}`;
  const hit = drvCache.get(key);
  if (hit) return hit;
  const base = lineProfile(track, cls), N = track.n, kap = computeRacingLine(track).kappa, v = new Float32Array(N);
  const cap = cls.vTop * 1.05 - 1e-3;
  for (let i = 0; i < N; i++) {
    if (base.corner[i] >= cap) { v[i] = cls.vTop * FLAT; continue; }
    // grip-limited corner speed scales with the driver; the steering-lock limit does not (cars cannot steer tighter)
    let kk = 0;
    for (let q = -3; q <= 3; q++) kk = Math.max(kk, Math.abs(kap[(i + q + N) % N]));
    const vGrip = cornerSpeed(cls, kk, track.squeeze[i] ? PLAN_GRIP_SQUEEZE : PLAN_GRIP);
    const vLock = 28 * Math.sqrt(Math.max(0.04, (1.0 * cls.steer) / Math.max(kk, 1e-4) - 1));
    const vPhys = cornerSpeed(cls, kk, PHYS_GRIP); // tyre limit on a dry new tyre: no driver goes past it
    // the factor bites hardest in slow corners and fades in fast ones (a slow driver still takes fast kinks nearly flat)
    const w = clamp(1.8 - 1.8 * base.corner[i] / cls.vTop, 0.1, 1.8), cFi = 1 + (cF - 1) * w;
    v[i] = Math.min(cls.vTop * FLAT, vGrip * cFi, Math.max(Math.min(vLock, vPhys), base.corner[i]));
  }
  // braking envelope: the plan's backward pass with the driver's deceleration (bF^2: the old v * skill scaling), capped by
  // what the tyres and anti-lock physically give on a dry new tyre (a faster driver cannot brake beyond the car)
  for (let it = 0; it < 2 * N; it++) {
    const i = (N - 1 - (it % N)), j = (i + 1) % N, vj = v[j];
    const g = track.squeeze[j] ? PLAN_GRIP_SQUEEZE : PLAN_GRIP, vp = vj / bF;
    const latLim = lateralAccelLimit(cls, vp, g), latFrac = clamp(vp * vp * Math.abs(kap[j]) / Math.max(latLim, 1), 0, 1);
    const ellipse = Math.max(ELLIPSE_FLOOR, Math.sqrt(1 - latFrac * latFrac));
    const abPlan = Math.min(brakeCapacity(cls, vp, g) * BRAKE_PLAN, longGripLimit(cls, vp, g) * 0.9 * ellipse) * bF * bF;
    const latP = clamp(vj * vj * Math.abs(kap[j]) / Math.max(lateralAccelLimit(cls, vj, PHYS_GRIP), 1), 0, 1);
    const abPhys = Math.min(brakeCapacity(cls, vj, 1) * 0.88, longGripLimit(cls, vj, PHYS_GRIP) * 0.9 * Math.max(ELLIPSE_FLOOR, Math.sqrt(1 - latP * latP)));
    const lim = Math.sqrt(vj * vj + 2 * Math.min(abPlan, abPhys) * track.ds);
    if (lim < v[i]) v[i] = lim;
  }
  if (drvCache.size > 400) drvCache.clear();
  drvCache.set(key, v);
  return v;
}
/** Predicted lap time (s) along a driver plan, with a simple full-throttle acceleration pass (drag, slope). */
function predictLap(track, cls, plan) {
  const N = track.n, v = Float64Array.from(plan, (x) => Math.min(x, cls.vTop));
  for (let it = 0; it < 2 * N; it++) {
    const i = it % N, j = (i + 1) % N, vi = v[i];
    const a = Math.min(cls.accel * Math.max(0, 1 - (vi / cls.vTop) ** 2), 9.81 * 1.5) - 0.00045 * vi * vi - 0.4 - 9.81 * track.slopeAt(i * track.ds) * 0.7;
    const lim = Math.sqrt(Math.max(1, vi * vi + 2 * a * track.ds));
    if (lim < v[j]) v[j] = lim;
  }
  let t = 0;
  for (let i = 0; i < N; i++) t += track.ds / Math.max(v[i], 1);
  return t;
}
// The plan-only lap prediction misses losses a real lap has everywhere (tyre scrub, line deviations, throttle ramps), so
// it over-states how much a lower factor costs; and a race best lap comes out a little slower than a clean solo lap.
// GAP_CAL maps a wanted race best-lap gap onto the predictor (fit on all six tracks with tools/ai-sim.mjs).
const GAP_CAL = 1.23;
export const LIMIT_FACTOR = 1.18; // the reference "limit" driver: clean, no wall hits, off-track moments or lock-ups
// Braking takes BRAKE_SHARE of a driver's deficit, corners the rest: a slower driver brakes a little earlier and softer
// but mostly carries less speed through the corner, so the flat-out share of the lap stays close to a fast driver's.
const BRAKE_SHARE = 0.0;
const brakeOf = (f) => Math.round((LIMIT_FACTOR + (f - LIMIT_FACTOR) * BRAKE_SHARE) * 1e5) / 1e5;
const facCache = new Map();
/** Uniform corner/brake factor whose predicted lap is `gap` (0.05 = 5 %) slower than the limit driver's. */
export function paceFactor(track, cls, gap) {
  gap = Math.round(gap * 1e5) / 1e5; // compute with exactly what the cache key holds (results never depend on call order)
  const key = `${track.id}:${cls.id}:${track.n}:${gap.toFixed(5)}`;
  if (facCache.has(key)) return facCache.get(key);
  const tLim = predictLap(track, cls, driverProfile(track, cls, LIMIT_FACTOR, LIMIT_FACTOR)), want = tLim * (1 + gap * GAP_CAL);
  let lo = 0.6, hi = LIMIT_FACTOR + 0.1;
  for (let k = 0; k < 22; k++) {
    const mid = 0.5 * (lo + hi), f = Math.round(mid * 1e5) / 1e5;
    if (predictLap(track, cls, driverProfile(track, cls, f, brakeOf(f))) > want) lo = mid; else hi = mid;
  }
  const f = Math.round(0.5 * (lo + hi) * 1e5) / 1e5;
  facCache.set(key, f);
  return f;
}
/**
 * Pace for one driver: `gap` = share slower than the limit lap, `tilt` (-1..1, personality) trades a little corner speed
 * against braking, `variation` = per-corner, per-lap pace noise amplitude. Returns { corner, brake, exit, variation, prof }.
 */
export function makePace(track, cls, { gap = null, factor = null, tilt = 0, variation = 0 } = {}) {
  const f = factor ?? paceFactor(track, cls, gap);
  const t = clamp(tilt, -1, 1) * 0.012 * Math.min(1, f);
  const corner = Math.round(f * (1 + t) * 1e5) / 1e5, brake = Math.round(brakeOf(f) * (1 - 1.6 * t) * 1e5) / 1e5;
  const exit = clamp(1 - (gap ?? (LIMIT_FACTOR - f) / 2) * 2, 0, 1);
  return { corner, brake, exit, variation, gap, prof: driverProfile(track, cls, corner, brake) };
}
/** Corner index per track sample: the next local minimum of the plan (the corner a car there is heading into). */
const apexCache = new Map();
export function apexIndex(track, cls) {
  const key = `${track.id}:${cls.id}:${track.n}`;
  if (apexCache.has(key)) return apexCache.get(key);
  const v = lineProfile(track, cls).v, N = track.n, out = new Int32Array(N);
  const isMin = (i) => v[i] < cls.vTop * 0.98 && v[i] <= v[(i + 1) % N] && v[i] < v[(i - 1 + N) % N];
  let next = -1;
  for (let k = 2 * N - 1; k >= 0; k--) { const i = k % N; if (isMin(i)) next = i; if (k < N) out[i] = next; }
  apexCache.set(key, out);
  return out;
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
  const aff = Math.max(0, (v0 * v0 - v1 * v1) / 30); // prof is the driver's own plan (already scaled by their pace)
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

export const CAR_LEN = 4.6, CAR_WID = 2.1; // the overlap box Race._interactions pushes cars apart with
/**
 * Nearest opponents ahead (within 40 m) and behind (within 28 m), the nearest car alongside
 * (bodies overlap lengthwise, |ds| < CAR_LEN + 1, and are side by side, CAR_WID - 0.3 < |dd| < 4.5), and the nearest stopped
 * (< 4 m/s) car ahead.
 */
function neighbours(car, race, out) {
  const L = race.track.length;
  out.ahead = null; out.behind = null; out.aGap = 99; out.bGap = 99; out.beside = null; out.stopped = null; out.sGap = 99;
  let bs = 99;
  const cars = race.cars;
  for (let i = 0; i < cars.length; i++) {
    const o = cars[i];
    if (o === car || o.pit.stage) continue;
    const g = wrapDelta(o.s - car.s, L);
    const dd = Math.abs(o.d - car.d);
    if (g > 0 && g < out.aGap && g < 40) { out.aGap = g; out.ahead = o; } // includes a car alongside but ahead (a pass in progress)
    if (g > 0 && g < out.sGap && g < 40 && o.v < 4) { out.sGap = g; out.stopped = o; }
    else if (g <= 0 && -g < out.bGap && -g < 28) { out.bGap = -g; out.behind = o; }
    if (Math.abs(g) < CAR_LEN + 1 && dd > CAR_WID - 0.3 && dd < 4.5 && Math.abs(g) < bs) { bs = Math.abs(g); out.beside = o; }
  }
  return out;
}
/** Any car alongside (|ds| < 8 m, |dd| < 5 m: a margin over the 6 x 4.5 m "alongside" box) or within 16 m ahead in the same lane: no mistakes then (never punt anyone). */
function crowded(car, race) {
  const L = race.track.length;
  for (const o of race.cars) {
    if (o === car || o.pit.stage || o.finished) continue;
    const g = wrapDelta(o.s - car.s, L), dd = Math.abs(o.d - car.d);
    if (Math.abs(g) < 8 && dd < 5) return true;
    if (g > 0 && g < 16 && dd < 2.6) return true;
  }
  return false;
}
/** Speed the car ahead is about to be doing: its current speed, or lower when its plan just ahead asks it to brake. */
function followSpeed(race, o) {
  const track = race.track, prof = o.pace?.prof || race.profiles[o.cls.id];
  if (o.v < 4) return o.v;
  // accelerating out of a corner it will be quicker in a moment (a follower capped at its current speed falls behind every exit)
  return Math.min(o.v + Math.max(0, o.longAcc || 0) * 0.5, profileAt(track, prof, o.s + o.v * 0.35) * Math.min(1, Math.sqrt(Math.max(0.25, o.grip || 1))));
}
const nb = { ahead: null, behind: null, aGap: 99, bGap: 99, beside: null, stopped: null, sGap: 99 };

/**
 * Full AI controller: racing line + wander, traffic avoidance, slipstream attack
 * (draft, then pull out and pass), one-move defence, and occasional mistakes
 * (late braking / running wide / lock-up) whose frequency scales with difficulty.
 */
export function driveAI(car, race, dt, tmp) {
  const track = race.track, cls = car.cls, inp = car.input, diff = race.diff, ai = car.ai;
  const prof = car.pace.prof; // this driver's speed plan (see makePace)
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
  const vP = Math.min(profileAt(track, prof, car.s + 35), profileAt(track, prof, car.s + 80));
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
  // The countdown runs at diff.mistakes errors per lap driven, faster for less consistent drivers and under pressure
  // (a car within 10 m behind for 5 s, worn tyres, a wet track). It then waits for a braking zone to strike.
  ai.pressT = behind && nb.bGap < 10 ? ai.pressT + dt : Math.max(0, ai.pressT - 2 * dt);
  const pressure = (ai.pressT > 5 ? 1.6 : 1) * (1 + 0.8 * clamp((car.wear - 0.4) / 0.5, 0, 1)) * (1 + 1.2 * clamp(race.wetness, 0, 1));
  ai.mistakeIn -= (Math.max(0, car.v) * dt / track.length) * diff.mistakes * (1.5 - (ai.consistency ?? 0.5)) * pressure;
  const vAhead = profileAt(track, prof, car.s + 70);
  if (ai.mistake) {
    ai.mistake.t -= dt;
    if (ai.mistake.t <= 0) { ai.mistake = null; ai.mistakeIn = 0.5 + race.rng(); }
  } else if (ai.mistakeIn <= 0 && open && car.progress > 100 && !car.finished && vAhead < car.v - 10 && !car.pit.stage && !crowded(car, race)) {
    // severity: small slips (a touch late on the brakes, a missed apex: ~0.1-0.3 s) are common; big ones are rare, Easy-weighted
    const big = race.rng() < (diff.bigMistake ?? 0.15), r = race.rng();
    const wet = race.wetness > 0.3;
    ai.mistake = !big ? (r < 0.5 ? { type: 'late', t: 0.9, big } : { type: 'apex', t: 1.6, big })
      : wet && r < 0.3 ? { type: 'spin', t: 1.4, big } : r < 0.55 ? { type: 'lock', t: 0.9, big } : { type: 'wide', t: 2.2, big };
    ai.mistake.out = -sgn(track.kappaS[track._idx(car.s + 40)[0]]);
  }
  targetD = lineD + (targetD - lineD) * (1 - 0.85 * cornerZone);
  // following through a corner (not passing): sit 0.5-1 m off the leader's path instead of right on its bumper
  if (open && ahead && !passing && !obstacle && nb.aGap < 22 && cornerZone > 0.3 && Math.abs(ahead.d - car.d) < 1.2) {
    const off = sgn(car.d - ahead.d || car.lineBias || 1);
    targetD = ahead.d + off * Math.max(Math.abs(car.d - ahead.d), (0.5 + 0.5 * (1 - nb.aGap / 22)) * cornerZone);
  }
  if (!open) targetD += car.avoid;
  const mType = ai.mistake?.type;
  if (mType === 'wide') targetD += ai.mistake.out * 2.6;
  else if (mType === 'apex') targetD += ai.mistake.out * 1.0;

  // walled and pinned against a wall for > 0.3 s: back toward the middle at a modest speed until clear of it
  const pin = (car.scrape || 0) > 0 || car.d > track.leftWall[car.idx] - 1.4 || car.d < -(track.rightWall[car.idx] - 1.4);
  ai.pinT = !open && pin ? (ai.pinT || 0) + dt : 0;
  if (ai.pinT > 0.3) ai.unpin = true;
  if (ai.unpin && (open || Math.abs(car.d) < hw - 2.4)) ai.unpin = false;
  if (ai.unpin) targetD = 0.5 * lineD;
  const lim = Math.max(hw - (open ? 2.0 : 2.4) - 0.012 * car.v, 1.2); // keep clear of the edge: more at speed (heading carries the car past its target)
  const limM = mType === 'wide' && open ? Math.max(lim, hw - 0.8) : lim; // a big run-wide mistake reaches the kerb / grass edge
  targetD = obstacle ? clamp(stopped.d + ai.side * 3.2, -(hw - 1.6), hw - 1.6) : clamp(targetD, -limM, limM); // the only place allowed to use hw - 1.6
  // side by side into a corner: keep to your side and leave the other car at least a car's width (2.6 m between centres); the
  // car behind on progress also gives way a little (speed trim below)
  const holdLane = beside && cornerZone > 0.3;
  if (holdLane && open) {
    const sd = sgn(car.d - beside.d), edge = beside.d + sd * (CAR_WID + 0.5);
    if (sd > 0 ? targetD < edge : targetD > edge) targetD = clamp(edge, -(hw - 1.4), hw - 1.4);
  }
  // a slow car (spun, damaged, recovering) with someone close behind leaves the line toward the outside of the next corner
  const vPlan = profileAt(track, prof, car.s);
  if (car.v < 0.6 * vPlan && car.progress > 30) ai.slowT += dt; else ai.slowT = Math.max(0, ai.slowT - 2 * dt);
  if (ai.slowT > 0.7 && behind && nb.bGap < 15) ai.slowOut = -sgn(track.lineKappaAt(car.s + 30));
  if (ai.slowOut && car.v > 0.85 * vPlan) ai.slowOut = 0;
  if (ai.slowOut) targetD = clamp(targetD + ai.slowOut * (open ? 3 : 2), -lim, lim);
  // wet half-spin on the exit (AI only): the rear steps out for 0.4 s, the car loses speed and gathers it up
  if (mType === 'spin' && ai.mistake.t > 1.0) { car.theta += ai.mistake.out * 0.9 * dt; car.v *= 1 - 0.5 * dt; }
  const raw = steerRaw(track, car, cls, targetD, look, tmp);
  inp.steer = clamp(raw, -1, 1);
  const saturated = clamp((Math.abs(raw) - 0.85) / 0.6, 0, 1); // the line needs more steering than the tyres/lock give: slow down
  const g = Math.min(1, Math.sqrt(Math.max(0.25, car.grip || 1)));
  // per-corner, per-lap pace variation: a fresh draw from race.rng each time the car starts heading into a new corner
  const apex = apexIndex(track, cls)[track._idx(car.s + 40)[0]];
  // (two thirds per corner, one third a per-lap rhythm drawn as each lap starts, so a whole lap can be a touch off)
  if (apex !== ai.varApex) { ai.varApex = apex; ai.varU = car.pace.variation ? race.rng() * 2 - 1 : 0; }
  if (car.laps !== ai.formLap) { ai.formLap = car.laps; ai.form = car.pace.variation ? race.rng() * 2 - 1 : 0; }
  let vt = profileAt(track, prof, car.s + car.v * lead) * g * (1 + car.pace.variation * (0.67 * (ai.varU || 0) + 0.33 * (ai.form || 0)));
  vt *= 1 - 0.12 * saturated;
  vt *= 1 - 0.4 * clamp((Math.abs(car.d - track.lineAt(car.s)) - 1.5) / 6, 0, 1) * clamp((kNear - 0.002) / 0.004, 0, 1); // off the line in a corner: the line's speed is not available
  if (car.surface === 'grass' || car.surface === 'gravel') vt = Math.min(vt, 28);
  if (passing && nb.aGap < 14 && kNear < 0.004) vt *= 1.04;                 // dive-bomb: brake a touch later than usual
  if (mType === 'late') vt *= ai.mistake.big ? 1.1 : 1.05;
  else if (mType === 'apex') vt *= 0.97;
  else if (mType === 'spin' && kNear < 0.006 && ai.mistake.t < 1.0) vt *= 0.7;
  if (holdLane && car.progress < beside.progress) vt *= open ? 0.95 : 0.90;
  // don't ram the car in front when stuck behind it in the same lane
  if (obstacle) {
    if (Math.abs(car.d - stopped.d) < 2.4) vt = Math.min(vt, Math.max(5, (sGap - 7) * 1.2)); // still in its lane: creep up while moving across (no follow floor)
    else vt = Math.min(vt, 14);                                                              // laterally clear: go by at a safe speed
  } else if (ahead && !passing && nb.aGap < 40 && Math.abs(ahead.d - car.d) < CAR_WID + 0.4) {
    // time-gap follow: hold a gap to the car ahead, using where it is about to be (its own plan just ahead of it: it brakes
    // for the corner, so does the follower; accelerating out, it will be quicker) and the closing speed
    const vL = followSpeed(race, ahead);
    const bump = nb.aGap - CAR_LEN;
    // gap held nose to tail: 0.11-0.13 s through braking zones and corners (shorter with aggression; 1.4x walled) and 0.12 s
    // on a straight, measured in metres at the car's own speed so it shrinks in slow corners; an attacker in the tow on a
    // straight closes right up (0.08 s) to pull out and pass
    const tCorner = (0.14 - 0.03 * diff.aggression) * (open ? 1 : 1.4);
    const tGap = open && cornerZone < 0.3 ? (attacking && straight ? 0.08 : 0.12) : tCorner;
    const want = 1.5 + car.v * tGap;
    // speed that lets the follower match vL by the time the bumper gap has shrunk to `want` (at a firm 0.6 g)
    const room = Math.max(0, bump - want), vStop = Math.sqrt(vL * vL + 2 * 6 * room);
    const vFol = Math.min(vStop, vL + clamp((bump - want) * 0.8, -2, 8));
    vt = Math.min(vt, bump > 0.6 * want ? Math.max(vFol, vt * 0.6) : vFol); // never crawl in a queue, unless right on its bumper
    if (cornerZone > 0.5) ai.exitAttackT = 2.5;                // held up into a corner: have a go on the exit
  }
  // no rubber band and no pack pace trim: nothing here reads race.order, another car's progress or the player's position.
  // Field closeness comes from the skill spread (makePace), slipstream, boost and tyre wear.
  if (ai.unpin) vt = Math.min(vt, 16);
  if (car.finished) vt = Math.min(vt, 38);
  ai.vt = vt; // final target speed this step (read by the harness)
  speedControl(car, vt, inp);
  // corner exit (the plan rises ahead and the car is below target): squeeze to full throttle instead of feathering it
  // (only when nothing in the next ~1.5 s asks for less speed, and the steering has margin)
  if (inp.brake === 0 && vt - car.v > 0.3 && Math.abs(raw) < 0.8 && !car.finished) {
    const p0 = profileAt(track, prof, car.s) - 0.5;
    let rising = true;
    for (let a = 15; a <= 15 + car.v * 1.5 && rising; a += 15) if (profileAt(track, prof, car.s + a) < p0) rising = false;
    if (rising) inp.throttle = 1;
  }
  // exit: throttle comes back at a driver-specific rate (an exit factor of 1 is effectively instant)
  if (inp.throttle > (ai.thr ?? 0)) inp.throttle = Math.min(inp.throttle, (ai.thr ?? 0) + dt * (2.5 + 12 * car.pace.exit));
  ai.thr = inp.throttle;
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
