import { describe, it, expect } from 'vitest';
import { Track } from './track.js';
import { Race, seededRandom, shouldEnterPit, crossesPitEntryGate } from './race.js';
import { TRACKS } from './tracks/index.js';
import { wrapAngle, wrapDelta } from './physics.js';
import { startPodColor } from './themes/circuitDay.js';

/** Place the player at wrapped path distance u with lateral offset d. */
function place(car, T, u, d, headingOff = 0) {
  const s = ((u % T.length) + T.length) % T.length;
  car.s = s;
  car.d = d;
  car.idx = Math.floor(s / T.ds) % T.n;
  const p = T.at(s, d);
  car.x = p.x; car.y = p.y; car.z = p.z;
  car.theta = T.thetaAt(s) + headingOff;
  car.progress = Math.max(200, car.progress || 200);
  car.v = 25;
  car.pit.stage = 0;
  car.pit.request = false;
  car.finished = false;
}

function ttRace(T) {
  const r = new Race(T, { mode: 'tt', weather: 'dry', rng: seededRandom(3) });
  r.phase = 'racing';
  r.timer = 10;
  return r;
}

describe('pit entry gate', () => {
  for (const def of TRACKS) {
    describe(def.id, () => {
      const T = new Track(def);
      const PIT = T.pit;
      const mid = (PIT.entry + PIT.laneStart) / 2;

      it('running wide on asphalt / kerb / grass / gravel near the last corner does not enter the pits', () => {
        const r = ttRace(T);
        const p = r.player;
        const samples = [
          // old accidental trigger zone, just past the racing edge (what used to force-pit)
          { u: PIT.entry - 30, dAdd: 3.2 },
          { u: PIT.entry - 10, dAdd: 3.5 },
          { u: PIT.entry, dAdd: 3.2 },
          { u: mid, dAdd: 3.0 }, // on/near pit lip but not deep enough for the gate
          { u: PIT.laneStart, dAdd: 2.5 },
          { u: PIT.laneStart + 15, dAdd: 3.5 },
        ];
        for (const { u, dAdd } of samples) {
          const s = ((u % T.length) + T.length) % T.length;
          const i = Math.floor(s / T.ds) % T.n;
          place(p, T, u, T.half[i] + dAdd, 0);
          expect(shouldEnterPit(T, p), `wide at u=${u} d=half+${dAdd} surface=${T.surfaceAt(p.idx, p.d)}`).toBe(false);
          r.step(1 / 60);
          expect(p.pit.stage, `step wide at u=${u}`).toBe(0);
        }
      });

      it('deliberately steering into the pit lane still enters', () => {
        const r = ttRace(T);
        const p = r.player;
        const s = ((mid % T.length) + T.length) % T.length;
        const i = Math.floor(s / T.ds) % T.n;
        place(p, T, mid, T.laneD(i), 0);
        expect(T.surfaceAt(p.idx, p.d)).toBe('pit');
        expect(crossesPitEntryGate(T, p)).toBe(true);
        expect(shouldEnterPit(T, p)).toBe(true);
        r.step(1 / 60);
        expect(p.pit.stage).toBe(1);
      });

      it('pit.request still engages in the approach corridor without needing the mouth gate', () => {
        const r = ttRace(T);
        const p = r.player;
        // On the racing line before the mouth opens — request must still pull you in.
        place(p, T, PIT.entry - 20, 0, 0);
        expect(crossesPitEntryGate(T, p)).toBe(false);
        p.pit.request = true;
        expect(shouldEnterPit(T, p)).toBe(true);
        r.step(1 / 60);
        expect(p.pit.stage).toBe(1);
      });

      it('sideways / spun heading at the mouth does not count as entry', () => {
        const r = ttRace(T);
        const p = r.player;
        const s = ((mid % T.length) + T.length) % T.length;
        const i = Math.floor(s / T.ds) % T.n;
        place(p, T, mid, T.laneD(i), Math.PI / 2);
        expect(shouldEnterPit(T, p)).toBe(false);
      });
    });
  }

  it('the pit lane opens over a long flare, and a requested entry does not snap sideways', () => {
    for (const def of TRACKS) {
      const T = new Track(def);
      expect(T.pit.laneStart - T.pit.entry, def.id).toBeGreaterThanOrEqual(100);
      let prev = null, maxSlope = 0;
      for (let i = 0; i < T.n; i++) {
        const u = wrapDelta(i * T.ds, T.length);
        const edge = T.half[i] + 16 * T.pitTaper[i];
        if (prev != null && u > T.pit.entry && u < T.pit.laneStart) maxSlope = Math.max(maxSlope, Math.abs(edge - prev) / T.ds);
        prev = edge;
      }
      expect(maxSlope, def.id).toBeLessThan(0.25);
      const r = ttRace(T);
      const p = r.player;
      const u0 = T.pit.entry - 25;
      const s0 = ((u0 % T.length) + T.length) % T.length;
      place(p, T, u0, T.lineAt(s0), 0);
      p.v = 50;
      p.pit.request = true;
      let prevD = p.d, prevTh = p.theta, maxDD = 0, maxDTh = 0, onPit = false;
      for (let n = 0; n < 60 * 14 && p.pit.stage < 2; n++) {
        r.step(1 / 60);
        if (p.pit.stage === 1) {
          maxDD = Math.max(maxDD, Math.abs(p.d - prevD));
          maxDTh = Math.max(maxDTh, Math.abs(wrapAngle(p.theta - prevTh)));
          if (T.pitTaper[p.idx] > 0.45) {
            onPit = true;
            expect(p.d, def.id).toBeLessThanOrEqual(T.half[p.idx] + 16 * T.pitTaper[p.idx] + 1.5);
          }
        }
        prevD = p.d; prevTh = p.theta;
      }
      expect(onPit, def.id).toBe(true);
      expect(maxDD, def.id).toBeLessThan(0.4);
      expect(maxDTh, def.id).toBeLessThan(0.05);
    }
  }, 20000);

  it('gantry pods are red when lit and dim when out, never green', () => {
    const lit = startPodColor(true, true), off = startPodColor(false, true), out = startPodColor(false, false);
    expect(lit[0]).toBeGreaterThan(lit[1] * 4);
    expect(lit[0]).toBeGreaterThan(lit[2] * 4);
    expect(lit[1]).toBeLessThan(0.5);
    expect(off[0]).toBeLessThan(lit[0] * 0.25);
    expect(off[0]).toBeGreaterThan(out[0]);
    expect(out[0]).toBeGreaterThan(0.05);
  });

  it('wrapDelta used by the gate matches track pit.entry signs', () => {
    const T = new Track(TRACKS[0]);
    const s = ((T.pit.entry % T.length) + T.length) % T.length;
    expect(wrapDelta(s, T.length)).toBeCloseTo(T.pit.entry, 5);
  });
});
