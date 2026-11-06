// Small, deterministic helpers for steering response, controllable rotation and driver feedback.
// These have no DOM/Three dependencies: the 60 Hz simulation and browser audio/motion layers share the same laws.
import { clamp, smoothstep } from './physics.js';

/** A thumb's smallest touch is a valid correction; the physical stick is the only input that needs a jitter filter. */
export function analogCurve(value) {
  const v = clamp(value, -1, 1);
  return Math.sign(v) * Math.abs(v) ** 1.3;
}
export function remapStick(value, dead = 0.075) {
  const a = Math.abs(value);
  if (a <= dead) return 0;
  return Math.sign(value) * analogCurve((a - dead) / (1 - dead));
}
/** Low-passed keyed steering with a faster, still smooth return to centre and opposite lock. */
export function steeringFilter(current, target, speed01, dt) {
  const reversing = target * current < 0, returning = Math.abs(target) < Math.abs(current);
  const rate = returning || reversing ? 8.5 : 6.5 - 3 * clamp(speed01, 0, 1);
  return current + clamp(target - current, -rate * dt, rate * dt);
}

/**
 * Front grip remains the proven, speed-sensitive steering model (already smoothed by steeringFilter). Rear slip
 * develops over 90 ms and unwinds to exactly zero; front response keeps its direct, speed-sensitive rate.
 * Front yaw stays grip-limited; throttle near the grip limit adds a small rear-path slip angle, not a teleport.
 */
export function rotationTarget(curvature, vy, throttle, gripUse, human = true) {
  const yawRate = -curvature * vy;
  const demand = smoothstep(0.8, 1.03, gripUse) * smoothstep(22, 58, Math.abs(vy));
  const slipAngle = human ? -yawRate * 0.023 * demand * clamp(throttle, 0, 1) : 0;
  return { yawRate, slipAngle: clamp(slipAngle, -0.022, 0.022) };
}
/** Store the path slip, not an ever-growing yaw offset: lifting/countersteering unwinds it in ~90 ms. */
export function rotationStep(state, target, dt, grip = 1, human = true) {
  const desired = human ? target.slipAngle * clamp(grip, 0.35, 1) : 0;
  state.slipAngle += (desired - state.slipAngle) * (1 - Math.exp(-dt / 0.09));
  state.slideRate = (state.slipAngle - (state.prevSlipAngle || 0)) / dt;
  state.prevSlipAngle = state.slipAngle;
  return target.yawRate;
}
/** Audio scrub starts just BEFORE the tyres run out of grip, then follows real slide/lock rather than the stick. */
export function tyreScrub(load, slipAngle = 0, lock = 0) {
  const near = smoothstep(0.68, 1.03, load) * 0.58;
  const slide = smoothstep(0.009, 0.075, Math.abs(slipAngle)) * 0.82;
  return clamp(Math.max(near, slide, clamp(lock, 0, 1)), 0, 1);
}
export function hapticPulse(kerb = false, lock = 0, speed = 0) {
  if (speed < 12) return 0;
  if (lock > 0.62) return 9;
  return kerb && speed > 18 ? 7 : 0;
}
