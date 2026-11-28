// The owner's replay address: '#admin-replay' (today) or '#admin-replay=YYYY-MM-DD'. Pure.
import { addDays } from './date.js';

const HASH = /^#admin-replay(?:=(\d{4}-\d{2}-\d{2}))?$/;
const isDay = (id) => { try { return addDays(id, 0) === id; } catch { return false; } }; // rejects 2026-02-30

/** { dayId } for a replay address, else null. Future days are refused: their maps stay hidden. */
export function parseAdminHash(hash, todayId) {
  const m = HASH.exec(hash || '');
  if (!m) return null;
  const id = m[1] || todayId;
  return isDay(id) && id <= todayId ? { dayId: id } : null;
}
