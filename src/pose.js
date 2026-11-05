// Car pose on the road: height + pitch from the road under the axles, roll from the road camber (pure maths).
// Axle positions are measured from the car origin along the heading (matches cars.js wheel layout).
export const AXLE_F = 1.9, AXLE_R = -1.65;

/**
 * @returns {{y:number, pitch:number, roll:number}}  pitch > 0 = nose up. y is the origin height so both axles touch the road.
 */
export function carPose(track, s) {
  const yF = track.yAt(s + AXLE_F), yR = track.yAt(s + AXLE_R), base = AXLE_F - AXLE_R;
  const slope = (yF - yR) / base;
  const y = yR + slope * (0 - AXLE_R);
  return { y, pitch: Math.atan(slope), roll: -Math.atan(track.bankAt ? track.bankAt(s) : 0) };
}
