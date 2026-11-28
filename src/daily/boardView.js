// Text for the leaderboard (Daily screen and menu hero) and the rank line on the result screen. Pure: no DOM.
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

/** Result screen of the run that set the official lap, from its submitter entry. */
export function submitLine(entry) {
  if (entry.status === 'sending') return 'SENDING YOUR OFFICIAL TIME…';
  if (entry.status === 'sent') {
    if (entry.official) return entry.rank == null ? 'OFFICIAL TIME ACCEPTED' : `LEADERBOARD: YOU ARE #${entry.rank}`;
    return entry.rank == null ? 'THE SERVER DID NOT COUNT THIS LAP' : `TODAY’S OFFICIAL RUN WAS ALREADY USED. IT IS #${entry.rank}`;
  }
  return entry.offline ? 'OFFLINE: OFFICIAL LAP SAVED, IT WILL BE SENT WHEN YOU ARE BACK TODAY' : 'LEADERBOARD UNAVAILABLE: OFFICIAL LAP SAVED, IT WILL BE SENT AGAIN TODAY';
}
