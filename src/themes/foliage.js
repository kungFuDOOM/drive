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
/** fully opaque texels (uv) inside the LEAF / BOUGH cells: solid crown bodies in the far LOD sample these with a constant uv */
export const SOLID = { LEAF: [(0.5 * CELL) / AN, (0.5 * CELL) / AN], BOUGH: [(1.5 * CELL) / AN, (0.4 * CELL) / AN] };

let atlasTex = null, normalTex = null;
/** Paint the atlas into shade / alpha float arrays. Exported for tests (coverage), the texture is built from it. */
export function paintAtlas() {
  const shade = new Float32Array(AN * AN).fill(0.72), alpha = new Float32Array(AN * AN);
  // per-texel shading-normal offset along the card's u / v axes (-1..1): leaf clumps bulge, so each one catches the sun on its own
  const nx = new Float32Array(AN * AN), ny = new Float32Array(AN * AN);
  let pnx = 0, pny = 0; // normal offset of the shape being painted
  const cellOf = (cx, cy) => ({ ox: cx * CELL, oy: cy * CELL });
  const put = (c, px, py, a, s) => {
    if (px < MARGIN || py < MARGIN || px >= CELL - MARGIN || py >= CELL - MARGIN || a <= 0) return;
    const k = (c.oy + py) * AN + c.ox + px;
    if (a >= alpha[k]) { shade[k] = s; nx[k] = pnx; ny[k] = pny; }
    else { shade[k] = shade[k] + (s - shade[k]) * a; nx[k] += (pnx - nx[k]) * a; ny[k] += (pny - ny[k]) * a; }
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
  // LEAF: a mass of foliage made of ~a dozen leaf clumps over a dark inner layer. Every clump is lit from above (bright top,
  // shaded underside) and carries a bulging normal, so one card reads as several rounded sprays with dark gaps between them
  // instead of a flat disc. Cards using this cell are kept roughly upright (v = up).
  {
    const c = cellOf(0, 0);
    for (let i = 0; i < 80; i++) { // inner layer: dark leaves seen through the gaps
      const a = r() * Math.PI * 2, rad = 0.37 * Math.sqrt(r());
      pnx = Math.cos(a) * rad * 1.1; pny = Math.sin(a) * rad * 1.1;
      ellipse(c, 0.5 + Math.cos(a) * rad, 0.5 + Math.sin(a) * rad, 0.07, 0.042, r() * Math.PI, 0.4 + 0.1 * r());
    }
    const clumps = [[0, 0, 0.17]];
    for (let k = 0; k < 4; k++) { const a = 0.6 + k * Math.PI / 2 + (r() - 0.5) * 0.5; clumps.push([Math.cos(a) * 0.19, Math.sin(a) * 0.19, 0.14 + 0.03 * r()]); }
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4 + (r() - 0.5) * 0.4, d = 0.31 + 0.05 * r(); clumps.push([Math.cos(a) * d, Math.sin(a) * d, 0.11 + 0.035 * r()]); }
    clumps.sort((p, q) => p[1] - q[1]); // lower sprays first: the one above overhangs with its shaded underside
    for (const [qx, qy, rc] of clumps) {
      const leaves = [];
      for (let i = 0; i < 20; i++) { const a = r() * Math.PI * 2, rad = rc * Math.sqrt(r()); leaves.push([Math.cos(a) * rad, Math.sin(a) * rad]); }
      leaves.sort((p, q) => p[1] - q[1]);
      for (const [lx, ly] of leaves) {
        pnx = Math.max(-0.9, Math.min(0.9, 0.8 * lx / rc + 0.7 * qx / 0.42)); pny = Math.max(-0.9, Math.min(0.9, 0.8 * ly / rc + 0.7 * qy / 0.42));
        ellipse(c, 0.5 + qx + lx, 0.5 + qy + ly, 0.066, 0.038, r() * Math.PI, Math.min(1, 0.74 + 0.24 * ly / rc + 0.1 * (r() - 0.5)));
      }
    }
    pnx = pny = 0;
    ellipse(c, 0.5, 0.5, 0.045, 0.045, 0, 0.74); // SOLID.LEAF: guaranteed opaque, flat normal
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
    ellipse(c, 0.5, 0.4, 0.045, 0.045, 0, 0.6); // SOLID.BOUGH: guaranteed opaque
    // needle sprays sag either side of the twig: tilt the normal outward across the bough
    for (let py = 0; py < CELL; py++) for (let px = 0; px < CELL; px++) { const k = (c.oy + py) * AN + c.ox + px; nx[k] = Math.max(-0.7, Math.min(0.7, (px + 0.5 - CELL / 2) / (CELL * 0.3))) * (Math.hypot(px + 0.5 - CELL / 2, py + 0.5 - 0.4 * CELL) < 0.06 * CELL ? 0 : 1); }
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
  return { shade, alpha, nx, ny, size: AN, cell: CELL, margin: MARGIN };
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

/** cached 256x256 companion of the leaf atlas: RG = shading-normal offset along the card's u / v axes (0.5 = none) */
export function leafNormalAtlas() {
  if (normalTex) return normalTex;
  const { nx, ny } = paintAtlas(), data = new Uint8Array(AN * AN * 4);
  for (let i = 0; i < AN * AN; i++) { data[i * 4] = Math.round((nx[i] * 0.5 + 0.5) * 255); data[i * 4 + 1] = Math.round((ny[i] * 0.5 + 0.5) * 255); data[i * 4 + 2] = 255; data[i * 4 + 3] = 255; }
  normalTex = new THREE.DataTexture(data, AN, AN);
  normalTex.generateMipmaps = true; normalTex.minFilter = THREE.LinearMipmapLinearFilter; normalTex.magFilter = THREE.LinearFilter;
  normalTex.wrapS = normalTex.wrapT = THREE.ClampToEdgeWrapping; normalTex.needsUpdate = true;
  return normalTex;
}

/**
 * Material patch for card foliage. Cards are single quads drawn two-sided, but (unlike three's DOUBLE_SIDED path) the shading
 * normal is NOT flipped on back faces: every card keeps its "outward from the crown" normal from either side, so a crown lights
 * as one volume at half the triangles of the old front + reversed pairs. `bump` > 0 also bends the normal per fragment by the
 * leaf normal atlas (in the card's own u / v frame, from screen-space derivatives), which gives each leaf clump its own lit and
 * shaded side: depth inside a card, at no vertex cost.
 */
export function cardSided(mat, bump = 0) {
  const prev = mat.onBeforeCompile, key = mat.customProgramCacheKey;
  mat.side = THREE.DoubleSide; mat.userData.cardSided = bump;
  mat.onBeforeCompile = (sh, r) => {
    prev.call(mat, sh, r);
    sh.fragmentShader = '#undef DOUBLE_SIDED\n' + sh.fragmentShader;
    if (!bump) return;
    sh.uniforms.tLeafN = { value: leafNormalAtlas() };
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform sampler2D tLeafN;')
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      #ifdef USE_MAP
      {
        vec2 ln = texture2D(tLeafN, vMapUv).xy * 2.0 - 1.0;
        vec3 q0 = dFdx(-vViewPosition), q1 = dFdy(-vViewPosition); vec2 s0 = dFdx(vMapUv), s1 = dFdy(vMapUv);
        float sg = sign(s0.x * s1.y - s0.y * s1.x);
        vec3 lT = (q0 * s1.y - q1 * s0.y) * sg, lB = (q1 * s0.x - q0 * s1.x) * sg;
        float tl = dot(lT, lT), bl = dot(lB, lB);
        if (tl > 0.0 && bl > 0.0) normal = normalize(normal + (lT * inversesqrt(tl) * ln.x + lB * inversesqrt(bl) * ln.y) * ${bump.toFixed(3)});
      }
      #endif`);
  };
  mat.customProgramCacheKey = () => key.call(mat) + 'cards' + bump;
  return mat;
}

// ---------------------------------------------------------------- geometry helpers
const V = THREE.Vector3;
const Y = new V(0, 1, 0);
const acc = () => ({ p: [], n: [], uv: [], c: [] });
/** shading normal outward from the crown centre, biased upward */
export const crownNormal = (centre, crownCentre) => new V().subVectors(centre, crownCentre).add(new V(0, 0.3, 0)).normalize();
/**
 * Push one quad (6 vertices) with one shading normal, uv and colour; it is drawn from both sides by a cardSided() material.
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
  for (const k of [0, 1, 2, 0, 2, 3]) {
    const q = P[k];
    out.p.push(q[0], q[1], q[2]); out.n.push(normal.x, normal.y, normal.z); out.uv.push(q[3], q[4]); out.c.push(q[5], q[5], q[5]);
  }
}
/** append a solid (non-indexed, vertex-coloured) geometry to a card accumulator; every vertex samples the opaque texel `uv` */
function pushSolid(out, g, uv) {
  const pa = g.attributes.position, na = g.attributes.normal, ca = g.attributes.color;
  for (let i = 0; i < pa.count; i++) {
    out.p.push(pa.getX(i), pa.getY(i), pa.getZ(i)); out.n.push(na.getX(i), na.getY(i), na.getZ(i)); out.uv.push(uv[0], uv[1]); out.c.push(ca.getX(i), ca.getY(i), ca.getZ(i));
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
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
/**
 * Fake self-occlusion baked into the card vertex colours: `depth(x, y, z)` is 0 at the crown core and 1 at its rim, so
 * leaves inside the crown (and on its underside) darken to (1 - amt) while the outer rim brightens by `rim`. Gives a crown
 * depth (lighter rim, darker core) at no runtime cost.
 */
export function occlude(a, depth, amt, under = null, rim = 0.08, perCard = 0) {
  for (let i = 0; i < a.p.length; i += 3) {
    const x = a.p[i], y = a.p[i + 1], z = a.p[i + 2];
    let d = depth(x, y, z);
    if (perCard) { // card() pushes 6 vertices per quad: mix in the depth of the quad's centre, so cards through the crown go dark as a whole
      const c0 = Math.floor(i / 18) * 18; let cx = 0, cy = 0, cz = 0;
      for (let k = c0; k < c0 + 18; k += 3) { cx += a.p[k]; cy += a.p[k + 1]; cz += a.p[k + 2]; }
      d = d * (1 - perCard) + depth(cx / 6, cy / 6, cz / 6) * perCard;
    }
    let k = (1 - amt) + (amt + rim) * sstep(0.15, 1.0, d);
    if (under) k *= 1 - under.amt * sstep(under.from, under.to, y);
    a.c[i] *= k; a.c[i + 1] *= k; a.c[i + 2] *= k;
  }
  return a;
}
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
/** noise-displaced icosahedron lobe at `c` (radii rad x rad*sq x rad) with smooth outward normals; colour from shadeFn(x, y, z) */
function lobeGeo(c, rad, sq, sd, cc, shadeFn, detail = 0) {
  const g = new THREE.IcosahedronGeometry(1, detail), pa = g.attributes.position, na = new Float32Array(pa.count * 3), col = new Float32Array(pa.count * 3);
  const n = new V();
  for (let v = 0; v < pa.count; v++) {
    const x = pa.getX(v), y = pa.getY(v), z = pa.getZ(v), k = 0.82 + 0.36 * vnoise(x * 1.7 + sd, z * 1.7 + y * 1.3 + sd * 0.7);
    const px = c.x + x * k * rad, py = c.y + y * k * rad * sq, pz = c.z + z * k * rad;
    pa.setXYZ(v, px, py, pz);
    n.set(px - cc.x, py - cc.y, pz - cc.z).normalize().multiplyScalar(0.5).add(new V(x, y + 0.2, z)).normalize();
    na[v * 3] = n.x; na[v * 3 + 1] = n.y; na[v * 3 + 2] = n.z;
    const s = shadeFn(px, py, pz); col[v * 3] = s; col[v * 3 + 1] = s; col[v * 3 + 2] = s;
  }
  g.deleteAttribute('uv');
  g.setAttribute('normal', new THREE.BufferAttribute(na, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g.index ? g.toNonIndexed() : g;
}

/**
 * broadleaf: tapered trunk + branches, and a crown built from 5 overlapping lobes (one on top, four around it). Each lobe is a
 * solid displaced blob (the visible inner foliage mass and the shadow caster) wrapped in its own shell of small upright
 * leaf-clump cards, so the crown has real volume: a lumpy outline, lit lobe tops and dark gaps where the lobes meet.
 */
export function broadleaf(seed, { h = 7.4, r = 2.5, squash = 0.85, shade = 1, cards: nCards = 26 } = {}) {
  const R = rng(seed * 7919 + 13), ry = r * squash, cy = h - ry, cc = new V(0, cy, 0), sq = Math.min(1.25, Math.max(0.7, squash));
  const tTop = h * 0.45, tr = 0.16 + r * 0.06;
  const top = { c: new V((R() - 0.5) * r * 0.2, 0, (R() - 0.5) * r * 0.2), r: r * (0.58 + 0.08 * R()) };
  top.c.y = h - top.r * sq * 0.98;
  const lobes = [top], a0 = R() * Math.PI * 2;
  for (let k = 0; k < 4; k++) {
    const a = a0 + k * Math.PI / 2 + (R() - 0.5) * 0.6, d = r * (0.42 + 0.14 * R());
    lobes.push({ c: new V(Math.cos(a) * d, cy + ry * (-0.42 + 0.4 * R()), Math.sin(a) * d), r: r * (0.46 + 0.16 * R()) });
  }
  const parts = [lathe([{ r: tr * 1.35, y: 0 }, { r: tr, y: tTop * 0.5 }, { r: tr * 0.7, y: tTop }], 6, (j) => 0.8 + j * 0.1)];
  const nb = 2 + Math.floor(R() * 2);
  for (let k = 0; k < nb; k++) { // branches run from the trunk into the side lobes
    const l = lobes[1 + k], y0 = tTop * (0.7 + 0.25 * R());
    parts.push(tube(new V(0, y0, 0), new V(l.c.x * 0.8, l.c.y - l.r * sq * 0.3, l.c.z * 0.8), tr * 0.55, tr * 0.25, 4, [0.85, 0.95]));
  }
  const trunk = merge(parts);
  const depth = (x, y, z) => Math.hypot(x / (r * 1.08), (y - cy) / ry, z / (r * 1.08));
  // solid lobes: lit from above, darker low in the crown and where a lobe sinks into its neighbours
  const core = merge(lobes.map((l, i) => lobeGeo(l.c, l.r * 0.8, sq, seed + i * 3.1, cc, (x, y, z) => {
    let inside = 0;
    lobes.forEach((o, j) => { if (j !== i) inside = Math.max(inside, 1 - Math.hypot(x - o.c.x, (y - o.c.y) / sq, z - o.c.z) / o.r); });
    const t = Math.min(1, Math.max(0, (y - cy + ry) / (2 * ry)));
    return shade * (0.4 + 0.26 * t) * (0.72 + 0.28 * sstep(0.25, 0.95, depth(x, y, z))) * (1 - 0.3 * sstep(0.1, 0.5, inside));
  })));
  // leaf shells: cards on a Fibonacci sphere over every lobe, skipping the directions that point into the crown
  const out = acc(), total = Math.round(nCards * 2.7), per = Math.ceil((total - 3) / lobes.length);
  lobes.forEach((l, i) => {
    const inward = i ? new V(-l.c.x, 0, -l.c.z).normalize() : new V(0, -1, 0), yaw = R() * Math.PI * 2, fibN = Math.round(per / (i ? 0.62 : 0.72));
    let made = 0;
    for (let j = 0; j < fibN && made < per; j++) {
      const d = fib(j, fibN).applyAxisAngle(Y, yaw);
      if (d.y < (i ? -0.55 : -0.3) || (i && d.dot(inward) > 0.5)) continue;
      made++;
      const centre = new V(l.c.x + d.x * l.r * 0.8, l.c.y + d.y * l.r * 0.8 * sq, l.c.z + d.z * l.r * 0.8).add(new V((R() - 0.5), (R() - 0.5), (R() - 0.5)).multiplyScalar(l.r * 0.16));
      const face = new V(d.x, d.y * 0.55, d.z).add(new V((R() - 0.5), (R() - 0.5) * 0.5, (R() - 0.5)).multiplyScalar(1.0)).normalize(); // mostly upright: flat-lying cards smear edge-on
      const [right, up] = basisFacing(face, (R() - 0.5) * 0.9);
      const w = l.r * (0.74 + 0.34 * R()), t = Math.min(1, Math.max(0, (centre.y - cy + ry) / (2 * ry))), sh = shade * (0.76 + 0.3 * t) * (0.92 + 0.16 * R());
      const nrm = d.clone().multiplyScalar(0.6).add(new V().subVectors(centre, cc).normalize().multiplyScalar(0.4)).add(new V(0, 0.25, 0)).normalize();
      card(out, centre, right, up, w, w, ATLAS.LEAF, nrm, [sh * 0.88, sh * 1.06]);
    }
  });
  for (let k = 0; k < 3; k++) { // three large cards through the middle close any see-through gap between the lobes
    const a = k * Math.PI / 3 + R() * 0.3, face = new V(Math.cos(a), (R() - 0.5) * 0.4, Math.sin(a)).normalize();
    const [right, up] = basisFacing(face, (R() - 0.5) * 0.6);
    const centre = new V((R() - 0.5) * r * 0.3, cy + (R() - 0.2) * ry * 0.4, (R() - 0.5) * r * 0.3);
    card(out, centre, right, up, r * 1.5, r * 1.5 * sq, ATLAS.LEAF, crownNormal(centre, cc).lerp(Y, 0.3).normalize(), shade * 0.8);
  }
  occlude(out, depth, 0.42, { amt: 0.18, from: cy, to: cy - ry }, 0.1, 0.5);
  return { cards: clampFloor(fromAcc(out), 0.02), core, trunk, snow: null, species: 'broadleaf', dims: { h, r, squash, seed } };
}

/**
 * conifer: short visible trunk, dark two-stage cone core (the shadow caster) and 9 tiers of drooping bough cards, 7 per tier at
 * the skirt down to 4 at the top. The lower five tiers are two-piece boughs that sag and then droop further at the tip; a crossed
 * pair forms the leader. Optional snow on the upper tiers.
 */
export function conifer(seed, { h = 7.6, r = 2.2, droop = 0.35, shade = 1, snow = false } = {}) {
  const R = rng(seed * 104729 + 7), cc = new V(0, h * 0.45, 0);
  const trunk = lathe([{ r: 0.32, y: 0 }, { r: 0.22, y: h * 0.3 }], 5, (j) => 0.8 + j * 0.15);
  const coreR = r * 0.55, y0 = h * 0.15;
  const core = solid(lathe([{ r: 0.001, y: y0 }, { r: coreR, y: y0 + 0.05 }, { r: coreR * 0.5, y: y0 + (h - y0) * 0.52 }, { r: 0, y: h * 0.97 }], 7), (x, y) => 0.5 * shade * (0.85 + 0.3 * (y - y0) / (h - y0)));
  const out = acc(), sn = acc(), tiers = 9, [u0, v0, u1, v1] = ATLAS.BOUGH, vm = v0 + (v1 - v0) * 0.52;
  for (let t = 0; t < tiers; t++) {
    const k = t / (tiers - 1), ty = y0 + 0.3 + (h * 0.88 - y0 - 0.3) * Math.pow(k, 0.94), tr = r * (1 - 0.82 * k) * (0.9 + 0.2 * R());
    const nb = Math.round(7 - 3 * k), off = R() * Math.PI * 2;
    for (let b = 0; b < nb; b++) {
      const a = off + b * (Math.PI * 2 / nb) + (R() - 0.5) * 0.3, dr = droop * (0.75 + 0.5 * R());
      const dirOf = (e) => new V(Math.cos(a) * Math.cos(e), -Math.sin(e), Math.sin(a) * Math.cos(e));
      const side = new V(-Math.sin(a), 0, Math.cos(a));
      // roll the bough about its axis so a low camera does not see it edge-on
      const roll = (b % 2 ? 1 : -1) * (0.75 + 0.35 * R());
      const len = tr * 1.25 * (0.9 + 0.2 * R()), w = len * 1.0, root = new V(0, ty + (R() - 0.5) * 0.25, 0);
      const sh = shade * (0.8 + 0.3 * k) * (0.92 + 0.16 * R());
      const piece = (from, dir, L, ww, uv, s0, s1) => {
        const plane = new V().crossVectors(side, dir).normalize(), right = side.clone().multiplyScalar(Math.cos(roll)).addScaledVector(plane, Math.sin(roll)).normalize();
        const centre = from.clone().addScaledVector(dir, L * 0.5), nrm = crownNormal(centre, cc);
        card(out, centre, right, dir, ww, L, uv, nrm, [s0, s1]);
        if (snow && t >= 3) {
          const pn = new V().crossVectors(right, dir).normalize(); if (pn.y < 0) pn.negate();
          card(sn, centre.clone().addScaledVector(pn, 0.06).addScaledVector(dir, -L * 0.04), right, dir, ww * 0.8, L * 0.85, uv, nrm.clone().lerp(Y, 0.5).normalize(), 1);
        }
      };
      if (t < 5) { // sagging bough: inner half near level, outer half hangs
        const d1 = dirOf(dr * 0.55), d2 = dirOf(dr * 1.7 + 0.12), L1 = len * 0.52, L2 = len * 0.52;
        piece(root, d1, L1, w, [u0, v0, u1, vm], sh * 0.85, sh * 0.95);
        piece(root.clone().addScaledVector(d1, L1), d2, L2, w, [u0, vm, u1, v1], sh * 0.95, sh * 1.05);
      } else piece(root, dirOf(dr), len, w, ATLAS.BOUGH, sh * 0.85, sh * 1.05);
    }
  }
  // tip: one vertical crossed pair
  const tipH = h * 0.2, tipW = r * 0.45, ta = R() * Math.PI;
  for (let k = 0; k < 2; k++) {
    const a = ta + k * Math.PI / 2, right = new V(Math.cos(a), 0, Math.sin(a)), centre = new V(0, h - tipH / 2 - 0.05, 0);
    card(out, centre, right, Y, tipW, tipH, ATLAS.BOUGH, new V(0, 1, 0), [shade * 0.95, shade * 1.05]);
  }
  // radial: bough roots by the trunk are deep in the cone, the drooping tips sit on its skin
  occlude(out, (x, y, z) => Math.hypot(x, z) / Math.max(0.35, r * (1 - 0.85 * Math.min(1, Math.max(0, (y - y0) / (h - y0))))), 0.4, null, 0.22);
  return { cards: clampFloor(fromAcc(out), 0.02), core, trunk, snow: snow ? clampFloor(fromAcc(sn), 0.02) : null, species: 'conifer', dims: { h, r, droop, seed } };
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
  occlude(out, (x, y, z) => Math.hypot(x - top.x, y - top.y, z - top.z) / 3.2, 0.3);
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
  occlude(out, (x, y, z) => Math.hypot(x / r, (y - cy) / h * 1.6, z / r) * 1.2, 0.32, null, 0.08, 0.5);
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

/**
 * Distant-wood LOD (sector twins beyond the LOD range, far scenery woods and the Low bake): one mesh, no trunk, <= 48 triangles.
 * A solid crown body (displaced blob / cone, sampling an opaque atlas texel) gives the tree real volume and a closed middle from
 * any angle; a shell of leaf / bough cards around it breaks the outline. Pass the full variant's dims so the swap keeps its shape.
 */
export function farTree(kind, { h = 7.4, r = 2.4, squash = 0.85, droop = 0.35, seed = 1 } = {}) {
  const out = acc(), R = rng(seed * 4513 + 29);
  if (kind === 'conifer') {
    const y0 = h * 0.14, cc = new V(0, h * 0.45, 0), [u0, v0, u1, v1] = ATLAS.BOUGH, um = (u0 + u1) / 2;
    // body: a solid cone; three upright bough-textured triangles through the axis give it a needled, tapering outline from any side
    pushSolid(out, solid(lathe([{ r: r * 0.58, y: y0 }, { r: 0, y: h * 0.97 }], 6), (x, y) => 0.4 + 0.2 * (y - y0) / (h - y0)), SOLID.BOUGH);
    const a0 = R() * Math.PI;
    for (let k = 0; k < 3; k++) {
      const a = a0 + k * Math.PI / 3, rx = Math.cos(a) * r * 1.05, rz = Math.sin(a) * r * 1.05, n = new V(-Math.sin(a) * 0.35, 1, Math.cos(a) * 0.35).normalize();
      for (const [x, y, z, u, v, sh] of [[-rx, h * 0.1, -rz, u0, v0, 0.7], [rx, h * 0.1, rz, u1, v0, 0.7], [0, h, 0, um, v1, 1]]) { out.p.push(x, y, z); out.n.push(n.x, n.y, n.z); out.uv.push(u, v); out.c.push(sh, sh, sh); }
    }
    // four tiers of three drooping skirt boughs hug the cone: their lit tops and shaded roots layer it like a real fir
    const tiers = 4;
    for (let t = 0; t < tiers; t++) {
      const k = t / (tiers - 1), ty = y0 + h * 0.1 + (h * 0.8 - y0 - h * 0.1) * k, tr = r * (1 - 0.78 * k), off = a0 + t * 1.05 + R() * 0.4;
      for (let b = 0; b < 3; b++) {
        const a = off + b * (Math.PI * 2 / 3), dr = Math.max(droop, 0.3) + 0.25 + 0.15 * k;
        const dir = new V(Math.cos(a) * Math.cos(dr), -Math.sin(dr), Math.sin(a) * Math.cos(dr)), side = new V(-Math.sin(a), 0, Math.cos(a));
        const plane = new V().crossVectors(side, dir).normalize(), roll = (b % 2 ? 1 : -1) * 0.35;
        const right = side.clone().multiplyScalar(Math.cos(roll)).addScaledVector(plane, Math.sin(roll)).normalize();
        const len = tr * 1.2 + h * 0.05, centre = new V(0, ty, 0).addScaledVector(dir, len * 0.5), sh = 0.8 + 0.3 * k;
        card(out, centre, right, dir, len * 1.25, len, ATLAS.BOUGH, crownNormal(centre, cc), [sh * 0.85, sh * 1.05]);
      }
    }
    occlude(out, (x, y, z) => Math.hypot(x, z) / Math.max(0.35, r * (1 - 0.85 * Math.min(1, Math.max(0, (y - y0) / (h - y0))))), 0.36, null, 0.2);
  } else {
    const ry = r * squash, cy = h - ry, cc = new V(0, cy, 0), sq = Math.min(1.25, Math.max(0.7, squash));
    const depth = (x, y, z) => Math.hypot(x / (r * 1.08), (y - cy) / ry, z / (r * 1.08));
    const n0 = out.p.length / 3;
    pushSolid(out, lobeGeo(new V(0, cy - ry * 0.05, 0), r * 0.8, squash * 0.95, seed + 0.5, cc, (x, y) => 0.4 + 0.3 * Math.min(1, Math.max(0, (y - cy + ry) / (2 * ry)))), SOLID.LEAF);
    const nSolid = out.p.length / 3 - n0, fibN = 13;
    for (let j = 0, made = 0; j < fibN && made < 10; j++) {
      const d = fib(j, fibN).applyAxisAngle(Y, seed * 1.7);
      if (d.y < -0.62) continue;
      made++;
      const centre = new V(d.x * r * 0.72, cy + d.y * ry * 0.7, d.z * r * 0.72);
      const face = new V(d.x, d.y * 0.6, d.z).add(new V((R() - 0.5), (R() - 0.5) * 0.5, (R() - 0.5)).multiplyScalar(0.9)).normalize();
      const [right, up] = basisFacing(face, (R() - 0.5) * 0.8);
      const w = r * (1.0 + 0.3 * R()), sh = (0.78 + 0.28 * (d.y + 1) / 2) * (0.94 + 0.12 * R());
      const nrm = d.clone().multiplyScalar(0.6).add(new V().subVectors(centre, cc).normalize().multiplyScalar(0.4)).add(new V(0, 0.25, 0)).normalize();
      card(out, centre, right, up, w, w * Math.min(1.1, Math.max(0.8, sq)), ATLAS.LEAF, nrm, [sh * 0.88, sh * 1.06]);
    }
    // occlusion on the cards only (the body carries its own top-lit shading)
    const cardsOnly = { p: out.p.slice((n0 + nSolid) * 3), c: out.c.slice((n0 + nSolid) * 3) };
    occlude(cardsOnly, depth, 0.36, { amt: 0.15, from: cy, to: cy - ry }, 0.1, 0.35);
    out.c.splice((n0 + nSolid) * 3, cardsOnly.c.length, ...cardsOnly.c);
  }
  return { cards: clampFloor(fromAcc(out), 0.02), core: null, trunk: null, snow: null };
}
