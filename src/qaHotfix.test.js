import { describe, it, expect } from 'vitest';
import { GHOST_KEY } from './progress.js';
import { ghostStorageKey, loadGhost, saveGhost } from './ghostStore.js';
import { esc } from './html.js';
import { liveBoardEntries, liveBoardHtml, resultsTableRows, championMessage } from './liveBoard.js';
import { formatTime } from './timing.js';

function mem() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    raw: m,
  };
}

function car(tag, c1, isPlayer = false) {
  return { isPlayer, team: { tag, c1 } };
}

describe('ghost keyed by track + class', () => {
  it('isolates ghosts per track; legacy class-only keys are ignored', () => {
    const store = mem();
    const cache = {};
    const ghostA = { frames: [1], track: 'citadel' };
    const ghostB = { frames: [2], track: 'highpine' };

    saveGhost(store, cache, 'citadel', 'gp', ghostA);
    expect(store.getItem(ghostStorageKey('citadel', 'gp'))).toBeTruthy();
    expect(loadGhost(store, cache, 'citadel', 'gp')).toEqual(ghostA);

    // same class, different track → no ghost
    const cache2 = {};
    expect(loadGhost(store, cache2, 'highpine', 'gp')).toBeNull();

    saveGhost(store, cache2, 'highpine', 'gp', ghostB);
    expect(loadGhost(store, {}, 'highpine', 'gp')).toEqual(ghostB);
    expect(loadGhost(store, {}, 'citadel', 'gp')).toEqual(ghostA);

    // legacy class-only key must not leak onto another circuit
    store.setItem(GHOST_KEY + ':gp', JSON.stringify({ frames: [99], legacy: true }));
    expect(loadGhost(store, {}, 'lampwick', 'gp')).toBeNull();
    expect(loadGhost(store, {}, 'citadel', 'gp')).toEqual(ghostA);
  });
});

describe('live board rows have no gap', () => {
  const field = Array.from({ length: 10 }, (_, i) => car('T' + i, 0xff0000 + i, i === 7));

  it('lists every place from P1 through the player when near the front', () => {
    // player in P3 (index 2)
    const order = field.map((c, i) => ({ ...c, isPlayer: i === 2 }));
    const rows = liveBoardEntries(order, 3);
    expect(rows.map((r) => r.pos)).toEqual([1, 2, 3]);
    expect(rows.some((r) => r.divider)).toBe(false);
    expect(rows.filter((r) => r.me)).toHaveLength(1);
  });

  it('for P8 uses P1–P5, a divider, then ahead/player/behind with no silent jump', () => {
    const order = field.map((c, i) => ({ ...c, isPlayer: i === 7 }));
    const rows = liveBoardEntries(order, 8);
    const places = rows.filter((r) => !r.divider).map((r) => r.pos);
    expect(places).toEqual([1, 2, 3, 4, 5, 7, 8, 9]);
    expect(rows.some((r) => r.divider)).toBe(true);
    // contiguous around the player: 7,8,9
    const tail = places.slice(5);
    expect(tail).toEqual([7, 8, 9]);
    for (let i = 1; i < places.length; i++) {
      // either increasing by 1, or the jump is only across the divider zone (5 → 7)
      if (places[i] !== places[i - 1] + 1) {
        expect(places[i - 1]).toBe(5);
        expect(places[i]).toBe(7);
      }
    }
    const html = liveBoardHtml(order, 8);
    expect(html).toContain('class="gap"');
    expect(html).toMatch(/<b>8<\/b>/);
    expect(html).not.toMatch(/<b>6<\/b>/); // 6 omitted between pack and window
  });
});

describe('names escaped in HTML', () => {
  const xss = '<script>alert(1)</script>';
  const xss2 = '<img onerror=alert(1) src=x>';

  it('escapes result-table driver names', () => {
    const list = [
      { pos: 1, isPlayer: false, name: xss, time: 90, best: 90, gap: 0, stops: 0, team: { c1: 0xff0000 } },
      { pos: 2, isPlayer: true, name: xss2, time: 91, best: 91, gap: 1, stops: 0, team: { c1: 0x00ff00 } },
    ];
    const html = resultsTableRows(list, formatTime).join('');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img onerror');
    expect(html).toContain(esc(xss));
    expect(html).toContain(esc(xss2));
    expect(html).toContain('&lt;script&gt;');
  });

  it('escapes champion names and board tags', () => {
    expect(championMessage({ player: false, name: xss })).toBe(`CHAMPION ${esc(xss)}`);
    expect(championMessage({ player: true, name: xss })).toBe('YOU ARE THE CHAMPION');
    const order = [car(xss2, 0x123456, true)];
    const html = liveBoardHtml(order, 1);
    expect(html).not.toContain('<img onerror');
    expect(html).toContain(esc(xss2));
  });
});
