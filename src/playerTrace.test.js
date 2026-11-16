// Golden player trace: AI work must never change player physics. The human branch of Race._stepCar is driven for 60 s
// in time-trial mode by a fixed open-loop input script and a geometry-only lapping script, on Citadel and Lampwick,
// dry and wet. x, z, theta, v at 10 checkpoints must match values captured from main before the AI rework (1e-6).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { Track } from './track.js';
import { trackDef } from './tracks/index.js';
import { playerTrace } from './playerTrace.js';

const GOLDEN = JSON.parse(readFileSync(new URL('./playerTrace.golden.json', import.meta.url), 'utf8'));

describe('golden player trace', () => {
  for (const key of Object.keys(GOLDEN)) {
    const [id, weather, script] = key.split('/');
    it(`${key} matches the captured trace`, () => {
      const got = playerTrace(new Track(trackDef(id)), weather, 60, script);
      const want = GOLDEN[key];
      expect(got.length).toBe(want.length);
      for (let i = 0; i < want.length; i++) for (let j = 0; j < 4; j++) expect(Math.abs(got[i][j] - want[i][j])).toBeLessThan(1e-6);
    }, 30000);
  }
});
