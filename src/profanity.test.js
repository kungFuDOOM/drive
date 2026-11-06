import { describe, it, expect } from 'vitest';
import { isProfane, normalizeProfanity, NAME_BLOCKED_MSG, profanityStats } from './profanity.js';
import { sanitizeName, sanitizeTeam, nameIssue, createEditor, editEditor } from './livery.js';
import { sanitizeCareer, sanitizeGarage, loadCareer, saveCareer, CAREER_KEY, defaultRivals } from './career.js';
import { TEAMS } from './teams.js';

/** Build a blocked sample without putting the word in source as a plain string literal in describes. */
const join = (...parts) => parts.join('');
const mild = join('f', 'u', 'c', 'k');
const mildSpaced = join('f', ' ', 'u', ' ', 'c', ' ', 'k');
const mildLeet = join('f', '0', 'c', 'k'); // fo ck via 0→o → fok? wait f0ck → fock. Better f*ck style: fuck with 3
const mildLeet2 = 'fu(k'.replace('(', 'c'); // still visible - use codes
const fromCodes = (arr) => String.fromCharCode(...arr);
// f u c k
const W_MILD = fromCodes([102, 117, 99, 107]);
const W_MILD_ING = W_MILD + 'ing';
const W_SHIT = fromCodes([115, 104, 105, 116]);
const W_SEVERE = fromCodes([110, 105, 103, 103, 101, 114]); // classic slur root

describe('profanity filter', () => {
  it('has a blocklist and a clear UI message', () => {
    const s = profanityStats();
    expect(s.severe).toBeGreaterThan(5);
    expect(s.mild).toBeGreaterThan(10);
    expect(s.allow).toBeGreaterThan(5);
    expect(NAME_BLOCKED_MSG).toBe("That name isn't allowed");
  });

  it('blocks common profanity, leetspeak, spacing and collapsed repeats', () => {
    expect(isProfane(W_MILD)).toBe(true);
    expect(isProfane(W_MILD_ING)).toBe(true);
    expect(isProfane(W_SHIT)).toBe(true);
    expect(isProfane(mildSpaced)).toBe(true);
    expect(isProfane('F' + 'u' + 'u' + 'u' + 'ck')).toBe(true);
    expect(isProfane('sh1t')).toBe(true);
    expect(isProfane('@sshole')).toBe(true);
    expect(isProfane(W_SEVERE)).toBe(true);
    expect(isProfane(W_SEVERE.toUpperCase())).toBe(true);
    expect(isProfane(W_SEVERE[0] + '1' + W_SEVERE.slice(2))).toBe(true);
    expect(isProfane('x' + W_SEVERE + 'y')).toBe(true);
  });

  it('allows classic false-positive words and clean racing names', () => {
    for (const w of ['class', 'assassin', 'Scunthorpe', 'grape', 'Dickson', 'Hancock', 'classic', 'therapist', 'shiitake', 'cockpit']) {
      expect(isProfane(w), w).toBe(false);
    }
    expect(isProfane('Casey Morrow')).toBe(false);
    expect(isProfane('Northline Racing')).toBe(false);
    expect(isProfane('Ember Works')).toBe(false);
    expect(normalizeProfanity('Sh1t!')).toBe('shit');
    expect(normalizeProfanity('Sh1t')).toBe('shit');
  });

  it('sanitizeName / nameIssue reject blocked text and keep clean names', () => {
    expect(nameIssue(W_MILD)).toBe('blocked');
    expect(sanitizeName(W_MILD)).toBe(null);
    expect(nameIssue('ab')).toBe('short');
    expect(nameIssue('Casey Morrow')).toBe(null);
    expect(sanitizeName('Casey Morrow')).toBe('Casey Morrow');
    expect(sanitizeTeam({ name: W_MILD }).name).toBe('Privateer Racing');
    const ed = createEditor({ driver: 'Casey Morrow', name: 'Northline Racing' });
    const next = editEditor(ed, { driver: W_SEVERE, name: W_MILD });
    expect(next.driver).toBe('Casey Morrow');
    expect(next.name).toBe('Northline Racing');
  });

  it('loading a career or garage with a blocked name replaces it with the default', () => {
    const bad = {
      driver: { name: W_SEVERE, number: 7 },
      team: { name: W_MILD + ' Racing', tag: 'FK', livery: { pattern: 'chevrons', c1: 1, c2: 2, c3: 3, number: 7 } },
      difficulty: 'normal', weather: 'auto', laps: 4, season: 1, round: 0, calendar: ['citadel'],
      points: {}, wins: {}, podiums: {}, upgradePoints: 0, upgrades: {}, rivals: [], history: [], complete: false,
    };
    const clean = sanitizeCareer(bad);
    expect(clean.driver.name).not.toBe(W_SEVERE);
    expect(isProfane(clean.driver.name)).toBe(false);
    expect(clean.driver.name.length).toBeGreaterThanOrEqual(3);
    expect(isProfane(clean.team.name)).toBe(false);
    expect(clean.team.name).not.toMatch(new RegExp(W_MILD, 'i'));

    const g = sanitizeGarage({ driver: { name: W_SHIT, number: 1 }, team: { name: '@sshole Crew' } });
    expect(isProfane(g.driver.name)).toBe(false);
    expect(isProfane(g.team.name)).toBe(false);

    const mem = new Map();
    const storage = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) };
    mem.set(CAREER_KEY, JSON.stringify(bad));
    const loaded = loadCareer(storage);
    expect(isProfane(loaded.driver.name)).toBe(false);
    expect(isProfane(loaded.team.name)).toBe(false);
    saveCareer(storage, loaded);
    const again = loadCareer(storage);
    expect(again.driver.name).toBe(loaded.driver.name);
  });
});


describe('built-in copy is clean', () => {
  it('rival names and stock teams pass the filter', () => {
    for (const r of defaultRivals()) expect(isProfane(r.name), r.name).toBe(false);
    for (const t of TEAMS) {
      expect(isProfane(t.name), t.name).toBe(false);
      expect(isProfane(t.tag), t.tag).toBe(false);
    }
  });
});
