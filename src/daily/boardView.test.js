import { describe, it, expect } from 'vitest';
import { leaderboardView, submitLine } from './boardView.js';
import { PLAYER_KEY, cleanName, loadPlayer, publicName } from './identity.js';

const ok = (data) => ({ ok: true, data });
const row = (rank, name, time_ms, me = false) => ({ rank, name, time_ms, me });

describe('leaderboard text', () => {
  it('formats the rows and your own rank', () => {
    const v = leaderboardView(ok({ total: 12, top: [row(1, 'Ada', 78412), row(2, 'Bo', 79000, true)], me: row(2, 'Bo', 79000) }));
    expect(v.rows).toEqual([{ rank: '1', name: 'Ada', time: '1:18.412', me: false }, { rank: '2', name: 'Bo', time: '1:19.000', me: true }]);
    expect(v.you).toBe('YOU #2 of 12  ·  1:19.000');
    expect(v.note).toBe('');
  });

  it('covers not-on-the-board, empty, loading, offline and server errors', () => {
    expect(leaderboardView(ok({ total: 0, top: [], me: null }))).toMatchObject({ you: 'Not on the board yet', note: 'No times yet. Set the first one!' });
    expect(leaderboardView(null).note).toBe('Loading…');
    expect(leaderboardView({ ok: false, offline: true }).note).toMatch(/Offline/);
    expect(leaderboardView({ ok: false, offline: false }).note).toMatch(/unavailable/);
  });

  it('words the result screen line, trusting the server’s official flag', () => {
    expect(submitLine({ status: 'sending' })).toBe('SENDING YOUR OFFICIAL TIME…');
    expect(submitLine({ status: 'sent', official: true, rank: 5 })).toBe('LEADERBOARD: YOU ARE #5');
    expect(submitLine({ status: 'sent', official: false, rank: 2 })).toMatch(/ALREADY USED. IT IS #2/);
    expect(submitLine({ status: 'sent', official: false, rank: null })).toMatch(/DID NOT COUNT/);
    expect(submitLine({ status: 'failed', offline: true })).toMatch(/^OFFLINE/);
  });
});

describe('player identity', () => {
  it('keeps only what the server accepts and hides rude names', () => {
    expect(cleanName('  <b>Zed_1.0-x</b> and a long tail ')).toBe('bZed_1.0-xb and');
    expect(publicName('')).toBe('Driver');
    expect(publicName('fuck')).toBe('Driver');
  });

  it('makes one id and remembers it with the name', () => {
    const m = new Map(), storage = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) };
    const a = loadPlayer(storage);
    expect(a.id).toMatch(/^[0-9a-f-]{36}$/);
    a.setName('Ada');
    expect(loadPlayer(storage)).toMatchObject({ id: a.id, name: 'Ada' });
    m.set(PLAYER_KEY, 'not json');
    expect(loadPlayer(storage).id).not.toBe(a.id);
    expect(loadPlayer(null).name).toBe('');
  });
});
