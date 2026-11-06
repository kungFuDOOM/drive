// Web Audio adapter for the bundled, pre-rendered VO. This file contains no API key or provider endpoint.
export class BroadcastAudio {
  constructor(engine, { fetchClip = (...args) => fetch(...args), baseUrl = '/drive/' } = {}) {
    this.engine = engine;
    this.locationHost = typeof location !== 'undefined' ? location.host : '';
    this.baseUrl = baseUrl || (this.locationHost.startsWith('127.0.0.1:4177') ? '/' : '/drive/');
    this.fetchClip = fetchClip;
    this.volume = 0.75; this.muted = false;
    this.cache = new Map(); this.pending = new Map(); this.channelPending = { announcer: 0, engineer: 0 }; this.active = { announcer: null, engineer: null };
    this.generation = { announcer: 0, engineer: 0 };
    this.reserved = { announcer: false, engineer: false };
    this.degraded = false; this.enabled = true;
  }

  init() {
    this.engine.init();
    const ctx = this.engine.ctx;
    if (!ctx) return false;
    if (this.ctx === ctx) { ctx.resume?.(); this.setSettings({ voiceVolume: this.volume, voiceMuted: this.muted }); return true; }
    this.ctx = ctx;
    this.mix = ctx.createGain();
    this.mix.gain.value = this.muted ? 0 : this.volume * 0.95;
    // The existing master is shared with engine/SFX; its mute affects voice too.
    this.mix.connect(this.engine.master);
    this.setSettings({ voiceVolume: this.volume, voiceMuted: this.muted });
    this.radio = ctx.createBiquadFilter(); this.radio.type = 'bandpass'; this.radio.frequency.value = 1450; this.radio.Q.value = 0.55;
    this.radioTrim = ctx.createGain(); this.radioTrim.gain.value = 1.35;
    this.radio.connect(this.radioTrim); this.radioTrim.connect(this.mix);
    return true;
  }

  unlock() {
    if (!this.init()) return Promise.resolve(false);
    // Silent one-frame buffer, useful to complete iOS' gesture unlock on older Safari.
    try {
      const buffer = this.ctx.createBuffer(1, 1, this.ctx.sampleRate), src = this.ctx.createBufferSource();
      src.buffer = buffer; src.connect(this.mix); src.start(0);
    } catch { /* the normal context resume is still available */ }
    return this.ctx.resume?.() || Promise.resolve();
  }

  setSettings({ voiceVolume = 0.75, voiceMuted = false } = {}) {
    this.volume = Math.max(0, Math.min(1, Number(voiceVolume) || 0));
    this.muted = !!voiceMuted;
    if (this.mix && this.ctx) this.mix.gain.setTargetAtTime(this.muted ? 0 : this.volume * 0.95, this.ctx.currentTime, 0.025);
  }

  url(id) {
    const base = this.baseUrl;
    return `${base.endsWith('/') ? base : base + '/'}audio/vo/${id}.mp3`;
  }

  async load(id) {
    if (this.cache.has(id)) return this.cache.get(id);
    if (this.pending.has(id)) return this.pending.get(id);
    const job = (async () => {
      let response = await this.fetchClip(this.url(id));
      if (!response.ok && this.baseUrl !== '/' && typeof window !== 'undefined') {
        // The development copy of this same box can serve public/ at the root.
        const local = `${location.protocol}//${location.host}/audio/vo/${id}.mp3`;
        response = await this.fetchClip(local);
      }
      if (!response.ok) throw new Error('Clip unavailable');
      const data = await response.arrayBuffer();
      const buffer = await this.ctx.decodeAudioData(data);
      this.cache.set(id, buffer); return buffer;
    })().finally(() => this.pending.delete(id));
    this.pending.set(id, job); return job;
  }

  /**
   * Audio errors deliberately resolve false, never reject the game loop.
   * The caption is already rendered by the caller, so failure is accessible and silent.
   */
  async play(cue, { onStart, onEnd } = {}) {
    if (!this.enabled) { onEnd?.(cue, false); return false; }
    if (!this.init()) { this.degraded = true; onEnd?.(cue, false); return false; }
    const channel = cue.channel;
    this.stop(channel);
    const generation = this.generation[channel];
    this.reserved[channel] = true;
    this.channelPending[channel]++;
    try {
      const buffer = await this.load(cue.id);
      if (generation !== this.generation[channel]) return false;
      const source = this.ctx.createBufferSource(); source.buffer = buffer;
      if (channel === 'engineer') {
        source.connect(this.radio);
        source.playbackRate.value = 1.01;
        this.squelch();
      } else source.connect(this.mix);
      const active = { generation, source, onEnd, cue, stopped: false };
      this.active[channel] = active;
      this.engine.voiceDuck = 0.45;
      source.onended = () => this.finish(channel, active, true);
      source.start();
      this.degraded = false; onStart?.(cue, buffer.duration);
      return true;
    } catch {
      if (generation === this.generation[channel]) {
        this.reserved[channel] = false;
        this.onCancel?.(channel);
        this.degraded = true;
        onEnd?.(cue, false);
      }
      return false;
    }
  }

  squelch() {
    const c = this.ctx, buffer = c.createBuffer(1, Math.ceil(c.sampleRate * 0.065), c.sampleRate), d = buffer.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / d.length * 9) * 0.055;
    const src = c.createBufferSource(), gain = c.createGain(); src.buffer = buffer;
    src.connect(this.radio); src.connect(gain); gain.gain.value = 0.45; gain.connect(this.mix); src.start();
  }

  finish(channel, active, played) {
    if (this.active[channel] !== active || active.stopped) return;
    this.active[channel] = null;
    this.channelPending[channel] = 0;
    this.reserved[channel] = false;
    if (!this.active.announcer && !this.active.engineer) this.engine.voiceDuck = 0;
    try { active.source.disconnect(); } catch { /* already disconnected */ }
    active.onEnd?.(active.cue, played);
  }

  stop(channel) {
    this.generation[channel]++;
    const old = this.active[channel];
    if (old) {
      old.stopped = true; this.active[channel] = null;
    this.channelPending[channel] = 0;
    this.reserved[channel] = false;
    if (!this.active.announcer && !this.active.engineer) this.engine.voiceDuck = 0;
      try { old.source.onended = null; old.source.stop(); old.source.disconnect(); } catch { /* stopped */ }
      old.onEnd?.(old.cue, false);
    } else {
      this.channelPending[channel] = 0;
      this.reserved[channel] = false;
      // Decoding can still be in flight; invalidate it, and release the director's reserve.
      this.onCancel?.(channel);
    }
  }

  stopAll() { this.stop('announcer'); this.stop('engineer'); }
  isPlaying(channel) { return !!(this.reserved[channel] || this.channelPending[channel]); }
}
