// Theme "Desert Night" (Sandglass Circuit): moonlit dunes, cacti and scrub, floodlight masts, stars, a fairground wheel.
// Same interface as circuitDay (it is the shared environment builder with a night/desert style).
import { createCircuitDay } from './circuitDay.js';

export const DESERT_NIGHT_STYLE = {
  name: 'desertNight',
  sky: { top: 0x060a22, bot: 0x2c2552, rainTop: 0x10142a, rainBot: 0x26263c, sunGlow: 0.2 },
  fog: [280, 1300],
  sun: { color: 0xa9b8ff, intensity: 1.9, dir: [0.42, 0.78, -0.32], rainColor: 0x8a94b0, rainIntensity: 1.1 },
  hemi: { sky: 0x6c78c0, ground: 0x5a3e2a, intensity: 1.0 },
  // dunes and flat-topped mesas; darker crusted patches and paler drifted sand
  ground: { g1: 0xc99a5a, g2: 0xbf9052, far: 0xb7854a, rock: 0x9a5a3a, amp: 38, rockFrom: 30, patch: [0.42, 0.4, 0.38], patchAmt: 0.5, patch2: [0.56, 0.54, 0.48], patch2Amt: 0.45, hills: { n: 10, h: [18, 40], r: [80, 150], flat: true }, slope: { color: 0x9a5a3a, from: 0.09, to: 0.22, amt: 0.95 }, strata: { scale: 1.8, amt: 0.5 } },
  // sand drifts onto the edges; the racing line is swept clean and rubbered
  road: { color: 0x474a52, rubber: 1, dust: [0.9, 0.72, 0.45], dustAmt: 0.6, bump: 0.5 },
  houses: 'adobe',
  facade: { h: 0.45, amt: 0.08 }, // facade courses (world-space joint spacing, darkening)
  gravel: [0xe0b878, 0xd4ab6c],
  trees: 'desert',
  clouds: false,
  night: true,
  landmark: 'ferris',
  fx: { sat: 1, tint: [0.97, 0.98, 1.04] },
  cloudTint: 0.3,
  mood: { exposure: 1.15, bloom: 0.95, env: 0.3, envKind: 'night', asphalt: 0.75, asphaltEnv: 0.35, ao: 0.65, contrast: 1.1, sat: 1.1, vignette: 0.24 },
};

export function createDesertNight() { return createCircuitDay(DESERT_NIGHT_STYLE); }
