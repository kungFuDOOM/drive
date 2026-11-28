import { describe, it, expect, vi } from 'vitest';
import { API_BASE, API_KEY, createDailyApi } from './api.js';
import { createSubmitter } from './submit.js';

const reply = (body, status = 200) => ({ ok: status < 300, status, json: async () => body });
const run = { dayId: '2026-11-27', trackId: 'citadel', twist: 'dry', playerId: 'p', name: 'Ada', timeMs: 80000, path: 'p1:x' };

describe('daily api', () => {
  it('posts named params with the publishable key', async () => {
    const send = vi.fn(async () => reply({ official: true, rank: 3 }));
    const api = createDailyApi({ fetch: send });
    expect(await api.submitRun(run)).toEqual({ ok: true, data: { official: true, rank: 3 } });
    const [url, init] = send.mock.calls[0];
    expect(url).toBe(`${API_BASE}/rpc/drive_submit_run`);
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual({ apikey: API_KEY, 'Content-Type': 'application/json' });
    expect(JSON.parse(init.body)).toEqual({ p_day_id: '2026-11-27', p_track_id: 'citadel', p_twist: 'dry', p_player_id: 'p', p_name: 'Ada', p_time_ms: 80000, p_path: 'p1:x' });

    send.mockResolvedValue(reply({ total: 0, top: [], me: null }));
    await api.leaderboard('2026-11-27', 'p');
    expect(send.mock.calls[1][0]).toBe(`${API_BASE}/rpc/drive_leaderboard`);
    expect(JSON.parse(send.mock.calls[1][1].body)).toEqual({ p_day_id: '2026-11-27', p_player_id: 'p', p_limit: 10 });

    send.mockResolvedValue(reply([]));
    await api.adminReplay('typed-key', '2026-11-27');
    expect(send.mock.calls[2][0]).toBe(`${API_BASE}/rpc/drive_admin_replay`);
    expect(JSON.parse(send.mock.calls[2][1].body)).toEqual({ p_key: 'typed-key', p_day_id: '2026-11-27' });
  });

  it('reports server errors, odd replies, offline and timeouts without throwing', async () => {
    const api = (send, extra) => createDailyApi({ fetch: send, ...extra });
    expect(await api(async () => reply({ message: 'forbidden' }, 403)).adminReplay('x', 'd')).toEqual({ ok: false, offline: false, error: 'forbidden' });
    expect(await api(async () => reply(null, 500)).leaderboard('d', 'p')).toMatchObject({ ok: false, error: 'HTTP 500' });
    expect(await api(async () => reply({})).submitRun(run)).toMatchObject({ ok: false, offline: false });
    expect(await api(async () => reply({ official: false, rank: null })).submitRun(run)).toMatchObject({ ok: true });
    expect(await api(async () => { throw new TypeError('Failed to fetch'); }).leaderboard('d', 'p')).toMatchObject({ ok: false, offline: true });
    const hang = (url, { signal }) => new Promise((_, fail) => signal.addEventListener('abort', () => fail(new Error('aborted'))));
    expect(await api(hang, { timeoutMs: 5 }).leaderboard('d', 'p')).toMatchObject({ ok: false, offline: true });
  });
});

// The live bug: HTTP 200 with a valid board, shown as "Leaderboard unavailable" on a first visit.
describe('daily api on a busy first load', () => {
  const empty = { total: 0, top: [], me: null };
  /** Like a browser: reading the body takes a moment, and fails if the request is aborted first. */
  const slowBody = async (url, { signal }) => ({
    ok: true, status: 200,
    json: () => new Promise((done, fail) => {
      const abort = () => fail(Object.assign(new Error('aborted'), { name: 'AbortError' }));
      if (signal.aborted) abort();
      signal.addEventListener('abort', abort);
      setTimeout(() => done(empty), 20);
    }),
  });

  it('reads a good reply even when the main thread was blocked for longer than the timeout', async () => {
    const pending = createDailyApi({ fetch: slowBody, timeoutMs: 500 }).leaderboard('2026-11-27', 'p');
    const until = Date.now() + 700;
    while (Date.now() < until); // the scene being built
    expect(await pending).toEqual({ ok: true, data: empty });
  });

  it('calls a body that never finished a network failure, not an unexpected reply', async () => {
    const stuck = async (url, { signal }) => ({ ok: true, status: 200, json: () => new Promise((_, fail) => signal.addEventListener('abort', () => fail(Object.assign(new Error('aborted'), { name: 'AbortError' })))) });
    expect(await createDailyApi({ fetch: stuck, timeoutMs: 20 }).leaderboard('d', 'p')).toEqual({ ok: false, offline: true, error: 'offline' });
    const html = async () => ({ ok: true, status: 200, json: async () => JSON.parse('<html>') });
    expect(await createDailyApi({ fetch: html }).leaderboard('d', 'p')).toEqual({ ok: false, offline: false, error: 'unexpected reply' });
  });
});

describe('submitter', () => {
  const map = { dayId: '2026-11-27', trackId: 'citadel', twist: 'dry' };
  const ghost = { hz: 10, time: 80, samples: [[0, 0, 0], [1, 1, 0]] };
  const player = { id: 'p', name: '' };

  it('sends a lap as Driver when unnamed, and retries a failed send only once', async () => {
    const submitRun = vi.fn(async () => ({ ok: false, offline: true, error: 'offline' }));
    const s = createSubmitter({ api: { submitRun }, player });
    const e = s.submit(map, 80.1234, ghost);
    expect(e.status).toBe('sending');
    await s.finish(e);
    await s.finish(e);
    expect(submitRun).toHaveBeenCalledTimes(2);
    expect(e).toMatchObject({ status: 'failed', offline: true });
    expect(submitRun.mock.calls[0][0]).toMatchObject({ ...map, playerId: 'p', name: 'Driver', timeMs: 80123 });
  });

  it('keeps the rank, and skips laps the server would refuse', async () => {
    const s = createSubmitter({ api: { submitRun: async () => ({ ok: true, data: { official: true, rank: 4 } }) }, player });
    expect(s.submit(map, 5, ghost)).toBeNull();
    expect(s.submit(map, 80, null)).toBeNull();
    const e = s.submit(map, 80, ghost);
    await s.settled();
    expect(e).toMatchObject({ status: 'sent', official: true, rank: 4 });
  });
});
