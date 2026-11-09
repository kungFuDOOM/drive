// Theme "Neon Street" (Lampwick Mile): night city, glowing signs, blocks tight to the walls.
import { createCircuitDay } from './circuitDay.js';

export const NEON_STYLE = {
  name: 'neonStreet',
  sky: { top: 0x12061c, bot: 0x3a1458, rainTop: 0x0c0614, rainBot: 0x241038, sunGlow: 0.08 },
  fog: [90, 620],
  sun: { color: 0xc8b4ff, intensity: 1.35, dir: [0.35, 0.82, -0.25], rainColor: 0x8a7aaa, rainIntensity: 0.9 },
  hemi: { sky: 0x6a4898, ground: 0x1a2030, intensity: 1.25 },
  ground: { g1: 0x2c313c, g2: 0x262b34, far: 0x1a1e28, rock: 0x3a404c, amp: 8, rockFrom: 40 },
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
  fx: { sat: 1.12, tint: [1.04, 0.94, 1.1] },
  mood: { exposure: 1.25, bloom: 1.7, env: 0.7, envKind: 'neon', asphalt: 0.38, asphaltEnv: 0.55, ao: 0.9 },
};

export function createNeonStreet() { return createCircuitDay(NEON_STYLE); }
