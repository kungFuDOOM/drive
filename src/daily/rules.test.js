import { describe, it, expect } from 'vitest';
import { Race } from '../race.js';
import { Track } from '../track.js';
import { trackDef } from '../tracks/index.js';
import { DAILY_RULES, applyTwist } from './rules.js';

const race = (twist) => {
  const r = new Race(new Track(trackDef('citadel')), { ...DAILY_RULES, weather: twist });
  applyTwist(r, twist);
  return r;
};
const drive = (r, seconds) => { r.autopilot = true; for (let t = 0; t < seconds; t += 1 / 60) r.step(1 / 60); return r; };

describe('daily conditions on a real time trial', () => {
  it('rain day: wet from the start, on wet tyres, and it stays raining', () => {
    const r = race('rain');
    expect(r.solo).toBe(true);
    expect(r.rain).toBe(1);
    expect(r.wetness).toBeGreaterThanOrEqual(0.7);
    expect(r.player.tire).toBe('wet');
    drive(r, 20);
    expect(r.rain).toBe(1);
    expect(r.wetness).toBeGreaterThan(0.95);
  });

  it('dry day: stays dry on dry tyres', () => {
    const r = drive(race('dry'), 20);
    expect([r.rain, r.wetness, r.player.tire]).toEqual([0, 0, 'dry']);
  });
});
