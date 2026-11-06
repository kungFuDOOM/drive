import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const root = basename(process.cwd()) === 'src' ? process.cwd() : join(process.cwd(), 'src');
const css = readFileSync(join(root, 'front.css'), 'utf8');

describe('responsive race setup layout', () => {
  it('restores the portrait track-above-settings stack after the v10 selector', () => {
    expect(css).toMatch(/@media \(max-aspect-ratio: 1\/1\)[^{]*\{[\s\S]*?#menu \.stage:has\(\.broadcast-row\)[^{]*\{\s*grid-template-columns: minmax\(0, 1fr\);\s*grid-template-rows: 148px minmax\(0, 1fr\)/);
  });

  it('allows settings and their row wrappers to vertically touch-scroll', () => {
    expect(css).toMatch(/#menu \.settings\.race-settings,\s*#menu \.settings\.race-settings \* \{ touch-action: pan-y; \}/);
    expect(css).toMatch(/#menu \.settings\.race-settings #voiceLevel \{ touch-action: pan-y; \}/);
  });

  it('uses shrinkable grid tracks rather than fixed sidebar widths', () => {
    expect(css).toMatch(/#menu \.stage:has\(\.broadcast-row\) \{\s*grid-template-columns: minmax\(0, 1fr\) minmax\(0, 1\.2fr\)/);
    expect(css).toMatch(/#menu \.tmeta \{ flex: 1 1 0; \}/);
  });

  it('keeps the long locked-class label and compact secondary audio caption', () => {
    expect(css).toMatch(/#menu #clsSpeedway \{ flex: 1 1 138px; min-width: 146px/);
    expect(css).toMatch(/#menu \.broadcast-short \{ display: none; \}/);
  });
});
