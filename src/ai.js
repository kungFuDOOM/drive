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
/**
 * Driver speed plan (m/s per track sample) for corner factor cF and brake factor bF. Cached. gs (< 1 on a wet or worn
 * tyre) scales the tyre grip the plan is built on: corner speeds come from that grip, braking distances from the brake
 * capacity and longitudinal grip at that grip (not a single factor on the dry plan). gs = 1 is the dry plan exactly.
 */
export function driverProfile(track, cls, cF, bF, gs = 1) {
  cF = Math.round(cF * 1e5) / 1e5; bF = Math.round(bF * 1e5) / 1e5; gs = Math.min(1, Math.round(gs * 100) / 100); // compute with exactly what the cache key holds
  const key = `${track.id}:${cls.id}:${track.n}:${cF.toFixed(5)}:${bF.toFixed(5)}${gs < 1 ? ':' + gs.toFixed(2) : ''}`;
  const hit = drvCache.get(key);
  if (hit) return hit;
  const base = lineProfile(track, cls), N = track.n, kap = computeRacingLine(track).kappa, v = new Float32Array(N);
  const cap = cls.vTop * 1.05 - 1e-3, wetFloor = Math.sqrt(gs);
  for (let i = 0; i < N; i++) {
    if (base.corner[i] >= cap && gs === 1) { v[i] = cls.vTop * FLAT; continue; }
    // grip-limited corner speed scales with the driver; the steering-lock limit does not (cars cannot steer tighter)
    let kk = 0;
    for (let q = -3; q <= 3; q++) kk = Math.max(kk, Math.abs(kap[(i + q + N) % N]));
    const vGrip = cornerSpeed(cls, kk, (track.squeeze[i] ? PLAN_GRIP_SQUEEZE : PLAN_GRIP) * gs);
    if (gs < 1 && base.corner[i] >= cap && vGrip >= cap) { v[i] = cls.vTop * FLAT; continue; }
    const vLock = 28 * Math.sqrt(Math.max(0.04, (1.0 * cls.steer) / Math.max(kk, 1e-4) - 1));
    const vPhys = cornerSpeed(cls, kk, PHYS_GRIP * gs); // tyre limit on this tyre: no driver goes past it
    // the factor bites hardest in slow corners and fades in fast ones (a slow driver still takes fast kinks nearly flat)
    const w = clamp(1.8 - 1.8 * base.corner[i] / cls.vTop, 0.1, 1.8), cFi = 1 + (cF - 1) * w;
    v[i] = Math.min(cls.vTop * FLAT, vGrip * cFi, Math.max(Math.min(vLock, vPhys), base.corner[i] * (gs < 1 ? wetFloor * 0.92 : 1)));
  }
  // braking envelope: the plan's backward pass with the driver's deceleration (bF^2: the old v * skill scaling), capped by
  // what the tyres and anti-lock physically give on this tyre (a faster driver cannot brake beyond the car)
  for (let it = 0; it < 2 * N; it++) {
    const i = (N - 1 - (it % N)), j = (i + 1) % N, vj = v[j];
    const g = (track.squeeze[j] ? PLAN_GRIP_SQUEEZE : PLAN_GRIP) * gs, vp = vj / bF;
    const latLim = lateralAccelLimit(cls, vp, g), latFrac = clamp(vp * vp * Math.abs(kap[j]) / Math.max(latLim, 1), 0, 1);
    const ellipse = Math.max(ELLIPSE_FLOOR, Math.sqrt(1 - latFrac * latFrac));
    const abPlan = Math.min(brakeCapacity(cls, vp, g) * BRAKE_PLAN, longGripLimit(cls, vp, g) * 0.9 * ellipse) * bF * bF;
    const latP = clamp(vj * vj * Math.abs(kap[j]) / Math.max(lateralAccelLimit(cls, vj, PHYS_GRIP * gs), 1), 0, 1);
    const abPhys = Math.min(brakeCapacity(cls, vj, gs) * 0.88, longGripLimit(cls, vj, PHYS_GRIP * gs) * 0.9 * Math.max(ELLIPSE_FLOOR, Math.sqrt(1 - latP * latP)));
    const lim = Math.sqrt(vj * vj + 2 * Math.min(abPlan, abPhys) * track.ds);
    if (lim < v[i]) v[i] = lim;
  }
  if (drvCache.size > 600) drvCache.clear();
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
function neighbours(car, race, out, laneW = CAR_WID + 0.4) {
  const L = race.track.length;
  out.ahead = null; out.behind = null; out.aGap = 99; out.bGap = 99; out.beside = null; out.stopped = null; out.sGap = 99; out.lane = null; out.lGap = 99;
  let bs = 99;
  const cars = race.cars;
  for (let i = 0; i < cars.length; i++) {
    const o = cars[i];
    if (o === car || o.pit.stage) continue;
    const g = wrapDelta(o.s - car.s, L);
    const dd = Math.abs(o.d - car.d);
    if (g > 0 && g < out.aGap && g < 40) { out.aGap = g; out.ahead = o; } // includes a car alongside but ahead (a pass in progress)
    if (g > 0 && g < out.lGap && g < 60 && dd < laneW) { out.lGap = g; out.lane = o; } // nearest car ahead in this lane (the one to follow)
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
  const track = race.track, prof = o.ai?.prof || o.pace?.prof || race.profiles[o.cls.id];
  if (o.v < 4) return o.v;
  // accelerating out of a corner it will be quicker in a moment (a follower capped at its current speed falls behind every exit)
  const g = o.ai?.prof && o.ai.prof !== o.pace?.prof ? 1 : Math.min(1, Math.sqrt(Math.max(0.25, o.grip || 1))); // a wet plan already holds the grip
  return Math.min(o.v + Math.min(3, Math.max(0, o.longAcc || 0) * 0.5), profileAt(track, prof, o.s + o.v * 0.35) * g);
}
const nb = { ahead: null, behind: null, aGap: 99, bGap: 99, beside: null, stopped: null, sGap: 99, lane: null, lGap: 99 };

// ---- starts ---------------------------------------------------------------------------------------------------------
/** Reaction time after lights out (s), uniform in [lo, hi], and the chance of a poor getaway (wheelspin, bog-down). */
export const REACTION = {
  easy: { lo: 0.25, hi: 0.55, poor: 0.12 },
  normal: { lo: 0.20, hi: 0.40, poor: 0.07 },
  hard: { lo: 0.15, hi: 0.30, poor: 0.04 },
};

// ---- corners ahead --------------------------------------------------------------------------------------------------
const cornerOut = { dist: 0, dir: 1, side: 1, vApex: 0 };
/**
 * The next corner from s: distance to its apex, its direction (+1 = left = +d is the inside) and the side a pass should be
 * made on: the inside, or the outside when the following corner comes quickly and turns the other way (the outside of
 * this one is the inside of that one).
 */
function nextCorner(track, cls, s, out = cornerOut) {
  const ap = apexIndex(track, cls), N = track.n, L = track.length, i0 = track._idx(s)[0];
  const a1 = ap[i0];
  if (a1 < 0) { out.dist = 1e9; out.dir = 1; out.side = 1; out.vApex = cls.vTop; return out; }
  out.dist = (((a1 * track.ds - s) % L) + L) % L;
  out.dir = sgn(track.kappaS[a1]);
  out.vApex = lineProfile(track, cls).v[a1];
  const a2 = ap[(a1 + 3) % N];
  const d2 = (((a2 * track.ds - a1 * track.ds) % L) + L) % L;
  out.side = a2 >= 0 && d2 < 110 && sgn(track.kappaS[a2]) !== out.dir && Math.abs(track.kappaS[a2]) > 0.006 ? -out.dir : out.dir;
  return out;
}
const chicaneCache = new Map();
/** 1 where corners of both directions sit within 60 m: a chicane (a wet-weather margin applies there). */
function chicanes(track) {
  if (chicaneCache.has(track)) return chicaneCache.get(track);
  const N = track.n, w = Math.max(1, Math.round(60 / track.ds)), out = new Uint8Array(N), k = track.kappaS;
  for (let i = 0; i < N; i++) {
    let l = false, r = false;
    for (let q = -w; q <= w; q++) { const x = k[(i + q + N) % N]; if (x > 0.004) l = true; else if (x < -0.004) r = true; }
    out[i] = l && r ? 1 : 0;
  }
  chicaneCache.set(track, out);
  return out;
}
/** Probability that a per-second event with `rate` (1/s) happens within `dt` seconds (frame-rate independent). */
export const perSecond = (rate, dt) => 1 - Math.exp(-rate * dt);
const ROLL_DT = 0.5; // racecraft decisions (defend) are rolled on a fixed 0.5 s clock, never per frame
/**
 * Keep a lateral target from crossing a car alongside: any car overlapping lengthwise within `win` metres (centre to
 * centre) keeps at least a car's width plus margin (2.7 m between centres) on its side.
 */
function guardSides(car, race, targetD, win) {
  const L = race.track.length;
  for (const o of race.cars) {
    if (o === car || o.pit.stage || o.finished) continue;
    const g = wrapDelta(o.s - car.s, L);
    if (Math.abs(g) > win) continue;
    const dd = o.d - car.d;
    if (Math.abs(dd) < 1.0 || Math.abs(dd) > 5.5) continue; // directly ahead/behind: the follow logic; far: no conflict
    const edge = o.d - sgn(dd) * (CAR_WID + 0.6);
    if (dd > 0 ? targetD > edge : targetD < edge) targetD = dd > 0 ? Math.min(targetD, Math.max(edge, car.d - 0.2)) : Math.max(targetD, Math.min(edge, car.d + 0.2));
  }
  return targetD;
}
const _gq = { tire: 'dry', wear: 0, wetness: 0, surface: 'asphalt' };

/**
 * Full AI controller: racing line + wander, starts (reaction, launch, first-corner caution), traffic following,
 * pass planning (side from the next corner, commit only when the overlap comes before turn-in, out-braking on the
 * inside, back out without half a car of overlap), side-by-side lanes, one-move defence, wet pace from actual grip,
 * occasional mistakes, and recovery (catch a slide or shove, rejoin safely, no instant retaliation).
 */
export function driveAI(car, race, dt, tmp) {
  const track = race.track, cls = car.cls, inp = car.input, diff = race.diff, ai = car.ai;
  const agg = diff.aggression ?? 0.65;
  car.noiseT += dt;
  ai.t -= dt; ai.hitT = Math.max(0, (ai.hitT || 0) - dt); ai.defCool = Math.max(0, (ai.defCool || 0) - dt);
  const open = !track.squeeze[car.idx];

  // ---- start: reaction time and launch (race only; nothing moves before the go event, which starts race.time) ----
  if (!race.solo && ai.reaction == null) {
    const R = REACTION[diff.id] || REACTION.normal;
    ai.reaction = R.lo + race.rng() * (R.hi - R.lo);
    ai.launch = race.rng() < R.poor ? 0.45 + 0.25 * race.rng() : 1; // throttle a poor getaway can use at first
    ai.gridD = car.d;
  }
  if (!race.solo && car.laps === 0 && car.progress < 0 && race.time < ai.reaction) {
    inp.throttle = 0; inp.brake = 1; inp.steer = 0; inp.boost = false; ai.thr = 0;
    return;
  }

  const wasRecovering = ai.recoverT > 0;
  if (recover(car, race, dt, tmp, open)) { ai.rejoinT = 3; ai.catchT = 0; ai.prevD = car.d; ai.prevT = race.time; ai.prevTh = car.theta; return; }
  if (wasRecovering) ai.rejoinT = Math.max(ai.rejoinT || 0, 3);

  // ---- wet / worn-tyre pace: the driver's plan rebuilt for the grip the tyres actually have ----
  let prof = car.pace.prof, g;
  if (race.wetness > 0.03) {
    _gq.tire = car.tire; _gq.wear = car.wear; _gq.wetness = race.wetness;
    const margin = race.wetness * (0.06 - 0.035 * agg) * (1.3 - 0.6 * (ai.consistency ?? 0.5)); // a difficulty- and driver-scaled safety margin
    const gs = Math.min(1, Math.round(gripFactor(_gq) * (1 - margin) * 50) / 50);
    if (gs < 1) prof = driverProfile(track, cls, car.pace.corner, car.pace.brake, gs);
    g = 1;
  } else g = Math.min(1, Math.sqrt(Math.max(0.25, car.grip || 1)));
  ai.prof = prof;
  const wet = clamp((race.wetness - 0.05) / 0.45, 0, 1);

  // ---- shove / slide detection: the car moves where its nose points, so a lateral jump is a push from another car ----
  const road = track.thetaAt(car.s);
  const head = wrapAngle(car.theta - road);
  if (ai.prevD != null && car.v > 6 && dt > 0 && ai.prevT != null && race.time - ai.prevT < dt * 1.5) { // consecutive steps only (not after a pit stop)
    const lat = (car.d - ai.prevD) / dt - car.v * Math.sin(head);
    if (Math.abs(lat) > 6) ai.hitT = 2;                                   // a real hit, not a brush: no attack for 2 s
    if (Math.abs(lat) > 9) ai.catchT = Math.max(ai.catchT || 0, 0.5);    // a big shove: gather it up
    // yaw the car's own steering did not make (a slide: wet half-spin, a spin-inducing hit)
    const yawJump = Math.abs(wrapAngle(car.theta - ai.prevTh) - (car.yawRate || 0) * dt);
    if (yawJump > 0.08) ai.catchT = Math.max(ai.catchT || 0, 0.5);
  }
  ai.prevD = car.d; ai.prevT = race.time; ai.prevTh = car.theta;
  const lineSlope = (track.lineAt(car.s + 6) - track.lineAt(car.s - 6)) / 12;
  const yawErr = wrapAngle(head - Math.atan(lineSlope));
  if (Math.abs(yawErr) > 0.5 && car.v > 12 && !car.finished) ai.catchT = Math.max(ai.catchT || 0, 0.3); // pointing well off the road's line
  if (car.surface === 'grass' || car.surface === 'gravel') ai.rejoinT = Math.max(ai.rejoinT || 0, 1.2);
  const offTrack = car.surface === 'grass' || car.surface === 'gravel';

  const wander = Math.sin(car.noiseT * 0.35 + car.noisePhase) * 1.2 + Math.sin(car.noiseT * 0.9 + car.noisePhase * 2) * 0.5;
  // dynamic look-ahead: long on straights, short in tight corners so the pursuit point does not cut the corner
  const kNear = Math.max(Math.abs(track.lineKappaAt(car.s + 4)), Math.abs(track.lineKappaAt(car.s + 4 + car.v * 0.35)));
  const look = clamp(4.5 + 0.3 * car.v - 1500 * Math.max(0, kNear - 0.004), 4.5, 32);
  const hw = track.halfAt(car.s + look);
  const kLook = Math.abs(track.kappaS[track._idx(car.s + look * 2.5)[0]]);
  const straight = kLook < 0.003;
  const spread = (open ? 1 : 0.25) * (1 - 0.6 * wet); // squeeze / wet: stay near the line (off the wet kerbs and paint)
  // personal offsets (bias + wander) fade in corners: the line itself is the apex/clearance solution there
  const slack = 1 - clamp((kNear - 0.002) / 0.006, 0, 0.7);
  const lineD = track.lineAt(car.s + look);
  let targetD = lineD + (car.lineBias + wander * car.wander) * spread * slack;
  const early = !race.solo && car.laps === 0 && race.time < 60 && (ai.apexCount || 0) <= 2; // first two corners (counted below)
  neighbours(car, race, nb, early ? CAR_WID + 1.0 : CAR_WID + 0.4); // early: a car half in this lane counts as the one to follow
  const { ahead, behind, beside } = nb;
  const cn = nextCorner(track, cls, car.s + 10);
  // per-corner bookkeeping (the corner a car is heading into, 40 m on): first-lap caution counts corners from the grid
  const apex = apexIndex(track, cls)[track._idx(car.s + 40)[0]];
  if (apex !== ai.varApex) {
    ai.varApex = apex; ai.apexCount = (ai.apexCount || 0) + 1;
    ai.varU = car.pace.variation ? race.rng() * 2 - 1 : 0; // per-corner, per-lap pace variation (fresh draw per corner)
  }
  if (car.laps !== ai.formLap) { ai.formLap = car.laps; ai.form = car.pace.variation ? race.rng() * 2 - 1 : 0; }
  const startPhase = !race.solo && car.laps === 0 && race.time < 60;
  const firstCorners = startPhase && ai.apexCount <= 2; // first two corners: wider gaps, earlier braking (less with aggression)
  const launchPhase = startPhase && ai.apexCount <= 1;   // grid to the first braking zone: hold the grid lane
  const caution = firstCorners ? 1 - 0.5 * agg : 0;

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
  let lead = 0.25 + 0.06 * caution + 0.05 * wet;
  if (nb.lane && nb.lGap < 20 && (cornerZone > 0.3 || !open)) lead += 0.06; // walled: always brake early behind a car
  // pass on the exit: a pass given up in a corner is retried once the road straightens (the timer holds through walled stretches)
  if (open) ai.exitAttackT -= dt;
  const calm = ai.hitT > 0 || (ai.rejoinT || 0) > 0 || (ai.catchT || 0) > 0 || launchPhase; // just hit / rejoining / catching it / launching: no new attack
  const exitAttack = !calm && ai.exitAttackT > 0 && kNear < 0.004 && ahead && nb.aGap < 18;
  const passOk = open && kNear < 0.006 && cornerZone < 0.3; // no dive at the apex: passes start on the approach / straight only

  // ---- attack: plan the pass from the next corner; commit only when the overlap comes before turn-in ----
  if (calm && ai.mode === 'pass' && !(beside && beside === ahead)) ai.mode = 'free';
  if (!calm && !obstacle && ahead && !ahead.finished && nb.aGap < 28 && Math.abs(ahead.d - car.d) < 4.5 && car.progress > 0) {
    if (ai.t <= 0 && ai.mode !== 'pass') {
      ai.t = 0.8;
      const room = hw - 2;
      const free = (sd) => (sd > 0 ? room - ahead.d : room + ahead.d); // free lateral space on side sd of the car ahead
      ai.side = cn.side;                                                // inside for the braking zone (or the outside before a switchback)
      if (free(ai.side) < 2.8 && free(-ai.side) >= 2.8) ai.side = -ai.side;
      if (Math.abs(ahead.d - car.d) > 1.2) ai.side = sgn(car.d - ahead.d); // already beside one side
      ai.fight = race.rng() < 0.25 + 0.75 * agg;
    }
    if (exitAttack) ai.fight = true;
    if (ai.fight) {
      attacking = true;
      // can the nose reach the car ahead's mid-point before the braking point (later on the inside: the out-brake margin)?
      const tow = (car.slip > 0.2 ? 1.5 : 0) + (car.boost > 0.3 && straight ? 3 : 0);
      const dv = car.v - ahead.v + tow;
      const need = Math.max(0, nb.aGap - CAR_LEN * 0.5);
      const vA = cn.vApex * (car.pace.corner / LIMIT_FACTOR);
      const brakeDist = Math.max(0, (car.v * car.v - vA * vA) / (2 * 13));
      const brakeAt = cn.dist - brakeDist + (ai.side === cn.dir ? 8 + 14 * agg : 0);
      const reach = dv > 0.3 ? (need / dv) * car.v : Infinity;
      const commit = reach < brakeAt || (nb.aGap < CAR_LEN + 1.5 && dv > 0) || exitAttack;
      if (nb.aGap > 12 || !passOk || !commit) {
        if (straight) targetD = ahead.d;                                  // sit in the tow and set up the exit
        if (!commit && cornerZone > 0.3) ai.exitAttackT = 2.5;
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
  let backOut = false;
  const lineTarget = () => lineD + (car.lineBias + wander * car.wander) * spread * slack;
  if (ai.mode === 'pass' && wallGate && nb.aGap > 3) { ai.mode = 'free'; passing = false; ai.exitAttackT = 4; targetD = lineTarget(); }
  // at turn-in without half a car of overlap: back out (lift and tuck in behind), retry on the exit
  if (ai.mode === 'pass' && cornerZone > 0.5 && nb.aGap > CAR_LEN * 0.5) { ai.mode = 'free'; passing = false; backOut = true; ai.exitAttackT = 2.5; targetD = lineTarget(); }

  // ---- defend: one move toward the inside of the next corner, made before the attacker has overlap, then hold ----
  ai.defTick = (ai.defTick || 0) + dt;
  const roll = ai.defTick >= ROLL_DT;
  if (roll) ai.defTick -= ROLL_DT;
  if (ai.defD != null) {
    // hold the move until the corner (then the corner fade takes over), or the attacker drops back / someone gets alongside
    const gone = !behind || behind !== ai.defFor || nb.bGap > 24;
    if (gone || cornerZone > 0.5 || !open || (beside && sgn(beside.d - car.d) === sgn(ai.defD - car.d) && Math.abs(ai.defD - car.d) > 0.5)) { ai.defD = null; ai.defFor = null; ai.defCool = 5; }
  } else if (roll && !calm && !obstacle && open && behind && !behind.finished && !beside && !passing && nb.bGap > CAR_LEN + 0.5 && nb.bGap < 16
    && Math.abs(behind.d - car.d) < 3.2 && cornerZone < 0.3 && ai.defCool <= 0 && cn.dist < 260 && car.progress > 0) {
    if (race.rng() < perSecond(0.15 + 0.55 * agg, ROLL_DT)) {
      const limD = hw - 2.2;
      ai.defD = clamp(car.d + cn.dir * 2.6, -limD, limD); // toward the inside of the corner ahead (covers the dive)
      ai.defFor = behind; ai.defends = (ai.defends || 0) + 1;
    }
  }
  ai.defending = ai.defD != null;
  if (ai.defending) targetD = ai.defD;

  // ---- plain traffic avoidance (when not deliberately racing alongside) ----
  let want = 0;
  if (!passing && !ai.defending && !launchPhase && ahead && nb.aGap < 22 && Math.abs(ahead.d - car.d) < 2.8 && !(attacking && straight)) {
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
    const wetM = race.wetness > 0.3;
    ai.mistake = !big ? (r < 0.5 ? { type: 'late', t: 0.9, big } : { type: 'apex', t: 1.6, big })
      : wetM && r < 0.3 ? { type: 'spin', t: 1.4, big } : r < 0.55 ? { type: 'lock', t: 0.9, big } : { type: 'wide', t: 2.2, big };
    ai.mistake.out = -sgn(track.kappaS[track._idx(car.s + 40)[0]]);
  }
  // launch: hold the grid lane until the run to the first braking zone ends (then merge onto the line)
  if (launchPhase && ai.gridD != null && !obstacle) {
    const hold = clamp(1 - 2 * cornerZone, 0, 1); // until the braking zone begins
    targetD = targetD + (clamp(ai.gridD, -(hw - 2.2), hw - 2.2) - targetD) * hold;
  }
  targetD = lineD + (targetD - lineD) * (1 - 0.85 * cornerZone * (ai.defending ? 0.5 : 1));
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
  const lim = Math.max(hw - (open ? 2.0 : 2.4) - 0.012 * car.v - 0.5 * wet, 1.2); // keep clear of the edge: more at speed and in the wet
  const limM = mType === 'wide' && open ? Math.max(lim, hw - 0.8) : lim; // a big run-wide mistake reaches the kerb / grass edge
  targetD = obstacle ? clamp(stopped.d + ai.side * 3.2, -(hw - 1.6), hw - 1.6) : clamp(targetD, -limM, limM); // the only place allowed to use hw - 1.6
  // side by side (or a lane change at the start into a gap shorter than 1.5 car lengths): never squeeze a car alongside;
  // each keeps its lane and leaves a car's width
  const holdLane = !!beside && cornerZone > 0.3;
  if (open && !obstacle) targetD = guardSides(car, race, targetD, firstCorners ? CAR_LEN * 1.8 : CAR_LEN + 1);
  // a slow car (spun, damaged, recovering) with someone close behind leaves the line toward the outside of the next corner
  const vPlan = profileAt(track, prof, car.s);
  // (slow on its own: not just queueing behind a car ahead; it clears once back up to speed, or after 4 s)
  if (car.v < 0.6 * vPlan && car.progress > 30 && !(nb.lane && nb.lGap < 30)) ai.slowT += dt; else ai.slowT = Math.max(0, ai.slowT - 2 * dt);
  if (ai.slowT > 0.7 && behind && nb.bGap < 15 && !ai.slowOut) { ai.slowOut = -sgn(track.lineKappaAt(car.s + 30)); ai.slowOutT = 4; }
  if (ai.slowOut && (car.v > 0.85 * vPlan || (ai.slowOutT -= dt) <= 0)) ai.slowOut = 0;
  if (ai.slowOut) targetD = clamp(targetD + ai.slowOut * (open ? 3 : 2), -lim, lim);
  // safe rejoin (off the asphalt, or after a spin): come back parallel at the edge on the side the car is on, and move
  // across to the line only when nobody is coming within 40 m behind in the lane it would cross into, at a shallow angle
  let rejoining = false;
  if ((ai.rejoinT || 0) > 0 && !obstacle) {
    rejoining = true;
    const edgeD = clamp(car.d, -(hw - 1.8), hw - 1.8);
    const lo = Math.min(car.d, targetD) - 2.5, hi = Math.max(car.d, targetD) + 2.5;
    let traffic = false;
    for (const o of race.cars) {
      if (o === car || o.pit.stage || o.finished) continue;
      const gB = -wrapDelta(o.s - car.s, track.length);
      if (gB > -CAR_LEN && gB < 40 && o.d > lo && o.d < hi && o.v > car.v - 3) { traffic = true; break; }
    }
    if (traffic || offTrack) { targetD = traffic ? edgeD : clamp(targetD, -(hw - 1.8), hw - 1.8); ai.rejoinT = Math.max(ai.rejoinT, traffic ? 0.4 : 0); }
    // shallow merge across the road (at most ~0.22 rad); off the asphalt, back to its edge at up to ~0.7 rad
    const maxStep = Math.tan(offTrack && Math.abs(car.d) > hw ? 0.7 : 0.22) * look;
    targetD = car.d + clamp(targetD - car.d, -maxStep, maxStep);
    if (!offTrack) ai.rejoinT -= dt;
  }
  // wet half-spin on the exit (AI only): the rear steps out for 0.4 s, the car loses speed and gathers it up
  if (mType === 'spin' && ai.mistake.t > 1.0) { car.theta += ai.mistake.out * 0.9 * dt; car.v *= 1 - 0.5 * dt; }
  // a change of offset from the racing line is made at a bounded angle (~0.25 rad over the look-ahead): a car pushed
  // wide or squeezed in a corner drifts back to its line instead of lunging at full lock and spinning off the far side
  if (!obstacle && car.v > 15) {
    const lc = track.lineAt(car.s), step = Math.tan(0.25) * look;
    targetD = lineD + clamp((targetD - lineD) - (car.d - lc), -step, step) + (car.d - lc);
  }
  ai.td = targetD; // final lateral target this step (read by the harness / diagnostics)
  // catch phase: after a shove or a slide, steer back onto a gentle path (a shallow drift toward the target, with a longer
  // look so the correction is not a snap) and lift, instead of chasing the line at full throttle
  let catching = false, raw;
  if ((ai.catchT || 0) > 0 && !obstacle && !car.finished) {
    catching = true;
    const lk = Math.max(look, 10 + 0.35 * car.v), step = Math.tan(0.12) * lk;
    raw = steerRaw(track, car, cls, car.d + clamp(targetD - car.d, -step, step), lk, tmp);
    ai.catchT -= dt;
    if (ai.catchT <= 0 && Math.abs(yawErr) > 0.2 && (ai.catchAll = (ai.catchAll || 0) + dt) < 1.5) ai.catchT = dt; // until gathered up
    if (ai.catchT <= 0) ai.catchAll = 0;
  } else raw = steerRaw(track, car, cls, targetD, look, tmp);
  inp.steer = clamp(raw, -1, 1);
  const saturated = clamp((Math.abs(raw) - 0.85) / 0.6, 0, 1); // the line needs more steering than the tyres/lock give: slow down
  let vt = profileAt(track, prof, car.s + car.v * lead) * g * (1 + car.pace.variation * (0.67 * (ai.varU || 0) + 0.33 * (ai.form || 0)));
  vt *= 1 - 0.12 * saturated;
  vt *= 1 - 0.4 * clamp((Math.abs(car.d - track.lineAt(car.s)) - 1.5) / 6, 0, 1) * clamp((kNear - 0.002) / 0.004, 0, 1); // off the line in a corner: the line's speed is not available
  if (wet > 0 && chicanes(track)[track._idx(car.s + car.v * lead)[0]]) vt *= 1 - 0.07 * wet; // wet chicanes: kerbs and direction changes
  if (car.surface === 'grass' || car.surface === 'gravel') vt = Math.min(vt, 28);
  // out-braking: a committed attacker on the inside brakes later (skill- and aggression-scaled)
  if (passing && nb.aGap < 14 && kNear < 0.004) vt *= ai.side === cn.dir ? 1 + (0.02 + 0.03 * agg) * clamp(car.pace.corner / LIMIT_FACTOR, 0.7, 1) : 1.02;
  if (backOut) vt *= 0.96; // lift and tuck in
  if (mType === 'late') vt *= ai.mistake.big ? 1.1 : 1.05;
  else if (mType === 'apex') vt *= 0.97;
  else if (mType === 'spin' && kNear < 0.006 && ai.mistake.t < 1.0) vt *= 0.7;
  // side by side through a corner: the corner speed comes from the curvature of the lane the car is actually in (inside =
  // tighter and slower, outside = longer but faster), not from the racing line
  if (holdLane && open) {
    let kc = 0, kl = 0;
    for (let a = 0; a <= 30; a += 6) { kc = Math.max(kc, Math.abs(track.kappaS[track._idx(car.s + a)[0]])); kl = Math.max(kl, Math.abs(track.lineKappaAt(car.s + a))); }
    const kcs = track.kappaS[track._idx(car.s + 10)[0]];
    const kLane = kc / Math.max(0.5, 1 - sgn(kcs) * kc * car.d);
    if (kLane > kl && kLane > 0.002) vt *= clamp(Math.sqrt(kl / kLane), 0.8, 1);
  }
  if (firstCorners && cornerZone > 0.3) vt *= 1 - 0.015 * caution;
  if (catching && car.v > 15) vt = Math.min(vt, car.v - 0.5);
  // don't ram the car in front when stuck behind it in the same lane
  if (obstacle) {
    if (Math.abs(car.d - stopped.d) < 2.4) vt = Math.min(vt, Math.max(5, (sGap - 7) * 1.2)); // still in its lane: creep up while moving across (no follow floor)
    else vt = Math.min(vt, 14);                                                              // laterally clear: go by at a safe speed
  } else if (nb.lane && !(passing && nb.lane === ahead) && nb.lGap < 60) {
    // time-gap follow: hold a gap to the car ahead in this lane (not just the nearest car ahead, which may be in the other
    // lane), using where it is about to be (its own plan just ahead of it: it brakes for the corner, so does the follower;
    // accelerating out, it will be quicker) and the closing speed
    const fa = nb.lane;
    const vL = followSpeed(race, fa);
    const bump = nb.lGap - CAR_LEN;
    // gap held nose to tail: 0.11-0.13 s through braking zones and corners (shorter with aggression; 1.4x walled) and 0.12 s
    // on a straight, measured in metres at the car's own speed so it shrinks in slow corners; an attacker in the tow on a
    // straight closes right up (0.08 s) to pull out and pass. Wider through the first two corners and in the wet.
    const tCorner = (0.14 - 0.03 * agg) * (open ? 1 : 1.4);
    const tGap = (open && cornerZone < 0.3 ? (attacking && straight ? 0.08 : 0.12) : tCorner) * (1 + 0.3 * caution + 0.5 * wet);
    const wantGap = 1.5 + car.v * tGap;
    // speed that lets the follower match vL by the time the bumper gap has shrunk to `wantGap` (at a firm 0.6 g)
    const room = Math.max(0, bump - wantGap), vStop = Math.sqrt(vL * vL + 2 * 6 * room);
    const vFol = Math.min(vStop, vL + clamp((bump - wantGap) * 0.8, -2, 8));
    vt = Math.min(vt, bump > 0.6 * wantGap ? Math.max(vFol, vt * 0.6) : vFol); // never crawl in a queue, unless right on its bumper
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
  if (inp.brake === 0 && vt - car.v > 0.3 && Math.abs(raw) < 0.8 && !car.finished && !catching) {
    const p0 = profileAt(track, prof, car.s) - 0.5;
    let rising = true;
    for (let a = 15; a <= 15 + car.v * 1.5 && rising; a += 15) if (profileAt(track, prof, car.s + a) < p0) rising = false;
    if (rising) inp.throttle = 1;
  }
  // launch quality: a poor getaway bogs down (less throttle for the first 2.5 s after reacting)
  if (!race.solo && ai.launch != null && ai.launch < 1 && race.time < ai.reaction + 2.5) inp.throttle = Math.min(inp.throttle, ai.launch + (1 - ai.launch) * (race.time - ai.reaction) / 2.5);
  // exit: throttle comes back at a driver-specific rate (an exit factor of 1 is effectively instant)
  if (inp.throttle > (ai.thr ?? 0)) inp.throttle = Math.min(inp.throttle, (ai.thr ?? 0) + dt * (2.5 + 12 * car.pace.exit));
  if (catching && car.v > 15) inp.throttle = Math.min(inp.throttle, 0.25);
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
  ai.forceLock = !!lockMs && braking && (lockMs.bit || lockMs.wait >= 15) && !catching;
  if (ai.forceLock) inp.brake = 1;
  const tow = ahead && nb.aGap < 25 && straight;
  inp.boost = (car.boost > (tow ? 0.15 : 0.55)) && kLook < 0.0025 && car.v > 40 && !car.finished && !catching && !rejoining;
}

export { gripFactor };
