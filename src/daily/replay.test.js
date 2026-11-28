import { describe, it, expect } from 'vitest';
import { parseAdminHash } from './adminHash.js';
import { MAX_REPLAY_CARS, buildRuns, createClock, runPose } from './replayModel.js';
import { encodePath } from './runPath.js';

describe('admin replay address', () => {
  const today = '2026-11-27';
  it('means today, or the day it names', () => {
    expect(parseAdminHash('#admin-replay', today)).toEqual({ dayId: today });
    expect(parseAdminHash('#admin-replay=2026-11-20', today)).toEqual({ dayId: '2026-11-20' });
  });
  it('ignores everything else', () => {
    for (const h of ['', '#', '#admin', '#admin-replay=', '#admin-replay=yesterday', '#admin-replay=2026-02-30', '#admin-replay=2026-13-01', '#admin-replay=2026-11-20&x=1', '#Admin-Replay']) expect(parseAdminHash(h, today)).toBeNull();
  });
});

describe('replay model', () => {
  const path = encodePath({ hz: 10, time: 20, samples: Array.from({ length: 200 }, (_, i) => [i, 0, 0]) });
  const row = (name, time_ms, p = path) => ({ name, time_ms, path: p });

  it('orders runs, skips unreadable paths and caps the field', () => {
    const r = buildRuns([row('B', 21000), row('A', 20000), row('bad', 19000, 'junk')]);
    expect(r.runs.map((x) => [x.rank, x.name])).toEqual([[1, 'A'], [2, 'B']]);
    expect(r).toMatchObject({ skipped: 1, duration: 21 });
    expect(buildRuns(Array.from({ length: 250 }, (_, i) => row(`n${i}`, 20000 + i))).runs).toHaveLength(MAX_REPLAY_CARS);
  });

  it('holds a car to its finish time, then removes it', () => {
    const [run] = buildRuns([row('A', 20000)]).runs;
    expect(runPose(run, 0).x).toBe(0);
    expect(runPose(run, 19.99).x).toBeCloseTo(199, 3);
    expect(runPose(run, 20)).toBeNull();
  });

  it('runs one clock with speed, scrub, end and restart', () => {
    const c = createClock(10);
    c.speed = 4; c.advance(1);
    expect(c.t).toBe(4);
    c.advance(5);
    expect(c).toMatchObject({ t: 10, playing: false });
    c.toggle();
    expect(c).toMatchObject({ t: 0, playing: true });
    c.seek(99); expect(c.t).toBe(10);
    c.restart(); expect(c.t).toBe(0);
  });
});
