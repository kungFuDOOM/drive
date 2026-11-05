import { describe, it, expect } from 'vitest';
import {
  advanceLap, lapDisplay, hasFinished, tireGrip, wearRate, slipstream,
  rainLevel, rankCars, pitLaneWidth, inPitRange, inPitBox, formatTime,
} from './logic.js';
import { buildTrack, HALF } from './track.js';

const N = 480;

describe('lap counting', () => {
  it('increments when crossing the line forward', () => {
    let s = { lap: -1, idx: N - 5 };
    s = advanceLap(s, N - 1, N);
    expect(s.lap).toBe(-1);
    s = advanceLap(s, 2, N);
    expect(s.lap).toBe(0);
    expect(lapDisplay(s.lap, 3)).toBe(1);
  });
  it('does not count normal forward motion and handles reversing over the line', () => {
    let s = { lap: 0, idx: 100 };
    s = advanceLap(s, 130, N);
    expect(s.lap).toBe(0);
    s = { lap: 0, idx: 2 };
    s = advanceLap(s, N - 2, N);
    expect(s.lap).toBe(-1);
  });
  it('detects finish after 3 full laps and progress is monotonic', () => {
    let s = { lap: -1, idx: N - 8 };
    let last = -Infinity;
    for (let step = 0; step < 4 * N / 4 + 20; step++) {
      const idx = (N - 8 + step * 4) % N;
      s = advanceLap(s, idx, N);
      expect(s.progress).toBeGreaterThan(last);
      last = s.progress;
    }
    expect(hasFinished(s.lap, 3)).toBe(true);
    expect(hasFinished(2, 3)).toBe(false);
    expect(lapDisplay(5, 3)).toBe(3);
  });
});

describe('grip', () => {
  it('is 1 for fresh dry tires on a dry track', () => {
    expect(tireGrip('dry', 0, 0)).toBeCloseTo(1);
  });
  it('rain lowers grip on dry tires, wet tires are better in rain', () => {
    expect(tireGrip('dry', 0, 1)).toBeLessThan(tireGrip('dry', 0, 0.3));
    expect(tireGrip('wet', 0, 1)).toBeGreaterThan(tireGrip('dry', 0, 1));
    expect(tireGrip('wet', 0, 0)).toBeLessThan(tireGrip('dry', 0, 0));
  });
  it('wear lowers grip monotonically and clamps', () => {
    expect(tireGrip('dry', 0.8, 0)).toBeLessThan(tireGrip('dry', 0.2, 0));
    expect(tireGrip('dry', 5, 0)).toBeCloseTo(tireGrip('dry', 1, 0));
    expect(tireGrip('dry', 1, 0)).toBeGreaterThan(0.5);
  });
  it('wet tires wear faster on a dry track', () => {
    expect(wearRate('wet', 0, 0.5)).toBeGreaterThan(wearRate('dry', 0, 0.5));
  });
});

describe('slipstream / weather / ranking', () => {
  it('only boosts when close behind and aligned', () => {
    expect(slipstream(10, 0)).toBeGreaterThan(0);
    expect(slipstream(10, 0)).toBeGreaterThan(slipstream(20, 0));
    expect(slipstream(40, 0)).toBe(0);
    expect(slipstream(10, 5)).toBe(0);
    expect(slipstream(-5, 0)).toBe(0);
  });
  it('rain ramps in after its start time', () => {
    expect(rainLevel(5, 20)).toBe(0);
    expect(rainLevel(25, 20)).toBeCloseTo(0.5);
    expect(rainLevel(99, 20)).toBe(1);
  });
  it('ranks finished cars first, then by progress', () => {
    const r = rankCars([
      { id: 'a', progress: 900, finishTime: null },
      { id: 'b', progress: 1500, finishTime: 90 },
      { id: 'c', progress: 1500, finishTime: 88 },
      { id: 'd', progress: 1000, finishTime: null },
    ]).map((c) => c.id);
    expect(r).toEqual(['c', 'b', 'd', 'a']);
  });
  it('formats times', () => {
    expect(formatTime(75.5)).toBe('1:15.50');
  });
});

describe('pit lane + track', () => {
  it('pit lane flares in around the start line', () => {
    expect(pitLaneWidth(0, N)).toBe(9);
    expect(pitLaneWidth(N - 25, N)).toBe(0);
    expect(pitLaneWidth(200, N)).toBe(0);
    expect(inPitRange(N - 10, N)).toBe(true);
    expect(inPitRange(100, N)).toBe(false);
    expect(inPitBox(3, N)).toBe(true);
    expect(inPitBox(N - 3, N)).toBe(true);
    expect(inPitBox(20, N)).toBe(false);
  });
  it('track loop has no self-overlap and a straight pit stretch', () => {
    const t = buildTrack(N);
    for (let i = 0; i < N; i += 3) {
      for (let j = i + 1; j < N; j++) {
        const sep = Math.min(j - i, N - (j - i));
        if (sep < 40) continue;
        const d = Math.hypot(t.pts[i].x - t.pts[j].x, t.pts[i].z - t.pts[j].z);
        expect(d).toBeGreaterThan(HALF * 2 + 14);
      }
    }
    for (let k = -30; k <= 30; k++) expect(Math.abs(t.pts[(k + N) % N].kap)).toBeLessThan(0.006);
  });
});
