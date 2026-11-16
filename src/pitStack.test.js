import { describe, it, expect } from 'vitest';
import { Track } from './track.js';
import { Race, seededRandom } from './race.js';
import { TRACKS } from './tracks/index.js';
import { wrapDelta } from './physics.js';

/**
 * Regression: after PR #18 the whole field could pit on the same lap, and pit-lane cars had no car-to-car collision
 * or traffic logic, so several cars (the player too) drove through each other in the lane / boxes / exit merge and
 * were then thrown apart by the collision resolver. Every car here pits the same lap (player on autopilot, mid-grid).
 */
function pitTogether(def, seed, playerSlot) {
  const T = new Track(def), L = T.length, dt = 1 / 60;
  const r = new Race(T, { mode: 'race', difficulty: 'normal', laps: 3, weather: 'dry', rng: seededRandom(seed), playerSlot });
  r.autopilot = true;
  let called = false, overlapFrames = 0, maxJump = 0, playerOverlap = 0;
  const seen = [];
  for (let k = 0; k < 60 * 150; k++) {
    if (!called && r.phase === 'racing' && r.player.progress > 0.3 * L) {
      r.setRain(true);
      for (const c of r.cars) { c.pit.request = true; c.pit.aiChoice = 'wet'; if (c.isPlayer) c.pit.choice = 'wet'; }
      called = true;
    }
    const prevD = r.cars.map((c) => c.d);
    r.step(dt);
    // sideways shove per step for cars in, or within 2 s out of, the pit lane (steering alone moves < ~0.1 m/step here)
    r.cars.forEach((c, i) => {
      if (c.pit.stage) c.pitT = 120; else c.pitT = Math.max(0, (c.pitT || 0) - 1);
      if (c.pitT > 0) maxJump = Math.max(maxJump, Math.abs(c.d - prevD[i]));
    });
    if (!called) continue;
    for (let a = 0; a < r.cars.length; a++) for (let b = a + 1; b < r.cars.length; b++) {
      const A = r.cars[a], B = r.cars[b];
      if (!A.pit.stage && !B.pit.stage) continue;
      if (Math.abs(wrapDelta(A.s - B.s, L)) < 4.0 && Math.abs(A.d - B.d) < 1.6) {
        overlapFrames++; if (A.isPlayer || B.isPlayer) playerOverlap++;
        if (seen.length < 4) seen.push(`${a}/${b} stages ${A.pit.stage}${B.pit.stage} u=${wrapDelta(A.s, L).toFixed(0)}`);
      }
    }
    // one car per box at a time
    for (const c of r.cars) if (c.pit.stage === 2) expect(r.cars.filter((o) => o.pit.stage === 2 && T.boxU(o.teamIndex) === T.boxU(c.teamIndex)).length).toBe(1);
    if (r.cars.every((c) => c.pitStops > 0 && !c.pit.stage)) break;
  }
  return { r, overlapFrames, playerOverlap, maxJump, seen };
}

describe('pit stops: no stacking when the field pits the same lap', () => {
  for (const [id, seed, slot] of [['citadel', 7, 4], ['coastal', 11, 0]]) {
    it(`${id}: cars queue, box and rejoin without overlapping or being thrown apart`, () => {
      const def = TRACKS.find((t) => t.id === id) || TRACKS[0];
      const { r, overlapFrames, playerOverlap, maxJump, seen } = pitTogether(def, seed, slot);
      expect(r.cars.map((c) => c.pitStops), 'every car (incl. the player slot) completed its stop').toEqual(r.cars.map(() => 1));
      expect(r.cars.every((c) => c.tire === 'wet')).toBe(true);
      expect(playerOverlap, seen.join('; ')).toBe(0);
      expect(overlapFrames, seen.join('; ')).toBe(0);
      expect(maxJump, 'no impulse-like sideways jump').toBeLessThan(0.2);
    });
  }

  it('AI team-mates sharing a box do not both call in at once (a pending request counts)', () => {
    const T = new Track(TRACKS[0]);
    const r = new Race(T, { mode: 'race', difficulty: 'normal', laps: 3, weather: 'dry', rng: seededRandom(3), aiOnly: true });
    const [a, b] = r.cars.filter((c) => !c.isPlayer);
    b.teamIndex = a.teamIndex;
    r.phase = 'racing'; r.time = 30;
    for (const c of [a, b]) { c.progress = 0.5 * T.length; c.wear = 0.95; }
    r._aiPitDecision(a); r._aiPitDecision(b);
    expect(a.pit.request).toBe(true);
    expect(b.pit.request).toBe(false);
  });
});
