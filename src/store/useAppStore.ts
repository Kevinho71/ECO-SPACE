import { create } from 'zustand'

export type ViewStage = 'splash' | 'solar-map' | 'planet-map' | 'mission-scene'
export type LocationId = 'moon' | 'mars' | 'beyond'
export type CameraMode = 'guided' | 'free'

interface AppState {
  // Navegación
  stage: ViewStage
  selectedLocation: LocationId | null
  selectedMissionId: string | null

  // Reproducción y narrativa
  currentChapterIndex: number // 0 a 4
  isPlaying: boolean
  isWhatIfActive: boolean

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
}

export const useAppStore = create<AppState>((set) => ({
  stage: 'splash',
  selectedLocation: null,
  selectedMissionId: null,
  currentChapterIndex: 0,
  isPlaying: false,
  isWhatIfActive: false,
  // Por defecto en 'free' para poder rotar el modelo en el arranque.
  cameraMode: 'free',
  activeHotspotId: null,

  setStage: (stage) => set({ stage }),
  selectLocation: (loc) => set({ selectedLocation: loc, stage: 'planet-map' }),
  selectMission: (id) =>
    set({ selectedMissionId: id, stage: 'mission-scene', currentChapterIndex: 0 }),
  setChapter: (i) => set({ currentChapterIndex: i }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  toggleWhatIf: (active) => set({ isWhatIfActive: active }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  selectHotspot: (id) => set({ activeHotspotId: id }),
}))
