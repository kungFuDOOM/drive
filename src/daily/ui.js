// DOM for the daily menu entry and the Daily screen. Text comes from view.js; racing stays in main.js.
import { trackDef } from '../tracks/index.js';
import { circuitCard, drawThumb } from '../menuArt.js';
import { esc } from '../html.js';
import { dayId, formatCountdown, msUntilReset } from './date.js';
import { dailyView } from './view.js';

/**
 * getSave(): the daily save. onPlay(dayId): start a run. onDayChange(todayId): the reset passed while the page was open.
 * `clock` is injectable for tests and screenshots.
 */
export function createDailyUi({ $, getSave, onPlay, onDayChange, clock = () => Date.now() }) {
  const today = () => dayId(clock());
  let shownDay = null;

  function tick() {
    const now = clock();
    if (shownDay && dayId(now) !== shownDay) { render(); onDayChange?.(shownDay); return; }
    const left = formatCountdown(msUntilReset(now));
    for (const id of ['dailyEntryClock', 'dailyClock']) if ($(id).textContent !== left) $(id).textContent = left;
  }

  /** Redraw both views. Keeps keyboard / gamepad focus on the same past day if the list is rebuilt. */
  function render() {
    shownDay = today();
    const v = dailyView(getSave(), shownDay), t = v.today;
    $('dailyEntryTrack').textContent = t.track;
    $('dailyEntryMeta').textContent = `${t.twistLabel}  ·  ${t.date}`;
    $('dailyEntry').dataset.twist = t.twist;

    const card = circuitCard(trackDef(t.trackId));
    const canvas = $('dailyThumb');
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    drawThumb(canvas, card.samples, card.tag);
    $('dailyDate').textContent = t.date;
    $('dailyName').textContent = t.track;
    $('dailyTwist').textContent = t.twistLabel;
    $('dailyTwist').dataset.twist = t.twist;
    $('dailyBest').textContent = t.best ? `TODAY’S BEST ${t.best}` : 'TODAY: NOT RACED';
    $('streakNow').textContent = String(v.streak.current);
    $('streakLongest').textContent = String(v.streak.longest);
    $('streakNote').textContent = v.streak.doneToday ? 'Today counts. Come back tomorrow.'
      : v.streak.current ? 'Complete a lap today to keep it going.' : 'Complete a lap today to start one.';

    const focused = document.activeElement?.closest?.('#dailyPast button')?.dataset.day;
    $('dailyPast').innerHTML = v.past.map((d) => `<li><button type="button" class="dayrow nav" data-day="${d.dayId}"><span class="d-date">${esc(d.date)}</span><span class="d-track">${esc(d.track)}</span><span class="d-twist" data-twist="${d.twist}">${esc(d.twistLabel)}</span><span class="d-best${d.best ? '' : ' none'}">${d.best || 'not raced'}</span></button></li>`).join('');
    if (focused) $('dailyPast').querySelector(`[data-day="${focused}"]`)?.focus({ preventScroll: true });
    tick();
  }

  // the day is read at click time, so a tap just after the reset starts the new map
  $('dailyRace').addEventListener('click', () => onPlay(today()));
  $('dailyPast').addEventListener('click', (e) => { const b = e.target.closest('button[data-day]'); if (b) onPlay(b.dataset.day); });
  setInterval(tick, 250);
  return { render, today };
}
