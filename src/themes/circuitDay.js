// Theme "Circuit Day": all environment art (terrain, track surfaces, props, sky, lights, rain).
// Theme interface: { name, build(scene, track), dispose(), setWeather({rain, wetness}), update(dt, camera, time),
//                    setStartLights(count, green), setCars(meshes), setPit(info), setQuality(level), fx }
// update(dt, camera, view): view = { x, y, z, half, dist } = shadow/fog focus point, shadow half-extent, camera->focus distance.
// `fx` is read by the post pass each frame: { rain, sat, tint[3], time, lift } (lift = metres the player car is jacked up).
// Nothing here touches path/physics/cars, so another theme can be swapped in at runtime.
import * as THREE from 'three';
import { smoothstep, lerp, wrapDelta, clamp } from '../physics.js';
import { TEAMS } from '../teams.js';
import { broadleaf, conifer, palm, shrub, cactus, tuft, farTree, leafAtlas } from './foliage.js';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
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
  ground: { g1: 0x5a843c, g2: 0x4f7836, far: 0x486c36, rock: 0x8a8470, amp: 24, rockFrom: 34, patch: [0.6, 0.55, 0.34], patchAmt: 0.5, patch2: [0.4, 0.47, 0.36], patch2Amt: 0.55, hills: { n: 12, h: [14, 30], r: [70, 130] },
    slope: { color: 0x8a8470, from: 0.10, to: 0.24, amt: 0.9 }, strata: { scale: 2.6, amt: 0.25 }, grid: null },
  gravel: [0xd8c18c, 0xcdb680],
  // road: asphalt base colour, rubber build-up, off-line dust colour / amount, micro-bump
  road: { color: 0x4b4e53, rubber: 1, dust: [0.5, 0.46, 0.4], dustAmt: 0.3, bump: 0.5 },
  barrier: 'mixed',   // 'mixed' = concrete + catch fence where it is tight, Armco guardrail on the open run-offs | 'concrete'
  houses: 'farm',     // scenery buildings beyond the barriers: 'farm' | 'chalet' | 'villa' | 'adobe' | 'cabin' | null
  facade: { h: 0.32, amt: 0.14 }, // building facade courses: joint spacing in world y (m) and joint darkening
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

/**
 * One pod on the start gantry. Lit pods are a bright red; pods that are out stay a visible dim red.
 * `anyOn` is true while the countdown still has at least one lamp lit, so the dark pods read as glass, not holes.
 * There is no green state: release is lights-out.
 */
export function startPodColor(lit, anyOn) {
  if (lit) return [2.6, 0.2, 0.1];
  return anyOn ? [0.38, 0.05, 0.035] : [0.16, 0.03, 0.025];
}

/** Pit-lane colours and a few structural flags. Geometry stays in the shared facade / prop meshes. */
function pitLook(S) {
  switch (S.name) {
    case 'desertNight':
      return { wall: 0xc4956a, plinth: 0x8a5a32, upper: 0xd7b07a, roof: 0x6e4030, fascia: 0x4a2c1c, accent: 0xe8c070, door: 0x3a2418, trim: 0xf3e2c4, awning: 0xc45c38, canopy: 0xe6d2a4, crenel: false, snow: false, neon: false, glow: 0xe8a050 };
    case 'alpine':
      return { wall: 0xf3ece2, plinth: 0x5c4030, upper: 0xf7f3ec, roof: 0x3e2a1c, fascia: 0x3e2a1c, accent: 0x8b1e1e, door: 0x2a1c14, trim: 0x6b4530, awning: 0x6b4530, canopy: 0x4a3020, crenel: false, snow: true, neon: false, glow: 0 };
    case 'neonStreet':
      return { wall: 0x1a2030, plinth: 0x10141c, upper: 0x222838, roof: 0x0c1018, fascia: 0x141820, accent: 0xff2bd6, door: 0x07080c, trim: 0x3a4458, awning: 0x12161e, canopy: 0x10141c, crenel: false, snow: false, neon: true, glow: 0x27f0ff };
    case 'coastal':
      return { wall: 0xf6f3ea, plinth: 0xd4c4a0, upper: 0xfffaf4, roof: 0xc45a3a, fascia: 0x1a6eae, accent: 0x1a78b8, door: 0x243e58, trim: 0x1a78b8, awning: 0xf7f4ee, canopy: 0xf4f0e6, crenel: false, snow: false, neon: false, glow: 0 };
    case 'forest':
      return { wall: 0x6a5340, plinth: 0x3a2c22, upper: 0x5a4636, roof: 0x243628, fascia: 0x241810, accent: 0x3d6b3a, door: 0x1a120e, trim: 0x8a6a48, awning: 0x2c4a30, canopy: 0x3a2a1c, crenel: false, snow: false, neon: false, glow: 0 };
    case 'circuitDay':
      return { wall: 0xb7b1a6, plinth: 0x6e6860, upper: 0xc8c2b6, roof: 0x4a453e, fascia: 0x3a342c, accent: 0x8d2a22, door: 0x2a2622, trim: 0x8a8478, awning: 0x7a2e28, canopy: 0x5c564e, crenel: true, snow: false, neon: false, glow: 0 };
    default:
      return { wall: 0xb7b1a6, plinth: 0x6e6860, upper: 0xc8c2b6, roof: 0x4a453e, fascia: 0x3a342c, accent: 0x8d2a22, door: 0x2a2622, trim: 0x8a8478, awning: 0x7a2e28, canopy: 0x5c564e, crenel: true, snow: false, neon: false, glow: 0 };
  }
}

/** 2x2 atlas of soft cumulus puffs (white tops, slightly grey flat bases), alpha-blended. No canvas in Node: returns a 1x1 texture there. */
function cloudTexture(R) {
  if (typeof document === 'undefined') return new THREE.DataTexture(new Uint8Array([255, 255, 255, 128]), 1, 1);
  const S = 256, c = document.createElement('canvas'); c.width = c.height = S * 2;
  const g = c.getContext('2d');
  if (!g?.createRadialGradient?.(0, 0, 0, 0, 0, 1)) return new THREE.DataTexture(new Uint8Array([255, 255, 255, 128]), 1, 1); // stub canvas (tests)
  for (let v = 0; v < 4; v++) {
    const ox = (v % 2) * S, oy = (1 - Math.floor(v / 2)) * S; // canvas y is flipped vs uv
    g.save(); g.beginPath(); g.rect(ox, oy, S, S); g.clip();
    // three rows of puffs: a wide soft base, a medium middle and small bright tops, so each card reads as a cumulus bank
    const puffs = 14 + Math.floor(R() * 7), nb = Math.round(puffs * 0.4), nm = Math.round(puffs * 0.35);
    for (let k = 0; k < puffs; k++) {
      const row = k < nb ? 0 : k < nb + nm ? 1 : 2, nRow = row === 0 ? nb : row === 1 ? nm : puffs - nb - nm, kk = row === 0 ? k : row === 1 ? k - nb : k - nb - nm;
      const t = (kk + 0.5) / nRow, spread = [0.76, 0.56, 0.38][row];
      const x = ox + S * (0.5 + (t - 0.5) * spread + (R() - 0.5) * 0.06);
      const r = S * ([0.12, 0.1, 0.075][row] + 0.05 * Math.sin(Math.PI * t) + R() * 0.03);
      const y = oy + S * ([0.72, 0.58, 0.45][row] + (R() - 0.5) * 0.05);
      const gr = g.createRadialGradient(x, y - r * 0.3, r * 0.1, x, y, r);
      const a0 = [0.7, 0.85, 0.97][row];
      gr.addColorStop(0, `rgba(255,255,255,${a0})`); gr.addColorStop(0.55, `rgba(244,247,252,${a0 * 0.75})`); gr.addColorStop(1, 'rgba(225,232,242,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    }
    // grey-blue shaded underside
    const base = g.createLinearGradient(0, oy + S * 0.45, 0, oy + S * 0.84);
    base.addColorStop(0, 'rgba(170,184,206,0)'); base.addColorStop(1, 'rgba(150,166,192,0.5)');
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
  let startLights = null;
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
      // mesas: steep flanks, sharp rims and a slightly uneven top; mounds: ridged noise so they read as eroded hills, not blobs
      noise += H.flat ? H.h * smoothstep(0.05, 0.3, u) + (u > 0 ? 0.06 * H.h * vnoise(x / 23, z / 23) * smoothstep(0.05, 0.3, u) : 0)
        : H.h * u * u + H.h * u * 0.22 * (1 - Math.abs(2 * vnoise(x / 31 + H.ph, z / 31) - 1)) * smoothstep(40, 120, e);
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
    mats.terrain = keep(worldDetail(lit(), { fine: 0.2, fineScale: 5.3, mid: 0.2, midScale: 13, coarse: 0.16, coarseScale: 83, bump: 0.3, patch: GP.patch, patchAmt: GP.patchAmt ?? 0, patch2: GP.patch2, patch2Amt: GP.patch2Amt ?? 0, slope: GP.slope || null, strata: GP.strata || null, grid: GP.grid || null }));
    // built surfaces (barriers, stands, buildings): faint weathering that also runs down vertical faces
    mats.deco = keep(worldDetail(lit(), { fine: 0.07, fineScale: 3.1, mid: 0.1, midScale: 7.3, coarse: 0.07, coarseScale: 31, vertical: true }));
    // building walls: same weathering plus world-space masonry / cladding courses; glazing reflects the sky; night windows glow (<= 1.0, no bloom halo)
    mats.facade = keep(worldDetail(lit(), { fine: 0.07, fineScale: 3.1, mid: 0.1, midScale: 7.3, coarse: 0.07, coarseScale: 31, vertical: true, courses: S.facade }));
    mats.glass = keep(std({ color: 0x1c2630, roughness: 0.12, metalness: 0.2, envMapIntensity: 1.2 }));
    if (S.night) mats.glow = keep(new THREE.MeshBasicMaterial({ vertexColors: true }));
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
    mats.trunk = keep(worldDetail(std({ color: 0x6a4426, vertexColors: true }), { fine: 0.25, fineScale: 0.9, mid: 0.15, midScale: 3, coarse: 0, vertical: true }));
    mats.leaf = keep(worldDetail(std({ vertexColors: true, map: leafAtlas(), alphaTest: 0.38, roughness: 0.8 }), { fine: 0.18, fineScale: 4.7, mid: 0.2, midScale: 9.1, coarse: 0.12, coarseScale: 37, vertical: true }));
    if (S.trees === 'alpine') mats.leafSnow = keep(std({ color: 0xf2f6fb, map: leafAtlas(), alphaTest: 0.38, roughness: 0.85 }));
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
        const rk = Math.max(smoothstep(S.ground.rockFrom, S.ground.rockFrom + 22, h) * 0.8, smoothstep(0.36, 0.62, slope + (vnoise(x / 19, z / 19) - 0.5) * 0.16) * 0.35);
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
        if (!city) face(i, j, sd * wi, sd * wj, -0.1, 0.22, grime, col);
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
          if (city) {
            // lighter concrete base with a joint every 4 samples, sponsor hoardings (blocks of 12, dark posts between), 0.28 m light coping
            const baseC = mixC(CITY[(i >> 2) % 3], 0x8a90a0, 0.4);
            face(i, j, sd * wi, sd * wj, -0.1, 1.0, grime, baseC); // grimy foot fading into the lighter base
            if ((i & 3) === 0) { const a0 = P(T, i, sd * (wi - 0.02), 0.22), b0 = P(T, j, sd * (wj - 0.02), 0.22), t = 0.12; walls.quad(a0, [a0[0] + (b0[0] - a0[0]) * t, a0[1], a0[2] + (b0[2] - a0[2]) * t], [a0[0] + (b0[0] - a0[0]) * t, 1.0 + a0[1] - 0.22, a0[2] + (b0[2] - a0[2]) * t], [a0[0], 1.0 + a0[1] - 0.22, a0[2]], 0x1a1e28); }
            const blk = Math.floor(i / 12) + (sd > 0 ? 5 : 0), post = (i % 12) === 0;
            face(i, j, sd * wi, sd * wj, 1.0, hi - 0.28, post ? C(0x14161c) : mixC(BAND[(blk * 7) % BAND.length], 0x000000, 0.25));
            face(i, j, sd * wi, sd * wj, hi - 0.28, hi, C(0xdfe4ee));
            if (hi >= 3.5) {
              // catch fence on the tall sections, same mesh path as the circuit fence
              const f0 = sd * (wi + 0.27), f1 = sd * (wj + 0.27), u0 = i * T.ds / 1.3, u1 = (i + 1) * T.ds / 1.3, FH = 1.6, vv = FH / 1.3;
              const A = P(T, i, f0, hi), B = P(T, j, f1, hj), Cc = P(T, j, f1, hj + FH), D = P(T, i, f0, hi + FH);
              fencePos.push(...A, ...B, ...Cc, ...A, ...Cc, ...D);
              fenceUv.push(u0, 0, u1, 0, u1, vv, u0, 0, u1, vv, u0, vv);
              if ((i & 1) === 0) walls.box(A[0], A[1] + FH / 2, A[2], 0.1, FH, 0.1, T.theta[i], STEEL[2], 1 << 5);
            }
          } else face(i, j, sd * wi, sd * wj, 0.22, hi, col, k === barrierKind(j, sd) ? col : col);
          if (Math.abs(hj - hi) > 0.01) walls.tri3(P(T, i, sd * wi, hi), P(T, j, sd * wj, hi), P(T, j, sd * wj, hj), col, col, col);
          const neonLip = city && ((i >> 3) & 1), capCol = neonLip ? C(0xff2bd6) : city ? C(0x596274) : CAP;
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
    // building detail: facades (coursed walls, frames, sills), glazing (day) and lit windows (night) as three merged meshes
    const facadeB = new Builder(), glassB = new Builder(), glowB = S.night ? new Builder() : null;
    // Medium/High-only extras (frames, sills, mullions, rooftop clutter, secondary window grids): hidden on Low by setQuality, so Low gains nothing
    const facadeXB = new Builder(), glassXB = new Builder(), glowXB = S.night ? new Builder() : null;
    const WR = rng((tr.seed ?? 7) * 23 + 11); // own stream: window colours and building extras never shift placements
    const paneCol = () => { const r = WR(); return r < 0.35 ? 0x1a1e2a : r < 0.85 ? 0xe8b860 : 0x9fd0ee; };
    /** one glazing pane (glass by day, a lit / dark window at night) */
    const pane = (x, y, z, w, h, l, yaw, hi = false) => { if (glowB) (hi ? glowXB : glowB).box(x, y, z, w, h, l, yaw, paneCol(), (1 << 4) | (1 << 5)); else (hi ? glassXB : glassB).box(x, y, z, w, h, l, yaw, 0xffffff, (1 << 4) | (1 << 5)); };
    /**
     * n framed windows on one building face. Wp(a, y, f) maps the building's local frame (box yaw = yaw; a across, f along).
     * face 'a': the wall plane a = at, panes spaced along f from t0..t1; face 'f': plane f = at, spaced along a. Panes 0.04 m proud,
     * 0.08 m frame and a 0.12 m sill on the facade mesh.
     */
    function windows(Wp, yaw, face, at, t0, t1, y, w, h, n, frame = true, frameCol = 0xe8e4da, hi = false) {
      const sg = at < 0 ? -1 : 1;
      for (let q = 0; q < n; q++) {
        const t = t0 + (q + 0.5) / n * (t1 - t0);
        const Pt = (o, yy) => face === 'a' ? Wp(at + sg * o, yy, t) : Wp(t, yy, at + sg * o);
        const D = (th, hh, ww) => face === 'a' ? [th, hh, ww] : [ww, hh, th];
        const p = Pt(0.08, y); pane(p[0], p[1], p[2], ...D(0.04, h, w), yaw, hi);
        if (!frame) continue;
        const f = Pt(0.04, y); facadeXB.box(f[0], f[1], f[2], ...D(0.08, h + 0.16, w + 0.16), yaw, frameCol, 1 << 5);
        const sl = Pt(0.1, y - h / 2 - 0.1); facadeXB.box(sl[0], sl[1], sl[2], ...D(0.2, 0.12, w + 0.34), yaw, frameCol);
      }
    }
    const crowd = [0xe84a4a, 0x3b7fd6, 0xf2d04a, 0xf7f7f7, 0x4ac27a, 0x9b59d6, 0xff9a3c, 0x2d2f3a, 0xff5fa2, 0x35d0d0];
    const skin = [0xf1c9a0, 0xd9a273, 0xa8704a, 0x7a4a2d];
    const spectators = []; // [x,y,z,yaw,shirt,skin]
    const flagSpots = []; // [x,y,z,yaw,color]
    // start/finish gantry: truss and bezels live in the shared prop mesh; the five pods are one vertex-colour mesh
    {
      const hw = T.halfAt(0), th = T.thetaAt(0);
      const STEEL = 0x9aa1ab, DARK = 0x12151c, BEZEL = 0x07080c;
      const span = (hw + 2.55) * 2;
      for (const sd of [1, -1]) {
        const p = T.at(0, sd * (hw + 2.55));
        props.box(p.x, p.y + 4.7, p.z, 0.72, 9.4, 0.72, th, STEEL);
        props.box(p.x, p.y + 0.35, p.z, 1.45, 0.7, 1.45, th, DARK);
        props.box(p.x, p.y + 9.28, p.z, 1.05, 0.55, 1.05, th, DARK);
      }
      const p0 = T.at(0, 0);
      props.box(p0.x, p0.y + 9.72, p0.z, span + 1.1, 0.55, 0.95, th, STEEL);
      props.box(p0.x, p0.y + 10.08, p0.z, span + 1.35, 0.16, 1.15, th, 0xd7dbe2);
      props.box(p0.x, p0.y + 9.32, p0.z, span, 0.18, 1.2, th, DARK);
      const parts = [], pods = [];
      let cursor = 0;
      const fw = new THREE.Vector3(Math.sin(th), 0, Math.cos(th));
      for (let k = 0; k < 5; k++) {
        const off = (k - 2) * 2.55, p = T.at(-0.15, off);
        props.box(p.x, p.y + 8.58, p.z, 1.85, 1.28, 0.38, th, BEZEL);
        props.box(p.x, p.y + 9.18, p.z, 2.0, 0.08, 0.48, th, STEEL);
        const core = bake(BOX, p.x, p.y + 8.58, p.z, 0xffffff, th, 1.15, 0.82, 0.1);
        const halo = bake(BOX, p.x, p.y + 8.58, p.z, 0xffffff, th, 1.5, 1.08, 0.05);
        core.translate(-fw.x * 0.26, 0, -fw.z * 0.26);
        halo.translate(-fw.x * 0.32, 0, -fw.z * 0.32);
        const nc = core.attributes.position.count, nh = halo.attributes.position.count;
        pods.push({ c0: cursor, cn: nc, h0: cursor + nc, hn: nh });
        cursor += nc + nh;
        parts.push(core, halo);
      }
      const geo = keep(mergeGeometries(parts));
      const mat = keep(new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, toneMapped: false }));
      const mesh = new THREE.Mesh(geo, mat); mesh.name = 'startlights'; mesh.frustumCulled = false; group.add(mesh);
      startLights = { geo, pods, mat };
      setStartLights(0);
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
        props.box(p0.x + sx * (a + rowD / 2) * side, p0.y + (r + 1) * rowH / 2, p0.z + sz * (a + rowD / 2) * side, rowD, (r + 1) * rowH, len, th, (fi) => fi === 4 ? (r & 1 ? 0xc2c4ca : 0xb4b6be) : (r & 1 ? 0x4a5a78 : 0x3e4c68), 1 << 5); // pale treads, two-tone blue risers
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
      props.quad(W(rBack, yB - 0.6, -len / 2 - 1), W(rBack, yB - 0.6, len / 2 + 1), W(rBack, yB + 0.3, len / 2 + 1), W(rBack, yB + 0.3, -len / 2 - 1), 0x9da1aa); // 0.9 m rear fascia
      const nT = Math.max(2, Math.round(len / 10));
      for (let q = 0; q <= nT; q++) {
        const f = -len / 2 + (q / nT) * len;
        props.box(p0.x + sx * (tot + 0.5) * side + fx * f, p0.y + roofY / 2, p0.z + sz * (tot + 0.5) * side + fz * f, 0.45, roofY, 0.45, th, 0x555a66);
        // truss: deep at the column, tapering to the roof edge
        props.quad(W(tot + 0.5, yB - 2.4, f), W(tot + 0.5, yB - 0.05, f), W(rFront + 0.6, yF - 0.1, f), W(rFront + 0.6, yF - 0.45, f), 0x4a4f5a);
        // diagonal bracing between this rear column and the next
        if (q < nT) { const f1 = -len / 2 + ((q + 1) / nT) * len, ab = tot + 0.78; props.quad(W(ab, 0.4, f), W(ab, 0.75, f), W(ab, roofY - 0.6, f1), W(ab, roofY - 0.95, f1), 0x5a5f6a); }
      }
      // vomitories: dark 2 m openings in the back wall every 24 m (above the top row inside, at ground level outside)
      for (let f = -len / 2 + 12; f < len / 2 - 4; f += 24) {
        props.quad(W(tot + 0.08, rows * rowH, f - 1), W(tot + 0.08, rows * rowH, f + 1), W(tot + 0.08, rows * rowH + 2.2, f + 1), W(tot + 0.08, rows * rowH + 2.2, f - 1), 0x16181e);
        props.quad(W(tot + 0.62, 0, f - 1), W(tot + 0.62, 0, f + 1), W(tot + 0.62, 2.4, f + 1), W(tot + 0.62, 2.4, f - 1), 0x16181e);
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
    // pit building, garages, tower, paddock — colours and a canopy follow the map
    {
      const PIT = pitLook(S);
      const hw = T.halfAt(0), face = hw + 19;
      const c = T.at(-10, face + 9), th = T.thetaAt(0);
      placements.push({ kind: 'pitbuilding', x: c.x, z: c.z, w: 20, l: 217, yaw: th, exempt: true });
      // local frame of the pit complex: a across (+ toward the track face), f along the straight
      const tf = T.at(-10, face), ul = Math.hypot(tf.x - c.x, tf.z - c.z) || 1, ux = (tf.x - c.x) / ul, uz = (tf.z - c.z) / ul, fdx = Math.sin(th), fdz = Math.cos(th);
      const Lp = (a, y, f) => [c.x + ux * a + fdx * f, c.y + y, c.z + uz * a + fdz * f];
      const LB = (B, a, y, f, w, h, l, col, skip) => { const q = Lp(a, y, f); B.box(q[0], q[1], q[2], w, h, l, th, col, skip); };
      const fOf = (s) => { const q = T.at(s, face); return (q.x - c.x) * fdx + (q.z - c.z) * fdz; };
      LB(facadeB, 0, 3, 0, 18, 6, 215, PIT.wall);
      LB(facadeB, 0, 0.3, 0, 18.3, 0.6, 215.3, PIT.plinth);
      props.box(c.x, c.y + 6.3, c.z, 20, 0.6, 217, th, PIT.roof);
      // pilasters between the garage bays on the track face
      const bays = TEAMS.map((t, k) => fOf(T.boxU(k))).sort((a, b) => a - b);
      const pil = [-107.2, 107.2]; for (let k = 0; k + 1 < bays.length; k++) pil.push((bays[k] + bays[k + 1]) / 2);
      for (const f of pil) LB(facadeB, 9.2, 3, f, 0.5, 6, 0.6, PIT.trim, 1 << 5);
      // upper storey: 12 m deep, set back 3 m, continuous glazing band with mullions every 3 m, overhanging roof with dark fascia
      LB(facadeB, 0, 8.1, 0, 12, 3, 211, PIT.upper);
      if (glowB) for (let f = -102; f <= 102.1; f += 3) { const q = Lp(6.04, 8.1, f); pane(q[0], q[1], q[2], 0.06, 1.9, 2.84, th); } // night: lit / dark office bays
      else LB(glassB, 6.04, 8.1, 0, 0.06, 1.9, 209, 0xffffff, (1 << 4) | (1 << 5));
      for (let f = -103.5; f <= 103.6; f += 3) LB(facadeXB, 6.08, 8.1, f, 0.12, 2.0, 0.16, PIT.fascia, (1 << 4) | (1 << 5));
      LB(facadeB, 0.6, 9.75, 0, 14.4, 0.3, 213.4, PIT.roof);
      LB(facadeB, 7.75, 9.65, 0, 0.3, 0.6, 213.4, PIT.fascia);
      // terrace railing along the front of the lower roof
      LB(facadeB, 8.8, 7.65, 0, 0.08, 0.08, 213, PIT.trim);
      for (let f = -106; f <= 106.1; f += 4) LB(facadeXB, 8.8, 7.12, f, 0.08, 1.05, 0.08, PIT.trim, (1 << 4) | (1 << 5));
      // both end walls: door, three windows and a vertical neutral stripe (lower), two windows (upper)
      for (const e of [-1, 1]) {
        LB(facadeB, 6.2, 1.15, e * 107.55, 1.3, 2.3, 0.1, PIT.door);
        LB(facadeB, 6.2, 2.4, e * 107.6, 1.7, 0.16, 0.2, PIT.trim);
        windows(Lp, th, 'f', e * 107.5, -7, 3.5, 3.4, 1.5, 1.3, 3);
        LB(facadeB, -7.6, 3, e * 107.53, 1.0, 6, 0.06, PIT.trim);
        windows(Lp, th, 'f', e * 105.5, -4.5, 4.5, 8.1, 1.6, 1.4, 2);
      }
      // rear wall: a window row and five roller doors
      windows(Lp, th, 'a', -9, -100, 100, 4.6, 1.4, 1.0, 24);
      for (const f of [-80, -40, 0, 40, 80]) { LB(facadeB, -9.05, 1.8, f, 0.1, 3.6, 5, PIT.door); LB(facadeB, -9.1, 3.75, f, 0.2, 0.3, 5.4, PIT.fascia); }
      aoRect(c.x, c.y, c.z, 20, 217, th, 2);
      reserve(c.x, c.z, 120);
      // race control on the roof: full-width track-side glazing, mullions every 2.5 m, roof slab overhang, two antenna masts
      const mid = T.at(-10, face + 12), fm = (mid.x - c.x) * fdx + (mid.z - c.z) * fdz;
      LB(facadeB, 3, 9.5, fm, 12, 5, 40, PIT.upper);
      if (glowB) for (let f = -17.5; f <= 17.6; f += 2.5) { const q = Lp(9.04, 9.9, fm + f); pane(q[0], q[1], q[2], 0.06, 3.4, 2.34, th); }
      else LB(glassB, 9.04, 9.9, fm, 0.06, 3.4, 39.2, 0xffffff, (1 << 4) | (1 << 5));
      for (let f = -18.75; f <= 18.8; f += 2.5) LB(facadeXB, 9.08, 9.9, fm + f, 0.12, 3.5, 0.16, PIT.fascia, (1 << 4) | (1 << 5));
      LB(facadeB, 3.6, 12.2, fm, 14.4, 0.4, 42, PIT.roof);
      LB(facadeB, 3.6, 12.55, fm, 14.6, 0.3, 4, PIT.accent);
      for (const e of [-1, 1]) { LB(facadeB, 0, 14.6, fm + e * 15, 0.16, 4.4, 0.16, PIT.trim); LB(facadeB, 0, 16.9, fm + e * 15, 0.3, 0.2, 0.3, PIT.accent); }
      TEAMS.forEach((t, k) => {
        const s = T.boxU(k), p = T.at(s, face - 0.15);
        props.box(p.x, p.y + 1.9, p.z, 0.4, 3.8, 11.5, th, PIT.door); // garage door
        props.box(p.x, p.y + 4.2, p.z, 0.5, 0.9, 11.5, th, t.c1);
        props.box(p.x, p.y + 4.9, p.z, 0.55, 0.3, 11.5, th, t.c2);
        const fBay = fOf(s);
        LB(facadeB, 10.55, 4.15, fBay, 1.7, 0.14, 10.6, PIT.awning); // canopy flap over the bay
        LB(facadeB, 10.7, 3.95, fBay, 1.35, 0.1, 10.4, t.c1);
        const q = T.at(s, hw + 12.5); props.box(q.x, q.y + 0.4, q.z, 1.4, 0.8, 1.4, th, t.c1);
        // rooftop unit + team banner on the roof
        const rp = T.at(s, face + 9); props.box(rp.x, rp.y + 10.6, rp.z, 3, 1.4, 4, th, PIT.trim); // on the upper-storey roof
        props.box(rp.x, rp.y + 11.5, rp.z, 1.2, 0.4, 1.2, th, t.c2);
        flagSpots.push([T.at(s, face - 1).x, T.at(s, face - 1).y + 6.6, T.at(s, face - 1).z, th, k / 10]);
      });
      // one canopy along the pit wall, plus map-specific roof dressing. All of it is merged.
      LB(facadeB, 10.35, 5.22, 0, 2.6, 0.22, 214, PIT.canopy);
      LB(facadeB, 11.5, 4.95, 0, 0.16, 0.46, 214, PIT.fascia);
      if (PIT.snow) {
        LB(facadeB, 0.2, 9.98, 0, 13.8, 0.32, 212, 0xf4f7fb);
        LB(facadeB, 9.15, 6.58, 0, 2.4, 0.22, 214, 0xf7fbff); // snow lip on the lane-side roof, visible from the box
      }
      if (PIT.glow && glowB) {
        if (PIT.neon) LB(glowB, 11.58, 4.7, 0, 0.06, 0.1, 208, PIT.glow);
        else for (let f = -90; f <= 90.1; f += 18) LB(glowB, 10.15, 4.55, f, 0.22, 0.22, 0.22, PIT.glow);
      }
      if (PIT.crenel) for (let f = -100; f <= 100.1; f += 8) LB(facadeXB, 8.55, 6.55, f, 0.85, 0.55, 1.45, PIT.trim);
      for (const f of [-98, 98]) {
        const q = Lp(11.5, 0, f);
        for (let r = 0; r < 3; r++) props.box(q[0], q[1] + 0.32 + r * 0.5, q[2], 1.05, 0.46, 1.05, th + 0.35, r === 1 ? 0xf2f2f6 : 0x1c1c22);
      }
      // paddock behind: tents & sheds
      for (let k = 0; k < 7; k++) {
        const s = -80 + k * 38, p = T.at(s, face + 32 + (k % 2) * 8), t = TEAMS[k % TEAMS.length];
        if (!tryPlace('tent', p.x, p.z, 10, 15, th)) continue;
        p.y = lastGround.hi; footing(props, p.x, p.z, 10, 15, th, PIT.plinth);
        props.box(p.x, p.y + 1.6, p.z, 9, 3.2, 14, th, PIT.wall);
        props.box(p.x, p.y + 3.5, p.z, 10, 0.8, 15, th, t.c1);
        aoRect(p.x, p.y, p.z, 9, 14, th, 1.3);
      }
      const tw = T.at(150, face + 13);
      placements.push({ kind: 'tower', x: tw.x, z: tw.z, w: 9, l: 9, yaw: th, exempt: true });
      // control tower: plinth, tapered banded shaft with a panelled window per face, glazed cab, railing ring, mast
      {
        const sxT = Math.cos(th), szT = -Math.sin(th);
        const Tp = (a, y, f) => [tw.x + sxT * a + fdx * f, tw.y + y, tw.z + szT * a + fdz * f];
        const TB = (B, a, y, f, w, h, l, col, skip) => { const q = Tp(a, y, f); B.box(q[0], q[1], q[2], w, h, l, th, col, skip); };
        TB(facadeB, 0, 0.75, 0, 5.8, 1.5, 5.8, 0x9a9ea6);
        // tapered shaft: four storeys stepping in, a darker band and a panelled window per face. All of it stays in the shared facade / glass meshes.
        const storeys = [{ y: 3.65, h: 4.3, w: 5.2 }, { y: 8.15, h: 4.3, w: 4.9 }, { y: 12.65, h: 4.3, w: 4.6 }, { y: 17.05, h: 4.1, w: 4.3 }];
        for (const s of storeys) {
          TB(facadeB, 0, s.y, 0, s.w, s.h, s.w, 0xdadee6);
          TB(facadeB, 0, s.y + s.h / 2 + 0.08, 0, s.w + 0.34, 0.26, s.w + 0.34, 0x8e949e);
          for (const [a, f] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) TB(facadeB, a * (s.w / 2 - 0.16), s.y, f * (s.w / 2 - 0.16), 0.38, s.h * 0.92, 0.38, 0xc4c7cc, 1 << 5);
          const face = s.w / 2 + 0.03, pw = s.w * 0.34, ph = s.h * 0.55;
          for (const e of [-1, 1]) {
            TB(facadeB, e * face, s.y + 0.15, 0, 0.08, ph, pw, 0x2c3440, (1 << 4) | (1 << 5));
            TB(facadeB, 0, s.y + 0.15, e * face, pw, ph, 0.08, 0x2c3440, (1 << 4) | (1 << 5));
            TB(glassB, e * (face + 0.05), s.y + 0.15, 0, 0.04, ph * 0.72, pw * 0.62, 0xffffff, (1 << 4) | (1 << 5));
            TB(glassB, 0, s.y + 0.15, e * (face + 0.05), pw * 0.62, ph * 0.72, 0.04, 0xffffff, (1 << 4) | (1 << 5));
          }
        }
        TB(facadeB, 0, 19.7, 0, 8.4, 0.4, 8.4, 0x50565f);
        TB(glowB || glassB, 0, 21.4, 0, 7.4, 3, 7.4, glowB ? 0x8a6c44 : 0xffffff, 1 << 5);
        for (const [a, f] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) TB(facadeB, a * 3.65, 21.4, f * 3.65, 0.3, 3, 0.3, 0x2a2f38);
        // cab detail (hidden on Low): dark sill band at the cab base and three mullions per face, 0.03 m proud of the glass
        TB(facadeXB, 0, 20.15, 0, 7.5, 0.5, 7.5, 0x2a2f38);
        for (const m of [-1.85, 0, 1.85]) for (const e of [-1, 1]) { TB(facadeXB, e * 3.67, 21.4, m, 0.12, 3, 0.12, 0x2a2f38, 1 << 5); TB(facadeXB, m, 21.4, e * 3.67, 0.12, 3, 0.12, 0x2a2f38, 1 << 5); }
        TB(facadeB, 0, 23.2, 0, 8.6, 0.6, 8.6, 0xe6261f);
        for (const e of [-1, 1]) { TB(facadeB, e * 4.1, 20.95, 0, 0.07, 0.07, 8.3, 0xb4bac0); TB(facadeB, 0, 20.95, e * 4.1, 8.3, 0.07, 0.07, 0xb4bac0); }
        for (const [a, f] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) TB(facadeB, a * 4.1, 20.45, f * 4.1, 0.07, 1.0, 0.07, 0xb4bac0);
        TB(facadeB, 1.5, 25.1, 1.5, 0.15, 3.2, 0.15, 0x9aa0a8);
        TB(facadeB, 1.5, 26.85, 1.5, 0.35, 0.35, 0.35, 0xe6261f);
      }
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
        // arrow slits on every face (two levels) and an arched-looking doorway with a lintel on the south face
        for (const e of [-1, 1]) for (const m of [-6, 0, 6]) for (const sy of [6.5, 12]) {
          facadeB.box(kp.x + e * 11.03, kp.y + sy, kp.z + m, 0.08, 1.7, 0.35, kth, 0x15161a);
          facadeB.box(kp.x + m, kp.y + sy, kp.z + e * 11.03, 0.35, 1.7, 0.08, kth, 0x15161a);
        }
        facadeB.box(kp.x, kp.y + 2.1, kp.z + 11.04, 3.0, 4.2, 0.1, kth, 0x1c1a18);
        facadeB.box(kp.x, kp.y + 4.5, kp.z + 11.15, 3.8, 0.6, 0.3, kth, STONE[3]);
        aoRect(kp.x, kp.y, kp.z, 24, 24, kth, 3); reserve(kp.x, kp.z, 36);
        for (const [a, b] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
          const cx = kp.x + a * 12, cz = kp.z + b * 12;
          props.box(cx, kp.y + 11, cz, 6, 22, 6, Math.PI / 4, STONE[1]);
          props.box(cx, kp.y + 22.5, cz, 7, 1.2, 7, Math.PI / 4, STONE[3]);
          props.box(cx, kp.y + 24.2, cz, 1.2, 2.2, 1.2, kth, 0xb04030);
          flagSpots.push([cx, kp.y + 25.3, cz, kth, 0.05]);
        }
        for (let m = -9; m <= 9; m += 3) for (const e of [-1, 1]) {
          const mh = (m / 3) & 1 ? 2.0 : 1.4; // alternating merlon heights
          props.box(kp.x + e * 11.6, kp.y + 16.7 + mh / 2, kp.z + m, 1.4, mh, 1.4, kth, STONE[3]);
          props.box(kp.x + m, kp.y + 16.7 + mh / 2, kp.z + e * 11.6, 1.4, mh, 1.4, kth, STONE[3]);
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
        const kind = S.houses, two = kind === 'farm' && WR() < 0.3, H = two ? hh * 1.8 : hh; // farm: some two-storey farmhouses
        const HB = (B, a, yy, f, w, h, l, col, skip) => { const q = Wp(a, yy, f); B.box(q[0], q[1], q[2], w, h, l, yaw, col, skip); };
        HB(facadeB, 0, H / 2, 0, hw, H, hl, wc, 1 << 5);
        if (kind === 'farm' || kind === 'cabin' || kind === 'chalet') HB(facadeB, 0, 0.25, 0, hw + 0.16, 0.5, hl + 0.16, 0x8a8478, 1 << 5); // stone plinth
        let rh = 0;
        if (LOOK.flat) {
          facadeB.box(x, y + H + 0.2, z, hw + 0.5, 0.4, hl + 0.5, yaw, rcl);
          // adobe: parapet ring, protruding roof beams (vigas), courtyard wall on half of them
          for (const e of [-1, 1]) { HB(facadeB, e * (hw / 2 + 0.1), H + 0.7, 0, 0.3, 0.6, hl + 0.5, wc); HB(facadeB, 0, H + 0.7, e * (hl / 2 + 0.1), hw + 0.2, 0.6, 0.3, wc); }
          for (let q = 0; q < 6; q++) { const f = (q + 0.5) / 6 * hl - hl / 2; HB(facadeB, hw / 2 + 0.45, H - 0.3, f, 0.9, 0.22, 0.22, 0x5a3e2a); }
          if (WR() < 0.5) {
            const e = WR() < 0.5 ? -1 : 1, fw = hl / 2 + 2.6;
            HB(facadeB, 0, 0.8, e * fw, hw, 1.6, 0.35, wc);
            for (const sa of [-1, 1]) HB(facadeB, sa * (hw / 2 - 0.17), 0.8, e * (hl / 2 + 1.3), 0.35, 1.6, 2.6, wc);
          }
        } else if (kind === 'villa') {
          // hipped roof: four planes meeting at a short ridge
          rh = hw * (0.3 + HR() * 0.1); HR(); const ov = 0.6, hx = hw / 2 + ov, hz = hl / 2 + ov, rz = Math.max(0, hz - hx);
          facadeB.quad(Wp(-hx, H - 0.15, -hz), Wp(-hx, H - 0.15, hz), Wp(0, H + rh, rz), Wp(0, H + rh, -rz), rcl);
          facadeB.quad(Wp(hx, H - 0.15, hz), Wp(hx, H - 0.15, -hz), Wp(0, H + rh, -rz), Wp(0, H + rh, rz), rcl);
          for (const e of [-1, 1]) facadeB.tri(Wp(-hx, H - 0.15, e * hz), Wp(hx, H - 0.15, e * hz), Wp(0, H + rh, e * rz), mixC(rcl, 0x000000, 0.12));
          if (WR() < 0.5) { // pergola on a long side
            const e = WR() < 0.5 ? -1 : 1, d = hw / 2 + 2.4;
            for (const f of [-hl * 0.3, hl * 0.3]) HB(facadeB, e * d, 1.2, f, 0.18, 2.4, 0.18, 0xe8e0d0, 1 << 5);
            HB(facadeB, e * d, 2.45, 0, 0.2, 0.18, hl * 0.66, 0xe8e0d0);
            for (let q = 0; q < 5; q++) HB(facadeB, e * (hw / 2 + 1.25), 2.6, (q / 4 - 0.5) * hl * 0.6, 2.7, 0.12, 0.14, 0xd8ccb4);
          }
        } else {
          // gable roof with eaves; gable ends filled in wall colour
          rh = hw * (0.34 + HR() * 0.14); const ov = kind === 'chalet' ? 1.1 : 0.55, hx = hw / 2 + ov, hz = hl / 2 + ov;
          facadeB.quad(Wp(-hx, H - 0.15, -hz), Wp(-hx, H - 0.15, hz), Wp(0, H + rh, hz), Wp(0, H + rh, -hz), rcl);
          facadeB.quad(Wp(hx, H - 0.15, hz), Wp(hx, H - 0.15, -hz), Wp(0, H + rh, -hz), Wp(0, H + rh, hz), rcl);
          for (const e of [-1, 1]) facadeB.tri(Wp(-hw / 2, H, e * hl / 2), Wp(hw / 2, H, e * hl / 2), Wp(0, H + rh * (hw / 2) / hx, e * hl / 2), wc);
          if (HR() < 0.7 && kind !== 'cabin') props.box(...Wp(hw * 0.22, H + rh * 0.75, hl * 0.2), 0.9, rh * 0.9 + 0.8, 0.9, yaw, 0x5a4a40);
          if (kind === 'chalet') {
            for (const e of [-1, 1]) HB(facadeB, e * (hx - 0.1), H - 0.05, 0, 0.3, 0.25, 2 * hz, 0xf4f8fc); // snow lip at the eaves
            const e = WR() < 0.5 ? -1 : 1, bf = e * (hl / 2 + 0.6); // balcony with railing on a gable end
            HB(facadeB, 0, H - 0.6, bf, hw * 0.8, 0.16, 1.2, 0x5a3822);
            HB(facadeB, 0, H + 0.35, e * (hl / 2 + 1.15), hw * 0.8, 0.1, 0.08, 0x5a3822);
            for (let q = 0; q <= 6; q++) HB(facadeB, (q / 6 - 0.5) * hw * 0.78, H - 0.1, e * (hl / 2 + 1.15), 0.08, 0.9, 0.08, 0x5a3822, (1 << 4) | (1 << 5));
          }
          if (kind === 'farm' && WR() < 0.4) { // lean-to shed on a long side
            const e = WR() < 0.5 ? -1 : 1, sh = H * 0.55, sl = hl * 0.5;
            HB(facadeB, e * (hw / 2 + 1.1), sh / 2, 0, 2.2, sh, sl, mixC(wc, 0x000000, 0.1), 1 << 5);
            facadeB.quad(Wp(e * (hw / 2), sh + 0.9, -sl / 2 - 0.2), Wp(e * (hw / 2), sh + 0.9, sl / 2 + 0.2), Wp(e * (hw / 2 + 2.5), sh - 0.1, sl / 2 + 0.2), Wp(e * (hw / 2 + 2.5), sh - 0.1, -sl / 2 - 0.2), rcl);
          }
          if (kind === 'cabin') {
            const e = WR() < 0.5 ? -1 : 1; // stone chimney on a gable end, porch roof on posts along the door side
            HB(facadeB, hw * 0.2, (H + rh + 1.2) / 2, e * (hl / 2 + 0.55), 1.2, H + rh + 1.2, 1.1, 0x76726a);
            facadeB.quad(Wp(hw / 2, H - 0.3, -hl * 0.4), Wp(hw / 2, H - 0.3, hl * 0.4), Wp(hw / 2 + 2.2, H - 0.9, hl * 0.4), Wp(hw / 2 + 2.2, H - 0.9, -hl * 0.4), rcl);
            for (const f of [-hl * 0.38, 0, hl * 0.38]) HB(facadeB, hw / 2 + 2.05, (H - 0.9) / 2, f, 0.2, H - 0.9, 0.2, 0x4a3626, 1 << 5);
          }
        }
        // door + framed windows on the long sides (villas: blue shutters beside each window); second row on two-storey houses
        for (const e of [-1, 1]) {
          const nW = Math.max(2, Math.round(hl / 3.2));
          for (let q = 0; q < nW; q++) {
            const f = (q + 0.5) / nW * hl - hl / 2, door = e > 0 && q === Math.floor(nW / 2);
            if (door) { HB(facadeB, e * (hw / 2 + 0.04), 1.05, f, 0.1, 2.1, 1.1, LOOK.trim, (1 << 4) | (1 << 5)); continue; }
            for (const wy of two ? [1.75, 1.75 + hh * 0.8] : [1.75]) {
              windows(Wp, yaw, 'a', e * hw / 2, f - 0.5, f + 0.5, wy, 1.1, 1.15, 1, true, kind === 'villa' || kind === 'adobe' ? 0xf0ece2 : LOOK.trim);
              if (kind === 'villa') for (const sf of [-1, 1]) HB(facadeB, e * (hw / 2 + 0.05), wy, f + sf * 0.85, 0.06, 1.3, 0.45, LOOK.trim, (1 << 4) | (1 << 5));
            }
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
        // two-tier mass (upper tier set back toward the rear), shopfront band with awning, window grids, rooftop clutter
        const paint = paints[k % paints.length], q1 = T.at(s, sd * (w + 1)), ql = Math.hypot(q1.x - p.x, q1.z - p.z) || 1;
        const bux = (q1.x - p.x) / ql, buz = (q1.z - p.z) / ql, bfx = Math.sin(th), bfz = Math.cos(th);
        const Bp = (a, y, f) => [p.x + bux * a + bfx * f, p.y + y, p.z + buz * a + bfz * f]; // a > 0: away from the track
        const BB = (B, a, y, f, ww, hh, ll, col, skip) => { const q = Bp(a, y, f); B.box(q[0], q[1], q[2], ww, hh, ll, th, col, skip); };
        BB(facadeB, 0, bh / 2, 0, bd, bh, bw, paint, 1 << 5);
        props.box(p.x, p.y + bh + 0.35, p.z, bd + 0.5, 0.7, bw + 0.5, th, 0x12151c);
        const uh = bh * (0.4 + 0.5 * WR()), ua = bd * 0.15, ud = bd * 0.7, uw = bw * 0.7;
        BB(facadeB, ua, bh + uh / 2, 0, ud, uh, uw, mixC(paint, 0xffffff, 0.06), 1 << 5);
        BB(facadeB, ua, bh + uh + 0.3, 0, ud + 0.3, 0.6, uw + 0.3, 0x12151c);
        // shopfront 0.4-3.2 m on the track face: lit panes between dark mullions every 2.5 m, awning in the block colour
        const fa = -bd / 2, nS = Math.max(2, Math.round(bw / 2.5));
        windows(Bp, th, 'a', fa, -bw * 0.46, bw * 0.46, 1.8, bw * 0.92 / nS - 0.2, 2.8, nS, false);
        for (let q = 0; q <= nS; q++) BB(facadeXB, fa - 0.08, 1.8, (q / nS - 0.5) * bw * 0.92, 0.14, 2.8, 0.18, 0x101218, (1 << 4) | (1 << 5));
        BB(facadeB, fa - 0.6, 3.4, 0, 1.2, 0.25, bw * 0.92, mixC(paint, 0x000000, 0.1));
        // window grid: rows every 3.2 m, columns every 2.6 m, on the track face and both side faces; upper tier track face too
        const nC = Math.max(1, Math.floor(bw / 2.6)), nCs = Math.max(1, Math.floor(bd / 2.6));
        for (let wy = 5.2; wy < bh - 0.9; wy += 3.2) {
          windows(Bp, th, 'a', fa, -nC * 1.3, nC * 1.3, wy, 1.3, 1.6, nC, false);
          for (const e of [-1, 1]) windows(Bp, th, 'f', e * bw / 2, -nCs * 1.3, nCs * 1.3, wy, 1.3, 1.6, nCs, false, 0, true);
        }
        const nCu = Math.max(1, Math.floor(uw / 2.6));
        for (let wy = bh + 1.8; wy < bh + uh - 0.9; wy += 3.2) windows(Bp, th, 'a', ua - ud / 2, -nCu * 1.3, nCu * 1.3, wy, 1.3, 1.6, nCu, false, 0, true);
        // rooftop: AC boxes on the lower roof in front of the setback, water tank or sign frame on every third block
        for (let q = 0; q < 1 + (k & 1); q++) BB(facadeXB, fa + 1.5, bh + 0.7 + 0.45, (q - 0.5 * (k & 1)) * 3.2, 1.4, 0.9, 1.8, 0x6a707a);
        if (k % 3 === 0) {
          if (k % 2) { BB(facadeXB, ua, bh + uh + 2.0, 0, 2.2, 2.4, 2.2, 0x4a3a30); for (const [ea, ef] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) BB(facadeXB, ua + ea * 0.9, bh + uh + 0.6 + 0.2, ef * 0.9, 0.14, 0.8, 0.14, 0x2a2d34); }
          else { BB(facadeXB, ua, bh + uh + 2.4, 0, 0.2, 2.8, uw * 0.7, 0x2a2d34); for (const e of [-1, 1]) BB(facadeXB, ua, bh + uh + 1.0, e * uw * 0.33, 0.16, 2.0, 0.16, 0x2a2d34); }
        }
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
        parts.push(bake(new THREE.TorusGeometry(3.3, 0.06, 4, 24).rotateX(Math.PI / 2), hx, g + H + 1.8, hz, 0x2a2d36)); // gallery railing
        for (let q = 0; q < 12; q++) { const a = q / 12 * Math.PI * 2; lb.box(hx + Math.cos(a) * 3.3, g + H + 1.3, hz + Math.sin(a) * 3.3, 0.08, 1.0, 0.08, 0, 0x2a2d36, (1 << 4) | (1 << 5)); }
        lb.box(hx + 3.62, g + 1.2, hz, 0.14, 2.4, 1.3, 0, 0x3a2a20); lb.box(hx + 3.7, g + 2.55, hz, 0.3, 0.25, 1.7, 0, 0xf7f7f7); // door + lintel
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
        facadeB.box(hx, g + 2.2, hz, 14, 4.4, 18, 0.4, 0x6b3a24, 1 << 5);
        lb.box(hx, g + 5.1, hz, 17.2, 1.5, 21.2, 0.4, 0xf4f7fb);
        { // framed windows on both long sides, porch roof on posts at the front gable
          const sxl = Math.cos(0.4), szl = -Math.sin(0.4), fxl = Math.sin(0.4), fzl = Math.cos(0.4);
          const Lw = (a, y, f) => [hx + sxl * a + fxl * f, g + y, hz + szl * a + fzl * f];
          for (const e of [-1, 1]) windows(Lw, 0.4, 'a', e * 7, -7.5, 7.5, 2.6, 1.3, 1.4, 5, true, 0xe8dcc8);
          const pr = Lw(0, 3.6, 10.2); lb.box(pr[0], pr[1], pr[2], 7, 0.25, 2.6, 0.4, 0x4a2a1c);
          for (const e of [-1, 1]) { const pp = Lw(e * 3.2, 1.75, 11.2); lb.box(pp[0], pp[1], pp[2], 0.25, 3.5, 0.25, 0.4, 0x4a2a1c, 1 << 5); }
        }
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
        // leg cross-bracing (X on each side, two levels), a ladder strip up one side, railing around the platform
        const BR = 0x3e2c1e;
        for (const [y0, y1] of [[1, 7], [7, 13.5]]) for (const e of [-1, 1]) {
          lb.quad([hx + e * 1.32, g + y0, hz - 1.3], [hx + e * 1.32, g + y0 + 0.25, hz - 1.3], [hx + e * 1.32, g + y1 + 0.25, hz + 1.3], [hx + e * 1.32, g + y1, hz + 1.3], BR);
          lb.quad([hx + e * 1.32, g + y0, hz + 1.3], [hx + e * 1.32, g + y0 + 0.25, hz + 1.3], [hx + e * 1.32, g + y1 + 0.25, hz - 1.3], [hx + e * 1.32, g + y1, hz - 1.3], BR);
          lb.quad([hx - 1.3, g + y0, hz + e * 1.32], [hx - 1.3, g + y0 + 0.25, hz + e * 1.32], [hx + 1.3, g + y1 + 0.25, hz + e * 1.32], [hx + 1.3, g + y1, hz + e * 1.32], BR);
          lb.quad([hx + 1.3, g + y0, hz + e * 1.32], [hx + 1.3, g + y0 + 0.25, hz + e * 1.32], [hx - 1.3, g + y1 + 0.25, hz + e * 1.32], [hx - 1.3, g + y1, hz + e * 1.32], BR);
        }
        for (const e of [-1, 1]) lb.box(hx + e * 0.3, g + 7.2, hz + 1.75, 0.08, 14.4, 0.08, 0, 0x5a4a3a);
        for (let ry = 0.4; ry < 14.4; ry += 0.45) lb.quad([hx - 0.3, g + ry, hz + 1.75], [hx + 0.3, g + ry, hz + 1.75], [hx + 0.3, g + ry + 0.06, hz + 1.75], [hx - 0.3, g + ry + 0.06, hz + 1.75], 0x5a4a3a);
        const Rp = (a, f) => [hx + Math.cos(0.2) * a + Math.sin(0.2) * f, hz - Math.sin(0.2) * a + Math.cos(0.2) * f]; // platform frame (yaw 0.2)
        for (const e of [-1, 1]) { let q = Rp(e * 2.7, 0); lb.box(q[0], g + 15.8, q[1], 0.08, 0.08, 5.4, 0.2, 0x3a2a20); q = Rp(0, e * 2.7); lb.box(q[0], g + 15.8, q[1], 5.4, 0.08, 0.08, 0.2, 0x3a2a20); }
        for (const [a, b] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) { const q = Rp(a * 2.7, b * 2.7); lb.box(q[0], g + 15.3, q[1], 0.1, 1.0, 0.1, 0.2, 0x3a2a20); }
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

    addMesh(facadeB, mats.facade, 'facades', true, true);
    addMesh(glassB, mats.glass, 'glass', false, true);
    if (glowB) addMesh(glowB, mats.glow, 'glow', false, false);
    group.userData.hiDetail = [[facadeXB, mats.facade, 'facadesHi', true], [glassXB, mats.glass, 'glassHi', false], [glowXB, mats.glow, 'glowHi', false]]
      .filter(([b]) => b && b.p.length).map(([b, m, n, cast]) => addMesh(b, m, n, cast, true));
    // ---- trees: dense instanced clusters in varied greens / yellows / oranges ----
    {
      const palettes = S.trees === 'desert' ? [
        [0x5c7a52, 0x66845a, 0x50704c, 0x6f8a60], // moonlit sage cactus
        [0x7d7650, 0x8a8058, 0x6c6a4a, 0x968c64], // dry scrub
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
        [0x356b3c, 0x3f7a46, 0x2c5a34, 0x4a8650],
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
        const h = terrainAt(x, z, gi), edge = gi.e;
        if (h > (S.treeMaxH ?? 26) || (S.sea && h < S.sea.level + 1.2)) return false;
        const sc = S.trees === 'desert' ? (kind === 0 ? 0.7 + R() * 0.45 : 0.6 + R() * 0.7) : (0.8 + R() * 1.1) * (S.treeScale || 1);
        if (!tryPlace('tree', x, z, null, 2.6 * sc)) return false;
        spots.push({ x, y: h, z, s: sc, kind, col: pal[Math.floor(R() * pal.length)], yaw: R() * 6.28, variant: Math.floor(R() * 3), far: edge > 110 });
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
      // per-theme species: a few seeded variants per kind, each a set of instanced meshes (leaf cards, dark core, trunk, snow)
      const VR = rng((tr.seed ?? 7) * 31 + 17), vs = () => Math.floor(VR() * 1e6);
      const sp = {
        temperate: [
          [conifer(vs(), { h: 8.2, r: 1.8, droop: 0.32 }), conifer(vs(), { h: 7.4, r: 2.3, droop: 0.38 }), conifer(vs(), { h: 5.6, r: 1.7, droop: 0.28 })],
          [broadleaf(vs(), { h: 7.4, r: 2.6, squash: 0.85 }), broadleaf(vs(), { h: 8.2, r: 2.1, squash: 1.2 }), broadleaf(vs(), { h: 6.8, r: 3.0, squash: 0.7 })],
        ],
        alpine: [
          [conifer(vs(), { h: 8.4, r: 1.9, droop: 0.4, snow: true }), conifer(vs(), { h: 7.4, r: 2.3, droop: 0.45, snow: true }), conifer(vs(), { h: 6.4, r: 2.0, droop: 0.36, snow: true })],
          [conifer(vs(), { h: 5.4, r: 2.1, droop: 0.42, snow: true }), conifer(vs(), { h: 4.8, r: 2.2, droop: 0.48, snow: true }), broadleaf(vs(), { h: 6.6, r: 2.2, squash: 0.95, shade: 0.8, cards: 18 })],
        ],
        forest: [
          [conifer(vs(), { h: 9.4, r: 2.0, droop: 0.45 }), conifer(vs(), { h: 8.6, r: 2.4, droop: 0.5 }), conifer(vs(), { h: 7.2, r: 1.9, droop: 0.42 })],
          [broadleaf(vs(), { h: 7.8, r: 2.7, squash: 0.95, shade: 0.88 }), broadleaf(vs(), { h: 8.4, r: 2.3, squash: 1.15, shade: 0.85 }), broadleaf(vs(), { h: 7.0, r: 2.9, squash: 0.8, shade: 0.9 })],
        ],
        coastal: [
          [palm(vs(), { h: 8.2, bend: 1.1 }), palm(vs(), { h: 7.2, bend: 0.6 }), palm(vs(), { h: 8.8, bend: 1.5 })],
          [shrub(vs(), { r: 2.2, h: 2.4 }), shrub(vs(), { r: 1.8, h: 1.9 }), broadleaf(vs(), { h: 3.6, r: 1.8, squash: 0.8, cards: 18 })],
        ],
        desert: [
          [cactus(vs()), cactus(vs()), cactus(vs())],
          [shrub(vs(), { r: 2.0, h: 1.2, tuftMix: 0.5 }), shrub(vs(), { r: 2.4, h: 1.0, tuftMix: 0.4 }), shrub(vs(), { r: 1.7, h: 1.3, tuftMix: 0.6 })],
        ],
        street: [
          [broadleaf(vs(), { h: 6.8, r: 2.2, squash: 0.95 }), broadleaf(vs(), { h: 7.4, r: 2.0, squash: 1.1 })],
          [broadleaf(vs(), { h: 6.4, r: 2.4, squash: 0.85 }), broadleaf(vs(), { h: 7.0, r: 2.1, squash: 1.0 })],
        ],
      }[S.trees] || null;
      const variants = sp;
      const lod = S.trees === 'temperate' || S.trees === 'alpine' || S.trees === 'forest';
      const farG = lod ? { conifer: farTree('conifer'), broadleaf: farTree('broadleaf') } : null;
      const types = [];
      const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), p3 = new THREE.Vector3(), s3 = new THREE.Vector3(), ax = new THREE.Vector3(0, 1, 0), tc = new THREE.Color();
      const inst = (geo, mat, n, opts) => {
        const m = new THREE.InstancedMesh(keep(geo), mat, Math.max(1, n));
        m.frustumCulled = false; m.castShadow = !!opts.cast; m.receiveShadow = true; if (opts.noAO) m.userData.noAO = true;
        group.add(m); return m;
      };
      const fill = (list, meshes, colored) => {
        list.forEach((o, i) => {
          m4.compose(p3.set(o.x, o.y, o.z), q4.setFromAxisAngle(ax, o.yaw), s3.set(o.s, o.s * (0.9 + (i % 5) * 0.06), o.s));
          tc.setHex(o.col).offsetHSL(0, 0, (((o.yaw * 977) % 1) - 0.5) * 0.06);
          for (const m of meshes) { m.setMatrixAt(i, m4); if (colored.includes(m)) m.setColorAt(i, tc); }
        });
        for (const m of meshes) { m.count = list.length; if (m.instanceColor) m.instanceColor.needsUpdate = true; }
      };
      const vOf = (o) => variants[o.kind][o.variant % variants[o.kind].length];
      if (variants) variants.forEach((vk, kind) => vk.forEach((v, vi) => {
        const list = spots.filter((o) => o.kind === kind && o.variant % vk.length === vi && !(farG && o.far));
        const real = (g) => g && g.attributes.position.count > 3; // cacti have no cards, shrubs no trunk
        const meshes = [], colored = [];
        if (real(v.cards)) { const cards = inst(v.cards, mats.leaf, list.length, { noAO: true }); meshes.push(cards); colored.push(cards); }
        if (v.core) { const c = inst(v.core, mats.foliage, list.length, { cast: true }); meshes.push(c); colored.push(c); }
        if (real(v.trunk)) {
          const cactusBody = S.trees === 'desert' && kind === 0; // the cactus "trunk" is the whole plant: tinted like foliage
          const t = inst(v.trunk, cactusBody ? mats.foliage : mats.trunk, list.length, { cast: true }); meshes.push(t); if (cactusBody) colored.push(t);
        }
        if (v.snow) meshes.push(inst(v.snow, mats.leafSnow, list.length, { noAO: true }));
        fill(list, meshes, colored);
        types.push({ meshes, n: list.length });
      }));
      if (farG) for (const [kn, g] of Object.entries(farG)) {
        const list = spots.filter((o) => o.far && vOf(o).species === kn);
        const m = inst(g.cards, mats.leaf, list.length, { noAO: true });
        fill(list, [m], [m]);
        types.push({ meshes: [m], n: list.length });
      }
      // one contact-shadow disc per tree
      {
        const aoI = new THREE.InstancedMesh(keep(new THREE.CircleGeometry(2.8, 8).rotateX(-Math.PI / 2)), mats.aoInst, Math.max(1, spots.length));
        spots.forEach((o, i) => { m4.compose(p3.set(o.x + 0.8 * o.s, o.y + 0.18, o.z + 0.6 * o.s), q4.identity(), s3.set(o.s, 1, o.s)); aoI.setMatrixAt(i, m4); });
        aoI.count = spots.length; aoI.frustumCulled = false; aoI.renderOrder = 1; aoI.userData.noAO = true; group.add(aoI);
      }
      group.userData.trees = types;
    }
    // ---- ground cover: grass / dry-scrub tufts beyond the barriers (never on the run-off), density follows the quality preset ----
    {
      const cnt = { temperate: 2600, coastal: 2000, forest: 2600, alpine: 700, desert: 900, street: 0 }[S.trees] ?? 0;
      if (cnt) {
        mats.grass = keep(worldDetail(std({ vertexColors: true, map: leafAtlas(), alphaTest: 0.4, roughness: 0.9 }), { fine: 0.18, fineScale: 4.7, mid: 0.2, midScale: 9.1, coarse: 0.12, coarseScale: 37, vertical: true }));
        const tm = new THREE.InstancedMesh(keep(tuft((tr.seed ?? 7) * 5 + 1).cards), mats.grass, cnt);
        const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), p3 = new THREE.Vector3(), s3 = new THREE.Vector3(), ax = new THREE.Vector3(0, 1, 0), tc = new THREE.Color();
        const g1 = C(S.ground.g1), g2 = C(S.ground.g2), pt = S.ground.patch;
        const fixed = S.trees === 'alpine' ? C(0x8a8468) : S.trees === 'desert' ? C(0x8f8258) : null;
        const dry = pt ? new THREE.Color(g1.r * pt[0] * 2, g1.g * pt[1] * 2, g1.b * pt[2] * 2) : g1;
        let n = 0;
        for (let k = 0; k < cnt * 4 && n < cnt; k++) {
          const i = Math.floor(R() * N), sd = R() < 0.5 ? 1 : -1, w = sd > 0 ? T.leftWall[i] : T.rightWall[i];
          if (sd > 0 && T.pitTaper[i] > 0.02) continue;
          const off = sd * (w + 0.8 + 33 * R() * R());
          const x = T.px[i] + T.nx[i] * off, z = T.pz[i] + T.nz[i] * off;
          if (!free(x, z, 1) || beyondWall(x, z) < 0.6) continue;
          const y = terrainAt(x, z, {});
          if (S.sea && y < S.sea.level + 0.6) continue;
          const sc = 0.7 + R() * 1.1;
          m4.compose(p3.set(x, y - 0.03, z), q4.setFromAxisAngle(ax, R() * 6.28), s3.set(sc, sc * (0.8 + R() * 0.4), sc));
          tm.setMatrixAt(n, m4);
          if (fixed) tc.copy(fixed).offsetHSL(0, 0, (R() - 0.5) * 0.08);
          else if (n % 5 === 4) tc.copy(dry).multiplyScalar(1.1 + R() * 0.15);
          else tc.copy(g1).lerp(g2, R()).multiplyScalar(1.1 + R() * 0.15);
          tm.setColorAt(n, tc);
          n++;
        }
        tm.count = n; tm.frustumCulled = false; tm.castShadow = false; tm.receiveShadow = true; tm.userData.noAO = true; tm.name = 'tufts';
        if (tm.instanceColor) tm.instanceColor.needsUpdate = true;
        group.add(tm);
        group.userData.tufts = { mesh: tm, n };
      }
    }
    // scattered rocks: noise-displaced boulders and low slabs, density follows the quality preset
    {
      const spots = [];
      const capN = S.trees === 'street' ? 24 : S.trees === 'desert' ? 70 : 110;
      for (let k = 0, got = 0; k < 500 && got < capN; k++) {
        const i = Math.floor(R() * N), sd = R() < 0.5 ? 1 : -1, w = sd > 0 ? T.leftWall[i] : T.rightWall[i];
        const off = sd * (w + 5 + R() * 48);
        const x = T.px[i] + T.nx[i] * off, z = T.pz[i] + T.nz[i] * off, sc = 0.5 + R() * 1.1;
        if (x < X0 + 20 || x > X1 - 20 || z < Z0 + 20 || z > Z1 - 20) continue;
        if (!tryPlace('rock', x, z, null, 1.3 * sc)) continue;
        spots.push({ x, y: lastGround.hi - 0.3 * sc, z, s: sc, yaw: R() * 6.28, tilt: (R() - 0.5) * 0.5, slab: R() < 0.4, tint: R() });
      }
      const rockGeo = (seed, squash) => {
        let g = new THREE.IcosahedronGeometry(1, 1); g.deleteAttribute('normal'); g.deleteAttribute('uv'); g = mergeVertices(g);
        const pa = g.attributes.position, col = new Float32Array(pa.count * 3);
        for (let v = 0; v < pa.count; v++) {
          const x = pa.getX(v), y = pa.getY(v), z = pa.getZ(v);
          const k = 0.75 + 0.5 * (vnoise(x * 1.3 + seed, z * 1.3 + y * 0.9) * 0.7 + vnoise(x * 3.1 - seed, y * 3.1 + z * 0.7) * 0.3);
          let ny = y * k; if (ny < -0.33) ny = -0.33 + (ny + 0.33) * 0.2; // flat bottom third
          pa.setXYZ(v, x * k, ny * squash, z * k);
          const t = (y + 1) / 2, sh = 0.7 + 0.35 * t + (S.snowbanks && y > 0.45 ? 0.35 : 0);
          col[v * 3] = col[v * 3 + 1] = col[v * 3 + 2] = sh;
        }
        g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeVertexNormals();
        return g;
      };
      const rockMat = keep(worldDetail(std({ vertexColors: true, roughness: 0.95 }), { fine: 0.3, fineScale: 1.3, mid: 0.25, midScale: 4.1, coarse: 0.1, coarseScale: 19, bump: 0.5, vertical: true }));
      const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), p3 = new THREE.Vector3(), s3 = new THREE.Vector3(), eu = new THREE.Euler(), tc = new THREE.Color();
      const baseHex = S.trees === 'desert' ? 0xb4835a : S.trees === 'alpine' ? 0x8d8680 : S.night ? 0x6a5344 : 0x7d756c;
      const meshes = [], ns = [];
      [[false, rockGeo(3.7, 1)], [true, rockGeo(8.1, 0.45)]].forEach(([slab, geo]) => {
        const list = spots.filter((o) => o.slab === slab);
        const m = new THREE.InstancedMesh(keep(geo), rockMat, list.length || 1);
        list.forEach((o, i) => {
          m4.compose(p3.set(o.x, o.y, o.z), q4.setFromEuler(eu.set(o.tilt, o.yaw, 0, 'YXZ')), s3.set(o.s * (slab ? 1.3 : 1), o.s, o.s * (0.8 + (i % 4) * 0.08) * (slab ? 1.2 : 1)));
          m.setMatrixAt(i, m4);
          m.setColorAt(i, tc.setHex(baseHex).offsetHSL(0, 0, (o.tint - 0.5) * 0.18));
        });
        m.count = list.length; m.frustumCulled = false; m.castShadow = true; m.receiveShadow = true; m.name = 'rocks'; group.add(m);
        meshes.push(m); ns.push(list.length);
      });
      group.userData.rocks = { meshes, n: ns };
    }
    // Low draws one static mesh per material instead of one InstancedMesh per tree variant (and two rock meshes).
    // Same triangles and colours as the Low instance counts; Medium and High keep the instanced meshes.
    {
      const bakeStatic = (mesh, n) => {
        if (!mesh || n <= 0) return null;
        const src = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry;
        const pa = src.attributes.position, na = src.attributes.normal, ua = src.attributes.uv, ca = src.attributes.color, vc = pa.count;
        const P = new Float32Array(n * vc * 3), Nn = na ? new Float32Array(n * vc * 3) : null, U = ua ? new Float32Array(n * vc * 2) : null, C = new Float32Array(n * vc * 3);
        const m4 = new THREE.Matrix4(), nm = new THREE.Matrix3();
        for (let i = 0; i < n; i++) {
          mesh.getMatrixAt(i, m4); nm.getNormalMatrix(m4);
          const e = m4.elements, ne = nm.elements;
          let cr = 1, cg = 1, cb = 1;
          if (mesh.instanceColor) { cr = mesh.instanceColor.getX(i); cg = mesh.instanceColor.getY(i); cb = mesh.instanceColor.getZ(i); }
          for (let v = 0; v < vc; v++) {
            const x = pa.getX(v), y = pa.getY(v), z = pa.getZ(v), o = (i * vc + v) * 3;
            P[o] = e[0] * x + e[4] * y + e[8] * z + e[12];
            P[o + 1] = e[1] * x + e[5] * y + e[9] * z + e[13];
            P[o + 2] = e[2] * x + e[6] * y + e[10] * z + e[14];
            if (Nn) {
              const nx = na.getX(v), ny = na.getY(v), nz = na.getZ(v);
              Nn[o] = ne[0] * nx + ne[3] * ny + ne[6] * nz; Nn[o + 1] = ne[1] * nx + ne[4] * ny + ne[7] * nz; Nn[o + 2] = ne[2] * nx + ne[5] * ny + ne[8] * nz;
            }
            if (U) { const uo = (i * vc + v) * 2; U[uo] = ua.getX(v); U[uo + 1] = ua.getY(v); }
            C[o] = (ca ? ca.getX(v) : 1) * cr; C[o + 1] = (ca ? ca.getY(v) : 1) * cg; C[o + 2] = (ca ? ca.getZ(v) : 1) * cb;
          }
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(P, 3));
        if (Nn) g.setAttribute('normal', new THREE.BufferAttribute(Nn, 3));
        if (U) g.setAttribute('uv', new THREE.BufferAttribute(U, 2));
        g.setAttribute('color', new THREE.BufferAttribute(C, 3));
        return g;
      };
      const buckets = new Map();
      const take = (mesh, frac) => {
        const n = Math.floor((mesh?.count || 0) * frac), g = bakeStatic(mesh, n);
        if (!g) return;
        const key = mesh.material.uuid + (mesh.castShadow ? ':s' : '') + (g.attributes.uv ? ':u' : '') + (g.attributes.normal ? ':n' : '');
        let b = buckets.get(key);
        if (!b) buckets.set(key, b = { mat: mesh.material, cast: !!mesh.castShadow, noAO: !!mesh.userData.noAO, geos: [] });
        b.geos.push(g);
      };
      for (const t of group.userData.trees || []) for (const m of t.meshes) take(m, 0.4);
      for (const m of group.userData.rocks?.meshes || []) take(m, 0.3);
      const low = [];
      for (const b of buckets.values()) {
        const g = keep(mergeGeometries(b.geos)); if (!g) continue;
        g.computeBoundingSphere();
        const mesh = new THREE.Mesh(g, keep(b.mat.clone()));
        mesh.name = 'lowBake'; mesh.castShadow = b.cast; mesh.receiveShadow = true; mesh.frustumCulled = false; mesh.visible = false;
        if (b.noAO) mesh.userData.noAO = true;
        group.add(mesh); low.push(mesh);
      }
      group.userData.lowBake = low;
    }
    addMesh(aoB, mats.ao, 'ao', false, false).renderOrder = 1;

    // ---- clouds ----
    if (S.clouds) {
      // soft cumulus billboards (one merged mesh, one canvas texture with 4 cloud variants), each turned toward the circuit's centre
      const CR = rng((tr.seed ?? 7) * 17 + 3), tex = keep(cloudTexture(CR));
      mats.cloud.dispose(); mats.cloud = keep(new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, fog: false, color: new THREE.Color(S.cloudTint ?? 0.92, S.cloudTint ?? 0.92, S.cloudTint ?? 0.92) }));
      let mx = 0, mz = 0; for (let i = 0; i < N; i++) { mx += T.px[i]; mz += T.pz[i]; } mx /= N; mz /= N;
      const pos = [], uv = [], idx = [];
      for (let k = 0; k < 22; k++) {
        // a cumulus bank low over the far ranges instead of ovals overhead
        const a = CR() * Math.PI * 2, r = 700 + CR() * 260, cx = mx + Math.cos(a) * r, cz = mz + Math.sin(a) * r, cy = 110 + CR() * 130;
        const w = 220 + CR() * 260, h = w * (0.26 + CR() * 0.1), v = Math.floor(CR() * 4), yaw = Math.atan2(mx - cx, mz - cz);
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
        const HR = rng(91), skyB = C(S.sky.bot);
        // window-textured slab: bottom hazed 50 % toward the horizon colour, dark roof cap strip (samples the unlit wall texel)
        const slab = (A, B, base, h, c, u0, uw, vh) => {
          const cb = [lerp(c[0], skyB.r, 0.5), lerp(c[1], skyB.g, 0.5), lerp(c[2], skyB.b, 0.5)], cap = [c[0] * 0.35, c[1] * 0.35, c[2] * 0.35], top = base + h;
          pushV(A[0], base, A[1], cb, u0, 0); pushV(B[0], base, B[1], cb, u0 + uw, 0); pushV(B[0], top, B[1], c, u0 + uw, vh);
          pushV(A[0], base, A[1], cb, u0, 0); pushV(B[0], top, B[1], c, u0 + uw, vh); pushV(A[0], top, A[1], c, u0, vh);
          pushV(A[0], top, A[1], cap, 0.004, 0.004); pushV(B[0], top, B[1], cap, 0.004, 0.004); pushV(B[0], top + 2.2, B[1], cap, 0.004, 0.004);
          pushV(A[0], top, A[1], cap, 0.004, 0.004); pushV(B[0], top + 2.2, B[1], cap, 0.004, 0.004); pushV(A[0], top + 2.2, A[1], cap, 0.004, 0.004);
        };
        for (let k = 0; k < 150; k++) {
          const a = (k / 150) * Math.PI * 2 + HR() * 0.02, r = 760 + HR() * 220, cx = mx + Math.cos(a) * r, cz = mz + Math.sin(a) * r;
          const w = 34 + HR() * 50, h = 50 + HR() * HR() * 190, ux = -Math.sin(a), uz = Math.cos(a), base = -30;
          const f = 0.8 - (r - 760) / 220 * 0.3, c = [f * [0.9, 1, 0.85][k % 3], f * 0.9, f], u0 = HR(), uw = w / 120, vh = h / 120; // brightness only: colour lives in the texture
          const A = [cx - ux * w / 2, cz - uz * w / 2], B = [cx + ux * w / 2, cz + uz * w / 2];
          slab(A, B, base, h, c, u0, uw, vh);
        }
        // nearer, dimmer second ring: two skyline depths
        for (let k = 0; k < 90; k++) {
          const a = (k / 90) * Math.PI * 2 + HR() * 0.03, r = 560 + HR() * 140, cx = mx + Math.cos(a) * r, cz = mz + Math.sin(a) * r;
          const w = 26 + HR() * 36, h = 30 + HR() * 80, ux = -Math.sin(a), uz = Math.cos(a), base = -20, u0 = HR();
          if (T.clearance(cx, cz) < w / 2 + 60) continue;
          const f = 0.55, c = [f * [0.9, 1, 0.85][k % 3], f * 0.9, f];
          slab([cx - ux * w / 2, cz - uz * w / 2], [cx + ux * w / 2, cz + uz * w / 2], base, h, c, u0, w / 120, h / 120);
        }
      } else {
        // three ranges (far -> near): radius, haze, amplitude. Profiles are periodic ridge noise sampled on a circle (no seam at a = 0)
        const layers = [[1010, 0.62, 1], [900, 0.42, 0.72], [800, 0.24, 0.5]];
        const rock = kind === 'peaks' ? 0x3c4a5e : kind === 'mesa' ? (S.night ? 0x120f22 : 0xa0603a) : (S.trees === 'forest' ? 0x1c3a2a : 0x3f6a3a);
        const top = kind === 'peaks' ? 0xe8eef6 : kind === 'mesa' ? (S.night ? 0x5a4466 : 0xc08050) : (S.trees === 'forest' ? 0x2a4a34 : 0x5a8a4a);
        const upper = kind === 'peaks' ? 0x52627a : top, low = kind === 'peaks' ? 0x1e2c2a : kind === 'hills' ? (S.trees === 'forest' ? 0x122a1e : 0x2c5030) : rock;
        const sunA = sun.userData.dir, sl = Math.hypot(sunA.x, sunA.z) || 1, sx = sunA.x / sl, sz = sunA.z / sl;
        const shade = (hex, k, f, cool) => { tc.setHex(hex).multiplyScalar(f); if (cool) { tc.b = Math.min(1, tc.b * 1.08); tc.r *= 0.94; } tc.lerp(haze, k); return [tc.r, tc.g, tc.b]; };
        const NS = quality === 0 ? 180 : 360, base = -45;
        layers.forEach(([rad, hz, amp], li) => {
          const ph = li * 2.1 + (tr.seed ?? 7) * 0.37;
          const ridge = (a) => { let v = 0; const ca = Math.cos(a), sa = Math.sin(a); for (const [f, w] of [[3, 0.5], [7, 0.25], [15, 0.15], [31, 0.1]]) v += w * (1 - Math.abs(2 * vnoise(ca * f + ph, sa * f + ph + li * 7.3) - 1)); return v; };
          const hAt = (a) => {
            const r = ridge(a);
            if (kind === 'peaks') return 40 + 260 * amp * Math.pow(r, 1.6);
            if (kind === 'mesa') { const m = smoothstep(0.42, 0.55, r); return 10 + 100 * amp * m + m * 5 * vnoise(Math.cos(a) * 60 + ph, Math.sin(a) * 60); }
            return 18 + 85 * amp * r;
          };
          const snowAt = (a) => 120 + 60 * vnoise(Math.cos(a) * 20 + ph * 3, Math.sin(a) * 20 + li);
          // lit / shadow face: continuous per-vertex profile slope over a wide span against the sun azimuth (ring tangent)
          const da = 2 * Math.PI / NS, sl = (a) => (hAt(a + 3 * da) - hAt(a - 3 * da)) * (-Math.sin(a) * sx + Math.cos(a) * sz);
          const lk = (a) => Math.max(-1, Math.min(1, -sl(a) / 12));
          // A ridge sample that clears the snow line on its own paints one column white. That column is a thin pale streak down the face.
          // Snow only where the crest stays above the line across neighbouring samples, so caps stay and the streaks go.
          const snowS = new Uint8Array(NS);
          if (kind === 'peaks') for (let k = 0; k < NS; k++) { const a = (k / NS) * Math.PI * 2; snowS[k] = hAt(a) > snowAt(a) ? 1 : 0; }
          const capped = (k) => { let n = 0; for (let o = -2; o <= 2; o++) n += snowS[(k + o + NS) % NS]; return n >= 3; };
          const saw = kind === 'hills' && li === 2; // nearest wooded range: serrated treetop crest at double density
          for (let k = 0; k < NS; k++) {
            const a0 = (k / NS) * Math.PI * 2, a1 = ((k + 1) / NS) * Math.PI * 2, am = (a0 + a1) / 2;
            const P0 = [mx + Math.cos(a0) * rad, mz + Math.sin(a0) * rad], P1 = [mx + Math.cos(a1) * rad, mz + Math.sin(a1) * rad];
            let h0 = hAt(a0), h1 = hAt(a1);
            const w0 = wet(P0[0], P0[1]), w1 = wet(P1[0], P1[1]);
            if (w0) h0 = -12; if (w1) h1 = -12;
            const cap0 = capped(k), cap1 = capped((k + 1) % NS);
            const rowCol = (row, h, a, cap = false) => {
              const l = lk(a), fU = 0.99 + 0.13 * l, cool = l < -0.3;
              if (row === 0) return shade(low, Math.min(1, hz + 0.3), 1, false);
              if (row === 1) return shade(kind === 'peaks' && li > 0 ? low : kind === 'hills' ? low : rock, Math.min(1, hz + 0.1), kind === 'hills' ? 1.1 : 1, false);
              // mesa row 2 sits at 0.9h (a thin cap); every other kind keeps the 0.7 split. y matches the row height.
              const y = row === 2 ? h * (kind === 'mesa' ? 0.9 : 0.7) : h;
              if (kind === 'mesa') {
                // darker flank (rock × 1.25), then a lit rim that keeps less haze so it stays the lightest band
                if (row === 2) return shade(rock, hz, fU * 1.25, cool);
                return shade(S.night ? 0x8a74a0 : 0xd09a64, hz * 0.6, fU, cool);
              }
              const hex = kind === 'peaks' ? (cap && y > snowAt(a) ? top : upper) : row === 3 ? top : kind === 'hills' ? low : upper;
              return shade(hex, row === 3 ? hz * 0.8 : hz, fU * (kind === 'hills' && row === 2 ? 1.2 : 1), cool);
            };
            const band = kind === 'mesa' ? 0.9 : 0.7;
            const ys0 = [base, h0 * 0.35, h0 * band, h0], ys1 = [base, h1 * 0.35, h1 * band, h1];
            const c0 = [0, 1, 2, 3].map((r) => rowCol(r, h0, a0, cap0)), c1 = [0, 1, 2, 3].map((r) => rowCol(r, h1, a1, cap1));
            const rows = saw ? 2 : 3;
            for (let r = 0; r < rows; r++) {
              pushV(P0[0], ys0[r], P0[1], c0[r]); pushV(P1[0], ys1[r], P1[1], c1[r]); pushV(P1[0], ys1[r + 1], P1[1], c1[r + 1]);
              pushV(P0[0], ys0[r], P0[1], c0[r]); pushV(P1[0], ys1[r + 1], P1[1], c1[r + 1]); pushV(P0[0], ys0[r + 1], P0[1], c0[r + 1]);
            }
            if (saw) {
              // top band split in two with alternating +/-3 m treetops
              const Pm = [mx + Math.cos(am) * rad, mz + Math.sin(am) * rad], hm = (w0 || w1) ? Math.min(h0, h1) : hAt(am), cm2 = rowCol(2, hm, am), cm3 = rowCol(3, hm, am);
              const t0 = h0 + (w0 ? 0 : 3), tm = hm - ((w0 || w1) ? 0 : 3), t1 = h1 + (w1 ? 0 : 3);
              const seg = (Pa, ya, ta, ca2, ca3, Pb, yb, tb, cb2, cb3) => {
                pushV(Pa[0], ya, Pa[1], ca2); pushV(Pb[0], yb, Pb[1], cb2); pushV(Pb[0], tb, Pb[1], cb3);
                pushV(Pa[0], ya, Pa[1], ca2); pushV(Pb[0], tb, Pb[1], cb3); pushV(Pa[0], ta, Pa[1], ca3);
              };
              seg(P0, ys0[2], t0, c0[2], c0[3], Pm, hm * 0.7, tm, cm2, cm3);
              seg(Pm, hm * 0.7, tm, cm2, cm3, P1, ys1[2], t1, c1[2], c1[3]);
            }
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
      // thin leaned streak: a 7 cm box passing the lens read as a white pillar
      const streak = new THREE.BoxGeometry(0.016, 0.95, 0.016);
      streak.translate(0, 0.35, 0); streak.rotateX(0.42);
      rainBits = new THREE.InstancedMesh(keep(streak), keep(new THREE.MeshBasicMaterial({ color: 0xd5e6f6, transparent: true, opacity: 0.45, depthWrite: false })), COUNT);
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
    // cone: ground wedge from the nose. Centre line stays bright; the edges fade so it is a pool, not a hard triangle.
    const pos = [], col = [], seg = 6, Lc = 20, Wc = 5.2;
    const push = (x, z, b) => { pos.push(x, 0.03, z); col.push(b * 0.16, b * 0.145, b * 0.09); };
    for (let k = 0; k < seg; k++) {
      const z0 = (k / seg) * Lc, z1 = ((k + 1) / seg) * Lc, w0 = 0.35 + (z0 / Lc) * Wc, w1 = 0.35 + (z1 / Lc) * Wc;
      const b0 = (1 - k / seg) ** 1.7, b1 = (1 - (k + 1) / seg) ** 1.7, e0 = b0 * 0.05, e1 = b1 * 0.05;
      // left half then right half; the shared centre line carries the full brightness
      const tri = (xa, za, ca, xb, zb, cb, xc, zc, cc) => { push(xa, za, ca); push(xb, zb, cb); push(xc, zc, cc); };
      tri(-w0, z0, e0, 0, z0, b0, 0, z1, b1);
      tri(-w0, z0, e0, 0, z1, b1, -w1, z1, e1);
      tri(0, z0, b0, w0, z0, e0, w1, z1, e1);
      tri(0, z0, b0, w1, z1, e1, 0, z1, b1);
    }
    const cg = new THREE.BufferGeometry();
    cg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); cg.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    headCones = new THREE.InstancedMesh(cg, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, side: THREE.DoubleSide, forceSinglePass: true, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6 }), n); // single pass: additive, so draw order doesn't change the look
    headCones.name = 'headlights';
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
        // lollipop stays red during the stop and dims on release (the gantry is what signals go, by going out)
        const lm = crewRig.people[6]; W(-1.4, 7.4, _w); lm.position.copy(_w); lm.rotation.y = oth + Math.PI; lm.scale.y = 1;
        crewRig.sign.position.copy(_w).add(new THREE.Vector3(0, 0.2, 0)); crewRig.sign.rotation.y = oth;
        crewRig.signLamp.material.color.setHex(I.stage === 3 ? 0x3a0c0a : 0xe6261f);
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
    const low = quality === 0;
    const trees = group.userData.trees || [];
    for (const t of trees) for (const m of t.meshes) { m.visible = !low; if (!low) m.count = Math.floor(t.n * (quality >= 2 ? 1 : 0.7)); }
    if (group.userData.rocks) {
      const r = group.userData.rocks;
      r.meshes.forEach((m, k) => { m.visible = !low; if (!low) m.count = Math.floor(r.n[k] * (quality >= 2 ? 1 : 0.6)); });
    }
    if (group.userData.lowBake) for (const m of group.userData.lowBake) m.visible = low;
    if (group.userData.hiDetail) for (const m of group.userData.hiDetail) m.visible = quality >= 1;
    if (group.userData.tufts) { const t = group.userData.tufts; t.mesh.count = quality >= 2 ? t.n : quality === 1 ? Math.floor(t.n / 2) : 0; t.mesh.visible = quality >= 1; }
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
        const inner = 7; // streaks inside this radius fill the lens
        for (let i = 0; i < rainData.length; i++) {
          const s = rainData[i];
          s.y -= s.v * dt; s.age += dt;
          const dx = s.x - fx.x, dz = s.z - fx.z;
          if (s.y < fx.y - 4 || dx * dx + dz * dz < inner * inner) {
            const a = Math.random() * 6.283, rr = inner + Math.sqrt(Math.random()) * Math.max(1, rad - inner);
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
  function setStartLights(count) {
    if (!startLights) return;
    const { geo, pods, mat } = startLights;
    const col = geo.attributes.color;
    const n = Math.max(0, Math.min(pods.length, count | 0));
    const any = n > 0;
    const paint = (from, len, rgb) => { for (let v = from; v < from + len; v++) col.setXYZ(v, rgb[0], rgb[1], rgb[2]); };
    for (let i = 0; i < pods.length; i++) {
      const lit = i < n, rgb = startPodColor(lit, any);
      const halo = [rgb[0] * 0.42, rgb[1] * 0.42, rgb[2] * 0.42];
      paint(pods[i].c0, pods[i].cn, rgb);
      paint(pods[i].h0, pods[i].hn, halo);
    }
    col.needsUpdate = true;
    mat.color.setRGB(1, 1, 1);
  }

  function dispose() {
    if (scene) { scene.remove(group); scene.fog = prevFog; scene.background = prevBg; }
    for (const o of disposables) o.dispose?.();
    sun?.shadow.map?.dispose();
    group.clear();
    startLights = null; disposables.length = 0; placements.length = 0; hills.length = 0; scene = null; crewRig = null; flagData = []; splashData = []; reserved.length = 0;
    sea = stars = floods = clouds = ferris = gondolas = flags = splash = rainBits = headCones = carLights = tailLights = null; rainData = []; visRain = 0; carMeshes = []; group.userData = {};
  }

  return { name: S.name, style: S, group, placements, groundAt: gy, build, dispose, setWeather, update, setStartLights, setCars, setPit, setQuality, applyMood, fx, get quality() { return quality; } };
}
