// DOM for the daily menu entry and the Daily screen. Text comes from view.js; racing stays in main.js.
import { trackDef } from '../tracks/index.js';
import { circuitCard, drawThumb } from '../menuArt.js';
import { esc } from '../html.js';
import { dayId, formatCountdown, msUntilReset } from './date.js';
import { dailyView } from './view.js';
import { leaderboardView } from './boardView.js';
import { NAME_BAD_CHARS, publicName, DEFAULT_NAME } from './identity.js';

/**
 * getSave(): the daily save. onPlay(dayId): start a run. onDayChange(todayId): the reset passed while the page was open.
 * api / player / submitter: the leaderboard client, this device's identity and the lap sender.
 * `clock` is injectable for tests and screenshots.
 */
export function createDailyUi({ $, getSave, onPlay, onDayChange, api, player, submitter, clock = () => Date.now() }) {
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

  let boardAsk = 0, boardDay = null;
  function drawBoard(result) {
    const v = leaderboardView(result);
    $('boardNote').textContent = v.note;
    $('boardYou').textContent = v.you;
    $('boardRows').innerHTML = v.rows.map((r) => `<li class="${r.me ? 'me' : ''}"><span class="b-rank">${esc(r.rank)}</span><span class="b-name">${esc(r.name)}</span><span class="b-time">${r.time}</span></li>`).join('');
  }
  /** Fetch today's board. Called when the Daily screen opens, not on every redraw. Old rows stay while the same day reloads. */
  async function refreshBoard() {
    const ask = ++boardAsk, day = today();
    if (day !== boardDay) { boardDay = null; drawBoard(null); }
    await submitter.settled(); // a lap still on its way should be on the board we show
    const result = await api.leaderboard(day, player.id);
    if (ask !== boardAsk) return;
    boardDay = result.ok ? day : null;
    drawBoard(result);
  }

  function drawName() {
    const name = player.name;
    $('dailyPlayerName').value = name;
    $('dailyNameNote').textContent = name && publicName(name) !== name ? `That name isn't allowed. You will show as ${DEFAULT_NAME}.` : 'Sent with your next best lap.';
  }
  $('dailyPlayerName').addEventListener('input', (e) => {
    const typed = e.target.value.replace(NAME_BAD_CHARS, '');
    if (typed !== e.target.value) e.target.value = typed;
    player.setName(typed);
  });
  $('dailyPlayerName').addEventListener('change', drawName);
  $('dailyPlayerName').addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === 'Escape') e.target.blur(); });
  drawName();

  // the day is read at click time, so a tap just after the reset starts the new map
  $('dailyRace').addEventListener('click', () => onPlay(today()));
  $('dailyPast').addEventListener('click', (e) => { const b = e.target.closest('button[data-day]'); if (b) onPlay(b.dataset.day); });
  setInterval(tick, 250);
  return { render, today, refreshBoard };
}
