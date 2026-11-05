import { describe, it, expect, beforeAll } from 'vitest';
import * as THREE from 'three';
import { Track } from '../track.js';
import { createCircuitDay } from './circuitDay.js';

// the theme draws brand textures with a 2D canvas; a stub is enough for headless geometry building
function stubDocument() {
  const ctx = new Proxy({}, { get: (t, k) => (k === 'measureText' ? () => ({ width: 10 }) : () => {}), set: () => true });
  globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx, style: {} }) };
}

describe('theme prop placement', () => {
  const T = new Track();
  let theme;
  beforeAll(() => { stubDocument(); theme = createCircuitDay(); theme.build(new THREE.Scene(), T); }, 60000);

  const pts = (p) => {
    if (p.r != null) return [[p.x, p.z]];
    const sx = Math.cos(p.yaw), sz = -Math.sin(p.yaw), fx = Math.sin(p.yaw), fz = Math.cos(p.yaw), out = [];
    for (let a = 0; a <= 4; a++) for (let b = 0; b <= Math.max(2, Math.ceil(p.l / 4)); b++) {
      const u = (a / 4 - 0.5) * p.w, v = (b / Math.max(2, Math.ceil(p.l / 4)) - 0.5) * p.l;
      out.push([p.x + sx * u + fx * v, p.z + sz * u + fz * v]);
    }
    return out;
  };

  it('registers a healthy set of props of every kind', () => {
    const kinds = new Set(theme.placements.map((p) => p.kind));
    for (const k of ['stand', 'tree', 'billboard', 'marshal', 'flag', 'ferris', 'tent', 'gatehouse', 'keep', 'wallseg']) expect(kinds.has(k), k).toBe(true);
  });
  it('no prop is inside the road + run-off corridor of ANY track sample', () => {
    const bad = [];
    for (const p of theme.placements) {
      if (p.exempt) continue;
      const rad = p.r ?? 0;
      for (const [x, z] of pts(p)) {
        const c = T.clearance(x, z) - rad;
        if (c < 0.5) { bad.push(`${p.kind}@${p.x.toFixed(0)},${p.z.toFixed(0)} clr=${c.toFixed(2)}`); break; }
      }
    }
    expect(bad).toEqual([]);
  });
  it('Citadel Squeeze: gatehouse towers, keep and curtain walls all pass the clearance check (none touch the road)', () => {
    const cit = theme.placements.filter((p) => ['gatehouse', 'keep', 'wallseg'].includes(p.kind));
    expect(cit.filter((p) => p.kind === 'gatehouse').length).toBe(2);
    for (const p of cit) for (const [x, z] of pts(p)) expect(T.clearance(x, z), `${p.kind}`).toBeGreaterThan(0.5);
  });
  it('every grandstand keeps its whole footprint clear of the squeeze section too', () => {
    for (const p of theme.placements.filter((q) => q.kind === 'stand')) for (const [x, z] of pts(p)) {
      for (let i = 0; i < T.n; i++) {
        if (T.sectionName(i) !== 'Citadel Squeeze') continue;
        expect(Math.hypot(x - T.px[i], z - T.pz[i])).toBeGreaterThan(T.half[i] + 1);
      }
    }
  });
  it('props sit on the terrain: base height matches the highest ground under the footprint (footing covers the rest)', () => {
    for (const p of theme.placements) {
      if (p.exempt || p.y == null) continue;
      for (const [x, z] of pts(p)) expect(theme.groundAt(x, z), `${p.kind}@${p.x.toFixed(0)},${p.z.toFixed(0)}`).toBeLessThanOrEqual(p.y + 0.4);
      expect(p.y - p.lo).toBeGreaterThanOrEqual(0);
    }
  });
});
