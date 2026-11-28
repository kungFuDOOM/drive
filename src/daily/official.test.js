import { describe, it, expect, vi } from 'vitest';
import { createOfficialRuns, getOfficial } from './official.js';
import { createSubmitter } from './submit.js';
import { defaultDailySave, loadDailySave, persistDailySave } from './progress.js';
import { ONE_ATTEMPT, officialView } from './view.js';

const day = '2026-11-27';
const map = { dayId: day, trackId: 'citadel', twist: 'dry' };
const ghost = { hz: 10, time: 80, samples: [[0, 0, 0], [1, 1, 0]] };
const accepted = { ok: true, data: { official: true, rank: 4 } };
const offline = { ok: false, offline: true, error: 'offline' };
const board = (me) => ({ ok: true, data: { total: 1, top: [], me } });

function setup(answer = accepted, me = null) {
  const stored = new Map(), storage = { getItem: (k) => stored.get(k) ?? null, setItem: (k, v) => stored.set(k, v) };
  const save = defaultDailySave();
  const api = { submitRun: vi.fn(async () => answer), leaderboard: vi.fn(async () => board(me)) };
  let runs;
  const submitter = createSubmitter({ api, player: { id: 'p', name: 'Ada' }, onAnswer: (e) => runs.answered(e) });
  runs = createOfficialRuns({ save, persist: () => persistDailySave(storage, save), api, submitter, playerId: 'p' });
  return { save, api, runs, submitter, storage };
}

describe('one official run per day', () => {
  it('sends the first completed lap at once and never a later one, however fast', async () => {
    const { save, api, runs, submitter, storage } = setup();
    expect(officialView(save, day)).toMatchObject({ used: false, line: ONE_ATTEMPT });
    expect(runs.claim(map, 95, ghost)).not.toBeNull();
    expect(runs.claim(map, 70, ghost)).toBeNull();
    await submitter.settled();
    expect(api.submitRun).toHaveBeenCalledTimes(1);
    expect(api.submitRun.mock.calls[0][0].timeMs).toBe(95000);
    expect(loadDailySave(storage).official[day]).toEqual({ timeMs: 95000, status: 'official', rank: 4 });
    expect(officialView(save, day)).toMatchObject({ used: true, line: 'Official: 1:35.000 · #4', note: 'Replay — unofficial, won’t change the leaderboard.' });
  });

  it('starts fresh the next day', () => {
    const { runs } = setup();
    runs.claim(map, 95, ghost);
    expect(runs.claim({ ...map, dayId: '2026-11-28' }, 80, ghost)).not.toBeNull();
  });

  it('believes the server when it says the lap is unofficial', async () => {
    const { save, runs, submitter } = setup({ ok: true, data: { official: false, rank: 2 } });
    runs.claim(map, 95, ghost);
    await submitter.settled();
    expect(getOfficial(save, day)).toMatchObject({ status: 'rejected', rank: 2 });
    expect(officialView(save, day).line).toBe('Official run already used · #2');
    runs.board(day, board({ time_ms: 88000, rank: 2 }));
    expect(officialView(save, day).line).toBe('Official: 1:28.000 · #2');
  });

  it('takes an official run it did not know about from the board', () => {
    const { save, runs } = setup();
    runs.board(day, board({ time_ms: 88000, rank: 6 }));
    expect(runs.claim(map, 70, ghost)).toBeNull();
    expect(officialView(save, day)).toMatchObject({ state: 'official', line: 'Official: 1:28.000 · #6' });
  });

  it('keeps an unsent lap across a reload and sends that same lap again', async () => {
    const first = setup(offline);
    first.runs.claim(map, 95, ghost);
    await first.submitter.settled();
    expect(officialView(first.save, day).line).toBe('Official: 1:35.000 · not confirmed yet');
    const again = setup();
    Object.assign(again.save, loadDailySave(first.storage));
    await again.runs.sync(day);
    await again.submitter.settled();
    expect(again.api.submitRun.mock.calls[0][0].timeMs).toBe(95000);
    expect(getOfficial(again.save, day).status).toBe('official');
  });

  it('does not resend a lap the board already has, or one from an earlier day', async () => {
    const arrived = setup(offline, { time_ms: 95000, rank: 1 });
    arrived.runs.claim(map, 95, ghost);
    await arrived.runs.sync(day);
    expect(arrived.api.submitRun).toHaveBeenCalledTimes(1);
    expect(getOfficial(arrived.save, day).status).toBe('official');
    const stale = setup(offline);
    stale.runs.claim(map, 95, ghost);
    await stale.runs.sync('2026-11-28');
    expect(stale.api.submitRun).toHaveBeenCalledTimes(1);
  });
});
