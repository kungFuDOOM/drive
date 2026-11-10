// Theme "Forest" (Dripwood Vale): overcast woods, standing rain, puddles. The wet look is visual;
// grip still comes from the race weather, so a dry session is not a wet-setup race.
import { createCircuitDay } from './circuitDay.js';

export const FOREST_STYLE = {
  name: 'forest',
  sky: { top: 0x48647e, bot: 0x8fa3b4, rainTop: 0x3a5064, rainBot: 0x7f92a3, sunGlow: 0.3 },
  fog: [170, 900],
  sun: { color: 0xdfe5ee, intensity: 2.5, dir: [-0.35, 0.8, 0.3], rainColor: 0xa6b5c6, rainIntensity: 2.0 },
  hemi: { sky: 0xa9bccd, ground: 0x2a4a32, intensity: 0.75 },
  // wet woodland floor: muddy leaf-litter patches and bright moss
  ground: { g1: 0x1f5a30, g2: 0x184a28, far: 0x10361e, rock: 0x4a5648, amp: 16, rockFrom: 40, patch: [0.56, 0.47, 0.32], patchAmt: 0.6, patch2: [0.4, 0.52, 0.34], patch2Amt: 0.5, hills: { n: 12, h: [12, 28], r: [70, 130] }, slope: { color: 0x4a5648, from: 0.14, to: 0.30, amt: 0.7 }, strata: { scale: 2.6, amt: 0.2 } },
  // damp, dark tarmac with leaf mould along the edges
  road: { color: 0x3f4247, rubber: 0.8, dust: [0.36, 0.34, 0.24], dustAmt: 0.45, bump: 0.6 },
  houses: 'cabin',
  facade: { h: 0.24, amt: 0.22 }, // facade courses (world-space joint spacing, darkening)
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
  mood: { exposure: 1.05, bloom: 0.5, env: 0.35, asphalt: 0.85, ao: 0.65, contrast: 1.12, sat: 1.06 },
};

export function createForest() { return createCircuitDay(FOREST_STYLE); }
