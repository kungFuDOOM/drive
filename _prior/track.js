// Original circuit layout ("Skyloop"), pure geometry.
import { clamp, mod, angDiff } from './logic.js';

export const HALF = 8; // half track width

// Control points (x, z). Start/finish line is at the first point, heading +x.
const CTRL = [
  [0, 0], [100, 0], [175, -10], [228, -52], [246, -112], [216, -166], [156, -190],
  [100, -166], [86, -120], [36, -100], [-24, -125], [-66, -186], [-136, -206],
  [-202, -172], [-218, -106], [-196, -50], [-140, -8], [-70, 0],
];

const SCALE = 1.3;
const cr = (p0, p1, p2, p3, t) => {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
};

function smooth(arr, w) {
  const n = arr.length;
  return arr.map((_, i) => {
    let s = 0;
    for (let k = -w; k <= w; k++) s += arr[mod(i + k, n)];
    return s / (2 * w + 1);
  });
}

export function buildTrack(N = 480) {
  const n = CTRL.length, SUB = 60;
  const dense = [];
  for (let i = 0; i < n; i++) {
    const p0 = CTRL[mod(i - 1, n)], p1 = CTRL[i], p2 = CTRL[(i + 1) % n], p3 = CTRL[(i + 2) % n];
    for (let s = 0; s < SUB; s++) {
      const t = s / SUB;
      dense.push([SCALE * cr(p0[0], p1[0], p2[0], p3[0], t), SCALE * cr(p0[1], p1[1], p2[1], p3[1], t)]);
    }
  }
  const M = dense.length;
  const cum = [0];
  for (let i = 1; i <= M; i++) {
    const a = dense[i - 1], b = dense[i % M];
    cum.push(cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]));
  }
  const length = cum[M];
  const ds = length / N;
  const pts = [];
  let j = 0;
  for (let k = 0; k < N; k++) {
    const target = k * ds;
    while (cum[j + 1] < target) j++;
    const f = (target - cum[j]) / (cum[j + 1] - cum[j]);
    const a = dense[j], b = dense[(j + 1) % M];
    pts.push({ x: a[0] + (b[0] - a[0]) * f, z: a[1] + (b[1] - a[1]) * f });
  }
  const th = [];
  for (let i = 0; i < N; i++) {
    const a = pts[mod(i - 1, N)], b = pts[(i + 1) % N];
    const dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz);
    const p = pts[i];
    p.tx = dx / l; p.tz = dz / l;
    p.rx = -p.tz; p.rz = p.tx; // right-hand normal
    p.theta = Math.atan2(p.tx, p.tz);
    th.push(p.theta);
  }
  // signed curvature (positive = turning left)
  const kraw = th.map((_, i) => angDiff(th[(i + 1) % N], th[mod(i - 1, N)]) / (2 * ds));
  const ks = smooth(kraw, 5);
  const off = smooth(ks.map((k) => -clamp(k * 150, -4.5, 4.5)), 8);
  for (let i = 0; i < N; i++) {
    pts[i].kap = ks[i];
    pts[i].lineOff = off[i];
  }
  return { N, ds, length, pts };
}

/** Closest track sample + signed lateral (positive = right of travel). */
export function locate(tr, x, z, hint) {
  const N = tr.N;
  const from = hint == null ? 0 : hint - 25;
  const to = hint == null ? N - 1 : hint + 25;
  let best = 0, bd = Infinity;
  for (let k = from; k <= to; k++) {
    const i = mod(k, N), p = tr.pts[i];
    const dx = x - p.x, dz = z - p.z, d = dx * dx + dz * dz;
    if (d < bd) { bd = d; best = i; }
  }
  const p = tr.pts[best];
  const dx = x - p.x, dz = z - p.z;
  const along = dx * p.tx + dz * p.tz;
  return {
    i: best,
    idx: mod(best + clamp(along / tr.ds, -0.5, 0.5), N),
    lat: dx * p.rx + dz * p.rz,
  };
}

/** World position/heading at float index with lateral offset. */
export function pointAt(tr, idx, lat = 0) {
  const N = tr.N, i0 = Math.floor(idx), f = idx - i0;
  const a = tr.pts[mod(i0, N)], b = tr.pts[mod(i0 + 1, N)];
  const x = a.x + (b.x - a.x) * f, z = a.z + (b.z - a.z) * f;
  const rx = a.rx + (b.rx - a.rx) * f, rz = a.rz + (b.rz - a.rz) * f;
  return { x: x + rx * lat, z: z + rz * lat, cx: x, cz: z, rx, rz, theta: a.theta + angDiff(b.theta, a.theta) * f };
}

export function distToTrack(tr, x, z) {
  let bd = Infinity;
  for (const p of tr.pts) {
    const d = (x - p.x) ** 2 + (z - p.z) ** 2;
    if (d < bd) bd = d;
  }
  return Math.sqrt(bd);
}
