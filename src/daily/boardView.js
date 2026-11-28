// Text for the leaderboard on the Daily screen and the rank line on the result screen. Pure: no DOM.
import { formatTime } from '../timing.js';
import { publicName } from './identity.js';

const time = (ms) => formatTime(ms / 1000);

/** result: null while loading, else what api.leaderboard resolved to. */
export function leaderboardView(result) {
  if (!result) return { state: 'loading', rows: [], note: 'Loading…', you: '' };
  if (!result.ok) {
    return { state: 'error', rows: [], note: result.offline ? 'Offline. Your times are still saved on this device.' : 'Leaderboard unavailable. Try again later.', you: '' };
  }
  const { top, me, total } = result.data;
  return {
    state: 'ok',
    rows: top.map((r) => ({ rank: String(r.rank), name: publicName(r.name), time: time(r.time_ms), me: !!r.me })),
    note: top.length ? '' : 'No times yet. Set the first one!',
    you: me ? `YOU #${me.rank} of ${total}  ·  ${time(me.time_ms)}` : 'Not on the board yet',
  };
}

/** Result screen, when this run sent a lap. */
export function submitLine(entry) {
  if (entry.status === 'sending') return 'SENDING YOUR TIME…';
  if (entry.status === 'sent') return `LEADERBOARD: YOU ARE #${entry.rank}`;
  return entry.offline ? 'OFFLINE: TIME SAVED ON THIS DEVICE ONLY' : 'LEADERBOARD UNAVAILABLE: TIME SAVED ON THIS DEVICE';
}

/** Result screen, when this run sent nothing (no new best): where the player already stands. */
export function standingLine(result) {
  const v = leaderboardView(result);
  if (v.state === 'loading') return 'CHECKING THE LEADERBOARD…';
  if (v.state === 'error') return 'LEADERBOARD UNAVAILABLE';
  const { me, total } = result.data;
  return me ? `LEADERBOARD: YOU ARE #${me.rank} of ${total}` : 'LEADERBOARD: NOT ON THE BOARD YET';
}
