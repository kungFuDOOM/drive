import { describe, it, expect } from 'vitest';
import {
  DAILY_SAVE_KEY, dailyGhostId, dailyTimerSeed, defaultDailySave, getDailyBest, loadDailySave, persistDailySave,
  pruneDailyGhosts, recordDailyLap, recordStreak, streakStatus,
} from './progress.js';
import { runSummary, dailyView } from './view.js';
import { ghostStorageKey, saveGhost } from '../ghostStore.js';

function memory() {
  const m = new Map();
  return {
    getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k),
    key: (i) => [...m.keys()][i] ?? null, get length() { return m.size; },
  };
}
const lap = (time) => ({ time, sectors: [time / 3, time / 3, time / 3] });
const finish = (save, day, today = day, time = 90) => recordDailyLap(save, day, lap(time), today);

describe('streaks', () => {
  it('the first finish of a day starts a streak and later finishes do not add to it', () => {
    const s = defaultDailySave();
    expect(finish(s, '2026-11-25').streakAdvanced).toBe(true);
    expect(finish(s, '2026-11-25', '2026-11-25', 80).streakAdvanced).toBe(false);
    expect(s.streak).toEqual({ current: 1, longest: 1, lastDay: '2026-11-25' });
  });

  it('finishing yesterday too adds to it', () => {
    const s = defaultDailySave();
    for (const d of ['2026-11-25', '2026-11-26', '2026-11-27']) finish(s, d);
    expect(s.streak).toMatchObject({ current: 3, longest: 3 });
  });

  it('a missed day resets to 1 and keeps the longest', () => {
    const s = defaultDailySave();
    for (const d of ['2026-11-20', '2026-11-21', '2026-11-22', '2026-11-24']) finish(s, d);
    expect(s.streak).toMatchObject({ current: 1, longest: 3, lastDay: '2026-11-24' });
  });

  it('runs on past days never change it, but still save a best', () => {
    const s = defaultDailySave();
    finish(s, '2026-11-25');
    const before = { ...s.streak };
    expect(finish(s, '2026-11-26', '2026-11-27')).toEqual({ newBest: true, streakAdvanced: false }); // filling yesterday's gap
    finish(s, '2026-11-20', '2026-11-27');
    expect(s.streak).toEqual(before);
    expect(getDailyBest(s, '2026-11-26')).not.toBeNull();
    finish(s, '2026-11-27');
    expect(s.streak.current).toBe(1);
  });

  it('a run that finishes after the reset belongs to a past day', () => {
    const s = defaultDailySave();
    expect(recordStreak(s, '2026-11-26', '2026-11-27')).toBe(false);
    expect(s.streak.current).toBe(0);
  });

  it('carries across both DST changes and year end', () => {
    for (const days of [['2026-03-07', '2026-03-08', '2026-03-09'], ['2026-10-31', '2026-11-01', '2026-11-02'], ['2026-12-31', '2027-01-01']]) {
      const s = defaultDailySave();
      for (const d of days) finish(s, d);
      expect(s.streak.current).toBe(days.length);
    }
  });

  it('winding the device clock back does not recount or reset', () => {
    const s = defaultDailySave();
    finish(s, '2026-11-26'); finish(s, '2026-11-27');
    expect(finish(s, '2026-11-25').streakAdvanced).toBe(false);
    expect(s.streak).toMatchObject({ current: 2, lastDay: '2026-11-27' });
  });

  it('shows 0 once a day has been missed, and the run is still alive the day after', () => {
    const s = defaultDailySave();
    finish(s, '2026-11-24'); finish(s, '2026-11-25');
    expect(streakStatus(s, '2026-11-25')).toEqual({ current: 2, longest: 2, doneToday: true });
    expect(streakStatus(s, '2026-11-26')).toEqual({ current: 2, longest: 2, doneToday: false });
    expect(streakStatus(s, '2026-11-27')).toEqual({ current: 0, longest: 2, doneToday: false });
  });
});

describe('daily bests', () => {
  it('keeps the fastest lap per day ID', () => {
    const s = defaultDailySave();
    expect(finish(s, '2026-11-27', '2026-11-27', 91).newBest).toBe(true);
    expect(finish(s, '2026-11-27', '2026-11-27', 92).newBest).toBe(false);
    expect(finish(s, '2026-11-27', '2026-11-27', 89).newBest).toBe(true);
    expect(getDailyBest(s, '2026-11-27').time).toBe(89);
    expect(getDailyBest(s, '2026-11-26')).toBeNull();
    expect(dailyTimerSeed(s, '2026-11-27')).toMatchObject({ bestLap: 89 });
    expect(dailyTimerSeed(s, '2026-11-26')).toEqual({});
  });

  it('ignores a lap without a real time', () => {
    const s = defaultDailySave();
    expect(finish(s, '2026-11-27', '2026-11-27', NaN)).toEqual({ newBest: false, streakAdvanced: false });
    expect(s).toEqual(defaultDailySave());
  });

  it('round-trips through storage and survives missing or corrupt data', () => {
    const store = memory(), s = defaultDailySave();
    finish(s, '2026-11-27');
    persistDailySave(store, s);
    expect(loadDailySave(store)).toEqual(s);
    for (const bad of ['not json', 'null', '5']) {
      store.setItem(DAILY_SAVE_KEY, bad);
      expect(loadDailySave(store)).toEqual(defaultDailySave());
    }
    expect(loadDailySave(null)).toEqual(defaultDailySave());
  });

  it('prunes only the ghosts of days that can no longer be raced', () => {
    const store = memory();
    for (const id of ['2026-11-27', '2026-11-13', '2026-11-12', '2026-01-01']) saveGhost(store, {}, dailyGhostId(id), 'gp', { samples: [] });
    saveGhost(store, {}, 'citadel', 'gp', { samples: [] });
    expect(pruneDailyGhosts(store, '2026-11-27')).toBe(2);
    expect(Array.from({ length: store.length }, (_, i) => store.key(i)).sort()).toEqual(
      ['citadel', dailyGhostId('2026-11-13'), dailyGhostId('2026-11-27')].map((id) => ghostStorageKey(id, 'gp')).sort());
  });
});

describe('daily screen and result text', () => {
  it('shows bests or "not raced" for past days', () => {
    const s = defaultDailySave();
    finish(s, '2026-11-26', '2026-11-27', 75.5);
    const v = dailyView(s, '2026-11-27');
    expect(v.past).toHaveLength(14);
    expect(v.past[0]).toMatchObject({ dayId: '2026-11-26', best: '1:15.500' });
    expect(v.past[1].best).toBeNull();
    expect(v.today.best).toBeNull();
  });

  it('says whether the run set a new best', () => {
    const s = defaultDailySave(), today = '2026-11-27';
    finish(s, today, today, 90);
    expect(runSummary(s, { dayId: today, bestBefore: null }, [90, 95], today)).toMatchObject({ title: 'DAILY', best: '1:30.000', newBest: true });
    expect(runSummary(s, { dayId: today, bestBefore: 90 }, [90.5], today)).toMatchObject({ newBest: false, verdict: 'NOT A NEW BEST  ·  +0.500s' });
    finish(s, today, today, 89);
    expect(runSummary(s, { dayId: today, bestBefore: 90 }, [91, 89], today)).toMatchObject({ newBest: true, best: '1:29.000', verdict: 'NEW BEST! 1.000s FASTER' });
    expect(runSummary(s, { dayId: today, bestBefore: 89 }, [], today)).toMatchObject({ newBest: false, verdict: 'NO COMPLETED LAP THIS RUN' });
  });

  it('labels a past day and says the streak is unchanged', () => {
    const s = defaultDailySave();
    finish(s, '2026-11-20', '2026-11-27');
    expect(runSummary(s, { dayId: '2026-11-20', bestBefore: null }, [90], '2026-11-27')).toMatchObject({
      title: 'PAST DAILY', bestLabel: 'BEST FOR FRI, NOV 20', streakLine: 'PAST DAY: YOUR STREAK IS UNCHANGED',
    });
  });
});
