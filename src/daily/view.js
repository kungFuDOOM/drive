// Text for the menu hero, Daily screen and result screen. Pure: no DOM, no clock.
import { findTrack } from '../tracks/index.js';
import { formatTime } from '../timing.js';
import { formatDay } from './date.js';
import { TWISTS, dailyMap, dailyNumber, pastMaps } from './schedule.js';
import { getDailyBest, streakStatus } from './progress.js';
import { getOfficial } from './official.js';

export const ONE_ATTEMPT = '1 official attempt — not raced yet';
export const UNOFFICIAL_REPLAY = 'Replay — unofficial, won’t change the leaderboard';

/** Dripwood-style forest maps always look wet, so their dry days say what is dry: the grip. */
export const twistLabel = (map) => (map.twist === 'dry' && findTrack(map.trackId)?.theme === 'forest' ? 'DRY GRIP' : TWISTS[map.twist].label);
/** A daily-only map has no name until its file has arrived. */
export const trackName = (map) => findTrack(map.trackId)?.name.toUpperCase() ?? 'LOADING…';

function dayRow(save, map) {
  const best = getDailyBest(save, map.dayId);
  return {
    ...map, date: formatDay(map.dayId), track: trackName(map),
    twistLabel: twistLabel(map), best: best ? formatTime(best.time) : null,
  };
}

const lapTime = (ms) => formatTime(ms / 1000);

/**
 * Where today's official attempt stands. `me`: this player's row on today's board, if it has been fetched
 * (it carries the live rank). state: 'unraced' | 'pending' | 'official' | 'rejected'.
 */
export function officialView(save, todayId, me = null) {
  const rec = getOfficial(save, todayId);
  const timeMs = me?.time_ms ?? rec?.timeMs;
  const rank = me?.rank ?? rec?.rank ?? null;
  const state = me ? 'official' : rec?.status ?? 'unraced';
  if (state === 'unraced') {
    return {
      state, used: false, line: ONE_ATTEMPT,
      note: 'You get ONE official attempt today: your first completed lap counts, whatever the time.', button: 'RACE: OFFICIAL ATTEMPT',
    };
  }
  let line;
  if (state === 'official') line = `Official: ${lapTime(timeMs)}${rank == null ? '' : ` · #${rank}`}`;
  else if (state === 'pending') line = `Official: ${lapTime(timeMs)} · not confirmed yet`;
  else line = rank == null ? 'Your official attempt did not count' : `Official run already used · #${rank}`;
  return { state, used: true, line, note: `${UNOFFICIAL_REPLAY}.`, button: 'REPLAY (UNOFFICIAL)' };
}

/** Everything the menu hero and the Daily screen show for the day `todayId`. */
export function dailyView(save, todayId, me = null) {
  return {
    number: dailyNumber(todayId),
    today: dayRow(save, dailyMap(todayId)),
    official: officialView(save, todayId, me),
    past: pastMaps(todayId).map((m) => dayRow(save, m)),
    streak: streakStatus(save, todayId),
  };
}

const days = (n) => `${n} DAY${n === 1 ? '' : 'S'}`;

/**
 * Result screen for one run (a session from start to FINISH).
 * run: { dayId, sent: the submitter entry if this run set the official lap }, lapTimes: its completed laps.
 * kind: 'official' (this run set the day's official lap) | 'unofficial' | 'unused' (no lap yet) | 'past'.
 */
export function runSummary(save, run, lapTimes, todayId) {
  const isToday = run.dayId === todayId;
  const rec = getOfficial(save, run.dayId);
  const mine = run.sent?.run.timeMs;
  const refused = !!run.sent && ((run.sent.status === 'sent' && !run.sent.official) || rec?.status === 'rejected' || (rec?.status === 'official' && rec.timeMs !== mine));
  const runBest = lapTimes.length ? Math.min(...lapTimes) : null;
  const best = runBest == null ? formatTime(null) : formatTime(runBest);

  const streak = streakStatus(save, todayId);
  const streakLine = !isToday ? 'PAST DAY: YOUR STREAK IS UNCHANGED'
    : streak.doneToday ? `STREAK ${days(streak.current)}  ·  LONGEST ${days(streak.longest)}`
      : 'COMPLETE A LAP TODAY TO COUNT IT FOR YOUR STREAK';

  if (run.sent && !refused) {
    return {
      kind: 'official', title: 'DAILY · OFFICIAL', bestLabel: 'OFFICIAL TIME', best: lapTime(mine),
      verdict: 'OFFICIAL RUN: YOUR FIRST COMPLETED LAP TODAY',
      extra: lapTimes.length > 1 ? 'LATER LAPS ARE UNOFFICIAL AND DON’T CHANGE THE LEADERBOARD' : '', streakLine,
    };
  }
  if (!isToday) {
    return { kind: 'past', title: 'PAST DAILY · UNOFFICIAL', bestLabel: 'THIS RUN (UNOFFICIAL)', best, verdict: 'PAST DAY: UNOFFICIAL, NOTHING IS SENT', extra: '', streakLine };
  }
  if (!rec) {
    return {
      kind: 'unused', title: 'DAILY', bestLabel: 'THIS RUN', best,
      verdict: runBest == null ? 'NO COMPLETED LAP: YOUR OFFICIAL ATTEMPT IS STILL UNUSED' : 'THIS LAP COULD NOT BE SENT', extra: '', streakLine,
    };
  }
  return {
    kind: 'unofficial', title: 'DAILY · UNOFFICIAL', bestLabel: 'THIS RUN (UNOFFICIAL)', best,
    verdict: UNOFFICIAL_REPLAY.toUpperCase(), extra: officialView(save, run.dayId).line.toUpperCase(), streakLine,
  };
}
