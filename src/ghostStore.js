// Time-trial ghost persistence. Keyed by track + class so a Citadel GP ghost
// never plays back on Highpine. Legacy class-only keys are ignored (unknown track).
import { GHOST_KEY } from './progress.js';

export function ghostStorageKey(trackId, cls) {
  return `${GHOST_KEY}:${trackId}:${cls}`;
}

export function ghostCacheKey(trackId, cls) {
  return `${trackId}:${cls}`;
}

/** Read a ghost; never falls back to the old `GHOST_KEY:cls` entries. */
export function loadGhost(storage, cache, trackId, cls) {
  const ck = ghostCacheKey(trackId, cls);
  if (cache[ck] !== undefined) return cache[ck];
  try {
    const raw = storage?.getItem(ghostStorageKey(trackId, cls));
    cache[ck] = raw ? JSON.parse(raw) : null;
  } catch {
    cache[ck] = null;
  }
  return cache[ck];
}

export function saveGhost(storage, cache, trackId, cls, ghost) {
  const ck = ghostCacheKey(trackId, cls);
  cache[ck] = ghost;
  try {
    storage?.setItem(ghostStorageKey(trackId, cls), JSON.stringify(ghost));
    return true;
  } catch {
    return false;
  }
}
