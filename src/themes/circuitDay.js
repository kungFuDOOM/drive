// Theme "Circuit Day": all environment art (terrain, track surfaces, props, sky, lights, rain).
// Theme interface: { name, build(scene, track), dispose(), setWeather({rain, wetness}), update(dt, camera, time),
//                    setStartLights(count, green), setCars(meshes), setPit(info), setQuality(level), fx }
// update(dt, camera, view): view = { x, y, z, half, dist } = shadow/fog focus point, shadow half-extent, camera->focus distance.
// `fx` is read by the post pass each frame: { rain, sat, tint[3], time, lift } (lift = metres the player car is jacked up).
// Nothing here touches path/physics/cars, so another theme can be swapped in at runtime.
import * as THREE from 'three';
import { smoothstep, lerp, wrapDelta, clamp } from '../physics.js';
import { TEAMS } from '../teams.js';
import { mergeGeometries, P, strip, wall, rng, C, Builder, bake, beam, BOX, brandTexture, worldDetail, roadSurface, fenceTexture, vnoise, fbm2, _m, _q, _v, _s, _e } from './builder.js';

/** Look of the environment. Other themes (desertNight.js, coastal.js) pass overrides; everything else is shared. */
export const DAY_STYLE = {
  name: 'circuitDay',
  // sky: zenith / horizon colours (the horizon colour is also the fog colour, so far terrain melts into the sky band, never a white wall)
  sky: { top: 0x1f5fc8, bot: 0x8fc1ee, rainTop: 0x56708c, rainBot: 0x9aabbd, sunGlow: 1 },
  fog: [320, 1500],
  sun: { color: 0xfff0d8, intensity: 3.3, dir: [-0.55, 0.75, 0.45], rainColor: 0xa9bdd8, rainIntensity: 1.6 },
  hemi: { sky: 0xb6d4ff, ground: 0x4a6a3a, intensity: 0.7 },
  // ground: g1/g2 = grass tones near the circuit, far = distant ground, rock = steep / high ground; patch / patch2 = world-space
  // tint patches (multiplied x2: 0.5 grey is neutral) for dry and lush areas; hills = { n, h:[min,max], r:[min,max], flat } rolling terrain
  ground: { g1: 0x5a843c, g2: 0x4f7836, far: 0x486c36, rock: 0x8a8470, amp: 24, rockFrom: 34, patch: [0.6, 0.55, 0.34], patchAmt: 0.5, patch2: [0.4, 0.47, 0.36], patch2Amt: 0.55, hills: { n: 12, h: [14, 30], r: [70, 130] } },
  gravel: [0xd8c18c, 0xcdb680],
  // road: asphalt base colour, rubber build-up, off-line dust colour / amount, micro-bump
  road: { color: 0x4b4e53, rubber: 1, dust: [0.5, 0.46, 0.4], dustAmt: 0.3, bump: 0.5 },
  barrier: 'mixed',   // 'mixed' = concrete + catch fence where it is tight, Armco guardrail on the open run-offs | 'concrete'
  houses: 'farm',     // scenery buildings beyond the barriers: 'farm' | 'chalet' | 'villa' | 'adobe' | 'cabin' | null
  trees: 'temperate', // 'temperate' | 'desert' | 'coastal' | 'alpine' | 'forest' | 'street'
  treeNear: 130,      // clusters beside the circuit
  treeFar: 60,        // clusters out in the scenery
  treeMaxH: 60,       // reject trees above this terrain height (alpine overrides)
  treeScale: 1,
  snowbanks: false,
  puddles: false,
  ambientRain: 0,     // visual rain floor; does not change grip
  ambientWet: 0,
  rainParticles: false,
  buildings: null,    // 'block' = city blocks outside the walls
  neon: false,        // unlit sponsor faces
  wall: null,         // 'city' = tall dark blocks with a neon lip where runoff is short
  clouds: true,
  night: false,       // headlights always on, floodlights, stars, moon instead of sun
  landmark: 'ferris', // 'ferris' | 'lighthouse' | 'lodge' | 'tower' | 'arch' | null
  sea: null,          // { level, mask(x, z) -> 0..1 } water plane + terrain falling below it
  fx: { sat: 1, tint: [1, 1, 1] },
  // render mood: filmic exposure, bloom multiplier, env-map strength/kind, asphalt roughness (dry) + env sheen, AO strength,
  // display grade (contrast S-curve amount, saturation, vignette). Exposure keeps lit white surfaces below the bloom threshold.
  mood: { exposure: 0.9, bloom: 0.5, env: 0.35, envKind: 'sky', asphalt: 0.86, asphaltEnv: 0.25, ao: 0.6, contrast: 1.14, sat: 1.12, vignette: 0.2 },
};
const mergeStyle = (base, o = {}) => {
  const out = { ...base };
  for (const [k, v] of Object.entries(o)) out[k] = v && typeof v === 'object' && !Array.isArray(v) && typeof v !== 'function' && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k]) ? { ...base[k], ...v } : v;
  return out;
};

/** 2x2 atlas of soft cumulus puffs (white tops, slightly grey flat bases), alpha-blended. No canvas in Node: returns a 1x1 texture there. */
function cloudTexture(R) {
  if (typeof document === 'undefined') return new THREE.DataTexture(new Uint8Array([255, 255, 255, 128]), 1, 1);
  const S = 256, c = document.createElement('canvas'); c.width = c.height = S * 2;
  const g = c.getContext('2d');
  if (!g?.createRadialGradient?.(0, 0, 0, 0, 0, 1)) return new THREE.DataTexture(new Uint8Array([255, 255, 255, 128]), 1, 1); // stub canvas (tests)
  for (let v = 0; v < 4; v++) {
    const ox = (v % 2) * S, oy = (1 - Math.floor(v / 2)) * S; // canvas y is flipped vs uv
    g.save(); g.beginPath(); g.rect(ox, oy, S, S); g.clip();
    const puffs = 7 + Math.floor(R() * 5);
    for (let k = 0; k < puffs; k++) {
      const t = (k + 0.5) / puffs, x = ox + S * (0.14 + 0.72 * t + (R() - 0.5) * 0.08), r = S * (0.1 + 0.16 * Math.sin(Math.PI * t) + R() * 0.05);
      const y = oy + S * 0.8 - r * (0.55 + R() * 0.3);
      const gr = g.createRadialGradient(x, y - r * 0.25, r * 0.1, x, y, r);
      gr.addColorStop(0, 'rgba(255,255,255,0.95)'); gr.addColorStop(0.55, 'rgba(244,247,252,0.75)'); gr.addColorStop(1, 'rgba(225,232,242,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    }
    // flat, slightly shaded base
    const base = g.createLinearGradient(0, oy + S * 0.55, 0, oy + S * 0.82);
    base.addColorStop(0, 'rgba(200,210,226,0)'); base.addColorStop(1, 'rgba(190,200,218,0.35)');
    g.globalCompositeOperation = 'source-atop'; g.fillStyle = base; g.fillRect(ox, oy, S, S); g.globalCompositeOperation = 'source-over';
    g.restore();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 2;
  return t;
}

/** Lit-window texture for the night skyline (repeats; ~70% dark windows). Stub canvas (tests): 1x1 grey. */
function windowTexture() {
  const c = typeof document !== 'undefined' ? document.createElement('canvas') : null, g = c?.getContext?.('2d');
  if (!g?.fillRect) return new THREE.DataTexture(new Uint8Array([120, 120, 140, 255]), 1, 1);
  c.width = c.height = 256; const R = rng(5);
  g.fillStyle = '#161a2e'; g.fillRect(0, 0, 256, 256);
  for (let y = 4; y < 256; y += 10) for (let x = 3; x < 256; x += 8) {
    const r = R(); g.fillStyle = r < 0.68 ? '#22263c' : r < 0.85 ? '#e8c27a' : r < 0.94 ? '#9fd0ee' : '#e889c4';
    g.fillRect(x, y, 5, 6);
  }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

export function createCircuitDay(styleOverrides) {
  const S = mergeStyle(DAY_STYLE, styleOverrides);
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
  let sea = null, stars = null, floods = null, rainBits = null, rainData = [];
  let visRain = 0;
  let flags = null, flagData = [], ferris = null, gondolas = null, splash = null, splashData = [], carLights = null, tailLights = null, headCones = null, crewRig = null, carMeshes = [];
  const hills = []; // { x, z, r, r2, h, ph, flat } terrain mounds, chosen per track in build()
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
    let pts;
    if (w == null) pts = [[x, z], [x + l, z], [x - l, z], [x, z + l], [x, z - l]];
    else {
      // outline plus an interior lattice: rolling terrain can crest inside a big footprint
      pts = rectPts(x, z, w, l, yaw);
      const sx = Math.cos(yaw), sz = -Math.sin(yaw), fx = Math.sin(yaw), fz = Math.cos(yaw), nb = Math.max(2, Math.ceil(l / 4));
      for (let a = 0; a <= 4; a++) for (let b = 0; b <= nb; b++) { const u = (a / 4 - 0.5) * w, v = (b / nb - 0.5) * l; pts.push([x + sx * u + fx * v, z + sz * u + fz * v]); }
    }
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

  // physically based surfaces (roughness-only: diffuse world, env-map sheen)
  const std = (extra = {}) => new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0, ...extra });
  const lit = (extra = {}) => std({ vertexColors: true, side: THREE.DoubleSide, ...extra });
  const keep = (o) => { disposables.push(o); return o; };
  const addMesh = (b, mat, name, cast = false, recv = true) => {
    const m = new THREE.Mesh(keep(b.geometry()), mat); m.name = name; m.matrixAutoUpdate = false; m.updateMatrix();
    m.castShadow = cast; m.receiveShadow = recv; group.add(m); return m;
  };

  // ---------------- helpers ----------------
  // P / strip / wall come from builder.js
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
    const far = S.ground.amp * smoothstep(110, 340, e);
    let noise = (Math.sin(x * 0.011 + 1.3) * Math.cos(z * 0.013 + 0.4) * 0.5 + Math.sin(x * 0.027 + z * 0.019) * 0.28 + Math.sin(z * 0.045 - x * 0.03) * 0.12 + 0.3 + (fbm2(x / 150 + 3.7, z / 150 - 1.9) - 0.5) * 0.7) * far
      + (Math.sin(x * 0.09) * Math.cos(z * 0.08) * 1.2 + (vnoise(x / 34 + 9.1, z / 34 + 4.3) - 0.5) * 2.4) * smoothstep(40, 100, e);
    // rolling hills: broad irregular mounds beside the circuit; scenery and trees stand on them (they are terrain, not props)
    for (let k = 0; k < hills.length; k++) {
      const H = hills[k], dx = x - H.x, dz = z - H.z, d2 = dx * dx + dz * dz;
      if (d2 >= H.r2) continue;
      const t = Math.sqrt(d2) / H.r * (0.82 + 0.36 * vnoise(x / 47 + H.ph, z / 47 - H.ph)), u = 1 - Math.min(1, t * t);
      noise += H.h * (H.flat ? smoothstep(0, 0.45, u) : u * u);
    }
    const h = lerp(out.y - 0.15 - 0.45 * (1 - smoothstep(10, 26, e)), noise, smoothstep(24, 100, e)); // dips under the road so cell interpolation never pokes through surfaces
    if (!S.sea) return h;
    const m = S.sea.mask(x, z) * smoothstep(28, 70, e); // the coast: ground falls away below the water line away from the road
    return lerp(h, S.sea.level - 7, m);
  }
  /** distance of (x,z) beyond the outermost barrier (negative = inside the barriers) */
  function beyondWall(x, z) { return track.clearance(x, z); }
  function gy(x, z) { return terrainAt(x, z, {}); }

  // ---------------- build ----------------
  function build(sc, tr) {
    scene = sc; track = tr;
    const T = tr, N = T.n, L = T.length, R = rng(tr.seed ?? 7), GH = S.ground.hills;
    prevFog = scene.fog; prevBg = scene.background;
    scene.background = new THREE.Color(S.sky.bot);
    scene.fog = new THREE.Fog(S.sky.bot, S.fog[0], S.fog[1]);

    // rolling hills beside the circuit (terrainAt adds them): chosen clear of the road, the pit complex and the sea
    if (GH && GH.n) {
      const HR = rng((tr.seed ?? 7) * 13 + 5);
      let mx = 0, mz = 0; for (let i = 0; i < N; i++) { mx += T.px[i]; mz += T.pz[i]; } mx /= N; mz /= N;
      const pitC = T.at(0, T.halfAt(0) + 60);
      for (let k = 0; k < 400 && hills.length < GH.n; k++) {
        const a = HR() * Math.PI * 2, rad = 60 + HR() * 520, x = mx + Math.cos(a) * rad, z = mz + Math.sin(a) * rad;
        const r = lerp(GH.r[0], GH.r[1], HR()), h = lerp(GH.h[0], GH.h[1], HR() * HR()) * (0.6 + 0.4 * r / GH.r[1]);
        if (T.clearance(x, z) < r * 0.3 + 26 || Math.hypot(x - pitC.x, z - pitC.z) < r + 150) continue;
        if (S.sea && S.sea.mask(x, z) > 0.02) continue;
        if (hills.some((o) => Math.hypot(o.x - x, o.z - z) < (o.r + r) * 0.42)) continue;
        hills.push({ x, z, r, r2: r * r, h, ph: HR() * 20, flat: !!GH.flat });
      }
    }

    // lights: strong directional sun with a crisp capped shadow map, soft hemisphere fill
    hemi = new THREE.HemisphereLight(S.hemi.sky, S.hemi.ground, S.hemi.intensity);
    sun = new THREE.DirectionalLight(S.sun.color, S.sun.intensity);
    sun.userData.dir = new THREE.Vector3(...S.sun.dir).normalize();
    sun.position.copy(sun.userData.dir).multiplyScalar(260);
    sun.castShadow = true;
    sun.shadow.mapSize.set(shadowSize, shadowSize);
    Object.assign(sun.shadow.camera, { near: 20, far: 640, left: -90, right: 90, top: 90, bottom: -90 });
    sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.25; sun.shadow.radius = 1.6; sun.shadow.blurSamples = 8; sun.shadow.intensity = 0.92;
    group.add(hemi, sun, sun.target);

    // materials
    mats.asphalt = keep(roadSurface(std({ vertexColors: true, side: THREE.DoubleSide, roughness: S.mood.asphalt }), S.road));
    const GP = S.ground;
    mats.terrain = keep(worldDetail(lit(), { fine: 0.2, fineScale: 5.3, mid: 0.2, midScale: 13, coarse: 0.16, coarseScale: 83, bump: 0.3, patch: GP.patch, patchAmt: GP.patchAmt ?? 0, patch2: GP.patch2, patch2Amt: GP.patch2Amt ?? 0 }));
    // built surfaces (barriers, stands, buildings): faint weathering that also runs down vertical faces
    mats.deco = keep(worldDetail(lit(), { fine: 0.07, fineScale: 3.1, mid: 0.1, midScale: 7.3, coarse: 0.07, coarseScale: 31, vertical: true }));
    mats.fence = keep(std({ map: fenceTexture(), transparent: true, depthWrite: false, side: THREE.DoubleSide, roughness: 0.55, metalness: 0.5, color: S.night ? 0xb8bcc8 : 0x9aa0a8 }));
    mats.pit = keep(worldDetail(std({ vertexColors: true, side: THREE.DoubleSide, roughness: S.mood.asphalt, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), { fine: 0.16, fineScale: 2.3, mid: 0.14, midScale: 5.7, coarse: 0.12, coarseScale: 41, rough: 0.08, patch: [0.38, 0.38, 0.39], patchAmt: 0.5 }));
    mats.decal = keep(worldDetail(lit({ polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }), { fine: 0.12, fineScale: 2.1, mid: 0.12, midScale: 4, coarse: 0, coarseScale: 50 })); // painted lines / kerbs: worn, grainy paint
    mats.decal2 = keep(lit({ polygonOffset: true, polygonOffsetFactor: -5, polygonOffsetUnits: -5 })); // painted over other markings: own depth layer
    mats.gravel = keep(worldDetail(lit({ polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }), { fine: 0.3, fineScale: 2.9, mid: 0.14, midScale: 6.1, coarse: 0.1, coarseScale: 23, bump: 0.4 }));
    mats.cloud = keep(new THREE.MeshBasicMaterial({ vertexColors: true, fog: false }));
    mats.tire = keep(std());
    mats.ao = keep(new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.26, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6, side: THREE.DoubleSide, forceSinglePass: true })); // single pass: three's two-sided transparent path sets needsUpdate twice per object per frame (full program lookup); black flat decals look identical
    mats.aoInst = keep(mats.ao.clone()); // InstancedMesh variant: sharing one material between instanced and plain meshes re-resolves the program on every switch
    mats.foliage = keep(worldDetail(std({ vertexColors: true, roughness: 0.82 }), { fine: 0.22, fineScale: 4.7, mid: 0.2, midScale: 9.1, coarse: 0.1, coarseScale: 37, vertical: true }));
    mats.trunk = keep(std({ color: 0x6a4426 }));
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
      uniforms: { top: { value: new THREE.Color(S.sky.top) }, bot: { value: new THREE.Color(S.sky.bot) }, sunDir: { value: sun.userData.dir.clone() }, sunAmt: { value: S.sky.sunGlow } },
      vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      // zenith -> horizon gradient with a thin brighter haze band at the horizon, darker below it; HDR sun disc (blooms) + soft halo
      fragmentShader: `uniform vec3 top; uniform vec3 bot; uniform vec3 sunDir; uniform float sunAmt; varying vec3 vD;
        void main(){
          vec3 d = normalize(vD); float y = d.y;
          vec3 zenith = top * vec3(0.72, 0.82, 1.05);
          vec3 c = mix(bot, zenith, pow(smoothstep(-0.02, 0.72, y), 0.5));
          c = mix(c, bot * vec3(1.05, 1.02, 0.98) + vec3(0.02), exp(-abs(y) * 22.0) * 0.55);
          c = mix(c, bot * 0.82, smoothstep(0.0, -0.25, y));
          float s = max(dot(d, sunDir), 0.0);
          c += vec3(1.0, 0.9, 0.7) * (smoothstep(0.9993, 0.9997, s) * 6.0 + pow(s, 220.0) * 0.5 + pow(s, 9.0) * 0.12) * sunAmt;
          gl_FragColor = vec4(c, 1.0);
        }`,
    }));
    sky = new THREE.Mesh(keep(new THREE.SphereGeometry(1000, 16, 10)), skyMat);
    sky.renderOrder = -10; sky.frustumCulled = false; group.add(sky);

    // ---- terrain: rolling ground, colour from distance / height / slope ----
    const X0 = -760, X1 = 840, Z0 = -520, Z1 = 1000, CELL = 8;
    {
      const nxv = Math.round((X1 - X0) / CELL) + 1, nzv = Math.round((Z1 - Z0) / CELL) + 1;
      const pos = new Float32Array(nxv * nzv * 3), col = new Float32Array(nxv * nzv * 3), eArr = new Float32Array(nxv * nzv);
      const info = {}; const g1 = C(S.ground.g1), g2 = C(S.ground.g2), gfar = C(S.ground.far), rock = C(S.ground.rock), tmpc = new THREE.Color();
      const shore = S.sea ? C(S.sea.sand) : null;
      for (let iz = 0; iz < nzv; iz++) for (let ix = 0; ix < nxv; ix++) {
        const x = X0 + ix * CELL, z = Z0 + iz * CELL, k = iz * nxv + ix;
        pos[k * 3] = x; pos[k * 3 + 1] = terrainAt(x, z, info); pos[k * 3 + 2] = z; eArr[k] = info.e;
      }
      const quiet = S.trees === 'alpine' || S.night;
      for (let iz = 0; iz < nzv; iz++) for (let ix = 0; ix < nxv; ix++) {
        const x = X0 + ix * CELL, z = Z0 + iz * CELL, k = iz * nxv + ix, h = pos[k * 3 + 1], e = eArr[k];
        const hx = pos[(iz * nxv + Math.min(nxv - 1, ix + 1)) * 3 + 1] - pos[(iz * nxv + Math.max(0, ix - 1)) * 3 + 1];
        const hz = pos[(Math.min(nzv - 1, iz + 1) * nxv + ix) * 3 + 1] - pos[(Math.max(0, iz - 1) * nxv + ix) * 3 + 1];
        const slope = Math.hypot(hx, hz) / (2 * CELL);
        // broad meadow tones instead of mown bands; the far colour takes over with distance
        tmpc.copy(g1).lerp(g2, smoothstep(0.3, 0.7, fbm2(x / 61 + 2.3, z / 61 - 5.1))).lerp(gfar, smoothstep(60, 240, e) * (0.75 + 0.25 * vnoise(x / 130, z / 130)));
        const rk = Math.max(smoothstep(S.ground.rockFrom, S.ground.rockFrom + 22, h) * 0.8, smoothstep(0.36, 0.62, slope + (vnoise(x / 19, z / 19) - 0.5) * 0.16) * 0.9);
        tmpc.lerp(rock, rk);
        if (shore) tmpc.lerp(shore, smoothstep(S.sea.level + 3.5, S.sea.level + 0.5, h) * smoothstep(20, 34, e));
        tmpc.offsetHSL(0, 0, (vnoise(x / 27 + 1.7, z / 27 + 8.2) - 0.5) * (quiet ? 0.04 : 0.07));
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
    const pitB = new Builder(), mark = new Builder(), mark2 = new Builder(), kerbB = new Builder(), gravelB = new Builder(), vergeB = new Builder();
    const PITC = C(0x45484d);
    // asphalt: one ribbon whose vertices carry what happens on the road (see roadSurface): lateral offset, path distance,
    // racing-line offset, braking and cornering load from a simple speed profile along the racing line
    {
      const vMax = new Float32Array(N), brake = new Float32Array(N), load = new Float32Array(N);
      const ALAT = 24, ABRK = 26, VTOP = 88;
      for (let i = 0; i < N; i++) vMax[i] = Math.min(VTOP, Math.sqrt(ALAT / Math.max(1e-4, Math.abs(T.lineK[i]))));
      const v = Float32Array.from(vMax);
      for (let pass = 0; pass < 2; pass++) for (let i = N - 1; i >= 0; i--) v[i] = Math.min(v[i], Math.sqrt(v[(i + 1) % N] ** 2 + 2 * ABRK * T.ds));
      for (let i = 0; i < N; i++) {
        const j = (i + 1) % N;
        brake[i] = clamp((v[i] * v[i] - v[j] * v[j]) / (2 * T.ds * ABRK), 0, 1);
        load[i] = clamp(Math.abs(T.lineK[i]) * v[i] * v[i] / ALAT, 0, 1);
      }
      // the grid: launch marks off every slot
      for (let s = L - 64; s < L + 30; s += T.ds) { const i = Math.floor((((s % L) + L) % L) / T.ds) % N; brake[i] = Math.max(brake[i], 0.45); }
      const bS = T._smooth(brake, 3), lS = T._smooth(load, 4);
      const pos = [], col = [], ar = [], ar2 = [], rc = C(S.road.color);
      const V = (i, d, sAbs) => { pos.push(T.px[i] + T.nx[i] * d, T.py[i], T.pz[i] + T.nz[i] * d); col.push(rc.r, rc.g, rc.b); ar.push(d, sAbs, T.line[i], bS[i]); ar2.push(T.half[i], lS[i]); };
      for (let i = 0; i < N; i++) {
        const j = (i + 1) % N, s0 = i * T.ds, s1 = (i + 1) * T.ds, a = T.half[i], c = T.half[j];
        V(i, -a, s0); V(j, c, s1); V(i, a, s0);
        V(i, -a, s0); V(j, -c, s1); V(j, c, s1);
      }
      const g = keep(new THREE.BufferGeometry());
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
      g.setAttribute('aRoad', new THREE.Float32BufferAttribute(ar, 4)); g.setAttribute('aRoad2', new THREE.Float32BufferAttribute(ar2, 2));
      g.computeVertexNormals();
      const m = new THREE.Mesh(g, mats.asphalt); m.name = 'asphalt'; m.matrixAutoUpdate = false; m.updateMatrix(); m.receiveShadow = true; group.add(m);
    }
    strip(pitB, T, (i) => T.pitTaper[i] > 0.02 ? [T.half[i], T.half[i] + 16 * T.pitTaper[i], 0, PITC] : null /* coplanar with the track: no step at the join */);
    const WHITE = C(0xdcdcd6), YEL = C(0xe6ba1c), RED = C(0xc4261e);
    for (const sd of [1, -1]) {
      strip(mark, T, (i) => (sd > 0 && T.pitTaper[i] > 0.5) ? null : (sd > 0 ? [T.half[i] - 0.62, T.half[i] - 0.3, 0.045, WHITE] : [-T.half[i] + 0.3, -T.half[i] + 0.62, 0.045, WHITE]));
    }
    strip(mark, T, (i) => T.pitTaper[i] > 0.5 ? [T.half[i] + 0.1, T.half[i] + 0.5, 0.045, WHITE] : null);
    strip(mark, T, (i) => T.pitTaper[i] > 0.5 ? [T.half[i] + 0.1 + 4.5 + 3.3, T.half[i] + 0.1 + 4.5 + 3.7, 0.045, YEL] : null);
    // pit entry gate: bold yellow/white stripe across the pit mouth so the lane is obvious
    {
      const pe = ((T.pit.entry % L) + L) % L;
      const hw = T.halfAt(pe);
      for (let k = 0; k < 3; k++) {
        const s0 = pe + k * 0.55;
        const col = (k & 1) ? YEL : WHITE;
        mark.quad(at(s0, hw + 0.4, 0.05), at(s0 + 0.5, hw + 0.4, 0.05), at(s0 + 0.5, hw + 8.5, 0.05), at(s0, hw + 8.5, 0.05), col);
      }
    }
    // ---- verges, kerbs, gravel: the cross-section from the white line to the barrier ----
    const tc0 = new THREE.Color();
    const mixC = (a, b, t, k = 1) => { tc0.copy(C(a)).lerp(C(b), t).multiplyScalar(k); return tc0.clone(); };
    const G1 = C(S.ground.g1), G2 = C(S.ground.g2), GRAV = C(S.gravel[0]), GRAV2 = C(S.gravel[1]);
    const dirtK = S.night ? 0.8 : 0.74;
    const kerbW = (i, sd) => { if (!T.kerb[i] || (sd > 0 && T.pitTaper[i] > 0.02)) return 0; const w = Math.min(1.35, (sd > 0 ? T.runL[i] : T.runR[i]) - 0.2); return w < 0.25 ? 0 : w; };
    for (const sd of [1, -1]) {
      // verge: a continuous ribbon edge -> wall. Worn, dusty soil right at the asphalt, grass (faintly mown) beyond, darker and
      // unkempt against the barrier. Sits a few cm below the road so kerbs and gravel layer cleanly on top of it.
      const prof = (i) => {
        const pit = sd > 0 ? T.pitTaper[i] : 0, w = sd > 0 ? T.leftWall[i] : T.rightWall[i];
        const e0 = T.half[i] + 16 * pit, run = Math.max(0.3, w - e0);
        const mow = 0.5 + 0.5 * Math.sin(i * T.ds / 7.5), wear = 0.55 + 0.45 * vnoise(i * 0.21, sd * 3.3);
        const gr = mixC(G1, G2, mow * 0.6);
        const paved = pit > 0.02 || T.squeeze[i];
        const cEdge = paved ? mixC(0x55585c, 0x47494d, wear) : mixC(gr, GRAV2, 0.62 * wear, dirtK);
        const cIn = paved ? mixC(0x5c5f63, 0x505357, wear) : mixC(gr, GRAV2, 0.2 * wear, 0.93);
        const cOut = paved ? mixC(0x4a4c50, 0x404246, wear) : mixC(gr, 0x2a3320, 0.26, 0.9);
        // last span: skirt behind the barrier, folding down into the terrain
        return { d: [e0, e0 + Math.min(0.7, run * 0.3), e0 + Math.min(3.2, run * 0.62), w, w + 4.5], y: [-0.004, -0.06, -0.06, -0.06, -0.85], c: [cEdge, cIn, paved ? cIn : gr, cOut, paved ? cOut : gr] };
      };
      let a = prof(0);
      for (let i = 0; i < N; i++) {
        const j = (i + 1) % N, c = prof(j);
        for (let k = 0; k < 4; k++) {
          const p0 = P(T, i, sd * a.d[k], a.y[k]), p1 = P(T, j, sd * c.d[k], c.y[k]), p2 = P(T, j, sd * c.d[k + 1], c.y[k + 1]), p3 = P(T, i, sd * a.d[k + 1], a.y[k + 1]);
          vergeB.tri3(p0, p1, p2, a.c[k], c.c[k], c.c[k + 1]); vergeB.tri3(p0, p2, p3, a.c[k], c.c[k + 1], a.c[k + 1]);
        }
        a = c;
      }
      // kerbs: bevelled lip on the track side, long sloping top, drop at the back; rubber-stained toward the road
      for (let i = 0; i < N; i++) {
        const j = (i + 1) % N, kw = kerbW(i, sd), kwj = kerbW(j, sd);
        if (!kw || !kwj) continue;
        const red = ((i >> 0) & 1) === 1, col = red ? RED : WHITE, stain = mixC(col, 0x1c1c1e, 0.42), back = mixC(col, 0x3a3a38, 0.5);
        const lift = 0.085;
        const X = (q, h, w, f, y) => P(T, q, sd * (h + w * f), y);
        const hi = T.half[i], hj = T.half[j];
        const a0 = X(i, hi, kw, 0, 0.012), b0 = X(j, hj, kwj, 0, 0.012);
        const a1 = X(i, hi, kw, 0.2, lift), b1 = X(j, hj, kwj, 0.2, lift);
        const a2 = X(i, hi, kw, 1, lift * 0.45), b2 = X(j, hj, kwj, 1, lift * 0.45);
        const a3 = X(i, hi, kw, 1, -0.06), b3 = X(j, hj, kwj, 1, -0.06);
        kerbB.tri3(a0, b0, b1, stain, stain, col); kerbB.tri3(a0, b1, a1, stain, col, col);
        kerbB.quad(a1, b1, b2, a2, col);
        kerbB.quad(a2, b2, b3, a3, back);
      }
      // gravel traps: paler where it spills toward the kerb, darker and damp against the barrier
      for (let i = 0; i < N; i++) {
        const j = (i + 1) % N;
        const g = (q) => {
          if (!T.gravel[q] || (sd > 0 && T.pitTaper[q] > 0.02)) return null;
          const h = T.half[q] + 1.6, w = T.half[q] + (sd > 0 ? T.runL[q] : T.runR[q]);
          return w < h + 0.3 ? null : [h, w]; // inside of a tight corner: no room for gravel
        };
        const ga = g(i), gb = g(j);
        if (!ga || !gb) continue;
        const rake = 0.94 + 0.12 * vnoise(i * 0.37, sd * 5.1), cA = mixC(GRAV, GRAV2, 0.5, rake * 1.04), cB = mixC(GRAV2, 0x6a6258, 0.3, rake * 0.86);
        const m0 = lerp(ga[0], ga[1], 0.6), m1 = lerp(gb[0], gb[1], 0.6);
        const p0 = P(T, i, sd * ga[0], -0.03), p1 = P(T, j, sd * gb[0], -0.03), p2 = P(T, j, sd * m1, -0.03), p3 = P(T, i, sd * m0, -0.03), p4 = P(T, j, sd * gb[1], -0.03), p5 = P(T, i, sd * ga[1], -0.03);
        gravelB.quad(p0, p1, p2, p3, cA);
        gravelB.tri3(p3, p2, p4, cA, cA, cB); gravelB.tri3(p3, p4, p5, cA, cB, cB);
      }
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
    addMesh(vergeB, mats.terrain, 'verge');
    addMesh(pitB, mats.pit, 'pitlane');
    addMesh(mark, mats.decal, 'markings');
    addMesh(mark2, mats.decal2, 'startline').renderOrder = 1;
    addMesh(kerbB, mats.decal, 'kerbs');
    addMesh(gravelB, mats.gravel, 'gravel');

    // puddles: dark patches on the asphalt. Visual only.
    if (S.puddles) {
      const pud = new Builder();
      const PUD = [C(0x163044), C(0x1e4054), C(0x122838)];
      for (let i = 4; i < N; i += 6) {
        const side = (i & 2) ? 1 : -1;
        const d = side * T.half[i] * 0.42;
        const w = 1.5 + (i % 5) * 0.28, len = 2.8 + (i % 4) * 0.45;
        const s0 = i * T.ds;
        pud.quad(at(s0, d - w, 0.055), at(s0 + len, d - w * 0.8, 0.055), at(s0 + len, d + w * 0.85, 0.055), at(s0, d + w, 0.055), PUD[i % 3]);
      }
      addMesh(pud, mats.decal2, 'puddles');
    }

    // ---- barriers: concrete + catch fence, Armco guardrail, stone, city blocks ----
    const walls = new Builder();
    const CONC = [C(0xbfc0bb), C(0xb2b3ae)], STONE = [C(0x8a867d), C(0x77736b), C(0x938e84), C(0x6c6860)], CAP = C(0xa29d92);
    const CITY = [C(0x2a3144), C(0x343c4e), C(0x242a3a)];
    // concrete barriers carry a band of made-up sponsor panels (blocks of ~12 samples), like the ad boards on a real circuit wall
    const BAND = [0xc23022, 0x1f52b4, 0xdcb420, 0x1b1d26, 0xd8d8d4, 0x2596b2, 0xd4721c, 0x6238b0, 0x2c8c48].map(C);
    const BAND_Y = 0.6, STEEL = [C(0xb4bac0), C(0x8e949b), C(0x6c7178)];
    const fencePos = [], fenceUv = [];
    const hashB = (n) => { const v = Math.sin(n * 91.7 + (tr.seed ?? 7) * 3.1) * 43758.5453; return v - Math.floor(v); };
    const startZone = (i) => { const u = Math.abs(wrapDelta(i * T.ds, L)); return u < 260; };
    const barrierKind = (i, sd) => {
      if (S.wall === 'city' && T.runoff[i] < 12) return 'city';
      if (T.runoff[i] < 6) return 'stone';
      if (S.barrier !== 'mixed' || T.runoff[i] < 13 || startZone(i)) return 'conc';
      return hashB(Math.floor(i / 28) * 2 + (sd > 0 ? 1 : 0)) < 0.42 ? 'conc' : 'armco';
    };
    for (const sd of [1, -1]) {
      const wAt = (q) => (sd > 0 ? T.leftWall[q] : T.rightWall[q]);
      // vertical face between samples i and j at lateral offsets (already signed), colour gradient bottom -> top
      const face = (i, j, di, dj, y0, y1, c0, c1 = c0) => {
        const a = P(T, i, di, y0), b = P(T, j, dj, y0), c = P(T, j, dj, y1), d = P(T, i, di, y1);
        walls.tri3(a, b, c, c0, c0, c1); walls.tri3(a, c, d, c0, c1, c1);
      };
      const top = (i, j, di0, dj0, di1, dj1, y, col) => walls.quad(P(T, i, di0, y), P(T, j, dj0, y), P(T, j, dj1, y), P(T, i, di1, y), col);
      for (let i = 0; i < N; i++) {
        const j = (i + 1) % N;
        if (sd > 0 && (T.pitTaper[i] > 0.02 || T.pitTaper[j] > 0.02)) continue;
        const k = barrierKind(i, sd), wi = wAt(i), wj = wAt(j);
        if (k === 'armco') {
          // two corrugated rails on posts; each rail is a shallow V so the halves catch the light differently
          for (const [y0, y1] of [[0.3, 0.6], [0.68, 0.98]]) {
            const ym = (y0 + y1) / 2;
            walls.quad(P(T, i, sd * wi, y0), P(T, j, sd * wj, y0), P(T, j, sd * (wj - 0.07), ym), P(T, i, sd * (wi - 0.07), ym), STEEL[1]);
            walls.quad(P(T, i, sd * (wi - 0.07), ym), P(T, j, sd * (wj - 0.07), ym), P(T, j, sd * wj, y1), P(T, i, sd * wi, y1), STEEL[0]);
          }
          if ((i & 1) === 0) { const p = P(T, i, sd * (wi + 0.09), 0); walls.box(p[0], p[1] + 0.45, p[2], 0.16, 1.15, 0.12, T.theta[i], STEEL[2], 1 << 5); }
          continue;
        }
        const city = k === 'city', stone = k === 'stone';
        const hgt = (q) => city ? lerp(2.6, 4.6, smoothstep(12, 5.2, T.runoff[q])) : stone ? lerp(1.1, 3.2, smoothstep(6, 2, T.runoff[q])) : 1.1;
        const hi = hgt(i), hj = k === barrierKind(j, sd) ? hgt(j) : hi;
        const col = city ? CITY[(i >> 2) % 3] : stone ? STONE[((i >> 1) + (Math.floor(hi) & 1) * 2 + ((i * 7) % 3)) % 4] : CONC[(i >> 2) & 1];
        const grime = mixC(col, city ? 0x0c0e14 : 0x4a463e, 0.55), thick = city ? 0.55 : stone ? 1.0 : 0.45;
        const dark = mixC(col, 0x202226, 0.3);
        // grimy foot, then the face
        face(i, j, sd * wi, sd * wj, -0.1, 0.22, grime, col);
        if (k === 'conc') {
          face(i, j, sd * wi, sd * wj, 0.22, BAND_Y, col);
          const blk = Math.floor(i / 12) + (sd > 0 ? 3 : 0), bc = (i % 12) === 0 ? C(0x1a1c22) : BAND[(blk * 7) % BAND.length];
          face(i, j, sd * wi, sd * wj, BAND_Y, 1.1, bc);
          top(i, j, sd * wi, sd * wj, sd * (wi + thick), sd * (wj + thick), 1.1, C(0x8e8f8c));
          face(i, j, sd * (wi + thick), sd * (wj + thick), -0.9, 1.1, dark, col);
          // catch fence: posts every other sample, mesh panel + inward-leaning top
          const f0 = sd * (wi + 0.3), f1 = sd * (wj + 0.3), u0 = i * T.ds / 1.3, u1 = (i + 1) * T.ds / 1.3, FH = 3.5;
          const A = P(T, i, f0, 1.1), B = P(T, j, f1, 1.1), Cc = P(T, j, f1, FH), D = P(T, i, f0, FH);
          const E = P(T, j, sd * (wj - 0.4), FH + 0.6), F = P(T, i, sd * (wi - 0.4), FH + 0.6);
          fencePos.push(...A, ...B, ...Cc, ...A, ...Cc, ...D, ...D, ...Cc, ...E, ...D, ...E, ...F);
          fenceUv.push(u0, 0, u1, 0, u1, (FH - 1.1) / 1.3, u0, 0, u1, (FH - 1.1) / 1.3, u0, (FH - 1.1) / 1.3, u0, 0, u1, 0, u1, 0.7, u0, 0, u1, 0.7, u0, 0.7);
          if ((i & 1) === 0) {
            walls.box(A[0], A[1] + (FH - 1.1) / 2, A[2], 0.1, FH - 1.1, 0.1, T.theta[i], STEEL[2], 1 << 5);
            walls.quad(P(T, i, f0 + sd * 0.05, FH), P(T, i, f0 - sd * 0.05, FH), P(T, i, sd * (wi - 0.45), FH + 0.62), P(T, i, sd * (wi - 0.35), FH + 0.66), STEEL[2]);
          }
        } else {
          face(i, j, sd * wi, sd * wj, 0.22, hi, col, k === barrierKind(j, sd) ? col : col);
          if (Math.abs(hj - hi) > 0.01) walls.tri3(P(T, i, sd * wi, hi), P(T, j, sd * wj, hi), P(T, j, sd * wj, hj), col, col, col);
          const neonLip = city && ((i >> 3) & 1), capCol = neonLip ? C(0xff2bd6) : city ? C(0x141820) : CAP;
          walls.quad(P(T, i, sd * wi, hi), P(T, j, sd * wj, hj), P(T, j, sd * (wj + thick), hj), P(T, i, sd * (wi + thick), hi), capCol);
          const bi = P(T, i, sd * (wi + thick), -0.9), bj = P(T, j, sd * (wj + thick), -0.9);
          walls.quad(bi, bj, P(T, j, sd * (wj + thick), hj), P(T, i, sd * (wi + thick), hi), dark);
        }
      }
      // dark contact strip on the track side of every barrier (AO)
      strip(aoB, T, (i) => {
        if (sd > 0 && T.pitTaper[i] > 0.02) return null;
        const w = sd > 0 ? T.leftWall[i] : T.rightWall[i];
        return sd > 0 ? [w - 1.8, w, 0.06, 0x000000] : [-w, -w + 1.8, 0.06, 0x000000];
      });
    }
    addMesh(walls, mats.deco, 'walls', true, true);
    if (fencePos.length) {
      const fg = keep(new THREE.BufferGeometry());
      fg.setAttribute('position', new THREE.Float32BufferAttribute(fencePos, 3)); fg.setAttribute('uv', new THREE.Float32BufferAttribute(fenceUv, 2));
      fg.computeVertexNormals();
      const fm = new THREE.Mesh(fg, mats.fence); fm.name = 'fence'; fm.matrixAutoUpdate = false; fm.updateMatrix(); fm.renderOrder = 2; group.add(fm);
    }

    // snowbanks: a wedge piled against the barrier, crest toward the track
    if (S.snowbanks) {
      const sb = new Builder();
      const SNOW = [C(0xf7fbff), C(0xd7e6f6), C(0xeef4fb)];
      for (const sd of [1, -1]) {
        for (let i = 0; i < N; i++) {
          const j = (i + 1) % N;
          if (sd > 0 && (T.pitTaper[i] > 0.02 || T.pitTaper[j] > 0.02)) continue;
          const w0 = sd > 0 ? T.leftWall[i] : T.rightWall[i];
          const w1 = sd > 0 ? T.leftWall[j] : T.rightWall[j];
          const inner0 = sd * (w0 + 0.5), outer0 = sd * (w0 + 5.4);
          const inner1 = sd * (w1 + 0.5), outer1 = sd * (w1 + 5.4);
          const col = SNOW[(i >> 2) % 3];
          sb.quad(P(T, i, inner0, 1.55), P(T, j, inner1, 1.55), P(T, j, outer1, 0.05), P(T, i, outer0, 0.05), col);
          sb.quad(P(T, i, inner0, 0.02), P(T, i, inner0, 1.55), P(T, j, inner1, 1.55), P(T, j, inner1, 0.02), SNOW[0]);
        }
      }
      addMesh(sb, mats.deco, 'snowbanks', true, true);
    }

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
          const aisle = Math.abs(((f + 6) % 12) - 6) < 0.9;
          if (aisle) { if (f % 12 < 1.05) props.box(p0.x + sx * (a + rowD * 0.5) * side + fx * (f - len / 2), p0.y + (r + 1) * rowH + 0.03, p0.z + sz * (a + rowD * 0.5) * side + fz * (f - len / 2), rowD, 0.06, 1.3, th, 0x6e727c, 1 << 5); continue; } // stairway
          if (R() < 0.07) continue; // empty seat
          const w = W(a + rowD * 0.5, (r + 1) * rowH, f - len / 2);
          spectators.push([w[0], w[1], w[2], th, R() < 0.5 ? crowd[Math.floor(R() * crowd.length)] : crowd[(Math.floor(f / 6) + r) % crowd.length], skin[Math.floor(R() * skin.length)]]);
        }
      }
      const tot = rows * rowD, roofY = rows * rowH + 3.6;
      // back and end walls close the structure; a cantilever roof rises toward the track on raked steel trusses
      props.box(p0.x + sx * (tot + 0.35) * side, p0.y + (roofY - 0.4) / 2, p0.z + sz * (tot + 0.35) * side, 0.5, roofY - 0.4, len + 0.6, th, 0x7d828c);
      for (const e of [-1, 1]) {
        const f = e * (len / 2 + 0.15), topY = rows * rowH + 1.1;
        props.quad(W(0, 0, f), W(tot + 0.3, 0, f), W(tot + 0.3, topY, f), W(0, 1.1, f), 0x8a8e98);
      }
      const rBack = tot + 1.4, rFront = tot * 0.18, yB = roofY, yF = roofY + 1.5;
      props.quad(W(rBack, yB, -len / 2 - 1), W(rBack, yB, len / 2 + 1), W(rFront, yF, len / 2 + 1), W(rFront, yF, -len / 2 - 1), 0xd9dbe0);
      props.quad(W(rBack, yB + 0.3, -len / 2 - 1), W(rBack, yB + 0.3, len / 2 + 1), W(rFront, yF + 0.3, len / 2 + 1), W(rFront, yF + 0.3, -len / 2 - 1), 0xc4c8d0);
      props.quad(W(rFront, yF - 0.35, -len / 2 - 1), W(rFront, yF - 0.35, len / 2 + 1), W(rFront, yF + 0.45, len / 2 + 1), W(rFront, yF + 0.45, -len / 2 - 1), 0x2a5fb8); // fascia
      props.quad(W(rBack, yB - 0.2, -len / 2 - 1), W(rBack, yB - 0.2, len / 2 + 1), W(rBack, yB + 0.3, len / 2 + 1), W(rBack, yB + 0.3, -len / 2 - 1), 0x9da1aa);
      const nT = Math.max(2, Math.round(len / 10));
      for (let q = 0; q <= nT; q++) {
        const f = -len / 2 + (q / nT) * len;
        props.box(p0.x + sx * (tot + 0.5) * side + fx * f, p0.y + roofY / 2, p0.z + sz * (tot + 0.5) * side + fz * f, 0.45, roofY, 0.45, th, 0x555a66);
        // truss: deep at the column, tapering to the roof edge
        props.quad(W(tot + 0.5, yB - 2.4, f), W(tot + 0.5, yB - 0.05, f), W(rFront + 0.6, yF - 0.1, f), W(rFront + 0.6, yF - 0.45, f), 0x4a4f5a);
      }
      // front rail
      props.box(p0.x + sx * -0.75 * side, p0.y + 1.25, p0.z + sz * -0.75 * side, 0.08, 0.08, len, th, 0x9aa0a8);
      for (let f = -len / 2; f <= len / 2 + 0.01; f += len / Math.max(2, Math.round(len / 6))) props.box(p0.x + sx * -0.75 * side + fx * f, p0.y + 0.65, p0.z + sz * -0.75 * side + fz * f, 0.08, 1.3, 0.08, th, 0x9aa0a8, 1 << 5);
      for (let f = -len / 2 + 4; f < len / 2 - 4; f += 8) {
        const t = TEAMS[Math.floor(R() * TEAMS.length)];
        props.box(p0.x + sx * -0.3 * side + fx * f, p0.y + 1.6, p0.z + sz * -0.3 * side + fz * f, 0.3, 1.3, 7, th, t.c1);
        props.box(p0.x + sx * -0.35 * side + fx * f, p0.y + 1.6, p0.z + sz * -0.35 * side + fz * f, 0.3, 0.4, 7, th, t.c2);
      }
      const cx = p0.x + sx * (tot / 2) * side, cz = p0.z + sz * (tot / 2) * side;
      aoRect(cx, p0.y, cz, tot + 3, len + 2, th, 1.4);
      reserve(cx, cz, len / 2 + tot);
      // flags along the roof edge
      for (let f = -len / 2 + 3; f < len / 2; f += 14) flagSpots.push([p0.x + sx * (tot + 1.2) * side + fx * f, p0.y + roofY + 0.3, p0.z + sz * (tot + 1.2) * side + fz * f, th, R()]);
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
      props.box(c.x, c.y + 3, c.z, 18, 6, 215, th, 0xd6d8dc);
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
      let g0 = -1, g1 = 0;
      for (let i = 0; i < N; i++) { if (T.sectionName(i) === 'Citadel Squeeze') { g0 = i; break; } }
      if (g0 >= 0) {
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
    // scenery buildings beyond the barriers (farmsteads, chalets, villas, cabins...): pitched roofs, doors, windows; each one is
    // placement-checked against the whole circuit and stands on a footing
    if (S.houses) {
      const HR = rng((tr.seed ?? 7) * 7 + 31);
      const LOOK = {
        farm: { wall: [0xd8d2c4, 0xa8483a, 0xc9bfa8, 0x8a6a4a], roof: [0x6a3a2e, 0x4a4e56, 0x7a4a36], trim: 0xf0ece2 },
        chalet: { wall: [0x6b4228, 0x7a4e30, 0x5a3822], roof: [0xe8eef4, 0xdde6ee], trim: 0xe8dcc8 },
        villa: { wall: [0xf2ece0, 0xeadfc8, 0xf6f2ea], roof: [0xb8603a, 0xa8553a, 0xc47048], trim: 0x3a6a9a },
        adobe: { wall: [0xb88a60, 0xa87a52, 0xc49a70], roof: [0x6a4a36, 0x7a5a44], trim: 0x3a2a20, flat: true },
        cabin: { wall: [0x4a3626, 0x5a4230, 0x3e2e22], roof: [0x2a3a30, 0x343a3a], trim: 0xc8c0a0 },
      }[S.houses] || null;
      const GLASS = S.night ? 0xe8b860 : 0x26323e;
      for (let k = 0, got = 0; LOOK && k < 160 && got < 12; k++) {
        const i = Math.floor(HR() * N), sd = HR() < 0.5 ? 1 : -1, w = sd > 0 ? T.leftWall[i] : T.rightWall[i];
        const off = sd * (w + 16 + HR() * 80), x = T.px[i] + T.nx[i] * off, z = T.pz[i] + T.nz[i] * off;
        const hw = 6 + HR() * 3, hl = 9 + HR() * 6, hh = 3.1 + HR() * 1.6, yaw = T.theta[i] + (HR() - 0.5) * 0.9 + (HR() < 0.4 ? Math.PI / 2 : 0);
        if (x < X0 + 40 || x > X1 - 40 || z < Z0 + 40 || z > Z1 - 40 || !free(x, z, 10)) continue;
        if (S.sea && S.sea.mask(x, z) > 0.02) continue;
        if (!tryPlace('house', x, z, hw + 1, hl + 1, yaw, 2)) continue;
        if (lastGround.hi - lastGround.lo > 2.6) { placements.pop(); continue; } // too steep to build on
        const y = lastGround.hi; footing(props, x, z, hw + 0.6, hl + 0.6, yaw, 0x8a8478);
        const wc = LOOK.wall[Math.floor(HR() * LOOK.wall.length)], rcl = LOOK.roof[Math.floor(HR() * LOOK.roof.length)];
        const sxh = Math.cos(yaw), szh = -Math.sin(yaw), fxh = Math.sin(yaw), fzh = Math.cos(yaw);
        const Wp = (a, yy, f) => [x + sxh * a + fxh * f, y + yy, z + szh * a + fzh * f];
        props.box(x, y + hh / 2, z, hw, hh, hl, yaw, wc, 1 << 5);
        if (LOOK.flat) {
          props.box(x, y + hh + 0.2, z, hw + 0.5, 0.4, hl + 0.5, yaw, rcl);
        } else {
          // gable roof with eaves; gable ends filled in wall colour
          const rh = hw * (0.34 + HR() * 0.14), ov = 0.55, hx = hw / 2 + ov, hz = hl / 2 + ov;
          props.quad(Wp(-hx, hh - 0.15, -hz), Wp(-hx, hh - 0.15, hz), Wp(0, hh + rh, hz), Wp(0, hh + rh, -hz), rcl);
          props.quad(Wp(hx, hh - 0.15, hz), Wp(hx, hh - 0.15, -hz), Wp(0, hh + rh, -hz), Wp(0, hh + rh, hz), rcl);
          for (const e of [-1, 1]) props.tri(Wp(-hw / 2, hh, e * hl / 2), Wp(hw / 2, hh, e * hl / 2), Wp(0, hh + rh * (hw / 2) / hx, e * hl / 2), wc);
          if (HR() < 0.7) props.box(...Wp(hw * 0.22, hh + rh * 0.75, hl * 0.2), 0.9, rh * 0.9 + 0.8, 0.9, yaw, 0x5a4a40);
        }
        // door + windows on the long sides (thin proud boxes: they read as openings and catch a shadow line)
        for (const e of [-1, 1]) {
          const nW = Math.max(2, Math.round(hl / 3.2));
          for (let q = 0; q < nW; q++) {
            const f = (q + 0.5) / nW * hl - hl / 2, door = e > 0 && q === Math.floor(nW / 2);
            const c = Wp(e * (hw / 2 + 0.03), door ? 1.05 : 1.75, f);
            props.box(c[0], c[1], c[2], 0.1, door ? 2.1 : 1.15, door ? 1.1 : 1.3, yaw, door ? LOOK.trim : GLASS, (1 << 4) | (1 << 5));
          }
        }
        aoRect(x, y, z, hw, hl, yaw, 1.2); reserve(x, z, Math.max(hw, hl) * 0.75);
        got++;
      }
    }
    // city blocks just outside a close wall, with glowing strips recorded for one instanced mesh
    const neonStrips = [];
    if (S.buildings === 'block') {
      const paints = [0x2a3144, 0x1c2436, 0x34304a, 0x243044, 0x3a2a40];
      const glows = [0xff2bd6, 0x27f0ff, 0xb6ff3c, 0xffe14a, 0xff5a3c];
      for (let k = 0, got = 0; k < 56 && got < 18; k++) {
        const s = ((k + 0.37) * (L / 56)) % L;
        const i = Math.floor(s / T.ds) % N;
        if (T.pitTaper[i] > 0.04 || T.runoff[i] > 11) continue;
        const sd = (k % 3 === 0) ? 1 : -1;
        if (sd > 0 && T.pitTaper[i] > 0.02) continue;
        const w = (sd > 0 ? T.leftWall[i] : T.rightWall[i]) + 7.5;
        const p = T.at(s, sd * w), th = T.thetaAt(s);
        const bw = 11 + (k % 4) * 3, bd = 9, bh = 7 + (k % 5) * 2.4;
        if (!free(p.x, p.z, 6) || !tryPlace('block', p.x, p.z, bd + 1, bw + 1, th)) continue;
        p.y = lastGround.hi;
        footing(props, p.x, p.z, bd, bw, th, 0x1a1e28);
        props.box(p.x, p.y + bh / 2, p.z, bd, bh, bw, th, paints[k % paints.length]);
        props.box(p.x, p.y + bh + 0.35, p.z, bd + 0.5, 0.7, bw + 0.5, th, 0x12151c);
        aoRect(p.x, p.y, p.z, bd, bw, th, 1.1);
        reserve(p.x, p.z, Math.max(bw, bd) * 0.55);
        neonStrips.push([p.x, p.y + bh * 0.72, p.z, th, bd + 0.35, 0.42, bw * 0.82, glows[k % glows.length]]);
        neonStrips.push([p.x, p.y + 1.5, p.z, th, bd + 0.25, 0.32, bw * 0.66, glows[(k + 2) % glows.length]]);
        got++;
      }
    }
    addMesh(props, mats.deco, 'props', true, true);
    if (neonStrips.length) {
      const mesh = new THREE.InstancedMesh(BOX, keep(new THREE.MeshBasicMaterial({ color: new THREE.Color(3.2, 3.2, 3.2) })), neonStrips.length);
      const tc = new THREE.Color();
      neonStrips.forEach(([x, y, z, th, w, h, l, col], n) => {
        mesh.setMatrixAt(n, _m.compose(_v.set(x, y, z), _q.setFromEuler(_e.set(0, th, 0)), _s.set(w, h, l)));
        mesh.setColorAt(n, tc.setHex(col));
      });
      mesh.frustumCulled = false; mesh.name = 'neon'; group.add(mesh);
    }
    for (const b of boards) {
      // frame is a box oriented along the track; face plane faces the road
      const tex = keep(brandTexture(b.id));
      const mat = keep(S.neon ? new THREE.MeshBasicMaterial({ map: tex, color: new THREE.Color(1.15, 1.15, 1.15) }) : std({ map: tex }));
      const geo = keep(new THREE.PlaneGeometry(b.w, b.h));
      for (const flip of [0, 1]) {
        const m = new THREE.Mesh(geo, mat); m.position.set(b.x, b.y, b.z); m.rotation.y = b.ry + (flip ? Math.PI : 0);
        m.translateZ(0.3); m.castShadow = false; m.receiveShadow = true; group.add(m);
      }
    }
    // billboard frame was built as a box along the track; draw faces perpendicular to it (rotated box above) - nothing else needed
    // ---- crowd: two instanced meshes (shirts + heads) ----
    {
      const body = new THREE.InstancedMesh(keep(new THREE.BoxGeometry(0.62, 0.95, 0.5).translate(0, 0.47, 0)), keep(std()), spectators.length);
      const head = new THREE.InstancedMesh(keep(new THREE.BoxGeometry(0.4, 0.4, 0.4).translate(0, 1.15, 0)), keep(std()), spectators.length);
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
      const poles = new THREE.InstancedMesh(poleGeo, keep(std({ color: 0xd8dbe2 })), flagSpots.length);
      flags = new THREE.InstancedMesh(flagGeo, keep(std({ side: THREE.DoubleSide })), flagSpots.length);
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
    const landmarkSpot = (r, pref) => {
      // preferred spot if it clears every part of the track, else the most open infield-ish spot near the circuit's centre
      if (pref && T.clearance(pref[0], pref[1]) >= r + MARGIN && free(pref[0], pref[1], r)) return pref;
      let cx = 0, cz = 0; for (let i = 0; i < N; i++) { cx += T.px[i]; cz += T.pz[i]; } cx /= N; cz /= N;
      let best = null;
      for (let dx = -300; dx <= 300; dx += 10) for (let dz = -300; dz <= 300; dz += 10) {
        const x = cx + dx, z = cz + dz, c = T.clearance(x, z);
        if (c < r + MARGIN + 2 || !free(x, z, r) || (S.sea && S.sea.mask(x, z) > 0.05)) continue;
        const sc = -Math.abs(c - r - 12) - Math.hypot(dx, dz) * 0.05;
        if (!best || sc > best.sc) best = { x, z, sc };
      }
      return best && [best.x, best.z];
    };
    if (S.landmark === 'ferris') {
      const Rw = 27, spot = landmarkSpot(Rw + 8, [55, 135]) || [55, 135], hx = spot[0], hz = spot[1], ground = terrainAt(hx, hz, {}), hubY = ground + Rw + 6;
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
      const wheelMesh = new THREE.Mesh(keep(mergeGeometries(parts)), keep(std({ vertexColors: true })));
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
      gondolas = new THREE.InstancedMesh(keep(gg), keep(std({ vertexColors: true })), NG);
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

    if (S.landmark === 'lighthouse') {
      // striped lighthouse on the headland + keeper's cottage; the lamp turns (night or day)
      const spot = landmarkSpot(12, S.lighthouseAt), lb = new Builder();
      if (spot && tryPlace('lighthouse', spot[0], spot[1], null, 12)) {
        const [hx, hz] = spot, g = lastGround.hi, H = 34;
        const parts = [];
        for (let k = 0; k < 6; k++) parts.push(bake(new THREE.CylinderGeometry(3.4 - k * 0.22, 3.6 - k * 0.22, H / 6, 10), hx, g + (k + 0.5) * (H / 6), hz, k & 1 ? 0xe6261f : 0xf7f7f7));
        parts.push(bake(new THREE.CylinderGeometry(3.4, 3.4, 0.8, 10), hx, g + H + 0.4, hz, 0x2a2d36));
        parts.push(bake(new THREE.CylinderGeometry(2.2, 2.2, 3, 8), hx, g + H + 2.3, hz, 0xfff0a8));
        parts.push(bake(new THREE.ConeGeometry(2.8, 2.6, 8), hx, g + H + 5.1, hz, 0x2a2d36));
        const m = new THREE.Mesh(keep(mergeGeometries(parts)), keep(std({ vertexColors: true })));
        m.castShadow = true; m.receiveShadow = true; m.frustumCulled = false; group.add(m);
        lb.box(hx + 8, g + 2, hz + 2, 7, 4, 9, 0.3, 0xf2efe6); lb.box(hx + 8, g + 4.6, hz + 2, 8, 1.2, 10, 0.3, 0x3a5a8a);
        addMesh(lb, mats.deco, 'cottage', true, true);
        const beamG = keep(new THREE.ConeGeometry(4, 60, 6, 1, true).translate(0, -30, 0).rotateZ(Math.PI / 2));
        const beamM = new THREE.Mesh(beamG, keep(new THREE.MeshBasicMaterial({ color: 0xfff4c0, transparent: true, opacity: S.night ? 0.22 : 0.07, depthWrite: false, side: THREE.DoubleSide, fog: false })));
        beamM.position.set(hx, g + H + 2.3, hz); beamM.frustumCulled = false; group.add(beamM);
        ferris = null; group.userData.beacon = beamM;
        aoRect(hx, g, hz, 8, 8, 0, 2); reserve(hx, hz, 22);
      }
    }

    if (S.landmark === 'lodge') {
      const spot = landmarkSpot(14, S.lodgeAt);
      if (spot && tryPlace('lodge', spot[0], spot[1], 16, 22, 0.4)) {
        const [hx, hz] = spot, g = lastGround.hi, lb = new Builder();
        lb.box(hx, g + 2.2, hz, 14, 4.4, 18, 0.4, 0x6b3a24);
        lb.box(hx, g + 5.1, hz, 16.4, 1.5, 20.4, 0.4, 0xf4f7fb);
        lb.box(hx, g + 5.9, hz, 15, 0.35, 19, 0.4, 0xd5e2f0);
        lb.box(hx + 5, g + 7.4, hz - 3, 2.1, 3.6, 2.1, 0.4, 0x4a2a1c);
        lb.box(hx + 5, g + 9.5, hz - 3, 2.6, 0.55, 2.6, 0.4, 0x2a2a2e);
        lb.box(hx - 2.2, g + 3.1, hz + 9.1, 2.4, 1.8, 0.35, 0.4, 0xffd27a);
        lb.box(hx + 2.4, g + 3.1, hz + 9.1, 2.4, 1.8, 0.35, 0.4, 0xffd27a);
        addMesh(lb, mats.deco, 'lodge', true, true);
        aoRect(hx, g, hz, 16, 20, 0.4, 2);
        reserve(hx, hz, 18);
      }
    }
    if (S.landmark === 'tower') {
      const spot = landmarkSpot(8, S.towerAt);
      if (spot && tryPlace('tower', spot[0], spot[1], null, 7)) {
        const [hx, hz] = spot, g = lastGround.hi, lb = new Builder();
        for (let k = 0; k < 4; k++) lb.box(hx + (k < 2 ? -1 : 1) * 1.3, g + 7, hz + (k % 2 ? -1 : 1) * 1.3, 0.45, 14, 0.45, 0, 0x4a3424);
        lb.box(hx, g + 14.6, hz, 5.6, 0.45, 5.6, 0.2, 0x3a2a20);
        lb.box(hx, g + 16.4, hz, 4.4, 2.8, 4.4, 0.2, 0x6a4632);
        lb.box(hx, g + 18.4, hz, 6.2, 0.55, 6.2, 0.2, 0x163222);
        lb.box(hx, g + 15.2, hz + 2.3, 1.1, 1.3, 0.2, 0.2, 0xc8e0a0);
        addMesh(lb, mats.deco, 'tower', true, true);
        aoRect(hx, g, hz, 6, 6, 0, 1.2);
        reserve(hx, hz, 10);
      }
    }
    if (S.landmark === 'arch') {
      const spot = landmarkSpot(12, S.archAt);
      const th = 0.3;
      if (spot && tryPlace('arch', spot[0], spot[1], 8, 22, th)) {
        const [hx, hz] = spot, g = lastGround.hi, lb = new Builder();
        const fx = Math.sin(th), fz = Math.cos(th), span = 8;
        for (const s of [-1, 1]) {
          const x = hx + fx * s * span, z = hz + fz * s * span;
          lb.box(x, g + 8, z, 2.2, 16, 2.2, th, 0x161822);
          lb.box(x, g + 16.5, z, 2.8, 1.1, 2.8, th, 0xff2bd6);
        }
        lb.box(hx, g + 15.2, hz, 1.6, 1.3, span * 2 + 2.2, th, 0x12141c);
        addMesh(lb, mats.deco, 'arch', true, true);
        const tube = new THREE.Mesh(keep(new THREE.BoxGeometry(1.1, 0.55, span * 2)), keep(new THREE.MeshBasicMaterial({ color: new THREE.Color(0x27f0ff).multiplyScalar(3) })));
        tube.position.set(hx, g + 15.2, hz); tube.rotation.y = th; tube.frustumCulled = false; tube.name = 'archglow'; group.add(tube);
        aoRect(hx, g, hz, 6, span * 2, th, 1.4);
        reserve(hx, hz, 14);
      }
    }

    // ---- trees: dense instanced clusters in varied greens / yellows / oranges ----
    {
      const palettes = S.trees === 'desert' ? [
        [0x4f8a3a, 0x5d9a44, 0x3f7a34, 0x6aa04a], // cactus greens
        [0x8a7a3a, 0x9a8a48, 0x6f6a34, 0xa89a58], // dry scrub
      ] : S.trees === 'coastal' ? [
        [0x358a3a, 0x449c40, 0x56aa48, 0x2a763a],
        [0x4c9a46, 0x62a852, 0x347f42, 0x7ab460],
        [0x3f9258, 0x358a3a, 0x58a666, 0x26723c],
      ] : S.trees === 'alpine' ? [
        [0x1c6b38, 0x2e8a46, 0x14532c, 0x3c9a55],
        [0x245e34, 0x1a4e2c, 0x2f7a40, 0x163f26],
      ] : S.trees === 'forest' ? [
        [0x143e22, 0x1c5a30, 0x0f3018, 0x246b38],
        [0x1a4a28, 0x12361c, 0x2a6a38, 0x0c2814],
        [0x1e5230, 0x164428, 0x2c6840, 0x102818],
      ] : S.trees === 'street' ? [
        [0x2f8a44, 0x3aaa58, 0x1f6a34, 0x46c068],
      ] : [
        [0x3a7a30, 0x4a8c38, 0x5a9a3e, 0x2e6a2c], // greens
        [0x44842f, 0x5c9636, 0x76a23a, 0x356f2c], // fresh green
        [0x2f6630, 0x3d7a36, 0x285a2c, 0x4a8a3c], // deep green
        [0xc49a34, 0xd2ae44, 0x9aa23a, 0xb8862e], // turning: ochre
        [0xb8642a, 0xa44e26, 0xc87c30, 0xc49a34], // turning: rust
        [0x3a7a30, 0xc49a34, 0xb8642a, 0x5a9a3e], // mixed
      ];
      const spots = [];
      const tryTree = (x, z, kind, pal) => {
        if (x < X0 + 30 || x > X1 - 30 || z < Z0 + 30 || z > Z1 - 30) return false;
        if (!free(x, z, 3)) return false;
        if (beyondWall(x, z) < 7) return false;
        const h = terrainAt(x, z, gi);
        if (h > (S.treeMaxH ?? 26) || (S.sea && h < S.sea.level + 1.2)) return false;
        const sc = (0.8 + R() * 1.1) * (S.treeScale || 1);
        if (!tryPlace('tree', x, z, null, 2.6 * sc)) return false;
        spots.push({ x, y: h, z, s: sc, kind, col: pal[Math.floor(R() * pal.length)], yaw: R() * 6.28 });
        return true;
      };
      const cluster = (cx, cz) => {
        const pal = palettes[Math.floor(R() * palettes.length)], sparse = S.trees === 'desert' || S.trees === 'street', rad = (sparse ? 14 : 6) + R() * 12, cnt = sparse ? 4 + Math.floor(R() * 7) : 14 + Math.floor(R() * (S.trees === 'forest' ? 26 : 32));
        const pine = R() < (S.trees === 'alpine' ? 0.46 : S.trees === 'forest' ? 0.62 : S.trees === 'street' ? 0.12 : 0.38);
        let n = 0;
        for (let k = 0; k < cnt * 2 && n < cnt; k++) {
          const a = R() * 6.28, r = Math.sqrt(R()) * rad;
          if (tryTree(cx + Math.cos(a) * r, cz + Math.sin(a) * r, R() < (pine ? 0.8 : 0.25) ? 0 : 1, pal)) n++;
        }
        return n;
      };
      // clusters hugging the circuit (so every view has trees), then scattered woods further out
      const nearCap = S.treeNear ?? 130, farCap = S.treeFar ?? 60;
      for (let c = 0, got = 0; c < 1500 && got < nearCap; c++) {
        const i = Math.floor(R() * N), sd = R() < 0.5 ? 1 : -1, w = sd > 0 ? T.leftWall[i] : T.rightWall[i], off = sd * (w + 11 + R() * 55);
        const cx = T.px[i] + T.nx[i] * off, cz = T.pz[i] + T.nz[i] * off;
        if (!free(cx, cz, 4) || beyondWall(cx, cz) < 9) continue;
        if (cluster(cx, cz)) got++;
      }
      for (let c = 0, got = 0; c < 900 && got < farCap; c++) {
        const cx = X0 + 50 + R() * (X1 - X0 - 100), cz = Z0 + 50 + R() * (Z1 - Z0 - 100);
        if (!free(cx, cz, 4) || beyondWall(cx, cz) < 9) continue;
        if (cluster(cx, cz)) got++;
      }
      // crown geometry: every vertex gets a baked shade (dark under and inside the crown, lit on top), multiplied by the instance colour
      const hash3 = (x, y, z) => { const v = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453; return v - Math.floor(v); };
      const shadeY = (g, lo = 0.5, hi = 1.06, tint = 0.1) => {
        g.computeBoundingBox(); const b = g.boundingBox, pa = g.attributes.position, n = pa.count, arr = new Float32Array(n * 3);
        for (let v = 0; v < n; v++) {
          const x = pa.getX(v), y = pa.getY(v), z = pa.getZ(v), t = (y - b.min.y) / Math.max(1e-3, b.max.y - b.min.y);
          const k = lerp(lo, hi, smoothstep(0, 1, t)) * (1 - tint / 2 + tint * hash3(Math.round(x * 4), Math.round(y * 4), Math.round(z * 4)));
          arr[v * 3] = k * (1 - 0.06 * t); arr[v * 3 + 1] = k; arr[v * 3 + 2] = k * (1 - 0.14 * t); // tops go a little warmer
        }
        g.setAttribute('color', new THREE.BufferAttribute(arr, 3)); return g;
      };
      const prep = (g) => { const ng = g.index ? g.toNonIndexed() : g; ng.deleteAttribute('uv'); return ng; };
      /** flat-faceted merge (conifers, fronds) */
      const clump = (parts) => shadeY(mergeGeometries(parts.map((g) => { const ng = prep(g); ng.computeVertexNormals(); return ng; })), 0.55, 1.05);
      /** lumpy leaf mass: a sphere pushed about by position noise, smooth normals so it reads as foliage volume, not a gem */
      const blob = (x, y, z, sx, sy, sz, seed) => {
        const g = prep(new THREE.IcosahedronGeometry(1, 1)), pa = g.attributes.position, na = g.attributes.normal;
        for (let v = 0; v < pa.count; v++) {
          const px = pa.getX(v), py = pa.getY(v), pz = pa.getZ(v), k = 0.8 + 0.42 * hash3(Math.round(px * 7) + seed, Math.round(py * 7), Math.round(pz * 7));
          na.setXYZ(v, px, py, pz); pa.setXYZ(v, px * k * sx + x, py * k * sy * (py < 0 ? 0.72 : 1) + y, pz * k * sz + z);
        }
        return g;
      };
      const firParts = [];
      for (const [r, h, y, ox, oz] of [[2.15, 2.5, 2.1, 0.08, -0.05], [1.75, 2.2, 3.55, -0.1, 0.08], [1.3, 1.95, 4.95, 0.06, -0.04], [0.85, 1.7, 6.2, 0, 0.03], [0.45, 1.3, 7.3, 0.02, 0]]) {
        const g = new THREE.ConeGeometry(r, h, 8); g.translate(ox, y, oz); firParts.push(g);
      }
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2 + 0.35, y = 2.5 + (k % 3) * 1.35;
        const g = new THREE.ConeGeometry(0.55, 1.9, 5);
        g.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(-Math.sin(a), 0, Math.cos(a)), 1.05));
        g.translate(Math.cos(a) * 1.2, y, Math.sin(a) * 1.2);
        firParts.push(g);
      }
      let pineG = clump(firParts);
      let roundG = shadeY(mergeGeometries([blob(0, 4.6, 0, 2.2, 1.75, 2.1, 1), blob(1.35, 3.8, 0.5, 1.5, 1.25, 1.4, 2), blob(-1.25, 3.6, -0.45, 1.45, 1.2, 1.5, 3), blob(0.2, 5.75, 0.2, 1.3, 1.1, 1.25, 4), blob(-0.3, 4.1, 1.3, 1.2, 1.05, 1.1, 5)]), 0.42, 1.08);
      let trunkPine = new THREE.CylinderGeometry(0.35, 0.5, 2.8, 5).translate(0, 1.4, 0);
      let trunkRound = trunkPine;
      let snowCapG = null;
      const dropUv = (g) => { g.deleteAttribute('uv'); return g; };
      if (S.trees === 'desert') {
        // saguaro-ish cactus (kind 0) + low scrub bush (kind 1); trunks shrink to nothing
        pineG = shadeY(mergeGeometries([bake(new THREE.CylinderGeometry(0.75, 0.85, 7, 6), 0, 3.5, 0, 0xffffff), bake(new THREE.CylinderGeometry(0.5, 0.5, 2.6, 6), 1.5, 3.6, 0, 0xffffff), bake(new THREE.CylinderGeometry(0.45, 0.5, 1.6, 6), 0.9, 2.5, 0, 0xffffff, 0, 1.8, 0.4, 0.9), bake(new THREE.CylinderGeometry(0.45, 0.45, 2.2, 6), -1.4, 4.4, 0, 0xffffff), bake(new THREE.CylinderGeometry(0.4, 0.45, 1.4, 6), -0.8, 3.5, 0, 0xffffff, 0, 1.6, 0.4, 0.9)]), 0.7, 1.05, 0.06);
        roundG = shadeY(mergeGeometries([blob(0, 0.9, 0, 2.0, 0.95, 1.9, 6), blob(1.3, 0.7, 0.6, 1.2, 0.7, 1.1, 7), blob(-1.1, 0.6, -0.7, 1.0, 0.6, 1.1, 8)]), 0.5, 1.05);
        trunkPine = trunkRound = new THREE.CylinderGeometry(0.01, 0.01, 0.01, 3);
      } else if (S.trees === 'coastal') {
        // palm (kind 0: bent trunk + drooping fronds) and round shrubs (kind 1, short trunk — not a second palm)
        // 4-sided trunks and five fronds: the silhouette stays a palm, the mesh is much lighter than a 5-side double trunk on every bush
        const fr = [];
        for (let k = 0; k < 7; k++) {
          const a = (k / 7) * Math.PI * 2 + 0.3;
          const g = new THREE.ConeGeometry(0.22, 3.4, 4);
          g.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(-Math.sin(a), 0, Math.cos(a)), 1.25));
          g.translate(Math.cos(a) * 1.35, 8.15, Math.sin(a) * 1.35);
          fr.push(g);
        }
        const crown = new THREE.ConeGeometry(0.45, 0.7, 5); crown.translate(0, 8.7, 0); fr.push(crown);
        pineG = clump(fr);
        trunkPine = mergeGeometries([dropUv(new THREE.CylinderGeometry(0.26, 0.42, 5.0, 4).translate(0, 2.5, 0)), dropUv(new THREE.CylinderGeometry(0.2, 0.28, 3.2, 4).translate(0.38, 6.3, 0))]);
        trunkRound = dropUv(new THREE.CylinderGeometry(0.22, 0.36, 1.4, 4).translate(0, 0.7, 0));
        roundG = shadeY(mergeGeometries([blob(0, 2.3, 0, 2.1, 1.5, 2.0, 9), blob(1.2, 1.8, 0.5, 1.4, 1.1, 1.3, 10), blob(-1.1, 1.7, -0.5, 1.3, 1.05, 1.4, 11)]), 0.45, 1.06);
      } else if (S.trees === 'alpine') {
        snowCapG = bake(new THREE.ConeGeometry(0.52, 1.05, 6), 0, 7.5, 0, 0xffffff);
      }
      const aoG = new THREE.CircleGeometry(2.8, 8).rotateX(-Math.PI / 2);
      const types = [{ g: pineG, trunk: trunkPine }, { g: roundG, trunk: trunkRound }];
      const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), p3 = new THREE.Vector3(), s3 = new THREE.Vector3(), ax = new THREE.Vector3(0, 1, 0), tc = new THREE.Color();
      types.forEach((ty, ti) => {
        const list = spots.filter((o) => o.kind === ti);
        const fol = new THREE.InstancedMesh(keep(ty.g), mats.foliage, list.length || 1);
        const trk = new THREE.InstancedMesh(keep(ty.trunk), mats.trunk, list.length || 1);
        const aoI = new THREE.InstancedMesh(keep(aoG), mats.aoInst, list.length || 1);
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
      if (snowCapG) {
        const list = spots.filter((o) => o.kind === 0);
        const cap = new THREE.InstancedMesh(keep(snowCapG), keep(std({ color: 0xf4f8fc })), list.length || 1);
        list.forEach((o, i) => {
          m4.compose(p3.set(o.x, o.y, o.z), q4.setFromAxisAngle(ax, o.yaw), s3.set(o.s, o.s, o.s));
          cap.setMatrixAt(i, m4);
        });
        cap.count = list.length; cap.frustumCulled = false; cap.castShadow = true; cap.receiveShadow = true; group.add(cap);
      }
      group.userData.trees = types;
    }
    // scattered rocks: one instanced mesh, density follows the quality preset
    {
      const spots = [];
      const capN = S.trees === 'street' ? 24 : S.trees === 'desert' ? 70 : 110;
      for (let k = 0, got = 0; k < 500 && got < capN; k++) {
        const i = Math.floor(R() * N), sd = R() < 0.5 ? 1 : -1, w = sd > 0 ? T.leftWall[i] : T.rightWall[i];
        const off = sd * (w + 5 + R() * 48);
        const x = T.px[i] + T.nx[i] * off, z = T.pz[i] + T.nz[i] * off, sc = 0.55 + R() * 1.7;
        if (x < X0 + 20 || x > X1 - 20 || z < Z0 + 20 || z > Z1 - 20) continue;
        if (!tryPlace('rock', x, z, null, 1.3 * sc)) continue;
        spots.push({ x, y: lastGround.hi - 0.15 * sc, z, s: sc, yaw: R() * 6.28, sy: 0.45 + R() * 0.7, tint: R() });
      }
      const rockMat = keep(std({ roughness: 0.94, metalness: 0.02 }));
      const rocks = new THREE.InstancedMesh(keep(new THREE.DodecahedronGeometry(1, 0)), rockMat, spots.length || 1);
      const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), p3 = new THREE.Vector3(), s3 = new THREE.Vector3(), ax = new THREE.Vector3(0, 1, 0), tc = new THREE.Color();
      const baseHex = S.trees === 'desert' ? 0xb4835a : S.trees === 'alpine' ? 0x8d8680 : S.night ? 0x6a5344 : 0x7d756c;
      spots.forEach((o, i) => {
        m4.compose(p3.set(o.x, o.y, o.z), q4.setFromAxisAngle(ax, o.yaw), s3.set(o.s, o.s * o.sy, o.s * (0.8 + (i % 4) * 0.08)));
        rocks.setMatrixAt(i, m4);
        rocks.setColorAt(i, tc.setHex(baseHex).offsetHSL(0, 0, (o.tint - 0.5) * 0.18));
      });
      rocks.count = spots.length; rocks.frustumCulled = false; rocks.castShadow = true; rocks.receiveShadow = true; rocks.name = 'rocks'; group.add(rocks);
      group.userData.rocks = { mesh: rocks, n: spots.length };
    }
    addMesh(aoB, mats.ao, 'ao', false, false).renderOrder = 1;

    // ---- clouds ----
    if (S.clouds) {
      // soft cumulus billboards (one merged mesh, one canvas texture with 4 cloud variants), each turned toward the circuit's centre
      const tex = keep(cloudTexture(R));
      mats.cloud.dispose(); mats.cloud = keep(new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, fog: false, color: new THREE.Color(S.cloudTint ?? 0.92, S.cloudTint ?? 0.92, S.cloudTint ?? 0.92) }));
      let mx = 0, mz = 0; for (let i = 0; i < N; i++) { mx += T.px[i]; mz += T.pz[i]; } mx /= N; mz /= N;
      const pos = [], uv = [], idx = [];
      for (let k = 0; k < 18; k++) {
        const a = R() * Math.PI * 2, r = 480 + R() * 420, cx = mx + Math.cos(a) * r, cz = mz + Math.sin(a) * r, cy = 160 + R() * 150;
        const w = 170 + R() * 190, h = w * (0.34 + R() * 0.14), v = Math.floor(R() * 4), yaw = Math.atan2(mx - cx, mz - cz);
        // one card per cloud, turned toward the circuit (crossed cards showed up as thin vertical blades from the chase camera)
        for (let q = 0; q < 1; q++) {
          const ang = yaw + q * 1.05, ux = Math.cos(ang), uz = -Math.sin(ang), wq = w * (q === 0 ? 1 : 0.72), hq = h * (q === 0 ? 1 : 0.8);
          const y0 = cy, base = pos.length / 3;
          for (const [sx, sy] of [[-1, 0], [1, 0], [1, 1], [-1, 1]]) {
            pos.push(cx + ux * sx * wq / 2, y0 + sy * hq, cz + uz * sx * wq / 2);
            uv.push((v % 2) * 0.5 + (sx > 0 ? 0.5 : 0), Math.floor(v / 2) * 0.5 + sy * 0.5);
          }
          idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
        }
      }
      const cg = keep(new THREE.BufferGeometry());
      cg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); cg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); cg.setIndex(idx);
      clouds = new THREE.Mesh(cg, mats.cloud); clouds.frustumCulled = false; clouds.renderOrder = -8; clouds.name = 'clouds'; group.add(clouds);
    }

    // ---- distant horizon: layered silhouettes past the terrain, pre-mixed with the horizon haze (unlit, no fog, one draw call) ----
    {
      const kind = S.horizon || (S.trees === 'alpine' ? 'peaks' : S.neon ? 'city' : S.trees === 'desert' ? 'mesa' : 'hills');
      let mx = 0, mz = 0; for (let i = 0; i < N; i++) { mx += T.px[i]; mz += T.pz[i]; } mx /= N; mz /= N;
      const haze = C(S.sky.bot), tc = new THREE.Color();
      const mix = (hex, k) => { tc.setHex(hex).lerp(haze, k); return [tc.r, tc.g, tc.b]; };
      const pos = [], col = [], uv = [];
      const pushV = (x, y, z, c, u = 0, v = 0) => { pos.push(x, y, z); col.push(c[0], c[1], c[2]); uv.push(u, v); };
      const wet = (x, z) => S.sea && S.sea.mask(x, z) > 0.25;
      if (kind === 'city') {
        // skyline: flat building slabs facing the circuit, window texture (lit windows stay below the bloom threshold)
        const HR = rng(91);
        for (let k = 0; k < 150; k++) {
          const a = (k / 150) * Math.PI * 2 + HR() * 0.02, r = 760 + HR() * 220, cx = mx + Math.cos(a) * r, cz = mz + Math.sin(a) * r;
          const w = 34 + HR() * 50, h = 50 + HR() * HR() * 190, ux = -Math.sin(a), uz = Math.cos(a), base = -30;
          const f = 0.8 - (r - 760) / 220 * 0.3, c = [f * [0.9, 1, 0.85][k % 3], f * 0.9, f], u0 = HR(), uw = w / 120, vh = h / 120; // brightness only: colour lives in the texture
          const A = [cx - ux * w / 2, cz - uz * w / 2], B = [cx + ux * w / 2, cz + uz * w / 2];
          pushV(A[0], base, A[1], c, u0, 0); pushV(B[0], base, B[1], c, u0 + uw, 0); pushV(B[0], base + h, B[1], c, u0 + uw, vh);
          pushV(A[0], base, A[1], c, u0, 0); pushV(B[0], base + h, B[1], c, u0 + uw, vh); pushV(A[0], base + h, A[1], c, u0, vh);
        }
      } else {
        const layers = kind === 'peaks' ? [[1010, 1, 0.5], [900, 0.75, 0.3]] : [[1000, 1, 0.55], [880, 0.7, 0.35]];
        const rock = kind === 'peaks' ? 0x3c4a5e : kind === 'mesa' ? (S.night ? 0x1c1830 : 0xa0603a) : (S.trees === 'forest' ? 0x1c3a2a : 0x3f6a3a);
        const top = kind === 'peaks' ? 0xe8eef6 : kind === 'mesa' ? (S.night ? 0x2a2440 : 0xc08050) : (S.trees === 'forest' ? 0x2a4a34 : 0x5a8a4a);
        layers.forEach(([rad, amp, hz], li) => {
          const NS = 220, ph = li * 2.1 + (tr.seed ?? 7);
          const hAt = (a) => {
            if (kind === 'peaks') { let v = 0; for (const [f, w] of [[5, 0.5], [11, 0.3], [23, 0.2]]) v += w * (1 - Math.abs(Math.sin(a * f * 0.5 + ph * f))); return 40 + 230 * amp * v * v; }
            if (kind === 'mesa') { const v = Math.sin(a * 3 + ph) * 0.5 + Math.sin(a * 7.3 + ph * 2) * 0.35 + Math.sin(a * 17 + ph) * 0.15; return 10 + 95 * amp * smoothstep(0.05, 0.25, v); }
            return 20 + 70 * amp * (0.55 + 0.3 * Math.sin(a * 4 + ph) + 0.15 * Math.sin(a * 13 + ph * 3));
          };
          for (let k = 0; k < NS; k++) {
            const a0 = (k / NS) * Math.PI * 2, a1 = ((k + 1) / NS) * Math.PI * 2;
            const P0 = [mx + Math.cos(a0) * rad, mz + Math.sin(a0) * rad], P1 = [mx + Math.cos(a1) * rad, mz + Math.sin(a1) * rad];
            let h0 = hAt(a0), h1 = hAt(a1);
            if (wet(P0[0], P0[1])) h0 = -12; if (wet(P1[0], P1[1])) h1 = -12;
            const base = -45, cB = mix(rock, Math.min(1, hz + 0.3)), cM = mix(rock, hz), cT0 = mix(h0 > 150 ? top : kind === 'peaks' ? 0x52627a : top, hz * 0.8), cT1 = mix(h1 > 150 ? top : kind === 'peaks' ? 0x52627a : top, hz * 0.8);
            const m0 = h0 * 0.62, m1 = h1 * 0.62;
            pushV(P0[0], base, P0[1], cB); pushV(P1[0], base, P1[1], cB); pushV(P1[0], m1, P1[1], cM);
            pushV(P0[0], base, P0[1], cB); pushV(P1[0], m1, P1[1], cM); pushV(P0[0], m0, P0[1], cM);
            pushV(P0[0], m0, P0[1], cM); pushV(P1[0], m1, P1[1], cM); pushV(P1[0], h1, P1[1], cT1);
            pushV(P0[0], m0, P0[1], cM); pushV(P1[0], h1, P1[1], cT1); pushV(P0[0], h0, P0[1], cT0);
          }
        });
      }
      const hg = keep(new THREE.BufferGeometry());
      hg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); hg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); hg.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      const hm = keep(new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, side: THREE.DoubleSide, map: kind === 'city' ? keep(windowTexture()) : null }));
      const horizon = new THREE.Mesh(hg, hm); horizon.name = 'horizon'; horizon.frustumCulled = false; horizon.renderOrder = -9; group.add(horizon);
      // (nearer relief comes from the terrain itself: see `hills` in terrainAt)
    }

    // ---- sea (coastal): flat water plane following the camera ----
    if (S.sea) {
      S.sea.color = new THREE.Color(S.sea.water);
      sea = new THREE.Mesh(keep(new THREE.PlaneGeometry(4000, 4000).rotateX(-Math.PI / 2)), keep(std({ color: S.sea.color, roughness: 0.18, metalness: 0.1, envMapIntensity: 1.4 })));
      sea.position.y = S.sea.level; sea.receiveShadow = true; sea.frustumCulled = false; sea.name = 'sea'; group.add(sea);
    }
    // ---- night: stars + floodlight masts (emissive heads; the lighting itself is the moon + hemisphere fill) ----
    if (S.night) {
      const sp = [], sc = [];
      for (let k = 0; k < 700; k++) {
        const u = R() * 2 - 1, a = R() * Math.PI * 2, y = Math.abs(u) * 0.9 + 0.08, r = Math.sqrt(1 - y * y);
        sp.push(Math.cos(a) * r * 900, y * 900, Math.sin(a) * r * 900); const b = 0.55 + R() * 0.45; sc.push(b, b, b * (0.9 + R() * 0.1));
      }
      const sg = keep(new THREE.BufferGeometry()); sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); sg.setAttribute('color', new THREE.Float32BufferAttribute(sc, 3));
      stars = new THREE.Points(sg, keep(new THREE.PointsMaterial({ size: 2, sizeAttenuation: false, vertexColors: true, fog: false, depthWrite: false })));
      stars.frustumCulled = false; stars.renderOrder = -9; group.add(stars);
      const fb = new Builder(), heads = [], poolSpots = [];
      for (let k = 0, got = 0; k < 60 && got < 34; k++) {
        const s = (k + 0.5) * (L / 60), i = Math.floor(s / T.ds) % N, sd = (k & 1) ? 1 : -1;
        if (sd > 0 && T.pitTaper[i] > 0.02) continue;
        const w = (sd > 0 ? T.leftWall[i] : T.rightWall[i]) + 4, p = T.at(s, sd * w), th = T.thetaAt(s);
        if (!free(p.x, p.z, 2) || !tryPlace('floodlight', p.x, p.z, null, 1.2)) continue;
        const y = lastGround.hi;
        fb.box(p.x, y + 9, p.z, 0.6, 18, 0.6, th, 0x6d7480);
        fb.box(p.x - Math.cos(th) * sd * 0.6, y + 18, p.z + Math.sin(th) * sd * 0.6, 0.7, 1.6, 4.2, th, 0x2a2d36);
        heads.push([p.x - Math.cos(th) * sd * 1.0, y + 18, p.z + Math.sin(th) * sd * 1.0, th]);
        { const q = T.at(s, sd * Math.max(0, w - 9)); poolSpots.push([q.x, q.y + 0.09, q.z]); }
        reserve(p.x, p.z, 3); got++;
      }
      addMesh(fb, mats.deco, 'floodmasts', true, true);
      floods = new THREE.InstancedMesh(BOX, keep(new THREE.MeshBasicMaterial({ color: new THREE.Color(0xfff6d8).multiplyScalar(3), fog: false })), Math.max(1, heads.length));
      const m4 = new THREE.Matrix4();
      heads.forEach(([x, y, z, th], n) => floods.setMatrixAt(n, m4.compose(_v.set(x, y, z), _q.setFromEuler(_e.set(0, th, 0)), _s.set(0.3, 1.2, 3.8))));
      floods.count = heads.length; floods.frustumCulled = false; group.add(floods);
      // light pools on the track under each mast (additive radial decals; the moon stays the only real light)
      const pg = keep(new THREE.CircleGeometry(1, 24).rotateX(-Math.PI / 2)), pc = new Float32Array(pg.attributes.position.count * 3);
      for (let v = 0; v < pg.attributes.position.count; v++) { const x = pg.attributes.position.getX(v), z = pg.attributes.position.getZ(v), k = Math.max(0, 1 - Math.hypot(x, z)); pc.set([k, k * 0.95, k * 0.82], v * 3); }
      pg.setAttribute('color', new THREE.BufferAttribute(pc, 3));
      const pools = new THREE.InstancedMesh(pg, keep(new THREE.MeshBasicMaterial({ vertexColors: true, color: new THREE.Color(S.neon ? 0.11 : 0.15, S.neon ? 0.1 : 0.14, S.neon ? 0.12 : 0.12), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, polygonOffset: true, polygonOffsetFactor: -7, polygonOffsetUnits: -7 })), Math.max(1, poolSpots.length));
      poolSpots.forEach(([x, y, z], n) => pools.setMatrixAt(n, m4.compose(_v.set(x, y, z), _q.identity(), _s.set(16, 1, 16))));
      pools.count = poolSpots.length; pools.frustumCulled = false; pools.renderOrder = 2; pools.name = 'floodpools'; group.add(pools);
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
    if (S.rainParticles) {
      const COUNT = 180;
      rainBits = new THREE.InstancedMesh(keep(new THREE.BoxGeometry(0.07, 1.5, 0.07)), keep(new THREE.MeshBasicMaterial({ color: 0xd5e6f6, transparent: true, opacity: 0.5, depthWrite: false })), COUNT);
      rainBits.frustumCulled = false; rainBits.count = COUNT; rainBits.name = 'rainbits';
      for (let i = 0; i < COUNT; i++) rainData.push({ x: 0, y: -999, z: 0, v: 16 + R() * 14, age: 1 });
      group.add(rainBits);
    }

    scene.add(group);
    setWeather(state);
    // shadow pass: three's single internal depth material would otherwise re-resolve its program on every plain/instanced/instance-colour switch; plain casters keep the default
    const depthInst = keep(new THREE.MeshDepthMaterial()), depthInstColor = keep(new THREE.MeshDepthMaterial());
    group.traverse((o) => { if (o.isInstancedMesh && o.castShadow) o.customDepthMaterial = o.instanceColor ? depthInstColor : depthInst; });
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
      for (const [v, b] of [[A, b0], [B, b0], [Cc, b1], [A, b0], [Cc, b1], [D, b1]]) { pos.push(v[0], v[1], v[2]); col.push(b * 0.13, b * 0.12, b * 0.085); }
    }
    const cg = new THREE.BufferGeometry();
    cg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); cg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    headCones = new THREE.InstancedMesh(cg, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, side: THREE.DoubleSide, forceSinglePass: true, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6 }), n); // single pass: additive, so draw order doesn't change the look
    headCones.frustumCulled = false; headCones.visible = false; headCones.renderOrder = 2;
    carLights = new THREE.InstancedMesh(BOX, new THREE.MeshBasicMaterial({ color: new THREE.Color(0xfff4c0).multiplyScalar(2.4), fog: false }), n * 2);
    tailLights = new THREE.InstancedMesh(BOX, new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff2a1a).multiplyScalar(3), fog: false }), n * 2);
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
    const crewMat = keep(std({ vertexColors: true }));
    const team = TEAMS[0];
    crewRig = { group: new THREE.Group(), people: [], tires: [], jacks: [], sign: null, teamMat: crewMat, ready: false };
    for (let i = 0; i < 7; i++) {
      const m = new THREE.Mesh(keep(personGeo(team.c1, team.c2)), crewMat); m.castShadow = true; m.frustumCulled = false;
      crewRig.group.add(m); crewRig.people.push(m);
    }
    for (let i = 0; i < 4; i++) {
      const t = new THREE.Mesh(keep(mergeGeometries([bake(new THREE.CylinderGeometry(0.45, 0.45, 0.5, 8).rotateZ(Math.PI / 2), 0, 0, 0, 0x1a1a1e), bake(new THREE.CylinderGeometry(0.47, 0.47, 0.12, 8).rotateZ(Math.PI / 2), 0, 0, 0, 0xffffff)])), keep(std({ vertexColors: true })));
      t.castShadow = true; t.visible = false; t.frustumCulled = false; crewRig.group.add(t); crewRig.tires.push(t);
    }
    for (let i = 0; i < 2; i++) {
      const j = new THREE.Mesh(keep(mergeGeometries([bake(BOX, 0, 0.25, 0, 0xffd21f, 0, 0.8, 0.5, 0.8), bake(BOX, 0, 0.9, 0, 0x555a66, 0, 0.25, 1.0, 0.25)])), keep(std({ vertexColors: true })));
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
        // team colours (a custom player livery overrides the stock team swatch)
        const tm = I.colors || TEAMS[I.teamIndex % TEAMS.length];
        const teamKey = I.teamIndex + ':' + tm.c1 + ':' + tm.c2;
        if (crewRig.teamKey !== teamKey) {
          crewRig.teamKey = teamKey;
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

  const cTop = [new THREE.Color(S.sky.top), new THREE.Color(S.sky.rainTop)];
  const cBot = [new THREE.Color(S.sky.bot), new THREE.Color(S.sky.rainBot)];
  const tmpCol = new THREE.Color();
  function setWeather(w) {
    state.rain = clamp(w.rain ?? state.rain, 0, 1); state.wet = clamp(w.wetness ?? state.wet, 0, 1);
    if (!scene) return;
    const r = Math.max(state.rain, S.ambientRain || 0), wt = Math.max(state.wet, S.ambientWet || 0);
    visRain = r;
    sky.material.uniforms.top.value.copy(cTop[0]).lerp(cTop[1], r);
    sky.material.uniforms.bot.value.copy(cBot[0]).lerp(cBot[1], r);
    sky.material.uniforms.sunAmt.value = S.sky.sunGlow * (1 - r);
    scene.fog.color.copy(sky.material.uniforms.bot.value); scene.background.copy(scene.fog.color);
    view.fogNear = lerp(S.fog[0], S.fog[0] * 0.75, r); view.fogFar = lerp(S.fog[1], S.fog[1] * 0.77, r);
    sun.intensity = lerp(S.sun.intensity, S.sun.rainIntensity, r); hemi.intensity = lerp(S.hemi.intensity, S.hemi.intensity * 0.84, r);
    sun.color.setHex(S.sun.color).lerp(tmpCol.setHex(S.sun.rainColor), r);
    hemi.color.setHex(S.hemi.sky).lerp(tmpCol.setHex(0x93a6c0), r * (S.night ? 0.3 : 1));
    hemi.groundColor.setHex(S.hemi.ground).lerp(tmpCol.setHex(0x3f5a4a), r * (S.night ? 0.3 : 1));
    mats.asphalt.color.setRGB(1, 1, 1).lerp(tmpCol.setRGB(0.56, 0.6, 0.67), wt);
    // wet track: roughness drops, the env map (neon street: coloured signs) shows up as reflections
    mats.asphalt.roughness = mats.pit.roughness = lerp(S.mood.asphalt, Math.min(S.mood.asphalt, 0.3), wt);
    mats.asphalt.envMapIntensity = mats.pit.envMapIntensity = lerp(S.mood.asphaltEnv, S.mood.asphaltEnv + 1.1, wt);
    mats.pit.color.copy(mats.asphalt.color);
    mats.terrain.color.setRGB(1, 1, 1).lerp(tmpCol.setRGB(0.85, 0.9, 0.92), r);
    mats.cloud.color.setScalar(S.cloudTint ?? 0.92).lerp(tmpCol.setRGB(0.62, 0.66, 0.72), r);
    mats.gravel.color.setRGB(1, 1, 1).lerp(tmpCol.setRGB(0.7, 0.7, 0.72), wt);
    mats.ao.opacity = mats.aoInst.opacity = 0.26 + 0.03 * r;
    const t0 = S.fx.tint;
    fx.rain = r; fx.sat = S.fx.sat * (1 - 0.3 * r); fx.tint = [t0[0] * (1 - 0.2 * r), t0[1] * (1 - 0.13 * r), t0[2] * (1 - 0.03 * r)];
    if (splash) splash.visible = r > 0.03;
  }

  /** 0 = lowest (fewer props) .. 2 = full; `size` = sun shadow map resolution of the graphics preset */
  function setQuality(level, size = quality >= 2 ? 2048 : 1024) {
    quality = clamp(Math.round(level), 0, 2);
    if (!scene) return;
    sun.castShadow = true; // soft PCF shadows on every preset; Low just uses a smaller map
    if (size !== shadowSize) { shadowSize = size; sun.shadow.mapSize.set(size, size); sun.shadow.map?.dispose(); sun.shadow.map = null; }
    const trees = group.userData.trees || [];
    for (const t of trees) for (const m of t.meshes) m.count = Math.floor(t.n * (quality >= 2 ? 1 : quality === 1 ? 0.7 : 0.4));
    if (group.userData.rocks) { const r = group.userData.rocks; r.mesh.count = Math.floor(r.n * (quality >= 2 ? 1 : quality === 1 ? 0.6 : 0.3)); }
    if (splash) splash.userData.cap = quality >= 2 ? splash.userData.max : quality === 1 ? 160 : 70;
    mats.asphalt?.userData.setRoadBump?.(quality >= 1); // Low: albedo detail only, no micro-bump taps
  }

  let time = 0;
  const _sunT = new THREE.Vector3(), _r = new THREE.Vector3(), _u = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0);
  const _gm = new THREE.Matrix4(), _gs = new THREE.Vector3(1, 1, 1);
  function update(dt, camera, v = null) {
    if (!scene) return;
    time += dt; fx.time = time;
    const fxp = v || { x: camera.position.x, y: 0, z: camera.position.z, half: 90, dist: 40 };
    sky.position.copy(camera.position);
    if (clouds) clouds.visible = camera.position.y < 260;
    if (sea) { sea.position.x = camera.position.x; sea.position.z = camera.position.z; sea.material.color.copy(S.sea.color).offsetHSL(0, 0, Math.sin(time * 0.7) * 0.012); }
    if (stars) stars.position.copy(camera.position);
    if (group.userData.beacon) group.userData.beacon.rotation.y = time * 0.9;
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
      const cap = Math.min(splash.userData.cap ?? splash.userData.max, Math.floor(splash.userData.max * smoothstep(0.03, 0.8, visRain)));
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
    if (rainBits) {
      const on = visRain > 0.04;
      rainBits.visible = on;
      if (on) {
        const rad = clamp((v ? v.dist : 40) * 0.65, 16, 64);
        const fx = v || { x: camera.position.x, y: camera.position.y, z: camera.position.z };
        for (let i = 0; i < rainData.length; i++) {
          const s = rainData[i];
          s.y -= s.v * dt; s.age += dt;
          if (s.y < fx.y - 4) {
            const a = Math.random() * 6.283, rr = Math.sqrt(Math.random()) * rad;
            s.x = fx.x + Math.cos(a) * rr; s.z = fx.z + Math.sin(a) * rr; s.y = fx.y + 6 + Math.random() * 18; s.age = 0;
          }
          _gm.makeTranslation(s.x, s.y, s.z);
          rainBits.setMatrixAt(i, _gm);
        }
        rainBits.instanceMatrix.needsUpdate = true;
      }
    }
    // headlights on in rain
    if (headCones) updateCarLights((S.night || state.rain > 0.05) && carMeshes.length > 0, S.night ? 1 : smoothstep(0.05, 0.4, state.rain));
    updatePit(dt, time);
  }

  /** apply this theme's look to the post pipeline + environment map (called after build and on graphics preset change) */
  function applyMood(post) {
    if (!scene || !post) return;
    const M = S.mood;
    post.setMood({ exposure: M.exposure, bloom: M.bloom, aoBlend: M.ao, contrast: M.contrast, sat: M.sat, vignette: M.vignette });
    scene.environment = post.env(M.envKind); scene.environmentIntensity = M.env;
  }
  function setStartLights(count, green = false) {
    lightMats.forEach((m, i) => m.color.setHex(green ? 0x35ff60 : i < count ? 0xff2a1a : 0x3a0c0a));
  }

  function dispose() {
    if (scene) { scene.remove(group); scene.fog = prevFog; scene.background = prevBg; }
    for (const o of disposables) o.dispose?.();
    sun?.shadow.map?.dispose();
    group.clear();
    lightMats.length = 0; disposables.length = 0; placements.length = 0; hills.length = 0; scene = null; crewRig = null; flagData = []; splashData = []; reserved.length = 0;
    sea = stars = floods = clouds = ferris = gondolas = flags = splash = rainBits = headCones = carLights = tailLights = null; rainData = []; visRain = 0; carMeshes = []; group.userData = {};
  }

  return { name: S.name, style: S, group, placements, groundAt: gy, build, dispose, setWeather, update, setStartLights, setCars, setPit, setQuality, applyMood, fx, get quality() { return quality; } };
}
