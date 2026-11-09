// Graphics quality presets (Low / Medium / High). Pure data + picking logic, no WebGL, so it is unit-testable.
export const GFX_LEVELS = ['low', 'medium', 'high'];
export const GFX_LABEL = { low: 'LOW', medium: 'MED', high: 'HIGH' };

/**
 * dprCap: max device pixel ratio; shadow: sun shadow map size; ao: 'none' | 'gtao' (+ aoScale = fraction of full res);
 * bloom: { strength, radius, threshold, scale } (scale = fraction of full res); aa: 'fxaa' | 'smaa'; props: theme prop density level (0..2).
 */
export const GFX_PRESETS = {
  low: { dprCap: 1, shadow: 1024, ao: 'none', aoScale: 0, bloom: { strength: 0.45, radius: 0.35, threshold: 1.6, scale: 0.5 }, aa: 'fxaa', props: 0 },
  medium: { dprCap: 1.5, shadow: 1536, ao: 'gtao', aoScale: 0.5, bloom: { strength: 0.55, radius: 0.5, threshold: 1.5, scale: 0.5 }, aa: 'smaa', props: 1 },
  high: { dprCap: 2, shadow: 2048, ao: 'gtao', aoScale: 1, bloom: { strength: 0.65, radius: 0.6, threshold: 1.4, scale: 1 }, aa: 'smaa', props: 2 },
};

export const normalizeGfx = (v) => (GFX_LEVELS.includes(v) ? v : null);
export const gfxIndex = (v) => Math.max(0, GFX_LEVELS.indexOf(v));

/** Phones and small touch screens start on Low, tablets on Medium, everything else on High. */
export function defaultGfx({ touch = false, width = 1280, height = 720 } = {}) {
  if (!touch) return 'high';
  return Math.min(width, height) <= 520 || Math.max(width, height) <= 960 ? 'low' : 'medium';
}

/** Effective pixel ratio: the device's, capped by the preset. */
export const pixelRatioFor = (dpr, gfx) => Math.max(1, Math.min(dpr || 1, GFX_PRESETS[gfx]?.dprCap ?? 1));
