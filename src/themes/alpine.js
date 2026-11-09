// Theme "Alpine" (Highpine Ring): cold daylight, snow, pines and a timber lodge.
import { createCircuitDay } from './circuitDay.js';

export const ALPINE_STYLE = {
  name: 'alpine',
  sky: { top: 0x2266cc, bot: 0x9cc6ec, rainTop: 0x7088a2, rainBot: 0xb9c8d6, sunGlow: 0.9 },
  fog: [320, 1500],
  sun: { color: 0xfff4e4, intensity: 2.9, dir: [0.25, 0.74, 0.48] },
  hemi: { sky: 0xbcd4f2, ground: 0x7d8ea4, intensity: 0.62 },
  ground: { g1: 0xe3eaf2, g2: 0xd6e0eb, far: 0xc3d1e0, rock: 0x7a746c, amp: 46, rockFrom: 34 },
  gravel: [0xdfe7f0, 0xc9d6e4],
  trees: 'alpine',
  treeNear: 120,
  treeFar: 48,
  treeMaxH: 78,
  snowbanks: true,
  clouds: true,
  landmark: 'lodge',
  fx: { sat: 1.02, tint: [0.98, 0.99, 1.02] },
  // snow is the brightest albedo in the game: lowest exposure so it stays detailed white, never a clipped, glowing sheet
  mood: { exposure: 0.74, bloom: 0.8, env: 0.3, ao: 0.6, contrast: 1.16, sat: 1.1 },
};

export function createAlpine() { return createCircuitDay(ALPINE_STYLE); }
