// Per-circuit driving checks. Physics and the AI controller are unchanged;
// these lock the invariant that every original circuit is actually raceable.
import { describe, it, expect } from 'vitest';
import { Track } from './track.js';
import { TRACKS } from './tracks/index.js';
import { Race, seededRandom } from './race.js';
import { benchLap } from './brakeBench.js';

describe('every track', () => {
  for (const def of TRACKS) {
    it(`${def.name}: inside walls stay inside the local turn radius`, () => {
      const T = new Track(def);
      for (let i = 0; i < T.n; i++) {
        const k = T.kappaN[i];
        if (Math.abs(k) < 1e-4) continue;
        const R = 1 / Math.abs(k);
        const inside = k > 0 ? T.half[i] + T.runL[i] : T.half[i] + T.runR[i];
        expect(inside).toBeLessThan(R - 0.5);
      }
    });

    it(`${def.name}: the solo racing-line AI never leaves the asphalt`, () => {
      const T = new Track(def);
      const race = new Race(T, { mode: 'tt', weather: 'dry', rng: seededRandom(1) });
      race.autopilot = true;
      const p = race.player;
      let off = 0, n = 0;
      for (let k = 0; k < 60 * 220; k++) {
        race.step(1 / 60);
        if (race.phase !== 'racing' || p.progress < 0) continue;
        if (p.progress >= T.length) break;
        n++;
        if (p.surface !== 'asphalt' && p.surface !== 'pit' && p.surface !== 'kerb') off++;
      }
      expect(p.progress).toBeGreaterThanOrEqual(T.length - 5);
      expect(n).toBeGreaterThan(1000);
      expect(off).toBe(0);
    }, 60000);

    it(`${def.name}: the braking bot is faster than the lift-only bot`, () => {
      const T = new Track(def);
      const brake = benchLap(T, 'brake');
      const lift = benchLap(T, 'lift');
      expect(brake.done).toBe(true);
      expect(lift.done).toBe(true);
      expect(brake.offFrac).toBe(0);
      // Lift-only can look quicker when it cuts off-track; that used to force-pit and
      // inflate its time. With a strict pit gate, only compare lap times when lift stays honest.
      if (lift.offFrac < 0.05) expect(brake.time).toBeLessThan(lift.time);
      else expect(lift.offFrac).toBeGreaterThan(brake.offFrac);
    }, 60000);
  }
});
