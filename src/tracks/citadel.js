// "Citadel Circuit": the original stone-fortress circuit (fast uphill sweeps, a hairpin, a blind downhill chicane and a walled squeeze).
// Track definition = pure data; src/track.js turns it into the sampled Track.
// control points: [x, y(elevation), z, halfWidth, runoff (distance from edge to wall)]
const CP = [
  [0, 0, 0, 9, 15], [130, 0, 0, 9, 15], [260, 0, 0, 9, 15],
  [330, 0, 8, 8.5, 15], [385, 1, 50, 8, 15], [400, 3, 115, 8, 15],
  // Thunder Climb: fast uphill left-right-left compression
  [397, 8, 170, 7.5, 15], [404, 15, 225, 7.5, 15], [394, 22, 280, 7.5, 15], [403, 28, 335, 7.5, 15], [396, 32, 385, 7.5, 15],
  // Crown Hairpin
  [386, 33, 448, 8, 15], [326, 33, 474, 8, 15],
  // The Plunge: blind steep downhill left-right chicane
  [240, 32, 434, 7, 14], [190, 26, 407, 7, 14], [150, 17, 430, 7, 14], [105, 9, 405, 7, 14], [62, 3, 396, 7.5, 14], [20, 1, 376, 7.5, 12],
  // Citadel Squeeze: very tight, walled
  [-25, 0, 345, 6, 1.3], [-45, 0, 300, 6, 1.3], [-95, 0, 285, 6, 1.3], [-110, 0, 240, 6, 1.3], [-165, 0, 225, 6, 1.3], [-180, 0, 180, 6, 1.3], [-235, 0, 165, 6.5, 2],
  // Moat Sweep back onto the straight
  [-290, 0, 120, 8, 15], [-340, 0, 70, 9, 15], [-310, 0, 12, 9, 15], [-250, 0, 0, 9, 15], [-130, 0, 0, 9, 15],
];

const M = CP.length;
export const CITADEL = {
  id: 'citadel',
  name: 'Citadel Circuit',
  blurb: 'Stone walls, a blind plunge and the tight squeeze.',
  theme: 'circuitDay',
  seed: 7,
  points: CP,
  // section a/b are fractional control-point indices (b > point count wraps over the start line)
  sections: [
    { name: 'Ironside Straight', a: 28.6, b: M + 2.4, kind: 'straight' },
    { name: 'Anvil Bend', a: 2.4, b: 5.4 },
    { name: 'Thunder Climb', a: 5.4, b: 10.6 },
    { name: 'Crown Hairpin', a: 10.6, b: 12.8 },
    { name: 'The Plunge', a: 12.8, b: 18.6 },
    { name: 'Citadel Squeeze', a: 18.6, b: 25.6 },
    { name: 'Moat Sweep', a: 25.6, b: 28.6 },
  ],
  pit: { entry: -215, laneStart: -175, laneEnd: 140, exit: 190, speed: 22 },
};
