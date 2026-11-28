import { describe, it, expect, vi } from 'vitest';
import { addDays } from './date.js';
import { FIRST_DAILY_DAY, FIXED_DAYS, ROTATIONS, TWISTS, dailyMap, dailyNumber, isPlayable, loadDayTrack, pastMaps } from './schedule.js';
import { dailyView } from './view.js';
import { defaultDailySave } from './progress.js';
import { DAILY_ONLY_TRACKS, createDailyTracks } from '../tracks/daily/index.js';
import { TRACKS, TRACK_IDS, findTrack } from '../tracks/index.js';
import { newCareer } from '../career.js';
import { THEMES } from '../themes/index.js';

const today = '2026-12-10';
const fixed = [{ day: today, trackId: 'newmap', twist: 'rain' }, { day: '2026-12-11', trackId: 'nextmap' }];

describe('fixed daily maps', () => {
  it('overrides the rotation for that day only', () => {
    expect(dailyMap(today, ROTATIONS, fixed)).toEqual({ dayId: today, trackId: 'newmap', twist: 'rain' });
    for (const d of [addDays(today, -1), addDays(today, 2)]) expect(dailyMap(d, ROTATIONS, fixed)).toEqual(dailyMap(d, ROTATIONS, []));
  });

  it('keeps the usual twist when the line names none', () => {
    expect(dailyMap('2026-12-11', ROTATIONS, fixed)).toEqual({ dayId: '2026-12-11', trackId: 'nextmap', twist: dailyMap('2026-12-11', ROTATIONS, []).twist });
  });

  it('falls back to the rotation on a day with no line', () => {
    const m = dailyMap('2026-12-20', ROTATIONS, fixed);
    expect(ROTATIONS[0].tracks).toContain(m.trackId);
  });

  it('every shipped line is dated once, in order, and names a real map', () => {
    const days = FIXED_DAYS.map((f) => f.day);
    expect(days).toEqual([...new Set(days)].sort());
    for (const f of FIXED_DAYS) {
      expect(TRACK_IDS.includes(f.trackId) || Object.hasOwn(DAILY_ONLY_TRACKS, f.trackId), f.trackId).toBe(true);
      if (f.twist) expect(TWISTS[f.twist]).toBeTruthy();
    }
  });

  it('numbers days from the first daily', () => {
    expect(dailyNumber(FIRST_DAILY_DAY)).toBe(1);
    expect(dailyNumber(addDays(FIRST_DAILY_DAY, 40))).toBe(41);
  });
});

describe('daily-only maps', () => {
  it('every registered file loads under its own id, with a known theme', async () => {
    const tracks = createDailyTracks(DAILY_ONLY_TRACKS);
    for (const id of Object.keys(DAILY_ONLY_TRACKS)) {
      expect(id.length).toBeLessThanOrEqual(32);
      expect(await tracks.load(id), id).toBe(true);
      expect(THEMES[tracks.get(id).theme], id).toBeTypeOf('function');
    }
  });

  it('are in no career or free-drive list', () => {
    const calendar = newCareer({ difficulty: 'normal', weather: 'auto' }).calendar;
    for (const id of Object.keys(DAILY_ONLY_TRACKS)) {
      expect(TRACK_IDS).not.toContain(id);
      expect(TRACKS.map((t) => t.id)).not.toContain(id);
      expect(calendar).not.toContain(id);
    }
  });

  it('load on demand, and a wrong or failed file is reported', async () => {
    const good = vi.fn(async () => ({ default: { id: 'newmap', name: 'New Map' } }));
    let broken = true;
    const tracks = createDailyTracks({ newmap: good, wrong: async () => ({ default: { id: 'other' } }), flaky: async () => { if (broken) throw new Error('offline'); return { default: { id: 'flaky' } }; } });
    expect(tracks.get('newmap')).toBeNull();
    expect(good).not.toHaveBeenCalled();
    expect(await tracks.load('newmap')).toBe(true);
    expect(tracks.get('newmap').name).toBe('New Map');
    expect(await tracks.load('wrong')).toBe(false);
    expect(await tracks.load('flaky')).toBe(false);
    broken = false;
    expect(await tracks.load('flaky')).toBe(true);
    expect(findTrack('newmap')).toBeNull(); // this test set is separate from the game's
    expect(TRACK_IDS).not.toContain('newmap');
  });
});

describe('future days stay hidden', () => {
  it('cannot be played or listed', () => {
    expect(isPlayable(addDays(today, 1), today)).toBe(false);
    expect(isPlayable(addDays(today, 30), today)).toBe(false);
    const v = dailyView(defaultDailySave(), today);
    for (const row of [v.today, ...v.past]) expect(row.dayId <= today).toBe(true);
    for (const m of pastMaps(today)) expect(m.dayId < today).toBe(true);
  });

  it('never fetches a future day’s map', async () => {
    const load = vi.fn(async () => true), tracks = { has: () => true, load };
    const map = { trackId: 'nextmap' };
    expect(await loadDayTrack('2026-12-11', today, { map, tracks })).toBe(false);
    expect(load).not.toHaveBeenCalled();
    expect(await loadDayTrack(today, today, { map, tracks })).toBe(true);
    expect(load).toHaveBeenCalledWith('nextmap');
  });
});
