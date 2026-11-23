import { describe, it, expect, beforeAll } from 'vitest';
import * as THREE from 'three';
import { Track } from '../track.js';
import { CITADEL } from '../tracks/citadel.js';
import { createCircuitDay, DAY_STYLE } from './circuitDay.js';

function stubDocument() {
  const ctx = new Proxy({}, { get: (t, k) => (k === 'measureText' ? () => ({ width: 10 }) : () => {}), set: () => true });
  globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx, style: {} }) };
}

describe('track surfaces (asphalt, kerbs, lines, verges)', () => {
  let scene, theme;
  const byName = (n) => { let m = null; scene.traverse((o) => { if (o.name === n && !m) m = o; }); return m; };
  beforeAll(() => {
    stubDocument();
    scene = new THREE.Scene();
    theme = createCircuitDay();
    theme.build(scene, new Track(CITADEL));
  }, 60000);

  it('day asphalt is dark tarmac', () => {
    expect(DAY_STYLE.road.color).toBe(0x3c3e42);
  });

  it('verges carry metres-from-the-edge for the mown stripes (one value per vertex)', () => {
    const v = byName('verge');
    const a = v.geometry.getAttribute('aMow');
    expect(a).toBeTruthy();
    expect(a.count).toBe(v.geometry.getAttribute('position').count);
    let max = 0;
    for (let i = 0; i < a.count; i++) { const x = a.getX(i); expect(Number.isFinite(x)).toBe(true); expect(x).toBeGreaterThanOrEqual(0); max = Math.max(max, x); }
    expect(max).toBeGreaterThan(5);
  });

  it('kerbs use their own glossier paint material, and painted albedo (luminance) never exceeds 0.8', () => {
    const kerbs = byName('kerbs'), marks = byName('markings'), road = byName('asphalt');
    expect(kerbs.material).not.toBe(marks.material);
    expect(kerbs.material.roughness).toBeLessThan(road.material.roughness);
    for (const m of [kerbs, marks]) {
      const c = m.geometry.getAttribute('color');
      let hi = 0;
      for (let i = 0; i < c.count; i++) hi = Math.max(hi, 0.2126 * c.getX(i) + 0.7152 * c.getY(i) + 0.0722 * c.getZ(i));
      expect(hi).toBeLessThanOrEqual(0.8);
    }
  });

  it('wet: standing water uniform follows wetness; the wet film stays rough (puddles do the mirroring)', () => {
    const road = byName('asphalt').material;
    theme.setWeather({ rain: 0, wetness: 0 });
    const dryEnv = road.envMapIntensity;
    expect(road.userData.uWet.value).toBe(0);
    theme.setWeather({ rain: 1, wetness: 1 });
    expect(road.userData.uWet.value).toBe(1);
    expect(road.roughness).toBeGreaterThanOrEqual(0.4);
    expect(road.envMapIntensity).toBeGreaterThan(dryEnv);
    theme.setWeather({ rain: 0, wetness: 0 });
    expect(road.userData.uWet.value).toBe(0);
  });

  it('asphalt gets the scene env map explicitly, so its own envMapIntensity applies', () => {
    const env = new THREE.Texture();
    theme.applyMood({ setMood() {}, env: () => env });
    expect(scene.environment).toBe(env);
    expect(byName('asphalt').material.envMap).toBe(env);
  });
});
