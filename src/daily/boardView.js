// Text for the leaderboard (Daily screen and menu hero) and the rank line on the result screen. Pure: no DOM.
import { formatTime } from '../timing.js';
import { publicName } from './identity.js';

const time = (ms) => formatTime(ms / 1000);

export const BOARD_LIMIT = 25; // rows asked for
export const NOT_ON_BOARD = 'Not on the board yet — your first lap today counts';

/**
 * result: null while loading, else what api.leaderboard resolved to.
 * offBoard: the line for a player with no row on this board.
 * `mine` is your own row when you are on the board but outside the rows that came back.
 */
export function leaderboardView(result, offBoard = NOT_ON_BOARD) {
  if (!result) return { state: 'loading', rows: [], note: 'Loading…', you: '', mine: null };
  if (!result.ok) {
    return { state: 'error', rows: [], note: result.offline ? 'Offline. Your times are still saved on this device.' : 'Leaderboard unavailable. Try again later.', you: '', mine: null };
  }
  const { top, me, total } = result.data;
  return {
    state: 'ok',
    rows: top.map((r) => ({ rank: String(r.rank), name: publicName(r.name), time: time(r.time_ms), me: !!r.me })),
    note: top.length ? '' : 'No official times yet — be the first!',
    you: me ? `YOU #${me.rank} of ${total}  ·  ${time(me.time_ms)}` : offBoard,
    mine: me && !top.some((r) => r.me) ? { rank: String(me.rank), name: publicName(me.name), time: time(me.time_ms), me: true } : null,
  };
}

/** The short board of the result screen: the first `count` rows, then your own row if it is further down. */
export function shortBoard(view, count) {
  const rows = view.rows.slice(0, count);
  const mine = view.mine || view.rows.slice(count).find((r) => r.me);
  return mine ? [...rows, { ...mine, apart: Number(mine.rank) > rows.length + 1 }] : rows;
}

/** Result screen of the run that set the official lap, from its submitter entry. */
export function submitLine(entry) {
  if (entry.status === 'sending') return 'SENDING YOUR OFFICIAL TIME…';
  if (entry.status === 'sent') {
    if (entry.official) return entry.rank == null ? 'OFFICIAL TIME ACCEPTED' : `LEADERBOARD: YOU ARE #${entry.rank}`;
    return entry.rank == null ? 'THE SERVER DID NOT COUNT THIS LAP' : `TODAY’S OFFICIAL RUN WAS ALREADY USED. IT IS #${entry.rank}`;
  }
  return entry.offline ? 'OFFLINE: OFFICIAL LAP SAVED, IT WILL BE SENT WHEN YOU ARE BACK TODAY' : 'LEADERBOARD UNAVAILABLE: OFFICIAL LAP SAVED, IT WILL BE SENT AGAIN TODAY';
}
