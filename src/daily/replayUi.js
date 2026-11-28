// The owner's replay screen (#admin-replay): key prompt, then every racer's best lap of one day at once.
// The key is typed in, sent only to drive_admin_replay, and kept on this device once it has worked.
import * as THREE from 'three';
import { carPose } from '../pose.js';
import { esc } from '../html.js';
import { formatTime } from '../timing.js';
import { formatDay } from './date.js';
import { dailyMap } from './schedule.js';
import { twistLabel } from './view.js';
import { trackDef } from '../tracks/index.js';
import { SPEEDS, buildRuns, createClock, cssColor, runPose } from './replayModel.js';
import { createReplayCars, REPLAY_CAR_LENGTH } from './replayCars.js';

export const ADMIN_KEY_STORE = 'drive-daily-admin-key-v1';
const FOV = 30;          // overview: straight down through a narrow lens
const CAR_PX = 15;       // on-screen car length in the overview
const LABEL_ROOM = 24;
const RELOCATE_M = 30;   // a pose this far from its hinted track sample is searched for again (after a scrub)

/** loadMap(map): show that day's circuit and weather, and return the Track. */
export function createReplayUi({ $, api, storage, scene, camera, loadMap, onExit }) {
  let dayId = null, session = 0, track = null, cars = null, runs = [], clock = null, bounds = null;
  let follow = -1, names = true, snap = true, labels = [], rows = [], hints = [];
  const eye = new THREE.Vector3(), look = new THREE.Vector3(), v = new THREE.Vector3();
  const goal = new THREE.Vector3(), _pose = {}, _car = {}, _road = { y: 0, pitch: 0, roll: 0 };

  const saved = () => { try { return storage?.getItem(ADMIN_KEY_STORE) || ''; } catch { return ''; } };
  const remember = (k) => { try { storage?.setItem(ADMIN_KEY_STORE, k); } catch { /* storage unavailable */ } };
  const forget = () => { try { storage?.removeItem(ADMIN_KEY_STORE); } catch { /* storage unavailable */ } };

  function showGate(message = '') {
    stop();
    $('replay').dataset.view = 'gate';
    $('repGateMsg').textContent = message;
    $('repKey').value = '';
    $('repLoad').disabled = false;
    $('repKey').focus({ preventScroll: true });
  }

  async function load(key) {
    const mine = ++session;
    $('repLoad').disabled = true;
    $('repGateMsg').textContent = 'Loading…';
    const result = await api.adminReplay(key, dayId);
    if (mine !== session) return; // left, or asked again, while waiting
    if (!result.ok) {
      const wrong = result.error === 'forbidden';
      if (wrong && key === saved()) forget();
      showGate(wrong ? 'WRONG KEY. Nothing was loaded.' : result.offline ? 'Offline: could not reach the server.' : `Could not load: ${result.error}`);
      return;
    }
    remember(key);
    start(result.data);
  }

  function start(data) {
    const built = buildRuns(data);
    runs = built.runs;
    clock = createClock(built.duration);
    track = loadMap(dailyMap(dayId));
    bounds = boundsOf(track);
    cars = createReplayCars(runs.map((r) => r.color));
    scene.add(cars.group);
    follow = -1; snap = true; hints = runs.map(() => 0);
    $('replay').dataset.view = 'play';
    $('repList').innerHTML = runs.map((r, i) => `<li><button type="button" data-i="${i}" aria-pressed="false"><i style="background:${cssColor(r.color)}"></i><span class="r-rank">${r.rank}</span><span class="r-name">${esc(r.name)}</span><span class="r-time">${r.label}</span></button></li>`).join('');
    rows = [...$('repList').querySelectorAll('button')];
    $('repLabels').textContent = '';
    labels = runs.map((r) => {
      const el = document.createElement('span');
      el.textContent = r.name; el.style.borderColor = cssColor(r.color);
      $('repLabels').append(el);
      return el;
    });
    $('repCount').textContent = `${runs.length} RACER${runs.length === 1 ? '' : 'S'}${built.skipped ? `  ·  ${built.skipped} UNREADABLE` : ''}`;
    $('repEmpty').textContent = runs.length ? '' : 'No runs for this day.';
    $('repScrub').max = String(Math.ceil(built.duration * 1000));
    sync();
  }

  function stop() {
    if (cars) { scene.remove(cars.group); cars.dispose(); cars = null; }
    runs = []; labels = []; rows = []; clock = null;
    $('repLabels').textContent = '';
    camera.clearViewOffset();
  }

  /** Buttons and list state that change on input (not every frame). */
  function sync() {
    if (!clock) return;
    for (const b of $('repSpeeds').children) b.classList.toggle('sel', +b.dataset.v === clock.speed);
    $('repNames').classList.toggle('sel', names);
    $('repNames').setAttribute('aria-pressed', String(names));
    $('repOverview').classList.toggle('sel', follow < 0);
    rows.forEach((b, i) => { b.classList.toggle('sel', i === follow); b.setAttribute('aria-pressed', String(i === follow)); });
  }

  function boundsOf(t) {
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity, y = 0;
    for (let i = 0; i < t.n; i++) {
      x0 = Math.min(x0, t.px[i]); x1 = Math.max(x1, t.px[i]); z0 = Math.min(z0, t.pz[i]); z1 = Math.max(z1, t.pz[i]); y += t.py[i];
    }
    return { x: (x0 + x1) / 2, y: y / t.n, z: (z0 + z1) / 2, w: x1 - x0 + 60, h: z1 - z0 + 60 };
  }

  /** The car's place on the road at clock time, or null once its lap is over. */
  function place(i) {
    const pose = runPose(runs[i], clock.t, _pose);
    if (!pose) return null;
    let loc = track.locate(pose.x, pose.z, hints[i], undefined, 30);
    if (Math.hypot(pose.x - track.px[loc.i], pose.z - track.pz[loc.i]) > RELOCATE_M) loc = track.locateGlobal(pose.x, pose.z);
    hints[i] = loc.i;
    const road = carPose(track, loc.s, _road);
    _car.x = pose.x; _car.y = road.y; _car.z = pose.z; _car.theta = pose.theta; _car.pitch = road.pitch;
    return _car;
  }

  /** Per frame while this screen is up. Moves the cars, camera and labels; fills `view` for the theme. */
  function update(dt, view) {
    if (!cars) return false;
    clock.advance(dt);
    const W = innerWidth, H = innerHeight, free = $('repStage').getBoundingClientRect();
    const fw = Math.max(80, free.width), fh = Math.max(80, free.height - LABEL_ROOM); // kept clear above the circuit for names
    // overview: fit the circuit into the part of the screen the panels leave free, turned whichever way fills it better
    const flat = Math.max(bounds.w / fw, bounds.h / fh), turned = Math.max(bounds.h / fw, bounds.w / fh);
    const metresPerPx = Math.min(flat, turned);
    const following = follow >= 0;
    const carScale = following ? 1 : Math.min(9, Math.max(1, (metresPerPx * CAR_PX) / REPLAY_CAR_LENGTH));
    let target = null;
    const poses = runs.map((_, i) => {
      const p = place(i);
      cars.set(i, p, carScale);
      if (p && i === follow) target = { ...p };
      return p && { x: p.x, y: p.y, z: p.z };
    });
    cars.commit();
    if (following) {
      if (target) { // a finished car leaves the camera where it was
        goal.set(target.x, target.y + 1, target.z);
        const k = snap ? 1 : 1 - Math.exp(-dt * 8);
        look.lerp(goal, k);
        v.set(target.x - Math.sin(target.theta) * 26, target.y + 18, target.z - Math.cos(target.theta) * 26);
        eye.lerp(v, k);
        snap = false;
      }
      camera.up.set(0, 1, 0);
      camera.fov = 45;
    } else {
      const dist = (metresPerPx * H) / (2 * Math.tan((FOV * Math.PI) / 360));
      look.set(bounds.x, bounds.y, bounds.z);
      eye.set(bounds.x, bounds.y + dist, bounds.z);
      camera.up.set(turned < flat ? 1 : 0, 0, turned < flat ? 0 : 1);
      camera.fov = FOV;
    }
    const dist = eye.distanceTo(look);
    camera.position.copy(eye); camera.lookAt(look);
    camera.near = following ? 0.5 : dist * 0.3; camera.far = 1500 + dist * 3;
    camera.setViewOffset(W, H, W / 2 - (free.left + fw / 2), H / 2 - (free.top + LABEL_ROOM + fh / 2), W, H); // also updates the projection
    camera.updateMatrixWorld();
    drawLabels(poses, W, H);
    drawStatus();
    Object.assign(view, { x: look.x, y: look.y, z: look.z, sx: look.x, sz: look.z, half: following ? 70 : 140, dist });
    return true;
  }

  function drawLabels(poses, W, H) {
    poses.forEach((p, i) => {
      const el = labels[i];
      let show = !!p && (names || i === follow);
      if (show) {
        v.set(p.x, p.y + 1.5, p.z).project(camera);
        show = v.z < 1 && Math.abs(v.x) < 1 && Math.abs(v.y) < 1;
        if (show) el.style.transform = `translate(${Math.round(((v.x + 1) * W) / 2)}px, ${Math.round(((1 - v.y) * H) / 2) - 8}px) translate(-50%, -100%)`;
      }
      el.hidden = !show;
    });
  }

  function drawStatus() {
    $('repTime').textContent = `${formatTime(clock.t)} / ${formatTime(clock.duration)}`;
    if (document.activeElement !== $('repScrub') || clock.playing) $('repScrub').value = String(Math.round(clock.t * 1000));
    const label = clock.playing ? 'PAUSE' : 'PLAY';
    if ($('repPlay').textContent !== label) $('repPlay').textContent = label;
    rows.forEach((b, i) => b.classList.toggle('done', clock.t >= runs[i].time));
  }

  function followCar(i) { follow = i === follow ? -1 : i; snap = true; sync(); }

  $('repGate').addEventListener('submit', (e) => { e.preventDefault(); const key = $('repKey').value; if (key) load(key); });
  $('repPlay').addEventListener('click', () => clock?.toggle());
  $('repRestart').addEventListener('click', () => { clock?.restart(); snap = true; });
  $('repScrub').addEventListener('input', (e) => { if (!clock) return; clock.playing = false; clock.seek(+e.target.value / 1000); snap = true; });
  $('repSpeeds').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b && clock && SPEEDS.includes(+b.dataset.v)) { clock.speed = +b.dataset.v; sync(); } });
  $('repNames').addEventListener('click', () => { names = !names; sync(); });
  $('repOverview').addEventListener('click', () => { follow = -1; sync(); });
  $('repList').addEventListener('click', (e) => { const b = e.target.closest('button[data-i]'); if (b) followCar(+b.dataset.i); });
  $('repForget').addEventListener('click', () => { forget(); session++; showGate('Key forgotten on this device.'); });
  for (const id of ['repBack', 'repGateBack']) $(id).addEventListener('click', () => onExit());
  addEventListener('keydown', (e) => {
    if ($('replay').classList.contains('hidden')) return;
    if (e.code === 'Escape') { e.preventDefault(); onExit(); }
    else if (e.code === 'Space' && clock && e.target.tagName !== 'INPUT') { e.preventDefault(); clock.toggle(); }
  });

  return {
    /** The screen is already shown by the caller. */
    open(id) {
      stop();
      dayId = id; session++;
      const map = dailyMap(id);
      for (const el of document.querySelectorAll('[data-rep-title]')) el.textContent = `${formatDay(id)}  ·  ${trackDef(map.trackId).name.toUpperCase()}  ·  ${twistLabel(map)}`;
      const key = saved();
      showGate();
      if (key) load(key);
    },
    close() { session++; stop(); },
    update,
    get state() { return { day: dayId, view: $('replay').dataset.view, t: clock?.t ?? 0, playing: !!clock?.playing, runs: runs.length, follow }; },
  };
}
