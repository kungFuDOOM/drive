// Procedural foliage: a 2x2 leaf atlas (typed-array DataTexture only) and card-based tree builders.
// Every builder works at unit scale with the base at y = 0 and returns { cards, core, trunk, snow } BufferGeometries.
// Cards are alpha-tested quads built twice (front and reversed winding) with one shared "outward from the crown" shading
// normal, so a crown lights like one volume from either side while the material stays FrontSide.
import * as THREE from 'three';
import { rng, mergeGeometries, vnoise } from './builder.js';

// ---------------------------------------------------------------- leaf atlas
const AN = 256, CELL = 128, MARGIN = 3;
const inset = (cx, cy) => [(cx * CELL + MARGIN) / AN, (cy * CELL + MARGIN) / AN, ((cx + 1) * CELL - MARGIN) / AN, ((cy + 1) * CELL - MARGIN) / AN];
/** atlas rectangles [u0, v0, u1, v1], inset by the transparent margin; v0 is the attached end of every motif */
export const ATLAS = { LEAF: inset(0, 0), BOUGH: inset(1, 0), FROND: inset(0, 1), TUFT: inset(1, 1) };

let atlasTex = null;
/** Paint the atlas into shade / alpha float arrays. Exported for tests (coverage), the texture is built from it. */
export function paintAtlas() {
  const shade = new Float32Array(AN * AN).fill(0.72), alpha = new Float32Array(AN * AN);
  const cellOf = (cx, cy) => ({ ox: cx * CELL, oy: cy * CELL });
  const put = (c, px, py, a, s) => {
    if (px < MARGIN || py < MARGIN || px >= CELL - MARGIN || py >= CELL - MARGIN || a <= 0) return;
    const k = (c.oy + py) * AN + c.ox + px;
    if (a >= alpha[k]) shade[k] = s; else shade[k] = shade[k] + (s - shade[k]) * a;
    alpha[k] = Math.max(alpha[k], a);
  };
  /** filled ellipse in cell units (0..1), rot in radians, 1 px soft edge; later shapes overwrite earlier ones */
  const ellipse = (c, cx, cy, rx, ry, rot, s) => {
    const X = cx * CELL, Y = cy * CELL, RX = rx * CELL, RY = ry * CELL, R = Math.max(RX, RY) + 1.5, co = Math.cos(rot), si = Math.sin(rot);
    for (let py = Math.floor(Y - R); py <= Math.ceil(Y + R); py++) for (let px = Math.floor(X - R); px <= Math.ceil(X + R); px++) {
      const dx = px + 0.5 - X, dy = py + 0.5 - Y, u = (dx * co + dy * si) / RX, v = (-dx * si + dy * co) / RY;
      const d = Math.sqrt(u * u + v * v), edge = (d - 1) * Math.min(RX, RY);
      put(c, px, py, Math.min(1, Math.max(0, 0.5 - edge)), s);
    }
  };
  /** tapered stroke from (x0,y0) to (x1,y1), width w0 -> w1 (cell units) */
  const stroke = (c, x0, y0, x1, y1, w0, w1, s) => {
    const X0 = x0 * CELL, Y0 = y0 * CELL, X1 = x1 * CELL, Y1 = y1 * CELL, W = Math.max(w0, w1) * CELL / 2 + 1.5;
    const dx = X1 - X0, dy = Y1 - Y0, L2 = Math.max(1e-6, dx * dx + dy * dy);
    for (let py = Math.floor(Math.min(Y0, Y1) - W); py <= Math.ceil(Math.max(Y0, Y1) + W); py++) for (let px = Math.floor(Math.min(X0, X1) - W); px <= Math.ceil(Math.max(X0, X1) + W); px++) {
      const qx = px + 0.5 - X0, qy = py + 0.5 - Y0, t = Math.min(1, Math.max(0, (qx * dx + qy * dy) / L2));
      const ex = qx - dx * t, ey = qy - dy * t, half = (w0 + (w1 - w0) * t) * CELL / 2;
      put(c, px, py, Math.min(1, Math.max(0, half + 0.5 - Math.sqrt(ex * ex + ey * ey))), s);
    }
  };
  const r = rng(4242);
  // LEAF: broadleaf clump, leaves denser toward the centre, later (top) leaves brighter
  {
    const c = cellOf(0, 0), n = 205;
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2, rad = 0.42 * Math.pow(r(), 0.7), t = i / n;
      ellipse(c, 0.5 + Math.cos(a) * rad, 0.5 + Math.sin(a) * rad, 0.072, 0.04, r() * Math.PI, 0.58 + 0.4 * t * (0.8 + 0.2 * r()));
    }
  }
  // BOUGH: central twig, needles at +/-55 degrees tapering toward the tip, short side twigs with their own needles
  {
    const c = cellOf(1, 0), ang = 55 * Math.PI / 180;
    const needles = (x0, y0, dirA, len0, len1, from, to, step, s0) => {
      for (let t = from; t <= to; t += step) {
        const x = x0 + Math.cos(dirA) * t, y = y0 + Math.sin(dirA) * t, k = (t - from) / Math.max(1e-6, to - from), len = len0 + (len1 - len0) * k;
        for (const sd of [-1, 1]) {
          const a = dirA + sd * ang;
          stroke(c, x, y, x + Math.cos(a) * len, y + Math.sin(a) * len, 0.026, 0.012, s0 + 0.25 * r() + 0.1 * k);
        }
      }
    };
    // side twigs first (main twig needles draw over them)
    for (let k = 0; k < 6; k++) {
      const t = 0.1 + k * 0.13, sd = k % 2 ? 1 : -1, a = Math.PI / 2 + sd * (0.75 + 0.15 * r()), len = 0.36 * (1 - t) + 0.1;
      const x1 = 0.5 + Math.cos(a) * len, y1 = 0.03 + t + Math.sin(a) * len;
      needles(0.5, 0.03 + t, a, 0.24 * (1 - t) + 0.07, 0.04, 0.03, len, 0.02, 0.55);
      stroke(c, 0.5, 0.03 + t, x1, y1, 0.016, 0.008, 0.45);
    }
    needles(0.5, 0.03, Math.PI / 2, 0.52, 0.05, 0, 0.92, 0.014, 0.62);
    stroke(c, 0.5, 0.03, 0.5, 0.95, 0.03, 0.012, 0.45);
  }
  // FROND: rib along u = 0.5, leaflets at +/-65 degrees with length following sin(pi v), slight gaps
  {
    const c = cellOf(0, 1), ang = 65 * Math.PI / 180;
    for (let t = 0.04; t < 0.97; t += 0.03) {
      const len = 0.5 * Math.sin(Math.PI * t) + 0.02;
      for (const sd of [-1, 1]) {
        const a = Math.PI / 2 + sd * ang, l = len * (0.85 + 0.15 * r());
        ellipse(c, 0.5 + Math.cos(a) * l / 2, t + Math.sin(a) * l / 2, l / 2, 0.016, a, 0.6 + 0.35 * r());
      }
    }
    stroke(c, 0.5, 0.02, 0.5, 0.98, 0.028, 0.008, 0.55);
  }
  // TUFT: blades fanning +/-35 degrees from the bottom centre
  {
    const c = cellOf(1, 1), n = 14;
    for (let i = 0; i < n; i++) {
      const a = Math.PI / 2 + ((i / (n - 1)) * 2 - 1) * (35 * Math.PI / 180) + (r() - 0.5) * 0.1, hgt = 0.6 + 0.4 * r();
      const bend = (a - Math.PI / 2) * 0.35;
      const xm = 0.5 + Math.cos(a) * hgt * 0.5, ym = 0.03 + Math.sin(a) * hgt * 0.5, x1 = 0.5 + Math.cos(a + bend) * hgt, y1 = 0.03 + Math.sin(a + bend) * hgt;
      const s = 0.6 + 0.35 * r();
      stroke(c, 0.5 + (r() - 0.5) * 0.12, 0.03, xm, ym, 0.12, 0.078, s);
      stroke(c, xm, ym, x1, y1, 0.078, 0.006, s + 0.05);
    }
  }
  return { shade, alpha, size: AN, cell: CELL, margin: MARGIN };
}

/** cached 256x256 RGBA atlas (grey shade x coverage alpha), mipmapped */
export function leafAtlas() {
  if (atlasTex) return atlasTex;
  const { shade, alpha } = paintAtlas(), data = new Uint8Array(AN * AN * 4);
  for (let i = 0; i < AN * AN; i++) {
    const s = Math.round(Math.min(1, Math.max(0, shade[i])) * 255);
    data[i * 4] = s; data[i * 4 + 1] = s; data[i * 4 + 2] = s; data[i * 4 + 3] = Math.round(alpha[i] * 255);
  }
  atlasTex = new THREE.DataTexture(data, AN, AN);
  atlasTex.colorSpace = THREE.SRGBColorSpace; atlasTex.generateMipmaps = true;
  atlasTex.minFilter = THREE.LinearMipmapLinearFilter; atlasTex.magFilter = THREE.LinearFilter; atlasTex.anisotropy = 4;
  atlasTex.wrapS = atlasTex.wrapT = THREE.ClampToEdgeWrapping; atlasTex.needsUpdate = true;
  return atlasTex;
}

// ---------------------------------------------------------------- geometry helpers
const V = THREE.Vector3;
const Y = new V(0, 1, 0);
const acc = () => ({ p: [], n: [], uv: [], c: [] });
/** shading normal outward from the crown centre, biased upward */
export const crownNormal = (centre, crownCentre) => new V().subVectors(centre, crownCentre).add(new V(0, 0.3, 0)).normalize();
/**
 * Push one quad twice (front and reversed winding) with the same shading normal, uv and colour.
 * centre = middle of the quad; `up` runs from the attached end (v0) to the tip (v1). shade: number or [atBase, atTip].
 */
export function card(out, centre, right, up, w, h, uv, normal, shade) {
  const s0 = Array.isArray(shade) ? shade[0] : shade, s1 = Array.isArray(shade) ? shade[1] : shade;
  const rx = right.x * w / 2, ry = right.y * w / 2, rz = right.z * w / 2, ux = up.x * h / 2, uy = up.y * h / 2, uz = up.z * h / 2;
  const P = [
    [centre.x - rx - ux, centre.y - ry - uy, centre.z - rz - uz, uv[0], uv[1], s0],
    [centre.x + rx - ux, centre.y + ry - uy, centre.z + rz - uz, uv[2], uv[1], s0],
    [centre.x + rx + ux, centre.y + ry + uy, centre.z + rz + uz, uv[2], uv[3], s1],
    [centre.x - rx + ux, centre.y - ry + uy, centre.z - rz + uz, uv[0], uv[3], s1],
  ];
  for (const order of [[0, 1, 2, 0, 2, 3], [0, 2, 1, 0, 3, 2]]) for (const k of order) {
    const q = P[k];
    out.p.push(q[0], q[1], q[2]); out.n.push(normal.x, normal.y, normal.z); out.uv.push(q[3], q[4]); out.c.push(q[5], q[5], q[5]);
  }
}
/** double-sided triangle with explicit vertices / uvs (far conifer silhouettes) */
function tri2(out, a, b, c, ua, ub, uc, normal, s) {
  const P = [[a, ua], [b, ub], [c, uc]];
  for (const order of [[0, 1, 2], [0, 2, 1]]) for (const k of order) {
    const [p, u] = P[k];
    out.p.push(p.x, p.y, p.z); out.n.push(normal.x, normal.y, normal.z); out.uv.push(u[0], u[1]); out.c.push(s, s, s);
  }
}
function fromAcc(a, uv = true) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(a.p, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(a.n, 3));
  if (uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(a.uv, 2));
  g.setAttribute('color', new THREE.Float32BufferAttribute(a.c, 3));
  return g;
}
/** a single zero-area triangle with the full attribute set (keeps InstancedMesh happy when a part is absent) */
export function degenerate(uv = true) {
  const a = acc();
  for (let i = 0; i < 3; i++) { a.p.push(0, 0.01, 0); a.n.push(0, 1, 0); a.uv.push(0.25, 0.25); a.c.push(1, 1, 1); }
  return fromAcc(a, uv);
}
/** strip uvs, convert to non-indexed, give every vertex colour from fn(x, y, z, index) */
function solid(g, shadeFn) {
  let ng = g.index ? g.toNonIndexed() : g;
  if (ng.attributes.uv) ng.deleteAttribute('uv');
  const pa = ng.attributes.position, arr = new Float32Array(pa.count * 3);
  for (let i = 0; i < pa.count; i++) { const s = shadeFn(pa.getX(i), pa.getY(i), pa.getZ(i), i); arr[i * 3] = s; arr[i * 3 + 1] = s; arr[i * 3 + 2] = s; }
  ng.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return ng;
}
/** open lathe through rings [{ r, y, x?, z? }] with `sides` segments; smooth normals; optional apex (r = 0) closes the top */
function lathe(rings, sides, ringShade = () => 1, sideShade = () => 1) {
  const pos = [], col = [], idx = [];
  rings.forEach((rg, j) => {
    for (let s = 0; s <= sides; s++) {
      const a = (s / sides) * Math.PI * 2;
      pos.push((rg.x || 0) + Math.cos(a) * rg.r, rg.y, (rg.z || 0) + Math.sin(a) * rg.r);
      const k = ringShade(j) * sideShade(s % sides);
      col.push(k, k, k);
    }
  });
  const W = sides + 1;
  for (let j = 0; j < rings.length - 1; j++) for (let s = 0; s < sides; s++) {
    const a = j * W + s, b = a + 1, c = a + W, d = c + 1;
    if (rings[j + 1].r === 0) idx.push(a, c, b); else idx.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx); g.computeVertexNormals();
  const ng = g.toNonIndexed();
  return ng;
}
/** tube between two points (rings perpendicular to the segment), smooth sides, no caps */
function tube(a, b, r0, r1, sides, shade) {
  const g = lathe([{ r: r0, y: 0 }, { r: r1, y: 1 }], sides, (j) => (j ? shade[1] : shade[0]));
  const dir = new V().subVectors(b, a), len = dir.length();
  g.scale(1, len, 1);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(Y, dir.normalize()));
  g.translate(a.x, a.y, a.z);
  return g;
}
const merge = (parts) => mergeGeometries(parts);
/** orthonormal right / up for a card facing `n` (plane normal), rolled by `roll` */
function basisFacing(n, roll) {
  const ref = Math.abs(n.y) > 0.95 ? new V(1, 0, 0) : Y;
  const right = new V().crossVectors(ref, n).normalize(), up = new V().crossVectors(n, right).normalize();
  const c = Math.cos(roll), s = Math.sin(roll);
  return [right.clone().multiplyScalar(c).addScaledVector(up, s), up.clone().multiplyScalar(c).addScaledVector(right, -s)];
}
const clampFloor = (g, y0 = 0) => { const pa = g.attributes.position; for (let i = 0; i < pa.count; i++) if (pa.getY(i) < y0) pa.setY(i, y0); return g; };
const fib = (i, n) => { const y = 1 - (2 * (i + 0.5)) / n, r = Math.sqrt(1 - y * y), a = i * 2.399963; return new V(Math.cos(a) * r, y, Math.sin(a) * r); };

// ---------------------------------------------------------------- tree builders
/** broadleaf: tapered trunk + branch stubs, dark noise-displaced core, ~30 leaf-clump cards over the crown ellipsoid */
export function broadleaf(seed, { h = 7.4, r = 2.5, squash = 0.85, shade = 1, cards: nCards = 26 } = {}) {
  const R = rng(seed * 7919 + 13), ry = r * squash, cy = h - ry, cc = new V(0, cy, 0);
  const tTop = h * 0.45, tr = 0.16 + r * 0.06;
  const parts = [lathe([{ r: tr * 1.35, y: 0 }, { r: tr, y: tTop * 0.5 }, { r: tr * 0.7, y: tTop }], 6, (j) => 0.8 + j * 0.1)];
  const nb = 2 + Math.floor(R() * 2);
  for (let k = 0; k < nb; k++) {
    const a = R() * Math.PI * 2 + k * 2.1, y0 = tTop * (0.75 + 0.2 * R());
    parts.push(tube(new V(0, y0, 0), new V(Math.cos(a) * r * 0.55, y0 + ry * (0.7 + 0.3 * R()), Math.sin(a) * r * 0.55), tr * 0.55, tr * 0.25, 4, [0.85, 0.95]));
  }
  const trunk = merge(parts);
  // core: one displaced icosphere + one offset blob, smooth normals
  const blobG = (rad, ox, oy, oz, det, sd) => {
    const g = new THREE.IcosahedronGeometry(1, det), pa = g.attributes.position, na = new Float32Array(pa.count * 3);
    for (let v = 0; v < pa.count; v++) {
      const x = pa.getX(v), y = pa.getY(v), z = pa.getZ(v), k = 0.8 + 0.4 * vnoise(x * 1.7 + sd, z * 1.7 + y * 1.3 + sd * 0.7);
      na[v * 3] = x; na[v * 3 + 1] = y; na[v * 3 + 2] = z;
      pa.setXYZ(v, ox + x * k * rad, oy + y * k * rad * squash, oz + z * k * rad);
    }
    g.setAttribute('normal', new THREE.BufferAttribute(na, 3));
    return g;
  };
  const oa = R() * Math.PI * 2;
  const core = solid(merge([blobG(r * 0.7, 0, cy, 0, 1, seed), blobG(r * 0.45, Math.cos(oa) * r * 0.45, cy - ry * 0.15, Math.sin(oa) * r * 0.45, 0, seed + 3)]), (x, y) => 0.45 * shade * (0.85 + 0.25 * Math.min(1, Math.max(0, (y - cy + ry) / (2 * ry)))));
  // cards on a Fibonacci sphere over the crown, skipping the bottom 20 %
  const out = acc(), fibN = Math.round(nCards / 0.8);
  let made = 0;
  for (let i = 0; i < fibN && made < nCards; i++) {
    const d = fib(i, fibN);
    if (d.y < -0.6) continue;
    made++;
    const j = new V((R() - 0.5) * 0.15, (R() - 0.5) * 0.15, (R() - 0.5) * 0.15);
    const centre = new V(d.x * r * 0.85, cy + d.y * ry * 0.85, d.z * r * 0.85).add(j.multiplyScalar(r));
    const face = d.clone().add(new V((R() - 0.5), (R() - 0.5), (R() - 0.5)).multiplyScalar(Math.tan(35 * Math.PI / 180) * 1.2)).normalize();
    const [right, up] = basisFacing(face, R() * Math.PI * 2);
    const w = r * (0.75 + 0.35 * R()), t = (d.y + 1) / 2, sh = shade * (0.72 + 0.33 * t) * (0.92 + 0.16 * R());
    card(out, centre, right, up, w, w, ATLAS.LEAF, crownNormal(centre, cc), sh);
  }
  for (let k = 0; k < 4; k++) {
    const a = k * Math.PI / 4 + R() * 0.3, face = new V(Math.cos(a), (R() - 0.5) * 0.6, Math.sin(a)).normalize();
    const [right, up] = basisFacing(face, R() * Math.PI);
    const centre = new V((R() - 0.5) * r * 0.3, cy + (R() - 0.3) * ry * 0.4, (R() - 0.5) * r * 0.3);
    card(out, centre, right, up, r * 1.3, r * 1.3 * squash, ATLAS.LEAF, crownNormal(centre, cc).lerp(Y, 0.3).normalize(), shade * 0.8);
  }
  return { cards: clampFloor(fromAcc(out), 0.02), core, trunk, snow: null, species: 'broadleaf' };
}

/** conifer: short visible trunk, dark cone core (the shadow caster), 6 tiers of drooping bough cards, a tip pair, optional snow */
export function conifer(seed, { h = 7.6, r = 2.2, droop = 0.35, shade = 1, snow = false } = {}) {
  const R = rng(seed * 104729 + 7), cc = new V(0, h * 0.45, 0);
  const trunk = lathe([{ r: 0.32, y: 0 }, { r: 0.22, y: h * 0.3 }], 5, (j) => 0.8 + j * 0.15);
  const coreR = r * 0.55, y0 = h * 0.15;
  const core = solid(lathe([{ r: 0.001, y: y0 }, { r: coreR, y: y0 + 0.05 }, { r: 0, y: h * 0.97 }], 6), (x, y) => 0.5 * shade * (0.85 + 0.3 * (y - y0) / (h - y0)));
  const out = acc(), sn = acc(), tiers = 6;
  for (let t = 0; t < tiers; t++) {
    const k = t / (tiers - 1), ty = y0 + 0.35 + (h * 0.86 - y0 - 0.35) * Math.pow(k, 0.92), tr = r * (1 - 0.8 * k) * (0.92 + 0.16 * R());
    const off = (t % 2) * (36 * Math.PI / 180) + R() * 0.2;
    for (let b = 0; b < 5; b++) {
      const a = off + b * (Math.PI * 2 / 5) + (R() - 0.5) * 0.25, dr = droop * (0.8 + 0.4 * R());
      const dir = new V(Math.cos(a) * Math.cos(dr), -Math.sin(dr), Math.sin(a) * Math.cos(dr));
      const side = new V(-Math.sin(a), 0, Math.cos(a)), plane = new V().crossVectors(side, dir).normalize();
      // roll the bough about its axis so a low camera does not see it edge-on
      const roll = (b % 2 ? 1 : -1) * (0.8 + 0.3 * R());
      const right = side.clone().multiplyScalar(Math.cos(roll)).addScaledVector(plane, Math.sin(roll)).normalize();
      const len = tr * 1.22, w = len * 1.05, centre = new V(0, ty, 0).addScaledVector(dir, len * 0.5);
      const nrm = crownNormal(centre, cc), sh = shade * (0.8 + 0.3 * k) * (0.92 + 0.16 * R());
      card(out, centre, right, dir, w, len, ATLAS.BOUGH, nrm, [sh * 0.85, sh * 1.05]);
      if (snow && t >= tiers - 4) {
        const pn = new V().crossVectors(right, dir).normalize(); if (pn.y < 0) pn.negate();
        card(sn, centre.clone().addScaledVector(pn, 0.06).addScaledVector(dir, -len * 0.04), right, dir, w * 0.8, len * 0.85, ATLAS.BOUGH, nrm.clone().lerp(Y, 0.5).normalize(), 1);
      }
    }
  }
  // tip: one vertical crossed pair
  const tipH = h * 0.2, tipW = r * 0.45, ta = R() * Math.PI;
  for (let k = 0; k < 2; k++) {
    const a = ta + k * Math.PI / 2, right = new V(Math.cos(a), 0, Math.sin(a)), centre = new V(0, h - tipH / 2 - 0.05, 0);
    card(out, centre, right, Y, tipW, tipH, ATLAS.BOUGH, new V(0, 1, 0), [shade * 0.95, shade * 1.05]);
  }
  return { cards: clampFloor(fromAcc(out), 0.02), core, trunk, snow: snow ? clampFloor(fromAcc(sn), 0.02) : null, species: 'conifer' };
}

/** palm: curved, ringed 6-sided trunk to ~8 m, 10 two-piece drooping fronds, small crown knot */
export function palm(seed, { h = 8, bend = 0.9, fronds = 10 } = {}) {
  const R = rng(seed * 6007 + 3), dirA = R() * Math.PI * 2, bx = Math.cos(dirA) * bend, bz = Math.sin(dirA) * bend;
  const rings = [];
  for (let j = 0; j <= 6; j++) { const t = j / 6; rings.push({ r: 0.4 - 0.18 * t, y: t * h, x: bx * t * t, z: bz * t * t }); }
  const trunk = lathe(rings, 6, (j) => (j % 2 ? 0.82 : 1.02));
  const top = new V(bx, h, bz);
  const knot = solid(lathe([{ r: 0.3, y: h - 0.2, x: bx, z: bz }, { r: 0.42, y: h + 0.15, x: bx, z: bz }, { r: 0, y: h + 0.55, x: bx, z: bz }], 6), () => 0.7);
  const trunkAll = merge([trunk, knot]);
  const out = acc(), [u0, v0, u1, v1] = ATLAS.FROND, vm = (v0 + v1) / 2;
  for (let f = 0; f < fronds; f++) {
    const a = (f / fronds) * Math.PI * 2 + (R() - 0.5) * 0.4, el = 0.35 - R() * 0.5, L = 1.7 + R() * 0.5, w = 1.1 + R() * 0.3;
    const horiz = new V(Math.cos(a), 0, Math.sin(a)), side = new V(-Math.sin(a), 0, Math.cos(a));
    const d1 = horiz.clone().multiplyScalar(Math.cos(el)).setY(Math.sin(el)), d2 = horiz.clone().multiplyScalar(Math.cos(el - 0.6)).setY(Math.sin(el - 0.6));
    const base = top.clone().add(new V(0, 0.2, 0)), c1 = base.clone().addScaledVector(d1, L / 2), mid = base.clone().addScaledVector(d1, L), c2 = mid.clone().addScaledVector(d2, L / 2);
    const roll = (R() - 0.5) * 0.5, right = side.clone().applyAxisAngle(horiz, roll);
    const sh = 0.85 + 0.2 * R();
    card(out, c1, right, d1, w, L, [u0, v0, u1, vm], crownNormal(c1, top), [sh * 0.85, sh]);
    card(out, c2, right, d2, w, L, [u0, vm, u1, v1], crownNormal(c2, top), [sh, sh * 1.05]);
  }
  return { cards: clampFloor(fromAcc(out), 0.02), core: null, trunk: trunkAll, snow: null, species: 'palm' };
}

/** low shrub: squashed icosahedron core with leaf cards around it; `tuftMix` turns that share of cards into dry grass tufts */
export function shrub(seed, { r = 1.8, h = 1.6, tuftMix = 0, shade = 1 } = {}) {
  const R = rng(seed * 3571 + 11), cy = h * 0.5, cc = new V(0, cy, 0);
  const g = new THREE.IcosahedronGeometry(1, 0), pa = g.attributes.position;
  for (let v = 0; v < pa.count; v++) pa.setXYZ(v, pa.getX(v) * r * 0.65, cy + pa.getY(v) * h * 0.42, pa.getZ(v) * r * 0.65);
  g.computeVertexNormals();
  const core = solid(g, (x, y) => 0.45 * shade * (0.85 + 0.3 * y / h));
  const out = acc();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + R() * 0.5, tuftCard = R() < tuftMix;
    const d = new V(Math.cos(a), 0.15 + R() * 0.5, Math.sin(a)).normalize();
    const centre = new V(d.x * r * 0.55, cy + d.y * h * 0.3, d.z * r * 0.55);
    const sh = shade * (0.8 + 0.25 * R());
    if (tuftCard) {
      const right = new V(-Math.sin(a), 0, Math.cos(a)), hh = h * (0.8 + 0.4 * R());
      card(out, new V(centre.x, hh / 2, centre.z), right, Y, r * 1.1, hh, ATLAS.TUFT, crownNormal(centre, cc), [sh * 0.8, sh * 1.05]);
    } else {
      const [right, up] = basisFacing(d, R() * Math.PI * 2), w = r * (0.9 + 0.3 * R());
      card(out, centre, right, up, w, w * (h / r) * 1.1, ATLAS.LEAF, crownNormal(centre, cc), sh);
    }
  }
  return { cards: clampFloor(fromAcc(out), 0.02), core, trunk: degenerate(false), snow: null, species: 'shrub' };
}

/** saguaro: 10-sided column and 1-3 arms with elbows and rounded tops, rib shading, no cards */
export function cactus(seed, { h = 0 } = {}) {
  const R = rng(seed * 2741 + 5), H = h || 4.5 + R() * 2.5, cr = 0.38 + R() * 0.08, sides = 10;
  const rib = (s) => (s % 2 ? 0.9 : 1.04);
  const main = lathe([{ r: cr * 1.05, y: 0 }, { r: cr, y: H * 0.5 }, { r: cr * 0.95, y: H - cr }, { r: cr * 0.67, y: H - cr * 0.32 }, { r: 0, y: H }], sides, (j) => 0.82 + 0.06 * Math.min(j, 3), rib);
  const parts = [main], nArms = 1 + Math.floor(R() * 3), a0 = R() * Math.PI * 2;
  for (let k = 0; k < nArms; k++) {
    const a = a0 + k * (Math.PI * 2 / nArms) + (R() - 0.5) * 0.6, ya = H * (0.3 + 0.25 * R()), out = cr * (2.0 + R() * 0.8), ar = cr * (0.62 + 0.12 * R());
    const ex = Math.cos(a) * out, ez = Math.sin(a) * out, yTop = Math.min(H - 0.3, ya + H * (0.25 + 0.2 * R()));
    parts.push(tube(new V(Math.cos(a) * cr * 0.4, ya, Math.sin(a) * cr * 0.4), new V(ex, ya + ar * 1.2, ez), ar, ar, sides, [0.85, 0.92]));
    parts.push(lathe([{ r: ar, y: ya + ar * 0.6, x: ex, z: ez }, { r: ar * 0.95, y: yTop, x: ex, z: ez }, { r: ar * 0.67, y: yTop + ar * 0.68, x: ex, z: ez }, { r: 0, y: yTop + ar * 0.95, x: ex, z: ez }], sides, (j) => 0.88 + 0.05 * j, rib));
  }
  return { cards: degenerate(true), core: null, trunk: merge(parts), snow: null, species: 'cactus' };
}

/** grass / dry-scrub tuft: three TUFT quads crossed at 60 degrees */
export function tuft(seed, { h = 0.6, w = 0.9 } = {}) {
  const R = rng(seed * 811 + 1), out = acc(), a0 = R() * Math.PI;
  for (let k = 0; k < 3; k++) {
    const a = a0 + k * Math.PI / 3, right = new V(Math.cos(a), 0, Math.sin(a)), pn = new V(-Math.sin(a), 0, Math.cos(a));
    card(out, new V(0, h / 2, 0), right, Y, w, h, ATLAS.TUFT, pn.multiplyScalar(0.3).add(Y).normalize(), [0.75, 1.05]);
  }
  return { cards: fromAcc(out), core: null, trunk: null, snow: null };
}

/** cheap distant-wood LOD: crossed cards only, no core or trunk */
export function farTree(kind, { h = 7.4, r = 2.4 } = {}) {
  const out = acc();
  if (kind === 'conifer') {
    const [u0, v0, u1, v1] = ATLAS.BOUGH, um = (u0 + u1) / 2;
    for (let k = 0; k < 2; k++) {
      const a = k * Math.PI / 2, right = new V(Math.cos(a), 0, Math.sin(a)), pn = new V(-Math.sin(a), 0.3, Math.cos(a)).normalize();
      tri2(out, new V(-right.x * r, h * 0.12, -right.z * r), new V(right.x * r, h * 0.12, right.z * r), new V(0, h, 0), [u0, v0], [u1, v0], [um, v1], pn, 0.85);
    }
    for (let t = 0; t < 4; t++) {
      const k = t / 3, ty = h * (0.25 + 0.5 * k), tr = r * (1 - 0.7 * k), a = t * 0.8;
      const dir = new V(Math.cos(a), -0.35, Math.sin(a)).normalize(), side = new V(-Math.sin(a), 0, Math.cos(a));
      card(out, new V(0, ty, 0), side, dir, tr * 1.6, tr * 2, ATLAS.BOUGH, new V(0, 1, 0), 0.8 + 0.2 * k);
    }
  } else {
    const cy = h - r * 0.85, cc = new V(0, cy, 0);
    for (let k = 0; k < 8; k++) {
      const a = k * (Math.PI * 2 / 8) * 1.618, el = (k % 3 - 1) * 0.5, face = new V(Math.cos(a) * Math.cos(el), Math.sin(el), Math.sin(a) * Math.cos(el));
      const [right, up] = basisFacing(face, k * 0.9), centre = new V(face.x * r * 0.35, cy + face.y * r * 0.3, face.z * r * 0.35);
      card(out, centre, right, up, r * 1.7, r * 1.5, ATLAS.LEAF, crownNormal(centre, cc), 0.8 + 0.1 * (k % 3));
    }
  }
  return { cards: clampFloor(fromAcc(out), 0.02), core: null, trunk: null, snow: null };
}
