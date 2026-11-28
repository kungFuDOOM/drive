// Cheap cars for the replay: two instanced meshes (coloured body, dark wheels and wings), so 200 cars are 2 draw calls.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export const REPLAY_CAR_LENGTH = 5.4;
const box = (w, h, l, x, y, z) => new THREE.BoxGeometry(w, h, l).translate(x, y, z);

export function createReplayCars(colors) {
  const body = mergeGeometries([box(1.3, 0.55, 3, 0, 0.65, -0.35), box(0.55, 0.35, 2, 0, 0.55, 1.9), box(0.5, 0.3, 0.9, 0, 1.05, -0.6)]);
  const dark = mergeGeometries([
    ...[[-1, 1.55], [1, 1.55], [-1, -1.6], [1, -1.6]].map(([x, z]) => box(0.45, 0.75, 0.95, x * 0.95, 0.4, z)),
    box(2, 0.18, 0.55, 0, 0.35, 2.65), box(1.7, 0.18, 0.5, 0, 1.15, -2.2),
  ]);
  const make = (geo, color) => {
    const m = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color, fog: false }), Math.max(1, colors.length));
    m.count = colors.length;
    m.frustumCulled = false; // instances move all over the circuit
    return m;
  };
  const bodies = make(body, 0xffffff), darks = make(dark, 0x0b0d10);
  const c = new THREE.Color();
  colors.forEach(({ h, s, l }, i) => bodies.setColorAt(i, c.setHSL(h, s, l, THREE.SRGBColorSpace)));
  const group = new THREE.Group();
  group.add(bodies, darks);
  const o = new THREE.Object3D();
  o.rotation.order = 'YXZ';
  return {
    group,
    /** pose: { x, y, z, theta, pitch }, or null to hide car i. */
    set(i, pose, scale) {
      if (pose) { o.position.set(pose.x, pose.y, pose.z); o.rotation.set(-pose.pitch, pose.theta, 0); o.scale.setScalar(scale); }
      else o.scale.setScalar(0);
      o.updateMatrix();
      bodies.setMatrixAt(i, o.matrix); darks.setMatrixAt(i, o.matrix);
    },
    commit() { bodies.instanceMatrix.needsUpdate = darks.instanceMatrix.needsUpdate = true; },
    dispose() { for (const m of [bodies, darks]) { m.geometry.dispose(); m.material.dispose(); m.dispose(); } },
  };
}
