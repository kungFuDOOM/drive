// "Lampwick Mile": neon street circuit (original). A wide pit straight, then walls close in
// for the esses, a hotel hairpin and a quay. A low city hill gives the lap real elevation.
// control points: [x, y(elevation), z, halfWidth, runoff]
const CP = [
  // Lamp Straight (pit straight — wide enough for the pit lane and the grandstand)
  [0, 0, 0, 9, 16], [130, 0, 0, 9, 16], [250, 0, 0, 9, 16],
  // Marquee Bend (walls come in)
  [322, 1, 16, 8, 6.6], [368, 2.5, 68, 7.5, 6.2], [378, 4, 128, 7.5, 6.2],
  // Arcade Esses, up the hill
  [338, 6, 182, 7.2, 6.2], [276, 8, 214, 7.2, 6.2], [214, 9, 176, 7.2, 6.2], [168, 8, 222, 7.2, 6.2],
  // Hotel Hairpin (left)
  [112, 7, 258, 7.6, 6.5], [48, 6, 228, 7.6, 6.5], [78, 5, 168, 7.5, 6.3],
  // Quay Run
  [22, 3, 142, 7.6, 6.3], [-58, 2, 158, 8, 6.3], [-148, 1, 136, 8, 6.3], [-220, 0.4, 86, 8, 6.5],
  // Clock Corner back onto the straight
  [-268, 0, 28, 8.5, 8], [-246, 0, 8, 9, 14],
  [-170, 0, 0, 9, 16], [-80, 0, 0, 9, 16],
];
const M = CP.length;
export const LAMPWICK = {
  id: 'lampwick',
  name: 'Lampwick Mile',
  blurb: 'Night streets: neon, a city hill and walls close to the track.',
  theme: 'neonStreet',
  seed: 41,
  points: CP,
  sections: [
    { name: 'Lamp Straight', a: 18.2, b: M + 2.4, kind: 'straight' },
    { name: 'Marquee Bend', a: 2.4, b: 5.5 },
    { name: 'Arcade Esses', a: 5.5, b: 9.5 },
    { name: 'Hotel Hairpin', a: 9.5, b: 12.6 },
    { name: 'Quay Run', a: 12.6, b: 17.3 },
    { name: 'Clock Corner', a: 17.3, b: 18.2 },
  ],
  pit: { entry: -215, laneStart: -175, laneEnd: 140, exit: 190, speed: 22 },
};
