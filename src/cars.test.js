import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { makeCar, bodyGeometry, wheelGeometry, animateCar, writeWheels, carNumber, liveryOf, LIVERIES, WHEEL_R, WHEEL_POS, MAX_VISUAL_SPIN, rimColor, spokeSafeStep, SPOKE_PITCH, SPOKE_F_MAX } from './cars.js';
import { AXLE_F, AXLE_R } from './pose.js';
import { TEAMS } from './teams.js';

const st = (o = {}) => ({ v: 0, steer: 0, longAcc: 0, latAcc: 0, surface: 'asphalt', lockup: 0, flat: 0, brake: 0, rain: 0, roll: 0, pitch: 0, s: 0, lift: 0, ...o });
const run = (car, secs, hz, state) => { const dt = 1 / hz; for (let t = 0; t < secs - 1e-9; t += dt) animateCar(car, typeof state === 'function' ? state(t) : state, dt); };

describe('car geometry (Node, no WebGL)', () => {
  for (const cls of ['gp', 'speedway']) {
    it(`${cls}: one merged body per team, finite, sized like the physics car, sits on the road`, () => {
      for (let i = 0; i < TEAMS.length; i++) {
        const g = bodyGeometry(cls, TEAMS[i], i);
        g.computeBoundingBox();
        const b = g.boundingBox, pos = g.attributes.position.array;
        expect(pos.every(Number.isFinite)).toBe(true);
        expect(g.attributes.normal.array.every(Number.isFinite)).toBe(true);
        expect(g.attributes.color.count).toBe(g.attributes.position.count);
        expect(g.index).toBeNull(); // flat-shaded merged triangle soup
        expect(pos.length / 9).toBeLessThan(1400); // triangle budget per body: ~20 cars stay cheap on a phone
        expect(b.min.y).toBeGreaterThan(0.04);     // clears the road (no z-fighting with the shadow)
        expect(b.max.y).toBeLessThan(cls === 'gp' ? 1.6 : 1.9);
        expect(b.max.x).toBeLessThan(cls === 'gp' ? 1.2 : 1.4);
        expect(b.min.x).toBeGreaterThan(cls === 'gp' ? -1.2 : -1.4);
        expect(b.max.z).toBeGreaterThan(3.2);      // long nose + wing
        expect(b.min.z).toBeLessThan(-2.5);        // rear wing
        expect(b.max.z - b.min.z).toBeLessThan(7); // fits the 6.4 m shadow blob + collision length
      }
    });
    it(`${cls}: 4 draw calls per car (body, instanced wheels, lamps, shadow), shared material`, () => {
      const a = makeCar(cls, TEAMS[0], true, false, 0), b = makeCar(cls, TEAMS[1], false, false, 1);
      const meshes = [];
      a.group.traverse((o) => { if (o.isMesh && o !== a.mark) meshes.push(o); });
      expect(meshes.length).toBe(4);
      expect(a.body.material).toBe(b.body.material);        // one shared body material
      expect(a.wheelMesh.material).toBe(b.wheelMesh.material); // wheels share one (non clear-coated) material across cars
      expect(a.wheelMesh.isInstancedMesh && a.wheelMesh.count).toBe(4);
      expect(a.mark).toBeTruthy(); expect(b.mark).toBeNull(); // overhead player marker kept
      expect(bodyGeometry(cls, TEAMS[0], 0)).toBe(a.body.geometry); // cached
    });
  }
  it('wheels sit at the pose axles with the true radius and touch the road', () => {
    expect(WHEEL_POS.gp[0][1]).toBe(AXLE_F); expect(WHEEL_POS.gp[2][1]).toBe(AXLE_R);
    for (const cls of ['gp', 'speedway']) {
      const g = wheelGeometry(cls, TEAMS[0], 'dry'); g.computeBoundingBox();
      expect(g.boundingBox.max.y).toBeCloseTo(WHEEL_R[cls], 2);
      expect(g.boundingBox.min.y).toBeCloseTo(-WHEEL_R[cls], 2);
      const car = makeCar(cls, TEAMS[0], false, false, 0);
      const m = new THREE.Matrix4(); car.wheelMesh.getMatrixAt(0, m);
      expect(new THREE.Vector3().setFromMatrixPosition(m).y).toBeCloseTo(WHEEL_R[cls], 5);
    }
    expect(wheelGeometry('gp', TEAMS[0], 'dry')).toBe(wheelGeometry('gp', TEAMS[0], 'dry'));
    expect(wheelGeometry('gp', TEAMS[0], 'wet')).not.toBe(wheelGeometry('gp', TEAMS[0], 'dry'));
  });
  it('sidewall rings contrast with the tyre and the rim is colourful', () => {
    const g = wheelGeometry('gp', TEAMS[0], 'dry'), col = g.attributes.color.array;
    let bright = 0, dark = 0;
    for (let i = 0; i < col.length; i += 3) { const l = (col[i] + col[i + 1] + col[i + 2]) / 3; if (l > 0.6) bright++; else if (l < 0.2) dark++; }
    expect(bright).toBeGreaterThan(30); expect(dark).toBeGreaterThan(200);
    expect(rimColor(TEAMS[3])).toBe(TEAMS[3].c1); // dark second colour -> use the bright livery colour
    for (const t of TEAMS) { const c = new THREE.Color(rimColor(t)); expect(c.r + c.g + c.b).toBeGreaterThan(0.8); }
  });
});

describe('livery and race numbers', () => {
  it('every team has its own number (player team = 1) and a livery style', () => {
    const nums = TEAMS.map((_, i) => carNumber(i));
    expect(new Set(nums).size).toBe(TEAMS.length);
    expect(nums[0]).toBe(1);
    expect(nums.every((n) => n >= 1 && n <= 99)).toBe(true);
    expect(liveryOf(0)).toBe('chevron');
    expect(new Set(TEAMS.map((_, i) => liveryOf(i))).size).toBe(LIVERIES.length);
  });
  it('different teams give different geometry; numbers are real geometry on nose and engine cover (no canvas/DOM)', () => {
    const a = bodyGeometry('gp', TEAMS[0], 0), b = bodyGeometry('gp', TEAMS[7], 7);
    expect(a.attributes.position.count).not.toBe(b.attributes.position.count);
    // the number pad (near-white flat quads on top of the nose / cover) exists: look for light-grey vertices at nose and cover z
    const pos = a.attributes.position.array, col = a.attributes.color.array;
    const pad = (zLo, zHi) => { let n = 0; for (let i = 0; i < pos.length / 3; i++) if (pos[i * 3 + 2] > zLo && pos[i * 3 + 2] < zHi && Math.abs(pos[i * 3]) < 0.4 && col[i * 3] > 0.8 && col[i * 3 + 1] > 0.8 && col[i * 3 + 2] > 0.8 && pos[i * 3 + 1] > 0.4) n++; return n; };
    expect(pad(1.2, 1.7)).toBeGreaterThanOrEqual(6);    // nose
    expect(pad(-1.55, -1.1)).toBeGreaterThanOrEqual(6); // engine cover
  });
  it('GP has a halo, Speedway an aeroscreen (distinct silhouettes), both with helmet + visor', () => {
    const gp = bodyGeometry('gp', TEAMS[0], 0), sw = bodyGeometry('speedway', TEAMS[0], 0);
    const glass = (g) => { let n = 0; const c = g.attributes.color.array; for (let i = 0; i < c.length; i += 3) if (c[i + 2] > c[i] + 0.15 && c[i + 2] > 0.25 && c[i + 1] > 0.12 && c[i] < 0.4) n++; return n; };
    expect(glass(sw)).toBeGreaterThan(glass(gp));
  });
});

describe('animation API', () => {
  it('front wheels steer (both together), rear wheels do not; steering is bounded', () => {
    const car = makeCar('gp', TEAMS[0], false, false, 0);
    expect(car.frontPivots.length).toBe(2);
    expect(car.frontPivots.every((w) => w.front)).toBe(true);
    run(car, 0.5, 60, st({ v: 30, steer: 1 }));
    expect(car.frontPivots[0].steer).toBeGreaterThan(0.2);
    expect(car.frontPivots[0].steer).toBe(car.frontPivots[1].steer);
    expect(car.frontPivots[0].steer).toBeLessThan(0.5);
    expect(car.wheels[2].steer).toBe(0); expect(car.wheels[3].steer).toBe(0);
    run(car, 0.6, 60, st({ v: 30, steer: -1 }));
    expect(car.frontPivots[0].steer).toBeLessThan(-0.2);
  });
  it('wheel angle follows v / radius exactly while the spoke step is below the strobe limit, independent of the frame rate', () => {
    for (const [hz, v] of [[30, 5], [60, 10], [120, 10], [120, 20]]) {
      const car = makeCar('gp', TEAMS[0], false, false, 0);
      run(car, 1, hz, st({ v }));
      expect(car.wheels[0].spin).toBeCloseTo(v / WHEEL_R.gp, 3);
    }
    const sw = makeCar('speedway', TEAMS[0], false, false, 0);
    run(sw, 1, 60, st({ v: 10 })); expect(sw.wheels[0].spin).toBeCloseTo(10 / WHEEL_R.speedway, 3);
  });
  it('anti-strobe: spokes always read as turning forward (aliased step in (0, pitch/2)), markers keep ~ the true rate, sign kept in reverse', () => {
    const alias = (d) => { const m = ((d % SPOKE_PITCH) + SPOKE_PITCH) % SPOKE_PITCH; return m > SPOKE_PITCH / 2 ? m - SPOKE_PITCH : m; };
    expect(MAX_VISUAL_SPIN / 60).toBeCloseTo(SPOKE_F_MAX, 9);
    expect(SPOKE_F_MAX).toBeLessThan(SPOKE_PITCH / 2); // strictly below the Nyquist limit of the 5-fold pattern
    // the old fixed 62 rad/s cap at 60 Hz aliased backwards: this is what the test now guards against
    expect(alias(62 / 60)).toBeLessThan(0);
    for (let d = 0.001; d < 4.5; d += 0.0137) {
      const out = spokeSafeStep(d);
      expect(alias(out)).toBeGreaterThan(0); expect(alias(out)).toBeLessThan(SPOKE_PITCH / 2);
      expect(Math.abs(out - d)).toBeLessThan(SPOKE_PITCH); // white spoke / flat patch move within one pitch per frame of the truth
      if (d <= SPOKE_F_MAX) expect(out).toBe(d);
      expect(spokeSafeStep(-d)).toBe(-out);
    }
    expect(spokeSafeStep(0)).toBe(0);
    // 30 m/s on the 0.38 m GP tyre at 60 and 120 Hz: every frame's displayed step reads forward
    for (const hz of [60, 120]) {
      const car = makeCar('gp', TEAMS[0], false, false, 0);
      let prev = car.wheels[0].spin;
      for (let k = 0; k < hz; k++) { animateCar(car, st({ v: 30 }), 1 / hz); const d = car.wheels[0].spin - prev; prev = car.wheels[0].spin; expect(alias(d)).toBeGreaterThan(0); }
      expect(car.wheels[0].spin / (30 / WHEEL_R.gp)).toBeGreaterThan(0.75); // overall rate close to v / R
    }
    const r = makeCar('gp', TEAMS[0], false, false, 0); run(r, 1, 60, st({ v: -5 })); expect(r.wheels[0].spin).toBeLessThan(0);
  });
  it('a locked tyre almost stops turning', () => {
    const a = makeCar('gp', TEAMS[0], false, false, 0), b = makeCar('gp', TEAMS[0], false, false, 0);
    run(a, 0.5, 60, st({ v: 40 })); run(b, 0.5, 60, st({ v: 40, lockup: 1 }));
    expect(b.wheels[0].spin).toBeLessThan(a.wheels[0].spin * 0.25);
  });
  it('braking dives the nose, throttle squats it; right-hand corner rolls to the outside; all low-passed', () => {
    const car = makeCar('gp', TEAMS[0], false, false, 0);
    animateCar(car, st({ v: 60, longAcc: -45 }), 1 / 60);
    expect(Math.abs(car.pivot.rotation.x)).toBeLessThan(0.02); // not instant
    run(car, 1, 60, st({ v: 60, longAcc: -45 }));
    expect(car.pivot.rotation.x).toBeGreaterThan(0.02); // + = nose down
    run(car, 1, 60, st({ v: 60, longAcc: 20 }));
    expect(car.pivot.rotation.x).toBeLessThan(0);
    run(car, 1, 60, st({ v: 60, steer: 0.6, latAcc: 35 }));
    expect(car.pivot.rotation.z).toBeLessThan(-0.03);
    run(car, 1, 60, st({ v: 60, steer: -0.6, latAcc: 35 }));
    expect(car.pivot.rotation.z).toBeGreaterThan(0.03);
    expect(Math.abs(car.pivot.rotation.z)).toBeLessThan(0.1);
  });
  it('kerb rumble bobs the chassis a little and settles; the pit jack lift is passed through', () => {
    const car = makeCar('gp', TEAMS[0], false, false, 0);
    let maxBob = 0;
    for (let k = 0; k < 120; k++) { animateCar(car, st({ v: 50, surface: 'kerb', s: k * 0.8 }), 1 / 60); maxBob = Math.max(maxBob, Math.abs(car.pivot.position.y)); }
    expect(maxBob).toBeGreaterThan(0.005); expect(maxBob).toBeLessThan(0.09);
    run(car, 2, 60, st({ v: 50 }));
    expect(Math.abs(car.pivot.position.y)).toBeLessThan(0.01);
    animateCar(car, st({ lift: 0.45 }), 1 / 60); expect(car.pivot.position.y).toBeGreaterThan(0.44);
  });
  it('is deterministic', () => {
    const f = () => { const c = makeCar('gp', TEAMS[0], false, false, 0); run(c, 2, 60, (t) => st({ v: 40 + 10 * Math.sin(t), steer: Math.sin(t * 2), latAcc: 20, longAcc: -10 * Math.cos(t), surface: t > 1 ? 'kerb' : 'asphalt', s: t * 40, flat: 0.3, lockup: t > 1.5 ? 0.5 : 0 })); return [c.pivot.rotation.x, c.pivot.rotation.z, c.pivot.position.y, c.wheels[0].spin, c.wheels[0].bump].join(); };
    expect(f()).toBe(f());
  });
  it('flat spot knocks the front tyres once per turn, only when flat', () => {
    const car = makeCar('gp', TEAMS[0], false, false, 0);
    let mx = 0; for (let k = 0; k < 120; k++) { animateCar(car, st({ v: 40, flat: 0.8 }), 1 / 60); mx = Math.max(mx, car.wheels[0].bump); }
    expect(mx).toBeGreaterThan(0.005); expect(mx).toBeLessThan(0.04);
    expect(car.wheels[2].bump).toBe(0);
    for (let k = 0; k < 10; k++) animateCar(car, st({ v: 40, flat: 0 }), 1 / 60);
    expect(car.wheels[0].bump).toBe(0);
  });
  it('brake light follows the pedal; the rain light flashes only in the wet', () => {
    const car = makeCar('gp', TEAMS[0], false, false, 0), col = car.lamps.geometry.attributes.color.array;
    animateCar(car, st({ v: 50, brake: 1 }), 1 / 60);
    expect(car.brakeLight.on).toBe(true);
    const redOn = col[0];
    animateCar(car, st({ v: 50, brake: 0 }), 1 / 60);
    expect(car.brakeLight.on).toBe(false); expect(col[0]).toBeLessThan(redOn - 0.3);
    run(car, 1, 60, st({ v: 50, rain: 0 })); expect(car.rainLight.on).toBe(false);
    const seen = new Set();
    for (let k = 0; k < 60; k++) { animateCar(car, st({ v: 50, rain: 0.8 }), 1 / 60); seen.add(car.rainLight.intensity > 0.5); }
    expect(car.rainLight.on).toBe(true); expect(seen.size).toBe(2); // flashes
  });
  it('pit crew can hide the tyres (instance scaled to zero) and show them again', () => {
    const car = makeCar('gp', TEAMS[0], false, false, 0), m = new THREE.Matrix4();
    car.wheels.forEach((w) => { w.visible = false; }); writeWheels(car);
    car.wheelMesh.getMatrixAt(1, m); expect(m.elements[0]).toBe(0);
    car.wheels.forEach((w) => { w.visible = true; }); writeWheels(car);
    car.wheelMesh.getMatrixAt(1, m); expect(Math.abs(m.elements[0])).toBeGreaterThan(0.5);
  });
  it('compound swap changes the tyre geometry only when needed', () => {
    const car = makeCar('gp', TEAMS[0], false, false, 0), g0 = car.wheelMesh.geometry;
    car.setTire('dry'); expect(car.wheelMesh.geometry).toBe(g0);
    car.setTire('wet'); expect(car.wheelMesh.geometry).toBe(wheelGeometry('gp', TEAMS[0], 'wet'));
  });
  it('ghost car: translucent shared material, no lamps / shadow, animates without lamps', () => {
    const g = makeCar('gp', TEAMS[0], false, true, 0);
    expect(g.lamps).toBeNull(); expect(g.shadow.parent).toBeNull();
    expect(g.body.material.transparent).toBe(true);
    expect(() => animateCar(g, st({ v: 20, brake: 1 }), 1 / 60)).not.toThrow();
  });
  it('animating 20 cars for a frame is cheap (no per-frame garbage: typed-array writes only)', () => {
    const cars = Array.from({ length: 20 }, (_, i) => makeCar('gp', TEAMS[i % 10], false, false, i % 10));
    const s = st({ v: 60, steer: 0.3, latAcc: 20, longAcc: -10, brake: 1 });
    const t0 = performance.now();
    for (let k = 0; k < 200; k++) for (const c of cars) animateCar(c, s, 1 / 60);
    expect((performance.now() - t0) / 200).toBeLessThan(2); // ms for 20 cars
  });
});

// ---------------------------------------------------------------- wheel orientation (instanced, both sides) + body winding
const triNormal = (p, i, m) => {
  const a = new THREE.Vector3(p[i], p[i + 1], p[i + 2]), b = new THREE.Vector3(p[i + 3], p[i + 4], p[i + 5]), c = new THREE.Vector3(p[i + 6], p[i + 7], p[i + 8]);
  if (m) { a.applyMatrix4(m); b.applyMatrix4(m); c.applyMatrix4(m); }
  return { n: b.clone().sub(a).cross(c.clone().sub(a)).normalize(), c: a.add(b).add(c).divideScalar(3) };
};

describe('instanced wheels: both sides, steer, spin axis', () => {
  for (const cls of ['gp', 'speedway']) {
    it(`${cls}: every instance is a proper rotation; outer faces (spokes, hub, lettering, compound ring) face outward on BOTH sides`, () => {
      const car = makeCar(cls, TEAMS[1], false, false, 1), m = new THREE.Matrix4();
      for (const [steer, spin] of [[0, 0], [0.3, 1.1], [-0.3, 4.2]]) {
        car.wheels.forEach((w) => { w.steer = w.front ? steer : 0; w.spin = spin; }); writeWheels(car);
        const p = car.wheelMesh.geometry.attributes.position.array, col = car.wheelMesh.geometry.attributes.color.array;
        for (const w of car.wheels) {
          car.wheelMesh.getMatrixAt(w.i, m);
          expect(m.determinant()).toBeGreaterThan(0.99); // no mirroring: FrontSide culling keeps the built winding
          const out = new THREE.Vector3(Math.sign(w.x), 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), -w.steer); // outward axle direction
          let outerOut = 0, bright = 0;
          for (let i = 0; i < p.length; i += 9) {
            const g = triNormal(p, i), t = triNormal(p, i, m);
            if (Math.abs(g.n.x) < 0.9) continue;
            // geometry: outside = +x. After instancing, a face looking along +x must look along the outward axle, and vice versa
            expect(Math.sign(t.n.dot(out))).toBe(Math.sign(g.n.x));
            if (g.c.x > 0.25 && g.n.x > 0) { outerOut++; if (col[i] + col[i + 1] + col[i + 2] > 1.5 && t.n.dot(out) > 0.9) bright++; }
          }
          expect(outerOut).toBeGreaterThan(80);  // sidewall, compound ring, rim face, spokes, hub, lettering
          expect(bright).toBeGreaterThan(10);    // white spoke / lettering / hub visible from the outside
        }
      }
    });
  }
  it('steer > 0 (right) turns BOTH front wheels toward car-local -x (no countersteer); rears stay straight', () => {
    const car = makeCar('gp', TEAMS[0], false, false, 0), m = new THREE.Matrix4(), fwd = new THREE.Vector3();
    run(car, 0.5, 60, st({ v: 20, steer: 1 }));
    for (const w of car.wheels) {
      car.wheelMesh.getMatrixAt(w.i, m);
      fwd.set(0, 0, w.left ? 1 : -1).transformDirection(m.clone().multiply(new THREE.Matrix4().makeRotationX(w.left ? -w.spin : w.spin))); // undo spin
      if (w.front) expect(fwd.x).toBeLessThan(-0.15); else expect(Math.abs(fwd.x)).toBeLessThan(1e-9);
    }
    run(car, 0.6, 60, st({ v: 20, steer: -1 }));
    car.wheelMesh.getMatrixAt(0, m); const axle = new THREE.Vector3(1, 0, 0).transformDirection(m);
    expect(axle.z).toBeLessThan(-0.15); // left-front axle swings back when steering left = wheel nose toward +x
  });
  it('spin turns each tyre about its own cylinder axis, and both sides roll forward (tyre top moves to +z)', () => {
    const car = makeCar('gp', TEAMS[0], false, false, 0), m0 = new THREE.Matrix4(), m1 = new THREE.Matrix4();
    for (const steer of [0, 0.35]) {
      car.wheels.forEach((w) => { w.steer = w.front ? steer : 0; w.spin = 0.7; }); writeWheels(car);
      const A = car.wheels.map((w) => { car.wheelMesh.getMatrixAt(w.i, m0); return m0.clone(); });
      car.wheels.forEach((w) => { w.spin = 0.75; }); writeWheels(car);
      for (const w of car.wheels) {
        car.wheelMesh.getMatrixAt(w.i, m1);
        const ax0 = new THREE.Vector3(1, 0, 0).transformDirection(A[w.i]), ax1 = new THREE.Vector3(1, 0, 0).transformDirection(m1);
        expect(ax0.distanceTo(ax1)).toBeLessThan(1e-9); // spin axis = geometry cylinder axis, unchanged by spin
        expect(Math.abs(ax0.y)).toBeLessThan(1e-9);
        // the material point on top of the tyre (car space) must move along the wheel's heading as spin grows
        const local = new THREE.Vector3(w.x, 2 * WHEEL_R.gp, w.z).applyMatrix4(A[w.i].clone().invert());
        const moved = local.clone().applyMatrix4(m1).sub(local.clone().applyMatrix4(A[w.i]));
        expect(moved.dot(new THREE.Vector3(-Math.sin(w.steer), 0, Math.cos(w.steer)))).toBeGreaterThan(0.01);
      }
    }
  });
  it('flat spot knocks when the drawn flat patch is at the road, on both front wheels', () => {
    const car = makeCar('gp', TEAMS[0], false, false, 0), m = new THREE.Matrix4();
    const best = [{ b: -1, y: 0 }, { b: -1, y: 0 }];
    for (let k = 0; k < 600; k++) {
      animateCar(car, st({ v: 8, flat: 1 }), 1 / 120);
      for (const i of [0, 1]) {
        const w = car.wheels[i];
        if (w.bump > best[i].b) { car.wheelMesh.getMatrixAt(i, m); best[i] = { b: w.bump, y: new THREE.Vector3(0, WHEEL_R.gp * Math.cos(Math.PI / 10), WHEEL_R.gp * Math.sin(Math.PI / 10)).applyMatrix4(m).y - w.bump }; }
      }
    }
    for (const i of [0, 1]) { expect(best[i].b).toBeGreaterThan(0.005); expect(best[i].y).toBeLessThan(0.05 * WHEEL_R.gp); }
  });
  it('no NaN / Infinity in any wheel matrix or pivot under odd inputs', () => {
    const car = makeCar('speedway', TEAMS[2], false, false, 2), m = new THREE.Matrix4();
    for (const [s, dt] of [[st({ v: 500, flat: 1, lockup: 1 }), 1 / 30], [st({ v: -9, steer: -1 }), 0], [{ v: 30 }, 0.1], [st({ v: 0, flat: 1 }), 1 / 120], [st({ v: 97, steer: 1, latAcc: 40 }), 0.25]]) {
      for (let k = 0; k < 50; k++) animateCar(car, s, dt);
      for (let i = 0; i < 4; i++) { car.wheelMesh.getMatrixAt(i, m); expect(m.elements.every(Number.isFinite)).toBe(true); }
      expect([car.pivot.rotation.x, car.pivot.rotation.z, car.pivot.position.y, car.shadow.rotation.x].every(Number.isFinite)).toBe(true);
    }
  });
  it('wheel instances have finite bounds that contain every wheel (frustum culling stays on)', () => {
    for (const cls of ['gp', 'speedway']) {
      const car = makeCar(cls, TEAMS[0], false, false, 0), m = new THREE.Matrix4();
      car.wheels.forEach((w) => { w.steer = w.front ? 0.45 : 0; w.bump = 0.03; }); writeWheels(car);
      expect(car.wheelMesh.frustumCulled).toBe(true);
      const g = car.wheelMesh.geometry, p = g.attributes.position.array, sph = car.wheelMesh.boundingSphere, v = new THREE.Vector3();
      for (let i = 0; i < 4; i++) { car.wheelMesh.getMatrixAt(i, m); for (let j = 0; j < p.length; j += 3) expect(sph.containsPoint(v.set(p[j], p[j + 1], p[j + 2]).applyMatrix4(m))).toBe(true); }
      expect(car.wheelMesh.count).toBe(4);
    }
  });
});

describe('contact shadow', () => {
  it('stays on the road plane: follows road pitch / roll, ignores chassis dive, bob and the pit-jack lift', () => {
    const car = makeCar('gp', TEAMS[0], false, false, 0);
    expect(car.shadow.parent).toBe(car.group); // not under the pivot
    run(car, 1, 60, st({ v: 50, longAcc: -45, surface: 'kerb', s: 10, lift: 0.45, pitch: 0.05, roll: -0.03 }));
    expect(car.pivot.position.y).toBeGreaterThan(0.4);
    expect(car.shadow.position.y).toBe(0.06);
    expect(car.shadow.rotation.x).toBeCloseTo(-0.05, 9); expect(car.shadow.rotation.z).toBeCloseTo(-0.03, 9);
    expect(Math.abs(car.pivot.rotation.x - car.shadow.rotation.x)).toBeGreaterThan(0.02); // chassis dive is not copied
  });
});

describe('body winding, mirroring, decals', () => {
  it('helmet sphere faces point outward (centroid normal . outward > 0)', () => {
    for (const [cls, c] of [['gp', [0, 0.95, 0.08]], ['speedway', [0, 1.0, 0.4]]]) {
      const p = bodyGeometry(cls, TEAMS[0], 0).attributes.position.array, ctr = new THREE.Vector3(...c), r = cls === 'gp' ? 0.19 : 0.21;
      let n = 0;
      for (let i = 0; i < p.length; i += 9) {
        const t = triNormal(p, i), d = t.c.distanceTo(ctr), dd = [0, 3, 6].map((k) => new THREE.Vector3(p[i + k], p[i + k + 1], p[i + k + 2]).distanceTo(ctr));
        if (dd.every((x) => Math.abs(x - r) < 1e-4) && d > 0.1) { n++; expect(t.n.dot(t.c.clone().sub(ctr))).toBeGreaterThan(0); }
      }
      expect(n).toBeGreaterThan(30);
    }
  });
  it('mirrored halves keep outward winding: every mirror-image triangle pair has mirror-image normals', () => {
    for (const cls of ['gp', 'speedway']) {
      const p = bodyGeometry(cls, TEAMS[5], 5).attributes.position.array, key = (xs) => xs.map((q) => q.map((v) => v.toFixed(4)).join(',')).sort().join('|');
      const verts = (i, sx) => [0, 3, 6].map((k) => [sx * p[i + k], p[i + k + 1], p[i + k + 2]]);
      const right = new Map();
      for (let i = 0; i < p.length; i += 9) if (triNormal(p, i).c.x < -0.05) right.set(key(verts(i, -1)), i);
      let pairs = 0;
      for (let i = 0; i < p.length; i += 9) {
        const t = triNormal(p, i); if (t.c.x < 0.05) continue;
        const j = right.get(key(verts(i, 1))); if (j === undefined) continue;
        const u = triNormal(p, j); pairs++;
        expect(u.n.x).toBeCloseTo(-t.n.x, 4); expect(u.n.y).toBeCloseTo(t.n.y, 4); expect(u.n.z).toBeCloseTo(t.n.z, 4);
      }
      expect(pairs).toBeGreaterThan(100); // sidepods, endplates, wishbones, decals...
    }
  });
  it('race number reads correctly from behind (glyph "1" flag on the car\'s left = +x) and faces up', () => {
    const g = bodyGeometry('gp', TEAMS[0], 0), p = g.attributes.position.array, col = g.attributes.color.array, D = new THREE.Color(0x15151a);
    let flagLeft = 0, right = 0, up = 0;
    for (let i = 0; i < p.length; i += 9) {
      if (Math.abs(col[i] - D.r) > 1e-6 || Math.abs(col[i + 1] - D.g) > 1e-6 || Math.abs(col[i + 2] - D.b) > 1e-6) continue;
      const t = triNormal(p, i); if (t.c.z < 1.2 || t.c.z > 1.7) continue; // nose number: z0 = 1.3, cell 0.06
      if (t.n.y > 0.9) up++;
      if (t.c.z > 1.48 && t.c.z < 1.54) { if (t.c.x > 0.03) flagLeft++; if (t.c.x < -0.03) right++; }
    }
    expect(up).toBeGreaterThan(10); expect(flagLeft).toBeGreaterThan(0); expect(right).toBe(0);
  });
});
