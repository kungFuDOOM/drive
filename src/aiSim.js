// Headless AI race harness: runs seeded races in plain Node (no rendering) and measures how the AI drives.
// Used by tools/ai-sim.mjs (baseline tables) and the AI tests. Nothing here is imported by the game.
import { Track } from './track.js';
import { TRACKS, trackDef } from './tracks/index.js';
import { Race, seededRandom } from './race.js';
import { wrapDelta, wrapAngle, clamp } from './physics.js';
import { steerTo, profileAt, makePace, LIMIT_FACTOR } from './ai.js';
import * as THREE from 'three';

export const DT = 1 / 60;
export const CAR_LEN = 4.6, CAR_WID = 2.1; // overlap box used by Race._interactions
export const CORNER_K = 0.004;             // |line curvature| above this counts as a corner

const tracks = new Map();
/** Cached Track instance by id. */
export function getTrack(id) {
  if (!tracks.has(id)) tracks.set(id, new Track(trackDef(id)));
  return tracks.get(id);
}
export const TRACK_IDS = TRACKS.map((t) => t.id);

const tmpV = new THREE.Vector3();
const median = (a) => { if (!a.length) return NaN; const b = a.slice().sort((x, y) => x - y); return b[b.length >> 1]; };
const r2 = (x) => (Number.isFinite(x) ? Math.round(x * 100) / 100 : null);

// ---- scripted "human proxy" drivers for the player slot (autopilot off) ----
// Each sets car.input for one step. They follow the racing line with the same pursuit steering the AI uses.
function lineDrive(race, car, { pace = 0.985, offset = 0, brakeEarly = 0 } = {}) {
  const T = race.track, prof = race.profiles[car.cls.id], inp = car.input;
  const look = 6 + car.v * 0.22;
  inp.steer = steerTo(T, car, car.cls, T.lineAt(car.s + look) + offset, look, tmpV);
  let vt = profileAt(T, prof, car.s + car.v * 0.25) * pace;
  if (brakeEarly) vt = Math.min(vt, profileAt(T, prof, car.s + car.v * 0.25 + brakeEarly) * pace);
  const dv = vt - car.v;
  inp.boost = false;
  if (dv > 0.5) { inp.throttle = clamp(dv / 3, 0.35, 1); inp.brake = 0; }
  else if (dv < -1.0) { inp.throttle = 0; inp.brake = clamp(0.25 - dv / 8, 0.25, 0.85); }
  else { inp.throttle = clamp(0.35 + dv * 0.2, 0, 0.5); inp.brake = 0; }
}
export const PROXIES = {
  /** 85 % of planned speed on the racing line. */
  slowOnLine: (race, car) => lineDrive(race, car, { pace: 0.85 }),
  /** Racing-line pace with a 3 m sine weave (period ~6 s). */
  weaver: (race, car, st) => {
    const T = race.track, hw = T.halfAt(car.s) - 2.2;
    const off = 3 * Math.sin(race.time * 1.05);
    lineDrive(race, car, { pace: 0.95, offset: clamp(T.lineAt(car.s) + off, -hw, hw) - T.lineAt(car.s) });
  },
  /** Brakes 40 m earlier than the plan. */
  earlyBraker: (race, car) => lineDrive(race, car, { pace: 0.97, brakeEarly: 40 }),
  /** Drives a slow first half-lap on the line, then stops on the line and stays there. */
  parked: (race, car, st) => {
    if (!st.parked && car.progress > race.track.length * 0.45) { st.parked = { x: car.x, z: car.z, theta: car.theta }; }
    if (st.parked) { car.input.throttle = 0; car.input.brake = 0; car.input.steer = 0; car.input.boost = false; return; }
    lineDrive(race, car, { pace: 0.8 });
  },
};
function holdParked(car, st) {
  if (!st.parked) return;
  car.v = 0; car.x = st.parked.x; car.z = st.parked.z; car.theta = st.parked.theta;
}

/**
 * One seeded race with every car measured.
 * opts: { track, difficulty, seed, laps, weather, rainAt, cls, proxy, maxSeconds, aiOnly (default true unless proxy), onStep }
 */
export function runRace(opts = {}) {
  const { track = 'citadel', difficulty = 'normal', seed = 1, laps = 3, weather = 'dry', rainAt, cls = 'gp', proxy = null, maxSeconds = 900 } = opts;
  const aiOnly = opts.aiOnly ?? !proxy;
  const T = typeof track === 'string' ? getTrack(track) : track;
  const race = new Race(T, { mode: 'race', difficulty, weather, laps, cls, rainAt, rng: seededRandom(seed), aiOnly });
  if (!aiOnly && !proxy) race.autopilot = true; // legacy harness: player slot on autopilot (skill 0.985, no AI pit calls)
  const cs = race.cars, n = cs.length, L = T.length, prof = race.profiles[race.cls.id];
  const proxyCar = proxy ? race.player : null, proxySt = {};
  if (proxy && !PROXIES[proxy]) throw new Error(`unknown proxy ${proxy}`);

  const m = {
    wallHits: 0, wallBy: {}, wallL1: 0, contacts: 0, contactFrames: 0, contactsL1: 0, contactFrames12: 0,
    split: { rear: 0, side: 0, corner: 0, straight: 0 }, sbsFrames: 0, sbsCornerFrames: 0,
    off: 0, samples: 0, stuck: 0, recoveries: 0, mistakes: {}, mistakesBeside: 0, bigMistakes: 0, mistakeLoss: [], lockFrames: 0, fullThrottle: 0,
    overtakes: 0, leadChanges: 0, movedBeforeGo: 0, pitLaps: [], tyreChanges: 0, pitLap1: 0,
    proxyContacts: 0, parkedContacts: 0, maxStuckRun: 0,
  };
  const sign = Array.from({ length: n }, () => new Int8Array(n));
  const inContact = Array.from({ length: n }, () => new Uint8Array(n));
  const prevMist = new Array(n).fill(null), prevRec = new Array(n).fill(0), stuckRun = new Array(n).fill(0);
  const launch = new Array(n).fill(null), prevTire = cs.map((c) => c.tire), prevStops = new Array(n).fill(0);
  const openLoss = new Map(); // car -> {t, loss, type}
  let lastLeader = null, lap1Changes = null, steps = 0;
  const gridPos = cs.map((c) => c.pos);

  while (steps * DT < maxSeconds) {
    if (proxyCar && !proxyCar.finished) { if (race.phase === 'racing') PROXIES[proxy](race, proxyCar, proxySt); else { proxyCar.input.throttle = 0; proxyCar.input.brake = 0; } }
    if (race.phase === 'countdown') for (const c of cs) if (c.v > 0) m.movedBeforeGo++;
    race.step(DT); steps++;
    if (proxyCar) holdParked(proxyCar, proxySt);
    for (const e of race.events) {
      if (e.type === 'hit' && !e.kind) {
        m.wallHits++; const sec = T.sectionName(e.car.idx); m.wallBy[sec] = (m.wallBy[sec] || 0) + 1;
        if (e.car.laps < 1) m.wallL1++;
      }
    }
    race.events.length = 0;
    if (race.phase === 'countdown') continue;
    const leadP = race.order[0].progress, firstHalf = leadP < L * 0.5;
    for (let i = 0; i < n; i++) {
      const c = cs[i];
      if (launch[i] === null && c.v > 0.05) launch[i] = race.time;
      if (c.tire !== prevTire[i]) { m.tyreChanges++; prevTire[i] = c.tire; }
      if (c.pitStops !== prevStops[i]) { m.pitLaps.push(c.laps + 1); if (c.laps < 1) m.pitLap1++; prevStops[i] = c.pitStops; }
      if (c.finished) continue;
      if (c.progress > 0) {
        m.samples++;
        if (c.surface === 'grass' || c.surface === 'gravel') m.off++;
        if (c.v < 3 && !c.pit.stage && c !== proxyCar) { m.stuck++; stuckRun[i] += DT; m.maxStuckRun = Math.max(m.maxStuckRun, stuckRun[i]); } else stuckRun[i] = 0;
        if (c.lockup > 0.2) m.lockFrames++;
        if (c.input.throttle >= 0.99 && !c.pit.stage) m.fullThrottle++;
      }
      // mistakes (AI state), time lost estimated against the car's own planned speed over the mistake plus 3 s
      const mt = c.ai.mistake;
      if (mt && mt !== prevMist[i]) {
        m.mistakes[mt.type] = (m.mistakes[mt.type] || 0) + 1;
        if (mt.big) m.bigMistakes++;
        if (cs.some((o) => o !== c && !o.finished && !o.pit.stage && Math.abs(wrapDelta(o.s - c.s, L)) < 6 && Math.abs(o.d - c.d) < 4.5)) m.mistakesBeside++;
        openLoss.set(c, { end: null, loss: 0, type: mt.type, mt });
      }
      prevMist[i] = mt;
      const ol = openLoss.get(c);
      if (ol) {
        const vp = profileAt(T, c.pace.prof, c.s);
        if (c.v > 1 && vp > 1) ol.loss += DT * Math.max(0, 1 - c.v / Math.min(vp, c.cls.vTop));
        if (c.ai.mistake !== ol.mt && ol.end === null) ol.end = race.time;
        if (ol.end !== null && race.time - ol.end > 3) { m.mistakeLoss.push(ol.loss); openLoss.delete(c); }
      }
      if (c.ai.recoverT > 0 && !(prevRec[i] > 0)) m.recoveries++;
      prevRec[i] = c.ai.recoverT;
      for (let j = i + 1; j < n; j++) {
        const o = cs[j];
        if (o.finished || c.pit.stage || o.pit.stage) continue;
        const ds = wrapDelta(o.s - c.s, L), dd = Math.abs(o.d - c.d);
        const hit = Math.abs(ds) < CAR_LEN && dd < CAR_WID;
        if (hit) {
          m.contactFrames++;
          if (race.time <= 12) m.contactFrames12++;
          if (!inContact[i][j]) {
            m.contacts++;
            if (firstHalf) m.contactsL1++;
            else {
              if (Math.abs(ds) > 2.2) m.split.rear++; else m.split.side++;
              if (Math.abs(T.lineKappaAt(c.s)) > CORNER_K) m.split.corner++; else m.split.straight++;
            }
            if (c === proxyCar || o === proxyCar) { m.proxyContacts++; if (proxySt.parked) m.parkedContacts++; }
          }
        }
        inContact[i][j] = hit ? 30 : Math.max(0, inContact[i][j] - 1);
        if (Math.abs(ds) < CAR_LEN && dd >= CAR_WID && dd < 4.5 && c.v > 20) {
          m.sbsFrames++;
          if (Math.abs(T.lineKappaAt(c.s)) > CORNER_K) m.sbsCornerFrames++;
        }
        const d = c.progress - o.progress;
        if (Math.abs(d) < 5) continue;
        const s = d > 0 ? 1 : -1;
        if (sign[i][j] && sign[i][j] !== s && c.progress > 30 && o.progress > 30) m.overtakes++;
        sign[i][j] = s;
      }
    }
    const ld = race.order[0];
    if (lastLeader && ld !== lastLeader && ld.progress > 200) m.leadChanges++;
    lastLeader = ld;
    if (lap1Changes === null && leadP >= L) lap1Changes = cs.filter((c, i) => c.pos !== gridPos[i]).length;
    if (cs.every((c) => c.finished || (c === proxyCar && proxySt.parked))) break; // a parked proxy never finishes
  }
  for (const ol of openLoss.values()) m.mistakeLoss.push(ol.loss);

  const fin = race.order.filter((c) => c.finished);
  const bests = cs.map((c) => c.bestLap).filter(Number.isFinite).sort((a, b) => a - b);
  const win = race.order[0];
  const gaps = fin.map((c) => c.finishTime - win.finishTime);
  const go = launch.filter((x) => x !== null);
  const mistakeCount = Object.values(m.mistakes).reduce((a, b) => a + b, 0);
  const res = {
    track: T.def?.id || (typeof track === 'string' ? track : 'custom'), difficulty, seed, laps, weather, rainAt: rainAt ?? null, proxy, cars: n, finished: fin.length,
    bestLap: r2(bests[0]), medBest: r2(median(bests)), worstBest: r2(bests[bests.length - 1]),
    gapP2: r2(gaps[1]), gapP5: r2(gaps[4]), gapLast: r2(gaps[gaps.length - 1]),
    overtakes: m.overtakes, leadChanges: m.leadChanges, lap1Changes,
    wallHits: m.wallHits, wallL1: m.wallL1, wallBy: m.wallBy,
    contacts: m.contacts, contactSec: r2(m.contactFrames * DT), contactsL1: m.contactsL1, contactSec12: r2(m.contactFrames12 * DT),
    contactsAfterL1: m.contacts - m.contactsL1, split: m.split,
    noseToTailPct: r2(100 * m.split.rear / Math.max(1, m.split.rear + m.split.side)),
    sbsSec: r2(m.sbsFrames * DT), sbsCornerSec: r2(m.sbsCornerFrames * DT),
    offPct: Math.round(1e5 * m.off / Math.max(1, m.samples)) / 1e3, stuckSec: r2(m.stuck * DT), maxStuckRun: r2(m.maxStuckRun), recoveries: m.recoveries,
    mistakes: m.mistakes, mistakeCount, bigMistakes: m.bigMistakes, mistakesBeside: m.mistakesBeside, mistakeLossMean: r2(m.mistakeLoss.reduce((a, b) => a + b, 0) / Math.max(1, m.mistakeLoss.length)),
    lockSec: r2(m.lockFrames * DT), fullThrottlePct: r2(100 * m.fullThrottle / Math.max(1, m.samples)),
    pitStops: cs.reduce((s, c) => s + c.pitStops, 0), pitLaps: m.pitLaps, pitLap1: m.pitLap1, tyreChanges: m.tyreChanges,
    wetCars: cs.filter((c) => c.tire === 'wet').length,
    launch: launch.map(r2), launchMin: r2(Math.min(...go)), launchMax: r2(Math.max(...go)), movedBeforeGo: m.movedBeforeGo,
    proxyContacts: m.proxyContacts, parkedContacts: m.parkedContacts, time: r2(race.time),
  };
  if (opts.keepRace) res.race = race;
  return res;
}

/**
 * Flying-lap times for a solo AI car (time trial, autopilot); lap 1 from a standing start is skipped.
 * `factor`: uniform corner/brake pace factor (1.18 = limit driver). opts.gap instead sets the pace from a gap to the limit lap;
 * opts.variation turns on per-corner pace noise.
 */
export function soloLaps(track, factor, { laps = 3, weather = 'dry', mistakes = false, clean = true, seed = 1, setup, gap = null, variation = 0, difficulty = 'normal' } = {}) {
  const T = typeof track === 'string' ? getTrack(track) : track;
  const race = new Race(T, { mode: 'tt', weather, difficulty, rng: seededRandom(seed) });
  race.autopilot = true;
  if (weather === 'rain') race.setRain(true);
  const p = race.player;
  p.pace = gap != null ? makePace(T, p.cls, { gap, variation }) : makePace(T, p.cls, { factor, variation });
  p.skill = factor ?? 1;
  if (clean) { p.lineBias = 0; p.wander = 0; }
  if (!mistakes) p.ai.mistakeIn = 1e9;
  if (setup) setup(race, p);
  const times = [];
  let t0 = null, hits = 0, off = 0, lock = 0, full = 0, n = 0;
  for (let k = 0; k < 60 * 120 * (laps + 1); k++) {
    race.step(DT);
    for (const e of race.events) if (e.type === 'hit') hits++;
    race.events.length = 0;
    if (race.phase !== 'racing') continue;
    if (t0 === null && p.progress >= T.length) t0 = race.time;
    if (t0 !== null) {
      n++;
      if (p.surface === 'grass' || p.surface === 'gravel') off++;
      if (p.lockup > 0.2) lock++;
      if (p.input.throttle >= 0.99) full++;
      if (p.progress >= T.length * (times.length + 2)) { times.push(race.time - t0); t0 = race.time; if (times.length >= laps) break; }
    }
  }
  return { times: times.map(r2), lap: r2(Math.min(...times)), hits, off, lockSec: r2(lock * DT), fullThrottlePct: r2(100 * full / Math.max(1, n)) };
}
/** Clean solo lap at one pace factor, mistakes off: { lap, hits, off, lockSec, fullThrottlePct }. */
export function soloLap(track, factor, opts = {}) { return soloLaps(track, factor, { laps: 1, ...opts }); }

/**
 * Recovery perturbation scenario: in one long seeded race, every 9 s from t = 25 s a mid-field car at racing speed is
 * displaced 3 m sideways with 0.4 rad of yaw (side and yaw sign from a separate scenario rng, so the AI's own rng stream
 * is untouched). Each case is watched for 8 s: time back to within 5 % of planned speed (the car's own plan, or its
 * traffic-limited target), secondary contact onsets involving the car, and unsafe moments (more than 0.5 rad to the road
 * direction while moving across it with a car within 30 m behind).
 */
export function perturbScenario({ track = 'citadel', difficulty = 'normal', seed = 1, count = 20 } = {}) {
  const T = typeof track === 'string' ? getTrack(track) : track, L = T.length;
  const race = new Race(T, { mode: 'race', difficulty, weather: 'dry', laps: 9, rng: seededRandom(seed), aiOnly: true });
  const pr = seededRandom(seed * 977 + 13);
  const cases = [];
  let cur = null, next = 25;
  const overlap = (a, b) => Math.abs(wrapDelta(b.s - a.s, L)) < CAR_LEN && Math.abs(b.d - a.d) < CAR_WID;
  for (let k = 0; k < 60 * 260 && cases.length < count; k++) {
    race.step(DT); race.events.length = 0;
    if (race.phase !== 'racing') continue;
    if (!cur && race.time >= next) {
      const car = race.order.slice(3, 7).find((c) => !c.finished && !c.pit.stage && c.v > 25 && c.progress > L * 0.3);
      if (!car) { next = race.time + 1; continue; }
      const hw = T.halfAt(car.s);
      let side = pr() < 0.5 ? 1 : -1;
      if (Math.abs(car.d + 3 * side) > hw - 1.2) side = -side;
      const nd = car.d + 3 * side;
      if (race.cars.some((o) => o !== car && Math.abs(wrapDelta(o.s - car.s, L)) < 6 && Math.abs(o.d - nd) < 2.6)) { next = race.time + 0.5; continue; }
      car.x += T.nx[car.idx] * 3 * side; car.z += T.nz[car.idx] * 3 * side;
      car.theta += 0.4 * (pr() < 0.5 ? 1 : -1);
      cur = { car, t0: race.time, rec: null, contacts: 0, unsafe: false, touching: new Set(race.cars.filter((o) => o !== car && overlap(car, o))) };
      continue;
    }
    if (cur) {
      const c = cur.car, dtc = race.time - cur.t0;
      for (const o of race.cars) {
        if (o === c || o.finished || o.pit.stage) continue;
        const ov = overlap(c, o);
        if (ov && !cur.touching.has(o)) cur.contacts++;
        if (ov) cur.touching.add(o); else cur.touching.delete(o);
      }
      const head = Math.abs(wrapAngle(c.theta - T.thetaAt(c.s)));
      if (head > 0.5 && dtc > 0.3 && race.cars.some((o) => o !== c && !o.finished && -wrapDelta(o.s - c.s, L) > 0 && -wrapDelta(o.s - c.s, L) < 30)) cur.unsafe = true;
      const plan = Math.min(profileAt(T, c.ai.prof || c.pace.prof, c.s), (c.ai.vt ?? 1e9) + 1, c.cls.vTop);
      if (cur.rec === null && dtc > 0.2 && !(c.ai.catchT > 0) && c.v >= 0.95 * plan) cur.rec = dtc;
      if (dtc >= 8 || c.finished || c.pit.stage) {
        cases.push({ rec: cur.rec, contacts: cur.contacts, unsafe: cur.unsafe });
        cur = null; next = race.time + 1;
      }
    }
  }
  const n = cases.length, ok = cases.filter((c) => c.rec !== null && c.rec <= 6).length;
  return { track: T.def?.id || 'custom', difficulty, seed, n, recoveredPct: r2(100 * ok / Math.max(1, n)), medianRec: r2(median(cases.map((c) => c.rec ?? 99))),
    secondaryPer10: r2(10 * cases.reduce((a, c) => a + c.contacts, 0) / Math.max(1, n)), unsafe: cases.filter((c) => c.unsafe).length };
}

export const LIMIT_SKILL = LIMIT_FACTOR;
const limitCache = new Map();
/** Reference "limit lap": a clean solo AI lap at skill 1.18 with mistakes off (no wall hits, off-track or lock-ups). */
export function limitLap(track) {
  const id = typeof track === 'string' ? track : track.def?.id;
  if (!limitCache.has(id)) limitCache.set(id, soloLap(track, LIMIT_SKILL));
  return limitCache.get(id);
}

export { wrapAngle };
