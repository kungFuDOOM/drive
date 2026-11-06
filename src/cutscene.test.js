import { describe, expect, it } from 'vitest';
import { Cutscene, cutsceneFrame, cutsceneSubtitle } from './cutscene.js';
import { cutsceneDuration } from './broadcast.js';

describe('skippable pre-race cinematic', () => {
  it('runs an 8.6 second race intro, skips exactly once, and preserves timing thereafter', () => {
    const c = new Cutscene('race', { cutscenes: true });
    expect(c.duration).toBeCloseTo(8.6); expect(c.active).toBe(true);
    expect(c.skip()).toBe(true); expect(c.active).toBe(false); expect(c.skipped).toBe(true);
    expect(c.skip()).toBe(false); expect(c.advance(100)).toBe(true); expect(c.elapsed).toBeCloseTo(8.6);
  });

  it('uses a short time-trial reveal, allows immediate starts, and honors the preference', () => {
    const tt = new Cutscene('tt');
    expect(tt.duration).toBeLessThan(3.5); tt.advance(3.5); expect(tt.active).toBe(false);
    expect(new Cutscene('race', { cutscenes: false }).active).toBe(false);
    expect(cutsceneDuration('race', { cutscenes: false })).toBe(0);
  });

  it('advances in wall time on slow renderers while preserving the handoff duration', () => {
    const c = new Cutscene('race', { cutscenes: true });
    c.advance(1.4); c.advance(1.4); c.advance(1.4);
    expect(c.elapsed).toBeCloseTo(4.2); expect(c.active).toBe(true);
    for (let i = 0; i < 3; i++) c.advance(1.5);
    expect(c.active).toBe(false); expect(c.elapsed).toBeCloseTo(8.6);
  });
});

describe('cinematic direction', () => {
  const track = { length: 1000, at: (s, d = 0) => ({ x: s, z: d * 10, y: 4 }) };
  const player = { s: 940, d: 3 };
  it('has real flyover, grid pan, then player reveal shots', () => {
    const a = cutsceneFrame(track, player, 1, 'race');
    const b = cutsceneFrame(track, player, 4, 'race');
    const c = cutsceneFrame(track, player, 8.6, 'race');
    expect(a.phase).toBe('flyover'); expect(a.position[1]).toBeGreaterThan(b.position[1]); expect(a.position[1]).toBeGreaterThan(40);
    expect(b.phase).toBe('grid'); expect(['grid', 'reveal']).toContain(b.phase);
    expect(c.phase).toBe('reveal'); expect(c.reveal).toBe(true); expect(c.target[2]).toBe(30);
    expect(a.position.every(Number.isFinite)).toBe(true); expect(c.target.every(Number.isFinite)).toBe(true);
    expect(cutsceneSubtitle({ name: 'desertNight', night: true }, { opts: {}, rain: 0 }, { index: 1, count: 6 })).toContain('ROUND 2 / 6');
  });

  it('time trial ends on the same player livery without showing the full grid', () => {
    const shot = cutsceneFrame(track, player, 2.7, 'tt');
    expect(shot.phase).toBe('reveal'); expect(shot.duration).toBeLessThan(3);
    expect(shot.target[2]).toBe(30);
  });
});
