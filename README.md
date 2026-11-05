# Gridline Rush

Original, IP-free pixel-art open-wheel racing prototype (Vite + Three.js). All teams, corners and the circuit are made up.

## Run
```
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm test         # vitest unit tests (lap counting, grip, tire wear, slipstream)
```

## Controls
| Input | Action |
|---|---|
| Arrows / WASD | steer, gas, brake |
| Shift / B | slipstream boost (meter fills when tucked behind a car) |
| C | chase / overhead camera |
| T | autopilot |
| P | request pit stop (also: drive onto the pit lane); 1 / 2 pick dry / wet tires |
| M | mute |
| Gamepad | stick/D-pad steer, RT/A gas, LT/B brake, RB/X boost, Y camera, LB pit, Select autopilot |
| Touch | bottom-left steer buttons, bottom-right brake/gas/boost; top-right buttons for camera/auto/pit/sound |

## Circuit (3D spline with real elevation)
Ironside Straight (long, fast, pit lane + grandstands) → Anvil Bend → **Thunder Climb** (fast uphill left-right-left) → Crown Hairpin → **The Plunge** (blind, steep downhill chicane) → **Citadel Squeeze** (narrow stone-walled section past a ruined keep and gatehouse) → Moat Sweep.

## Structure
- `src/track.js` – spline path, widths, elevation, walls, pit data, queries (no rendering)
- `src/physics.js` – pure logic: lap progress, grip, tire wear, slipstream (unit tested)
- `src/race.js`, `src/ai.js` – simulation, AI racing line, pit state machine, weather
- `src/cars.js` – low-poly GP and Speedway cars
- `src/themes/circuitDay.js` – self-contained theme (`build(scene, track)`, `dispose()`, `setWeather()`, plus `update`/`setStartLights`); the only place scenery, sky, lights and surface materials live
- `src/main.js` – low-res render target + nearest upscale/palette post pass, HUD, cameras, `window.__game`
- `_prior/` – leftover files from an earlier attempt that were already in `src/`; unused, safe to delete

## Testing hook
`window.__game`: `startRace({cls:'gp'|'speedway', laps:3-5, weather:'auto'|'dry'|'rain'})`, `setRain(bool)`, `enterPit()`, `choosePitTire('dry'|'wet')`, `setAutopilot(bool)`, `toggleCamera()`, `fastForward(seconds)`, `state()`, `race`.

Rain may start mid-race (default "RAIN?" setting): it lowers grip, tires wear (shown in HUD), and the pit lane lets you switch compounds.
