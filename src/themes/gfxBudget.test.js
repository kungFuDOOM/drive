import { describe, it, expect, beforeAll } from 'vitest';
import * as THREE from 'three';
import { Track } from '../track.js';
import { HIGHPINE } from '../tracks/highpine.js';
import { COASTAL } from '../tracks/coastal.js';
import { createAlpine } from './alpine.js';
import { createCoastal } from './coastal.js';

// Phone-landscape Low chase, 844×390, time trial, shadow map updating.
// Pre-pass baseline (e98dc77) max draw calls: Highpine 97, Coastal 92.
// The cap used by the graphics pass is that baseline plus 20.
export const LOW_PHONE_DRAW_BUDGET = { highpine: 97 + 20, coastal: 92 + 20 };
// Scene draws above the theme: one car, the racing line, brake boards and the Low post chain.
const FRAME_OVERHEAD = 20;

function stubDocument() {
  const ctx = new Proxy({}, { get: (t, k) => (k === 'measureText' ? () => ({ width: 10 }) : () => {}), set: () => true });
  globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx, style: {} }) };
}

/** Colour draws plus one extra draw per shadow caster (the Low shadow pass). Hidden meshes are skipped. */
function shadowFrameCost(scene) {
  let n = 0;
  scene.traverse((o) => {
    if (!o.isMesh && !o.isPoints && !o.isLine) return;
    if (!o.visible || o.count === 0) return;
    n += 1 + (o.castShadow ? 1 : 0);
  });
  return n;
}

function brightCount(scene, lo, hi) {
  const horizon = scene.getObjectByName('horizon');
  const pos = horizon.geometry.attributes.position, col = horizon.geometry.attributes.color;
  let mx = 0, mz = 0, n = 0;
  for (let i = 0; i < pos.count; i += 30) { mx += pos.getX(i); mz += pos.getZ(i); n++; }
  mx /= n; mz /= n;
  let bright = 0;
  for (let i = 0; i < pos.count; i++) {
    const r = Math.hypot(pos.getX(i) - mx, pos.getZ(i) - mz);
    if (r < lo || r > hi) continue;
    const lum = (col.getX(i) + col.getY(i) + col.getZ(i)) / 3;
    if (lum > 0.5) bright++;
  }
  return bright;
}

describe('Low draw-call budget (phone landscape)', () => {
  const built = {};
  beforeAll(() => {
    stubDocument();
    for (const [id, make, def] of [['highpine', createAlpine, HIGHPINE], ['coastal', createCoastal, COASTAL]]) {
      const scene = new THREE.Scene();
      const theme = make();
      theme.build(scene, new Track(def));
      built[id] = { scene, theme };
    }
  }, 60000);

  for (const id of ['highpine', 'coastal']) {
    it(`${id}: Low stays under the baseline + 20 draw budget`, () => {
      const { scene, theme } = built[id];
      theme.setQuality(0);
      // The chase view draws this whole shadow frame except frustum-culled props, so the sum plus overhead is a ceiling.
      expect(shadowFrameCost(scene) + FRAME_OVERHEAD).toBeLessThanOrEqual(LOW_PHONE_DRAW_BUDGET[id]);
      const low = [];
      scene.traverse((o) => { if (o.name === 'lowBake' && o.visible) low.push(o); });
      expect(low.length).toBeGreaterThan(0);
      expect(low.length).toBeLessThanOrEqual(6);
      for (const t of theme.group.userData.trees) for (const m of t.meshes) expect(m.visible).toBe(false);
      for (const m of theme.group.userData.rocks.meshes) expect(m.visible).toBe(false);
    });

    it(`${id}: Medium and High keep the instanced trees and rocks`, () => {
      const { scene, theme } = built[id];
      theme.setQuality(2);
      scene.traverse((o) => { if (o.name === 'lowBake') expect(o.visible).toBe(false); });
      let trees = 0;
      for (const t of theme.group.userData.trees) for (const m of t.meshes) if (m.visible) trees++;
      expect(trees).toBeGreaterThan(6);
      for (const m of theme.group.userData.rocks.meshes) expect(m.visible).toBe(true);
      theme.setQuality(1);
      scene.traverse((o) => { if (o.name === 'lowBake') expect(o.visible).toBe(false); });
      for (const t of theme.group.userData.trees) for (const m of t.meshes) expect(m.visible).toBe(true);
    });
  }
});

describe('Highpine peak snow', () => {
  let scene, theme;
  beforeAll(() => {
    stubDocument();
    scene = new THREE.Scene();
    theme = createAlpine();
    theme.build(scene, new Track(HIGHPINE));
  }, 60000);

  it('does not paint one-sample snow streaks on the near range', () => {
    expect(brightCount(scene, 790, 810)).toBe(0);
  });

  it('keeps the snow caps on the far range', () => {
    expect(brightCount(scene, 1000, 1020)).toBeGreaterThan(500);
  });
});
