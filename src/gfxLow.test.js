import { describe, it, expect } from 'vitest';
import { GFX_PRESETS, GFX_LEVELS, defaultGfx, pixelRatioFor } from './gfx.js';
import { QualityGovernor } from './quality.js';
import { ShadowCadence } from './perfStats.js';
import { wheelGeometry } from './cars.js';
import { TEAMS } from './teams.js';

const P = GFX_LEVELS.map((k) => GFX_PRESETS[k]);
describe('Low tier', () => {
  const l = GFX_PRESETS.low;
  it('has no AO, DPR cap 1, shadow <= 1024, FXAA, small bloom buffer', () => {
    expect(l.ao).toBe('none'); expect(l.aoScale).toBe(0); expect(l.dprCap).toBe(1); expect(pixelRatioFor(3, 'low')).toBe(1);
    expect(l.shadow).toBeLessThanOrEqual(1024); expect(l.aa).toBe('fxaa');
    expect(l.bloom.scale).toBeLessThanOrEqual(0.35); expect(l.bloom.threshold).toBeGreaterThanOrEqual(1);
    expect(l.shadowHz).toBe(30); expect(l.wheelLod).toBe(1);
    expect(new ShadowCadence(1 / l.shadowHz).interval).toBeCloseTo(1 / 30);
  });
  it('is the tier phones get; the governor can only step down from it', () => {
    expect(defaultGfx({ touch: true, width: 932, height: 430 })).toBe('low');
    expect(defaultGfx({ touch: true, width: 390, height: 844 })).toBe('low');
    const g = new QualityGovernor({ level: 0 }); g.max = 0;
    for (let i = 0; i < 600; i++) g.update(1 / 60, 60);
    expect(g.level).toBe(0);
  });
});
describe('preset fields', () => {
  it('every field exists on all three presets', () => {
    for (const k of ['dprCap', 'shadow', 'shadowHalf', 'shadowRadius', 'shadowHz', 'wheelLod', 'bloomMin', 'ao', 'aoScale', 'aa', 'props', 'bloom']) for (const p of P) expect(p[k], k).toBeDefined();
  });
  it('cost rises monotonically Low -> Medium -> High', () => {
    for (let i = 1; i < P.length; i++) {
      const a = P[i - 1], b = P[i];
      for (const k of ['dprCap', 'shadow', 'shadowRadius', 'shadowHz', 'aoScale', 'props']) expect(b[k], k).toBeGreaterThanOrEqual(a[k]);
      expect(b.bloom.scale).toBeGreaterThanOrEqual(a.bloom.scale); expect(b.wheelLod).toBeLessThanOrEqual(a.wheelLod);
      expect(b.shadowHalf).toBeLessThanOrEqual(a.shadowHalf); // costlier = tighter, sharper
    }
  });
});
describe('Low wheel LOD', () => {
  it('halves wheel triangles and keeps the same surface ids', () => {
    for (const cls of ['gp', 'speedway']) {
      const tri = (g) => (g.index ? g.index.count : g.attributes.position.count) / 3;
      const hi = wheelGeometry(cls, TEAMS[0], 'dry', 0), lo = wheelGeometry(cls, TEAMS[0], 'dry', 1);
      expect(tri(lo)).toBeLessThan(tri(hi) * 0.6); expect(tri(lo)).toBeGreaterThan(300); expect(lo).not.toBe(hi);
      expect(wheelGeometry(cls, TEAMS[0], 'dry', 1)).toBe(lo); // cached
    }
  });
});
