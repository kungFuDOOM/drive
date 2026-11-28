// Daily day IDs: 'YYYY-MM-DD' on the America/Los_Angeles calendar, whatever the device's own timezone is.
// Pure logic; every function takes the instant it works on.

export const DAILY_ZONE = 'America/Los_Angeles';
const HOUR = 3600e3, DAY = 24 * HOUR;
// UTC hours at which Pacific midnight can fall: 07:00 on daylight time, 08:00 on standard time.
const MIDNIGHT_UTC_HOURS = [7, 8];
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const zoneParts = new Intl.DateTimeFormat('en-US', {
  timeZone: DAILY_ZONE, hourCycle: 'h23',
  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
});
function pacific(ms) {
  const p = {};
  for (const { type, value } of zoneParts.formatToParts(ms)) p[type] = value;
  return p;
}

/** The day ID in effect at instant `now` (ms since epoch or Date). */
export function dayId(now) {
  const p = pacific(now);
  return `${p.year}-${p.month}-${p.day}`;
}

// Calendar arithmetic runs on UTC dates, so it never sees a 23 or 25 hour day.
const utcOf = (id) => Date.UTC(+id.slice(0, 4), +id.slice(5, 7) - 1, +id.slice(8, 10));
/** Whole days since 1970-01-01 for a day ID. */
export const dayNumber = (id) => Math.round(utcOf(id) / DAY);
export const addDays = (id, n) => new Date(utcOf(id) + n * DAY).toISOString().slice(0, 10);

/** The instant (ms) a day starts: its Pacific midnight. */
export function dayStart(id) {
  for (const h of MIDNIGHT_UTC_HOURS) {
    const t = utcOf(id) + h * HOUR;
    const p = pacific(t);
    if (dayId(t) === id && p.hour === '00') return t;
  }
  throw new Error(`No Pacific midnight found for ${id}`);
}

/** Milliseconds from `now` until the next daily map. */
export const msUntilReset = (now) => dayStart(addDays(dayId(now), 1)) - +now;

/** 'HH:MM:SS', rounded up so it reads 00:00:00 only at the reset. The 25 hour day can show 24:xx:xx. */
export function formatCountdown(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, '0')).join(':');
}

/** 'FRI, NOV 27' */
export function formatDay(id) {
  const d = new Date(utcOf(id));
  return `${WEEKDAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}
