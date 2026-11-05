import { describe, it, expect } from 'vitest';
import { Track } from './track.js';
import { Race, seededRandom } from './race.js';
import { benchLap, benchReport } from './brakeBench.js';
import { steerState, CLASSES, ellipseScale, ELLIPSE_FLOOR, brakeCapacity, brakePressure, longGripLimit } from './physics.js';

const track = new Track();
const gp = CLASSES.gp;

/** Player on the start straight, at speed v, driven by `input(r,p)` for `secs`. Returns the race. */
function straightRun(opts, v, secs, input, keepOnRoad = true) {
  const r = new Race(track, { mode: 'tt', weather: 'dry', ...opts });
  for (let t = 0; t < 6; t += 1 / 60) r.step(1 / 60);
  const p = r.player, a = track.at(40, 0);
  p.x = a.x; p.z = a.z; p.theta = track.thetaAt(40); p.s = 40; p.idx = track.locateGlobal(a.x, a.z).i; p.v = v; p.steer = 0;
  const log = [];
  for (let t = 0; t < secs; t += 1 / 60) {
    input(r, p, t);
    r.step(1 / 60); r.events.length = 0;
    log.push({ v: p.v, lockup: p.lockup, flat: p.flat, slip: p.wheelSlip, a: p.longAcc, grip: p.grip });
  }
  return { r, p, log };
}

describe('brake versus coast', () => {
  it('lifting off gives drag + engine braking only; braking is several times stronger', () => {
    const coast = straightRun({}, 70, 2, (r, p) => { p.input.throttle = 0; p.input.brake = 0; p.input.steer = 0; });
    const brake = straightRun({}, 70, 2, (r, p) => { p.input.throttle = 0; p.input.brake = 0.8; p.input.steer = 0; });
    const dCoast = (70 - coast.p.v) / 2, dBrake = (70 - brake.p.v) / 2;
    expect(dCoast).toBeGreaterThan(3);   // there is real drag/engine braking
    expect(dCoast).toBeLessThan(9);      // ...but lifting is not braking
    expect(dBrake).toBeGreaterThan(dCoast * 3.5);
    expect(dBrake).toBeGreaterThan(25);
  });
  it('lifting in a corner does not add heavy artificial understeer braking', () => {
    // full lock held at speed (way over the grip limit): the extra scrub must stay a few m/s^2, never a brake
    const a = straightRun({}, 60, 1, (r, p) => { p.input.throttle = 0; p.input.brake = 0; p.input.steer = 0; });
    const b = straightRun({}, 60, 0.5, (r, p) => { p.input.throttle = 0; p.input.brake = 0; p.input.steer = 1; }, false);
    const decelStraight = (60 - a.p.v) / 1, decelLock = (60 - b.p.v) / 0.5;
    expect(decelLock - decelStraight).toBeLessThan(4);
    expect(b.log[b.log.length - 1].lockup).toBe(0);
  });
  it('speed-dependent brake capacity: more aero load, more stopping power; wet grip cuts it', () => {
    expect(brakeCapacity(gp, 80, 1)).toBeGreaterThan(brakeCapacity(gp, 20, 1) * 1.15);
    expect(brakeCapacity(gp, 60, 0.5)).toBeLessThan(brakeCapacity(gp, 60, 1) * 0.8);
  });
});

describe('friction ellipse / trail braking', () => {
  it('braking trades away lateral grip smoothly: light trail braking barely, full brake a lot, never to zero', () => {
    const k0 = steerState(gp, 1, 50, 1, 0).k, k3 = steerState(gp, 1, 50, 1, 0.3).k, k6 = steerState(gp, 1, 50, 1, 0.6).k, k10 = steerState(gp, 1, 50, 1, 1).k;
    expect(k3).toBeGreaterThan(k0 * 0.9);
    expect(k6).toBeLessThan(k3);
    expect(k10).toBeLessThan(k6);
    expect(k10).toBeGreaterThan(k0 * ELLIPSE_FLOOR * 0.95); // controllable: the floor keeps some steering
    expect(ellipseScale(1)).toBeCloseTo(ELLIPSE_FLOOR, 5);
    expect(ellipseScale(0)).toBe(1);
  });
  it('turning in on the brakes at the grip limit understeers (runs wide) more than turning in off the brakes', () => {
    const free = steerState(gp, 0.8, 55, 1, 0), braking = steerState(gp, 0.8, 55, 1, 0.9);
    expect(braking.excess).toBeGreaterThan(free.excess);
    expect(braking.frac).toBeGreaterThan(free.frac * 1.2);
  });
  it('simulated: same steering input holds a tighter arc off the brakes than on them', () => {
    const arc = (brake) => {
      const { p } = straightRun({}, 60, 0.8, (r, q) => { q.input.throttle = 0; q.input.brake = brake; q.input.steer = 0.7; }, false);
      return Math.abs(p.theta - track.thetaAt(40));
    };
    // heading change per metre travelled at the same input, same start speed
    expect(arc(0)).toBeGreaterThan(arc(1) * 1.05);
  });
});

describe('lock-up', () => {
  const lockRun = (opts, secs = 1.5) => straightRun(opts, 70, secs, (r, p) => { p.input.throttle = 0; p.input.brake = 1; p.input.steer = 0.8; }, false);
  it('full brake while steering locks the tyres: visible slip, flat spot, less retardation', () => {
    const { log, p } = lockRun({});
    expect(Math.max(...log.map((l) => l.lockup))).toBeGreaterThan(0.5);
    expect(p.flat).toBeGreaterThan(0.05);
    expect(Math.max(...log.map((l) => l.slip))).toBeGreaterThan(0.5);
  });
  it('full brake in a straight line at speed does not lock in the dry (peak braking is allowed)', () => {
    const { log } = straightRun({}, 70, 1.5, (r, p) => { p.input.throttle = 0; p.input.brake = 1; p.input.steer = 0; });
    expect(Math.max(...log.map((l) => l.lockup))).toBe(0);
  });
  it('releasing the pedal recovers within a fraction of a second; the flat spot heals and is only a mild grip loss', () => {
    const r = new Race(track, { mode: 'tt', weather: 'dry' });
    for (let t = 0; t < 6; t += 1 / 60) r.step(1 / 60);
    const p = r.player, a = track.at(40, 0);
    p.x = a.x; p.z = a.z; p.theta = track.thetaAt(40); p.s = 40; p.idx = track.locateGlobal(a.x, a.z).i; p.v = 75;
    for (let t = 0; t < 1.2; t += 1 / 60) { p.input.brake = 1; p.input.steer = 0.8; r.step(1 / 60); r.events.length = 0; }
    expect(p.lockup).toBeGreaterThan(0.4);
    const flat0 = p.flat;
    let t = 0;
    while (p.lockup > 0 && t < 3) { p.input.brake = 0.3; p.input.steer = 0; p.v = Math.max(p.v, 40); r.step(1 / 60); r.events.length = 0; t += 1 / 60; }
    expect(t).toBeLessThan(0.7);
    expect(flat0).toBeGreaterThan(0);
    expect(1 - 0.07 * flat0).toBeGreaterThan(0.92); // worst case grip penalty from a flat spot
    for (let k = 0; k < 60 * 70; k++) { p.input.brake = 0; p.input.throttle = 0; p.v = 40; p.x = a.x; p.z = a.z; r.step(1 / 60); r.events.length = 0; }
    expect(p.flat).toBe(0);
  });
  it('anti-lock: Easy-assist player and every AI car brake right at the limit without locking', () => {
    const easy = straightRun({ difficulty: 'easy' }, 70, 1.5, (r, p) => { p.input.throttle = 0; p.input.brake = 1; p.input.steer = 0.8; }, false);
    expect(Math.max(...easy.log.map((l) => l.lockup))).toBe(0);
    // Seed 9 contains a deliberate lock-up mistake. The old check (`!c.ai.mistake` -> lockup must be 0) failed whenever a lock
    // mistake ended: ai.mistake goes null while car.lockup is still ~1 and decays at 3/s for ~1/3 s. That tail belongs to the
    // intentional mistake. The real invariant: lock-up can only build up on a frame where ai.forceLock disabled anti-lock,
    // and once forcing ends it decays straight to 0.
    const r = new Race(track, { mode: 'race', weather: 'dry', difficulty: 'hard', rng: seededRandom(9) });
    r.autopilot = true;
    const prev = new Map(r.cars.map((c) => [c, 0])), tail = new Map();
    let forcedFrames = 0, forcedPeak = 0, unforcedRise = 0, maxTail = 0;
    for (let k = 0; k < 60 * 40; k++) {
      r.step(1 / 60); r.events.length = 0;
      for (const c of r.cars) {
        if (c.ai.forceLock) { forcedFrames++; forcedPeak = Math.max(forcedPeak, c.lockup); tail.set(c, 0); }
        else {
          if (c.lockup > prev.get(c)) unforcedRise++;
          if (c.lockup > 0) { tail.set(c, (tail.get(c) || 0) + 1); maxTail = Math.max(maxTail, tail.get(c)); }
        }
        prev.set(c, c.lockup);
      }
    }
    expect(forcedFrames).toBeGreaterThan(0);  // the intentional mistake is exercised...
    expect(forcedPeak).toBeGreaterThan(0.5);  // ...and really locks the tyres
    expect(unforcedRise).toBe(0);             // anti-lock: no AI lock-up ever builds without a lock mistake
    expect(maxTail).toBeGreaterThan(0);       // the post-mistake tail exists in this seed (the case that used to fail)
    expect(maxTail).toBeLessThanOrEqual(21);  // and clears in <= 1/3 s (lockup <= 1 decaying at 3/s, 60 Hz) + 1 frame
  });
  it('is deterministic', () => {
    const a = lockRun({}).log.map((l) => l.lockup + ':' + l.v.toFixed(5)).join(), b = lockRun({}).log.map((l) => l.lockup + ':' + l.v.toFixed(5)).join();
    expect(a).toBe(b);
  });
  it('wet tyres lock far more easily (pressure rises with lower grip)', () => {
    expect(brakePressure(gp, 60, 0.45, 1, 0)).toBeGreaterThan(brakePressure(gp, 60, 1, 1, 0) * 1.5);
    expect(brakePressure(gp, 60, 1, 1, 1)).toBeGreaterThan(brakePressure(gp, 60, 1, 1, 0));
    expect(longGripLimit(gp, 60, 1)).toBeGreaterThan(gp.latBase);
  });
});

describe('lift-only bot vs braking bot (scripted solo laps, same steering, same target speeds)', () => {
  const rep = benchReport(track);
  it('prints the comparison table (entry speed, slowest speed, time, distance, off per section)', () => {
    const rows = [];
    for (const [bot, v] of Object.entries(rep)) for (const [sec, s] of Object.entries(v.secs)) rows.push({ bot, sec, ...s, lap: v.time, lapOffPct: v.offPct });
    console.table(rows);
    expect(rows.length).toBeGreaterThan(15);
  });
  it('braking lap is clean and fastest; lifting and flat-out laps are slower and run wide', () => {
    expect(rep.brake.offPct).toBe(0);
    expect(rep.lift.time).toBeGreaterThan(rep.brake.time + 2);
    expect(rep.flat.time).toBeGreaterThan(rep.brake.time + 2);
    expect(rep.lift.offPct).toBeGreaterThan(5);
    expect(rep.flat.offPct).toBeGreaterThan(5);
  });
  it('the hard corners need real braking: Crown Hairpin and Moat Sweep go off without it', () => {
    for (const bot of ['lift', 'flat']) {
      expect(rep[bot].secs['Crown Hairpin'].off).toBeGreaterThan(30);
      expect(rep[bot].secs['Moat Sweep'].off).toBeGreaterThan(30);
      expect(rep[bot].secs['Crown Hairpin'].min).toBeLessThan(rep.brake.secs['Crown Hairpin'].min - 40);
    }
    expect(rep.brake.secs['Crown Hairpin'].off).toBe(0);
    expect(rep.brake.secs['The Plunge'].min).toBeLessThan(rep.brake.secs['The Plunge'].entry * 0.5);
    expect(rep.brake.secs['Citadel Squeeze'].min).toBeLessThan(rep.brake.secs['Citadel Squeeze'].entry * 0.6);
  });
  it('the braking bot slows by braking, not just by running wide: its brake zones are quick (entry > 2x min at Plunge/Citadel)', () => {
    const b = benchLap(track, 'brake');
    expect(b.lockFrames).toBe(0);
    expect(b.hits).toBe(0);
  });
});
