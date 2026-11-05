import { describe, it, expect } from 'vitest';
import { Track } from './track.js';
import { CLASSES } from './physics.js';
import { boardPlan, buildBrakeBoards } from './brakeBoards.js';
import { lineProfile } from './racingLine.js';

const T = new Track();

describe('braking boards', () => {
  for (const id of ['gp', 'speedway']) {
    const cls = CLASSES[id], plan = boardPlan(T, cls);
    it(`${id}: a 100 m and a 50 m board for each real braking zone, 50 m apart`, () => {
      expect(plan.length).toBeGreaterThanOrEqual(6);
      const corners = new Set(plan.map((b) => b.corner));
      for (const c of ['Crown Hairpin', 'The Plunge', 'Citadel Squeeze']) expect(corners.has(c)).toBe(true);
      const L = T.length;
      for (const b of plan.filter((x) => x.metres === 100)) {
        const mate = plan.find((x) => x.metres === 50 && x.apex === b.apex);
        expect(mate).toBeTruthy();
        expect((mate.s - b.s + L) % L).toBeCloseTo(50, 0);
        // the corner really needs braking: planned speed drops a lot between the 100 m board and the apex
        const prof = lineProfile(T, cls).v;
        expect(prof[Math.floor(b.s / T.ds) % T.n]).toBeGreaterThan(prof[Math.floor(b.apex / T.ds) % T.n] + 8);
      }
    });
    it(`${id}: boards stand beyond the wall/run-off, never inside any road corridor`, () => {
      for (const b of plan) {
        const i = Math.floor(b.s / T.ds) % T.n, wall = b.side > 0 ? T.leftWall[i] : T.rightWall[i];
        expect(Math.abs(b.d)).toBeGreaterThanOrEqual(wall + 2);
        const p = T.at(b.s, b.d);
        expect(T.clearance(p.x, p.z)).toBeGreaterThan(0.5);
      }
    });
  }
  it('one merged static mesh with finite vertices and the pixel numbers', () => {
    const { mesh, plan } = buildBrakeBoards(T, CLASSES.gp);
    expect(mesh.isMesh).toBe(true);
    const pos = mesh.geometry.attributes.position.array;
    expect(pos.length).toBeGreaterThan(plan.length * 60);
    expect(pos.every(Number.isFinite)).toBe(true);
    expect(mesh.geometry.attributes.color.count).toBe(mesh.geometry.attributes.position.count);
  });
});
