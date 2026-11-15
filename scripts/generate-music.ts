// Genera la música de fondo (una pista por tipo de capítulo, compartida por todas las historias) con ElevenLabs Music.
// Uso: npm run music            → genera las que falten
//      npm run music -- --force → regenera todas (gasta créditos)
import fs from 'node:fs'
import path from 'node:path'

for (const line of fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8').split(/\r?\n/) : []) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}
const KEY = process.env.ELEVEN_LABS_API_KEY
if (!KEY) throw new Error('Falta ELEVEN_LABS_API_KEY en .env')
const OUT = path.join('public', 'audio', 'music')
const FORCE = process.argv.includes('--force')
const LEN = 120_000

const BASE = 'Instrumental cinematic ambient score for a space-exploration documentary, no vocals, no drums, seamless loop, quiet and spacious, soft enough to sit under a whispered narrator. '
const TRACKS: Record<string, string> = {
  despertar: BASE + 'Awakening and wonder: slow soft piano notes over warm evolving synth pads, gentle rising curiosity, delicate and intimate.',
  viaje: BASE + 'The journey: slow-building suspense, deep low strings and sustained drones, distant pulsing texture, vast and lonely, a sense of motion through emptiness.',
  mision: BASE + 'The mission at work: calm, hopeful and determined, minimalist repeating piano and warm pulsing synth arpeggio, light strings, steady and focused.',
  final: BASE + 'The end approaches: melancholic and fading, sparse sorrowful piano and slowly dying strings, long reverb, quiet, bittersweet and emotional.',
  // Menú principal (sistema solar y catálogo): invita a explorar; algo más abierto y luminoso que las pistas de capítulo.
  menu: BASE + 'Main menu theme: slow, open and contemplative, soft evolving synth pads with a few sparse glassy piano notes and distant shimmering textures, a sense of wonder and quiet curiosity before a journey, gently luminous, easy to listen to for a long time.',
  legado: BASE + 'Legacy and memory: serene, reverent and hopeful, warm sustained strings and soft choir-like pads, slow luminous resolution, peaceful and grateful.',
}

fs.mkdirSync(OUT, { recursive: true })
for (const [id, prompt] of Object.entries(TRACKS)) {
  const file = path.join(OUT, `${id}.mp3`)
  if (fs.existsSync(file) && !FORCE) {
    console.log(`= ${id} (ya existe)`)
    continue
  }
  const r = await fetch('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128', {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, music_length_ms: LEN, force_instrumental: true, model_id: 'music_v1' }),
  })
  if (!r.ok) throw new Error(`ElevenLabs ${r.status} (${id}): ${(await r.text()).slice(0, 300)}`)
  fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()))
  console.log(`+ ${id} (${Math.round(fs.statSync(file).size / 16000)} s)`)
}
