import { describe, it, expect } from 'vitest';
import { Track } from './track.js';
import { Race, seededRandom } from './race.js';

function runLap(opts = {}) {
  const T = new Track();
  const race = new Race(T, { mode: 'tt', weather: 'dry', rng: seededRandom(1), ...opts });
  race.autopilot = true;
  const p = race.player, dt = 1 / 60;
  const secMin = {}, secMax = {}, secT = {}, offT = {}; let t = 0, off = 0, total = 0, lapT = 0;
  for (let k = 0; k < 60 * 400; k++) {
    race.step(dt);
    if (race.phase !== 'racing') continue;
    if (p.progress < 0) continue;
    if (p.progress >= T.length) break;
    const sec = T.sectionName(p.idx), kmh = p.v * 3.6;
    secMin[sec] = Math.min(secMin[sec] ?? 1e9, kmh); secMax[sec] = Math.max(secMax[sec] ?? 0, kmh);
    total++; lapT = p.progress;
    if (p.surface !== 'asphalt' && p.surface !== 'pit' && p.surface !== 'kerb') { off++; offT[sec] = (offT[sec] || 0) + 1; }
  }
  return { secMin, secMax, offFrac: off / Math.max(1, total), offT, done: lapT >= T.length - 5, T, p };
}

describe('autopilot full lap', () => {
  it('carries speed through the squeeze, is fast in Thunder Climb, stays on asphalt', () => {
    const r = runLap();
    console.log(JSON.stringify({ min: r.secMin, max: r.secMax, off: r.offFrac, offT: r.offT }));
    expect(r.done).toBe(true);
    expect(r.secMin['Citadel Squeeze']).toBeGreaterThan(40);
    expect(r.secMax['Thunder Climb']).toBeGreaterThan(195);
    expect(r.offFrac).toBe(0); // a lone car on the racing line never touches grass or gravel
  }, 60000);
});

const median = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];

describe('AI field full lap (traffic)', () => {
  for (const difficulty of ['easy', 'normal', 'hard']) it(`the field carries speed through the squeeze and stays on asphalt (${difficulty})`, () => {
    const T = new Track();
    {
      const race = new Race(T, { mode: 'race', difficulty, weather: 'dry', laps: 3, rng: seededRandom(difficulty.length * 7919) });
      race.autopilot = true;
      const st = new Map(race.cars.map((c) => [c, { min: 1e9, max: 0, off: 0, n: 0 }]));
      for (let k = 0; k < 60 * 400; k++) {
        race.step(1 / 60); race.events.length = 0;
        if (race.phase !== 'racing') continue;
        let alive = false;
        for (const c of race.cars) {
          if (c.progress < 0 || c.progress >= T.length || c.pit.stage) continue;
          alive = true;
          const e = st.get(c), sec = T.sectionName(c.idx), kmh = c.v * 3.6;
          e.n++; if (c.surface === 'grass' || c.surface === 'gravel') e.off++;
          if (sec === 'Citadel Squeeze') e.min = Math.min(e.min, kmh);
          if (sec === 'Thunder Climb') e.max = Math.max(e.max, kmh);
        }
        if (!alive && race.time > 20) break;
      }
      const rows = [...st.values()].filter((e) => e.n > 0);
      expect(rows.length).toBe(race.cars.length);
      expect(median(rows.map((e) => e.min))).toBeGreaterThan(50);
      expect(rows.filter((e) => e.min > 40).length).toBeGreaterThanOrEqual(Math.ceil(rows.length * 0.8));
      expect(median(rows.map((e) => e.max))).toBeGreaterThan(195);
      expect(rows.reduce((s, e) => s + e.off, 0) / rows.reduce((s, e) => s + e.n, 0)).toBeLessThan(0.003);
    }
  }, 60000);
});
