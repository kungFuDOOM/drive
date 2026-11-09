import { describe, it, expect } from 'vitest';
import { joystickSteer, clampKnob, JOY } from './joystick.js';
import { lerpCar, snapshot, planSteps } from './interp.js';
describe('joystick', () => {
  it('zero dead zone, clamp, symmetry, monotonic', () => {
    expect(joystickSteer(0)).toBe(0);
    expect(joystickSteer(JOY.radius * 0.005)).toBeGreaterThan(0);
    expect(joystickSteer(JOY.radius * 0.09)).toBeGreaterThan(0);
    expect(joystickSteer(JOY.radius * 0.09)).toBeLessThan(0.13);
    expect(joystickSteer(JOY.radius * 5)).toBe(1);
    expect(joystickSteer(-JOY.radius * 5)).toBe(-1);
    expect(joystickSteer(20)).toBeCloseTo(-joystickSteer(-20));
    expect(joystickSteer(30)).toBeGreaterThan(joystickSteer(20));
    expect(joystickSteer(JOY.radius)).toBeCloseTo(1);
  });
  it('knob clamps to radius', () => {
    const [x, y] = clampKnob(300, 400, 50); expect(Math.hypot(x, y)).toBeCloseTo(50);
    expect(clampKnob(10, 5, 50)).toEqual([10, 5]);
  });
});
describe('interp', () => {
  it('lerps with angle wrap and plans steps', () => {
    const c = { x: 0, y: 0, z: 0, theta: 3.1, steer: 0, pose: { pitch: 0, roll: 0 } };
    snapshot(c); c.x = 10; c.theta = -3.1;
    const o = lerpCar(c, 0.5);
    expect(o.x).toBeCloseTo(5); expect(Math.cos(o.theta)).toBeLessThan(-0.99);
    expect(planSteps(0, 1 / 60 * 3.5).n).toBe(3);
    expect(planSteps(0, 1).n).toBe(5); expect(planSteps(0, 1).acc).toBeLessThan(1 / 60);
  });
});
