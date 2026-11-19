import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { Track } from '../track.js';
import { TRACKS } from '../tracks/index.js';
import { createTheme } from './index.js';

function stubDocument() {
  const ctx = new Proxy({}, { get: (t, k) => (k === 'measureText' ? () => ({ width: 10 }) : () => {}), set: () => true });
  globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx, style: {} }) };
}

function cost(scene) {
  let tris = 0, shadow = 0;
  scene.traverse((o) => {
    if (!o.isMesh && !o.isPoints && !o.isLine) return;
    const g = o.geometry;
    if (g && o.isMesh) {
      const base = g.index ? g.index.count / 3 : (g.attributes.position ? g.attributes.position.count / 3 : 0);
      tris += base * (o.isInstancedMesh ? o.count : 1);
    }
    if (!o.visible || o.count === 0) return;
    shadow += 1 + (o.castShadow ? 1 : 0);
  });
  return { tris, shadow };
}

// Locked shadow-frame cost. The five gantry pods are one mesh, so this is four draws under the old per-lamp planes.
// Re-baselined for gfx task 1: trees, tree contact discs, rocks and tyre walls are split into frustum-culled sectors and
// Medium/High trees gain card LOD twins, so this uncullable sum went up on Medium/High while real frames draw far less;
// Low lost its baked-foliage shadow draw and gained the tyre sectors. The pit box itself is unchanged.
const BEFORE = {
  citadel: { 0: { tris: 1474788, shadow: 81 }, 1: { tris: 1149584, shadow: 330 }, 2: { tris: 1505988, shadow: 330 } },
  highpine: { 0: { tris: 1329884, shadow: 75 }, 1: { tris: 1024876, shadow: 330 }, 2: { tris: 1338284, shadow: 330 } },
  dripwood: { 0: { tris: 1357936, shadow: 75 }, 1: { tris: 1064584, shadow: 303 }, 2: { tris: 1389136, shadow: 303 } },
  desert: { 0: { tris: 593818, shadow: 91 }, 1: { tris: 524430, shadow: 181 }, 2: { tris: 604618, shadow: 181 } },
  lampwick: { 0: { tris: 301624, shadow: 78 }, 1: { tris: 265460, shadow: 120 }, 2: { tris: 301624, shadow: 120 } },
  coastal: { 0: { tris: 1140088, shadow: 85 }, 1: { tris: 967616, shadow: 271 }, 2: { tris: 1164088, shadow: 271 } },
};

describe('themed pit box stays inside the draw budget', () => {
  it('adds no draw calls on Low, Medium or High, and only a few hundred triangles', () => {
    stubDocument();
    for (const def of TRACKS) {
      const scene = new THREE.Scene();
      const theme = createTheme(def.theme);
      theme.build(scene, new Track(def));
      for (const q of [0, 1, 2]) {
        theme.setQuality(q);
        const got = cost(scene);
        const base = BEFORE[def.id][q];
        expect(got.shadow, `${def.id} q${q} draws`).toBe(base.shadow);
        expect(got.tris, `${def.id} q${q} tris`).toBe(base.tris);
      }
      theme.dispose();
    }
  }, 60000);
});
