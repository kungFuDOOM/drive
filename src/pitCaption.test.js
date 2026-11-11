import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(process.cwd(), 'src');
const css = readFileSync(join(root, 'front.css'), 'utf8');
const main = readFileSync(join(root, 'main.js'), 'utf8');

describe('pit box tire picker vs commentator captions', () => {
  it('never lets the caption or its children take a click', () => {
    expect(css).toMatch(/#voiceCaption,\s*#voiceCaption \* \{\s*pointer-events:\s*none;\s*\}/);
  });

  it('parks captions at the top while the pit box is open, including touch and portrait', () => {
    expect(css).toMatch(/body\.pit-box #voiceCaption,\s*body\.touch\.pit-box #voiceCaption \{\s*top: calc\(var\(--sa-t\) \+ 11 \* var\(--fs\)\);\s*bottom: auto;/);
    expect(css).toMatch(/@media \(max-aspect-ratio: 1\/1\) \{[\s\S]*?body\.pit-box #voiceCaption,\s*body\.touch\.pit-box #voiceCaption \{\s*top: auto;\s*bottom: calc\(var\(--sa-b\) \+ var\(--tb\) \* 1\.8 \+ 34px\);/);
    expect(css).toMatch(/body\.broadcast-has-pit\.pit-box #voiceCaption \{\s*top: calc\(var\(--sa-t\) \+ 9 \* var\(--fs\)\);\s*bottom: auto;/);
  });

  it('toggles the pit-box class from the same stage that shows the tire picker', () => {
    expect(main).toMatch(/bc\.classList\.toggle\('hidden', !p\.pit\.stage\);\s*document\.body\.classList\.toggle\('pit-box', !!p\.pit\.stage\);/);
    expect(main).toMatch(/function showMenu\(\) \{[\s\S]*?document\.body\.classList\.remove\('pit-box'\)/);
    expect(main).toMatch(/function showOnly\(id\) \{[\s\S]*?document\.body\.classList\.remove\('pit-box'\)/);
    expect(main).toMatch(/function showResults\(\) \{[\s\S]*?document\.body\.classList\.remove\('pit-box'\)/);
  });
});
