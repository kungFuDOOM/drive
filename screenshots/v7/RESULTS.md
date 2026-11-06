# Drive v7

Career season, a create-your-own team, and a track picker on the three original circuits. Quick race and time trial stay. Driving physics and the control scheme are unchanged (text fields ignore driving keys only while they are focused).

## Tests

`npm test`: **231 passed** (25 files). The previous career-wip tip was 212. New coverage:

- Championship points 25-18-15-12-10-8-6-4-2-1, standings order, win countback, save/load, hostile save clamps.
- Upgrade levels stop at 5. Costs are 4/6/8/10/12. Stat bumps stay under about 5% and do not mutate the shared car class.
- Livery editor: pattern presets, name/number sanitising, every preset changes the preview mesh.
- Solo racing-line AI: **0** off-asphalt frames on Citadel Circuit, Sandglass Circuit and Saltspray Coast.
- Braking bot faster than the lift-only bot on each circuit, with the braking lap off-track fraction at 0.

## Draw calls

Headless Chrome, quality 2, MSAA 4, 932×430, 10 cars in a race. The low-res target matched the window (`k = 1`), so this is the scene pass, not a phone GPU figure.

| Circuit | Draw calls | Triangles |
|---|---:|---:|
| Citadel Circuit | 93 | 981k |
| Sandglass Circuit | 116 | 635k |
| Saltspray Coast | 92 | 1.51M |

The v6 Citadel figure at the same window was 119. All three stay in that mobile range.

## Shots

`screenshots/v7/` has the career hub, standings, upgrades and livery editor, plus chase and overhead on each circuit, at 932×430, 390×844 and 844×390. Touch gas/brake/boost sit in the bottom corner at the two phone sizes, and the floating joystick zone still covers the left 45% of the screen.
