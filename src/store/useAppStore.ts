import { create } from 'zustand'

export type ViewStage = 'splash' | 'solar-map' | 'planet-map' | 'mission-scene'
export type LocationId = 'moon' | 'mars' | 'beyond'
export type CameraMode = 'guided' | 'free'
/** Cómo se llegó al mapa planetario: desde el sistema solar o volviendo de ver un robot. */
export type Arrival = 'enter' | 'return'

interface AppState {
  // Navegación
  stage: ViewStage
  selectedLocation: LocationId | null
  selectedMissionId: string | null

  // Reproducción y narrativa
  currentChapterIndex: number // 0 a 4
  isPlaying: boolean
  isWhatIfActive: boolean

  // Transiciones
  /** Velo negro de fundido entre escenas. */
  veil: boolean
  arrival: Arrival

  // Interacción 3D
  cameraMode: CameraMode
  activeHotspotId: string | null

  // Acciones
  setStage: (stage: ViewStage) => void
  selectLocation: (loc: LocationId) => void
  selectMission: (missionId: string) => void
  setChapter: (index: number) => void
  togglePlay: () => void
  toggleWhatIf: (active: boolean) => void
  setCameraMode: (mode: CameraMode) => void
  selectHotspot: (id: string | null) => void
  /** Funde a negro, ejecuta `fn` (cambio de escena) y vuelve a mostrar. Ignora llamadas mientras hay una en curso. */
  transitionTo: (fn: () => void) => void
  /** Vuelve de la escena de un robot al mapa planetario (con acercamiento inverso). */
  backToPlanet: () => void
}

const FADE_OUT_MS = 420
const FADE_IN_DELAY_MS = 320
let transitioning = false

export const useAppStore = create<AppState>((set, get) => ({
  stage: 'splash',
  selectedLocation: null,
  selectedMissionId: null,
  currentChapterIndex: 0,
  isPlaying: false,
  isWhatIfActive: false,
  // Por defecto en 'free' para poder rotar el modelo en el arranque.
  cameraMode: 'free',
  activeHotspotId: null,
  veil: false,
  arrival: 'enter',

  setStage: (stage) => set({ stage }),
  selectLocation: (loc) => set({ selectedLocation: loc, stage: 'planet-map', arrival: 'enter' }),
  selectMission: (id) =>
    set({ selectedMissionId: id, stage: 'mission-scene', currentChapterIndex: 0 }),
  setChapter: (i) => set({ currentChapterIndex: i }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  toggleWhatIf: (active) => set({ isWhatIfActive: active }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  selectHotspot: (id) => set({ activeHotspotId: id }),
  transitionTo: (fn) => {
    if (transitioning) return
    transitioning = true
    set({ veil: true })
    setTimeout(() => {
      fn()
      setTimeout(() => {
        set({ veil: false })
        transitioning = false
      }, FADE_IN_DELAY_MS)
    }, FADE_OUT_MS)
  },
  backToPlanet: () => get().transitionTo(() => set({ stage: 'planet-map', arrival: 'return' })),
}))
