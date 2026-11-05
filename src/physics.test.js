import { describe, it, expect } from 'vitest';
import {
  wrapDelta,
  createLapState,
  advanceLap,
  lapsDone,
  compoundGrip,
  gripFactor,
  tireWearRate,
  cornerSpeed,
  slipstreamRate,
  updateBoost,
  CLASSES,
} from './physics.js';

const L = 1000;

describe('wrapDelta', () => {
  it('returns small deltas unchanged', () => {
    expect(wrapDelta(10, L)).toBeCloseTo(10);
    expect(wrapDelta(-10, L)).toBeCloseTo(-10);
  });

  it('wraps across the line into the shortest direction', () => {
    expect(wrapDelta(0.75 * L, L)).toBeCloseTo(-0.25 * L);
    expect(wrapDelta(-0.75 * L, L)).toBeCloseTo(0.25 * L);
    expect(wrapDelta(2.25 * L, L)).toBeCloseTo(0.25 * L);
  });

  it('maps multiples of L to zero and keeps range [-L/2, L/2)', () => {
    expect(wrapDelta(L, L)).toBeCloseTo(0);
    expect(wrapDelta(-L, L)).toBeCloseTo(0);
    expect(wrapDelta(0.5 * L, L)).toBeCloseTo(-0.5 * L);
    expect(wrapDelta(-0.5 * L, L)).toBeCloseTo(-0.5 * L);
  });
});

describe('lap counting', () => {
  it('grid start behind the line has negative progress and no lap', () => {
    const st = createLapState(L, L - 10);
    expect(st.progress).toBeCloseTo(-10);
    expect(lapsDone(st)).toBe(0);
    // Moving forward but still short of the line does not complete a lap.
    expect(advanceLap(st, 5)).toBe(false);
    expect(lapsDone(st)).toBe(0);
  });

  it('crossing the line forward completes lap 1 exactly once', () => {
    const st = createLapState(L, 0);
    let completions = 0;
    // Drive forward in 100-unit steps; the 10th step reaches progress L.
    for (let i = 1; i <= 12; i++) {
      const s = (i * 100) % L;
      if (advanceLap(st, s)) completions++;
    }
    expect(completions).toBe(1);
    expect(lapsDone(st)).toBe(1);
  });

  it('counts 3 laps over a loop driven in small steps', () => {
    const st = createLapState(L, 0);
    let completions = 0;
    let s = 0;
    // 3 full laps in 10-unit steps = 300 steps.
    for (let i = 0; i < 300; i++) {
      s = (s + 10) % L;
      if (advanceLap(st, s)) completions++;
    }
    expect(completions).toBe(3);
    expect(lapsDone(st)).toBe(3);
  });

  it('reversing back across the line and forward again does not double-count', () => {
    const st = createLapState(L, 500);
    advanceLap(st, 990);
    expect(advanceLap(st, 10)).toBe(true); // forward across line: lap 1
    expect(lapsDone(st)).toBe(1);

    expect(advanceLap(st, 990)).toBe(false); // reverse back across the line
    expect(lapsDone(st)).toBe(1);

    expect(advanceLap(st, 10)).toBe(false); // forward again: no new lap
    expect(lapsDone(st)).toBe(1);
  });
});

describe('grip and tires', () => {
  it('dry tire in heavy wetness has less grip than a wet tire', () => {
    expect(compoundGrip('dry', 1)).toBeLessThan(compoundGrip('wet', 1));
    expect(gripFactor({ tire: 'dry', wetness: 1 })).toBeLessThan(
      gripFactor({ tire: 'wet', wetness: 1 }),
    );
  });

  it('wet tire has less grip than dry tire on a dry track', () => {
    expect(gripFactor({ tire: 'wet', wetness: 0 })).toBeLessThan(
      gripFactor({ tire: 'dry', wetness: 0 }),
    );
  });

  it('grip decreases monotonically with wear', () => {
    const wears = [0, 0.25, 0.5, 0.75, 1];
    const grips = wears.map((wear) => gripFactor({ tire: 'dry', wear }));
    for (let i = 1; i < grips.length; i++) {
      expect(grips[i]).toBeLessThan(grips[i - 1]);
    }
  });

  it('grass and gravel give less grip than asphalt', () => {
    const asphalt = gripFactor({ tire: 'dry', surface: 'asphalt' });
    expect(gripFactor({ tire: 'dry', surface: 'grass' })).toBeLessThan(asphalt);
    expect(gripFactor({ tire: 'dry', surface: 'gravel' })).toBeLessThan(asphalt);
  });
});

describe('tireWearRate', () => {
  it('wet tires wear faster than dry tires on a dry track', () => {
    expect(tireWearRate('wet', 20, 0)).toBeGreaterThan(tireWearRate('dry', 20, 0));
  });

  it('more lateral acceleration means more wear', () => {
    expect(tireWearRate('dry', 40, 0)).toBeGreaterThan(tireWearRate('dry', 10, 0));
    expect(tireWearRate('dry', -40, 0)).toBeGreaterThan(tireWearRate('dry', 10, 0));
  });
});

describe('cornerSpeed', () => {
  const cls = CLASSES.gp;

  it('tighter corner gives lower speed', () => {
    const gentle = cornerSpeed(cls, 0.01, 1);
    const tight = cornerSpeed(cls, 0.05, 1);
    expect(tight).toBeLessThan(gentle);
  });

  it('low grip gives lower speed', () => {
    const fullGrip = cornerSpeed(cls, 0.01, 1);
    const lowGrip = cornerSpeed(cls, 0.01, 0.5);
    expect(lowGrip).toBeLessThan(fullGrip);
  });
});

describe('slipstreamRate', () => {
  it('is zero when far away', () => {
    expect(slipstreamRate(40, 0)).toBe(0);
  });

  it('is zero when laterally offset beyond the slipstream', () => {
    expect(slipstreamRate(5, 3)).toBe(0);
  });

  it('is larger when closer', () => {
    expect(slipstreamRate(5, 0)).toBeGreaterThan(slipstreamRate(20, 0));
    expect(slipstreamRate(5, 0)).toBeGreaterThan(0);
  });
});

describe('updateBoost', () => {
  it('fills at the fill rate', () => {
    expect(updateBoost(0, { fill: 0.2, dt: 1 })).toBeCloseTo(0.2);
    expect(updateBoost(0.1, { fill: 0.5, dt: 0.5 })).toBeCloseTo(0.35);
  });

  it('clamps at 1 when filling', () => {
    expect(updateBoost(0.9, { fill: 0.5, dt: 1 })).toBe(1);
    expect(updateBoost(1, { fill: 0.5, dt: 1 })).toBe(1);
  });

  it('drains while boosting', () => {
    expect(updateBoost(0.5, { boosting: true, dt: 1 })).toBeCloseTo(0.22);
  });

  it('never drops below 0', () => {
    expect(updateBoost(0.1, { boosting: true, dt: 1 })).toBe(0);
    expect(updateBoost(0, { boosting: true, dt: 1 })).toBe(0);
  });
});
