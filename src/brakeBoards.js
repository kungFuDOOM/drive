// Braking-distance boards (100 m / 50 m before the corner entry) beside the track: pure placement + ONE merged static mesh.
import * as THREE from 'three';
import { PixelMesh, GLYPHS } from './cars.js';
import { lineProfile } from './racingLine.js';

/**
 * Where boards go: one pair (100 m, 50 m) before every corner that really needs braking.
 * Returns [{ s, metres, side (+1 left / -1 right), d, corner, apex }] sorted by s.
 */
export function boardPlan(track, cls) {
  const N = track.n, L = track.length, prof = lineProfile(track, cls).v, kap = track.lineK, cand = [];
  const sectionAt = (i) => track.sectionName(((i % N) + N) % N);
  for (let i = 0; i < N; i++) {
    let isMin = true;
    for (let q = -14; q <= 14 && isMin; q++) { const o = prof[(i + q + N) % N]; if (o < prof[i] || (o === prof[i] && q < 0)) isMin = false; } // strict minimum, first sample of a plateau
    if (!isMin || prof[i] > cls.vTop * 0.66) continue;
    let vIn = 0; // approach speed: the highest planned speed in the 200 m before the apex
    for (let q = 0; q < Math.floor(200 / track.ds); q++) vIn = Math.max(vIn, prof[(i - q + N) % N]);
    if (vIn - prof[i] < 22) continue;
    let e = i; // corner entry: walk back from the apex until the line is nearly straight
    while ((i - e) * track.ds < 90 && Math.abs(kap[(e - 1 + N) % N]) > Math.abs(kap[i]) * 0.3) e--;
    cand.push({ i, e, sApex: i * track.ds, sEntry: (((e * track.ds) % L) + L) % L });
  }
  // a chicane / the squeeze is one braking zone: keep only the first corner of any run of apexes closer than 220 m
  const out = [];
  cand.forEach((c, k) => {
    const prev = cand[(k - 1 + cand.length) % cand.length];
    if (cand.length > 1 && ((c.sApex - prev.sApex + L) % L) < 220) return;
    const sideOut = kap[c.i] > 0 ? -1 : 1; // outside of the corner: the side the driver sees on the approach
    for (const metres of [100, 50]) {
      const s = (((c.sEntry - metres) % L) + L) % L, ix = Math.floor(s / track.ds) % N;
      const wall = sideOut > 0 ? track.leftWall[ix] : track.rightWall[ix];
      out.push({ s, metres, side: sideOut, d: sideOut * (wall + 2.2), corner: sectionAt(c.i), apex: c.sApex });
    }
  });
  return out.sort((a, b) => a.s - b.s);
}

/** Merged static mesh of all boards (post + yellow board + pixel digits), facing the oncoming cars. */
export function buildBrakeBoards(track, cls) {
  const plan = boardPlan(track, cls), m = new PixelMesh();
  const YEL = [1, 0.82, 0.12], BLK = [0.06, 0.06, 0.08], POST = [0.7, 0.7, 0.74];
  for (const b of plan) {
    const p = track.at(b.s, b.d), th = track.thetaAt(b.s) + Math.PI, sn = Math.sin(th), cs = Math.cos(th);
    const T = (x, y, z) => [p.x + cs * x + sn * z, p.y + y, p.z - sn * x + cs * z]; // local +z = facing the cars
    const W = 1.7, H = 1.2, y0 = 2.0;
    const q = (a, b, c, d, col) => { // quad in local space, wound towards local +z, placed in the world
      const A = [T(...a), T(...b), T(...c), T(...d)];
      m.flatQuad(A[0], A[1], A[2], A[3], col, [sn, 0, cs]); // wound towards the oncoming cars
    };
    // post
    for (const sx of [-0.6, 0.6]) {
      q([sx - 0.05, 0, 0], [sx + 0.05, 0, 0], [sx + 0.05, y0, 0], [sx - 0.05, y0, 0], POST);
      q([sx - 0.05, 0, -0.01], [sx + 0.05, 0, -0.01], [sx + 0.05, y0, -0.01], [sx - 0.05, y0, -0.01], POST);
    }
    // board face + back + thin top edge
    q([-W / 2, y0, 0.02], [W / 2, y0, 0.02], [W / 2, y0 + H, 0.02], [-W / 2, y0 + H, 0.02], YEL);
    q([-W / 2 - 0.06, y0 - 0.06, 0.01], [W / 2 + 0.06, y0 - 0.06, 0.01], [W / 2 + 0.06, y0 + H + 0.06, 0.01], [-W / 2 - 0.06, y0 + H + 0.06, 0.01], BLK);
    // digits
    const text = String(b.metres), cell = text.length === 3 ? 0.13 : 0.17, w = (text.length * 3 + (text.length - 1)) * cell, x0 = -w / 2, ya = y0 + (H - 5 * cell) / 2;
    for (let d = 0; d < text.length; d++) {
      const g = GLYPHS[text[d]];
      for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) if (g[r * 3 + c] === '1') {
        const xa = x0 + d * 4 * cell + c * cell, ya2 = ya + (4 - r) * cell;
        q([xa, ya2, 0.03], [xa + cell, ya2, 0.03], [xa + cell, ya2 + cell, 0.03], [xa, ya2 + cell, 0.03], BLK);
      }
    }
  }
  const g = m.geometry();
  const mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }));
  mesh.name = 'brake-boards'; mesh.frustumCulled = false;
  return { mesh, plan };
}
