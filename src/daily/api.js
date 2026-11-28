// Client for the daily leaderboard (Supabase RPCs over plain fetch). No call ever throws:
// every one resolves to { ok: true, data } or { ok: false, offline, error }.

export const API_BASE = 'https://ksvfgxodbwfntqnahukn.supabase.co/rest/v1';
export const API_KEY = 'sb_publishable_8287XKULFN4VSUfXy9n4EQ_RR4wJ0hU'; // publishable: meant to ship in the client
const TIMEOUT_MS = 8000;

export function createDailyApi({ fetch: send = (...a) => globalThis.fetch(...a), base = API_BASE, key = API_KEY, timeoutMs = TIMEOUT_MS } = {}) {
  async function rpc(fn, params, valid) {
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), timeoutMs);
    try {
      const res = await send(`${base}/rpc/${fn}`, {
        method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' }, body: JSON.stringify(params), signal: abort.signal,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) return { ok: false, offline: false, error: String(data?.message || `HTTP ${res.status}`) };
      return valid(data) ? { ok: true, data } : { ok: false, offline: false, error: 'unexpected reply' };
    } catch {
      return { ok: false, offline: true, error: 'offline' };
    } finally {
      clearTimeout(timer);
    }
  }
  return {
    /** run: { dayId, trackId, twist, playerId, name, timeMs, path } -> data { rank } */
    submitRun: (run) => rpc('drive_submit_run', {
      p_day_id: run.dayId, p_track_id: run.trackId, p_twist: run.twist, p_player_id: run.playerId,
      p_name: run.name, p_time_ms: run.timeMs, p_path: run.path,
    }, (d) => Number.isFinite(d?.rank)),
    /** -> data { total, top: [{ rank, name, time_ms, me }], me: { rank, name, time_ms } | null } */
    leaderboard: (dayId, playerId, limit = 10) => rpc('drive_leaderboard',
      { p_day_id: dayId, p_player_id: playerId, p_limit: limit }, (d) => Array.isArray(d?.top)),
    /** Owner only. -> data [{ name, time_ms, track_id, twist, path }], fastest first */
    adminReplay: (adminKey, dayId) => rpc('drive_admin_replay', { p_key: adminKey, p_day_id: dayId }, Array.isArray),
  };
}
