// Camera-only pre-race direction. No simulation or audio side effects, and no remote data.
import { clamp, lerp, smoothstep } from './physics.js';
import { cutsceneDuration } from './broadcast.js';

export function cutsceneSubtitle(theme, race, round) {
  const weather = race?.rain > 0.35 || race?.wetness > 0.25 ? 'WET CONDITIONS' : race?.opts?.weather === 'dry' ? 'DRY CONDITIONS' : theme?.night ? 'NIGHT SESSION' : 'DAY SESSION';
  return `${round ? `ROUND ${round.index + 1} / ${round.count}  ·  ` : ''}${String(theme?.name || 'CIRCUIT').replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase()}  ·  ${weather}`;
}

/** A flyover leads into a longitudinal grid pan, ending on the player's actual livery. */
export function cutsceneFrame(track, player, time, mode = 'race', settings) {
  const duration = cutsceneDuration(mode, settings);
  const t = clamp(time, 0, Math.max(duration, 0.001));
  const progress = duration ? t / duration : 1;
  const point = (s, d = 0, h = 0) => { const p = track.at(s, d); return [p.x, p.y + h, p.z]; };
  let position, target, fov = 54, phase;
  if (mode === 'tt') {
    const u = smoothstep(0, 1, progress), p = point(player.s, player.d, 0.65);
    position = point(player.s - lerp(14, 9, u), lerp(12, 5, u), lerp(5, 2.5, u));
    target = p; phase = 'reveal';
  } else if (progress < 0.38) {
    const u = smoothstep(0, 0.38, progress);
    const s = player.s + track.length * lerp(0.6, 0.19, u), p = point(s, 0, 1);
    position = point(s - lerp(35, 16, u), lerp(72, 25, u), lerp(98, 34, u));
    target = point(s + 22, 0, 0); fov = lerp(60, 53, u); phase = 'flyover';
  } else {
    const u = smoothstep(0.38, 1, progress), s = player.s;
    position = point(s - lerp(25, 9, u), lerp(17, 5.2, u), lerp(8, 2.6, u));
    const far = point(s + lerp(36, 0, u), 0, lerp(0, 0.75, u));
    const near = point(s, player.d, 0.7);
    target = [lerp(far[0], near[0], u), lerp(far[1], near[1], u), lerp(far[2], near[2], u)]; phase = u < 0.62 ? 'grid' : 'reveal';
  }
  return { position, target, fov, phase, progress, reveal: mode === 'tt' ? progress >= 0.12 : progress >= 0.4, duration };
}

/** Model with the same skip boundary as the browser; any key/tap follows this path. */
export class Cutscene {
  constructor(mode, settings) { this.duration = cutsceneDuration(mode, settings); this.elapsed = 0; this.active = this.duration > 0; this.skipped = false; }
  advance(wallDt) { if (this.active) { this.elapsed = Math.min(this.duration, this.elapsed + Math.max(0, wallDt)); if (this.elapsed >= this.duration) this.active = false; } return !this.active; }
  skip() { if (!this.active) return false; this.active = false; this.skipped = true; this.elapsed = this.duration; return true; }
}
