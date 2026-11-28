import { describe, it, expect } from 'vitest';
import { MAX_PATH_CHARS, PATH_VERSION, decodePath, encodePath } from './runPath.js';
import { createGhostRecorder, recordGhost, finishGhost, sampleGhost } from '../timing.js';

/** Laps of a 300 m radius circle, recorded like a real lap (heading wrapped to ±PI). */
function lap(seconds, speed = 70) {
  const rec = createGhostRecorder(10);
  for (let t = 0; t <= seconds; t += 1 / 60) {
    const a = (speed * t) / 300;
    recordGhost(rec, t, 300 * Math.cos(a), -300 * Math.sin(a), Math.atan2(Math.sin(a + Math.PI), Math.cos(a + Math.PI)));
  }
  return finishGhost(rec, seconds);
}
const angleError = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));

describe('daily run path', () => {
  it('round trips a lap within the quantization, as short ASCII', () => {
    const g = lap(90), s = encodePath(g);
    expect(s.startsWith(PATH_VERSION)).toBe(true);
    expect(/^[\x21-\x7e]+$/.test(s)).toBe(true);
    expect(s.length).toBeLessThan(6000);
    const d = decodePath(s);
    expect(d).toMatchObject({ hz: 10, time: 90 });
    expect(d.samples).toHaveLength(g.samples.length);
    d.samples.forEach(([x, z, th], i) => {
      expect(Math.abs(x - g.samples[i][0])).toBeLessThanOrEqual(0.051);
      expect(Math.abs(z - g.samples[i][1])).toBeLessThanOrEqual(0.051);
      expect(angleError(th, g.samples[i][2])).toBeLessThanOrEqual(0.011);
    });
    const a = sampleGhost(g, 45.05), b = sampleGhost(d, 45.05);
    expect(Math.hypot(a.x - b.x, a.z - b.z)).toBeLessThan(0.15);
    expect(angleError(a.theta, b.theta)).toBeLessThan(0.02);
  });

  it('fits a 15 minute lap, even a jittery one, by downsampling when needed', () => {
    expect(encodePath(lap(900)).length).toBeLessThanOrEqual(MAX_PATH_CHARS);
    const wild = { hz: 10, time: 900, samples: Array.from({ length: 9001 }, (_, i) => [(i % 2) * 900, (i % 3) * 900, (i % 5) - 2]) };
    const s = encodePath(wild), d = decodePath(s);
    expect(s.length).toBeLessThanOrEqual(MAX_PATH_CHARS);
    expect(d.hz).toBeLessThan(10);
    expect((d.samples.length - 1) / d.hz).toBeGreaterThan(899);
  });

  it('rejects empty laps and anything that is not a path', () => {
    expect(encodePath(null)).toBeNull();
    expect(encodePath({ hz: 10, time: 90, samples: [] })).toBeNull();
    const good = encodePath(lap(20));
    for (const bad of [null, 7, '', 'p2:AAAA', 'p1:!!!', 'p1:AAAA', good.slice(0, -12), `${good}AAAA`, `p1:${'A'.repeat(MAX_PATH_CHARS)}`]) expect(decodePath(bad)).toBeNull();
  });
});
