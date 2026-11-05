// Lap timer with sector splits + ghost recording. Pure logic (no DOM / three.js).
//
// The timer is fed the car's unwrapped lap progress (metres; start line = 0, grid is
// negative) and the race clock. Sector/lap boundaries are crossed at
// k * (L / sectors); crossing times are interpolated between samples so timing is
// independent of the frame rate.

export function formatTime(t, ms = true) {
  if (!isFinite(t) || t == null) return '--:--.---';
  const m = Math.floor(t / 60), s = t - m * 60;
  return `${m}:${s.toFixed(ms ? 3 : 1).padStart(ms ? 6 : 4, '0')}`;
}
export function formatDelta(d) {
  if (d == null || !isFinite(d)) return '';
  return (d <= 0 ? '-' : '+') + Math.abs(d).toFixed(3);
}

/** best = { bestLap, bestSectors[], refSectors[] } from a previous session (optional). */
export function createTimer(L, sectors = 3, best = {}) {
  return {
    L, n: sectors, seg: L / sectors,
    g: -1,                       // number of boundaries crossed minus 1 (-1 = before the line)
    prevProg: null, prevTime: 0,
    lapStart: 0, sectorStart: 0, lapNo: 0,
    cur: [],                     // sector times of the lap in progress
    last: null,                  // last completed lap { time, sectors, delta, isBest }
    bestLap: best.bestLap ?? Infinity,
    bestSectors: best.bestSectors ? best.bestSectors.slice() : Array(sectors).fill(Infinity),
    refSectors: best.refSectors ? best.refSectors.slice() : [],
    laps: [],                    // completed lap times
  };
}

/** Classify a sector time: 'purple' (best ever), 'green' (beats reference lap), 'slow'. */
export function classifySector(t, i, time) {
  const best = t.bestSectors[i], ref = t.refSectors[i];
  if (!(time >= best) ) return 'purple';          // also true when best is Infinity
  if (ref !== undefined && time < ref) return 'green';
  return 'slow';
}

/**
 * Feed new progress. Returns an array of events:
 *  { type:'start', time }
 *  { type:'sector', sector, time, delta, status, lap }
 *  { type:'lap', lap, time, sectors, delta, isBest }
 */
export function updateTimer(t, progress, now) {
  const ev = [];
  if (t.prevProg === null) { t.prevProg = progress; t.prevTime = now; t.g = Math.floor(progress / t.seg); return ev; }
  const gNow = Math.floor(progress / t.seg);
  while (t.g < gNow) {
    const g = ++t.g;
    const boundary = g * t.seg;
    const span = progress - t.prevProg;
    const f = span > 1e-9 ? (boundary - t.prevProg) / span : 1;
    const tc = t.prevTime + Math.min(1, Math.max(0, f)) * (now - t.prevTime);
    if (g === 0) { t.lapStart = t.sectorStart = tc; t.cur = []; t.lapNo = 0; ev.push({ type: 'start', time: tc }); continue; }
    if (g < 0) continue;
    const i = (g - 1) % t.n;
    const time = tc - t.sectorStart;
    t.sectorStart = tc;
    const ref = t.refSectors[i];
    const status = classifySector(t, i, time);
    if (time < t.bestSectors[i]) t.bestSectors[i] = time;
    t.cur.push(time);
    ev.push({ type: 'sector', sector: i, time, delta: ref === undefined ? null : time - ref, status, lap: Math.floor((g - 1) / t.n) });
    if (g % t.n === 0) {
      const lapTime = tc - t.lapStart;
      const sectors = t.cur.slice();
      const isBest = lapTime < t.bestLap;
      const delta = isFinite(t.bestLap) ? lapTime - t.bestLap : null;
      if (isBest) { t.bestLap = lapTime; t.refSectors = sectors.slice(); }
      t.last = { time: lapTime, sectors, delta, isBest };
      t.laps.push(lapTime);
      t.lapStart = tc; t.cur = []; t.lapNo++;
      ev.push({ type: 'lap', lap: t.lapNo, time: lapTime, sectors, delta, isBest });
    }
  }
  t.prevProg = progress; t.prevTime = now;
  return ev;
}
/** Elapsed time of the lap in progress (0 before crossing the line). */
export function currentLapTime(t, now) { return t.g >= 0 ? Math.max(0, now - t.lapStart) : 0; }
/** Live delta against the best lap at the end of the sectors completed so far (null if none). */
export function liveSector(t) { return t.g >= 0 ? t.g % t.n : 0; }

// ---- ghost ----------------------------------------------------------------
export function createGhostRecorder(hz = 10) {
  return { hz, dt: 1 / hz, next: 0, samples: [] };
}
/** Call every step with time since lap start and the car pose. */
export function recordGhost(r, lapTime, x, z, theta) {
  while (lapTime >= r.next) {
    r.samples.push([Math.round(x * 10) / 10, Math.round(z * 10) / 10, Math.round(theta * 100) / 100]);
    r.next += r.dt;
  }
}
export function resetGhost(r) { r.next = 0; r.samples = []; }
export function finishGhost(r, lapTime) { return { hz: r.hz, time: lapTime, samples: r.samples.slice() }; }
/** Interpolated pose at lap time `time`, or null once the ghost lap is over. */
export function sampleGhost(g, time, out = {}) {
  if (!g || time < 0) return null;
  const f = time * g.hz, i = Math.floor(f);
  if (i >= g.samples.length - 1) return null;
  const a = g.samples[i], b = g.samples[i + 1], u = f - i;
  out.x = a[0] + (b[0] - a[0]) * u; out.z = a[1] + (b[1] - a[1]) * u;
  let dth = b[2] - a[2]; while (dth > Math.PI) dth -= 2 * Math.PI; while (dth < -Math.PI) dth += 2 * Math.PI;
  out.theta = a[2] + dth * u;
  return out;
}
