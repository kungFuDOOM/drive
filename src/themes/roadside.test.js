import { describe, it, expect, beforeAll } from 'vitest';
import * as THREE from 'three';
import { Track } from '../track.js';
import { CITADEL } from '../tracks/citadel.js';
import { createCircuitDay } from './circuitDay.js';
import { broadleaf, conifer } from './foliage.js';

function stubDocument() {
  const ctx = new Proxy({}, { get: (t, k) => (k === 'measureText' ? () => ({ width: 10 }) : () => {}), set: () => true });
  globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx, style: {} }) };
}

/** mean vertex luminance of a card geometry near the trunk axis / crown centre (core) vs out at its skin (rim) */
function coreVsRim(geo, radial) {
  const p = geo.getAttribute('position'), c = geo.getAttribute('color');
  geo.computeBoundingBox();
  const bb = geo.boundingBox, cy = (bb.min.y + bb.max.y) / 2, R = Math.max(bb.max.x, bb.max.z, -bb.min.x, -bb.min.z), H = (bb.max.y - bb.min.y) / 2;
  let core = 0, nc = 0, rim = 0, nr = 0;
  for (let i = 0; i < p.count; i += 3) { // per triangle (centroid)
    let x = 0, y = 0, z = 0, l = 0;
    for (let k = i; k < i + 3; k++) { x += p.getX(k) / 3; y += p.getY(k) / 3; z += p.getZ(k) / 3; l += (0.2126 * c.getX(k) + 0.7152 * c.getY(k) + 0.0722 * c.getZ(k)) / 3; }
    if (!radial && y < cy) continue; // crown undersides are darkened separately
    if (radial && (y < bb.min.y + H * 0.3 || y > bb.min.y + H * 0.9)) continue; // one band of the cone (it narrows with height)
    const d = radial ? Math.hypot(x, z) / R : Math.hypot(x / R, (y - cy) / H, z / R);
    if (d < 0.35) { core += l; nc++; } else if (d > 0.55) { rim += l; nr++; }
  }
  return { core: core / nc, rim: rim / nr, nc, nr };
}

describe('roadside world (trees, stands, buildings, barriers)', () => {
  let scene;
  const all = (n) => { const out = []; scene.traverse((o) => { if (o.name === n) out.push(o); }); return out; };
  beforeAll(() => {
    stubDocument();
    scene = new THREE.Scene();
    createCircuitDay().build(scene, new Track(CITADEL));
  }, 60000);

  it('tree crowns are baked with a darker core and a lighter rim', () => {
    for (const [name, g, radial] of [['broadleaf', broadleaf(3), false], ['conifer', conifer(3), true]]) {
      const r = coreVsRim(g.cards, radial);
      expect(r.nc, name).toBeGreaterThan(0); expect(r.nr, name).toBeGreaterThan(0);
      expect(r.rim, name).toBeGreaterThan(r.core * 1.12);
    }
  });

  it('the crowd wears muted clothing with a minority of saturated team-colour fans', () => {
    const body = all('crowd')[0], col = body.instanceColor, hsl = {}, c = new THREE.Color();
    let sat = 0, vivid = 0;
    for (let i = 0; i < body.count; i++) { c.fromBufferAttribute(col, i).getHSL(hsl); sat += hsl.s; if (hsl.s > 0.55) vivid++; }
    expect(sat / body.count).toBeLessThan(0.36);
    expect(vivid / body.count).toBeGreaterThan(0.02);
    expect(vivid / body.count).toBeLessThan(0.25);
  });

  it('barriers, props and facades carry per-vertex surfaces; Armco / steel is metallic, concrete is not', () => {
    for (const n of ['walls', 'props', 'facades']) {
      const m = all(n)[0], a = m.geometry.getAttribute('aSurf');
      expect(a, n).toBeTruthy();
      expect(a.count, n).toBe(m.geometry.getAttribute('position').count);
      let metal = 0, plain = 0;
      for (let i = 0; i < a.count; i++) { const x = a.getX(i); expect(x).toBeGreaterThanOrEqual(0); expect(x).toBeLessThanOrEqual(1); if (x >= 0.6) metal++; else if (x === 0) plain++; }
      expect(metal, n).toBeGreaterThan(0);
      expect(plain, n).toBeGreaterThan(0);
    }
    expect(all('walls')[0].material).toBe(all('props')[0].material); // one program, no extra draws
  });

  it('glazing is smooth and reflective, tyre walls are matte rubber', () => {
    const glass = all('glass')[0].material;
    expect(glass.roughness).toBeLessThanOrEqual(0.12);
    expect(glass.metalness).toBeGreaterThanOrEqual(0.6);
    const tyres = all('tirewall')[0] || all('tyrewall')[0] || all('tires')[0];
    if (tyres) { expect(tyres.material.roughness).toBeGreaterThanOrEqual(0.9); expect(tyres.material.metalness).toBe(0); }
  });
});
