import { describe, it, expect } from 'vitest';
import { TRACKS } from './tracks/index.js';
import { Track } from './track.js';
import {
  THEME_TAGS, themeTag, circuitCard, formatLength, thumbPixels, sampleCircuit, circuitLength,
} from './menuArt.js';

describe('menu track cards', () => {
  it('tags every circuit with the front-end theme name', () => {
    const labels = {
      citadel: 'DAY', highpine: 'SNOW', dripwood: 'RAIN',
      desert: 'DESERT NIGHT', lampwick: 'NEON', coastal: 'COAST',
    };
    for (const def of TRACKS) {
      const card = circuitCard(def);
      expect(card.tag.label).toBe(labels[def.id]);
      expect(card.tag).toBe(themeTag(def.theme));
      expect(THEME_TAGS[def.theme].id).toBeTruthy();
    }
  });

  it('unknown themes fall back to the day tag', () => {
    expect(themeTag('nope').label).toBe('DAY');
  });

  it('prints kilometres with two decimals', () => {
    expect(formatLength(3421)).toBe('3.42 km');
    expect(formatLength(Infinity)).toBe('-- km');
  });

  it('length stays close to the driven circuit, and the minimap stays inside the bitmap', () => {
    for (const def of TRACKS) {
      const card = circuitCard(def);
      const driven = new Track(def).length;
      expect(card.length).toBeGreaterThan(1500);
      expect(card.length).toBeLessThan(8000);
      expect(Math.abs(card.length - driven) / driven).toBeLessThan(0.08);
      const px = thumbPixels(card.samples, 168, 112, 12);
      expect(px.length).toBe(card.samples.length);
      for (const p of px) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(168);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(112);
      }
    }
  });

  it('a closed sample loop has a positive length', () => {
    const samples = sampleCircuit(TRACKS[0].points, 32);
    expect(samples).toHaveLength(32);
    expect(circuitLength(samples)).toBeGreaterThan(100);
  });
});
