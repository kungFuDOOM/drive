// Theme "Alpine" (Highpine Ring): cold daylight, snow, pines and a timber lodge.
import { createCircuitDay } from './circuitDay.js';

export const ALPINE_STYLE = {
  name: 'alpine',
  sky: { top: 0x8ec4f0, bot: 0xe9f3fb, rainTop: 0x8aa0b8, rainBot: 0xd5e0ea, sunGlow: 0.85 },
  fog: [150, 980],
  sun: { color: 0xfff6ea, intensity: 2.7, dir: [0.25, 0.74, 0.48] },
  hemi: { sky: 0xe7f2ff, ground: 0xc5d4e6, intensity: 1.05 },
  ground: { g1: 0xf4f8fc, g2: 0xe4eef6, far: 0xd0e0ee, rock: 0x8a847c, amp: 46, rockFrom: 34 },
  gravel: [0xf7fbff, 0xd5e4f4],
  trees: 'alpine',
  treeNear: 120,
  treeFar: 48,
  treeMaxH: 78,
  snowbanks: true,
  clouds: true,
  landmark: 'lodge',
  fx: { sat: 1.02, tint: [0.96, 0.98, 1.04] },
};

export function createAlpine() { return createCircuitDay(ALPINE_STYLE); }
