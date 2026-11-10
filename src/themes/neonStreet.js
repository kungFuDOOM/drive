// Theme "Neon Street" (Lampwick Mile): night city, glowing signs, blocks tight to the walls.
import { createCircuitDay } from './circuitDay.js';

export const NEON_STYLE = {
  name: 'neonStreet',
  sky: { top: 0x070314, bot: 0x221040, rainTop: 0x0a0512, rainBot: 0x1e0c30, sunGlow: 0.08 },
  fog: [220, 1100],
  sun: { color: 0xb8c0ff, intensity: 1.1, dir: [0.35, 0.82, -0.25], rainColor: 0x8a7aaa, rainIntensity: 0.9 },
  hemi: { sky: 0x343c58, ground: 0x14161e, intensity: 0.8 },
  // paved city ground: stained concrete, no hills
  ground: { g1: 0x2c313c, g2: 0x272c35, far: 0x1a1e28, rock: 0x3a404c, amp: 8, rockFrom: 40, patch: [0.6, 0.6, 0.62], patchAmt: 0.35, patch2: [0.38, 0.38, 0.4], patch2Amt: 0.5, hills: null },
  // street tarmac: patched, oily, less rubber than a permanent circuit
  road: { color: 0x40434c, rubber: 0.75, dust: [0.5, 0.5, 0.56], dustAmt: 0.22, bump: 0.6 },
  barrier: 'concrete',
  houses: null,
  gravel: [0x3a404c, 0x2e343e],
  trees: 'street',
  treeNear: 28,
  treeFar: 8,
  treeMaxH: 20,
  treeScale: 0.85,
  night: true,
  neon: true,
  wall: 'city',
  buildings: 'block',
  clouds: false,
  landmark: 'arch',
  fx: { sat: 1.05, tint: [1.02, 0.97, 1.04] },
  mood: { exposure: 1.1, bloom: 1.1, env: 0.45, envKind: 'neon', asphalt: 0.55, asphaltEnv: 0.18, ao: 0.65, contrast: 1.1, sat: 1.1, vignette: 0.24 },
};

export function createNeonStreet() { return createCircuitDay(NEON_STYLE); }
