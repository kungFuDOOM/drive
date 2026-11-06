// Track catalog: all circuits are original layouts with made-up names (real-world circuits only inspired corner types / flow).
import { CITADEL } from './citadel.js';
import { DESERT } from './desert.js';
import { COASTAL } from './coastal.js';

export const TRACKS = [CITADEL, DESERT, COASTAL];
export const TRACK_IDS = TRACKS.map((t) => t.id);
export const DEFAULT_TRACK = CITADEL.id;
/** Track definition by id (falls back to the default circuit for unknown ids). */
export function trackDef(id) { return TRACKS.find((t) => t.id === id) || CITADEL; }
export { CITADEL, DESERT, COASTAL };
