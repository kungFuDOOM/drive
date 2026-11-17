import { describe, it, expect } from 'vitest';
import { readPad, PAD } from './input.js';

const snap = (pressed = {}, values = {}, axes = [0, 0]) => ({
  axes,
  buttons: Array.from({ length: 17 }, (_, i) => ({ pressed: !!pressed[i] || (values[i] ?? 0) > 0.5, value: values[i] ?? (pressed[i] ? 1 : 0) })),
});

describe('xbox driving layout', () => {
  it('RT gas and LB boost work at the same time', () => {
    const o = readPad(snap({ 4: true }, { 7: 0.8 }));
    expect(o.throttle).toBeCloseTo(0.8); expect(o.boost).toBe(true);
  });
  it('boost on LB, LS click and D-pad down; never on A/B/X/Y/RB', () => {
    for (const i of [4, 10, 13]) expect(readPad(snap({ [i]: true })).boost).toBe(true);
    for (const i of [0, 1, 2, 3, 5]) expect(readPad(snap({ [i]: true }))).toMatchObject({ boost: false, throttle: 0, brake: 0 });
  });
  it('LT is analog brake, trigger deadzone ignores noise, stick and D-pad steer', () => {
    expect(readPad(snap({}, { 6: 0.5 })).brake).toBeCloseTo(0.5);
    expect(readPad(snap({}, { 7: 0.03, 6: 0.03 }))).toMatchObject({ throttle: 0, brake: 0 });
    expect(readPad(snap({}, {}, [0.9, 0])).steer).toBeGreaterThan(0.5);
    expect(readPad(snap({ [PAD.left]: true })).steer).toBe(-1);
  });
});
