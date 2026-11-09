// Theme "Forest" (Dripwood Vale): overcast woods, standing rain, puddles. The wet look is visual;
// grip still comes from the race weather, so a dry session is not a wet-setup race.
import { createCircuitDay } from './circuitDay.js';

export const FOREST_STYLE = {
  name: 'forest',
  sky: { top: 0x48647e, bot: 0x8fa3b4, rainTop: 0x3a5064, rainBot: 0x7f92a3, sunGlow: 0.3 },
  fog: [170, 900],
  sun: { color: 0xdfe5ee, intensity: 2.5, dir: [-0.35, 0.8, 0.3], rainColor: 0xa6b5c6, rainIntensity: 2.0 },
  hemi: { sky: 0xa9bccd, ground: 0x2a4a32, intensity: 0.75 },
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
  fx: { sat: 1.12, tint: [0.97, 1.0, 1.0] },
  cloudTint: 0.7,
  mood: { exposure: 1.05, bloom: 0.9, env: 0.35, asphalt: 0.85, ao: 0.65, contrast: 1.12, sat: 1.06 },
};

export function createForest() { return createCircuitDay(FOREST_STYLE); }
