// Spatial menu focus and gamepad edges. No DOM, so the rules can be unit tested.

/**
 * Next focus index in a direction, or `index` when nothing lies that way.
 * rects: {x, y, w, h}[]. dir: 'left' | 'right' | 'up' | 'down'.
 */
export function focusMove(rects, index, dir) {
  if (!rects?.length) return -1;
  const origin = index >= 0 && index < rects.length ? index : 0;
  const c = rects[origin];
  const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
  const horizontal = dir === 'left' || dir === 'right';
  const want = dir === 'left' || dir === 'up' ? -1 : 1;
  let best = -1, bestScore = Infinity;
  for (let i = 0; i < rects.length; i++) {
    if (i === origin) continue;
    const r = rects[i];
    const dx = (r.x + r.w / 2) - cx;
    const dy = (r.y + r.h / 2) - cy;
    const main = horizontal ? dx : dy;
    const cross = horizontal ? dy : dx;
    if (main * want <= 1) continue;
    if (Math.abs(cross) > Math.abs(main) * 2.2 + 8) continue;
    const score = Math.abs(main) + Math.abs(cross) * 2.4;
    if (score < bestScore) { bestScore = score; best = i; }
  }
  return best < 0 ? origin : best;
}

/** Digital directions from a Gamepad snapshot. Stick Y is positive downward, matching the browser. */
export function menuPadState(pad, dead = 0.5) {
  const ax = pad?.axes?.[0] || 0;
  const ay = pad?.axes?.[1] || 0;
  const pressed = (i) => !!pad?.buttons?.[i]?.pressed;
  return {
    left: pressed(14) || ax < -dead,
    right: pressed(15) || ax > dead,
    up: pressed(12) || ay < -dead,
    down: pressed(13) || ay > dead,
    a: pressed(0),
    b: pressed(1),
  };
}

const PAD_KEYS = ['up', 'down', 'left', 'right', 'a', 'b'];

/** Keys that went from released to held. */
export function risingEdges(prev, cur) {
  const out = [];
  for (const k of PAD_KEYS) if (cur?.[k] && !prev?.[k]) out.push(k);
  return out;
}
