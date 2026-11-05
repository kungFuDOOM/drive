// Chunky low-poly open-wheel cars. Local frame: +z forward, +x left, +y up.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const colorOf = (hex) => new THREE.Color(hex);

function part(geo, x, y, z, color, rx = 0) {
  geo = geo.clone();
  if (rx) geo.rotateX(rx);
  geo.translate(x, y, z);
  const c = colorOf(color), n = geo.attributes.position.count, arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b; }
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return geo;
}
const box = (w, h, l) => new THREE.BoxGeometry(w, h, l);
const cyl = (rt, rb, h, seg = 6) => new THREE.CylinderGeometry(rt, rb, h, seg);

const bodyMat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
const wheelMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1e, flatShading: true });
const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
const markMat = new THREE.MeshBasicMaterial({ color: 0xffee33, fog: false });
const wheelGeo = {
  gp: cyl(0.38, 0.38, 0.5, 8).rotateZ(Math.PI / 2),
  speedway: cyl(0.42, 0.42, 0.55, 8).rotateZ(Math.PI / 2),
};
const shadowGeo = new THREE.PlaneGeometry(2.7, 6.2).rotateX(-Math.PI / 2);

function gpBody(c1, c2) {
  const dark = 0x15151a, g = [];
  g.push(part(box(0.9, 0.5, 2.6), 0, 0.55, -0.2, c1)); // tub
  g.push(part(cyl(0.12, 0.42, 2.0, 6), 0, 0.48, 2.0, c1, Math.PI / 2)); // nose cone
  g.push(part(box(2.1, 0.08, 0.7), 0, 0.2, 3.0, c2)); // front wing
  g.push(part(box(0.08, 0.3, 0.7), 1.05, 0.3, 3.0, c1));
  g.push(part(box(0.08, 0.3, 0.7), -1.05, 0.3, 3.0, c1));
  g.push(part(box(0.55, 0.38, 1.4), 0.78, 0.5, -0.2, c2)); // sidepods
  g.push(part(box(0.55, 0.38, 1.4), -0.78, 0.5, -0.2, c2));
  g.push(part(box(0.5, 0.5, 1.2), 0, 0.85, -1.0, c1)); // airbox
  g.push(part(box(0.5, 0.32, 0.5), 0, 0.88, 0.35, dark)); // cockpit
  g.push(part(new THREE.SphereGeometry(0.2, 5, 4), 0, 1.02, 0.35, 0xf4f4f4)); // helmet
  g.push(part(box(1.9, 0.08, 0.6), 0, 1.25, -2.15, c2)); // rear wing
  g.push(part(box(0.08, 0.75, 0.6), 0.95, 0.9, -2.15, c1));
  g.push(part(box(0.08, 0.75, 0.6), -0.95, 0.9, -2.15, c1));
  g.push(part(box(0.5, 0.35, 0.8), 0, 0.5, -1.9, dark)); // gearbox
  return g;
}
function speedwayBody(c1, c2) {
  const dark = 0x15151a, g = [];
  g.push(part(box(1.2, 0.55, 3.4), 0, 0.55, 0.1, c1)); // chunky tub
  g.push(part(box(0.9, 0.35, 1.4), 0, 0.42, 2.3, c1)); // short blunt nose
  g.push(part(box(2.4, 0.1, 0.55), 0, 0.22, 3.1, c2)); // front splitter
  g.push(part(box(0.75, 0.55, 2.4), 0.98, 0.52, -0.3, c2)); // wide offset sidepods
  g.push(part(box(0.75, 0.55, 2.4), -0.98, 0.52, -0.3, c2));
  g.push(part(box(0.7, 0.35, 0.7), 0, 0.98, 0.5, dark)); // open cockpit
  g.push(part(new THREE.SphereGeometry(0.22, 5, 4), 0, 1.15, 0.5, 0xf4f4f4));
  g.push(part(box(0.1, 0.7, 1.2), 0, 1.05, -1.5, c2)); // roll hoop fin
  g.push(part(box(0.1, 1.0, 1.0), 0, 1.15, -2.1, c1)); // tall tail fin
  g.push(part(box(2.3, 0.1, 0.5), 0, 1.45, -2.2, c2)); // spoiler
  g.push(part(box(0.5, 0.4, 0.9), 0, 0.6, -1.9, dark));
  return g;
}

/** Returns { group, wheels[], mark } */
const ghostMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.38, depthWrite: false });

const ghostWheelMat = new THREE.MeshBasicMaterial({ color: 0x334455, transparent: true, opacity: 0.38, depthWrite: false });

export function makeCar(cls, team, isPlayer = false, ghost = false) {
  const geos = cls === 'speedway' ? speedwayBody(team.c1, team.c2) : gpBody(team.c1, team.c2);
  const body = new THREE.Mesh(mergeGeometries(geos), ghost ? ghostMat : bodyMat);
  body.castShadow = !ghost; body.receiveShadow = !ghost;
  const group = new THREE.Group();
  const pivot = new THREE.Group(); // pitched with slope
  pivot.add(body);
  const wheels = [];
  const wx = cls === 'speedway' ? 1.0 : 0.95, wf = cls === 'speedway' ? 1.7 : 1.9, wr = cls === 'speedway' ? -1.5 : -1.65;
  for (const [x, z] of [[wx, wf], [-wx, wf], [wx + 0.1, wr], [-wx - 0.1, wr]]) {
    const w = new THREE.Mesh(wheelGeo[cls] || wheelGeo.gp, ghost ? ghostWheelMat : wheelMat);
    w.position.set(x, cls === 'speedway' ? 0.42 : 0.38, z);
    w.castShadow = !ghost;
    pivot.add(w); wheels.push(w);
  }
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.position.y = 0.06;
  if (!ghost) group.add(shadow);
  group.add(pivot);
  let mark = null;
  if (isPlayer) {
    mark = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2.8, 4).rotateX(Math.PI), markMat);
    mark.position.y = 5; mark.visible = false;
    group.add(mark);
  }
  return { group, pivot, wheels, mark };
}
