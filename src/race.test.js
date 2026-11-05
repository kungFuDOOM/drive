import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Track } from './track.js';
import { Race } from './race.js';
import { steerTo, speedProfile, profileAt } from './ai.js';
import { steerState, CLASSES, SURFACE } from './physics.js';

const track = new Track();
const run = (race, secs, each) => { for (let t = 0; t < secs; t += 1 / 60) { each?.(); race.step(1 / 60); race.events.length = 0; } };

describe('handling model', () => {
  const gp = CLASSES.gp;
  it('steering angle shrinks with speed (speed-sensitive) and is grip-limited', () => {
    const slow = steerState(gp, 1, 15, 1).k * 15 * 15; // lateral accel demand
    const fast = steerState(gp, 1, 80, 1).k;
    expect(steerState(gp, 1, 15, 1).k).toBeGreaterThan(fast * 4);
    expect(slow).toBeGreaterThan(0);
    const st = steerState(gp, 1, 80, 1);
    expect(st.k * 80 * 80).toBeLessThanOrEqual(gp.latBase * (1 + gp.down * (80 / 60) ** 2) + 1e-6);
  });
  it('low grip (grass) and braking both reduce cornering capability and cause understeer', () => {
    const asphalt = steerState(gp, 1, 60, 1);
    const grass = steerState(gp, 1, 60, SURFACE.grass.grip);
    expect(grass.k).toBeLessThan(asphalt.k);
    expect(grass.excess).toBeGreaterThan(asphalt.excess);
    expect(steerState(gp, 1, 60, 1, 1).k).toBeLessThan(asphalt.k);
  });
});

describe('driving', () => {
  it('player is not autopiloted by default and accelerates only with player input', () => {
    const r = new Race(track, { mode: 'tt', weather: 'dry' });
    expect(r.autopilot).toBe(false);
    run(r, 6);
    expect(r.player.v).toBeLessThan(1);
    r.player.input.throttle = 1;
    run(r, 6, () => { r.player.input.throttle = 1; });
    expect(r.player.v).toBeGreaterThan(30);
  });
  it('braking is strong but finite', () => {
    const r = new Race(track, { mode: 'tt', weather: 'dry' });
    run(r, 6);
    const p = r.player;
    p.v = 80; p.input.throttle = 0;
    const x0 = p.s;
    let t = 0;
    while (p.v > 20 && t < 10) { p.input.brake = 1; r.step(1 / 60); t += 1 / 60; }
    expect(t).toBeGreaterThan(1.2);   // finite: can't stop instantly
    expect(t).toBeLessThan(3.5);      // strong
    expect(x0).toBeDefined();
  });
  it('grass/gravel slow the car much more than asphalt', () => {
    const r = new Race(track, { mode: 'tt', weather: 'dry' });
    run(r, 6);
    const p = r.player;
    const i = p.idx;
    const a = track.at(p.s, 0), g = track.at(p.s, track.half[i] + track.runoff[i] + 8);
    const top = (x, z) => { p.x = x; p.z = z; p.v = 70; for (let k = 0; k < 120; k++) { p.input.throttle = 1; p.input.steer = 0; r.step(1 / 60); } return p.v; };
    const vOn = top(a.x, a.z);
    p.theta = track.thetaAt(p.s);
    const vOff = top(g.x, g.z);
    expect(vOff).toBeLessThan(vOn * 0.7);
  });
  it('never braking is punished: flat-out lap is much slower than braking for corners', () => {
    const lap = (brakes) => {
      const r = new Race(track, { mode: 'tt', weather: 'dry' });
      const p = r.player, tmp = new THREE.Vector3(), prof = speedProfile(track, p.cls);
      let t = 0;
      while (t < 150 && p.lapTimes.length < 1) {
        p.input.steer = steerTo(track, p, p.cls, track.lineAt(p.s + 10) * 0.9, 7 + p.v * 0.32, tmp);
        p.input.throttle = 1; p.input.brake = 0;
        if (brakes && p.v > profileAt(track, prof, p.s + 30) * 1.4) { p.input.throttle = 0; p.input.brake = 0.8; }
        r.step(1 / 60); r.events.length = 0; t += 1 / 60;
      }
      return p.lapTimes[0] ?? 999;
    };
    expect(lap(true)).toBeLessThan(lap(false) - 3);
  });
});

describe('time trial', () => {
  it('is solo, unlimited and records laps through the timer', () => {
    const r = new Race(track, { mode: 'tt', difficulty: 'hard', weather: 'dry' });
    expect(r.cars.length).toBe(1);
    expect(r.laps).toBe(Infinity);
    r.autopilot = true;
    const evs = [];
    for (let t = 0; t < 130; t += 1 / 60) { r.step(1 / 60); evs.push(...r.events); r.events.length = 0; }
    const laps = evs.filter((e) => e.type === 'laptime');
    expect(laps.length).toBeGreaterThanOrEqual(2);
    expect(laps[0].sectors.length).toBe(3);
    expect(laps.some((l) => l.ghost)).toBe(true);
    expect(r.player.finished).toBe(false);
    expect(evs.filter((e) => e.type === 'sector').length).toBeGreaterThanOrEqual(6);
  });
});

describe('AI race', () => {
  const sim = (difficulty) => {
    const r = new Race(track, { mode: 'race', difficulty, laps: 3, weather: 'dry' });
    r.autopilot = true;
    let t = 0, changes = 0, prev = r.order.map((c) => c.id);
    while (!r.cars.every((c) => c.finished) && t < 300) {
      r.step(1 / 30); t += 1 / 30; r.events.length = 0;
      const o = r.order.map((c) => c.id);
      if (o.some((id, i) => id !== prev[i])) changes++;
      prev = o;
    }
    return { r, changes };
  };
  it('everyone finishes 3 laps, positions change (racing happens), results are ordered', () => {
    const { r, changes } = sim('normal');
    expect(r.cars.every((c) => c.finished)).toBe(true);
    expect(changes).toBeGreaterThan(10);
    const res = r.results();
    expect(res.map((x) => x.pos)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    for (let i = 1; i < res.length; i++) expect(res[i].time).toBeGreaterThanOrEqual(res[i - 1].time);
  });
  it('difficulty scales AI pace', () => {
    const mean = (d) => { const { r } = sim(d); const ai = r.cars.filter((c) => !c.isPlayer); return ai.reduce((a, c) => a + c.finishTime, 0) / ai.length; };
    // player is the same car for both so only AI pace differs
    expect(mean('hard')).toBeLessThan(mean('easy') - 5);
  });
});
