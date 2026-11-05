import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { overheadRig } from './overheadCam.js';
import { overheadFollow, springField, springYaw } from './chaseCam.js';
import { renderSize, targetHFor, msaaFor, sharpBilinear, snapToTexel, TARGET_H } from './renderScale.js';
import { snapshot, lerpCar } from './interp.js';
import { FrameStats, ShadowCadence } from './perfStats.js';

/** car screen position (% from the top) for a rig that follows `o` while the car is really at `car` */
function carPct(o, car, aspect) {
  const r = overheadRig({ x: o.x, y: o.y, z: o.z, yaw: o.yaw, aspect });
  const cam = new THREE.PerspectiveCamera(r.fov, aspect, 1, 5000);
  cam.position.set(...r.pos); cam.lookAt(...r.target); cam.updateMatrixWorld();
  return (1 - new THREE.Vector3(car.x, car.y, car.z).project(cam).y) * 50;
}
/** drive straight at speed v for `secs` at `hz`, following with `follow`; returns the final car screen % */
function drive(follow, v, aspect, { secs = 12, hz = 120 } = {}) {
  const dt = 1 / hz, car = { x: 0, y: 2, z: 0, theta: 0, vx: 0 }, o = { x: 0, y: 2, z: 0, yaw: 0 };
  for (let t = 0; t < secs; t += dt) { car.z += v * dt; follow(o, car, dt); }
  return carPct(o, car, aspect);
}
// the follow used before this change: plain springs on the absolute position (lags 2v/omega)
const legacy = (o, car, dt) => { springYaw(o, car.theta, 1.5, dt); springField(o, 'x', car.x, 7, dt); springField(o, 'z', car.z, 7, dt); springField(o, 'y', car.y, 3, dt); };

describe('overhead follow keeps the car at a stable screen position at speed', () => {
  for (const [name, aspect] of [['portrait 390x844', 390 / 844], ['landscape 932x430', 932 / 430]]) {
    it(`${name}: 0..100 m/s stays within 1.5% of screen height`, () => {
      const rest = drive(overheadFollow, 0, aspect);
      for (const v of [20, 40, 60, 80, 100]) expect(Math.abs(drive(overheadFollow, v, aspect) - rest)).toBeLessThan(1.5);
    });
  }
  it('portrait: the old follow drifted toward the top (regression guard for the measurement itself)', () => {
    const a = 390 / 844, rest = drive(legacy, 0, a), fast = drive(legacy, 80, a);
    expect(rest - fast).toBeGreaterThan(8); // car moved >8% of screen height up
  });
  it('is rate-independent: 60 Hz and 120 Hz end in the same place', () => {
    const a = 390 / 844;
    expect(Math.abs(drive(overheadFollow, 80, a, { hz: 60 }) - drive(overheadFollow, 80, a, { hz: 120 }))).toBeLessThan(0.3);
  });
  it('a teleport does not inject a huge velocity (rig converges, no fly-away)', () => {
    const o = { x: 0, y: 0, z: 0, yaw: 0 }, car = { x: 0, y: 0, z: 0, theta: 0 };
    overheadFollow(o, car, 1 / 60); car.x = 500; car.z = 800;
    for (let k = 0; k < 600; k++) overheadFollow(o, car, 1 / 60);
    expect(Math.hypot(o.x - 500, o.z - 800)).toBeLessThan(0.5);
  });
  it('braking to a stop: no lasting offset or overshoot of the car past the screen centre line', () => {
    const o = { x: 0, y: 0, z: 0, yaw: 0 }, car = { x: 0, y: 0, z: 0, theta: 0 }; let v = 80, maxLead = 0;
    for (let k = 0; k < 1200; k++) { v = Math.max(0, v - 34 / 60); car.z += v / 60; overheadFollow(o, car, 1 / 60); maxLead = Math.max(maxLead, o.z - car.z); }
    expect(Math.abs(o.z - car.z)).toBeLessThan(0.05);
    expect(maxLead).toBeLessThan(4); // the rig may run slightly ahead while the velocity estimate decays, not by car-lengths
  });
});

describe('render resolution', () => {
  it('internal height rises with quality; phone sizes stay in a cheap range', () => {
    expect(TARGET_H[2]).toBeGreaterThan(TARGET_H[0]);
    for (const [w, h, d] of [[844, 390, 3], [932, 430, 3], [390, 844, 3], [1920, 1080, 1]]) {
      for (const q of [0, 1, 2]) {
        const r = renderSize(w, h, d, targetHFor(q));
        expect(Number.isInteger(r.k)).toBe(true);
        expect(r.lowH).toBeGreaterThanOrEqual(150); expect(r.lowH).toBeLessThanOrEqual(400);
        expect(r.lowW * r.lowH).toBeLessThan(400 * 900);
        expect(r.vx + r.vw).toBeLessThanOrEqual(r.W); expect(r.vy + r.vh).toBeLessThanOrEqual(r.H);
      }
      expect(renderSize(w, h, d, targetHFor(2)).lowH).toBeGreaterThanOrEqual(renderSize(w, h, d, targetHFor(0)).lowH);
    }
    expect(msaaFor(0)).toBe(0); expect(msaaFor(2)).toBeGreaterThan(0);
  });
  it('snapToTexel can write in place without allocating and matches the allocating form', () => {
    const p = [1.23, 5, 7.77], out = [0, 0, 0];
    expect(snapToTexel(p, [1, 0, 0], [0, 1, 0], 0.5, out)).toBe(out);
    expect(out).toEqual(snapToTexel(p, [1, 0, 0], [0, 1, 0], 0.5));
    const same = [1.23, 5, 7.77]; snapToTexel(same, [1, 0, 0], [0, 1, 0], 0.5, same); expect(same).toEqual(out);
  });
});

describe('sharp-bilinear upscale', () => {
  const k = 4;
  it('is flat inside a texel (crisp) and blends only across ~1 device pixel at the edge', () => {
    // texel n spans t in [n, n+1); centres at n+.5. Sample coordinate stays on a centre except within 0.5/k of the boundary.
    expect(sharpBilinear(3.5, k)).toBeCloseTo(3.5, 9);
    expect(sharpBilinear(3.7, k)).toBeCloseTo(3.5, 9);
    expect(sharpBilinear(3.3, k)).toBeCloseTo(3.5, 9);
    // exactly on the boundary: halfway between the two texel centres
    expect(sharpBilinear(4.0, k)).toBeCloseTo(4.0, 9);
    // width of the blend zone in texels = 1/k
    const zone = [];
    for (let t = 3.5; t <= 4.5; t += 0.001) { const c = sharpBilinear(t, k); if (c > 3.5001 && c < 4.4999) zone.push(t); }
    expect(zone[zone.length - 1] - zone[0]).toBeCloseTo(1 / k, 1);
  });
  it('is monotonic and continuous (no popping while the camera slides)', () => {
    let prev = sharpBilinear(0.5, k);
    for (let t = 0.5; t < 20; t += 0.01) { const c = sharpBilinear(t, k); expect(c).toBeGreaterThanOrEqual(prev - 1e-9); expect(c - prev).toBeLessThan(0.05); prev = c; }
  });
  it('k = 1 degenerates to plain bilinear', () => { expect(sharpBilinear(3.75, 1)).toBeCloseTo(3.75, 9); });
});

describe('interpolation of s / d (what the cameras read)', () => {
  it('interpolates arc position across the lap wrap and is exact at alpha 0 / 1', () => {
    const L = 1000, c = { x: 0, y: 0, z: 0, theta: 0, steer: 0, s: 998, d: 1, pose: { pitch: 0, roll: 0 } };
    snapshot(c); c.s = 3; c.d = 3;
    const mid = lerpCar(c, 0.5, {}, L);
    expect(((mid.s % L) + L) % L).toBeCloseTo(0.5, 6); expect(mid.d).toBeCloseTo(2);
    expect(((lerpCar(c, 0, {}, L).s % L) + L) % L).toBeCloseTo(998); expect(((lerpCar(c, 1, {}, L).s % L) + L) % L).toBeCloseTo(3);
    expect(lerpCar({ x: 1, y: 0, z: 0, theta: 0, s: 5 }, 0.5).s).toBe(5); // no snapshot yet
  });
});

describe('frame stats', () => {
  it('computes mean / p95 / max, counts spikes, reports heap growth without allocating per call', () => {
    const f = new FrameStats(100);
    for (let i = 0; i < 99; i++) f.add(8.33, 1e6 + i * 1000);
    f.add(60, 1e6 + 99000);
    const s = f.snapshot();
    expect(s.frames).toBe(100); expect(s.maxMs).toBe(60); expect(s.p95Ms).toBeCloseTo(8.33, 1);
    expect(s.avgMs).toBeCloseTo(8.33 + (60 - 8.33) / 100, 1); expect(s.spikes).toBe(1);
    expect(s.allocBytesPerFrame).toBe(1000);
    f.add(8.33, 5e5); // a GC drop is ignored
    expect(f.snapshot().allocBytesPerFrame).toBeGreaterThan(900);
    const g = new FrameStats(); g.add(16);
    expect(g.snapshot().allocBytesPerFrame).toBe(-1);
    g.reset(); expect(g.snapshot().frames).toBe(0);
  });
});

describe('shadow cadence', () => {
  const rate = (hz, secs = 10) => { const c = new ShadowCadence(); let n = 0; for (let i = 0; i < hz * secs; i++) if (c.due(1 / hz)) n++; return n / secs; };
  it('renders shadows at ~60 Hz on any display', () => {
    expect(rate(60)).toBeCloseTo(60, 0); expect(rate(120)).toBeCloseTo(60, 0);
    expect(rate(90)).toBeGreaterThan(55); expect(rate(90)).toBeLessThan(65);
    expect(rate(30)).toBeCloseTo(30, 0); // a slow display is never skipped
  });
  it('first frame and force() always render', () => {
    const c = new ShadowCadence(); expect(c.due(1 / 120)).toBe(true); expect(c.due(1 / 120)).toBe(false); c.force(); expect(c.due(1 / 120)).toBe(true);
  });
});
