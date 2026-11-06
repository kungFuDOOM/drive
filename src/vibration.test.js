import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { defaultSave, loadSave, persist, SAVE_KEY } from './progress.js';

const root = dirname(fileURLToPath(import.meta.url));
const mainSrc = readFileSync(join(root, 'main.js'), 'utf8');
const html = readFileSync(join(root, '..', 'index.html'), 'utf8');

function mem() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
  };
}

describe('vibration setting', () => {
  it('menu has a VIBE On/Off control defaulting to Off in markup', () => {
    expect(html).toMatch(/id="optVibe"/);
    expect(html).toMatch(/id="optVibe"[\s\S]*?data-v="on"[\s\S]*?data-v="off"/);
    // Off button selected by default
    expect(html).toMatch(/id="optVibe"[\s\S]*?class="[^"]*\bsel\b[^"]*"[^>]*data-v="off"/);
  });

  it('raceFeel only vibrates when opts.vibration is on', () => {
    const idx = mainSrc.indexOf('function raceFeel');
    expect(idx).toBeGreaterThanOrEqual(0);
    const body = mainSrc.slice(idx, mainSrc.indexOf('\nfunction ', idx + 10));
    expect(body).toMatch(/opts\.vibration\s*&&\s*typeof navigator\.vibrate/);
    expect(body).toMatch(/navigator\.vibrate\(pattern\)/);
  });

  it('defaults Off and persists through save.settings', () => {
    expect(mainSrc).toMatch(/vibration:\s*false/);
    expect(mainSrc).toMatch(/opts\.vibration\s*=\s*!!opts\.vibration/);
    expect(mainSrc).toMatch(/vibration:\s*!!opts\.vibration/);

    const store = mem();
    const save = defaultSave();
    expect(save.settings?.vibration).toBeUndefined();
    save.settings = { vibration: false };
    persist(store, save);
    const loaded = loadSave(store);
    expect(loaded.settings.vibration).toBe(false);
    loaded.settings.vibration = true;
    persist(store, loaded);
    expect(JSON.parse(store.getItem(SAVE_KEY)).settings.vibration).toBe(true);
  });
});
