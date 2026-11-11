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
const BEFORE = {
  citadel: { 0: { tris: 1679736, shadow: 79 }, 1: { tris: 1393668, shadow: 111 }, 2: { tris: 1710936, shadow: 111 } },
  highpine: { 0: { tris: 1563592, shadow: 76 }, 1: { tris: 1287512, shadow: 112 }, 2: { tris: 1571992, shadow: 112 } },
  dripwood: { 0: { tris: 1543372, shadow: 75 }, 1: { tris: 1285132, shadow: 107 }, 2: { tris: 1574572, shadow: 107 } },
  desert: { 0: { tris: 619358, shadow: 82 }, 1: { tris: 551806, shadow: 99 }, 2: { tris: 630158, shadow: 99 } },
  lampwick: { 0: { tris: 302920, shadow: 80 }, 1: { tris: 267184, shadow: 100 }, 2: { tris: 302920, shadow: 100 } },
  coastal: { 0: { tris: 1163008, shadow: 77 }, 1: { tris: 993988, shadow: 97 }, 2: { tris: 1187008, shadow: 97 } },
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
