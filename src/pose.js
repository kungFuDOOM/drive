// Car pose on the road: height + pitch from the road under the axles, roll from the road camber (pure maths).
// Axle positions are measured from the car origin along the heading (matches cars.js wheel layout).
export const AXLE_F = 1.9, AXLE_R = -1.65;

/**
 * @param {{y:number, pitch:number, roll:number}} [out] object to write into (default: a new one)
 * @returns {{y:number, pitch:number, roll:number}}  pitch > 0 = nose up. y is the origin height so both axles touch the road.
 */
export function carPose(track, s, out = { y: 0, pitch: 0, roll: 0 }) {
  const yF = track.yAt(s + AXLE_F), yR = track.yAt(s + AXLE_R), base = AXLE_F - AXLE_R;
  const slope = (yF - yR) / base;
  out.y = yR + slope * (0 - AXLE_R);
  out.pitch = Math.atan(slope);
  out.roll = -Math.atan(track.bankAt ? track.bankAt(s) : 0);
  return out;
}
