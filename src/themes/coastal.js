// Theme "Coastal" (Saltspray Coast): bright sea-cliff day, water to the north and east, sandy run-off, palms and a lighthouse.
// Same interface as circuitDay (it is the shared environment builder with a coastal style).
import { createCircuitDay } from './circuitDay.js';
import { smoothstep } from '../physics.js';

export const COASTAL_STYLE = {
  name: 'coastal',
  sky: { top: 0x2a86e0, bot: 0xd2ecff, rainTop: 0x5f7a96, rainBot: 0xa9bacb, sunGlow: 1.1 },
  fog: [140, 900],
  sun: { color: 0xfff4de, intensity: 3.0, dir: [0.5, 0.78, 0.38] },
  hemi: { sky: 0xd6ecff, ground: 0x6a9a50, intensity: 1.0 },
  ground: { g1: 0x7ad048, g2: 0x68c03e, far: 0x4f9e3a, rock: 0xb0a080, amp: 20, rockFrom: 16 },
  gravel: [0xf0dcaa, 0xe6d09a],
  trees: 'coastal',
  clouds: true,
  landmark: 'lighthouse',
  lighthouseAt: [495, 360],
  sea: { level: 0, water: 0x2a8ec8, sand: 0xf0dcaa, mask: (x, z) => Math.max(smoothstep(590, 650, z), smoothstep(500, 560, x)) },
  fx: { sat: 1.05, tint: [1, 1, 1] },
};

export function createCoastal() { return createCircuitDay(COASTAL_STYLE); }
