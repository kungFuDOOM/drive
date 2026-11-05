// Render interpolation between fixed physics steps.
import { wrapAngle } from './physics.js';
export const STEP = 1 / 60, MAX_STEPS = 5;
/** record the state a car had before the next step */
export function snapshot(c) {
  const s = c._prev || (c._prev = {});
  s.x = c.x; s.y = c.y; s.z = c.z; s.theta = c.theta; s.pitch = c.pose ? c.pose.pitch : 0; s.roll = c.pose ? c.pose.roll : 0; s.steer = c.steer || 0;
  return s;
}
const mix = (a, b, t) => a + (b - a) * t;
/** interpolated render state of a car (writes into `out`) */
export function lerpCar(c, alpha, out = {}) {
  const p = c._prev;
  if (!p) { out.x = c.x; out.y = c.y; out.z = c.z; out.theta = c.theta; out.pitch = c.pose ? c.pose.pitch : 0; out.roll = c.pose ? c.pose.roll : 0; out.steer = c.steer || 0; return out; }
  out.x = mix(p.x, c.x, alpha); out.y = mix(p.y, c.y, alpha); out.z = mix(p.z, c.z, alpha);
  out.theta = p.theta + wrapAngle(c.theta - p.theta) * alpha;
  const cp = c.pose ? c.pose.pitch : 0, cr = c.pose ? c.pose.roll : 0;
  out.pitch = mix(p.pitch, cp, alpha); out.roll = mix(p.roll, cr, alpha); out.steer = mix(p.steer, c.steer || 0, alpha);
  return out;
}
/** Advance an accumulator: returns number of fixed steps to run (<= MAX_STEPS) and the leftover accumulator. */
export function planSteps(acc, dt, step = STEP, max = MAX_STEPS) {
  acc += dt;
  let n = 0;
  while (acc >= step && n < max) { acc -= step; n++; }
  if (acc >= step) acc = acc % step; // spiral guard: drop the backlog
  return { n, acc };
}
