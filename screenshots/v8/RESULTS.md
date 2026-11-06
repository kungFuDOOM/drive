# Drive v8

Three new original circuits, a six-round career, and the career hub / standings backdrop following the next round. Driving physics and the floating joystick plus gas/brake/boost controls are unchanged. The name filter on main is unchanged.

## Tests

`npm test`: **264 passed** (26 files). Solo racing-line AI: **0** off-asphalt frames on every circuit. Braking bot faster than the lift-only bot on every circuit, braking lap off-track fraction 0. The career calendar is the six track ids.

## Draw calls and triangles

Headless Chrome, quality 2, MSAA 4, 932×430, 10-car race, line guide on (Normal default). `k = 1`. SwiftShader on this machine, not a phone GPU. Frame stats now keep frames slower than 500 ms, so every circuit records fps.

| Circuit | Draw calls | Triangles | fps | frames |
|---|---:|---:|---:|---:|
| Citadel Circuit | 119 | 985k | 1.9 | 24 |
| Highpine Ring | 113 | 915k | 2.0 | 24 |
| Dripwood Vale | 124 | 883k | 2.1 | 24 |
| Sandglass Circuit | 133 | 634k | 3.3 | 24 |
| Lampwick Mile | 123 | 198k | 6.9 | 24 |
| Saltspray Coast | 114 | 1.04M | 2.3 | 24 |

Saltspray was 1.51M. Palms keep a frond crown and a bent trunk; shrubs no longer reuse that trunk, and the far woods (in the fog) are thinner. Trackside clumps are unchanged.

## Shots

`screenshots/v8/` has chase and overhead for Highpine Ring, Dripwood Vale and Lampwick Mile at 932×430, 390×844 and 844×390, plus the career hub at those sizes. The hub shot is round 2 of 6: the panel says Highpine Ring and the backdrop is the snow circuit, not Citadel (the round just scored).

Dripwood’s rain, wet road and puddles are drawn by the theme. Grip still follows the race weather, so a dry session is not a wet-setup race.
