// Chase / overhead camera follow maths (pure, no three.js): critically damped springs, ground clearance relative to the
// road surface under the camera, wall-corridor pull-in along the car->camera ray, and keeping the car in frame.
import { clamp, wrapAngle } from './physics.js';

/** Critically damped spring step (exact solution, stable for any dt). Returns [position, velocity]. */
export function spring(x, v, target, omega, dt) {
  const d = x - target, tmp = (v + omega * d) * dt, e = Math.exp(-omega * dt);
  return [target + (d + tmp) * e, (v - omega * tmp) * e];
}
/** spring on a numeric field `k` of object `o` (velocity stored in o[k+'V']) */
export function springField(o, k, target, omega, dt) {
  const r = spring(o[k], o[k + 'V'] || 0, target, omega, dt); o[k] = r[0]; o[k + 'V'] = r[1]; return o[k];
}
/** yaw spring that always takes the short way round (state yaw stays unwrapped-continuous) */
export function springYaw(o, target, omega, dt) {
  return springField(o, 'yaw', o.yaw + wrapAngle(target - o.yaw), omega, dt);
}

/** road surface height under world point (x,z): height of the nearest track sample, interpolated along the track */
export function surfaceY(track, x, z, hint) {
  const loc = track.locate(x, z, hint, undefined, 60);
  return track.yAt(loc.s);
}
/** allowed |lateral| (from the centreline) at a sample on the side of d, minus a margin; the camera must stay inside this */
export function corridorLimit(track, i, d, margin = 0.8) {
  return (d >= 0 ? track.leftWall[i] : track.rightWall[i]) - margin;
}
/**
 * Shorten the ray car->cam so that it stays inside the wall corridor. Returns t in (0,1] (1 = unobstructed).
 * Samples the ray; walls are checked against the track frame of every sample point.
 */
export function pullInFactor(track, car, cam, hint, margin = 0.8, steps = 12) {
  const dCar = Math.abs(track.locate(car.x, car.z, hint, undefined, 60).d);
  let ok = 0;
  for (let k = 1; k <= steps; k++) {
    const t = k / steps, loc = track.locate(car.x + (cam.x - car.x) * t, car.z + (cam.z - car.z) * t, hint, undefined, 60);
    // outside the corridor (and further out than the car itself, which may be rubbing the wall) -> stop here
    if (Math.abs(loc.d) > corridorLimit(track, loc.i, loc.d, margin) && Math.abs(loc.d) > dCar + 0.05) break;
    ok = t;
  }
  return ok;
}

/**
 * One chase-camera step.
 * st: persistent state {yaw, ox, oy, oz (+ ...V velocities), ly, pull, init}; car: {x,y,z,theta,v,s,idx};
 * o: {fovDeg, aspect}. Returns {pos:[x,y,z], look:[x,y,z]}.
 */
export function chaseStep(st, car, track, dt, o = {}) {
  const fov = o.fovDeg ?? 62, aspect = o.aspect ?? 16 / 9;
  const sp = clamp(car.v / 80, 0, 1);
  const back = 8 + sp * 2.4, h = 3 + sp * 0.5, la = 12 + sp * 8;
  if (!st.init) {
    st.init = true; st.yaw = car.theta; st.ox = -Math.sin(car.theta) * back; st.oz = -Math.cos(car.theta) * back; st.oy = h; st.ly = car.y; st.pull = 1;
    st.oxV = st.ozV = st.oyV = st.yawV = st.lyV = 0;
  }
  // heading target: the car's heading, but never more than ~35deg off the road direction (spins / big slides don't swing the camera sideways)
  const road = track.thetaAt(car.s + 5), dev = wrapAngle(car.theta - road);
  const yawT = road + clamp(dev, -0.6, 0.6);
  springYaw(st, yawT, 4.5, dt);
  const fx = Math.sin(st.yaw), fz = Math.cos(st.yaw);
  // spring the camera OFFSET from the car (a spring on the absolute position would lag 2v/omega behind at speed)
  springField(st, 'ox', -fx * back, 6.5, dt);
  springField(st, 'oz', -fz * back, 6.5, dt);
  const cx = car.x + st.ox, cz = car.z + st.oz;
  // height relative to the road under the CAMERA, never below surface + 1.5
  const gC = surfaceY(track, cx, cz, car.idx);
  const slope = track.slopeAt(car.s), drop = clamp(-slope, 0, 0.5);
  const wantY = Math.max(car.y + h + drop * 6, gC + 1.5 + 1.5);
  springField(st, 'oy', wantY - car.y, 5 + 30 * Math.abs(slope), dt);
  let px = cx, pz = cz;
  // pull in along the ray when it leaves the wall corridor (instant in, eased out)
  const t = pullInFactor(track, car, { x: cx, z: cz }, car.idx);
  st.pull = t < st.pull ? t : st.pull + (t - st.pull) * (1 - Math.exp(-dt * 3));
  const minT = 3.2 / Math.max(back, 1);
  const tt = Math.max(st.pull, minT);
  px = car.x + st.ox * tt; pz = car.z + st.oz * tt;
  let py = car.y + st.oy + (1 - tt) * back * 0.45; // raise as we pull in so the car stays in view over the nose
  const gP = surfaceY(track, px, pz, car.idx);
  py = Math.max(py, gP + 1.5);
  // look target: blend between the car and the road ahead so the car stays in frame
  springField(st, 'ly', track.yAt(car.s + la) + 1, 5 + 30 * Math.abs(slope), dt);
  const ahead = [car.x + fx * la, st.ly, car.z + fz * la], carPt = [car.x, car.y + 0.9, car.z];
  const vHalf = fov * Math.PI / 360, hHalf = Math.atan(Math.tan(vHalf) * aspect), lim = Math.min(vHalf, hHalf) * 0.55;
  let look = ahead;
  for (const w of [1, 0.8, 0.6, 0.4, 0.2, 0]) {
    look = [carPt[0] + (ahead[0] - carPt[0]) * w, carPt[1] + (ahead[1] - carPt[1]) * w, carPt[2] + (ahead[2] - carPt[2]) * w];
    if (frameAngle([px, py, pz], look, carPt) <= lim) break;
  }
  return { pos: [px, py, pz], look, yaw: st.yaw };
}
/** angle between the view direction (cam->look) and the direction to the car */
export function frameAngle(cam, look, carPt) {
  const a = [look[0] - cam[0], look[1] - cam[1], look[2] - cam[2]], b = [carPt[0] - cam[0], carPt[1] - cam[1], carPt[2] - cam[2]];
  const d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2], l = Math.hypot(...a) * Math.hypot(...b) || 1;
  return Math.acos(clamp(d / l, -1, 1));
}

/** Overhead rig follow: critically damped car position, height and heading (state o: {x,y,z,yaw}). */
export function overheadFollow(o, car, dt, { posOmega = 7, yOmega = 3, yawOmega = 1.5 } = {}) {
  springYaw(o, car.theta, yawOmega, dt);
  springField(o, 'x', car.x, posOmega, dt); springField(o, 'z', car.z, posOmega, dt); springField(o, 'y', car.y, yOmega, dt);
  return o;
}
