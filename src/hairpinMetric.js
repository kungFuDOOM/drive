// Headless traffic metric at the named clog zones (tests only; pure, nothing written to disk).
import { Track } from './track.js';
import { Race, seededRandom } from './race.js';
import { TRACKS } from './tracks/index.js';
import { wrapDelta } from './physics.js';
import { HAIRPINS } from './hairpins.js';

const RING = 120;

function zoneOf(zones, s) {
  for (const z of zones) if (s >= z.s0 && s <= z.s1) return z.id;
  return null;
}

/** One AI race (all cars on autopilot); returns { finished, zones: { id: { stuckSec, crawlSec, bunchSec, pinSec, wallHits, carHits } } }. */
export function runZoneRace(def, difficulty = 'normal', seed = 1) {
  const track = new Track(def), L = track.length, dt = 1 / 60;
  const race = new Race(track, { mode: 'race', laps: 3, weather: 'dry', difficulty, rng: seededRandom(seed) });
  race.autopilot = true;
  const zones = HAIRPINS[def.id] || [];
  const res = {};
  for (const z of zones) res[z.id] = { stuckSec: 0, crawlSec: 0, bunchSec: 0, pinSec: 0, wallHits: 0, carHits: 0 };
  const cars = race.cars, n = cars.length;
  const ring = cars.map(() => new Float64Array(RING)), head = new Int32Array(n), fill = new Int32Array(n);
  const sampled = new Array(n).fill(false);
  for (let k = 0; k < 600 * 60; k++) {
    race.step(dt);
    for (const e of race.events) {
      if (e.type !== 'hit' || !e.car) continue;
      const id = zoneOf(zones, e.car.s);
      if (!id) continue;
      if (e.kind) res[id].carHits++; else res[id].wallHits++;
    }
    race.events.length = 0;
    for (let i = 0; i < n; i++) {
      const c = cars[i];
      sampled[i] = race.phase === 'racing' && !c.finished && !c.pit.stage && c.progress > 30;
    }
    for (let i = 0; i < n; i++) {
      const c = cars[i];
      if (!sampled[i]) { fill[i] = 0; continue; }
      const r = ring[i];
      const old = fill[i] >= RING ? r[head[i]] : null;
      r[head[i]] = c.progress; head[i] = (head[i] + 1) % RING; fill[i] = Math.min(RING, fill[i] + 1);
      const id = zoneOf(zones, c.s);
      if (!id) continue;
      const z = res[id];
      if (c.v < 3 || (old !== null && c.progress - old < 6)) z.stuckSec += dt;
      if (c.v < 8) {
        z.crawlSec += dt;
        for (let j = 0; j < n; j++) {
          if (j === i || !sampled[j]) continue;
          const o = cars[j];
          if (o.v < 8 && Math.abs(wrapDelta(o.s - c.s, L)) < 12) { z.bunchSec += dt; break; }
        }
      }
      if ((c.scrape || 0) > 0 || c.d > track.leftWall[c.idx] - 1.4 || c.d < -(track.rightWall[c.idx] - 1.4)) z.pinSec += dt;
    }
    if (cars.every((c) => c.finished)) break;
  }
  return { finished: cars.every((c) => c.finished), zones: res };
}

/** { trackId: { diff: { finished, zones } } } over the given tracks / difficulties; seeds are summed. */
export function runHairpinMetric({ tracks = TRACKS, diffs = ['normal'], seeds = [1] } = {}) {
  const out = {};
  for (const def of tracks) {
    out[def.id] = {};
    for (const diff of diffs) {
      let agg = null;
      for (const seed of seeds) {
        const r = runZoneRace(def, diff, seed);
        if (!agg) agg = r;
        else {
          agg.finished = agg.finished && r.finished;
          for (const id in r.zones) for (const k in r.zones[id]) agg.zones[id][k] += r.zones[id][k];
        }
      }
      out[def.id][diff] = agg;
    }
  }
  return out;
}
