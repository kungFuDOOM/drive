import { describe, it, expect, beforeAll } from 'vitest';
import * as THREE from 'three';
import { Track } from '../track.js';
import { CITADEL } from '../tracks/citadel.js';
import { HIGHPINE } from '../tracks/highpine.js';
import { COASTAL } from '../tracks/coastal.js';
import { createCircuitDay, sectorize } from './circuitDay.js';
import { createAlpine } from './alpine.js';
import { createCoastal } from './coastal.js';

function stubDocument() {
  const ctx = new Proxy({}, { get: (t, k) => (k === 'measureText' ? () => ({ width: 10 }) : () => {}), set: () => true });
  globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx, style: {} }) };
}

const treeMeshes = (theme) => {
  const out = [];
  for (const t of theme.group.userData.trees) { out.push(...t.meshes); if (t.lod) out.push(t.lod); }
  return out;
};
const finiteSphere = (m) => !!m.boundingSphere && Number.isFinite(m.boundingSphere.radius) && m.boundingSphere.radius > 0
  && [m.boundingSphere.center.x, m.boundingSphere.center.y, m.boundingSphere.center.z].every(Number.isFinite);

describe('sectorize', () => {
  it('keeps every placement exactly once and folds sparse cells into a neighbour', () => {
    const list = [];
    for (let i = 0; i < 200; i++) list.push({ x: (i % 20) * 30, z: Math.floor(i / 20) * 30 }); // 600 x 300 m block
    list.push({ x: 2000, z: 2000 }); // a lone straggler
    const parts = sectorize(list, 250, 12);
    expect(parts.length).toBeGreaterThan(1);
    expect(parts.reduce((n, p) => n + p.length, 0)).toBe(list.length);
    expect(new Set(parts.flat()).size).toBe(list.length);
    for (const p of parts) expect(p.length).toBeGreaterThanOrEqual(12);
  });
});

describe('tree culling, LOD and shadow casters', () => {
  const built = {};
  beforeAll(() => {
    stubDocument();
    for (const [id, make, def] of [['citadel', createCircuitDay, CITADEL], ['highpine', createAlpine, HIGHPINE], ['coastal', createCoastal, COASTAL]]) {
      const scene = new THREE.Scene();
      const theme = make();
      theme.build(scene, new Track(def));
      built[id] = { scene, theme, track: new Track(def) };
    }
  }, 60000);

  for (const id of ['citadel', 'highpine', 'coastal']) {
    it(`${id}: every visible Medium/High tree InstancedMesh is frustum-culled with a finite bounding sphere`, () => {
      const { theme } = built[id];
      for (const q of [1, 2]) {
        theme.setQuality(q);
        const vis = treeMeshes(theme).filter((m) => m.visible);
        expect(vis.length).toBeGreaterThan(6);
        for (const m of vis) {
          expect(m.isInstancedMesh).toBe(true);
          expect(m.frustumCulled).toBe(true);
          expect(finiteSphere(m)).toBe(true);
        }
        // the per-tree contact discs are sectored the same way
        for (const m of theme.group.userData.treeAO.hi) { expect(m.frustumCulled).toBe(true); expect(finiteSphere(m)).toBe(true); }
      }
    });

    it(`${id}: no Low baked foliage casts shadows, and the bake stays within 6 meshes`, () => {
      const { scene, theme } = built[id];
      theme.setQuality(0);
      const low = [];
      scene.traverse((o) => { if (o.name === 'lowBake' && o.visible) low.push(o); });
      expect(low.length).toBeGreaterThan(0);
      expect(low.length).toBeLessThanOrEqual(6);
      const foliage = low.filter((m) => m.userData.bake === 'foliage');
      expect(foliage.length).toBeGreaterThan(0);
      for (const m of foliage) expect(m.castShadow).toBe(false);
      // Low contact discs sit under exactly the baked trees
      expect(theme.group.userData.treeAO.low.visible).toBe(true);
      for (const m of theme.group.userData.treeAO.hi) expect(m.visible).toBe(false);
    });
  }

  it('far-card trees (Medium/High) never cast shadows', () => {
    for (const id of ['citadel', 'highpine']) {
      const { theme } = built[id];
      theme.setQuality(2);
      for (const t of theme.group.userData.trees) {
        if (t.far) for (const m of t.meshes) expect(m.castShadow).toBe(false);
        if (t.lod) expect(t.lod.castShadow).toBe(false);
      }
    }
  });

  it('Low bakes far cards on the LOD themes (far fewer triangles than the instanced trees)', () => {
    const { scene, theme } = built.citadel;
    theme.setQuality(0);
    let baked = 0;
    scene.traverse((o) => { if (o.name === 'lowBake' && o.userData.bake === 'foliage') baked += o.geometry.attributes.position.count / 3; });
    let full = 0;
    for (const t of theme.group.userData.trees) for (const m of t.meshes) {
      const g = m.geometry; full += (g.index ? g.index.count : g.attributes.position.count) / 3 * t.n;
    }
    expect(baked).toBeGreaterThan(0);
    expect(baked).toBeLessThan(full * 0.4 / 5);
  });

  it('distance LOD keeps full trees within 150 m of the camera and swaps distant sectors to cards', () => {
    const { theme, track } = built.citadel;
    theme.setQuality(2);
    const cam = new THREE.PerspectiveCamera(60, 16 / 9, 0.1, 3000);
    const p = track.at(0, 0);
    cam.position.set(p.x, p.y + 3, p.z); cam.updateMatrixWorld();
    theme.update(1 / 60, cam);
    let swapped = 0;
    for (const t of theme.group.userData.trees) {
      if (!t.lod) continue;
      const bs = t.lod.boundingSphere, near = cam.position.distanceTo(bs.center) - bs.radius < 150;
      for (const m of t.meshes) expect(m.visible).toBe(near);
      expect(t.lod.visible).toBe(!near);
      if (!near) swapped++;
      // every tree inside 150 m belongs to a full-detail mesh
      if (!near) for (const o of t.spots) expect(Math.hypot(o.x - cam.position.x, o.y - cam.position.y, o.z - cam.position.z)).toBeGreaterThan(150);
    }
    expect(swapped).toBeGreaterThan(0);
    // back to Medium: setQuality restores the full meshes until the next update
    theme.setQuality(1);
    for (const t of theme.group.userData.trees) for (const m of t.meshes) expect(m.visible).toBe(true);
  });
});
