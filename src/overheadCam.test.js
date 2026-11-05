import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { overheadRig, OV } from './overheadCam.js';

const pitchOf = (r) => {
  const d = [r.target[0] - r.pos[0], r.target[1] - r.pos[1], r.target[2] - r.pos[2]], len = Math.hypot(...d);
  return Math.asin(-d[1] / len) * 180 / Math.PI;
};
// Real three.js camera built from the rig, as main.js configures it.
const cameraFor = (r, aspect) => {
  const cam = new THREE.PerspectiveCamera(r.fov, aspect, 1, 5000);
  cam.position.set(...r.pos); cam.lookAt(...r.target); cam.updateMatrixWorld();
  return cam;
};
const CAR = { x: 10, y: 3, z: -20 };
/** Car's screen position, % of screen height from the top. */
const carPct = (aspect, yaw = 0.7) => {
  const r = overheadRig({ ...CAR, yaw, aspect });
  const ndc = new THREE.Vector3(CAR.x, CAR.y, CAR.z).project(cameraFor(r, aspect));
  return (1 - ndc.y) / 2 * 100;
};
/** Metres of ground visible ahead of the car, along its heading, up to the top edge of the frame. */
const groundAhead = (aspect, yaw = 0.7) => {
  const r = overheadRig({ ...CAR, yaw, aspect });
  const cam = cameraFor(r, aspect);
  const hit = new THREE.Vector3(0, 1, 0.5).unproject(cam).sub(cam.position);
  hit.multiplyScalar((CAR.y - cam.position.y) / hit.y).add(cam.position);
  return (hit.x - CAR.x) * Math.sin(yaw) + (hit.z - CAR.z) * Math.cos(yaw);
};

describe('overhead camera', () => {
  for (const [name, aspect] of [['landscape 932x430', 932 / 430], ['portrait 390x844', 390 / 844]]) {
    it(`${name}: pitch 40-50deg, FOV 30-35, behind the car`, () => {
      for (const yaw of [0, 1, 2.5, -2]) {
        const car = { x: 10, y: 3, z: -20, yaw, aspect };
        const r = overheadRig(car);
        const p = pitchOf(r);
        expect(p).toBeGreaterThanOrEqual(40); expect(p).toBeLessThanOrEqual(50);
        expect(r.fov).toBeGreaterThanOrEqual(30); expect(r.fov).toBeLessThanOrEqual(35);
        // camera is behind the car: (car - camera) projected on heading is positive, and camera is above
        const fwd = (car.x - r.pos[0]) * Math.sin(yaw) + (car.z - r.pos[2]) * Math.cos(yaw);
        expect(fwd).toBeGreaterThan(10);
        expect(r.pos[1]).toBeGreaterThan(car.y + 20);
        expect(r.height).toBeCloseTo(r.pos[1] - car.y, 6);
      }
    });
  }
  it('portrait keeps the pitch and just pulls back', () => {
    const l = overheadRig({ x: 0, y: 0, z: 0, yaw: 0, aspect: 2.17 }), p = overheadRig({ x: 0, y: 0, z: 0, yaw: 0, aspect: 0.46 });
    expect(p.pitchDeg).toBe(l.pitchDeg); expect(p.fov).toBe(l.fov);
    expect(p.distance).toBeGreaterThan(l.distance);
  });
  it('car stays inside the frame (lower half)', () => {
    const r = overheadRig({ x: 0, y: 0, z: 0, yaw: 0, aspect: 2 });
    const ang = Math.atan2(r.height, r.distance * Math.cos(OV.pitchDeg * Math.PI / 180) - r.lead) * 180 / Math.PI;
    expect(ang - OV.pitchDeg).toBeGreaterThan(0); expect(ang - OV.pitchDeg).toBeLessThan(OV.fovDeg / 2);
  });
  describe('portrait framing', () => {
    for (const aspect of [0.46, 0.56, 390 / 844]) {
      it(`aspect ${aspect.toFixed(2)}: car at 55-62% from the top, 2+ corners of road ahead`, () => {
        for (const yaw of [0, 0.7, 2.5, -2]) {
          expect(carPct(aspect, yaw)).toBeGreaterThanOrEqual(55);
          expect(carPct(aspect, yaw)).toBeLessThanOrEqual(62);
          expect(groundAhead(aspect, yaw)).toBeGreaterThanOrEqual(110); // Track corners are a median 55m apart
        }
      });
    }
  });
  // Numbers recorded from the implementation before the portrait framing change.
  describe('landscape framing is unchanged', () => {
    const SNAPSHOT = [
      { aspect: 2.17, pct: 76.893, distance: 102.310, height: 68.458, lead: 21.820 },
      { aspect: 1.96, pct: 76.893, distance: 113.271, height: 75.793, lead: 24.158 },
    ];
    for (const s of SNAPSHOT) {
      it(`aspect ${s.aspect} matches the snapshot within 1%`, () => {
        const r = overheadRig({ x: 0, y: 0, z: 0, yaw: 0, aspect: s.aspect });
        expect(Math.abs(carPct(s.aspect) / s.pct - 1)).toBeLessThan(0.01);
        for (const k of ['distance', 'height', 'lead']) expect(Math.abs(r[k] / s[k] - 1)).toBeLessThan(0.01);
      });
    }
  });
  it('car position blends with no step over 3% of screen height for aspect 0.8..1.2', () => {
    let prev = carPct(0.8);
    for (let i = 1; i <= 8; i++) {
      const cur = carPct(0.8 + i * 0.05);
      expect(Math.abs(cur - prev)).toBeLessThanOrEqual(3);
      prev = cur;
    }
  });
  it('rig distance has no jump at aspect 1', () => {
    const d = (aspect) => overheadRig({ x: 0, y: 0, z: 0, yaw: 0, aspect }).distance;
    expect(Math.abs(d(1.001) / d(0.999) - 1)).toBeLessThan(0.02);
  });
});
