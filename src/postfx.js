// Post-processing pipeline (EffectComposer): scene -> weather FX -> GTAO -> bloom -> filmic tone map + sRGB -> AA.
// The renderer itself stays at full device resolution (capped DPR per quality preset); there is no low-res target any more.
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

/** Weather / speed overlay: rain streaks, speed lines, saturation + tint, mild vignette. Runs in linear HDR, before bloom. */
const FxShader = {
  uniforms: { tDiffuse: { value: null }, res: { value: new THREE.Vector2(1280, 720) }, rain: { value: 0 }, time: { value: 0 }, sat: { value: 1 }, exposure: { value: 1 }, tint: { value: new THREE.Vector3(1, 1, 1) }, speed: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 res; uniform float rain, time, sat, speed, exposure; uniform vec3 tint; varying vec2 vUv;
    float h11(float n){ return fract(sin(n*91.345)*47453.5453); }
    void main(){
      vec4 s = texture2D(tDiffuse, vUv); vec3 c = s.rgb * exposure; // exposure here (before bloom) so the bloom threshold is relative to what the viewer sees
      float l = dot(c, vec3(.2126,.7152,.0722)); c = mix(vec3(l), c, sat) * tint;
      float unit = res.y / 360.; // streak geometry scales with the frame height, not with pixels
      if (rain > 0.02) {
        vec2 p = vUv * res / unit; float a = 0.;
        for (int k = 0; k < 2; k++) {
          float sp = k == 0 ? 3. : 5., spd = k == 0 ? 95. : 150., len = k == 0 ? 14. : 9.;
          float u = p.x - p.y*0.3, w = p.y;
          float col = floor(u / sp), r = h11(col + float(k)*17.3);
          float edge = abs(fract(u / sp) - .5) * sp;
          if (edge < .5 && r < rain*0.5) {
            float q = fract((w + time*spd*(0.8 + r*0.5)) / (len*(1.8 + r*2.)) + r*9.);
            a = max(a, q < 0.4 ? 1. - q/0.4 : 0.);
          }
        }
        c = mix(c, vec3(.7,.78,.88), a*0.3*rain);
        c *= 1. - 0.18*rain*length(vUv-.5);
      }
      if (speed > 0.02) {
        vec2 dc = (vUv - .5) * vec2(res.x/res.y, 1.);
        float rr = length(dc), ang = atan(dc.y, dc.x);
        float ray = floor(ang * 38.), rh = h11(ray + 3.1);
        float ph = fract(rr * 2.2 - time * (1.6 + rh * 1.4) + rh * 7.);
        float edge = smoothstep(.38, .62, rr);
        float on = step(1. - speed * .55, rh) * step(ph, .32) * edge;
        c = mix(c, vec3(1.), on * .4 * speed);
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
      if (o.isPoints || o.isLine || (m && !Array.isArray(m) && (m.transparent || m.isShaderMaterial || m.isMeshBasicMaterial))) { o.visible = false; cache.push(o); }
    });
  }
}

export class PostFx {
  constructor(renderer, scene, camera) {
    this.renderer = renderer; this.scene = scene; this.camera = camera;
    this.preset = null; this.gfx = null; this.w = 1; this.h = 1; this.dpr = 1;
    this.fx = { rain: 0, time: 0, sat: 1, tint: [1, 1, 1], speed: 0 };
    this.pmrem = new THREE.PMREMGenerator(renderer); this.envs = {};
  }
  /** cached prefiltered environment: 'room' = neutral studio sheen, 'neon' = dark street with magenta / cyan / amber signs (wet-asphalt reflections) */
  env(kind = 'room') {
    if (this.envs[kind]) return this.envs[kind];
    let src;
    if (kind === 'neon') {
      src = new THREE.Scene(); src.background = new THREE.Color(0x07040e);
      const sign = (c, x, y, z, w, h) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(4), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); src.add(m); };
      sign(0xff2bd6, 12, 4, -6, 6, 5); sign(0x27f0ff, -12, 5, -4, 7, 4); sign(0xffa21f, 2, 6, 13, 8, 3); sign(0x4a6bff, -6, 3, -13, 8, 5); sign(0xff4a6a, 13, 7, 8, 4, 6);
      const top = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial({ color: 0x2a1648, side: THREE.DoubleSide })); top.position.y = 14; top.rotation.x = Math.PI / 2; src.add(top);
      this.envs[kind] = this.pmrem.fromScene(src, 0.03).texture;
    } else this.envs[kind] = this.pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    return this.envs[kind];
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
    this.fxPass = new ShaderPass(FxShader); this.composer.addPass(this.fxPass);
    this.ao = null;
    if (p.ao === 'gtao') {
      this.ao = new SceneGTAOPass(this.scene, this.camera, this.w, this.h);
      this.ao.updateGtaoMaterial({ radius: 1.6, distanceExponent: 1.4, thickness: 1.5, scale: 1.1, samples: 12, distanceFallOff: 1, screenSpaceRadius: false });
      this.ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 12 });
      this.ao.blendIntensity = 0.85;
      this.composer.addPass(this.ao);
    }
    this.bloom = new UnrealBloomPass(new THREE.Vector2(this.w * p.bloom.scale, this.h * p.bloom.scale), p.bloom.strength, p.bloom.radius, p.bloom.threshold);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass()); // ACES filmic + sRGB (reads renderer.toneMapping / toneMappingExposure)
    this.aaPass = p.aa === 'smaa' ? new SMAAPass() : new FXAAPass();
    this.composer.addPass(this.aaPass);
    this.applySize();
  }
  /** css-pixel size + device pixel ratio (already capped) */
  setSize(w, h, dpr) { this.w = Math.max(1, w); this.h = Math.max(1, h); this.dpr = dpr; if (this.composer) { this.composer.setPixelRatio(dpr); this.applySize(); } }
  applySize() {
    this.composer.setSize(this.w, this.h);
    if (this.ao && this.preset.aoScale < 1) { const s = this.preset.aoScale, pw = Math.round(this.w * this.dpr * s), ph = Math.round(this.h * this.dpr * s); this.ao.setSize(pw, ph); this.ao.gtaoRenderTarget.setSize(pw, ph); this.ao.pdRenderTarget.setSize(pw, ph); this.ao.normalRenderTarget.setSize(pw, ph); }
    this.fxPass.uniforms.res.value.set(this.w * this.dpr, this.h * this.dpr);
  }
  /** per-theme look: exposure + bloom tweak (multipliers on the preset) */
  setMood({ exposure = 1, bloom = 1, aoBlend = 0.85 } = {}) {
    this.fxPass.uniforms.exposure.value = exposure;
    if (this.bloom) this.bloom.strength = this.preset.bloom.strength * bloom;
    if (this.ao) this.ao.blendIntensity = aoBlend;
  }
  render(dt) {
    const U = this.fxPass.uniforms, f = this.fx;
    U.rain.value = f.rain; U.time.value = f.time; U.sat.value = f.sat; U.tint.value.set(f.tint[0], f.tint[1], f.tint[2]); U.speed.value = f.speed;
    this.composer.render(dt);
  }
  dispose() {
    if (!this.composer) return;
    for (const p of this.composer.passes) p.dispose?.();
    this.composer.renderTarget1.dispose(); this.composer.renderTarget2.dispose();
    this.composer = null;
  }
}
