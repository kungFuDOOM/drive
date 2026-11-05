// Keyboard, gamepad and touch input -> { steer, throttle, brake, boost } + one-shot actions.
export class Input {
  constructor(root = document) {
    this.keys = new Set();
    this.touch = { left: false, right: false, gas: false, brake: false, boost: false };
    this.actions = []; // queued one-shots: 'camera','autopilot','mute','pit','tire:dry','tire:wet','pause'
    this.padPrev = [];
    this.out = { steer: 0, throttle: 0, brake: 0, boost: false };
    const GAME_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'];
    addEventListener('keydown', (e) => {
      if (e.repeat) return;
      this.keys.add(e.code);
      if (GAME_KEYS.includes(e.code)) e.preventDefault();
      const map = { KeyC: 'camera', KeyT: 'autopilot', KeyM: 'mute', KeyP: 'pit', Digit1: 'tire:dry', Digit2: 'tire:wet', Escape: 'pause' };
      if (map[e.code]) this.actions.push(map[e.code]);
    });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    addEventListener('blur', () => { this.keys.clear(); for (const k in this.touch) this.touch[k] = false; });
    // touch buttons: elements with data-hold="left|right|gas|brake|boost"
    root.querySelectorAll('[data-hold]').forEach((el) => {
      const k = el.dataset.hold;
      const set = (v) => (e) => { e.preventDefault(); this.touch[k] = v; el.classList.toggle('down', v); };
      el.addEventListener('pointerdown', (e) => { el.setPointerCapture?.(e.pointerId); set(true)(e); });
      for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) el.addEventListener(t, set(false));
      el.addEventListener('contextmenu', (e) => e.preventDefault());
    });
  }
  poll() {
    const k = this.keys, t = this.touch, o = this.out;
    let steer = (k.has('ArrowRight') || k.has('KeyD') ? 1 : 0) - (k.has('ArrowLeft') || k.has('KeyA') ? 1 : 0);
    steer += (t.right ? 1 : 0) - (t.left ? 1 : 0);
    let throttle = k.has('ArrowUp') || k.has('KeyW') || t.gas ? 1 : 0;
    let brake = k.has('ArrowDown') || k.has('KeyS') || t.brake ? 1 : 0;
    let boost = k.has('ShiftLeft') || k.has('ShiftRight') || k.has('KeyB') || t.boost;
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const p of pads) {
      if (!p || !p.connected) continue;
      const ax = p.axes[0] || 0;
      if (Math.abs(ax) > 0.12) steer += ax;
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
