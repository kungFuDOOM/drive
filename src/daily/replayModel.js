// The all-racers replay, without DOM or three.js: decoded runs, one shared clock, colours.
import { sampleGhost, formatTime } from '../timing.js';
import { decodePath } from './runPath.js';
import { publicName } from './identity.js';

export const MAX_REPLAY_CARS = 200;
export const SPEEDS = [1, 2, 4];

/** Golden-angle hues: neighbours in the finishing order never look alike. */
export const runColor = (i) => ({ h: (0.02 + i * 0.618034) % 1, s: 0.85, l: [0.56, 0.7, 0.45][i % 3] });
export const cssColor = ({ h, s, l }) => `hsl(${Math.round(h * 360)} ${s * 100}% ${l * 100}%)`;

/** Rows from drive_admin_replay -> { runs (fastest first), skipped: unreadable paths, duration: seconds }. */
export function buildRuns(rows, limit = MAX_REPLAY_CARS) {
  const runs = [];
  let skipped = 0;
  for (const row of [...rows].sort((a, b) => a.time_ms - b.time_ms)) {
    if (runs.length >= limit) break;
    const ghost = decodePath(row.path);
    if (!ghost || !(row.time_ms > 0)) { skipped++; continue; }
    const time = row.time_ms / 1000;
    runs.push({ rank: runs.length + 1, name: publicName(row.name), time, label: formatTime(time), color: runColor(runs.length), ghost });
  }
  return { runs, skipped, duration: runs.reduce((m, r) => Math.max(m, r.time), 0) };
}

/** Pose at replay time t, or null once this lap is over. Holds the last sample between it and the finish time. */
export function runPose(run, t, out = {}) {
  if (t < 0 || t >= run.time) return null;
  const g = run.ghost, end = (g.samples.length - 1) / g.hz;
  return sampleGhost(g, Math.min(t, end - 1e-6), out);
}

export function createClock(duration) {
  const clock = {
    t: 0, speed: 1, playing: true, duration,
    seek(t) { clock.t = Math.min(duration, Math.max(0, t)); },
    restart() { clock.t = 0; clock.playing = true; },
    /** Play at the end starts over. */
    toggle() { if (!clock.playing && clock.t >= duration) clock.t = 0; clock.playing = !clock.playing; },
    advance(dt) {
      if (!clock.playing) return;
      clock.seek(clock.t + dt * clock.speed);
      if (clock.t >= duration) clock.playing = false;
    },
  };
  return clock;
}
