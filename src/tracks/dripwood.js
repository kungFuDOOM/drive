// "Dripwood Vale": rainy forest circuit (original). A gentle valley climb, a root hairpin,
// puddle esses and a creek-side run home. Elevation is real but the grades stay mild.
// control points: [x, y(elevation), z, halfWidth, runoff]
const CP = [
  // Moss Straight (pit straight)
  [0, 2, 0, 9.5, 16], [130, 2, 0, 9.5, 16], [260, 2, 0, 9.5, 16],
  // Fern Bend
  [340, 3, 24, 8.5, 15], [412, 5, 88, 8, 14], [448, 8, 158, 8, 14],
  // Canopy Climb
  [452, 11, 232, 8, 14], [410, 14, 302, 8, 14], [340, 16, 350, 8, 14], [265, 17, 378, 8, 14],
  // Root Hairpin — spacing copied from a known-good mesa hairpin, then a flowing exit
  [190, 16, 400, 8.5, 13], [125, 15, 388, 8.5, 13], [108, 14, 348, 8, 13], [150, 12, 310, 8, 13],
  // Puddle Esses: one open S, not a crawl
  [215, 10, 268, 8, 14], [255, 8, 208, 8, 14], [188, 6, 162, 8, 14],
  // Creek Run
  [98, 4, 152, 8.5, 15], [8, 3, 158, 8.5, 15], [-92, 2.5, 142, 9, 15], [-182, 2, 112, 9, 15],
  // Owl Sweep onto the straight
  [-255, 2, 76, 9, 15], [-325, 2, 38, 9, 15], [-292, 2, 10, 9.5, 16],
  [-250, 2, 0, 9.5, 16], [-130, 2, 0, 9.5, 16],
];
const M = CP.length;
export const DRIPWOOD = {
  id: 'dripwood',
  name: 'Dripwood Vale',
  blurb: 'Wet forest: rain, puddles and a climb under the canopy.',
  theme: 'forest',
  seed: 23,
  points: CP,
  sections: [
    { name: 'Moss Straight', a: 23.2, b: M + 2.4, kind: 'straight' },
    { name: 'Fern Bend', a: 2.4, b: 5.6 },
    { name: 'Canopy Climb', a: 5.6, b: 9.5 },
    { name: 'Root Hairpin', a: 9.5, b: 13.4 },
    { name: 'Puddle Esses', a: 13.4, b: 16.5 },
    { name: 'Creek Run', a: 16.5, b: 20.5, kind: 'straight' },
    { name: 'Owl Sweep', a: 20.5, b: 23.2 },
  ],
  pit: { entry: -215, laneStart: -175, laneEnd: 140, exit: 190, speed: 22 },
};
