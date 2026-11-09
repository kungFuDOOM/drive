# Modern graphics plan (branch claude/modern-graphics)

Each task is done when its finish line holds. No physics / AI / career / menu-logic changes.

1. **gfx.js (pure presets)** - Low/Medium/High presets, phone auto-pick, DPR cap. Done when `gfx.test.js` passes.
2. **Renderer rewrite (main.js)** - drop low-res target, nearest upscale, dither, texel snapping, integer-scale letterbox. Canvas renders at capped device DPR; sRGB output + ACES filmic tone mapping. Done when no `renderScale` import remains and the frame is non-black.
3. **Post pipeline (postfx.js)** - EffectComposer: RenderPass -> weather FX pass (rain/speed lines/sat/tint, kept) -> GTAO (Med half-res, High full; Low off) -> UnrealBloom -> OutputPass -> SMAA (FXAA on Low). Done when each preset renders and `perfStats()` reports the preset.
4. **Materials + env** - Lambert/Phong -> MeshStandard in the themes, smooth creased car normals, Physical clearcoat paint, glossy glass, metal rims, HDR emissive lamps for bloom, PMREM env map. Done when cars/tracks look shaded, and cars.test passes unchanged.
5. **Per-track mood** - each theme style gets exposure, bloom, env intensity, wet-roughness, fog/sky/sun values retuned. Neon street gets colored env reflections on wet asphalt. Done when screenshots of all 6 themes differ in mood.
6. **Soft shadows** - PCFSoftShadowMap, size per preset (1024/1536/2048), shadow camera keeps following the player. Done when car shadows show on track in screenshots.
7. **Graphics setting** - LOW/MED/HIGH row in the race menu, persisted in settings, auto Low on phones. Done when it survives reload and menu layout tests still pass.
8. **Verify** - `npm test`, `npm run build`, Playwright screenshots (1280x720, 390x844, 844x390) in /workspace/drive-gfx-ref/shots/, HUD + touch buttons visible; PR opened (not merged).
