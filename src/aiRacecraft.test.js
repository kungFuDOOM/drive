// AI racecraft pieces: starts (reaction, launch), rain tyres and pit judgement, wet plans, frame-rate independent rolls.
import { describe, it, expect } from 'vitest';
import { Race, seededRandom } from './race.js';
import { REACTION, perSecond, driverProfile, makePace } from './ai.js';
import { getTrack } from './aiSim.js';

const DT = 1 / 60;

describe('AI starts', () => {
  for (const difficulty of ['easy', 'normal', 'hard']) it(`${difficulty}: nobody moves before lights out or their reaction time; reactions spread inside the band`, () => {
    const race = new Race(getTrack('citadel'), { mode: 'race', difficulty, laps: 1, rng: seededRandom(7), aiOnly: true });
    const first = new Map();
    for (let k = 0; k < 60 * 9; k++) {
      if (race.phase === 'countdown') for (const c of race.cars) expect(c.v).toBe(0);
      race.step(DT);
      if (race.phase === 'racing') for (const c of race.cars) if (!first.has(c) && c.v > 0.05) first.set(c, race.time);
    }
    const R = REACTION[difficulty];
    const t = [...first.values()];
    expect(t.length).toBe(race.cars.length);
    for (const c of race.cars) {
      expect(c.ai.reaction).toBeGreaterThanOrEqual(R.lo); expect(c.ai.reaction).toBeLessThanOrEqual(R.hi);
      expect(first.get(c)).toBeGreaterThanOrEqual(c.ai.reaction - 1e-9);
    }
    expect(Math.max(...t) - Math.min(...t)).toBeGreaterThanOrEqual(0.1);
  });
});

describe('AI rain tyres and pit calls', () => {
  it('a race that starts wet puts the AI on wets; the human keeps the starting tyre', () => {
    const r = new Race(getTrack('citadel'), { mode: 'race', weather: 'rain', rng: seededRandom(2) });
    for (const c of r.cars) expect(c.tire).toBe(c.isPlayer ? 'dry' : 'wet');
    const dry = new Race(getTrack('citadel'), { mode: 'race', weather: 'dry', rng: seededRandom(2) });
    for (const c of dry.cars) expect(c.tire).toBe('dry');
  });
  it('pits by judgement: stays out on a dry track, stops on a soaked one, waits for a team-mate in the box', () => {
    const r = new Race(getTrack('citadel'), { mode: 'race', weather: 'dry', laps: 5, rng: seededRandom(4) });
    r.phase = 'racing';
    const car = r.cars.find((c) => !c.isPlayer);
    car.progress = 50;
    r._aiPitDecision(car);
    expect(car.pit.request).toBe(false);
    r.rain = 1; r.wetness = 0.85;
    const mate = r.cars.find((c) => c !== car && !c.isPlayer);
    mate.team = car.team; mate.teamIndex = car.teamIndex; mate.pit.stage = 2;
    r._aiPitDecision(car);
    expect(car.pit.request).toBe(false);
    mate.pit.stage = 0;
    r._aiPitDecision(car);
    expect(car.pit.request).toBe(true);
    expect(car.pit.aiChoice).toBe('wet');
  });
  it('a wet plan is slower everywhere it matters and gs = 1 is the dry plan', () => {
    const T = getTrack('citadel'), r = new Race(T, { mode: 'tt' }), cls = r.cls;
    const p = makePace(T, cls, { gap: 0.05 });
    expect(driverProfile(T, cls, p.corner, p.brake, 1)).toBe(p.prof);
    const wet = driverProfile(T, cls, p.corner, p.brake, 0.8);
    let slower = 0;
    for (let i = 0; i < T.n; i++) { expect(wet[i]).toBeLessThanOrEqual(p.prof[i] + 1e-3); if (wet[i] < p.prof[i] - 1) slower++; }
    expect(slower).toBeGreaterThan(T.n * 0.2);
  });
});

describe('AI decision rolls', () => {
  it('per-second probabilities compose the same at any step size', () => {
    const at = (hz) => 1 - (1 - perSecond(0.6, 1 / hz)) ** hz;
    expect(Math.abs(at(30) - at(120))).toBeLessThan(1e-9);
    expect(at(60)).toBeCloseTo(1 - Math.exp(-0.6), 9);
  });
});
