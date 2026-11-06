import { describe, it, expect } from 'vitest';
import { CLASSES } from './physics.js';
import { Track } from './track.js';
import { Race, seededRandom } from './race.js';
import { TRACK_IDS } from './tracks/index.js';
import {
  POINTS, pointsFor, UPGRADE_KEYS, UPGRADE_MAX, UPGRADE_COST, BUMPS, CAREER_KEY,
  SPEEDWAY_OFFER_POINTS, SPEEDWAY_RECRUITER,
  newCareer, loadCareer, saveCareer, sanitizeCareer, applyRaceResult, standings, buyUpgrade,
  applyUpgrades, rivalSkill, playerRating, careerGrid, nextRound, backdropTrackId, newSeason, upgradePointsFor, defaultRivals,
  careerClass, speedwayPtsNeeded, speedwayOfferEligible, speedwayMissMessage,
  acceptSpeedwayOffer, declineSpeedwayOffer,
} from './career.js';

const memStore = () => {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
};

const order = (career, playerPos) => {
  const ids = career.rivals.map((r) => r.id);
  const rows = [];
  let k = 0;
  for (let pos = 1; pos <= 10; pos++) {
    if (pos === playerPos) rows.push({ id: 'player', isPlayer: true, pos });
    else rows.push({ id: ids[k++], pos });
  }
  return rows;
};

describe('championship points', () => {
  it('uses the 25-18-15-12-10-8-6-4-2-1 scale and nothing beyond tenth', () => {
    expect(POINTS).toEqual([25, 18, 15, 12, 10, 8, 6, 4, 2, 1]);
    expect(POINTS.reduce((s, n) => s + n, 0)).toBe(101);
    expect(pointsFor(1)).toBe(25);
    expect(pointsFor(10)).toBe(1);
    expect(pointsFor(11)).toBe(0);
    expect(pointsFor(0)).toBe(0);
  });

  it('a season across every track scores the top 10 and ranks more wins ahead of a single win', () => {
    const c = newCareer({ driverName: 'Casey Morrow', number: 17, team: { name: 'Northline Racing' }, difficulty: 'normal' });
    expect(c.calendar).toHaveLength(6);
    expect(c.calendar).toEqual(TRACK_IDS);
    expect(new Set(c.calendar).size).toBe(6);
    expect(c.rivals).toHaveLength(9);
    expect(nextRound(c).id).toBe(TRACK_IDS[0]);
    expect(backdropTrackId(c)).toBe(TRACK_IDS[0]);
    applyRaceResult(c, order(c, 1));
    expect(c.points.player).toBe(25);
    expect(standings(c)[0].id).toBe('player');
    expect(c.round).toBe(1);
    expect(c.complete).toBe(false);
    // hub backdrop is the round still to come, not the one just scored
    expect(backdropTrackId(c)).toBe(TRACK_IDS[1]);
    expect(backdropTrackId(c)).not.toBe(c.history[0].trackId);
    applyRaceResult(c, order(c, 2));
    applyRaceResult(c, order(c, 3));
    expect(c.complete).toBe(false);
    expect(c.round).toBe(3);
    expect(nextRound(c).id).toBe(TRACK_IDS[3]);
    applyRaceResult(c, order(c, 2));
    applyRaceResult(c, order(c, 2));
    applyRaceResult(c, order(c, 2));
    expect(c.complete).toBe(true);
    expect(nextRound(c)).toBe(null);
    expect(backdropTrackId(c)).toBe(TRACK_IDS[0]);
    expect(c.points.player).toBe(25 + 18 + 15 + 18 + 18 + 18);
    const table = standings(c);
    expect(table).toHaveLength(10);
    expect(table.map((r) => r.pos)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    // One win for the player (112). The rival who won the other five has 143 and leads.
    expect(table[0].id).toBe(c.rivals[0].id);
    expect(table[0].points).toBe(18 + 25 + 25 + 25 + 25 + 25);
    expect(table[0].wins).toBe(5);
    expect(table.find((r) => r.player)).toMatchObject({ pos: 2, points: 112, wins: 1 });
    expect(applyRaceResult(c, order(c, 1))).toBe(null);
  });
});

describe('championship tie break', () => {
  it('same points: more wins ranks first, and a rival can be champion', () => {
    const c = newCareer();
    const ace = c.rivals[0].id;
    const rows = (playerPos, acePos) => {
      const ids = c.rivals.map((r) => r.id);
      const taken = new Set([playerPos, acePos]);
      const rest = [];
      for (let p = 1; p <= 10; p++) if (!taken.has(p)) rest.push(p);
      let k = 0;
      return [
        { id: 'player', isPlayer: true, pos: playerPos },
        { id: ace, pos: acePos },
        ...ids.slice(1).map((id) => ({ id, pos: rest[k++] })),
      ];
    };
    applyRaceResult(c, rows(1, 2));
    applyRaceResult(c, rows(2, 1));
    applyRaceResult(c, rows(2, 1));
    expect(c.points.player).toBe(25 + 18 + 18);
    expect(c.points[ace]).toBe(18 + 25 + 25);
    const table = standings(c);
    expect(table[0].id).toBe(ace);
    expect(table[0].player).toBe(false);
    expect(table.find((r) => r.player).pos).toBe(2);
  });
});

describe('save / load', () => {
  it('round-trips the season, rival names and points, and rejects corrupt storage', () => {
    expect(loadCareer(memStore())).toBe(null);
    expect(loadCareer(null)).toBe(null);
    const st = memStore();
    st.setItem(CAREER_KEY, '{nope');
    expect(loadCareer(st)).toBe(null);
    const c = newCareer({ driverName: 'Rio Santos', number: 23, team: { name: 'Gale Force Racing', livery: { pattern: 'hoops', c1: 0x112233, c2: 0xaabbcc, c3: 0x010203, number: 23 } }, difficulty: 'hard' });
    c.rivals[0].name = 'Nia Calder';
    applyRaceResult(c, order(c, 4));
    buyUpgrade({ ...c, upgradePoints: 0 }, 'engine');
    c.upgradePoints = 20;
    expect(buyUpgrade(c, 'brakes').ok).toBe(true);
    expect(saveCareer(st, c)).toBe(true);
    const back = loadCareer(st);
    expect(back.driver).toEqual({ name: 'Rio Santos', number: 23 });
    expect(back.team.name).toBe('Gale Force Racing');
    expect(back.team.livery.pattern).toBe('hoops');
    expect(back.team.livery.c1).toBe(0x112233);
    expect(back.difficulty).toBe('hard');
    expect(back.points.player).toBe(12);
    expect(back.round).toBe(1);
    expect(back.upgrades.brakes).toBe(1);
    expect(back.upgradePoints).toBe(20 - UPGRADE_COST[0]);
    expect(back.rivals.map((r) => r.id)).toEqual(defaultRivals().map((r) => r.id));
    expect(back.rivals[0].name).toBe('Nia Calder');
    expect(back.history).toHaveLength(1);
    expect(back.history[0].trackId).toBe(TRACK_IDS[0]);
  });

  it('clamps hostile upgrade levels and strips a bad driver name', () => {
    const st = memStore();
    st.setItem(CAREER_KEY, JSON.stringify({
      driver: { name: '<b>No</b>', number: 400 },
      upgrades: { engine: 99, aero: -4, brakes: 2 },
      upgradePoints: -20,
      points: { player: 40, '"><script>': 99 },
      round: 80,
    }));
    const c = loadCareer(st);
    expect(c.driver.name).toBe('Casey Morrow');
    expect(c.driver.number).toBe(1);
    expect(c.upgrades.engine).toBe(UPGRADE_MAX);
    expect(c.upgrades.aero).toBe(0);
    expect(c.upgrades.brakes).toBe(2);
    expect(c.upgradePoints).toBe(0);
    expect(c.points.player).toBe(40);
    expect(c.points['"><script>']).toBeUndefined();
    expect(c.round).toBe(c.calendar.length);
    expect(c.complete).toBe(true);
    expect(sanitizeCareer(null)).toBe(null);
  });
});

describe('upgrades', () => {
  it('are bounded, spend the listed cost, and only nudge the named class stats', () => {
    const base = CLASSES.gp;
    const v0 = base.vTop, a0 = base.accel, d0 = base.down, b0 = base.brake, w0 = base.wear;
    const maxed = applyUpgrades(base, { engine: 99, aero: 99, brakes: 9, tires: -3 });
    expect(base.vTop).toBe(v0);
    expect(maxed.vTop).toBeCloseTo(v0 * (1 + BUMPS.engine.vTop * UPGRADE_MAX), 10);
    expect(maxed.accel).toBeCloseTo(a0 * (1 + BUMPS.engine.accel * UPGRADE_MAX), 10);
    expect(maxed.down).toBeCloseTo(d0 * (1 + BUMPS.aero.down * UPGRADE_MAX), 10);
    expect(maxed.brake).toBeCloseTo(b0 * (1 + BUMPS.brakes.brake * UPGRADE_MAX), 10);
    expect(maxed.wear).toBeCloseTo(w0, 10);
    expect(maxed.wear).toBeGreaterThan(0);
    expect(maxed.vTop / v0).toBeLessThan(1.05);
    const worn = applyUpgrades(base, { tires: UPGRADE_MAX });
    expect(worn.wear).toBeLessThan(w0);
    expect(worn.wear).toBeGreaterThan(w0 * 0.7);
    expect(worn.vTop).toBe(v0);

    const c = newCareer();
    const bill = UPGRADE_COST.reduce((s, n) => s + n, 0);
    c.upgradePoints = bill * UPGRADE_KEYS.length;
    for (const k of UPGRADE_KEYS) {
      for (let i = 0; i < UPGRADE_MAX + 3; i++) buyUpgrade(c, k);
      expect(c.upgrades[k]).toBe(UPGRADE_MAX);
    }
    expect(c.upgradePoints).toBe(0);
    expect(buyUpgrade(c, 'engine')).toMatchObject({ ok: false, reason: 'max' });
    expect(buyUpgrade(c, 'wings')).toMatchObject({ ok: false, reason: 'unknown' });
    c.upgradePoints = UPGRADE_COST[0] - 1;
    c.upgrades.engine = 0;
    expect(buyUpgrade(c, 'engine')).toMatchObject({ ok: false, reason: 'points' });
    expect(c.upgrades.engine).toBe(0);
  });

  it('research points scale with difficulty and every place pays something', () => {
    expect(upgradePointsFor(1, 'hard')).toBeGreaterThan(upgradePointsFor(1, 'normal'));
    expect(upgradePointsFor(1, 'normal')).toBeGreaterThan(upgradePointsFor(1, 'easy'));
    expect(upgradePointsFor(10, 'easy')).toBeGreaterThan(0);
    expect(upgradePointsFor(11, 'hard')).toBe(0);
  });

  it('a career grid is ten cars, midfield for a fresh car, and the bumps reach the player car only', () => {
    const c = newCareer({ difficulty: 'normal' });
    expect(playerRating(c)).toBe(76);
    const grid = careerGrid(c, CLASSES.gp);
    expect(grid).toHaveLength(10);
    expect(grid[0].rating).toBeGreaterThan(grid[9].rating);
    const me = grid.find((e) => e.isPlayer);
    expect(me.rating).toBe(76);
    expect(grid.filter((e) => e.rating > me.rating)).toHaveLength(6);
    expect(me.team.name).toBe(c.team.name);
    expect(me.cls.vTop).toBeCloseTo(CLASSES.gp.vTop, 10);
    c.upgrades.engine = UPGRADE_MAX;
    const up = careerGrid(c, CLASSES.gp);
    const v0 = CLASSES.gp.vTop;
    const race = new Race(new Track(), { mode: 'race', weather: 'dry', laps: 1, rng: seededRandom(3), grid: up });
    expect(race.cars).toHaveLength(10);
    expect(race.player.cls.vTop).toBeGreaterThan(v0);
    expect(CLASSES.gp.vTop).toBe(v0);
    expect(race.cars.filter((car) => !car.isPlayer).every((car) => car.cls.vTop === v0)).toBe(true);
    expect(race.player.driver.name).toBe(c.driver.name);
    expect(new Set(race.cars.map((car) => car.driver.name)).size).toBe(10);
    race.step(1 / 60);
    expect(race.cars.every((car) => Number.isFinite(car.x))).toBe(true);
  });
});

describe('difficulty', () => {
  it('keeps rival order and puts the whole Easy field behind the whole Hard field', () => {
    const rivals = defaultRivals();
    for (const r of rivals) {
      expect(rivalSkill(r.rating, 'easy')).toBeLessThan(rivalSkill(r.rating, 'normal'));
      expect(rivalSkill(r.rating, 'normal')).toBeLessThan(rivalSkill(r.rating, 'hard'));
    }
    const easyTop = Math.max(...rivals.map((r) => rivalSkill(r.rating, 'easy')));
    const hardBot = Math.min(...rivals.map((r) => rivalSkill(r.rating, 'hard')));
    expect(easyTop).toBeLessThan(hardBot);
    for (const diff of ['easy', 'normal', 'hard']) {
      const skills = rivals.map((r) => rivalSkill(r.rating, diff));
      expect([...skills].sort((a, b) => b - a)).toEqual(skills);
    }
    for (const diff of ['easy', 'normal', 'hard']) {
      const c = newCareer({ difficulty: diff });
      const grid = careerGrid(c, CLASSES.gp);
      expect(grid.filter((e) => !e.isPlayer).map((e) => e.skill)).toEqual(c.rivals.map((r) => rivalSkill(r.rating, diff)).sort((a, b) => b - a));
    }
  });
});

describe('new season', () => {
  it('keeps the team and the upgrades, and clears the points', () => {
    const c = newCareer({ team: { name: 'Northline Racing' } });
    applyRaceResult(c, order(c, 1));
    c.upgradePoints = 30;
    buyUpgrade(c, 'aero');
    newSeason(c);
    expect(c.season).toBe(2);
    expect(c.round).toBe(0);
    expect(c.complete).toBe(false);
    expect(c.points).toEqual({});
    expect(c.history).toEqual([]);
    expect(c.upgrades.aero).toBe(1);
    expect(c.team.name).toBe('Northline Racing');
    expect(c.upgradePoints).toBe(30 - UPGRADE_COST[0]);
    expect(nextRound(c).index).toBe(0);
  });
});

describe('Speedway recruitment', () => {
  it('sets the offer threshold at ~60% of a perfect 6-round season', () => {
    expect(SPEEDWAY_OFFER_POINTS).toBe(90);
    expect(SPEEDWAY_OFFER_POINTS).toBe(Math.round(25 * 6 * 0.6));
    expect(SPEEDWAY_RECRUITER.name).toBe('Ashlane Speed Co.');
    expect(SPEEDWAY_RECRUITER.tag).toBe('ASH');
  });

  it('new careers start in GP and old saves without cls migrate to gp', () => {
    const c = newCareer();
    expect(c.cls).toBe('gp');
    expect(careerClass(c)).toBe('gp');
    const st = memStore();
    st.setItem(CAREER_KEY, JSON.stringify({
      driver: { name: 'Casey Morrow', number: 7 },
      points: { player: 40 },
      round: 2,
    }));
    const back = loadCareer(st);
    expect(back.cls).toBe('gp');
    expect(back.points.player).toBe(40);
    st.setItem(CAREER_KEY, JSON.stringify({
      driver: { name: 'Casey Morrow', number: 7 },
      cls: 'speedway',
      points: { player: 10 },
    }));
    expect(loadCareer(st).cls).toBe('speedway');
    st.setItem(CAREER_KEY, JSON.stringify({
      driver: { name: 'Casey Morrow', number: 7 },
      cls: 'kart',
    }));
    expect(loadCareer(st).cls).toBe('gp');
  });

  it('eligible only after a completed GP season at or above the threshold', () => {
    const c = newCareer({ team: { name: 'Northline Racing' } });
    expect(speedwayOfferEligible(c)).toBe(false);
    expect(speedwayPtsNeeded(c)).toBe(90);
    for (let i = 0; i < 5; i++) applyRaceResult(c, order(c, 1));
    expect(c.complete).toBe(false);
    expect(c.points.player).toBe(125);
    expect(speedwayOfferEligible(c)).toBe(false);
    applyRaceResult(c, order(c, 1));
    expect(c.complete).toBe(true);
    expect(c.points.player).toBe(150);
    expect(speedwayOfferEligible(c)).toBe(true);
    expect(speedwayPtsNeeded(c)).toBe(0);

    const low = newCareer();
    for (let i = 0; i < 6; i++) applyRaceResult(low, order(low, 10));
    expect(low.complete).toBe(true);
    expect(low.points.player).toBe(6);
    expect(speedwayOfferEligible(low)).toBe(false);
    expect(speedwayMissMessage(low)).toContain('90');
    expect(speedwayMissMessage(low)).toContain('6');

    const edge = newCareer();
    // Manufacture exactly 90 pts across a finished season without racing every place.
    edge.round = edge.calendar.length;
    edge.complete = true;
    edge.points.player = 90;
    expect(speedwayOfferEligible(edge)).toBe(true);
    edge.points.player = 89;
    expect(speedwayOfferEligible(edge)).toBe(false);

    const sw = newCareer();
    sw.cls = 'speedway';
    sw.round = sw.calendar.length;
    sw.complete = true;
    sw.points.player = 150;
    expect(speedwayOfferEligible(sw)).toBe(false);
  });

  it('accept moves to Speedway, keeps team and driver, resets upgrades, starts a new season', () => {
    const c = newCareer({
      driverName: 'Rio Santos', number: 23,
      team: { name: 'Gale Force Racing', livery: { pattern: 'hoops', c1: 0x112233, c2: 0xaabbcc, c3: 0x010203, number: 23 } },
    });
    c.upgrades.engine = 3;
    c.upgrades.aero = 2;
    c.upgradePoints = 18;
    c.round = c.calendar.length;
    c.complete = true;
    c.points.player = 96;
    const teamSnap = { ...c.team, livery: { ...c.team.livery } };
    expect(acceptSpeedwayOffer(c)).toEqual({ ok: true, unlocked: true });
    expect(c.cls).toBe('speedway');
    expect(c.complete).toBe(false);
    expect(c.season).toBe(2);
    expect(c.round).toBe(0);
    expect(c.points).toEqual({});
    expect(c.upgrades).toEqual({ engine: 0, aero: 0, brakes: 0, tires: 0 });
    expect(c.upgradePoints).toBe(18);
    expect(c.driver).toEqual({ name: 'Rio Santos', number: 23 });
    expect(c.team.name).toBe(teamSnap.name);
    expect(c.team.livery.pattern).toBe('hoops');
    expect(c.team.livery.c1).toBe(0x112233);
    expect(acceptSpeedwayOffer(c).ok).toBe(false);
  });

  it('decline stays in GP for another season', () => {
    const c = newCareer({ team: { name: 'Northline Racing' } });
    c.round = c.calendar.length;
    c.complete = true;
    c.points.player = 100;
    c.upgrades.brakes = 2;
    expect(declineSpeedwayOffer(c)).toEqual({ ok: true });
    expect(c.cls).toBe('gp');
    expect(c.season).toBe(2);
    expect(c.complete).toBe(false);
    expect(c.upgrades.brakes).toBe(2);
    expect(declineSpeedwayOffer(c).ok).toBe(false);
  });

  it('career grid stamps the career class on every car including AI', () => {
    const c = newCareer();
    c.cls = 'speedway';
    const grid = careerGrid(c, CLASSES.speedway);
    expect(grid.every((e) => e.cls && e.cls.id === 'speedway')).toBe(true);
    const me = grid.find((e) => e.isPlayer);
    expect(me.cls.vTop).toBeCloseTo(CLASSES.speedway.vTop, 10);
    const ai = grid.filter((e) => !e.isPlayer);
    expect(ai.every((e) => e.cls === CLASSES.speedway || e.cls.id === 'speedway')).toBe(true);
  });
});
