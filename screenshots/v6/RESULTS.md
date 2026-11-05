# Drive v6 evidence

Nine PNG captures, each at the native size in its filename: close chase/grid detail, an angled overhead race and pack/start views at `932x430`, `844x390` and `390x844`. Frames are from the game, not composed illustrations. The `390x844` chase and pack use a stationary car and the pre-race grid for sharp rear/helmet/wing detail, without changing touch-button placement. Desktop captures use quality 2; headless Chromium uses software rendering, not a physical iPhone.

## Tests / build

- 21 test files, 196 tests pass; production Vite build succeeds.
- The final seeded-AI task independently ran all 196 tests five normally-ordered and five shuffled-suite times with no flake.
- The new guide is speed/deceleration-driven: green, yellow and red samples coexist approaching braking zones. Easy and Medium default on; `lineGuideEnabled("hard", true)` remains false and the pause control is `LINE: NONE (HARD)`.

## AI grass cutting

Matches the same process in `src/aiRace.test.js`: every active car frame beyond asphalt AND the 1.4 m kerb, per 10-car three-lap dry race.

| Difficulty | Seeds | Frames | Excursions beyond kerb | Total passes |
|---|---|---:|---:|---:|
| Easy | 11, 202, 3033 | 0/241,774 | 0 m | 192 |
| Medium | 11, 202, 3033 | 0/235,266 | 0 m | 235 |
| Hard | 11, 202, 3033 | 0/230,008 | 0 m | 172 |

Matching v5 Normal: seeds 11/202/3033 = 0.195%/0.361%/0%; here 0%/0%/0%. Other pooled pre-v6 three-race Easy/Normal/Hard measurements were 0.00853%/0.03732%/0.00183% (0.02% rounded). No tolerance of minor grass contact has been added.

## Braking benchmark (same line follower, normal, dry, solo one lap)

| Strategy | Lap | Off asphalt + kerb | Wall hits |
|---|---:|---:|---:|
| Braking | 42.88 s | 0.00% | 0 |
| Lift-only | 51.38 s | 21.83% | 4 |
| Flat-out | 46.72 s | 17.52% | 6 |

Lifting only is 8.50 s slower (19.82% relative to the brake time). The same steering/racing-line follower is used, so the comparison exercises braking, not a steering-only failure. All three complete a timed lap.

## Matched draw calls

Both versions served from the v5 baseline commit and final v6 build, separately, 932x430 at q2/MSAA4, same 10-car standing grid and line guide on: **156 -> 119 draw calls** (37 fewer, 23.7% reduction). Culling changes this with view; no claim of universal fixed cost. Submitted headless fps figures are not meaningful for iPhone due SwiftShader CPU rendering/time slicing. An independent mobile performance test remains needed.

## Limits

This is an original stylized open-wheel racer, not the F1 2020 game or a full simulation. Visual load transfer/pitch and chassis vibration complement grip/friction-ellipse braking; no detailed aerodynamic, suspension-load or tyre-slip-angle solver. Car geometry tests, single-lap bot measurement and AI races are automated; manual game feel, engine/squeal speaker quality, wettyre-pit/late-race handling and Safari memory/GPU performance on real phones remain test gaps. Lockup smoke and long-lasting skid marks are pooled for low overhead. Team names, liveries and circuit are original.

Full raw counter data (including each seeded race and per-corner benchmark) is in `metrics.json`.
