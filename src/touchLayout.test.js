import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const root = basename(process.cwd()) === 'src' ? join(process.cwd(), '..') : process.cwd();
const html = readFileSync(join(root, 'index.html'), 'utf8');
const rule = (sel) => html.split('}').filter((c) => new RegExp('(^|[\\s{])' + sel + ' \\{').test(c + '}'.slice(0, 0) + ' ') || c.includes(sel + ' {')).map((c) => c.slice(c.indexOf('{') + 1)).join(' ');

describe('touch layout', () => {
  it('puts BOOST bottom-left, under the joystick, and GAS/BRK bottom-right', () => {
    const b = rule('#tBoost');
    expect(b).toMatch(/left: calc\(var\(--sa-l\)/);
    expect(b).not.toMatch(/right:/);
    expect(rule('#tGas')).toMatch(/right:/);
    expect(rule('#tBrake')).toMatch(/right:/);
  });
  it('stops the joystick zone above the boost button so they never overlap', () => {
    expect(rule('#joyZone')).toMatch(/bottom: calc\(var\(--sa-b\) \+ 16px \+ var\(--tb\) \* \.8\)/);
  });
  it('keeps every hold button as its own data-hold target (per-pointer tracking)', () => {
    for (const k of ['boost', 'gas', 'brake']) expect(html).toContain(`data-hold="${k}"`);
    const input = readFileSync(join(root, 'src/input.js'), 'utf8');
    expect(input).toMatch(/this\.holds\[k\] = new Set\(\)/);
    expect(input).toMatch(/ids\.add\(e\.pointerId\)/);
  });
});
