import { describe, it, expect, beforeAll } from 'vitest';
import * as THREE from 'three';
import { Track } from '../track.js';
import { TRACKS } from '../tracks/index.js';
import { THEMES, createTheme } from './index.js';

function stubDocument() {
  const ctx = new Proxy({}, { get: (t, k) => (k === 'measureText' ? () => ({ width: 10 }) : () => {}), set: () => true });
  globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx, style: {} }) };
}
const pts = (p) => {
  if (p.r != null) return [[p.x, p.z]];
  const sx = Math.cos(p.yaw), sz = -Math.sin(p.yaw), fx = Math.sin(p.yaw), fz = Math.cos(p.yaw), out = [];
  const nb = Math.max(2, Math.ceil(p.l / 4));
  for (let a = 0; a <= 4; a++) for (let b = 0; b <= nb; b++) {
    const u = (a / 4 - 0.5) * p.w, v = (b / nb - 0.5) * p.l;
    out.push([p.x + sx * u + fx * v, p.z + sz * u + fz * v]);
  }
  return out;
};
const EXPECT = {
  citadel: ['ferris', 'keep', 'gatehouse'],
  highpine: ['lodge'],
  dripwood: ['tower'],
  desert: ['ferris', 'floodlight'],
  lampwick: ['arch', 'block'],
  coastal: ['lighthouse'],
};

describe('every track has a theme with the same interface', () => {
  it('each track names a registered theme', () => {
    for (const d of TRACKS) expect(THEMES[d.theme], d.id).toBeTypeOf('function');
  });
  for (const def of TRACKS) describe(`${def.name} (${def.theme})`, () => {
    const T = new Track(def);
    let theme, scene;
    beforeAll(() => { stubDocument(); scene = new THREE.Scene(); theme = createTheme(def.theme); theme.build(scene, T); }, 60000);
    it('implements the theme interface', () => {
      for (const k of ['build', 'dispose', 'setWeather', 'update', 'setStartLights', 'setCars', 'setPit', 'setQuality']) expect(theme[k], k).toBeTypeOf('function');
      expect(theme.name).toBe(def.theme);
      expect(theme.fx).toHaveProperty('tint');
    });
    it('has its landmark props and a full set of trackside props', () => {
      const kinds = new Set(theme.placements.map((p) => p.kind));
      for (const k of ['stand', 'tree', 'billboard', 'tent', ...EXPECT[def.id]]) expect(kinds.has(k), k).toBe(true);
    });
    it('no prop sits inside the road + run-off corridor of any sample', () => {
      const bad = [];
      for (const p of theme.placements) {
        if (p.exempt) continue;
        for (const [x, z] of pts(p)) { const c = T.clearance(x, z) - (p.r ?? 0); if (c < 0.5) { bad.push(`${p.kind}@${p.x.toFixed(0)},${p.z.toFixed(0)}`); break; } }
      }
      expect(bad).toEqual([]);
    });
    it('props sit on the terrain', () => {
      for (const p of theme.placements) {
        if (p.exempt || p.y == null) continue;
        for (const [x, z] of pts(p)) expect(theme.groundAt(x, z)).toBeLessThanOrEqual(p.y + 0.4);
      }
    });
    it('weather + update + dispose run without errors and restore the scene', () => {
      theme.setWeather({ rain: 1, wetness: 1 }); theme.setWeather({ rain: 0, wetness: 0 });
      const cam = new THREE.PerspectiveCamera(); cam.position.set(0, 10, 0);
      theme.update(1 / 60, cam, { x: 0, y: 0, z: 0, half: 80, dist: 30 });
      theme.dispose();
      expect(scene.children.length).toBe(0);
    });
  });
});
