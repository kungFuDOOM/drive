// The driver guide: ONE low ribbon mesh following the racing line (colours from racingLine.fillGuide, typed buffers only).
import * as THREE from 'three';
import { fillGuide, guideSamples, GUIDE_AHEAD, GUIDE_BACK } from './racingLine.js';

export function createLineGuide(track, cls) {
  const n = guideSamples(track), pos = new Float32Array(n * 6), col = new Float32Array(n * 8);
  const idx = new Uint16Array((n - 1) * 6);
  for (let k = 0; k < n - 1; k++) { const a = k * 2; idx.set([a, a + 1, a + 2, a + 1, a + 3, a + 2], k * 6); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  g.setAttribute('color', new THREE.BufferAttribute(col, 4).setUsage(THREE.DynamicDrawUsage));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  const mat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false, polygonOffset: true, polygonOffsetFactor: -8, polygonOffsetUnits: -8 });
  const mesh = new THREE.Mesh(g, mat);
  mesh.frustumCulled = false; mesh.renderOrder = 3; mesh.visible = false; mesh.name = 'line-guide';
  const status = { enabled: false, level: 0, reds: 0, yellows: 0, greens: 0, v: 0, s: 0 };
  return {
    mesh, status, n, ahead: GUIDE_AHEAD, back: GUIDE_BACK,
    /** refresh the ribbon for a car at path distance s, speed v (m/s), grip */
    update(s, v, grip) {
      if (!mesh.visible) return;
      fillGuide(track, cls, s, v, grip, pos, col, n);
      g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true;
      let r = 0, y = 0, gr = 0;
      for (let k = 0; k < n; k++) { const o = k * 8; if (col[o + 3] < 0.3) continue; if (col[o] > 0.9 && col[o + 1] < 0.5) r++; else if (col[o] > 0.9) y++; else gr++; }
      status.reds = r; status.yellows = y; status.greens = gr; status.v = v; status.s = s;
      status.level = r > 2 ? 2 : y > 2 ? 1 : 0;
    },
    setEnabled(on) { status.enabled = !!on; mesh.visible = !!on; },
  };
}
