# Drive v9

The main menu, career hub, and standings are a pixel front end over the orbiting circuit. Race, time trial, and career stay the same options. Driving, physics, and the save format for class bests are unchanged. A lap can also be remembered per circuit (`trackBests`) without replacing the class best.

## Tests

`npm test`: **277 passed** (28 files). The previous 264 still pass, plus track-card, menu-focus, and per-circuit best-lap cases.

## Shots

Headless Chrome, SwiftShader. No scrolling and no control under 44px at these sizes.

| Screen | 844×390 | 932×430 | 390×844 | 1280×720 |
|---|---|---|---|---|
| Main menu | `menu-844x390.png` | `menu-932x430.png` | `menu-390x844.png` | `menu-1280x720.png` |
| Career hub | `career-844x390.png` | `career-932x430.png` | `career-390x844.png` | `career-1280x720.png` |
| Standings | `standings-844x390.png` | `standings-932x430.png` | `standings-390x844.png` | `standings-1280x720.png` |

The hub shot is round 2 of 6 on Highpine Ring (the round just scored was Citadel). The menu shot is a quick race at Citadel with Speedway still locked.
