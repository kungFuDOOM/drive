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
- **Race**: 3-5 laps, 10 cars. Goal: finish top 3 (Hard: top 2). Pit stops and weather apply.
- **Time Trial**: solo, unlimited laps. Chase your best lap; a translucent ghost car replays your best lap. Goal: beat your best lap. Press `END` or pause and choose Finish session to see results.
- **Difficulty** (Easy / Normal / Hard) scales AI pace, aggression (draft / attack / defend) and mistake rate (late braking, running wide, lock-ups).
- **Results** screen has Replay Race and Menu. Goals are shown in the menu, the HUD (top-left) and the results.

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
