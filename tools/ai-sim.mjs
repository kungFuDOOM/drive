#!/usr/bin/env node
// AI race harness CLI. Runs seeded headless races (src/aiSim.js), prints summary tables and writes screenshots/ai/baseline.json.
//   node tools/ai-sim.mjs --all                        full matrix: 6 tracks x 3 difficulties x 3 seeds (3 laps), 5-lap races,
//                                                      rain, human proxies, solo/limit laps
//   node tools/ai-sim.mjs --track citadel --difficulty hard --seeds 1,2,3
//   options: --laps N, --legacy (player slot on autopilot as before aiOnly), --out FILE, --no-write
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runRace, limitLap, soloLaps, TRACK_IDS } from '../src/aiSim.js';
import { DIFFICULTY } from '../src/progress.js';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const flag = (k) => args.includes(`--${k}`);
const all = flag('all');
const trackList = opt('track') ? opt('track').split(',') : TRACK_IDS;
const diffList = opt('difficulty') ? opt('difficulty').split(',') : ['easy', 'normal', 'hard'];
const seeds = (opt('seeds') || '1,2,3').split(',').map(Number);
const laps = +opt('laps', 3);
const legacy = flag('legacy');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outFile = resolve(root, opt('out', 'screenshots/ai/baseline.json'));
const t0 = Date.now();

const mean = (a) => a.reduce((s, x) => s + (x ?? 0), 0) / Math.max(1, a.length);
const f = (x, d = 1) => (x == null || Number.isNaN(x) ? '-' : (+x).toFixed(d));
const pad = (s, n) => String(s).padStart(n);
const strip = ({ wallBy, launch, split, mistakes, pitLaps, ...r }) => ({ ...r, split, mistakes, wallBy, pitLaps, launch });

function table(title, rows, cols) {
  console.log(`\n== ${title}`);
  console.log(cols.map(([h, , w]) => pad(h, w)).join(' '));
  for (const r of rows) console.log(cols.map(([, g, w]) => pad(g(r), w)).join(' '));
}

const out = { generated: new Date().toISOString().slice(0, 10), seeds, limit: {}, solo: {}, dry: [], long: [], rain: [], proxy: [], summary: {} };

// ---- limit / solo laps ----
for (const tid of trackList) {
  const lim = limitLap(tid);
  out.limit[tid] = lim;
  out.solo[tid] = {};
  for (const d of diffList) {
    const s = soloLaps(tid, DIFFICULTY[d].skill, { laps: 3 });
    out.solo[tid][d] = { ...s, vsLimitPct: +(100 * (s.lap / lim.lap - 1)).toFixed(2), lapStd: +std(s.times).toFixed(3) };
  }
}
function std(a) { const m = mean(a); return Math.sqrt(mean(a.map((x) => (x - m) ** 2))); }
table('solo laps (clean air, mistakes off) vs limit lap (skill 1.18)', trackList.map((t) => ({ t })), [
  ['track', (r) => r.t, 10], ['limit', (r) => f(out.limit[r.t].lap, 2), 7],
  ...diffList.flatMap((d) => [[d, (r) => f(out.solo[r.t][d].lap, 2), 7], ['%', (r) => f(out.solo[r.t][d].vsLimitPct), 5], ['full%', (r) => f(out.solo[r.t][d].fullThrottlePct, 0), 5], ['hits', (r) => out.solo[r.t][d].hits + '/' + out.solo[r.t][d].off, 5]]),
]);

// ---- dry 3-lap matrix ----
for (const tid of trackList) for (const d of diffList) for (const seed of seeds) {
  const r = runRace({ track: tid, difficulty: d, seed, laps, aiOnly: !legacy });
  r.medVsLimitPct = +(100 * (r.medBest / out.limit[tid].lap - 1)).toFixed(2);
  r.fieldSpreadPct = +(100 * (r.worstBest / r.bestLap - 1)).toFixed(2);
  out.dry.push(strip(r));
}
const group = (rows, key) => { const g = new Map(); for (const r of rows) { const k = key(r); if (!g.has(k)) g.set(k, []); g.get(k).push(r); } return [...g.entries()]; };
const dryRows = group(out.dry, (r) => `${r.track}/${r.difficulty}`).map(([k, rs]) => {
  const a = (g) => mean(rs.map(g));
  return { k, n: rs.length, med: a((r) => r.medVsLimitPct), spread: a((r) => r.fieldSpreadPct), mist: a((r) => r.mistakeCount), loss: a((r) => r.mistakeLossMean), beside: a((r) => r.mistakesBeside),
    cont: a((r) => r.contacts), contL1: a((r) => r.contactsL1), contAfter: a((r) => r.contactsAfterL1), csec: a((r) => r.contactSec), c12: a((r) => r.contactSec12), ntt: a((r) => r.noseToTailPct),
    ovt: a((r) => r.overtakes), lead: a((r) => r.leadChanges), wall: a((r) => r.wallHits), off: a((r) => r.offPct), sbs: a((r) => r.sbsCornerSec), full: a((r) => r.fullThrottlePct),
    gapLast: a((r) => r.gapLast), launch: a((r) => r.launchMax - r.launchMin), l1: a((r) => r.lap1Changes) };
});
table(`dry ${laps}-lap races (mean of ${seeds.length} seeds)`, dryRows, [
  ['track/diff', (r) => r.k, 16], ['med%', (r) => f(r.med, 2), 6], ['sprd%', (r) => f(r.spread, 2), 6], ['mist', (r) => f(r.mist), 5], ['loss', (r) => f(r.loss, 2), 5], ['bsd', (r) => f(r.beside, 0), 4],
  ['cont', (r) => f(r.cont), 6], ['c.L1', (r) => f(r.contL1), 5], ['c.aft', (r) => f(r.contAfter), 6], ['csec', (r) => f(r.csec), 6], ['c12s', (r) => f(r.c12), 5], ['ntt%', (r) => f(r.ntt, 0), 5],
  ['ovt', (r) => f(r.ovt), 5], ['lead', (r) => f(r.lead), 5], ['wall', (r) => f(r.wall), 5], ['off%', (r) => f(r.off, 3), 6], ['sbsC', (r) => f(r.sbs), 5], ['full%', (r) => f(r.full, 0), 5],
  ['gapL', (r) => f(r.gapLast), 5], ['lnch', (r) => f(r.launch, 2), 5], ['L1chg', (r) => f(r.l1), 5],
]);
out.summary.dry = dryRows;
for (const d of diffList) {
  const rs = out.dry.filter((r) => r.difficulty === d);
  out.summary[`dry_${d}`] = { mistakes: +mean(rs.map((r) => r.mistakeCount)).toFixed(1), medVsLimitPct: +mean(rs.map((r) => r.medVsLimitPct)).toFixed(2), contacts: +mean(rs.map((r) => r.contacts)).toFixed(1), contactsL1: +mean(rs.map((r) => r.contactsL1)).toFixed(1), contactSec: +mean(rs.map((r) => r.contactSec)).toFixed(1), wallHits: +mean(rs.map((r) => r.wallHits)).toFixed(2), overtakes: +mean(rs.map((r) => r.overtakes)).toFixed(1) };
}

if (all) {
  // ---- 5-lap races (gaps, lead changes) ----
  for (const tid of trackList) for (const d of ['normal', 'hard']) for (const seed of seeds) out.long.push(strip(runRace({ track: tid, difficulty: d, seed, laps: 5, aiOnly: !legacy })));
  table('dry 5-lap races', out.long, [
    ['track/diff/seed', (r) => `${r.track}/${r.difficulty}/${r.seed}`, 18], ['gapP2', (r) => f(r.gapP2), 6], ['gapP5', (r) => f(r.gapP5), 6], ['gapLast', (r) => f(r.gapLast), 7],
    ['ovt', (r) => r.overtakes, 4], ['lead', (r) => r.leadChanges, 4], ['cont', (r) => r.contacts, 5], ['wall', (r) => r.wallHits, 4],
  ]);
  out.summary.long = { leadChangeSeedsPct: +(100 * out.long.filter((r) => r.leadChanges >= 1).length / out.long.length).toFixed(0), meanOvertakes: +mean(out.long.map((r) => r.overtakes)).toFixed(1),
    normalGapLast: out.long.filter((r) => r.difficulty === 'normal').map((r) => r.gapLast), p2Under6Pct: +(100 * out.long.filter((r) => r.gapP2 < 6).length / out.long.length).toFixed(0) };

  // ---- rain ----
  for (const tid of ['citadel', 'coastal', 'lampwick'].filter((t) => trackList.includes(t))) for (const d of ['easy', 'hard']) for (const seed of seeds) {
    for (const w of [{ weather: 'rain', laps: 4 }, { weather: 'auto', rainAt: 50, laps: 5 }]) out.rain.push(strip(runRace({ track: tid, difficulty: d, seed, aiOnly: !legacy, ...w })));
  }
  table('rain (start wet over 4 laps / rainAt 50 over 5 laps)', out.rain, [
    ['track/diff/seed', (r) => `${r.track}/${r.difficulty}/${r.seed}`, 18], ['wx', (r) => (r.rainAt ? 'at50' : 'wet'), 4], ['off%', (r) => f(r.offPct, 2), 6], ['wall', (r) => r.wallHits, 4],
    ['stops', (r) => r.pitStops, 5], ['pitL1', (r) => r.pitLap1, 5], ['pitLaps', (r) => [...new Set(r.pitLaps)].join(','), 9], ['wets', (r) => r.wetCars, 4], ['medBest', (r) => f(r.medBest, 2), 7],
    ['stuckMax', (r) => f(r.maxStuckRun), 8], ['cont', (r) => r.contacts, 5],
  ]);

  // ---- human proxies in the player slot ----
  for (const proxy of ['slowOnLine', 'weaver', 'earlyBraker', 'parked']) for (const tid of trackList) for (const seed of seeds.slice(0, 2)) {
    out.proxy.push(strip(runRace({ track: tid, difficulty: 'normal', seed, proxy })));
  }
  table('human proxies (Normal field, player slot scripted)', group(out.proxy, (r) => r.proxy).map(([k, rs]) => ({ k, rs })), [
    ['proxy', (r) => r.k, 12], ['proxyCont/race', (r) => f(mean(r.rs.map((x) => x.proxyContacts)), 2), 15], ['max', (r) => Math.max(...r.rs.map((x) => x.proxyContacts)), 4], ['parkedHits', (r) => r.rs.reduce((s, x) => s + x.parkedContacts, 0), 10],
    ['allCont', (r) => f(mean(r.rs.map((x) => x.contacts))), 8], ['wall', (r) => f(mean(r.rs.map((x) => x.wallHits))), 5], ['stuck', (r) => f(mean(r.rs.map((x) => x.stuckSec))), 6],
  ]);
}

out.elapsedSec = +((Date.now() - t0) / 1000).toFixed(1);
console.log(`\ndone in ${out.elapsedSec} s`);
if (!flag('no-write')) {
  mkdirSync(dirname(outFile), { recursive: true });
  const { generated, elapsedSec, ...stable } = out; // deterministic content only, so reruns give an identical file
  writeFileSync(outFile, JSON.stringify(stable, null, 1) + '\n');
  console.log(`wrote ${outFile}`);
}
