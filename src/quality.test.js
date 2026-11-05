import { describe, it, expect } from 'vitest';
import { QualityGovernor } from './quality.js';
const run = (g, secs, fps) => { let ch = null; for (let t = 0; t < secs; t += 0.1) { const r = g.update(0.1, fps); if (r !== null) ch = r; } return ch; };
describe('QualityGovernor', () => {
  it('drops only after 3 s continuously under 45 fps', () => {
    const g = new QualityGovernor();
    expect(run(g, 2.5, 30)).toBeNull();
    expect(run(g, 1, 30)).toBe(1);
  });
  it('a recovery blip resets the low timer', () => {
    const g = new QualityGovernor();
    run(g, 2.5, 30); run(g, 0.2, 50); expect(run(g, 2.5, 30)).toBeNull();
  });
  it('raises only after 10 s over 58 fps, one level at a time', () => {
    const g = new QualityGovernor({ level: 0 });
    expect(run(g, 9.5, 60)).toBeNull();
    expect(run(g, 1, 60)).toBe(1);
    expect(g.level).toBe(1);
  });
  it('does not oscillate between 45 and 58 fps and clamps', () => {
    const g = new QualityGovernor({ level: 1 });
    expect(run(g, 60, 52)).toBeNull();
    const h = new QualityGovernor({ level: 0 }); expect(run(h, 10, 10)).toBeNull();
    const m = new QualityGovernor({ level: 2 }); expect(run(m, 20, 60)).toBeNull();
  });
});
