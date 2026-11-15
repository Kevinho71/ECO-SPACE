import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import { sampleLinear, sampleStep, type PlaceId, type Story, type StoryChapter } from '../data/story'
import { opportunityStory } from '../data/stories/opportunity'
import { resetRuntime, storyRuntime } from './runtime'
import { playSfx, setAudioPaused, setSoundEnabled, startAudio, stopAudio, updateAmbient } from './audio'

/** Historias disponibles por misión. Las demás misiones todavía no tienen guion. */
const STORIES: Record<string, Story> = {
  opportunity: opportunityStory,
}

export function getStory(missionId: string | null): Story | null {
  return missionId ? STORIES[missionId] ?? null : null
}

/** Segundos entre que empiezan a cerrarse los párpados y el cambio de escenario (el punto más oscuro). */
const BLINK_SWAP = 0.3

/** Lugar en el instante t del capítulo (los parpadeos cambian el escenario con los ojos cerrados). */
export function placeAt(ch: StoryChapter, t: number): PlaceId {
  let p = ch.place0
  for (const j of ch.jumps ?? []) if (t >= j.t + BLINK_SWAP) p = j.to
  return p
}

/** Cuánto están cerrados los párpados (0–1) en el instante t. */
function blinkAt(ch: StoryChapter, t: number): number {
  let b = 0
  for (const j of ch.jumps ?? []) {
    const u = t - j.t
    let v = 0
    if (u > 0 && u < 0.25) v = u / 0.25
    else if (u >= 0.25 && u < 0.35) v = 1
    else if (u >= 0.35 && u < 0.8) v = 1 - (u - 0.35) / 0.45
    b = Math.max(b, v * v * (3 - 2 * v))
  }
  return b
}

// Acciones del reproductor (usadas por la interfaz).
let jumpTo: ((chapter: number, t?: number) => void) | null = null
export const storyControls = {
  start() {
    startAudio()
    const s = useAppStore.getState()
    s.patchStory({ storyStarted: true, storyEnded: false, isPlaying: true })
    jumpTo?.(0, 0)
  },
  restart() {
    useAppStore.getState().patchStory({ storyEnded: false, isPlaying: true })
    startAudio()
    jumpTo?.(0, 0)
  },
  /** Salta a un capítulo y segundo concretos (para depuración y revisión). */
  seek(chapter: number, t = 0) {
    jumpTo?.(chapter, t)
  },
  seekChapter(i: number) {
    useAppStore.getState().patchStory({ storyEnded: false })
    jumpTo?.(i, 0)
  },
  togglePlay() {
    const s = useAppStore.getState()
    const next = !s.isPlaying
    s.patchStory({ isPlaying: next })
    setAudioPaused(!next)
    if (next) startAudio()
  },
  next() {
    jumpTo?.(storyRuntime.chapter + 1, 0)
  },
  prev() {
    // Si ya avanzó un poco, vuelve al inicio del capítulo; si no, al anterior.
    jumpTo?.(storyRuntime.t > 4 ? storyRuntime.chapter : storyRuntime.chapter - 1, 0)
  },
}

/**
 * Motor de la historia: avanza el tiempo del capítulo, calcula los valores de cada instante
 * (estática, polvo, cámara, clip, expresión, subtítulo…) y avisa a la interfaz solo cuando algo cambia.
 */
export function StoryDirector() {
  const missionId = useAppStore((s) => s.selectedMissionId)
  const story = getStory(missionId)

  useEffect(() => {
    if (!story) return
    const st = story
    resetRuntime()
    storyRuntime.active = true
    useAppStore.getState().patchStory({
      storyStarted: false,
      storyEnded: false,
      isPlaying: false,
      currentChapterIndex: 0,
      cueIndex: -1,
      activeCard: null,
      storyClip: null,
      storyExpression: null,
      storyView: 'pov',
      storyPlace: st.chapters[0].place0,
      storyPart: null,
      storyScene: 'surface',
      cameraMode: 'guided',
    })

    let raf = 0
    let last = performance.now()
    let chapter = 0
    let t = 0
    let firedSfx = new Set<number>()
    let firedBlink = new Set<number>()
    let lastKey = ''

    jumpTo = (ci, to = 0) => {
      if (ci >= st.chapters.length) {
        // Fin de la historia
        useAppStore.getState().patchStory({ storyEnded: true, isPlaying: false, activeCard: null })
        storyRuntime.staticLevel = 0
        setAudioPaused(true)
        return
      }
      chapter = Math.max(0, ci)
      t = to
      firedSfx = new Set()
      firedBlink = new Set()
      lastKey = ''
      storyRuntime.chapter = chapter
      useAppStore.getState().patchStory({
        currentChapterIndex: chapter,
        chapterBanner: useAppStore.getState().chapterBanner + 1,
        cueIndex: -1,
        activeCard: null,
        storyEnded: false,
      })
      setAudioPaused(false)
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const s = useAppStore.getState()
      const ch = st.chapters[chapter]
      if (!ch) return

      if (s.storyStarted && s.isPlaying && !s.storyEnded) {
        t += dt
        if (t >= ch.duration) {
          jumpTo?.(chapter + 1, 0)
          return
        }
      }
      storyRuntime.t = t
      storyRuntime.chapter = chapter

      // Valores continuos
      const rm = s.reduceEffects ? 0.25 : 1
      storyRuntime.staticLevel = sampleLinear(ch.staticLevel, t) * rm
      storyRuntime.dust = sampleLinear(ch.dust, t, 0)
      storyRuntime.powerOff = sampleLinear(ch.powerOff, t, 0)
      storyRuntime.shake = sampleLinear(ch.shake, t, 0) * (s.reduceEffects ? 0 : 1)
      storyRuntime.robotX = sampleLinear(ch.robotX, t, 0)
      storyRuntime.speed = Math.max(0, (sampleLinear(ch.robotX, t + 0.1, 0) - sampleLinear(ch.robotX, t - 0.1, 0)) / 0.2)
      if (!s.isPlaying || !s.storyStarted) storyRuntime.speed = 0
      storyRuntime.pan = sampleLinear(ch.pan, t, 0)
      storyRuntime.sink = sampleLinear(ch.sink, t, 0)
      storyRuntime.slip = sampleLinear(ch.slip, t, 0) * (s.isPlaying ? 1 : 0)
      storyRuntime.blink = blinkAt(ch, t)
      storyRuntime.robotVisible = sampleStep(ch.robot, t, true)
      storyRuntime.battery = sampleLinear(ch.battery, t, 1)
      storyRuntime.signal = sampleLinear(ch.signal, t, 1)

      // Valores discretos: solo se escriben al store si cambian.
      const scene = sampleStep(ch.scene, t, 'surface')
      const view = sampleStep(ch.camera, t, 'pov')
      const clip = s.storyStarted ? sampleStep(ch.clips, t, 'Idle') : null
      const expr = sampleStep(ch.expressions, t, null)
      let cue = -1
      for (let i = 0; i < ch.cues.length; i++) if (ch.cues[i].t <= t) cue = i
      const card = (ch.cards ?? []).find((c) => t >= c.at && t < c.at + c.dur) ?? null
      const place = placeAt(ch, t)
      const part = view === 'part' ? sampleStep(ch.partFocus, t, null)?.hotspot ?? null : null
      const key = `${scene}|${view}|${clip}|${expr}|${cue}|${card ? card.at : ''}|${place}|${part}`
      if (key !== lastKey) {
        lastKey = key
        s.patchStory({
          storyScene: scene,
          storyView: view,
          storyClip: clip,
          storyExpression: expr,
          cueIndex: cue,
          activeCard: card,
          storyPlace: place,
          storyPart: part,
        })
      }

      // Efectos de sonido puntuales
      if (s.storyStarted && s.isPlaying) {
        ;(ch.jumps ?? []).forEach((j, i) => {
          if (j.t <= t && !firedBlink.has(i)) {
            firedBlink.add(i)
            if (t - j.t < 0.5) playSfx('blink')
          }
        })
        ;(ch.sfx ?? []).forEach((e, i) => {
          if (e.t <= t && !firedSfx.has(i) && t - e.t < 1.5) {
            firedSfx.add(i)
            playSfx(e.v)
          } else if (e.t <= t) firedSfx.add(i)
        })
      }
      setSoundEnabled(s.soundOn)
      updateAmbient({
        staticLevel: s.storyStarted ? storyRuntime.staticLevel : 0,
        dust: storyRuntime.dust,
        battery: storyRuntime.battery,
        scene,
        powerOff: storyRuntime.powerOff,
      })
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      jumpTo = null
      stopAudio()
      resetRuntime()
      useAppStore.getState().patchStory({
        storyStarted: false,
        storyEnded: false,
        isPlaying: false,
        storyClip: null,
        storyExpression: null,
        activeCard: null,
        cameraMode: 'free',
      })
    }
  }, [story])

  return null
}
