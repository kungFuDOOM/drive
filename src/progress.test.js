import { describe, it, expect } from 'vitest';
import {
  defaultSave, loadSave, persist, isUnlocked, lockMessage, recordRace, recordLap, getBest, timerSeed,
  getTrackBest, recordTrackLap, goalFor, evaluateGoal, DIFFICULTY, SAVE_KEY,
} from './progress.js';

const memStore = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) }; };

describe('save persistence', () => {
  it('returns defaults for empty or corrupt storage', () => {
    expect(loadSave(memStore())).toEqual(defaultSave());
    const s = memStore(); s.setItem(SAVE_KEY, '{nope');
    expect(loadSave(s)).toEqual(defaultSave());
    expect(loadSave(null)).toEqual(defaultSave());
  });
  it('round-trips through storage (incl. Infinity becoming null)', () => {
    const st = memStore(), save = defaultSave();
    recordLap(save, 'gp', { time: 80.5, sectors: [25, 30, 25.5] });
    save.unlocked.speedway = true;
    expect(persist(st, save)).toBe(true);
    const back = loadSave(st);
    expect(back.unlocked.speedway).toBe(true);
    expect(getBest(back, 'gp').bestLap).toBe(80.5);
  });
  it('merges missing fields from older saves', () => {
    const st = memStore(); st.setItem(SAVE_KEY, JSON.stringify({ podiums: 2 }));
    const s = loadSave(st);
    expect(s.podiums).toBe(2);
    expect(s.unlocked.gp).toBe(true);
  });
});

describe('best laps', () => {
  it('only a faster lap becomes the record; sector bests improve independently', () => {
    const save = defaultSave();
    expect(recordLap(save, 'gp', { time: 80, sectors: [25, 30, 25] })).toBe(true);
    expect(recordLap(save, 'gp', { time: 82, sectors: [24, 33, 25] })).toBe(false);
    const b = getBest(save, 'gp');
    expect(b.bestLap).toBe(80);
    expect(b.refSectors).toEqual([25, 30, 25]);
    expect(b.bestSectors).toEqual([24, 30, 25]);
    expect(getBest(save, 'speedway')).toBeNull();
  });
  it('keeps a best lap per circuit without changing the class best', () => {
    const save = defaultSave();
    expect(getTrackBest(save, 'citadel', 'gp')).toBeNull();
    expect(recordTrackLap(save, 'citadel', 'gp', { time: 48.2 })).toBe(true);
    expect(recordTrackLap(save, 'citadel', 'gp', { time: 49 })).toBe(false);
    expect(recordTrackLap(save, 'highpine', 'gp', { time: 51.5 })).toBe(true);
    expect(recordTrackLap(save, 'citadel', 'speedway', { time: 40 })).toBe(true);
    expect(getTrackBest(save, 'citadel', 'gp').bestLap).toBe(48.2);
    expect(getTrackBest(save, 'highpine', 'gp').bestLap).toBe(51.5);
    expect(getTrackBest(save, 'citadel', 'speedway').bestLap).toBe(40);
    expect(getBest(save, 'gp')).toBeNull();
    expect(recordTrackLap(save, 'citadel', 'gp', { time: Infinity })).toBe(false);
    const st = memStore();
    persist(st, save);
    expect(getTrackBest(loadSave(st), 'citadel', 'gp').bestLap).toBe(48.2);
  });
  it('old saves gain an empty track-best map', () => {
    const st = memStore();
    st.setItem(SAVE_KEY, JSON.stringify({ podiums: 1 }));
    expect(loadSave(st).trackBests).toEqual({});
  });
  it('timerSeed is empty without a best and restores Infinity for missing sectors', () => {
    const save = defaultSave();
    expect(timerSeed(save, 'gp')).toEqual({});
    recordLap(save, 'gp', { time: 70, sectors: [20, 25, 25] });
    const seed = timerSeed(save, 'gp');
    expect(seed.bestLap).toBe(70);
    expect(seed.refSectors).toEqual([20, 25, 25]);
  });
});

describe('class unlock progression', () => {
  it('speedway starts locked, gp unlocked', () => {
    const s = defaultSave();
    expect(isUnlocked(s, 'gp')).toBe(true);
    expect(isUnlocked(s, 'speedway')).toBe(false);
    expect(lockMessage('speedway')).toMatch(/LOCKED/);
    expect(lockMessage('gp')).toBe('');
  });
  it('finishing 4th in GP does not unlock and returns the lock reminder', () => {
    const s = defaultSave();
    const r = recordRace(s, { mode: 'race', cls: 'gp', pos: 4 });
    expect(r.unlocked).toEqual([]);
    expect(r.messages[0]).toMatch(/LOCKED/);
    expect(isUnlocked(s, 'speedway')).toBe(false);
  });
  it.each([1, 2, 3])('finishing P%i in a GP race unlocks speedway once', (pos) => {
    const s = defaultSave();
    const r = recordRace(s, { mode: 'race', cls: 'gp', pos });
    expect(r.unlocked).toEqual(['speedway']);
    expect(r.messages[0]).toMatch(/UNLOCKED/);
    expect(isUnlocked(s, 'speedway')).toBe(true);
    expect(s.podiums).toBe(1);
    expect(recordRace(s, { mode: 'race', cls: 'gp', pos }).unlocked).toEqual([]);
  });
  it('time trials and speedway podiums do not unlock', () => {
    const s = defaultSave();
    expect(recordRace(s, { mode: 'tt', cls: 'gp', pos: 1 }).unlocked).toEqual([]);
    expect(recordRace(s, { mode: 'race', cls: 'speedway', pos: 1 }).unlocked).toEqual([]);
    expect(isUnlocked(s, 'speedway')).toBe(false);
  });
});

describe('goals', () => {
  it('race goal depends on difficulty', () => {
    const s = defaultSave();
    expect(goalFor({ mode: 'race', difficulty: 'easy' }, s).text).toBe('Finish top 3');
    expect(goalFor({ mode: 'race', difficulty: 'hard' }, s).target).toBe(DIFFICULTY.hard.goalPos);
  });
  it('time trial goal asks to beat the stored best, or set a first time', () => {
    const s = defaultSave();
    expect(goalFor({ mode: 'tt', cls: 'gp' }, s).text).toMatch(/Set a lap/);
    recordLap(s, 'gp', { time: 75.25, sectors: [25, 25, 25.25] });
    const g = goalFor({ mode: 'tt', cls: 'gp' }, s);
    expect(g.text).toMatch(/1:15\.250/);
    expect(evaluateGoal(g, { bestLap: 74.9 }).met).toBe(true);
    expect(evaluateGoal(g, { bestLap: 76 }).met).toBe(false);
    expect(evaluateGoal(g, { bestLap: Infinity }).met).toBe(false);
  });
  it('evaluates position goals', () => {
    const g = goalFor({ mode: 'race', difficulty: 'normal' }, defaultSave());
    expect(evaluateGoal(g, { pos: 3 }).met).toBe(true);
    expect(evaluateGoal(g, { pos: 4 }).met).toBe(false);
  });
});
