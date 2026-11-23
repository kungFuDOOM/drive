// PR 23 follow-up: volumetric tree LODs, smoother car bodies per quality tier.
import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { broadleaf, conifer, palm, farTree, cardSided, leafNormalAtlas, paintAtlas, SOLID, ATLAS } from './themes/foliage.js';
import { bodyGeometry, wheelGeometry, makeCar, setBodyLod } from './cars.js';
import { GFX_PRESETS } from './gfx.js';
import { TEAMS } from './teams.js';

const tris = (g) => (g ? (g.index ? g.index.count : g.attributes.position.count) / 3 : 0);
/** triangles whose three vertices all sample one texel (the solid crown body) */
function solidTris(g, uv) {
  const a = g.attributes.uv; let n = 0;
  for (let i = 0; i < a.count; i += 3) if ([0, 1, 2].every((k) => Math.abs(a.getX(i + k) - uv[0]) < 1e-6 && Math.abs(a.getY(i + k) - uv[1]) < 1e-6)) n++;
  return n;
}
/** spread of triangle-centroid distances from the crown axis / centre, relative to the crown radius: flat cards through the middle score low */
function horizontalSpread(g) {
  const p = g.attributes.position, az = new Set();
  for (let i = 0; i < p.count; i += 3) {
    const x = (p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3, z = (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3;
    if (Math.hypot(x, z) > 0.3) az.add(Math.floor(((Math.atan2(z, x) + Math.PI) / (Math.PI * 2)) * 12) % 12);
  }
  return az.size;
}

describe('foliage cards are single quads drawn two-sided', () => {
  it('no card geometry holds a reversed duplicate of a triangle', () => {
    for (const t of [broadleaf(3), conifer(3, { snow: true }), palm(3), farTree('broadleaf'), farTree('conifer')]) for (const g of [t.cards, t.snow]) {
      if (!g) continue;
      const p = g.attributes.position, seen = new Set();
      for (let i = 0; i < p.count; i += 3) {
        const key = [0, 1, 2].map((k) => [p.getX(i + k), p.getY(i + k), p.getZ(i + k)].map((v) => v.toFixed(4)).join(',')).sort().join('|');
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    }
  });
  it('cardSided makes the material two-sided, keeps the unflipped crown normal and survives a Low-bake clone', () => {
    const m = cardSided(new THREE.MeshStandardMaterial({ map: new THREE.Texture() }), 0.8);
    expect(m.side).toBe(THREE.DoubleSide);
    const sh = { uniforms: {}, vertexShader: '#include <common>', fragmentShader: '#include <common>\n#include <normal_fragment_maps>' };
    m.onBeforeCompile(sh, null);
    expect(sh.fragmentShader.startsWith('#undef DOUBLE_SIDED')).toBe(true);
    expect(sh.fragmentShader).toContain('tLeafN');
    expect(sh.uniforms.tLeafN.value).toBe(leafNormalAtlas());
    const plain = cardSided(new THREE.MeshStandardMaterial(), 0);
    expect(plain.customProgramCacheKey()).not.toBe(m.customProgramCacheKey());
    const c = m.clone(); // Material.clone() drops onBeforeCompile; the bake re-applies it from userData
    expect(c.userData.cardSided).toBe(0.8);
  });
  it('the leaf normal atlas bulges (non-flat) in the LEAF cell and is flat at the solid texels', () => {
    const A = paintAtlas();
    let dev = 0, n = 0;
    for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) { const k = y * 256 + x; if (A.alpha[k] > 0.5) { dev += Math.hypot(A.nx[k], A.ny[k]); n++; } }
    expect(dev / n).toBeGreaterThan(0.3);
    for (const [u, v] of [SOLID.LEAF, SOLID.BOUGH]) {
      const k = Math.floor(v * 256) * 256 + Math.floor(u * 256);
      expect(A.alpha[k]).toBe(1);
      expect(Math.hypot(A.nx[k], A.ny[k])).toBeLessThan(1e-6);
    }
    expect(SOLID.LEAF[0]).toBeGreaterThan(ATLAS.LEAF[0]); expect(SOLID.BOUGH[0]).toBeGreaterThan(ATLAS.BOUGH[0]);
  });
});

describe('tree volume', () => {
  it('far LOD: a solid crown body plus a card shell that surrounds it, within 48 triangles', () => {
    for (const [kind, uv] of [['broadleaf', SOLID.LEAF], ['conifer', SOLID.BOUGH]]) for (const seed of [1, 2, 5]) {
      const g = farTree(kind, { seed }).cards, body = solidTris(g, uv);
      expect(tris(g)).toBeLessThanOrEqual(48);
      expect(body).toBeGreaterThanOrEqual(6);            // closed middle from any angle
      expect(tris(g) - body).toBeGreaterThanOrEqual(15); // outline-breaking cards
      expect(horizontalSpread(g)).toBeGreaterThanOrEqual(10); // geometry on every side of the trunk axis, not two crossed planes
    }
  });
  it('far LOD follows the dims of its variant (no size pop at the swap)', () => {
    const size = (g) => { g.computeBoundingBox(); return g.boundingBox.getSize(new THREE.Vector3()); };
    for (const [make, kind, dims] of [[broadleaf, 'broadleaf', { h: 8.2, r: 2.1, squash: 1.2 }], [broadleaf, 'broadleaf', { h: 6.8, r: 3.0, squash: 0.7 }], [conifer, 'conifer', { h: 8.2, r: 1.8, droop: 0.32 }], [conifer, 'conifer', { h: 5.6, r: 1.7, droop: 0.28 }]]) {
      const full = make(4, dims), far = farTree(kind, { ...full.dims, seed: 2 });
      expect(full.dims.h).toBe(dims.h);
      full.cards.computeBoundingBox(); far.cards.computeBoundingBox();
      expect(Math.abs(far.cards.boundingBox.max.y - full.cards.boundingBox.max.y)).toBeLessThan(dims.h * 0.12);
      const a = size(full.cards), b = size(far.cards);
      expect(b.x / a.x).toBeGreaterThan(0.6); expect(b.x / a.x).toBeLessThan(1.4);
    }
  });
  it('broadleaf crowns are lobed: the solid core is several separate blobs, wrapped in at least 40 cards', () => {
    for (const seed of [1, 7, 23]) {
      const t = broadleaf(seed);
      expect(tris(t.core)).toBe(100); // 5 lobes x 20
      expect(tris(t.cards) / 2).toBeGreaterThanOrEqual(40);
      t.core.computeBoundingBox(); t.cards.computeBoundingBox();
      // the leaf shell reaches past the solid lobes on every side
      expect(t.cards.boundingBox.max.x).toBeGreaterThan(t.core.boundingBox.max.x); expect(t.cards.boundingBox.min.x).toBeLessThan(t.core.boundingBox.min.x);
      expect(t.cards.boundingBox.max.y).toBeGreaterThan(t.core.boundingBox.max.y);
    }
  });
});

describe('car body LOD by quality tier', () => {
  it('Low uses the lighter body, Medium / High the 2x loft', () => {
    expect(GFX_PRESETS.low.bodyLod).toBe(1); expect(GFX_PRESETS.medium.bodyLod).toBe(0); expect(GFX_PRESETS.high.bodyLod).toBe(0);
    for (const cls of ['gp', 'speedway']) for (let i = 0; i < TEAMS.length; i++) {
      const hi = bodyGeometry(cls, TEAMS[i], i, 0), lo = bodyGeometry(cls, TEAMS[i], i, 1);
      expect(tris(lo)).toBeLessThan(1400);
      expect(tris(hi)).toBeGreaterThan(tris(lo) * 1.25);
      expect(bodyGeometry(cls, TEAMS[i], i, 0)).toBe(hi); expect(hi).not.toBe(lo); // cached per LOD
      hi.computeBoundingBox(); lo.computeBoundingBox();
      expect(hi.boundingBox.max.distanceTo(lo.boundingBox.max)).toBeLessThan(0.02); // same car, same size
    }
  });
  it('a 10-car High field stays under 100k triangles (bodies + wheels)', () => {
    for (const cls of ['gp', 'speedway']) {
      let n = 0;
      for (let i = 0; i < 10; i++) n += tris(bodyGeometry(cls, TEAMS[i % TEAMS.length], i % TEAMS.length, 0)) + 4 * tris(wheelGeometry(cls, TEAMS[i % TEAMS.length], 'dry', 0));
      expect(n).toBeLessThan(100000);
    }
  });
  it('setBodyLod + car.syncBodyLod swap an existing car without adding draws', () => {
    setBodyLod(0);
    const car = makeCar('gp', TEAMS[2], false, false, 2), hi = car.body.geometry;
    setBodyLod(1); car.syncBodyLod();
    expect(car.body.geometry).not.toBe(hi);
    expect(tris(car.body.geometry)).toBeLessThan(1400);
    let meshes = 0; car.group.traverse((o) => { if (o.isMesh) meshes++; });
    expect(meshes).toBe(4);
    setBodyLod(0); car.syncBodyLod();
    expect(car.body.geometry).toBe(hi);
  });
});
