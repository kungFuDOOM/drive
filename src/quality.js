// Adaptive quality with hysteresis: drop one level after 3 s continuously < 45 fps, raise one after 10 s continuously > 58 fps.
export class QualityGovernor {
  constructor({ level = 2, min = 0, max = 2, lowFps = 45, highFps = 58, lowSecs = 3, highSecs = 10 } = {}) {
    Object.assign(this, { level, min, max, lowFps, highFps, lowSecs, highSecs });
    this.lowT = 0; this.highT = 0; this.fps = 60;
  }
  /** feed one frame; `smoothedFps` is the smoothed fps estimate. Returns new level if changed, else null. */
  update(dt, smoothedFps) {
    this.fps = smoothedFps;
    this.lowT = smoothedFps < this.lowFps ? this.lowT + dt : 0;
    this.highT = smoothedFps > this.highFps ? this.highT + dt : 0;
    if (this.lowT >= this.lowSecs && this.level > this.min) { this.level--; this.lowT = this.highT = 0; return this.level; }
    if (this.highT >= this.highSecs && this.level < this.max) { this.level++; this.lowT = this.highT = 0; return this.level; }
    if (this.lowT >= this.lowSecs) this.lowT = 0;
    if (this.highT >= this.highSecs) this.highT = 0;
    return null;
  }
}
