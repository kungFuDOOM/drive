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
  /** triangle with a colour per vertex (gradients: worn verges, grimy wall bases) */
  tri3(a, b, c, ca, cb, cc) {
    this.p.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
    for (const col of [C(ca), C(cb), C(cc)]) this.c.push(col.r, col.g, col.b);
  }
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
/** world position varying; instancing-aware so instanced foliage / rocks can use the same world-space noise */
const WPOS_CHUNK = `#include <project_vertex>
  #ifdef USE_INSTANCING
    vWDet = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
  #else
    vWDet = (modelMatrix * vec4(transformed, 1.0)).xyz;
  #endif`;
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
  // summed octaves bunch up around 0.5: stretch so the channels use the whole range (otherwise every modulation is a few percent)
  const fbm = (ls, x, y) => Math.min(1, Math.max(0, (ls.reduce((s, [g, c, w]) => s + sample(g, c, x, y) * w, 0) - 0.5) * 2.1 + 0.5));
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
export function worldDetail(mat, { fine = 0.2, fineScale = 0.6, mid = 0.12, midScale = 9, coarse = 0.1, coarseScale = 70, rough = 0, bump = 0, patch = null, patchAmt = 0, patch2 = null, patch2Amt = 0, vertical = false, slope = null, strata = null, grid = null, courses = null } = {}) {
  const v3 = (c) => { const k = Array.isArray(c) ? { r: c[0], g: c[1], b: c[2] } : C(c); return `vec3(${k.r.toFixed(4)}, ${k.g.toFixed(4)}, ${k.b.toFixed(4)})`; };
  const tex = detailTexture();
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.tDetail = { value: tex };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWDet;' + (slope ? ' varying float vWSlope;' : ''))
      .replace('#include <project_vertex>', WPOS_CHUNK + (slope ? `
  #ifdef USE_INSTANCING
    vWSlope = 1.0;
  #else
    vWSlope = normalize(mat3(modelMatrix) * objectNormal).y;
  #endif` : ''));
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWDet; uniform sampler2D tDetail;' + (slope ? ' varying float vWSlope;' : ''))
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec2 wq = ${vertical ? 'vWDet.xz + vWDet.y * vec2(0.37, 0.61)' : 'vWDet.xz'};
        float dF = texture2D(tDetail, wq / ${fineScale.toFixed(3)}).r, dM = texture2D(tDetail, wq / ${midScale.toFixed(3)}).g, dC = texture2D(tDetail, wq / ${coarseScale.toFixed(3)}).b;
        diffuseColor.rgb *= (1.0 + (dF - 0.5) * ${(fine * 2).toFixed(3)}) * (1.0 + (dM - 0.5) * ${(mid * 2).toFixed(3)}) * (1.0 + (dC - 0.5) * ${(coarse * 2).toFixed(3)});
        ${patch ? `diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * ${v3(patch)} * 2.0, smoothstep(0.5, 0.68, dC * 0.6 + dM * 0.4) * ${patchAmt.toFixed(3)});` : ''}
        ${patch2 ? `diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * ${v3(patch2)} * 2.0, smoothstep(0.5, 0.34, dC * 0.5 + dM * 0.5) * ${patch2Amt.toFixed(3)});` : ''}
        ${slope ? `{
          // per-pixel steepness: broken rock on steep faces only, with horizontal bedding bands (strata)
          float rk = smoothstep(${slope.from.toFixed(3)}, ${slope.to.toFixed(3)}, 1.0 - vWSlope + (dM - 0.5) * 0.18);
          vec3 rockC = ${v3(slope.color)} * (0.75 + 0.5 * dF);
          ${strata ? `rockC *= 1.0 + (texture2D(tDetail, vec2((vWDet.y + (dM - 0.5) * ${(strata.scale * 0.8).toFixed(3)}) / ${strata.scale.toFixed(3)}, 0.37)).g - 0.5) * ${strata.amt.toFixed(3)};` : ''}
          diffuseColor.rgb = mix(diffuseColor.rgb, rockC, rk * ${slope.amt.toFixed(3)});
        }` : ''}
        ${grid ? `{
          // paving slab joints in world x/z, faded with distance so they never shimmer
          vec2 gq = abs(fract(vWDet.xz / ${grid.size.toFixed(3)} + 0.5) - 0.5) * ${grid.size.toFixed(3)};
          float jn = 1.0 - smoothstep(0.02, 0.04, min(gq.x, gq.y));
          diffuseColor.rgb *= 1.0 - jn * ${grid.amt.toFixed(3)} * (1.0 - smoothstep(60.0, 160.0, length(vViewPosition)));
        }` : ''}
        ${courses ? `{
          // masonry / cladding courses: bed joints every h in world y, head joints offset half a unit on alternate rows; fade out far away
          float cy = vWDet.y / ${courses.h.toFixed(3)}, cRow = floor(cy), cf = fract(cy);
          float bedJ = 1.0 - smoothstep(0.0, 0.06, min(cf, 1.0 - cf));
          float cx = fract((vWDet.x + vWDet.z) / ${(courses.h * 2.5).toFixed(3)} + mod(cRow, 2.0) * 0.5);
          float headJ = 1.0 - smoothstep(0.0, 0.024, min(cx, 1.0 - cx));
          diffuseColor.rgb *= 1.0 - max(bedJ, headJ) * ${courses.amt.toFixed(3)} * (1.0 - smoothstep(40.0, 120.0, length(vViewPosition)));
        }` : ''}`);
    if (rough) sh.fragmentShader = sh.fragmentShader.replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>\n roughnessFactor = clamp(roughnessFactor + (dM - 0.5) * ${(rough * 2).toFixed(3)}, 0.04, 1.0);`);
    if (bump) sh.fragmentShader = sh.fragmentShader.replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      {
        vec2 wqN = vWDet.xz; float sc = ${fineScale.toFixed(3)};
        float bL = texture2D(tDetail, (wqN + vec2(-0.22, 0.0)) / sc).r;
        float bR = texture2D(tDetail, (wqN + vec2(0.22, 0.0)) / sc).r;
        float bD = texture2D(tDetail, (wqN + vec2(0.0, -0.22)) / sc).r;
        float bU = texture2D(tDetail, (wqN + vec2(0.0, 0.22)) / sc).r;
        normal = normalize(normal + (viewMatrix * vec4((bL - bR), 0.0, (bD - bU), 0.0)).xyz * ${bump.toFixed(3)});
      }`);
  };
  mat.customProgramCacheKey = () => `wd${fine}${fineScale}${mid}${midScale}${coarse}${coarseScale}${rough}${bump}${patch}${patchAmt}${patch2}${patch2Amt}${vertical}${slope ? JSON.stringify(slope) : ''}${strata ? JSON.stringify(strata) : ''}${grid ? JSON.stringify(grid) : ''}${courses ? JSON.stringify(courses) : ''}`;
  return mat;
}


/**
 * Race-track asphalt. The geometry carries `aRoad` = (lateral offset d, path distance s, racing-line offset, braking 0..1) and
 * `aRoad2` = (half width, cornering load 0..1), so the surface is built from what actually happens on it instead of a repeating tile:
 * aggregate grain + blotches + resurfaced sections (world-space noise), streaks stretched along the direction of travel, a rubbered
 * twin-track groove that follows the racing line and thickens through corners, dark skid streaks in the braking zones, dusty
 * off-line edges and paving seams. Rubber also polishes the surface (lower roughness). 7 texture taps.
 */
export function roadSurface(mat, { rubber = 1, dust = [0.5, 0.46, 0.4], dustAmt = 0.3, bump = 0.5 } = {}) {
  const tex = detailTexture();
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.tDetail = { value: tex };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWDet; attribute vec4 aRoad; attribute vec2 aRoad2; varying vec4 vRoad; varying vec2 vRoad2;')
      .replace('#include <project_vertex>', WPOS_CHUNK + '\nvRoad = aRoad; vRoad2 = aRoad2;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vWDet; varying vec4 vRoad; varying vec2 vRoad2; uniform sampler2D tDetail;')
      .replace('#include <color_fragment>', `#include <color_fragment>
        vec2 wq = vWDet.xz;
        float rd = vRoad.x, rs = vRoad.y, rHalf = vRoad2.x, rLoad = vRoad2.y, rBrake = vRoad.w;
        float dF = texture2D(tDetail, wq / 2.3).r, dM = texture2D(tDetail, wq / 6.3).g, dC = texture2D(tDetail, wq / 53.0).b;
        float stF = texture2D(tDetail, vec2(rd / 11.0, rs / 380.0)).r;   // ~0.2 m wide, metres long: tyre streaks
        float stW = texture2D(tDetail, vec2(rd / 17.0 + 0.37, rs / 260.0)).g; // lane-wide wear bands
        // resurfaced sections: each stretch of tarmac was laid on a different day
        float sec = floor(rs / 83.0), secH = fract(sin(sec * 91.7 + 3.1) * 43758.5453);
        float tone = (1.0 + (dF - 0.5) * 0.3) * (1.0 + (dM - 0.5) * 0.3) * (1.0 + (dC - 0.5) * 0.3) * (0.86 + secH * 0.28) * (0.9 + stW * 0.2);
        float seam = (1.0 - smoothstep(0.0, 0.16, abs(fract(rs / 83.0) * 83.0 - 0.3))) * 0.22 + (1.0 - smoothstep(0.03, 0.14, abs(rd))) * 0.1;
        vec3 road = diffuseColor.rgb * tone * (1.0 - seam);
        // dusty, sun-bleached edges where nobody drives
        float edge = smoothstep(rHalf - 2.6, rHalf - 0.1, abs(rd)) * (0.55 + 0.9 * dM);
        road = mix(road, road * 1.25 + vec3(${dust.map((v) => (v * 0.05).toFixed(4)).join(', ')}), edge * ${dustAmt.toFixed(3)});
        // rubbered groove on the racing line: twin wheel tracks, heavier where the tyres are loaded
        float off = rd - vRoad.z;
        float lane = exp(-off * off / 3.4);
        float groove = lane * (0.62 - 0.26 * cos(off * 3.9)) * (0.3 + 0.7 * max(rLoad, rBrake)) * (0.55 + 0.9 * stF);
        // braking zones: individual dark streaks laid down by locked / loaded tyres, plus the odd stray mark off line
        float skid = smoothstep(0.56, 0.7, stF) * exp(-off * off / 9.0) * rBrake * 0.85;
        skid += smoothstep(0.69, 0.76, stF) * smoothstep(0.6, 0.75, dC) * 0.35;
        float rub = clamp((groove * 0.85 + skid) * ${rubber.toFixed(3)}, 0.0, 0.88);
        diffuseColor.rgb = mix(road, vec3(0.016, 0.016, 0.018) * (0.8 + 0.4 * dF), rub);`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        roughnessFactor = clamp(roughnessFactor + (dM - 0.5) * 0.2 - rub * 0.22 + edge * 0.05, 0.04, 1.0);`)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        #ifdef ROAD_BUMP
        {
          float bR = texture2D(tDetail, (wq + vec2(0.025, 0.0)) / 2.3).r, bU = texture2D(tDetail, (wq + vec2(0.0, 0.025)) / 2.3).r;
          normal = normalize(normal + (viewMatrix * vec4((dF - bR), 0.0, (dF - bU), 0.0)).xyz * ${bump.toFixed(3)} * (1.0 - rub * 0.6));
        }
        #endif`);
  };
  mat.customProgramCacheKey = () => `road${rubber}${dust}${dustAmt}${bump}`;
  mat.defines = { ...(mat.defines || {}), ROAD_BUMP: '' };
  /** Low graphics drops the two extra grain taps of the micro-bump (the albedo detail stays) */
  mat.userData.setRoadBump = (on) => { const has = 'ROAD_BUMP' in mat.defines; if (on === has) return; if (on) mat.defines.ROAD_BUMP = ''; else delete mat.defines.ROAD_BUMP; mat.needsUpdate = true; };
  return mat;
}

/** Catch-fence weave (diamond mesh + horizontal cables) as a tileable alpha DataTexture: no canvas needed, mipmapped so it fades to a haze far away. */
let fenceTex = null;
export function fenceTexture() {
  if (fenceTex) return fenceTex;
  const N = 64, data = new Uint8Array(N * N * 4);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const a = (x + y) % 16, b = (x - y + 64) % 16, wire = a < 2 || b < 2, cable = y % 32 < 2;
    const k = (y * N + x) * 4;
    data[k] = data[k + 1] = data[k + 2] = cable ? 150 : 120; data[k + 3] = cable ? 235 : wire ? 190 : 0;
  }
  fenceTex = new THREE.DataTexture(data, N, N);
  fenceTex.wrapS = fenceTex.wrapT = THREE.RepeatWrapping; fenceTex.magFilter = THREE.LinearFilter; fenceTex.minFilter = THREE.LinearMipmapLinearFilter;
  fenceTex.generateMipmaps = true; fenceTex.anisotropy = 4; fenceTex.colorSpace = THREE.SRGBColorSpace; fenceTex.needsUpdate = true;
  return fenceTex;
}

// ---------------------------------------------------------------- value noise (terrain, placement variety)
const h2 = (x, z) => { const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453; return s - Math.floor(s); };
/** smooth value noise 0..1, one feature per unit */
export const vnoise = (x, z) => {
  const xi = Math.floor(x), zi = Math.floor(z), u = x - xi, v = z - zi, a = u * u * (3 - 2 * u), b = v * v * (3 - 2 * v);
  const p = h2(xi, zi), q = h2(xi + 1, zi), r = h2(xi, zi + 1), t = h2(xi + 1, zi + 1);
  return (p + (q - p) * a) + ((r + (t - r) * a) - (p + (q - p) * a)) * b;
};
/** two-octave fractal noise 0..1 */
export const fbm2 = (x, z) => vnoise(x, z) * 0.62 + vnoise(x * 2.07 + 7.1, z * 2.07 - 3.3) * 0.38;
