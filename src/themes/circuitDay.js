// Theme "Circuit Day": all environment art (terrain, track surfaces, props, sky, lights, rain).
// Theme interface: { name, build(scene, track), dispose(), setWeather({rain, wetness}), update(dt, camera, time),
//                    setStartLights(count, green) }
// Nothing here touches path/physics/cars, so another theme can be swapped in at runtime.
import * as THREE from 'three';
import { smoothstep, lerp, wrapDelta, clamp } from '../physics.js';
import { PIT } from '../track.js';
import { TEAMS } from '../teams.js';

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

export function createCircuitDay() {
  const group = new THREE.Group();
  const disposables = [];
  let scene = null, track = null, sky = null, rainLines = null, clouds = null, sun = null, hemi = null, fogRef = null;
  const lightMats = [];
  let prevFog = null, prevBg = null;
  const state = { rain: 0, wet: 0 };
  const mats = {};

  const lit = (extra = {}) => new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true, side: THREE.DoubleSide, ...extra });
  const keep = (o) => { disposables.push(o); return o; };
  const addMesh = (b, mat, name) => {
    const m = new THREE.Mesh(keep(b.geometry()), mat); m.name = name; m.matrixAutoUpdate = false; m.updateMatrix(); group.add(m); return m;
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

  // ---------------- build ----------------
  function build(sc, tr) {
    scene = sc; track = tr;
    const T = tr, N = T.n, L = T.length, R = rng(7);
    prevFog = scene.fog; prevBg = scene.background;
    scene.background = new THREE.Color(0xc4e4ff);
    scene.fog = new THREE.Fog(0xc4e4ff, 120, 780); fogRef = scene.fog;

    // lights
    hemi = new THREE.HemisphereLight(0xd8ecff, 0x5b7a45, 1.35);
    sun = new THREE.DirectionalLight(0xfff0d0, 2.3);
    sun.position.set(-0.5, 0.8, 0.35).multiplyScalar(300);
    group.add(hemi, sun);

    // materials
    mats.asphalt = keep(new THREE.MeshPhongMaterial({ vertexColors: true, flatShading: true, side: THREE.DoubleSide, specular: 0x000000, shininess: 55 }));
    mats.terrain = keep(lit());
    mats.deco = keep(lit());
    mats.decal = keep(lit({ polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
    mats.gravel = keep(lit());
    mats.cloud = keep(new THREE.MeshBasicMaterial({ vertexColors: true, fog: false }));
    mats.tire = keep(new THREE.MeshLambertMaterial({ flatShading: true }));

    // ---- sky dome ----
    const skyMat = keep(new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: new THREE.Color(0x2f78d0) }, bot: { value: new THREE.Color(0xc4e4ff) }, sunDir: { value: new THREE.Vector3(-0.5, 0.8, 0.35).normalize() }, sunAmt: { value: 1 } },
      vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 bot; uniform vec3 sunDir; uniform float sunAmt; varying vec3 vD; void main(){ float h = clamp(vD.y*1.6+0.05,0.0,1.0); vec3 c = mix(bot, top, pow(h,0.7)); float s = max(dot(normalize(vD), sunDir),0.0); c += vec3(1.0,0.9,0.6)*(pow(s,600.0)*2.0 + pow(s,12.0)*0.25)*sunAmt; gl_FragColor = vec4(c,1.0); }',
    }));
    sky = new THREE.Mesh(keep(new THREE.SphereGeometry(1000, 16, 10)), skyMat);
    sky.renderOrder = -10; sky.frustumCulled = false; group.add(sky);

    // ---- terrain ----
    {
      const X0 = -500, X1 = 580, Z0 = -280, Z1 = 700, CELL = 8;
      const nxv = Math.round((X1 - X0) / CELL) + 1, nzv = Math.round((Z1 - Z0) / CELL) + 1;
      const pos = new Float32Array(nxv * nzv * 3), col = new Float32Array(nxv * nzv * 3);
      const info = {}; const g1 = C(0x5aa245), g2 = C(0x4e9438), gfar = C(0x3f7b30), rock = C(0x8f8b76), tmpc = new THREE.Color();
      for (let iz = 0; iz < nzv; iz++) for (let ix = 0; ix < nxv; ix++) {
        const x = X0 + ix * CELL, z = Z0 + iz * CELL, k = iz * nxv + ix;
        nearest(x, z, info);
        const e = info.dist - T.half[info.i];
        const far = 24 * smoothstep(110, 340, e);
        const noise = (Math.sin(x * 0.011 + 1.3) * Math.cos(z * 0.013 + 0.4) * 0.5 + Math.sin(x * 0.027 + z * 0.019) * 0.28 + Math.sin(z * 0.045 - x * 0.03) * 0.12 + 0.3) * far
          + Math.sin(x * 0.09) * Math.cos(z * 0.08) * 1.2 * smoothstep(40, 100, e);
        const h = lerp(info.y - 0.15, noise, smoothstep(24, 100, e));
        pos[k * 3] = x; pos[k * 3 + 1] = h; pos[k * 3 + 2] = z;
        const stripe = Math.floor(info.s / 18) & 1;
        tmpc.copy(stripe ? g1 : g2).lerp(gfar, smoothstep(40, 200, e));
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
      const m = new THREE.Mesh(g, mats.terrain); m.name = 'terrain'; m.frustumCulled = false; group.add(m);
      // trees
      const treeSpots = [];
      for (let tries = 0; tries < 2500 && treeSpots.length < 260; tries++) {
        const x = X0 + 40 + R() * (X1 - X0 - 80), z = Z0 + 40 + R() * (Z1 - Z0 - 80);
        nearest(x, z, info);
        const e = info.dist - T.half[info.i];
        if (e < 32) continue;
        const h = lerp(info.y - 0.15, 0, smoothstep(24, 100, e));
        if (h > 24) continue;
        treeSpots.push([x, h, z, 0.8 + R() * 0.9]);
      }
      const cone = keep(new THREE.ConeGeometry(2.4, 7, 6).translate(0, 5.5, 0)), trunk = keep(new THREE.CylinderGeometry(0.4, 0.5, 2.4, 5).translate(0, 1.2, 0));
      const foliage = new THREE.InstancedMesh(cone, keep(new THREE.MeshLambertMaterial({ flatShading: true })), treeSpots.length);
      const trunks = new THREE.InstancedMesh(trunk, keep(new THREE.MeshLambertMaterial({ color: 0x5a3b22, flatShading: true })), treeSpots.length);
      const mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), sc3 = new THREE.Vector3(), p3 = new THREE.Vector3();
      treeSpots.forEach(([x, h, z, s], i) => {
        p3.set(x, h, z); sc3.set(s, s * (0.9 + R() * 0.4), s); mtx.compose(p3, q, sc3);
        foliage.setMatrixAt(i, mtx); trunks.setMatrixAt(i, mtx);
        foliage.setColorAt(i, tmpc.setHex(0x2d6a34).offsetHSL((R() - 0.5) * 0.05, 0, (R() - 0.5) * 0.08));
      });
      foliage.frustumCulled = false; trunks.frustumCulled = false; group.add(foliage, trunks);
    }

    // ---- track surfaces ----
    const asph = new Builder(), pitB = new Builder(), mark = new Builder(), kerbB = new Builder(), gravelB = new Builder();
    const A1 = C(0x3b3e45), A2 = C(0x41444c), PITC = C(0x2f3238);
    strip(asph, T, (i) => [-T.half[i], T.half[i], 0, ((i >> 3) & 1) ? A1 : A2]);
    strip(pitB, T, (i) => T.pitTaper[i] > 0.02 ? [T.half[i], T.half[i] + 16 * T.pitTaper[i], 0.005, PITC] : null);
    const WHITE = C(0xf2f2f2), YEL = C(0xf5c518), RED = C(0xd9302c);
    for (const sd of [1, -1]) {
      strip(mark, T, (i) => (sd > 0 && T.pitTaper[i] > 0.5) ? null : (sd > 0 ? [T.half[i] - 0.55, T.half[i] - 0.2, 0.03, WHITE] : [-T.half[i] + 0.2, -T.half[i] + 0.55, 0.03, WHITE]));
    }
    strip(mark, T, (i) => T.pitTaper[i] > 0.5 ? [T.half[i] + 0.1, T.half[i] + 0.45, 0.03, WHITE] : null);
    strip(mark, T, (i) => T.pitTaper[i] > 0.5 ? [T.half[i] + 0.1 + 4.5 + 3.4, T.half[i] + 0.1 + 4.5 + 3.8, 0.03, YEL] : null);
    // kerbs (outside edge, red/white) + gravel run-off
    for (const sd of [1, -1]) {
      strip(kerbB, T, (i) => {
        if (!T.kerb[i] || (sd > 0 && T.pitTaper[i] > 0.02)) return null;
        const col = (i >> 0) & 1 ? RED : WHITE, h = T.half[i];
        return sd > 0 ? [h, h + 1.4, 0.025, col] : [-h - 1.4, -h, 0.025, col];
      });
      strip(gravelB, T, (i) => {
        if (!T.gravel[i] || (sd > 0 && T.pitTaper[i] > 0.02)) return null;
        const h = T.half[i] + 1.4, w = T.half[i] + T.runoff[i];
        const col = ((i >> 2) & 1) ? C(0xcdb98a) : C(0xc2ae7f);
        return sd > 0 ? [h, w, -0.03, col] : [-w, -h, -0.03, col];
      });
    }
    // start line + grid + pit bays
    for (let k = 0; k < 2; k++) for (let c = -9; c < 9; c++) {
      const s0 = -0.6 + k * 0.6, col = (c + k) & 1 ? 0x111111 : 0xf8f8f8;
      mark.quad(at(s0, c, 0.035), at(s0 + 0.6, c, 0.035), at(s0 + 0.6, c + 1, 0.035), at(s0, c + 1, 0.035), col);
    }
    for (let slot = 0; slot < 10; slot++) {
      const row = Math.floor(slot / 2), col = slot % 2, s = L - 10 - row * 9 - col * 4.5, d = col ? -3.2 : 3.2;
      const sf = s + 3.0;
      mark.quad(at(sf, d - 1.3, 0.035), at(sf + 0.25, d - 1.3, 0.035), at(sf + 0.25, d + 1.3, 0.035), at(sf, d + 1.3, 0.035), WHITE);
      for (const sx of [-1.3, 1.3]) mark.quad(at(sf - 1.5, d + sx - 0.1, 0.035), at(sf, d + sx - 0.1, 0.035), at(sf, d + sx + 0.1, 0.035), at(sf - 1.5, d + sx + 0.1, 0.035), WHITE);
    }
    for (let t = 0; t < 10; t++) {
      const s = ((T.boxU(t) % L) + L) % L, hw = T.halfAt(s);
      for (const o of [-6.5, 6.5]) mark.quad(at(s + o - 0.12, hw + 8, 0.035), at(s + o + 0.12, hw + 8, 0.035), at(s + o + 0.12, hw + 16, 0.035), at(s + o - 0.12, hw + 16, 0.035), WHITE);
    }
    addMesh(asph, mats.asphalt, 'asphalt');
    addMesh(pitB, mats.asphalt, 'pitlane');
    addMesh(mark, mats.decal, 'markings');
    addMesh(kerbB, mats.decal, 'kerbs');
    addMesh(gravelB, mats.gravel, 'gravel');

    // ---- barriers, stone walls ----
    const walls = new Builder();
    const CONC = [C(0xe4e4e0), C(0xcfcfcb)], STONE = [C(0x8a867d), C(0x77736b), C(0x938e84), C(0x6c6860)], CAP = C(0xa29d92);
    for (const sd of [1, -1]) {
      wall(walls, T, (i) => {
        if (sd > 0 && T.pitTaper[i] > 0.02 && T.pitTaper[i] < 0.98) return null;
        if (sd > 0 && T.pitTaper[i] >= 0.98) return null;
        const w = sd > 0 ? T.leftWall[i] : T.rightWall[i], stone = T.runoff[i] < 6;
        const hgt = stone ? lerp(1.1, 3.2, smoothstep(6, 2, T.runoff[i])) : 1.1;
        const col = stone ? STONE[((i >> 1) + (Math.floor(hgt) & 1) * 2 + ((i * 7) % 3)) % 4] : CONC[(i >> 2) & 1];
        return { d: sd * w, y0: 0, y1: hgt, col, cap: stone ? sd * 1.0 : sd * 0.4, capCol: stone ? CAP : C(0x9a9a98) };
      });
    }
    // pit-side fence behind building handled by the building itself
    addMesh(walls, mats.deco, 'walls');

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
      const pal = [0xf0f0f0, 0xd9302c, 0x2a2a30, 0x2a2a30];
      spots.forEach(([x, y, z, id], n) => {
        for (let r = 0; r < 3; r++) {
          m4.makeTranslation(x, y + 0.25 + r * 0.5, z);
          inst.setMatrixAt(n * 3 + r, m4);
          inst.setColorAt(n * 3 + r, c3.setHex(pal[(id + r) % 4]));
        }
      });
      inst.frustumCulled = false; group.add(inst);
    }

    // ---- static props ----
    const props = new Builder();
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
    // grandstands
    const crowd = [0xe84a4a, 0x3b7fd6, 0xf2d04a, 0xf2f2f2, 0x4ac27a, 0x9b59d6, 0xff9a3c, 0x2d2f3a];
    function stand(s, d, len, rows, side) {
      const rowH = 1.15, rowD = 2.0;
      const p0 = T.at(s, d), th = T.thetaAt(s);
      const sx = Math.cos(th), sz = -Math.sin(th), fx = Math.sin(th), fz = Math.cos(th);
      const W = (a, y, f) => [p0.x + sx * a * -side + fx * f, p0.y + y, p0.z + sz * a * -side + fz * f];
      for (let r = 0; r < rows; r++) {
        const a = r * rowD;
        // step block
        props.box(p0.x + sx * (a + rowD / 2) * -side, p0.y + (r + 1) * rowH / 2, p0.z + sz * (a + rowD / 2) * -side, rowD, (r + 1) * rowH, len, th, 0x9a9ca3, (1 << 4) | (1 << 5));
        for (let f = 0; f < len; f += 1.4) {
          const col = R() < 0.12 ? 0x555860 : crowd[Math.floor(R() * crowd.length)];
          const f0 = f - len / 2;
          props.quad(W(a + 0.2, (r + 1) * rowH + 0.05, f0), W(a + rowD - 0.2, (r + 1) * rowH + 0.05, f0), W(a + rowD - 0.2, (r + 1) * rowH + 0.05, f0 + 1.1), W(a + 0.2, (r + 1) * rowH + 0.05, f0 + 1.1), col);
        }
        // seat heads facing front row
        for (let f = 0; f < len; f += 1.4) {
          const col = crowd[Math.floor(R() * crowd.length)], f0 = f - len / 2;
          props.quad(W(a + 0.1, (r + 1) * rowH + 0.1, f0 + 0.1), W(a + 0.1, (r + 1) * rowH + 0.9, f0 + 0.1), W(a + 0.1, (r + 1) * rowH + 0.9, f0 + 0.9), W(a + 0.1, (r + 1) * rowH + 0.1, f0 + 0.9), col);
        }
      }
      // roof on posts
      const tot = rows * rowD, roofY = rows * rowH + 3.2;
      props.box(p0.x + sx * (tot / 2 + 1.2) * -side, p0.y + roofY, p0.z + sz * (tot / 2 + 1.2) * -side, tot + 2.6, 0.5, len + 2, th, 0xd8d8dc);
      props.box(p0.x + sx * (tot / 2 + 1.2) * -side, p0.y + roofY + 0.4, p0.z + sz * (tot / 2 + 1.2) * -side, tot + 2.6, 0.3, len + 2.2, th, 0x2c6fd0, 0);
      for (const f of [-len / 2 + 1, 0, len / 2 - 1]) props.box(p0.x + sx * (tot + 0.5) * -side + fx * f, p0.y + roofY / 2, p0.z + sz * (tot + 0.5) * -side + fz * f, 0.5, roofY, 0.5, th, 0x555a66);
      // ad boards along the front
      for (let f = -len / 2 + 4; f < len / 2 - 4; f += 8) {
        const t = TEAMS[Math.floor(R() * TEAMS.length)];
        props.box(p0.x + sx * -0.3 * -side + fx * f, p0.y + 1.6, p0.z + sz * -0.3 * -side + fz * f, 0.3, 1.3, 7, th, t.c1);
        props.box(p0.x + sx * -0.35 * -side + fx * f, p0.y + 1.6, p0.z + sz * -0.35 * -side + fz * f, 0.3, 0.4, 7, th, t.c2);
      }
    }
    // main straight stand (right side), plus corner stands
    stand(-30, -(T.halfAt(0) + 18), 140, 7, -1);
    stand(60, -(T.halfAt(0) + 18), 70, 5, -1);
    for (const [s, sdSide, len] of [[600, 1, 60], [1470, -1, 50]]) {
      const i = Math.floor(s / T.ds) % N, off = sdSide * (T.half[i] + T.runoff[i] + 14);
      stand(s, off, len, 4, sdSide);
    }
    // pit building
    {
      const hw = T.halfAt(0), face = hw + 19;
      const c = T.at(-10, face + 9), th = T.thetaAt(0);
      props.box(c.x, c.y + 3, c.z, 18, 6, 215, th, 0xdadada);
      props.box(c.x, c.y + 6.3, c.z, 20, 0.6, 217, th, 0x4a4f5c);
      const mid = T.at(-10, face + 12);
      props.box(mid.x, mid.y + 9.5, mid.z, 12, 5, 40, th, 0xc9ced8);
      props.box(mid.x, mid.y + 10, mid.z, 12.2, 1.6, 40.2, th, 0x1d2b3a);
      props.box(mid.x, mid.y + 12.4, mid.z, 13, 0.5, 42, th, 0x4a4f5c);
      TEAMS.forEach((t, k) => {
        const s = T.boxU(k), p = T.at(s, face - 0.15);
        props.box(p.x, p.y + 1.9, p.z, 0.4, 3.8, 11.5, th, 0x14161c);
        props.box(p.x, p.y + 4.2, p.z, 0.5, 0.9, 11.5, th, t.c1);
        props.box(p.x, p.y + 4.9, p.z, 0.55, 0.3, 11.5, th, t.c2);
        // pit wall gantry post markers with team colour
        const q = T.at(s, hw + 12.5); props.box(q.x, q.y + 0.4, q.z, 1.4, 0.8, 1.4, th, t.c1);
      });
    }
    // Citadel: gatehouse over the squeeze entry + keep on the inside
    {
      let gi = 0, ki = 0;
      for (let i = 0; i < N; i++) { if (T.sectionName(i) === 'Citadel Squeeze') { gi = i; break; } }
      for (let i = gi; i < N; i++) if (T.sectionName(i) !== 'Citadel Squeeze') { ki = Math.floor((gi + i) / 2); break; }
      const sg = gi * T.ds + 18, th = T.thetaAt(sg), hw = T.halfAt(sg) + 1.1;
      for (const sd of [1, -1]) {
        const p = T.at(sg, sd * (hw + 2.4));
        props.box(p.x, p.y + 6, p.z, 5, 12, 5, th, STONE[0]);
        for (let k = -1; k <= 1; k += 2) for (let m = -1; m <= 1; m += 2) { const q = T.at(sg, sd * (hw + 2.4)); props.box(q.x + Math.cos(th) * k * 1.9 + Math.sin(th) * m * 1.9, q.y + 12.6, q.z - Math.sin(th) * k * 1.9 + Math.cos(th) * m * 1.9, 1.1, 1.2, 1.1, th, STONE[2]); }
      }
      const pc = T.at(sg, 0); props.box(pc.x, pc.y + 10.6, pc.z, hw * 2 + 5, 2.4, 4.4, th, STONE[1]);
      props.box(pc.x, pc.y + 12.1, pc.z, hw * 2 + 5, 0.7, 4.8, th, STONE[3]);
      // keep on the inside of the bend
      const sk = ki * T.ds, kp = T.at(sk, -(T.half[ki] + 38)), kth = T.thetaAt(sk);
      props.box(kp.x, kp.y + 8, kp.z, 22, 16, 22, kth, STONE[0]);
      props.box(kp.x, kp.y + 16.4, kp.z, 24, 0.8, 24, kth, STONE[2]);
      for (const [a, b] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
        const cx = kp.x + Math.cos(kth) * a * 12 + Math.sin(kth) * b * 12, cz = kp.z - Math.sin(kth) * a * 12 + Math.cos(kth) * b * 12;
        props.box(cx, kp.y + 11, cz, 6, 22, 6, kth + Math.PI / 4, STONE[1]);
        props.box(cx, kp.y + 22.5, cz, 7, 1.2, 7, kth + Math.PI / 4, STONE[3]);
        props.box(cx, kp.y + 24.2, cz, 1.2, 2.2, 1.2, kth, 0xb04030);
      }
      for (let m = -9; m <= 9; m += 3) for (const e of [-1, 1]) {
        props.box(kp.x + Math.cos(kth) * e * 11.6 + Math.sin(kth) * m, kp.y + 17.4, kp.z - Math.sin(kth) * e * 11.6 + Math.cos(kth) * m, 1.4, 1.4, 1.4, kth, STONE[3]);
        props.box(kp.x + Math.cos(kth) * m + Math.sin(kth) * e * 11.6, kp.y + 17.4, kp.z - Math.sin(kth) * m + Math.cos(kth) * e * 11.6, 1.4, 1.4, 1.4, kth, STONE[3]);
      }
      // ruined curtain wall
      for (let k = 0; k < 8; k++) {
        const s2 = sk + (k - 4) * 9, p = T.at(s2, -(T.half[ki] + 16) - 0), hgt = 3 + R() * 3.5;
        props.box(p.x, p.y + hgt / 2, p.z, 3, hgt, 9, T.thetaAt(s2), STONE[k % 4]);
      }
    }
    // hill-side billboards and marshal posts along the straight
    for (let k = 0; k < 8; k++) {
      const s = 40 + k * 64, t = TEAMS[k % TEAMS.length];
      place(props, L - 250 + k * 60, -(T.halfAt(0) + 3.5), 1.1, 0.3, 1.6, 12, t.c1);
    }
    addMesh(props, mats.deco, 'props');

    // ---- clouds ----
    {
      const cb = new Builder();
      for (let k = 0; k < 16; k++) {
        const cx = (R() - 0.5) * 1200 + 50, cz = (R() - 0.5) * 1000 + 220, cy = 230 + R() * 90;
        for (let j = 0; j < 4; j++) cb.box(cx + (R() - 0.5) * 50, cy + (R() - 0.5) * 6, cz + (R() - 0.5) * 30, 25 + R() * 30, 7 + R() * 5, 18 + R() * 12, R() * 3, j === 0 ? 0xffffff : 0xf0f4fa);
      }
      clouds = new THREE.Mesh(keep(cb.geometry()), mats.cloud); clouds.frustumCulled = false; group.add(clouds);
    }

    // ---- rain ----
    {
      const COUNT = 900, pos = new Float32Array(COUNT * 6);
      for (let i = 0; i < COUNT; i++) {
        const x = (R() - 0.5) * 90, y = R() * 50 - 10, z = (R() - 0.5) * 90;
        pos.set([x, y, z, x - 0.12, y + 1.8, z - 0.12], i * 6);
      }
      const g = keep(new THREE.BufferGeometry());
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      rainLines = new THREE.LineSegments(g, keep(new THREE.LineBasicMaterial({ color: 0xc8dcf5, transparent: true, opacity: 0.7, fog: false })));
      rainLines.frustumCulled = false; rainLines.visible = false; rainLines.geometry.setDrawRange(0, 0);
      rainLines.userData.count = COUNT;
      group.add(rainLines);
    }
    scene.add(group);
    setWeather(state);
  }

  const cTop = [new THREE.Color(0x2f78d0), new THREE.Color(0x4f5a66)];
  const cBot = [new THREE.Color(0xc4e4ff), new THREE.Color(0x8f9aa6)];
  const tmpCol = new THREE.Color();
  function setWeather(w) {
    state.rain = clamp(w.rain ?? state.rain, 0, 1); state.wet = clamp(w.wetness ?? state.wet, 0, 1);
    if (!scene) return;
    const r = state.rain, wt = state.wet;
    sky.material.uniforms.top.value.copy(cTop[0]).lerp(cTop[1], r);
    sky.material.uniforms.bot.value.copy(cBot[0]).lerp(cBot[1], r);
    sky.material.uniforms.sunAmt.value = 1 - r;
    scene.fog.color.copy(sky.material.uniforms.bot.value); scene.background.copy(scene.fog.color);
    scene.fog.near = lerp(120, 40, r); scene.fog.far = lerp(780, 330, r);
    sun.intensity = lerp(2.3, 0.45, r); hemi.intensity = lerp(1.35, 1.05, r);
    hemi.color.setHex(0xd8ecff).lerp(tmpCol.setHex(0xa8b4c4), r);
    mats.asphalt.color.setRGB(1, 1, 1).lerp(tmpCol.setRGB(0.6, 0.64, 0.74), wt);
    mats.asphalt.specular.setRGB(0.55, 0.58, 0.65).multiplyScalar(wt);
    mats.terrain.color.setRGB(1, 1, 1).lerp(tmpCol.setRGB(0.72, 0.78, 0.82), r);
    mats.cloud.color.setRGB(1, 1, 1).lerp(tmpCol.setRGB(0.5, 0.54, 0.6), r);
    mats.gravel.color.setRGB(1, 1, 1).lerp(tmpCol.setRGB(0.7, 0.7, 0.72), wt);
    rainLines.visible = r > 0.03;
    rainLines.geometry.setDrawRange(0, Math.floor(rainLines.userData.count * smoothstep(0.03, 1, r)) * 2);
  }

  function update(dt, camera) {
    if (!scene) return;
    sky.position.copy(camera.position);
    clouds.rotation.y += dt * 0.004;
    if (rainLines.visible) {
      rainLines.position.copy(camera.position);
      const pos = rainLines.geometry.attributes.position, a = pos.array, n = rainLines.userData.count;
      const fall = 34 * dt;
      for (let i = 0; i < n; i++) {
        const k = i * 6;
        a[k + 1] -= fall; a[k + 4] -= fall;
        if (a[k + 1] < -12) { a[k + 1] += 52; a[k + 4] += 52; }
      }
      pos.needsUpdate = true;
    }
  }

  function setStartLights(count, green = false) {
    lightMats.forEach((m, i) => m.color.setHex(green ? 0x35ff60 : i < count ? 0xff2a1a : 0x3a0c0a));
  }

  function dispose() {
    if (scene) { scene.remove(group); scene.fog = prevFog; scene.background = prevBg; }
    for (const o of disposables) o.dispose?.();
    group.clear();
    lightMats.length = 0; disposables.length = 0; scene = null;
  }

  return { name: 'circuitDay', group, build, dispose, setWeather, update, setStartLights };
}
