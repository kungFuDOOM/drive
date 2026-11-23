import { describe, it, expect, beforeAll } from 'vitest';
import * as THREE from 'three';
import { Track } from '../track.js';
import { CITADEL } from '../tracks/citadel.js';
import { createCircuitDay, DAY_STYLE } from './circuitDay.js';
import { ALPINE_STYLE } from './alpine.js';
import { COASTAL_STYLE } from './coastal.js';
import { FOREST_STYLE } from './forest.js';
import { DESERT_NIGHT_STYLE } from './desertNight.js';
import { NEON_STYLE } from './neonStreet.js';

function stubDocument() {
  const ctx = new Proxy({}, { get: (t, k) => (k === 'measureText' ? () => ({ width: 10 }) : () => {}), set: () => true });
  globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ctx, style: {} }) };
}
const STYLES = [DAY_STYLE, ALPINE_STYLE, COASTAL_STYLE, FOREST_STYLE, DESERT_NIGHT_STYLE, NEON_STYLE];
const lum = (hex) => { const c = new THREE.Color(hex); return c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722; };

describe('per-theme mood (look rules)', () => {
  it('no theme lowers the bloom threshold, and day bloom stays restrained', () => {
    for (const S of STYLES) {
      const M = { ...DAY_STYLE.mood, ...S.mood };
      expect(M.threshold ?? 1, S.name).toBeGreaterThanOrEqual(1);
      if (!S.night) expect(M.bloom, S.name).toBeLessThanOrEqual(0.5);
      expect(M.contrast, S.name).toBeLessThanOrEqual(2); // the grade S-curve saturates at 2
    }
  });
  it('fog starts at 250 m or further on every theme', () => {
    for (const S of STYLES) expect((S.fog || DAY_STYLE.fog)[0], S.name).toBeGreaterThanOrEqual(250);
  });
  it('alpine snow albedo stays at or below 0.85 so it never clips', () => {
    for (const k of ['g1', 'g2', 'far']) expect(lum(ALPINE_STYLE.ground[k]), k).toBeLessThanOrEqual(0.85);
  });
  it('night themes keep a dim moon and a dark horizon', () => {
    for (const S of [DESERT_NIGHT_STYLE, NEON_STYLE]) { expect(S.sun.intensity).toBeLessThanOrEqual(2); expect(lum(S.sky.bot)).toBeLessThan(0.05); }
  });
});

describe('weather-matched environment probe', () => {
  let scene, theme, calls;
  const post = { setMood() {}, env: (kind, spec) => { calls.push({ kind, spec }); const t = new THREE.Texture(); t.name = spec ? spec.key : kind; return t; } };
  const road = () => { let m = null; scene.traverse((o) => { if (o.name === 'asphalt' && !m) m = o; }); return m.material; };
  beforeAll(() => {
    stubDocument();
    scene = new THREE.Scene(); calls = [];
    theme = createCircuitDay();
    theme.build(scene, new Track(CITADEL));
    theme.setWeather({ rain: 0, wetness: 0 });
    theme.applyMood(post);
  }, 60000);

  it('dry: the probe is built from the theme sky (blue zenith, part cloud, sun glow)', () => {
    const { kind, spec } = calls.at(-1);
    expect(kind).toBe('sky');
    expect(spec.top[2]).toBeGreaterThan(spec.top[0] * 2); // blue
    expect(spec.cover).toBeCloseTo(DAY_STYLE.cloudCover, 5);
    expect(spec.sunCol[0]).toBeGreaterThan(0);
    expect(spec.sunDir).toEqual(DAY_STYLE.sun.dir);
  });
  it('rain: a new overcast probe (closed grey cloud, no sun) replaces it on the road, pit lane and glass', () => {
    const n = calls.length, dry = scene.environment;
    theme.setWeather({ rain: 1, wetness: 1 });
    expect(calls.length).toBe(n + 1);
    const { spec } = calls.at(-1);
    expect(spec.key).not.toBe(calls[n - 1].spec.key);
    expect(spec.cover).toBeGreaterThanOrEqual(0.9);
    expect(Math.max(...spec.sunCol)).toBe(0);
    expect(spec.strips).toBe(0);
    const [r, g, b] = spec.cloudCol; expect(Math.max(r, g, b) - Math.min(r, g, b)).toBeLessThan(0.15); // grey
    expect(scene.environment).not.toBe(dry);
    expect(road().envMap).toBe(scene.environment);
  });
  it('the probe only rebuilds when the rain level crosses a step (5 steps), not every frame', () => {
    const n = calls.length;
    theme.setWeather({ rain: 0.97, wetness: 1 }); theme.setWeather({ rain: 0.93, wetness: 0.9 });
    expect(calls.length).toBe(n);
    theme.setWeather({ rain: 0.5, wetness: 0.9 });
    expect(calls.length).toBe(n + 1);
    theme.setWeather({ rain: 0, wetness: 0 });
  });
  it('rain never pulls the fog nearer than 250 m', () => {
    theme.setWeather({ rain: 1, wetness: 1 });
    expect(scene.fog.near).toBeGreaterThanOrEqual(250);
    theme.setWeather({ rain: 0, wetness: 0 });
    expect(scene.fog.near).toBe(DAY_STYLE.fog[0]);
  });
  it('night themes keep their own fixed probe (no weather spec)', () => {
    const s2 = new THREE.Scene(), t2 = createCircuitDay(NEON_STYLE), c0 = calls.length;
    t2.build(s2, new Track(CITADEL)); t2.applyMood(post); t2.setWeather({ rain: 1, wetness: 1 });
    const mine = calls.slice(c0);
    expect(mine.length).toBe(1);
    expect(mine[0].kind).toBe('neon'); expect(mine[0].spec).toBe(null);
    t2.dispose();
  }, 60000);
});
