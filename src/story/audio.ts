import type { SfxKind } from '../data/story'

// Sonido de la historia, sintetizado con Web Audio (sin archivos). Las voces (AWS Polly) están pendientes.
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
  const now = ctx.currentTime
  const surface = s.scene === 'surface' ? 1 : 0
  const alive = 1 - s.powerOff
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
    case 'thud':
      burst({ dur: 0.5, freq: 170, gain: 0.6, sweepTo: 55 })
      break
    case 'alarm':
      // dos pares de pitidos secos
      ;[0, 0.22, 0.6, 0.82].forEach((d) => setTimeout(() => beep(1050, 0.14, 0.09, 'square'), d * 1000))
      break
    case 'relay':
      burst({ dur: 0.06, freq: 2500, gain: 0.7, type: 'bandpass' })
      beep(90, 0.08, 0.2, 'square')
      break
  }
}

export function stopAudio() {
  if (ctx) {
    void ctx.suspend()
  }
}
