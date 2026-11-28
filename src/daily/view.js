// Text for the daily menu entry, Daily screen and result screen. Pure: no DOM, no clock.
import { trackDef } from '../tracks/index.js';
import { formatTime } from '../timing.js';
import { formatDay } from './date.js';
import { TWISTS, dailyMap, pastMaps } from './schedule.js';
import { getDailyBest, streakStatus } from './progress.js';

/** Dripwood always looks wet, so its dry days say what is dry: the grip. */
export const twistLabel = (map) => (map.twist === 'dry' && trackDef(map.trackId).theme === 'forest' ? 'DRY GRIP' : TWISTS[map.twist].label);

function dayRow(save, map) {
  const best = getDailyBest(save, map.dayId);
  return {
    ...map, date: formatDay(map.dayId), track: trackDef(map.trackId).name.toUpperCase(),
    twistLabel: twistLabel(map), best: best ? formatTime(best.time) : null,
  };
}

/** Everything the Daily screen (and the menu entry) shows for the day `todayId`. */
export function dailyView(save, todayId) {
  return {
    today: dayRow(save, dailyMap(todayId)),
    past: pastMaps(todayId).map((m) => dayRow(save, m)),
    streak: streakStatus(save, todayId),
  };
}

const days = (n) => `${n} DAY${n === 1 ? '' : 'S'}`;

/**
 * Result screen for one run (a session from start to FINISH; best times are already saved lap by lap).
 * run: { dayId, bestBefore: seconds | null }, lapTimes: this run's completed laps.
 */
export function runSummary(save, run, lapTimes, todayId) {
  const isToday = run.dayId === todayId;
  const best = getDailyBest(save, run.dayId);
  const runBest = lapTimes.length ? Math.min(...lapTimes) : null;
  const newBest = runBest != null && (run.bestBefore == null || runBest < run.bestBefore);
  let verdict;
  if (runBest == null) verdict = 'NO COMPLETED LAP THIS RUN';
  else if (newBest) verdict = run.bestBefore == null ? 'NEW BEST! FIRST TIME ON THIS MAP' : `NEW BEST! ${(run.bestBefore - runBest).toFixed(3)}s FASTER`;
  else verdict = `NOT A NEW BEST  ·  +${(runBest - run.bestBefore).toFixed(3)}s`;
  const streak = streakStatus(save, todayId);
  const streakLine = !isToday ? 'PAST DAY: YOUR STREAK IS UNCHANGED'
    : streak.doneToday ? `STREAK ${days(streak.current)}  ·  LONGEST ${days(streak.longest)}`
      : 'COMPLETE A LAP TODAY TO COUNT IT FOR YOUR STREAK';
  return {
    title: isToday ? 'DAILY' : 'PAST DAILY',
    bestLabel: isToday ? 'TODAY’S BEST' : `BEST FOR ${formatDay(run.dayId)}`,
    best: best ? formatTime(best.time) : formatTime(null),
    newBest, verdict, streakLine,
  };
}
