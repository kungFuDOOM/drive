// Scripted solo-lap bots for comparing braking strategies (used by brake.test.js and `node`-runnable for reports).
// Every bot steers with the same racing-line follower; only the pedal logic differs:
//   'brake' : lifts and brakes to the planned speed profile (what a good driver does)
//   'lift'  : same target speeds but only ever releases the throttle (engine braking / drag), never touches the brake
//   'flat'  : never lifts, never brakes
import { Race } from './race.js';
import { profileAt, speedProfile } from './ai.js';
import { steerTo } from './ai.js';
import * as THREE from 'three';

const tmp = new THREE.Vector3();

/** One solo time-trial lap. Returns { time, off, offFrac, maxExc, secs:{name:{entry,min,t,dist,off}}, lockFrames } */
export function benchLap(track, bot, opts = {}) {
  const r = new Race(track, { mode: 'tt', weather: 'dry', difficulty: 'normal', ...opts });
  const p = r.player, prof = speedProfile(track, p.cls), dt = 1 / 60;
  p.skill = 0.985;
  const secs = {}; let off = 0, n = 0, maxExc = 0, lockFrames = 0, t0 = -1, hits = 0, scrape = 0;
  for (let k = 0; k < 60 * 200; k++) {
    const look = 6 + p.v * 0.22;
    p.input.steer = steerTo(track, p, p.cls, track.lineAt(p.s + look), look, tmp);
    const vt = profileAt(track, prof, p.s + p.v * 0.25) * 0.985;
    p.input.throttle = 1; p.input.brake = 0;
    if (bot !== 'flat' && p.v > vt) {
      p.input.throttle = 0;
      if (bot === 'brake') p.input.brake = Math.min(0.85, 0.25 + (p.v - vt) / 8);
    }
    r.step(dt);
    for (const e of r.events) if (e.type === 'hit') hits++;
    r.events.length = 0;
    if (r.phase !== 'racing' || p.progress < 0) continue;
    if (t0 < 0) t0 = r.time;
    if (p.progress >= track.length) break;
    const name = track.sectionName(p.idx);
    const e = secs[name] || (secs[name] = { entry: p.v * 3.6, min: 1e9, t: 0, dist: 0, off: 0 });
    e.min = Math.min(e.min, p.v * 3.6); e.t += dt; e.dist += p.v * dt;
    n++;
    const away = p.surface === 'grass' || p.surface === 'gravel';
    if (away) { off++; e.off++; maxExc = Math.max(maxExc, Math.abs(p.d) - track.half[p.idx] - 1.4); }
    if (p.lockup > 0.2) lockFrames++;
    if (p.scrape > 0) { scrape++; e.wall = (e.wall || 0) + 1; }
  }
  return { time: r.time - Math.max(0, t0), done: p.progress >= track.length - 1, off, offFrac: off / Math.max(1, n), maxExc, secs, lockFrames, hits, scrape };
}

/** Compact numeric table for reports. */
export function benchReport(track, bots = ['brake', 'lift', 'flat'], opts = {}) {
  const rows = {};
  for (const b of bots) {
    const r = benchLap(track, b, opts);
    rows[b] = { time: +r.time.toFixed(2), hits: r.hits, scrapePct: +(100 * r.scrape / Math.max(1, r.time * 60)).toFixed(1), offPct: +(r.offFrac * 100).toFixed(2), maxExc: +r.maxExc.toFixed(2), done: r.done,
      secs: Object.fromEntries(Object.entries(r.secs).map(([k, v]) => [k, { entry: +v.entry.toFixed(0), min: +v.min.toFixed(0), t: +v.t.toFixed(2), dist: +v.dist.toFixed(0), off: v.off, wall: v.wall || 0 }])) };
  }
  return rows;
}
