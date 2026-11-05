import { describe, it, expect } from 'vitest';
import { overheadRig, OV } from './overheadCam.js';

const pitchOf = (r) => {
  const d = [r.target[0] - r.pos[0], r.target[1] - r.pos[1], r.target[2] - r.pos[2]], len = Math.hypot(...d);
  return Math.asin(-d[1] / len) * 180 / Math.PI;
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
});
