import { describe, it, expect } from 'vitest';
import {
  createTimer, updateTimer, currentLapTime, formatTime, formatDelta,
  createGhostRecorder, recordGhost, finishGhost, sampleGhost, resetGhost,
} from './timing.js';

const L = 900; // 3 sectors of 300 m
/** Drive at constant speed v (m/s) from progress p0 with dt steps; returns all events. */
function drive(t, p0, p1, v, t0 = 0, dt = 0.016) {
  const ev = [];
  let p = p0, now = t0;
  updateTimer(t, p, now);
  while (p < p1) { p += v * dt; now += dt; ev.push(...updateTimer(t, p, now)); }
  return { ev, now, p };
}

describe('formatting', () => {
  it('formats lap times and deltas', () => {
    expect(formatTime(83.456)).toBe('1:23.456');
    expect(formatTime(5.1)).toBe('0:05.100');
    expect(formatTime(Infinity)).toBe('--:--.---');
    expect(formatDelta(-0.321)).toBe('-0.321');
    expect(formatDelta(1.5)).toBe('+1.500');
    expect(formatDelta(null)).toBe('');
  });
});

describe('lap timer', () => {
  it('does not start timing on the grid and starts at the line with sub-frame precision', () => {
    const t = createTimer(L);
    const { ev } = drive(t, -20, 10, 50);
    const start = ev.find((e) => e.type === 'start');
    expect(start).toBeTruthy();
    // 20 m at 50 m/s = 0.4 s after the first sample
    expect(start.time).toBeCloseTo(0.4, 2);
    expect(currentLapTime(t, 0)).toBe(0);
  });

  it('emits 3 sector events then a lap event with matching total, once per lap', () => {
    const t = createTimer(L);
    const { ev } = drive(t, -5, 2 * L + 1, 60);
    const sectors = ev.filter((e) => e.type === 'sector');
    const laps = ev.filter((e) => e.type === 'lap');
    expect(sectors.length).toBe(6);
    expect(sectors.map((s) => s.sector)).toEqual([0, 1, 2, 0, 1, 2]);
    expect(laps.length).toBe(2);
    for (const lap of laps) {
      expect(lap.sectors.length).toBe(3);
      expect(lap.sectors.reduce((a, b) => a + b, 0)).toBeCloseTo(lap.time, 6);
      expect(lap.time).toBeCloseTo(L / 60, 1);
    }
    expect(t.laps.length).toBe(2);
  });

  it('first lap is purple with no delta; a faster second lap is purple and negative', () => {
    const t = createTimer(L);
    const a = drive(t, -1, L + 1, 50);
    const first = a.ev.filter((e) => e.type === 'sector').slice(0, 3);
    expect(first.every((s) => s.status === 'purple' && s.delta === null)).toBe(true);
    const b = drive2(t, a, 60);
    const s2 = b.filter((e) => e.type === 'sector').slice(0, 3);
    expect(s2.every((s) => s.delta < 0 && s.status === 'purple')).toBe(true);
    const lap = b.find((e) => e.type === 'lap');
    expect(lap.isBest).toBe(true);
    expect(lap.delta).toBeLessThan(0);
    expect(t.bestLap).toBeCloseTo(lap.time, 9);
  });

  it('a slower lap is not best and sectors are classified green vs slow', () => {
    // reference: lap 1 at 60 m/s, lap 2 at 50 m/s (slow), lap 3 mixed
    const t = createTimer(L);
    let r = drive(t, -1, L + 1, 60);
    const bestAfter1 = t.bestLap;
    const slow = drive2(t, r, 50);
    expect(slow.find((e) => e.type === 'lap').isBest).toBe(false);
    expect(slow.filter((e) => e.type === 'sector').slice(0, 3).every((s) => s.status === 'slow' && s.delta > 0)).toBe(true);
    expect(t.bestLap).toBeCloseTo(bestAfter1, 9);
  });

  it('green = beats the best-lap reference sector but not the best-ever sector', () => {
    const t = createTimer(L, 3, { bestLap: 20, bestSectors: [5, 5, 5], refSectors: [7, 7, 7] });
    // sector 0 in 6 s: slower than best-ever (5) but faster than ref (7) => green
    const ev = [];
    ev.push(...updateTimer(t, 0, 0));
    ev.push(...updateTimer(t, 300, 6));
    const s = ev.find((e) => e.type === 'sector');
    expect(s.status).toBe('green');
    expect(s.delta).toBeCloseTo(-1, 9);
    // sector 1 in 4 s: beats best-ever => purple
    const s1 = updateTimer(t, 600, 10).find((e) => e.type === 'sector');
    expect(s1.status).toBe('purple');
    expect(t.bestSectors[1]).toBeCloseTo(4, 9);
  });

  it('ignores driving backwards over the line and re-crossing', () => {
    const t = createTimer(L);
    drive(t, -1, 400, 50);
    const n = t.laps.length;
    const ev = [];
    ev.push(...updateTimer(t, 250, 20)); // reverse back over the sector 0/1 boundary
    ev.push(...updateTimer(t, 310, 21)); // forward again: already counted
    expect(ev.length).toBe(0);
    expect(t.laps.length).toBe(n);
  });

  it('seeded best from a previous session is used for deltas', () => {
    const t = createTimer(L, 3, { bestLap: 30, bestSectors: [10, 10, 10], refSectors: [10, 10, 10] });
    const { ev } = drive(t, -1, L + 1, 30); // 30 s lap, equal pace
    const lap = ev.find((e) => e.type === 'lap');
    expect(lap.delta).toBeCloseTo(0, 0);
  });
});

/** continue a drive from where `a` ended */
function drive2(t, a, v) {
  return drive(t, a.p, a.p + L, v, a.now).ev;
}

describe('ghost', () => {
  it('records at the sample rate and interpolates position and heading', () => {
    const r = createGhostRecorder(10);
    for (let k = 0; k <= 30; k++) recordGhost(r, k * 0.1 + 1e-9, k * 5, 0, 3.1 + k * 0.01);
    const g = finishGhost(r, 3);
    expect(g.samples.length).toBeGreaterThanOrEqual(30);
    const pose = sampleGhost(g, 1.25);
    expect(pose.x).toBeCloseTo(62.5, 0);
    expect(sampleGhost(g, 99)).toBeNull();
    expect(sampleGhost(null, 1)).toBeNull();
    resetGhost(r);
    expect(r.samples.length).toBe(0);
  });
  it('interpolates heading across the +-PI wrap', () => {
    const g = { hz: 1, samples: [[0, 0, 3.0], [0, 0, -3.0], [0, 0, -3.0]] };
    const pose = sampleGhost(g, 0.5);
    expect(Math.abs(Math.abs(pose.theta) - Math.PI)).toBeLessThan(0.2);
  });
});
