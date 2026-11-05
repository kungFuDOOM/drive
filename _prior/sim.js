// Race simulation: car physics, AI, pit stops, weather. No rendering.
import {
  clamp, lerp, mod, angDiff, advanceLap, tireGrip, wearRate, slipstream, rainLevel,
  rankCars, pitLaneWidth, inPitRange, inPitBox, hasFinished,
} from './logic.js';
import { HALF, locate, pointAt } from './track.js';

export const CLASSES = {
  gp: { key: 'gp', label: 'GP', vtop: 80, accel: 34, brake: 72, aLat: 64, yawMax: 2.5 },
  indy: { key: 'indy', label: 'INDY', vtop: 86, accel: 30, brake: 64, aLat: 56, yawMax: 2.0 },
};

// Made-up teams and call-signs. No real-world references.
export const ROSTER = [
  { team: 'Nova Quill', tag: 'KIRA', cls: 'gp', color: 0x13c4ff, accent: 0xffffff },
  { team: 'Ember Arc', tag: 'BOLT', cls: 'gp', color: 0xff5a1f, accent: 0x262626 },
  { team: 'Tidal Forge', tag: 'MAXO', cls: 'gp', color: 0x2a5dff, accent: 0xffd23f },
  { team: 'Mossback', tag: 'TESS', cls: 'gp', color: 0x3fae49, accent: 0xf2f2f2 },
  { team: 'Violet Gale', tag: 'JUNO', cls: 'gp', color: 0xa054ff, accent: 0xffe14d },
  { team: 'Brass Comet', tag: 'RIVA', cls: 'indy', color: 0xd9a21b, accent: 0x1b1b1b },
  { team: 'Static Fox', tag: 'PELL', cls: 'indy', color: 0xff4f9a, accent: 0x1b1b1b },
  { team: 'Cobalt Hare', tag: 'ORYN', cls: 'indy', color: 0x3345c8, accent: 0xff7a1f },
  { team: 'Sunder Moth', tag: 'QUIL', cls: 'indy', color: 0xc8352f, accent: 0xf7e9c8 },
  { team: 'Pale Anchor', tag: 'DASH', cls: 'indy', color: 0xd8dde6, accent: 0x1f6fff },
];
export const PLAYER_GRID_SLOT = 6;
const GRID_ORDER = [3, 8, 1, 6, 0, 5, 9, 2, 7, 4]; // roster index per slot (0 = pole)

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

function makeCar(def, slot, track, isPlayer, rand) {
  const row = slot >> 1, side = slot & 1 ? 3.2 : -3.2;
  const idx = mod(track.N - (6 + 10 * row) / track.ds, track.N);
  const p = pointAt(track, idx, side);
  return {
    id: slot, def, cls: CLASSES[def.cls], isPlayer, auto: !isPlayer,
    name: isPlayer ? 'YOU' : def.tag,
    x: p.x, z: p.z, theta: p.theta, vx: 0, vz: 0, speed: 0, steer: 0,
    idx, lat: side, lap: -1, progress: idx - track.N, finishTime: null,
    tire: 'dry', wear: 0, grip: 1, slip: 0, offTrack: false, hitWall: 0,
    wantPit: false, laneOff: 0, aheadDist: 99, aheadLat: 0,
    pit: { state: 'none', t: 0, choice: null, cooldown: false, wait: 0 },
    skill: isPlayer ? 0.97 : 0.9 + rand() * 0.08,
    rank: slot + 1, stops: 0,
  };
}

export function createRace({ playerClass = 'gp', laps = 3, track, seed = 7, rainAt = null, autopilot = false }) {
  const rand = rng(seed);
  const pRoster = playerClass === 'indy' ? 5 : 0;
  const cars = [];
  GRID_ORDER.forEach((ri, i) => cars.push(null));
  // Place the player on a fixed grid slot, AI fill the other slots.
  const order = GRID_ORDER.filter((r) => r !== pRoster);
  let k = 0;
  for (let slot = 0; slot < 10; slot++) {
    const isP = slot === PLAYER_GRID_SLOT;
    const ri = isP ? pRoster : order[k++];
    cars[slot] = makeCar(ROSTER[ri], slot, track, isP, rand);
  }
  const player = cars.find((c) => c.isPlayer);
  player.auto = autopilot;
  return {
    track, cars, player, laps, time: 0, phase: 'grid', lightsT: 0, lights: 0,
    rain: 0, rainAt: rainAt ?? 18 + rand() * 22, events: [], ranking: cars.slice(),
    resultsAt: null,
  };
}

export function startLights(race) {
  if (race.phase === 'grid') { race.phase = 'lights'; race.lightsT = 0; }
}

// ---------- AI ----------
function aiControl(car, race) {
  const tr = race.track, N = tr.N, ds = tr.ds;
  const cls = car.cls, speed = Math.max(car.speed, 0);
  const look = 9 + speed * 0.42;
  const fi = car.idx + look / ds;
  const j0 = Math.floor(fi), fr = fi - j0;
  const a = tr.pts[mod(j0, N)], b = tr.pts[mod(j0 + 1, N)];
  let lat = lerp(a.lineOff, b.lineOff, fr) + car.laneOff;
  const lim = HALF - 2.4;
  lat = clamp(lat, -lim, lim);
  const rel = mod(j0 + 80, N); // 0 at start of approach window
  const pitting = car.pit.state !== 'none';
  if (car.wantPit && !pitting) {
    if (rel >= 0 && rel < 55) lat = HALF - 2; // hug right before the lane opens
    else if (inPitRange(j0, N)) lat = HALF + pitLaneWidth(j0, N) * 0.5;
  }
  const cx = lerp(a.x, b.x, fr) + lerp(a.rx, b.rx, fr) * lat;
  const cz = lerp(a.z, b.z, fr) + lerp(a.rz, b.rz, fr) * lat;
  const err = angDiff(Math.atan2(cx - car.x, cz - car.z), car.theta);
  const steer = clamp(-err * 2.4, -1, 1);

  // speed target from upcoming corners
  const aLat = cls.aLat * 0.8 * car.skill * Math.pow(Math.max(car.grip, 0.3), 1.4);
  const brk = cls.brake * 0.5 * Math.max(car.grip, 0.4);
  let tgt = cls.vtop * car.skill;
  const i0 = Math.floor(car.idx);
  for (let j = 0; j < 55; j++) {
    const k = Math.abs(tr.pts[mod(i0 + j, N)].kap) * 0.85;
    const vc = Math.min(cls.vtop, Math.sqrt(aLat / Math.max(k, 1e-4)));
    const dist = Math.max(0, j - (car.idx - i0)) * ds;
    tgt = Math.min(tgt, Math.sqrt(vc * vc + 2 * brk * dist));
  }
  if (car.wantPit && inPitRange(car.idx, N) && mod(car.idx + 25, N) > 12) tgt = Math.min(tgt, 30);
  if (car.aheadDist < 6 && Math.abs(car.aheadLat) < 2.5 && car.speed > car.aheadSpeed) tgt = Math.min(tgt, car.aheadSpeed * 0.95);
  const gas = clamp((tgt - speed) / 3, 0, 1);
  const brake = speed > tgt + 1.5 ? clamp((speed - tgt) / 10, 0, 1) : 0;
  return { steer, gas, brake };
}

// ---------- physics ----------
function stepCar(car, inp, dt, race) {
  const tr = race.track, N = tr.N, cls = car.cls;
  const raced = race.phase === 'racing' || race.phase === 'results';
  car.grip = tireGrip(car.tire, car.wear, race.rain) * (car.offTrack ? 0.65 : 1);

  let { steer, gas, brake } = inp;
  const pit = car.pit;
  if (!raced) { gas = 0; brake = 1; steer = 0; }
  if (pit.state !== 'none') { gas = 0; brake = car.speed > 1 ? 1 : 0; steer = 0; }
  car.steer += clamp(steer - car.steer, -dt * 9, dt * 9);

  const fx = Math.sin(car.theta), fz = Math.cos(car.theta);
  let vtop = cls.vtop * (1 + 0.07 * car.slip) * (1 - 0.04 * car.wear);
  const inLane = car.lat > HALF + 1.5 && inPitRange(car.idx, N);
  if (inLane) vtop = Math.min(vtop, 34);
  if (car.offTrack) vtop *= 0.6;

  // steering: yaw limited by grip so rain/wear => understeer
  const sp = Math.hypot(car.vx, car.vz);
  const yawCap = Math.min(cls.yawMax, (cls.aLat * car.grip) / Math.max(sp, 8));
  const yaw = car.steer * yawCap * Math.min(1, sp / 6) * (car.speed < -0.5 ? -1 : 1);
  car.theta -= yaw * dt;
  const nfx = Math.sin(car.theta), nfz = Math.cos(car.theta);

  let vf = car.vx * nfx + car.vz * nfz;
  let lx = car.vx - nfx * vf, lz = car.vz - nfz * vf;
  let acc = 0;
  if (gas > 0) acc += cls.accel * gas * Math.max(0, 1 - Math.pow(Math.max(vf, 0) / vtop, 2.2)) * (0.75 + 0.25 * car.grip);
  if (brake > 0) acc -= (vf > 0.5 ? cls.brake * (0.6 + 0.4 * car.grip) : 12) * brake;
  acc -= (2 + 0.0007 * vf * vf) * Math.sign(vf);
  if (car.offTrack) acc -= 22 * Math.sign(vf);
  if (vf > vtop) acc -= (vf - vtop) * 3;
  vf += acc * dt;
  if (vf < -8) vf = -8;
  const k = Math.exp(-9 * car.grip * dt);
  lx *= k; lz *= k;
  car.vx = nfx * vf + lx; car.vz = nfz * vf + lz;
  car.speed = vf;
  car.x += car.vx * dt; car.z += car.vz * dt;

  // tire wear
  const load = Math.abs(car.steer) * clamp(sp / cls.vtop, 0, 1) + (brake > 0 ? 0.3 : 0);
  if (raced) car.wear = clamp(car.wear + wearRate(car.tire, race.rain, load) * dt, 0, 1);

  // locate + walls
  const L = locate(tr, car.x, car.z, Math.round(car.idx));
  const p = tr.pts[L.i];
  const extra = pitLaneWidth(L.idx, N);
  const wallR = HALF + extra + 2.6, wallL = HALF + 2.6;
  car.hitWall = Math.max(0, car.hitWall - dt);
  let lat = L.lat;
  if (lat > wallR || lat < -wallL) {
    const lim = lat > 0 ? wallR : -wallL;
    const over = lat - lim;
    car.x -= p.rx * over; car.z -= p.rz * over;
    const vout = car.vx * p.rx + car.vz * p.rz;
    if ((over > 0 && vout > 0) || (over < 0 && vout < 0)) {
      car.vx -= p.rx * vout * 1.2; car.vz -= p.rz * vout * 1.2;
      car.vx *= 0.93; car.vz *= 0.93;
      car.hitWall = 0.25;
      if (Math.abs(vout) > 6) race.events.push({ type: 'bump', car });
    }
    lat = lim;
  }
  car.lat = lat;
  car.offTrack = lat < -HALF || lat > HALF + extra;
  const lap = advanceLap({ lap: car.lap, idx: car.idx }, L.idx, N);
  if (lap.lap > car.lap && car.finishTime == null && raced) {
    if (hasFinished(lap.lap, race.laps)) {
      car.finishTime = race.time;
      car.auto = true;
      race.events.push({ type: 'finish', car });
    } else if (lap.lap >= 0) race.events.push({ type: 'lap', car, lap: lap.lap });
  }
  car.lap = lap.lap; car.idx = L.idx; car.progress = lap.progress;

  // pit logic
  const box = inPitBox(car.idx, N);
  if (!box) pit.cooldown = false;
  if (pit.state === 'none' && box && car.lat > HALF + 3.5 && !pit.cooldown && car.finishTime == null) {
    pit.state = 'stopping'; pit.wait = 0; pit.choice = null;
    if (car.auto) pit.choice = race.rain > 0.35 ? 'wet' : 'dry';
    race.events.push({ type: 'pitin', car });
  }
  if (pit.state === 'stopping') {
    pit.wait += dt;
    if (!pit.choice && pit.wait > 9) pit.choice = race.rain > 0.35 ? 'wet' : 'dry';
    if (pit.choice && Math.abs(car.speed) < 1.5) { pit.state = 'service'; pit.t = 2.4; }
  } else if (pit.state === 'service') {
    pit.t -= dt;
    if (pit.t <= 0) {
      car.tire = pit.choice; car.wear = 0; car.wantPit = false; car.stops++;
      pit.state = 'none'; pit.cooldown = true;
      race.events.push({ type: 'pitout', car });
    }
  }
}

export function choosePitTire(race, tire) {
  const c = race.player;
  if (c.pit.state === 'stopping' && !c.pit.choice) c.pit.choice = tire;
}

function updateAIPitDecision(car, race) {
  const N = race.track.N;
  if (car.pit.state !== 'none') return;
  const rel = mod(car.idx + 100, N);
  if (rel < 74) { // approach window, before the lane opens
    const lapOk = car.lap >= 0 && car.lap <= race.laps - 2;
    const need = (race.rain > 0.45 && car.tire === 'dry') || (race.rain < 0.12 && car.tire === 'wet') || car.wear > 0.7;
    car.wantPit = lapOk && need;
  } else if (rel > 140) car.wantPit = false;
}

const CIRCLES = [-1.9, 1.9];
function collide(a, b) {
  for (const oa of CIRCLES) for (const ob of CIRCLES) {
    const ax = a.x + Math.sin(a.theta) * oa, az = a.z + Math.cos(a.theta) * oa;
    const bx = b.x + Math.sin(b.theta) * ob, bz = b.z + Math.cos(b.theta) * ob;
    const dx = bx - ax, dz = bz - az, d = Math.hypot(dx, dz), min = 2.9;
    if (d < min && d > 1e-4) {
      const push = (min - d) / 2, nx = dx / d, nz = dz / d;
      a.x -= nx * push; a.z -= nz * push; b.x += nx * push; b.z += nz * push;
      // rear car loses speed
      const rear = (a.progress < b.progress) ? a : b;
      rear.vx *= 0.985; rear.vz *= 0.985;
    }
  }
}

export function stepRace(race, dt, playerInput) {
  const tr = race.track, N = tr.N;
  race.events.length = 0;
  if (race.phase === 'lights') {
    race.lightsT += dt;
    race.lights = clamp(Math.floor((race.lightsT - 0.6) / 0.6) + 1, 0, 5);
    if (race.lightsT > 4.0) { race.phase = 'racing'; race.time = 0; race.lights = 0; race.events.push({ type: 'go' }); }
  } else if (race.phase === 'racing' || race.phase === 'results') {
    race.time += dt;
    race.rain = rainLevel(race.time, race.rainAt);
  }
  const cars = race.cars;
  // neighbour info (car ahead in my heading)
  for (const c of cars) {
    c.aheadDist = 99; c.aheadLat = 0; c.aheadSpeed = 0;
    const fx = Math.sin(c.theta), fz = Math.cos(c.theta);
    for (const o of cars) {
      if (o === c) continue;
      const dx = o.x - c.x, dz = o.z - c.z;
      const f = dx * fx + dz * fz - 3.5; // nose to tail
      const l = dz * fx - dx * fz; // + = to my right
      if (f > -2 && f < c.aheadDist && Math.abs(l) < 4) { c.aheadDist = f; c.aheadLat = l; c.aheadSpeed = o.speed; }
    }
    const target = slipstream(c.aheadDist, c.aheadLat) > 0 && c.speed > 20 ? slipstream(c.aheadDist, c.aheadLat) : 0;
    c.slip += (Math.min(1, target * 2.2) - c.slip) * Math.min(1, dt * (target > c.slip ? 3 : 1.5));
  }
  for (const c of cars) {
    if (c.auto) {
      if (c.pit.state === 'none') updateAIPitDecision(c, race);
      // lane changes to avoid the car ahead
      let want = 0;
      if (c.aheadDist < 15 && c.pit.state === 'none' && !c.wantPit) {
        want = c.aheadLat > 0 ? -4 : 4;
        const base = tr.pts[Math.floor(c.idx) % N].lineOff;
        if (Math.abs(base + want) > HALF - 2.4) want = -want;
      }
      c.laneOff += clamp(want - c.laneOff, -dt * 3.5, dt * 3.5);
    }
    const inp = c.auto ? aiControl(c, race) : playerInput;
    stepCar(c, inp, dt, race);
  }
  for (let i = 0; i < cars.length; i++) for (let j = i + 1; j < cars.length; j++) collide(cars[i], cars[j]);

  race.ranking = rankCars(cars);
  race.ranking.forEach((c, i) => (c.rank = i + 1));
  if (race.phase === 'racing' && race.player.finishTime != null) {
    race.phase = 'results'; race.resultsAt = race.time + 4;
  }
  if (race.phase === 'results' && race.time >= race.resultsAt) race.phase = 'done';
}
