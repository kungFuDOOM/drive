// AI recovery and "a stopped car is not a cork": a spun / stalled car gets going again, and the field goes round a frozen car
// (at a Highpine / Lampwick hairpin and in the walled Citadel Squeeze) without queueing, hitting walls or each other.
import { describe, it, expect } from 'vitest';
import { Track } from './track.js';
import { Race, seededRandom } from './race.js';
import { TRACKS } from './tracks/index.js';
import { wrapAngle } from './physics.js';
import { HAIRPINS } from './hairpins.js';

const DT = 1 / 60;
const def = (id) => TRACKS.find((d) => d.id === id);
const zone = (tid, id) => HAIRPINS[tid].find((z) => z.id === id);

/** Race (seed 1, Normal, autopilot) until race.order[3] has finished a lap and sits in [s0, s1]. */
function setup(tid, s0, s1) {
  const T = new Track(def(tid));
  const race = new Race(T, { mode: 'race', laps: 3, weather: 'dry', difficulty: 'normal', rng: seededRandom(1) });
  race.autopilot = true;
  for (let k = 0; k < 60 * 300; k++) {
    race.step(DT); race.events.length = 0;
    const c = race.order[3];
    if (race.phase === 'racing' && c.progress > T.length && !c.pit.stage && c.s >= s0 && c.s <= s1) return { T, race, car: c };
  }
  throw new Error(`no mid-field car reached ${tid} ${s0}-${s1}`);
}

function spin(tid, s0, s1, dTheta) {
  const { T, race, car } = setup(tid, s0, s1);
  car.v = 0; car.theta += dTheta;
  const p0 = car.progress;
  let rec = Infinity;
  for (let k = 0; k < 600; k++) {
    race.step(DT); race.events.length = 0;
    if (rec === Infinity && car.v > 10 && Math.abs(wrapAngle(T.thetaAt(car.s) - car.theta)) < 0.5) rec = (k + 1) * DT;
  }
  return { rec, gain: car.progress - p0 };
}

function freeze(tid, s0, s1, centre = false) {
  const { T, race, car } = setup(tid, s0, s1);
  if (centre) { const p = T.at(car.s, 0); car.x = p.x; car.z = p.z; car.d = 0; }
  const fx = car.x, fz = car.z, ft = car.theta, fs = car.s;
  const behind = race.cars.filter((c) => c !== car && !c.finished && c.progress < car.progress);
  const near = behind.filter((c) => car.progress - c.progress < 60);
  const p0 = new Map(behind.map((c) => [c, c.progress]));
  const sq = zone('citadel', 'squeeze');
  let slow = 0, wallHits = 0, carHits = 0;
  for (let k = 0; k < 600; k++) {
    race.step(DT);
    for (const e of race.events) if (e.type === 'hit' && e.car && e.car.s >= sq.s0 && e.car.s <= sq.s1) { if (e.kind) carHits++; else wallHits++; }
    race.events.length = 0;
    car.v = 0; car.x = fx; car.z = fz; car.theta = ft;
    for (const c of near) if (c.v < 3 && !c.pit.stage) slow += DT;
  }
  const gains = behind.map((c) => c.progress - p0.get(c));
  return { gains, slow, wallHits, carHits, fs, n: behind.length };
}

describe('AI stuck recovery', () => {
  // one W window per track for Highpine (Ridge); a backwards car at Lodge does turn round but its U-turn runs onto the gravel
  // trap (drag caps it near 7 m/s), so it makes ~50 m in 10 s there. Lodge is covered by the frozen-car test below.
  const cases = [
    ['highpine', zone('highpine', 'ridge').s0 + 20, zone('highpine', 'ridge').s1 - 20],
    ['lampwick', zone('lampwick', 'hotelOut').s0 + 10, zone('lampwick', 'hotelOut').s1 - 20],
    ['lampwick', zone('lampwick', 'clock').s0 + 20, zone('lampwick', 'clock').s1 - 20],
    ['citadel', 1420, 1440],
  ];
  for (const [tid, s0, s1] of cases) for (const [label, dTheta] of [['sideways', Math.PI / 2], ['backwards', Math.PI]]) {
    it(`${tid} s${s0}-${s1}: a ${label} stopped car is going again within 8 s`, () => {
      const r = spin(tid, s0, s1, dTheta);
      expect(r.rec).toBeLessThanOrEqual(8);
      expect(r.gain).toBeGreaterThanOrEqual(60);
    }, 30000);
  }
});

describe('a frozen car is not a cork', () => {
  it('Highpine Ridge apex: every car behind gets by', () => {
    const z = zone('highpine', 'ridge');
    const r = freeze('highpine', z.apex - 10, z.apex + 10);
    expect(r.n).toBeGreaterThan(0);
    for (const g of r.gains) expect(g).toBeGreaterThan(150);
  }, 30000);
  it('Highpine Lodge apex: every car behind gets by', () => {
    const z = zone('highpine', 'lodge');
    const r = freeze('highpine', z.apex - 10, z.apex + 10);
    expect(r.n).toBeGreaterThan(0);
    for (const g of r.gains) expect(g).toBeGreaterThan(150);
  }, 30000);
  for (const centre of [false, true]) it(`Citadel Squeeze s1420-1440${centre ? ', frozen mid-road' : ''}: single file round it, no walls, no pile-up`, () => {
    const r = freeze('citadel', 1420, 1440, centre);
    console.log('squeeze freeze', centre, JSON.stringify({ ...r, gains: r.gains.map((g) => Math.round(g)) }));
    expect(r.n).toBeGreaterThan(0);
    for (const g of r.gains) expect(g).toBeGreaterThan(150);
    expect(r.slow).toBeLessThanOrEqual(1.5);
    expect(r.wallHits).toBeLessThanOrEqual(1);
    expect(r.carHits).toBeLessThanOrEqual(3);
  }, 30000);
});
