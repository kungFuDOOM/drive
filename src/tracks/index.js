// Track catalog: all circuits are original layouts with made-up names (real-world circuits only inspired corner types / flow).
import { CITADEL } from './citadel.js';
import { HIGHPINE } from './highpine.js';
import { DRIPWOOD } from './dripwood.js';
import { DESERT } from './desert.js';
import { LAMPWICK } from './lampwick.js';
import { COASTAL } from './coastal.js';
import { dailyTracks } from './daily/index.js';

export const TRACKS = [CITADEL, HIGHPINE, DRIPWOOD, DESERT, LAMPWICK, COASTAL];
export const TRACK_IDS = TRACKS.map((t) => t.id);
export const DEFAULT_TRACK = CITADEL.id;
/** A circuit or a loaded daily-only map, or null. */
export function findTrack(id) { return TRACKS.find((t) => t.id === id) || dailyTracks.get(id); }
/** Track definition by id (falls back to the default circuit for unknown ids). */
export function trackDef(id) { return findTrack(id) || CITADEL; }
export { CITADEL, HIGHPINE, DRIPWOOD, DESERT, LAMPWICK, COASTAL };
