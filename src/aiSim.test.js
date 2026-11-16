// Headless AI harness (src/aiSim.js) and the Race aiOnly option.
import { describe, it, expect } from 'vitest';
import { Track } from './track.js';
import { Race, seededRandom } from './race.js';
import { DIFFICULTY } from './progress.js';
import { runRace, limitLap, soloLap, getTrack } from './aiSim.js';

describe('Race aiOnly option', () => {
  it('is off by default: the player slot keeps skill 0.985 and manual control', () => {
    const r = new Race(new Track(), { mode: 'race', difficulty: 'easy', rng: seededRandom(3) });
    expect(r.autopilot).toBe(false);
    expect(r.player.skill).toBe(0.985);
  });
  it('makes the player slot an ordinary field driver on autopilot with AI pit calls', () => {
    const d = DIFFICULTY.easy;
    const r = new Race(new Track(), { mode: 'race', difficulty: 'easy', rng: seededRandom(3), aiOnly: true });
    expect(r.autopilot).toBe(true);
    expect(Math.abs(r.player.skill - d.skill)).toBeLessThanOrEqual(d.spread);
    r.phase = 'racing'; r.rain = 1; r.wetness = 0.8; r.player.progress = 10; r.player.tire = 'dry'; // a soaked track on dry tyres
    r._aiPitDecision(r.player);
    expect(r.player.pit.request).toBe(true);
  });
  it('uses the grid entry skill for the player slot', () => {
    const base = new Race(new Track(), { mode: 'race', rng: seededRandom(1) });
    const grid = base.cars.map((c, i) => ({ id: `d${i}`, isPlayer: i === 2, team: c.team, teamIndex: c.teamIndex, skill: 0.9 + i * 0.01 }));
    const r = new Race(new Track(), { mode: 'race', rng: seededRandom(1), grid, aiOnly: true });
    expect(r.player.skill).toBeCloseTo(0.92, 6);
  });
  it('leaves the rest of the grid untouched (same seed, same AI skills and line offsets)', () => {
    const a = new Race(new Track(), { mode: 'race', rng: seededRandom(5) });
    const b = new Race(new Track(), { mode: 'race', rng: seededRandom(5), aiOnly: true });
    for (let i = 0; i < a.cars.length; i++) if (!a.cars[i].isPlayer) { expect(b.cars[i].skill).toBe(a.cars[i].skill); expect(b.cars[i].lineBias).toBe(a.cars[i].lineBias); }
  });
});

describe('AI harness', () => {
  it('is deterministic: the same seed gives identical metrics', () => {
    const a = runRace({ track: 'lampwick', difficulty: 'hard', seed: 4, laps: 2 });
    const b = runRace({ track: 'lampwick', difficulty: 'hard', seed: 4, laps: 2 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.finished).toBe(10);
    expect(a.medBest).toBeGreaterThan(30);
    expect(a.launch.every((t) => t !== null)).toBe(true);
    expect(a.movedBeforeGo).toBe(0);
  }, 30000);
  it('limit lap is clean and quicker than a Hard-skill solo lap', () => {
    const lim = limitLap('citadel'), hard = soloLap('citadel', DIFFICULTY.hard.skill);
    expect(lim.hits).toBe(0);
    expect(lim.off).toBe(0);
    expect(lim.lap).toBeLessThan(hard.lap);
  }, 30000);
  it('runs human-proxy scenarios with the player slot scripted', () => {
    const r = runRace({ track: 'citadel', difficulty: 'normal', seed: 1, laps: 1, proxy: 'slowOnLine' });
    expect(r.finished).toBe(10);
    expect(getTrack('citadel').length).toBeGreaterThan(1000);
  }, 30000);
});
