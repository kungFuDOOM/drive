import { describe, it, expect } from 'vitest';
import { CarFx, hash01, MAX_PARTICLES } from './carFx.js';
import { makeCar } from './cars.js';
import { TEAMS } from './teams.js';

const car = (o = {}) => ({ id: 3, v: 50, surface: 'asphalt', lockup: 0, wheelSlip: 0, wheelspin: 0, ...o });
const pose = { x: 10, y: 1, z: 20, theta: 0.4 };
const frames = (fx, c, m, n, dt = 1 / 60) => { for (let k = 0; k < n; k++) { pose.x += Math.sin(pose.theta) * c.v * dt; pose.z += Math.cos(pose.theta) * c.v * dt; fx.emitCar(c, m, pose, dt); fx.update(dt); } };

describe('tyre effects pool', () => {
  it('hash is deterministic and in [0,1)', () => {
    expect(hash01(3, 7)).toBe(hash01(3, 7));
    for (let i = 0; i < 200; i++) { const h = hash01(i, 9); expect(h).toBeGreaterThanOrEqual(0); expect(h).toBeLessThan(1); }
    expect(hash01(1, 2)).not.toBe(hash01(2, 1));
  });
  it('dust on grass and gravel, none on asphalt; particles die; the pool never grows', () => {
    const fx = new CarFx(), m = makeCar('gp', TEAMS[0], false, false, 0);
    frames(fx, car(), m, 60); expect(fx.alive()).toBe(0);
    frames(fx, car({ surface: 'grass' }), m, 60); expect(fx.alive()).toBeGreaterThan(5);
    const n = fx.points.geometry.attributes.position.count; expect(n).toBe(MAX_PARTICLES);
    frames(fx, car({ surface: 'gravel', v: 80 }), m, 600); expect(fx.alive()).toBeLessThanOrEqual(MAX_PARTICLES);
    for (let k = 0; k < 240; k++) fx.update(1 / 60); expect(fx.alive()).toBe(0);
  });
  it('lock-up makes white tyre smoke at the front wheels and skid marks on tarmac; wheelspin makes puffs', () => {
    const fx = new CarFx(), m = makeCar('gp', TEAMS[0], false, false, 0);
    frames(fx, car({ lockup: 0.9, wheelSlip: 0.9 }), m, 90);
    expect(fx.alive()).toBeGreaterThan(10);
    let white = 0; for (let i = 0; i < fx.max; i++) if (fx.life[i] > 0 && fx.col[i * 4] > 0.8) white++;
    expect(white).toBeGreaterThan(5);
    expect(fx.mCount).toBeGreaterThan(5);
    const fy = new CarFx(); frames(fy, car({ wheelspin: 0.8, v: 20 }), m, 60); expect(fy.alive()).toBeGreaterThan(3);
    const fz = new CarFx(); frames(fz, car({ lockup: 0.9, surface: 'grass' }), m, 60); expect(fz.mCount).toBe(0); // no marks on grass
  });
  it('is deterministic (no Math.random) and does nothing for ghosts or a stopped clock', () => {
    const run = () => { pose.x = 10; pose.z = 20; const fx = new CarFx(), m = makeCar('gp', TEAMS[0], false, false, 0); frames(fx, car({ lockup: 0.8, surface: 'asphalt' }), m, 40); frames(fx, car({ surface: 'gravel' }), m, 40); return Array.from(fx.px).concat(Array.from(fx.col)).join(); };
    expect(run()).toBe(run());
    const fx = new CarFx(), ghost = makeCar('gp', TEAMS[0], false, true, 0);
    frames(fx, car({ lockup: 1, surface: 'grass' }), ghost, 30); expect(fx.alive()).toBe(0);
    const m = makeCar('gp', TEAMS[0], false, false, 0);
    for (let k = 0; k < 30; k++) fx.emitCar(car({ lockup: 1 }), m, pose, 0); expect(fx.alive()).toBe(0);
  });
  it('is one Points + one mesh (2 draw calls for the whole field), skid ring buffer wraps', () => {
    const fx = new CarFx(64, 8);
    for (let i = 0; i < 20; i++) fx.mark(i, 0, i + 1, 0, 0, 0.1);
    expect(fx.mCount).toBe(8); expect(fx.mnext).toBe(20 % 8);
    expect(fx.points.isPoints).toBe(true); expect(fx.marks.isMesh).toBe(true);
    fx.clear(); expect(fx.alive()).toBe(0); expect(fx.mCount).toBe(0);
  });
});
