// Career season: calendar, championship points, persistent rivals, upgrade points.
// Pure data (storage injected). Does not touch physics, controls or the renderer.
import { DIFFICULTY } from './progress.js';
import { TEAMS } from './teams.js';
import { TRACK_IDS } from './tracks/index.js';
import { carNumber } from './cars.js';
import { sanitizeName, sanitizeNumber, sanitizeTeam, defaultLivery } from './livery.js';

export const CAREER_KEY = 'drive-career-v1';
export const GARAGE_KEY = 'drive-garage-v1';

/** Classic top-10 scale. Positions outside the top 10 score nothing. */
export const POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
export const pointsFor = (pos) => POINTS[pos - 1] || 0;

/** Championship points needed in a GP season to get a Speedway recruitment offer.
 *  Six rounds × 25 for a win = 150 max; ~60% of that. */
export const SPEEDWAY_OFFER_POINTS = 90;
/** Made-up Speedway outfit that extends the offer. Player keeps their own team/livery on accept. */
export const SPEEDWAY_RECRUITER = {
  name: 'Ashlane Speed Co.',
  tag: 'ASH',
  livery: { pattern: 'flash', c1: 0xff6a00, c2: 0x1a1a22, c3: 0xffd24a, number: 1 },
};

export const UPGRADE_KEYS = ['engine', 'aero', 'brakes', 'tires'];
export const UPGRADE_MAX = 5;
/** Research points to buy the next level (index = current level). */
export const UPGRADE_COST = [4, 6, 8, 10, 12];
/**
 * Per-level multipliers on the class stat. Five levels is the ceiling.
 * engine: top speed and acceleration. aero: downforce. brakes: brake authority. tires: less wear.
 */
export const BUMPS = {
  engine: { vTop: 0.008, accel: 0.01 },
  aero: { down: 0.02 },
  brakes: { brake: 0.015 },
  tires: { wear: -0.04 },
};
export const UPGRADE_LABEL = {
  engine: 'ENGINE', aero: 'AERO', brakes: 'BRAKES', tires: 'TIRES',
};
export const UPGRADE_BLURB = {
  engine: 'Top speed and pull out of corners',
  aero: 'More grip through fast corners',
  brakes: 'Shorter stopping distance',
  tires: 'Tyres last longer',
};
/** Research points for a finish, before the difficulty scale. Every finisher gets something. */
export const UPGRADE_AWARD = [8, 7, 6, 5, 5, 4, 4, 3, 3, 2];

const DEFAULT_DRIVER = 'Casey Morrow';

const clampInt = (n, a, b, fallback) => {
  const v = typeof n === 'string' ? parseInt(n, 10) : n;
  if (!Number.isFinite(v)) return fallback;
  return Math.min(b, Math.max(a, Math.round(v)));
};

/** Nine original rivals. Ratings are persistent pace (higher is faster) and are scaled by difficulty at race time. */
export function defaultRivals() {
  const spec = [
    ['quill', 'Mara Quill', 1, 94],
    ['voss', 'Jonah Voss', 2, 90],
    ['calder', 'Nia Calder', 3, 86],
    ['hale', 'Soren Hale', 4, 83],
    ['frost', 'Imani Frost', 5, 80],
    ['bramble', 'Theo Bramble', 6, 77],
    ['pell', 'Ren Pell', 7, 74],
    ['march', 'Odette March', 8, 71],
    ['lind', 'Casper Lind', 9, 68],
  ];
  return spec.map(([id, name, teamIndex, rating]) => ({
    id, name, number: carNumber(teamIndex), teamIndex, rating,
  }));
}

export function defaultGarage() {
  const t = TEAMS[0];
  const number = 1;
  return {
    driver: { name: DEFAULT_DRIVER, number },
    team: sanitizeTeam({
      name: t.name, tag: t.tag,
      livery: { ...defaultLivery(), pattern: 'chevrons', c1: t.c1, c2: t.c2, number },
    }),
  };
}

export function sanitizeGarage(raw) {
  const d = defaultGarage();
  const o = raw && typeof raw === 'object' ? raw : {};
  const number = sanitizeNumber(o.driver?.number ?? o.team?.livery?.number, d.driver.number);
  const driverName = sanitizeName(o.driver?.name) || d.driver.name;
  const team = sanitizeTeam({
    name: o.team?.name, tag: o.team?.tag,
    livery: { ...(o.team?.livery || {}), number },
  }, d.team.name);
  return { driver: { name: driverName, number }, team };
}

export function loadGarage(storage) {
  try {
    const raw = storage?.getItem(GARAGE_KEY);
    if (!raw) return defaultGarage();
    return sanitizeGarage(JSON.parse(raw));
  } catch { return defaultGarage(); }
}
export function saveGarage(storage, garage) {
  try { storage?.setItem(GARAGE_KEY, JSON.stringify(sanitizeGarage(garage))); return true; } catch { return false; }
}

/** Effective AI skill for a rival rating at a difficulty. Higher rating is always faster; Easy is always slower than Hard. */
export function rivalSkill(rating, difficulty = 'normal') {
  const d = DIFFICULTY[difficulty] || DIFFICULTY.normal;
  const delta = (clampInt(rating, 50, 99, 80) - 80) / 20;
  const s = d.skill + delta * d.spread;
  return Math.round(Math.min(1.02, Math.max(0.8, s)) * 1000) / 1000;
}

export function upgradePointsFor(pos, difficulty = 'normal') {
  const base = UPGRADE_AWARD[pos - 1] ?? 0;
  const mult = difficulty === 'hard' ? 1.25 : difficulty === 'easy' ? 0.75 : 1;
  return Math.round(base * mult);
}

/** A new class object with small, capped stat bumps. Never mutates `cls` or CLASSES. */
export function applyUpgrades(cls, levels) {
  const lv = (k) => clampInt(levels?.[k], 0, UPGRADE_MAX, 0);
  const e = lv('engine'), a = lv('aero'), b = lv('brakes'), t = lv('tires');
  return {
    ...cls,
    vTop: cls.vTop * (1 + BUMPS.engine.vTop * e),
    accel: cls.accel * (1 + BUMPS.engine.accel * e),
    down: cls.down * (1 + BUMPS.aero.down * a),
    brake: cls.brake * (1 + BUMPS.brakes.brake * b),
    wear: cls.wear * (1 + BUMPS.tires.wear * t),
  };
}

/** Grid pace of the player's car. Fresh career sits midfield (rating 76); a full upgrade tree reaches 100. */
export function playerRating(career) {
  const lv = UPGRADE_KEYS.reduce((s, k) => s + (career?.upgrades?.[k] || 0), 0);
  return Math.round((76 + lv * 1.2) * 10) / 10;
}

export function nextUpgradeCost(career, key) {
  if (!UPGRADE_KEYS.includes(key)) return null;
  const lv = career.upgrades[key] || 0;
  if (lv >= UPGRADE_MAX) return null;
  return UPGRADE_COST[lv];
}

/**
 * Spend research points on one level. Refuses unknown parts, a maxed part, or a short balance.
 * Returns { ok, reason?, level, cost, left }.
 */
export function buyUpgrade(career, key) {
  if (!UPGRADE_KEYS.includes(key)) return { ok: false, reason: 'unknown', level: 0, cost: 0, left: career?.upgradePoints || 0 };
  const lv = career.upgrades[key] || 0;
  if (lv >= UPGRADE_MAX) return { ok: false, reason: 'max', level: lv, cost: 0, left: career.upgradePoints };
  const cost = UPGRADE_COST[lv];
  if (career.upgradePoints < cost) return { ok: false, reason: 'points', level: lv, cost, left: career.upgradePoints };
  career.upgradePoints -= cost;
  career.upgrades[key] = lv + 1;
  return { ok: true, level: lv + 1, cost, left: career.upgradePoints };
}

function sanitizeRival(raw, fallback) {
  const o = raw && typeof raw === 'object' ? raw : {};
  const id = String(o.id || fallback.id).toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16) || fallback.id;
  return {
    id,
    name: sanitizeName(o.name) || fallback.name,
    number: sanitizeNumber(o.number, fallback.number),
    teamIndex: clampInt(o.teamIndex, 1, TEAMS.length - 1, fallback.teamIndex),
    rating: clampInt(o.rating, 50, 99, fallback.rating),
  };
}

function sanitizeHistory(list, ids) {
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const h of list) {
    if (!h || typeof h !== 'object' || !TRACK_IDS.includes(h.trackId)) continue;
    const places = {};
    if (h.places && typeof h.places === 'object') {
      for (const [id, pos] of Object.entries(h.places)) {
        if (id !== 'player' && !ids.has(id)) continue;
        const p = clampInt(pos, 1, 24, 0);
        if (p) places[id] = p;
      }
    }
    out.push({
      trackId: h.trackId,
      pos: clampInt(h.pos, 1, 24, 0) || null,
      points: clampInt(h.points, 0, 25, 0),
      upgrade: clampInt(h.upgrade, 0, 99, 0),
      places,
    });
    if (out.length >= 64) break;
  }
  return out;
}


/** Career class id: 'gp' or 'speedway'. Unknown values fall back to gp. */
export function careerClass(career) {
  return career?.cls === 'speedway' ? 'speedway' : 'gp';
}

/** Player championship points so far this season. */
export function playerPoints(career) {
  return clampInt(career?.points?.player, 0, 100000, 0);
}

/** Points still needed for a Speedway offer during a GP season (0 once at/above the bar). */
export function speedwayPtsNeeded(career) {
  if (careerClass(career) !== 'gp') return 0;
  return Math.max(0, SPEEDWAY_OFFER_POINTS - playerPoints(career));
}

/**
 * True when a completed GP season earns the Speedway recruitment screen.
 * Already-Speedway careers and incomplete seasons never qualify.
 */
export function speedwayOfferEligible(career) {
  if (!career || !career.complete) return false;
  if (careerClass(career) !== 'gp') return false;
  return playerPoints(career) >= SPEEDWAY_OFFER_POINTS;
}

/** Short line when a GP season ends below the scout threshold. */
export function speedwayMissMessage(career) {
  const scored = playerPoints(career);
  return `Speedway scouts wanted ${SPEEDWAY_OFFER_POINTS} pts — you scored ${scored}`;
}

/**
 * Accept the Speedway seat. Keeps driver + custom team/livery; resets upgrade levels;
 * unlocks Speedway for quick race via the returned flag. Starts the next season in Speedway.
 * Returns { ok, unlocked } or { ok:false, reason }.
 */
export function acceptSpeedwayOffer(career) {
  if (!speedwayOfferEligible(career)) return { ok: false, reason: 'ineligible' };
  career.upgrades = { engine: 0, aero: 0, brakes: 0, tires: 0 };
  // Keep driver, custom team name and livery; class change resets part levels only.
  newSeason(career);
  career.cls = 'speedway';
  career.speedwayOffer = null;
  return { ok: true, unlocked: true };
}

/** Decline the offer and run another GP season. */
export function declineSpeedwayOffer(career) {
  if (!speedwayOfferEligible(career)) return { ok: false, reason: 'ineligible' };
  newSeason(career);
  career.cls = 'gp';
  career.speedwayOffer = null;
  return { ok: true };
}

/**
 * Fresh season. `garage` seeds the driver and the team (the create-a-team editor).
 * input: { driverName, number, team, difficulty, laps, weather }.
 */
export function newCareer(input = {}, garage = null) {
  const g = sanitizeGarage(garage || defaultGarage());
  const number = sanitizeNumber(input.number ?? input.driver?.number ?? g.driver.number, g.driver.number);
  const driverName = sanitizeName(input.driverName ?? (typeof input.driver === 'string' ? input.driver : input.driver?.name) ?? g.driver.name) || g.driver.name;
  const teamIn = input.team || g.team;
  const team = sanitizeTeam({ ...teamIn, livery: { ...(teamIn.livery || {}), number } }, g.team.name);
  const difficulty = DIFFICULTY[input.difficulty] ? input.difficulty : 'normal';
  const weather = input.weather === 'dry' || input.weather === 'rain' ? input.weather : 'auto';
  return {
    v: 1,
    driver: { name: driverName, number },
    team,
    difficulty,
    laps: clampInt(input.laps, 3, 5, 4),
    weather,
    cls: 'gp',
    speedwayOffer: null,
    round: 0,
    season: 1,
    complete: false,
    calendar: TRACK_IDS.slice(),
    points: {},
    upgradePoints: 0,
    upgrades: { engine: 0, aero: 0, brakes: 0, tires: 0 },
    rivals: defaultRivals(),
    history: [],
  };
}

/** Restore a saved career. Unknown or hostile fields fall back; rival names and ratings are kept. */
export function sanitizeCareer(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const seeded = newCareer({
    driverName: raw.driver?.name,
    number: raw.driver?.number,
    team: raw.team,
    difficulty: raw.difficulty,
    laps: raw.laps,
    weather: raw.weather,
  });
  const fallback = defaultRivals();
  const rivals = fallback.map((f, i) => sanitizeRival(Array.isArray(raw.rivals) ? raw.rivals[i] : null, f));
  const ids = new Set(rivals.map((r) => r.id));
  const points = {};
  if (raw.points && typeof raw.points === 'object') {
    for (const [k, v] of Object.entries(raw.points)) {
      if (k !== 'player' && !ids.has(k)) continue;
      const n = Number(v);
      if (Number.isFinite(n) && n >= 0 && n < 100000) points[k] = Math.round(n);
    }
  }
  const upgrades = { engine: 0, aero: 0, brakes: 0, tires: 0 };
  for (const k of UPGRADE_KEYS) upgrades[k] = clampInt(raw.upgrades?.[k], 0, UPGRADE_MAX, 0);
  const calendar = Array.isArray(raw.calendar) ? raw.calendar.filter((id) => TRACK_IDS.includes(id)) : [];
  const cal = calendar.length ? calendar : TRACK_IDS.slice();
  const round = clampInt(raw.round, 0, cal.length, 0);
  const cls = raw.cls === 'speedway' ? 'speedway' : 'gp';
  const offerRaw = raw.speedwayOffer;
  const speedwayOffer = (offerRaw === 'accepted' || offerRaw === 'declined' || offerRaw === 'pending') ? offerRaw : null;
  return {
    ...seeded,
    cls,
    speedwayOffer,
    round,
    season: clampInt(raw.season, 1, 99, 1),
    complete: !!raw.complete || round >= cal.length,
    calendar: cal,
    points,
    upgradePoints: clampInt(raw.upgradePoints, 0, 9999, 0),
    upgrades,
    rivals,
    history: sanitizeHistory(raw.history, ids),
  };
}

export function loadCareer(storage) {
  try {
    const raw = storage?.getItem(CAREER_KEY);
    if (!raw) return null;
    return sanitizeCareer(JSON.parse(raw));
  } catch { return null; }
}
export function saveCareer(storage, career) {
  try {
    const clean = sanitizeCareer(career);
    if (!clean) return false;
    storage?.setItem(CAREER_KEY, JSON.stringify(clean));
    return true;
  } catch { return false; }
}

/** Next calendar round, or null when the season is over. */
export function nextRound(career) {
  if (!career || career.complete || career.round >= career.calendar.length) return null;
  const id = career.calendar[career.round];
  return { index: career.round, count: career.calendar.length, id };
}

/**
 * Circuit behind the career hub and the standings. That is the next round,
 * or the opener again once the season is finished (a new season starts there).
 */
export function backdropTrackId(career) {
  const n = nextRound(career);
  if (n) return n.id;
  if (career?.calendar?.length) return career.calendar[0];
  return null;
}

/**
 * Grid for the next race, pole first. Each entry is { id, isPlayer, rating, teamIndex, team, driver, skill, cls? }.
 * `cls` is the base car class; the player's copy carries the upgrade bumps.
 */
export function careerGrid(career, cls) {
  const playerCls = cls ? applyUpgrades(cls, career.upgrades) : null;
  const entries = [
    {
      id: 'player', isPlayer: true, rating: playerRating(career), teamIndex: 0,
      team: { ...career.team, c1: career.team.livery.c1, c2: career.team.livery.c2, custom: true, livery: { ...career.team.livery } },
      driver: { name: career.driver.name, number: career.driver.number },
      skill: 0.985,
      cls: playerCls || undefined,
    },
    ...career.rivals.map((r) => {
      const base = TEAMS[r.teamIndex];
      return {
        id: r.id, isPlayer: false, rating: r.rating, teamIndex: r.teamIndex,
        team: { name: base.name, tag: base.tag, c1: base.c1, c2: base.c2 },
        driver: { name: r.name, number: r.number },
        skill: rivalSkill(r.rating, career.difficulty),
        cls: cls || undefined,
      };
    }),
  ];
  entries.sort((a, b) => b.rating - a.rating || (a.driver.name < b.driver.name ? -1 : a.driver.name > b.driver.name ? 1 : 0));
  return entries;
}

/** Championship order. Tie break: wins, then podiums, then driver name. */
export function standings(career) {
  const wins = {}, podiums = {};
  for (const h of career.history || []) {
    for (const [id, pos] of Object.entries(h.places || {})) {
      if (pos === 1) wins[id] = (wins[id] || 0) + 1;
      if (pos <= 3) podiums[id] = (podiums[id] || 0) + 1;
    }
  }
  const me = career.team;
  const rows = [
    {
      id: 'player', player: true, name: career.driver.name, number: career.driver.number,
      team: me.name, tag: me.tag, c1: me.livery.c1, c2: me.livery.c2,
      points: career.points.player || 0, rating: null,
    },
    ...career.rivals.map((r) => {
      const base = TEAMS[r.teamIndex];
      return {
        id: r.id, player: false, name: r.name, number: r.number,
        team: base.name, tag: base.tag, c1: base.c1, c2: base.c2,
        points: career.points[r.id] || 0, rating: r.rating,
      };
    }),
  ];
  rows.sort((a, b) => (
    b.points - a.points
    || (wins[b.id] || 0) - (wins[a.id] || 0)
    || (podiums[b.id] || 0) - (podiums[a.id] || 0)
    || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
  ));
  return rows.map((r, i) => ({ ...r, pos: i + 1, wins: wins[r.id] || 0 }));
}

/**
 * Add a race to the season. `rows` is [{ id, pos, isPlayer }].
 * Returns { trackId, pos, points, upgrade, complete, standings } or null if the season is already over.
 */
export function applyRaceResult(career, rows) {
  if (!career || career.complete || career.round >= career.calendar.length) return null;
  const trackId = career.calendar[career.round];
  const places = {};
  let playerPos = null, playerPts = 0;
  for (const row of rows || []) {
    const id = row.isPlayer ? 'player' : row.id;
    if (!id) continue;
    const pts = pointsFor(row.pos);
    career.points[id] = (career.points[id] || 0) + pts;
    places[id] = row.pos;
    if (id === 'player') { playerPos = row.pos; playerPts = pts; }
  }
  const up = playerPos ? upgradePointsFor(playerPos, career.difficulty) : 0;
  career.upgradePoints += up;
  career.history.push({ trackId, pos: playerPos, points: playerPts, upgrade: up, places });
  career.round += 1;
  if (career.round >= career.calendar.length) career.complete = true;
  return { trackId, pos: playerPos, points: playerPts, upgrade: up, complete: career.complete, standings: standings(career) };
}

/** Same driver, team, rivals and upgrades. Points and the calendar start again. */
export function newSeason(career) {
  career.season = clampInt(career.season, 1, 98, 1) + 1;
  career.round = 0;
  career.complete = false;
  career.points = {};
  career.history = [];
  career.calendar = TRACK_IDS.slice();
  // Clear a resolved offer so a later GP season can earn another one if they drop back (cls stays).
  if (career.speedwayOffer === 'accepted' || career.speedwayOffer === 'declined') career.speedwayOffer = null;
  return career;
}
