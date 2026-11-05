import { overheadRig } from './overheadCam.js';
import { chaseStep, overheadFollow } from './chaseCam.js';
import { carPose } from './pose.js';
import * as THREE from 'three';
import { Track } from './track.js';
import { Race } from './race.js';
import { makeCar } from './cars.js';
import { createCircuitDay } from './themes/circuitDay.js';
import { Input } from './input.js';
import { Audio } from './audio.js';
import { renderSize, texelWorld, snapToTexel } from './renderScale.js';
import { snapshot, lerpCar, planSteps, STEP } from './interp.js';
import { QualityGovernor } from './quality.js';
import { clamp, wrapAngle } from './physics.js';
import { DIFFICULTY, loadSave, persist, isUnlocked, lockMessage, goalFor, evaluateGoal, recordLap, recordRace, timerSeed, getBest, GHOST_KEY } from './progress.js';
import { formatTime, formatDelta, currentLapTime, liveSector, sampleGhost } from './timing.js';

const $ = (id) => document.getElementById(id);
const canvas = $('view');
const isTouch = matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;
if (isTouch) document.body.classList.add('touch');

// ---------- renderer: low-res target, nearest upscale + palette quantise ----------
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap; // hard, crisp pixel shadows
const target = new THREE.WebGLRenderTarget(320, 180, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(58, 16 / 9, 0.5, 3200);
const post = new THREE.Scene();
const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const postMat = new THREE.ShaderMaterial({
  uniforms: { tex: { value: target.texture }, res: { value: new THREE.Vector2(320, 180) }, rain: { value: 0 }, time: { value: 0 }, sat: { value: 1 }, tint: { value: new THREE.Vector3(1, 1, 1) } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.,1.); }',
  fragmentShader: `uniform sampler2D tex; uniform vec2 res; uniform float rain; uniform float time; uniform float sat; uniform vec3 tint; varying vec2 vUv;
    float h11(float n){ return fract(sin(n*91.345)*47453.5453); }
    void main(){ vec3 c = texture2D(tex, vUv).rgb; c = pow(clamp(c,0.,1.), vec3(1./2.2));
      float l = dot(c, vec3(.299,.587,.114)); c = mix(vec3(l), c, sat) * tint;
      vec2 p = floor(vUv*res);
      if (rain > 0.02) {
        // screen-space diagonal rain streaks, two layers, one low-res pixel wide
        float a = 0.;
        for (int k = 0; k < 2; k++) {
          float sp = k == 0 ? 3. : 5., spd = k == 0 ? 95. : 150., len = k == 0 ? 14. : 9.;
          float u = p.x - p.y*0.3, w = p.y + p.x*0.3 * 0. ;
          float col = floor(u / sp), r = h11(col + float(k)*17.3);
          if (mod(floor(u), sp) < 1. && r < rain*0.5) {
            float s = fract((w + time*spd*(0.8 + r*0.5)) / (len*(1.8 + r*2.)) + r*9.);
            a = max(a, s < 0.4 ? 1. - s/0.4 : 0.);
          }
        }
        c = mix(c, vec3(.85,.93,1.), a*0.35*rain);
        c *= 1. - 0.1*rain*length(vUv-.5);
      }
      vec2 q = p;
      float b = mod(q.x,2.)*2.+mod(q.y,2.)*1.; b = (b-1.5)/ (4.*24.);
      c = floor((c+b)*24.+.5)/24.; gl_FragColor = vec4(c,1.); }`,
  depthTest: false, depthWrite: false,
});
post.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat));

let RS = renderSize(innerWidth, innerHeight, 1);
function resize() {
  // fixed low-res target (~216-270 px tall), integer nearest upscale from device pixels, remainder letterboxed
  const dpr = Math.min(window.devicePixelRatio || 1, 4);
  RS = renderSize(innerWidth, innerHeight, dpr);
  renderer.setPixelRatio(1);
  renderer.setSize(RS.W, RS.H, false);
  target.setSize(RS.lowW, RS.lowH);
  postMat.uniforms.res.value.set(RS.lowW, RS.lowH);
  camera.aspect = RS.lowW / RS.lowH; camera.updateProjectionMatrix();
}
/** Vertical FOV that keeps at least `hfovMin` degrees of horizontal view (portrait phones). */
function fovFor(base, hfovMin, cap) {
  const a = Math.max(camera.aspect, 0.2);
  const v = 2 * Math.atan(Math.tan(hfovMin * Math.PI / 360) / a) * 180 / Math.PI;
  return clamp(Math.max(base, v), base, cap);
}
addEventListener('resize', resize); resize();

// ---------- game objects ----------
const track = new Track();
const theme = createCircuitDay();
theme.build(scene, track);
const input = new Input();
const audio = new Audio();
const store = (() => { try { localStorage.setItem('_t', '1'); localStorage.removeItem('_t'); return localStorage; } catch { return null; } })();
const save = loadSave(store);
const ghosts = {}; // cls -> ghost data (best lap recording)
function loadGhost(cls) {
  if (ghosts[cls] !== undefined) return ghosts[cls];
  try { ghosts[cls] = JSON.parse(store?.getItem(GHOST_KEY + ':' + cls) || 'null'); } catch { ghosts[cls] = null; }
  return ghosts[cls];
}

let race = null, meshes = [], ghostMesh = null, ghost = null;
const CAM_MODES = ['chase', 'overhead', 'full'], CAM_LABEL = { chase: 'CHASE', overhead: 'TOP', full: 'MAP' };
let camMode = 'chase';
const camW = { chase: 1, overhead: 0, full: 0 }; // blend weights, eased toward the active mode
let snapCam = false; // next camera update converges fully (instant switches / screenshots)
let holdSim = false; // test hook: freeze the simulation (screenshots)
let state = 'menu', finishedShown = false, goal = null, goalBefore = null;
const opts = { mode: 'race', difficulty: 'normal', cls: 'gp', laps: 3, weather: 'auto', ...(save.settings || {}) };
const cam = { x: 0, y: 10, z: 0, yaw: 0, ly: 0 };
let shake = 0, lastSect = -1, sectTimer = 0, msgTimer = 0, splitTimer = 0, hudTimer = 0, resultsTimer = null;
const secBox = [...document.querySelectorAll('#secs span')];

function clearCars() {
  for (const m of meshes) scene.remove(m.group); meshes = [];
  if (ghostMesh) { scene.remove(ghostMesh.group); ghostMesh = null; }
}
function startRace(o = {}) {
  Object.assign(opts, o);
  if (!isUnlocked(save, opts.cls)) opts.cls = 'gp';
  clearTimeout(resultsTimer);
  clearCars();
  race = new Race(track, { ...opts, best: timerSeed(save, opts.cls) });
  race.cars.forEach((c) => {
    const m = makeCar(c.cls.id, c.team, c.isPlayer);
    scene.add(m.group); meshes.push(m); c.mesh = m;
  });
  theme.setCars(meshes);
  ghost = race.solo ? loadGhost(opts.cls) : null;
  if (ghost) { ghostMesh = makeCar(opts.cls, race.player.team, false, true); ghostMesh.group.visible = false; scene.add(ghostMesh.group); }
  goal = goalFor(opts, save);
  state = 'racing'; finishedShown = false; lastSect = -1;
  for (const id of ['menu', 'results', 'pause']) $(id).classList.add('hidden');
  $('hud').classList.remove('hidden');
  $('goal') && ($('goal').textContent = 'GOAL: ' + goal.text);
  $('board').classList.toggle('hidden', race.solo);
  $('bEnd')?.classList.toggle('hidden', !race.solo);
  $('pos').classList.toggle('tt', race.solo);
  resetSectors();
  if (new URLSearchParams(location.search).get('rain') === '1') race.setRain(true);
  theme.setWeather({ rain: race.rain, wetness: race.wetness }); theme.setStartLights(0, false);
  const p = race.player; cam.init = false; cam.yaw = p.theta; cam.x = p.x; cam.z = p.z; cam.y = p.y + 6; cam.ly = p.y;
  Object.assign(ov, { x: p.x, y: p.y, z: p.z, yaw: p.theta });
  resnap(); acc = 0;
  audio.init(); audio.music = false;
  setAutopilot(false); setMsg(race.solo ? 'GET READY' : 'GET READY', 3);
  if (store) { save.settings = { ...opts }; persist(store, save); }
  return race;
}
function setMsg(t, secs = 2.5) { $('msg').textContent = t; msgTimer = secs; }
function setAutopilot(on) { if (!race) return; race.autopilot = on; $('bAuto').classList.toggle('on', on); }
/** cycle chase -> overhead -> full-track; `instant` snaps (screenshots) instead of the smooth dramatic zoom */
function setCamera(mode, instant = false) {
  if (typeof mode === 'string' && mode === 'top') mode = 'overhead';
  if (!CAM_MODES.includes(mode)) return camMode;
  camMode = mode;
  if (instant) { for (const k of CAM_MODES) camW[k] = k === mode ? 1 : 0; snapCam = true; }
  const b = $('bCam'); b.classList.toggle('on', mode !== 'chase'); b.textContent = CAM_LABEL[mode];
  return camMode;
}
function toggleCamera() { return setCamera(CAM_MODES[(CAM_MODES.indexOf(camMode) + 1) % CAM_MODES.length]); }
function setMute(m) { audio.setMuted(m); $('bMute').classList.toggle('on', m); $('bMute').textContent = m ? 'MUTE' : 'SND'; }
setMute(audio.muted);
function resetSectors() { secBox.forEach((b, i) => { b.className = ''; b.textContent = 'S' + (i + 1); }); $('split').textContent = ''; }

function showMenu() {
  clearTimeout(resultsTimer);
  state = 'menu';
  for (const id of ['results', 'hud', 'pause']) $(id).classList.add('hidden');
  $('menu').classList.remove('hidden');
  refreshMenu();
}
function setPaused(on) {
  if (!race || (state !== 'racing' && state !== 'paused')) return;
  state = on ? 'paused' : 'racing';
  $('pause').classList.toggle('hidden', !on);
  $('finish-btn').classList.toggle('hidden', !race.solo);
}

// ---------- menu ----------
const seg = (id) => [...$(id).querySelectorAll('button')];
function refreshMenu() {
  const sync = (id, v) => seg(id).forEach((b) => b.classList.toggle('sel', b.dataset.v === String(v)));
  sync('optMode', opts.mode); sync('optDiff', opts.difficulty); sync('optClass', opts.cls); sync('optLaps', opts.laps); sync('optWeather', opts.weather);
  const tt = opts.mode === 'tt';
  $('rowLaps').classList.toggle('hidden', tt); $('rowWeather').classList.toggle('hidden', tt);
  const locked = !isUnlocked(save, 'speedway');
  $('clsSpeedway').classList.toggle('locked', locked);
  $('clsSpeedway').textContent = locked ? 'SPEEDWAY [LOCKED]' : 'SPEEDWAY';
  const g = goalFor(opts, save), b = getBest(save, opts.cls);
  $('goalBox').innerHTML = `<b>GOAL</b> ${g.text}` + (b && isFinite(b.bestLap ?? NaN) ? `<br>Best lap (${opts.cls.toUpperCase()}): ${formatTime(b.bestLap)}` : '');
  $('menuMsg').textContent = locked ? lockMessage('speedway') : '';
}
for (const [id, key] of [['optMode', 'mode'], ['optDiff', 'difficulty'], ['optClass', 'cls'], ['optLaps', 'laps'], ['optWeather', 'weather']]) {
  $(id).addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (key === 'cls' && !isUnlocked(save, b.dataset.v)) { $('menuMsg').textContent = lockMessage(b.dataset.v); return; }
    opts[key] = key === 'laps' ? +b.dataset.v : b.dataset.v;
    refreshMenu();
  });
}
$('start-btn').addEventListener('click', () => startRace());
$('again-btn').addEventListener('click', () => startRace());
$('restart-btn').addEventListener('click', () => startRace());
$('resume-btn').addEventListener('click', () => setPaused(false));
$('finish-btn').addEventListener('click', () => finishSession());
$('menu-btn').addEventListener('click', showMenu);
$('pmenu-btn').addEventListener('click', showMenu);
// one tap = one toggle: bound on pointerup via input.onTap (the synthetic click is swallowed)
input.onTap($('bCam'), toggleCamera);
input.onTap($('bAuto'), () => race && setAutopilot(!race.autopilot));
input.onTap($('bPit'), () => doPit());
input.onTap($('bMute'), () => setMute(!audio.muted));
input.onTap($('bPause'), () => setPaused(state === 'racing'));
input.onTap($('bEnd'), () => finishSession());
input.onTap($('bDry'), () => race?.choosePitTire('dry'));
input.onTap($('bWet'), () => race?.choosePitTire('wet'));
function doPit() {
  if (!race || race.solo) return;
  const p = race.player;
  if (p.pit.stage) return;
  race.requestPit(p, !p.pit.request);
  setMsg(p.pit.request ? 'PIT NEXT LAP' : 'PIT CANCELLED');
}

// ---------- minimap (chase view only; overhead/full views already show the corners) ----------
const mm = $('mm'), mctx = mm.getContext('2d');
const mmBase = (() => {
  let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
  for (let i = 0; i < track.n; i++) { x0 = Math.min(x0, track.px[i]); x1 = Math.max(x1, track.px[i]); z0 = Math.min(z0, track.pz[i]); z1 = Math.max(z1, track.pz[i]); }
  const S = mm.width, pad = 10, sc = Math.min((S - pad * 2) / (x1 - x0), (S - pad * 2) / (z1 - z0));
  const ox = (S - (x1 - x0) * sc) / 2, oz = (S - (z1 - z0) * sc) / 2;
  const mapX = (x) => ox + (x - x0) * sc, mapY = (z) => S - (oz + (z - z0) * sc); // north (+z) up
  const c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d');
  g.lineJoin = 'round'; g.lineCap = 'round';
  const path = () => { g.beginPath(); for (let i = 0; i <= track.n; i += 2) { const k = i % track.n; i ? g.lineTo(mapX(track.px[k]), mapY(track.pz[k])) : g.moveTo(mapX(track.px[k]), mapY(track.pz[k])); } g.closePath(); };
  g.strokeStyle = '#000'; g.lineWidth = 7; path(); g.stroke();
  g.strokeStyle = '#8fa3b8'; g.lineWidth = 4; path(); g.stroke();
  g.fillStyle = '#fff'; g.fillRect(mapX(track.px[0]) - 5, mapY(track.pz[0]) - 1.5, 10, 3);
  return { c, mapX, mapY };
})();
function drawMinimap() {
  mctx.clearRect(0, 0, mm.width, mm.height);
  mctx.drawImage(mmBase.c, 0, 0);
  const cars = race.cars.slice().sort((a, b) => a.isPlayer - b.isPlayer);
  for (const c of cars) {
    const x = mmBase.mapX(c.x), y = mmBase.mapY(c.z);
    mctx.fillStyle = '#000'; mctx.beginPath(); mctx.arc(x, y, c.isPlayer ? 7.5 : 5.5, 0, 7); mctx.fill();
    mctx.fillStyle = c.isPlayer ? '#ffe14a' : hex(c.team.c1); mctx.beginPath(); mctx.arc(x, y, c.isPlayer ? 5.5 : 3.6, 0, 7); mctx.fill();
  }
}

// ---------- HUD ----------
const hex = (n) => '#' + n.toString(16).padStart(6, '0');
function updateHud() {
  const p = race.player, tm = race.lapTimer;
  if (race.solo) { $('pos').innerHTML = 'TIME TRIAL'; $('lap').textContent = `L${p.laps + 1}`; }
  else {
    $('pos').innerHTML = `P${p.pos}<small>/${race.cars.length}</small>`;
    $('lap').textContent = `LAP ${Math.min(p.laps + 1, race.laps)}/${race.laps}`;
  }
  $('laptime').textContent = formatTime(currentLapTime(tm, race.time));
  $('best').textContent = 'BEST ' + formatTime(tm.bestLap);
  secBox.forEach((b, i) => b.classList.toggle('cur', tm.g >= 0 && i === liveSector(tm)));
  $('speed').textContent = Math.round(Math.max(0, p.v) * 3.6);
  const t = $('tire'); t.textContent = p.tire === 'wet' ? 'W' : 'D'; t.classList.toggle('wet', p.tire === 'wet');
  const wear = $('wearbar').firstElementChild; wear.style.width = (1 - p.wear) * 100 + '%';
  wear.style.background = p.wear > 0.7 ? '#e8472a' : p.wear > 0.45 ? '#f2c230' : '#5de06a';
  $('boostbar').firstElementChild.style.width = p.boost * 100 + '%';
  if (!race.solo) {
    $('board').innerHTML = race.order.slice(0, 5).map((c, i) =>
      `<li class="${c.isPlayer ? 'me' : ''}"><b>${i + 1}</b><i style="background:${hex(c.team.c1)}"></i>${c.team.tag}</li>`).join('')
      + (p.pos > 5 ? `<li class="me"><b>${p.pos}</b><i style="background:${hex(p.team.c1)}"></i>${p.team.tag}</li>` : '');
  }
  $('bPit').classList.toggle('on', p.pit.request || p.pit.stage > 0);
  $('bPit').classList.toggle('hidden', race.solo);
  const bc = $('bc'); bc.classList.toggle('hidden', !p.pit.stage);
  if (p.pit.stage) $('pitmsg').textContent = p.pit.stage === 2 ? (p.pit.choice ? 'SERVICE...' : 'CHOOSE TIRES') : p.pit.stage === 1 ? 'PIT LANE - CHOOSE' : 'PIT EXIT';
  $('bDry').classList.toggle('on', p.pit.choice === 'dry'); $('bWet').classList.toggle('on', p.pit.choice === 'wet');
  const sec = track.section[p.idx];
  if (sec !== lastSect) { lastSect = sec; $('sect').textContent = track.sections[sec].toUpperCase(); $('sect').classList.add('on'); sectTimer = 3; }
}

// ---------- results ----------
function finishSession() {
  if (!race || state === 'results') return;
  clearTimeout(resultsTimer);
  showResults();
}
function showResults() {
  const p = race.player;
  let title, rows, msgs = [];
  if (race.solo) {
    title = 'TIME TRIAL';
    const best = Math.min(...p.lapTimes, Infinity);
    rows = p.lapTimes.map((t, i) => `<tr class="${t === best ? 'me' : ''}"><td>LAP ${i + 1}</td><td>${formatTime(t)}</td><td>${t === best ? 'BEST' : '+' + (t - best).toFixed(3)}</td></tr>`);
    if (!rows.length) rows = ['<tr><td>No completed laps</td></tr>'];
    if (p.lapTimes.length && race.lapTimer.laps.length && race.lapTimer.bestLap === best && p.recordSet) msgs.push('NEW PERSONAL BEST!');
    $('resGoal').textContent = '';
    const ev = evaluateGoal(goal, { bestLap: best });
    $('resGoal').textContent = ev.text; $('resGoal').className = ev.met ? 'ok' : 'no';
  } else {
    const list = race.results();
    const me = list.find((r) => r.isPlayer);
    title = me.pos === 1 ? 'VICTORY!' : me.pos <= 3 ? 'PODIUM!' : 'RACE RESULTS';
    rows = list.map((r) => `<tr class="${r.isPlayer ? 'me' : ''}"><td>${r.pos}</td><td>${r.name}</td><td>${r.pos === 1 ? formatTime(r.time, false) : '+' + (r.gap ?? 0).toFixed(1)}</td><td>best ${formatTime(r.best, false)}</td><td>${r.stops ? 'pit×' + r.stops : ''}</td></tr>`);
    const ev = evaluateGoal(goal, { pos: me.pos });
    $('resGoal').textContent = ev.text; $('resGoal').className = ev.met ? 'ok' : 'no';
    const prog = recordRace(save, { mode: 'race', cls: opts.cls, pos: me.pos });
    persist(store, save);
    msgs.push(...prog.messages);
  }
  $('resTitle').textContent = title;
  $('restable').innerHTML = rows.join('');
  $('resMsg').innerHTML = msgs.join('<br>');
  $('again-btn').textContent = race.solo ? 'RETRY' : 'REPLAY RACE';
  for (const id of ['hud', 'pause']) $(id).classList.add('hidden');
  $('results').classList.remove('hidden'); state = 'results';
  refreshMenu();
}

// ---------- events/actions ----------
function handleEvents() {
  const p = race.player;
  for (const e of race.events) {
    if (e.type === 'light') audio.beep(440, 0.12);
    else if (e.type === 'go') { audio.beep(880, 0.4); audio.music = true; setMsg('GO!', 1.5); }
    else if (e.type === 'rain') setMsg('RAIN STARTING - WET TIRES?', 5);
    else if (e.type === 'hit' && e.car.isPlayer) { shake = Math.min(1, 0.3 + e.power); audio.thump(); }
    else if (e.type === 'startline') { resetSectors(); setMsg(race.solo ? 'FLYING LAP' : 'LAP 1', 1.5); }
    else if (e.type === 'sector') {
      const b = secBox[e.sector];
      if (e.sector === 0) resetSectors();
      b.className = e.status; b.textContent = formatTime(e.time, true).slice(2);
      const d = e.delta == null ? 'S' + (e.sector + 1) : `S${e.sector + 1} ${formatDelta(e.delta)}`;
      $('split').textContent = d; $('split').className = e.status; splitTimer = 3;
      audio.beep(e.status === 'purple' ? 1320 : e.status === 'green' ? 1100 : 760, 0.08);
    } else if (e.type === 'laptime') {
      const txt = `${formatTime(e.time)}${e.delta != null ? '  ' + formatDelta(e.delta) : ''}`;
      if (!race.solo && p.finished) { /* finish message below */ } else setMsg((e.isBest ? 'BEST LAP ' : 'LAP ') + txt, 3.5);
      audio.beep(990, 0.15);
      const rec = recordLap(save, opts.cls, e);
      if (rec) p.recordSet = true;
      persist(store, save);
      if (e.ghost && rec) { ghosts[opts.cls] = e.ghost; try { store?.setItem(GHOST_KEY + ':' + opts.cls, JSON.stringify(e.ghost)); } catch { /* quota */ } if (race.solo) ghost = e.ghost; }
    }
    else if (e.type === 'finish' && e.car.isPlayer) { setMsg('FINISH!', 3); audio.beep(1200, 0.5); }
    else if (e.type === 'pit' && e.car.isPlayer) setMsg('TIRES CHANGED', 2);
  }
  race.events.length = 0;
}
function handleActions() {
  for (const a of input.takeActions()) {
    if (a === 'pause') setPaused(state === 'racing');
    else if (state !== 'racing') continue;
    else if (a === 'camera') toggleCamera();
    else if (a === 'autopilot') setAutopilot(!race.autopilot);
    else if (a === 'mute') setMute(!audio.muted);
    else if (a === 'pit') doPit();
    else if (a === 'tire:dry') race.choosePitTire('dry');
    else if (a === 'tire:wet') race.choosePitTire('wet');
  }
}

// ---------- camera ----------
// chase: behind the car. overhead: angled 3D view (35deg FOV, pitched ~55deg down) that leads the car and slowly
// turns with its heading. full: north-up view of the whole circuit. Modes are blended by eased weights, so
// switching gives a smooth zoom (with a little crane-up arc in the middle).
const ov = { x: 0, y: 0, z: 0, yaw: 0 };
const trackBox = (() => {
  let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
  for (let i = 0; i < track.n; i++) { x0 = Math.min(x0, track.px[i]); x1 = Math.max(x1, track.px[i]); z0 = Math.min(z0, track.pz[i]); z1 = Math.max(z1, track.pz[i]); }
  return { cx: (x0 + x1) / 2, cz: (z0 + z1) / 2, w: x1 - x0 + 120, h: z1 - z0 + 120 };
})();
const posV = new THREE.Vector3(), lookV = new THREE.Vector3(), pC = new THREE.Vector3(), lC = new THREE.Vector3(), pO = new THREE.Vector3(), lO = new THREE.Vector3(), pF = new THREE.Vector3(), lF = new THREE.Vector3();
const _rt = new THREE.Vector3(), _up2 = new THREE.Vector3();
let camDbg = null; const _dir = new THREE.Vector3(), _pp = new THREE.Vector3();
const viewInfo = { x: 0, y: 0, z: 0, half: 90, dist: 40 };
const smooth01 = (x) => x * x * (3 - 2 * x);
/** distance that puts `width` metres of ground across the frame at the look-at point */
function distFor(fov, width) {
  const hf = 2 * Math.atan(Math.tan(fov * Math.PI / 360) * camera.aspect);
  return (width / 2) / Math.tan(hf / 2);
}
function updateCamera(dt) {
  if (snapCam) { dt = 8; snapCam = false; }
  const p = viewPlayer || race.player;
  for (const k of CAM_MODES) { const t = k === camMode ? 1 : 0; camW[k] += (t - camW[k]) * (1 - Math.exp(-dt * 2.4)); if (Math.abs(t - camW[k]) < 0.003) camW[k] = t; }
  const wc = smooth01(camW.chase), wo = smooth01(camW.overhead), wf = smooth01(camW.full), wsum = wc + wo + wf || 1;
  const nc = wc / wsum, no = wo / wsum, nf = wf / wsum;
  const sp = clamp(p.v / 80, 0, 1);
  const pitZoom = p.pit.stage ? 1 : 0;
  ov.pz = (ov.pz ?? 0) + (pitZoom - (ov.pz ?? 0)) * (1 - Math.exp(-dt * 2.5));
  // -- chase: critically damped follow (offset + heading), height relative to the road under the camera,
  //    pulled in along the car->camera ray when it would leave the wall corridor (see chaseCam.js)
  const chaseFov = fovFor(58 + sp * 8, 62, 92);
  const cr = chaseStep(cam, p, track, dt, { fovDeg: chaseFov, aspect: camera.aspect });
  pC.fromArray(cr.pos); lC.fromArray(cr.look);
  // -- overhead: rig math lives in overheadCam.js (behind + above, 40deg pitch, fixed FOV); smooth the car/heading it follows
  const portrait = camera.aspect < 1;
  overheadFollow(ov, p, dt);
  const rig = overheadRig({ x: ov.x, y: ov.y, z: ov.z, yaw: ov.yaw, aspect: camera.aspect, zoom: 1 - 0.35 * ov.pz });
  const ovFov = rig.fov, D = rig.distance;
  pO.fromArray(rig.pos); lO.fromArray(rig.target);
  // -- full track: north-up, fitted to the whole circuit
  const fFov = fovFor(35, 30, 55), fPitch = 62 * Math.PI / 180;
  const hf = 2 * Math.atan(Math.tan(fFov * Math.PI / 360) * camera.aspect);
  const DF = Math.max((trackBox.w / 2) / Math.tan(hf / 2), (trackBox.h * Math.sin(fPitch)) / (2 * Math.tan(fFov * Math.PI / 360))) * 1.04;
  pF.set(trackBox.cx, 0, trackBox.cz - Math.cos(fPitch) * DF).setY(Math.sin(fPitch) * DF); lF.set(trackBox.cx, 0, trackBox.cz);
  // -- blend
  posV.set(0, 0, 0).addScaledVector(pC, nc).addScaledVector(pO, no).addScaledVector(pF, nf);
  lookV.set(0, 0, 0).addScaledVector(lC, nc).addScaledVector(lO, no).addScaledVector(lF, nf);
  const dist = nc * 12 + no * D + nf * DF;
  const arc = (1 - Math.max(nc, no, nf)) * dist * 0.35; // crane up mid-transition
  posV.y += arc;
  camera.position.copy(posV);
  if (shake > 0) { camera.position.x += (Math.random() - 0.5) * shake * (1.2 + dist * 0.01); camera.position.y += (Math.random() - 0.5) * shake; shake = Math.max(0, shake - dt * 2.5); }
  camera.lookAt(lookV);
  camera.fov = chaseFov * nc + ovFov * no + fFov * nf; camera.near = Math.max(0.5, dist * 0.12 * (1 - nc)); camera.far = 1500 + dist * 3; camera.updateProjectionMatrix();
  // snap the camera to the low-res texel grid in its own view plane (orientation unchanged) so static geometry doesn't shimmer
  {
    const te = texelWorld(camera.position.distanceTo(lookV), camera.fov, RS.lowH);
    _rt.set(1, 0, 0).applyQuaternion(camera.quaternion); _up2.set(0, 1, 0).applyQuaternion(camera.quaternion);
    const sp2 = snapToTexel(camera.position.toArray(), _rt.toArray(), _up2.toArray(), te);
    camera.position.fromArray(sp2);
  }
  // shadow / fog focus follows what we are looking at
  viewInfo.x = lookV.x; viewInfo.y = lookV.y; viewInfo.z = lookV.z;
  viewInfo.dist = posV.distanceTo(lookV);
  viewInfo.half = clamp(nc * 70 + no * (portrait ? 125 : 135) + nf * 130, 60, 140);
  {
    const d = camera.getWorldDirection(_dir);
    camDbg = { mode: camMode, pitchDeg: +(Math.asin(-d.y) * 180 / Math.PI).toFixed(2), height: +(camera.position.y - p.y).toFixed(2),
      distance: +camera.position.distanceTo(_pp.set(p.x, p.y, p.z)).toFixed(2), fov: +camera.fov.toFixed(2),
      behind: +((p.x - camera.position.x) * Math.sin(ov.yaw) + (p.z - camera.position.z) * Math.cos(ov.yaw)).toFixed(2), aspect: +camera.aspect.toFixed(3) };
  }
  mm.classList.toggle('off', nc < 0.6);
  mmOn = nc >= 0.6;
}
let mmOn = true;

const ghostLoc = { i: 0 };
function syncMeshes(dt) {
  for (const c of race.cars) {
    const m = c.mesh; if (!m) continue;
    const r = lerpCar(c, alpha, c._r || (c._r = {}));
    m.group.position.set(r.x, r.y, r.z);
    m.group.rotation.y = r.theta;
    m.pivot.rotation.x = -r.pitch;
    m.pivot.rotation.z = r.roll - r.steer * 0.03 * Math.min(1, c.v / 40);
    if (c.isPlayer && viewPlayer) { viewPlayer.x = r.x; viewPlayer.y = r.y; viewPlayer.z = r.z; viewPlayer.theta = r.theta; }
    const rot = c.v * dt / 0.4;
    for (const w of m.wheels) w.rotation.x += rot;
    if (m.mark) { m.mark.visible = camW.chase < 0.5; m.mark.scale.setScalar(1); }
    m.group.scale.setScalar(1 + 3 * camW.full);
    if (c.isPlayer) m.pivot.position.y = theme.fx.lift;
  }
  if (ghostMesh) {
    const pose = race.phase === 'racing' && race.lapTimer.g >= 0 ? sampleGhost(ghost, currentLapTime(race.lapTimer, race.time)) : null;
    ghostMesh.group.visible = !!pose;
    if (pose) {
      const loc = track.locate(pose.x, pose.z, ghostLoc.i, undefined, 30);
      ghostLoc.i = loc.i;
      const gp = carPose(track, loc.s);
      ghostMesh.group.position.set(pose.x, gp.y, pose.z);
      ghostMesh.group.rotation.y = pose.theta;
      ghostMesh.pivot.rotation.x = -gp.pitch; ghostMesh.pivot.rotation.z = gp.roll;
    }
  }
}

// ---------- adaptive quality: step down shadow size / prop density when FPS drops ----------
const perf = { level: 2, auto: !navigator.webdriver, fps: 60, gov: new QualityGovernor({ level: 2 }) };
function setQuality(level) { perf.level = clamp(Math.round(level), 0, 2); perf.gov.level = perf.level; theme.setQuality(perf.level); }
function watchPerf(dt) {
  if (dt <= 0) return;
  const inst = 1 / dt;
  perf.fps += (inst - perf.fps) * (1 - Math.exp(-dt / 0.5)); // smoothed fps (~0.5 s time constant)
  if (!perf.auto || state === 'menu' || state === 'paused' || document.hidden) return;
  const lv = perf.gov.update(dt, perf.fps);
  if (lv !== null) setQuality(lv);
}

// ---------- loop ----------
let last = performance.now(), acc = 0, alpha = 1;
let viewPlayer = null; // player as rendered this frame (interpolated x/y/z/theta; everything else live)
const resnap = () => { if (race) { for (const c of race.cars) snapshot(c); alpha = 1; } };
function frame(now) {
  requestAnimationFrame(frame);
  const rawDt = Math.max(0, (now - last) / 1000), dt = Math.min(0.05, rawDt); last = now;
  hudTimer -= dt;
  if (race && (state === 'racing' || state === 'paused')) handleActions();
  if (race && state === 'racing') {
    handleEvents();
    if (holdSim) { acc = 0; resnap(); }
    else {
      // fixed 60 Hz physics (max 5 steps/frame); rendering interpolates between the last two states
      const plan = planSteps(acc, Math.min(0.1, rawDt));
      acc = plan.acc;
      for (let i = 0; i < plan.n; i++) {
        for (const c of race.cars) snapshot(c);
        const p = race.player;
        if (!race.autopilot && !p.finished && !p.pit.stage) Object.assign(p.input, input.poll());
        race.step(STEP);
      }
      alpha = acc / STEP;
    }
    theme.setWeather({ rain: race.rain, wetness: race.wetness });
    theme.setStartLights(race.lights, race.goFlash > 0);
    const p = race.player;
    audio.engine(Math.abs(p.v), p.cls.vTop, p.input.throttle, race.phase === 'racing');
    if (p.finished && !finishedShown) { finishedShown = true; resultsTimer = setTimeout(() => { race.simulateToEnd(); showResults(); }, 2200); }
    if (hudTimer <= 0) { updateHud(); hudTimer = 0.05; }
    sectTimer -= dt; if (sectTimer < 0) $('sect').classList.remove('on');
    splitTimer -= dt; if (splitTimer < 0) $('split').textContent = '';
    msgTimer -= dt; if (msgTimer < 0) $('msg').textContent = race.phase === 'countdown' ? 'GET READY' : '';
    if (mmOn) drawMinimap();
  } else if (state === 'paused') {
    audio.engine(0, 1, 0, false);
  }
  if (state === 'menu') {
    // idle orbit over the track
    const t = now / 1000 * 0.08, c = track.at(((t * 300) % track.length));
    camera.position.set(c.x + 40, c.y + 30, c.z + 40); camera.lookAt(c.x, c.y, c.z);
    camera.fov = 58; camera.near = 0.5; camera.far = 1500; camera.updateProjectionMatrix();
    Object.assign(viewInfo, { x: c.x, y: c.y, z: c.z, half: 70, dist: 55 });
    theme.setPit(null);
  } else if (race) {
    if (viewPlayer?.__src !== race.player) { viewPlayer = Object.create(race.player); viewPlayer.__src = race.player; }
    syncMeshes(state === 'racing' ? dt : 0); updateCamera(dt);
    const p = race.player;
    theme.setPit(p.pit.stage || p.pit.request ? { stage: p.pit.stage, request: p.pit.request, serv: p.pit.serv, choice: p.pit.choice, teamIndex: p.teamIndex, car: p.mesh } : null);
  }
  theme.update(dt, camera, viewInfo);
  const fxo = theme.fx, U = postMat.uniforms;
  U.rain.value = fxo.rain; U.time.value = fxo.time; U.sat.value = fxo.sat; U.tint.value.set(fxo.tint[0], fxo.tint[1], fxo.tint[2]);
  watchPerf(Math.min(0.5, rawDt));
  renderer.setRenderTarget(target); renderer.render(scene, camera);
  renderer.setRenderTarget(null);
  renderer.setViewport(RS.vx, RS.vy, RS.vw, RS.vh); // integer-scaled, centred; the rest stays black (autoClear)
  renderer.render(post, postCam);
}
requestAnimationFrame(frame);
refreshMenu();

// ---------- test/automation hook ----------
const q = new URLSearchParams(location.search);
if (q.get('autostart') === '1') {
  startRace({
    ...(q.get('mode') ? { mode: q.get('mode') } : {}), ...(q.get('diff') ? { difficulty: q.get('diff') } : {}),
    ...(q.get('cls') ? { cls: q.get('cls') } : {}), ...(q.get('laps') ? { laps: +q.get('laps') } : {}),
    weather: q.get('weather') || 'dry',
  });
  setAutopilot(true); // test convenience only; autopilot is off by default
  const cq = q.get('cam'); if (cq) setCamera(cq, true);
}
if (q.get('camlog') === '1') setInterval(() => console.log('camlog', JSON.stringify(window.__game.camDebug())), 1000);
if (q.get('q')) { perf.auto = false; setQuality(+q.get('q')); }
window.__game = {
  camDebug: () => camDbg ? { ...camDbg } : { mode: camMode },
  startRace: (o) => startRace(o), setRain: (on) => { race?.setRain(on); if (race) theme.setWeather({ rain: race.rain, wetness: race.wetness }); }, enterPit: () => { race && race.requestPit(race.player, true); },
  fps: () => perf.fps, setAutopilot, toggleCamera, setCamera, setQuality, hold: (on = true) => { holdSim = !!on; },
  /** put the player in the pit box in the service state (crew visible, car jacked). hold freezes the sim for screenshots. */
  pitService: (choice = 'dry', serv = 1.2, hold = true) => {
    const p = race.player, T = track, s = T.boxU(p.teamIndex) - 0.6, sw = ((s % T.length) + T.length) % T.length, a = T.at(s, T.boxD(Math.floor(sw / T.ds) % T.n));
    p.x = a.x; p.z = a.z; p.y = a.y; p.theta = T.thetaAt(s); p.s = sw; p.idx = T.locateGlobal(a.x, a.z).i; p.v = 0; p.steer = 0;
    Object.assign(p.pit, { stage: 2, request: true, timer: 0, serv: choice ? serv : 0, choice: choice || null });
    holdSim = hold; cam.init = false; cam.yaw = p.theta; ov.yaw = p.theta; resnap(); return { s: sw, x: a.x, z: a.z };
  }, setMute, setPaused, finishSession, showMenu, choosePitTire: (t) => race?.choosePitTire(t),
  /** advance simulation without rendering (seconds) */
  fastForward: (sec) => { for (let t = 0; t < sec; t += 1 / 60) race.step(1 / 60); handleEvents(); resnap(); },
  finishNow: () => { race.autopilot = true; },
  teleport: (s, d = 0) => { const p = race.player, a = track.at(s, d); p.x = a.x; p.z = a.z; p.theta = track.thetaAt(s); p.s = s; p.idx = track.locateGlobal(a.x, a.z).i; cam.init = false; cam.yaw = p.theta; resnap(); },
  save, opts, DIFFICULTY,
  get race() { return race; }, get camMix() { return 1 - camW.chase; }, get camMode() { return camMode; }, get quality() { return perf.level; }, track, theme,
  state: () => ({ state, phase: race?.phase, pos: race?.player.pos, lap: race?.player.laps, rain: race?.rain, wet: race?.wetness, tire: race?.player.tire, wear: race?.player.wear, pit: race?.player.pit.stage, autopilot: race?.autopilot, camMix: 1 - camW.chase, cam: camMode, quality: perf.level }),
};
