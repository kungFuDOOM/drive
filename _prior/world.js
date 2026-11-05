// Three.js scene: floating island, track, cars, weather. Everything is built in code.
import * as THREE from 'three';
import { HALF, pointAt, distToTrack } from './track.js';
import { PIT, pitLaneWidth, mod, clamp, lerp } from './logic.js';
import { ROSTER } from './sim.js';

const SKY_DRY = new THREE.Color(0x7fc8f2), SKY_WET = new THREE.Color(0x39434f);

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

// Collects coloured triangles into a single mesh.
class Mesher {
  constructor() { this.pos = []; this.col = []; }
  tri(a, b, c, color) {
    for (const p of [a, b, c]) { this.pos.push(p[0], p[1], p[2]); this.col.push(color.r, color.g, color.b); }
  }
  quad(a, b, c, d, color) { this.tri(a, b, c, color); this.tri(a, c, d, color); }
  mesh(mat) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.computeVertexNormals();
    return new THREE.Mesh(g, mat);
  }
}
const C = (hex) => new THREE.Color(hex);

function box(w, h, d, color, x = 0, y = 0, z = 0, mats) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats ? mats(color) : new THREE.MeshLambertMaterial({ color }));
  m.position.set(x, y, z);
  return m;
}

export function buildCarMesh(def, isPlayer) {
  const g = new THREE.Group();
  const inner = new THREE.Group();
  g.add(inner);
  const body = def.color, acc = def.accent, dark = 0x1a1c22;
  const marks = [];
  const add = (w, h, d, c, x, y, z) => { const m = box(w, h, d, c, x, y, z); inner.add(m); return m; };
  const wheel = (x, z, w, h, l) => {
    add(w, h, l, dark, x, h / 2, z);
    const mk = box(0.12, h * 0.55, l * 0.7, 0xffd23f, x + Math.sign(x) * (w / 2 + 0.03), h / 2, z);
    inner.add(mk); marks.push(mk);
  };
  if (def.cls === 'gp') {
    add(1.3, 0.75, 3.8, body, 0, 0.75, 0);
    add(0.75, 0.5, 2.8, body, 0, 0.6, 3.2);
    add(2.9, 0.15, 0.8, acc, 0, 0.3, 4.5);
    add(0.15, 0.35, 0.8, acc, 1.5, 0.45, 4.5); add(0.15, 0.35, 0.8, acc, -1.5, 0.45, 4.5);
    add(2.1, 0.6, 1.8, body, 0, 0.6, -0.3);
    add(0.8, 0.9, 1.8, body, 0, 1.2, -1.5);
    add(2.3, 0.15, 0.8, acc, 0, 1.75, -3.2);
    add(0.15, 0.7, 0.8, acc, 1.2, 1.5, -3.2); add(0.15, 0.7, 0.8, acc, -1.2, 1.5, -3.2);
    add(0.3, 0.9, 0.3, dark, 0, 1.2, -3.0);
    add(0.55, 0.5, 0.55, acc, 0, 1.3, 0.6);
    wheel(1.45, 2.6, 0.8, 0.95, 1.2); wheel(-1.45, 2.6, 0.8, 0.95, 1.2);
    wheel(1.5, -2.5, 1.0, 1.1, 1.4); wheel(-1.5, -2.5, 1.0, 1.1, 1.4);
  } else {
    add(1.8, 0.8, 3.4, body, 0, 0.8, 0);
    add(1.1, 0.55, 2.2, body, 0, 0.65, 2.9);
    add(2.4, 0.2, 0.7, acc, 0, 0.3, 4.0);
    add(2.8, 0.7, 1.9, body, 0, 0.65, -0.2);
    add(1.0, 1.0, 1.6, body, 0, 1.3, -1.7);
    add(3.2, 0.2, 0.9, acc, 0, 2.0, -3.1);
    add(0.2, 0.9, 1.0, acc, 1.6, 1.6, -3.1); add(0.2, 0.9, 1.0, acc, -1.6, 1.6, -3.1);
    add(0.3, 1.3, 0.3, dark, 0, 1.3, -3.0);
    add(0.7, 0.7, 0.7, acc, 0, 1.55, 0.5);
    wheel(1.75, 2.3, 0.95, 1.05, 1.4); wheel(-1.75, 2.3, 0.95, 1.05, 1.4);
    wheel(1.8, -2.4, 1.05, 1.15, 1.5); wheel(-1.8, -2.4, 1.05, 1.15, 1.5);
  }
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 8.4), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false }));
  sh.rotation.x = -Math.PI / 2; sh.position.y = 0.18; sh.renderOrder = 2;
  g.add(sh);
  let marker = null;
  if (isPlayer) {
    marker = new THREE.Mesh(new THREE.ConeGeometry(0.9, 1.6, 4), new THREE.MeshBasicMaterial({ color: 0xffe14d }));
    marker.rotation.x = Math.PI; marker.position.y = 4.2;
    g.add(marker);
  }
  return { group: g, inner, marks, marker };
}

export function createWorld(track, cars) {
  const scene = new THREE.Scene();
  scene.background = SKY_DRY.clone();
  scene.fog = new THREE.Fog(SKY_DRY.clone(), 160, 560);
  const hemi = new THREE.HemisphereLight(0xdfefff, 0x6d7a5a, 1.5);
  const sun = new THREE.DirectionalLight(0xfff2d6, 2.2);
  sun.position.set(120, 200, 60);
  scene.add(hemi, sun);
  const rand = rng(1234);
  const N = track.N;

  // ---------- island ----------
  const R0 = 52;
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const p of track.pts) { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z); }
  const pad = R0 + 60, cell = 9;
  const x0 = minX - pad, z0 = minZ - pad;
  const nx = Math.ceil((maxX + pad - x0) / cell), nz = Math.ceil((maxZ + pad - z0) / cell);
  const gpos = [], gcol = [], gh = [];
  const grass = [C(0x4aa84a), C(0x56b552), C(0x3f9a45)];
  const rock = [C(0x8a6a4c), C(0x7a5c42), C(0x9b7a58)];
  const cloudCol = C(0xe8f1fb);
  for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) {
    const x = x0 + i * cell, z = z0 + j * cell;
    const d = distToTrack(track, x, z);
    const noise = rand();
    let h;
    if (d < R0) {
      const bump = Math.max(0, Math.min(1, (d - 24) / 14));
      h = -0.15 + bump * (Math.sin(x * 0.03) * Math.cos(z * 0.025) * 2.2 + noise * 0.8);
    } else {
      const t = d - R0;
      h = -0.2 - t * 1.25 - noise * 4;
      h = Math.max(h, -60);
    }
    gpos.push(x, h, z); gh.push(h);
    let c;
    if (h > -1.2) c = grass[Math.floor(noise * 3)].clone();
    else if (h > -55) c = rock[Math.floor(noise * 3)].clone().multiplyScalar(clamp(1 + h / 90, 0.45, 1));
    else c = cloudCol.clone();
    gcol.push(c.r, c.g, c.b);
  }
  const idxs = [];
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const a = j * (nx + 1) + i, b = a + 1, c2 = a + nx + 1, d2 = c2 + 1;
    idxs.push(a, c2, b, b, c2, d2);
  }
  const ig = new THREE.BufferGeometry();
  ig.setAttribute('position', new THREE.Float32BufferAttribute(gpos, 3));
  ig.setAttribute('color', new THREE.Float32BufferAttribute(gcol, 3));
  ig.setIndex(idxs);
  ig.computeVertexNormals();
  const island = new THREE.Mesh(ig, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true, side: THREE.DoubleSide }));
  scene.add(island);

  // cloud sea + puffs far below
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(5000, 5000), new THREE.MeshBasicMaterial({ color: 0xeaf2fb }));
  sea.rotation.x = -Math.PI / 2; sea.position.y = -62; scene.add(sea);
  const cx0 = (minX + maxX) / 2, cz0 = (minZ + maxZ) / 2;
  const puffMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  for (let i = 0; i < 40; i++) {
    const a = rand() * Math.PI * 2, r = 250 + rand() * 450;
    const puff = new THREE.Group();
    for (let k = 0; k < 4; k++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(30 + rand() * 40, 10 + rand() * 8, 24 + rand() * 30), puffMat);
      b.position.set(k * 22 - 40 + rand() * 10, rand() * 6, rand() * 20);
      puff.add(b);
    }
    puff.position.set(cx0 + Math.cos(a) * r, -30 - rand() * 25, cz0 + Math.sin(a) * r * 0.8);
    scene.add(puff);
  }
  // small floating rock islets
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + rand(), r = 330 + rand() * 120;
    const isl = new THREE.Group();
    const s = 14 + rand() * 18;
    const top = new THREE.Mesh(new THREE.CylinderGeometry(s, s * 0.95, 3, 7), new THREE.MeshLambertMaterial({ color: 0x4aa84a, flatShading: true }));
    const under = new THREE.Mesh(new THREE.ConeGeometry(s * 0.95, s * 1.8, 7), new THREE.MeshLambertMaterial({ color: 0x7a5c42, flatShading: true }));
    under.rotation.x = Math.PI; under.position.y = -1.5 - s * 0.9;
    isl.add(top, under);
    isl.position.set(cx0 + Math.cos(a) * r * 1.2, 5 + rand() * 25, cz0 + Math.sin(a) * r);
    scene.add(isl);
  }

  // ---------- track ----------
  const asphalt = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
  const decals = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
  const road = new Mesher(), deco = new Mesher();
  const P = (i, lat, y) => { const p = pointAt(track, i, lat); return [p.x, y, p.z]; };
  const ac = [C(0x3b3f48), C(0x41454f)];
  for (let i = 0; i < N; i++) {
    road.quad(P(i, -HALF, 0.1), P(i, HALF, 0.1), P(i + 1, HALF, 0.1), P(i + 1, -HALF, 0.1), ac[(i >> 2) & 1]);
    // centre dashes
    if (i % 6 < 3) deco.quad(P(i, -0.25, 0.14), P(i, 0.25, 0.14), P(i + 1, 0.25, 0.14), P(i + 1, -0.25, 0.14), C(0xdadde2));
    // edge lines
    for (const s of [-1, 1]) {
      deco.quad(P(i, s * (HALF - 0.8), 0.14), P(i, s * (HALF - 0.4), 0.14), P(i + 1, s * (HALF - 0.4), 0.14), P(i + 1, s * (HALF - 0.8), 0.14), C(0xe6e6e6));
    }
    // kerbs
    const kc = (i >> 1) & 1 ? C(0xd8352c) : C(0xf2f2f2);
    deco.quad(P(i, -HALF - 1.4, 0.12), P(i, -HALF, 0.12), P(i + 1, -HALF, 0.12), P(i + 1, -HALF - 1.4, 0.12), kc);
    if (pitLaneWidth(i, N) === 0 && Math.min(mod(i + PIT.pre, N), 999) > PIT.pre + PIT.post) {
      deco.quad(P(i, HALF, 0.12), P(i, HALF + 1.4, 0.12), P(i + 1, HALF + 1.4, 0.12), P(i + 1, HALF, 0.12), kc);
    }
  }
  // pit lane
  const len = PIT.pre + PIT.post;
  for (let k = 0; k < len; k++) {
    const i = mod(k - PIT.pre, N);
    const w0 = pitLaneWidth(i, N), w1 = pitLaneWidth(i + 1, N);
    const i1 = i + 1;
    road.quad(P(i, HALF, 0.1), P(i, HALF + w0, 0.1), P(i1, HALF + w1, 0.1), P(i1, HALF, 0.1), C(0x555a63));
    deco.quad(P(i, HALF + w0 - 0.5, 0.14), P(i, HALF + w0, 0.14), P(i1, HALF + w1, 0.14), P(i1, HALF + w1 - 0.5, 0.14), C(0xf5c542));
  }
  // start/finish checker
  for (let c = 0; c < 12; c++) for (let r = 0; r < 2; r++) {
    const l0 = -HALF + (c * 2 * HALF) / 12, l1 = l0 + (2 * HALF) / 12;
    const i0 = r * 0.6 - 0.6, i1 = i0 + 0.6;
    deco.quad(P(i0, l0, 0.15), P(i0, l1, 0.15), P(i1, l1, 0.15), P(i1, l0, 0.15), (c + r) & 1 ? C(0x15161a) : C(0xffffff));
  }
  const roadMesh = road.mesh(asphalt), decoMesh = deco.mesh(decals);
  scene.add(roadMesh, decoMesh);

  // ---------- gantry with start lights ----------
  const gp = pointAt(track, 3, 0);
  const gantry = new THREE.Group();
  gantry.position.set(gp.x, 0, gp.z); gantry.rotation.y = gp.theta;
  const postM = new THREE.MeshLambertMaterial({ color: 0x4a4f5a });
  for (const s of [-1, 1]) gantry.add(box(1, 10, 1, 0, s * (HALF + 2.5), 5, 0, () => postM));
  gantry.add(box(2 * HALF + 6, 1.6, 1.4, 0, 0, 10, 0, () => postM));
  const lightMats = [];
  for (let i = 0; i < 5; i++) {
    const m = new THREE.MeshBasicMaterial({ color: 0x2a0a0a });
    lightMats.push(m);
    const l = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0.5), m);
    l.position.set(-6 + i * 3, 10, -0.9);
    gantry.add(l);
    const l2 = l.clone(); l2.position.z = 0.9; gantry.add(l2);
  }
  scene.add(gantry);

  // grandstand (left of straight) + garages (right, behind pit lane)
  const stand = new THREE.Group();
  const standMat = new THREE.MeshLambertMaterial({ color: 0x8892a0 });
  for (let t = 0; t < 4; t++) {
    const lat = -(HALF + 12 + t * 3.2);
    const gs = pointAt(track, -22, lat), ge = pointAt(track, 24, lat);
    const sx = (gs.x + ge.x) / 2, sz = (gs.z + ge.z) / 2;
    const b = box(7, 3 + t * 3, 48 * track.ds, 0, sx, (3 + t * 3) / 2, sz, () => standMat);
    b.rotation.y = gp.theta;
    stand.add(b);
  }
  const crowdG = new THREE.BoxGeometry(1.2, 1.2, 1.2);
  const crowd = new THREE.InstancedMesh(crowdG, new THREE.MeshLambertMaterial({ color: 0xffffff }), 360);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 360; i++) {
    const t = i % 4, along = -22 + ((i / 4) | 0) * (46 / 90);
    const p = pointAt(track, along, -(HALF + 12 + t * 3.2));
    dummy.position.set(p.x, 3 + t * 3 + 0.6, p.z); dummy.rotation.y = gp.theta;
    dummy.updateMatrix(); crowd.setMatrixAt(i, dummy.matrix);
    crowd.setColorAt(i, new THREE.Color().setHSL(rand(), 0.7, 0.55));
  }
  stand.add(crowd);
  for (let k = 0; k < 9; k++) {
    const along = -20 + k * 5, lat = HALF + PIT.width + 6;
    const p = pointAt(track, along, lat);
    const r = ROSTER[k];
    const garage = new THREE.Group();
    garage.add(box(10, 4.5, 14, 0, 0, 2.25, 0, () => new THREE.MeshLambertMaterial({ color: 0xc9ced8 })));
    garage.add(box(10.4, 0.6, 14.4, r.color, 0, 4.8, 0, (c) => new THREE.MeshLambertMaterial({ color: c })));
    garage.add(box(0.3, 3, 8, 0x20242c, -5.1, 1.8, 0, () => new THREE.MeshLambertMaterial({ color: 0x20242c })));
    garage.position.set(p.x, 0, p.z); garage.rotation.y = p.theta;
    stand.add(garage);
  }
  scene.add(stand);

  // trees
  const treeCount = 190;
  const foliage = new THREE.InstancedMesh(new THREE.ConeGeometry(3.2, 7, 5), new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true }), treeCount);
  const trunks = new THREE.InstancedMesh(new THREE.BoxGeometry(0.9, 2.4, 0.9), new THREE.MeshLambertMaterial({ color: 0x6b4a2f }), treeCount);
  let placed = 0, tries = 0;
  while (placed < treeCount && tries < 6000) {
    tries++;
    const x = x0 + rand() * (nx * cell), z = z0 + rand() * (nz * cell);
    const d = distToTrack(track, x, z);
    if (d < 26 || d > R0 - 6) continue;
    const s = 0.8 + rand() * 0.9;
    const gy = -0.15 + Math.max(0, Math.min(1, (d - 24) / 14)) * (Math.sin(x * 0.03) * Math.cos(z * 0.025) * 2.2 + 0.4);
    dummy.rotation.set(0, rand() * 6, 0);
    dummy.scale.set(s, s, s);
    dummy.position.set(x, gy + 1.2 * s, z); dummy.updateMatrix(); trunks.setMatrixAt(placed, dummy.matrix);
    dummy.position.set(x, gy + (2.4 + 3.2) * s, z); dummy.updateMatrix(); foliage.setMatrixAt(placed, dummy.matrix);
    foliage.setColorAt(placed, new THREE.Color().setHSL(0.3 + rand() * 0.06, 0.55, 0.28 + rand() * 0.1));
    placed++;
  }
  foliage.count = trunks.count = placed;
  scene.add(foliage, trunks);

  // ---------- cars ----------
  const carMeshes = cars.map((c) => {
    const m = buildCarMesh(c.def, c.isPlayer);
    scene.add(m.group);
    return m;
  });

  // ---------- rain ----------
  const RAIN = 900;
  const rpos = new Float32Array(RAIN * 6);
  const rseed = [];
  for (let i = 0; i < RAIN; i++) rseed.push([rand() * 90 - 45, rand() * 50, rand() * 90 - 45]);
  const rg = new THREE.BufferGeometry();
  rg.setAttribute('position', new THREE.BufferAttribute(rpos, 3));
  const rainLines = new THREE.LineSegments(rg, new THREE.LineBasicMaterial({ color: 0xb8cdf5, transparent: true, opacity: 0.7, fog: false }));
  rainLines.frustumCulled = false; rainLines.visible = false;
  scene.add(rainLines);
  let rainT = 0;

  const asphaltDry = new THREE.Color(1, 1, 1), asphaltWet = new THREE.Color(0.55, 0.6, 0.72);
  const tmp = new THREE.Color();

  return {
    scene, carMeshes, gantry,
    setLights(n, go) {
      lightMats.forEach((m, i) => m.color.setHex(go ? 0x0a2a0a : i < n ? 0xff2a1a : 0x2a0a0a));
    },
    updateCars(race) {
      race.cars.forEach((c, i) => {
        const m = carMeshes[i];
        m.group.position.set(c.x, 0.1, c.z);
        m.group.rotation.y = c.theta;
        m.inner.rotation.z = -c.steer * c.speed * 0.0008;
        m.inner.rotation.y = clamp(Math.atan2(c.vx * Math.cos(c.theta) - c.vz * Math.sin(c.theta), Math.max(c.speed, 1)) * 0.5, -0.3, 0.3);
        const col = c.tire === 'wet' ? 0x3a8bff : 0xffd23f;
        for (const mk of m.marks) mk.material.color.setHex(col);
        if (m.marker) m.marker.rotation.y += 0.05;
      });
    },
    updateWeather(rain, dt, cam) {
      tmp.lerpColors(SKY_DRY, SKY_WET, rain * 0.9);
      scene.background.copy(tmp); scene.fog.color.copy(tmp);
      scene.fog.near = lerp(160, 40, rain); scene.fog.far = lerp(560, 300, rain);
      hemi.intensity = lerp(1.5, 0.9, rain); sun.intensity = lerp(2.2, 0.5, rain);
      asphalt.color.lerpColors(asphaltDry, asphaltWet, rain);
      sea.material.color.setRGB(lerp(0.92, 0.45, rain), lerp(0.95, 0.5, rain), lerp(0.98, 0.58, rain));
      rainLines.visible = rain > 0.02;
      if (!rainLines.visible) return;
      rainT += dt;
      const n = Math.floor(RAIN * rain);
      rg.setDrawRange(0, n * 2);
      for (let i = 0; i < n; i++) {
        const s = rseed[i];
        const y = ((s[1] - rainT * 38) % 50 + 50) % 50;
        const x = cam.position.x + s[0], z = cam.position.z + s[2];
        const o = i * 6;
        rpos[o] = x; rpos[o + 1] = cam.position.y - 12 + y; rpos[o + 2] = z;
        rpos[o + 3] = x - 0.4; rpos[o + 4] = rpos[o + 1] + 2.4; rpos[o + 5] = z;
      }
      rg.attributes.position.needsUpdate = true;
    },
  };
}
