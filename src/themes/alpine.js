// Theme "Alpine" (Highpine Ring): cold daylight, snow, pines and a timber lodge.
import { createCircuitDay } from './circuitDay.js';

export const ALPINE_STYLE = {
  name: 'alpine',
  sky: { top: 0x2266cc, bot: 0x9cc6ec, rainTop: 0x7088a2, rainBot: 0xb9c8d6, sunGlow: 0.9 },
  fog: [320, 1500],
  sun: { color: 0xfff4e4, intensity: 2.9, dir: [0.25, 0.74, 0.48] },
  hemi: { sky: 0xbcd4f2, ground: 0x7d8ea4, intensity: 0.62 },
  // snow: wind-scoured blue hollows and thin patches where the ground shows through; tall rocky peaks around the ring
  ground: { g1: 0xe3eaf2, g2: 0xd9e3ee, far: 0xc6d3e2, rock: 0x77726c, amp: 46, rockFrom: 58, patch: [0.44, 0.47, 0.53], patchAmt: 0.55, patch2: [0.47, 0.45, 0.42], patch2Amt: 0.35, hills: { n: 13, h: [30, 80], r: [90, 170] } },
  // cold, salted tarmac: grey dust, snow blown in along the edges
  road: { color: 0x54575c, rubber: 0.85, dust: [0.9, 0.93, 1.0], dustAmt: 0.5, bump: 0.5 },
  houses: 'chalet',
  gravel: [0xdfe7f0, 0xc9d6e4],
  trees: 'alpine',
  treeNear: 120,
  treeFar: 48,
  treeMaxH: 96,
  snowbanks: true,
  clouds: true,
  landmark: 'lodge',
  fx: { sat: 1.02, tint: [0.98, 0.99, 1.02] },
  // snow is the brightest albedo in the game: lowest exposure so it stays detailed white, never a clipped, glowing sheet
  mood: { exposure: 0.74, bloom: 0.4, env: 0.3, ao: 0.6, contrast: 1.16, sat: 1.1 },
};

export function createAlpine() { return createCircuitDay(ALPINE_STYLE); }
