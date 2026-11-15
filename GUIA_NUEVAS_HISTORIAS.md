# Guía para animar las demás historias

> Basada en cómo quedó la historia de Opportunity (`HISTORIA_OPPORTUNITY.md` §12–13) y en lo aprendido al construirla.
> Robots pendientes: Eagle, Surveyor 3, Pathfinder, InSight, Ingenuity, Pioneer 10.
> Principio: **la historia es datos; el motor ya existe.** Una historia nueva debería ser sobre todo un archivo `src/data/stories/<robot>.ts` + sus lugares + algunas piezas 3D propias. Si estás tocando `StoryDirector` o `StoryCamera` para cada robot, algo va mal.

---

## 1. Cómo está hecho (mapa mental)

| Capa | Archivo | Qué hace |
|---|---|---|
| Guion (datos) | `src/data/stories/opportunity.ts`, tipos en `src/data/story.ts` | Capítulos con *keyframes*: subtítulos, cámara, lugar, estática, polvo, clips, expresiones, HUD, sfx, tarjetas |
| Motor | `src/story/StoryDirector.tsx` | Avanza el tiempo, muestrea los keyframes, escribe en `storyRuntime` (continuo, sin re-render) y en el store (discreto, solo si cambia) |
| Lugares | `src/three/environments/places.ts` | `PLACES`: paleta, niebla, relieve (`TerrainOpts`), props, `startX`. Geometrías cacheadas y precalentadas |
| Suelo | `src/three/environments/Ground.tsx` | Terreno, guijarros, rocas, props, huellas, polvo (todo en un grupo que se desplaza) |
| Viaje / piezas 3D especiales | `FlightScene.tsx`, `flightPath.ts`, `Spacecraft.tsx` | Etapas con cámara cinematográfica por funciones puras del tiempo |
| Cámara | `src/three/StoryCamera.tsx` | Vistas `pov`, `wide`, `part`, `flight` |
| Robot | `src/three/Robot.tsx` | Clips, expresiones, sigue el relieve, hundimiento, visibilidad |
| Interfaz | `StoryOverlay.tsx`, `StaticOverlay.tsx`, `BlinkOverlay.tsx`, `Hud.tsx` | Subtítulos, rótulos, estática, párpados, telemetría |

Regla de oro del motor: **valores continuos → `storyRuntime` (mutable); valores discretos → store (solo al cambiar).** No pongas en el store nada que cambie cada fotograma.

---

## 2. Receta para una historia nueva (en este orden)

1. **Investigar y fijar datos primero** (ficha como §2 de `HISTORIA_OPPORTUNITY.md`: dato, valor, fuente; discrepancias y qué se decide). Sin esto, el guion se reescribe dos veces. Las "últimas palabras" famosas suelen ser falsas: verificar antes.
2. **Escribir el guion en el `.md`** con la estructura de 5 capítulos y marcas de tiempo. Aprobarlo antes de tocar código.
3. **Inspeccionar el GLB** (una sola vez, con un script de lectura): nombres de nodos, clips disponibles, escala. Opportunity: `Idle/Wake/Death/Drive`, `pov_eye`, `mast_head`, `face` (morphs `Sad/Surprised/Sleep`). **Cada robot tiene nodos y clips distintos:** no asumir (Pathfinder usa `Open`; los demás pueden no tener `Drive`).
4. **Definir los lugares** en `PLACES` (o un `places` propio por mundo: Luna, espacio profundo). Reusar `TerrainOpts`; añadir una opción de relieve nueva solo si hace falta de verdad.
5. **Transcribir el guion a keyframes** (`<robot>.ts`). Copiar la estructura de `opportunity.ts`.
6. **Hotspots** en `src/data/hotspots.ts` (alimentan la demo de piezas y el modo exploración).
7. **Piezas 3D propias** solo si el guion las pide (cohete, retrocohetes, airbags, paracaídas…). Reusar `Puffs`, `Craft`, `flightShot`.
8. **Verificar visualmente** (§7) y actualizar el `.md` (licencias narrativas, §8).

---

## 3. Cómo se anima cada cosa (convenciones)

### Tiempo y capítulos
- Todos los tiempos en **segundos desde el inicio del capítulo**. 5 capítulos; 60–90 s cada uno salvo causa justificada (anotarla).
- El capítulo 3 puede dividirse en escenas con `marks` (se ven en la línea de tiempo).
- Un capítulo = un `StoryChapter`: `place0`, `jumps`, `cues`, `camera`, `staticLevel`, y lo demás opcional.

### Cambios de lugar: el **parpadeo**
- `jumps: [{ t, to }]`: los párpados empiezan a cerrarse en `t`, el lugar cambia en **`t + 0,3 s`** (lo más oscuro), se abren hasta `t + 0,8`.
- Pon el `jump` **~0,3–0,4 s antes** del cue que nombra el lugar.
- Todo lo que debe "saltar" (p. ej. `robotX` a 0, cámara) debe cambiar **dentro de la ventana oscura** (`t+0,25 … t+0,35`). Patrón de `robotX`: `{t+0.25, v: fin}`, `{t+0.3, v: 0}`.
- Un `jump` al **mismo lugar** sirve solo como parpadeo visual (abrir los ojos dentro del robot).
- Con "reducir efectos" el párpado es un fundido; no lo uses para información.

### Sensación de caminar (no muevas el robot)
- El robot se queda en el origen; **el grupo del suelo se desplaza** `-(startX + robotX)`. Así luces, sombras, niebla y cámara no cambian.
- `robotX` = metros recorridos **en ese lugar**; la velocidad se deriva sola. Usa velocidad visual de ~0,3–0,7 m/s (acelerada; declararlo como licencia narrativa).
- Lo que sustenta la sensación: **suelo con detalle cercano** (guijarros instanciados), huellas, polvo, cabeceo/alabeo del robot según el relieve y balanceo de cámara. Sin detalle cercano en el suelo no hay sensación de avance aunque se mueva.
- Atascado/hundido: `sink` (m) + `slip` (0–1); las ruedas giran sin avanzar.
- Cámara `wide` unos segundos mientras rueda o está atascado: es lo que más "vende" el movimiento.

### Cámaras (`camera: Keyframe<StoryView>[]`)
- `pov`: ojo del robot (por defecto). El usuario puede mirar alrededor; `pan` añade una panorámica automática.
- `wide`: órbita exterior.
- `part` + `partFocus`: primer plano orbitando un nodo (`node`, `hotspot`, `dist`, `az`, `el`). El giro orbital parte de cero en cada pieza. **`az` se mide desde +X (frente) hacia +Z (derecha)**; elegir ángulos desde donde la pieza no quede tapada por paneles/cuerpo (probar visualmente).
- `flight`: cámara cinematográfica definida por **función pura del tiempo** (`flightShot` en `flightPath.ts`); el mismo `t` da la misma toma (determinista al saltar con `seek`). Los cortes entre tomas van dentro de un parpadeo.

### Viaje y piezas especiales
- Cada etapa es una escena (`launch`, `cruise`, `entry`…) que depende de `place` y del tiempo del capítulo (`storyRuntime.t`), no de estado propio.
- Constantes de tiempo en un solo sitio (`FT` en `flightPath.ts`) **y deben coincidir con los `jumps` del guion** (swap = `jump.t + 0,3`).
- Partículas: usar `Puffs` (anillo de instancias reutilizado). Nunca crear objetos por partícula en React.
- El robot se oculta con `robot: Keyframe<boolean>[]` mientras viaja plegado.

### Efectos del feed
- `staticLevel` (0–1) para estática/glitch; **bájala cuando haya algo importante que ver** (con estática ≥0,5 se tapa un descenso entero).
- `dust` (tormenta), `powerOff` (corte CRT), `shake` (impactos, solo en cámaras que lo aplican), `battery`/`signal` para el HUD y el tono.
- Sonido sintetizado (`audio.ts`): añadir un `SfxKind` y su `case` en `playSfx`; no archivos.

### Mundos distintos (Luna, espacio profundo)
- Reusar el mismo sistema: un `PlaceId` por escenario y su entorno. `MarsScene` es el modelo; `LunarScene` aún no lee `storyPlace`. Hacer lo mismo que con Marte: precalentar geometrías, grupo de suelo desplazable, props por lugar.
- **Espacio profundo (hecho para Pioneer 10):** los lugares son datos en `deepPlaces.ts` (`DEEP_PLACES`: cuerpos con `path` por tiempo del lugar, asteroides, polvo, cola magnética, anillos de señal, resplandores) y `DeepSpace.tsx` los dibuja. Todo es función pura de `storyRuntime.placeT` (segundos desde que empezó el lugar; lo calcula `StoryDirector`). Un lugar nuevo = una entrada en `DEEP_PLACES` + su id en `DeepPlaceId`. La sonda mira a +X; los cuerpos que "pasan" van hacia +X.
- **Vista exterior configurable:** `StoryChapter.wide` (`WideShot`: `dist`, `height`, `az`, `swing`, `target`, `fov`). Sin ella, la órbita por defecto de siempre. Cámbiala con keyframes para alternar planos; la cámara se mueve sola con suavidad.
- **Horizonte estable:** `StoryChapter.povRoll` (0–1) limita cuánto del giro/balanceo del robot hereda la cámara POV. Úsalo con robots que giran (Pioneer) para no marear.
- **POV y modelos sin `mast_head`:** la cámara busca `mast_head` y, si no existe, `feed_head`. Un modelo nuevo debe tener uno de los dos con `pov_eye` colgando de él (si no, el POV no se mueve y no da error).
- **Obstáculos del propio modelo:** mira qué parte del robot tapa la vista antes de elegir `pan` (el plato de Pioneer tapa todo lo que viene de frente: eso se ve en `wide`).
- **Piezas que no están en el GLB** (p. ej. la cabina de Eagle): componente en `src/three/extras.tsx`, registrado por id en `MISSION_EXTRAS` (se dibuja con y sin historia). Su movimiento sale de **pistas con nombre** del capítulo: `tracks: { ascent: [...], fire: [...] }` → `storyRuntime.tracks.<nombre>` (interpoladas; las que un capítulo no define valen 0). No hace falta tocar el motor.
- **Lugares sin suelo en la Luna:** los que no tienen superficie (órbita, descenso) son `DeepPlaceId` y los dibuja `DeepSpace` (ej. `descent`: una esfera lunar enorme que sube hacia el robot, con `flame: true`); los que sí la tienen (`tranquility`, `LunarPlaceId`) usan `LunarScene`. `MissionScene` elige según el lugar.
- **Luna = sin viento:** usa `scene: 'flight'` en todos los capítulos (la escena `'surface'` mete un fondo de viento pensado para Marte).
- **Texto de las pantallas:** `Story.texts` (inicio, botón de explorar, pista, kicker del cierre); lo que falte usa los de Opportunity.
- **Modelo con `face_plate`:** la cámara POV busca `mast_head`, luego `feed_head` y luego `face_plate` como "cabeza".
- Ingenuity vuela (posición `y` y `pitch` por keyframes en vez de `robotX`). Añadir esos campos al tipo, no condicionales por robot.

---

## 4. Reglas de contenido (no negociables)

- Primera persona, presente, sin género gramatical; el cierre del cap. 5 es tercera persona.
- Todo número/fecha/cita sale de la ficha con fuente. **Lo inventado se declara** (§8: hecho vs. licencia).
- No inventar "últimas palabras". No dar el número de rebotes. No dar cifras de imágenes contradictorias.
- Citas en inglés original con traducción; atribuir autor y fuente.
- Accesibilidad: subtítulos, sonido on/off, "reducir estática y vibración" siempre funcionales.
- Los "¿Qué pasaría si…?" están fuera de alcance hasta nueva orden.

---

## 5. Lecciones aprendidas (qué salió bien)

1. **Guion en datos + motor genérico** permitió rehacer capítulos enteros editando un archivo.
2. **Funciones puras del tiempo** (`landingState`, `flightShot`, `rocketY`) hacen que `seek` y pausa funcionen sin lógica extra y se puedan razonar sin ejecutar.
3. **Mundo que se desplaza** en lugar de mover robot/luces: una decisión simple que evitó tocar sombras, niebla y cámara.
4. **Precalentar geometrías** por lugar para que el parpadeo no tenga tirones.
5. **Reusar los hotspots** como contenido de la demo de piezas: cero texto duplicado.
6. **Verificar con capturas por `seek`** encontró problemas que el tipado no ve (ver §6).

---

## 6. Errores cometidos (y cómo evitarlos)

| Error | Causa | Evitarlo |
|---|---|---|
| Cámara `part` terminaba detrás del robot | El giro orbital usaba el tiempo **absoluto** del capítulo | Cualquier animación por pieza/tramo debe ser relativa al inicio del tramo |
| Pieza tapada por paneles/cuerpo | Ángulo elegido "a ojo" | Probar cada pieza con captura; mirar primero el modelo desde fuera (modo libre) |
| Nave/objetos enormes y a contraluz | Escala 1:1 con cámara a 6 m | Calcular tamaño angular (`radio/distancia`) antes; añadir luces de relleno |
| Giro de la nave en el eje equivocado | `Euler` con eje de la nave = Y pero giraba en Z | Para girar sobre el eje propio, grupo anidado (rotación base fuera, giro dentro) |
| Posición de partículas/nave no se actualizaba | `position={vector}` en JSX se copia **una vez** | Mover objetos siempre en `useFrame` |
| Estática tapaba el descenso | `staticLevel` heredado de cuando no había imagen | Revisar `staticLevel` en cada capítulo al añadir contenido visual |
| Terreno con "pirámides" | `flatShading` + celdas de 0,6 m con poca amplitud | Suelo suave en lugares de juego; flat solo en rocas |
| Blueberries negras y enormes | Color y escala sin probar | Elegir color por captura; estilizar tamaño solo lo necesario |
| Robot flotaba/enterrado en bowl | La altura del terreno usa `y_local = −z_mundo` (plano girado) | Siempre `placeHeight(def, x, zw)`; nunca llamar `terrainHeight` con `z` directa (había un bug así en `Rocks`) |
| Ruta de ruedas en parche plano | `flattenStart/End` aplanaba la zona de la ruta | Aplanar solo donde el robot posa; `0/0.001` para no aplanar |

---

## 7. Cómo no quemar tokens

**Antes de escribir código**
- Leer **solo** lo que se va a tocar. Los archivos grandes (`opportunity.ts`, `Spacecraft.tsx`) se editan con reemplazos puntuales, no se releen enteros.
- No volver a leer un archivo recién editado: la herramienta ya confirma el cambio.
- Inspeccionar el GLB **una vez** con un script que imprima nodos/clips y no el binario.
- Decidir el diseño (plan) antes de implementar: cambiar de enfoque a mitad cuesta más que preguntar una vez.

**Al editar**
- Para cambios en muchos puntos, **un script Python en un archivo** (en el scratchpad) con `assert old in s` antes de cada reemplazo. Aplica todo de una vez y falla ruidosamente si algo no coincide.
- **No usar heredocs con comillas complicadas en el shell** (`<<'EOF'` con muchas comillas anidadas falló y no aplicó nada, y costó una vuelta entera). Escribir el script con la herramienta de archivos y ejecutarlo.
- Tras editar, **`npx tsc -b`** (ojo: `tsc --noEmit -p .` no comprueba nada con referencias de proyecto). Compilar antes de abrir el navegador.
- Edits relacionados en una sola respuesta, en paralelo.

**Al verificar visualmente (la parte más cara)**
- **Un solo script de capturas** que: entra a la misión, pone modo guiado, hace `seek`, **pausa**, espera y captura; recibe la lista de momentos como argumentos. Una ejecución, varias capturas.
- **Pausar antes de capturar** (`patchStory({ isPlaying:false })`): sin pausa, el tiempo sigue y la captura no corresponde al `seek`.
- Poner `cameraMode: 'guided'` al inicio del script (si una prueba anterior dejó el modo libre, **todas** las capturas salen inútiles y hay que repetirlas).
- Tras editar archivos, Vite recarga y **te saca de la misión**: re-entrar siempre al empezar el script.
- Esperar a que el render se asiente (~3 s en este equipo); en software el FPS es bajo.
- Elegir **pocos momentos clave por capítulo** (inicio de cada pieza/lugar, un impacto, un corte), no barridos.
- Mirar una captura en modo libre (`setCameraMode('free')`) cuando algo "no se entiende": una vista exterior resolvió en una captura lo que tres vistas POV no.
- Revisar `playwright-cli console error` una vez; ignorar el 404 de `favicon.ico`.
- Al terminar: borrar capturas (`sh_*.png`), `.playwright-cli`, `tsconfig.tsbuildinfo`, cerrar el navegador y **matar el servidor de desarrollo** (puerto 5199).

**Al comunicar**
- Resumen corto con lo que cambió y lo que **no** se verificó; no pegar listas de archivos que el `git status` ya muestra.

---

## 8. Lista de comprobación por historia

- [ ] Ficha de datos con fuentes; discrepancias resueltas; sin citas inventadas
- [ ] Guion aprobado en el `.md` (5 capítulos, tiempos, hecho vs. licencia)
- [ ] GLB inspeccionado: nodos (`pov_eye`, `mast_head`…), clips, morphs
- [ ] Lugares definidos; geometrías precalentadas; fog/sky por lugar
- [ ] `<robot>.ts` con `place0`, `jumps` (swap = t+0,3), cámaras, `staticLevel` revisada
- [ ] Hotspots añadidos y usados en la demo de piezas
- [ ] Movimiento: `robotX` con reinicio dentro del parpadeo; `wide` en los tramos que lo necesitan
- [ ] `npx tsc -b` limpio; `vite build` ok
- [ ] Capturas de los momentos clave (guiado + pausa); problemas corregidos
- [ ] "Reducir efectos", pausa, salto de capítulo y `seek` hacia atrás probados
- [ ] Otros robots siguen igual (lugar `generic`)
- [ ] `.md` de la historia actualizado (licencias narrativas, archivos)
- [ ] Limpieza: capturas, servidor, navegador
