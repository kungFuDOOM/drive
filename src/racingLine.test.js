import { describe, it, expect } from 'vitest';
import { Track } from './track.js';
import { CLASSES, brakeCapacity } from './physics.js';
import {
  computeRacingLine, lineProfile, LINE_MARGIN, LINE_MARGIN_SQUEEZE, requiredDecel, guideLevel, guideColor, GUIDE, fillGuide, guideSamples,
  GUIDE_LIFT, GUIDE_AHEAD, GUIDE_BACK, lineGuideEnabled, K_TIGHT,
} from './racingLine.js';
import { DIFFICULTY } from './progress.js';

const T = new Track(), gp = CLASSES.gp, line = computeRacingLine(T), prof = lineProfile(T, gp);

describe('racing line geometry', () => {
  it('stays inside the road with clearance beyond the white line / kerb everywhere', () => {
    for (let i = 0; i < T.n; i++) {
      const margin = T.squeeze[i] ? LINE_MARGIN_SQUEEZE : LINE_MARGIN;
      expect(Math.abs(line.d[i])).toBeLessThanOrEqual(T.half[i] - margin + 1e-3);
      expect(T.surfaceAt(i, line.d[i])).toBe('asphalt');
    }
  });
  it('is cached and shared (Track.line is the line)', () => {
    expect(T.line).toBe(line.d);
    expect(computeRacingLine(T)).toBe(line);
    expect(new Track().line).toBe(line.d);
  });
  it('has no oscillation: lateral slope and lateral curvature are bounded, even through the esses', () => {
    let maxSlope = 0, maxCurv = 0;
    for (let i = 0; i < T.n; i++) {
      const a = (i + T.n - 1) % T.n, b = (i + 1) % T.n;
      maxSlope = Math.max(maxSlope, Math.abs(line.d[b] - line.d[a]) / (2 * T.ds));
      maxCurv = Math.max(maxCurv, Math.abs(line.d[b] - 2 * line.d[i] + line.d[a]) / (T.ds * T.ds));
    }
    expect(maxSlope).toBeLessThan(0.45);
    expect(maxCurv).toBeLessThan(0.08);
  });
  it('outside - apex - outside: in every long corner the line turns in from the outside, clips the inside, and runs back out', () => {
    // corner = run of samples with |centre-line curvature| > 0.005 for >= 60 m
    const k = T.kappaS, runs = [];
    let st = -1;
    for (let i = 0; i <= T.n; i++) {
      const on = i < T.n && Math.abs(k[i]) > 0.005 && T.squeeze[i] === 0;
      if (on && st < 0) st = i;
      if (!on && st >= 0) { if ((i - st) * T.ds >= 60 && Math.sign(k[st]) === Math.sign(k[i - 1])) runs.push([st, i - 1]); st = -1; }
    }
    expect(runs.length).toBeGreaterThanOrEqual(3);
    for (const [a, b] of runs) {
      const sg = Math.sign(k[Math.floor((a + b) / 2)]); // + = left corner, inside = +d
      const inside = (i) => line.d[i] * sg;
      let peak = -1e9;
      for (let i = a; i <= b; i++) peak = Math.max(peak, inside(i));
      const early = Math.min(inside(a), inside(Math.max(0, a - 4))), late = Math.min(inside(b), inside((b + 4) % T.n));
      expect(peak - early).toBeGreaterThan(1.2);   // turn-in from the outside side...
      expect(peak - late).toBeGreaterThan(1.2);    // ...and track-out back to the outside
      expect(peak).toBeGreaterThan(0.5);           // apex is on the inside half of the road
    }
  });
  it('the line is no tighter than the centre line in corners (larger radius = more speed)', () => {
    let sl = 0, sc = 0, n = 0;
    for (let i = 0; i < T.n; i++) if (Math.abs(T.kappaS[i]) > 0.008 && !T.squeeze[i]) { n++; sl += Math.abs(line.kappa[i]); sc += Math.abs(T.kappaS[i]); }
    expect(n).toBeGreaterThan(20);
    expect(sl).toBeLessThan(sc);
  });
});

describe('speed profile along the line: braking zones and apexes', () => {
  const N = T.n;
  const minima = [];
  for (let i = 0; i < N; i++) {
    let isMin = true;
    for (let q = -12; q <= 12 && isMin; q++) if (prof.v[(i + q + N) % N] < prof.v[i]) isMin = false;
    if (isMin && prof.v[i] < gp.vTop * 0.7) minima.push(i);
  }
  it('has several slow-corner apexes, each at (near) peak line curvature', () => {
    expect(minima.length).toBeGreaterThanOrEqual(3);
    for (const m of minima) {
      let kmax = 0;
      for (let q = -12; q <= 12; q++) kmax = Math.max(kmax, Math.abs(line.kappa[(m + q + N) % N]));
      expect(Math.abs(line.kappa[m])).toBeGreaterThan(kmax * 0.4);
    }
  });
  it('braking zones: speed falls into each apex at no more than the planned (80 %) brake capacity', () => {
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N;
      const decel = (prof.v[i] ** 2 - prof.v[j] ** 2) / (2 * T.ds);
      if (decel > 0) expect(decel).toBeLessThan(brakeCapacity(gp, prof.v[i], 1) * 0.8 + 1);
    }
  });
  it('braking is required into the slow corners: the entry speed is far above the apex speed', () => {
    const hard = minima.filter((m) => prof.v[m] < 45);
    expect(hard.length).toBeGreaterThanOrEqual(2);
    for (const m of hard) {
      const dist = Math.floor(160 / T.ds);
      const vEntry = Math.max(...Array.from({ length: dist }, (_, q) => prof.v[(m - q + N) % N]));
      expect(vEntry).toBeGreaterThan(prof.v[m] * 1.4);
    }
  });
  it('after the apex the allowed speed rises again (acceleration phase)', () => {
    for (const m of minima) expect(prof.v[(m + 10) % N]).toBeGreaterThan(prof.v[m]);
  });
});

describe('F1-style guide colours', () => {
  const cap = 40;
  it('required deceleration is v^2 - vt^2 over twice the distance, zero when slow enough', () => {
    expect(requiredDecel(80, 40, 100)).toBeCloseTo((6400 - 1600) / 200, 6);
    expect(requiredDecel(30, 40, 100)).toBe(0);
    expect(Number.isFinite(requiredDecel(80, 40, 0))).toBe(true);
  });
  it('level thresholds: green = ample margin, yellow = lift / caution, red = brake firmly', () => {
    expect(guideLevel(0, cap)).toBe(0);
    expect(guideLevel(GUIDE.YELLOW * cap - 0.1, cap)).toBe(0);
    expect(guideLevel(GUIDE.YELLOW * cap + 0.1, cap)).toBe(1);
    expect(guideLevel(GUIDE.RED * cap - 0.1, cap)).toBe(1);
    expect(guideLevel(GUIDE.RED * cap + 0.1, cap)).toBe(2);
    expect(guideLevel(25, 40)).toBe(2);
  });
  it('colours are green -> yellow -> red and blend smoothly in between', () => {
    const c = [0, 0, 0];
    guideColor(0, cap, c); expect(c[1]).toBeGreaterThan(0.8); expect(c[0]).toBeLessThan(0.4);
    guideColor(GUIDE.YELLOW * cap + 1, cap, c); expect(c[0]).toBeGreaterThan(0.9); expect(c[1]).toBeGreaterThan(0.7);
    guideColor(cap, cap, c); expect(c[0]).toBeGreaterThan(0.9); expect(c[1]).toBeLessThan(0.3);
    let prev = null;
    for (let a = 0; a <= cap; a += 0.5) { guideColor(a, cap, c); if (prev) expect(Math.abs(c[0] - prev[0]) + Math.abs(c[1] - prev[1])).toBeLessThan(0.35); prev = [...c]; }
  });
  // ribbon in front of the Moat Sweep corner: find a braking approach
  const apex = (() => { let bi = 0; for (let i = 0; i < T.n; i++) if (T.sectionName(i) === 'Moat Sweep' && prof.v[i] < prof.v[bi] || (bi === 0 && T.sectionName(i) === 'Moat Sweep')) bi = i; return bi; })();
  const sApex = apex * T.ds;
  const ribbon = (s, v) => {
    const n = guideSamples(T), pos = new Float32Array(n * 6), col = new Float32Array(n * 8);
    fillGuide(T, gp, s, v, 1, pos, col, n);
    const lv = []; for (let k = 0; k < n; k++) lv.push(col[k * 8] > 0.9 && col[k * 8 + 1] < 0.5 ? 2 : col[k * 8] > 0.9 ? 1 : 0);
    return { pos, col, lv, n };
  };
  it('the same stretch of road changes colour with the player speed (not pre-baked)', () => {
    const s = sApex - 120;
    const slow = ribbon(s, 25), mid = ribbon(s, 60), fast = ribbon(s, 85);
    const reds = (r) => r.lv.filter((x) => x === 2).length, yel = (r) => r.lv.filter((x) => x === 1).length;
    expect(reds(slow)).toBe(0);
    expect(reds(fast)).toBeGreaterThan(reds(mid));
    expect(reds(fast)).toBeGreaterThan(3);
    expect(reds(fast) + yel(fast)).toBeGreaterThan(reds(slow) + yel(slow));
    expect(Array.from(fast.col)).not.toEqual(Array.from(slow.col));
  });
  it('closing on the corner turns the guide from green to red (distance vs braking deceleration)', () => {
    const v = 80;
    // Anvil Bend: a long straight leads into it, so nothing else is in the 140 m window when far away
    let a = 0; for (let i = 0; i < T.n; i++) if (T.sectionName(i) === 'Anvil Bend' && Math.abs(line.kappa[i]) > Math.abs(line.kappa[a])) a = i;
    const sA = a * T.ds, cnt = (d, lvl) => ribbon(sA - d, v).lv.filter((x) => x === lvl).length;
    expect(cnt(330, 0)).toBe(ribbon(sA - 330, v).n);   // all green: far away, ample margin
    expect(cnt(150, 1) + cnt(150, 2)).toBeGreaterThan(0); // approaching: caution appears at the far end
    expect(cnt(60, 2)).toBeGreaterThan(cnt(150, 2));      // braking point: red takes over
    expect(cnt(60, 2)).toBeGreaterThan(5);
  });
  it('ribbon geometry hugs the racing line a few cm above the surface, behind and ahead, in the typed buffers', () => {
    const s = 300, r = ribbon(s, 50);
    expect(r.n).toBe(guideSamples(T));
    for (let k = 0; k < r.n; k++) {
      const x = (r.pos[k * 6] + r.pos[k * 6 + 3]) / 2, z = (r.pos[k * 6 + 2] + r.pos[k * 6 + 5]) / 2, y = r.pos[k * 6 + 1];
      const loc = T.locateGlobal(x, z);
      expect(Math.abs(loc.d - line.d[loc.i])).toBeLessThan(0.3);
      expect(y - T.py[loc.i]).toBeGreaterThanOrEqual(0.03);
      expect(y - T.py[loc.i]).toBeLessThanOrEqual(0.1);
    }
    expect(GUIDE_LIFT).toBeGreaterThanOrEqual(0.03); expect(GUIDE_LIFT).toBeLessThanOrEqual(0.1);
    expect(GUIDE_AHEAD).toBeGreaterThanOrEqual(80); expect(GUIDE_AHEAD).toBeLessThanOrEqual(160);
    expect(GUIDE_BACK).toBeLessThanOrEqual(10);
    // fades in at the tail and out at the far end
    expect(r.col[3]).toBeLessThan(0.2); expect(r.col[(r.n - 1) * 8 + 3]).toBeLessThan(0.2);
  });
});

describe('guide availability by difficulty', () => {
  it('Easy and Normal default ON; the saved off setting is honoured', () => {
    expect(lineGuideEnabled('easy', undefined)).toBe(true);
    expect(lineGuideEnabled('normal', undefined)).toBe(true);
    expect(lineGuideEnabled('normal', true)).toBe(true);
    expect(lineGuideEnabled('easy', false)).toBe(false);
  });
  it('Hard never has a guide, even when the saved setting says on', () => {
    expect(lineGuideEnabled('hard', true)).toBe(false);
    expect(lineGuideEnabled('hard', undefined)).toBe(false);
    expect(DIFFICULTY.hard.guide).toBe(false);
    expect(DIFFICULTY.easy.guide && DIFFICULTY.normal.guide).toBe(true);
  });
  it('braking assist: Easy only', () => {
    expect(DIFFICULTY.easy.assist).toBe(1);
    expect(DIFFICULTY.normal.assist).toBe(0);
    expect(DIFFICULTY.hard.assist).toBe(0);
  });
});

describe('tight-corner relief', () => {
  it('Citadel (Squeeze included) is below K_TIGHT, so its line gets no relief', () => {
    const T = new Track();
    let mk = 0; for (const k of computeRacingLine(T).kappa) mk = Math.max(mk, Math.abs(k));
    expect(mk).toBeLessThan(K_TIGHT);
  });
});
