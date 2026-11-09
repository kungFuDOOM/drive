// Theme "Desert Night" (Sandglass Circuit): moonlit dunes, cacti and scrub, floodlight masts, stars, a fairground wheel.
// Same interface as circuitDay (it is the shared environment builder with a night/desert style).
import { createCircuitDay } from './circuitDay.js';

export const DESERT_NIGHT_STYLE = {
  name: 'desertNight',
  sky: { top: 0x060a22, bot: 0x2c2552, rainTop: 0x10142a, rainBot: 0x26263c, sunGlow: 0.2 },
  fog: [280, 1300],
  sun: { color: 0xa9b8ff, intensity: 1.9, dir: [0.42, 0.78, -0.32], rainColor: 0x8a94b0, rainIntensity: 1.1 },
  hemi: { sky: 0x6c78c0, ground: 0x5a3e2a, intensity: 1.0 },
  ground: { g1: 0xc99a5a, g2: 0xc29254, far: 0xb7854a, rock: 0x9a5a3a, amp: 38, rockFrom: 18 },
  gravel: [0xe0b878, 0xd4ab6c],
  trees: 'desert',
  clouds: false,
  night: true,
  landmark: 'ferris',
  fx: { sat: 1, tint: [0.97, 0.98, 1.04] },
  cloudTint: 0.3,
  mood: { exposure: 1.15, bloom: 1.15, env: 0.3, envKind: 'night', asphalt: 0.75, asphaltEnv: 0.35, ao: 0.65, contrast: 1.1, sat: 1.1, vignette: 0.24 },
};

export function createDesertNight() { return createCircuitDay(DESERT_NIGHT_STYLE); }
