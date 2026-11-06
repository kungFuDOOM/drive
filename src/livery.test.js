import { describe, it, expect } from 'vitest';
import {
  PATTERNS, PATTERN_IDS, NAME_MAX, createEditor, editEditor, editorTeam, sanitizeName, sanitizeTeam, teamFromCustom,
} from './livery.js';
import { bodyGeometry, styleOf, numberOf } from './cars.js';

const sum = (team) => {
  const g = bodyGeometry('gp', team, 0);
  const c = g.attributes.color.array;
  const p = g.attributes.position.array;
  let s = 0;
  for (let i = 0; i < c.length; i += 3) s += (c[i] * 3 + c[i + 1] * 5 + c[i + 2] * 7) * (1 + (p[i] || 0));
  return Math.round(s * 10) + ':' + g.attributes.position.count;
};

describe('livery editor', () => {
  it('offers original pattern presets and ignores unknown ones', () => {
    expect(PATTERN_IDS).toEqual(['stripes', 'chevrons', 'split', 'fade', 'flash', 'hoops', 'checker']);
    expect(new Set(PATTERNS.map((p) => p.style)).size).toBe(PATTERNS.length);
    const e = createEditor({ name: 'Northline Racing', driver: 'Casey Morrow', pattern: 'hoops', c1: 0x112233, c2: 0xaabbcc, c3: 0x010203, number: 17 });
    const kept = editEditor(e, { pattern: 'ferrari', c1: 'not-a-color', number: 500, name: '<b>x</b>', driver: 'A' });
    expect(kept.pattern).toBe('hoops');
    expect(kept.c1).toBe(0x112233);
    expect(kept.number).toBe(17);
    expect(kept.name).toBe('Northline Racing');
    expect(kept.driver).toBe('Casey Morrow');
  });

  it('sanitises names, caps length, and re-derives the tag when the name changes', () => {
    const e = createEditor({ name: 'Ember Works', driver: 'Casey Morrow', number: 1 });
    const next = editEditor(e, { name: '  Gale   Force!! <script> ', driver: 'Rio Santos', pattern: 'checker', c1: '#00ff88', c2: 0x111111, c3: '#ffffff', number: '23' });
    expect(next.name).toBe('Gale Force!!');
    expect(next.driver).toBe('Rio Santos');
    expect(next.tag).toBe('GFL');
    expect(next.pattern).toBe('checker');
    expect(next.c1).toBe(0x00ff88);
    expect(next.c3).toBe(0xffffff);
    expect(next.number).toBe(23);
    expect([...next.name].length).toBeLessThanOrEqual(NAME_MAX);
    const long = editEditor(next, { name: 'AbcdefghijklmnopqrSTUVWXYZ' });
    expect([...long.name].length).toBe(NAME_MAX);
    expect(sanitizeName('<<<>>>')).toBe(null);
    expect(sanitizeTeam({ name: 'No' }).name).toBe('Privateer Racing');
  });

  it('every preset and the race number change the car the preview builds', () => {
    const base = createEditor({ name: 'Northline Racing', driver: 'Casey Morrow', c1: 0xe8472a, c2: 0x00aaff, c3: 0x111111, number: 17 });
    const paints = PATTERNS.map((p) => sum(editorTeam(editEditor(base, { pattern: p.id }))));
    expect(new Set(paints).size).toBe(PATTERNS.length);
    const a = editorTeam(editEditor(base, { number: 17, pattern: 'chevrons' }));
    const b = editorTeam(editEditor(base, { number: 42, pattern: 'chevrons' }));
    expect(numberOf(a, 0)).toBe(17);
    expect(numberOf(b, 0)).toBe(42);
    expect(styleOf(a, 0)).toBe('chevron');
    expect(sum(a)).not.toBe(sum(b));
    const built = teamFromCustom({ name: a.name, livery: a.livery });
    expect(built.c1).toBe(a.c1);
    expect(built.custom).toBe(true);
  });
});
