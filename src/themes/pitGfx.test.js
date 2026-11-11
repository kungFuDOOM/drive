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

// Shadow-frame cost before the themed pit box (merged into existing meshes). Triangle growth is the canopy, awnings and roof dressing.
const BEFORE = {
  citadel: { 0: { tris: 1685040, shadow: 83 }, 1: { tris: 1397584, shadow: 115 }, 2: { tris: 1716240, shadow: 115 } },
  highpine: { 0: { tris: 1562446, shadow: 80 }, 1: { tris: 1286366, shadow: 116 }, 2: { tris: 1570846, shadow: 116 } },
  dripwood: { 0: { tris: 1542170, shadow: 79 }, 1: { tris: 1283930, shadow: 111 }, 2: { tris: 1573370, shadow: 111 } },
  desert: { 0: { tris: 618104, shadow: 86 }, 1: { tris: 550552, shadow: 103 }, 2: { tris: 628904, shadow: 103 } },
  lampwick: { 0: { tris: 301566, shadow: 84 }, 1: { tris: 265830, shadow: 104 }, 2: { tris: 301566, shadow: 104 } },
  coastal: { 0: { tris: 1161894, shadow: 81 }, 1: { tris: 992874, shadow: 101 }, 2: { tris: 1185894, shadow: 101 } },
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
        expect(got.tris - base.tris, `${def.id} q${q} tris`).toBeLessThanOrEqual(800);
        expect(got.tris, `${def.id} q${q} tris`).toBeGreaterThanOrEqual(base.tris);
      }
      theme.dispose();
    }
  }, 60000);
});
