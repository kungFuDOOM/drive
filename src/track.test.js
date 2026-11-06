import { describe, it, expect } from 'vitest';
import { Track } from './track.js';

const T = new Track();

describe('track geometry', () => {
  it('inside run-off / wall offsets stay below the local turn radius (no folded offset curves)', () => {
    for (let i = 0; i < T.n; i++) {
      const k = T.kappaN[i]; // lightly smoothed signed curvature, + = turning left
      if (Math.abs(k) < 1e-4) continue;
      const R = 1 / Math.abs(k);
      const inside = k > 0 ? T.half[i] + T.runL[i] : T.half[i] + T.runR[i];
      // the offset curve is regular only while offset < radius; keep a safety margin
      expect(inside).toBeLessThan(R - 0.5);
    }
  });
  it('per-side run-off never exceeds the nominal run-off and is positive', () => {
    for (let i = 0; i < T.n; i++) {
      expect(T.runL[i]).toBeGreaterThan(0); expect(T.runR[i]).toBeGreaterThan(0);
      expect(T.runL[i]).toBeLessThanOrEqual(T.runoff[i] + 1e-4); expect(T.runR[i]).toBeLessThanOrEqual(T.runoff[i] + 1e-4);
    }
  });
  it('closes the loop without a seam (position, height, heading)', () => {
    const a = T.at(T.length - 1e-3), b = T.at(0);
    expect(a.distanceTo(b)).toBeLessThan(0.05);
    expect(Math.abs(T.thetaAt(T.length - 0.01) - T.thetaAt(0.01))).toBeLessThan(0.02);
    const gap = Math.hypot(T.px[0] - T.px[T.n - 1], T.pz[0] - T.pz[T.n - 1]);
    expect(Math.abs(gap - T.ds)).toBeLessThan(0.05);
    expect(T.n % 16).toBe(0);
  });
  it('start/finish line sits at lap s = 0', () => {
    for (const d of [-6, 0, 6]) {
      const p = T.at(0, d), loc = T.locateGlobal(p.x, p.z);
      const s = loc.s > T.length / 2 ? loc.s - T.length : loc.s;
      expect(Math.abs(s)).toBeLessThan(0.3);
    }
  });
  it('pit lane meets the track edge with no step: same height, contiguous width', () => {
    for (let i = 0; i < T.n; i++) {
      if (T.pitTaper[i] <= 0.02) continue;
      expect(T.surfaceAt(i, T.half[i] - 0.01)).toBe('asphalt');
      expect(T.surfaceAt(i, T.half[i] + 0.2)).toBe('pit');
    }
    expect(T.pit.laneStart).toBeGreaterThan(T.pit.entry);
  });
  it('Thunder Climb is a fast section (radius allows ~200 km/h)', () => {
    let minR = 1e9;
    for (let i = 0; i < T.n; i++) if (T.sectionName(i) === 'Thunder Climb') minR = Math.min(minR, 1 / Math.max(1e-6, Math.abs(T.kappaS[i])));
    expect(minR).toBeGreaterThan(70);
  });
});
