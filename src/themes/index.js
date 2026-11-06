// Theme registry: track defs name their theme by id.
import { createCircuitDay } from './circuitDay.js';
import { createDesertNight } from './desertNight.js';
import { createCoastal } from './coastal.js';

export const THEMES = { circuitDay: createCircuitDay, desertNight: createDesertNight, coastal: createCoastal };
/** New theme instance for a theme id (unknown ids fall back to Circuit Day). */
export function createTheme(id) { return (THEMES[id] || createCircuitDay)(); }
