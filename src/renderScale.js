// Fixed low-res render target sizing (integer upscale) + camera texel snapping. Pure maths.
/** Internal render height (px) per adaptive-quality level: finer pixels at higher quality, still chunky enough to read as pixel art. */
export const TARGET_H = [240, 300, 360];
export const targetHFor = (quality) => TARGET_H[Math.max(0, Math.min(TARGET_H.length - 1, Math.round(quality)))];
/** MSAA samples for the low-res target per quality level (resolved before the upscale, so edges stop crawling) */
export const msaaFor = (quality) => (quality >= 1 ? 4 : 0);
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
/**
 * "Sharp bilinear" sampling coordinate: inside a low-res texel the colour is flat (crisp pixels), but across the texel edge the sample
 * blends over ~1 device pixel (k device px per texel), so sub-texel camera motion slides edges instead of popping them.
 * Mirrors the GLSL in main.js. `t` = position in texel units (uv * res); returns the texel-space coordinate to sample with LINEAR filtering.
 */
export function sharpBilinear(t, k) {
  const u = t - 0.5, i = Math.floor(u), f = u - i;
  const w = Math.min(1, Math.max(0, (f - 0.5) * k + 0.5));
  return i + 0.5 + w;
}
/** Snap `pos` in its own view plane (right/up unit vectors) to multiples of `texel`. Returns the snapped [x,y,z]. */
export function snapToTexel(pos, right, up, texel, out = [0, 0, 0]) {
  if (!(texel > 0)) { out[0] = pos[0]; out[1] = pos[1]; out[2] = pos[2]; return out; }
  const a = pos[0] * right[0] + pos[1] * right[1] + pos[2] * right[2];
  const b = pos[0] * up[0] + pos[1] * up[1] + pos[2] * up[2];
  const da = Math.round(a / texel) * texel - a, db = Math.round(b / texel) * texel - b;
  out[0] = pos[0] + right[0] * da + up[0] * db; out[1] = pos[1] + right[1] * da + up[1] * db; out[2] = pos[2] + right[2] * da + up[2] * db;
  return out;
}
