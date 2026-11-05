// Fixed low-res render target sizing (integer nearest upscale) + camera texel snapping. Pure maths.
/**
 * @param cssW,cssH viewport in CSS px; dpr device pixel ratio
 * @returns canvas (device px), integer upscale k, low-res target size, and the centred viewport rect (device px)
 */
export function renderSize(cssW, cssH, dpr = 1, targetH = 240) {
  const W = Math.max(1, Math.round(cssW * dpr)), H = Math.max(1, Math.round(cssH * dpr));
  const k = Math.max(1, Math.round(H / targetH));
  const lowW = Math.max(1, Math.floor(W / k)), lowH = Math.max(1, Math.floor(H / k));
  const vw = lowW * k, vh = lowH * k;
  return { W, H, k, lowW, lowH, vx: Math.floor((W - vw) / 2), vy: Math.floor((H - vh) / 2), vw, vh };
}
/** world size of one low-res texel at `dist` for a vertical fov (deg) and low-res height */
export function texelWorld(dist, fovDeg, lowH) { return 2 * dist * Math.tan(fovDeg * Math.PI / 360) / lowH; }
/** Snap `pos` in its own view plane (right/up unit vectors) to multiples of `texel`. Returns the snapped [x,y,z]. */
export function snapToTexel(pos, right, up, texel) {
  if (!(texel > 0)) return pos.slice();
  const a = pos[0] * right[0] + pos[1] * right[1] + pos[2] * right[2];
  const b = pos[0] * up[0] + pos[1] * up[1] + pos[2] * up[2];
  const da = Math.round(a / texel) * texel - a, db = Math.round(b / texel) * texel - b;
  return [pos[0] + right[0] * da + up[0] * db, pos[1] + right[1] * da + up[1] * db, pos[2] + right[2] * da + up[2] * db];
}
