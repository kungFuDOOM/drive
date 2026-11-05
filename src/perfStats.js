// Frame-time statistics + shadow-map cadence. Pure (no DOM / three), so both are unit-tested.

/** Rolling frame-time window (ring buffer, no per-frame allocation). Times in ms. */
export class FrameStats {
  constructor(size = 240) { this.buf = new Float32Array(size); this.n = 0; this.i = 0; this.spikes = 0; this.total = 0; this.heapUp = 0; this.heapFrames = 0; this._heap = -1; this._sorted = new Float32Array(size); }
  /** record one frame (ms). `heapBytes` (optional, Chrome only) feeds the allocation indicator. */
  add(ms, heapBytes = -1) {
    const avg = this.n ? this.mean() : ms;
    if (this.n >= 30 && ms > avg * 1.75 && ms > 20) this.spikes++;
    this.buf[this.i] = ms; this.i = (this.i + 1) % this.buf.length; if (this.n < this.buf.length) this.n++;
    this.total++;
    if (heapBytes >= 0) {
      if (this._heap >= 0 && heapBytes > this._heap) this.heapUp += heapBytes - this._heap; // growth only: GC drops are ignored
      if (this._heap >= 0) this.heapFrames++;
      this._heap = heapBytes;
    }
  }
  mean() { let s = 0; for (let k = 0; k < this.n; k++) s += this.buf[k]; return this.n ? s / this.n : 0; }
  /** p in 0..1 (nearest rank) */
  percentile(p) {
    const n = this.n; if (!n) return 0;
    const a = this._sorted; for (let k = 0; k < n; k++) a[k] = this.buf[k];
    const v = a.subarray(0, n).sort();
    return v[Math.min(n - 1, Math.floor(p * n))];
  }
  reset() { this.n = 0; this.i = 0; this.spikes = 0; this.total = 0; this.heapUp = 0; this.heapFrames = 0; this._heap = -1; }
  snapshot() {
    const avg = this.mean();
    return {
      frames: this.n, avgMs: +avg.toFixed(2), p95Ms: +this.percentile(0.95).toFixed(2), maxMs: +this.percentile(1).toFixed(2),
      fps: avg ? +(1000 / avg).toFixed(1) : 0, spikes: this.spikes,
      // JS heap growth per frame (bytes); -1 when the browser has no performance.memory (Safari / Firefox)
      allocBytesPerFrame: this.heapFrames ? Math.round(this.heapUp / this.heapFrames) : -1,
    };
  }
}

/**
 * Shadow-map cadence: the shadow pass is a full extra scene render, and shadows are never needed faster than 60 Hz
 * (the physics rate). On 90/120 Hz displays this renders it every other frame. Frozen frames stay consistent because three keeps
 * the shadow matrix of the last rendered map.
 */
export class ShadowCadence {
  constructor(interval = 1 / 60, slack = 0.0025) { this.interval = interval; this.slack = slack; this.t = Infinity; }
  /** @param dt seconds since the last frame; returns true when the shadow map should be re-rendered this frame */
  due(dt) {
    this.t += dt;
    if (this.t >= this.interval - this.slack) { this.t = Number.isFinite(this.t) ? Math.min(this.t - this.interval, this.interval) : 0; return true; } // carry the remainder: ~60 Hz on average at any refresh rate
    return false;
  }
  force() { this.t = Infinity; }
}
