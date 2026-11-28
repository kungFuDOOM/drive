import { describe, it, expect } from 'vitest';
import { NOT_ON_BOARD, leaderboardView, shortBoard, submitLine } from './boardView.js';
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
    expect(leaderboardView(ok({ total: 0, top: [], me: null }))).toMatchObject({ state: 'ok', you: NOT_ON_BOARD, note: 'No official times yet — be the first!', mine: null });
    expect(leaderboardView(ok({ total: 3, top: [], me: null }), 'Official run already used').you).toBe('Official run already used');
    expect(leaderboardView(null).note).toBe('Loading…');
    expect(leaderboardView({ ok: false, offline: true }).note).toMatch(/Offline/);
    expect(leaderboardView({ ok: false, offline: false }).note).toMatch(/unavailable/);
  });

  it('keeps your own row when you are outside the rows that came back', () => {
    const top = Array.from({ length: 25 }, (_, i) => row(i + 1, `R${i + 1}`, 70000 + i));
    const far = leaderboardView(ok({ total: 57, top, me: row(42, 'Me', 80000) }));
    expect(far.you).toBe('YOU #42 of 57  ·  1:20.000');
    expect(far.mine).toEqual({ rank: '42', name: 'Me', time: '1:20.000', me: true });
    expect(shortBoard(far, 5).map((r) => r.rank)).toEqual(['1', '2', '3', '4', '5', '42']);
    expect(shortBoard(far, 5).at(-1)).toMatchObject({ me: true, apart: true });
  });

  it('shortens the board without repeating or losing your row', () => {
    const board = (mine) => {
      const top = Array.from({ length: 12 }, (_, i) => row(i + 1, `R${i + 1}`, 70000 + i, i + 1 === mine));
      return leaderboardView(ok({ total: 12, top, me: row(mine, `R${mine}`, 70000 + mine - 1) }));
    };
    expect(board(3).mine).toBeNull();
    expect(shortBoard(board(3), 5).map((r) => r.rank)).toEqual(['1', '2', '3', '4', '5']);
    expect(shortBoard(board(6), 5).at(-1)).toMatchObject({ rank: '6', me: true, apart: false });
    expect(shortBoard(board(9), 5).at(-1)).toMatchObject({ rank: '9', me: true, apart: true });
    expect(shortBoard(leaderboardView(null), 5)).toEqual([]);
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
