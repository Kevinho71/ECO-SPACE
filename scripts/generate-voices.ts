// Genera las voces de los subtítulos con ElevenLabs y las guarda en public/audio/voice/.
// Uso: npm run voices            → genera lo que falte (caché por hash de texto+voz+ajustes)
//      npm run voices -- --dry   → solo cuenta los caracteres, sin gastar créditos
// Variables (.env): ELEVEN_LABS_API_KEY, VOICE_ID … VOICE_ID6  ·  opcionales: VOICE_MODEL, VOICE_TAG
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import type { Story } from '../src/data/story'
import { opportunityStory } from '../src/data/stories/opportunity'
import { ingenuityStory } from '../src/data/stories/ingenuity'
import { insightStory } from '../src/data/stories/insight'
import { pathfinderStory } from '../src/data/stories/pathfinder'
import { pioneer10Story } from '../src/data/stories/pioneer10'
import { eagleStory } from '../src/data/stories/eagle'
import { surveyor3Story } from '../src/data/stories/surveyor3'

const STORIES: Story[] = [opportunityStory, ingenuityStory, insightStory, pathfinderStory, pioneer10Story, eagleStory, surveyor3Story]

// --- .env mínimo (sin dependencias) ---
for (const line of fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8').split(/\r?\n/) : []) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}
const KEY = process.env.ELEVEN_LABS_API_KEY
// Una voz por robot (variable del .env). Se pueden repetir.
const VOICE_OF: Record<string, string> = {
  opportunity: 'VOICE_ID6', // Jon: cálido y sereno
  ingenuity: 'VOICE_ID4', // David: brillante y curioso
  insight: 'VOICE_ID5', // Autumn Veil: reflexiva, la que escucha
  pathfinder: 'VOICE_ID', // Mr. Claus: cálido y alegre, pionero
  pioneer10: 'VOICE_ID2', // Connery: profunda, espacio profundo
  eagle: 'VOICE_ID2', // Connery: solemne, momento histórico
  surveyor3: 'VOICE_ID3', // Jessie: rasposa y vintage
}
const voiceOf = (mission: string) => process.env[VOICE_OF[mission]] ?? ''
const MODEL = process.env.VOICE_MODEL || 'eleven_v3'
// Etiqueta de estilo (solo eleven_v3): voz casi susurrada y dramática. Vacía para desactivar.
const TAG = process.env.VOICE_TAG ?? '[whispers]'
const DRY = process.argv.includes('--dry')
const OUT = path.join('public', 'audio', 'voice')
const SETTINGS = { stability: 0.5, similarity_boost: 0.8, style: 0.6, use_speaker_boost: true }

interface Job { key: string; text: string; file: string; voice: string }
const jobs: Job[] = []
for (const st of STORIES)
  for (const ch of st.chapters)
    ch.cues.forEach((c, i) => {
      const text = (TAG ? TAG + ' ' : '') + c.text.replace(/…/g, '...').trim()
      const hash = crypto.createHash('sha1').update([voiceOf(st.missionId), MODEL, JSON.stringify(SETTINGS), text].join('|')).digest('hex').slice(0, 16)
      jobs.push({ key: `${st.missionId}|${ch.id}|${i}`, text, file: `${hash}.mp3`, voice: voiceOf(st.missionId) })
    })

const chars = jobs.reduce((n, j) => n + j.text.length, 0)
const perVoice: Record<string, number> = {}
for (const j of jobs) if (!fs.existsSync(path.join(OUT, j.file))) perVoice[j.key.split('|')[0]] = (perVoice[j.key.split('|')[0]] ?? 0) + j.text.length
console.log(`${jobs.length} líneas · ${chars} caracteres · por generar: ${JSON.stringify(perVoice)}`)
if (DRY) process.exit(0)
if (!KEY || jobs.some((j) => !j.voice)) throw new Error('Falta ELEVEN_LABS_API_KEY o alguna VOICE_ID* en .env')
fs.mkdirSync(OUT, { recursive: true })

async function synth(text: string, voice: string, attempt = 0): Promise<Buffer> {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': KEY!, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model_id: MODEL, language_code: 'es', voice_settings: SETTINGS }),
  })
  if (r.status === 429 && attempt < 5) {
    await new Promise((s) => setTimeout(s, 2000 * (attempt + 1)))
    return synth(text, voice, attempt + 1)
  }
  if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${(await r.text()).slice(0, 300)}`)
  return Buffer.from(await r.arrayBuffer())
}

const manifest: Record<string, { f: string; d: number }> = {}
let done = 0
let fresh = 0
async function worker(queue: Job[]) {
  for (let j = queue.shift(); j; j = queue.shift()) {
    const p = path.join(OUT, j.file)
    if (!fs.existsSync(p)) {
      fs.writeFileSync(p, await synth(j.text, j.voice))
      fresh++
    }
    // Duración aproximada: mp3 a 128 kbps = 16 000 bytes/s.
    manifest[j.key] = { f: j.file, d: Math.round((fs.statSync(p).size / 16000) * 10) / 10 }
    if (++done % 20 === 0) console.log(`  ${done}/${jobs.length}`)
  }
}
const queue = [...jobs]
await Promise.all([worker(queue), worker(queue), worker(queue)])
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 0))
// Borra los MP3 que ya no usa ningún guion (p. ej. de una voz anterior).
const used = new Set(jobs.map((j) => j.file))
for (const f of fs.readdirSync(OUT)) if (f.endsWith('.mp3') && !used.has(f)) fs.unlinkSync(path.join(OUT, f))
console.log(`Listo: ${fresh} nuevas, ${jobs.length - fresh} en caché.`)

// Avisa si una voz dura más que el hueco hasta la siguiente línea.
for (const st of STORIES)
  for (const ch of st.chapters)
    ch.cues.forEach((c, i) => {
      const next = ch.cues[i + 1]?.t ?? ch.duration
      const d = manifest[`${st.missionId}|${ch.id}|${i}`]?.d ?? 0
      if (d > next - c.t + 0.3) console.log(`  ⚠ ${st.missionId}/${ch.id}#${i}: voz ${d}s > hueco ${(next - c.t).toFixed(1)}s`)
    })
