// A daily lap's path as a short ASCII string: the 10 Hz ghost samples, quantized, delta encoded. Pure logic.
//
// 'p1:' + base64 of unsigned varints:  hz*1000, lap time in ms, sample count,
// then per sample zigzag deltas of x (0.1 m), z (0.1 m) and heading (0.01 rad). The first sample is a delta from 0.
// Most deltas fit one or two bytes. A path that would still be too long keeps every 2nd (3rd, ...) sample.

export const PATH_VERSION = 'p1:';
export const MAX_PATH_CHARS = 60000; // the server's limit
const POS_STEP = 10, ANGLE_STEP = 100, HZ_STEP = 1000;
const MAX_SAMPLES = MAX_PATH_CHARS; // far above what MAX_PATH_CHARS can hold (3+ bytes a sample)
const TAU = 2 * Math.PI;

const wrap = (a) => a - TAU * Math.round(a / TAU);
function pushVarint(out, n) {
  while (n >= 0x80) { out.push((n % 0x80) | 0x80); n = Math.floor(n / 0x80); }
  out.push(n);
}
const zigzag = (n) => (n >= 0 ? n * 2 : -n * 2 - 1);
const unzigzag = (n) => (n % 2 ? -(n + 1) / 2 : n / 2);

function pack(ghost, stride) {
  const samples = ghost.samples.filter((_, i) => i % stride === 0);
  const bytes = [];
  pushVarint(bytes, Math.round((ghost.hz / stride) * HZ_STEP));
  pushVarint(bytes, Math.round(ghost.time * 1000));
  pushVarint(bytes, samples.length);
  let px = 0, pz = 0, pa = 0, heading = 0;
  for (const [x, z, theta] of samples) {
    heading += wrap(theta - heading); // unwrapped, so crossing ±PI is a small step (sampleGhost wraps its own differences)
    const qx = Math.round(x * POS_STEP), qz = Math.round(z * POS_STEP), qa = Math.round(heading * ANGLE_STEP);
    pushVarint(bytes, zigzag(qx - px)); pushVarint(bytes, zigzag(qz - pz)); pushVarint(bytes, zigzag(qa - pa));
    px = qx; pz = qz; pa = qa;
  }
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return PATH_VERSION + btoa(bin);
}

/** Ghost { hz, time, samples: [[x, z, theta]] } -> string of at most `maxChars`, or null if there is no path. */
export function encodePath(ghost, maxChars = MAX_PATH_CHARS) {
  if (!ghost || !(ghost.samples?.length >= 2) || !(ghost.hz > 0) || !(ghost.time > 0)) return null;
  for (let stride = 1; stride < ghost.samples.length; stride++) {
    const s = pack(ghost, stride);
    if (s.length <= maxChars) return s;
  }
  return null;
}

/** String -> ghost that sampleGhost() can play, or null. Paths come from other players, so nothing is trusted. */
export function decodePath(str) {
  if (typeof str !== 'string' || !str.startsWith(PATH_VERSION) || str.length > MAX_PATH_CHARS) return null;
  let bin;
  try { bin = atob(str.slice(PATH_VERSION.length)); } catch { return null; }
  let at = 0, bad = false;
  const read = () => {
    let n = 0, scale = 1;
    for (let k = 0; k < 5; k++) {
      if (at >= bin.length) break;
      const b = bin.charCodeAt(at++);
      n += (b & 0x7f) * scale;
      if (b < 0x80) return n;
      scale *= 0x80;
    }
    bad = true;
    return 0;
  };
  const hz = read() / HZ_STEP, time = read() / 1000, count = read();
  if (bad || !(hz > 0) || !(time > 0) || count < 2 || count > MAX_SAMPLES) return null;
  const samples = [];
  let x = 0, z = 0, a = 0;
  for (let i = 0; i < count; i++) {
    x += unzigzag(read()); z += unzigzag(read()); a += unzigzag(read());
    if (bad) return null;
    samples.push([x / POS_STEP, z / POS_STEP, a / ANGLE_STEP]);
  }
  return at === bin.length ? { hz, time, samples } : null;
}
