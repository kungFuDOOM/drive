// AI mistakes scale with difficulty (Easy most, Hard fewest), weaker drivers err more, and nobody errs with a car alongside.
import { describe, it, expect } from 'vitest';
import { DIFFICULTY } from './progress.js';
import { runRace } from './aiSim.js';
import { Track } from './track.js';
import { Race, seededRandom } from './race.js';

describe('AI mistakes', () => {
  it('difficulty table: Easy errs most, Hard least, and big errors are Easy-weighted', () => {
    expect(DIFFICULTY.easy.mistakes).toBeGreaterThan(DIFFICULTY.normal.mistakes);
    expect(DIFFICULTY.normal.mistakes).toBeGreaterThan(DIFFICULTY.hard.mistakes);
    expect(DIFFICULTY.easy.bigMistake).toBeGreaterThan(DIFFICULTY.hard.bigMistake);
  });
  it('consistency follows skill within the field', () => {
    const r = new Race(new Track(), { mode: 'race', difficulty: 'normal', rng: seededRandom(2) });
    const ai = r.cars.filter((c) => !c.isPlayer).sort((a, b) => a.skill - b.skill);
    for (let i = 1; i < ai.length; i++) expect(ai[i].ai.consistency).toBeGreaterThanOrEqual(ai[i - 1].ai.consistency);
  });
  it('per 3-lap race: Easy > Normal > Hard, in the target bands, never with a car alongside', () => {
    const m = {};
    for (const d of ['easy', 'normal', 'hard']) {
      const rs = [1, 2, 3].map((seed) => runRace({ track: 'citadel', difficulty: d, seed }));
      m[d] = rs.reduce((s, r) => s + r.mistakeCount, 0) / rs.length;
      for (const r of rs) expect(r.mistakesBeside).toBe(0);
      for (const r of rs) expect(r.wallHits).toBeLessThanOrEqual(1);
    }
    console.log('mistakes per race', JSON.stringify(m));
    expect(m.easy).toBeGreaterThan(m.normal);
    expect(m.normal).toBeGreaterThan(m.hard);
    expect(m.easy).toBeGreaterThanOrEqual(18); expect(m.easy).toBeLessThanOrEqual(30);
    expect(m.normal).toBeGreaterThanOrEqual(8); expect(m.normal).toBeLessThanOrEqual(15);
    expect(m.hard).toBeGreaterThanOrEqual(2); expect(m.hard).toBeLessThanOrEqual(6);
  }, 60000);
});
