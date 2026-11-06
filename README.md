# Drive

Original, IP-free pixel-art open-wheel racing prototype (Vite + Three.js). All teams, corners and the circuit are made up.

## Run
```
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm test         # vitest unit tests (lap counting, lap timer/sectors, ghost, progression, grip, tire wear, slipstream, AI-race simulation)
```

## Controls
| Input | Action |
|---|---|
| Arrows / WASD | steer, gas, brake (player driving is the default) |
| Shift / B | slipstream boost (meter fills when tucked behind a car) |
| T / gamepad Select / AUTO button | autopilot toggle (secondary; OFF by default) |
| C / gamepad Y (triangle) / CAM button | cycles three cameras: chase -> angled overhead (35deg FOV, ~55deg pitch, leads the car, slow heading follow) -> full-track map view, with a smooth zoom transition |
| Esc / gamepad Start / II button | pause menu: Resume, Restart, Finish session, Menu |
| P | request pit stop, Race only (also: drive onto the pit lane); 1 / 2 pick dry / wet tires |
| M | mute |
| Gamepad | stick/D-pad steer, RT/A gas, LT/B brake, RB/X boost, LB pit (Race), Y camera, Select autopilot, Start pause |
| Touch | bottom-left steer buttons, bottom-right brake/gas/boost; top-right buttons for camera/auto/pit/sound |

## Game modes
- **Race**: 3-5 laps, 10 cars, on any circuit. Goal: finish top 3 (Hard: top 2). Pit stops and weather apply.
- **Time Trial**: solo, unlimited laps, on any circuit. Chase your best lap; a translucent ghost car replays your best lap. Goal: beat your best lap. Press `END` or pause and choose Finish session to see results.
- **Career**: a season across every circuit. You name the driver and the team, pick a number and a livery, and race the same nine rivals at Easy, Medium or Hard. Finishes score 25-18-15-12-10-8-6-4-2-1. Research points buy small, capped upgrades (engine, aero, brakes, tires) between races. The season, standings and team are stored in localStorage (`drive-career-v1`, `drive-garage-v1`).
- **Your team**: primary, secondary and accent colours, an original pattern, and a race number. The car is previewed in 3D and used in races, the menu and the standings.
- **Difficulty** (Easy / Normal / Hard) scales AI pace, aggression (draft / attack / defend) and mistake rate (late braking, running wide, lock-ups). In a career it also scales rival pace and research points.
- **Results** screen has Replay Race and Menu (career races continue to the upgrade screen). Goals are shown in the menu, the HUD (top-left) and the results.

## Circuits
Six original layouts (real circuits only inspired corner types). Citadel Circuit (day), Highpine Ring (snow), Dripwood Vale (rain forest), Sandglass Circuit (desert night), Lampwick Mile (neon streets), Saltspray Coast (day). Pick one for a quick race or time trial; a career visits each in that order. The career hub and the standings show the next round's circuit behind the panel.

## Progression
- The **Speedway** class is locked until you finish top 3 in a GP Race. Time Trial does not count toward the unlock.
- Lock and unlock messages appear in the menu and results.
- Best laps, sector bests, ghost and settings persist in localStorage (keys `drive-save-v1` and `drive-ghost-v1:<class>`).

## Handling
- Steering is speed-sensitive. Cornering is grip-limited, and running past the grip limit gives understeer scrub.
- Braking eats lateral grip (trail braking). Brakes are strong but finite.
- Grass and gravel heavily slow the car and reduce grip. Braking zones and racing lines matter.
- HUD: current lap, best lap, and S1-S3 sector boxes (purple = best ever sector, green = beats the best-lap reference, yellow = slower), with a +/- delta popup.
- The corner minimap is shown in the chase view only (hidden in the overhead and full-track views). HUD elements stay on screen edges.
- Layout works at 844x390, 932x430 and portrait 390x844.

## Circuit (3D spline with real elevation)
Ironside Straight (long, fast, pit lane + grandstands) → Anvil Bend → **Thunder Climb** (fast uphill left-right-left) → Crown Hairpin → **The Plunge** (blind, steep downhill chicane) → **Citadel Squeeze** (narrow stone-walled section past a ruined keep and gatehouse) → Moat Sweep.

## Structure
- `src/tracks/` – circuit definitions. `src/track.js` turns one into the sampled spline
- `src/career.js` – season calendar, points, rivals, upgrades, save/load (no rendering)
- `src/livery.js` – team name and livery sanitising, editor state
- `src/track.js` – spline path, widths, elevation, walls, pit data, queries (no rendering)
- `src/physics.js` – pure logic: lap progress, grip, tire wear, slipstream (unit tested)
- `src/timing.js` – lap timer, 3 sector splits with purple/green/slow classification, ghost recorder/sampler (pure, tested)
- `src/progress.js` – localStorage save: best laps, class unlocks, goals, difficulty table (pure, storage injected, tested)
- `src/race.js`, `src/ai.js` – simulation, AI racing line, pit state machine, weather
- `src/cars.js` – low-poly GP and Speedway cars
- `src/themes/circuitDay.js` – self-contained theme (`build(scene, track)`, `dispose()`, `setWeather()`, plus `update`/`setStartLights`); the only place scenery, sky, lights and surface materials live
- `src/main.js` – low-res render target + nearest upscale/palette post pass, HUD, cameras, `window.__game`

## Visuals / theme
- Low-res render target, nearest-neighbour upscale, with a palette quantise post pass (`src/main.js`).
- Real directional shadow map (`BasicShadowMap`, 2048). Auto-drops to 1024 or off if FPS falls; `?q=0|1|2` forces a quality level.
- Instanced tree clusters, crowd and flags to keep draw calls low.
- Ferris wheel landmark and made-up sponsor billboards.
- Rain: darker, cooler, desaturated post pass; screen-space diagonal streaks, splash pixels and headlight cones.
- Pit stop arrow and pixel crew, with a jack lift for the service state.
- All scenery, sky, lights and surface materials live in `src/themes/circuitDay.js`.

## Test hooks
`window.__game` (see also the testing hook paragraph below):
- `setCamera('chase'|'overhead'|'full', instant?)`: select a camera, optionally without the transition.
- `setRain(bool)`: turn rain on or off.
- `pitService(choice='dry', serv=1.2, hold=true)`: put the player in the pit box in the service state with crew visible, and freeze the sim.
- `hold(bool)`: freeze or unfreeze the sim.
- `setQuality(0-2)`: force a shadow/render quality level.
- `fastForward(sec)`: advance the sim by a number of seconds.
- `teleport(s,d)`: move the car to track position `s` and lateral offset `d`.

## Testing hook
`window.__game`: `startRace({mode:'race'|'tt', difficulty:'easy'|'normal'|'hard', cls:'gp'|'speedway', laps:3-5, weather:'auto'|'dry'|'rain'})`, `setRain(bool)`, `enterPit()`, `choosePitTire('dry'|'wet')`, `setAutopilot(bool)`, `toggleCamera()`, `setPaused(bool)`, `finishSession()`, `showMenu()`, `teleport(s,d)`, `fastForward(seconds)`, `state()`, `race`.

`?autostart=1` starts a session immediately with autopilot ON (test convenience only). Optional params: `&mode=tt|race&diff=easy|normal|hard&cls=gp|speedway&laps=3&weather=dry&cam=top`.

Rain may start mid-race (default "RAIN?" setting): it lowers grip, tires wear (shown in HUD), and the pit lane lets you switch compounds.

## v6 notes

- **Cars** (`src/cars.js`, `src/carFx.js`): original low-poly open-wheel GP / Speedway cars, 4 draw calls each (merged body, instanced wheels, lamps, shadow). `animateCar(car, state, dt)` drives steering, true-radius wheel spin, roll/pitch/bob, brake + rain lights; `CarFx` pools tyre smoke, dust and skid marks for the whole field.
- **Racing line** (`src/racingLine.js`): minimum-curvature line + braking-limited speed profile, shared by the AI, the track and the on-screen guide.
- **LINE guide**: coloured ribbon (green = throttle, yellow = lift/caution, red = brake) from the player's speed vs. required deceleration. Easy/Medium default ON, Hard never; toggle in the menu or pause screen only.
- **Braking** (`src/physics.js`, `src/race.js`): friction ellipse (trail braking), speed-dependent brake capacity, lock-up + flat spot, light assist on Easy; `src/brakeBench.js` compares brake / lift-only / flat-out laps (see `src/brake.test.js`).
- **Braking boards** (`src/brakeBoards.js`): 100 m / 50 m boards before the real braking zones.

### Measured v6 results
- `screenshots/v6/`: chase, overhead and pack captures at 932x430, 844x390 and 390x844; `RESULTS.md` explains stationary close-up captures and limitations.
- Matching same-grid q2 MSAA4 932x430 render: **156 scene draw calls -> 119** (10 cars), with no performance regression claimed for a physical iPhone from the software-rendered desktop test.
- AI grass excursions beyond the kerb at Easy/Medium/Hard, seeds 11/202/3033: **0 frames** (nine whole 10-car three-lap races). Normal seeds 11/202 previously measured 0.195%/0.361%.
- Dry solo-lap bots with identical steering: **brake 42.88 s / lift-only 51.38 s / flat-out 46.72 s**. Lift-only goes off for 21.83% of frames. These are game simulation benchmarks, not a claim of real-F1 fidelity.
