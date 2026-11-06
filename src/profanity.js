// Name filter for free-text fields (driver, team, tag). Blocklist lives only here.
// Mild terms: whole-token / full-string match after normalisation (avoids Scunthorpe).
// Severe terms: substring match on the compacted form.

/** Severe hate / slur roots — matched as substrings on the normalised compact string. */
const SEVERE = [
  'nigger', 'nigga', 'niggar', 'niggur', 'niggr',
  'faggot', 'faggit', 'faggott',
  'kike', 'kyke',
  'chink', 'gook',
  'tranny', 'troon',
  'retard', 'retarded',
  'molest', 'pedophile', 'paedophile', 'pedophile', 'childfucker',
  'hitler', 'heilhitler',
];

/** Common profanity / sexual insults — whole token or exact compact match only. */
const MILD = [
  'fuck', 'fucker', 'fucking', 'fucked', 'motherfucker', 'motherfuck', 'mfucker',
  'fck', 'fuk', 'fcuk', 'fuc', 'fux', 'phuck',
  'shit', 'shitty', 'bullshit', 'shithead', 'sht', 'shiit',
  'cunt', 'cunts',
  'rape', 'rapist', 'raping',
  'asshole', 'assholes', 'asshat', 'asswipe', 'ashole', 'aashole',
  'bitch', 'bitches', 'bitchy',
  'bastard', 'bastards',
  'damn', 'damned', 'goddamn', 'goddamnit',
  'piss', 'pissed', 'pissoff',
  'dick', 'dicks', 'dickhead', 'dickface',
  'cock', 'cocks', 'cockhead', 'cocksucker',
  'pussy', 'pussies',
  'whore', 'whores', 'slut', 'sluts', 'slutty',
  'wank', 'wanker', 'wanking',
  'twat', 'twats',
  'bollocks', 'bugger',
  'arsehole',
  'tit', 'tits', 'titty',
  'porn', 'porno', 'xxx',
  'sex', 'sexy', 'sexual',
  'anal', 'anus',
  'fag', 'fags', 'dyke', 'dykes', 'spic', 'spick',
  'homo', 'queer',
  'nazi', 'nazis',
  'kkk',
  'cum', 'cumshot', 'jizz',
  'penis', 'vagina', 'boob', 'boobs', 'boobies',
  'hoe', 'hoes',
  'stfu', 'gtfo', 'lmfao',
];

/** Safe names / tokens that must never trip the filter (classic false positives). */
const ALLOW = [
  'class', 'classic', 'classify', 'classroom', 'assassin', 'assassins', 'assassination',
  'scunthorpe', 'grape', 'grapes', 'grapefruit', 'therapist', 'therapy',
  'dickson', 'dickinson', 'hancock', 'cockburn', 'penistone', 'shitake', 'shiitake',
  'pass', 'passion', 'compass', 'bass', 'glass', 'grass', 'cassette', 'assume', 'assumption',
  'cocker', 'cockpit', 'cocktail', 'hitchcock', 'weathercock',
  'subaru', 'suzuki', 'spicy', 'spice',
];

const LEET = {
  '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't',
  '@': 'a', '$': 's', '|': 'l', '+': 't',
};

const severeSet = SEVERE.map(normRoot);
const mildSet = new Set(MILD.map(normRoot));
const allowSet = new Set(ALLOW.map(normRoot));

function mapLeet(s) {
  let out = '';
  for (const ch of s) out += LEET[ch] || ch;
  return out;
}

/** Lowercase, strip diacritics, apply leetspeak, keep letters only. */
export function normalizeProfanity(s, { collapse = false } = {}) {
  if (s == null) return '';
  let t = String(s).toLowerCase().normalize('NFKD').replace(/\p{M}/gu, '');
  // drop edge punctuation so trailing ! does not become a letter via leetspeak
  t = t.replace(/^[^a-z0-9@$]+|[^a-z0-9@$]+$/g, '');
  t = mapLeet(t);
  t = t.replace(/[^a-z]/g, '');
  if (collapse) t = t.replace(/(.)\1+/g, '$1');
  return t;
}

function normRoot(w) {
  return normalizeProfanity(w, { collapse: true });
}

function tokensOf(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFKD').replace(/\p{M}/gu, '')
    .split(/[^a-z0-9@$!|+]+/i)
    .filter(Boolean)
    .map((tok) => normalizeProfanity(tok, { collapse: false }))
    .filter(Boolean);
}

/**
 * True when the text is not allowed as a player-facing name.
 * Empty / non-string input is not profane (length rules live elsewhere).
 */
export function isProfane(text) {
  if (text == null) return false;
  const raw = String(text);
  if (!raw.trim()) return false;

  const compact = normalizeProfanity(raw, { collapse: false });
  const collapsed = normalizeProfanity(raw, { collapse: true });
  if (!compact && !collapsed) return false;

  if (allowSet.has(compact) || allowSet.has(collapsed)) return false;

  for (const sev of severeSet) {
    if (!sev) continue;
    if (compact.includes(sev) || collapsed.includes(sev)) return true;
  }

  if (mildSet.has(compact) || mildSet.has(collapsed)) return true;

  for (const tok of tokensOf(raw)) {
    const tc = tok.replace(/(.)\1+/g, '$1');
    if (allowSet.has(tok) || allowSet.has(tc)) continue;
    if (mildSet.has(tok) || mildSet.has(tc)) return true;
    for (const sev of severeSet) {
      if (sev.length >= 4 && (tok.includes(sev) || tc.includes(sev))) return true;
    }
  }
  return false;
}

/** Message shown in the team editor when a name is blocked. */
export const NAME_BLOCKED_MSG = "That name isn't allowed";

/** Internal list lengths for tests (does not expose the words). */
export function profanityStats() {
  return { severe: SEVERE.length, mild: MILD.length, allow: ALLOW.length };
}
