// The one official run per day: the player's FIRST completed lap of today. Later laps are replays and are
// never sent. The server has the last word (its `official` flag and its official-only leaderboard).
//
// save.official[dayId] = { timeMs, status, rank, run? }
//   'pending'  our first lap, not yet confirmed (`run` is kept so it can be sent again)
//   'official' the server holds this time as the day's official run
//   'rejected' the server stored our lap as unofficial, and we have not seen which run counts

export const getOfficial = (save, id) => save.official?.[id] || null;

/** Server truth from a leaderboard reply: `me` is only ever this player's official run. */
export function adoptBoard(save, id, me) {
  if (!Number.isFinite(me?.time_ms)) return false;
  save.official[id] = { timeMs: me.time_ms, status: 'official', rank: me.rank };
  return true;
}

/** Apply the answer to a send (a submitter entry). A failed send leaves the lap pending. */
export function applyAnswer(save, entry) {
  const rec = getOfficial(save, entry.run.dayId);
  if (rec?.status !== 'pending' || rec.timeMs !== entry.run.timeMs || entry.status !== 'sent') return false;
  save.official[entry.run.dayId] = { timeMs: rec.timeMs, status: entry.official ? 'official' : 'rejected', rank: entry.rank };
  return true;
}

/** persist(): write the save to storage. */
export function createOfficialRuns({ save, persist, api, submitter, playerId }) {
  let syncing = null;
  return {
    /**
     * A lap of day `map.dayId` was just completed. If it is the first one of that day, it becomes the official
     * attempt: remembered and sent at once, whatever the time. Returns the submitter entry, else null.
     */
    claim(map, time, ghost) {
      if (getOfficial(save, map.dayId)) return null;
      const entry = submitter.submit(map, time, ghost);
      if (!entry) return null;
      for (const rec of Object.values(save.official)) delete rec.run; // older unsent laps can no longer be accepted
      save.official[map.dayId] = { timeMs: entry.run.timeMs, status: 'pending', rank: null, run: entry.run };
      persist();
      return entry;
    },
    /** The submitter's onAnswer. */
    answered(entry) { if (applyAnswer(save, entry)) persist(); },
    /** Take today's leaderboard reply as the truth. */
    board(id, result) { if (result.ok && adoptBoard(save, id, result.data.me)) persist(); },
    /**
     * Send a still unconfirmed official lap of today again (it failed earlier, or the page closed).
     * The board is asked first: if the lap did arrive, sending it again would only add an unofficial copy.
     */
    sync(todayId) {
      syncing ||= (async () => {
        await submitter.settled();
        if (getOfficial(save, todayId)?.status !== 'pending') return;
        const board = await api.leaderboard(todayId, playerId, 1);
        if (!board.ok) return;
        this.board(todayId, board);
        const rec = getOfficial(save, todayId);
        if (rec.status === 'pending' && rec.run) await submitter.resend(rec.run).done;
      })().finally(() => { syncing = null; });
      return syncing;
    },
  };
}
