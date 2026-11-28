import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { addDays, dayId, dayNumber, dayStart, formatCountdown, formatDay, msUntilReset } from './date.js';

const at = (iso) => Date.parse(iso);
const HOUR = 3600e3;

describe('daily day ID (America/Los_Angeles)', () => {
  it('rolls over at Pacific midnight on standard time (08:00 UTC)', () => {
    expect(dayId(at('2026-11-28T07:59:59.999Z'))).toBe('2026-11-27');
    expect(dayId(at('2026-11-28T08:00:00.000Z'))).toBe('2026-11-28');
  });

  it('rolls over at Pacific midnight on daylight time (07:00 UTC)', () => {
    expect(dayId(at('2026-07-04T06:59:59.999Z'))).toBe('2026-07-03');
    expect(dayId(at('2026-07-04T07:00:00.000Z'))).toBe('2026-07-04');
  });

  it('is the same for the same instant whatever timezone the device uses', () => {
    const code = "import('./src/daily/date.js').then(d => process.stdout.write(d.dayId(Date.parse('2026-11-28T07:30:00Z')) + ' ' + d.msUntilReset(Date.parse('2026-11-28T07:30:00Z'))))";
    for (const TZ of ['UTC', 'Asia/Tokyo', 'America/New_York', 'Pacific/Kiritimati']) {
      expect(execFileSync(process.execPath, ['-e', code], { env: { ...process.env, TZ } }).toString()).toBe('2026-11-27 1800000');
    }
  });
});

describe('midnight reset across DST changes', () => {
  it('spring forward (8 March 2026): the day is 23 hours long', () => {
    expect(dayStart('2026-03-08')).toBe(at('2026-03-08T08:00:00Z'));
    expect(dayStart('2026-03-09')).toBe(at('2026-03-09T07:00:00Z'));
    expect(msUntilReset(dayStart('2026-03-08'))).toBe(23 * HOUR);
    expect(dayId(at('2026-03-09T06:59:59Z'))).toBe('2026-03-08');
    expect(dayId(at('2026-03-09T07:00:00Z'))).toBe('2026-03-09');
  });

  it('fall back (1 November 2026): the day is 25 hours long', () => {
    expect(dayStart('2026-11-01')).toBe(at('2026-11-01T07:00:00Z'));
    expect(dayStart('2026-11-02')).toBe(at('2026-11-02T08:00:00Z'));
    expect(msUntilReset(dayStart('2026-11-01'))).toBe(25 * HOUR);
    expect(formatCountdown(msUntilReset(dayStart('2026-11-01')))).toBe('25:00:00');
    expect(dayId(at('2026-11-02T07:30:00Z'))).toBe('2026-11-01'); // would already be the 2nd on daylight time
  });

  it('counts down in real elapsed time through the repeated 1 a.m. hour', () => {
    const first = at('2026-11-01T08:30:00Z'), second = at('2026-11-01T09:30:00Z'); // both 01:30 on the wall clock
    expect(msUntilReset(first) - msUntilReset(second)).toBe(HOUR);
    expect(formatCountdown(msUntilReset(second))).toBe('22:30:00');
  });

  it('every day of 2026 and 2027 starts exactly where the previous one ends', () => {
    let id = '2026-01-01';
    const lengths = {};
    for (let i = 0; i < 730; i++, id = addDays(id, 1)) {
      const start = dayStart(id);
      expect(dayId(start)).toBe(id);
      expect(dayId(start - 1)).toBe(addDays(id, -1));
      const hours = (dayStart(addDays(id, 1)) - start) / HOUR;
      lengths[hours] = (lengths[hours] || 0) + 1;
    }
    expect(lengths).toEqual({ 23: 2, 24: 726, 25: 2 });
  });
});

describe('day arithmetic and formatting', () => {
  it('steps across month, year and leap day', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2028-03-01', -1)).toBe('2028-02-29');
    expect(dayNumber('2026-03-09') - dayNumber('2026-03-08')).toBe(1);
  });

  it('formats the countdown and date', () => {
    expect(formatCountdown(0)).toBe('00:00:00');
    expect(formatCountdown(1)).toBe('00:00:01');
    expect(formatCountdown(3 * HOUR + 4 * 60e3 + 5e3)).toBe('03:04:05');
    expect(formatDay('2026-11-27')).toBe('FRI, NOV 27');
  });
});
