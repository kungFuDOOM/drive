import { describe, it, expect } from 'vitest';
import { Track } from './track.js';
import { Race, seededRandom } from './race.js';


function race3(seed) {
  {
    const T = new Track(), r = new Race(T, { mode: 'race', laps: 3, weather: 'dry', difficulty: 'normal', rng: seededRandom(seed) });
    r.autopilot = true;
    let overtakes = 0, prev = null, spreadL1 = null;
    for (let k = 0; k < 60 * 420 && !r.cars.every((c) => c.finished); k++) {
      r.step(1 / 60); r.events.length = 0;
      if (r.phase !== 'racing') continue;
      if (k % 6 === 0) {
        const ord = r.order.map((c) => c.id ?? c.team.name);
        if (prev) for (let i = 0; i < ord.length; i++) { const j = prev.indexOf(ord[i]); if (j > i && !r.cars.find((c) => (c.id ?? c.team.name) === ord[i]).pit.stage) overtakes += j - i; }
        prev = ord;
        if (spreadL1 == null && r.order[0].progress > T.length * 1.05) spreadL1 = (r.order[0].progress - r.order[r.order.length - 1].progress) / T.length;
      }
    }
    return { overtakes, spreadL1, done: r.cars.filter((c) => c.finished).length };
  }
}

describe('pack racing', () => {
  it('cars race in close groups with several overtakes over 3 laps', () => {
    const res = [1, 2, 3].map(race3);
    console.log(JSON.stringify(res));
    const med = res.map((r) => r.overtakes).sort((a, b) => a - b)[1];
    expect(med).toBeGreaterThanOrEqual(5);
    for (const r of res) { expect(r.spreadL1).not.toBeNull(); expect(r.spreadL1).toBeLessThan(0.35); }
  }, 120000);
});
