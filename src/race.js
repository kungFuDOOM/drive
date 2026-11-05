// Race simulation: cars, physics step, AI/pit control, laps, weather, results. No rendering.
import {
  CLASSES, SURFACE, clamp, lerp, smoothstep, wrapAngle, wrapDelta, createLapState, advanceLap,
  gripFactor, tireWearRate, steerState, slipstreamRate, updateBoost,
} from './physics.js';
import { DIFFICULTY } from './progress.js';
import { createTimer, updateTimer, createGhostRecorder, recordGhost, resetGhost, finishGhost, currentLapTime } from './timing.js';
import { PIT } from './track.js';
import { carPose } from './pose.js';
import { TEAMS } from './teams.js';
import { speedProfile, driveAI, steerTo, speedControl } from './ai.js';
import * as THREE from 'three';

const tmp = new THREE.Vector3();
const G = 9.81;

export class Race {
  /**
   * opts: { mode:'race'|'tt', difficulty:'easy'|'normal'|'hard', cls:'gp'|'speedway', laps:3-5,
   *         weather:'dry'|'auto'|'rain', rainAt?:seconds, playerSlot, best?:timer seed }
   * Time trial ('tt') is solo with unlimited laps (the player ends the session).
   */
  constructor(track, opts = {}) {
    this.track = track;
    this.opts = opts;
    this.cls = CLASSES[opts.cls] || CLASSES.gp;
    this.mode = opts.mode === 'tt' ? 'tt' : 'race';
    this.solo = this.mode === 'tt';
    this.diff = DIFFICULTY[opts.difficulty] || DIFFICULTY.normal;
    this.laps = this.solo ? Infinity : clamp(opts.laps || 3, 1, 9);
    this.phase = 'countdown'; // countdown | racing | done
    this.timer = this.solo ? 1.6 : 0; this.time = 0; this.goHold = this.solo ? 0 : 0.2 + Math.random() * 1.0; // random 0.2-1.2 s hold after the 5th light
    this.lights = 0; this.goFlash = 0;
    this.rain = 0; this.rainTarget = 0; this.wetness = 0;
    this.rainAt = opts.weather === 'rain' ? 0.5 : (opts.weather === 'dry' || this.solo) ? Infinity
      : (opts.rainAt ?? (Math.random() < 0.8 ? this.laps * 42 * (0.3 + Math.random() * 0.3) : Infinity));
    this.rainAnnounced = false;
    this.events = []; // {type, car}
    this.profiles = { [this.cls.id]: speedProfile(track, this.cls) };
    this.cars = [];
    this.playerSlot = opts.playerSlot ?? (this.solo ? 0 : 6);
    this._createCars();
    this.player = this.cars.find((c) => c.isPlayer);
    this.autopilot = false;
    this.lapTimer = createTimer(track.length, 3, opts.best || {});
    this.ghostRec = createGhostRecorder(10);
    this.order = this.cars.slice();
    this.rank();
  }

  _createCars() {
    const T = this.track, L = T.length, order = TEAMS.map((_, i) => i);
    // player is team 0; shuffle the rest
    for (let i = order.length - 1; i > 1; i--) { const j = 1 + Math.floor(Math.random() * i); [order[i], order[j]] = [order[j], order[i]]; }
    const grid = order.slice(1); grid.splice(this.playerSlot, 0, 0);
    grid.forEach((ti, slot) => {
      if (this.solo && slot !== this.playerSlot) return;
      const row = Math.floor(slot / 2), col = slot % 2;
      const s = L - 10 - row * 9 - col * 4.5;
      const d = col ? -3.2 : 3.2;
      const p = T.at(s, d);
      const th = T.thetaAt(s);
      const car = {
        id: slot, slot, team: TEAMS[ti], teamIndex: ti, isPlayer: slot === this.playerSlot, cls: this.cls,
        x: p.x, z: p.z, y: p.y, theta: th, v: 0, steer: 0, s, d: 0, idx: T.locateGlobal(p.x, p.z).i,
        lap: createLapState(L, s), progress: -10, laps: 0, finished: false, finishTime: 0,
        tire: 'dry', wear: 0, wetness: 0, grip: 1, surface: 'asphalt', boost: 0, boosting: false, slip: 0,
        input: { steer: 0, throttle: 0, brake: 0, boost: false },
        skill: this.diff.skill + (Math.random() - 0.5) * 2 * this.diff.spread, lineBias: (Math.random() - 0.5) * 3.2, wander: 0.4 + Math.random() * 0.8,
        noiseT: Math.random() * 50, noisePhase: Math.random() * 6.28, avoid: 0,
        lapStart: 0, lapTimes: [], bestLap: Infinity, hit: 0, pitStops: 0, brk: 0,
        ai: { mode: 'free', side: 0, t: 0, mistake: null, mistakeIn: 8 + Math.random() * 30, defendT: 0 },
        pit: { stage: 0, request: false, timer: 0, choice: null, d0: 0 },
        mesh: null,
      };
      car.d = T.locateGlobal(p.x, p.z).d;
      car.lap = createLapState(L, s);
      car.progress = car.lap.progress;
      car.skill = car.isPlayer ? 0.985 : car.skill;
      this.cars.push(car);
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
    const inputFor = (car) => {
      if (car.pit.stage) return this._pitControl(car, dt);
      if (car.isPlayer && !this.autopilot && !car.finished) return false; // player input set externally
      driveAI(car, this, dt, tmp);
      this._aiPitDecision(car);
      return true;
    };
    for (const car of this.cars) {
      inputFor(car);
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
    const u = wrapDelta(car.s, T.length), i = car.idx;
    const laneD = T.laneD(i), boxD = T.boxD(i), boxU = T.boxU(car.teamIndex);
    const dBox = boxU - u;
    let vt = 30, td = laneD;
    if (p.stage === 1) {
      const blend = smoothstep(PIT.entry, PIT.laneStart, u);
      td = lerp(p.d0, laneD, blend);
      vt = u < PIT.laneStart ? Math.sqrt(PIT.limit ** 2 + 2 * 28 * Math.max(0, PIT.laneStart - u)) : PIT.limit;
      if (dBox < 30) { td = lerp(laneD, boxD, smoothstep(30, 10, dBox)); vt = Math.min(vt, Math.sqrt(2 * 5 * Math.max(0, dBox - 0.6))); }
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
      td = lerp(td, track0(T, car), smoothstep(PIT.laneEnd, PIT.exit, u));
      vt = u < PIT.laneEnd ? PIT.limit : 30 + (u - PIT.laneEnd) * 2;
      if (u > PIT.exit) { p.stage = 0; p.request = false; }
    }
    inp.steer = steerTo(T, car, car.cls, td, 6 + car.v * 0.25, tmp);
    speedControl(car, vt, inp);
    if (p.stage === 1 && dBox < 30 && vt < 3) { inp.throttle = 0; inp.brake = car.v > vt + 0.5 ? 0.8 : 0.15; }
    if (p.stage === 2) { inp.throttle = 0; inp.brake = 1; }
    inp.boost = false;
    return true;
  }

  _stepCar(car, dt) {
    const T = this.track, cls = car.cls, inp = car.input;
    // pit entry triggers
    const u = wrapDelta(car.s, T.length);
    if (car.pit.stage === 0 && u > PIT.entry - 40 && u < PIT.laneStart + 20 && (car.pit.request || (car.isPlayer && car.d > T.half[car.idx] + 3 && car.progress > 0))) {
      car.pit.stage = 1; car.pit.d0 = car.d; car.pit.request = true; car.pit.serv = 0;
    }
    // surface + grip
    car.surface = T.surfaceAt(car.idx, car.d);
    car.grip = gripFactor({ tire: car.tire, wear: car.wear, wetness: this.wetness, surface: car.surface });
    // steering: player input is smoothed (and slower at speed) so digital keys give fine control
    const human = car.isPlayer && !this.autopilot && !car.pit.stage;
    const vr = clamp(car.v / cls.vTop, 0, 1);
    const want = inp.steer;
    const rate = human ? (Math.abs(want) < Math.abs(car.steer) || want * car.steer < 0 ? 9 : 6.5 - 3 * vr) : 9;
    car.steer += clamp(want - car.steer, -rate * dt, rate * dt);
    car.brk += clamp(inp.brake - car.brk, -10 * dt, (human ? 7 : 14) * dt);
    // longitudinal
    const sf = SURFACE[car.surface];
    let boosting = false;
    if (inp.boost && car.boost > 0.01) boosting = true;
    car.boosting = boosting;
    const vTop = cls.vTop * (boosting ? 1.07 : 1) * (1 + 0.025 * Math.min(1, car.slip / 0.3));
    const st = steerState(cls, car.steer, Math.max(Math.abs(car.v), 2.5), car.grip, car.brk);
    let a = cls.accel * inp.throttle * Math.max(0, 1 - (car.v / vTop) ** 2);
    if (boosting) a += 12 * Math.max(0, 1 - car.v / vTop);
    a = Math.min(a, G * 1.5 * (0.35 + 0.65 * car.grip) + (boosting ? 8 : 0));
    a *= 1 - 0.35 * Math.min(1, st.excess); // spinning the wheels while understeering
    if (car.pit.stage && car.v > PIT.limit && inp.throttle > 0) a = Math.min(a, 0);
    a -= sf.drag * car.v + 0.00045 * car.v * car.v + 0.4;
    a -= G * T.slopeAt(car.s) * 0.7;
    a -= st.excess * 9 * Math.min(1, car.v / 30); // understeer scrubs speed
    if (car.brk > 0) {
      if (car.v > 0.4) a -= cls.brake * car.brk * (0.45 + 0.55 * Math.min(1, car.grip));
      else if (!car.pit.stage) a -= 8 * car.brk; // reverse
    }
    car.v += a * dt;
    if (car.v < 0 && !(inp.brake > 0 && !car.pit.stage)) car.v = 0;
    car.v = Math.max(car.v, -9);
    // yaw
    const vy = Math.abs(car.v) < 2.5 && inp.throttle > 0 ? Math.sign(car.v || 1) * 2.5 : car.v;
    const kap = steerState(cls, car.steer, Math.abs(vy), car.grip, car.brk).k;
    car.theta -= kap * vy * dt;
    car.latAcc = Math.abs(kap) * car.v * car.v;
    car.x += Math.sin(car.theta) * car.v * dt;
    car.z += Math.cos(car.theta) * car.v * dt;
    // wear
    if (this.phase === 'racing') car.wear = Math.min(1, car.wear + tireWearRate(car.tire, car.latAcc, this.wetness, cls.wear) * dt);
    // track frame
    const loc = T.locate(car.x, car.z, car.idx, undefined, 30);
    car.idx = loc.i; car.d = loc.d;
    car.s = loc.s;
    if (advanceLap(car.lap, car.s)) this._lapDone(car);
    car.progress = car.lap.progress;
    if (!car.started && car.progress >= 0) { car.started = true; car.lapStart = this.time; }
    car.pose = carPose(T, car.s); car.y = car.pose.y;
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
        car.v *= 1 - clamp(0.1 + 0.5 * impact, 0, 0.55);
        car.hit = 0.4; this.events.push({ type: 'hit', car, power: impact });
      } else car.v *= 1 - (2 + 10 * impact) * dt;
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
    for (const c of cs) { c.slipNow = 0; c.cHit = Math.max(0, (c.cHit || 0) - dt); }
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
    for (const c of cs) {
      c.slip = c.slipNow;
      c.boost = updateBoost(c.boost, { fill: c.slipNow, boosting: c.boosting, dt });
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
      pos: c.pos, name: c.team.name, tag: c.team.tag, team: c.team, isPlayer: c.isPlayer, finished: c.finished,
      time: c.finishTime, gap: c.finished ? c.finishTime - win.finishTime : null,
      best: c.bestLap, stops: c.pitStops,
    }));
  }
}

function track0(T, car) { return T.lineAt(car.s) * 0.9; }
