// Live race position board + results-table HTML helpers (pure; no DOM).
import { esc } from './html.js';

export function colorHex(n) {
  return '#' + ((n >>> 0) & 0xffffff).toString(16).padStart(6, '0');
}

/**
 * Rows for the HUD board. Full list from P1 through the player when short enough
 * for phone landscape; otherwise P1–P5, a divider, then ahead / player / behind.
 * @param {Array<{isPlayer?:boolean, team:{tag:string, c1:number}}>} order
 * @param {number} playerPos 1-based
 */
export function liveBoardEntries(order, playerPos) {
  const n = order.length;
  const pos = Math.max(1, Math.min(playerPos | 0, n || 1));
  const row = (c, i) => ({
    pos: i + 1,
    tag: c.team?.tag ?? '',
    color: c.team?.c1 ?? 0x888888,
    me: !!c.isPlayer,
  });
  if (pos <= 7) return order.slice(0, pos).map(row);
  const out = order.slice(0, 5).map(row);
  out.push({ divider: true });
  const ahead = pos - 2, me = pos - 1, behind = pos;
  if (ahead >= 5 && ahead < n) out.push(row(order[ahead], ahead));
  if (me >= 0 && me < n) out.push(row(order[me], me));
  if (behind < n && behind >= 5) out.push(row(order[behind], behind));
  return out;
}

export function liveBoardHtml(order, playerPos) {
  return liveBoardEntries(order, playerPos).map((r) => {
    if (r.divider) return '<li class="gap" aria-hidden="true">···</li>';
    return `<li class="${r.me ? 'me' : ''}"><b>${r.pos}</b><i style="background:${colorHex(r.color)}"></i>${esc(r.tag)}</li>`;
  }).join('');
}

/** Results-table body rows; names are escaped. formatTime(t, short?) from timing.js. */
export function resultsTableRows(list, formatTime) {
  return list.map((r) => {
    const gap = r.pos === 1 ? formatTime(r.time, false) : '+' + (r.gap ?? 0).toFixed(1);
    return `<tr class="${r.isPlayer ? 'me' : ''}"><td>${r.pos}</td><td><i class="chip" style="background:${colorHex(r.team?.c1 ?? 0x888888)}"></i> ${esc(r.name)}</td><td>${gap}</td><td>best ${formatTime(r.best, false)}</td><td>${r.stops ? 'pit×' + r.stops : ''}</td></tr>`;
  });
}

export function championMessage(top) {
  if (!top) return '';
  if (top.player) return 'YOU ARE THE CHAMPION';
  return `CHAMPION ${esc(top.name)}`;
}
