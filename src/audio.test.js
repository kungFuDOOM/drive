import { describe, it, expect } from 'vitest';
import { gearModel, GEARS } from './audio.js';

describe('gear model', () => {
  it('has 7 gears, rpm rises within a gear and drops on upshift', () => {
    let gear = 0, prev = gearModel(0, 90, 0), drops = 0, maxG = 0;
    for (let v = 0; v <= 90; v += 0.1) {
      const m = gearModel(v, 90, gear);
      if (m.gear > gear) { expect(m.rpm).toBeLessThan(prev.rpm - 0.2); drops++; }
      gear = m.gear; maxG = Math.max(maxG, gear); prev = m;
      expect(m.rpm).toBeGreaterThanOrEqual(0.19); expect(m.rpm).toBeLessThanOrEqual(1);
    }
    expect(maxG).toBe(GEARS - 1); expect(drops).toBe(GEARS - 1);
  });
});
