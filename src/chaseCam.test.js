import { describe, it, expect } from 'vitest';
import { Track } from './track.js';
import { Race } from './race.js';
import { spring, chaseStep, frameAngle, pullInFactor, overheadFollow } from './chaseCam.js';
import { wrapAngle } from './physics.js';

const T = new Track();

describe('critically damped spring', () => {
  it('converges without overshoot and is stable for huge dt', () => {
    let x = 0, v = 0, maxX = 0;
    for (let k = 0; k < 600; k++) { [x, v] = spring(x, v, 1, 6, 1 / 60); maxX = Math.max(maxX, x); }
    expect(x).toBeCloseTo(1, 3); expect(maxX).toBeLessThanOrEqual(1 + 1e-9);
    expect(spring(0, 0, 5, 6, 8)[0]).toBeCloseTo(5, 6);
  });
  it('overhead follow converges on a static car (position, height, yaw) and never overshoots the heading', () => {
    const o = { x: 0, y: 0, z: 0, yaw: 3 };
    for (let k = 0; k < 900; k++) { overheadFollow(o, { x: 10, y: 4, z: -7, theta: -3 }, 1 / 60); }
    expect(o.x).toBeCloseTo(10, 2); expect(o.y).toBeCloseTo(4, 2); expect(o.z).toBeCloseTo(-7, 2);
    expect(Math.abs(wrapAngle(o.yaw + 3))).toBeLessThan(0.01);
  });
});

describe('pull-in', () => {
  it('shortens a ray that would leave the wall corridor and leaves a clear ray alone', () => {
    const i = 100, car = { x: T.px[i], z: T.pz[i] };
    const out = { x: T.px[i] + T.nx[i] * (T.leftWall[i] + 30), z: T.pz[i] + T.nz[i] * (T.leftWall[i] + 30) };
    const t = pullInFactor(T, car, out, i);
    expect(t).toBeLessThan(0.5);
    const inn = { x: T.px[i] + T.nx[i] * 1, z: T.pz[i] + T.nz[i] * 1 };
    expect(pullInFactor(T, car, inn, i)).toBe(1);
  });
});

describe('chase camera on a full lap (autopilot)', () => {
  it('stays above the road, inside the walls, behind the car and keeps it in frame', () => {
    const race = new Race(T, { mode: 'tt', weather: 'dry' });
    race.autopilot = true;
    const p = race.player, st = {}, fovDeg = 62, aspect = 16 / 9, vHalf = fovDeg * Math.PI / 360;
    const loc = {}; let worst = { under: 1e9, wall: 1e9, frame: 0, sideways: 0 }, n = 0;
    for (let k = 0; k < 60 * 400; k++) {
      race.step(1 / 60); race.events.length = 0;
      if (race.phase !== 'racing' && k < 60 * 6) continue;
      if (p.progress >= T.length) break;
      const r = chaseStep(st, p, T, 1 / 60, { fovDeg, aspect });
      n++;
      T.locate(r.pos[0], r.pos[2], p.idx, loc, 60);
      worst.under = Math.min(worst.under, r.pos[1] - T.yAt(loc.s));
      worst.wall = Math.min(worst.wall, (loc.d >= 0 ? T.leftWall[loc.i] : T.rightWall[loc.i]) - Math.abs(loc.d));
      worst.frame = Math.max(worst.frame, frameAngle(r.pos, r.look, [p.x, p.y + 0.9, p.z]));
      const toCar = Math.atan2(p.x - r.pos[0], p.z - r.pos[2]);
      worst.sideways = Math.max(worst.sideways, Math.abs(wrapAngle(toCar - p.theta)));
    }
    expect(n).toBeGreaterThan(1000);
    expect(worst.under).toBeGreaterThanOrEqual(1.5 - 1e-3);   // never below track y + 1.5
    expect(worst.wall).toBeGreaterThan(-0.25);                // never beyond the wall corridor
    expect(worst.frame).toBeLessThan(vHalf);                  // car always within the view cone
    expect(worst.sideways).toBeLessThan(0.9);                 // never swings sideways of the car heading
  }, 60000);
});
