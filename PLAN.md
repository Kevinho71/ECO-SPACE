# Abandoned but not Forgotten — Plan detallado

> Storytelling sobre el equipo descartado de la NASA en la Luna, Marte y más allá.
> Experiencia web interactiva en **primera persona** con Three.js + React: vives la historia *siendo* el robot, con un feed de cámara con estática/glitch y un corte eléctrico final.

---

## 1. Visión y concepto

Una **galería-museo 3D de exploradores olvidados** vivida **en primera persona**. El visitante (estudiante de primaria/secundaria o curioso) navega un mapa del sistema solar, elige un escenario (Luna / Marte / Más allá) y luego una misión. Al seleccionarla **se convierte en el robot**: la cámara es su "ojo" (el mástil/Pancam), la narración es su monólogo interno en primera persona (voz AWS Polly, subtítulos sincronizados) y el usuario mira a su alrededor desde dentro de la máquina.

La experiencia se presenta como un **feed de cámara real**: un overlay de telemetría con **estática, scanlines y glitch** que se intensifica en los momentos de tensión. Al terminar la misión, ocurre el **corte eléctrico**: la señal se degrada a estática y se apaga, dejando al usuario en silencio dentro del robot.

**Pilar narrativo (del reto):** *"mostrar cómo operaron, no enumerar datos"*. El usuario *vive* un arco emocional —no lee una ficha técnica— con rigor histórico (datos de NSSDC y science.nasa.gov).

---

## 2. Flujo de experiencia

```
Inicio / Portada
   └─ "El cementerio de las estrellas" (título evocador)
   └─ Elige ubicación:  🌕 Luna  |  🔴 Marte  |  🪐 Más allá
        └─ Catálogo de misiones (tarjetas 3D con miniatura del robot)
             └─ Experiencia en primera persona (POV del robot)
                  ├─ Narración en primera persona (AWS Polly) + subtítulos por capítulos
                  ├─ Feed de cámara con estática/glitch (overlay de telemetría)
                  ├─ Mirar alrededor (look) desde el "ojo" del robot
                  ├─ Modo "Inspección" (vista exterior opcional, 360°/órbita)
                  ├─ Inspector de características (hotspots sobre partes propias)
                  ├─ Línea de tiempo de la misión
                  │    └─ Punto de bifurcación "¿Qué pasaría si…?" (rama opcional, etiquetada)
                  │         └─ "Reality check" → regresa a la historia real
                  └─ Corte eléctrico final (feed → estática → apagado)
                       └─ Vuelve al catálogo
```

**Principios UX:**
- **POV por defecto:** el usuario *es* el robot; mira alrededor con el ratón/touch (look), no con órbita externa.
- Feed de cámara con **estática/glitch** siempre presente como capa visual, modulada por la intensidad narrativa.
- Navegación por capítulos con *skip*, *replay* y *saltar a inspección exterior*.
- Todo clickeable: al mirar las partes propias (brazo, paneles) se revelan características a demanda.
- **Corte eléctrico** al final: la señal se degrada a estática y se apaga; el regreso al catálogo es posterior.
- La historia real es siempre el camino por defecto; el "what if" solo se activa por acción explícita del usuario y queda siempre marcado como hipotético.

---

## 3. Stack tecnológico

### Frontend
| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Framework | **React 18 + TypeScript + Vite** | Velocidad de desarrollo, HMR, tipado del catálogo |
| 3D | **three.js** | Motor de la escena |
| Binding React | **@react-three/fiber (R3F)** | Componentes declarativos de Three en React |
| Helpers 3D | **@react-three/drei** | OrbitControls, useGLTF, Environment, Text, Float, Html |
| Post-proceso | **@react-three/postprocessing** | Bloom, DoF, grading, **estática/glitch (shader propio)** |
| Controles POV | **Pointer Lock API / drei** | Look en primera persona (ratón/touch) |
| Estado | **Zustand** | Estado global de la escena/misión/audio, sin boilerplate |
| UI | **Tailwind CSS + shadcn/ui** | Overlay glassmorphism + HUD de telemetría |
| Animación UI | **framer-motion** | Transiciones de UI/overlay |
| Animación cámara | **GSAP** o `maath` (tween) | Movimientos de cámara en inspección exterior |
| Subtítulos | Componente propio sincronizado | WebVTT o JSON de marcas de tiempo |

### 3D / Assets
- Modelos en **Blender**, exportados a **glTF/GLB** con:
  - **Esqueleto (armature)** → *skinning* para articulaciones (ruedas, mástil, paneles, antena, brazos).
  - **Morph targets (blend shapes)** → "expresiones": atenuar luces, abrir paneles, bajar antena, acumular polvo.
  - **Nodo "ojo" (POV)** → un Empty/hueso en la cámara del robot para anclar la vista en primera persona.
- **Draco compression** para GLB ligeros.
- Estilo visual: **low-poly estilizado pero reconocible** (silueta fiel al hardware real), texturas PBR de la NASA cuando aplique (dominio público).

### Audio / AWS
| Componente | Tecnología |
|------------|-----------|
| Narración TTS | **AWS Polly** (voces Neural, con SSML) — monólogo interno del robot |
| Efectos ambientales | Web Audio API (viento marciano, silencio lunar, telemetría) |
| Estática/glitch (sonido) | Ruido blanco filtrado + clics de señal |
| Corte eléctrico | Power-down (tono que baja + clic de relé) → silencio |
| Música | Loop ambiental sutil (opcional, generado o licencia libre) |
| Subtítulos | Transcritos manualmente + marcas de tiempo (Precisión > ASR) |
| Almacenamiento | Amazon S3 (audios mp3) + CloudFront (opcional) |

### Datos
- **Catálogo como JSON tipado** (`missions/*.json` o una API). Campos ver `§5`.
- Datos históricos curados de NSSDC y science.nasa.gov (enlaces del `context.md`).

### Despliegue
- **Vercel / Netlify** (estático) o **AWS Amplify** si quieres mantener todo en AWS.
- CDN para los GLB y audios.

---

## 4. Arquitectura del proyecto

```
ecospace/
├─ index.html
├─ vite.config.ts
├─ tailwind.config.ts
├─ components.json            # shadcn/ui
├─ public/
│  ├─ models/                 # GLB comprimidos
│  │  ├─ moon/
│  │  │  ├─ eagle.glb
│  │  │  ├─ surveyor3.glb
│  │  │  └─ lrv.glb
│  │  ├─ mars/
│  │  │  ├─ opportunity.glb
│  │  │  ├─ insight.glb
│  │  │  └─ ingenuity.glb
│  │  └─ beyond/
│  │     ├─ pioneer10.glb
│  │     └─ kepler.glb
│  ├─ audio/                  # mp3 generados por Polly
│  └─ textures/               # superficies Luna/Marte (photogrammetry/NASA)
├─ src/
│  ├─ data/
│  │  ├─ catalog.ts           # tipos + datos curados
│  │  └─ missions/            # un .ts/.json por misión
│  ├─ store/
│  │  └─ useAppStore.ts       # Zustand: escenario, misión, capítulo, modo real/hipotético, staticLevel, audio
│  ├─ three/
│  │  ├─ Scene.tsx            # Canvas raíz
│  │  ├─ Robot.tsx            # carga GLB, useAnimations, morph
│  │  ├─ Environment.tsx      # superficie + cielo/estrellas
│  │  ├─ PovCamera.tsx        # cámara POV en el "ojo" + look (pointer lock)
│  │  ├─ CameraRig.tsx        # cámara guiada para inspección exterior
│  │  ├─ StaticOverlay.tsx    # feed de cámara: estática/glitch + corte eléctrico
│  │  ├─ Hotspots.tsx         # puntos de características
│  │  └─ effects.ts           # postprocessing
│  ├─ audio/
│  │  ├─ PollyClient.ts       # wrapper de AWS Polly (o fetch a Lambda)
│  │  ├─ useNarration.ts      # hook: reproducir, pausar, subtítulos
│  │  └─ ambient.ts           # Web Audio API (estática, power-down)
│  ├─ ui/
│  │  ├─ Cover.tsx
│  │  ├─ LocationPicker.tsx
│  │  ├─ Catalog.tsx
│  │  ├─ StoryOverlay.tsx     # subtítulos + controles capítulo
│  │  ├─ Hud.tsx              # overlay de telemetría (batería, señal, timestamp)
│  │  ├─ WhatIf.tsx           # rama hipotética + badge + reality-check
│  │  ├─ Inspector.tsx        # características a demanda
│  │  └─ Timeline.tsx
│  └─ App.tsx
└─ PLAN.md
```

---

## 5. Catálogo de misiones (modelo de datos)

```ts
type Location = "moon" | "mars" | "beyond";

interface Mission {
  id: string;                 // slug, p.ej. "opportunity"
  nssdcId?: string;           // "1969-059C" si aplica
  name: string;               // "Opportunity (MER-B)"
  nickname?: string;          // "Oppy"
  location: Location;
  celestialBody: string;      // "Marte · Meridiani Planum"
  launchDate: string;
  landingDate?: string;
  endDate: string;            // fin de la misión (o "activo")
  status: "active" | "inactive" | "lost-contact";
  modelPath: string;          // "models/mars/opportunity.glb"
  povAnchor?: string;         // nodo del GLB que sirve de "ojo" del robot (POV)
  summary: string;            // 1-2 frases
  facts: {                    // Inspector de características
    label: string;
    value: string;
    description: string;
  }[];
  hotspots: {                 // partes clicables en el 3D
    bone: string;             // hueso/objeto asociado
    title: string;
    description: string;
    position: [number, number, number];
  }[];
  science: {                  // descubrimientos (mostrar, no enumerar)
    title: string;
    detail: string;
  }[];
  story: Chapter[];           // guion por capítulos
  divergences?: Divergence[]; // ramas "¿Qué pasaría si…?" (contrafactuales opcionales)
  lastWords?: string;         // "última transmisión" si existe
  sourceUrl: string;          // enlace NASA/NSSDC
}

interface Chapter {
  title: string;
  audioKey: string;           // audio/moon/eagle_01.mp3
  transcript: string;         // texto para subtítulos
  cues: { time: number; text: string }[]; // subtítulos sincronizados
  camera?: "pov" | "inspect" | "orbit" | "wide" | "close";
  pov?: string;               // anclaje del "ojo" para el POV (p.ej. "mast_cam")
  staticLevel?: number;       // intensidad de estática/glitch (0-1)
  powerCut?: boolean;         // true en el capítulo del corte eléctrico final
  morph?: string;             // blend shape a activar
  animation?: string;         // clip a reproducir
}

interface Divergence {
  id: string;                 // slug de la rama, p.ej. "oppy-sin-tormenta"
  triggerChapter: number;     // capítulo (índice de `story`) donde se ofrece la rama
  premise: string;            // "¿Y si la tormenta de 2018 no hubiera tapado el Sol?"
  historicalFact: string;     // qué pasó realmente
  counterfactual: Chapter[];  // 1-2 capítulos hipotéticos cortos (con audio propio)
  realityCheck: string;       // "Esto no ocurrió: la tormenta sí llegó…"
  scienceLesson: string;      // la ciencia que enseña el contraste
  badge: "what-if";           // marca visual/auditiva de hipotético
}
```

### Misiones incluidas (de tus enlaces)

| Ubicación | Misión | ID NSSDC / ref | Nota |
|-----------|--------|----------------|------|
| 🌕 Luna | Apollo 11 LM "Eagle" (etapa de descenso) | 1969-059C | Primer alunizaje, Tranquility Base |
| 🌕 Luna | Apollo 12 LM "Intrepid" | 1969-099C | Aterrizó junto a Surveyor 3 |
| 🌕 Luna | Apollo 15 LM "Falcon" + LRV | 1971-063C | Primer rover lunar |
| 🌕 Luna | Surveyor 3 | science.nasa.gov | Único artefacto visitado por humanos; Apollo 12 recuperó su cámara |
| 🔴 Marte | Mars Pathfinder + Sojourner | science.nasa.gov | Primer rover de Marte |
| 🔴 Marte | Spirit y Opportunity (MER) | science.nasa.gov | "My battery is low and it's getting dark" |
| 🔴 Marte | InSight | science.nasa.gov | "My power's low, thanks for staying with me" |
| 🔴 Marte | Ingenuity (helicóptero) | science.nasa.gov | Primer vuelo motorizado en otro planeta |
| 🪐 Más allá | Dawn | science.nasa.gov | Orbitó Vesta y Ceres |
| 🪐 Más allá | NEAR Shoemaker | science.nasa.gov | Primer aterrizaje en un asteroide (Eros) |
| 🪐 Más allá | Pioneer 10 | science.nasa.gov | Primer objeto en dejar el sistema solar interior |
| 🪐 Más allá | Kepler | science.nasa.gov | Descubrió miles de exoplanetas |

> **Alcance MVP:** 1 misión de cada ubicación (ej. **Eagle**, **Opportunity**, **Pioneer 10**). El resto se añade como catálogo expandible.

---

## 6. Sistema 3D — estilo y técnica

### Referencia de estilo
El ejemplo `webgl_animation_skinning_morph` de Three.js tiene exactamente lo que necesitamos:
- **Skinned mesh** (esqueleto) para animar articulaciones.
- **Morph targets** para expresiones faciales.
- **GUI** para cambiar animaciones y pesos de morph en vivo.
- **OrbitControls** + timeline de progreso.

Aplicado a nuestros robots:
- **Skinning** = partes mecánicas reales: girar ruedas, mover el mástil Pancam, desplegar paneles solares, levantar el brazo robótico, girar la antena.
- **Morph targets** = estados emocionales/atmosféricos: luz de estatus que se atenúa (fade de emissive), panel de instrumentos que se abre, polvo acumulándose, antena que se "tristeza" baja al final.
- **Estética:** low-poly + colores de la NASA (gris titanio, blanco, naranja/kevlar, dorado de manta térmica MLI), con luz cinematográfica (una key dura del Sol + bloom sutil) y fondo estrellado con la superficie real (texturas de photogrammetry de la NASA, dominio público).

### Implementación en R3F

```tsx
// Robot.tsx (esquema)
const { scene, animations } = useGLTF(mission.modelPath);
const { actions, mixer } = useAnimations(animations, group);

useFrame((state, delta) => {
  // aplicar morph según capítulo (con lerp suave)
  const mesh = scene.getObjectByName("body");
  mesh.morphTargetInfluences![0] = THREE.MathUtils.lerp(
    mesh.morphTargetInfluences![0], targetMorph, delta * 2
  );
  mixer.update(delta);
});
```

- **Materiales con emissive** para la "luz de estatus" que se enciende/apaga al despertar.
- **PovCamera:** la cámara se ancla al nodo "ojo" del robot (mástil/cámara) y el usuario mira alrededor con look en primera persona (Pointer Lock).
- **CameraRig:** interpola posición/objetivo de cámara solo en el modo de inspección exterior (GSAP/maath).
- **StaticOverlay:** post-proceso de feed de cámara — estática procedimental, scanlines y glitch — cuya intensidad la controla `Chapter.staticLevel`.
- **PowerCut:** en el capítulo final, `staticLevel` sube a 1 y la escena se apaga (fade a negro + corte de audio).
- **Hotspots:** `drei <Html>` anclado a huesos para el inspector de características.
- **Órbita libre:** `OrbitControls` se activa solo en el modo de inspección exterior.

### Cámara en primera persona (POV)
- La cámara se sitúa en `povAnchor` (el "ojo" del robot) y hereda su orientación.
- Controles: **look** con ratón/touch (Pointer Lock API), sin traslación libre (el robot no se mueve en su entorno salvo lo que la historia indique).
- El overlay de telemetría (HUD) refuerza la sensación de estar "dentro" de la máquina.

### Estática, glitch y corte eléctrico
- **Estática/glitch:** shader de post-proceso (ruido procedural + distorsión UV + scanlines + aberración cromática). Intensidad modulada por `staticLevel` y por eventos (aterrizaje, tormenta, pérdida de señal).
- **Corte eléctrico final:** secuencia de cierre → el feed sube a estática total → la escena y el audio se apagan bruscamente → silencio/negro → regreso suave al catálogo.
- Este corte *es* la "última transmisión", pero vivida desde dentro: la máquina deja de "ver" y de "oír".

---

## 7. Audio y AWS Polly

### Flujo
1. Guion curado por misión (con rigor histórico), escrito como **monólogo interno en primera persona**.
2. SSML con pausas, énfasis (`<prosody>`, `<break>`) y entonación natural.
3. Generar mp3 con **Polly Neural** (voz masculina/femenina según el "personaje" del robot). Ej. `Joanna`/`Matthew` (EN) o es-ES/MX si quieres español.
4. Subir a S3, servir por CloudFront, reproducir con `<audio>`/Howler.
5. Subtítulos sincronizados desde `cues` (no ASR, para garantizar precisión).

### Wrapper de Polly (serverless recomendado)
Una **Lambda** que reciba `{ text, voice, ssml }` y devuelva la URL del mp3 en S3. Así no expones credenciales en el front.

```ts
// PollyClient.ts
export async function synthesize(text: string, voice: string): Promise<string> {
  const res = await fetch(API_URL + "/synthesize", {
    method: "POST",
    body: JSON.stringify({ text, voice, engine: "neural" }),
  });
  return (await res.json()).url;
}
```

### Ambient / SFX (Web Audio API)
- **Luna:** silencio absoluto + tono grave de telemetría (la Luna no tiene atmósfera → sin viento).
- **Marte:** viento débil filtrado (paso-banda) + crujidos de polvo.
- **Espacio profundo:** pitidos de telemetría distantes, casi silencio.
- **Transiciones:** "wake-up" sound (power-on) cuando el robot despierta.
- **Estática/glitch (sonido):** ruido blanco filtrado y clics de señal que acompañan al overlay visual.
- **Corte eléctrico:** power-down (tono que baja + clic de relé) seguido de silencio absoluto.

---

## 8. Narrativa — estructura y ejemplos

### Registro narrativo (primera persona)
El narrador es el propio robot (primera persona). El usuario no observa a un robot contar su historia: **la está viviendo**. El monólogo interno, el feed con estática y el corte eléctrico final refuerzan esa identificación.

### Arco narrativo por misión (5 capítulos)
1. **El despertar** — El usuario "abre los ojos" como el robot: el feed arranca con estática y se estabiliza. Monólogo interno de presentación. Contexto: quién soy, cuándo y por qué fui enviado.
2. **El viaje** — Del lanzamiento a la llegada, vivido desde dentro. La emoción y el riesgo. (Estática en el aterrizaje + animación de despliegue.)
3. **La misión** — Descubrimientos contados como aventura, no como lista. (Ej. "Encontré pruebas de que aquí hubo agua…").
4. **El final** — La señal se degrada. Momento emocional desde dentro. (Morph: luz que se atenúa; `staticLevel` subiendo.)
5. **El corte eléctrico y el legado** — El feed se apaga (corte eléctrico). Silencio. Luego, una voz serena cierra el legado: qué dejó para las misiones de hoy.

### Ejemplo A — 🔴 Opportunity (Marte)
> *"Hola. Soy Oppy. Nací para durar 90 días… y viví 15 años."*
> - **Viaje:** 7 meses, aterrizaje con airbags rebotando.
> - **Misión:** encontré "blueberries" de hematita → evidencia de agua pasada; recorrí más de 45 km.
> - **Final (cita real):** *"My battery is low and it's getting dark."* (junio 2018, tormenta de polvo global) → corte eléctrico.
> - **Legado:** Spirit y Opportunity prepararon el camino para Curiosity y Perseverance.

### Ejemplo B — 🌕 Apollo 11 LM "Eagle" (etapa de descenso)
> *"Sigo aquí, en la base de Tranquilidad, desde el 20 de julio de 1969."*
> - **Viaje:** el descenso con "1202 alarm", los últimos segundos de combustible.
> - **Misión:** primer alunizaje humano; experimentos EASEP (sismómetro, reflector láser).
> - **Final:** la etapa de descenso quedó como plataforma de lanzamiento del ascenso.
> - **Legado:** el reflector láser aún se usa hoy para medir la distancia a la Luna.

### Ejemplo C — 🪐 Pioneer 10 (espacio profundo)
> *"Fui el primero en cruzar el cinturón de asteroides y en saludar a Júpiter."*
> - **Viaje:** lanzado 1972, primer sobrevuelo de Júpiter (1973).
> - **Misión:** imágenes de Júpiter, cinturón de radiación.
> - **Final:** última señal débil en 2003; hoy viaja hacia Aldebarán.
> - **Legado:** lleva la placa dorada con un mensaje de la humanidad.

### Modo "¿Qué pasaría si…?" (contrafactual educativo)

Además de la historia real, cada misión puede ofrecer **ramas hipotéticas** que no reemplazan el relato real, sino que lo refuerzan. La regla de oro: **nunca mezclar los dos registros**.

- **La historia real es el camino por defecto.** Si el usuario no interactúa, solo vive lo que pasó.
- **Puntos de bifurcación:** en la línea de tiempo aparecen nodos punteados con una pregunta del tipo *"¿Qué pasaría si…?"*. Se activan solo con un tap/clic explícito.
- **Siempre etiquetado:** la rama hipotética lleva badge "HIPOTÉTICO" (color propio), tratamiento visual distinto en la escena (viñeta/saturación) y voz/efecto de audio diferenciado.
- **"Reality check":** toda rama termina con una transición que dice *"Esto no ocurrió. Lo que sí pasó fue…"* y devuelve al punto real de la timeline.
- **Lección de ciencia:** cada "what if" se apoya en ingeniería real; el contraste explica *por qué* pasó lo real.

El "what if" no es fantasía: es un **contrafactual educativo** que parte de un near-miss o una falla documentada y enseña la restricción científica que definió el resultado.

| Misión | "¿Qué pasaría si…?" | Realidad que enseña |
|--------|--------------------|---------------------|
| Opportunity | …la tormenta de 2018 no hubiera tapado el Sol | Por qué los rovers solares mueren por polvo en los paneles |
| Spirit | …no se hubiera atascado en la arena ("Troy", 2009) | Mecánica de suelos sueltos y tracción |
| InSight | …el topo (HP³) hubiera logrado excavar | La costra del regolito marciano (*duricrust*) |
| Apollo 11 | …la alarma "1202" hubiera forzado abortar | El margen de error del ordenador de abordo |
| Surveyor 3 | …el Apolo 12 no hubiera aterrizado a su lado | La única visita humana a un artefacto en otro mundo |
| Kepler | …la segunda rueda de reacción no hubiera fallado (2013) | Cómo nació la misión extendida K2 |
| Ingenuity | …las aspas no se hubieran dañado en el vuelo 72 | La fragilidad del vuelo en una atmósfera tenue |

> **Límites:** máximo 1–3 ramas por misión, siempre basadas en hechos reales (no fantasía), y siempre con retorno a la realidad.

---

## 9. UI/UX — overlay

- **Estilo:** glassmorphism oscuro (paneles translúcidos) sobre la escena 3D, tipografía grande y legible para estudiantes.
- **HUD de telemetría (POV):** overlay con batería, señal, timestamp y "REC/cámara" que refuerza estar "dentro" del robot; se degrada a la par del `staticLevel`.
- **Estática/glitch:** capa visual permanente con intensidad variable; en el corte final llena la pantalla y se apaga.
- **Inspector de características:** al hacer clic en un hotspot, panel lateral con el dato (p.ej. "Pancam: 2 cámaras, 1024×1024") y la explicación en lenguaje simple.
- **Línea de tiempo:** barra horizontal con hitos de la misión, clicable. El camino real es una línea sólida; las ramas hipotéticas se dibujan en **línea punteada** con badge "HIPOTÉTICO" y botón persistente "Volver a la historia real".
- **Controles de audio:** reproducir/pausar, velocidad, subtítulos on/off.
- **Accesibilidad:** subtítulos, contraste, navegación por teclado, textos alternativos, opción de reducir/desactivar estática y look automático.

---

## 10. Fases / Roadmap

| Fase | Entregable | Duración est. |
|------|-----------|---------------|
| **0. Investigación** | Curar datos de 3 misiones (Eagle, Opportunity, Pioneer 10) desde NSSDC/science.nasa.gov | 2-3 días |
| **1. Esqueleto** | Vite + React + TS + R3F + Tailwind + Zustand; escena vacía con planeta/estrellas | 1-2 días |
| **2. Catálogo** | JSON tipado + UI de selección Luna/Marte/Más allá | 1-2 días |
| **3. Robot 1** | Modelo GLB con skinning + morph + nodo "ojo" (POV) (Blender) e integración en R3F | 4-6 días |
| **4. Narración** | Guion en primera persona + Polly SSML + reproducción + subtítulos sincronizados | 2-3 días |
| **5. Interacción** | Cámara POV + look, hotspots, inspector, timeline, cámara de inspección exterior | 3-4 días |
| **6. Pulido** | Estática/glitch, corte eléctrico, SFX, transiciones, performance (Draco, lazy loading) | 2-3 días |
| **7. Escalado** | Añadir misiones restantes del catálogo | continuo |

---

## 11. Riesgos y consideraciones

- **Precisión (crítico):** validar fechas, citas y cifras contra NSSDC/science.nasa.gov. No inventar "últimas palabras" si no están documentadas (las de Opportunity e InSight sí lo están).
- **Mareo en POV (motion sickness):** mirar en primera persona puede marear; incluir sensibilidad ajustable, desactivar look automático y ofrecer la vista exterior como alternativa.
- **Estática/glitch excesiva:** puede molestar o reducir legibilidad; limitar intensidad/frecuencia y permitir desactivarla (accesibilidad).
- **Performance:** GLB con Draco, carga diferida por misión, límite de luces, texturas comprimidas. Apuntar a < 5 MB por misión.
- **Costo de Polly:** Neural TTS es barato; cachear mp3 en S3 (no regenerar).
- **Precisión de los "what if":** cada rama hipotética debe nacer de un hecho o near-miss documentado y estar siempre etiquetada como tal; jamás presentar el contrafactual como historia real.
- **Accesibilidad:** siempre subtítulos; el audio es complemento, no única vía.
- **Mobile:** look táctil en POV, overlay responsive, reducir postprocessing en móvil.

---

## 12. Siguientes pasos concretos

1. **Elegir el MVP:** recomiendo **Opportunity** como primera misión completa (historia más emotiva y documentada).
2. **Curar el guion en primera persona** de Opportunity (5 capítulos, ~60-90 s de audio por capítulo), con su corte eléctrico final.
3. **Montar el boilerplate** Vite + React + R3F + Tailwind.
4. **Modelar** Opportunity en Blender (o partir de un asset base y personalizar) **con un nodo "ojo" (POV)** para la cámara en primera persona.
5. **Crear la Lambda de Polly** y generar el primer capítulo de audio.
6. **Definir 1-2 "what if"** por misión MVP (basados en hechos reales) con su reality-check.
7. **Implementar el feed de estática** y el corte eléctrico final (shader de post-proceso).

¿Quieres que empiece ya con alguna de estas fases? Por ejemplo, el boilerplate (fase 1), el guion en primera persona de Opportunity (fase 0/4), o el shader de estática/corte eléctrico.
