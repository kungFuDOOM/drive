import { overheadRig } from './overheadCam.js';
import { chaseStep, overheadFollow } from './chaseCam.js';
import { carPose } from './pose.js';
import * as THREE from 'three';
import { Track } from './track.js';
import { trackDef, TRACKS, DEFAULT_TRACK } from './tracks/index.js';
import { Race } from './race.js';
import { makeCar, animateCar, disposeCar, writeWheels } from './cars.js';
import { CarFx } from './carFx.js';
import { createLineGuide } from './lineGuideMesh.js';
import { buildBrakeBoards } from './brakeBoards.js';
import { lineGuideEnabled } from './racingLine.js';
import { createTheme } from './themes/index.js';
import { Input } from './input.js';
import { Audio } from './audio.js';
import { renderSize, texelWorld, snapToTexel, targetHFor, msaaFor } from './renderScale.js';
import { FrameStats, ShadowCadence } from './perfStats.js';
import { snapshot, lerpCar, planSteps, STEP } from './interp.js';
import { QualityGovernor } from './quality.js';
import { clamp, wrapAngle, CLASSES } from './physics.js';
import { DIFFICULTY, loadSave, persist, isUnlocked, lockMessage, goalFor, evaluateGoal, recordLap, recordRace, timerSeed, getBest, getTrackBest, recordTrackLap, GHOST_KEY } from './progress.js';
import { formatTime, formatDelta, currentLapTime, liveSector, sampleGhost } from './timing.js';
import {
  loadCareer, saveCareer, loadGarage, saveGarage, newCareer, newSeason, nextRound, backdropTrackId, standings, careerGrid,
  applyRaceResult, buyUpgrade, nextUpgradeCost, UPGRADE_KEYS, UPGRADE_MAX, UPGRADE_LABEL, UPGRADE_BLURB,
} from './career.js';
import { createEditor, editEditor, editorTeam, hexStr, SWATCHES, PATTERNS, sanitizeName, nameIssue } from './livery.js';
import { NAME_BLOCKED_MSG } from './profanity.js';
import { circuitCard, drawThumb, formatLength } from './menuArt.js';
import { focusMove, menuPadState, risingEdges } from './menuNav.js';
import './front.css';

const $ = (id) => document.getElementById(id);
const canvas = $('view');
const isTouch = matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;
if (isTouch) document.body.classList.add('touch');

// ---------- renderer: low-res target, nearest upscale + palette quantise ----------
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap; // hard, crisp pixel shadows
renderer.shadowMap.autoUpdate = false; // re-rendered every frame at quality 1-2 (car shadows must track the interpolated cars on 120 Hz screens); ~60 Hz cadence (ShadowCadence) at quality 0
// LINEAR filter: the post shader does its own sharp-bilinear sampling (crisp texel interiors, ~1 device px AA at texel edges); MSAA resolves geometry edges
const target = new THREE.WebGLRenderTarget(320, 180, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: true, samples: msaaFor(2) });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(58, 16 / 9, 0.5, 3200);
const post = new THREE.Scene();
const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const postMat = new THREE.ShaderMaterial({
  uniforms: { tex: { value: target.texture }, res: { value: new THREE.Vector2(320, 180) }, k: { value: 3 }, rain: { value: 0 }, time: { value: 0 }, sat: { value: 1 }, tint: { value: new THREE.Vector3(1, 1, 1) }, speed: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.,1.); }',
  fragmentShader: `uniform sampler2D tex; uniform vec2 res; uniform float k; uniform float rain; uniform float time; uniform float sat; uniform vec3 tint; uniform float speed; varying vec2 vUv;
    float h11(float n){ return fract(sin(n*91.345)*47453.5453); }
    void main(){
      // sharp bilinear: flat inside a low-res texel, blended over ~1 device pixel across its edge (k device px per texel)
      vec2 u = vUv*res - .5, iu = floor(u), w = clamp((u - iu - .5)*k + .5, 0., 1.);
      vec3 c = texture2D(tex, (iu + .5 + w)/res).rgb; c = pow(clamp(c,0.,1.), vec3(1./2.2));
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
      if (speed > 0.02) {
        // speed lines: 1-px radial streaks in the outer ring only (centre stays clean)
        vec2 dc = (vUv - .5) * vec2(res.x/res.y, 1.);
        float rr = length(dc), ang = atan(dc.y, dc.x);
        float ray = floor(ang * 38.), rh = h11(ray + 3.1);
        float ph = fract(rr * 2.2 - time * (1.6 + rh * 1.4) + rh * 7.);
        float edge = smoothstep(.38, .62, rr);
        float on = step(1. - speed * .55, rh) * step(ph, .32) * edge;
        c = mix(c, vec3(1.), on * .55 * speed);
      }
      vec2 q = p;
      float b = mod(q.x,2.)*2.+mod(q.y,2.)*1.; b = (b-1.5)/ (4.*24.);
      c = floor((c+b)*24.+.5)/24.; gl_FragColor = vec4(c,1.); }`,
  depthTest: false, depthWrite: false,
});
post.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat));

// adaptive quality state (the render height depends on the level, so it lives before resize())
const perf = { level: 2, auto: !navigator.webdriver, fps: 60, gov: new QualityGovernor({ level: 2 }) };
let RS = renderSize(innerWidth, innerHeight, 1, targetHFor(perf.level));
function resize() {
  // low-res target (~240/300/360 px tall by quality), integer upscale from device pixels, remainder letterboxed
  const dpr = Math.min(window.devicePixelRatio || 1, 4);
  RS = renderSize(innerWidth, innerHeight, dpr, targetHFor(perf.level));
  renderer.setPixelRatio(1);
  renderer.setSize(RS.W, RS.H, false);
  target.setSize(RS.lowW, RS.lowH);
  postMat.uniforms.res.value.set(RS.lowW, RS.lowH); postMat.uniforms.k.value = RS.k;
  camera.aspect = RS.lowW / RS.lowH; camera.updateProjectionMatrix();
}
/** Vertical FOV that keeps at least `hfovMin` degrees of horizontal view (portrait phones). */
function fovFor(base, hfovMin, cap) {
  const a = Math.max(camera.aspect, 0.2);
  const v = 2 * Math.atan(Math.tan(hfovMin * Math.PI / 360) / a) * 180 / Math.PI;
  return clamp(Math.max(base, v), base, cap);
}
function onResize() { resize(); layoutCarousel(); }
addEventListener('resize', onResize); onResize();

// ---------- game objects ----------
const input = new Input();
const audio = new Audio();
const store = (() => { try { localStorage.setItem('_t', '1'); localStorage.removeItem('_t'); return localStorage; } catch { return null; } })();
const save = loadSave(store);
let garage = loadGarage(store);
let career = loadCareer(store);
if (career) garage = { driver: { ...career.driver }, team: career.team };
const opts = { mode: 'race', difficulty: 'normal', cls: 'gp', laps: 3, weather: 'auto', track: DEFAULT_TRACK, ...(save.settings || {}) };
opts.track = trackDef(opts.track).id;
let track = new Track(trackDef(opts.track));
let theme = createTheme(track.themeId);
theme.build(scene, track);
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
let sessionKind = 'quick', careerApplied = false, editorReturn = 'menu', editorState = null, paintChannel = 'c1';
const carFx = new CarFx(); carFx.addTo(scene); // pooled tyre smoke / dust / skid marks, one draw call each
let lineGuide = null, boards = null, guideShown = false;
const cam = { x: 0, y: 10, z: 0, yaw: 0, ly: 0 };
let fovKick = 0, kerbWas = false, popTimer = 0, bannerTimer = 0, lastLights = -1, fxSpeed = 0;
let wxRain = -1, wxWet = -1, litN = -1, litGo = null, mmTimer = 0, shake = 0, lastSect = -1, sectTimer = 0, msgTimer = 0, splitTimer = 0, hudTimer = 0, resultsTimer = null;
const secBox = [...document.querySelectorAll('#secs span')];

function clearCars() {
  for (const m of meshes) { scene.remove(m.group); disposeCar(m); } meshes = [];
  if (ghostMesh) { scene.remove(ghostMesh.group); disposeCar(ghostMesh); ghostMesh = null; }
  carFx.clear();
}
/** the colour guide: Easy / Normal(Medium) default on, Hard never (even if saved on). Only the menu / pause toggle changes it. */
const guideOn = () => lineGuideEnabled(opts.difficulty, opts.lineGuide);
function applyGuide() {
  const on = guideOn() && !!lineGuide;
  lineGuide?.setEnabled(on && !!race);
  for (const id of ['optLine']) { const el = $(id); if (el) seg(id).forEach((b) => b.classList.toggle('sel', (b.dataset.v === 'on') === guideOn())); }
  const hard = opts.difficulty === 'hard';
  for (const id of ['rowLine', 'pLine']) $(id)?.classList.toggle('na', hard);
  if ($('pLine')) $('pLine').textContent = hard ? 'LINE: NONE (HARD)' : 'LINE: ' + (guideOn() ? 'ON' : 'OFF');
  $('optLine') && seg('optLine').forEach((b) => (b.disabled = hard));
}
function setLineGuide(on) {
  if (opts.difficulty === 'hard') { applyGuide(); return false; }
  opts.lineGuide = !!on;
  persistSettings();
  applyGuide(); return guideOn();
}
function persistSettings() {
  if (!store) return;
  save.settings = {
    ...(save.settings || {}),
    mode: opts.mode, difficulty: opts.difficulty, cls: opts.cls, laps: opts.laps,
    weather: opts.weather, track: opts.track, lineGuide: opts.lineGuide,
  };
  persist(store, save);
}
function identity() {
  if (career) return { driver: career.driver, team: career.team };
  return garage;
}
function currentTeam() {
  const idn = identity(), liv = idn.team.livery || {};
  return editorTeam(createEditor({
    driver: idn.driver.name, name: idn.team.name, tag: idn.team.tag,
    pattern: liv.pattern, c1: liv.c1, c2: liv.c2, c3: liv.c3, number: idn.driver.number,
  }));
}
const SCREEN_IDS = ['menu', 'results', 'pause', 'career', 'standings', 'upgrades', 'editor'];
function hideScreens() {
  for (const id of SCREEN_IDS) $(id)?.classList.add('hidden');
  closeHelp();
}
function disposeDecor() {
  if (lineGuide) { scene.remove(lineGuide.mesh); lineGuide.mesh.geometry.dispose(); lineGuide.mesh.material.dispose(); lineGuide = null; }
  if (boards) { scene.remove(boards.mesh); boards.mesh.geometry.dispose(); boards.mesh.material.dispose(); boards = null; }
}
/**
 * Swap the circuit and its theme. Rebuilds scenery; driving code is untouched.
 * `remember` writes the quick-race picker. The career hub passes false so the backdrop
 * can show the next round without changing the track the menu would load.
 */
function setTrack(id, remember = true) {
  const def = trackDef(id);
  if (track && track.id === def.id && theme && theme.name === def.theme) {
    if (remember) opts.track = def.id;
    return track;
  }
  clearCars();
  disposeDecor();
  const level = theme ? theme.quality : perf.level;
  theme?.dispose();
  track = new Track(def);
  theme = createTheme(def.theme);
  theme.build(scene, track);
  theme.setQuality(level);
  rebuildMinimap();
  rebuildTrackBox();
  if (remember) opts.track = def.id;
  return track;
}
/** Career hub and standings show the next round's circuit, not whichever track was loaded last. */
function focusCareerCircuit() {
  if (!career) return;
  const id = backdropTrackId(career);
  if (id) setTrack(id, false);
}
function startRace(o = {}) {
  const { grid, playerTeam, driver, keepCareer, restore, rng, ...rest } = o;
  sessionKind = keepCareer ? 'career' : 'quick';
  Object.assign(opts, rest);
  if (opts.mode !== 'race' && opts.mode !== 'tt') opts.mode = 'race';
  if (!isUnlocked(save, opts.cls)) opts.cls = 'gp';
  if (!track || track.id !== trackDef(opts.track).id) setTrack(opts.track);
  clearTimeout(resultsTimer);
  clearCars();
  race = new Race(track, {
    mode: opts.mode, difficulty: opts.difficulty, cls: opts.cls, laps: opts.laps, weather: opts.weather,
    best: timerSeed(save, opts.cls), rng, grid, playerTeam: playerTeam || currentTeam(), driver: driver || null,
  });
  race.cars.forEach((c) => {
    const m = makeCar(c.cls.id, c.team, c.isPlayer, false, c.teamIndex);
    m.st = {}; m.setTire(c.tire);
    scene.add(m.group); meshes.push(m); c.mesh = m;
  });
  disposeDecor();
  lineGuide = createLineGuide(track, race.cls); scene.add(lineGuide.mesh);
  if (!boards || boards.cls !== race.cls.id) { if (boards) scene.remove(boards.mesh); boards = buildBrakeBoards(track, race.cls); boards.cls = race.cls.id; scene.add(boards.mesh); }
  applyGuide();
  theme.setCars(meshes);
  ghost = race.solo ? loadGhost(opts.cls) : null;
  if (ghost) { ghostMesh = makeCar(opts.cls, race.player.team, false, true, race.player.teamIndex); ghostMesh.group.visible = false; scene.add(ghostMesh.group); }
  goal = sessionKind === 'career' ? { kind: 'pos', target: 10, text: track.name } : goalFor(opts, save);
  state = 'racing'; finishedShown = false; careerApplied = false; lastSect = -1; lastLights = -1; fovKick = 0; fxSpeed = 0; popTimer = 0;
  for (const id of ['banner', 'flag']) $(id).classList.remove('on'); $('posPop').classList.remove('on');
  hideScreens();
  $('hud').classList.remove('hidden');
  $('goal') && ($('goal').textContent = sessionKind === 'career' ? `ROUND ${career.round + 1}/${career.calendar.length}  ${track.name.toUpperCase()}` : 'GOAL: ' + goal.text);
  $('board').classList.toggle('hidden', race.solo);
  $('bEnd')?.classList.toggle('hidden', !race.solo);
  $('pos').classList.toggle('tt', race.solo);
  resetSectors();
  if (new URLSearchParams(location.search).get('rain') === '1') race.setRain(true);
  theme.setWeather({ rain: race.rain, wetness: race.wetness }); theme.setStartLights(0, false);
  const p = race.player; cam.init = false; cam.yaw = p.theta; cam.x = p.x; cam.z = p.z; cam.y = p.y + 6; cam.ly = p.y;
  Object.assign(ov, { x: p.x, y: p.y, z: p.z, yaw: p.theta, xV: 0, yV: 0, zV: 0, lastX: undefined }); shadowCad.force();
  resnap(); acc = 0;
  audio.init(); audio.music = false;
  setAutopilot(false); setMsg(race.solo ? 'GET READY' : 'GET READY', 3);
  if (restore) Object.assign(opts, restore);
  persistSettings();
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
  hideScreens();
  $('hud').classList.add('hidden');
  $('menu').classList.remove('hidden');
  $('again-btn')?.classList.remove('hidden');
  if ($('menu-btn')) $('menu-btn').textContent = 'MENU';
  if (opts.track !== track.id) setTrack(opts.track);
  refreshMenu();
  focusPrimary();
}
function setPaused(on) {
  if (!race || (state !== 'racing' && state !== 'paused')) return;
  state = on ? 'paused' : 'racing';
  $('pause').classList.toggle('hidden', !on);
  $('finish-btn').classList.toggle('hidden', !race.solo);
}

// ---------- menu ----------
const seg = (id) => [...$(id).querySelectorAll('button')];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function paintChip(id, color, color2) {
  const el = $(id); if (!el) return;
  const a = hexStr(color);
  el.style.background = color2 == null ? a : `linear-gradient(135deg, ${a} 58%, ${hexStr(color2)} 58%)`;
}
function buildTrackCards() {
  const root = $('optTrack');
  root.innerHTML = TRACKS.map((t) => {
    const card = circuitCard(t);
    return `<button type="button" class="tcard nav" data-v="${t.id}" data-tag="${card.tag.id}"><canvas class="thumb" width="168" height="112" aria-hidden="true"></canvas><span class="tmeta"><b>${esc(t.name.toUpperCase())}</b><span class="tag">${esc(card.tag.label)}</span><span class="len">${esc(formatLength(card.length))}</span><span class="tbest" data-best></span></span></button>`;
  }).join('');
  for (const btn of root.querySelectorAll('.tcard')) {
    const card = circuitCard(trackDef(btn.dataset.v));
    drawThumb(btn.querySelector('canvas'), card.samples, card.tag);
  }
}
buildTrackCards();
function layoutCarousel() {
  const root = $('optTrack');
  if (!root) return;
  const cards = [...root.querySelectorAll('.tcard')];
  if (!cards.length) return;
  const sel = Math.max(0, cards.findIndex((c) => c.dataset.v === opts.track));
  const reach = 0;
  const n = cards.length;
  cards.forEach((c, i) => {
    let d = i - sel;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    const visible = Math.abs(d) <= reach;
    c.classList.toggle('ghost', visible && d !== 0);
    c.classList.toggle('away', !visible);
    c.tabIndex = visible ? 0 : -1;
    c.style.setProperty('--d', String(d));
  });
}
function updateTrackBests() {
  for (const btn of $('optTrack').querySelectorAll('.tcard')) {
    const tb = getTrackBest(save, btn.dataset.v, opts.cls);
    const el = btn.querySelector('[data-best]');
    if (el) el.textContent = 'BEST ' + (tb ? formatTime(tb.bestLap) : '--:--.---');
  }
}
function refreshMenu() {
  const sync = (id, v) => seg(id).forEach((b) => b.classList.toggle('sel', b.dataset.v === String(v)));
  sync('optMode', opts.mode); sync('optDiff', opts.difficulty); sync('optClass', opts.cls); sync('optLaps', opts.laps); sync('optWeather', opts.weather); sync('optTrack', opts.track);
  seg('optMode').forEach((b) => b.setAttribute('aria-selected', b.classList.contains('sel') ? 'true' : 'false'));
  const tt = opts.mode === 'tt', careerMode = opts.mode === 'career';
  $('rowLaps').classList.toggle('hidden', tt || careerMode);
  $('rowWeather').classList.toggle('hidden', tt);
  $('rowTrack').classList.toggle('hidden', careerMode);
  const locked = !isUnlocked(save, 'speedway');
  $('clsSpeedway').classList.toggle('locked', locked);
  $('clsSpeedway').textContent = locked ? 'SPEEDWAY [LOCKED]' : 'SPEEDWAY';
  const team = currentTeam();
  paintChip('teamSwatch', team.c1, team.c2);
  $('teamLabel').textContent = team.name;
  if (careerMode) {
    const n = career ? nextRound(career) : null;
    const who = career ? `${career.driver.name} · ${career.team.name}` : 'Create a driver and a team';
    const nxt = n ? trackDef(n.id).name : career?.complete ? 'Season complete' : 'A season across every circuit';
    $('goalBox').innerHTML = `<b>CAREER</b> ${esc(who)}<br>${esc(nxt)}`;
    $('start-btn').textContent = career ? 'CAREER' : 'NEW CAREER';
  } else {
    const g = goalFor(opts, save), b = getBest(save, opts.cls);
    $('goalBox').innerHTML = `<b>GOAL</b> ${g.text}` + (b && isFinite(b.bestLap ?? NaN) ? `<br>Best lap (${opts.cls.toUpperCase()}): ${formatTime(b.bestLap)}` : '');
    $('start-btn').textContent = 'START';
  }
  $('menuMsg').textContent = !careerMode && locked ? lockMessage('speedway') : '';
  updateTrackBests();
  layoutCarousel();
  applyGuide();
}
function stepTrack(delta) {
  if (opts.mode === 'career') return;
  const i = Math.max(0, TRACKS.findIndex((t) => t.id === opts.track));
  opts.track = TRACKS[(i + delta + TRACKS.length) % TRACKS.length].id;
  setTrack(opts.track);
  persistSettings();
  refreshMenu();
}
for (const [id, key] of [['optMode', 'mode'], ['optDiff', 'difficulty'], ['optClass', 'cls'], ['optLaps', 'laps'], ['optWeather', 'weather'], ['optTrack', 'track']]) {
  $(id).addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (key === 'cls' && !isUnlocked(save, b.dataset.v)) { $('menuMsg').textContent = lockMessage(b.dataset.v); return; }
    opts[key] = key === 'laps' ? +b.dataset.v : b.dataset.v;
    if (key === 'track') { setTrack(opts.track); persistSettings(); }
    refreshMenu();
  });
}
$('optLine').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b && !b.disabled) setLineGuide(b.dataset.v === 'on'); });
$('pLine').addEventListener('click', () => setLineGuide(!guideOn()));
$('start-btn').addEventListener('click', () => { if (opts.mode === 'career') openCareer(); else startRace(); });
$('team-btn').addEventListener('click', () => showEditor('menu'));
$('trackPrev').addEventListener('click', () => stepTrack(-1));
$('trackNext').addEventListener('click', () => stepTrack(1));

// ---------- front-end focus (keyboard + gamepad). Driving input is untouched. ----------
const FRONT = new Set(['menu', 'career', 'standings']);
let menuNavUsed = false;
function helpOpen() { return !$('controls')?.classList.contains('hidden'); }
function closeHelp() {
  const pop = $('controls');
  if (!pop || pop.classList.contains('hidden')) return;
  pop.classList.add('hidden');
  document.querySelectorAll('[data-help]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
}
function openHelp() {
  $('controls').classList.remove('hidden');
  document.querySelectorAll('[data-help]').forEach((b) => b.setAttribute('aria-expanded', 'true'));
  setMenuFocus($('help-close'), true);
}
function navList() {
  const root = helpOpen() ? $('controls') : $(state);
  if (!root) return [];
  return [...root.querySelectorAll('.nav')].filter((el) => {
    if (el.disabled || el.tabIndex < 0) return false;
    if (el.closest('.hidden')) return false;
    const r = el.getBoundingClientRect();
    return r.width >= 1 && r.height >= 1;
  });
}
function setMenuFocus(el, ring) {
  document.querySelectorAll('.is-focus').forEach((n) => n.classList.remove('is-focus'));
  if (!el) return;
  if (ring) el.classList.add('is-focus');
  try { el.focus({ preventScroll: true }); } catch { /* already detached */ }
}
function focusPrimary() {
  if (!FRONT.has(state) || helpOpen()) return;
  const items = navList();
  const el = ['carRace', 'standBack', 'start-btn'].map((id) => $(id)).find((n) => n && items.includes(n)) || items[0];
  setMenuFocus(el, false);
}
function moveMenuFocus(dir) {
  const items = navList();
  if (!items.length) return;
  let idx = items.indexOf(document.activeElement);
  if (idx < 0) idx = items.findIndex((el) => el.classList.contains('is-focus'));
  if (idx < 0) idx = 0;
  const rects = items.map((el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  });
  const next = focusMove(rects, idx, dir);
  setMenuFocus(items[next < 0 ? idx : next], true);
}
function menuBack() {
  if (helpOpen()) { closeHelp(); setMenuFocus($('help-btn'), menuNavUsed); return; }
  if (state === 'standings') { career ? showCareer() : showMenu(); return; }
  if (state === 'career') showMenu();
}
function applyMenuEdge(edge) {
  if (edge === 'a') {
    const items = navList();
    const hit = items.find((el) => el === document.activeElement) || items.find((el) => el.classList.contains('is-focus'));
    (hit || items.find((el) => el.classList.contains('big')) || items[0])?.click();
    return;
  }
  if (edge === 'b') { menuBack(); return; }
  if (edge === 'left' || edge === 'right' || edge === 'up' || edge === 'down') { menuNavUsed = true; moveMenuFocus(edge); }
}
addEventListener('keydown', (e) => {
  if (!FRONT.has(state)) return;
  const el = document.activeElement;
  if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
  const dir = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' }[e.code];
  if (dir) { e.preventDefault(); menuNavUsed = true; moveMenuFocus(dir); return; }
  if (e.code === 'Escape') { e.preventDefault(); menuBack(); }
});
document.addEventListener('pointerdown', (e) => {
  if (e.pointerType === 'mouse' || e.pointerType === 'touch') document.querySelectorAll('.is-focus').forEach((n) => n.classList.remove('is-focus'));
});
document.addEventListener('click', (e) => {
  if (e.target.closest?.('[data-help]')) { openHelp(); return; }
  if (helpOpen() && e.target.id === 'controls') closeHelp();
});
$('help-close').addEventListener('click', closeHelp);
let padPrev = { up: false, down: false, left: false, right: false, a: false, b: false };
let padRepeat = 0;
function pollFrontPad(now) {
  if (!FRONT.has(state)) { padPrev = { up: false, down: false, left: false, right: false, a: false, b: false }; return; }
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  const cur = { up: false, down: false, left: false, right: false, a: false, b: false };
  for (const p of pads) {
    if (!p || !p.connected) continue;
    const s = menuPadState(p);
    for (const k in cur) cur[k] = cur[k] || s[k];
  }
  const edges = risingEdges(padPrev, cur);
  const dir = cur.left ? 'left' : cur.right ? 'right' : cur.up ? 'up' : cur.down ? 'down' : '';
  const fresh = edges.some((e) => e === 'left' || e === 'right' || e === 'up' || e === 'down');
  if (dir && !fresh && now - padRepeat > 220) { edges.push(dir); padRepeat = now; }
  else if (fresh) padRepeat = now;
  padPrev = cur;
  for (const e of edges) applyMenuEdge(e);
}
$('again-btn').addEventListener('click', () => startRace());
$('restart-btn').addEventListener('click', () => startRace());
$('resume-btn').addEventListener('click', () => setPaused(false));
$('finish-btn').addEventListener('click', () => finishSession());
$('menu-btn').addEventListener('click', () => { if (sessionKind === 'career' && career) continueCareer(); else showMenu(); });
$('pmenu-btn').addEventListener('click', showMenu);

// ---------- career / team ----------
let upgradeReturn = 'career';
function showOnly(id) {
  hideScreens();
  $('hud').classList.add('hidden');
  $(id).classList.remove('hidden');
  state = id;
}
function openCareer() {
  if (!career) { showEditor('season'); return; }
  career.difficulty = opts.difficulty;
  career.weather = opts.weather;
  saveCareer(store, career);
  showCareer();
}
function showCareer() {
  if (!career) { showEditor('season'); return; }
  const rows = standings(career);
  const me = rows.find((r) => r.player);
  const n = nextRound(career);
  $('carTitle').textContent = `SEASON ${career.season}`;
  $('carRound').textContent = career.complete ? 'SEASON COMPLETE' : `ROUND ${n.index + 1} OF ${n.count}  ·  ${trackDef(n.id).name.toUpperCase()}`;
  $('carCal').innerHTML = career.calendar.map((id, i) => {
    const cls = i < career.round || career.complete ? 'done' : i === career.round ? 'now' : '';
    const name = trackDef(id).name;
    return `<li class="${cls}" title="${esc(name)}"><b>${i + 1}</b> ${esc(name)}</li>`;
  }).join('');
  paintChip('carSwatch', career.team.livery.c1, career.team.livery.c2);
  $('carWho').textContent = `${career.driver.name}  #${career.driver.number}  ·  ${career.team.name}`;
  $('carMeta').textContent = `P${me.pos}  ·  ${me.points} PTS  ·  RESEARCH ${career.upgradePoints}  ·  ${DIFFICULTY[career.difficulty].name.toUpperCase()}`;
  seg('carLaps').forEach((b) => b.classList.toggle('sel', +b.dataset.v === career.laps));
  $('carRace').classList.toggle('hidden', !!career.complete);
  $('carRace').textContent = n ? 'RACE' : 'STANDINGS';
  focusCareerCircuit();
  showOnly('career');
  focusPrimary();
}
function startCareerRace() {
  if (!career) return openCareer();
  const n = nextRound(career);
  if (!n) { showStandings(); return; }
  const snap = { mode: opts.mode, cls: opts.cls, laps: opts.laps, track: opts.track, difficulty: opts.difficulty };
  career.difficulty = opts.difficulty;
  career.weather = opts.weather;
  saveCareer(store, career);
  startRace({
    keepCareer: true, restore: snap, mode: 'race', difficulty: career.difficulty, cls: 'gp',
    laps: career.laps, weather: career.weather, track: n.id,
    grid: careerGrid(career, CLASSES.gp),
    driver: { name: career.driver.name, number: career.driver.number },
  });
}
function showStandings() {
  if (!career) return showMenu();
  const rows = standings(career);
  const champ = career.complete ? rows[0] : null;
  $('standHead').textContent = champ
    ? (champ.player ? `SEASON ${career.season} CHAMPION — YOU` : `SEASON ${career.season} CHAMPION — ${champ.name}`)
    : `SEASON ${career.season}  ·  ROUND ${Math.min(career.round + 1, career.calendar.length)}/${career.calendar.length}`;
  const body = rows.map((r) => `<tr class="${r.player ? 'me' : ''}"><td>${r.pos}</td><td><i class="chip" style="background:${hexStr(r.c1)}"></i> ${esc(r.name)} <small>#${r.number}</small></td><td>${esc(r.team)}</td><td>${r.player ? 'YOU' : r.rating}</td><td>${r.points}</td></tr>`).join('');
  $('standTable').innerHTML = `<thead><tr><th>P</th><th>DRIVER</th><th>TEAM</th><th>RTG</th><th>PTS</th></tr></thead><tbody>${body}</tbody>`;
  focusCareerCircuit();
  showOnly('standings');
  focusPrimary();
}
function showUpgrades() {
  if (!career) return showMenu();
  $('upPoints').textContent = `RESEARCH POINTS  ${career.upgradePoints}`;
  $('upList').innerHTML = UPGRADE_KEYS.map((k) => {
    const lv = career.upgrades[k] || 0;
    const cost = nextUpgradeCost(career, k);
    const label = cost == null ? 'MAX' : career.upgradePoints >= cost ? `BUY ${cost}` : `NEED ${cost}`;
    return `<div class="uprow"><b style="width:5.2em">${UPGRADE_LABEL[k]}</b><div class="bar"><i style="width:${(lv / UPGRADE_MAX) * 100}%"></i></div><span>${lv}/${UPGRADE_MAX}</span><button class="btn" data-up="${k}" ${cost == null || career.upgradePoints < cost ? 'disabled' : ''}>${label}</button></div><div class="meta" style="text-align:left">${esc(UPGRADE_BLURB[k])}</div>`;
  }).join('');
  showOnly('upgrades');
}
function continueCareer() {
  upgradeReturn = 'results';
  showUpgrades();
}
function applyIdentity(ed) {
  garage = {
    driver: { name: ed.driver, number: ed.number },
    team: { name: ed.name, tag: ed.tag, livery: { pattern: ed.pattern, c1: ed.c1, c2: ed.c2, c3: ed.c3, number: ed.number } },
  };
  saveGarage(store, garage);
  garage = loadGarage(store);
  if (career) {
    career.driver = { ...garage.driver };
    career.team = garage.team;
    saveCareer(store, career);
    career = loadCareer(store);
  }
}
function showEditor(ret) {
  editorReturn = ret;
  const idn = identity(), liv = idn.team.livery || {};
  editorState = createEditor({
    driver: idn.driver.name, name: idn.team.name, tag: idn.team.tag,
    pattern: liv.pattern, c1: liv.c1, c2: liv.c2, c3: liv.c3, number: idn.driver.number,
  });
  $('edTitle').textContent = ret === 'season' ? 'NEW CAREER' : 'YOUR TEAM';
  $('edSave').textContent = ret === 'season' ? 'START SEASON' : 'DONE';
  $('edDriver').value = editorState.driver;
  $('edTeam').value = editorState.name;
  $('edNumber').value = String(editorState.number);
  $('edMsg').textContent = '';
  paintEditor();
  showOnly('editor');
  setPreviewTeam(editorTeam(editorState));
}
function paintEditor() {
  $('edTag').textContent = editorState.tag;
  seg('edChannel').forEach((b) => b.classList.toggle('sel', b.dataset.v === paintChannel));
  seg('edPattern').forEach((b) => b.classList.toggle('sel', b.dataset.v === editorState.pattern));
  const cur = editorState[paintChannel];
  for (const s of $('edSwatches').querySelectorAll('.swatch')) s.classList.toggle('sel', parseInt(s.dataset.c, 16) === cur);
  const picker = $('edColor');
  if (picker) picker.value = hexStr(cur);
}
function previewPatch(patch) {
  editorState = editEditor(editorState, patch);
  paintEditor();
  setPreviewTeam(editorTeam(editorState));
}
$('edPattern').innerHTML = PATTERNS.map((p) => `<button data-v="${p.id}">${p.name}</button>`).join('');
$('edSwatches').innerHTML = SWATCHES.map((c) => `<button class="swatch" data-c="${c.toString(16)}" style="background:${hexStr(c)}"></button>`).join('')
  + '<input type="color" id="edColor" value="#e8472a" aria-label="Custom colour" />';
$('edChannel').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; paintChannel = b.dataset.v; paintEditor(); });
$('edPattern').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) previewPatch({ pattern: b.dataset.v }); });
$('edSwatches').addEventListener('click', (e) => {
  const b = e.target.closest('.swatch'); if (!b) return;
  previewPatch({ [paintChannel]: parseInt(b.dataset.c, 16) });
});
$('edColor').addEventListener('input', () => previewPatch({ [paintChannel]: $('edColor').value }));
$('edNumber').addEventListener('input', () => previewPatch({ number: $('edNumber').value }));
function commitEditor() {
  const name = $('edTeam').value, driver = $('edDriver').value;
  const teamIssue = nameIssue(name), driverIssue = nameIssue(driver);
  if (teamIssue === 'blocked' || driverIssue === 'blocked') { $('edMsg').textContent = NAME_BLOCKED_MSG; return; }
  if (teamIssue === 'short') { $('edMsg').textContent = 'Team name needs 3 to 18 characters'; return; }
  if (driverIssue === 'short') { $('edMsg').textContent = 'Driver name needs 3 to 18 characters'; return; }
  editorState = editEditor(editorState, { name, driver, number: $('edNumber').value });
  applyIdentity(editorState);
  if (editorReturn === 'season') {
    career = newCareer({
      driverName: editorState.driver, number: editorState.number,
      team: garage.team, difficulty: opts.difficulty, weather: opts.weather, laps: career?.laps || opts.laps || 4,
    }, garage);
    saveCareer(store, career);
    showCareer();
    return;
  }
  if (editorReturn === 'career' && career) showCareer();
  else showMenu();
}
$('edSave').addEventListener('click', commitEditor);
$('edBack').addEventListener('click', () => { if (editorReturn === 'career' && career) showCareer(); else showMenu(); });
$('carLaps').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b || !career) return;
  career.laps = +b.dataset.v; saveCareer(store, career); showCareer();
});
$('carRace').addEventListener('click', startCareerRace);
$('carUp').addEventListener('click', () => { upgradeReturn = 'career'; showUpgrades(); });
$('carStand').addEventListener('click', showStandings);
$('carTeam').addEventListener('click', () => showEditor('career'));
$('carMenu').addEventListener('click', showMenu);
$('carSeason').addEventListener('click', () => {
  if (!career) return;
  const btn = $('carSeason');
  if (btn.dataset.arm !== '1') { btn.dataset.arm = '1'; btn.textContent = 'CONFIRM'; return; }
  btn.dataset.arm = ''; btn.textContent = 'NEW SEASON';
  newSeason(career); saveCareer(store, career); showCareer();
});
$('standBack').addEventListener('click', () => (career ? showCareer() : showMenu()));
$('standMenu').addEventListener('click', showMenu);
$('upList').addEventListener('click', (e) => {
  const b = e.target.closest('[data-up]'); if (!b || b.disabled || !career) return;
  const res = buyUpgrade(career, b.dataset.up);
  if (res.ok) saveCareer(store, career);
  showUpgrades();
});
$('upDone').addEventListener('click', () => {
  if (upgradeReturn === 'results' && career?.complete) { upgradeReturn = 'career'; showStandings(); return; }
  upgradeReturn = 'career';
  if (career) showCareer(); else showMenu();
});

let previewRenderer = null, previewScene = null, previewCam = null, previewCar = null;
function ensurePreview() {
  if (previewRenderer) return;
  const c = $('liveryCanvas');
  previewRenderer = new THREE.WebGLRenderer({ canvas: c, antialias: false, alpha: false });
  previewRenderer.setPixelRatio(1);
  previewScene = new THREE.Scene();
  previewScene.background = new THREE.Color(0x101820);
  previewCam = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
  previewScene.add(new THREE.HemisphereLight(0xcfe6ff, 0x3a4a32, 1.3));
  const sun = new THREE.DirectionalLight(0xfff1d6, 2.4); sun.position.set(4, 7, 5); previewScene.add(sun);
  const ground = new THREE.Mesh(new THREE.CircleGeometry(5, 8), new THREE.MeshLambertMaterial({ color: 0x1a2430 }));
  ground.rotation.x = -Math.PI / 2; previewScene.add(ground);
}
function setPreviewTeam(team) {
  ensurePreview();
  if (previewCar) { previewScene.remove(previewCar.group); disposeCar(previewCar); }
  previewCar = makeCar('gp', team, false, false, 0);
  previewScene.add(previewCar.group);
}
function renderPreview() {
  if (state !== 'editor' || !previewCar) return;
  const c = $('liveryCanvas');
  const w = Math.max(2, c.clientWidth | 0), h = Math.max(2, c.clientHeight | 0);
  if (previewRenderer.domElement.width !== w || previewRenderer.domElement.height !== h) {
    previewRenderer.setSize(w, h, false);
    previewCam.aspect = w / h; previewCam.updateProjectionMatrix();
  }
  const t = performance.now() * 0.001;
  previewCar.group.rotation.y = t * 0.7;
  previewCar.wheels.forEach((wheel) => { wheel.spin = t * 2; });
  writeWheels(previewCar);
  previewCam.position.set(Math.sin(t * 0.15) * 7.2, 2.5, Math.cos(t * 0.15) * 7.2);
  previewCam.lookAt(0, 0.55, 0);
  previewRenderer.render(previewScene, previewCam);
}
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
let mmBase = null;
function rebuildMinimap() {
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
  mmBase = { c, mapX, mapY };
}
rebuildMinimap();
function drawMinimap() {
  mctx.clearRect(0, 0, mm.width, mm.height);
  mctx.drawImage(mmBase.c, 0, 0);
  // AI cars first, the player on top (no per-frame array copy / sort / colour strings)
  for (let pass = 0; pass < 2; pass++) for (const c of race.cars) {
    if ((pass === 1) !== c.isPlayer) continue;
    const r = c._r || c, x = mmBase.mapX(r.x), y = mmBase.mapY(r.z);
    mctx.fillStyle = '#000'; mctx.beginPath(); mctx.arc(x, y, c.isPlayer ? 7.5 : 5.5, 0, 7); mctx.fill();
    mctx.fillStyle = c.isPlayer ? '#ffe14a' : (c.team._hex ||= hex(c.team.c1)); mctx.beginPath(); mctx.arc(x, y, c.isPlayer ? 5.5 : 3.6, 0, 7); mctx.fill();
  }
}

// ---------- HUD ----------
const hex = (n) => '#' + n.toString(16).padStart(6, '0');
/** textContent / innerHTML writes only when the value changed (the HUD refreshes at 20 Hz; most fields are static between ticks) */
function setTxt(id, v) { const el = $(id); if (el._v !== v) { el._v = v; el.textContent = v; } }
function setHtml(id, v) { const el = $(id); if (el._v !== v) { el._v = v; el.innerHTML = v; } }
function updateHud() {
  const p = race.player, tm = race.lapTimer;
  if (race.solo) { setHtml('pos', 'TIME TRIAL'); setTxt('lap', `L${p.laps + 1}`); }
  else {
    setHtml('pos', `P${p.pos}<small>/${race.cars.length}</small>`);
    setTxt('lap', `LAP ${Math.min(p.laps + 1, race.laps)}/${race.laps}`);
  }
  setTxt('laptime', formatTime(currentLapTime(tm, race.time)));
  setTxt('best', 'BEST ' + formatTime(tm.bestLap));
  secBox.forEach((b, i) => b.classList.toggle('cur', tm.g >= 0 && i === liveSector(tm)));
  setTxt('speed', String(Math.round(Math.max(0, p.v) * 3.6)));
  setTxt('tire', p.tire === 'wet' ? 'W' : 'D'); $('tire').classList.toggle('wet', p.tire === 'wet');
  const wear = $('wearbar').firstElementChild; wear.style.width = (1 - p.wear) * 100 + '%';
  wear.style.background = p.wear > 0.7 ? '#e8472a' : p.wear > 0.45 ? '#f2c230' : '#5de06a';
  $('boostbar').firstElementChild.style.width = p.boost * 100 + '%';
  if (!race.solo) {
    setHtml('board', race.order.slice(0, 5).map((c, i) =>
      `<li class="${c.isPlayer ? 'me' : ''}"><b>${i + 1}</b><i style="background:${hex(c.team.c1)}"></i>${c.team.tag}</li>`).join('')
      + (p.pos > 5 ? `<li class="me"><b>${p.pos}</b><i style="background:${hex(p.team.c1)}"></i>${p.team.tag}</li>` : ''));
  }
  const gp = $('gaps');
  if (!race.solo && race.phase === 'racing' && !p.finished) {
    const g = race.gaps(p); gp.classList.remove('hidden');
    setTxt('gAhead', g.ahead == null ? '' : '\u25B2 ' + fmtGap(g.ahead, '+'));
    setTxt('gBehind', g.behind == null ? '' : '\u25BC ' + fmtGap(g.behind, '-'));
  } else gp.classList.add('hidden');
  $('bPit').classList.toggle('on', p.pit.request || p.pit.stage > 0);
  $('bPit').classList.toggle('hidden', race.solo);
  const bc = $('bc'); bc.classList.toggle('hidden', !p.pit.stage);
  if (p.pit.stage) setTxt('pitmsg', p.pit.stage === 2 ? (p.pit.choice ? 'SERVICE...' : 'CHOOSE TIRES') : p.pit.stage === 1 ? 'PIT LANE - CHOOSE' : 'PIT EXIT');
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
    title = 'TIME TRIAL'; $('resSum').innerHTML = '';
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
    const pc = race.player.team.c1;
    $('resSum').innerHTML = `<span class="big">P${me.pos}</span><span class="chip" style="background:${hex(pc)}"></span><span>${me.pos === 1 ? formatTime(me.time, false) : '+' + (me.gap ?? 0).toFixed(1) + 's'}</span><span>BEST ${formatTime(me.best, false)}</span>`;
    rows = list.map((r) => `<tr class="${r.isPlayer ? 'me' : ''}"><td>${r.pos}</td><td><i class="chip" style="background:${hex(r.team?.c1 ?? 0x888888)}"></i> ${r.name}</td><td>${r.pos === 1 ? formatTime(r.time, false) : '+' + (r.gap ?? 0).toFixed(1)}</td><td>best ${formatTime(r.best, false)}</td><td>${r.stops ? 'pit×' + r.stops : ''}</td></tr>`);
    const ev = evaluateGoal(goal, { pos: me.pos });
    $('resGoal').textContent = ev.text; $('resGoal').className = ev.met ? 'ok' : 'no';
    const prog = recordRace(save, { mode: 'race', cls: sessionKind === 'career' ? 'gp' : opts.cls, pos: me.pos });
    persist(store, save);
    msgs.push(...prog.messages);
    if (sessionKind === 'career' && career && !careerApplied) {
      careerApplied = true;
      const award = applyRaceResult(career, list.map((r) => ({ id: r.id, pos: r.pos, isPlayer: r.isPlayer })));
      saveCareer(store, career);
      if (award) {
        const row = award.standings.find((r) => r.player);
        msgs.push(`+${award.points} PTS`, `+${award.upgrade} RESEARCH`, `CHAMPIONSHIP P${row.pos} · ${row.points} PTS`);
        if (award.complete) msgs.push(award.standings[0].player ? 'YOU ARE THE CHAMPION' : `CHAMPION ${award.standings[0].name}`);
        $('resGoal').textContent = `${track.name.toUpperCase()}  +${award.points} PTS`;
      }
    }
  }
  $('resTitle').textContent = title;
  $('restable').innerHTML = rows.join('');
  $('resMsg').innerHTML = msgs.join('<br>');
  $('again-btn').textContent = race.solo ? 'RETRY' : 'RESTART';
  $('again-btn').classList.toggle('hidden', sessionKind === 'career');
  $('menu-btn').textContent = sessionKind === 'career' ? 'CONTINUE' : 'MENU';
  for (const id of ['hud', 'pause']) $(id).classList.add('hidden');
  $('results').classList.remove('hidden'); state = 'results';
  refreshMenu();
}

// ---------- race-feel HUD bits ----------
function showBanner(t) { const b = $('banner'); b.textContent = t; b.classList.remove('on'); void b.offsetWidth; b.classList.add('on'); }
function flagWave() { const f = $('flag'); f.classList.remove('on'); void f.offsetWidth; f.classList.add('on'); }
function posPopup(from, to) {
  const el = $('posPop'), up = to < from;
  el.textContent = `P${to} ${up ? '\u25B2' : '\u25BC'}`; el.className = 'on ' + (up ? 'up' : 'down'); popTimer = 1.5;
}
/** 5 red lights (one per second), all out = GO. HUD copy of the gantry, top centre. */
function updateLights() {
  const L = $('lights'), n = race.phase === 'countdown' ? race.lights : 0;
  const show = !race.solo && (race.phase === 'countdown' || race.goFlash > 0);
  L.classList.toggle('hidden', !show); document.body.classList.toggle('lit', show);
  L.classList.toggle('go', race.phase !== 'countdown' && race.goFlash > 0);
  L.classList.toggle('fade', race.phase !== 'countdown' && race.goFlash < 0.8);
  if (n !== lastLights) { lastLights = n; [...L.children].forEach((c, i) => c.classList.toggle('on', i < n)); }
}
const _drive = {}; let audioAcc = 0;
function raceFeel(dt) {
  const p = race.player, vT = p.cls.vTop;
  const racing = race.phase === 'racing';
  // FOV punch on boost / in a tow
  const kt = racing ? (p.boosting ? 1 : 0) + Math.min(1, (p.slip || 0) / 0.3) * 0.5 : 0;
  fovKick += (Math.min(1, kt) - fovKick) * (1 - Math.exp(-dt * (kt > fovKick ? 6 : 2.5)));
  // kerb rumble shake (small)
  const onKerb = racing && p.surface === 'kerb' && p.v > 15;
  if (onKerb) shake = Math.max(shake, 0.18 * Math.min(1, p.v / 60));
  if (onKerb && !kerbWas) audio.beep?.(90, 0.04, 'square', 0.05);
  kerbWas = onKerb;
  // locked tyre / flat spot: a small buzz through the chassis (camera shake, visual only)
  if (racing && p.v > 20) shake = Math.max(shake, 0.16 * p.lockup, 0.07 * p.flat * Math.min(1, p.v / 50));
  // speed lines: above ~55% of top speed, stronger with boost / tow
  const sp = racing ? clamp((p.v / vT - 0.55) / 0.4, 0, 1) * 0.75 + fovKick * 0.35 : 0;
  const camFx = 0.3 + 0.7 * camW.chase; // overhead/map views: much subtler
  fxSpeed += (Math.min(1, sp) * camFx - fxSpeed) * (1 - Math.exp(-dt * 4));
  const lat = clamp((Math.abs(p.steer || 0) * p.v / 40 - 0.55) * 1.6, 0, 1) * (p.v > 18 ? 1 : 0);
  audioAcc += dt;
  if (audioAcc >= 1 / 62) { const d = _drive; d.dt = audioAcc; audioAcc = 0; d.v = Math.abs(p.v); d.vTop = vT; d.throttle = p.input.throttle; d.brake = p.input.brake; d.lat = lat; d.lock = p.lockup; d.slip = p.wheelSlip; d.kerb = onKerb; d.on = racing || race.phase === 'countdown'; d.boosting = p.boosting; audio.drive(d); } // engine pitch needs ~60 Hz at most; 90/120 Hz frames skip alternate calls
  // HUD timers
  popTimer -= dt; if (popTimer < 0) $('posPop').classList.remove('on');
}
function fmtGap(g, sign) { return g == null ? '' : `${sign}${g.toFixed(1)}`; }

// ---------- events/actions ----------
function handleEvents() {
  const p = race.player;
  for (const e of race.events) {
    if (e.type === 'light') audio.beep(440, 0.12);
    else if (e.type === 'go') { audio.beep(880, 0.4); audio.music = true; setMsg('GO!', 1.5); }
    else if (e.type === 'finallap') showBanner('FINAL LAP');
    else if (e.type === 'poschange') posPopup(e.from, e.to);
    else if (e.type === 'rain') setMsg('RAIN STARTING - WET TIRES?', 5);
    else if (e.type === 'hit' && e.car.isPlayer) { shake = Math.max(shake, Math.min(1, 0.35 + e.power * 0.65)); audio.thump(); }
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
      recordTrackLap(save, track.id, race.cls?.id || opts.cls, e);
      if (rec) p.recordSet = true;
      persist(store, save);
      if (e.ghost && rec) { ghosts[opts.cls] = e.ghost; try { store?.setItem(GHOST_KEY + ':' + opts.cls, JSON.stringify(e.ghost)); } catch { /* quota */ } if (race.solo) ghost = e.ghost; }
    }
    else if (e.type === 'finish' && e.car.isPlayer) { setMsg('FINISH!', 3); audio.beep(1200, 0.5); flagWave(); }
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
let trackBox = null;
function rebuildTrackBox() {
  let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
  for (let i = 0; i < track.n; i++) { x0 = Math.min(x0, track.px[i]); x1 = Math.max(x1, track.px[i]); z0 = Math.min(z0, track.pz[i]); z1 = Math.max(z1, track.pz[i]); }
  trackBox = { cx: (x0 + x1) / 2, cz: (z0 + z1) / 2, w: x1 - x0 + 120, h: z1 - z0 + 120 };
}
rebuildTrackBox();
const posV = new THREE.Vector3(), lookV = new THREE.Vector3(), pC = new THREE.Vector3(), lC = new THREE.Vector3(), pO = new THREE.Vector3(), lO = new THREE.Vector3(), pF = new THREE.Vector3(), lF = new THREE.Vector3();
const _rt = new THREE.Vector3(), _up2 = new THREE.Vector3(), _sp = [0, 0, 0], _srt = [0, 0, 0], _sup = [0, 0, 0];
const _dir = new THREE.Vector3(), _pp = new THREE.Vector3();
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
  if (shake > 0) { const sk = shake * shake * (nc + (1 - nc) * 0.25); camera.position.x += (Math.random() - 0.5) * sk * 0.9; camera.position.y += (Math.random() - 0.5) * sk * 0.7; camera.position.z += (Math.random() - 0.5) * sk * 0.5; shake = Math.max(0, shake - dt * 3.2); }
  camera.lookAt(lookV);
  camera.fov = (chaseFov + fovKick * 9) * nc + (ovFov + fovKick * 2.5) * no + fFov * nf; camera.near = Math.max(0.5, dist * 0.12 * (1 - nc)); camera.far = 1500 + dist * 3; camera.updateProjectionMatrix();
  // snap the camera to the low-res texel grid in its own view plane (orientation unchanged) so static geometry doesn't shimmer
  {
    const te = texelWorld(camera.position.distanceTo(lookV), camera.fov, RS.lowH);
    _rt.set(1, 0, 0).applyQuaternion(camera.quaternion); _up2.set(0, 1, 0).applyQuaternion(camera.quaternion);
    camera.position.toArray(_sp); _rt.toArray(_srt); _up2.toArray(_sup);
    camera.position.fromArray(snapToTexel(_sp, _srt, _sup, te, _sp));
  }
  // shadow / fog focus follows what we are looking at
  viewInfo.x = lookV.x; viewInfo.y = lookV.y; viewInfo.z = lookV.z;
  viewInfo.dist = posV.distanceTo(lookV);
  viewInfo.half = clamp(nc * 70 + no * (portrait ? 125 : 135) + nf * 130, 60, 140);
  mm.classList.toggle('off', nc < 0.6);
  mmOn = nc >= 0.6;
}
let mmOn = true;
/** camera debug numbers, computed on demand (it used to build an object every frame) */
function camDebug() {
  const p = viewPlayer || race?.player; if (!p) return { mode: camMode };
  const d = camera.getWorldDirection(_dir);
  return { mode: camMode, pitchDeg: +(Math.asin(-d.y) * 180 / Math.PI).toFixed(2), height: +(camera.position.y - p.y).toFixed(2),
    distance: +camera.position.distanceTo(_pp.set(p.x, p.y, p.z)).toFixed(2), fov: +camera.fov.toFixed(2),
    behind: +((p.x - camera.position.x) * Math.sin(ov.yaw) + (p.z - camera.position.z) * Math.cos(ov.yaw)).toFixed(2), aspect: +camera.aspect.toFixed(3),
    // car's vertical screen position (% from the top): regression check for the overhead follow lag
    carScreenPct: +((1 - _pp.set(p.x, p.y, p.z).project(camera).y) * 50).toFixed(1) };
}

const ghostLoc = { i: 0 }, _gpose = {};
/** refresh the colour-guide ribbon from the interpolated player pose (typed buffers only) */
function updateGuide() {
  if (!lineGuide || !race) return;
  const p = race.player, vis = guideOn() && state !== 'menu' && !p.pit.stage && race.phase !== 'done' && !p.finished;
  if (lineGuide.mesh.visible !== vis) lineGuide.setEnabled(vis);
  if (vis) lineGuide.update(viewPlayer ? viewPlayer.s : p.s, Math.abs(p.v), p.grip);
}
function syncMeshes(dt, wheelDt = dt) {
  for (const c of race.cars) {
    const m = c.mesh; if (!m) continue;
    const r = lerpCar(c, alpha, c._r || (c._r = {}), track.length);
    m.group.position.set(r.x, r.y, r.z);
    m.group.rotation.y = r.theta;
    if (c.isPlayer && viewPlayer) { viewPlayer.x = r.x; viewPlayer.y = r.y; viewPlayer.z = r.z; viewPlayer.theta = r.theta; viewPlayer.s = r.s; viewPlayer.d = r.d; }
    // visual-only animation (roll / pitch / bob / vibration / steering / true-radius wheel spin / lamps), all low-passed against render time
    const st = m.st;
    st.v = c.v; st.steer = r.steer; st.longAcc = c.longAcc; st.latAcc = c.latAcc || 0; st.surface = c.surface; st.lockup = c.lockup; st.flat = c.flat;
    st.brake = c.brk; st.rain = race.rain; st.roll = r.roll; st.pitch = r.pitch; st.s = r.s; st.lift = c.isPlayer ? theme.fx.lift : 0;
    if (m.tire !== c.tire) m.setTire(c.tire);
    animateCar(m, st, wheelDt);
    carFx.emitCar(c, m, r, dt, c.cls.id);
    if (m.mark) { m.mark.visible = camW.chase < 0.5; m.mark.scale.setScalar(1); }
    m.group.scale.setScalar(1 + 3 * camW.full);
  }
  carFx.update(dt);
  if (ghostMesh) {
    // ghost time follows the interpolated render time (race.time only moves in 1/60 s steps)
    const pose = race.phase === 'racing' && race.lapTimer.g >= 0 ? sampleGhost(ghost, currentLapTime(race.lapTimer, race.time - (1 - alpha) * STEP), _gpose) : null;
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

// ---------- adaptive quality: step down render height / MSAA / shadow size / prop density when FPS drops ----------
const shadowCad = new ShadowCadence(), frameStats = new FrameStats();
let sceneCalls = 0, sceneTris = 0;
function setQuality(level) {
  const prevH = targetHFor(perf.level), prevS = msaaFor(perf.level);
  perf.level = clamp(Math.round(level), 0, 2); perf.gov.level = perf.level; theme.setQuality(perf.level);
  if (msaaFor(perf.level) !== prevS) { target.samples = msaaFor(perf.level); target.dispose(); }
  if (targetHFor(perf.level) !== prevH) resize();
  shadowCad.force();
}
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
const perfMem = performance.memory || null; // Chrome only: lets perfStats() report JS-heap growth per frame
let viewPlayer = null; // player as rendered this frame (interpolated x/y/z/theta; everything else live)
const resnap = () => { if (race) { for (const c of race.cars) snapshot(c); alpha = 1; } };
function frame(now) {
  pollFrontPad(now);
  requestAnimationFrame(frame);
  const rawDt = Math.max(0, (now - last) / 1000), dt = Math.min(0.05, rawDt); last = now;
  // A software GPU can spend well over 500ms on a heavy circuit. Dropping those frames
  // made perfStats() report 0 fps and 0 frames. Only real stalls (backgrounded tab) are ignored.
  if (rawDt > 0 && rawDt < 5) frameStats.add(rawDt * 1000, perfMem ? perfMem.usedJSHeapSize : -1);
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
        if (!race.autopilot && !p.finished && !p.pit.stage) { const i = input.poll(), pi = p.input; pi.steer = i.steer; pi.throttle = i.throttle; pi.brake = i.brake; pi.boost = i.boost; }
        race.step(STEP);
      }
      alpha = acc / STEP;
    }
    if (race.rain !== wxRain || race.wetness !== wxWet) { wxRain = race.rain; wxWet = race.wetness; theme.setWeather({ rain: wxRain, wetness: wxWet }); }
    const goLit = race.goFlash > 0;
    if (race.lights !== litN || goLit !== litGo) { litN = race.lights; litGo = goLit; theme.setStartLights(litN, litGo); }
    const p = race.player;
    raceFeel(dt); updateLights();
    if (p.finished && !finishedShown) { finishedShown = true; resultsTimer = setTimeout(() => { race.simulateToEnd(); showResults(); }, 2200); }
    if (hudTimer <= 0) { updateHud(); hudTimer = 0.05; }
    sectTimer -= dt; if (sectTimer < 0) $('sect').classList.remove('on');
    splitTimer -= dt; if (splitTimer < 0) $('split').textContent = '';
    msgTimer -= dt; if (msgTimer < 0) $('msg').textContent = race.phase === 'countdown' ? 'GET READY' : '';
    mmTimer -= rawDt; if (mmOn && mmTimer <= 0) { drawMinimap(); mmTimer = 1 / 30; } // 30 Hz is plenty for a 120 px map
  } else if (state === 'paused') {
    audio.engine(0, 1, 0, false);
  }
  if (state !== 'racing') fxSpeed *= 0.8;
  if (state === 'menu' || state === 'career' || state === 'standings') {
    // idle orbit over whichever circuit this screen is showing
    const t = now / 1000 * 0.08, c = track.at(((t * 300) % track.length));
    camera.position.set(c.x + 40, c.y + 30, c.z + 40); camera.lookAt(c.x, c.y, c.z);
    camera.fov = 58; camera.near = 0.5; camera.far = 1500; camera.updateProjectionMatrix();
    Object.assign(viewInfo, { x: c.x, y: c.y, z: c.z, half: 70, dist: 55 });
    theme.setPit(null);
  } else if (race) {
    if (viewPlayer?.__src !== race.player) { viewPlayer = Object.create(race.player); viewPlayer.__src = race.player; }
    syncMeshes(state === 'racing' ? dt : 0, state === 'racing' ? Math.min(rawDt, 0.1) : 0); updateGuide(); updateCamera(dt);
    const p = race.player;
    theme.setPit(p.pit.stage || p.pit.request ? { stage: p.pit.stage, request: p.pit.request, serv: p.pit.serv, choice: p.pit.choice, teamIndex: p.teamIndex, colors: { c1: p.team.c1, c2: p.team.c2 }, car: p.mesh } : null);
  }
  if (state === 'editor') renderPreview();
  theme.update(dt, camera, viewInfo);
  const fxo = theme.fx, U = postMat.uniforms;
  U.speed.value = fxSpeed; U.rain.value = fxo.rain; U.time.value = fxo.time; U.sat.value = fxo.sat; U.tint.value.set(fxo.tint[0], fxo.tint[1], fxo.tint[2]);
  watchPerf(Math.min(0.5, rawDt));
  if (perf.level > 0 || shadowCad.due(rawDt)) renderer.shadowMap.needsUpdate = true;
  renderer.setRenderTarget(target); renderer.render(scene, camera);
  sceneCalls = renderer.info.render.calls; sceneTris = renderer.info.render.triangles;
  renderer.setRenderTarget(null);
  renderer.setViewport(RS.vx, RS.vy, RS.vw, RS.vh); // integer-scaled, centred; the rest stays black (autoClear)
  renderer.render(post, postCam);
}
requestAnimationFrame(frame);
refreshMenu();
focusPrimary();

// ---------- test/automation hook ----------
const q = new URLSearchParams(location.search);
if (q.get('touch') === '1') document.body.classList.add('touch');
if (q.get('autostart') === '1') {
  startRace({
    ...(q.get('mode') ? { mode: q.get('mode') } : {}), ...(q.get('diff') ? { difficulty: q.get('diff') } : {}),
    ...(q.get('cls') ? { cls: q.get('cls') } : {}), ...(q.get('laps') ? { laps: +q.get('laps') } : {}),
    ...(q.get('track') ? { track: q.get('track') } : {}),
    weather: q.get('weather') || 'dry',
  });
  setAutopilot(true); // test convenience only; autopilot is off by default
  const cq = q.get('cam'); if (cq) setCamera(cq, true);
}
if (q.get('camlog') === '1') setInterval(() => console.log('camlog', JSON.stringify(camDebug())), 1000);
if (q.get('q')) { perf.auto = false; setQuality(+q.get('q')); }
window.__game = {
  startLights: () => race ? { phase: race.phase, lights: race.lights, go: race.phase !== 'countdown' && race.goFlash > 0 } : null,
  showResults: () => { if (!race) return; if (!race.solo) race.simulateToEnd(); showResults(); },
  feel: () => ({ fovKick, fxSpeed, shake }),
  camDebug,
  startRace: (o) => startRace(o), setRain: (on) => { race?.setRain(on); if (race) theme.setWeather({ rain: race.rain, wetness: race.wetness }); }, enterPit: () => { race && race.requestPit(race.player, true); },
  fps: () => perf.fps,
  /** colour line guide (test hook): setLineGuide(on) -> effective state (always false on HARD); lineGuide() -> status {enabled, hard, saved, level, reds, yellows, greens, v} */
  setLineGuide, lineGuide: () => ({ enabled: !!lineGuide?.mesh.visible, allowed: guideOn(), hard: opts.difficulty === 'hard', saved: opts.lineGuide, ...(lineGuide?.status || {}) }),
  carFx, boards: () => boards?.plan || [],
  /** frame-time stats over the last ~240 frames: {frames, avgMs, p95Ms, maxMs, fps, spikes, allocBytesPerFrame (-1 if unsupported)} + render size; reset=true clears the window */
  perfStats: (reset = false) => { const r = { ...frameStats.snapshot(), quality: perf.level, lowRes: RS.lowW + 'x' + RS.lowH, k: RS.k, msaa: target.samples, drawCalls: sceneCalls, triangles: sceneTris }; if (reset) frameStats.reset(); return r; }, setAutopilot, toggleCamera, setCamera, setQuality, hold: (on = true) => { holdSim = !!on; },
  /** put the player in the pit box in the service state (crew visible, car jacked). hold freezes the sim for screenshots. */
  pitService: (choice = 'dry', serv = 1.2, hold = true) => {
    const p = race.player, T = track, s = T.boxU(p.teamIndex) - 0.6, sw = ((s % T.length) + T.length) % T.length, a = T.at(s, T.boxD(Math.floor(sw / T.ds) % T.n));
    p.x = a.x; p.z = a.z; p.y = a.y; p.theta = T.thetaAt(s); p.s = sw; p.idx = T.locateGlobal(a.x, a.z).i; p.v = 0; p.steer = 0;
    Object.assign(p.pit, { stage: 2, request: true, timer: 0, serv: choice ? serv : 0, choice: choice || null });
    holdSim = hold; cam.init = false; cam.yaw = p.theta; ov.yaw = p.theta; ov.lastX = undefined; resnap(); return { s: sw, x: a.x, z: a.z };
  }, setMute, setPaused, finishSession, showMenu, choosePitTire: (t) => race?.choosePitTire(t),
  /** advance simulation without rendering (seconds) */
  fastForward: (sec) => { for (let t = 0; t < sec; t += 1 / 60) race.step(1 / 60); handleEvents(); resnap(); },
  finishNow: () => { race.autopilot = true; },
  teleport: (s, d = 0) => { const p = race.player, a = track.at(s, d); p.x = a.x; p.z = a.z; p.theta = track.thetaAt(s); p.s = s; p.idx = track.locateGlobal(a.x, a.z).i; cam.init = false; cam.yaw = p.theta; resnap(); },
  save, opts, DIFFICULTY,
  get race() { return race; }, get camMix() { return 1 - camW.chase; }, get camMode() { return camMode; }, get quality() { return perf.level; },
  get track() { return track; }, get theme() { return theme; }, get career() { return career; },
  setTrack: (id) => { setTrack(id); persistSettings(); return track.id; },
  showCareer: () => { if (!career) career = newCareer({ difficulty: opts.difficulty, weather: opts.weather }, garage); saveCareer(store, career); showCareer(); },
  showStandings: () => showStandings(),
  showUpgrades: () => { upgradeReturn = 'career'; showUpgrades(); },
  showEditor: () => showEditor('menu'),
  seedCareer: () => {
    career = newCareer({ driverName: 'Casey Morrow', number: 17, team: { name: 'Northline Racing', livery: { pattern: 'chevrons', c1: 0xe8472a, c2: 0xffd24a, c3: 0x15151a, number: 17 } }, difficulty: opts.difficulty || 'normal' });
    const ids = career.rivals.map((r) => r.id);
    const rows = [{ id: 'player', isPlayer: true, pos: 2 }, ...ids.map((id, i) => ({ id, pos: i === 0 ? 1 : i + 2 }))];
    applyRaceResult(career, rows);
    career.upgradePoints = 14;
    saveCareer(store, career);
    garage = { driver: { ...career.driver }, team: career.team };
    saveGarage(store, garage);
    return career;
  },
  state: () => ({ state, phase: race?.phase, pos: race?.player.pos, lap: race?.player.laps, rain: race?.rain, wet: race?.wetness, tire: race?.player.tire, wear: race?.player.wear, pit: race?.player.pit.stage, autopilot: race?.autopilot, camMix: 1 - camW.chase, cam: camMode, quality: perf.level }),
};
