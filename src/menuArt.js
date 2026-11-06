// Menu track cards: theme tags, lap length and a pixel minimap outline.
// Pure data plus a canvas draw. Gameplay tracks are unchanged.
import * as THREE from 'three';

/** Theme id -> short tag shown on the track card. Colours are original UI ink, not a copied livery. */
export const THEME_TAGS = {
  circuitDay: { id: 'day', label: 'DAY', road: '#c8c2b2', ink: '#ffe14a' },
  alpine: { id: 'snow', label: 'SNOW', road: '#e7f3ff', ink: '#2a5f93' },
  forest: { id: 'rain', label: 'RAIN', road: '#7ea88a', ink: '#e7ffe8' },
  desertNight: { id: 'desert-night', label: 'DESERT NIGHT', road: '#e0b15a', ink: '#1a1208' },
  neonStreet: { id: 'neon', label: 'NEON', road: '#ff5ad4', ink: '#7af6ff' },
  coastal: { id: 'coast', label: 'COAST', road: '#ecd7a4', ink: '#1d6a78' },
};

export function themeTag(themeId) {
  return THEME_TAGS[themeId] || THEME_TAGS.circuitDay;
}

/** Closed centripetal samples: [x, y, z] in metres. */
export function sampleCircuit(points, n = 160) {
  const curve = new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(p[0], p[1], p[2])),
    true, 'centripetal',
  );
  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    const p = curve.getPoint(i / n);
    out[i] = [p.x, p.y, p.z];
  }
  return out;
}

/** Horizontal length of a closed sample loop, in metres. */
export function circuitLength(samples) {
  let len = 0;
  for (let i = 0; i < samples.length; i++) {
    const a = samples[i], b = samples[(i + 1) % samples.length];
    len += Math.hypot(b[0] - a[0], b[2] - a[2]);
  }
  return len;
}

export function formatLength(metres) {
  if (!isFinite(metres)) return '-- km';
  return (metres / 1000).toFixed(2) + ' km';
}

/** Pixel positions for a minimap. North (+z) is up. */
export function thumbPixels(samples, w, h, pad = 8) {
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  for (const p of samples) {
    const x = p[0], z = p[2];
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (z < z0) z0 = z;
    if (z > z1) z1 = z;
  }
  const dw = Math.max(1, x1 - x0), dh = Math.max(1, z1 - z0);
  const sc = Math.min((w - pad * 2) / dw, (h - pad * 2) / dh);
  const ox = (w - dw * sc) / 2, oz = (h - dh * sc) / 2;
  return samples.map((p) => ({
    x: ox + (p[0] - x0) * sc,
    y: h - (oz + (p[2] - z0) * sc),
  }));
}

const cardCache = new Map();
/** { id, name, samples, length, tag } cached per circuit id. */
export function circuitCard(def) {
  let card = cardCache.get(def.id);
  if (card) return card;
  const samples = sampleCircuit(def.points, 160);
  card = { id: def.id, name: def.name, samples, length: circuitLength(samples), tag: themeTag(def.theme) };
  cardCache.set(def.id, card);
  return card;
}

function strokeLoop(g, pts, color, width) {
  g.beginPath();
  for (let i = 0; i < pts.length; i++) {
    const x = pts[i].x | 0, y = pts[i].y | 0;
    if (i) g.lineTo(x, y);
    else g.moveTo(x, y);
  }
  g.closePath();
  g.strokeStyle = color;
  g.lineWidth = width;
  g.lineJoin = 'miter';
  g.lineCap = 'square';
  g.stroke();
}

/** Crisp pixel outline of a circuit into a canvas (no-op without a 2d context). */
export function drawThumb(canvas, samples, tag) {
  const g = canvas?.getContext?.('2d');
  if (!g) return;
  const w = canvas.width, h = canvas.height;
  g.imageSmoothingEnabled = false;
  g.fillStyle = '#070b10';
  g.fillRect(0, 0, w, h);
  const pts = thumbPixels(samples, w, h, 12);
  strokeLoop(g, pts, '#000', 12);
  strokeLoop(g, pts, tag?.road || '#8fa3b8', 7);
  strokeLoop(g, pts, tag?.ink || '#ffe14a', 2);
  const a = pts[0], b = pts[Math.min(pts.length - 1, 4)];
  g.fillStyle = '#fff';
  g.fillRect((a.x | 0) - 5, (a.y | 0) - 2, 10, 4);
  g.fillStyle = tag?.ink || '#ffe14a';
  g.fillRect((b.x | 0) - 2, (b.y | 0) - 2, 4, 4);
}
