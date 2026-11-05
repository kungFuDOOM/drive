// Tiny WebAudio chiptune engine + beeps.
export function createAudio() {
  let ctx = null, master = null, eng = null, engGain = null, muted = false;
  try { muted = localStorage.getItem('skyloop-mute') === '1'; } catch { /* ignore */ }

  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return true; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.5;
    master.connect(ctx.destination);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = 900;
    engGain = ctx.createGain(); engGain.gain.value = 0;
    eng = ctx.createOscillator(); eng.type = 'sawtooth'; eng.frequency.value = 60;
    const eng2 = ctx.createOscillator(); eng2.type = 'square'; eng2.frequency.value = 30;
    const g2 = ctx.createGain(); g2.gain.value = 0.5;
    eng.connect(lp); eng2.connect(g2); g2.connect(lp); lp.connect(engGain); engGain.connect(master);
    eng.start(); eng2.start();
    eng._second = eng2;
    return true;
  }
  function beep(freq, dur = 0.12, type = 'square', vol = 0.18, when = 0) {
    if (!ensure()) return;
    const t = ctx.currentTime + when;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
  }
  const seq = (notes, step = 0.1, type = 'square') => notes.forEach((f, i) => beep(f, step * 1.4, type, 0.16, i * step));
  return {
    unlock: ensure,
    get muted() { return muted; },
    setMuted(m) {
      muted = m;
      try { localStorage.setItem('skyloop-mute', m ? '1' : '0'); } catch { /* ignore */ }
      if (master) master.gain.value = m ? 0 : 0.5;
    },
    engine(speedFrac, on) {
      if (!ctx || !eng) return;
      const t = ctx.currentTime;
      const f = 55 + speedFrac * 170;
      eng.frequency.setTargetAtTime(f, t, 0.05);
      eng._second.frequency.setTargetAtTime(f / 2, t, 0.05);
      engGain.gain.setTargetAtTime(on ? 0.07 + speedFrac * 0.06 : 0, t, 0.1);
    },
    light() { beep(440, 0.15); },
    go() { beep(880, 0.5, 'square', 0.2); },
    lap() { seq([523, 659, 784], 0.08); },
    pit() { seq([330, 440], 0.09, 'triangle'); },
    bump() { beep(90, 0.12, 'sawtooth', 0.2); },
    finish() { seq([523, 659, 784, 1047, 784, 1047], 0.11); },
    rain() { seq([392, 330, 262], 0.14, 'triangle'); },
    click() { beep(660, 0.05); },
  };
}
