// Box-side asset generation only. Never import this tool from src/ or bundle the API key.
// Usage: ELEVENLABS_API_KEY=... node tools/render-voices.mjs (no key is logged or written).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VOICES = {
  announcer: { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', style: 'Energetic stock race announcer', stability: 0.35, styleStrength: 0.42 },
  engineer: { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', style: 'Calm, clipped stock British engineer', stability: 0.62, styleStrength: 0.18 },
};
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public/audio/vo');
const linesPath = path.join(outDir, 'lines.json');
const lines = JSON.parse(fs.readFileSync(linesPath, 'utf8'));
const chars = Object.values(lines).reduce((sum, { text }) => sum + text.length, 0);
const previousManifest = await fs.promises.readFile(path.join(outDir, 'manifest.json'), 'utf8').then((s) => JSON.parse(s)).catch(() => ({}));
const identical = previousManifest.generated?.length === Object.keys(lines).length && Object.entries(lines).every(([id, line]) => {
  const old = previousManifest.generated.find((c) => c.id === id);
  return old && old.characters === line.text.length && fs.statSync(path.join(outDir, id + '.mp3')).size === old.bytes;
});
// This set was tested with a 34-character short sentence per voice.
const probeCharacters = 99;
if (chars + probeCharacters > 4000) throw new Error('Line set exceeds the small-plan 4,000-character budget.');
if (identical) {
  console.log(`All ${Object.keys(lines).length} bundled clips are up to date. No new characters or provider requests used.`);
  process.exit(0);
}
const key = process.env.ELEVENLABS_API_KEY;
if (!key) throw new Error('Set ELEVENLABS_API_KEY on the build box; do not put it in the repo.');
fs.mkdirSync(outDir, { recursive: true });
const written = [];
for (const [id, line] of Object.entries(lines)) {
  if (!/^[a-z0-9_]+$/.test(id)) throw new Error('Invalid clip id');
  const voice = VOICES[line.voice];
  if (!voice || !line.text || line.text.length > 160) throw new Error('Invalid line metadata: ' + id);
  console.log(`Rendering ${id} (${line.text.length} characters) with ${voice.name}.`);
  let response;
  try {
    response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.id}?output_format=mp3_44100_64`, {
      method: 'POST', headers: { 'xi-api-key': key, 'content-type': 'application/json' },
      body: JSON.stringify({
        text: line.text, model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: voice.stability, similarity_boost: 0.65, style: voice.styleStrength, speed: line.voice === 'announcer' ? 1.06 : 1.04, use_speaker_boost: true },
      }),
    });
  } catch (error) {
    fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify({ generated: written, partial: true, error: 'Network error. Captions remain available.', characters: previousManifest.characters || Object.values(previousManifest.generated || []).reduce((sum, clip) => sum + clip.characters, 0) + probeCharacters }, null, 2));
    throw error;
  }
  if (!response.ok) {
    await response.arrayBuffer();
    const error = `ElevenLabs HTTP ${response.status}; stop generating. The game keeps its caption fallback.`;
    fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify({ generated: written, partial: true, error, characters: previousManifest.characters || Object.values(previousManifest.generated || []).reduce((sum, clip) => sum + clip.characters, 0) + probeCharacters }, null, 2));
    throw new Error(error);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 1000) throw new Error('Short audio response; not writing an empty clip.');
  fs.writeFileSync(path.join(outDir, id + '.mp3'), buffer);
  written.push({ id, characters: line.text.length, bytes: buffer.length });
}
const totalBytes = written.reduce((sum, l) => sum + l.bytes, 0);
const manifest = {
  provider: 'ElevenLabs', model: 'eleven_multilingual_v2', format: 'mp3_44100_64 mono MP3',
  voices: Object.fromEntries(Object.entries(VOICES).map(([role, { id, name, style }]) => [role, { id, name, style }])),
  credits: 'Voices generated with ElevenLabs',
  clips: written.length, characters: chars + probeCharacters, characterBreakdown: { thisLineSet: chars, verificationProbes: probeCharacters },
  totalBytes,
  network: 'Build-time pre-render only. No ElevenLabs requests are made by the browser game.',
  captions: 'Every supported cue also supplies an on-screen textual caption. Missing or failed clips degrade to captions.',
  generated: written,
};
fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`Completed ${written.length} clips, ${totalBytes} bytes. Recorded generation characters: ${manifest.characters}. No API endpoints in the game client.`);
