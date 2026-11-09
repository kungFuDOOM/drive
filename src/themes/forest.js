// Theme "Forest" (Dripwood Vale): overcast woods, standing rain, puddles. The wet look is visual;
// grip still comes from the race weather, so a dry session is not a wet-setup race.
import { createCircuitDay } from './circuitDay.js';

export const FOREST_STYLE = {
  name: 'forest',
  sky: { top: 0x5d7c96, bot: 0xb7c6d2, rainTop: 0x3c5366, rainBot: 0x8b9bab, sunGlow: 0.35 },
  fog: [55, 420],
  sun: { color: 0xd5dde8, intensity: 2.1, dir: [-0.35, 0.8, 0.3], rainColor: 0x9aabbc, rainIntensity: 1.35 },
  hemi: { sky: 0xb7c6d4, ground: 0x2a4a32, intensity: 0.9 },
  ground: { g1: 0x1c5c30, g2: 0x164826, far: 0x0e331c, rock: 0x4a5648, amp: 16, rockFrom: 28 },
  gravel: [0x6a5436, 0x58462e],
  trees: 'forest',
  treeNear: 150,
  treeFar: 64,
  treeMaxH: 36,
  treeScale: 1.12,
  puddles: true,
  ambientRain: 0.72,
  ambientWet: 0.66,
  rainParticles: true,
  clouds: true,
  landmark: 'tower',
  fx: { sat: 0.92, tint: [0.9, 0.96, 1.0] },
  mood: { exposure: 1.05, bloom: 0.55, env: 0.45, asphalt: 0.85, ao: 0.95 },
};

export function createForest() { return createCircuitDay(FOREST_STYLE); }
