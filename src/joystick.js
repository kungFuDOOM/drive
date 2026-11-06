// Floating joystick maths: horizontal drag -> analog steer in [-1,1].
export const JOY = { radius: 56, dead: 0, curve: 1.3 };
/** @param dx horizontal offset of the thumb from the base centre (CSS px) */
export function joystickSteer(dx, radius = JOY.radius, dead = JOY.dead, curve = JOY.curve) {
  const n = Math.max(-1, Math.min(1, dx / radius)), a = Math.abs(n);
  if (a <= dead) return 0;
  return Math.sign(n) * Math.pow((a - dead) / (1 - dead), curve);
}
/** knob offset clamped to the circle of `radius` around the base */
export function clampKnob(dx, dy, radius = JOY.radius) {
  const d = Math.hypot(dx, dy);
  return d <= radius ? [dx, dy] : [dx / d * radius, dy / d * radius];
}
