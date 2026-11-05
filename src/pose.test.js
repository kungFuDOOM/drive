import { describe, it, expect } from 'vitest';
import { Track } from './track.js';
import { Race } from './race.js';
import { carPose, AXLE_F, AXLE_R } from './pose.js';

const T = new Track();

describe('car pose follows the road', () => {
  it('both axles touch the road everywhere on the lap (no floating / sinking)', () => {
    let maxErr = 0, maxPitch = 0;
    for (let s = 0; s < T.length; s += 0.7) {
      const p = carPose(T, s);
      const yF = p.y + Math.tan(p.pitch) * AXLE_F, yR = p.y + Math.tan(p.pitch) * AXLE_R;
      maxErr = Math.max(maxErr, Math.abs(yF - T.yAt(s + AXLE_F)), Math.abs(yR - T.yAt(s + AXLE_R)));
      maxPitch = Math.max(maxPitch, Math.abs(p.pitch));
    }
    expect(maxErr).toBeLessThan(1e-4);
    expect(maxPitch).toBeGreaterThan(0.1); // the Plunge / Thunder Climb really are steep
    expect(carPose(T, 100).roll).toBeCloseTo(0, 6);
  });
  it('the body stays within a few cm of the road surface along a driven lap (incl. crests and dips)', () => {
    const race = new Race(T, { mode: 'tt', weather: 'dry' }); race.autopilot = true;
    const p = race.player; let worst = 0;
    for (let k = 0; k < 60 * 400; k++) {
      race.step(1 / 60); race.events.length = 0;
      if (p.progress >= T.length) break;
      if (p.progress < 0) continue;
      worst = Math.max(worst, Math.abs(p.y - T.yAt(p.s)));
    }
    expect(worst).toBeLessThan(0.12);
  }, 60000);
});

describe('pit lane / loop', () => {
  it('pit lane is coplanar with the track at the join and the road is continuous over the lap seam', () => {
    for (let i = 0; i < T.n; i++) expect(Math.abs(T.py[(i + 1) % T.n] - T.py[i])).toBeLessThan(T.ds * 0.6); // no height jump anywhere, seam included
    expect(Math.abs(T.py[0] - T.py[T.n - 1])).toBeLessThan(0.05);
  });
});
