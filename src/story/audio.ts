import type { SfxKind } from '../data/story'

// Sonido de la historia, sintetizado con Web Audio (sin archivos). Las voces son MP3 pregenerados con ElevenLabs (npm run voices).
// - Viento de Marte (ruido filtrado) que se intensifica con el polvo.
// - Estática del feed de cámara.
// - Tono grave de telemetría que se ralentiza con la batería.
// - Efectos: arranque, cohetes, paracaídas, airbags, golpes, despliegue, apagado y clic de relé.

let ctx: AudioContext | null = null
let master: GainNode | null = null
let wind: { gain: GainNode; filter: BiquadFilterNode } | null = null
let stat: { gain: GainNode } | null = null
let tone: { osc: OscillatorNode; gain: GainNode } | null = null
let noiseBuf: AudioBuffer | null = null
let enabled = true
let paused = false

// --- Música de fondo: una pista por tipo de capítulo, en bucle, con fundido entre pistas ---
const MUSIC_LEVEL = 0.32
const MUSIC_FADE = 2.5 // s
interface MusicTrack {
  el: HTMLAudioElement
  gain: GainNode
}
const music = new Map<string, MusicTrack>()
let musicId: string | null = null

function musicTrack(id: string): MusicTrack | null {
  if (!ctx || !master) return null
  let t = music.get(id)
  if (!t) {
    const el = new Audio(`${import.meta.env.BASE_URL}audio/music/${id}.mp3`)
    el.loop = true
    el.preload = 'auto'
    // La pista del menú puede no existir todavía (npm run music): mientras tanto suena «despertar».
    if (id === 'menu')
      el.addEventListener('error', () => {
        if (el.src.endsWith('/despertar.mp3')) return
        el.src = `${import.meta.env.BASE_URL}audio/music/despertar.mp3`
        if (musicId === 'menu' && !paused) void el.play().catch(() => undefined)
      })
    const gain = ctx.createGain()
    gain.gain.value = 0
    ctx.createMediaElementSource(el).connect(gain).connect(master)
    t = { el, gain }
    music.set(id, t)
  }
  return t
}

/** Cambia la música con un fundido cruzado. `null` la apaga. Si ya suena esa pista no hace nada. */
export function setMusic(id: string | null) {
  if (!ctx || id === musicId) return
  const now = ctx.currentTime
  const prev = musicId ? music.get(musicId) : null
  if (prev) {
    prev.gain.gain.cancelScheduledValues(now)
    prev.gain.gain.setTargetAtTime(0, now, MUSIC_FADE / 3)
    const el = prev.el
    setTimeout(() => {
      if (musicId !== [...music].find(([, t]) => t.el === el)?.[0]) el.pause()
    }, MUSIC_FADE * 1000 + 300)
  }
  musicId = id
  if (!id) return
  const t = musicTrack(id)
  if (!t) return
  t.el.currentTime = 0
  if (!paused) void t.el.play().catch(() => undefined)
  t.gain.gain.cancelScheduledValues(now)
  t.gain.gain.setTargetAtTime(MUSIC_LEVEL, now, MUSIC_FADE / 3)
}

function musicDuck() {
  if (!ctx || !musicId) return
  const t = music.get(musicId)
  t?.gain.gain.setTargetAtTime(MUSIC_LEVEL * (voiceBusy ? 0.55 : 1), ctx.currentTime, 0.4)
}

// --- Voz (MP3 de ElevenLabs en public/audio/voice) ---
let voiceEl: HTMLAudioElement | null = null
let voiceGain: GainNode | null = null
let voiceManifest: Record<string, { f: string; d: number }> | null = null
let voiceLoading = false
let voicePending: string | null = null
let voiceBusy = false

function loadVoiceManifest() {
  if (voiceManifest || voiceLoading) return
  voiceLoading = true
  fetch(`${import.meta.env.BASE_URL}audio/voice/manifest.json`)
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => {
      voiceManifest = j
      if (voicePending && !voiceBusy) {
        const k = voicePending
        voicePending = null
        playVoiceFile(k)
      }
    })
    .catch(() => undefined)
    .finally(() => (voiceLoading = false))
}

function playVoiceFile(key: string) {
  const entry = voiceManifest?.[key]
  if (!ctx || !master || !entry) return
  if (!voiceEl) {
    voiceEl = new Audio()
    voiceEl.preload = 'auto'
    voiceGain = ctx.createGain()
    voiceGain.gain.value = 1
    ctx.createMediaElementSource(voiceEl).connect(voiceGain).connect(master)
    voiceEl.addEventListener('ended', () => {
      voiceBusy = false
      if (voicePending) {
        const k = voicePending
        voicePending = null
        playVoiceFile(k)
      }
    })
  }
  voiceEl.src = `${import.meta.env.BASE_URL}audio/voice/${entry.f}`
  voiceBusy = true
  void voiceEl.play().catch(() => (voiceBusy = false))
}

/** Dice una línea del guion. Si aún suena la anterior, la deja terminar y entra justo después (solo se guarda la última). */
export function speak(key: string) {
  if (!ctx) return
  if (!voiceManifest) {
    voicePending = key // el manifiesto aún se está cargando
    loadVoiceManifest()
    return
  }
  if (voiceBusy) voicePending = key
  else playVoiceFile(key)
}

export function stopVoice() {
  voicePending = null
  voiceBusy = false
  if (voiceEl) {
    voiceEl.pause()
    voiceEl.removeAttribute('src')
  }
}

function makeNoise(c: AudioContext): AudioBuffer {
  const len = c.sampleRate * 2
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  let b0 = 0
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1
    b0 = 0.97 * b0 + 0.03 * w // ruido rosado simple
    d[i] = w * 0.6 + b0 * 8
  }
  return buf
}

function noiseSource(c: AudioContext): AudioBufferSourceNode {
  const s = c.createBufferSource()
  s.buffer = noiseBuf
  s.loop = true
  return s
}

/** Debe llamarse desde un gesto del usuario (clic) para que el navegador permita el audio. */
export function startAudio() {
  if (ctx) {
    void ctx.resume()
    return
  }
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!AC) return
  ctx = new AC()
  loadVoiceManifest()
  noiseBuf = makeNoise(ctx)
  master = ctx.createGain()
  master.gain.value = enabled && !paused ? 0.8 : 0
  master.connect(ctx.destination)

  // Viento
  const wsrc = noiseSource(ctx)
  const wf = ctx.createBiquadFilter()
  wf.type = 'bandpass'
  wf.frequency.value = 380
  wf.Q.value = 0.7
  const wg = ctx.createGain()
  wg.gain.value = 0
  wsrc.connect(wf).connect(wg).connect(master)
  wsrc.start()
  wind = { gain: wg, filter: wf }

  // Estática
  const ssrc = noiseSource(ctx)
  const sf = ctx.createBiquadFilter()
  sf.type = 'highpass'
  sf.frequency.value = 1800
  const sg = ctx.createGain()
  sg.gain.value = 0
  ssrc.connect(sf).connect(sg).connect(master)
  ssrc.start()
  stat = { gain: sg }

  // Tono de telemetría
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = 96
  const tg = ctx.createGain()
  tg.gain.value = 0
  osc.connect(tg).connect(master)
  osc.start()
  tone = { osc, gain: tg }
}

export function setSoundEnabled(on: boolean) {
  enabled = on
  applyMaster()
}

export function setAudioPaused(p: boolean) {
  paused = p
  applyMaster()
}

function applyMaster() {
  const mt = musicId ? music.get(musicId) : null
  if (mt) {
    if (paused) mt.el.pause()
    else void mt.el.play().catch(() => undefined)
  }
  if (voiceEl) {
    if (paused) voiceEl.pause()
    else if (voiceBusy) void voiceEl.play().catch(() => undefined)
  }
  if (!ctx || !master) return
  master.gain.setTargetAtTime(enabled && !paused ? 0.8 : 0, ctx.currentTime, 0.05)
}

export interface AmbientState {
  /** Intensidad de la estática 0–1 (ya reducida si el usuario pidió menos efectos). */
  staticLevel: number
  dust: number
  battery: number
  scene: 'surface' | 'flight'
  powerOff: number
}

/** Actualiza el ambiente continuo (se llama cada fotograma). */
export function updateAmbient(s: AmbientState) {
  if (!ctx || !wind || !stat || !tone) return
  musicDuck()
  const now = ctx.currentTime
  const surface = s.scene === 'surface' ? 1 : 0
  const alive = (1 - s.powerOff) * (voiceBusy ? 0.5 : 1) // el ambiente baja mientras habla la voz
  wind.gain.gain.setTargetAtTime((0.025 + 0.11 * s.dust) * surface * alive, now, 0.2)
  wind.filter.frequency.setTargetAtTime(320 + 520 * s.dust, now, 0.3)
  stat.gain.gain.setTargetAtTime(Math.min(0.2, s.staticLevel * 0.2) * alive, now, 0.08)
  // El tono se vuelve más grave y débil cuando la batería baja.
  tone.osc.frequency.setTargetAtTime(60 + 40 * s.battery, now, 0.3)
  tone.gain.gain.setTargetAtTime((0.012 + 0.02 * s.battery) * alive, now, 0.3)
}

function burst(opts: { dur: number; freq: number; q?: number; gain: number; type?: BiquadFilterType; sweepTo?: number }) {
  if (!ctx || !master || !noiseBuf) return
  const src = noiseSource(ctx)
  const f = ctx.createBiquadFilter()
  f.type = opts.type ?? 'lowpass'
  f.frequency.value = opts.freq
  f.Q.value = opts.q ?? 0.8
  const g = ctx.createGain()
  const t0 = ctx.currentTime
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(opts.gain, t0 + 0.05)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur)
  if (opts.sweepTo) f.frequency.exponentialRampToValueAtTime(opts.sweepTo, t0 + opts.dur)
  src.connect(f).connect(g).connect(master)
  src.start(t0)
  src.stop(t0 + opts.dur + 0.1)
}

function beep(freq: number, dur: number, gain: number, type: OscillatorType = 'sine', sweepTo?: number) {
  if (!ctx || !master) return
  const o = ctx.createOscillator()
  o.type = type
  const g = ctx.createGain()
  const t0 = ctx.currentTime
  o.frequency.setValueAtTime(freq, t0)
  if (sweepTo) o.frequency.exponentialRampToValueAtTime(sweepTo, t0 + dur)
  g.gain.setValueAtTime(gain, t0)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  o.connect(g).connect(master)
  o.start(t0)
  o.stop(t0 + dur + 0.05)
}

export function playSfx(kind: SfxKind) {
  if (!ctx) return
  switch (kind) {
    case 'boot':
      beep(220, 0.25, 0.08, 'sine', 440)
      setTimeout(() => beep(660, 0.12, 0.06), 260)
      break
    case 'rumble':
      burst({ dur: 3.2, freq: 140, gain: 0.5, sweepTo: 70 })
      break
    case 'chute':
      burst({ dur: 0.7, freq: 1200, gain: 0.4, type: 'bandpass', sweepTo: 300 })
      break
    case 'retro':
      burst({ dur: 2.2, freq: 260, gain: 0.45, sweepTo: 120 })
      break
    case 'airbag':
      burst({ dur: 0.9, freq: 900, gain: 0.35, type: 'bandpass', sweepTo: 200 })
      break
    case 'tumble':
      // golpes sordos irregulares (sin sugerir un número exacto de rebotes)
      ;[0, 0.55, 1.35, 2.2, 3.5, 5.0].forEach((d, i) =>
        setTimeout(() => burst({ dur: 0.45, freq: 160, gain: 0.55 - i * 0.07, sweepTo: 60 }), d * 1000),
      )
      break
    case 'unfold':
      beep(180, 0.5, 0.05, 'triangle', 320)
      break
    case 'powerdown':
      beep(440, 1.4, 0.12, 'sine', 28)
      break
    case 'blink':
      burst({ dur: 0.12, freq: 1400, gain: 0.12, type: 'bandpass', sweepTo: 600 })
      break
    case 'rotor':
      // rotores que se aceleran: zumbido grave que sube
      beep(60, 4, 0.1, 'sawtooth', 190)
      burst({ dur: 4, freq: 500, gain: 0.12, type: 'bandpass', sweepTo: 1500 })
      break
    case 'thud':
      burst({ dur: 0.5, freq: 140, gain: 0.8, sweepTo: 45 })
      burst({ dur: 0.25, freq: 1800, gain: 0.25, type: 'bandpass' })
      break
    case 'quake':
      beep(38, 4.5, 0.25, 'sine', 24)
      burst({ dur: 4.5, freq: 90, gain: 0.5, sweepTo: 40 })
      break
    case 'alarm':
      // dos pares de pitidos secos
      ;[0, 0.22, 0.6, 0.82].forEach((d) => setTimeout(() => beep(1050, 0.14, 0.09, 'square'), d * 1000))
      break
    case 'hammer':
      ;[0, 0.18, 0.36, 0.54].forEach((d) => setTimeout(() => burst({ dur: 0.07, freq: 900, gain: 0.3, type: 'bandpass' }), d * 1000))
      break
    case 'relay':
      burst({ dur: 0.06, freq: 2500, gain: 0.7, type: 'bandpass' })
      beep(90, 0.08, 0.2, 'square')
      break
  }
}

/** Apaga el ambiente de la historia (viento, estática, tono) para que no se oiga en los menús. */
function silenceAmbient() {
  if (!ctx) return
  const now = ctx.currentTime
  for (const g of [wind?.gain, stat?.gain, tone?.gain]) g?.gain.setTargetAtTime(0, now, 0.1)
}

export function stopAudio() {
  stopVoice()
  setMusic(null)
  silenceAmbient()
  if (ctx) {
    void ctx.suspend()
  }
}

/** ¿El visitante ya ha interactuado con la página? (el navegador solo deja sonar el audio tras un gesto). */
export function userHasInteracted(): boolean {
  const ua = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation
  return ua ? ua.hasBeenActive : ctx !== null
}

/**
 * Música de fondo del menú principal (splash, sistema solar, catálogo). Llamar desde un gesto del usuario o
 * después de uno; es seguro llamarla varias veces. La historia la sustituye con un fundido al empezar.
 */
export function startMenuMusic(soundOn = true) {
  startAudio()
  enabled = soundOn
  paused = false
  silenceAmbient()
  setMusic('menu')
  applyMaster()
}
