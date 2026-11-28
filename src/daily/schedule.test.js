import { describe, it, expect } from 'vitest';
import { addDays } from './date.js';
import { PAST_DAYS, ROTATIONS, TWISTS, dailyMap, isPlayable, pastMaps } from './schedule.js';
import { TRACK_IDS } from '../tracks/index.js';

const run = (from, n, rotations) => Array.from({ length: n }, (_, i) => dailyMap(addDays(from, i), rotations));

describe('daily date seed', () => {
  it('gives the same date the same map every time', () => {
    for (const m of run('2026-01-01', 400)) expect(dailyMap(m.dayId)).toEqual(m);
  });

  // Golden values: if this fails, shipped history changed and players would disagree about "today".
  it('pins known dates, so a code change cannot silently reshuffle them', () => {
    expect(['2026-11-24', '2026-11-25', '2026-11-26', '2026-11-27', '2026-11-28', '2027-03-14'].map((d) => {
      const m = dailyMap(d); return `${m.trackId}/${m.twist}`;
    })).toMatchInlineSnapshot(`
      [
        "desert/rain",
        "highpine/rain",
        "lampwick/rain",
        "coastal/rain",
        "lampwick/dry",
        "lampwick/rain",
      ]
    `);
  });

  it('varies the order between cycles and uses both twists', () => {
    const maps = run('2026-01-01', 360);
    const cycles = new Set();
    for (let i = 0; i < maps.length; i += 6) cycles.add(maps.slice(i, i + 6).map((m) => m.trackId).join());
    expect(cycles.size).toBeGreaterThan(30);
    const rain = maps.filter((m) => m.twist === 'rain').length;
    expect(rain).toBeGreaterThan(80);
    expect(rain).toBeLessThan(160);
    expect(maps.every((m) => TWISTS[m.twist])).toBe(true);
  });
});

describe('no repeats until the pool cycles', () => {
  it('uses every circuit exactly once per pass', () => {
    const n = ROTATIONS[0].tracks.length;
    const maps = run(ROTATIONS[0].from, n * 200);
    for (let i = 0; i < maps.length; i += n) {
      expect(new Set(maps.slice(i, i + n).map((m) => m.trackId)).size).toBe(n);
    }
  });

  it('never runs the same circuit two days in a row, including across passes', () => {
    const maps = run('2026-01-01', 1500);
    for (let i = 1; i < maps.length; i++) expect(maps[i].trackId).not.toBe(maps[i - 1].trackId);
  });

  it('still cycles cleanly for dates before the first rotation', () => {
    const maps = run(addDays(ROTATIONS[0].from, -18), 18);
    for (let i = 0; i < 18; i += 6) expect(new Set(maps.slice(i, i + 6).map((m) => m.trackId)).size).toBe(6);
  });

  it('an appended rotation adds circuits without changing earlier days', () => {
    const next = [...ROTATIONS, { from: '2027-01-01', tracks: [...ROTATIONS[0].tracks, 'newtrack'] }];
    expect(run('2026-11-01', 61, next)).toEqual(run('2026-11-01', 61));
    expect(new Set(run('2027-01-01', 7, next).map((m) => m.trackId)).size).toBe(7);
  });

  it('only schedules circuits that exist, and the newest pool has every circuit', () => {
    for (const r of ROTATIONS) for (const id of r.tracks) expect(TRACK_IDS).toContain(id);
    expect([...ROTATIONS.at(-1).tracks].sort()).toEqual([...TRACK_IDS].sort());
  });
});

describe('past days', () => {
  it('lists the 14 previous days, newest first, with the maps those days had', () => {
    const past = pastMaps('2026-11-05');
    expect(past).toHaveLength(PAST_DAYS);
    expect(past[0].dayId).toBe('2026-11-04');
    expect(past.at(-1).dayId).toBe('2026-10-22');
    for (const m of past) expect(m).toEqual(dailyMap(m.dayId));
  });

  it('allows today and the last 14 days only', () => {
    expect(isPlayable('2026-11-27', '2026-11-27')).toBe(true);
    expect(isPlayable('2026-11-13', '2026-11-27')).toBe(true);
    expect(isPlayable('2026-11-12', '2026-11-27')).toBe(false);
    expect(isPlayable('2026-11-28', '2026-11-27')).toBe(false);
  });
});
