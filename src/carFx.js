// Cheap car effects, all pooled in typed arrays (no per-frame allocation, deterministic - no Math.random):
//  * particles: dust (grass / gravel), lock-up tyre smoke   -> ONE THREE.Points draw call for the whole field
//  * skid marks: ring buffer of quads on the asphalt written while the front tyres are locked -> ONE mesh
// The simulation state (car.lockup, car.wheelSlip, car.surface, ...) decides what is emitted; this module only draws.
import * as THREE from 'three';
import { WHEEL_POS } from './cars.js';

export const MAX_PARTICLES = 384;
export const MAX_MARKS = 320;

/** deterministic 0..1 hash of two integers */
export function hash01(a, b) {
  let h = (Math.imul(a | 0, 0x27d4eb2d) ^ Math.imul((b | 0) + 0x165667b1, 0x85ebca6b)) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d) >>> 0; h ^= h >>> 12;
  return ((h >>> 0) % 65536) / 65536;
}

const SURF = {
  grass: { r: 0.45, g: 0.36, b: 0.22, a: 0.5, rate: 0.35, life: 0.9, up: 1.6, size: 1 },
  gravel: { r: 0.62, g: 0.5, b: 0.34, a: 0.55, rate: 0.5, life: 1.1, up: 2.2, size: 1 },
};

// world x / z of wheel hub h ([x left, z fwd]) for a pose r with sin / cos of its heading; module-level (emitCar used to build 2 closures per car per frame)
const hubX = (r, cs, sn, h) => r.x + cs * h[0] + sn * h[1];
const hubZ = (r, cs, sn, h) => r.z - sn * h[0] + cs * h[1];

export class CarFx {
  constructor(maxParticles = MAX_PARTICLES, maxMarks = MAX_MARKS) {
    this.max = maxParticles; this.next = 0; this.counter = 0;
    this.px = new Float32Array(maxParticles * 3);
    this.vel = new Float32Array(maxParticles * 3);
    this.life = new Float32Array(maxParticles);
    this.life0 = new Float32Array(maxParticles);
    this.a0 = new Float32Array(maxParticles);
    this.col = new Float32Array(maxParticles * 4);
    for (let i = 0; i < maxParticles; i++) this.px[i * 3 + 1] = -1000;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.px, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('color', new THREE.BufferAttribute(this.col, 4).setUsage(THREE.DynamicDrawUsage));
    this.points = new THREE.Points(g, new THREE.PointsMaterial({ size: 1.0, vertexColors: true, transparent: true, depthWrite: false, sizeAttenuation: true, fog: false }));
    this.points.frustumCulled = false; this.points.renderOrder = 4; this.points.name = 'tyre-fx';
    // skid marks
    this.maxMarks = maxMarks; this.mnext = 0; this.mCount = 0;
    this.mpos = new Float32Array(maxMarks * 4 * 3);
    const mg = new THREE.BufferGeometry();
    mg.setAttribute('position', new THREE.BufferAttribute(this.mpos, 3).setUsage(THREE.DynamicDrawUsage));
    const idx = new Uint16Array(maxMarks * 6);
    for (let i = 0; i < maxMarks; i++) idx.set([i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3], i * 6);
    mg.setIndex(new THREE.BufferAttribute(idx, 1));
    this.marks = new THREE.Mesh(mg, new THREE.MeshBasicMaterial({ color: 0x0c0c0e, transparent: true, opacity: 0.55, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6, side: THREE.DoubleSide, fog: false }));
    this.marks.frustumCulled = false; this.marks.renderOrder = 1; this.marks.name = 'skid-marks';
    this.markDirty = false;
  }
  get group() { return this; }
  addTo(scene) { scene.add(this.marks); scene.add(this.points); }
  removeFrom(scene) { scene.remove(this.marks); scene.remove(this.points); }

  /** spawn one particle (ring buffer: oldest is recycled) */
  emit(x, y, z, vx, vy, vz, life, r, g, b, a) {
    const i = this.next; this.next = (this.next + 1) % this.max;
    const o = i * 3;
    this.px[o] = x; this.px[o + 1] = y; this.px[o + 2] = z;
    this.vel[o] = vx; this.vel[o + 1] = vy; this.vel[o + 2] = vz;
    this.life[i] = life; this.life0[i] = life; this.a0[i] = a;
    this.col[i * 4] = r; this.col[i * 4 + 1] = g; this.col[i * 4 + 2] = b; this.col[i * 4 + 3] = a;
    return i;
  }
  /** advance all particles by dt (s) */
  update(dt) {
    const n = this.max, drag = Math.exp(-2.2 * dt); // same for every particle: computed once per update
    for (let i = 0; i < n; i++) {
      const L = this.life[i];
      if (L <= 0) continue;
      const o = i * 3, nl = L - dt;
      if (nl <= 0) { this.life[i] = 0; this.px[o + 1] = -1000; this.col[i * 4 + 3] = 0; continue; }
      this.life[i] = nl;
      this.vel[o] *= drag; this.vel[o + 2] *= drag; this.vel[o + 1] = this.vel[o + 1] * drag + 0.7 * dt; // smoke rises slowly
      this.px[o] += this.vel[o] * dt; this.px[o + 1] += this.vel[o + 1] * dt; this.px[o + 2] += this.vel[o + 2] * dt;
      const t = nl / this.life0[i];
      this.col[i * 4 + 3] = this.a0[i] * t * Math.min(1, (1 - t) * 8 + 0.2);
    }
    const g = this.points.geometry;
    g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true;
    if (this.markDirty) { this.marks.geometry.attributes.position.needsUpdate = true; this.markDirty = false; }
  }
  /** number of live particles (tests) */
  alive() { let k = 0; for (let i = 0; i < this.max; i++) if (this.life[i] > 0) k++; return k; }

  /** append one skid quad between two wheel-centre points (a -> b) with half width w, at height y */
  mark(ax, az, bx, bz, y, w) {
    const dx = bx - ax, dz = bz - az, l = Math.hypot(dx, dz);
    if (l < 1e-4) return;
    const nx = (-dz / l) * w, nz = (dx / l) * w, o = this.mnext * 12;
    const p = this.mpos;
    p[o] = ax + nx; p[o + 1] = y; p[o + 2] = az + nz; p[o + 3] = ax - nx; p[o + 4] = y; p[o + 5] = az - nz;
    p[o + 6] = bx - nx; p[o + 7] = y; p[o + 8] = bz - nz; p[o + 9] = bx + nx; p[o + 10] = y; p[o + 11] = bz + nz;
    this.mnext = (this.mnext + 1) % this.maxMarks; this.mCount = Math.min(this.maxMarks, this.mCount + 1); this.markDirty = true;
  }
  clear() {
    this.life.fill(0); this.px.fill(0); for (let i = 0; i < this.max; i++) this.px[i * 3 + 1] = -1000; this.col.fill(0);
    this.mpos.fill(0); this.mnext = 0; this.mCount = 0; this.markDirty = true;
  }

  /**
   * Emit this frame's effects for one car. c = game car (v, surface, lockup, wheelSlip, wheelspin, flat, id), r = interpolated render pose
   * ({x,y,z,theta}), dt = render frame time. Per-car fractional emit counters live on `m.anim` (deterministic).
   */
  emitCar(c, m, r, dt, cls = 'gp') {
    if (dt <= 0 || m.ghost) return;
    const a = m.anim, hub = WHEEL_POS[cls === 'speedway' ? 'speedway' : 'gp'];
    const st = SURF[c.surface], v = Math.abs(c.v);
    const sn = Math.sin(r.theta), cs = Math.cos(r.theta);
    // dust: rear wheels, grass / gravel
    if (st && v > 5) {
      a.fxDust = (a.fxDust || 0) + dt * st.rate * Math.min(60, v * 1.2);
      while (a.fxDust >= 1) {
        a.fxDust -= 1; this.counter++;
        const w = 2 + (this.counter & 1), h1 = hash01(this.counter, c.id), h2 = hash01(this.counter + 17, c.id);
        this.emit(hubX(r, cs, sn, hub[w]) + (h1 - 0.5) * 0.4, r.y + 0.15, hubZ(r, cs, sn, hub[w]) + (h2 - 0.5) * 0.4, -sn * v * 0.12 + (h1 - 0.5) * 2.5, st.up * (0.5 + h2), -cs * v * 0.12 + (h2 - 0.5) * 2.5, st.life * (0.7 + 0.6 * h1), st.r, st.g, st.b, st.a);
      }
    }
    // lock-up smoke from the front tyres + understeer scrub; no wheelspin puffs (launch is clean)
    const lock = c.lockup || 0, scrub = Math.max(0, (c.wheelSlip || 0) - 0.45) * (v > 20 ? 1 : 0);
    const smoke = Math.max(lock, scrub * 0.5);
    if (smoke > 0.25 && !st) {
      a.fxSmoke = (a.fxSmoke || 0) + dt * (8 + 40 * smoke);
      while (a.fxSmoke >= 1) {
        a.fxSmoke -= 1; this.counter++;
        const w = this.counter & 1, h1 = hash01(this.counter, c.id + 3), h2 = hash01(this.counter + 5, c.id + 3);
        this.emit(hubX(r, cs, sn, hub[w]), r.y + 0.2, hubZ(r, cs, sn, hub[w]), -sn * v * 0.06 + (h1 - 0.5) * 1.4, 0.5 + h2 * 1.4, -cs * v * 0.06 + (h2 - 0.5) * 1.4, 0.35 + 0.35 * h1, 0.45, 0.45, 0.47, 0.32 * Math.min(1, 0.4 + smoke));
      }
    }
    // skid marks: front tyres locked on tarmac
    if (lock > 0.3 && c.surface !== 'grass' && c.surface !== 'gravel') {
      for (let w = 0; w < 2; w++) {
        const x = hubX(r, cs, sn, hub[w]), z = hubZ(r, cs, sn, hub[w]);
        if (a.lastMark && a.lastMark[w * 2] !== undefined && Math.hypot(x - a.lastMark[w * 2], z - a.lastMark[w * 2 + 1]) < 4) {
          if (Math.hypot(x - a.lastMark[w * 2], z - a.lastMark[w * 2 + 1]) > 0.6) { this.mark(a.lastMark[w * 2], a.lastMark[w * 2 + 1], x, z, r.y + 0.05, 0.13); a.lastMark[w * 2] = x; a.lastMark[w * 2 + 1] = z; }
        } else { (a.lastMark || (a.lastMark = [undefined, undefined, undefined, undefined]))[w * 2] = x; a.lastMark[w * 2 + 1] = z; }
      }
    } else if (a.lastMark) a.lastMark[0] = a.lastMark[2] = undefined;
  }
}
