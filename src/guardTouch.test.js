import { describe, it, expect } from 'vitest';
import { guardTouch } from './input.js';

describe('guardTouch', () => {
  it('cancels touchstart and touchend with non-passive listeners, only when cancelable', () => {
    const on = {};
    guardTouch({ addEventListener: (t, fn, opts) => { on[t] = { fn, opts }; } });
    expect(Object.keys(on)).toEqual(['touchstart', 'touchend']);
    for (const { fn, opts } of Object.values(on)) {
      expect(opts).toEqual({ passive: false });
      let n = 0;
      fn({ cancelable: true, preventDefault: () => n++ });
      fn({ cancelable: false, preventDefault: () => n++ });
      expect(n).toBe(1);
    }
  });
});
