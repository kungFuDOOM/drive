import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'main.js'), 'utf8');

function fnBody(name) {
  const header = src.match(new RegExp(`function ${name}\\([\\s\\S]*?\\)\\s*\\{`));
  expect(header, `${name} missing`).toBeTruthy();
  const start = header.index + header[0].length;
  let i = start, depth = 1;
  while (i < src.length && depth) {
    const c = src[i++];
    if (c === '{') depth++;
    else if (c === '}') depth--;
  }
  return src.slice(start, i - 1);
}

describe('voice caption / clip cleanup hotfixes', () => {
  it('showMenu hides the lingering caption after stopAll (cancelIntro(true) is silent)', () => {
    const body = fnBody('showMenu');
    expect(body).toMatch(/voice\.stopAll\(\)/);
    expect(body).toMatch(/hideVoiceCaption\(\)/);
    expect(body).toMatch(/cancelIntro\(true\)/);
  });

  it('startRace stops in-flight clips before building the next race/intro', () => {
    const body = fnBody('startRace');
    const stopAt = body.indexOf('voice.stopAll()');
    const directorAt = body.indexOf('director.stop()');
    const hideAt = body.indexOf('hideVoiceCaption()');
    const captionResetAt = body.search(/captionUntil\s*=\s*0/);
    expect(stopAt).toBeGreaterThanOrEqual(0);
    expect(directorAt).toBeGreaterThanOrEqual(0);
    expect(hideAt).toBeGreaterThanOrEqual(0);
    expect(captionResetAt).toBeGreaterThanOrEqual(0);
    expect(stopAt).toBeLessThan(hideAt);
    expect(stopAt).toBeLessThan(body.indexOf('beginIntro'));
  });
});
