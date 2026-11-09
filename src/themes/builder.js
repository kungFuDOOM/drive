// Shared geometry-building helpers for all themes: seeded rng, colour cache, vertex-colour Builder (tri/quad/box),
// bake() for merged one-draw-call props, beam(), brand textures, and the track strip/wall helpers.
import * as THREE from 'three';
export { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const colCache = new Map();
export const C = (h) => { if (typeof h !== 'number') return h; let c = colCache.get(h); if (!c) { c = new THREE.Color(h); colCache.set(h, c); } return c; };

export class Builder {
  constructor() { this.p = []; this.c = []; }
  tri(a, b, c, col) {
    col = C(col);
    this.p.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
    for (let i = 0; i < 3; i++) this.c.push(col.r, col.g, col.b);
  }
  quad(a, b, c, d, col) { this.tri(a, b, c, col); this.tri(a, c, d, col); }
  /** oriented box; local +z forward (sin yaw, cos yaw), +x left. colors: hex or fn(faceIndex)->hex */
  box(cx, cy, cz, w, h, l, yaw, col, skip = 0) {
    const sx = Math.cos(yaw), sz = -Math.sin(yaw), fx = Math.sin(yaw), fz = Math.cos(yaw);
    const v = (a, b, c) => [cx + sx * a * w / 2 + fx * c * l / 2, cy + b * h / 2, cz + sz * a * w / 2 + fz * c * l / 2];
    const V = [v(-1, -1, -1), v(1, -1, -1), v(1, 1, -1), v(-1, 1, -1), v(-1, -1, 1), v(1, -1, 1), v(1, 1, 1), v(-1, 1, 1)];
    const faces = [[4, 5, 6, 7], [1, 0, 3, 2], [5, 1, 2, 6], [0, 4, 7, 3], [3, 7, 6, 2], [0, 1, 5, 4]]; // +z -z -x(+x?) ...
    faces.forEach((f, i) => { if (skip & (1 << i)) return; this.quad(V[f[0]], V[f[1]], V[f[2]], V[f[3]], typeof col === 'function' ? col(i) : col); });
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.c, 3));
    g.computeVertexNormals();
    return g;
  }
}


/** Bake a geometry with a flat vertex colour and a matrix (for merged one-draw-call props). */
export const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _v = new THREE.Vector3(), _s = new THREE.Vector3(1, 1, 1), _e = new THREE.Euler();
export function bake(geo, x, y, z, color, ry = 0, sx = 1, sy = 1, sz = 1) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  _m.compose(_v.set(x, y, z), _q.setFromEuler(_e.set(0, ry, 0)), _s.set(sx, sy, sz));
  g.applyMatrix4(_m);
  const c = C(color), n = g.attributes.position.count, arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  g.deleteAttribute('uv');
  return g;
}
/** A box beam between two points (any orientation), flat colour. */
export function beam(a, b, t, color) {
  const dir = new THREE.Vector3().subVectors(b, a), len = dir.length();
  const g = new THREE.BoxGeometry(t, len, t).toNonIndexed();
  _q.setFromUnitVectors(_v.set(0, 1, 0), dir.normalize());
  _m.compose(a.clone().add(b).multiplyScalar(0.5), _q, _s.set(1, 1, 1)); g.applyMatrix4(_m);
  const c = C(color), n = g.attributes.position.count, arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3)); g.deleteAttribute('uv');
  return g;
}
export const BOX = new THREE.BoxGeometry(1, 1, 1);

// made-up sponsors (no real brands)
export const BRANDS = [
  ['VOLTRIX', '#e8362b', '#ffffff'], ['NOVAFUEL', '#ffd21f', '#1b1b2a'], ['KRYTON TIRES', '#15151c', '#ffd21f'], ['ZENTRA BANK', '#1f5fd0', '#ffffff'],
  ['BLAZEO', '#ff8a1f', '#ffffff'], ['MOCHAMAX', '#6b3b20', '#ffe9c4'], ['QUBITEL', '#7a3fd0', '#e8ffe0'], ['SKYPLUM AIR', '#1fb6d6', '#06223a'],
];
export function brandTexture(i) {
  const [name, bg, fg] = BRANDS[i % BRANDS.length];
  const c = document.createElement('canvas'); c.width = 256; c.height = 80;
  const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, 256, 80);
  g.fillStyle = fg; g.fillRect(0, 0, 256, 6); g.fillRect(0, 74, 256, 6);
  for (let k = 0; k < 6; k++) g.fillRect(8 + k * 12, 14, 7, 7); // pixel stripe motif
  g.font = 'bold 40px "Courier New", monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
  let px = 40; g.font = `bold ${px}px "Courier New", monospace`;
  while (g.measureText(name).width > 236 && px > 14) { px -= 2; g.font = `bold ${px}px "Courier New", monospace`; }
  g.fillText(name, 128, 46);
  const t = new THREE.CanvasTexture(c); t.magFilter = THREE.NearestFilter; t.minFilter = THREE.LinearFilter; t.generateMipmaps = false; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}


/** point at lateral offset d from track sample i, raised by dy */
export const P = (T, i, d, dy = 0) => [T.px[i] + T.nx[i] * d, T.py[i] + dy, T.pz[i] + T.nz[i] * d];
/** ribbon along the track: fn(i) -> [dLeft, dRight, dy, colour] or null */
export function strip(b, T, fn) {
  const N = T.n;
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N, a = fn(i), c = fn(j);
    if (!a || !c) continue;
    const col = a[3];
    b.tri(P(T, i, a[0], a[2]), P(T, j, c[0], c[2]), P(T, i, a[1], a[2]), col);
    b.tri(P(T, i, a[1], a[2]), P(T, j, c[0], c[2]), P(T, j, c[1], c[2]), col);
  }
}
/** vertical wall face at lateral offset fn(i).d from y0..y1 (optional cap) */
export function wall(b, T, fn) {
  const N = T.n;
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N, a = fn(i), c = fn(j);
    if (!a || !c) continue;
    b.quad(P(T, i, a.d, a.y0), P(T, j, c.d, c.y0), P(T, j, c.d, c.y1), P(T, i, a.d, a.y1), a.col);
    if (a.cap) b.quad(P(T, i, a.d, a.y1), P(T, j, c.d, c.y1), P(T, j, c.d + a.cap, c.y1), P(T, i, a.d + a.cap, a.y1), a.capCol);
  }
}

// ---------------------------------------------------------------- world-space surface detail
let detailTex = null;
/** Tileable 256x256 value-noise texture (r = fine grain, g = medium blotches, b = coarse patches), built once, no canvas needed. */
export function detailTexture() {
  if (detailTex) return detailTex;
  const N = 256, data = new Uint8Array(N * N * 4), r = rng(1337);
  const layer = (cells) => { const g = new Float32Array(cells * cells); for (let i = 0; i < g.length; i++) g[i] = r(); return g; };
  const sample = (g, cells, x, y) => {
    const fx = (x / N) * cells, fy = (y / N) * cells, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0;
    const at = (i, j) => g[((j % cells) + cells) % cells * cells + ((i % cells) + cells) % cells];
    const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
    return (at(x0, y0) * (1 - sx) + at(x0 + 1, y0) * sx) * (1 - sy) + (at(x0, y0 + 1) * (1 - sx) + at(x0 + 1, y0 + 1) * sx) * sy;
  };
  const L = [[64, 0.55], [128, 0.3], [256, 0.15]].map(([c, w]) => [layer(c), c, w]), M = [[8, 0.6], [16, 0.25], [32, 0.15]].map(([c, w]) => [layer(c), c, w]), Cc = [[4, 0.7], [8, 0.3]].map(([c, w]) => [layer(c), c, w]);
  const fbm = (ls, x, y) => ls.reduce((s, [g, c, w]) => s + sample(g, c, x, y) * w, 0);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const k = (y * N + x) * 4;
    data[k] = Math.round(fbm(L, x, y) * 255); data[k + 1] = Math.round(fbm(M, x, y) * 255); data[k + 2] = Math.round(fbm(Cc, x, y) * 255); data[k + 3] = 255;
  }
  detailTex = new THREE.DataTexture(data, N, N);
  detailTex.wrapS = detailTex.wrapT = THREE.RepeatWrapping; detailTex.magFilter = THREE.LinearFilter; detailTex.minFilter = THREE.LinearMipmapLinearFilter;
  detailTex.generateMipmaps = true; detailTex.anisotropy = 4; detailTex.needsUpdate = true;
  return detailTex;
}
/**
 * Modulate a (non-instanced) material's albedo by world-space noise: grain (`fine`, per `fineScale` m), blotches (`mid`) and
 * large patches (`coarse`). Optional `rough` varies roughness with the blotches (asphalt: polished / rubbered areas). Cheap: 3 taps.
 */
export function worldDetail(mat, { fine = 0.2, fineScale = 0.6, mid = 0.12, midScale = 9, coarse = 0.1, coarseScale = 70, rough = 0 } = {}) {
  const tex = detailTexture();
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.tDetail = { value: tex };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWDet;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvWDet = (modelMatrix * vec4(transformed, 1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWDet; uniform sampler2D tDetail;')
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec2 wq = vWDet.xz;
        float dF = texture2D(tDetail, wq / ${fineScale.toFixed(3)}).r, dM = texture2D(tDetail, wq / ${midScale.toFixed(3)}).g, dC = texture2D(tDetail, wq / ${coarseScale.toFixed(3)}).b;
        diffuseColor.rgb *= (1.0 + (dF - 0.5) * ${(fine * 2).toFixed(3)}) * (1.0 + (dM - 0.5) * ${(mid * 2).toFixed(3)}) * (1.0 + (dC - 0.5) * ${(coarse * 2).toFixed(3)});`);
    if (rough) sh.fragmentShader = sh.fragmentShader.replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>\n roughnessFactor = clamp(roughnessFactor + (dM - 0.5) * ${(rough * 2).toFixed(3)}, 0.04, 1.0);`);
  };
  mat.customProgramCacheKey = () => `wd${fine}${fineScale}${mid}${midScale}${coarse}${coarseScale}${rough}`;
  return mat;
}
