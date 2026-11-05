// Pure game logic (no DOM / three.js): lap counting, grip, tire wear, slipstream.
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
export function wrapAngle(a) {
  while (a > Math.PI) a -= 2 * Math.PI;
  while (a < -Math.PI) a += 2 * Math.PI;
  return a;
}
/** Wrap a track-distance delta into [-L/2, L/2). */
export function wrapDelta(d, L) {
  d = ((d % L) + L) % L;
  return d >= L / 2 ? d - L : d;
}

// ---- Car classes --------------------------------------------------------
export const CLASSES = {
  gp: { id: 'gp', name: 'GP', vTop: 88, accel: 26, brake: 34, latBase: 30, down: 0.4, steer: 0.09, wear: 1.0 },
  speedway: { id: 'speedway', name: 'Speedway', vTop: 97, accel: 22, brake: 29, latBase: 24, down: 0.25, steer: 0.08, wear: 0.85 },
};

// ---- Lap counting -------------------------------------------------------
// progress = unwrapped distance along the track; the start line is progress 0,
// grid cars start at negative progress. Laps = floor(progress / L).
export function createLapState(L, startS = 0) {
  const progress = startS > L / 2 ? startS - L : startS;
  return { L, progress, prevS: ((startS % L) + L) % L, maxLaps: Math.max(0, Math.floor(progress / L)) };
}
/** Feed the new track position; returns true when a new lap was just completed. */
export function advanceLap(st, newS) {
  st.progress += wrapDelta(newS - st.prevS, st.L);
  st.prevS = newS;
  const laps = Math.max(0, Math.floor(st.progress / st.L));
  if (laps > st.maxLaps) { st.maxLaps = laps; return true; }
  return false;
}
export const lapsDone = (st) => st.maxLaps;

// ---- Grip / tires -------------------------------------------------------
export const SURFACE = {
  asphalt: { grip: 1, drag: 0 },
  pit: { grip: 1, drag: 0 },
  kerb: { grip: 0.95, drag: 0.05 },
  grass: { grip: 0.5, drag: 0.6 }, // drag = speed-proportional decel (1/s)
  gravel: { grip: 0.35, drag: 1.1 },
};
/** Compound grip on a surface wetness 0..1 (before wear). */
export function compoundGrip(tire, wetness) {
  const w = clamp(wetness, 0, 1);
  return tire === 'wet' ? 0.84 + 0.12 * w : 1 - 0.55 * w;
}
export function wearFactor(wear) {
  return 1 - 0.4 * Math.pow(clamp(wear, 0, 1), 1.3);
}
export function gripFactor({ tire, wear = 0, wetness = 0, surface = 'asphalt' }) {
  const s = SURFACE[surface] || SURFACE.asphalt;
  return compoundGrip(tire, wetness) * wearFactor(wear) * s.grip;
}
/** Tire wear per second. latAccel in m/s^2. */
export function tireWearRate(tire, latAccel, wetness, classWear = 1) {
  const base = 0.001 + 0.005 * clamp(Math.abs(latAccel) / 50, 0, 1);
  const mult = tire === 'wet' ? 1 + 1.5 * (1 - clamp(wetness, 0, 1)) : 1;
  return base * mult * classWear;
}
export function lateralAccelLimit(cls, speed, grip) {
  const k = speed / 60;
  return cls.latBase * (1 + cls.down * k * k) * grip;
}
/** Max speed through a corner of curvature kappa (1/m) at a grip level. */
export function cornerSpeed(cls, kappa, grip = 1) {
  kappa = Math.abs(kappa);
  const a = cls.latBase * grip;
  const den = kappa - (a * cls.down) / 3600;
  if (den <= 1e-6) return cls.vTop * 1.2;
  return Math.min(cls.vTop * 1.2, Math.sqrt(a / den));
}
/**
 * Steering model. Steering angle shrinks with speed (speed-sensitive), and the
 * achievable curvature is capped by tyre grip (friction circle: braking eats
 * lateral grip). `excess` > 0 means the driver asks for more than the tyres give
 * (understeer) and the car should scrub speed.
 */
export function steerState(cls, steer, speed, grip, brake = 0, out = { k: 0, excess: 0 }) {
  const v = Math.abs(speed);
  const demand = (steer * cls.steer) / (1 + (v / 28) * (v / 28));
  const g = grip * (1 - 0.3 * clamp(brake, 0, 1));
  const cap = lateralAccelLimit(cls, v, g) / Math.max(v * v, 1);
  const k = clamp(demand, -cap, cap);
  const excess = clamp((Math.abs(demand) - cap) / Math.max(cap, 1e-4), 0, 2);
  out.k = k; out.excess = excess;
  return out;
}
const _curv = { k: 0, excess: 0 };
/** Curvature (1/m) the car actually achieves at a given steer input. */
export function steerCurvature(cls, steer, speed, grip, brake = 0) {
  return steerState(cls, steer, speed, grip, brake, _curv).k;
}

// ---- Slipstream ---------------------------------------------------------
/** Meter fill rate (per second) given gap (m, front-to-rear) and lateral offset (m). */
export function slipstreamRate(gap, lateral) {
  if (gap < 0 || gap > 30) return 0;
  const lat = 1 - clamp(Math.abs(lateral) / 2.6, 0, 1);
  const f = 1 - gap / 30;
  return 0.45 * f * f * lat;
}
export function updateBoost(meter, { fill = 0, boosting = false, dt }) {
  if (boosting && meter > 0) return Math.max(0, meter - 0.28 * dt);
  return clamp(meter + fill * dt, 0, 1);
}
