// No rubber band: a lone car's pace never depends on where the rest of the field is in the race order.
import { describe, it, expect } from 'vitest';
import { Track } from './track.js';
import { Race, seededRandom } from './race.js';

const T = new Track();
/** Solo autopilot laps for one car while race.order claims a phantom car is `lead` metres ahead (+) or behind (-). */
function laps(lead) {
  const r = new Race(T, { mode: 'tt', weather: 'dry', difficulty: 'normal', rng: seededRandom(4) });
  r.autopilot = true;
  const p = r.player, ghost = { progress: 0, finished: false, isPlayer: false, pos: 0 };
  p.ai.mistakeIn = 1e9;
  r.rank = function () { ghost.progress = p.progress + lead; this.order = lead > 0 ? [ghost, p] : [p, ghost]; p.pos = lead > 0 ? 2 : 1; };
  const times = [];
  let last = p.lapTimes.length;
  for (let k = 0; k < 60 * 150 && times.length < 2; k++) {
    r.step(1 / 60); r.events.length = 0;
    if (p.lapTimes.length > last) { last = p.lapTimes.length; times.push(r.time); }
  }
  return times;
}

describe('no rubber band', () => {
  it('lap times are identical with the field 5 s ahead or 5 s behind', () => {
    const ahead = laps(5 * 70), behind = laps(-5 * 70);
    expect(ahead.length).toBe(2);
    ahead.forEach((t, i) => expect(Math.abs(t - behind[i])).toBeLessThan(0.01));
  }, 30000);
});
