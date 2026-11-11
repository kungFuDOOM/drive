import { describe, it, expect } from 'vitest';
import { Track } from './track.js';
import { TRACKS } from './tracks/index.js';
import { HAIRPINS, WORST, hairpinAt } from './hairpins.js';
import { runHairpinMetric } from './hairpinMetric.js';

const tracks = Object.fromEntries(TRACKS.map((d) => [d.id, new Track(d)]));

describe('clog zone table', () => {
  it('has zones for every track', () => {
    for (const d of TRACKS) expect(HAIRPINS[d.id]?.length).toBeGreaterThan(0);
  });
  for (const d of TRACKS) it(`${d.id}: windows lie on the track, hold a corner, and do not overlap`, () => {
    const T = tracks[d.id], zs = HAIRPINS[d.id];
    for (const z of zs) {
      expect(z.s0).toBeGreaterThanOrEqual(0);
      expect(z.s1).toBeLessThanOrEqual(T.length);
      expect(z.s1).toBeGreaterThan(z.s0);
      let maxK = 0; // kappaS (10-sample smoothing) puts the open Crown Hairpin at 0.019; kappaN (3) keeps the peak
      for (let i = 0; i < T.n; i++) { const s = i * T.ds; if (s >= z.s0 && s <= z.s1) maxK = Math.max(maxK, Math.abs(T.kappaS[i]), Math.abs(T.kappaN[i])); }
      expect(maxK, z.id).toBeGreaterThan(0.02);
      expect(hairpinAt(d.id, (z.s0 + z.s1) / 2)).toBe(z);
    }
    const sorted = zs.slice().sort((a, b) => a.s0 - b.s0);
    for (let i = 1; i < sorted.length; i++) expect(sorted[i].s0).toBeGreaterThanOrEqual(sorted[i - 1].s1);
  });
  it('the Citadel Squeeze window covers every walled sample', () => {
    const T = tracks.citadel, z = HAIRPINS.citadel.find((q) => q.id === 'squeeze');
    expect(z.walled).toBe(true);
    let n = 0;
    for (let i = 0; i < T.n; i++) if (T.squeeze[i] === 1) { n++; const s = i * T.ds; expect(s).toBeGreaterThanOrEqual(z.s0); expect(s).toBeLessThanOrEqual(z.s1); }
    expect(n).toBeGreaterThan(0);
  });
});

describe('traffic metric at the clog zones (seed 1, Normal)', () => {
  it('Citadel: no crawling and no wall hits in any zone', () => {
    const m = runHairpinMetric({ tracks: TRACKS.filter((d) => d.id === 'citadel') }).citadel.normal;
    console.log('citadel squeeze', JSON.stringify(m.zones.squeeze));
    expect(m.finished).toBe(true);
    for (const id in m.zones) { expect(m.zones[id].crawlSec, id).toBe(0); expect(m.zones[id].wallHits, id).toBe(0); }
  }, 60000);
  it('reports the worst-zone crawl', () => {
    const m = runHairpinMetric({ tracks: TRACKS.filter((d) => WORST[d.id]) });
    const w = {};
    for (const id in WORST) for (const z of WORST[id]) w[z] = +m[id].normal.zones[z].crawlSec.toFixed(1);
    console.log('worst-zone crawlSec', JSON.stringify(w));
    for (const id in WORST) expect(m[id].normal.finished).toBe(true);
  }, 60000);
});
