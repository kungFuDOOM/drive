// Client for the daily leaderboard (Supabase RPCs over plain fetch). No call ever throws:
// every one resolves to { ok: true, data } or { ok: false, offline, error }.

export const API_BASE = 'https://ksvfgxodbwfntqnahukn.supabase.co/rest/v1';
export const API_KEY = 'sb_publishable_8287XKULFN4VSUfXy9n4EQ_RR4wJ0hU'; // publishable: meant to ship in the client
const TIMEOUT_MS = 8000, TICK_MS = 250;

/**
 * A timeout that only counts time the page could respond in. Each tick counts once, however late it fires:
 * the first load can block the main thread longer than the whole timeout while a good reply waits in the queue,
 * and a plain setTimeout would then abort it before it is read.
 */
function responsiveTimeout(ms, fire) {
  const step = Math.min(TICK_MS, ms);
  let left = ms, timer;
  const tick = () => { left -= step; if (left > 0) timer = setTimeout(tick, step); else fire(); };
  timer = setTimeout(tick, step);
  return () => clearTimeout(timer);
}

export function createDailyApi({ fetch: send = (...a) => globalThis.fetch(...a), base = API_BASE, key = API_KEY, timeoutMs = TIMEOUT_MS } = {}) {
  async function rpc(fn, params, valid) {
    const abort = new AbortController();
    const stop = responsiveTimeout(timeoutMs, () => abort.abort());
    try {
      const res = await send(`${base}/rpc/${fn}`, {
        method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' }, body: JSON.stringify(params), signal: abort.signal,
      });
      // only a body that is not JSON reads as null; one that was cut off is a network failure, not an odd reply
      const data = await res.json().catch((e) => { if (e?.name === 'SyntaxError') return null; throw e; });
      if (!res.ok) return { ok: false, offline: false, error: String(data?.message || `HTTP ${res.status}`) };
      return valid(data) ? { ok: true, data } : { ok: false, offline: false, error: 'unexpected reply' };
    } catch {
      return { ok: false, offline: true, error: 'offline' };
    } finally {
      stop();
    }
  }
  return {
    /** run: { dayId, trackId, twist, playerId, name, timeMs, path } -> data { official, rank: number | null } */
    submitRun: (run) => rpc('drive_submit_run', {
      p_day_id: run.dayId, p_track_id: run.trackId, p_twist: run.twist, p_player_id: run.playerId,
      p_name: run.name, p_time_ms: run.timeMs, p_path: run.path,
    }, (d) => typeof d?.official === 'boolean' && (d.rank === null || Number.isFinite(d.rank))),
    /** -> data { total, top: [{ rank, name, time_ms, me }], me: { rank, name, time_ms } | null } */
    leaderboard: (dayId, playerId, limit = 10) => rpc('drive_leaderboard',
      { p_day_id: dayId, p_player_id: playerId, p_limit: limit }, (d) => Array.isArray(d?.top)),
    /** Owner only. -> data [{ name, time_ms, track_id, twist, path }], fastest first */
    adminReplay: (adminKey, dayId) => rpc('drive_admin_replay', { p_key: adminKey, p_day_id: dayId }, Array.isArray),
  };
}
