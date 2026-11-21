// Visual budget + per-vertex surface checks for the cars (Node, no WebGL). cars.test.js keeps the gameplay-facing contract.
import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { bodyGeometry, buildBodyGeometry, wheelGeometry, sharedMaterials, SURF, WHEEL_R } from './cars.js';
import { TEAMS } from './teams.js';

const tris = (g) => g.attributes.position.count / 3;
const surfCounts = (g) => {
  const a = g.getAttribute('aSurf'), n = [0, 0, 0, 0, 0];
  expect(a).toBeTruthy(); expect(a.itemSize).toBe(1); expect(a.count).toBe(g.attributes.position.count);
  for (let i = 0; i < a.count; i += 3) {
    const v = a.getX(i);
    expect(Number.isInteger(v) && v >= 0 && v <= 4).toBe(true);
    expect(a.getX(i + 1)).toBe(v); expect(a.getX(i + 2)).toBe(v); // constant per triangle: no blending between surfaces
    n[v]++;
  }
  return n;
};

describe('car surfaces (aSurf) and triangle budgets', () => {
  for (const cls of ['gp', 'speedway']) {
    it(`${cls} body: aSurf on every vertex, paint + carbon + metal + glass in one mesh, within budget, symmetric`, () => {
      for (let i = 0; i < TEAMS.length; i++) {
        const g = bodyGeometry(cls, TEAMS[i], i), n = surfCounts(g);
        expect(tris(g)).toBeLessThanOrEqual(5000);
        expect(n[SURF.paint]).toBeGreaterThan(400); // most of the car is paint
        expect(n[SURF.carbon]).toBeGreaterThan(60); expect(n[SURF.metal]).toBeGreaterThan(40); expect(n[SURF.glass]).toBeGreaterThan(1);
        expect(n[SURF.rubber]).toBe(0);
        g.computeBoundingBox();
        expect(Math.abs(g.boundingBox.max.x + g.boundingBox.min.x)).toBeLessThan(1e-6);
      }
    });
    it(`${cls} body detail 2 (2x loft, 14 x 10 helmet): finite, same size class, <= 5k triangles, more than the shipped body`, () => {
      for (const i of [0, 3, 9]) {
        const g = buildBodyGeometry(cls, TEAMS[i], i, 2), base = bodyGeometry(cls, TEAMS[i], i);
        surfCounts(g);
        expect(g.attributes.position.array.every(Number.isFinite)).toBe(true);
        expect(g.attributes.normal.array.every(Number.isFinite)).toBe(true);
        expect(tris(g)).toBeGreaterThan(tris(base)); expect(tris(g)).toBeLessThanOrEqual(5000);
        g.computeBoundingBox(); base.computeBoundingBox();
        expect(g.boundingBox.min.y).toBeGreaterThan(0.04);
        expect(g.boundingBox.max.distanceTo(base.boundingBox.max)).toBeLessThan(0.02);
        expect(g.boundingBox.min.distanceTo(base.boundingBox.min)).toBeLessThan(0.02);
      }
    });
    it(`${cls} wheel: >= 32 radial segments, rounded shoulder, rubber tyre + metal rim, <= 1.2k triangles`, () => {
      const g = wheelGeometry(cls, TEAMS[0], 'dry'), n = surfCounts(g), p = g.attributes.position.array, R = WHEEL_R[cls];
      expect(tris(g)).toBeLessThanOrEqual(1200);
      expect(n[SURF.rubber]).toBeGreaterThan(400); expect(n[SURF.metal]).toBeGreaterThan(40); expect(n[SURF.glass]).toBe(0);
      const angles = new Set(), shoulder = new Set();
      for (let i = 0; i < p.length; i += 3) {
        const r = Math.hypot(p[i + 1], p[i + 2]);
        if (Math.abs(r - R) < 1e-5) angles.add(Math.round(Math.atan2(p[i + 2], p[i + 1]) * 1e4));
        if (p[i] > 0.15 && r > R * 0.945 && r < R + 1e-6) shoulder.add(Math.round(r * 1e4)); // rings between tread edge and sidewall
      }
      expect(angles.size).toBeGreaterThanOrEqual(32);
      expect(angles.size % 5).toBe(0); // spoke-pitch symmetry (anti-strobe) needs a multiple of the 5 spokes
      expect(shoulder.size).toBeGreaterThanOrEqual(4); // tread edge + 2 extra rings + sidewall top
    });
  }
  it('helmets are real spheres (>= 100 triangles), not a 6 x 4 lump', () => {
    for (const [cls, c, r] of [['gp', [0, 0.95, 0.08], 0.19], ['speedway', [0, 1.0, 0.4], 0.21]]) {
      const p = bodyGeometry(cls, TEAMS[0], 0).attributes.position.array, ctr = new THREE.Vector3(...c), v = new THREE.Vector3();
      let n = 0;
      for (let i = 0; i < p.length; i += 9) if ([0, 3, 6].every((k) => Math.abs(v.set(p[i + k], p[i + k + 1], p[i + k + 2]).distanceTo(ctr) - r) < 1e-4)) n++;
      expect(n).toBeGreaterThanOrEqual(100);
    }
  });
});

describe('shared car materials', () => {
  it('body and wheel shaders read aSurf: every patch anchor exists in this three version', () => {
    for (const [mat, lib] of [[sharedMaterials.bodyMat, THREE.ShaderLib.physical], [sharedMaterials.wheelMat, THREE.ShaderLib.standard]]) {
      const sh = { uniforms: {}, vertexShader: lib.vertexShader, fragmentShader: lib.fragmentShader };
      mat.onBeforeCompile(sh);
      expect(sh.vertexShader).toContain('attribute float aSurf'); expect(sh.vertexShader).toContain('vSurf = aSurf');
      expect(sh.fragmentShader).toContain('roughnessFactor = (sPaint'); expect(sh.fragmentShader).toContain('metalnessFactor = (sPaint');
      expect(sh.fragmentShader).toContain('radiance *= sEnv');
      expect(typeof mat.customProgramCacheKey()).toBe('string');
    }
    const sh = { uniforms: {}, vertexShader: THREE.ShaderLib.physical.vertexShader, fragmentShader: THREE.ShaderLib.physical.fragmentShader };
    sharedMaterials.bodyMat.onBeforeCompile(sh);
    expect(sh.fragmentShader).toContain('material.clearcoat = (sPaint * 0.800');
    expect(sharedMaterials.bodyMat.customProgramCacheKey()).not.toBe(sharedMaterials.wheelMat.customProgramCacheKey());
  });
  it('paint stays a clear-coated dielectric with a restrained env; lamps stay HDR so only they bloom', () => {
    const { bodyMat, wheelMat, lampMat } = sharedMaterials;
    expect(bodyMat.isMeshPhysicalMaterial).toBe(true); expect(bodyMat.clearcoat).toBeGreaterThan(0); // USE_CLEARCOAT must be on
    expect(bodyMat.metalness).toBeLessThan(0.1);
    expect(bodyMat.envMapIntensity).toBeGreaterThanOrEqual(0.4); expect(bodyMat.envMapIntensity).toBeLessThanOrEqual(0.6);
    expect(wheelMat.isMeshStandardMaterial).toBe(true);
    expect(Math.min(lampMat.color.r, lampMat.color.g, lampMat.color.b)).toBeGreaterThan(1);
  });
});
