// Chase / overhead camera follow maths (pure, no three.js): critically damped springs, height following the road under the
// camera, yaw swing + pull-in along the car->camera ray at the wall corridor, and keeping the car in frame.
import { clamp, smoothstep, wrapAngle } from './physics.js';

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

// chase rig tuning: rise of the camera per metre of distance (the camera stays on a low line through the car's roof, so a shorter
// distance means a LOWER camera, not a steeper one), allowed height band over the road under the car, closest approach, pitch cap
const RISE = 0.26, ROOF = 0.9, H_MIN = 1.95, H_MAX = 4.3, MIN_DIST = 3.2, MAX_PITCH = 18 * Math.PI / 180, HARD_PITCH = 21 * Math.PI / 180;
const SWINGS = [0, 0.25, 0.5, 0.75, 1];
const _v = { set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; } };
const _l = { i: 0, s: 0, d: 0 };

/** narrowest wall distance over the road from `from` to `to` metres around s: tells the rig a tight corridor is coming before it gets there */
function corridorWidth(track, s, from, to) {
  let w = 1e9;
  for (let u = from; u <= to; u += 5) {
    const i = track._idx(s + u)[0];
    w = Math.min(w, track.leftWall[i], track.rightWall[i]);
  }
  return w;
}

/**
 * One chase-camera step: a low view from behind the car. When the car->camera ray would leave the wall corridor the rig first
 * swings the yaw toward the road behind the car, then shortens the distance; it never climbs to see over the walls.
 * st: persistent state {yaw, ox, oz, oy (+ ...V velocities), ly, pull, swing, init}; car: {x,y,z,theta,v,s,idx,d};
 * o: {fovDeg, aspect}. Returns {pos:[x,y,z], look:[x,y,z], yaw}.
 */
export function chaseStep(st, car, track, dt, o = {}) {
  const fov = o.fovDeg ?? 62, aspect = o.aspect ?? 16 / 9;
  const sp = clamp(car.v / 80, 0, 1);
  // anticipate tight corridors: the distance eases down on the approach, so the hard limit below rarely has to act
  const tight = smoothstep(8, 16, corridorWidth(track, car.s, -10, 15 + car.v * 0.8));
  const back = (8 + sp * 2.4) * (0.68 + 0.32 * tight), la = 12 + sp * 8;
  const roadY = track.yAt(car.s);
  if (!st.init) {
    st.init = true; st.yaw = car.theta; st.ox = -Math.sin(car.theta) * back; st.oz = -Math.cos(car.theta) * back;
    st.oy = ROOF + RISE * back; st.ly = 1; st.pull = 1; st.swing = 0;
    st.oxV = st.ozV = st.oyV = st.yawV = st.lyV = st.swingV = 0;
  }
  // heading target: the car's heading, but never more than ~35deg off the road direction (spins / big slides don't swing the camera sideways)
  const road = track.thetaAt(car.s + 2), dev = wrapAngle(car.theta - road);
  const yawHead = road + clamp(dev, -0.6, 0.6);
  // the alternative is the chord back along the road, which is inside the corridor by construction
  track.at(car.s - back, (car.d ?? 0) * 0.5, _v);
  const yawRoad = Math.atan2(car.x - _v.x, car.z - _v.z), toRoad = wrapAngle(yawRoad - yawHead);
  // smallest swing toward the road whose full-length ray stays inside the walls (the widest-open one if none does)
  let swing = 1, bestT = -1;
  for (const w of SWINGS) {
    const y = yawHead + toRoad * w;
    const t = pullInFactor(track, car, { x: car.x - Math.sin(y) * back, z: car.z - Math.cos(y) * back }, car.idx);
    if (t > bestT + 1e-6) { bestT = t; swing = w; }
    if (t >= 1) break;
  }
  springField(st, 'swing', swing, 7, dt);
  springYaw(st, yawHead + toRoad * clamp(st.swing, 0, 1), 4.5 + 4 * clamp(st.swing, 0, 1), dt);
  const fx = Math.sin(st.yaw), fz = Math.cos(st.yaw);
  // spring the camera OFFSET from the car (a spring on the absolute position would lag 2v/omega behind at speed)
  springField(st, 'ox', -fx * back, 6.5, dt);
  springField(st, 'oz', -fz * back, 6.5, dt);
  const cx = car.x + st.ox, cz = car.z + st.oz, len = Math.hypot(st.ox, st.oz) || 1;
  // whatever is still blocked is taken out of the distance: quick but rate limited, eased back out
  const t = pullInFactor(track, car, { x: cx, z: cz }, car.idx);
  st.pull = t < st.pull ? Math.max(t, st.pull - 75 * dt / len) : st.pull + (t - st.pull) * (1 - Math.exp(-dt * 3));
  const dist = Math.max(st.pull * len, Math.min(MIN_DIST, len)), tt = dist / len;
  const px = car.x + st.ox * tt, pz = car.z + st.oz * tt;
  // height follows half of the road's rise or fall under the camera. Springing the offset from the road under the car gives crests and
  // dips damping without the lag a world-height spring has on a slope.
  const gP = surfaceY(track, px, pz, car.idx);
  const wantH = ROOF + RISE * dist + (gP - roadY) * 0.5;
  springField(st, 'oy', clamp(wantH, H_MIN, H_MAX), 7, dt);
  const py = Math.max(roadY + clamp(st.oy, H_MIN, H_MAX), gP + 1.5);
  // look at the road ahead: along the road, not along the heading, with the crest or dip ahead only half followed so the horizon stays up
  springField(st, 'ly', 1 + (track.yAt(car.s + la) - roadY) * 0.5, 6, dt);
  track.at(car.s + la, (car.d ?? 0) * 0.5, _v);
  const ax = _v.x - px, az = _v.z - pz, carPt = [car.x, car.y + 0.9, car.z];
  const lookDist = Math.max(Math.hypot(ax, az), 1);
  const toCarX = car.x - px, toCarZ = car.z - pz, carRange = Math.hypot(toCarX, toCarZ) || 1;
  const vHalf = fov * Math.PI / 360, hHalf = Math.atan(Math.tan(vHalf) * aspect), lim = Math.min(vHalf, hHalf) * 0.55;
  // aim is clamped about the direction to the car, per axis (continuous, so the view never pops between discrete blends)
  const yawCar = Math.atan2(toCarX, toCarZ);
  const aimYaw = yawCar + clamp(wrapAngle(Math.atan2(ax, az) - yawCar), -lim, lim);
  const carPitch = Math.atan2(py - carPt[1], carRange);
  const wantPitch = Math.atan2(py - (roadY + st.ly), lookDist);
  // framing may tip the view down past the soft cap, but never past the hard one: a car low in frame beats looking at the floor
  const aimPitch = Math.min(clamp(Math.min(wantPitch, MAX_PITCH), carPitch - lim, carPitch + lim), HARD_PITCH);
  const look = [px + Math.sin(aimYaw) * lookDist, py - Math.tan(aimPitch) * lookDist, pz + Math.cos(aimYaw) * lookDist];
  return { pos: [px, py, pz], look, yaw: st.yaw };
}
/** angle between the view direction (cam->look) and the direction to the car */
export function frameAngle(cam, look, carPt) {
  const a = [look[0] - cam[0], look[1] - cam[1], look[2] - cam[2]], b = [carPt[0] - cam[0], carPt[1] - cam[1], carPt[2] - cam[2]];
  const d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2], l = Math.hypot(...a) * Math.hypot(...b) || 1;
  return Math.acos(clamp(d / l, -1, 1));
}

/**
 * Overhead rig follow (state o: {x,y,z,yaw}). Critically damped, with velocity feed-forward: a spring chasing a target moving at
 * velocity v trails it by 2v/omega at steady state (23 m at 80 m/s with omega 7), which pushed the car up the screen as speed rose.
 * Aiming the spring at `car + v * 2/omega` cancels that steady lag exactly, so the car holds its screen position at any constant speed
 * while the spring still filters out jitter. The velocity is a lightly smoothed finite difference of the (already interpolated) car.
 */
export function overheadFollow(o, car, dt, { posOmega = 7, yOmega = 3, yawOmega = 1.5, velOmega = 18 } = {}) {
  springYaw(o, car.theta, yawOmega, dt);
  if (o.lastX === undefined || dt <= 0 || Math.hypot(car.x - o.lastX, car.z - o.lastZ) > 3 + 200 * dt) {
    o.vx = o.vy = o.vz = 0; // first frame / teleport / pit snap: no velocity estimate
  } else {
    const k = 1 - Math.exp(-velOmega * dt);
    o.vx += ((car.x - o.lastX) / dt - o.vx) * k; o.vy += ((car.y - o.lastY) / dt - o.vy) * k; o.vz += ((car.z - o.lastZ) / dt - o.vz) * k;
  }
  o.lastX = car.x; o.lastY = car.y; o.lastZ = car.z;
  springField(o, 'x', car.x + o.vx * 2 / posOmega, posOmega, dt);
  springField(o, 'z', car.z + o.vz * 2 / posOmega, posOmega, dt);
  springField(o, 'y', car.y + o.vy * 2 / yOmega, yOmega, dt);
  return o;
}
