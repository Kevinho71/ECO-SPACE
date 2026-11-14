# Abandoned but not Forgotten — Plan detallado

> Storytelling sobre el equipo descartado de la NASA en la Luna, Marte y más allá.
> Experiencia web interactiva en 3D con Three.js + React, narración por audio (AWS Polly) y robots que "despiertan" para contar su propia historia.

---

## 1. Visión y concepto

Una **galería-museo 3D de exploradores olvidados**. El visitante (estudiante de primaria/secundaria o curioso) navega un mapa del sistema solar, elige un escenario (Luna / Marte / Más allá) y luego una misión. Al seleccionarla, el robot **cobra vida** en su entorno real (la superficie lunar, el polvo de Marte, el vacío del espacio profundo) y **narra su propia historia en primera persona**, con voz generada por AWS Polly, subtítulos sincronizados y un cuerpo articulado que gesticula (esqueletos/skinning) y cambia de expresión (morph targets).

**Pilar narrativo (del reto):** *"mostrar cómo operaron, no enumerar datos"*. Cada robot cuenta un arco emocional —no una ficha técnica— pero con rigor histórico (datos sacados de NSSDC y science.nasa.gov).

---

## 2. Flujo de experiencia

```
Inicio / Portada
   └─ "El cementerio de las estrellas" (título evocador)
   └─ Elige ubicación:  🌕 Luna  |  🔴 Marte  |  🪐 Más allá
        └─ Catálogo de misiones (tarjetas 3D con miniatura del robot)
             └─ Escena cinematográfica de la misión
                  ├─ Narración (AWS Polly) + subtítulos por capítulos
                  ├─ Modo "Explorar" (360° / órbita libre)
                  ├─ Inspector de características (hotspots sobre partes)
                  ├─ Línea de tiempo de la misión
                  │    └─ Punto de bifurcación "¿Qué pasaría si…?" (rama opcional, etiquetada)
                  │         └─ "Reality check" → regresa a la historia real
                  └─ "La última transmisión" (final emocional)
                       └─ Vuelve al catálogo
```

**Principios UX:**
- Navegación por capítulos con *skip*, *replay* y *saltar a explorar*.
- Todo clickeable en el 3D: partes del robot revelan características a demanda.
- Cámara con órbita libre (OrbitControls) en modo exploración; cámara guiada (tween) en modo historia.
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
| Post-proceso | **@react-three/postprocessing** | Bloom, profundidad de campo, grading cinematográfico |
| Estado | **Zustand** | Estado global de la escena/misión/audio, sin boilerplate |
| UI | **Tailwind CSS + shadcn/ui** | Overlay glassmorphism rápido y accesible |
| Animación UI | **framer-motion** | Transiciones de UI/overlay |
| Animación cámara | **GSAP** o `maath` (tween) | Movimientos de cámara cinematográficos |
| Subtítulos | Componente propio sincronizado | WebVTT o JSON de marcas de tiempo |

### 3D / Assets
- Modelos en **Blender**, exportados a **glTF/GLB** con:
  - **Esqueleto (armature)** → *skinning* para articulaciones (ruedas, mástil, paneles, antena, brazos).
  - **Morph targets (blend shapes)** → "expresiones": atenuar luces, abrir paneles, bajar antena, acumular polvo.
- **Draco compression** para GLB ligeros.
- Estilo visual: **low-poly estilizado pero reconocible** (silueta fiel al hardware real), como el personaje del ejemplo de Three.js.

### Audio / AWS
| Componente | Tecnología |
|------------|-----------|
| Narración TTS | **AWS Polly** (voces Neural, con SSML) |
| Efectos ambientales | Web Audio API (viento marciano, silencio lunar, telemetría) |
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
│  │  └─ useAppStore.ts       # Zustand: escenario, misión, capítulo, modo real/hipotético, audio
│  ├─ three/
│  │  ├─ Scene.tsx            # Canvas raíz
│  │  ├─ Robot.tsx            # carga GLB, useAnimations, morph
│  │  ├─ Environment.tsx      # superficie + cielo/estrellas
│  │  ├─ CameraRig.tsx        # cámara guiada vs órbita libre
│  │  ├─ Hotspots.tsx         # puntos de características
│  │  └─ effects.ts           # postprocessing
│  ├─ audio/
│  │  ├─ PollyClient.ts       # wrapper de AWS Polly (o fetch a Lambda)
│  │  ├─ useNarration.ts      # hook: reproducir, pausar, subtítulos
│  │  └─ ambient.ts           # Web Audio API
│  ├─ ui/
│  │  ├─ Cover.tsx
│  │  ├─ LocationPicker.tsx
│  │  ├─ Catalog.tsx
│  │  ├─ StoryOverlay.tsx     # subtítulos + controles capítulo
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
  camera?: "wide" | "close" | "orbit" | "inspect";
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
- **CameraRig:** interpola posición/objetivo de cámara según el capítulo (GSAP/maath).
- **Hotspots:** `drei <Html>` anclado a huesos para el inspector de características.
- **Órbita libre:** `OrbitControls` se activa solo en modo exploración.

---

## 7. Audio y AWS Polly

### Flujo
1. Guion curado por misión (con rigor histórico).
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

---

## 8. Narrativa — estructura y ejemplos

### Arco narrativo por misión (5 capítulos)
1. **El despertar** — El robot "abre los ojos" (morph: luz de estatus). Se presenta en primera persona. Contexto: quién es, cuándo y por qué fue enviado.
2. **El viaje** — Del lanzamiento a la llegada. La emoción y el riesgo. (Cámara wide + animación de despliegue.)
3. **La misión** — Descubrimientos contados como aventura, no como lista. (Ej. "Encontré pruebas de que aquí hubo agua…").
4. **El final** — La última transmisión, el silencio. Momento emocional. (Morph: luz que se atenúa, antena que baja.)
5. **El legado** — Qué dejó para las misiones de hoy. Reflexión final y llamada a la curiosidad.

### Ejemplo A — 🔴 Opportunity (Marte)
> *"Hola. Soy Oppy. Nací para durar 90 días… y viví 15 años."*
> - **Viaje:** 7 meses, aterrizaje con airbags rebotando.
> - **Misión:** encontró "blueberries" de hematita → evidencia de agua pasada; recorrió más de 45 km.
> - **Final (cita real):** *"My battery is low and it's getting dark."* (junio 2018, tormenta de polvo global).
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
- **Inspector de características:** al hacer clic en un hotspot, panel lateral con el dato (p.ej. "Pancam: 2 cámaras, 1024×1024") y la explicación en lenguaje simple.
- **Línea de tiempo:** barra horizontal con hitos de la misión, clicable. El camino real es una línea sólida; las ramas hipotéticas se dibujan en **línea punteada** con badge "HIPOTÉTICO" y botón persistente "Volver a la historia real".
- **Controles de audio:** reproducir/pausar, velocidad, subtítulos on/off.
- **Accesibilidad:** subtítulos, contraste, navegación por teclado, textos alternativos.

---

## 10. Fases / Roadmap

| Fase | Entregable | Duración est. |
|------|-----------|---------------|
| **0. Investigación** | Curar datos de 3 misiones (Eagle, Opportunity, Pioneer 10) desde NSSDC/science.nasa.gov | 2-3 días |
| **1. Esqueleto** | Vite + React + TS + R3F + Tailwind + Zustand; escena vacía con planeta/estrellas | 1-2 días |
| **2. Catálogo** | JSON tipado + UI de selección Luna/Marte/Más allá | 1-2 días |
| **3. Robot 1** | Modelo GLB con skinning + morph (Blender) e integración en R3F | 4-6 días |
| **4. Narración** | Guion + Polly SSML + reproducción + subtítulos sincronizados | 2-3 días |
| **5. Interacción** | Hotspots, inspector, timeline, cámara guiada vs órbita libre | 3-4 días |
| **6. Pulido** | Postprocessing, SFX, transiciones, performance (Draco, lazy loading) | 2-3 días |
| **7. Escalado** | Añadir misiones restantes del catálogo | continuo |

---

## 11. Riesgos y consideraciones

- **Precisión (crítico):** validar fechas, citas y cifras contra NSSDC/science.nasa.gov. No inventar "últimas palabras" si no están documentadas (las de Opportunity e InSight sí lo están).
- **Performance:** GLB con Draco, carga diferida por misión, límite de luces, texturas comprimidas. Apuntar a < 5 MB por misión.
- **Costo de Polly:** Neural TTS es barato; cachear mp3 en S3 (no regenerar).
- **Precisión de los "what if":** cada rama hipotética debe nacer de un hecho o near-miss documentado y estar siempre etiquetada como tal; jamás presentar el contrafactual como historia real.
- **Accesibilidad:** siempre subtítulos; el audio es complemento, no única vía.
- **Mobile:** OrbitControls táctiles, overlay responsive, reducir postprocessing en móvil.

---

## 12. Siguientes pasos concretos

1. **Elegir el MVP:** recomiendo **Opportunity** como primera misión completa (historia más emotiva y documentada).
2. **Curar el guion** de Opportunity (5 capítulos, ~60-90 s de audio por capítulo).
3. **Montar el boilerplate** Vite + React + R3F + Tailwind.
4. **Modelar** Opportunity en Blender (o partir de un asset base y personalizar).
5. **Crear la Lambda de Polly** y generar el primer capítulo de audio.
6. **Definir 1-2 "what if"** por misión MVP (basados en hechos reales) con su reality-check.

¿Quieres que empiece ya con alguna de estas fases? Por ejemplo, puedo montarte el boilerplate del proyecto (fase 1) o escribir el guion completo de Opportunity (fase 0/4).
