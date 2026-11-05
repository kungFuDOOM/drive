import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Track } from './track.js';
import { Race, seededRandom } from './race.js';
import { steerTo, speedProfile, profileAt } from './ai.js';
import { benchLap } from './brakeBench.js';
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
  it('never braking is punished: lifting or flat-out laps are slower than braking, and run off', () => {
    const brake = benchLap(track, 'brake'), lift = benchLap(track, 'lift'), flat = benchLap(track, 'flat');
    expect(brake.done && lift.done && flat.done).toBe(true);
    expect(brake.offFrac).toBe(0);
    expect(lift.time).toBeGreaterThan(brake.time + 2);
    expect(flat.time).toBeGreaterThan(brake.time + 2);
    expect(lift.offFrac).toBeGreaterThan(0.05);
    expect(flat.offFrac).toBeGreaterThan(0.05);
  });
});

describe('time trial', () => {
  it('is solo, unlimited and records laps through the timer', () => {
    const r = new Race(track, { mode: 'tt', difficulty: 'hard', weather: 'dry', rng: seededRandom(7) });
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
  // every sim is seeded through the Race's own rng (no global Math.random), so each case is reproducible in any test order
  const sim = (difficulty, seed = 1) => {
    const r = new Race(track, { mode: 'race', difficulty, laps: 3, weather: 'dry', rng: seededRandom(seed) });
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
  it('same seed -> identical race; different seed -> different grid/skills (rng is per race, not global)', () => {
    const fin = (seed) => sim('normal', seed).r.cars.map((c) => c.teamIndex + ':' + c.finishTime.toFixed(4)).join();
    expect(fin(5)).toBe(fin(5));
    expect(fin(5)).not.toBe(fin(6));
  });
  it('difficulty scales AI pace (matched seeds: same grid draw per difficulty)', () => {
    // One race is noisy (traffic, mistakes, grid draw): over 120 seeds a single Easy-Hard gap ranged 3.4-11 s (mean 6.2 s)
    // and Normal/Hard occasionally swapped. So compare means over matched seeds; the 5 s Easy-Hard requirement stands.
    const seeds = [1, 2, 3, 4];
    const mean = (d, seed) => { const ai = sim(d, seed).r.cars.filter((c) => !c.isPlayer); return ai.reduce((a, c) => a + c.finishTime, 0) / ai.length; };
    const m = {};
    for (const d of ['easy', 'normal', 'hard']) m[d] = seeds.map((s) => mean(d, s));
    const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
    expect(avg(m.hard)).toBeLessThan(avg(m.easy) - 5);
    expect(avg(m.hard)).toBeLessThan(avg(m.normal));
    expect(avg(m.normal)).toBeLessThan(avg(m.easy));
    seeds.forEach((_, i) => { expect(m.easy[i]).toBeGreaterThan(m.normal[i]); expect(m.easy[i]).toBeGreaterThan(m.hard[i] + 2); });
  });
});
