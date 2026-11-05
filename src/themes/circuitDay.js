// Theme "Circuit Day": all environment art (terrain, track surfaces, props, sky, lights, rain).
// Theme interface: { name, build(scene, track), dispose(), setWeather({rain, wetness}), update(dt, camera, time),
//                    setStartLights(count, green), setCars(meshes), setPit(info), setQuality(level), fx }
// update(dt, camera, view): view = { x, y, z, half, dist } = shadow/fog focus point, shadow half-extent, camera->focus distance.
// `fx` is read by the post pass each frame: { rain, sat, tint[3], time, lift } (lift = metres the player car is jacked up).
// Nothing here touches path/physics/cars, so another theme can be swapped in at runtime.
import * as THREE from 'three';
import { smoothstep, lerp, wrapDelta, clamp } from '../physics.js';
import { PIT } from '../track.js';
import { TEAMS } from '../teams.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const colCache = new Map();
const C = (h) => { if (typeof h !== 'number') return h; let c = colCache.get(h); if (!c) { c = new THREE.Color(h); colCache.set(h, c); } return c; };

class Builder {
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
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _v = new THREE.Vector3(), _s = new THREE.Vector3(1, 1, 1), _e = new THREE.Euler();
function bake(geo, x, y, z, color, ry = 0, sx = 1, sy = 1, sz = 1) {
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
function beam(a, b, t, color) {
  const dir = new THREE.Vector3().subVectors(b, a), len = dir.length();
  const g = new THREE.BoxGeometry(t, len, t).toNonIndexed();
  _q.setFromUnitVectors(_v.set(0, 1, 0), dir.normalize());
  _m.compose(a.clone().add(b).multiplyScalar(0.5), _q, _s.set(1, 1, 1)); g.applyMatrix4(_m);
  const c = C(color), n = g.attributes.position.count, arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3)); g.deleteAttribute('uv');
  return g;
}
const BOX = new THREE.BoxGeometry(1, 1, 1);

// made-up sponsors (no real brands)
const BRANDS = [
  ['VOLTRIX', '#e8362b', '#ffffff'], ['NOVAFUEL', '#ffd21f', '#1b1b2a'], ['KRYTON TIRES', '#15151c', '#ffd21f'], ['ZENTRA BANK', '#1f5fd0', '#ffffff'],
  ['BLAZEO', '#ff8a1f', '#ffffff'], ['MOCHAMAX', '#6b3b20', '#ffe9c4'], ['QUBITEL', '#7a3fd0', '#e8ffe0'], ['SKYPLUM AIR', '#1fb6d6', '#06223a'],
];
function brandTexture(i) {
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

export function createCircuitDay() {
  const group = new THREE.Group();
  const disposables = [];
  let scene = null, track = null, sky = null, clouds = null, sun = null, hemi = null;
  const lightMats = [];
  let prevFog = null, prevBg = null;
  const state = { rain: 0, wet: 0 };
  const mats = {};
  const fx = { rain: 0, sat: 1, tint: [1, 1, 1], time: 0, lift: 0 };
  const view = { fogNear: 120, fogFar: 780 };
  let quality = 2, shadowSize = 2048;

  // animated bits
  let flags = null, flagData = [], ferris = null, gondolas = null, splash = null, splashData = [], carLights = null, tailLights = null, headCones = null, crewRig = null, carMeshes = [];
  const reserved = []; // keep-out circles for tree/billboard placement
  const free = (x, z, r = 0) => !reserved.some((o) => (o.x - x) ** 2 + (o.z - z) ** 2 < (o.r + r) ** 2);
  const reserve = (x, z, r) => reserved.push({ x, z, r });
  // every prop is registered here (circle r, or oriented rect w x l) after passing the corridor check against ALL track samples
  const placements = [];
  const MARGIN = 1.2;
  const rectPts = (x, z, w, l, yaw, step = 4) => {
    const sx = Math.cos(yaw), sz = -Math.sin(yaw), fx = Math.sin(yaw), fz = Math.cos(yaw), pts = [];
    const na = Math.max(1, Math.ceil(w / step)), nl = Math.max(1, Math.ceil(l / step));
    for (let a = 0; a <= na; a++) for (let b = 0; b <= nl; b++) {
      if (a > 0 && a < na && b > 0 && b < nl) continue; // outline only (corridor is convex-ish locally)
      const u = (a / na - 0.5) * w, v = (b / nl - 0.5) * l;
      pts.push([x + sx * u + fx * v, z + sz * u + fz * v]);
    }
    return pts;
  };
  let lastGround = { hi: 0, lo: 0 };
  /** terrain extremes under a footprint (circle r or oriented rect w x l) */
  const groundUnder = (x, z, w, l, yaw) => {
    const pts = w == null ? [[x, z], [x + l, z], [x - l, z], [x, z + l], [x, z - l]] : rectPts(x, z, w, l, yaw).concat([[x, z]]);
    let hi = -1e9, lo = 1e9;
    for (const q of pts) { const h = gy(q[0], q[1]); if (h > hi) hi = h; if (h < lo) lo = h; }
    return { hi, lo };
  };
  const tryPlace = (kind, x, z, w, l, yaw = 0, extra = 0) => {
    const ok = w == null ? track.clearance(x, z) >= l + MARGIN + extra : rectPts(x, z, w, l, yaw).every((q) => track.clearance(q[0], q[1]) >= MARGIN + extra);
    if (ok) {
      lastGround = groundUnder(x, z, w, l, yaw);
      placements.push(w == null ? { kind, x, z, r: l, y: lastGround.hi, lo: lastGround.lo } : { kind, x, z, w, l, yaw, y: lastGround.hi, lo: lastGround.lo });
    }
    return ok;
  };
  /** footing from the lowest ground under a footprint up to the base, so nothing floats on a slope */
  const footing = (b, x, z, w, l, yaw, col) => {
    const g = lastGround, h = g.hi - g.lo + 0.8;
    if (h > 0.9) b.box(x, g.lo - 0.8 + h / 2, z, w, h, l, yaw, col);
  };

  const lit = (extra = {}) => new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true, side: THREE.DoubleSide, ...extra });
  const keep = (o) => { disposables.push(o); return o; };
  const addMesh = (b, mat, name, cast = false, recv = true) => {
    const m = new THREE.Mesh(keep(b.geometry()), mat); m.name = name; m.matrixAutoUpdate = false; m.updateMatrix();
    m.castShadow = cast; m.receiveShadow = recv; group.add(m); return m;
  };

  // ---------------- helpers ----------------
  const P = (T, i, d, dy = 0) => [T.px[i] + T.nx[i] * d, T.py[i] + dy, T.pz[i] + T.nz[i] * d];
  function strip(b, T, fn) {
    const N = T.n;
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N, a = fn(i), c = fn(j);
      if (!a || !c) continue;
      const col = a[3];
      b.tri(P(T, i, a[0], a[2]), P(T, j, c[0], c[2]), P(T, i, a[1], a[2]), col);
      b.tri(P(T, i, a[1], a[2]), P(T, j, c[0], c[2]), P(T, j, c[1], c[2]), col);
    }
  }
  /** vertical wall face at lateral offset fn(i) from y0..y1 */
  function wall(b, T, fn) {
    const N = T.n;
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N, a = fn(i), c = fn(j);
      if (!a || !c) continue;
      b.quad(P(T, i, a.d, a.y0), P(T, j, c.d, c.y0), P(T, j, c.d, c.y1), P(T, i, a.d, a.y1), a.col);
      if (a.cap) b.quad(P(T, i, a.d, a.y1), P(T, j, c.d, c.y1), P(T, j, c.d + a.cap, c.y1), P(T, i, a.d + a.cap, a.y1), a.capCol);
    }
  }
  const at = (s, d, dy = 0) => { const p = track.at(s, d); p.y += dy; return [p.x, p.y, p.z]; };
  const place = (b, s, d, dy, w, h, l, col, yawOff = 0) => {
    const p = track.at(s, d); b.box(p.x, p.y + dy + h / 2, p.z, w, h, l, track.thetaAt(s) + yawOff, col);
  };

  // nearest-on-track lookup (coarse + refine)
  function nearest(x, z, out) {
    const T = track, N = T.n; let best = 1e18, bi = 0;
    for (let i = 0; i < N; i += 3) { const dx = x - T.px[i], dz = z - T.pz[i], d2 = dx * dx + dz * dz; if (d2 < best) { best = d2; bi = i; } }
    const c = bi;
    for (let k = -3; k <= 3; k++) { const i = (c + k + N) % N, dx = x - T.px[i], dz = z - T.pz[i], d2 = dx * dx + dz * dz; if (d2 < best) { best = d2; bi = i; } }
    const dx = x - T.px[bi], dz = z - T.pz[bi], along = dx * T.tx[bi] + dz * T.tz[bi];
    const slope = (T.py[(bi + 1) % N] - T.py[(bi - 1 + N) % N]) / (2 * T.ds);
    out.i = bi; out.y = T.py[bi] + clamp(along, -T.ds, T.ds) * slope; out.dist = Math.sqrt(best);
    out.d = dx * T.nx[bi] + dz * T.nz[bi]; out.s = bi * T.ds + along;
    return out;
  }
  const gi = {};
  /** terrain height at (x,z); also fills `out` with nearest-track info and out.e (distance from track edge) */
  function terrainAt(x, z, out = gi) {
    const T = track;
    nearest(x, z, out);
    const e = out.dist - T.half[out.i]; out.e = e;
    const far = 24 * smoothstep(110, 340, e);
    const noise = (Math.sin(x * 0.011 + 1.3) * Math.cos(z * 0.013 + 0.4) * 0.5 + Math.sin(x * 0.027 + z * 0.019) * 0.28 + Math.sin(z * 0.045 - x * 0.03) * 0.12 + 0.3) * far
      + Math.sin(x * 0.09) * Math.cos(z * 0.08) * 1.2 * smoothstep(40, 100, e);
    return lerp(out.y - 0.15 - 0.45 * (1 - smoothstep(10, 26, e)), noise, smoothstep(24, 100, e)); // dips under the road so cell interpolation never pokes through surfaces
  }
  /** distance of (x,z) beyond the outermost barrier (negative = inside the barriers) */
  function beyondWall(x, z) { return track.clearance(x, z); }
  function gy(x, z) { return terrainAt(x, z, {}); }

  // ---------------- build ----------------
  function build(sc, tr) {
    scene = sc; track = tr;
    const T = tr, N = T.n, L = T.length, R = rng(7);
    prevFog = scene.fog; prevBg = scene.background;
    scene.background = new THREE.Color(0xc4e4ff);
    scene.fog = new THREE.Fog(0xc4e4ff, 120, 780);

    // lights: strong directional sun with a crisp capped shadow map, soft hemisphere fill
    hemi = new THREE.HemisphereLight(0xcfe6ff, 0x5b8a45, 0.95);
    sun = new THREE.DirectionalLight(0xfff1d6, 2.9);
    sun.userData.dir = new THREE.Vector3(-0.55, 0.75, 0.45).normalize();
    sun.position.copy(sun.userData.dir).multiplyScalar(260);
    sun.castShadow = true;
    sun.shadow.mapSize.set(shadowSize, shadowSize);
    Object.assign(sun.shadow.camera, { near: 20, far: 640, left: -90, right: 90, top: 90, bottom: -90 });
    sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.35;
    group.add(hemi, sun, sun.target);

    // materials
    mats.asphalt = keep(new THREE.MeshPhongMaterial({ vertexColors: true, flatShading: true, side: THREE.DoubleSide, specular: 0x000000, shininess: 55 }));
    mats.terrain = keep(lit());
    mats.deco = keep(lit());
    mats.pit = keep(new THREE.MeshPhongMaterial({ vertexColors: true, flatShading: true, side: THREE.DoubleSide, specular: 0x000000, shininess: 55, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
    mats.decal = keep(lit({ polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }));
    mats.decal2 = keep(lit({ polygonOffset: true, polygonOffsetFactor: -5, polygonOffsetUnits: -5 })); // painted over other markings: own depth layer
    mats.gravel = keep(lit());
    mats.cloud = keep(new THREE.MeshBasicMaterial({ vertexColors: true, fog: false }));
    mats.tire = keep(new THREE.MeshLambertMaterial({ flatShading: true }));
    mats.ao = keep(new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.34, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6, side: THREE.DoubleSide }));
    mats.foliage = keep(new THREE.MeshLambertMaterial({ flatShading: true }));
    mats.trunk = keep(new THREE.MeshLambertMaterial({ color: 0x6a4426, flatShading: true }));
    const aoB = new Builder();
    /** dark footprint decal (oriented rectangle) for an ambient-occlusion feel under big objects */
    const aoRect = (cx, cy, cz, w, l, yaw, pad = 1.6) => {
      const sx = Math.cos(yaw), sz = -Math.sin(yaw), fx = Math.sin(yaw), fz = Math.cos(yaw), hw = w / 2 + pad, hl = l / 2 + pad;
      const v = (a, f) => [cx + sx * a + fx * f, cy + 0.07, cz + sz * a + fz * f];
      aoB.quad(v(-hw, -hl), v(hw, -hl), v(hw, hl), v(-hw, hl), 0x000000);
    };

    // ---- sky dome ----
    const skyMat = keep(new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new THREE.Color(0x2f78d0) }, bot: { value: new THREE.Color(0xc4e4ff) }, sunDir: { value: sun.userData.dir.clone() }, sunAmt: { value: 1 } },
      vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 bot; uniform vec3 sunDir; uniform float sunAmt; varying vec3 vD; void main(){ float h = clamp(vD.y*1.6+0.05,0.0,1.0); vec3 c = mix(bot, top, pow(h,0.7)); float s = max(dot(normalize(vD), sunDir),0.0); c += vec3(1.0,0.9,0.6)*(pow(s,600.0)*2.0 + pow(s,12.0)*0.25)*sunAmt; gl_FragColor = vec4(c,1.0); }',
    }));
    sky = new THREE.Mesh(keep(new THREE.SphereGeometry(1000, 16, 10)), skyMat);
    sky.renderOrder = -10; sky.frustumCulled = false; group.add(sky);

    // ---- terrain (saturated, mown-stripe grass) ----
    const X0 = -760, X1 = 840, Z0 = -520, Z1 = 1000, CELL = 8;
    {
      const nxv = Math.round((X1 - X0) / CELL) + 1, nzv = Math.round((Z1 - Z0) / CELL) + 1;
      const pos = new Float32Array(nxv * nzv * 3), col = new Float32Array(nxv * nzv * 3);
      const info = {}; const g1 = C(0x6fd03c), g2 = C(0x5bbd32), gfar = C(0x3f9a30), rock = C(0x9a947c), tmpc = new THREE.Color();
      for (let iz = 0; iz < nzv; iz++) for (let ix = 0; ix < nxv; ix++) {
        const x = X0 + ix * CELL, z = Z0 + iz * CELL, k = iz * nxv + ix;
        const h = terrainAt(x, z, info), e = info.e;
        pos[k * 3] = x; pos[k * 3 + 1] = h; pos[k * 3 + 2] = z;
        const stripe = Math.floor(info.s / (L / (2 * Math.round(L / 36)))) & 1;
        tmpc.copy(stripe ? g1 : g2).lerp(gfar, smoothstep(60, 240, e));
        tmpc.lerp(rock, smoothstep(14, 36, h) * 0.8);
        col[k * 3] = tmpc.r; col[k * 3 + 1] = tmpc.g; col[k * 3 + 2] = tmpc.b;
      }
      const idx = [];
      for (let iz = 0; iz < nzv - 1; iz++) for (let ix = 0; ix < nxv - 1; ix++) {
        const a = iz * nxv + ix, b = a + 1, c = a + nxv, d = c + 1;
        idx.push(a, c, b, b, c, d);
      }
      const g = keep(new THREE.BufferGeometry());
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('color', new THREE.BufferAttribute(col, 3));
      g.setIndex(idx); g.computeVertexNormals();
      const m = new THREE.Mesh(g, mats.terrain); m.name = 'terrain'; m.frustumCulled = false; m.receiveShadow = true; group.add(m);
    }

    // ---- track surfaces ----
    const asph = new Builder(), pitB = new Builder(), mark = new Builder(), mark2 = new Builder(), kerbB = new Builder(), gravelB = new Builder();
    const A1 = C(0x2c2f36), A2 = C(0x32353d), PITC = C(0x23262c);
    strip(asph, T, (i) => [-T.half[i], T.half[i], 0, ((i >> 3) & 1) ? A1 : A2]);
    strip(pitB, T, (i) => T.pitTaper[i] > 0.02 ? [T.half[i], T.half[i] + 16 * T.pitTaper[i], 0, PITC] : null /* coplanar with the track: no step at the join */);
    const WHITE = C(0xfafafa), YEL = C(0xffd21f), RED = C(0xe6261f);
    for (const sd of [1, -1]) {
      strip(mark, T, (i) => (sd > 0 && T.pitTaper[i] > 0.5) ? null : (sd > 0 ? [T.half[i] - 0.8, T.half[i] - 0.2, 0.045, WHITE] : [-T.half[i] + 0.2, -T.half[i] + 0.8, 0.045, WHITE]));
    }
    strip(mark, T, (i) => T.pitTaper[i] > 0.5 ? [T.half[i] + 0.1, T.half[i] + 0.7, 0.045, WHITE] : null);
    strip(mark, T, (i) => T.pitTaper[i] > 0.5 ? [T.half[i] + 0.1 + 4.5 + 3.3, T.half[i] + 0.1 + 4.5 + 3.9, 0.045, YEL] : null);
    // kerbs (outside edge, bold red/white) + gravel run-off
    for (const sd of [1, -1]) {
      strip(kerbB, T, (i) => {
        if (!T.kerb[i] || (sd > 0 && T.pitTaper[i] > 0.02)) return null;
        const col = (i >> 0) & 1 ? RED : WHITE, h = T.half[i], kw = Math.min(1.6, (sd > 0 ? T.runL[i] : T.runR[i]) - 0.15); // never past the (inside-clamped) wall
        if (kw < 0.2) return null;
        return sd > 0 ? [h, h + kw, 0.03, col] : [-h - kw, -h, 0.03, col];
      });
      strip(gravelB, T, (i) => {
        if (!T.gravel[i] || (sd > 0 && T.pitTaper[i] > 0.02)) return null;
        const h = T.half[i] + 1.6, w = T.half[i] + (sd > 0 ? T.runL[i] : T.runR[i]);
        if (w < h + 0.3) return null; // inside of a tight corner: no room for gravel
        const col = ((i >> 2) & 1) ? C(0xdcc38a) : C(0xd1b77b);
        return sd > 0 ? [h, w, -0.03, col] : [-w, -h, -0.03, col];
      });
    }
    // start line + grid + pit bays
    for (let k = 0; k < 2; k++) for (let c = -9; c < 9; c++) {
      const s0 = -0.6 + k * 0.6, col = (c + k) & 1 ? 0x111111 : 0xf8f8f8;
      mark2.quad(at(s0, c, 0.045), at(s0 + 0.6, c, 0.045), at(s0 + 0.6, c + 1, 0.045), at(s0, c + 1, 0.045), col);
    }
    for (let slot = 0; slot < 10; slot++) {
      const row = Math.floor(slot / 2), col = slot % 2, s = L - 10 - row * 9 - col * 4.5, d = col ? -3.2 : 3.2;
      const sf = s + 3.0;
      mark.quad(at(sf, d - 1.3, 0.05), at(sf + 0.6, d - 1.3, 0.05), at(sf + 0.6, d + 1.3, 0.05), at(sf, d + 1.3, 0.05), WHITE);
      for (const sx of [-1.3, 1.3]) mark.quad(at(sf - 1.5, d + sx - 0.25, 0.05), at(sf, d + sx - 0.25, 0.05), at(sf, d + sx + 0.25, 0.05), at(sf - 1.5, d + sx + 0.25, 0.05), WHITE);
    }
    for (let t = 0; t < 10; t++) {
      const s = ((T.boxU(t) % L) + L) % L, hw = T.halfAt(s);
      for (const o of [-6.5, 6.5]) mark.quad(at(s + o - 0.3, hw + 8, 0.05), at(s + o + 0.3, hw + 8, 0.05), at(s + o + 0.3, hw + 16, 0.05), at(s + o - 0.3, hw + 16, 0.05), WHITE);
      // team-coloured box pad
      const tc = TEAMS[t].c1;
      mark.quad(at(s - 5, hw + 10.2, 0.04), at(s + 5, hw + 10.2, 0.04), at(s + 5, hw + 12.8, 0.04), at(s - 5, hw + 12.8, 0.04), tc);
    }
    addMesh(asph, mats.asphalt, 'asphalt');
    addMesh(pitB, mats.pit, 'pitlane');
    addMesh(mark, mats.decal, 'markings');
    addMesh(mark2, mats.decal2, 'startline').renderOrder = 1;
    addMesh(kerbB, mats.decal, 'kerbs');
    addMesh(gravelB, mats.gravel, 'gravel');

    // ---- barriers, stone walls ----
    const walls = new Builder();
    const CONC = [C(0xf0f0ec), C(0xdcdcd6)], STONE = [C(0x8a867d), C(0x77736b), C(0x938e84), C(0x6c6860)], CAP = C(0xa29d92);
    for (const sd of [1, -1]) {
      wall(walls, T, (i) => {
        if (sd > 0 && T.pitTaper[i] > 0.02) return null;
        const w = sd > 0 ? T.leftWall[i] : T.rightWall[i], stone = T.runoff[i] < 6;
        const hgt = stone ? lerp(1.1, 3.2, smoothstep(6, 2, T.runoff[i])) : 1.1;
        const col = stone ? STONE[((i >> 1) + (Math.floor(hgt) & 1) * 2 + ((i * 7) % 3)) % 4] : CONC[(i >> 2) & 1];
        return { d: sd * w, y0: 0, y1: hgt, col, cap: stone ? sd * 1.0 : sd * 0.4, capCol: stone ? CAP : C(0x9a9a98) };
      });
      // dark contact strip on the track side of every barrier (AO)
      strip(aoB, T, (i) => {
        if (sd > 0 && T.pitTaper[i] > 0.02) return null;
        const w = sd > 0 ? T.leftWall[i] : T.rightWall[i];
        return sd > 0 ? [w - 1.8, w, 0.06, 0x000000] : [-w, -w + 1.8, 0.06, 0x000000];
      });
    }
    addMesh(walls, mats.deco, 'walls', true, true);

    // tire walls (instanced) on outside of corners
    {
      const spots = [];
      for (let i = 0; i < N; i += 1) {
        if (!T.kerb[i] || T.runoff[i] < 8) continue;
        const side = T.kappaS[i] > 0 ? -1 : 1; // outside of the turn
        if (side > 0 && T.pitTaper[i] > 0.02) continue;
        const w = side > 0 ? T.leftWall[i] : T.rightWall[i];
        for (let k = 0; k < 2; k++) {
          const j = (i + 1) % N, u = k * 0.5;
          const x = lerp(T.px[i] + T.nx[i] * side * (w - 0.6), T.px[j] + T.nx[j] * side * (w - 0.6), u);
          const z = lerp(T.pz[i] + T.nz[i] * side * (w - 0.6), T.pz[j] + T.nz[j] * side * (w - 0.6), u);
          spots.push([x, lerp(T.py[i], T.py[j], u), z, (i * 2 + k)]);
        }
      }
      const geo = keep(new THREE.CylinderGeometry(0.58, 0.58, 0.5, 8));
      const inst = new THREE.InstancedMesh(geo, mats.tire, spots.length * 3);
      const m4 = new THREE.Matrix4(), c3 = new THREE.Color();
      const pal = [0xf5f5f5, 0xe6261f, 0x2a2a30, 0x2a2a30];
      spots.forEach(([x, y, z, id], n) => {
        for (let r = 0; r < 3; r++) {
          m4.makeTranslation(x, y + 0.25 + r * 0.5, z);
          inst.setMatrixAt(n * 3 + r, m4);
          inst.setColorAt(n * 3 + r, c3.setHex(pal[(id + r) % 4]));
        }
      });
      inst.frustumCulled = false; inst.castShadow = true; inst.receiveShadow = true; group.add(inst);
    }

    // ---- static props ----
    const props = new Builder();
    const crowd = [0xe84a4a, 0x3b7fd6, 0xf2d04a, 0xf7f7f7, 0x4ac27a, 0x9b59d6, 0xff9a3c, 0x2d2f3a, 0xff5fa2, 0x35d0d0];
    const skin = [0xf1c9a0, 0xd9a273, 0xa8704a, 0x7a4a2d];
    const spectators = []; // [x,y,z,yaw,shirt,skin]
    const flagSpots = []; // [x,y,z,yaw,color]
    // start/finish gantry
    {
      const hw = T.halfAt(0), th = T.thetaAt(0);
      const GREY = 0x6d7480, DARK = 0x1c1f26;
      for (const sd of [1, -1]) { const p = T.at(0, sd * (hw + 2.5)); props.box(p.x, p.y + 5, p.z, 1.6, 10, 1.6, th, GREY); }
      const p0 = T.at(0, 0); props.box(p0.x, p0.y + 9.4, p0.z, (hw + 2.5) * 2 + 1.6, 2.6, 1.8, th, GREY);
      props.box(p0.x, p0.y + 7.9, p0.z, (hw + 2.5) * 2, 0.5, 1.2, th, 0xf2f2f2);
      for (let k = 0; k < 5; k++) {
        const off = (k - 2) * 3.0;
        const p = T.at(-1.0, off); props.box(p.x, p.y + 9.6, p.z, 2.6, 2.2, 0.4, th, DARK);
        const geo = keep(new THREE.PlaneGeometry(1.7, 1.7));
        const mat = keep(new THREE.MeshBasicMaterial({ color: 0x3a0c0a, fog: false }));
        const m = new THREE.Mesh(geo, mat); m.position.set(p.x, p.y + 9.6, p.z); m.rotation.y = th + Math.PI;
        const fw = new THREE.Vector3(Math.sin(th), 0, Math.cos(th)); m.position.addScaledVector(fw, -0.22);
        group.add(m); lightMats.push(mat);
      }
    }
    // grandstands: stepped concrete, roof, instanced pixel crowd
    function stand(s, d, len, rows, side) {
      const rowH = 1.15, rowD = 2.0;
      const p0 = T.at(s, d), th = T.thetaAt(s);
      const sx = Math.cos(th), sz = -Math.sin(th), fx = Math.sin(th), fz = Math.cos(th);
      const totW = rows * rowD;
      // whole structure (seating + roof + posts) must clear the road corridor of every track sample
      if (!tryPlace('stand', p0.x + sx * (totW / 2 + 1.0) * side, p0.z + sz * (totW / 2 + 1.0) * side, totW + 5, len + 3, th)) return false;
      p0.y = lastGround.hi;
      footing(props, p0.x + sx * (totW / 2 + 0.5) * side, p0.z + sz * (totW / 2 + 0.5) * side, totW + 5, len + 3, th, 0x8d9099);
      const W = (a, y, f) => [p0.x + sx * a * side + fx * f, p0.y + y, p0.z + sz * a * side + fz * f];
      for (let r = 0; r < rows; r++) {
        const a = r * rowD;
        props.box(p0.x + sx * (a + rowD / 2) * side, p0.y + (r + 1) * rowH / 2, p0.z + sz * (a + rowD / 2) * side, rowD, (r + 1) * rowH, len, th, r & 1 ? 0xb8bac2 : 0xa6a8b0, (1 << 4) | (1 << 5));
        for (let f = 0.5; f < len - 0.5; f += 1.05) {
          if (R() < 0.07) continue; // empty seat
          const w = W(a + rowD * 0.5, (r + 1) * rowH, f - len / 2);
          spectators.push([w[0], w[1], w[2], th, R() < 0.5 ? crowd[Math.floor(R() * crowd.length)] : crowd[(Math.floor(f / 6) + r) % crowd.length], skin[Math.floor(R() * skin.length)]]);
        }
      }
      const tot = rows * rowD, roofY = rows * rowH + 3.2;
      const rw = tot * 0.4, rc = tot - rw / 2 + 1.2; // canopy over the back rows only
      props.box(p0.x + sx * rc * side, p0.y + roofY, p0.z + sz * rc * side, rw + 2.6, 0.5, len + 2, th, 0xeeeef2);
      props.box(p0.x + sx * rc * side, p0.y + roofY + 0.4, p0.z + sz * rc * side, rw + 2.6, 0.3, len + 2.2, th, 0x2c6fe0, 0);
      for (const f of [-len / 2 + 1, 0, len / 2 - 1]) props.box(p0.x + sx * (tot + 0.5) * side + fx * f, p0.y + roofY / 2, p0.z + sz * (tot + 0.5) * side + fz * f, 0.5, roofY, 0.5, th, 0x555a66);
      for (let f = -len / 2 + 4; f < len / 2 - 4; f += 8) {
        const t = TEAMS[Math.floor(R() * TEAMS.length)];
        props.box(p0.x + sx * -0.3 * side + fx * f, p0.y + 1.6, p0.z + sz * -0.3 * side + fz * f, 0.3, 1.3, 7, th, t.c1);
        props.box(p0.x + sx * -0.35 * side + fx * f, p0.y + 1.6, p0.z + sz * -0.35 * side + fz * f, 0.3, 0.4, 7, th, t.c2);
      }
      const cx = p0.x + sx * (tot / 2) * side, cz = p0.z + sz * (tot / 2) * side;
      aoRect(cx, p0.y, cz, tot + 3, len + 2, th, 1.4);
      reserve(cx, cz, len / 2 + tot);
      // flags along the roof edge
      for (let f = -len / 2 + 3; f < len / 2; f += 14) flagSpots.push([p0.x + sx * (tot + 1.2) * side + fx * f, p0.y + roofY + 0.5, p0.z + sz * (tot + 1.2) * side + fz * f, th, R()]);
      return true;
    }
    stand(-30, -(T.halfAt(0) + 18), 140, 7, -1);
    stand(60, -(T.halfAt(0) + 18), 70, 5, -1);
    for (const [s, sdSide, len] of [[600, 1, 60], [1470, -1, 50]]) {
      const i = Math.floor(s / T.ds) % N;
      for (const extra of [14, 20, 28, 40]) { // walk outward until the whole stand clears every part of the track
        const w = sdSide > 0 ? T.leftWall[i] : T.rightWall[i];
        if (stand(s, sdSide * (w + extra), len, 4, sdSide)) break;
      }
    }
    // pit building, garages, tower, paddock
    {
      const hw = T.halfAt(0), face = hw + 19;
      const c = T.at(-10, face + 9), th = T.thetaAt(0);
      placements.push({ kind: 'pitbuilding', x: c.x, z: c.z, w: 20, l: 217, yaw: th, exempt: true });
      props.box(c.x, c.y + 3, c.z, 18, 6, 215, th, 0xf0f0f0);
      props.box(c.x, c.y + 6.3, c.z, 20, 0.6, 217, th, 0x3a4150);
      aoRect(c.x, c.y, c.z, 20, 217, th, 2);
      reserve(c.x, c.z, 120);
      const mid = T.at(-10, face + 12);
      props.box(mid.x, mid.y + 9.5, mid.z, 12, 5, 40, th, 0xdde2ea);
      props.box(mid.x, mid.y + 10, mid.z, 12.2, 1.6, 40.2, th, 0x1d2b3a);
      props.box(mid.x, mid.y + 12.4, mid.z, 13, 0.5, 42, th, 0x4a5568);
      props.box(mid.x, mid.y + 12.8, mid.z, 13.2, 0.3, 4, th, 0xe6261f);
      TEAMS.forEach((t, k) => {
        const s = T.boxU(k), p = T.at(s, face - 0.15);
        props.box(p.x, p.y + 1.9, p.z, 0.4, 3.8, 11.5, th, 0x14161c); // garage door
        props.box(p.x, p.y + 4.2, p.z, 0.5, 0.9, 11.5, th, t.c1);
        props.box(p.x, p.y + 4.9, p.z, 0.55, 0.3, 11.5, th, t.c2);
        const q = T.at(s, hw + 12.5); props.box(q.x, q.y + 0.4, q.z, 1.4, 0.8, 1.4, th, t.c1);
        // rooftop unit + team banner on the roof
        const rp = T.at(s, face + 9); props.box(rp.x, rp.y + 7.2, rp.z, 3, 1.4, 4, th, 0xb9bec8);
        props.box(rp.x, rp.y + 8.1, rp.z, 1.2, 0.4, 1.2, th, t.c2);
        flagSpots.push([T.at(s, face - 1).x, T.at(s, face - 1).y + 6.6, T.at(s, face - 1).z, th, k / 10]);
      });
      // paddock behind: tents & sheds
      for (let k = 0; k < 7; k++) {
        const s = -80 + k * 38, p = T.at(s, face + 32 + (k % 2) * 8), t = TEAMS[k % TEAMS.length];
        if (!tryPlace('tent', p.x, p.z, 10, 15, th)) continue;
        p.y = lastGround.hi; footing(props, p.x, p.z, 10, 15, th, 0xdadde3);
        props.box(p.x, p.y + 1.6, p.z, 9, 3.2, 14, th, 0xf4f4f4);
        props.box(p.x, p.y + 3.5, p.z, 10, 0.8, 15, th, t.c1);
        aoRect(p.x, p.y, p.z, 9, 14, th, 1.3);
      }
      const tw = T.at(150, face + 13);
      placements.push({ kind: 'tower', x: tw.x, z: tw.z, w: 9, l: 9, yaw: th, exempt: true });
      props.box(tw.x, tw.y + 10, tw.z, 5, 20, 5, th, 0xdadee6);
      props.box(tw.x, tw.y + 21, tw.z, 8, 3.2, 8, th, 0x1d2b3a);
      props.box(tw.x, tw.y + 23, tw.z, 9, 0.7, 9, th, 0xe6261f);
      aoRect(tw.x, tw.y, tw.z, 8, 8, th, 1.4);
    }
    // Citadel: gatehouse over the squeeze entry + keep on the inside (keep placed where it clears every leg of the squeeze)
    {
      let g0 = 0, g1 = 0;
      for (let i = 0; i < N; i++) { if (T.sectionName(i) === 'Citadel Squeeze') { g0 = i; break; } }
      for (let i = g0; i < N; i++) if (T.sectionName(i) !== 'Citadel Squeeze') { g1 = i; break; }
      const sg = g0 * T.ds + 18, th = T.thetaAt(sg), hw = T.halfAt(sg) + 1.1;
      let reach = hw + 2.5;
      for (const sd of [1, -1]) {
        // towers flank the road just beyond the wall; walk outward until the whole footprint clears every part of the track
        for (const extra of [3.2, 4.5, 6, 8, 11]) {
          const off = Math.max(sd > 0 ? T.leftWall[Math.floor(sg / T.ds) % N] : T.rightWall[Math.floor(sg / T.ds) % N], hw) + extra;
          const p = T.at(sg, sd * off);
          if (!tryPlace('gatehouse', p.x, p.z, 5, 5, th)) continue;
          reach = Math.max(reach, off); p.y = lastGround.hi; footing(props, p.x, p.z, 5, 5, th, STONE[1]);
          props.box(p.x, p.y + 6, p.z, 5, 12, 5, th, STONE[0]);
          for (let k = -1; k <= 1; k += 2) for (let m = -1; m <= 1; m += 2) props.box(p.x + Math.cos(th) * k * 1.9 + Math.sin(th) * m * 1.9, p.y + 12.6, p.z - Math.sin(th) * k * 1.9 + Math.cos(th) * m * 1.9, 1.1, 1.2, 1.1, th, STONE[2]);
          break;
        }
      }
      const pc = T.at(sg, 0); props.box(pc.x, pc.y + 10.6, pc.z, reach * 2, 2.4, 4.4, th, STONE[1]);
      props.box(pc.x, pc.y + 12.1, pc.z, reach * 2, 0.7, 4.8, th, STONE[3]);
      // keep: best open spot (max clearance) near the middle of the squeeze
      const mid = Math.floor((g0 + g1) / 2);
      let best = null;
      for (let dx = -140; dx <= 140; dx += 8) for (let dz = -140; dz <= 140; dz += 8) {
        const x = T.px[mid] + dx, z = T.pz[mid] + dz, c = T.clearance(x, z);
        const score = c - Math.hypot(dx, dz) * 0.08;
        if (c >= 24 && (!best || score > best.score)) best = { x, z, c, score };
      }
      if (best && tryPlace('keep', best.x, best.z, 30, 30, 0)) {
        const kp = { x: best.x, y: lastGround.hi, z: best.z }, kth = 0;
        footing(props, kp.x, kp.z, 30, 30, 0, STONE[3]);
        props.box(kp.x, kp.y + 8, kp.z, 22, 16, 22, kth, STONE[0]);
        props.box(kp.x, kp.y + 16.4, kp.z, 24, 0.8, 24, kth, STONE[2]);
        aoRect(kp.x, kp.y, kp.z, 24, 24, kth, 3); reserve(kp.x, kp.z, 36);
        for (const [a, b] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
          const cx = kp.x + a * 12, cz = kp.z + b * 12;
          props.box(cx, kp.y + 11, cz, 6, 22, 6, Math.PI / 4, STONE[1]);
          props.box(cx, kp.y + 22.5, cz, 7, 1.2, 7, Math.PI / 4, STONE[3]);
          props.box(cx, kp.y + 24.2, cz, 1.2, 2.2, 1.2, kth, 0xb04030);
          flagSpots.push([cx, kp.y + 25.3, cz, kth, 0.05]);
        }
        for (let m = -9; m <= 9; m += 3) for (const e of [-1, 1]) {
          props.box(kp.x + e * 11.6, kp.y + 17.4, kp.z + m, 1.4, 1.4, 1.4, kth, STONE[3]);
          props.box(kp.x + m, kp.y + 17.4, kp.z + e * 11.6, 1.4, 1.4, 1.4, kth, STONE[3]);
        }
        // low curtain-wall segments ringing the keep (no stray blocks: each is placement-checked and grounded)
        for (let k = 0; k < 12; k++) {
          const a = (k / 12) * Math.PI * 2, x = kp.x + Math.cos(a) * 26, z = kp.z + Math.sin(a) * 26, yaw = -a;
          if (!tryPlace('wallseg', x, z, 3, 9, yaw)) continue;
          const y = lastGround.hi, hgt = 3 + (k % 3) * 1.2, drop = y - lastGround.lo + 0.8;
          props.box(x, y + hgt / 2 - drop / 2, z, 3, hgt + drop, 9, yaw, STONE[k % 4]);
        }
      }
    }
    // marshal posts (hut + orange roof + marshal with yellow flag) on the outside of corners
    {
      for (let k = 0; k < 11; k++) {
        const s = ((k + 0.5) / 11) * L, i = Math.floor(s / T.ds) % N;
        if (T.pitTaper[i] > 0.02 || s < 330 && s > L - 260) continue;
        const sd = T.kappaS[i] > 0 ? -1 : 1, w = (sd > 0 ? T.leftWall[i] : T.rightWall[i]) + 5.2;
        if (sd > 0 && T.pitTaper[i] > 0.02) continue;
        const p = T.at(s, sd * w), th = T.thetaAt(s);
        if (!tryPlace('marshal', p.x, p.z, 7, 4, th)) continue;
        p.y = lastGround.hi; footing(props, p.x, p.z, 7, 4, th, 0xdadde3);
        props.box(p.x, p.y + 1.1, p.z, 2.4, 2.2, 2.2, th, 0xf7f7f7);
        props.box(p.x, p.y + 2.35, p.z, 3.0, 0.4, 2.8, th, 0xff7a1a);
        props.box(p.x - Math.cos(th) * sd * 2.2, p.y + 0.9, p.z + Math.sin(th) * sd * 2.2, 0.5, 1.8, 0.5, th, 0xff7a1a); // marshal body
        props.box(p.x - Math.cos(th) * sd * 2.2, p.y + 2.05, p.z + Math.sin(th) * sd * 2.2, 0.45, 0.45, 0.45, th, 0xf1c9a0);
        props.box(p.x - Math.cos(th) * sd * 2.9, p.y + 1.7, p.z + Math.sin(th) * sd * 2.9, 0.3, 0.3, 1.6, th, 0x555a66);
        props.box(p.x - Math.cos(th) * sd * 2.9, p.y + 2.3, p.z + Math.sin(th) * sd * 2.9, 0.3, 0.9, 0.9, th, 0xffd21f);
        aoRect(p.x, p.y, p.z, 2.4, 2.2, th, 0.8);
        reserve(p.x, p.z, 5);
      }
    }
    // billboards (made-up sponsors): frame + posts here, textured faces added below
    const boards = [];
    {
      let nb = 0;
      for (let k = 0; k < 26 && nb < 16; k++) {
        const s = (k + 0.3) * (L / 26), i = Math.floor(s / T.ds) % N;
        if (T.pitTaper[i] > 0.02 || T.runoff[i] < 6) continue;
        const sd = (k & 1) ? 1 : -1;
        if (sd > 0 && T.pitTaper[i] > 0.02) continue;
        const w = (sd > 0 ? T.leftWall[i] : T.rightWall[i]) + 5.5, p = T.at(s, sd * w), th = T.thetaAt(s);
        if (!free(p.x, p.z, 8)) continue;
        const bw = 15, bh = 4.8, by = 3.6;
        if (!tryPlace('billboard', p.x, p.z, 2, bw + 1, th)) continue;
        p.y = lastGround.hi; footing(props, p.x, p.z, 2, bw + 1, th, 0x555a66);
        props.box(p.x, p.y + by + bh / 2, p.z, 0.5, bh + 0.8, bw + 0.8, th, 0x20232b);
        // posts
        const fwd = [Math.sin(th), Math.cos(th)];
        for (const e of [-1, 1]) props.box(p.x + fwd[0] * e * (bw / 2 - 1.2), p.y + by / 2, p.z + fwd[1] * e * (bw / 2 - 1.2), 0.6, by, 0.6, th, 0x555a66);
        boards.push({ x: p.x, y: p.y + by + bh / 2, z: p.z, ry: th + (sd > 0 ? -Math.PI / 2 : Math.PI / 2), w: bw, h: bh, id: nb });
        aoRect(p.x, p.y, p.z, 0.6, bw, th, 0.8);
        reserve(p.x, p.z, 10);
        nb++;
      }
    }
    addMesh(props, mats.deco, 'props', true, true);
    for (const b of boards) {
      // frame is a box oriented along the track; face plane faces the road
      const tex = keep(brandTexture(b.id));
      const mat = keep(new THREE.MeshLambertMaterial({ map: tex }));
      const geo = keep(new THREE.PlaneGeometry(b.w, b.h));
      for (const flip of [0, 1]) {
        const m = new THREE.Mesh(geo, mat); m.position.set(b.x, b.y, b.z); m.rotation.y = b.ry + (flip ? Math.PI : 0);
        m.translateZ(0.3); m.castShadow = false; m.receiveShadow = true; group.add(m);
      }
    }
    // billboard frame was built as a box along the track; draw faces perpendicular to it (rotated box above) - nothing else needed
    // ---- crowd: two instanced meshes (shirts + heads) ----
    {
      const body = new THREE.InstancedMesh(keep(new THREE.BoxGeometry(0.62, 0.95, 0.5).translate(0, 0.47, 0)), keep(new THREE.MeshLambertMaterial({ flatShading: true })), spectators.length);
      const head = new THREE.InstancedMesh(keep(new THREE.BoxGeometry(0.4, 0.4, 0.4).translate(0, 1.15, 0)), keep(new THREE.MeshLambertMaterial({ flatShading: true })), spectators.length);
      const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), s3 = new THREE.Vector3(1, 1, 1), p3 = new THREE.Vector3(), ax = new THREE.Vector3(0, 1, 0), tc = new THREE.Color();
      spectators.forEach(([x, y, z, yaw, shirt, sk], i) => {
        m4.compose(p3.set(x, y, z), q4.setFromAxisAngle(ax, yaw), s3);
        body.setMatrixAt(i, m4); head.setMatrixAt(i, m4);
        body.setColorAt(i, tc.setHex(shirt)); head.setColorAt(i, tc.setHex(sk));
      });
      for (const m of [body, head]) { m.frustumCulled = false; m.castShadow = true; m.receiveShadow = true; group.add(m); }
    }

    // ---- flags on poles (instanced, gently waving) ----
    {
      // along both sides of the main straight too
      for (let s = -90; s < 150; s += 30) { const p = T.at(s, -(T.halfAt(s) + T.runR[Math.floor(((s % L) + L) % L / T.ds) % N] + 3.6)); if (tryPlace('flag', p.x, p.z, null, 1.2)) flagSpots.push([p.x, gy(p.x, p.z), p.z, T.thetaAt(s), R()]); }
      const poleGeo = keep(new THREE.BoxGeometry(0.4, 9, 0.4).translate(0, 4.5, 0));
      const flagGeo = keep(new THREE.BoxGeometry(2.2, 1.3, 0.25).translate(1.1, 0, 0));
      const poles = new THREE.InstancedMesh(poleGeo, keep(new THREE.MeshLambertMaterial({ color: 0xd8dbe2, flatShading: true })), flagSpots.length);
      flags = new THREE.InstancedMesh(flagGeo, keep(new THREE.MeshLambertMaterial({ flatShading: true, side: THREE.DoubleSide })), flagSpots.length);
      const m4 = new THREE.Matrix4(), tc = new THREE.Color();
      const fc = [0xe6261f, 0xffd21f, 0x2c6fe0, 0xffffff, 0x35c46a, 0xff7a1a];
      flagData = flagSpots.map(([x, y, z, th, r], i) => {
        poles.setMatrixAt(i, m4.makeTranslation(x, y, z));
        flags.setColorAt(i, tc.setHex(fc[Math.floor(r * 997) % fc.length]));
        return { x, y: y + 7.9, z, yaw: th + Math.PI / 2, ph: r * 6.28 };
      });
      poles.frustumCulled = false; flags.frustumCulled = false; poles.castShadow = true; flags.castShadow = true;
      group.add(poles, flags);
    }

    // ---- ferris wheel landmark (infield, faces the main straight) ----
    {
      const hx = 55, hz = 135, Rw = 27, ground = terrainAt(hx, hz, {}), hubY = ground + Rw + 6;
      tryPlace('ferris', hx, hz, null, Rw + 8);
      ferris = new THREE.Group(); ferris.position.set(hx, 0, hz); ferris.rotation.y = 0.55;
      const parts = [], supp = [];
      const A = (x, y, z) => new THREE.Vector3(x, y, z);
      const NR = 24;
      for (const zz of [-1.4, 1.4]) {
        for (let k = 0; k < NR; k++) {
          const a0 = (k / NR) * Math.PI * 2, a1 = ((k + 1) / NR) * Math.PI * 2;
          parts.push(beam(A(Math.cos(a0) * Rw, Math.sin(a0) * Rw, zz), A(Math.cos(a1) * Rw, Math.sin(a1) * Rw, zz), 0.7, k & 1 ? 0xf7f7f7 : 0xe6261f));
          parts.push(beam(A(Math.cos(a0) * Rw * 0.55, Math.sin(a0) * Rw * 0.55, zz), A(Math.cos(a1) * Rw * 0.55, Math.sin(a1) * Rw * 0.55, zz), 0.45, 0xffd21f));
        }
        for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; parts.push(beam(A(0, 0, zz), A(Math.cos(a) * Rw, Math.sin(a) * Rw, zz), 0.4, 0xf7f7f7)); }
      }
      parts.push(beam(A(0, 0, -2.2), A(0, 0, 2.2), 2.2, 0xffd21f));
      const wheelMesh = new THREE.Mesh(keep(mergeGeometries(parts)), keep(new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true })));
      wheelMesh.position.y = hubY; wheelMesh.castShadow = true; wheelMesh.receiveShadow = false; wheelMesh.frustumCulled = false;
      ferris.add(wheelMesh); ferris.userData.wheel = wheelMesh;
      for (const zz of [-3.2, 3.2]) {
        supp.push(beam(A(0, hubY, zz * 0.7), A(-Rw * 0.55, ground - 0.2, zz * 2.2), 0.9, 0x2c6fe0), beam(A(0, hubY, zz * 0.7), A(Rw * 0.55, ground - 0.2, zz * 2.2), 0.9, 0x2c6fe0));
      }
      supp.push(beam(A(-Rw * 0.55, ground + 0.6, -7), A(-Rw * 0.55, ground + 0.6, 7), 1, 0x555a66), beam(A(Rw * 0.55, ground + 0.6, -7), A(Rw * 0.55, ground + 0.6, 7), 1, 0x555a66));
      const suppMesh = new THREE.Mesh(keep(mergeGeometries(supp)), wheelMesh.material); suppMesh.castShadow = true; suppMesh.receiveShadow = true; suppMesh.frustumCulled = false;
      ferris.add(suppMesh);
      const NG = 16;
      const gg = mergeGeometries([bake(BOX, 0, 0, 0, 0xffffff, 0, 2.8, 2.0, 2.4), bake(BOX, 0, 1.25, 0, 0x222831, 0, 3.2, 0.5, 2.8)]);
      gondolas = new THREE.InstancedMesh(keep(gg), keep(new THREE.MeshLambertMaterial({ flatShading: true, vertexColors: true })), NG);
      const gc = [0xe6261f, 0xffd21f, 0x2c6fe0, 0x35c46a, 0xff7a1a, 0xff5fa2], tc = new THREE.Color();
      for (let k = 0; k < NG; k++) gondolas.setColorAt(k, tc.setHex(gc[k % gc.length]));
      gondolas.userData = { hubY, Rw, NG, rot: 0 };
      gondolas.frustumCulled = false; gondolas.castShadow = true;
      ferris.add(gondolas);
      group.add(ferris);
      reserve(hx, hz, Rw + 18);
      // footprint blobs
      aoRect(hx, ground, hz, 3.8, 18, 0.55 + Math.PI / 2, 1.5);
      aoRect(hx, ground, hz, 32, 12, 0.55, 2);
      // a few stalls at the foot of the wheel
      const sp = new Builder();
      for (let k = 0; k < 5; k++) {
        const x = hx + Math.cos(k * 1.3) * 30 + 6, z = hz + 18 + Math.sin(k * 1.3) * 10 + k * 3, y = terrainAt(x, z, {});
        if (!tryPlace('stall', x, z, null, 3.5)) continue;
        sp.box(x, y + 1.3, z, 4, 2.6, 3, k, [0xe6261f, 0xffd21f, 0x2c6fe0, 0x35c46a, 0xff7a1a][k]);
        sp.box(x, y + 2.9, z, 4.8, 0.5, 3.8, k, 0xf7f7f7);
        aoRect(x, y, z, 4, 3, k, 0.8);
      }
      addMesh(sp, mats.deco, 'stalls', true, true);
    }

    // ---- trees: dense instanced clusters in varied greens / yellows / oranges ----
    {
      const palettes = [
        [0x2f9a3a, 0x3fb844, 0x58cf4c, 0x23803a], // greens
        [0x3fb844, 0x7bd94a, 0xc9de3a, 0x2f9a3a], // lime/green
        [0xf2c930, 0xf7dc4a, 0xc9de3a, 0xe8a82a], // yellows
        [0xf0802a, 0xe0562a, 0xf5a23a, 0xf2c930], // oranges
        [0x2f9a3a, 0xf2c930, 0xf0802a, 0x58cf4c], // mixed
      ];
      const spots = [];
      const tryTree = (x, z, kind, pal) => {
        if (x < X0 + 30 || x > X1 - 30 || z < Z0 + 30 || z > Z1 - 30) return false;
        if (!free(x, z, 3)) return false;
        if (beyondWall(x, z) < 7) return false;
        const h = terrainAt(x, z, gi);
        if (h > 26) return false;
        const sc = 0.8 + R() * 1.1;
        if (!tryPlace('tree', x, z, null, 2.6 * sc)) return false;
        spots.push({ x, y: h, z, s: sc, kind, col: pal[Math.floor(R() * pal.length)], yaw: R() * 6.28 });
        return true;
      };
      const cluster = (cx, cz) => {
        const pal = palettes[Math.floor(R() * palettes.length)], rad = 6 + R() * 12, cnt = 14 + Math.floor(R() * 32), pine = R() < 0.5;
        let n = 0;
        for (let k = 0; k < cnt * 2 && n < cnt; k++) {
          const a = R() * 6.28, r = Math.sqrt(R()) * rad;
          if (tryTree(cx + Math.cos(a) * r, cz + Math.sin(a) * r, R() < (pine ? 0.8 : 0.25) ? 0 : 1, pal)) n++;
        }
        return n;
      };
      // clusters hugging the circuit (so every view has trees), then scattered woods further out
      for (let c = 0, got = 0; c < 1500 && got < 130; c++) {
        const i = Math.floor(R() * N), sd = R() < 0.5 ? 1 : -1, w = sd > 0 ? T.leftWall[i] : T.rightWall[i], off = sd * (w + 11 + R() * 55);
        const cx = T.px[i] + T.nx[i] * off, cz = T.pz[i] + T.nz[i] * off;
        if (!free(cx, cz, 4) || beyondWall(cx, cz) < 9) continue;
        if (cluster(cx, cz)) got++;
      }
      for (let c = 0, got = 0; c < 900 && got < 60; c++) {
        const cx = X0 + 50 + R() * (X1 - X0 - 100), cz = Z0 + 50 + R() * (Z1 - Z0 - 100);
        if (!free(cx, cz, 4) || beyondWall(cx, cz) < 9) continue;
        if (cluster(cx, cz)) got++;
      }
      const pineG = mergeGeometries([bake(new THREE.ConeGeometry(2.5, 5, 6), 0, 4.2, 0, 0xffffff), bake(new THREE.ConeGeometry(1.9, 4.2, 6), 0, 7, 0, 0xffffff)]);
      const roundG = mergeGeometries([bake(new THREE.IcosahedronGeometry(2.5, 0), 0, 5.2, 0, 0xffffff, 0, 1, 0.9, 1), bake(new THREE.IcosahedronGeometry(1.7, 0), 1.3, 4.2, 0.7, 0xffffff)]);
      const trunkG = new THREE.CylinderGeometry(0.35, 0.5, 2.8, 5).translate(0, 1.4, 0);
      const aoG = new THREE.CircleGeometry(2.8, 8).rotateX(-Math.PI / 2);
      const types = [{ g: pineG }, { g: roundG }];
      const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), p3 = new THREE.Vector3(), s3 = new THREE.Vector3(), ax = new THREE.Vector3(0, 1, 0), tc = new THREE.Color();
      types.forEach((ty, ti) => {
        const list = spots.filter((o) => o.kind === ti);
        const fol = new THREE.InstancedMesh(keep(ty.g), mats.foliage, list.length || 1);
        const trk = new THREE.InstancedMesh(keep(trunkG), mats.trunk, list.length || 1);
        const aoI = new THREE.InstancedMesh(keep(aoG), mats.ao, list.length || 1);
        list.forEach((o, i) => {
          m4.compose(p3.set(o.x, o.y, o.z), q4.setFromAxisAngle(ax, o.yaw), s3.set(o.s, o.s * (0.9 + (i % 5) * 0.06), o.s));
          fol.setMatrixAt(i, m4); trk.setMatrixAt(i, m4);
          fol.setColorAt(i, tc.setHex(o.col).offsetHSL(0, 0, (R() - 0.5) * 0.06));
          m4.compose(p3.set(o.x + 0.8 * o.s, o.y + 0.18, o.z + 0.6 * o.s), q4.identity(), s3.set(o.s, 1, o.s)); aoI.setMatrixAt(i, m4);
        });
        fol.count = trk.count = aoI.count = list.length;
        for (const m of [fol, trk]) { m.frustumCulled = false; m.castShadow = true; m.receiveShadow = true; group.add(m); }
        aoI.frustumCulled = false; aoI.renderOrder = 1; group.add(aoI);
        ty.meshes = [fol, trk]; ty.n = list.length;
      });
      group.userData.trees = types;
    }
    addMesh(aoB, mats.ao, 'ao', false, false).renderOrder = 1;

    // ---- clouds ----
    {
      const cb = new Builder();
      for (let k = 0; k < 16; k++) {
        const cx = (R() - 0.5) * 1200 + 50, cz = (R() - 0.5) * 1000 + 220, cy = 230 + R() * 90;
        for (let j = 0; j < 4; j++) cb.box(cx + (R() - 0.5) * 50, cy + (R() - 0.5) * 6, cz + (R() - 0.5) * 30, 25 + R() * 30, 7 + R() * 5, 18 + R() * 12, R() * 3, j === 0 ? 0xffffff : 0xf0f4fa);
      }
      clouds = new THREE.Mesh(keep(cb.geometry()), mats.cloud); clouds.frustumCulled = false; group.add(clouds);
    }

    // ---- rain splashes: tiny animated pixel rings on the ground (screen-space streaks live in the post pass) ----
    {
      const COUNT = 320;
      const g = keep(new THREE.RingGeometry(0.45, 1, 4, 1).rotateX(-Math.PI / 2));
      splash = new THREE.InstancedMesh(g, keep(new THREE.MeshBasicMaterial({ color: 0xe6f2ff, transparent: true, opacity: 0.8, depthWrite: false, fog: false })), COUNT);
      splash.frustumCulled = false; splash.visible = false; splash.count = 0; splash.userData.max = COUNT;
      for (let i = 0; i < COUNT; i++) splashData.push({ x: 0, y: -999, z: 0, age: R(), life: 0.35 + R() * 0.3, size: 0.3 + R() * 0.4 });
      group.add(splash);
    }

    scene.add(group);
    setWeather(state);
    setQuality(quality);
  }

  // ---------------- cars: headlights (emissive cones + lamps, no real lights) ----------------
  function setCars(meshes) {
    for (const o of [headCones, carLights, tailLights]) if (o) { group.remove(o); o.geometry.dispose?.(); }
    carMeshes = meshes.filter(Boolean);
    const n = carMeshes.length;
    // cone: ground wedge from the nose, bright at the lamp, fading out
    const pos = [], col = [], seg = 5, Lc = 22, Wc = 4.2;
    for (let k = 0; k < seg; k++) {
      const z0 = (k / seg) * Lc, z1 = ((k + 1) / seg) * Lc, w0 = 0.7 + (z0 / Lc) * Wc, w1 = 0.7 + (z1 / Lc) * Wc, b0 = (1 - k / seg) ** 1.5, b1 = (1 - (k + 1) / seg) ** 1.5;
      const A = [-w0, 0, z0], B = [w0, 0, z0], Cc = [w1, 0, z1], D = [-w1, 0, z1];
      for (const [v, b] of [[A, b0], [B, b0], [Cc, b1], [A, b0], [Cc, b1], [D, b1]]) { pos.push(v[0], v[1], v[2]); col.push(b * 0.32, b * 0.3, b * 0.2); }
    }
    const cg = new THREE.BufferGeometry();
    cg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); cg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    headCones = new THREE.InstancedMesh(cg, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6 }), n);
    headCones.frustumCulled = false; headCones.visible = false; headCones.renderOrder = 2;
    carLights = new THREE.InstancedMesh(BOX, new THREE.MeshBasicMaterial({ color: 0xfff4c0, fog: false }), n * 2);
    tailLights = new THREE.InstancedMesh(BOX, new THREE.MeshBasicMaterial({ color: 0xff2a1a, fog: false }), n * 2);
    for (const m of [carLights, tailLights]) { m.frustumCulled = false; m.visible = false; }
    group.add(headCones, carLights, tailLights);
  }
  const _a = new THREE.Matrix4(), _b = new THREE.Matrix4();
  function updateCarLights(on, amt) {
    headCones.visible = carLights.visible = tailLights.visible = on;
    if (!on) return;
    headCones.material.color.setScalar(0.35 + 0.65 * amt);
    carMeshes.forEach((c, i) => {
      c.pivot.updateWorldMatrix(true, false);
      const pw = c.pivot.matrixWorld;
      headCones.setMatrixAt(i, _a.copy(pw).multiply(_b.makeTranslation(0, 0.1 - c.pivot.position.y, 3.1)));
      for (const [k, x] of [[0, -0.36], [1, 0.36]]) {
        carLights.setMatrixAt(i * 2 + k, _a.copy(pw).multiply(_b.compose(_v.set(x, 0.62, 1.15), _q.identity(), _s.set(0.2, 0.16, 0.12))));
        tailLights.setMatrixAt(i * 2 + k, _a.copy(pw).multiply(_b.compose(_v.set(x * 0.6, 0.55, -2.4), _q.identity(), _s.set(0.18, 0.14, 0.1))));
      }
    });
    for (const m of [headCones, carLights, tailLights]) m.instanceMatrix.needsUpdate = true;
  }

  // ---------------- pit stop: arrow over the box + pixel crew ----------------
  let pitInfo = null, arrow = null, boxRing = null;
  function ensurePit() {
    if (crewRig) return;
    const A = (x, y, z) => new THREE.Vector3(x, y, z);
    // arrow (points down) + pad ring
    const ag = mergeGeometries([bake(new THREE.ConeGeometry(2.2, 3.4, 4).rotateX(Math.PI), 0, 1.7, 0, 0xffe14a), bake(BOX, 0, 5.0, 0, 0xffe14a, 0, 1.5, 3.2, 1.5)]);
    arrow = new THREE.Mesh(keep(ag), keep(new THREE.MeshBasicMaterial({ vertexColors: true, fog: false })));
    arrow.visible = false; arrow.frustumCulled = false; arrow.renderOrder = 5; group.add(arrow);
    const rg = mergeGeometries([bake(BOX, 0, 0, 5.3, 0xffe14a, 0, 11, 0.06, 0.6), bake(BOX, 0, 0, -5.3, 0xffe14a, 0, 11, 0.06, 0.6), bake(BOX, 5.3, 0, 0, 0xffe14a, 0, 0.6, 0.06, 11), bake(BOX, -5.3, 0, 0, 0xffe14a, 0, 0.6, 0.06, 11)]);
    boxRing = new THREE.Mesh(keep(rg), keep(new THREE.MeshBasicMaterial({ vertexColors: true, fog: false })));
    boxRing.visible = false; boxRing.frustumCulled = false; group.add(boxRing);
    // crew: 4 tyre changers, 2 jack men, 1 lollipop; each a merged vertex-coloured mesh
    const personGeo = (c1, c2) => mergeGeometries([
      bake(BOX, 0, 0.45, 0, 0x22252d, 0, 0.55, 0.9, 0.35), bake(BOX, 0, 1.15, 0, c1, 0, 0.7, 0.8, 0.4),
      bake(BOX, 0.45, 1.2, 0, c2, 0, 0.2, 0.7, 0.25), bake(BOX, -0.45, 1.2, 0, c2, 0, 0.2, 0.7, 0.25),
      bake(BOX, 0, 1.85, 0, 0xf4f4f4, 0, 0.5, 0.45, 0.5),
    ]);
    const crewMat = keep(new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
    const team = TEAMS[0];
    crewRig = { group: new THREE.Group(), people: [], tires: [], jacks: [], sign: null, teamMat: crewMat, ready: false };
    for (let i = 0; i < 7; i++) {
      const m = new THREE.Mesh(keep(personGeo(team.c1, team.c2)), crewMat); m.castShadow = true; m.frustumCulled = false;
      crewRig.group.add(m); crewRig.people.push(m);
    }
    for (let i = 0; i < 4; i++) {
      const t = new THREE.Mesh(keep(mergeGeometries([bake(new THREE.CylinderGeometry(0.45, 0.45, 0.5, 8).rotateZ(Math.PI / 2), 0, 0, 0, 0x1a1a1e), bake(new THREE.CylinderGeometry(0.47, 0.47, 0.12, 8).rotateZ(Math.PI / 2), 0, 0, 0, 0xffffff)])), keep(new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true })));
      t.castShadow = true; t.visible = false; t.frustumCulled = false; crewRig.group.add(t); crewRig.tires.push(t);
    }
    for (let i = 0; i < 2; i++) {
      const j = new THREE.Mesh(keep(mergeGeometries([bake(BOX, 0, 0.25, 0, 0xffd21f, 0, 0.8, 0.5, 0.8), bake(BOX, 0, 0.9, 0, 0x555a66, 0, 0.25, 1.0, 0.25)])), keep(new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true })));
      j.castShadow = true; j.frustumCulled = false; crewRig.group.add(j); crewRig.jacks.push(j);
    }
    const sign = new THREE.Mesh(keep(mergeGeometries([bake(BOX, 0, 1.4, 0, 0x555a66, 0, 0.3, 2.8, 0.3), bake(BOX, 0, 2.9, 0, 0xffffff, 0, 1.3, 1.3, 0.1)])), keep(new THREE.MeshBasicMaterial({ vertexColors: true })));
    sign.frustumCulled = false; crewRig.group.add(sign); crewRig.sign = sign;
    const signLamp = new THREE.Mesh(keep(new THREE.BoxGeometry(1.0, 1.0, 0.14)), keep(new THREE.MeshBasicMaterial({ color: 0xe6261f })));
    signLamp.position.set(0, 2.9, 0.07); sign.add(signLamp); crewRig.signLamp = signLamp;
    crewRig.group.visible = false; group.add(crewRig.group);
  }
  /** info: { stage, request, serv, choice, teamIndex, car (makeCar result), tire } or null */
  function setPit(info) { pitInfo = info; }
  const _w = new THREE.Vector3();
  const sstep = (a, b, x) => smoothstep(a, b, x);
  function updatePit(dt, time) {
    ensurePit();
    const I = pitInfo, L = track.length;
    let showArrow = false, showCrew = false, lift = 0;
    if (I && I.teamIndex != null) {
      const sBox = track.boxU(I.teamIndex), sw = ((sBox % L) + L) % L, idx = Math.floor(sw / track.ds) % track.n, dBox = track.boxD(idx);
      const pb = track.at(sw - 0.6, dBox), th = track.thetaAt(sw - 0.6);
      showArrow = (I.request && I.stage === 0) || I.stage === 1 || (I.stage === 2 && !I.choice);
      const near = I.car ? Math.hypot(I.car.group.position.x - pb.x, I.car.group.position.z - pb.z) : 99;
      showCrew = (I.stage === 1 && near < 70) || I.stage === 2 || (I.stage === 3 && near < 16);
      boxRing.visible = showArrow || showCrew;
      if (showArrow) {
        arrow.position.set(pb.x, pb.y + 3.5 + Math.sin(time * 5) * 0.9, pb.z); arrow.rotation.y = time * 1.8; arrow.visible = true;
        const s = 1 + 0.12 * Math.sin(time * 5); arrow.scale.setScalar(s);
      } else arrow.visible = false;
      if (boxRing.visible) { boxRing.position.set(pb.x, pb.y + 0.12, pb.z); boxRing.rotation.y = th; boxRing.scale.setScalar(1 + 0.04 * Math.sin(time * 6)); }
      // crew pose frame: the real car if it is stopped in the box, else the box point
      let ox = pb.x, oy = pb.y, oz = pb.z, oth = th;
      if (I.car && I.stage === 2) { ox = I.car.group.position.x; oy = I.car.group.position.y; oz = I.car.group.position.z; oth = I.car.group.rotation.y; }
      const cs = Math.cos(oth), sn = Math.sin(oth);
      const W = (lx, lz, out) => out.set(ox + cs * lx + sn * lz, oy, oz - sn * lx + cs * lz);
      crewRig.group.visible = showCrew;
      if (showCrew) {
        const t = I.choice ? I.serv || 0 : 0;
        const engage = sstep(0, 0.35, t) * (1 - sstep(2.05, 2.4, t));
        lift = 0.42 * sstep(0.25, 0.6, t) * (1 - sstep(1.95, 2.35, t));
        const waiting = I.stage !== 2;
        // team colours
        const tm = TEAMS[I.teamIndex % TEAMS.length];
        if (crewRig.teamKey !== I.teamIndex) {
          crewRig.teamKey = I.teamIndex;
          crewRig.people.forEach((p) => { p.geometry.dispose(); p.geometry = mergeGeometries([bake(BOX, 0, 0.45, 0, 0x22252d, 0, 0.55, 0.9, 0.35), bake(BOX, 0, 1.15, 0, tm.c1, 0, 0.7, 0.8, 0.4), bake(BOX, 0.45, 1.2, 0, tm.c2, 0, 0.2, 0.7, 0.25), bake(BOX, -0.45, 1.2, 0, tm.c2, 0, 0.2, 0.7, 0.25), bake(BOX, 0, 1.85, 0, 0xf4f4f4, 0, 0.5, 0.45, 0.5)]); });
        }
        const wheelX = [1.05, -1.05, 1.15, -1.15], wheelZ = [1.9, 1.9, -1.65, -1.65];
        for (let k = 0; k < 4; k++) {
          const sd = Math.sign(wheelX[k]), stand = [sd * 4.3, wheelZ[k]], work = [sd * 2.1, wheelZ[k]];
          const x = lerp(stand[0], work[0], engage), z = lerp(stand[1], work[1], engage);
          const p = crewRig.people[k]; W(x, z, _w); p.position.copy(_w);
          p.rotation.y = oth + (sd > 0 ? -Math.PI / 2 : Math.PI / 2);
          p.scale.y = 1 - 0.28 * engage + (engage > 0.9 ? Math.sin(t * 28 + k) * 0.03 : 0);
          // carried tyre: old one away (0.6-1.15), new one back (1.15-1.75)
          const tr = crewRig.tires[k];
          const out = t < 1.15 ? sstep(0.6, 1.0, t) : 1 - sstep(1.2, 1.7, t);
          tr.visible = !waiting && t > 0.6 && t < 1.75;
          W(sd * (1.1 + out * 1.7), wheelZ[k], _w); tr.position.copy(_w).setY(oy + 0.4 + out * 0.35);
          tr.rotation.y = oth;
          const c = tr.geometry.attributes.color; // tyre band colour: grey for old, compound colour for new
          const bandNew = I.choice === 'wet' ? [0.3, 0.65, 1] : [1, 0.85, 0.2], bandOld = [0.6, 0.6, 0.6], bc = t < 1.15 ? bandOld : bandNew;
          for (let v = c.count >> 1; v < c.count; v++) c.setXYZ(v, bc[0], bc[1], bc[2]);
          c.needsUpdate = true;
        }
        // car wheels vanish while the crew carries tyres
        if (I.car) I.car.wheels.forEach((w) => { w.visible = !(I.stage === 2 && t > 0.65 && t < 1.7); });
        // jack men
        const jz = [4.7, -4.2];
        for (let k = 0; k < 2; k++) {
          const p = crewRig.people[4 + k]; W(0, lerp(jz[k] * 1.5, jz[k], engage) * (k ? 1 : 1), _w); p.position.copy(_w);
          p.rotation.y = oth + (k ? 0 : Math.PI); p.scale.y = 1 - 0.18 * engage;
          const j = crewRig.jacks[k]; W(0, k ? -2.3 : 3.0, _w); j.position.copy(_w); j.rotation.y = oth; j.scale.y = 0.2 + lift * 2.2;
          j.visible = lift > 0.01;
        }
        // lollipop man at the front; red -> green when released
        const lm = crewRig.people[6]; W(-1.4, 7.4, _w); lm.position.copy(_w); lm.rotation.y = oth + Math.PI; lm.scale.y = 1;
        crewRig.sign.position.copy(_w).add(new THREE.Vector3(0, 0.2, 0)); crewRig.sign.rotation.y = oth;
        crewRig.signLamp.material.color.setHex(t > 2.1 ? 0x35ff60 : 0xe6261f);
        crewRig.sign.position.add(new THREE.Vector3(Math.cos(oth) * 0.9, 0, -Math.sin(oth) * 0.9));
        fx.signT = t;
      } else if (I.car) I.car.wheels.forEach((w) => { w.visible = true; });
    } else { arrow.visible = false; boxRing.visible = false; crewRig.group.visible = false; }
    fx.lift = lift;
  }

  const cTop = [new THREE.Color(0x2f78d0), new THREE.Color(0x5f7a96)];
  const cBot = [new THREE.Color(0xc4e4ff), new THREE.Color(0xa9bacb)];
  const tmpCol = new THREE.Color();
  function setWeather(w) {
    state.rain = clamp(w.rain ?? state.rain, 0, 1); state.wet = clamp(w.wetness ?? state.wet, 0, 1);
    if (!scene) return;
    const r = state.rain, wt = state.wet;
    sky.material.uniforms.top.value.copy(cTop[0]).lerp(cTop[1], r);
    sky.material.uniforms.bot.value.copy(cBot[0]).lerp(cBot[1], r);
    sky.material.uniforms.sunAmt.value = 1 - r;
    scene.fog.color.copy(sky.material.uniforms.bot.value); scene.background.copy(scene.fog.color);
    view.fogNear = lerp(120, 90, r); view.fogFar = lerp(780, 600, r);
    sun.intensity = lerp(2.9, 1.5, r); hemi.intensity = lerp(0.95, 0.8, r);
    sun.color.setHex(0xfff1d6).lerp(tmpCol.setHex(0xa9bdd8), r);
    hemi.color.setHex(0xcfe6ff).lerp(tmpCol.setHex(0x93a6c0), r);
    hemi.groundColor.setHex(0x5b8a45).lerp(tmpCol.setHex(0x3f5a4a), r);
    mats.asphalt.color.setRGB(1, 1, 1).lerp(tmpCol.setRGB(0.75, 0.79, 0.86), wt);
    mats.asphalt.specular.setRGB(0.55, 0.58, 0.65).multiplyScalar(wt);
    mats.pit.color.copy(mats.asphalt.color); mats.pit.specular.copy(mats.asphalt.specular);
    mats.terrain.color.setRGB(1, 1, 1).lerp(tmpCol.setRGB(0.85, 0.9, 0.92), r);
    mats.cloud.color.setRGB(1, 1, 1).lerp(tmpCol.setRGB(0.75, 0.78, 0.82), r);
    mats.gravel.color.setRGB(1, 1, 1).lerp(tmpCol.setRGB(0.7, 0.7, 0.72), wt);
    mats.ao.opacity = 0.34 + 0.03 * r;
    fx.rain = r; fx.sat = 1 - 0.3 * r; fx.tint = [1 - 0.2 * r, 1 - 0.13 * r, 1 - 0.03 * r];
    if (splash) splash.visible = r > 0.03;
  }

  /** 0 = lowest (no shadows, fewer props) .. 2 = full */
  function setQuality(level) {
    quality = clamp(Math.round(level), 0, 2);
    if (!scene) return;
    const size = quality >= 2 ? 2048 : 1024;
    sun.castShadow = quality >= 1;
    if (size !== shadowSize) { shadowSize = size; sun.shadow.mapSize.set(size, size); sun.shadow.map?.dispose(); sun.shadow.map = null; }
    const trees = group.userData.trees || [];
    for (const t of trees) for (const m of t.meshes) m.count = Math.floor(t.n * (quality >= 2 ? 1 : quality === 1 ? 0.7 : 0.4));
    if (splash) splash.userData.cap = quality >= 2 ? splash.userData.max : quality === 1 ? 160 : 70;
  }

  let time = 0;
  const _sunT = new THREE.Vector3(), _r = new THREE.Vector3(), _u = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0);
  const _gm = new THREE.Matrix4(), _gs = new THREE.Vector3(1, 1, 1);
  function update(dt, camera, v = null) {
    if (!scene) return;
    time += dt; fx.time = time;
    const fxp = v || { x: camera.position.x, y: 0, z: camera.position.z, half: 90, dist: 40 };
    sky.position.copy(camera.position);
    clouds.rotation.y += dt * 0.004; clouds.visible = camera.position.y < 140;
    scene.fog.near = view.fogNear + fxp.dist * 0.9; scene.fog.far = view.fogFar + fxp.dist * 1.6;
    // sun follows the focus point; snap to shadow-texel grid in light space so shadows don't shimmer
    {
      const half = fxp.half, texel = (half * 2) / shadowSize, d = sun.userData.dir;
      _r.crossVectors(_up, d).normalize(); _u.crossVectors(d, _r);
      const a = Math.round((fxp.x * _r.x + fxp.y * _r.y + fxp.z * _r.z) / texel) * texel, b = Math.round((fxp.x * _u.x + fxp.y * _u.y + fxp.z * _u.z) / texel) * texel;
      const c = fxp.x * d.x + fxp.y * d.y + fxp.z * d.z;
      _sunT.set(0, 0, 0).addScaledVector(_r, a).addScaledVector(_u, b).addScaledVector(d, c);
      sun.target.position.copy(_sunT); sun.position.copy(_sunT).addScaledVector(d, 300);
      const sc = sun.shadow.camera;
      if (sc.right !== half) { sc.left = -half; sc.right = half; sc.top = half; sc.bottom = -half; sc.updateProjectionMatrix(); }
      sun.target.updateMatrixWorld();
    }
    // flags
    for (let i = 0; i < flagData.length; i++) {
      const f = flagData[i];
      _gm.compose(_v.set(f.x, f.y, f.z), _q.setFromEuler(_e.set(Math.sin(time * 2.6 + f.ph) * 0.12, f.yaw + Math.sin(time * 2.1 + f.ph) * 0.35, 0)), _gs);
      flags.setMatrixAt(i, _gm);
    }
    flags.instanceMatrix.needsUpdate = true;
    // ferris wheel
    if (ferris) {
      const g = gondolas.userData; g.rot -= dt * 0.045;
      ferris.userData.wheel.rotation.z = g.rot;
      for (let k = 0; k < g.NG; k++) {
        const a = g.rot + (k / g.NG) * Math.PI * 2;
        gondolas.setMatrixAt(k, _gm.makeTranslation(Math.cos(a) * g.Rw, g.hubY + Math.sin(a) * g.Rw - 2.0, 0));
      }
      gondolas.instanceMatrix.needsUpdate = true;
    }
    // rain splashes
    if (splash.visible) {
      const cap = Math.min(splash.userData.cap ?? splash.userData.max, Math.floor(splash.userData.max * smoothstep(0.03, 0.8, state.rain)));
      splash.count = cap;
      const rad = clamp(fxp.dist * 0.55, 22, 90);
      for (let i = 0; i < cap; i++) {
        const s = splashData[i]; s.age += dt / s.life;
        if (s.age >= 1) {
          s.age -= 1;
          const a = Math.random() * 6.283, r = Math.sqrt(Math.random()) * rad;
          s.x = fxp.x + Math.cos(a) * r; s.z = fxp.z + Math.sin(a) * r * 0.8;
          s.y = terrainAt(s.x, s.z, gi) + 0.14;
        }
        const f = Math.min(3, Math.floor(s.age * 4)), sc = [0.35, 0.65, 0.95, 1.2][f] * s.size;
        _gm.compose(_v.set(s.x, s.y, s.z), _q.identity(), _s.set(sc, 1, sc));
        splash.setMatrixAt(i, _gm);
      }
      splash.instanceMatrix.needsUpdate = true;
    }
    // headlights on in rain
    if (headCones) updateCarLights(state.rain > 0.05 && carMeshes.length > 0, smoothstep(0.05, 0.4, state.rain));
    updatePit(dt, time);
  }

  function setStartLights(count, green = false) {
    lightMats.forEach((m, i) => m.color.setHex(green ? 0x35ff60 : i < count ? 0xff2a1a : 0x3a0c0a));
  }

  function dispose() {
    if (scene) { scene.remove(group); scene.fog = prevFog; scene.background = prevBg; }
    for (const o of disposables) o.dispose?.();
    sun?.shadow.map?.dispose();
    group.clear();
    lightMats.length = 0; disposables.length = 0; placements.length = 0; scene = null; crewRig = null; flagData = []; splashData = []; reserved.length = 0;
  }

  return { name: 'circuitDay', group, placements, groundAt: gy, build, dispose, setWeather, update, setStartLights, setCars, setPit, setQuality, fx, get quality() { return quality; } };
}
