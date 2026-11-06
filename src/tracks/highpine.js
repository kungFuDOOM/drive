// "Highpine Ring": snowy mountain circuit (original). Valley pit straight, a climbing switchback,
// a summit hairpin and a long drop back to the firs. No real circuit is copied.
// control points: [x, y(elevation), z, halfWidth, runoff]
const CP = [
  // Fir Straight (pit straight, valley floor)
  [0, 8, 0, 9.5, 16], [130, 8, 0, 9.5, 16], [260, 8, 0, 9.5, 16],
  // Larch Bend: leaves the valley and starts the climb
  [340, 10, 18, 8.5, 14], [400, 14, 72, 8, 14], [428, 20, 142, 8, 14],
  // Switchback Climb — wide enough that the offset walls do not fold
  [400, 28, 210, 7.5, 13], [330, 36, 258, 7.5, 13], [255, 42, 236, 7.5, 12], [195, 48, 286, 7.5, 12], [155, 52, 345, 8, 12],
  // Summit Hairpin (left, on the snowfield)
  [112, 54, 398, 8.5, 13], [52, 54, 374, 8.5, 13], [74, 52, 314, 8, 13],
  // Ridge Run
  [132, 46, 272, 8, 14], [88, 40, 220, 8, 14],
  // Avalanche Drop, staying clear of the climb
  [18, 32, 188, 7.5, 13], [-52, 24, 168, 7.5, 13], [-122, 16, 142, 8, 14], [-192, 12, 112, 8.5, 14], [-252, 9, 86, 9, 15],
  // Lodge Sweep: a wide join, same shape as the other circuits' final corner
  [-318, 8, 60, 9, 15], [-348, 8, 28, 9, 15], [-300, 8, 10, 9.5, 16],
  [-250, 8, 0, 9.5, 16], [-130, 8, 0, 9.5, 16],
];
const M = CP.length;
export const HIGHPINE = {
  id: 'highpine',
  name: 'Highpine Ring',
  blurb: 'Snowbanks, pines and a climb to the summit hairpin.',
  theme: 'alpine',
  seed: 17,
  points: CP,
  sections: [
    { name: 'Fir Straight', a: 23.3, b: M + 2.4, kind: 'straight' },
    { name: 'Larch Bend', a: 2.4, b: 5.6 },
    { name: 'Switchback Climb', a: 5.6, b: 10.6 },
    { name: 'Summit Hairpin', a: 10.6, b: 13.5 },
    { name: 'Ridge Run', a: 13.5, b: 15.5 },
    { name: 'Avalanche Drop', a: 15.5, b: 20.6 },
    { name: 'Lodge Sweep', a: 20.6, b: 23.3 },
  ],
  pit: { entry: -215, laneStart: -175, laneEnd: 140, exit: 190, speed: 22 },
};
