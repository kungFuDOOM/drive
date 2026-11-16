// Per-driver pace model: corner / brake / exit factors on the shared plan, flat-out straights, rating order kept.
import { describe, it, expect } from 'vitest';
import { Track } from './track.js';
import { CLASSES } from './physics.js';
import { lineProfile } from './racingLine.js';
import { DIFFICULTY, AI_PACE, paceGap } from './progress.js';
import { driverProfile, paceFactor, makePace, LIMIT_FACTOR } from './ai.js';
import { rivalSkill, defaultRivals } from './career.js';
import { soloLaps } from './aiSim.js';

const T = new Track(), gp = CLASSES.gp;

describe('AI pace model', () => {
  it('straights stay flat out at every pace: the target never drops below top speed where the plan is uncapped', () => {
    const base = lineProfile(T, gp);
    const slow = driverProfile(T, gp, 0.85, 0.85);
    let flat = 0;
    const cap = gp.vTop * 1.05 - 1e-3, ahead = Math.ceil(250 / T.ds); // straight with 250 m of straight still ahead
    for (let i = 0; i < T.n; i++) {
      let straight = true;
      for (let k = 0; k <= ahead && straight; k++) if (base.v[(i + k) % T.n] < cap) straight = false;
      if (straight) { flat++; expect(slow[i]).toBeGreaterThanOrEqual(gp.vTop); }
    }
    expect(flat).toBeGreaterThan(50);
  });
  it('a bigger gap means a lower factor and a slower plan everywhere', () => {
    const f = [0.02, 0.06, 0.11].map((g) => paceFactor(T, gp, g));
    expect(f[0]).toBeGreaterThan(f[1]); expect(f[1]).toBeGreaterThan(f[2]); expect(f[0]).toBeLessThan(LIMIT_FACTOR);
    const a = makePace(T, gp, { gap: 0.03 }).prof, b = makePace(T, gp, { gap: 0.1 }).prof;
    for (let i = 0; i < T.n; i++) expect(b[i]).toBeLessThanOrEqual(a[i] + 1e-6);
  });
  it('does not depend on call order (cache keys hold exactly what is computed)', () => {
    const g = 0.0612345678;
    const x = paceFactor(T, gp, g);
    paceFactor(T, gp, 0.0612349);
    expect(paceFactor(T, gp, g)).toBe(x);
  });
  it('career rivals keep their rating order at every difficulty (higher rating = smaller gap = faster plan)', () => {
    const rivals = defaultRivals().slice().sort((a, b) => b.rating - a.rating);
    for (const d of ['easy', 'normal', 'hard']) {
      const gaps = rivals.map((r) => paceGap(d, rivalSkill(r.rating, d)));
      for (let i = 1; i < gaps.length; i++) {
        if (rivals[i].rating < rivals[i - 1].rating) expect(gaps[i]).toBeGreaterThan(gaps[i - 1]);
        const fa = paceFactor(T, gp, gaps[i - 1]), fb = paceFactor(T, gp, gaps[i]);
        expect(fb).toBeLessThanOrEqual(fa);
      }
    }
  });
  it('difficulty table: Easy slowest, Hard fastest, at the field mid-skill', () => {
    expect(paceGap('easy', DIFFICULTY.easy.skill)).toBeCloseTo(AI_PACE.easy.gap, 9);
    expect(AI_PACE.easy.gap).toBeGreaterThan(AI_PACE.normal.gap);
    expect(AI_PACE.normal.gap).toBeGreaterThan(AI_PACE.hard.gap);
  });
  it('clean solo laps: no wall hits or off-track at any difficulty, laps not identical', () => {
    for (const d of ['easy', 'hard']) {
      const s = soloLaps(T, null, { laps: 3, gap: AI_PACE[d].gap, variation: AI_PACE[d].variation, difficulty: d });
      expect(s.hits).toBe(0); expect(s.off).toBe(0);
      expect(new Set(s.times).size).toBeGreaterThan(1);
    }
  }, 60000);
});
