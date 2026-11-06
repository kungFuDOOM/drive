// Custom team + livery: pure data helpers (sanitising, limits, defaults). No DOM / three.js, so tests run in Node.
// Pattern presets are original designs (no real team liveries).

/** Livery pattern presets shown in the editor. `style` is the body-builder style in cars.js. */
export const PATTERNS = [
  { id: 'stripes', name: 'STRIPES', style: 'stripe' },
  { id: 'chevrons', name: 'CHEVRONS', style: 'chevron' },
  { id: 'split', name: 'SPLIT', style: 'twotone' },
  { id: 'fade', name: 'FADE', style: 'fade' },
  { id: 'flash', name: 'FLASH', style: 'flash' },
  { id: 'hoops', name: 'HOOPS', style: 'hoop' },
  { id: 'checker', name: 'CHECKER', style: 'checker' },
];
export const PATTERN_IDS = PATTERNS.map((p) => p.id);
export const patternStyle = (id) => (PATTERNS.find((p) => p.id === id) || PATTERNS[0]).style;

export const NAME_MIN = 3, NAME_MAX = 18, TAG_MIN = 2, TAG_MAX = 3, NUMBER_MIN = 1, NUMBER_MAX = 99;
/** Colour swatches offered in the editor (any #rrggbb from the colour input is also accepted). */
export const SWATCHES = [0xe8472a, 0xff8a1f, 0xf2c230, 0xbfe84a, 0x38c48a, 0x1fb6d6, 0x1d8fd1, 0x3355cc, 0xa868f0, 0xf06aa0, 0xf2f2f4, 0x2a2a36];

/**
 * Clean user text: printable characters only (no control chars, no HTML-significant <>&"'`), collapse whitespace,
 * trim, cap length. Letters (any script), digits, space and - . _ ! # + are kept.
 */
export function sanitizeText(s, max) {
  if (typeof s !== 'string') s = s == null ? '' : String(s);
  s = s.normalize('NFC').replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069\ufeff]/g, '');
  s = s.replace(/<[^>]*>/g, '').replace(/[^\p{L}\p{N} \-._!#+]/gu, '');
  s = s.replace(/\s+/g, ' ').trim();
  return [...s].slice(0, max).join('').trim();
}
/** Team / driver name: 3-18 chars after sanitising, or null if too short. */
export function sanitizeName(s, min = NAME_MIN, max = NAME_MAX) {
  const t = sanitizeText(s, max);
  return [...t].length >= min ? t : null;
}
/** 2-3 letter/digit upper-case tag; derived from the name when the input is empty/invalid. */
export function sanitizeTag(tag, name = '') {
  const t = sanitizeText(tag, 8).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, TAG_MAX);
  if (t.length >= TAG_MIN) return t;
  return deriveTag(name);
}
/** Tag from a team name: initials of up to 3 words, else the first 3 consonant-ish letters. */
export function deriveTag(name) {
  const clean = sanitizeText(name, NAME_MAX).toUpperCase().normalize('NFD').replace(/[^A-Z0-9 ]/g, '');
  const words = clean.split(' ').filter(Boolean);
  let t = words.length >= 2 ? words.slice(0, 3).map((w) => w[0]).join('') : '';
  if (t.length < 3) {
    const w = (words[0] || '').replace(/ /g, ''), cons = w.slice(1).replace(/[AEIOU]/g, ''), rest = w.slice(1).replace(/[^AEIOU]/g, '');
    t = words.length >= 2 ? (t + cons + rest + 'XXX') : (w.slice(0, 1) + cons + rest + 'XXX');
  }
  return t.slice(0, TAG_MAX);
}
/** #rrggbb / number -> 24-bit int, or the fallback. */
export function sanitizeColor(c, fallback = 0xe8472a) {
  if (typeof c === 'number' && Number.isInteger(c) && c >= 0 && c <= 0xffffff) return c;
  if (typeof c === 'string' && /^#?[0-9a-f]{6}$/i.test(c.trim())) return parseInt(c.trim().replace('#', ''), 16);
  return fallback;
}
export function sanitizeNumber(n, fallback = 1) {
  const v = typeof n === 'string' ? parseInt(n, 10) : n;
  return Number.isInteger(v) && v >= NUMBER_MIN && v <= NUMBER_MAX ? v : fallback;
}
export const hexStr = (n) => '#' + (n >>> 0).toString(16).padStart(6, '0').slice(-6);

export function defaultLivery() {
  return { pattern: 'chevrons', c1: 0xe8472a, c2: 0xffd24a, c3: 0x15151a, number: 1 };
}
/** Validate a stored/edited livery; every field falls back independently. */
export function sanitizeLivery(l) {
  const d = defaultLivery(), o = l && typeof l === 'object' ? l : {};
  return {
    pattern: PATTERN_IDS.includes(o.pattern) ? o.pattern : d.pattern,
    c1: sanitizeColor(o.c1, d.c1), c2: sanitizeColor(o.c2, d.c2), c3: sanitizeColor(o.c3, d.c3),
    number: sanitizeNumber(o.number, d.number),
  };
}
/** Custom team: { name, tag, livery }. Invalid names fall back to the given default name. */
export function sanitizeTeam(t, fallbackName = 'Privateer Racing') {
  const o = t && typeof t === 'object' ? t : {};
  const name = sanitizeName(o.name) || fallbackName;
  return { name, tag: sanitizeTag(o.tag, name), livery: sanitizeLivery(o.livery) };
}
/** Team object as used by the race / car builder ({ name, tag, c1, c2, livery:{pattern, c3, number} }). */
export function teamFromCustom(t) {
  const s = sanitizeTeam(t), l = s.livery;
  return { name: s.name, tag: s.tag, c1: l.c1, c2: l.c2, custom: true, livery: { pattern: l.pattern, c3: l.c3, number: l.number } };
}
