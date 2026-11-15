# EcoSpace — Flujo de Usuario, Mapa Interactivo 3D y Arquitectura UI
> **Proyecto:** *Abandoned but not Forgotten* (NASA Space Apps Challenge 2026)  
> **Propósito del documento:** Especificación técnica y visual del recorrido del usuario (*User Flow*), interacción con el mapa 3D, controles de cámara/rotación y estados de interfaz para generación asistida por IA en **React + TypeScript + Three.js (`@react-three/fiber`)**.

---

## 1. Mapa General del Flujo de Usuario (User Flow)

El usuario atraviesa **4 pantallas/estados principales** dentro de un único `<Canvas>` 3D persistente (sin recargas de página, solo transiciones fluidas de cámara y capas de interfaz *glassmorphism*):

```text
[PANTALLA 1: PORTADA INMERSIVA]
   │  • Fondo 3D: Sistema solar en rotación lenta con partículas de estrellas.
   │  • Acción: Clic en "Explorar el Cementerio de las Estrellas".
   ▼
[PANTALLA 2: MAPA ESTELAR Y PLANETARIO 3D (SELECTOR DE DESTINO)]
   │  • Vista 3D interactiva con 3 nodos orbitales rotables:
   │      1. 🌕 LUNA (Órbita terrestre)
   │      2. 🔴 MARTE (Planeta rojo con rotación continua)
   │      3. 🪐 MÁS ALLÁ (Espacio profundo / Cinturón de asteroides)
   │  • Interacción: El usuario gira el mapa o hace clic en un cuerpo celeste.
   ▼
[PANTALLA 3: MAPA DE SUPERFICIE / ÓRBITA DE MISIONES (7 PINES 3D)]
   │  • Al elegir un destino, la cámara hace zoom hacia el planeta/zona.
   │  • Aparecen pines 3D luminosos sobre las coordenadas reales de las 7 misiones:
   │      - Luna: Apollo 11 Eagle, Surveyor 3
   │      - Marte: Mars Pathfinder, Opportunity, InSight, Ingenuity
   │      - Más allá: Pioneer 10
   │  • Acción: Clic en un pin → Muestra tarjeta previa → Clic en "Despertar Equipo".
   ▼
[PANTALLA 4: ESCENA DE STORYTELLING E INSPECCIÓN 3D (EL ROBOT)]
   ├─► MODO A: HISTORIA GUIADA (Por defecto)
   │     • Cámara cinematográfica automática (movimientos suaves predefinidos).
   │     • Narración de audio (AWS Polly) + Subtítulos sincronizados abajo.
   │     • Línea de tiempo de 5 capítulos + Botón opcional "¿Qué pasaría si…?" (HIPOTÉTICO).
   │
   └─► MODO B: EXPLORACIÓN LIBRE 360° (Activado por el usuario en cualquier momento)
         • El usuario toma el control total de la rotación, zoom y paneo del robot.
         • Aparecen Hotspots (puntos brillantes) sobre el modelo 3D (Pancam, Paneles, Ruedas).
         • Al hacer clic en un Hotspot, se abre el panel lateral "Inspector Técnico".
```

---

## 2. Especificación del Mapa 3D y Controles de Rotación

Para que el usuario sienta que navega por el espacio y examina hardware real de la NASA, la aplicación implementa **dos niveles de mapa y rotación**:

### Nivel 1: Mapa Planetario y de Coordenadas (Navegación)
* **Vista Macro (Sistema Solar):** Tres esferas 3D texturizadas (Luna, Marte y Sonda en Espacio Profundo) dispuestas en perspectiva orbital. Tienen rotación automática sobre su propio eje (`rotation.y += delta * 0.1`). Al pasar el cursor (*hover*), el planeta se ilumina con un halo (*Outline/Bloom*) y muestra cuántas misiones hay allí.
* **Vista Local (Globo / Terreno con Pines):** Al seleccionar **Marte** o la **Luna**, el planeta se acerca al centro de la pantalla. El usuario puede **rotar el globo 360° arrastrando con el mouse o el dedo** (`OrbitControls` sin paneo, solo rotación) para descubrir los **Pines 3D (Beacons)** ubicados en sus coordenadas reales (ej. *Meridiani Planum* para Opportunity, *Tranquility Base* para Eagle).

### Nivel 2: Rotación e Inspección del Robot (Escena de Misión)
Dentro de la escena de cualquiera de las 7 misiones, la cámara funciona bajo un sistema híbrido controlado por estado (`cameraMode: 'guided' | 'free'`):

| Acción del Usuario | Control / Gesto | Comportamiento de la Cámara y Rotación |
| :--- | :--- | :--- |
| **Ver Historia (Default)** | Ninguno (Automático) | La cámara sigue los ángulos del guion (`wide`, `close`, `inspect`, `orbit`). El usuario puede pausar o saltar capítulos. |
| **Rotar el Robot 360°** | Clic izquierdo + Arrastrar (o 1 dedo en móvil) | Cambia automáticamente a `cameraMode: 'free'`. El usuario gira libremente alrededor del rover/sonda (`OrbitControls` con `enableDamping = true`). |
| **Acercar / Alejar (Zoom)** | Rueda del mouse (o pellizco en móvil) | Permite acercarse hasta 1.2 metros del modelo para ver detalles de los instrumentos o alejarse hasta 12 metros para ver el paisaje. |
| **Inspeccionar Pieza** | Clic en un **Hotspot 3D** | La cámara hace un *zoom* suave hacia esa pieza específica (ej. brazo robótico) y despliega la tarjeta educativa. |
| **Volver a la Historia** | Clic en botón `"Seguir relato"` | Devuelve la cámara al encuadre cinematográfico del capítulo actual. |

---

## 3. Wireframe de la Interfaz (UI Overlay sobre el Canvas 3D)

Toda la interfaz flota sobre el lienzo 3D usando paneles translúcidos oscuros (`bg-slate-950/70 backdrop-blur-md border border-white/15`) para no tapar el modelo:

```text
+-----------------------------------------------------------------------------------+

| [Logo EcoSpace]   📍 Marte > Meridiani Planum · Opportunity      [🔄 Modo Libre] |  <-- Barra Superior
+-----------------------------------------------------------------------------------+

|                                                                                   |
|   [Lista 7 Misiones]                                     +---------------------+  |
|   • Eagle (Luna)                                         | INSPECTOR TÉCNICO   |  |
|   • Surveyor 3 (Luna)                                    | (Solo si clic en    |  |
|   • Pathfinder (Marte)                                   |  Hotspot 3D)        |  |
|   • Opportunity [ACTIVO]       (MODELO 3D DEL ROVER      |                     |  |
|   • InSight (Marte)             EN EL CENTRO CON         | • Pancam Stereo     |  |
|   • Ingenuity (Marte)           HOTSPOTS CLICABLES)      | • Dato NASA         |  |
|   • Pioneer 10 (Más allá)                                | • Explicación fácil |  |
|                                                          +---------------------+  |
|                                                                                   |
|                        "Hola. Soy Oppy. Nací para durar 90 días..."               |  <-- Subtítulos Sincronizados
|                                                                                   |
|  [▶/⏸]  Cap 1 ─────── Cap 2 ─────── Cap 3 ─────── Cap 4 ┄┄┄[⚡¿Qué pasaría si?]-  |  <-- Timeline + Rama What-If
+-----------------------------------------------------------------------------------+
```

---

## 4. Contrato de Estado Global (Zustand Store)

La IA debe implementar este estado central en `src/store/useAppStore.ts` para coordinar el mapa, la cámara, las 7 misiones y el audio:

```typescript
export type ViewStage = 'cover' | 'solar-map' | 'planet-map' | 'mission-scene';
export type LocationId = 'moon' | 'mars' | 'beyond';
export type CameraMode = 'guided' | 'free';

interface AppState {
  // Navegación
  stage: ViewStage;
  selectedLocation: LocationId | null;
  selectedMissionId: string; // Una de las 7 misiones
  
  // Reproducción y Narrativa
  currentChapterIndex: number; // 0 a 4
  isPlaying: boolean;
  isWhatIfActive: boolean; // True si el usuario entró a la rama hipotética
  
  // Interacción 3D
  cameraMode: CameraMode;
  activeHotspotId: string | null;

  // Acciones
  setStage: (stage: ViewStage) => void;
  selectLocation: (loc: LocationId) => void;
  selectMission: (missionId: string) => void;
  setChapter: (index: number) => void;
  togglePlay: () => void;
  toggleWhatIf: (active: boolean) => void;
  setCameraMode: (mode: CameraMode) => void;
  selectHotspot: (id: string | null) => void;
}
```

---

## 5. Prompts Maestros para Generar el Proyecto con IA

Copia y pega estos bloques en orden en tu editor con IA (Cursor / Copilot) para construir la aplicación paso a paso:

### Prompt 1: Estructura Base, Mapa 3D y Navegación
> *"Actúa como un desarrollador experto en React, TypeScript y Three.js (`@react-three/fiber`, `@react-three/drei`, `zustand`, `tailwindcss`). Crea la estructura base de la aplicación web 3D 'EcoSpace: Abandoned but not Forgotten'. Implementa un `<Canvas>` a pantalla completa con fondo estrellado (`<Stars />`) y un sistema de vistas controlado por Zustand (`cover` -> `solar-map` -> `planet-map` -> `mission-scene`). En `solar-map`, renderiza 3 esferas interactivas (Luna, Marte y Espacio Profundo) que roten lentamente y permitan hacer clic para acercar la cámara. En `planet-map`, permite al usuario rotar el planeta 360° con `OrbitControls` y hacer clic en pines 3D luminosos correspondientes a las 7 misiones de la NASA (Apollo 11 Eagle, Surveyor 3, Pathfinder, Opportunity, InSight, Ingenuity y Pioneer 10)."*

### Prompt 2: Escena del Robot, Rotación Híbrida y Hotspots
> *"Ahora implementa la vista `mission-scene` en `@react-three/fiber`. Carga el modelo `.glb` de la misión seleccionada desde `/public/models/[id].glb` usando `useGLTF` y `useAnimations`. Configura `OrbitControls` con amortiguación (`enableDamping`) para que el usuario pueda rotar el robot 360° y hacer zoom libremente cuando active el modo libre o arrastre el mouse (`cameraMode = 'free'`), pero que vuelva suavemente (usando `lerp`) a ángulos predefinidos (`wide`, `close`, `inspect`) cuando esté en modo historia (`cameraMode = 'guided'`). Añade puntos interactivos 3D (`<Html>` de `@react-three/drei`) anclados a las partes del robot que, al hacer clic, abran un panel lateral glassmorphism con los datos técnicos de la NASA."*

### Prompt 3: Reproductor de Storytelling, Subtítulos y Rama "¿Qué pasaría si…?"
