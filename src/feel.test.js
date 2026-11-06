import { describe, expect, it } from 'vitest';
import { analogCurve, remapStick, steeringFilter, rotationTarget, rotationStep, tyreScrub, hapticPulse } from './feel.js';
import { CLASSES, steerState } from './physics.js';

describe('input feel', () => {
  it('responds to a small thumb correction and has no discontinuity', () => {
    expect(analogCurve(0)).toBe(0); expect(analogCurve(0.005)).toBeGreaterThan(0);
    expect(analogCurve(0.25)).toBeLessThan(0.25);
    expect(analogCurve(-0.8)).toBe(-analogCurve(0.8));
    expect(analogCurve(1)).toBe(1);
    expect(remapStick(0.07)).toBe(0); expect(remapStick(0.075)).toBe(0);
    expect(remapStick(0.075 + 1e-6)).toBeGreaterThanOrEqual(0);
  });
  it('digital steering builds and releases progressively, faster with more speed-sensitive lock', () => {
    const s = steeringFilter(0, 1, 0.9, 1 / 60);
    expect(s).toBeGreaterThan(0); expect(s).toBeLessThan(0.075);
    expect(steeringFilter(s, 0, 0.9, 1 / 60)).toBeLessThan(s);
    expect(steeringFilter(0, 1, 0, 1 / 60)).toBeGreaterThan(s);
  });
});

describe('rotation and recovery', () => {
  it('preserves front yaw while adding progressive throttle/near-limit slip', () => {
    const k = steerState(CLASSES.gp, 0.65, 50, 1).k;
    const target = rotationTarget(-k, 50, 1, 1), s = { slipAngle: 0 };
    const yaw = rotationStep(s, target, 1 / 60);
    expect(yaw).toBe(target.yawRate);
    expect(s.slipAngle * yaw).toBeLessThan(0);
    expect(s.slipAngle).toBeLessThan(0.022);
    expect(rotationTarget(-k, 50, 0, 1).slipAngle).toBeCloseTo(0);
    expect(Math.abs(rotationTarget(-k, 50, 1, 0.5).slipAngle)).toBeLessThan(1e-6);
  });
  it('settles after lift and repeated direction changes without oscillating', () => {
    const s = { slipAngle: 0 }, k = steerState(CLASSES.gp, 0.65, 50, 1).k; let peak = 0;
    for (let i = 0; i < 120; i++) {
      rotationStep(s, rotationTarget(-k, 50, i < 60 ? 1 : 0, 1), 1 / 60);
      if (i === 59) peak = s.slipAngle;
      if (i > 60) expect(Math.abs(s.slipAngle)).toBeLessThan(Math.abs(peak * Math.exp(-(i - 60) / 60 / 0.09)));
    }
    expect(s.slipAngle).toBeCloseTo(0, 6);
    for (let i = 0; i < 240; i++) {
      rotationStep(s, rotationTarget(i % 30 < 15 ? -k : k, 45, 1, 1), 1 / 60);
      expect(Number.isFinite(s.slipAngle)).toBe(true);
      const steering = i % 30 < 15 ? 0.65 : -0.65;
      const curvature = steerState(CLASSES.gp, steering, 45, 1).k;
      const allowed = Math.abs(curvature) * 45 * 0.023 * 1.02;
      expect(Math.abs(s.slipAngle)).toBeLessThanOrEqual(allowed);
    }
    for (let i = 0; i < 60; i++) rotationStep(s, { yawRate: 0, slipAngle: 0 }, 1 / 60);
    expect(s.slipAngle).toBeCloseTo(0, 6);
  });
});

describe('audio and haptic feel', () => {
  it('scrub rises before grip saturation, fades below it, then follows slip', () => {
    const early = tyreScrub(0.82), quiet = tyreScrub(0.5), sliding = tyreScrub(0.82, 0.07);
    expect(early).toBeGreaterThan(quiet + 0.2);
    expect(sliding).toBeGreaterThan(early);
    expect(tyreScrub(1, 0.03, 1)).toBe(1);
  });
  it('haptics are optional, short and only meaningful at real speed', () => {
    expect(hapticPulse(true, 0, 5)).toBe(0);
    expect(hapticPulse(true, 0, 30)).toBeLessThanOrEqual(7);
    expect(hapticPulse(false, 0.9, 45)).toBeLessThanOrEqual(9);
  });
});
