// Sends new daily bests. Fire and forget: the race never waits for it. A failed send gets one more try,
// asked for by the result screen.
import { encodePath } from './runPath.js';
import { publicName } from './identity.js';

const MIN_MS = 10000, MAX_MS = 900000; // the server's limits

export function createSubmitter({ api, player }) {
  let entry = null; // the newest best: { run, status: 'sending' | 'sent' | 'failed', rank, offline, retried, done }
  let chain = Promise.resolve(); // sends go one at a time, so an older lap never lands after a newer one

  function send(e) {
    e.status = 'sending';
    e.done = chain = chain.then(() => api.submitRun(e.run)).then((r) => {
      e.status = r.ok ? 'sent' : 'failed';
      e.rank = r.ok ? r.data.rank : null;
      e.offline = !r.ok && r.offline;
      return e;
    });
    return e.done;
  }

  return {
    /** map: { dayId, trackId, twist }; time in seconds; ghost: that lap's recording. Returns the entry, or null if unsendable. */
    submit(map, time, ghost) {
      try {
        const timeMs = Math.round(time * 1000), path = encodePath(ghost);
        if (!path || !(timeMs >= MIN_MS && timeMs <= MAX_MS)) return null;
        entry = {
          run: { dayId: map.dayId, trackId: map.trackId, twist: map.twist, playerId: player.id, name: publicName(player.name), timeMs, path },
          status: 'sending', rank: null, offline: false, retried: false, done: null,
        };
        send(entry);
        return entry;
      } catch { return null; } // never into the race loop
    },
    get latest() { return entry; },
    /** Resolves when the newest entry has its answer; a failed one is sent once more, once. */
    async finish(e) {
      await e.done;
      if (e.status === 'failed' && !e.retried && e === entry) { e.retried = true; await send(e); }
      return e;
    },
    /** Resolves when nothing is in flight. */
    settled: () => chain.then(() => {}),
  };
}
