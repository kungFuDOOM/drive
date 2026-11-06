import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BroadcastAudio } from './broadcastAudio.js';

const node = (kind) => ({ kind, connections: [], connect(to) { this.connections.push(to); }, disconnect() {}, gain: { value: 1, setTargetAtTime: vi.fn() }, frequency: { value: 0 }, Q: { value: 0 }, playbackRate: { value: 1 } });
function fixture() {
  const c = {
    currentTime: 10, sampleRate: 44100, destination: node('dest'),
    createGain: () => node('gain'), createOscillator: () => Object.assign(node('osc'), { start: vi.fn(), stop: vi.fn(), type: '' }),
    createBiquadFilter: () => Object.assign(node('bandpass'), { type: '' }),
    createBuffer: (_ch, length) => ({ getChannelData: () => new Float32Array(length) }),
    createBufferSource: () => Object.assign(node('source'), { start: vi.fn(), stop: vi.fn(), buffer: null }),
    decodeAudioData: async (bytes) => ({ duration: 2, bytes }),
    resume: vi.fn(() => Promise.resolve()),
  };
  const engine = {
    ctx: null, music: false,
    init() { if (this.ctx) return; this.ctx = c; this.master = node('master'); this.eg = this.mg = node('fx'); this.nextT = 0; this.timer = 0; },
  };
  const fetchClip = vi.fn(async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(4096) }));
  const vo = new BroadcastAudio(engine, { fetchClip });
  return { c, engine, fetchClip, vo };
}
const cue = { id: 'radio_box_box', channel: 'engineer', speaker: 'PIT WALL', caption: 'BOX BOX' };

describe('bundled Web Audio engine integration', () => {
  it('lazily initializes at first gesture, unlocks, and routes radio through bandpass plus master gain', async () => {
    const { c, vo } = fixture(); expect(c.resume).not.toHaveBeenCalled();
    vo.setSettings({ voiceVolume: 0.4, voiceMuted: false });
    await vo.unlock(); expect(c.resume).toHaveBeenCalled();
    const started = vi.fn(), ended = vi.fn(), play = vo.play(cue, { onStart: started, onEnd: ended });
    expect(vo.isPlaying('engineer')).toBe(true); expect(await play).toBe(true);
    expect(vo.radio.type).toBe('bandpass');
    expect(vo.mix.connections).toContain(vo.engine.master);
    expect(started).toHaveBeenCalledWith(cue, 2);
    const src = vo.active.engineer.source; src.onended();
    expect(ended).toHaveBeenCalledWith(cue, true); expect(vo.isPlaying('engineer')).toBe(false);
    // Tune the actual bus, not an independent master that would ignore the game's mute.
    expect(vo.mix.gain.setTargetAtTime).toHaveBeenCalledWith(.4 * .95, 10, .025);
  });

  it('drops voice gain with zero/mute, still allowing captions to be driven externally', () => {
    const { c, vo } = fixture(); vo.setSettings({ voiceVolume: 0, voiceMuted: true }); vo.init();
    expect(vo.mix.gain.setTargetAtTime).toHaveBeenLastCalledWith(0, c.currentTime, .025);
    expect(vo.radio.frequency.value).toBeGreaterThan(900);
  });

  it('uses the production /drive/ path even when the tool runs against Vite dev at root', async () => {
    const { vo, fetchClip } = fixture();
    await vo.play({ ...cue, channel: 'announcer', id: 'announcer_intro' });
    expect(fetchClip).toHaveBeenCalledWith('/drive/audio/vo/announcer_intro.mp3');
    expect(vo.url('a')).toBe('/drive/audio/vo/a.mp3');
  });

  it('reserves a busy channel while decoding, skips on stop, and resolves failures to caption-only', async () => {
    const { vo } = fixture();
    const ended = vi.fn();
    const playing = vo.play(cue, { onEnd: ended });
    expect(vo.isPlaying('engineer')).toBe(true); vo.stop('engineer'); await playing;
    expect(vo.isPlaying('engineer')).toBe(false);
    const fetchClip = vi.fn(async () => ({ ok: false }));
    const second = fixture();
    const fallback = new BroadcastAudio(second.engine, { fetchClip });
    expect(await fallback.play(cue)).toBe(false);
    expect(fallback.degraded).toBe(true);
  });
});
