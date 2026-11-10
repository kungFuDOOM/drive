// WebAudio: engine tone, tiny chiptune loop, beeps. Created lazily on first user gesture.
const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12);
const LEAD = [0, 3, 7, 12, 10, 7, 3, 7, 0, 3, 7, 10, 12, 15, 12, 7];
const BASS = [0, 0, -5, -5, -2, -2, -7, -7];

const clamp01 = (x) => Math.max(0, Math.min(1, x));
import { tyreScrub } from './feel.js';
export const GEARS = 7;
/** Music bus into the 0.5 master. Silenced while a race is on screen; the phrase (`step`) is not reset. */
export const MUSIC_GAIN = 0.12;
/**
 * Engine bus vs the original mix (0.08 + throttle*0.08 + rpm*0.03). 1.75x: full-throttle peak on `eg`
 * is 0.3325. Saw + square can sum to about 2 before that gain, and the master is 0.5, so the engine
 * still lands near 0.33 at the speakers. Mute zeros the master and is unchanged.
 */
export const ENGINE_LEVEL = 1.75;
const RACE_QUIET = new Set(['racing', 'paused', 'cinematic']);
/** Menus and other non-race screens keep the loop; countdown, driving, pause and the intro do not. */
export function musicForState(state) { return !RACE_QUIET.has(state); }
/**
 * Target for the engine gain node. `cut` is the upshift fuel cut (1 or 0.15). `duck` is voice ducking (0..1).
 * Returns 0 when the engine is off.
 */
export function engineGain(throttle, rpm, cut = 1, duck = 0, on = true) {
  if (!on) return 0;
  const base = (0.08 + clamp01(throttle) * 0.08 + clamp01(rpm) * 0.03) * cut;
  const ducked = duck ? base * (1 - duck * 0.55) : base;
  return Math.max(0, ducked * ENGINE_LEVEL);
}
/**
 * Gear model: 7 gears with shift points at (g+1)/7 of top speed (closer ratios up high). RPM is 0.3..1 across a gear, so it
 * drops on every upshift. `cur` gives downshift hysteresis (down only 6% below the boundary).
 */
export function gearModel(v, vTop, cur = 0) {
  const x = clamp01(Math.max(0, v) / Math.max(1, vTop));
  const edge = (g) => Math.pow((g + 1) / GEARS, 0.85); // upper speed fraction of gear g
  let g = 0;
  while (g < GEARS - 1 && x >= edge(g)) g++;
  if (g < cur && x > edge(cur - 1) - 0.06) g = cur; // hysteresis when braking
  const lo = g ? edge(g - 1) : 0, hi = edge(g);
  const rpm = 0.3 + 0.7 * clamp01((x - lo) / (hi - lo));
  return { gear: g, rpm: g === 0 ? 0.2 + 0.8 * clamp01(x / hi) : rpm };
}

export class Audio {
  constructor() { this.ctx = null; this.muted = localStorage.getItem('racer-mute') === '1'; this.step = 0; this._musicOn = false; }
  /** Background loop. Toggling does not rewind `step` or schedule a second copy; the music bus just opens or closes. */
  get music() { return this._musicOn; }
  set music(on) {
    const next = !!on;
    if (this._musicOn === next) return;
    this._musicOn = next;
    if (this.mg && this.ctx) this.mg.gain.setTargetAtTime(next ? MUSIC_GAIN : 0, this.ctx.currentTime, 0.02);
  }
  init() {
    if (this.ctx) { this.ctx.resume?.(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = (this.ctx = new AC());
    this.master = ctx.createGain(); this.master.gain.value = this.muted ? 0 : 0.5; this.master.connect(ctx.destination);
    // engine
    this.eg = ctx.createGain(); this.eg.gain.value = 0;
    this.ef = ctx.createBiquadFilter(); this.ef.type = 'lowpass'; this.ef.frequency.value = 900;
    this.o1 = ctx.createOscillator(); this.o1.type = 'sawtooth';
    this.o2 = ctx.createOscillator(); this.o2.type = 'square';
    this.o1.connect(this.ef); this.o2.connect(this.ef); this.ef.connect(this.eg); this.eg.connect(this.master);
    this.o1.start(); this.o2.start();
    this._initFx();
    this.mg = ctx.createGain(); this.mg.gain.value = this._musicOn ? MUSIC_GAIN : 0; this.mg.connect(this.master);
    this.nextT = ctx.currentTime + 0.1;
    this.timer = setInterval(() => this._music(), 60);
  }
  setMuted(m) {
    this.muted = m; localStorage.setItem('racer-mute', m ? '1' : '0');
    if (this.master) this.master.gain.setTargetAtTime(m ? 0 : 0.5, this.ctx.currentTime, 0.02);
  }
  _note(freq, t, dur, type, gain) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.mg); o.start(t); o.stop(t + dur + 0.02);
  }
  _music() {
    if (!this.ctx || !this.music) { if (this.ctx) this.nextT = Math.max(this.nextT, this.ctx.currentTime); return; }
    const spb = 60 / 150 / 2;
    while (this.nextT < this.ctx.currentTime + 0.25) {
      const i = this.step++;
      this._note(NOTE(69 + LEAD[i % 16] + (Math.floor(i / 16) % 2 ? 5 : 0)), this.nextT, spb * 0.9, 'square', 0.35);
      if (i % 2 === 0) this._note(NOTE(45 + BASS[(i / 2) % 8 | 0]), this.nextT, spb * 1.8, 'triangle', 0.9);
      this.nextT += spb;
    }
  }
  _noise() {
    const ctx = this.ctx, buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; return src;
  }
  _initFx() {
    const ctx = this.ctx;
    // tyre squeal: band-passed noise
    this.sq = ctx.createGain(); this.sq.gain.value = 0;
    this.sqf = ctx.createBiquadFilter(); this.sqf.type = 'bandpass'; this.sqf.frequency.value = 2100; this.sqf.Q.value = 6;
    this.nz1 = this._noise(); this.nz1.connect(this.sqf); this.sqf.connect(this.sq); this.sq.connect(this.master); this.nz1.start();
    // kerb rumble: low-passed noise chopped by a fast LFO
    this.kr = ctx.createGain(); this.kr.gain.value = 0;
    this.krm = ctx.createGain(); this.krm.gain.value = 0.5;
    this.krl = ctx.createOscillator(); this.krl.type = 'square'; this.krl.frequency.value = 30;
    const lg = ctx.createGain(); lg.gain.value = 0.5; this.krl.connect(lg); lg.connect(this.krm.gain);
    const kf = ctx.createBiquadFilter(); kf.type = 'lowpass'; kf.frequency.value = 260;
    this.nz2 = this._noise(); this.nz2.connect(kf); kf.connect(this.krm); this.krm.connect(this.kr); this.kr.connect(this.master);
    this.nz2.start(); this.krl.start();
    this.gear = 0; this.shiftT = 0; this.rpm = 0.2; this.lastRpm = 0.2; this.audioSmooth = 0; this.scrub = 0;
  }
  /**
   * Engine/tyre/kerb sound for this frame. o: { v, vTop, throttle, brake, lat (0..1 lateral load), kerb (bool), on, boosting }
   */
  drive(o) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime, dtp = Math.max(0.001, o.dt || 1 / 60);
    const m = gearModel(o.v, o.vTop, this.gear);
    if (m.gear > this.gear) { this.shiftT = 0.09; this.shiftBlip(m.gear); }
    this.gear = m.gear;
    this.shiftT = Math.max(0, this.shiftT - dtp);
    const rawRpm = clamp01(m.rpm + (o.throttle > 0.1 ? 0.04 : -0.03));
    this.audioSmooth = Math.min(0.25, (this.audioSmooth || 0) + dtp);
    // 55 ms engine inertia: revs and shifts sound mechanical, not like speedometer zipper noise.

    const rpm = this.rpm + (rawRpm - this.rpm) * (1 - Math.exp(-this.audioSmooth / 0.055));
    this.audioSmooth = 0; this.rpm = rpm;
    const f = 42 + rpm * 168 + (o.boosting ? 8 : 0);
    this.o1.frequency.setTargetAtTime(f, t, 0.03); this.o2.frequency.setTargetAtTime(f * 0.5, t, 0.03);
    this.ef.frequency.setTargetAtTime(450 + rpm * 1100 + o.throttle * 600, t, 0.06);
    const cut = this.shiftT > 0 ? 0.15 : 1; // fuel cut during the shift
    this.eg.gain.setTargetAtTime(engineGain(o.throttle, rpm, cut, this.voiceDuck || 0, o.on), t, this.shiftT > 0 ? 0.01 : 0.08);
    if (!this.sq) return;
    // squeal: hard cornering, tyre scrub (understeer / wheelspin) and especially a locked wheel under braking
    const targetScrub = o.on ? tyreScrub(o.lat || 0, o.slipAngle || 0, Math.max(o.lock || 0, (o.slip || 0) * 0.85)) : 0;
    this.scrub += (targetScrub - this.scrub) * (1 - Math.exp(-dtp / 0.055));
    const squeal = this.scrub;
    this.sq.gain.setTargetAtTime(squeal * squeal * 0.07, t, 0.06);
    this.sqf.frequency.setTargetAtTime(1900 + squeal * 700 + o.v * 3, t, 0.1);
    const k = o.on && o.kerb ? Math.min(1, o.v / 40) : 0;
    this.kr.gain.setTargetAtTime(k * 0.22, t, 0.04);
    this.krl.frequency.setTargetAtTime(14 + o.v * 0.5, t, 0.1);
  }
  /** back-compat wrapper */
  engine(v, vTop, throttle, on) { this.drive({ v, vTop, throttle, brake: 0, lat: 0, kerb: false, on }); }
  /** short upshift "blip" (pitch dip + click) */
  shiftBlip() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'square'; o.frequency.setValueAtTime(260, t); o.frequency.exponentialRampToValueAtTime(110, t + 0.07);
    g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + 0.1);
  }
  beep(freq = 660, dur = 0.15, type = 'square', gain = 0.3) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.02);
  }
  thump() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.2);
    g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + 0.3);
  }
}
