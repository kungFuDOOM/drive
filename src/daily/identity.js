// Who this device is on the leaderboard: a random id and a display name. No accounts. Storage is injected.
import { isProfane } from '../profanity.js';

export const PLAYER_KEY = 'drive-daily-player-v1';
export const NAME_MAX = 16;
export const DEFAULT_NAME = 'Driver';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const NAME_BAD_CHARS = /[^A-Za-z0-9 _.-]/g;
/** Only what the server accepts: [A-Za-z0-9 _.-], at most 16 characters. */
export const cleanName = (s) => String(s ?? '').replace(NAME_BAD_CHARS, '').trimStart().slice(0, NAME_MAX).trimEnd();
/** The name to publish. */
export function publicName(s) {
  const name = cleanName(s);
  return name && !isProfane(name) ? name : DEFAULT_NAME;
}

/** randomUUID only exists on https and localhost; a dev server opened over the LAN needs the long way. */
export function randomId(crypto = globalThis.crypto) {
  if (crypto.randomUUID) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((n) => n.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/** { id, name, setName(s) }. The id is made once and kept; without storage it lasts for the visit. */
export function loadPlayer(storage, makeId = randomId) {
  let saved = null;
  try { saved = JSON.parse(storage?.getItem(PLAYER_KEY)); } catch { /* unreadable: start over */ }
  const player = {
    id: UUID.test(saved?.id) ? saved.id : makeId(),
    name: cleanName(saved?.name),
    setName(s) { player.name = cleanName(s); persist(); return player.name; },
  };
  function persist() {
    try { storage?.setItem(PLAYER_KEY, JSON.stringify({ id: player.id, name: player.name })); } catch { /* storage unavailable */ }
  }
  persist();
  return player;
}
