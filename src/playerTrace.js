// Golden player trace: a fixed, open-loop input script driven through the human branch of Race._stepCar in time-trial mode.
// Used by playerTrace.test.js to prove AI work never changes player physics. Pure function of (track, weather).
import { Race, seededRandom } from './race.js';

/** Scripted inputs at time t (s after the countdown starts): throttle/brake phases and steering sweeps. */
export function scriptedInput(t, inp) {
  const ph = t % 9;
  inp.throttle = ph < 5.5 ? 1 : ph < 6.2 ? 0 : ph < 7.4 ? 0.6 : 0.3;
  inp.brake = ph >= 5.5 && ph < 6.2 ? 0.85 : 0;
  inp.steer = Math.max(-1, Math.min(1, 0.35 * Math.sin(t * 0.9) + 0.25 * Math.sin(t * 2.3 + 1) + (ph > 6 && ph < 7 ? 0.5 : 0)));
  inp.boost = ph > 2 && ph < 3.2;
  return inp;
}

/**
 * Closed-loop "lapping" script: pure-pursuit steering to the centre line and a curvature-based pedal, computed inline from
 * track geometry only (no AI code), so the trace also covers high-speed braking, cornering and kerbs.
 */
export function lappingInput(track, p, inp) {
  const look = 8 + p.v * 0.3;
  const q = track.at(p.s + look, 0);
  const err = Math.atan2(q.x - p.x, q.z - p.z) - p.theta;
  const e = Math.atan2(Math.sin(err), Math.cos(err));
  inp.steer = Math.max(-1, Math.min(1, -e * 2.2));
  let k = 0;
  for (let a = 10; a <= 90; a += 10) k = Math.max(k, Math.abs(track.kappaAt(p.s + a)));
  const vt = Math.min(85, Math.sqrt(11 / Math.max(k, 1e-4)));
  inp.throttle = p.v < vt ? 1 : 0;
  inp.brake = p.v > vt + 3 ? Math.min(1, (p.v - vt) / 10) : 0;
  inp.boost = false;
  return inp;
}

/** Drive 60 s of racing time; return [x, z, theta, v] at 10 evenly spaced checkpoints. script: 'open' | 'lapping'. */
export function playerTrace(track, weather = 'dry', seconds = 60, script = 'open') {
  const race = new Race(track, { mode: 'tt', weather: 'dry', difficulty: 'normal', rng: seededRandom(7) });
  if (weather === 'rain') race.setRain(true);
  const p = race.player, dt = 1 / 60, out = [];
  let t = 0, next = seconds / 10;
  while (race.time < seconds - 1e-9) {
    if (script === 'lapping') lappingInput(track, p, p.input); else scriptedInput(t, p.input);
    race.step(dt); race.events.length = 0; t += dt;
    if (race.phase === 'racing' && race.time >= next - 1e-9) { out.push([p.x, p.z, p.theta, p.v]); next += seconds / 10; }
  }
  return out;
}
