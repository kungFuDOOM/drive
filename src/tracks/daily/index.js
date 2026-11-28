// Daily-only maps: circuits that exist ONLY in the Race of the Day. They are deliberately not part of
// TRACKS / TRACK_IDS, so career, free drive, track select and every other mode never see them.
// Each one is a lazy chunk: its file is only fetched once its day has arrived.
//
// TO ADD A NEW DAILY MAP (one track file + one registry line + one schedule line):
//  1. Add src/tracks/daily/<id>.js with `export default { id: '<id>', name, theme, points, ... }`
//     (same shape as src/tracks/citadel.js, with an existing theme; the id must be new, 32 characters at most).
//  2. Register it below:        '<id>': () => import('./<id>.js'),
//  3. Schedule it in FIXED_DAYS in src/daily/schedule.js:   { day: 'YYYY-MM-DD', trackId: '<id>' },
//     with a day that has NOT started yet in America/Los_Angeles. Then test, build and deploy before that day.
// Keep old entries and files forever: past days and the owner replay still load them.

export const DAILY_ONLY_TRACKS = {
  // 'harbourloop': () => import('./harbourloop.js'),
};

/** A set of lazily loaded tracks. `loaders`: id -> () => Promise of a module whose default export is the track. */
export function createDailyTracks(loaders) {
  const loaded = new Map(), pending = new Map();
  const has = (id) => Object.hasOwn(loaders, id);
  return {
    has,
    /** The definition if it has been loaded, else null. */
    get: (id) => loaded.get(id) || null,
    /** Resolves true once get(id) works; false for an unknown id or a failed fetch (a later call tries again). */
    load(id) {
      if (loaded.has(id)) return Promise.resolve(true);
      if (!has(id)) return Promise.resolve(false);
      if (!pending.has(id)) {
        pending.set(id, Promise.resolve().then(loaders[id]).then((m) => {
          if (m?.default?.id !== id) return false;
          loaded.set(id, m.default);
          return true;
        }).catch(() => false).finally(() => pending.delete(id)));
      }
      return pending.get(id);
    },
  };
}

export const dailyTracks = createDailyTracks(DAILY_ONLY_TRACKS);
