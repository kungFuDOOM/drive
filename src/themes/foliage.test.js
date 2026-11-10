import { describe, it, expect } from 'vitest';
import { leafAtlas, paintAtlas, ATLAS, broadleaf, conifer, palm, shrub, cactus, tuft, farTree } from './foliage.js';

const tris = (g) => (g ? (g.index ? g.index.count : g.attributes.position.count) / 3 : 0);

describe('leaf atlas', () => {
  it('is a 256x256 data texture', () => {
    const t = leafAtlas();
    expect(t.image.width).toBe(256);
    expect(t.image.height).toBe(256);
    expect(t.image.data.length).toBe(256 * 256 * 4);
  });
  const A = paintAtlas();
  const cells = { LEAF: [0, 0, 0.55, 0.65], BOUGH: [1, 0, 0.45, 0.55], FROND: [0, 1, 0.45, 0.55], TUFT: [1, 1, 0.3, 0.4] };
  for (const [name, [cx, cy, lo, hi]] of Object.entries(cells)) {
    it(`${name} coverage is ${lo}..${hi} with a transparent margin`, () => {
      let sum = 0, edge = 0;
      for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
        const a = A.alpha[(cy * 128 + y) * 256 + cx * 128 + x];
        sum += a;
        if (x < 3 || y < 3 || x >= 125 || y >= 125) edge = Math.max(edge, a);
      }
      const mean = sum / (128 * 128);
      expect(mean).toBeGreaterThanOrEqual(lo);
      expect(mean).toBeLessThanOrEqual(hi);
      expect(edge).toBe(0);
    });
  }
});

const inRect = (u, v, r) => u >= r[0] - 1e-5 && u <= r[2] + 1e-5 && v >= r[1] - 1e-5 && v <= r[3] + 1e-5;
const BUILDERS = {
  broadleaf: { make: (s) => broadleaf(s), cap: 300, rects: [ATLAS.LEAF] },
  conifer: { make: (s) => conifer(s, { snow: true }), cap: 240, snowCap: 120, rects: [ATLAS.BOUGH] },
  palm: { make: (s) => palm(s), cap: 200, rects: [ATLAS.FROND] },
  shrub: { make: (s) => shrub(s, { tuftMix: 0.4 }), cap: 60, rects: [ATLAS.LEAF, ATLAS.TUFT] },
  cactus: { make: (s) => cactus(s), cap: 320, rects: [ATLAS.LEAF, ATLAS.BOUGH, ATLAS.FROND, ATLAS.TUFT] },
  tuft: { make: (s) => tuft(s), cap: 12, rects: [ATLAS.TUFT] },
  farBroadleaf: { make: () => farTree('broadleaf'), cap: 48, rects: [ATLAS.LEAF], fixed: true },
  farConifer: { make: () => farTree('conifer'), cap: 48, rects: [ATLAS.BOUGH], fixed: true },
};

describe('tree builders', () => {
  for (const [name, b] of Object.entries(BUILDERS)) describe(name, () => {
    for (const seed of [1, 7, 23]) it(`seed ${seed}: within budget, well-formed, above ground`, () => {
      const t = b.make(seed);
      expect(tris(t.cards) + tris(t.core) + tris(t.trunk)).toBeLessThanOrEqual(b.cap);
      if (b.snowCap) expect(tris(t.snow)).toBeLessThanOrEqual(b.snowCap);
      for (const k of ['uv', 'normal', 'color']) expect(t.cards.attributes[k], k).toBeTruthy();
      const uv = t.cards.attributes.uv;
      for (let i = 0; i < uv.count; i++) expect(b.rects.some((r) => inRect(uv.getX(i), uv.getY(i), r)), `uv ${i}`).toBe(true);
      for (const g of [t.cards, t.core, t.trunk, t.snow]) {
        if (!g) continue;
        const pa = g.attributes.position;
        for (let i = 0; i < pa.array.length; i++) expect(Number.isFinite(pa.array[i])).toBe(true);
        g.computeBoundingBox();
        expect(g.boundingBox.min.y).toBeGreaterThanOrEqual(-0.05);
      }
    });
    if (!b.fixed) it('variants differ by seed', () => {
      const bb = (s) => { const t = b.make(s), g = t.cards.attributes.position.count > 3 ? t.cards : t.trunk; g.computeBoundingBox(); return g.boundingBox; };
      const a = bb(1), c = bb(7);
      expect(a.equals(c)).toBe(false);
    });
  });
});
