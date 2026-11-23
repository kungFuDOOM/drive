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
// gfx task 3: the 22 cloud billboards (1 draw, 44 tris) moved into the sky shader on the four cloudy themes.
// Volumetric crowns (lobed cores, single quads drawn two-sided) plus a slimmer far shell and 200 m tree sectors.
// Citadel Low's uncullable sum is below the previous lock. Medium/High draw counts follow the finer sectors and one
// far-scenery mesh per tree variant. Low draw counts are unchanged because those meshes stay hidden.
const BEFORE = {
  citadel: { 0: { tris: 1386513, shadow: 80 }, 1: { tris: 1077177, shadow: 522 }, 2: { tris: 1402113, shadow: 522 } },
  highpine: { 0: { tris: 1121958, shadow: 74 }, 1: { tris: 879980, shadow: 458 }, 2: { tris: 1126158, shadow: 458 } },
  dripwood: { 0: { tris: 1279688, shadow: 74 }, 1: { tris: 1002084, shadow: 440 }, 2: { tris: 1295288, shadow: 440 } },
  desert: { 0: { tris: 578334, shadow: 91 }, 1: { tris: 510730, shadow: 156 }, 2: { tris: 583734, shadow: 156 } },
  lampwick: { 0: { tris: 291260, shadow: 78 }, 1: { tris: 257662, shadow: 106 }, 2: { tris: 291260, shadow: 106 } },
  coastal: { 0: { tris: 974756, shadow: 84 }, 1: { tris: 831584, shadow: 329 }, 2: { tris: 986756, shadow: 329 } },
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
