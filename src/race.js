// Race simulation: cars, physics step, AI/pit control, laps, weather, results. No rendering.
import {
  CLASSES, SURFACE, clamp, lerp, smoothstep, wrapAngle, wrapDelta, createLapState, advanceLap,
  gripFactor, tireWearRate, steerState, steerCurvature, slipstreamRate, updateBoost,
  brakeCapacity, longGripLimit, brakePressure,
} from './physics.js';
import { DIFFICULTY } from './progress.js';
import { createTimer, updateTimer, createGhostRecorder, recordGhost, resetGhost, finishGhost, currentLapTime } from './timing.js';

import { carPose } from './pose.js';
import { steeringFilter, rotationTarget, rotationStep } from './feel.js';
import { TEAMS } from './teams.js';
import { speedProfile, driveAI, steerTo, speedControl } from './ai.js';
import * as THREE from 'three';

const tmp = new THREE.Vector3();
const G = 9.81;
// reused call arguments/results for the per-step hot path; each is read before the next write
const _st = { k: 0, excess: 0 };
const _gripQ = { tire: 'dry', wear: 0, wetness: 0, surface: 'asphalt' };
const _boostQ = { fill: 0, boosting: false, dt: 0 };

/** Small deterministic PRNG (mulberry32) for reproducible races: `new Race(track, { rng: seededRandom(42) })`. */
export function seededRandom(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}


/**
 * Should this car start a pit stop this frame?
 * - pit.request (player P / AI) still engages in the broad approach zone.
 * - Accidental drive-ins need a narrow mouth gate: on pit asphalt near the pit
 *   driving line, heading along the lane — not just wide on asphalt/kerb/grass.
 */
export function shouldEnterPit(track, car) {
  if (car.pit.stage) return false;
  const T = track;
  const u = wrapDelta(car.s, T.length);
  const PIT = T.pit;
  const inApproach = u > PIT.entry - 40 && u < PIT.laneStart + 20;
  if (!inApproach) return false;
  if (car.pit.request) return true;
  if (!car.isPlayer || !(car.progress > 0)) return false;
  return crossesPitEntryGate(T, car, u);
}

/** Narrow pit-mouth gate used for unsolicited player entry. */
export function crossesPitEntryGate(T, car, u = wrapDelta(car.s, T.length)) {
  const PIT = T.pit;
  // Mouth only (entry → just past laneStart). Pre-entry runoff no longer counts.
  if (u < PIT.entry || u > PIT.laneStart + 8) return false;
  const i = car.idx;
  const lane = T.laneD(i);
  // Past the white pit boundary and into the lane strip (laneD = half + 4.5).
  if (car.d < lane - 0.8) return false;
  if (T.surfaceAt(i, car.d) !== 'pit') return false;
  // Mostly heading along the pit / track tangent (~35°).
  if (Math.abs(wrapAngle(car.theta - T.thetaAt(car.s))) > 0.6) return false;
  return true;
}

export class Race {
  /**
   * opts: { mode:'race'|'tt', difficulty:'easy'|'normal'|'hard', cls:'gp'|'speedway', laps:3-5,
   *         weather:'dry'|'auto'|'rain', rainAt?:seconds, playerSlot, best?:timer seed, rng?:() => [0,1),
   *         playerTeam?: team (replaces the player's entry), driver?: {name, number},
   *         grid?: [{ id, isPlayer, team, teamIndex, driver, skill, cls? }] (career; pole first) }
   * Time trial ('tt') is solo with unlimited laps (the player ends the session).
   * All sim randomness (grid shuffle, driver skill/line/wander, start hold, rain timing, AI fight/defend/mistake rolls)
   * goes through `this.rng`, captured once here: Math.random in the game, a seeded generator (seededRandom) in tests.
   */
  constructor(track, opts = {}) {
    this.track = track;
    this.opts = opts;
    this.rng = typeof opts.rng === 'function' ? opts.rng : Math.random;
    this.cls = CLASSES[opts.cls] || CLASSES.gp;
    this.mode = opts.mode === 'tt' ? 'tt' : 'race';
    this.solo = this.mode === 'tt';
    this.diff = DIFFICULTY[opts.difficulty] || DIFFICULTY.normal;
    this.laps = this.solo ? Infinity : clamp(opts.laps || 3, 1, 9);
    this.phase = 'countdown'; // countdown | racing | done
    this.timer = this.solo ? 1.6 : 0; this.time = 0; this.goHold = this.solo ? 0 : 0.2 + this.rng() * 1.0; // random 0.2-1.2 s hold after the 5th light
    this.lights = 0; this.goFlash = 0;
    this.rain = 0; this.rainTarget = 0; this.wetness = 0;
    this.rainAt = opts.weather === 'rain' ? 0.5 : (opts.weather === 'dry' || this.solo) ? Infinity
      : (opts.rainAt ?? (this.rng() < 0.8 ? this.laps * 42 * (0.3 + this.rng() * 0.3) : Infinity));
    this.rainAnnounced = false;
    this.events = []; // {type, car}
    this.profiles = { [this.cls.id]: speedProfile(track, this.cls) };
    this.cars = [];
    this.playerSlot = opts.playerSlot ?? (this.solo ? 0 : 6);
    if (Array.isArray(opts.grid)) {
      const i = opts.grid.findIndex((e) => e.isPlayer);
      if (i >= 0) this.playerSlot = i;
    }
    this._createCars();
    this.player = this.cars.find((c) => c.isPlayer);
    this.autopilot = false;
    this.lapTimer = createTimer(track.length, 3, opts.best || {});
    this.ghostRec = createGhostRecorder(10);
    this.order = this.cars.slice();
    this.rank();
  }

  _blankCar(slot, team, teamIndex, isPlayer, skill, extra = {}) {
    const T = this.track, L = T.length, rng = this.rng;
    const row = Math.floor(slot / 2), col = slot % 2;
    const s = L - 10 - row * 9 - col * 4.5;
    const d = col ? -3.2 : 3.2;
    const p = T.at(s, d);
    const th = T.thetaAt(s);
    const car = {
      id: slot, slot, team, teamIndex, isPlayer, cls: extra.cls || this.cls,
      driver: extra.driver || null, driverId: extra.driverId || null,
      x: p.x, z: p.z, y: p.y, theta: th, v: 0, steer: 0, s, d: 0, idx: T.locateGlobal(p.x, p.z).i,
      lap: createLapState(L, s), progress: -10, laps: 0, finished: false, finishTime: 0,
      tire: 'dry', wear: 0, wetness: 0, grip: 1, surface: 'asphalt', boost: 0, boosting: false, slip: 0,
      input: { steer: 0, throttle: 0, brake: 0, boost: false },
      skill, lineBias: (rng() - 0.5) * 3.2, wander: 0.4 + rng() * 0.8,
      noiseT: rng() * 50, noisePhase: rng() * 6.28, avoid: 0,
      lapStart: 0, lapTimes: [], bestLap: Infinity, hit: 0, pitStops: 0, brk: 0,
      lockup: 0, flat: 0, wheelSlip: 0, wheelspin: 0, longAcc: 0, latAcc: 0, signedLatAcc: 0, yawRate: 0, slipAngle: 0, prevSlipAngle: 0, slideRate: 0, latFrac: 0,
      ai: { forceLock: false, mode: 'free', side: 0, t: 0, mistake: null, mistakeIn: 8 + rng() * 30, defendT: 0, stuckT: 0, recoverT: 0, revT: 0, exitAttackT: 0, slowT: 0 },
      pit: { stage: 0, request: false, timer: 0, choice: null, d0: 0 },
      mesh: null,
    };
    car.d = T.locateGlobal(p.x, p.z).d;
    car.lap = createLapState(L, s);
    car.progress = car.lap.progress;
    this.cars.push(car);
    return car;
  }

  _createCars() {
    if (Array.isArray(this.opts.grid)) {
      this.opts.grid.forEach((entry, slot) => {
        if (this.solo && !entry.isPlayer) return;
        const skill = entry.isPlayer ? 0.985 : (entry.skill != null ? entry.skill : this.diff.skill);
        this._blankCar(slot, entry.team, entry.teamIndex, !!entry.isPlayer, skill, { cls: entry.cls, driver: entry.driver || null, driverId: entry.id || null });
      });
      return;
    }
    const Torder = TEAMS.map((_, i) => i), rng = this.rng;
    // player is team 0; shuffle the rest
    for (let i = Torder.length - 1; i > 1; i--) { const j = 1 + Math.floor(rng() * i); [Torder[i], Torder[j]] = [Torder[j], Torder[i]]; }
    const grid = Torder.slice(1); grid.splice(this.playerSlot, 0, 0);
    const playerTeam = this.opts.playerTeam;
    grid.forEach((ti, slot) => {
      if (this.solo && slot !== this.playerSlot) return;
      const isPlayer = slot === this.playerSlot;
      const skill = this.diff.skill + (rng() - 0.5) * 2 * this.diff.spread;
      const team = ti === 0 && playerTeam ? playerTeam : TEAMS[ti];
      this._blankCar(slot, team, ti, isPlayer, isPlayer ? 0.985 : skill, { driver: isPlayer ? this.opts.driver || null : null, driverId: isPlayer ? 'player' : null });
    });
  }

  // ---- public controls ----
  setRain(on) {
    this.rainTarget = on ? 1 : 0;
    this.rainAt = Infinity;
    if (on) { this.rain = 1; this.wetness = Math.max(this.wetness, 0.7); this.rainAnnounced = true; } // immediate, even during the countdown
  }
  requestPit(car = this.player, on = true) {
    if (car.pit.stage === 0 && car.progress < (this.laps - 0.9) * this.track.length) car.pit.request = on;
  }
  choosePitTire(tire, car = this.player) { car.pit.choice = tire; }

  // ---- main step ----
  step(dt) {
    if (this.phase === 'countdown') {
      // five red lights, one per second (t=0..4 s), then a random hold (0.2-1.2 s), then lights out = GO. Nobody moves before that.
      this.timer += dt;
      this.lights = Math.min(5, Math.floor(this.timer) + 1);
      if (this.timer >= 4 + this.goHold) { this.phase = 'racing'; this.lights = 0; this.goFlash = 1.6; this.events.push({ type: 'go' }); }
      else if (Math.floor(this.timer) !== Math.floor(this.timer - dt) && this.timer < 5) this.events.push({ type: 'light', n: this.lights });
      this._interpolatePoseOnly();
      this._weather(dt);
      return;
    }
    this.time += dt;
    this.goFlash = Math.max(0, this.goFlash - dt);
    this._weather(dt);
    const cars = this.cars;
    for (let n = 0; n < cars.length; n++) {
      const car = cars[n];
      if (car.pit.stage) this._pitControl(car, dt);
      else if (!(car.isPlayer && !this.autopilot && !car.finished)) { // otherwise: player input set externally
        driveAI(car, this, dt, tmp);
        this._aiPitDecision(car);
      }
      this._stepCar(car, dt);
    }
    this._interactions(dt);
    this.rank();
    this._timing();
    if (this.player.finished && this.phase !== 'done' && this.cars.every((c) => c.finished)) this.phase = 'done';
  }
  _interpolatePoseOnly() { /* cars are static on the grid */ }

  _timing() {
    const p = this.player, tm = this.lapTimer;
    for (const e of updateTimer(tm, p.progress, this.time)) {
      const out = { ...e, type: e.type === 'lap' ? 'laptime' : e.type === 'sector' ? 'sector' : 'startline', car: p };
      if (e.type === 'lap') {
        if (p.lapTimes.length) { p.lapTimes[p.lapTimes.length - 1] = e.time; p.bestLap = Math.min(...p.lapTimes); }
        if (e.isBest) out.ghost = finishGhost(this.ghostRec, e.time);
        resetGhost(this.ghostRec);
      } else if (e.type === 'start') resetGhost(this.ghostRec);
      this.events.push(out);
    }
    if (tm.g >= 0) recordGhost(this.ghostRec, currentLapTime(tm, this.time), p.x, p.z, p.theta);
  }

  _weather(dt) {
    if (this.time >= this.rainAt) { this.rainTarget = 1; this.rainAt = Infinity; }
    if (this.rainTarget > 0 && !this.rainAnnounced && this.rain > 0.05) { this.rainAnnounced = true; this.events.push({ type: 'rain' }); }
    this.rain += clamp(this.rainTarget - this.rain, -0.1 * dt, 0.12 * dt);
    const up = this.rain > this.wetness;
    this.wetness += clamp(this.rain - this.wetness, -0.012 * dt, (up ? 0.07 : 0.012) * dt);
  }

  _aiPitDecision(car) {
    if (car.isPlayer || car.pit.stage || car.pit.request || car.finished) return;
    if (car.progress > (this.laps - 1) * this.track.length || car.progress < 0) return;
    if (this.rain > 0.4 && this.rainHighTime === undefined) this.rainHighTime = this.time;
    const delay = ((car.id * 7) % 10) * 3;
    const wantWet = this.rainHighTime !== undefined && car.tire === 'dry' && this.time - this.rainHighTime > delay;
    const wantDry = this.rain < 0.05 && this.wetness < 0.12 && car.tire === 'wet';
    if (wantWet || wantDry || car.wear > 0.8) {
      car.pit.request = true;
      car.pit.aiChoice = this.rain > 0.3 || this.wetness > 0.3 ? 'wet' : 'dry';
    }
  }

  // Pit state machine; writes car.input. Returns true when it drives the car.
  _pitControl(car, dt) {
    const T = this.track, p = car.pit, inp = car.input;
    car.ai.forceLock = false; // driveAI (which owns this flag) is skipped while pitting: don't let a stale lock-up mistake disable anti-lock
    const u = wrapDelta(car.s, T.length), i = car.idx;
    const laneD = T.laneD(i), boxD = T.boxD(i), boxU = T.boxU(car.teamIndex);
    const dBox = boxU - u;
    let vt = 30, td = laneD;
    if (p.stage === 1) {
      p.ease = Math.min(1, (p.ease || 0) + dt);
      // Follow the opening of the lane: the aim stays inside the asphalt that exists at this metre, and the blend
      // runs the whole flare (entry → laneStart) so the path has no kink where the old 40 m mouth used to turn.
      const along = smoothstep(T.pit.entry, T.pit.laneStart, u);
      const open = 16 * (T.pitTaper[i] || 0);
      const laneAim = T.half[i] + Math.min(4.5, Math.max(0, open * 0.5));
      td = lerp(p.d0, laneAim, Math.min(1, along * 1.35));
      const dist = Math.max(0, T.pit.laneStart - u);
      vt = u < T.pit.laneStart ? Math.sqrt(T.pit.limit ** 2 + 2 * 14 * dist) : T.pit.limit;
      if (dBox < 56 && dBox > -2) {
        td = lerp(td, boxD, smoothstep(56, 14, dBox));
        vt = Math.min(vt, Math.sqrt(2 * 4 * Math.max(0, dBox - 0.7)));
      }
      if (dBox < 3 && car.v < 2.5) { p.stage = 2; p.timer = 0; if (!car.isPlayer) p.choice = p.aiChoice || 'dry'; }
      else if (u > boxU + 8 && car.v > 4) p.stage = 3; // missed the box: carry on
    } else if (p.stage === 2) {
      vt = 0; td = boxD; p.timer += dt;
      if (car.isPlayer && !p.choice && p.timer > 7) p.choice = this.wetness > 0.25 ? 'wet' : 'dry';
      if (p.choice) {
        p.serv = (p.serv || 0) + dt;
        if (p.serv > 2.4) { car.tire = p.choice; car.wear = 0; p.stage = 3; p.serv = 0; p.choice = null; p.request = false; car.pitStops++; this.events.push({ type: 'pit', car }); }
      }
    } else if (p.stage === 3) {
      td = lerp(boxD, laneD, smoothstep(boxU, boxU + 14, u));
      td = lerp(td, track0(T, car), smoothstep(T.pit.laneEnd, T.pit.exit, u));
      vt = u < T.pit.laneEnd ? T.pit.limit : 30 + (u - T.pit.laneEnd) * 2;
      if (u > T.pit.exit) { p.stage = 0; p.request = false; }
    }
    inp.steer = steerTo(T, car, car.cls, td, 6 + car.v * 0.25, tmp);
    speedControl(car, vt, inp);
    // Fade the limiter in over the first half-second so the handoff does not stab the brake or chop the throttle.
    if (p.stage === 1 && p.ease < 0.5) {
      const f = p.ease / 0.5;
      inp.brake *= f;
      inp.throttle = lerp(Math.max(inp.throttle, 0.45), inp.throttle, f);
    }
    if (p.stage === 1 && dBox < 18 && car.v > vt + 0.4) {
      inp.throttle = 0;
      inp.brake = Math.max(inp.brake, clamp((car.v - vt) / 8, 0.12, 0.55));
    }
    if (p.stage === 2) { inp.throttle = 0; inp.brake = 1; }
    inp.boost = false;
    return true;
  }

  _stepCar(car, dt) {
    const T = this.track, cls = car.cls, inp = car.input;
    // pit entry triggers (strict mouth gate for accidental drive-ins; request keeps the approach corridor)
    if (shouldEnterPit(T, car)) {
      car.pit.stage = 1; car.pit.d0 = car.d; car.pit.v0 = car.v; car.pit.ease = 0; car.pit.request = true; car.pit.serv = 0;
    }
    // surface + grip
    car.surface = T.surfaceAt(car.idx, car.d);
    _gripQ.tire = car.tire; _gripQ.wear = car.wear; _gripQ.wetness = this.wetness; _gripQ.surface = car.surface;
    car.grip = gripFactor(_gripQ);
    // steering: player input is smoothed (and slower at speed) so digital keys give fine control
    const human = car.isPlayer && !this.autopilot && !car.pit.stage;
    const vr = clamp(car.v / cls.vTop, 0, 1);
    const want = inp.steer;
    const steerSlew = car.pit.stage === 1 ? 3.2 : 9; // pit entry eases onto the auto steer; the rest of the field stays as it was
    car.steer = human ? steeringFilter(car.steer, want, vr, dt) : car.steer + clamp(want - car.steer, -dt * steerSlew, dt * steerSlew);
    car.brk += clamp(inp.brake - car.brk, -10 * dt, (human ? 7 : 14) * dt);
    // longitudinal
    const sf = SURFACE[car.surface];
    let boosting = false;
    if (inp.boost && car.boost > 0.01) boosting = true;
    car.boosting = boosting;
    const vTop = cls.vTop * (boosting ? 1.07 : 1) * (1 + 0.025 * Math.min(1, car.slip / 0.3));
    const vAbs = Math.max(Math.abs(car.v), 2.5);
    // flat spot from an earlier lock-up: temporary, mild grip loss that heals with time
    car.grip *= 1 - 0.07 * car.flat;
    // brake pedal -> effective pedal. Anti-lock (AI, Easy-assist player) keeps the tyres just under the lock point; humans on Hard/Normal can lock up.
    let pedal = car.brk;
    const st0 = steerState(cls, car.steer, vAbs, car.grip, 0, _st);
    const latFrac = Math.min(1, st0.frac);
    if (car.v > 0.4 && pedal > 0 && (human ? this.diff.assist : !car.ai.forceLock)) {
      const pr = brakePressure(cls, vAbs, car.grip, pedal, latFrac);
      if (pr > 0.9) pedal *= 0.9 / pr;
    }
    // lock-up: pedal beyond what the grip budget (shared with steering) holds. Deterministic, driven only by state.
    const press = car.v > 0.4 ? brakePressure(cls, vAbs, car.grip, pedal, latFrac) : 0;
    const lockTarget = press > 1 && car.v > 22 ? clamp(0.45 + (press - 1) * 3, 0, 1) : 0;
    car.lockup += clamp(lockTarget - car.lockup, -3 * dt, 9 * dt);
    if (car.lockup < 0.001) car.lockup = 0;
    car.flat = clamp(car.flat + (car.lockup * 0.16 - 0.018) * dt, 0, 1); // ~55 s to heal fully
    const brakeA = car.v > 0.4 ? brakeCapacity(cls, vAbs, car.grip) * pedal * (1 - 0.22 * car.lockup) : 0;
    // friction ellipse: braking (and hard traction) spend the same grip the steering needs
    const longCap = Math.max(longGripLimit(cls, vAbs, car.grip), 1);
    const use = Math.min(1, (brakeA + 0.5 * cls.accel * inp.throttle * Math.max(0, 1 - vAbs / vTop)) / longCap);
    const st = steerState(cls, car.steer, vAbs, car.grip * (1 - 0.4 * car.lockup), Math.min(1, use), _st);
    car.latFrac = st.frac;
    let a = cls.accel * inp.throttle * Math.max(0, 1 - (car.v / vTop) ** 2);
    if (boosting) a += 12 * Math.max(0, 1 - car.v / vTop);
    const tractionCap = G * 1.5 * (0.35 + 0.65 * car.grip) + (boosting ? 8 : 0);
    car.wheelspin = a > tractionCap ? Math.min(1, (a - tractionCap) / tractionCap) : 0;
    a = Math.min(a, tractionCap);
    a *= 1 - (this.diff.assist ? 0.15 : 0.3) * Math.min(1, st.excess); // spinning the wheels while understeering (traction control softens it on Easy)
    if (car.pit.stage && car.v > T.pit.limit && inp.throttle > 0) a = Math.min(a, 0);
    // resistance: aero drag + rolling, engine braking when off throttle, climbing
    a -= sf.drag * car.v + 0.00045 * car.v * car.v + 0.4;
    if (inp.throttle < 0.05 && car.v > 5) a -= 1.1 * (1 - inp.throttle / 0.05);
    a -= G * T.slopeAt(car.s) * 0.7;
    a -= Math.min(1, st.excess) * 2.2 * Math.min(1, car.v / 30); // running wide on tyre scrub: noticeable, not a brake
    if (brakeA > 0) a -= brakeA;
    else if (inp.brake > 0 && car.v <= 0.4 && !car.pit.stage) a -= 8 * car.brk; // reverse
    car.longAcc = a;
    car.wheelSlip = Math.max(car.lockup, car.wheelspin * 0.8, Math.min(1, st.excess) * 0.6);
    car.v += a * dt;
    if (car.v < 0 && !(inp.brake > 0 && !car.pit.stage)) car.v = 0;
    car.v = Math.max(car.v, -9);
    // yaw
    const vy = Math.abs(car.v) < 2.5 && inp.throttle > 0 ? Math.sign(car.v || 1) * 2.5 : car.v;
    const kap = steerCurvature(cls, car.steer, Math.abs(vy), car.grip * (1 - 0.4 * car.lockup), Math.min(1, use));
    const rot = rotationTarget(kap, vy, inp.throttle * Math.max(0, 1 - car.brk), Math.min(1, st.frac), human);
    const yawRate = rotationStep(car, rot, dt, car.grip * (1 - 0.25 * car.lockup), human);
    car.theta += yawRate * dt;
    car.yawRate = yawRate;
    car.signedLatAcc = -yawRate * car.v;
    car.latAcc = Math.abs(car.signedLatAcc);
    // Geometric tyre slip feeds audio and body language. Countersteering opposes the residual rear slide naturally.
    car.slipAngle = clamp(car.slipAngle, -0.022, 0.022);
    // The tyres have a path/slip angle: a sliding car no longer moves exactly where its nose points.
    const phi = car.theta + (human ? car.slipAngle : 0);
    car.x += Math.sin(phi) * car.v * dt;
    car.z += Math.cos(phi) * car.v * dt;
    // wear
    if (this.phase === 'racing') car.wear = Math.min(1, car.wear + tireWearRate(car.tire, car.latAcc, this.wetness, cls.wear) * dt);
    // track frame
    const loc = T.locate(car.x, car.z, car.idx, undefined, 30);
    car.idx = loc.i; car.d = loc.d;
    car.s = loc.s;
    if (advanceLap(car.lap, car.s)) this._lapDone(car);
    car.progress = car.lap.progress;
    if (!car.started && car.progress >= 0) { car.started = true; car.lapStart = this.time; }
    car.pose = carPose(T, car.s, car.pose); car.y = car.pose.y; // per-car object, reused every step
    // walls
    const i = car.idx, lw = T.leftWall[i] - 1.0, rw = T.rightWall[i] - 1.0; // per-side (inside runoff is clamped)
    let over = 0;
    if (car.d > lw) over = car.d - lw; else if (car.d < -rw) over = car.d + rw;
    if (over) {
      car.x -= T.nx[i] * over; car.z -= T.nz[i] * over; car.d -= over;
      const along = T.theta[i];
      const err = wrapAngle(along - car.theta);
      const impact = Math.abs(Math.sin(err));
      car.theta += clamp(err, -0.5, 0.5) * Math.min(1, 24 * dt);
      if (car.hit <= 0) { // one impact per contact (cooldown), then only a light scrape so cars slide along the wall instead of stalling
        car.v *= 1 - clamp(0.12 + 0.6 * impact, 0, 0.6);
        car.hit = 0.4; this.events.push({ type: 'hit', car, power: impact });
      } else car.v *= 1 - (4 + 18 * impact) * dt; // sliding along a wall is not free: it drags hard
      car.scrape = 0.15;
    }
    car.hit = Math.max(0, car.hit - dt); car.scrape = Math.max(0, (car.scrape || 0) - dt);
  }

  _lapDone(car) {
    const lapsDone = car.lap.maxLaps;
    const t = this.time;
    if (lapsDone >= 1) {
      const lt = t - car.lapStart; car.lapStart = t;
      car.lapTimes.push(lt); if (lt < car.bestLap) car.bestLap = lt;
    }
    car.laps = lapsDone;
    if (lapsDone >= this.laps && !car.finished) {
      car.finished = true; car.finishTime = t; car.pit.request = false;
      this.events.push({ type: 'finish', car });
    } else {
      this.events.push({ type: 'lap', car, lap: lapsDone });
      if (!this.solo && lapsDone === this.laps - 1 && !this.finalLapShown && !this.cars.some((c) => c.laps >= this.laps)) { this.finalLapShown = true; this.events.push({ type: 'finallap', car }); }
    }
  }

  _interactions(dt) {
    const T = this.track, L = T.length, cs = this.cars;
    for (let n = 0; n < cs.length; n++) { const c = cs[n]; c.slipNow = 0; c.cHit = Math.max(0, (c.cHit || 0) - dt); }
    for (let a = 0; a < cs.length; a++) {
      for (let b = a + 1; b < cs.length; b++) {
        const A = cs[a], B = cs[b];
        let ds = wrapDelta(B.s - A.s, L); // + => B ahead of A
        const dd = B.d - A.d;
        if (Math.abs(ds) > 36 || Math.abs(dd) > 6) continue;
        const rear = ds > 0 ? A : B, front = ds > 0 ? B : A;
        const gap = Math.abs(ds) - 4.6;
        if (!rear.finished) rear.slipNow = Math.max(rear.slipNow, slipstreamRate(gap, Math.abs(dd)));
        if (A.pit.stage || B.pit.stage) continue;
        if (Math.abs(ds) < 4.6 && Math.abs(dd) < 2.1) {
          // overlap: push apart laterally, bleed rear speed
          const push = (2.1 - Math.abs(dd)) * 0.5, sgn = dd >= 0 ? 1 : -1;
          B.x += T.nx[B.idx] * push * sgn; B.z += T.nz[B.idx] * push * sgn;
          A.x -= T.nx[A.idx] * push * sgn; A.z -= T.nz[A.idx] * push * sgn;
          if ((A.isPlayer || B.isPlayer) && !((A.cHit || 0) > 0 && (B.cHit || 0) > 0)) {
            const power = clamp(Math.abs(rear.v - front.v) / 25 + (2.1 - Math.abs(dd)) * 0.25, 0.05, 1);
            A.cHit = B.cHit = 0.5; this.events.push({ type: 'hit', car: A.isPlayer ? A : B, power, kind: 'car' });
          }
          if (Math.abs(ds) > 2.2) {
            rear.v = Math.min(rear.v, front.v + 1.0);
            front.v += 0.08;
          }
        }
      }
    }
    for (let n = 0; n < cs.length; n++) {
      const c = cs[n];
      c.slip = c.slipNow;
      _boostQ.fill = c.slipNow; _boostQ.boosting = c.boosting; _boostQ.dt = dt;
      c.boost = updateBoost(c.boost, _boostQ);
    }
  }

  /** Time gaps (s) from `car` to the car ahead (+) and behind (-); null when none/finished/not started. */
  gaps(car = this.player) {
    const i = this.order.indexOf(car), L = this.track.length;
    const g = (o) => {
      if (!o || o.progress < 0 || car.progress < 0) return null;
      const ds = Math.abs(o.progress - car.progress);
      return ds / Math.max(30, car.v, o.v * 0.8);
    };
    const ahead = i > 0 && !this.order[i - 1].finished ? g(this.order[i - 1]) : null;
    const behind = i < this.order.length - 1 && !this.order[i + 1].finished ? g(this.order[i + 1]) : null;
    return { ahead, behind, L };
  }

  rank() {
    this.order = this.cars.slice().sort((a, b) => {
      if (a.finished && b.finished) return a.finishTime - b.finishTime;
      if (a.finished) return -1;
      if (b.finished) return 1;
      return b.progress - a.progress;
    });
    const pp = this.player?.pos;
    this.order.forEach((c, i) => (c.pos = i + 1));
    if (this.player && pp && pp !== this.player.pos && this.phase === 'racing' && this.player.progress > 0 && !this.player.finished) this.events.push({ type: 'poschange', from: pp, to: this.player.pos });
  }

  /** Run the remaining sim headlessly (used when the player finishes). */
  simulateToEnd(maxSeconds = 150) {
    let t = 0;
    while (!this.cars.every((c) => c.finished) && t < maxSeconds) { this.step(1 / 30); t += 1 / 30; }
    this.events.length = 0;
  }

  results() {
    const win = this.order[0];
    return this.order.map((c) => ({
      pos: c.pos, name: c.driver?.name || c.team.name, tag: c.team.tag, team: c.team, isPlayer: c.isPlayer, id: c.driverId || null, finished: c.finished,
      time: c.finishTime, gap: c.finished ? c.finishTime - win.finishTime : null,
      best: c.bestLap, stops: c.pitStops,
    }));
  }
}

function track0(T, car) { return T.lineAt(car.s) * 0.9; }
