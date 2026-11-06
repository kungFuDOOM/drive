import { describe, it, expect } from 'vitest';
import { focusMove, menuPadState, risingEdges } from './menuNav.js';

const row = (y, xs) => xs.map((x) => ({ x, y, w: 40, h: 20 }));

describe('menu focus', () => {
  const rects = [...row(0, [0, 50, 100]), ...row(40, [0, 50])];

  it('moves along a row and stays put at the edge', () => {
    expect(focusMove(rects, 1, 'left')).toBe(0);
    expect(focusMove(rects, 1, 'right')).toBe(2);
    expect(focusMove(rects, 0, 'left')).toBe(0);
    expect(focusMove(rects, 2, 'right')).toBe(2);
  });

  it('moves down to the control under the cursor, not the far one', () => {
    expect(focusMove(rects, 0, 'down')).toBe(3);
    expect(focusMove(rects, 1, 'down')).toBe(4);
    expect(focusMove(rects, 3, 'up')).toBe(0);
    expect(focusMove(rects, 0, 'up')).toBe(0);
  });

  it('rejects a target that is mostly off to the side', () => {
    const rects2 = [
      { x: 0, y: 0, w: 40, h: 20 },
      { x: 0, y: 40, w: 40, h: 20 },
      { x: 400, y: 8, w: 40, h: 20 },
    ];
    expect(focusMove(rects2, 0, 'down')).toBe(1);
    expect(focusMove(rects2, 0, 'right')).toBe(2);
  });

  it('returns -1 when there is nothing to focus', () => {
    expect(focusMove([], 0, 'left')).toBe(-1);
  });
});

describe('menu gamepad', () => {
  const btn = (pressed) => ({ pressed });
  const pad = (axes, buttons) => ({ axes, buttons });

  it('reads the d-pad, the stick past the deadzone, and A / B', () => {
    expect(menuPadState(pad([0, 0], { 14: btn(true), 0: btn(true) }))).toMatchObject({
      left: true, right: false, up: false, down: false, a: true, b: false,
    });
    expect(menuPadState(pad([0.9, 0.8], {}))).toMatchObject({ right: true, down: true, left: false, up: false });
    expect(menuPadState(pad([-0.2, 0.2], {}))).toMatchObject({ left: false, right: false, up: false, down: false });
    expect(menuPadState(null)).toEqual({ left: false, right: false, up: false, down: false, a: false, b: false });
  });

  it('reports only the edges that just went down', () => {
    const idle = { up: false, down: false, left: false, right: false, a: false, b: false };
    expect(risingEdges(idle, { ...idle, a: true, down: true })).toEqual(['down', 'a']);
    expect(risingEdges({ ...idle, a: true }, { ...idle, a: true })).toEqual([]);
  });
});
