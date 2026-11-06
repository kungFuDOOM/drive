// "Saltspray Coast": daytime clifftop circuit (original). Clockwise, sea on the outside: a beach-level start straight,
// a 40 m cliff climb, a clifftop hairpin, tight harbour esses and a long run back along the hills.
// control points: [x, y(elevation), z, halfWidth, runoff]
const CP = [
  // Breaker Straight (pit straight, just above the beach)
  [0, 2, 0, 9.5, 16], [130, 2, 0, 9.5, 16], [260, 2, 0, 9.5, 16],
  // Gull Bend: right-left
  [335, 2, 6, 8.5, 15], [392, 3, 38, 8.5, 15], [425, 5, 92, 8, 15],
  // Cliffhanger Climb: sweeping up the headland
  [438, 11, 143, 8, 15], [429, 19, 194, 8, 15], [442, 28, 244, 8, 15], [438, 36, 294, 8, 15],
  // Lantern Run (clifftop, sea on the left)
  [395, 40, 338, 8, 14], [320, 41, 356, 8, 14], [245, 41, 352, 8, 14],
  // Lantern Hairpin (left 180)
  [200, 41, 355, 8.5, 13], [148, 41, 386, 8.5, 13], [178, 40, 428, 8.5, 13], [245, 38, 434, 8, 13],
  // Tidewall Esses: downhill towards the harbour
  [305, 34, 453, 7.5, 13], [350, 28, 496, 7.5, 13], [300, 22, 536, 7.5, 13], [225, 17, 532, 7.5, 13],
  // Kelp Chicane + Harbour Run (west, falling to sea level)
  [150, 11, 518, 7, 8], [95, 7, 545, 7, 8], [38, 5, 516, 7.5, 12], [-60, 3, 519, 8.5, 15], [-150, 2, 525, 8.5, 15],
  // Reef Curve: big right then north along the inland hills
  [-250, 2, 525, 8.5, 15], [-330, 4, 489, 8.5, 15], [-345, 8, 431, 8, 15], [-326, 11, 374, 8, 15],
  [-342, 9, 316, 8, 15], [-331, 6, 258, 8, 15], [-343, 4, 201, 8, 15], [-330, 3, 136, 8.5, 15],
  // Breaker Corner: final right onto the straight
  [-310, 2, 70, 9, 15], [-285, 2, 15, 9.5, 16],
  // (Breaker Straight, before the line)
  [-250, 2, 0, 9.5, 16], [-130, 2, 0, 9.5, 16],
];
const M = CP.length;
export const COASTAL = {
  id: 'coastal',
  name: 'Saltspray Coast',
  blurb: 'Sea-cliff circuit in daylight: beach straight, a 40 m climb and harbour esses.',
  theme: 'coastal',
  seed: 53,
  points: CP,
  sections: [
    { name: 'Breaker Straight', a: 34.2, b: M + 2.6, kind: 'straight' },
    { name: 'Gull Bend', a: 2.6, b: 5.8 },
    { name: 'Cliffhanger Climb', a: 5.8, b: 9.8 },
    { name: 'Lantern Run', a: 9.8, b: 13 },
    { name: 'Lantern Hairpin', a: 13, b: 16.6 },
    { name: 'Tidewall Esses', a: 16.6, b: 20.4 },
    { name: 'Kelp Chicane', a: 20.4, b: 23.6 },
    { name: 'Harbour Run', a: 23.6, b: 26.4, kind: 'straight' },
    { name: 'Reef Curve', a: 26.4, b: 33.2 },
    { name: 'Breaker Corner', a: 33.2, b: 34.2 },
  ],
  pit: { entry: -215, laneStart: -175, laneEnd: 140, exit: 190, speed: 22 },
};
