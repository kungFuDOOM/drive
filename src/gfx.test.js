import { describe, it, expect } from 'vitest';
import { defaultGfx, GFX_PRESETS, GFX_LEVELS, normalizeGfx, pixelRatioFor } from './gfx.js';

describe('graphics quality', () => {
  it('auto-picks Low on phones, Medium on tablets, High on desktop', () => {
    expect(defaultGfx({ touch: true, width: 390, height: 844 })).toBe('low');
    expect(defaultGfx({ touch: true, width: 844, height: 390 })).toBe('low');
    expect(defaultGfx({ touch: true, width: 1180, height: 820 })).toBe('medium');
    expect(defaultGfx({ touch: false, width: 1280, height: 720 })).toBe('high');
  });
  it('Low has no SSAO, DPR 1, the smallest shadow map and the cheapest bloom', () => {
    const l = GFX_PRESETS.low;
    expect(l.ao).toBe('none'); expect(l.dprCap).toBe(1);
    for (const k of ['medium', 'high']) { expect(GFX_PRESETS[k].shadow).toBeGreaterThan(l.shadow); expect(GFX_PRESETS[k].bloom.scale).toBeGreaterThanOrEqual(l.bloom.scale); }
  });
  it('presets rise monotonically in cost', () => {
    const p = GFX_LEVELS.map((k) => GFX_PRESETS[k]);
    for (let i = 1; i < p.length; i++) { expect(p[i].dprCap).toBeGreaterThanOrEqual(p[i - 1].dprCap); expect(p[i].shadow).toBeGreaterThanOrEqual(p[i - 1].shadow); }
  });
  it('validates saved values and caps the pixel ratio', () => {
    expect(normalizeGfx('ultra')).toBeNull(); expect(normalizeGfx('medium')).toBe('medium');
    expect(pixelRatioFor(3, 'low')).toBe(1); expect(pixelRatioFor(3, 'high')).toBe(2); expect(pixelRatioFor(1, 'high')).toBe(1);
  });
});
