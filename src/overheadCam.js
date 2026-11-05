// Overhead ("TOP") camera rig: pure math, no three.js. The camera sits BEHIND and above the car on a slowly
// rotating heading, pitched down 42deg (from horizontal), narrow FOV so the ground recedes toward the top of the
// screen. The look-at point is placed ahead of the car so the car sits in the lower part of the frame.
export const OV = {
  fovDeg: 35,          // vertical FOV, fixed in every aspect (portrait only pulls back)
  pitchDeg: 42,        // camera forward vector, degrees below horizontal (same in portrait)
  widthLandscape: 140, // metres of ground across the frame at the look-at point (cars ~3% of width)
  widthPortrait: 55,
  carScreenOffset: 0.55, // car sits this fraction of the half-FOV below screen centre
};
const rad = (d) => d * Math.PI / 180;

/**
 * @param {{x:number,y:number,z:number,yaw:number,aspect:number,zoom?:number}} c  car position, rig heading (rad, 0 = +z), aspect, zoom (1 = normal, <1 closer)
 * @returns {{pos:number[], target:number[], fov:number, pitchDeg:number, height:number, distance:number, lead:number}}
 */
export function overheadRig({ x, y, z, yaw, aspect, zoom = 1 }) {
  const fov = OV.fovDeg, pitch = rad(OV.pitchDeg);
  const hf = 2 * Math.atan(Math.tan(rad(fov) / 2) * aspect);
  const width = aspect < 1 ? OV.widthPortrait : OV.widthLandscape;
  const D = (width / 2) / Math.tan(hf / 2) * zoom;       // camera -> look-at distance
  const back = D * Math.cos(pitch), height = D * Math.sin(pitch);
  // ground lead so the car appears OV.carScreenOffset*halfFov below centre
  const carAng = pitch + OV.carScreenOffset * rad(fov) / 2;
  const lead = Math.max(0, back - height / Math.tan(carAng));
  const sx = Math.sin(yaw), cz = Math.cos(yaw);
  const target = [x + sx * lead, y, z + cz * lead];
  const pos = [target[0] - sx * back, y + height, target[2] - cz * back];
  return { pos, target, fov, pitchDeg: OV.pitchDeg, height, distance: D, lead };
}
