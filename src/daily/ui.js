// DOM for the menu hero, the Daily screen and the leaderboards. Text comes from view.js; racing stays in main.js.
import { findTrack } from '../tracks/index.js';
import { circuitCard, drawThumb } from '../menuArt.js';
import { esc } from '../html.js';
import { dayId, formatCountdown, formatDay, msUntilReset } from './date.js';
import { dailyView, officialView } from './view.js';
import { loadDayTrack } from './schedule.js';
import { BOARD_LIMIT, NOT_ON_BOARD, leaderboardView, shortBoard } from './boardView.js';
import { NAME_BAD_CHARS, publicName, DEFAULT_NAME } from './identity.js';

const RESULT_ROWS = 5;

/**
 * getSave(): the daily save. onPlay(dayId): start a run. onDayChange(todayId): the reset passed while the page was open.
 * api / player / officialRuns: the leaderboard client, this device's identity and the official-attempt keeper.
 * `clock` is injectable for tests and screenshots.
 */
export function createDailyUi({ $, getSave, onPlay, onDayChange, api, player, officialRuns, clock = () => Date.now() }) {
  const today = () => dayId(clock());
  let shownDay = null;

  function tick() {
    const now = clock();
    if (shownDay && dayId(now) !== shownDay) { render(); onDayChange?.(shownDay); return; }
    const left = formatCountdown(msUntilReset(now));
    for (const id of ['dailyEntryClock', 'dailyClock', 'lbClock']) if ($(id).textContent !== left) $(id).textContent = left;
  }

  let lastBoard = null, boardDay = null; // the newest leaderboard reply and the day it belongs to
  const myRow = () => (boardDay === shownDay && lastBoard?.ok ? lastBoard.data.me : null);

  function thumb(id, trackId) {
    const canvas = $(id), def = findTrack(trackId);
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    if (!def) return;
    const card = circuitCard(def);
    drawThumb(canvas, card.samples, card.tag);
  }

  /** Daily-only maps arrive as their own files; redraw as each one lands. Only today and past days are asked for. */
  function fetchTracks(rows) {
    for (const row of rows) {
      if (findTrack(row.trackId)) continue;
      loadDayTrack(row.dayId, shownDay).then((ok) => { if (ok && findTrack(row.trackId)) render(); });
    }
  }

  /** Redraw both views. Keeps keyboard / gamepad focus on the same past day if the list is rebuilt. */
  function render() {
    shownDay = today();
    const v = dailyView(getSave(), shownDay, myRow()), t = v.today, o = v.official;
    $('dailyEntryNum').textContent = `DAILY #${v.number}`;
    $('dailyEntryDate').textContent = t.date;
    $('dailyEntryTrack').textContent = t.track;
    $('dailyEntryMeta').textContent = t.twistLabel;
    $('dailyEntryMeta').dataset.twist = t.twist;
    $('heroStatus').textContent = o.line;
    $('heroStatusNote').textContent = o.used ? o.note : 'Your first completed lap counts.';
    $('dailyEntry').dataset.attempt = o.state;
    $('heroCta').textContent = o.used ? 'OPEN TODAY’S DAILY  ▸' : 'RACE TODAY  ▸';
    thumb('heroThumb', t.trackId);

    $('lbDate').textContent = `DAILY #${v.number}  ·  ${t.date}`;
    $('lbTrack').textContent = t.track;
    $('lbTwist').textContent = t.twistLabel;
    $('lbTwist').dataset.twist = t.twist;
    thumb('dailyThumb', t.trackId);
    $('dailyDate').textContent = `DAILY #${v.number}  ·  ${t.date}`;
    $('dailyName').textContent = t.track;
    $('dailyTwist').textContent = t.twistLabel;
    $('dailyTwist').dataset.twist = t.twist;
    $('dailyOfficial').dataset.attempt = o.state;
    $('dailyStatus').textContent = o.used ? o.line : 'ONE OFFICIAL ATTEMPT TODAY';
    $('dailyStatusNote').textContent = o.note;
    $('dailyRace').textContent = o.button;
    $('streakNow').textContent = String(v.streak.current);
    $('streakLongest').textContent = String(v.streak.longest);
    $('streakNote').textContent = v.streak.doneToday ? 'Today counts. Come back tomorrow.'
      : v.streak.current ? 'Complete a lap today to keep it going.' : 'Complete a lap today to start one.';

    const focused = document.activeElement?.closest?.('#dailyPast button')?.dataset.day;
    $('dailyPast').innerHTML = v.past.map((d) => `<li><button type="button" class="dayrow nav" data-day="${d.dayId}"><span class="d-date">${esc(d.date)}</span><span class="d-track">${esc(d.track)}</span><span class="d-meta"><span class="d-twist" data-twist="${d.twist}">${esc(d.twistLabel)}</span><span class="d-unofficial">UNOFFICIAL</span></span><span class="d-best${d.best ? '' : ' none'}">${d.best || 'not raced'}</span></button></li>`).join('');
    if (focused) $('dailyPast').querySelector(`[data-day="${focused}"]`)?.focus({ preventScroll: true });
    fetchTracks([t, ...v.past]);
    tick();
  }

  const rowHtml = (r, tag = 'li') => `<${tag} class="${tag === 'li' ? '' : 'hero-row '}${r.me ? 'me' : ''}${r.apart ? ' apart' : ''}"><span class="b-rank">${esc(r.rank)}</span><span class="b-name">${esc(r.name)}</span><span class="b-time">${r.time}</span></${tag}>`;
  const rowsHtml = (list, tag) => list.map((r) => rowHtml(r, tag)).join('');
  /** The line for a player with no row on day `day`'s board. */
  function offBoard(day) {
    const o = officialView(getSave(), day);
    if (o.used) return o.line;
    return day === today() ? NOT_ON_BOARD : 'No official run of yours on this day';
  }

  let boardAsk = 0;
  function drawBoard(result) {
    const v = leaderboardView(result, offBoard(today()));
    $('boardNote').textContent = $('lbNote').textContent = v.note;
    $('boardYou').textContent = $('lbYou').textContent = v.you;
    $('boardRows').innerHTML = $('lbRows').innerHTML = rowsHtml(v.rows);
    $('lbMine').innerHTML = v.mine ? rowHtml(v.mine) : '';
    $('leaderboard').dataset.state = v.state;
    $('heroRows').innerHTML = rowsHtml(v.rows.slice(0, 3), 'span');
    $('heroNote').textContent = v.state === 'error' ? (result.offline ? 'Offline: no leaderboard right now.' : 'Leaderboard unavailable right now.') : v.note;
  }
  /** The board under a daily result, for the day that was raced. result: null while loading. */
  function drawResultBoard(day, result) {
    const v = leaderboardView(result, offBoard(day));
    $('resBoardTitle').textContent = day === today() ? 'TODAY’S LEADERBOARD' : `LEADERBOARD  ·  ${formatDay(day)}`;
    $('resBoardYou').textContent = v.you;
    $('resBoardNote').textContent = v.note;
    $('resBoardRows').innerHTML = rowsHtml(shortBoard(v, RESULT_ROWS));
  }
  /** Fetch today's board (menu and Daily screen), not on every redraw. Old rows stay while the same day reloads. */
  async function refreshBoard() {
    const ask = ++boardAsk, day = today();
    if (day !== boardDay) { boardDay = null; lastBoard = null; drawBoard(null); }
    await officialRuns.sync(day); // an official lap still on its way should be on the board we show
    const result = await api.leaderboard(day, player.id, BOARD_LIMIT);
    if (ask !== boardAsk) return;
    officialRuns.board(day, result);
    boardDay = result.ok ? day : null;
    lastBoard = result;
    drawBoard(result);
    render();
  }

  function drawName() {
    const name = player.name;
    $('dailyPlayerName').value = name;
    $('dailyNameNote').textContent = name && publicName(name) !== name ? `That name isn't allowed. You will show as ${DEFAULT_NAME}.` : 'Sent with your official lap, so set it before you race.';
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
  return { render, today, refreshBoard, drawResultBoard };
}
