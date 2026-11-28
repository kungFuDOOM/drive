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

  const sent = (timeMs, extra = {}) => ({ run: { dayId: '2026-11-27', timeMs }, status: 'sent', official: true, rank: 3, ...extra });

  it('marks only the run that set the official lap as official', () => {
    const s = defaultDailySave(), today = '2026-11-27';
    expect(runSummary(s, { dayId: today, sent: null }, [], today)).toMatchObject({ kind: 'unused' });
    finish(s, today, today, 90);
    s.official[today] = { timeMs: 90000, status: 'official', rank: 3 };
    expect(runSummary(s, { dayId: today, sent: sent(90000) }, [90, 85], today)).toMatchObject({ kind: 'official', title: 'DAILY · OFFICIAL', best: '1:30.000', extra: expect.stringMatching(/UNOFFICIAL/) });
    expect(runSummary(s, { dayId: today, sent: null }, [80], today)).toMatchObject({
      kind: 'unofficial', best: '1:20.000', verdict: 'REPLAY — UNOFFICIAL, WON’T CHANGE THE LEADERBOARD', extra: 'OFFICIAL: 1:30.000 · #3',
    });
  });

  it('drops the official label when the server disagrees', () => {
    const s = defaultDailySave(), today = '2026-11-27';
    s.official[today] = { timeMs: 90000, status: 'rejected', rank: 5 };
    expect(runSummary(s, { dayId: today, sent: sent(90000, { official: false, rank: 5 }) }, [90], today).kind).toBe('unofficial');
    s.official[today] = { timeMs: 88000, status: 'official', rank: 2 }; // the board shows another lap
    expect(runSummary(s, { dayId: today, sent: sent(90000, { status: 'failed', official: null }) }, [90], today).kind).toBe('unofficial');
  });

  it('labels a past day unofficial and says the streak is unchanged', () => {
    const s = defaultDailySave();
    finish(s, '2026-11-20', '2026-11-27');
    expect(runSummary(s, { dayId: '2026-11-20', sent: null }, [90], '2026-11-27')).toMatchObject({
      kind: 'past', title: 'PAST DAILY · UNOFFICIAL', verdict: 'PAST DAY: UNOFFICIAL, NOTHING IS SENT', streakLine: 'PAST DAY: YOUR STREAK IS UNCHANGED',
    });
  });
});
