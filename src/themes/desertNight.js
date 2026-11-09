// Theme "Desert Night" (Sandglass Circuit): moonlit dunes, cacti and scrub, floodlight masts, stars, a fairground wheel.
// Same interface as circuitDay (it is the shared environment builder with a night/desert style).
import { createCircuitDay } from './circuitDay.js';

export const DESERT_NIGHT_STYLE = {
  name: 'desertNight',
  sky: { top: 0x0b1233, bot: 0x3a2c5a, rainTop: 0x151a2c, rainBot: 0x2c2c40, sunGlow: 0.25 },
  fog: [150, 860],
  sun: { color: 0xb4c2ff, intensity: 1.7, dir: [0.42, 0.78, -0.32], rainColor: 0x8a94b0, rainIntensity: 1.0 },
  hemi: { sky: 0x8a94d0, ground: 0x6a4a34, intensity: 1.35 },
  ground: { g1: 0xc99a5a, g2: 0xc29254, far: 0xb7854a, rock: 0x9a5a3a, amp: 38, rockFrom: 18 },
  gravel: [0xe0b878, 0xd4ab6c],
  trees: 'desert',
  clouds: false,
  night: true,
  landmark: 'ferris',
  fx: { sat: 0.95, tint: [0.94, 0.96, 1.08] },
  mood: { exposure: 1.2, bloom: 1.25, env: 0.18, asphalt: 0.75, asphaltEnv: 0.4, ao: 0.9 },
};

export function createDesertNight() { return createCircuitDay(DESERT_NIGHT_STYLE); }
