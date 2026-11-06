import { JOY, joystickSteer, clampKnob } from './joystick.js';
import { remapStick } from './feel.js';
// Keyboard, gamepad and touch input -> { steer, throttle, brake, boost } + one-shot actions.
export class Input {
  constructor(root = document) {
    this.keys = new Set();
    this.touch = { gas: false, brake: false, boost: false };
    this.actions = []; // queued one-shots: 'camera','autopilot','mute','pit','tire:dry','tire:wet','pause'
    this.padPrev = [];
    this.out = { steer: 0, throttle: 0, brake: 0, boost: false };
    const GAME_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'];
    const typing = () => {
      const el = document.activeElement;
      return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
    };
    addEventListener('keydown', (e) => {
      if (typing()) return;
      if (e.repeat) return;
      this.keys.add(e.code);
      if (GAME_KEYS.includes(e.code)) e.preventDefault();
      const map = { KeyC: 'camera', KeyT: 'autopilot', KeyM: 'mute', KeyP: 'pit', Digit1: 'tire:dry', Digit2: 'tire:wet', Escape: 'pause' };
      if (map[e.code]) this.actions.push(map[e.code]);
    });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    this.touch.steer = 0; // analog (floating joystick), -1..1
    this.holds = {};      // data-hold name -> Set of active pointerIds (each finger tracked separately)
    this.joyPointer = null;
    const releaseAll = () => {
      this.keys.clear();
      for (const k in this.touch) this.touch[k] = k === 'steer' ? 0 : false;
      for (const k in this.holds) this.holds[k].clear();
      root.querySelectorAll('[data-hold].down').forEach((el) => el.classList.remove('down'));
      this.joyPointer = null; this.joyHide?.();
    };
    this.releaseAll = releaseAll;
    addEventListener('blur', releaseAll);
    document.addEventListener('visibilitychange', () => { if (document.hidden) releaseAll(); });
    addEventListener('pagehide', releaseAll);

    // ---- iOS double-tap / pinch / gesture suppression ----
    const stop = (e) => e.preventDefault();
    for (const t of ['dblclick', 'gesturestart', 'gesturechange', 'gestureend']) document.addEventListener(t, stop, { passive: false });
    let lastEnd = 0;
    document.addEventListener('touchend', (e) => { const n = performance.now(); if (n - lastEnd < 350) e.preventDefault(); lastEnd = n; }, { passive: false });
    document.addEventListener('touchmove', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });
    document.addEventListener('contextmenu', (e) => { if (e.target.closest?.('#hud')) e.preventDefault(); });
    // swallow the synthetic click that follows a handled tap (never double fire touch+click)
    document.addEventListener('click', (e) => {
      if (e.target.closest?.('[data-tap]') && (e.detail !== 0 || performance.now() - this.lastTap < 600)) { e.preventDefault(); e.stopImmediatePropagation(); }
    }, true);
    this.lastTap = -1e9;

    // ---- hold buttons (GAS/BRK/BOOST): Pointer Events, one pointerId per finger ----
    root.querySelectorAll('[data-hold]').forEach((el) => {
      const k = el.dataset.hold, ids = (this.holds[k] = new Set());
      const sync = () => { const v = ids.size > 0; this.touch[k] = v; el.classList.toggle('down', v); };
      el.addEventListener('pointerdown', (e) => { e.preventDefault(); try { el.setPointerCapture(e.pointerId); } catch { /* synthetic */ } ids.add(e.pointerId); sync(); });
      for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) el.addEventListener(t, (e) => { ids.delete(e.pointerId); sync(); });
      el.addEventListener('contextmenu', (e) => e.preventDefault());
    });

    // ---- floating joystick: left ~45% of the screen, horizontal drag -> analog steer ----
    const zone = root.getElementById?.('joyZone') ?? root.querySelector('#joyZone');
    const base = root.querySelector('#joyBase'), knob = root.querySelector('#joyKnob');
    if (zone && base && knob) {
      let ox = 0, oy = 0;
      this.joyHide = () => { base.classList.remove('on'); knob.style.transform = 'translate(-50%,-50%)'; this.touch.steer = 0; };
      const move = (e) => {
        const [kx, ky] = clampKnob(e.clientX - ox, e.clientY - oy, JOY.radius);
        knob.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;
        this.touch.steer = joystickSteer(e.clientX - ox);
      };
      zone.addEventListener('pointerdown', (e) => {
        if (this.joyPointer !== null) return;
        e.preventDefault();
        try { zone.setPointerCapture(e.pointerId); } catch { /* synthetic */ }
        this.joyPointer = e.pointerId;
        const r = zone.getBoundingClientRect();
        ox = Math.max(r.left + JOY.radius + 6, Math.min(r.right - JOY.radius - 6, e.clientX));
        oy = Math.max(JOY.radius + 6, Math.min(innerHeight - JOY.radius - 6, e.clientY));
        base.style.left = ox + 'px'; base.style.top = oy + 'px';
        base.classList.add('on'); move(e);
      });
      zone.addEventListener('pointermove', (e) => { if (e.pointerId === this.joyPointer) move(e); });
      const end = (e) => { if (e.pointerId !== this.joyPointer) return; this.joyPointer = null; this.joyHide(); };
      for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) zone.addEventListener(t, end);
    }
  }
  /** Bind a one-tap action on pointerup (single handler; the synthetic click is swallowed). Keyboard activation (click detail 0) still works. */
  onTap(el, fn) {
    if (!el) return;
    el.dataset.tap = '1';
    let down = false;
    el.addEventListener('pointerdown', (e) => { down = true; e.stopPropagation(); });
    el.addEventListener('pointercancel', () => { down = false; });
    el.addEventListener('pointerleave', () => { down = false; });
    el.addEventListener('pointerup', (e) => { if (!down) return; down = false; e.preventDefault(); e.stopPropagation(); this.lastTap = performance.now(); fn(e); });
    el.addEventListener('click', (e) => { if (e.detail === 0 && performance.now() - this.lastTap > 600) fn(e); });
  }
  poll() {
    const k = this.keys, t = this.touch, o = this.out;
    let steer = (k.has('ArrowRight') || k.has('KeyD') ? 1 : 0) - (k.has('ArrowLeft') || k.has('KeyA') ? 1 : 0);
    steer += t.steer || 0;
    let throttle = k.has('ArrowUp') || k.has('KeyW') || t.gas ? 1 : 0;
    let brake = k.has('ArrowDown') || k.has('KeyS') || t.brake ? 1 : 0;
    let boost = k.has('ShiftLeft') || k.has('ShiftRight') || k.has('KeyB') || t.boost;
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const p of pads) {
      if (!p || !p.connected) continue;
      const ax = p.axes[0] || 0;
      steer += remapStick(ax);
      if (p.buttons[14]?.pressed) steer -= 1;
      if (p.buttons[15]?.pressed) steer += 1;
      throttle = Math.max(throttle, p.buttons[7]?.value || 0, p.buttons[0]?.pressed ? 1 : 0);
      brake = Math.max(brake, p.buttons[6]?.value || 0, p.buttons[1]?.pressed ? 1 : 0);
      boost = boost || !!(p.buttons[5]?.pressed || p.buttons[2]?.pressed);
      const prev = this.padPrev[p.index] || [];
      const edge = (i, name) => { if (p.buttons[i]?.pressed && !prev[i]) this.actions.push(name); };
      edge(3, 'camera'); edge(4, 'pit'); edge(8, 'autopilot'); edge(9, 'pause');
      this.padPrev[p.index] = p.buttons.map((b) => b.pressed);
    }
    o.steer = Math.max(-1, Math.min(1, steer)); o.throttle = throttle; o.brake = brake; o.boost = boost;
    return o;
  }
  takeActions() { const a = this.actions; this.actions = []; return a; }
}
