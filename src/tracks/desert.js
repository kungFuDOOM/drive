// "Sandglass Circuit": desert night circuit (original). Clockwise, a dune climb to a mesa-top run, three hairpins, a long back straight.
// control points: [x, y(elevation), z, halfWidth, runoff]
const CP = [
  // Sidewinder Straight (pit straight)
  [0, 0, 0, 9.5, 16], [130, 0, 0, 9.5, 16], [260, 0, 0, 9.5, 16],
  // Cairn Turn
  [345, 0, 12, 8.5, 15], [398, 0.5, 50, 8.5, 15], [415, 2, 115, 8, 15],
  // Dune Rise: climbing right-left
  [410, 7, 190, 8, 15], [440, 14, 255, 7.5, 15], [432, 22, 325, 7.5, 15], [395, 28, 385, 7.5, 15],
  // Kiln Run: flat-out mesa top
  [330, 31, 425, 8, 15], [250, 31, 418, 8, 15], [170, 30, 430, 8, 15],
  // Mesa Hairpin (right 180)
  [112, 29, 420, 8, 14], [95, 28, 380, 8, 14], [135, 26, 345, 8, 14],
  // Scorpion Esses back down
  [200, 21, 340, 7.5, 14], [265, 15, 315, 7.5, 14], [300, 11, 270, 7.5, 14], [265, 7, 225, 7.5, 14], [275, 4, 175, 7.5, 14],
  // Oasis Sweep (left) onto Mirage Run
  [240, 2, 125, 8, 15], [170, 1, 100, 8.5, 15],
  [60, 0, 108, 9, 15], [-60, 0, 112, 9, 15], [-170, 0, 112, 9, 15],
  // Sandglass Hairpin (right 180)
  [-255, 0, 112, 8.5, 15], [-330, 0, 72, 8.5, 15], [-300, 0, 14, 9, 15],
  // (Sidewinder Straight, before the line)
  [-250, 0, 0, 9.5, 16], [-130, 0, 0, 9.5, 16],
];
const M = CP.length;
export const DESERT = {
  id: 'desert',
  name: 'Sandglass Circuit',
  blurb: 'Night race across the dunes: a mesa climb and three hairpins.',
  theme: 'desertNight',
  seed: 31,
  points: CP,
  sections: [
    { name: 'Sidewinder Straight', a: 28.9, b: M + 2.6, kind: 'straight' },
    { name: 'Cairn Turn', a: 2.6, b: 5.2 },
    { name: 'Dune Rise', a: 5.2, b: 9.4 },
    { name: 'Kiln Run', a: 9.4, b: 12.6 },
    { name: 'Mesa Hairpin', a: 12.6, b: 15.4 },
    { name: 'Scorpion Esses', a: 15.4, b: 20.6 },
    { name: 'Oasis Sweep', a: 20.6, b: 23 },
    { name: 'Mirage Run', a: 23, b: 25.6, kind: 'straight' },
    { name: 'Sandglass Hairpin', a: 25.6, b: 28.9 },
  ],
  pit: { entry: -215, laneStart: -175, laneEnd: 140, exit: 190, speed: 22 },
};
