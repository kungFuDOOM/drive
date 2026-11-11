// Track path: closed 3D spline with width, elevation, curvature, walls, pit lane data.
// Pure geometry + queries — no rendering. Themes read this to build scenery.
import * as THREE from 'three';
import { wrapDelta, wrapAngle, smoothstep, lerp, clamp } from './physics.js';
import { computeRacingLine } from './racingLine.js';
import { CITADEL } from './tracks/citadel.js';

export const SPACING = 2.5;

const _ix = [0, 0, 0.5]; // reused _idx() result (double array, so writes don't box)

/** Track definition: { id, name, theme, seed?, points:[x,y,z,halfW,runoff][], sections:[{name,a,b,kind?}], pit:{entry,laneStart,laneEnd,exit,speed,boxStart?,boxStep?} }. Defaults to the Citadel Circuit. */
export class Track {
  constructor(def = CITADEL) {
    const CP = def.points, M = CP.length, SECTIONS = def.sections;
    this.def = def; this.id = def.id; this.name = def.name; this.themeId = def.theme; this.seed = def.seed ?? 1;
    const PIT = (this.pit = { boxStart: -60, boxStep: 16, ...def.pit, limit: def.pit.speed });
    const pts = CP.map((c) => new THREE.Vector3(c[0], c[1], c[2]));
    const curve = new THREE.CatmullRomCurve3(pts, true, 'centripetal');
    // dense sampling with fractional control index f
    const SUB = 80, dense = [];
    for (let k = 0; k < M * SUB; k++) {
      const t = k / (M * SUB);
      const p = curve.getPoint(t);
      dense.push({ x: p.x, y: p.y, z: p.z, f: t * M });
    }
    // cumulative horizontal length
    const cum = [0];
    for (let k = 1; k <= dense.length; k++) {
      const a = dense[k - 1], b = dense[k % dense.length];
      cum.push(cum[k - 1] + Math.hypot(b.x - a.x, b.z - a.z));
    }
    const total = cum[dense.length];
    const N = Math.max(16, Math.round(total / SPACING / 16) * 16); // multiple of 16 so colour banding closes cleanly at the loop seam
    this.n = N; this.length = total; this.ds = total / N;
    const px = (this.px = new Float32Array(N)), py = (this.py = new Float32Array(N)), pz = (this.pz = new Float32Array(N));
    const fArr = new Float32Array(N);
    let k = 0;
    for (let i = 0; i < N; i++) {
      const target = i * this.ds;
      while (cum[k + 1] < target) k++;
      const u = (target - cum[k]) / (cum[k + 1] - cum[k]);
      const a = dense[k], b = dense[(k + 1) % dense.length];
      px[i] = lerp(a.x, b.x, u); py[i] = lerp(a.y, b.y, u); pz[i] = lerp(a.z, b.z, u);
      let fb = b.f; if (fb < a.f) fb += M;
      fArr[i] = (lerp(a.f, fb, u)) % M;
    }
    const tx = (this.tx = new Float32Array(N)), tz = (this.tz = new Float32Array(N));
    const nx = (this.nx = new Float32Array(N)), nz = (this.nz = new Float32Array(N));
    const th = (this.theta = new Float32Array(N));
    for (let i = 0; i < N; i++) {
      const a = (i + N - 1) % N, b = (i + 1) % N;
      let dx = px[b] - px[a], dz = pz[b] - pz[a];
      const l = Math.hypot(dx, dz); dx /= l; dz /= l;
      tx[i] = dx; tz[i] = dz; nx[i] = dz; nz[i] = -dx; // left normal
      th[i] = Math.atan2(dx, dz);
    }
    const kap = new Float32Array(N);
    for (let i = 0; i < N; i++) kap[i] = wrapAngle(th[(i + 1) % N] - th[(i + N - 1) % N]) / (2 * this.ds);
    this.kappa = kap;
    this.kappaS = this._smooth(kap, 10);
    this.kappaN = this._smooth(kap, 3);
    // width / runoff / section from control data
    this.half = new Float32Array(N); this.runoff = new Float32Array(N);
    this.section = new Uint8Array(N); this.squeeze = new Uint8Array(N);
    for (let i = 0; i < N; i++) {
      const f = fArr[i], c = Math.floor(f) % M, c2 = (c + 1) % M, u = smoothstep(0, 1, f - Math.floor(f));
      this.half[i] = lerp(CP[c][3], CP[c2][3], u);
      this.runoff[i] = lerp(CP[c][4], CP[c2][4], u);
      this.squeeze[i] = this.runoff[i] < 5 ? 1 : 0;
      let sec = 0;
      for (let q = 0; q < SECTIONS.length; q++) {
        const S = SECTIONS[q];
        const ff = (S.b > M && f < S.a) ? f + M : f;
        if (ff >= S.a && ff < S.b) { sec = q; break; }
      }
      this.section[i] = sec;
    }
    this.sections = SECTIONS.map((s) => s.name);
    // wall limits (distance from centreline); left side has the pit building
    this.leftWall = new Float32Array(N); this.rightWall = new Float32Array(N);
    this.pitTaper = new Float32Array(N);
    this._computeRunoff();
    for (let i = 0; i < N; i++) {
      const u = wrapDelta(i * this.ds, this.length);
      const t = smoothstep(PIT.entry, PIT.laneStart, u) * (1 - smoothstep(PIT.laneEnd, PIT.exit, u));
      this.pitTaper[i] = t;
      this.rightWall[i] = this.half[i] + this.runR[i];
      this.leftWall[i] = lerp(this.half[i] + this.runL[i], this.half[i] + 19, t);
    }
    // Divider between the racing line and the pit lane. 0 = no wall. Otherwise the track-side face
    // (metres, left positive). The nose angles out of the split; the wall ends before the rejoin.
    this.pitWall = new Float32Array(N);
    this.pitWallH = new Float32Array(N);
    const nose0 = PIT.laneStart, nose1 = PIT.laneStart + 18;
    const tail0 = PIT.laneEnd - 28, tail1 = PIT.laneEnd - 6;
    const ease = (t) => { const x = clamp(t, 0, 1); return x * x * (3 - 2 * x); };
    for (let i = 0; i < N; i++) {
      const u = wrapDelta(i * this.ds, this.length);
      if (u < nose0 || u > tail1) continue;
      let lat = 1.15, h = 0.9;
      if (u < nose1) {
        const s = ease((u - nose0) / (nose1 - nose0));
        lat = lerp(2.05, 1.15, s); // short angled nose at the split, clear of the pit path
        h = lerp(0.16, 0.9, s);
      } else if (u > tail0) {
        const s = ease((u - tail0) / (tail1 - tail0));
        h = lerp(0.9, 0.05, s);
        lat = lerp(1.15, 1.8, s);
      }
      if (h < 0.08) continue;
      this.pitWall[i] = this.half[i] + lat;
      this.pitWallH[i] = h;
    }
    // flags
    this.kerb = new Uint8Array(N); this.gravel = new Uint8Array(N);
    for (let i = 0; i < N; i++) {
      const open = !this.squeeze[i];
      this.kerb[i] = open && Math.abs(this.kappaS[i]) > 0.0035 ? 1 : 0;
      this.gravel[i] = this.kerb[i];
    }
    this._computeLine();
    this._loc = { i: 0, s: 0, d: 0 };
  }

  /**
   * Per-side run-off (edge -> wall) clamped on the INSIDE of corners so wall / gravel / kerb offset curves never
   * cross over themselves: offset must stay below the (windowed minimum) turn radius minus a margin.
   * runL / runR are smoothed; left side is the inside when signed curvature > 0.
   */
  _computeRunoff() {
    const N = this.n, W = 9, MARGIN = 2.2, MIN_RUN = 0.8;
    const k = this._smooth(this.kappa, 2);
    const inL = new Float32Array(N).fill(1e4), inR = new Float32Array(N).fill(1e4);
    for (let i = 0; i < N; i++) {
      if (k[i] > 1e-4) inL[i] = 1 / k[i]; else if (k[i] < -1e-4) inR[i] = -1 / k[i];
    }
    const minWin = (a) => { const o = new Float32Array(N); for (let i = 0; i < N; i++) { let m = 1e4; for (let q = -W; q <= W; q++) m = Math.min(m, a[(i + q + N) % N]); o[i] = m; } return o; };
    const mL = minWin(inL), mR = minWin(inR);
    const rl = new Float32Array(N), rr = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      rl[i] = clamp(Math.min(this.runoff[i], mL[i] - MARGIN - this.half[i]), MIN_RUN, this.runoff[i]);
      rr[i] = clamp(Math.min(this.runoff[i], mR[i] - MARGIN - this.half[i]), MIN_RUN, this.runoff[i]);
    }
    // smooth over a window narrower than the min-filter so the result never exceeds the clamp
    this.runL = this._smooth(rl, 5); this.runR = this._smooth(rr, 5);
    for (let i = 0; i < N; i++) { this.runL[i] = Math.min(this.runL[i], this.runoff[i]); this.runR[i] = Math.min(this.runR[i], this.runoff[i]); }
  }
  /** run-off beyond the edge on the side of lateral offset d (left positive) at sample i */
  runAt(i, d) { return d >= 0 ? this.runL[i] : this.runR[i]; }
  _smooth(arr, w) {
    const N = this.n, out = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      let s = 0;
      for (let k = -w; k <= w; k++) s += arr[(i + k + N) % N];
      out[i] = s / (2 * w + 1);
    }
    return out;
  }
  /** Racing line: geometric minimum-curvature offsets (racingLine.js), cached per track geometry. `line` = lateral offset, `lineK` = path curvature of that line. */
  _computeLine() {
    const l = computeRacingLine(this);
    this.line = l.d; this.lineK = l.kappa;
  }

  // ---- queries ----
  sectionName(i) { return this.sections[this.section[i]]; }
  /** Nearest-sample Frenet lookup around a hint index. Writes into out. */
  locate(x, z, hint, out = this._loc, win = 40) {
    const N = this.n, px = this.px, pz = this.pz;
    let best = 1e18, bi = hint;
    const lo = win < 0 ? 0 : -win, hi = win < 0 ? N - 1 : win;
    for (let k = lo; k <= hi; k++) {
      const i = (hint + k + N) % N;
      const dx = x - px[i], dz = z - pz[i];
      const d2 = dx * dx + dz * dz;
      if (d2 < best) { best = d2; bi = i; }
    }
    const dx = x - px[bi], dz = z - pz[bi];
    out.i = bi;
    out.s = (((bi * this.ds + dx * this.tx[bi] + dz * this.tz[bi]) % this.length) + this.length) % this.length;
    out.d = dx * this.nx[bi] + dz * this.nz[bi];
    return out;
  }
  locateGlobal(x, z, out = this._loc) { return this.locate(x, z, 0, out, -1); }
  /** [i, i+1, u] for path distance s. Returns a shared array, overwritten by the next call: read it immediately, don't store it. */
  _idx(s) {
    s = ((s % this.length) + this.length) % this.length;
    const f = s / this.ds, i = Math.floor(f) % this.n;
    _ix[0] = i; _ix[1] = (i + 1) % this.n; _ix[2] = f - Math.floor(f);
    return _ix;
  }
  /** Per-sample array value interpolated at path distance s. */
  _lerpAt(arr, s) { const ix = this._idx(s); return lerp(arr[ix[0]], arr[ix[1]], ix[2]); }
  yAt(s) { return this._lerpAt(this.py, s); }
  /** road camber (rad, + = right side lower). The circuit is flat across the width, so this is 0; cars/props read it so banking can be added in one place. */
  bankAt(s) { return 0; }
  slopeAt(s) { return (this.yAt(s + 3) - this.yAt(s - 3)) / 6; }
  halfAt(s) { return this._lerpAt(this.half, s); }
  thetaAt(s) {
    const ix = this._idx(s), a = ix[0], b = ix[1], u = ix[2];
    return this.theta[a] + wrapAngle(this.theta[b] - this.theta[a]) * u;
  }
  lineAt(s) { return this._lerpAt(this.line, s); }
  lineKappaAt(s) { return this._lerpAt(this.lineK, s); }
  kappaAt(s) { return this._lerpAt(this.kappa, s); }
  /** World point at path distance s, lateral offset d (left positive). */
  at(s, d = 0, out = new THREE.Vector3()) {
    const ix = this._idx(s), a = ix[0], b = ix[1], u = ix[2];
    const nx = lerp(this.nx[a], this.nx[b], u), nz = lerp(this.nz[a], this.nz[b], u);
    const l = Math.hypot(nx, nz) || 1;
    out.set(lerp(this.px[a], this.px[b], u) + (nx / l) * d, lerp(this.py[a], this.py[b], u), lerp(this.pz[a], this.pz[b], u) + (nz / l) * d);
    return out;
  }
  /** Surface type at sample i, lateral offset d. */
  surfaceAt(i, d) {
    const a = Math.abs(d), hw = this.half[i];
    const t = this.pitTaper[i];
    if (d > 0 && t > 0.02 && a <= hw + 16 * t) return a <= hw ? 'asphalt' : 'pit';
    if (a <= hw) return 'asphalt';
    if (this.squeeze[i] && a <= hw + this.runAt(i, d) + 0.05) return 'asphalt'; // walled squeeze: the wall sits at the edge, nothing to run onto
    if (this.kerb[i] && a <= hw + 1.4) return 'kerb';
    if (this.gravel[i] && a <= hw + this.runAt(i, d) + 0.5) return 'gravel';
    return 'grass';
  }
  /**
   * Distance from (x,z) to the nearest point OUTSIDE-of-corridor boundary over ALL samples: min_i(dist_i - wall_i(side)).
   * Negative = inside some sample's road+run-off corridor. Used for prop placement (any prop must sit at >= its radius).
   */
  clearance(x, z) {
    const N = this.n; let best = 1e9;
    for (let i = 0; i < N; i++) {
      const dx = x - this.px[i], dz = z - this.pz[i];
      const lat = dx * this.nx[i] + dz * this.nz[i];
      const corr = lat >= 0 ? this.leftWall[i] : this.rightWall[i];
      const d = Math.hypot(dx, dz) - corr;
      if (d < best) best = d;
    }
    return best;
  }
  /** Pit-lane geometry in lateral offset terms. */
  laneD(i) { return this.half[i] + 4.5; }
  boxD(i) { return this.half[i] + 11.5; }
  boxU(team) { return this.pit.boxStart + team * this.pit.boxStep; }
}

const PIT_WALL_THICK = 0.42;
const PIT_WALL_BODY = 0.9;

/**
 * Keep a car on whichever side of the pit divider it already occupies. No-op when the car
 * is clear of the wall (racing line, pit lane, and the angled nose). Does not emit a hit:
 * a deep overlap only trims speed, so a graze cannot stall a car or inflate car-to-car contact.
 */
export function pushOffPitWall(track, car) {
  const face = track.pitWall[car.idx];
  if (!(face > 0)) return;
  const lo = face, hi = face + PIT_WALL_THICK;
  if (car.d + PIT_WALL_BODY <= lo || car.d - PIT_WALL_BODY >= hi) return;
  const trackPush = (lo - PIT_WALL_BODY) - car.d;
  const pitPush = (hi + PIT_WALL_BODY) - car.d;
  const push = -trackPush < pitPush ? trackPush : pitPush;
  const i = car.idx;
  car.d += push;
  car.x += track.nx[i] * push;
  car.z += track.nz[i] * push;
  if (Math.abs(push) > 0.2) car.v *= 0.94;
}
