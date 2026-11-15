import { create } from 'zustand'
import type { Expression, PlaceId, StoryCard, StoryView } from '../data/story'

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

  // Historia (piloto Opportunity). Los valores continuos viven en `storyRuntime` (src/story/runtime.ts).
  storyStarted: boolean
  storyEnded: boolean
  storyView: StoryView
  storyPlace: PlaceId
  /** Id del hotspot de la pieza que se está enseñando (cámara 'part'). */
  storyPart: string | null
  storyScene: 'surface' | 'flight'
  storyClip: string | null
  /** Clip que se mantiene en su última pose junto al clip actual (p. ej. Sojourner ya fuera de la rampa). */
  storyHold: string | null
  storyExpression: Expression
  cueIndex: number
  activeCard: StoryCard | null
  chapterBanner: number // se incrementa al empezar un capítulo (dispara el título)
  subtitlesOn: boolean
  soundOn: boolean
  reduceEffects: boolean

  // Interacción 3D
  cameraMode: CameraMode
  activeHotspotId: string | null

  // Menú principal (sistema solar)
  /** Destino resaltado (ratón sobre el planeta, sobre su botón o foco del teclado). */
  hoveredLocation: LocationId | null
  /** Destino pedido desde la barra de destinos: el sistema solar vuela hacia él y lo limpia. */
  pendingLocation: LocationId | null
  /** Paso del recorrido guiado: 0..2 = Luna, Marte, Más allá; 3 = vuelta a la vista general; null = inactivo. */
  tourStep: number | null

  // Mapa planetario
  /** Robot resaltado (ratón sobre su baliza o sobre su tarjeta del catálogo). */
  hoveredMission: string | null
  /** Robot pedido desde el catálogo lateral: el globo vuela hacia su baliza y lo limpia. */
  pendingMission: string | null

  // Acciones
  setStage: (stage: ViewStage) => void
  selectLocation: (loc: LocationId) => void
  selectMission: (missionId: string) => void
  setChapter: (index: number) => void
  togglePlay: () => void
  toggleWhatIf: (active: boolean) => void
  setCameraMode: (mode: CameraMode) => void
  selectHotspot: (id: string | null) => void
  patchStory: (p: Partial<AppState>) => void
  setHoveredLocation: (loc: LocationId | null) => void
  requestLocation: (loc: LocationId) => void
  setTourStep: (step: number | null) => void
  setHoveredMission: (id: string | null) => void
  requestMission: (id: string) => void
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
  storyStarted: false,
  storyEnded: false,
  storyView: 'pov',
  storyPlace: 'generic',
  storyPart: null,
  storyScene: 'surface',
  storyClip: null,
  storyHold: null,
  storyExpression: null,
  cueIndex: -1,
  activeCard: null,
  chapterBanner: 0,
  subtitlesOn: true,
  soundOn: true,
  reduceEffects: false,
  veil: false,
  arrival: 'enter',
  hoveredLocation: null,
  pendingLocation: null,
  tourStep: null,
  hoveredMission: null,
  pendingMission: null,

  setStage: (stage) => set({ stage }),
  selectLocation: (loc) =>
    set({
      selectedLocation: loc,
      stage: 'planet-map',
      arrival: 'enter',
      hoveredLocation: null,
      pendingLocation: null,
      tourStep: null,
    }),
  selectMission: (id) =>
    set({
      selectedMissionId: id,
      stage: 'mission-scene',
      currentChapterIndex: 0,
      hoveredMission: null,
      pendingMission: null,
    }),
  setChapter: (i) => set({ currentChapterIndex: i }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  toggleWhatIf: (active) => set({ isWhatIfActive: active }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  selectHotspot: (id) => set({ activeHotspotId: id }),
  patchStory: (p) => set(p),
  setHoveredLocation: (loc) => set({ hoveredLocation: loc }),
  requestLocation: (loc) => set({ pendingLocation: loc }),
  setTourStep: (step) => set({ tourStep: step }),
  setHoveredMission: (id) => set({ hoveredMission: id }),
  requestMission: (id) => set({ pendingMission: id }),
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
