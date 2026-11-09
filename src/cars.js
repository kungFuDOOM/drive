// Chunky low-poly open-wheel cars (original designs, made-up livery). Local frame: +z forward, +x left, +y up, y=0 is the road.
//
// Per car: 4 draw calls  -> body (one merged vertex-coloured mesh: sculpted tub/nose, undercut sidepods, engine cover, halo/aeroscreen,
//                           two-tier wings with endplates, wishbones, helmet, livery + race numbers, all one shared material)
//                           wheels (ONE InstancedMesh, 4 instances: tyre + coloured sidewall ring + rim + spokes)
//                           lamps (brake / rain light quads, vertex colours rewritten per frame)
//                           shadow blob.
// Geometry is built once per (class, team, compound) and cached; it needs no WebGL/canvas, so tests run it in Node.
//
// Animation API (all visual-only, deterministic, no allocation):  animateCar(m, state, dt)  and  m.setTire('dry'|'wet')
//   m.wheels      : 4 handles { front, left, steer, spin, bump, visible }  (visible=false hides the tyre: pit crew uses it)
//   m.frontPivots : the two steering handles (set .steer, radians) - animateCar drives them from state.steer
//   m.brakeLight / m.rainLight : { intensity 0..1, on }  (written to the lamp vertex colours by animateCar)
//   m.pivot       : pitched/rolled group (body + wheels + lamps); m.group: placed on the road
import * as THREE from 'three';
import { mergeGeometries, toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { patternStyle } from './livery.js';

// ---------------------------------------------------------------- identity / livery
const NUMBERS = [1, 7, 12, 21, 28, 35, 42, 56, 63, 88];
/** Race number of a team (player team = 1). Pure numbers, not tied to any real driver or team. */
export const carNumber = (teamIndex) => NUMBERS[((teamIndex % NUMBERS.length) + NUMBERS.length) % NUMBERS.length];
export const LIVERIES = ['stripe', 'twotone', 'chevron', 'flash', 'hoop'];
/** Livery style per team (the player team 0 wears chevrons + stripe so it is recognisable at a glance). */
export const liveryOf = (teamIndex) => (teamIndex === 0 ? 'chevron' : LIVERIES[((teamIndex % LIVERIES.length) + LIVERIES.length) % LIVERIES.length]);
/** Body style + number for a team: a custom livery (team.livery = { pattern, c3, number }) wins over the per-index defaults. */
export const styleOf = (team, teamIndex) => (team?.livery?.pattern ? patternStyle(team.livery.pattern) : liveryOf(teamIndex));
export const numberOf = (team, teamIndex) => team?.livery?.number ?? carNumber(teamIndex);

const GLYPHS = {
  0: '111101101101111', 1: '010110010010111', 2: '111001111100111', 3: '111001111001111', 4: '101101111001001',
  5: '111100111001111', 6: '111100111101111', 7: '111001001010010', 8: '111101111101111', 9: '111101111001111',
};

// ---------------------------------------------------------------- tiny mesh builder (build-time only; allocations are fine here)
const _c = new THREE.Color();
const rgb = (hex) => { _c.set(hex); return [_c.r, _c.g, _c.b]; };
const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const scl = (a, k) => [Math.min(1, a[0] * k), Math.min(1, a[1] * k), Math.min(1, a[2] * k)];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

class Mesh {
  constructor() { this.pos = []; this.col = []; }
  /** one triangle, wound so the face normal points away from `inside` */
  tri(a, b, c, color, inside) {
    const n = cross(sub(b, a), sub(c, a));
    if (inside && dot(n, sub(a, inside)) < 0) { const t = b; b = c; c = t; }
    // metallic / clear-coat facets: flat colour tinted by the facet normal (sky-lit tops, warm sides, dark undersides) + a tiny per-facet sparkle
    const nn = norm(cross(sub(b, a), sub(c, a)));
    let k = 1 + 0.16 * Math.max(0, nn[1]) - 0.22 * Math.max(0, -nn[1]) + 0.07 * Math.max(0, nn[2]);
    const h = Math.sin((a[0] * 12.9898 + a[1] * 78.233 + a[2] * 37.719) * 43758.5453) * 0.5 + 0.5;
    k *= 0.97 + 0.06 * (h - Math.floor(h));
    const sky = nn[1] > 0.6 ? 0.06 : 0;
    const cc = [Math.min(1, color[0] * k + sky * 0.5), Math.min(1, color[1] * k + sky * 0.6), Math.min(1, color[2] * k + sky)];
    for (const p of [a, b, c]) { this.pos.push(p[0], p[1], p[2]); this.col.push(cc[0], cc[1], cc[2]); }
  }
  quad(a, b, c, d, color, inside) { this.tri(a, b, c, color, inside); this.tri(a, c, d, color, inside); }
  /** unlit-style (no facet tint): decals, glyphs, lamps */
  flatQuad(a, b, c, d, color, up = [0, 1, 0]) {
    for (const t of [[a, b, c], [a, c, d]]) {
      const n = cross(sub(t[1], t[0]), sub(t[2], t[0]));
      const [p, q, r] = dot(n, up) < 0 ? [t[0], t[2], t[1]] : t;
      for (const v of [p, q, r]) { this.pos.push(v[0], v[1], v[2]); this.col.push(color[0], color[1], color[2]); }
    }
  }
  /** axis-aligned box (optionally pitched about x around its centre) */
  box(cx, cy, cz, w, h, l, color, rx = 0, colorTop = null) {
    const s = Math.sin(rx), co = Math.cos(rx), P = [];
    for (const [sx, sy, sz] of [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]) {
      const y = sy * h / 2, z = sz * l / 2;
      P.push([cx + sx * w / 2, cy + y * co - z * s, cz + y * s + z * co]);
    }
    const ins = [cx, cy, cz], top = colorTop || color;
    this.quad(P[0], P[1], P[2], P[3], color, ins); this.quad(P[4], P[5], P[6], P[7], color, ins);
    this.quad(P[0], P[4], P[7], P[3], color, ins); this.quad(P[1], P[5], P[6], P[2], color, ins);
    this.quad(P[3], P[2], P[6], P[7], top, ins); this.quad(P[0], P[1], P[5], P[4], scl(color, 0.7), ins);
  }
  /** thin square beam between two points (wishbones, struts, halo) */
  beam(p0, p1, t, color) {
    const d = norm(sub(p1, p0)), ref = Math.abs(d[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
    const u = norm(cross(d, ref)), v = norm(cross(d, u)), h = t / 2, P = [];
    for (const p of [p0, p1]) for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) P.push([p[0] + u[0] * a * h + v[0] * b * h, p[1] + u[1] * a * h + v[1] * b * h, p[2] + u[2] * a * h + v[2] * b * h]);
    const ins = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, (p0[2] + p1[2]) / 2];
    for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; this.quad(P[i], P[j], P[4 + j], P[4 + i], color, ins); }
    this.quad(P[0], P[1], P[2], P[3], color, ins); this.quad(P[4], P[5], P[6], P[7], color, ins);
  }
  /** convex side-profile polygon [[z,y],..] extruded across x0..x1 (endplates, fins, pylons) */
  plate(poly, x0, x1, color, edge = null) {
    const n = poly.length, cz = poly.reduce((s, p) => s + p[0], 0) / n, cy = poly.reduce((s, p) => s + p[1], 0) / n, ins = [(x0 + x1) / 2, cy, cz];
    for (let i = 1; i < n - 1; i++) {
      this.tri([x0, poly[0][1], poly[0][0]], [x0, poly[i][1], poly[i][0]], [x0, poly[i + 1][1], poly[i + 1][0]], color, ins);
      this.tri([x1, poly[0][1], poly[0][0]], [x1, poly[i][1], poly[i][0]], [x1, poly[i + 1][1], poly[i + 1][0]], color, ins);
    }
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      this.quad([x0, poly[i][1], poly[i][0]], [x1, poly[i][1], poly[i][0]], [x1, poly[j][1], poly[j][0]], [x0, poly[j][1], poly[j][0]], edge && i === 0 ? edge : color, ins);
    }
  }
  /** loft through stations [{z, ring:[[x,y]..], seg?:[colour per ring segment]}] front -> rear; `cap` colours the front end */
  loft(stations, defaultColor, capFront = null) {
    for (let s = 0; s < stations.length - 1; s++) {
      const A = stations[s], B = stations[s + 1], n = A.ring.length;
      let cx = 0, cy = 0;
      for (let i = 0; i < n; i++) { cx += A.ring[i][0] + B.ring[i][0]; cy += A.ring[i][1] + B.ring[i][1]; }
      const ins = [cx / (2 * n), cy / (2 * n), (A.z + B.z) / 2];
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n, col = (A.seg && A.seg[i]) || defaultColor;
        this.quad([A.ring[i][0], A.ring[i][1], A.z], [A.ring[j][0], A.ring[j][1], A.z], [B.ring[j][0], B.ring[j][1], B.z], [B.ring[i][0], B.ring[i][1], B.z], col, ins);
      }
    }
    const fan = (st, col, rear) => {
      const n = st.ring.length; let cx = 0, cy = 0;
      for (const p of st.ring) { cx += p[0]; cy += p[1]; }
      const c0 = [cx / n, cy / n, st.z], ins = [c0[0], c0[1], st.z + (rear ? 1 : -1)];
      for (let i = 0; i < n; i++) { const j = (i + 1) % n; this.tri(c0, [st.ring[i][0], st.ring[i][1], st.z], [st.ring[j][0], st.ring[j][1], st.z], col, ins); }
    };
    fan(stations[0], capFront || defaultColor, false);
    fan(stations[stations.length - 1], defaultColor, true);
  }
  /** mirror everything built by `fn` across x (adds the +x half given -x / vice versa) */
  mirrored(fn) {
    const a = this.pos.length;
    fn(1);
    const end = this.pos.length;
    for (let i = a; i < end; i += 9) { // re-add the same triangle mirrored (reverse winding)
      const P = [0, 1, 2].map((k) => [-this.pos[i + k * 3], this.pos[i + k * 3 + 1], this.pos[i + k * 3 + 2]]);
      const C = this.col.slice(i, i + 9);
      this.pos.push(P[0][0], P[0][1], P[0][2], P[2][0], P[2][1], P[2][2], P[1][0], P[1][1], P[1][2]);
      this.col.push(C[0], C[1], C[2], C[6], C[7], C[8], C[3], C[4], C[5]);
    }
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    // smooth shading on gentle curves, hard edges kept at creases (same triangles, same order - only the normals change)
    return toCreasedNormals(g, CREASE);
  }
}

// ---------------------------------------------------------------- shared look
const CREASE = 0.62; // rad (~35 deg)
const DARK = rgb(0x15151a), CARBON = rgb(0x24262e), METAL = rgb(0x8d939e), WHITE = rgb(0xf2f2f4), GLASS = rgb(0x1c3550), GLASS2 = rgb(0x4f86b8);
export const WHEEL_R = { gp: 0.38, speedway: 0.42 };
const WHEEL_W = { gp: 0.5, speedway: 0.55 };
/** Spoke count; the spokes, hub nut, tread tones and rim lip all repeat every SPOKE_PITCH (the white spoke / flat patch / lettering do not). */
export const SPOKES = 5;
export const SPOKE_PITCH = (Math.PI * 2) / SPOKES;
export const WHEEL_POS = { // [x (left +), z] for FL, FR, RL, RR (y = radius)
  gp: [[0.95, 1.9], [-0.95, 1.9], [1.05, -1.65], [-1.05, -1.65]],
  speedway: [[1.0, 1.7], [-1.0, 1.7], [1.1, -1.5], [-1.1, -1.5]],
};

/** Linear interpolation of a body height profile: stations [[z, yTop]] front -> rear. */
function profileY(st, z) {
  if (z >= st[0].z) return st[0].yTop;
  for (let i = 0; i < st.length - 1; i++) if (z <= st[i].z && z >= st[i + 1].z) { const t = (st[i].z - z) / (st[i].z - st[i + 1].z); return st[i].yTop + (st[i + 1].yTop - st[i].yTop) * t; }
  return st[st.length - 1].yTop;
}

/** Pixel race number laid on a sloping top surface (top(z) gives the surface height). Digits read from behind (up = +z). */
function numberDecal(m, text, cx, z0, top, cell, padCol, digitCol) {
  const nd = text.length, w = (nd * 3 + (nd - 1)) * cell, h = 5 * cell, x0 = cx - w / 2;
  const lift = 0.014;
  const P = (x, z) => [x, top(z) + lift, z];
  // pad
  const pm = cell * 0.6;
  m.flatQuad(P(x0 - pm, z0 - pm), P(x0 + w + pm, z0 - pm), P(x0 + w + pm, z0 + h + pm), P(x0 - pm, z0 + h + pm), padCol);
  // read from behind the car (+x is the car's left = the reader's left): u runs left -> right for the reader
  const xr = (u) => cx + w / 2 - u;
  for (let d = 0; d < nd; d++) {
    const g = GLYPHS[text[d]] || GLYPHS[0];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) if (g[r * 3 + c] === '1') {
      const u = d * 4 * cell + c * cell, xa = xr(u + cell), xb = xr(u), za = z0 + (4 - r) * cell; // row 0 = top of the glyph = +z
      const l = lift + 0.006;
      m.flatQuad([xa, top(za) + l, za], [xb, top(za) + l, za], [xb, top(za + cell) + l, za + cell], [xa, top(za + cell) + l, za + cell], digitCol);
    }
  }
}

// ---------------------------------------------------------------- GP body
function ring6(wb, wm, wt, y0, ym, y1) { return [[wb, y0], [wm, ym], [wt, y1], [-wt, y1], [-wm, ym], [-wb, y0]]; }

function gpBody(team, teamIndex) {
  const c1 = team.c1, c2 = team.c2;
  const m = new Mesh(), style = styleOf(team, teamIndex), num = String(numberOf(team, teamIndex));
  const C1 = rgb(c1), C2 = rgb(c2), C1d = scl(C1, 0.72), C1l = scl(C1, 1.12), C3 = team.livery?.c3 != null ? rgb(team.livery.c3) : scl(C2, 0.9);
  const twotone = style === 'twotone';
  const lowSide = twotone ? C2 : C1d;
  // --- tub + nose + engine cover as one sculpted loft. yTop profile drives the number decals.
  const S = [
    { z: 3.36, wb: 0.05, wm: 0.06, wt: 0.05, y0: 0.2, ym: 0.26, y1: 0.31 },
    { z: 2.9, wb: 0.12, wm: 0.15, wt: 0.1, y0: 0.2, ym: 0.34, y1: 0.4 },
    { z: 2.3, wb: 0.2, wm: 0.27, wt: 0.17, y0: 0.2, ym: 0.42, y1: 0.5 },
    { z: 1.6, wb: 0.3, wm: 0.38, wt: 0.25, y0: 0.22, ym: 0.5, y1: 0.6 },
    { z: 0.95, wb: 0.4, wm: 0.46, wt: 0.33, y0: 0.24, ym: 0.58, y1: 0.7 },
    { z: 0.3, wb: 0.44, wm: 0.5, wt: 0.37, y0: 0.26, ym: 0.62, y1: 0.74 }, // cockpit opening starts
    { z: -0.35, wb: 0.42, wm: 0.46, wt: 0.3, y0: 0.28, ym: 0.68, y1: 0.84 },
    { z: -0.95, wb: 0.36, wm: 0.4, wt: 0.22, y0: 0.3, ym: 0.78, y1: 1.02 }, // airbox / engine cover peak
    { z: -1.55, wb: 0.28, wm: 0.3, wt: 0.14, y0: 0.32, ym: 0.62, y1: 0.8 },
    { z: -2.05, wb: 0.22, wm: 0.24, wt: 0.1, y0: 0.34, ym: 0.5, y1: 0.62 },
    { z: -2.4, wb: 0.2, wm: 0.2, wt: 0.1, y0: 0.34, ym: 0.46, y1: 0.56 },
  ];
  const topCol = (z) => (style === 'fade' ? mixc(C1l, C2, clamp((1.6 - z) / 3.6, 0, 1)) : (style === 'hoop' && ((z < -0.4 && z > -1.0) || z < -2.0)) || (twotone && z < -0.3) ? C2 : C1l);
  const stations = S.map((s) => ({ z: s.z, ring: ring6(s.wb, s.wm, s.wt, s.y0, s.ym, s.y1), seg: [lowSide, C1, topCol(s.z), C1, lowSide, DARK] }));
  m.loft(stations, C1, DARK);
  const topAt = (() => { const t = S.map((s) => ({ z: s.z, yTop: s.y1 })); return (z) => profileY(t, z); })();
  const wtAt = (() => { const t = S.map((s) => ({ z: s.z, yTop: s.wt })); return (z) => profileY(t, z); })(); // half-width of the flat top
  // cockpit tub opening + head rest
  m.box(0, 0.745, 0.05, 0.5, 0.05, 0.9, DARK);
  m.box(0, 0.84, -0.42, 0.34, 0.2, 0.18, CARBON);
  // helmet + visor
  const hel = new THREE.SphereGeometry(0.19, 6, 4).toNonIndexed();
  const hp = hel.attributes.position, helCol = style === 'twotone' ? C2 : WHITE;
  for (let i = 0; i < hp.count; i += 3) m.tri([hp.getX(i), hp.getY(i) + 0.95, hp.getZ(i) + 0.08], [hp.getX(i + 1), hp.getY(i + 1) + 0.95, hp.getZ(i + 1) + 0.08], [hp.getX(i + 2), hp.getY(i + 2) + 0.95, hp.getZ(i + 2) + 0.08], helCol, [0, 0.95, 0.08]);
  m.box(0, 0.97, 0.245, 0.27, 0.085, 0.07, rgb(0x0b1a2b));
  m.box(0, 1.01, 0.262, 0.2, 0.025, 0.04, rgb(0xffcf3a)); // visor highlight strip: contrasting
  // --- sidepods: sculpted, undercut at the bottom, coke-bottle taper
  const pod = (z, a, b, c, d, e) => ({ z, ring: [a, b, c, d, e], seg: [DARK, lowSide, C1, twotone ? C2 : C1l, scl(C1, 0.6)] });
  // ring: [bottom-inner, undercut, outer-low, outer-top, inner-top]  (x>0 = left)
  const pods = [
    pod(0.85, [0.5, 0.3], [0.78, 0.36], [1.0, 0.52], [0.9, 0.74], [0.5, 0.74]),
    pod(0.1, [0.5, 0.3], [0.74, 0.37], [0.97, 0.56], [0.86, 0.78], [0.5, 0.82]),
    pod(-0.9, [0.42, 0.34], [0.62, 0.4], [0.82, 0.58], [0.68, 0.72], [0.4, 0.88]),
    pod(-1.9, [0.3, 0.36], [0.42, 0.4], [0.5, 0.5], [0.42, 0.6], [0.26, 0.64]),
  ];
  m.mirrored(() => m.loft(pods, C1, DARK)); // dark front cap = air intake
  // --- engine cover spine fin + air intake (airbox)
  m.plate([[-1.5, 0.9], [-1.6, 1.12], [-1.75, 1.12], [-2.35, 0.66], [-2.45, 0.58], [-1.5, 0.58]], -0.02, 0.02, C1l, C2);
  m.box(0, 1.04, -0.78, 0.3, 0.2, 0.3, C1l);
  m.box(0, 1.07, -0.62, 0.22, 0.13, 0.04, DARK); // intake mouth
  // --- halo: front pillar + two swept arms to rear mounts
  const HALO = rgb(0x30323c);
  m.beam([0, 0.78, 0.5], [0, 1.1, 0.62], 0.06, HALO);
  m.beam([0.02, 1.1, 0.62], [0.33, 1.1, 0.12], 0.055, HALO); m.beam([-0.02, 1.1, 0.62], [-0.33, 1.1, 0.12], 0.055, HALO);
  m.beam([0.33, 1.1, 0.12], [0.34, 0.82, -0.18], 0.055, HALO); m.beam([-0.33, 1.1, 0.12], [-0.34, 0.82, -0.18], 0.055, HALO);
  m.box(0, 1.125, 0.6, 0.07, 0.03, 0.12, C2);
  // --- front wing: 3 elements, nose pylons, big endplates
  const elems = [[3.4, 0.13, 0.3, 0, DARK], [3.25, 0.19, 0.28, 0.17, C2], [3.1, 0.26, 0.26, 0.34, C1l]];
  for (const [z, y, ch, rx, col] of elems) m.box(0, y, z, 2.0, 0.035, ch, col, rx);
  m.beam([0.12, 0.3, 2.7], [0.1, 0.17, 3.15], 0.05, CARBON); m.beam([-0.12, 0.3, 2.7], [-0.1, 0.17, 3.15], 0.05, CARBON);
  m.mirrored(() => m.plate([[3.5, 0.08], [3.5, 0.28], [3.2, 0.42], [2.95, 0.4], [2.95, 0.1]], 1.0, 1.05, C1, C2));
  // --- rear wing: two-tier + beam wing + endplates + supports
  m.box(0, 1.12, -2.42, 1.7, 0.045, 0.34, C1l, -0.12);
  m.box(0, 1.28, -2.46, 1.7, 0.04, 0.3, C2, -0.3); // upper flap
  m.box(0, 0.58, -2.5, 1.1, 0.035, 0.26, DARK, -0.1); // beam wing
  m.mirrored(() => m.plate([[-2.1, 0.5], [-2.1, 1.42], [-2.5, 1.42], [-2.75, 1.34], [-2.75, 0.55]], 0.86, 0.92, C1, C2));
  m.beam([0.1, 0.62, -2.15], [0.1, 1.1, -2.4], 0.055, CARBON); m.beam([-0.1, 0.62, -2.15], [-0.1, 1.1, -2.4], 0.055, CARBON);
  m.box(0, 0.5, -2.1, 0.4, 0.28, 0.5, DARK); // gearbox
  m.box(0, 0.32, -2.55, 0.9, 0.08, 0.35, CARBON, 0.18); // diffuser tail
  // --- floor + front axle suspension fairing
  m.box(0, 0.12, -0.15, 1.3, 0.05, 4.2, CARBON);
  // --- wishbones & push rods (visible suspension)
  const WB = rgb(0x4a4d58);
  for (const [x, z] of WHEELS_GP_HUBS) {
    const sx = Math.sign(x), hub = [x - sx * 0.25, 0.4, z], zf = z > 0 ? 1 : -1;
    m.beam([sx * 0.4, 0.34, z + 0.35 * zf], hub, 0.04, WB); m.beam([sx * 0.4, 0.34, z - 0.35 * zf], hub, 0.04, WB);
    m.beam([sx * 0.36, 0.62, z + 0.25 * zf], [hub[0], 0.5, z], 0.04, WB); m.beam([sx * 0.36, 0.62, z - 0.25 * zf], [hub[0], 0.5, z], 0.04, WB);
    m.beam([sx * 0.2, 0.7, z], [hub[0], 0.43, z], 0.035, C2);
  }
  // --- livery decals + race numbers
  liveryDecals(m, style, C1, C2, topAt, wtAt, pods, C3);
  const padCol = style === 'twotone' ? WHITE : rgb(0xf0f0f2), digCol = team.livery && lumA(C3) < 0.45 ? C3 : DARK;
  numberDecal(m, num, 0, 1.3, topAt, 0.06, padCol, digCol); // nose
  numberDecal(m, num, 0, -1.42, topAt, 0.034, padCol, digCol); // engine cover (behind the airbox, ahead of the spine fin)
  return m;
}
const WHEELS_GP_HUBS = [[0.95, 1.9], [-0.95, 1.9], [1.05, -1.65], [-1.05, -1.65]];

/** Point on the +x sidepod top surface at z: f = 0 inner-top edge .. 1 outer-top edge (pod rings: [.., outer-top, inner-top]). */
function podTop(pods, z, f) {
  let i = 0;
  while (i < pods.length - 2 && z < pods[i + 1].z) i++;
  const A = pods[i], B = pods[i + 1], t = clamp((A.z - z) / (A.z - B.z), 0, 1);
  const lerp2 = (k) => [A.ring[k][0] + (B.ring[k][0] - A.ring[k][0]) * t, A.ring[k][1] + (B.ring[k][1] - A.ring[k][1]) * t];
  const o = lerp2(3), n = lerp2(4);
  return [n[0] + (o[0] - n[0]) * f, n[1] + (o[1] - n[1]) * f];
}

/** Livery decals on the flat top of the loft (|x| <= wtAt(z)) and the sidepod tops; every vertex sits 12 mm above its surface. */
function liveryDecals(m, style, C1, C2, topAt, wtAt, pods, C3 = scl(C2, 0.9)) {
  const L = 0.012, cx = (x, z) => clamp(x, -wtAt(z) + 0.005, wtAt(z) - 0.005); // keep decals on the flat top (no overhang above the sloping sides)
  const P = (x, z) => [cx(x, z), topAt(z) + L, z];
  const dec = (x0, x1, z0, z1, col) => m.flatQuad(P(x0, z0), P(x1, z0), P(x1, z1), P(x0, z1), col);
  if (style === 'stripe' || style === 'chevron') {
    for (const sx of [1, -1]) { const xa = sx * 0.045, xb = sx * 0.1; dec(xa, xb, 3.3, 1.7, C2); dec(xa, xb, -0.4, -2.35, C2); }
  }
  if (style === 'chevron') {
    for (let k = 0; k < 2; k++) { // V chevrons pointing at the nose tip
      const z = 2.25 - k * 0.5;
      for (const sx of [1, -1]) m.flatQuad(P(sx * 0.02, z + 0.1), P(sx * 0.2, z - 0.14), P(sx * 0.2, z - 0.4), P(sx * 0.02, z - 0.12), k ? C3 : C2);
    }
  }
  if (style === 'flash') {
    dec(-0.08, 0.08, 3.36, 2.7, C2);
    // side flashes lie on the sidepod tops (they used to float 4-17 cm above them, tilted the wrong way)
    for (const sx of [1, -1]) {
      const q = (z, f) => { const p = podTop(pods, z, f); return [sx * p[0], p[1] + L, z]; };
      m.flatQuad(q(-0.6, 0.55), q(-0.6, 0.15), q(-1.4, 0.15), q(-1.4, 0.65), C2);
    }
  }
  // hoop: rear band moved behind the engine-cover number pad (it used to overlap it -> z-fighting)
  if (style === 'hoop') { dec(-0.3, 0.3, 0.9, 0.7, C2); dec(-0.3, 0.3, -1.6, -1.75, C2); }
  if (style === 'twotone') dec(-0.08, 0.08, 3.36, 0.4, C2);
  if (style === 'fade') { for (const sx of [1, -1]) dec(sx * 0.03, sx * 0.06, 3.2, 1.8, C3); }
  if (style === 'checker') {
    // chequer band across the nose and a second one on the engine cover (C2 / accent squares)
    for (const [z0, n] of [[2.05, 2], [-1.95, 2]]) for (let r = 0; r < n; r++) for (let c = -3; c < 3; c++) {
      const za = z0 - r * 0.1, w = 0.06;
      dec(c * w, (c + 1) * w, za, za - 0.1, ((r + c) & 1) ? C2 : C3);
    }
    for (const sx of [1, -1]) dec(sx * 0.05, sx * 0.08, 1.7, 0.4, C2);
  }
}
const lumA = (a) => 0.3 * a[0] + 0.59 * a[1] + 0.11 * a[2];

// ---------------------------------------------------------------- Speedway body (heavier, blunter, aeroscreen)
function speedwayBody(team, teamIndex) {
  const c1 = team.c1, c2 = team.c2;
  const m = new Mesh(), style = styleOf(team, teamIndex), num = String(numberOf(team, teamIndex));
  const C1 = rgb(c1), C2 = rgb(c2), C1l = scl(C1, 1.12), twotone = style === 'twotone', lowSide = twotone ? C2 : scl(C1, 0.72), C3 = team.livery?.c3 != null ? rgb(team.livery.c3) : scl(C2, 0.9);
  const S = [
    { z: 3.3, wb: 0.2, wm: 0.24, wt: 0.2, y0: 0.2, ym: 0.3, y1: 0.36 },
    { z: 2.7, wb: 0.3, wm: 0.38, wt: 0.28, y0: 0.2, ym: 0.38, y1: 0.46 },
    { z: 2.0, wb: 0.42, wm: 0.5, wt: 0.38, y0: 0.22, ym: 0.5, y1: 0.6 },
    { z: 1.1, wb: 0.52, wm: 0.6, wt: 0.46, y0: 0.24, ym: 0.58, y1: 0.7 },
    { z: 0.2, wb: 0.56, wm: 0.62, wt: 0.46, y0: 0.26, ym: 0.62, y1: 0.76 },
    { z: -0.7, wb: 0.54, wm: 0.58, wt: 0.38, y0: 0.28, ym: 0.7, y1: 0.9 },
    { z: -1.5, wb: 0.44, wm: 0.46, wt: 0.2, y0: 0.3, ym: 0.78, y1: 1.08 }, // tall engine cover / airbox
    { z: -2.1, wb: 0.34, wm: 0.34, wt: 0.14, y0: 0.32, ym: 0.62, y1: 0.86 },
    { z: -2.5, wb: 0.3, wm: 0.3, wt: 0.12, y0: 0.34, ym: 0.5, y1: 0.7 },
  ];
  const stations = S.map((s) => ({ z: s.z, ring: ring6(s.wb, s.wm, s.wt, s.y0, s.ym, s.y1), seg: [lowSide, C1, style === 'fade' ? mixc(C1l, C2, clamp((1.6 - s.z) / 3.6, 0, 1)) : (twotone && s.z < 0) || (style === 'hoop' && s.z < -1.2 && s.z > -1.7) ? C2 : C1l, C1, lowSide, DARK] }));
  m.loft(stations, C1, DARK);
  const topAt = (() => { const t = S.map((s) => ({ z: s.z, yTop: s.y1 })); return (z) => profileY(t, z); })();
  const wtAt = (() => { const t = S.map((s) => ({ z: s.z, yTop: s.wt })); return (z) => profileY(t, z); })(); // half-width of the flat top
  m.box(0, 0.775, 0.45, 0.62, 0.05, 1.0, DARK); // open cockpit
  const hel = new THREE.SphereGeometry(0.21, 6, 4).toNonIndexed();
  const hp = hel.attributes.position, helCol = style === 'twotone' ? C2 : WHITE;
  for (let i = 0; i < hp.count; i += 3) m.tri([hp.getX(i), hp.getY(i) + 1.0, hp.getZ(i) + 0.4], [hp.getX(i + 1), hp.getY(i + 1) + 1.0, hp.getZ(i + 1) + 0.4], [hp.getX(i + 2), hp.getY(i + 2) + 1.0, hp.getZ(i + 2) + 0.4], helCol, [0, 1.0, 0.4]);
  m.box(0, 1.02, 0.6, 0.3, 0.09, 0.08, rgb(0x0b1a2b));
  m.box(0, 1.06, 0.62, 0.22, 0.026, 0.04, rgb(0x3fe0ff));
  // aeroscreen: sloped glass panel in a frame; side rails leave the helmet visible
  const FR = rgb(0x30323c);
  m.quad([0.4, 0.78, 0.95], [-0.4, 0.78, 0.95], [-0.3, 1.18, 0.62], [0.3, 1.18, 0.62], GLASS, [0, 0.9, 0.4]);
  m.quad([0.3, 1.18, 0.62], [-0.3, 1.18, 0.62], [-0.28, 1.2, 0.5], [0.28, 1.2, 0.5], GLASS2, [0, 0.9, 0.4]);
  m.beam([0.4, 0.78, 0.95], [0.3, 1.18, 0.62], 0.06, FR); m.beam([-0.4, 0.78, 0.95], [-0.3, 1.18, 0.62], 0.06, FR);
  m.beam([0.3, 1.18, 0.62], [0.38, 1.0, -0.15], 0.055, FR); m.beam([-0.3, 1.18, 0.62], [-0.38, 1.0, -0.15], 0.055, FR);
  m.box(0, 1.2, 0.58, 0.62, 0.035, 0.1, C2);
  // sidepods: big, offset, with undercut
  const pod = (z, a, b, c, d, e) => ({ z, ring: [a, b, c, d, e], seg: [DARK, lowSide, C1, twotone ? C2 : C1l, scl(C1, 0.6)] });
  const pods = [
    pod(1.0, [0.6, 0.3], [0.9, 0.36], [1.12, 0.54], [1.02, 0.78], [0.6, 0.78]),
    pod(-0.1, [0.6, 0.3], [0.88, 0.37], [1.12, 0.58], [1.0, 0.86], [0.58, 0.9]),
    pod(-1.2, [0.5, 0.34], [0.78, 0.4], [1.0, 0.6], [0.84, 0.82], [0.5, 0.94]),
    pod(-2.2, [0.36, 0.36], [0.5, 0.4], [0.6, 0.52], [0.5, 0.66], [0.3, 0.72]),
  ];
  m.mirrored(() => m.loft(pods, C1, DARK));
  // roll hoop + shark fin + tail fin
  m.plate([[-0.9, 1.04], [-1.2, 1.5], [-1.34, 1.5], [-1.7, 1.06], [-2.5, 0.72], [-2.6, 0.64], [-1.4, 0.6]], -0.03, 0.03, C1l, C2);
  m.box(0, 1.1, -0.8, 0.36, 0.2, 0.4, C1l);
  m.box(0, 1.13, -0.58, 0.26, 0.14, 0.05, DARK);
  // front wing: wide splitter + flap + endplates
  m.box(0, 0.16, 3.4, 2.4, 0.04, 0.34, DARK); m.box(0, 0.22, 3.26, 2.4, 0.04, 0.3, C2, 0.16); m.box(0, 0.3, 3.12, 2.2, 0.04, 0.26, C1l, 0.32);
  m.beam([0.2, 0.34, 2.7], [0.18, 0.2, 3.3], 0.06, CARBON); m.beam([-0.2, 0.34, 2.7], [-0.18, 0.2, 3.3], 0.06, CARBON);
  m.mirrored(() => m.plate([[3.55, 0.08], [3.55, 0.3], [3.25, 0.44], [3.0, 0.42], [3.0, 0.1]], 1.2, 1.26, C1, C2));
  // rear: big 2-tier wing, tall endplates, pylons
  m.box(0, 1.28, -2.5, 2.1, 0.05, 0.42, C1l, -0.1);
  m.box(0, 1.5, -2.55, 2.1, 0.045, 0.36, C2, -0.3);
  m.mirrored(() => m.plate([[-2.2, 0.55], [-2.2, 1.72], [-2.62, 1.72], [-2.9, 1.62], [-2.9, 0.6]], 1.04, 1.1, C1, C2));
  m.beam([0.14, 0.7, -2.2], [0.14, 1.26, -2.5], 0.06, CARBON); m.beam([-0.14, 0.7, -2.2], [-0.14, 1.26, -2.5], 0.06, CARBON);
  m.box(0, 0.52, -2.3, 0.6, 0.3, 0.6, DARK);
  m.box(0, 0.12, -0.1, 1.5, 0.05, 4.4, CARBON);
  const WB = rgb(0x4a4d58);
  for (const [x, z] of WHEEL_POS.speedway) {
    const sx = Math.sign(x), hub = [x - sx * 0.27, 0.43, z], zf = z > 0 ? 1 : -1;
    m.beam([sx * 0.5, 0.34, z + 0.35 * zf], hub, 0.045, WB); m.beam([sx * 0.5, 0.34, z - 0.35 * zf], hub, 0.045, WB);
    m.beam([sx * 0.46, 0.64, z + 0.25 * zf], [hub[0], 0.54, z], 0.045, WB); m.beam([sx * 0.46, 0.64, z - 0.25 * zf], [hub[0], 0.54, z], 0.045, WB);
  }
  liveryDecals(m, style, C1, C2, topAt, wtAt, pods, C3);
  const padCol = rgb(0xf0f0f2);
  numberDecal(m, num, 0, 1.45, topAt, 0.06, padCol, DARK);
  numberDecal(m, num, 0, -1.0, topAt, 0.034, padCol, DARK);
  return m;
}

// ---------------------------------------------------------------- wheel (tyre + sidewall rings + rim + spokes); axis = x, outside = +x
function wheelMesh(cls, rimCol, ringCol, flatPatch) {
  const m = new Mesh(), R = WHEEL_R[cls], W = WHEEL_W[cls], N = 10, hw = W / 2;
  const tread = rgb(0x1a1a1f), tread2 = rgb(0x26262c), side = rgb(0x1c1c22), ring = ringCol, rim = rimCol, face = mixc(rgb(0x14141a), rim, 0.18);
  const ringR0 = R * 0.78, ringR1 = R * 0.9, rimR = R * 0.62, lipR = rimR * 0.86, xo = hw + 0.02;
  const pt = (r, a, x) => [x, Math.cos(a) * r, Math.sin(a) * r];
  const sh = 0.07; // coloured shoulder strips: the compound colour reads from above / behind too
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2, o = [0, 0, 0];
    const tcol = i === 0 && flatPatch ? rgb(0x6a655e) : (i & 1 ? tread : tread2);
    m.quad(pt(R, a0, -hw + sh), pt(R, a0, hw - sh), pt(R, a1, hw - sh), pt(R, a1, -hw + sh), tcol, o); // tread band (alternating tones = tread suggestion)
    for (const sx of [1, -1]) m.quad(pt(R, a0, sx * (hw - sh)), pt(R, a0, sx * hw), pt(R, a1, sx * hw), pt(R, a1, sx * (hw - sh)), ring, o); // shoulder strips in compound colour
    m.quad(pt(R, a0, hw), pt(R * 0.92, a0, hw), pt(R * 0.92, a1, hw), pt(R, a1, hw), side, o);
    // outer sidewall: dark band, coloured compound ring, dark band, rim lip, dark carbon face
    m.quad(pt(R * 0.92, a0, hw), pt(ringR1, a0, xo), pt(ringR1, a1, xo), pt(R * 0.92, a1, hw), side, o);
    m.quad(pt(ringR1, a0, xo), pt(ringR0, a0, xo), pt(ringR0, a1, xo), pt(ringR1, a1, xo), ring, o);
    m.quad(pt(ringR0, a0, xo), pt(rimR, a0, xo), pt(rimR, a1, xo), pt(ringR0, a1, xo), side, o);
    m.quad(pt(rimR, a0, xo), pt(lipR, a0, xo), pt(lipR, a1, xo), pt(rimR, a1, xo), i & 1 ? rim : scl(rim, 0.82), o);
    m.quad(pt(lipR, a0, xo), pt(0.0001, a0, xo), pt(0.0001, a1, xo), pt(lipR, a1, xo), face, o);
    m.quad(pt(R * 0.92, a1, -hw), pt(R * 0.55, a1, -hw), pt(R * 0.55, a0, -hw), pt(R * 0.92, a0, -hw), side, o); // inner side
  }
  // lettering suggestion: a few pale dashes on the outer sidewall
  for (let k = 0; k < 3; k++) {
    const a = 0.35 + k * 0.28, r0 = R * 0.915, r1 = R * 0.935;
    m.flatQuad(pt(r0, a, hw + 0.012), pt(r1, a, hw + 0.012), pt(r1, a + 0.16, hw + 0.012), pt(r0, a + 0.16, hw + 0.012), rgb(0xcfcfd6), [1, 0, 0]);
  }
  // 5 bold spokes + hub (colourful, read clearly against the dark face)
  const hx = xo + 0.012;
  for (let k = 0; k < SPOKES; k++) {
    const a = (k / SPOKES) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a), w = R * 0.1;
    const p1 = [hx, c * lipR * 0.98, s * lipR * 0.98], nx = -s * w, nz = c * w;
    m.flatQuad([hx, nx * 0.6, nz * 0.6], [hx, p1[1] + nx, p1[2] + nz], [hx, p1[1] - nx, p1[2] - nz], [hx, -nx * 0.6, -nz * 0.6], k === 0 ? WHITE : scl(rim, 1.2), [1, 0, 0]);
  }
  // pentagonal hub nut: shares the 5-fold spoke symmetry, so the anti-strobe spoke-pitch skips (see spokeSafeStep) leave it unchanged
  const hub = [];
  for (let k = 0; k < SPOKES; k++) { const a = (k / SPOKES) * Math.PI * 2 + Math.PI / SPOKES; hub.push([Math.sin(a) * R * 0.15, Math.cos(a) * R * 0.15]); }
  m.plate(hub, hx - 0.005, hx + 0.045, WHITE);
  return m;
}
const lum = (hex) => { _c.set(hex); return 0.3 * _c.r + 0.59 * _c.g + 0.11 * _c.b; };
/** bright, colourful rim: the team's brighter livery colour (white if both are dark) */
export const rimColor = (team) => (lum(team.c2) > 0.28 ? team.c2 : lum(team.c1) > 0.28 ? team.c1 : 0xe8e8f0);
const compoundRing = { dry: 0xf2f2f6, wet: 0x2f8fff };

// ---------------------------------------------------------------- lamps (brake + rain light), vertex colours rewritten per frame
const LAMP_QUADS = 3; // 0,1 = brake lamps (left/right), 2 = rain light; each = core + glow quad
function lampGeometry(cls) {
  const sw = cls === 'speedway', z = sw ? -2.512 : -2.412, yb = sw ? 0.52 : 0.5, g = new THREE.BufferGeometry();
  const pos = [], spots = [[0.15, yb, z], [-0.15, yb, z], [0, yb - 0.1, z]];
  for (let i = 0; i < LAMP_QUADS; i++) {
    const [x, y, zz] = spots[i];
    for (const sc of [1, 2.4]) { // core, glow
      const w = (i === 2 ? 0.07 : 0.085) * sc, h = (i === 2 ? 0.05 : 0.06) * sc;
      pos.push(x - w, y - h, zz, x + w, y - h, zz, x + w, y + h, zz, x - w, y - h, zz, x + w, y + h, zz, x - w, y + h, zz);
    }
  }
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(pos.length / 3 * 4), 4));
  return g;
}

// ---------------------------------------------------------------- materials (shared across all cars)
// glossy clear-coated paint (vertex colours carry livery, glass and trim); env map + sun give the reflections
const bodyMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.42, metalness: 0.25, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 1.25 });
// wheels: satin rubber + brushed metal rims, no clearcoat
const wheelMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.45, envMapIntensity: 1 });
const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
const markMat = new THREE.MeshBasicMaterial({ color: 0xffee33, fog: false });
const ghostMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.38, depthWrite: false });
const lampMat = new THREE.MeshBasicMaterial({ vertexColors: true, color: new THREE.Color(2.6, 2.6, 2.6), transparent: true, depthWrite: false, fog: false, side: THREE.DoubleSide }); // >1 so lit lamps bloom
const shadowGeo = new THREE.PlaneGeometry(2.7, 6.4).rotateX(-Math.PI / 2);

// ---------------------------------------------------------------- geometry cache
const bodyCache = new Map(), wheelCache = new Map(), lampCache = new Map();
/** Merged body geometry for a team (cached). Pure three geometry - no WebGL needed. */
export function bodyGeometry(cls, team, teamIndex = team.index ?? 0) {
  const lv = team.livery, key = cls + ':' + teamIndex + ':' + team.c1 + ':' + team.c2 + (lv ? ':' + lv.pattern + ':' + lv.c3 + ':' + lv.number : '');
  let g = bodyCache.get(key);
  if (!g) { g = (cls === 'speedway' ? speedwayBody : gpBody)(team, teamIndex).geometry(); g.name = `car-${cls}-${teamIndex}`; bodyCache.set(key, g); }
  return g;
}
/** Wheel geometry (tyre + sidewall ring in compound colour + rim in team colour), cached per class/team/compound. */
export function wheelGeometry(cls, team, compound = 'dry') {
  const key = cls + ':' + team.c2 + ':' + compound;
  let g = wheelCache.get(key);
  if (!g) { const rimHex = rimColor(team), ringHex = compound === 'dry' && lum(rimHex) > 0.78 ? 0xffd21f : compoundRing[compound] || compoundRing.dry;
    g = wheelMesh(cls, rgb(rimHex), rgb(ringHex), true).geometry(); wheelCache.set(key, g); }
  return g;
}
const lampGeo = (cls) => { let g = lampCache.get(cls); if (!g) { g = lampGeometry(cls); lampCache.set(cls, g); } return g; };

// ---------------------------------------------------------------- the car
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _one = new THREE.Vector3(1, 1, 1);

/**
 * Build a car. Returns { group, pivot, wheels[4], frontPivots[2], body, wheelMesh, lamps, brakeLight, rainLight, mark, cls, setTire, dispose }.
 * `team` = { c1, c2, index? } (use TEAMS[i] with index set, or pass teamIndex as the 6th argument).
 */
export function makeCar(cls, team, isPlayer = false, ghost = false, teamIndex = team.index ?? 0) {
  const k = cls === 'speedway' ? 'speedway' : 'gp';
  const body = new THREE.Mesh(bodyGeometry(k, team, teamIndex), ghost ? ghostMat : bodyMat);
  body.castShadow = !ghost; body.receiveShadow = !ghost; body.name = 'body';
  const group = new THREE.Group(), pivot = new THREE.Group();
  pivot.add(body);
  const wheelMeshInst = new THREE.InstancedMesh(wheelGeometry(k, team, 'dry'), ghost ? ghostMat : wheelMat, 4);
  // fixed instance bounds (all 4 wheels incl. steer / bump / flat-spot margin) so off-screen cars' wheels are culled like their bodies
  { const P = WHEEL_POS[k], R = WHEEL_R[k], zc = (P[0][1] + P[2][1]) / 2, ex = Math.max(...P.map((q) => Math.abs(q[0]))) + WHEEL_W[k] / 2 + 0.15;
    wheelMeshInst.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, R, zc), Math.hypot(ex, (P[0][1] - P[2][1]) / 2 + R + 0.15, R + 0.1)); }
  wheelMeshInst.castShadow = false; wheelMeshInst.receiveShadow = false; wheelMeshInst.name = 'wheels';
  pivot.add(wheelMeshInst);
  const wheels = WHEEL_POS[k].map(([x, z], i) => ({ i, x, z, y: WHEEL_R[k], front: i < 2, left: x > 0, steer: 0, spin: 0, bump: 0, visible: true, mesh: wheelMeshInst }));
  const frontPivots = [wheels[0], wheels[1]];
  let lamps = null;
  const brakeLight = { intensity: 0, on: false }, rainLight = { intensity: 0, on: false };
  if (!ghost) {
    lamps = new THREE.Mesh(lampGeo(k).clone(), lampMat); // own colour attribute per car, shared positions are cloned (tiny)
    lamps.renderOrder = 3; // static positions (only colours change): the geometry bounding sphere is valid, so culling stays on lamps.name = 'lamps';
    pivot.add(lamps);
  }
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.position.y = 0.06; shadow.name = 'shadow';
  if (!ghost) group.add(shadow);
  group.add(pivot);
  let mark = null;
  if (isPlayer) {
    mark = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2.8, 4).rotateX(Math.PI), markMat);
    mark.position.y = 5; mark.visible = false;
    group.add(mark);
  }
  const car = {
    group, pivot, body, wheels, frontPivots, wheelMesh: wheelMeshInst, lamps, brakeLight, rainLight, mark, cls: k, ghost, shadow, team, teamIndex,
    number: numberOf(team, teamIndex), tire: 'dry',
    // animation state (visual only)
    anim: { pitch: 0, roll: 0, bob: 0, kerbMix: 0, steer: 0, t: 0, dist: 0, rainPhase: 0, bumpPhase: 0, vib: 0 },
    setTire(compound) {
      if (compound === car.tire) return;
      car.tire = compound; wheelMeshInst.geometry = wheelGeometry(k, team, compound);
    },
  };
  writeWheels(car);
  return car;
}

/**
 * Write the 4 wheel instance matrices (steer, spin, bump, visibility) - no allocation.
 * The wheel mesh is built with its outer face on +x. Left wheels (+x) use it as is; right wheels get a proper yaw of PI (no mirror),
 * so winding and FrontSide culling stay correct and the outer face looks to -x. Spin is negated there so both sides roll the same way
 * in car space (top of the tyre moves to +z when spin grows). w.steer > 0 = steering right = wheel nose toward local -x, hence -steer.
 */
export function writeWheels(car) {
  const R = WHEEL_R[car.cls], ws = car.wheels;
  for (let n = 0; n < ws.length; n++) {
    const w = ws[n];
    if (!w.visible) { _m.makeScale(0, 0, 0); car.wheelMesh.setMatrixAt(w.i, _m); continue; }
    const sp = w.left ? w.spin : -w.spin;
    _e.set(sp, -w.steer + (w.left ? 0 : Math.PI), 0, 'YXZ');
    _q.setFromEuler(_e);
    _p.set(w.x, R + w.bump, w.z);
    car.wheelMesh.setMatrixAt(w.i, _m.compose(_p, _q, _one));
  }
  car.wheelMesh.instanceMatrix.needsUpdate = true;
}

// ---------------------------------------------------------------- wheel spin anti-strobe
// The spokes (and hub nut, tread tones, rim lip) repeat every SPOKE_PITCH. Sampled once per frame, a spoke step above half a pitch is
// read by the eye as a smaller or backward step (wagon-wheel effect). E.g. 30 m/s on R = 0.38 is 79 rad/s = 1.32 rad/frame at 60 Hz
// (1.05 pitch); the old fixed 62 rad/s cap gave 1.03 rad/frame = 0.82 pitch, which looks like slow BACKWARD rotation.
// spokeSafeStep keeps the true step while it is below SPOKE_F_MAX. Above that it shows k whole pitches (invisible to the symmetric parts,
// so the white spoke / flat patch / lettering still move at about the true rate) plus a forward remainder clamped to
// [SPOKE_F_MIN, SPOKE_F_MAX]. The spokes therefore always read as turning forward, never frozen or reversed.
export const SPOKE_F_MAX = 0.42 * SPOKE_PITCH, SPOKE_F_MIN = 0.12 * SPOKE_PITCH;
/** Rate (rad/s) below which the displayed spin is exactly v / R at 60 Hz. Kept as an export for API compatibility (was a hard cap of 62). */
export const MAX_VISUAL_SPIN = SPOKE_F_MAX * 60;
/** Displayed wheel turn for one frame given the true turn `step` (rad, signed). Pure and deterministic. */
export function spokeSafeStep(step) {
  const s = Math.abs(step);
  if (!(s > SPOKE_F_MAX)) return step; // exact (also passes 0 / NaN-free small steps)
  const k = Math.floor(s / SPOKE_PITCH), f = s - k * SPOKE_PITCH;
  return Math.sign(step) * (k * SPOKE_PITCH + clamp(f, k ? SPOKE_F_MIN : 0, SPOKE_F_MAX));
}
const TAU = Math.PI * 2, SPIN_WRAP = TAU * 1024; // wrap by whole turns only (the old -1e4 wrap made a visible angle jump)
/** Spin angle at which the flat-spotted tread segment (built at angles 0..2PI/10, centre PI/10) touches the road, per side. */
const FLAT_CONTACT_L = Math.PI - Math.PI / 10, FLAT_CONTACT_R = Math.PI + Math.PI / 10;
/**
 * Animate one car for this render frame. `st` is read-only gameplay/render state:
 *  { v, steer (-1..1, + = right), longAcc, latAcc (|m/s^2|), speed01, surface, lockup, flat, brake (0..1 pedal), rain (0..1 wetness/rain),
 *    roll, pitch (road), signedLatAcc (yaw*speed, right +), s (path distance), lift (jack height, m), time }
 * dt = render frame time (s). Wheel angle is integrated with the true wheel radius: omega = v / R, shown through spokeSafeStep.
 */
export function animateCar(car, st, dt) {
  const a = car.anim, R = WHEEL_R[car.cls], v = st.v;
  a.t += dt;
  // --- wheels: true rolling angle, real radius; front wheels steer
  const lockSlow = 1 - 0.85 * (st.lockup || 0); // locked tyres stop turning
  const trueStep = ((v || 0) / R) * lockSlow * dt, step = spokeSafeStep(trueStep);
  a.steer += ((st.steer || 0) * 0.42 * clamp(1 - Math.abs(v) / 120, 0.3, 1) - a.steer) * (1 - Math.exp(-Math.min(dt, 0.1) * 24));
  a.bumpPhase += trueStep;
  const ws = car.wheels, flatK = st.flat > 0.02 ? 0.03 * st.flat * clamp(Math.abs(v) / 25, 0, 1) : 0;
  for (let n = 0; n < ws.length; n++) {
    const w = ws[n];
    w.spin += step;
    if (w.spin > SPIN_WRAP || w.spin < -SPIN_WRAP) w.spin -= SPIN_WRAP * Math.sign(w.spin);
    w.steer = w.front ? a.steer : 0;
    // flat spot: the front tyres knock once per turn, when the drawn flat patch is at the bottom
    w.bump = w.front && flatK > 0 ? flatK * Math.max(0, Math.cos(w.spin - (w.left ? FLAT_CONTACT_L : FLAT_CONTACT_R))) ** 3 : 0;
  }
  // --- chassis: visual-only roll / pitch / bob, low-passed
  const kd = 1 - Math.exp(-Math.min(dt, 0.1) * 7);
  const latSigned = st.signedLatAcc ?? (Math.sign(st.steer || 0) * (st.latAcc || 0)); // measured right +, reversed automatically with yaw
  const rollT = -clamp(latSigned * 0.0019, -0.078, 0.078);
  const pitchT = clamp(-(st.longAcc || 0) * 0.00135, -0.06, 0.062); // + = nose down (braking dives, throttle squats)
  a.roll += (rollT - a.roll) * kd; a.pitch += (pitchT - a.pitch) * kd;
  // kerb rumble + speed vibration: deterministic functions of distance travelled / time
  a.dist = st.s ?? a.dist + v * dt;
  const onKerb = st.surface === 'kerb' ? 1 : 0, rough = st.surface === 'grass' || st.surface === 'gravel' ? 1 : 0;
  a.kerbMix += (Math.max(onKerb, rough) - a.kerbMix) * (1 - Math.exp(-Math.min(dt, 0.1) * 14));
  a.bob = a.kerbMix * clamp(Math.abs(v) / 50, 0.25, 1) * ((onKerb ? 0.022 : 0.034) * Math.sin(a.dist * 4.4) + 0.009 * Math.sin(a.dist * 9.1 + 1));
  const fast = clamp(Math.abs(v) / 90, 0, 1);
  const vib = (0.0035 * fast + 0.012 * (st.flat || 0) * clamp(Math.abs(v) / 40, 0, 1) + 0.01 * (st.lockup || 0)) * Math.sin(a.t * 83);
  car.pivot.rotation.x = -(st.pitch || 0) + a.pitch + vib * 0.6;
  car.pivot.rotation.z = (st.roll || 0) + a.roll + vib * 0.4;
  car.pivot.position.y = (st.lift || 0) + a.bob + Math.abs(vib) * 0.5;
  // contact shadow: follows the road plane only (not chassis dive/roll, bob, vibration or the pit-jack lift), so it never hovers or sinks
  car.shadow.rotation.x = -(st.pitch || 0); car.shadow.rotation.z = st.roll || 0;
  // --- lamps
  const braking = (st.brake || 0) > 0.05 || (st.longAcc || 0) < -9;
  car.brakeLight.on = braking; car.brakeLight.intensity = braking ? 1 : 0;
  const rainOn = (st.rain || 0) > 0.25;
  a.rainPhase += dt;
  car.rainLight.on = rainOn; car.rainLight.intensity = rainOn ? (Math.sin(a.rainPhase * 11) > 0 ? 1 : 0.15) : 0;
  if (!car.ghost) writeLamps(car);
  writeWheels(car);
  return car;
}
/** per lamp quad: core (6 verts) + glow (6 verts), rgba (module-level: no closure per call) */
function setLamp(arr, quad, red, grn, blu, ac, ag) {
  const o = quad * 12 * 4;
  for (let v = 0; v < 12; v++) {
    const i = o + v * 4;
    arr[i] = red; arr[i + 1] = grn; arr[i + 2] = blu; arr[i + 3] = v >= 6 ? ag : ac;
  }
}
function writeLamps(car) {
  const col = car.lamps.geometry.attributes.color, arr = col.array, b = car.brakeLight.intensity, r = car.rainLight.intensity;
  for (let q = 0; q < 2; q++) setLamp(arr, q, 0.35 + 0.65 * b, 0.03 + 0.12 * b, 0.03 + 0.05 * b, 0.9, 0.26 * b);
  const w = r > 0.5 ? 0.5 : 0;
  setLamp(arr, 2, 0.4 + 0.6 * r, 0.04 + w, 0.04 + w, 0.9, 0.3 * r);
  col.needsUpdate = true;
}

/** Release GPU resources owned by one car (shared cached geometries/materials stay). */
export function disposeCar(car) {
  car.wheelMesh.dispose?.();
  car.lamps?.geometry.dispose();
  if (car.mark) { car.mark.geometry.dispose(); }
}
export const sharedMaterials = { bodyMat, wheelMat, shadowMat, ghostMat, lampMat };

export { Mesh as PixelMesh, GLYPHS };
