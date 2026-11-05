// Keyboard + gamepad + touch input aggregation.
export function createInput(root, handlers) {
  const keys = new Set();
  const touch = { left: new Set(), right: new Set(), gas: new Set(), brake: new Set() };
  const padPrev = {};

  const KEYMAP = {
    ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
    ArrowUp: 'gas', KeyW: 'gas', ArrowDown: 'brake', KeyS: 'brake', Space: 'gas',
  };
  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const a = KEYMAP[e.code];
    if (a) { keys.add(a); if (!(e.target instanceof HTMLButtonElement)) e.preventDefault(); }
    if (!e.repeat) handlers.key?.(e);
  });
  addEventListener('keyup', (e) => { const a = KEYMAP[e.code]; if (a) keys.delete(a); });
  addEventListener('blur', () => { keys.clear(); for (const k in touch) touch[k].clear(); });

  root.querySelectorAll('[data-act]').forEach((el) => {
    const set = touch[el.dataset.act];
    const down = (e) => { e.preventDefault(); set.add(e.pointerId); el.classList.add('down'); try { el.setPointerCapture(e.pointerId); } catch { /* ignore */ } handlers.touch?.(); };
    const up = (e) => { set.delete(e.pointerId); if (!set.size) el.classList.remove('down'); };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('lostpointercapture', up);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  });

  function pad() {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const p of pads) {
      if (!p) continue;
      const ax = Math.abs(p.axes[0]) > 0.15 ? p.axes[0] : 0;
      const dpad = (p.buttons[15]?.pressed ? 1 : 0) - (p.buttons[14]?.pressed ? 1 : 0);
      const edge = (i, name) => {
        const d = !!p.buttons[i]?.pressed;
        if (d && !padPrev[name]) handlers.pad?.(name);
        padPrev[name] = d;
      };
      edge(3, 'cam'); edge(2, 'auto'); edge(9, 'start'); edge(8, 'mute'); edge(4, 'pitDry'); edge(5, 'pitWet');
      return {
        steer: ax || dpad,
        gas: Math.max(p.buttons[7]?.value || 0, p.buttons[0]?.pressed ? 1 : 0),
        brake: Math.max(p.buttons[6]?.value || 0, p.buttons[1]?.pressed ? 1 : 0),
      };
    }
    return null;
  }

  return {
    read() {
      const l = keys.has('left') || touch.left.size > 0, r = keys.has('right') || touch.right.size > 0;
      const g = pad();
      let steer = (r ? 1 : 0) - (l ? 1 : 0);
      let gas = keys.has('gas') || touch.gas.size > 0 ? 1 : 0;
      let brake = keys.has('brake') || touch.brake.size > 0 ? 1 : 0;
      if (g) { if (Math.abs(g.steer) > Math.abs(steer)) steer = g.steer; gas = Math.max(gas, g.gas); brake = Math.max(brake, g.brake); }
      return { steer, gas, brake };
    },
  };
}
