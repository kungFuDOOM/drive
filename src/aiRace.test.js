import { describe, it, expect } from 'vitest';
import { Track } from './track.js';
import { Race } from './race.js';

function seeded(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Simulate a full AI race; count pairwise overtakes (with 5 m hysteresis) and field spread. */
function simulate(seed, difficulty = 'normal') {
  const T = new Track(), realRandom = Math.random;
  Math.random = seeded(seed);
  try {
    const race = new Race(T, { mode: 'race', difficulty, weather: 'dry', laps: 3 });
    race.autopilot = true;
    const cs = race.cars, n = cs.length;
    const sign = Array.from({ length: n }, () => new Int8Array(n));
    let overtakes = 0, spread1 = null, off = 0, samples = 0, minSep = 1e9;
    for (let k = 0; k < 60 * 400; k++) {
      race.step(1 / 60); race.events.length = 0;
      if (race.phase !== 'racing') continue;
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        if (cs[i].pit.stage || cs[j].pit.stage || cs[i].finished || cs[j].finished) continue;
        const d = cs[i].progress - cs[j].progress;
        if (Math.abs(d) < 5) continue;
        const s = d > 0 ? 1 : -1;
        if (sign[i][j] && sign[i][j] !== s && cs[i].progress > 30 && cs[j].progress > 30) overtakes++;
        sign[i][j] = s;
      }
      for (const c of cs) { if (c.progress > 0 && !c.finished) { samples++; if (c.surface === 'grass' || c.surface === 'gravel') off++; } }
      if (spread1 === null && race.order[0].progress >= T.length) spread1 = race.order[0].progress - race.order[n - 1].progress;
      if (cs.every((c) => c.finished)) break;
    }
    return { overtakes, spread1, offFrac: off / Math.max(1, samples), done: cs.every((c) => c.finished), L: T.length };
  } finally { Math.random = realRandom; }
}

describe('AI racing in packs', () => {
  for (const seed of [11, 202, 3033]) it(`overtakes happen and the field stays close (seed ${seed})`, () => {
    const r = simulate(seed);
    console.log(JSON.stringify(r));
    expect(r.done).toBe(true);
    expect(r.overtakes).toBeGreaterThanOrEqual(5);
    expect(r.spread1).toBeLessThan(r.L * 0.12);
    expect(r.offFrac).toBeLessThan(0.02);
  }, 120000);
});
