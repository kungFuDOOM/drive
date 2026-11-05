import * as THREE from 'three';
import { Track } from './track.js';
import { Race } from './race.js';
import { makeCar } from './cars.js';
import { createCircuitDay } from './themes/circuitDay.js';
import { Input } from './input.js';
import { Audio } from './audio.js';
import { clamp, wrapAngle } from './physics.js';

const $ = (id) => document.getElementById(id);
const canvas = $('view');
const isTouch = matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;
if (isTouch) document.body.classList.add('touch');

// ---------- renderer: low-res target, nearest upscale + palette quantise ----------
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(1);
const target = new THREE.WebGLRenderTarget(320, 180, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(58, 16 / 9, 0.5, 1500);
const post = new THREE.Scene();
const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const postMat = new THREE.ShaderMaterial({
  uniforms: { tex: { value: target.texture }, res: { value: new THREE.Vector2(320, 180) } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.,1.); }',
  fragmentShader: `uniform sampler2D tex; uniform vec2 res; varying vec2 vUv;
    void main(){ vec3 c = texture2D(tex, vUv).rgb; c = pow(clamp(c,0.,1.), vec3(1./2.2));
      vec2 p = floor(vUv*res); float b = mod(p.x,2.)*2.+mod(p.y,2.)*1.; b = (b-1.5)/ (4.*24.);
      c = floor((c+b)*24.+.5)/24.; gl_FragColor = vec4(c,1.); }`,
  depthTest: false, depthWrite: false,
});
post.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat));

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  const k = Math.max(2, Math.round(h / 200));
  const tw = Math.ceil(w / k), th = Math.ceil(h / k);
  target.setSize(tw, th);
  postMat.uniforms.res.value.set(tw, th);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

// ---------- game objects ----------
const track = new Track();
const theme = createCircuitDay();
theme.build(scene, track);
const input = new Input();
const audio = new Audio();
const portrait = () => matchMedia('(orientation: portrait)').matches;

let race = null, meshes = [], overhead = false, state = 'menu', finishedShown = false;
const opts = { cls: 'gp', laps: 3, weather: 'auto' };
const cam = { x: 0, y: 10, z: 0, yaw: 0, look: new THREE.Vector3() };
let shake = 0, lastSect = -1, sectTimer = 0, msgTimer = 0, hudTimer = 0;

function clearCars() { for (const m of meshes) scene.remove(m.group); meshes = []; }
function startRace(o = {}) {
  Object.assign(opts, o);
  clearCars();
  race = new Race(track, { ...opts, rainAt: o.rainAt });
  race.cars.forEach((c) => {
    const m = makeCar(c.cls.id, c.team, c.isPlayer);
    scene.add(m.group); meshes.push(m); c.mesh = m;
  });
  state = 'racing'; finishedShown = false; lastSect = -1;
  $('menu').classList.add('hidden'); $('results').classList.add('hidden'); $('hud').classList.remove('hidden');
  theme.setWeather({ rain: 0, wetness: 0 }); theme.setStartLights(0, false);
  const p = race.player; cam.yaw = p.theta; cam.x = p.x; cam.z = p.z; cam.y = p.y + 6;
  audio.init(); audio.music = false;
  setAutopilot(false); setMsg('GET READY');
  return race;
}
function setMsg(t, secs = 2.5) { $('msg').textContent = t; msgTimer = secs; }
function setAutopilot(on) { if (!race) return; race.autopilot = on; $('bAuto').classList.toggle('on', on); }
function toggleCamera() { overhead = !overhead; $('bCam').classList.toggle('on', overhead); }
function setMute(m) { audio.setMuted(m); $('bMute').classList.toggle('on', m); $('bMute').textContent = m ? 'MUTE' : 'SND'; }
setMute(audio.muted);

// ---------- UI wiring ----------
for (const id of ['optClass', 'optLaps', 'optWeather']) {
  $(id).addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    $(id).querySelectorAll('button').forEach((x) => x.classList.toggle('sel', x === b));
    const k = id === 'optClass' ? 'cls' : id === 'optLaps' ? 'laps' : 'weather';
    opts[k] = k === 'laps' ? +b.dataset.v : b.dataset.v;
  });
}
$('start-btn').addEventListener('click', () => startRace());
$('again-btn').addEventListener('click', () => startRace());
$('menu-btn').addEventListener('click', () => { state = 'menu'; $('results').classList.add('hidden'); $('hud').classList.add('hidden'); $('menu').classList.remove('hidden'); });
$('bCam').onclick = toggleCamera;
$('bAuto').onclick = () => race && setAutopilot(!race.autopilot);
$('bPit').onclick = () => doPit();
$('bMute').onclick = () => setMute(!audio.muted);
$('bDry').onclick = () => race?.choosePitTire('dry');
$('bWet').onclick = () => race?.choosePitTire('wet');
function doPit() {
  if (!race) return;
  const p = race.player;
  if (p.pit.stage) return;
  race.requestPit(p, !p.pit.request);
  setMsg(p.pit.request ? 'PIT NEXT LAP' : 'PIT CANCELLED');
}

// ---------- HUD ----------
const fmt = (t) => (isFinite(t) ? `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}` : '--');
const hex = (n) => '#' + n.toString(16).padStart(6, '0');
function updateHud() {
  const p = race.player;
  $('pos').innerHTML = `P${p.pos}<small>/${race.cars.length}</small>`;
  $('lap').textContent = `LAP ${Math.min(p.laps + 1, race.laps)}/${race.laps}`;
  $('laptime').textContent = `${fmt(Math.max(0, race.time - p.lapStart))}  BEST ${fmt(p.bestLap)}`;
  $('speed').textContent = Math.round(Math.max(0, p.v) * 3.6);
  const t = $('tire'); t.textContent = p.tire === 'wet' ? 'W' : 'D'; t.classList.toggle('wet', p.tire === 'wet');
  const wear = $('wearbar').firstElementChild; wear.style.width = (1 - p.wear) * 100 + '%';
  wear.style.background = p.wear > 0.7 ? '#e8472a' : p.wear > 0.45 ? '#f2c230' : '#5de06a';
  $('boostbar').firstElementChild.style.width = p.boost * 100 + '%';
  $('board').innerHTML = race.order.slice(0, 6).map((c, i) =>
    `<li class="${c.isPlayer ? 'me' : ''}"><b>${i + 1}</b><i style="background:${hex(c.team.c1)}"></i>${c.team.tag}</li>`).join('')
    + (p.pos > 6 ? `<li class="me"><b>${p.pos}</b><i style="background:${hex(p.team.c1)}"></i>${p.team.tag}</li>` : '');
  $('bPit').classList.toggle('on', p.pit.request || p.pit.stage > 0);
  const bc = $('bc'); bc.classList.toggle('hidden', !p.pit.stage);
  if (p.pit.stage) $('pitmsg').textContent = p.pit.stage === 2 ? (p.pit.choice ? 'SERVICE...' : 'CHOOSE TIRES') : p.pit.stage === 1 ? 'PIT LANE - CHOOSE' : 'PIT EXIT';
  $('bDry').classList.toggle('on', p.pit.choice === 'dry'); $('bWet').classList.toggle('on', p.pit.choice === 'wet');
  const sec = track.section[p.idx];
  if (sec !== lastSect) { lastSect = sec; $('sect').textContent = track.sections[sec].toUpperCase(); $('sect').classList.add('on'); sectTimer = 3; }
}
function showResults() {
  const rows = race.results();
  $('resTitle').textContent = rows.find((r) => r.isPlayer).pos === 1 ? 'VICTORY!' : 'RACE RESULTS';
  $('restable').innerHTML = rows.map((r) => `<tr class="${r.isPlayer ? 'me' : ''}"><td>${r.pos}</td><td>${r.name}</td><td>${r.pos === 1 ? fmt(r.time) : '+' + (r.gap ?? 0).toFixed(1)}</td><td>best ${fmt(r.best)}</td><td>${r.stops ? 'pit×' + r.stops : ''}</td></tr>`).join('');
  $('results').classList.remove('hidden'); $('hud').classList.add('hidden'); state = 'results';
}

// ---------- events/actions ----------
function handleEvents() {
  for (const e of race.events) {
    if (e.type === 'light') audio.beep(440, 0.12);
    else if (e.type === 'go') { audio.beep(880, 0.4); audio.music = true; setMsg('GO!', 1.5); }
    else if (e.type === 'rain') setMsg('RAIN STARTING - WET TIRES?', 5);
    else if (e.type === 'hit' && e.car.isPlayer) { shake = Math.min(1, 0.3 + e.power); audio.thump(); }
    else if (e.type === 'lap' && e.car.isPlayer) { audio.beep(990, 0.15); setMsg(`LAP ${e.lap + 1}`, 1.5); }
    else if (e.type === 'finish' && e.car.isPlayer) { setMsg('FINISH!', 3); audio.beep(1200, 0.5); }
    else if (e.type === 'pit' && e.car.isPlayer) setMsg('TIRES CHANGED', 2);
  }
  race.events.length = 0;
  for (const a of input.takeActions()) {
    if (a === 'camera') toggleCamera();
    else if (a === 'autopilot') setAutopilot(!race.autopilot);
    else if (a === 'mute') setMute(!audio.muted);
    else if (a === 'pit') doPit();
    else if (a === 'tire:dry') race.choosePitTire('dry');
    else if (a === 'tire:wet') race.choosePitTire('wet');
  }
}

// ---------- camera ----------
const tmpV = new THREE.Vector3();
function updateCamera(dt) {
  const p = race.player;
  const k = 1 - Math.exp(-dt * 5);
  cam.yaw += wrapAngle(p.theta - cam.yaw) * (1 - Math.exp(-dt * 3.5));
  const back = overhead ? 12 : 9.5, h = overhead ? 58 : 3.6;
  const fx = Math.sin(cam.yaw), fz = Math.cos(cam.yaw);
  const cs = p.s - back;
  const gy = track.yAt(cs);
  const tx = p.x - fx * back, tz = p.z - fz * back, ty = Math.max(gy, p.y - 1) + h;
  cam.x += (tx - cam.x) * k * 1.6; cam.z += (tz - cam.z) * k * 1.6; cam.y += (ty - cam.y) * k;
  camera.position.set(cam.x, cam.y, cam.z);
  if (shake > 0) { camera.position.x += (Math.random() - 0.5) * shake * 1.2; camera.position.y += (Math.random() - 0.5) * shake; shake = Math.max(0, shake - dt * 2.5); }
  const la = overhead ? 8 : 12;
  tmpV.set(p.x + fx * la, p.y + (overhead ? 0 : 1.2), p.z + fz * la);
  camera.lookAt(tmpV);
  camera.fov += ((overhead ? 62 : 58 + clamp(p.v / 12, 0, 7)) - camera.fov) * k; camera.updateProjectionMatrix();
}

function syncMeshes(dt) {
  for (const c of race.cars) {
    const m = c.mesh; if (!m) continue;
    const slope = track.slopeAt(c.s);
    m.group.position.set(c.x, c.y, c.z);
    m.group.rotation.y = c.theta;
    m.pivot.rotation.x = -Math.atan(slope);
    m.pivot.rotation.z = -c.steer * 0.03 * Math.min(1, c.v / 40);
    const rot = c.v * dt / 0.4;
    for (const w of m.wheels) w.rotation.x += rot;
    if (m.mark) m.mark.visible = overhead;
  }
}

// ---------- loop ----------
let last = performance.now(), acc = 0, simFrozen = false;
function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  hudTimer -= dt;
  if (race && state === 'racing' && !portrait() && !simFrozen) {
    handleEvents();
    acc += dt;
    while (acc >= 1 / 60) {
      const p = race.player;
      if (!race.autopilot && !p.finished && !p.pit.stage && race.phase === 'racing') Object.assign(p.input, input.poll());
      race.step(1 / 60); acc -= 1 / 60;
    }
    theme.setWeather({ rain: race.rain, wetness: race.wetness });
    theme.setStartLights(race.lights, race.goFlash > 0);
    const p = race.player;
    audio.engine(Math.abs(p.v), p.cls.vTop, p.input.throttle, race.phase === 'racing');
    if (p.finished && !finishedShown) { finishedShown = true; setTimeout(() => { race.simulateToEnd(); showResults(); }, 2200); }
    if (hudTimer <= 0) { updateHud(); hudTimer = 0.1; }
    sectTimer -= dt; if (sectTimer < 0) $('sect').classList.remove('on');
    msgTimer -= dt; if (msgTimer < 0) $('msg').textContent = race.phase === 'countdown' ? 'GET READY' : '';
  } else if (state === 'menu' && !race) {
    // idle orbit over the track
    const t = now / 1000 * 0.08, c = track.at(((t * 300) % track.length));
    camera.position.set(c.x + 40, c.y + 30, c.z + 40); camera.lookAt(c.x, c.y, c.z);
  }
  if (race) { syncMeshes(dt); if (state !== 'menu') updateCamera(dt); }
  theme.update(dt, camera);
  renderer.setRenderTarget(target); renderer.render(scene, camera);
  renderer.setRenderTarget(null); renderer.render(post, postCam);
}
requestAnimationFrame(frame);

// ---------- test/automation hook ----------
window.__game = {
  startRace: (o) => startRace(o), setRain: (on) => { race?.setRain(on); }, enterPit: () => { race && race.requestPit(race.player, true); },
  setAutopilot, toggleCamera, setMute, choosePitTire: (t) => race?.choosePitTire(t),
  /** advance simulation without rendering (seconds) */
  fastForward: (sec) => { for (let t = 0; t < sec; t += 1 / 60) race.step(1 / 60); },
  finishNow: () => { race.autopilot = true; },
  get race() { return race; }, track, theme, state: () => ({ state, phase: race?.phase, pos: race?.player.pos, lap: race?.player.laps, rain: race?.rain, wet: race?.wetness, tire: race?.player.tire, wear: race?.player.wear, pit: race?.player.pit.stage }),
};
