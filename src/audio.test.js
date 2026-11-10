import { describe, it, expect, afterEach } from 'vitest';
import { gearModel, GEARS, engineGain, musicForState, ENGINE_LEVEL, MUSIC_GAIN, Audio } from './audio.js';

describe('gear model', () => {
  it('has 7 gears, rpm rises within a gear and drops on upshift', () => {
    let gear = 0, prev = gearModel(0, 90, 0), drops = 0, maxG = 0;
    for (let v = 0; v <= 90; v += 0.1) {
      const m = gearModel(v, 90, gear);
      if (m.gear > gear) { expect(m.rpm).toBeLessThan(prev.rpm - 0.2); drops++; }
      gear = m.gear; maxG = Math.max(maxG, gear); prev = m;
      expect(m.rpm).toBeGreaterThanOrEqual(0.19); expect(m.rpm).toBeLessThanOrEqual(1);
    }
    expect(maxG).toBe(GEARS - 1); expect(drops).toBe(GEARS - 1);
  });
});

describe('engine loudness', () => {
  const oldFull = 0.08 + 0.08 + 0.03; // throttle 1, rpm 1, before ENGINE_LEVEL
  it('is 1.75x the old mix and stays under the 0.5 master with both oscillators', () => {
    expect(ENGINE_LEVEL).toBe(1.75);
    expect(engineGain(1, 1)).toBeCloseTo(oldFull * 1.75);
    expect(engineGain(0, 0)).toBeCloseTo(0.08 * 1.75);
    // saw + square can add before eg; master is 0.5
    expect(engineGain(1, 1) * 2 * 0.5).toBeLessThan(1);
  });
  it('is silent when off, and still ducks for the radio and the upshift cut', () => {
    expect(engineGain(1, 1, 1, 0, false)).toBe(0);
    expect(engineGain(1, 1, 0.15)).toBeCloseTo(oldFull * 0.15 * ENGINE_LEVEL);
    expect(engineGain(1, 1, 1, 1)).toBeCloseTo(oldFull * (1 - 0.55) * ENGINE_LEVEL);
  });
});

describe('music during a race', () => {
  it('plays on menus and results, and is off for the intro, countdown, driving and pause', () => {
    for (const s of ['menu', 'results', 'career', 'standings', 'editor', 'upgrades', 'recruit']) expect(musicForState(s)).toBe(true);
    for (const s of ['racing', 'paused', 'cinematic']) expect(musicForState(s)).toBe(false);
  });
});

describe('music bus', () => {
  const timers = [];
  afterEach(() => { for (const t of timers) clearInterval(t); timers.length = 0; });

  function install() {
    const gain = () => ({ gain: { value: 0, calls: 0, setTargetAtTime(v) { this.value = v; this.calls++; }, setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} });
    const osc = () => ({ type: '', frequency: { value: 0, setTargetAtTime() {}, setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, start() {}, stop() {} });
    const ctx = {
      currentTime: 1, sampleRate: 8000, destination: {},
      createGain: gain,
      createBiquadFilter: () => ({ type: '', frequency: { value: 0, setTargetAtTime() {} }, Q: { value: 0 }, connect() {} }),
      createOscillator: osc,
      createBuffer: (ch, n) => ({ getChannelData: () => new Float32Array(n) }),
      createBufferSource: () => ({ buffer: null, loop: false, connect() {}, start() {} }),
    };
    globalThis.localStorage = { getItem: () => null, setItem() {} };
    if (!globalThis.window) globalThis.window = globalThis;
    window.AudioContext = function AudioContext() { return ctx; };
    window.webkitAudioContext = window.AudioContext;
    const a = new Audio();
    a.init();
    timers.push(a.timer);
    return a;
  }

  it('closes the music bus without rewinding, and opening it again does not schedule a second copy', () => {
    const a = install();
    expect(a.music).toBe(false);
    expect(a.mg.gain.value).toBe(0);
    a.step = 11;
    a.music = true;
    expect(a.music).toBe(true);
    expect(a.mg.gain.value).toBe(MUSIC_GAIN);
    expect(a.step).toBe(11);
    const calls = a.mg.gain.calls;
    a.music = true;
    expect(a.mg.gain.calls).toBe(calls);
    expect(a.step).toBe(11);
    a.ctx.currentTime = 8;
    a.nextT = 0;
    a._music();
    const stepped = a.step;
    expect(stepped).toBeGreaterThan(11);
    a.music = false;
    expect(a.mg.gain.value).toBe(0);
    expect(a.step).toBe(stepped);
    a._music();
    expect(a.step).toBe(stepped);
    expect(a.nextT).toBeGreaterThanOrEqual(8);
    a.music = true;
    expect(a.step).toBe(stepped);
    expect(a.mg.gain.value).toBe(MUSIC_GAIN);
  });
});
