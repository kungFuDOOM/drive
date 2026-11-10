// Theme "Coastal" (Saltspray Coast): bright sea-cliff day, water to the north and east, sandy run-off, palms and a lighthouse.
// Same interface as circuitDay (it is the shared environment builder with a coastal style).
import { createCircuitDay } from './circuitDay.js';
import { smoothstep } from '../physics.js';

export const COASTAL_STYLE = {
  name: 'coastal',
  sky: { top: 0x1468d4, bot: 0x8ccaf2, rainTop: 0x56708c, rainBot: 0x9aabbd, sunGlow: 1.1 },
  fog: [340, 1600],
  sun: { color: 0xfff2da, intensity: 3.4, dir: [0.5, 0.78, 0.38] },
  hemi: { sky: 0xb8dcff, ground: 0x5a8a44, intensity: 0.7 },
  // sun-dried coastal turf: straw patches on the headlands, greener hollows, pale rock on the steeper ground
  ground: { g1: 0x638c42, g2: 0x587f3c, far: 0x4d723a, rock: 0xa89878, amp: 20, rockFrom: 30, patch: [0.66, 0.6, 0.36], patchAmt: 0.6, patch2: [0.42, 0.48, 0.36], patch2Amt: 0.4, hills: { n: 9, h: [10, 24], r: [70, 120] }, slope: { color: 0xb09f80, from: 0.10, to: 0.24, amt: 0.9 }, strata: { scale: 2.2, amt: 0.3 } },
  // sand blows across the road and bleaches the edges
  road: { color: 0x505358, rubber: 0.95, dust: [0.85, 0.75, 0.55], dustAmt: 0.5, bump: 0.5 },
  houses: 'villa',
  gravel: [0xe2cc98, 0xd6c08a],
  trees: 'coastal',
  // trackside clumps stay; the far woods were most of the palm triangle cost and sit in the fog
  treeNear: 130,
  treeFar: 16,
  clouds: true,
  landmark: 'lighthouse',
  lighthouseAt: [495, 360],
  sea: { level: 0, water: 0x1a78b8, sand: 0xe6d29e, mask: (x, z) => Math.max(smoothstep(590, 650, z), smoothstep(500, 560, x)) },
  fx: { sat: 1.05, tint: [1, 1, 1] },
  mood: { exposure: 0.9, bloom: 0.5, env: 0.38, contrast: 1.14, sat: 1.14 },
};

export function createCoastal() { return createCircuitDay(COASTAL_STYLE); }
