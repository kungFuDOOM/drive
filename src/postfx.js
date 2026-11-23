// Post-processing pipeline (EffectComposer): scene -> GTAO -> bloom -> filmic tone map + sRGB -> colour grade / weather overlay -> AA.
// The renderer itself stays at full device resolution (capped DPR per quality preset); there is no low-res target any more.
//
// Exposure lives in the OutputPass (renderer.toneMappingExposure). The bloom threshold is divided by the exposure so it is
// measured in what the viewer sees: with a threshold of ~1.0 only emissive / HDR sources (lamps, neon, sun glints) bloom,
// lit white paint, concrete, road lines and snow (which the themes keep below ~0.85) never do.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { FXAAPass } from 'three/examples/jsm/postprocessing/FXAAPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GFX_PRESETS } from './gfx.js';

/**
 * Display-space grade + weather / speed overlay (runs after tone mapping, so nothing here can bloom or clip in HDR):
 * saturation, gentle S-curve contrast, per-theme tint, soft vignette, thin rain streaks and edge-only speed lines.
 */
const GradeShader = {
  uniforms: {
    tDiffuse: { value: null }, res: { value: new THREE.Vector2(1280, 720) }, rain: { value: 0 }, time: { value: 0 }, sat: { value: 1 },
    contrast: { value: 1 }, vignette: { value: 0.18 }, tint: { value: new THREE.Vector3(1, 1, 1) }, speed: { value: 0 },
  },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 res; uniform float rain, time, sat, speed, contrast, vignette; uniform vec3 tint; varying vec2 vUv;
    float h11(float n){ return fract(sin(n*91.345)*47453.5453); }
    void main(){
      vec4 s = texture2D(tDiffuse, vUv); vec3 c = s.rgb;
      float l = dot(c, vec3(.2126,.7152,.0722));
      c = max(mix(vec3(l), c, sat), 0.) * tint;
      // S-curve around mid grey: deeper shadows, brighter mids, highlights roll off instead of clipping
      vec3 sc = c * c * (3. - 2. * c);
      c = mix(c, sc, clamp(contrast - 1., 0., 1.));
      vec2 dv = (vUv - .5) * vec2(res.x / res.y, 1.);
      c *= 1. - vignette * smoothstep(.35, 1.05, length(dv));
      float unit = res.y / 360.; // streak geometry scales with the frame height, not with pixels
      if (rain > 0.02) {
        vec2 p = vUv * res / unit; float a = 0.;
        for (int k = 0; k < 2; k++) {
          float sp = k == 0 ? 3. : 5., spd = k == 0 ? 95. : 150., len = k == 0 ? 14. : 9.;
          float u = p.x - p.y*0.25, w = p.y;
          float col = floor(u / sp), r = h11(col + float(k)*17.3);
          float edge = abs(fract(u / sp) - .5) * sp;
          if (edge < .35 && r < rain*0.4) {
            float q = fract((w + time*spd*(0.8 + r*0.5)) / (len*(1.8 + r*2.)) + r*9.);
            a = max(a, q < 0.35 ? 1. - q/0.35 : 0.);
          }
        }
        c = mix(c, vec3(.78,.84,.92), a*0.22*rain);
      }
      if (speed > 0.02) {
        float rr = length(dv), ang = atan(dv.y, dv.x);
        float ray = floor(ang * 64.), rh = h11(ray + 3.1);
        float ph = fract(rr * 2.2 - time * (1.6 + rh * 1.4) + rh * 7.);
        float edge = smoothstep(.5, .85, rr);
        float on = step(1. - speed * .45, rh) * step(ph, .22) * edge;
        c = mix(c, vec3(1.), on * .16 * speed);
      }
      gl_FragColor = vec4(c, s.a);
    }`,
};
/** GTAO that ignores transparent / unlit / shader-driven objects (sky dome, light cones, glass, lamps) so they do not leave AO halos. */
class SceneGTAOPass extends GTAOPass {
  _overrideVisibility() {
    const cache = this._visibilityCache;
    this.scene.traverse((o) => {
      if (!o.visible) return;
      const m = o.material;
      if (o.isPoints || o.isLine || (m && !Array.isArray(m) && (m.transparent || m.isShaderMaterial || m.isMeshBasicMaterial)) || o.userData.noAO) { o.visible = false; cache.push(o); }
    });
  }
}
/**
 * Prefiltered environment map: 'room' studio, 'sky' outdoor day probe, 'night' floodlit night, 'neon' street signs.
 * `spec` (sky only): linear rgb triples { top, bot, gnd, sunCol, cloudCol }, sunDir, cover 0..1, strips: the probe then matches the
 * theme's real sky and weather, so puddles, glass, metal and paint reflect what is actually overhead.
 */
export function buildEnv(pmrem, kind = 'room', spec = null) {
  if (kind === 'neon') {
    const src = new THREE.Scene(); src.background = new THREE.Color(0x07040e);
    const sign = (c, x, y, z, w, h) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(4), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); src.add(m); };
    // a ring of smaller signs in mixed colours at 8..35 deg elevation (what a wet road mirrors from the chase camera): puddles pick up
    // different hues across the road and as the car turns, instead of one sign flooding every puddle with a single colour
    const hues = [0xff2bd6, 0x27f0ff, 0xffa21f, 0xff2bd6, 0x4a6bff, 0x27f0ff, 0xff4a6a]; // magenta and cyan lead (the street's signature)
    for (let k = 0; k < 15; k++) {
      const a = (k - 4 + 0.22 * Math.sin(k * 2.4)) / 15 * Math.PI * 2, r = 13 + (k % 3), big = k % 5 === 0;
      sign(hues[(k * 3) % hues.length], Math.cos(a) * r, 2.2 + ((k * 5) % 7) * 0.95, Math.sin(a) * r, big ? 5.5 : 2.6 + (k % 4) * 0.5, big ? 3.6 : 1.5 + (k % 3) * 0.6);
    }
    const top = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial({ color: 0x2a1648, side: THREE.DoubleSide })); top.position.y = 14; top.rotation.x = Math.PI / 2; src.add(top);
    return pmrem.fromScene(src, 0.03).texture;
  } else if (kind === 'night') {
    // night circuit: deep blue dome, a ring of warm floodlight panels, dark ground
    const src = new THREE.Scene(); src.background = new THREE.Color(0x05070f);
    for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2, m = new THREE.Mesh(new THREE.PlaneGeometry(5, 2.5), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 2.8, 2.4), side: THREE.DoubleSide })); m.position.set(Math.cos(a) * 14, 7, Math.sin(a) * 14); m.lookAt(0, 0, 0); src.add(m); }
    const top = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial({ color: 0x141c3a, side: THREE.DoubleSide })); top.position.y = 14; top.rotation.x = Math.PI / 2; src.add(top);
    return pmrem.fromScene(src, 0.03).texture;
  } else if (kind === 'sky') {
    // outdoor probe built from the theme's own sky: zenith / horizon colours, cloud masses (cover and colour follow the weather), sun
    // panel, ground bounce. Without a spec it is a generic clear summer sky (car editor preview).
    const P = { top: [0.16, 0.33, 0.78], bot: [0.5, 0.66, 0.86], gnd: [0.2, 0.22, 0.18], sunDir: [-0.5, 0.7, 0.45], sunCol: [1.6, 1.52, 1.36], cloudCol: [0.8, 0.8, 0.8], cover: 0.35, strips: 0.85, ...(spec || {}) };
    const src = new THREE.Scene();
    const dome = new THREE.Mesh(new THREE.SphereGeometry(20, 24, 12), new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: { top: { value: new THREE.Vector3(...P.top) }, bot: { value: new THREE.Vector3(...P.bot) }, gnd: { value: new THREE.Vector3(...P.gnd) }, sunDir: { value: new THREE.Vector3(...P.sunDir).normalize() },
        sunCol: { value: new THREE.Vector3(...P.sunCol) }, cloudCol: { value: new THREE.Vector3(...P.cloudCol) }, cover: { value: P.cover } },
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: `varying vec3 vP; uniform vec3 top, bot, gnd, sunDir, sunCol, cloudCol; uniform float cover;
        void main(){
          vec3 d = normalize(vP); float y = d.y, yu = max(y, 0.);
          vec3 c = mix(bot, top, pow(yu, .42));
          vec2 q = d.xz / (yu + .25) * 1.6;   // broad cloud masses: low frequency, the prefilter blurs them anyway
          float n = .5 + .28 * sin(q.x * 1.7 + 1.3) * sin(q.y * 1.3 + .7) + .22 * sin(q.x * 2.9 - q.y * 2.3 + 2.1);
          float lo = .92 - cover - .5 * smoothstep(.82, .95, cover), den = smoothstep(lo, lo + .3, n) * smoothstep(0., .2, y);
          c = mix(c, cloudCol, den);
          if (y <= 0.) c = mix(gnd * .45, gnd, smoothstep(-.5, 0., y));
          c += sunCol * smoothstep(.99, .997, dot(d, sunDir)) * (1. - den);
          gl_FragColor = vec4(c, 1.);
        }`,
    }));
    src.add(dome);
    // a couple of soft studio strips so the clearcoat catches clean highlights along the body (fade out under an overcast sky)
    if (P.strips > 0.01) for (const [x, y, z] of [[0, 14, 0], [10, 6, -8]]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(14, 3), new THREE.MeshBasicMaterial({ color: new THREE.Color().setScalar(P.strips), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); src.add(m); }
    const rt = pmrem.fromScene(src, 0.02);
    dome.geometry.dispose(); dome.material.dispose();
    return rt.texture;
  } else return pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
}
export class PostFx {
  constructor(renderer, scene, camera) {
    this.renderer = renderer; this.scene = scene; this.camera = camera;
    this.preset = null; this.gfx = null; this.w = 1; this.h = 1; this.dpr = 1;
    this.fx = { rain: 0, time: 0, sat: 1, tint: [1, 1, 1], speed: 0 };
    this.mood = { exposure: 1, bloom: 1, aoBlend: 0.6, contrast: 1.12, sat: 1.1, vignette: 0.18, threshold: 1 };
    this.pmrem = new THREE.PMREMGenerator(renderer); this.envs = {};
  }
  /**
   * cached prefiltered environment: 'room' = neutral studio sheen, 'sky' = daylight, 'night' = floodlit, 'neon' = dark street with signs.
   * With a `spec` ({ key, ...sky colours }, see buildEnv) the probe is theme + weather specific: the last few are kept, older ones are
   * disposed (never the one the scene is using), so a rain front costs a handful of small probe renders and no growing memory.
   */
  env(kind = 'room', spec = null) {
    if (!spec) {
      if (!this.envs[kind]) this.envs[kind] = buildEnv(this.pmrem, kind);
      return this.envs[kind];
    }
    const W = this.wxEnvs || (this.wxEnvs = new Map());
    let tex = W.get(spec.key);
    if (tex) { W.delete(spec.key); W.set(spec.key, tex); return tex; } // refresh LRU order
    tex = buildEnv(this.pmrem, kind, spec); W.set(spec.key, tex);
    for (const [k, t] of W) { if (W.size <= 3) break; if (t === this.scene.environment || t === tex) continue; (t.renderTarget || t).dispose(); W.delete(k); }
    return tex;
  }
  /** (re)build the pass chain for a quality preset */
  setGfx(gfx) {
    if (gfx === this.gfx && this.composer) return;
    this.gfx = gfx; this.preset = GFX_PRESETS[gfx];
    this.dispose();
    const p = this.preset, r = this.renderer;
    const rt = new THREE.WebGLRenderTarget(this.w, this.h, { type: THREE.HalfFloatType });
    this.composer = new EffectComposer(r, rt);
    this.composer.setPixelRatio(this.dpr);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.ao = null;
    if (p.ao === 'gtao') {
      this.ao = new SceneGTAOPass(this.scene, this.camera, this.w, this.h);
      // small world radius: darkens contacts and creases (car on road, barrier foot, crowd rows), never a screen-wide grey veil
      this.ao.updateGtaoMaterial({ radius: 0.7, distanceExponent: 1.6, thickness: 1, scale: 1, samples: 12, distanceFallOff: 0.5, screenSpaceRadius: false });
      this.ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 4, rings: 2, samples: 12 });
      this.ao.blendIntensity = this.mood.aoBlend;
      this.composer.addPass(this.ao);
    }
    this.bloom = new UnrealBloomPass(new THREE.Vector2(this.w * p.bloom.scale, this.h * p.bloom.scale), p.bloom.strength, p.bloom.radius, p.bloom.threshold);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass()); // ACES filmic + sRGB (reads renderer.toneMapping / toneMappingExposure)
    this.grade = new ShaderPass(GradeShader); this.composer.addPass(this.grade);
    this.aaPass = p.aa === 'smaa' ? new SMAAPass() : new FXAAPass();
    this.composer.addPass(this.aaPass);
    this.applySize();
    this.setMood(this.mood);
  }
  /** css-pixel size + device pixel ratio (already capped) */
  setSize(w, h, dpr) { this.w = Math.max(1, w); this.h = Math.max(1, h); this.dpr = dpr; if (this.composer) { this.composer.setPixelRatio(dpr); this.applySize(); } }
  applySize() {
    this.composer.setSize(this.w, this.h);
    if (this.ao && this.preset.aoScale < 1) { const s = this.preset.aoScale, pw = Math.round(this.w * this.dpr * s), ph = Math.round(this.h * this.dpr * s); this.ao.setSize(pw, ph); this.ao.gtaoRenderTarget.setSize(pw, ph); this.ao.pdRenderTarget.setSize(pw, ph); this.ao.normalRenderTarget.setSize(pw, ph); }
    this.grade.uniforms.res.value.set(this.w * this.dpr, this.h * this.dpr);
  }
  /** per-theme look: exposure, bloom strength multiplier, AO blend and display grade (saturation / contrast / vignette) */
  setMood(m = {}) {
    const M = this.mood = { ...this.mood, ...m };
    this.renderer.toneMappingExposure = M.exposure;
    if (this.bloom) { this.bloom.strength = this.preset.bloom.strength * M.bloom; this.bloom.enabled = this.bloom.strength >= (this.preset.bloomMin ?? 0); this.bloom.threshold = this.preset.bloom.threshold * (M.threshold ?? 1) / Math.max(0.05, M.exposure); }
    if (this.ao) this.ao.blendIntensity = M.aoBlend;
    if (this.grade) { const U = this.grade.uniforms; U.contrast.value = M.contrast; U.vignette.value = M.vignette; }
  }
  render(dt) {
    const U = this.grade.uniforms, f = this.fx;
    U.rain.value = f.rain; U.time.value = f.time; U.sat.value = f.sat * this.mood.sat; U.tint.value.set(f.tint[0], f.tint[1], f.tint[2]); U.speed.value = f.speed;
    this.composer.render(dt);
  }
  dispose() {
    if (!this.composer) return;
    for (const p of this.composer.passes) p.dispose?.();
    this.composer.renderTarget1.dispose(); this.composer.renderTarget2.dispose();
    this.composer = null;
  }
}
