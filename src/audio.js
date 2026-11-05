// WebAudio: engine tone, tiny chiptune loop, beeps. Created lazily on first user gesture.
const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12);
const LEAD = [0, 3, 7, 12, 10, 7, 3, 7, 0, 3, 7, 10, 12, 15, 12, 7];
const BASS = [0, 0, -5, -5, -2, -2, -7, -7];

export class Audio {
  constructor() { this.ctx = null; this.muted = localStorage.getItem('racer-mute') === '1'; this.step = 0; this.music = false; }
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
    this.mg = ctx.createGain(); this.mg.gain.value = 0.12; this.mg.connect(this.master);
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
  /** speed 0..1 fraction of top speed, throttle 0..1 */
  engine(v, vTop, throttle, on) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const gearW = vTop / 6, g = Math.min(5, Math.floor(v / gearW)), rpm = Math.min(1, (v - g * gearW) / gearW + 0.1);
    const f = 55 + g * 6 + rpm * 120 + (v / vTop) * 40;
    this.o1.frequency.setTargetAtTime(f, t, 0.05); this.o2.frequency.setTargetAtTime(f * 0.5, t, 0.05);
    this.ef.frequency.setTargetAtTime(500 + rpm * 900 + throttle * 700, t, 0.08);
    this.eg.gain.setTargetAtTime(on ? 0.1 + throttle * 0.1 : 0, t, 0.1);
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
