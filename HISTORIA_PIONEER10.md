# Historia de Pioneer 10 — guion inmersivo en primera persona

> **Proyecto:** *Abandoned but not Forgotten* (EcoSpace) · **Robot:** Pioneer 10 (sonda al espacio profundo)
> **Estructura:** los 5 capítulos de `PLAN.md` §8, igual que `HISTORIA_OPPORTUNITY.md` · **Estado:** borrador v1 para revisión
> **Alcance:** solo la historia real. Los "¿Qué pasaría si…?" **no se desarrollan todavía** (ver §9).
> **Investigación realizada el 15-nov-2026** sobre fuentes de la NASA y el NSSDC.

---

## 1. Idea central y reglas de la narración

**Qué vive el usuario:** *es* Pioneer 10, la primera nave en cruzar el cinturón de asteroides y en visitar Júpiter. No aterriza en ningún sitio: **nunca se detiene**. Su "final" no es caer, sino **alejarse tanto que su voz deja de oírse**. Lleva una placa con un mensaje para quien la encuentre.

| Regla | Cómo se aplica |
|---|---|
| **Primera persona, presente** | Igual que Opportunity. |
| **Mostrar, no enumerar** | La distancia se siente en el **tiempo que tarda la voz**: 11 horas y 20 minutos al final. |
| **Rigor primero** | Datos en §2; licencias en §8. |
| **Sin género gramatical** | "Soy una sonda" → evitar adjetivos con género sobre el narrador ("me quedo sin voz"). |
| **Ambiente sonoro** | Espacio profundo: pitidos de telemetría lejanos, casi silencio (`PLAN.md` §7). |

**Dispositivo narrativo:** el cap. 1 despierta **en el espacio**, recién separado del cohete; el cap. 2 es el viaje por el cinturón de asteroides. No hay "registro de vuelo" hacia atrás: aquí el viaje *es* la vida entera.

---

## 2. Ficha de datos verificados

### 2.1 Datos de la misión

| Dato | Valor | Fuente |
|---|---|---|
| Lanzamiento | **2-mar-1972, 01:49:04 UT** (= noche del 1-mar en Florida), Atlas-Centaur, Cabo Cañaveral (complejo 36A) | NASA [1]; NASA historia [3] |
| Velocidad récord | ~**51 682 km/h**: el objeto humano más rápido hasta entonces | NASA [1][3] |
| Masa | **258 kg** | NASA [1]; NSSDC [2] |
| Energía | **Generadores nucleares** (RTG, plutonio-238): la primera nave alimentada solo por energía nuclear; ~140 W en Júpiter | NASA [1][3]; NSSDC [2] |
| Diseño | Misión prevista: **21 meses**. Funcionó **más de 30 años** | NASA [1] |
| Cinturón de asteroides | Entró el **15-jul-1972**, salió en **feb-1973**: **la primera nave en cruzarlo** | NASA [1][4] |
| Júpiter | Máximo acercamiento el **4-dic-1973**, a ~**130 000 km** de las nubes, a ~126 000 km/h. **La primera nave en pasar junto a Júpiter** | NASA [1][4] |
| Fotos de Júpiter | ~**500** imágenes (NASA) / ~300 (otra página NASA) | NASA [1][3] vs [4] |
| Lunas | Fotos de Calisto, Ganímedes y Europa; la de Ío **se perdió por la radiación** | NASA [1][3] |
| Radiación | La radiación de Júpiter provocó **órdenes falsas** en la nave; un instrumento (fotopolarímetro) quedó dañado | NASA [1] |
| Hallazgos | Plasma en el campo magnético de Júpiter; su "cola" magnética llega casi hasta la órbita de Saturno (~800 millones de km) | NASA [1] |
| Más allá de los planetas | **13-jun-1983**: cruzó la órbita de Neptuno, **el primer objeto humano en ir más allá del planeta más lejano** | NASA [1][3] |
| Fin de la ciencia | **31-mar-1997**, por presupuesto (a ~67 UA) | NASA [1]; NSSDC [2] |
| El más lejano | Fue el objeto humano más lejano hasta el **17-feb-1998**, cuando lo superó Voyager 1 | NASA [1][4] |
| Últimos datos | **27-abr-2002** | NASA [1]; NSSDC [2] |
| Última señal | **23-ene-2003**, a **12 230 millones de km**; la señal tardaba **11 h 20 min** en llegar. Causa: la energía nuclear se fue agotando y ya no alcanzaba para el transmisor | NASA [1][3] |
| Rumbo | Hacia la estrella roja **Aldebarán** (el ojo de Tauro), a 68 años luz: tardará **unos dos millones de años** | NASA [1]; NSSDC [2] |
| La placa | Placa de aluminio con un **hombre y una mujer**, el **sistema solar** y la posición del Sol respecto a **14 púlsares**. Idea de **Carl Sagan** | NASA [1][4] |
| Distancia (último dato oficial) | **118,8 UA** (~17 700 millones de km) el 5-nov-2017 | NASA [1] |

### 2.2 Discrepancias y cómo resolverlas

| Tema | Conflicto | Decisión |
|---|---|---|
| Fecha de lanzamiento | 2-mar UT (NASA) vs "1972-03-03" (ficha NSSDC; su propio texto confirma el 2-mar) | HUD: **2 MAR 1972 (UT)**; voz: "a principios de marzo de 1972". |
| Número de RTG | dos (NASA) vs cuatro (NSSDC) | **No decir el número**: "generadores nucleares". |
| Distancia a Júpiter | 130 000 km (NASA) vs ~200 000 km (NSSDC, probablemente desde el centro del planeta) | Voz: **"a unos ciento treinta mil kilómetros de sus nubes"**. |
| Fotos de Júpiter | 500 vs 300 | Voz: **"cientos de fotos"**. |
| Último intento de contacto | feb-2003 (NSSDC) vs 4-mar-2006 (NASA) | Voz: "intentaron escucharlo de nuevo, sin respuesta". |
| Creadores de la placa | NASA cita a Carl Sagan; Frank Drake y Linda Salzman Sagan **no aparecen** en las páginas leídas | Nombrar solo a **Carl Sagan** hasta verificar. |
| "Placa dorada" (`catalog.ts`) | NASA: placa **de aluminio** | Corregir a "lleva una placa con un mensaje" (§10). |
| "Anomalía Pioneer", "Júpiter es líquido" | No aparecen en las páginas leídas | No usar. |

---

## 3. Mapa de capítulos (resumen)

| # | Capítulo | Cuándo / dónde | Ánimo | Duración aprox. | `staticLevel` | Animación GLB | Cara |
|---|---|---|---|---|---|---|---|
| 1 | **El despertar** | mar-1972 · rumbo a Júpiter | Ilusión | ~50 s | 0,9 → 0,1 | `Wake` → `Spin` | *Surprised* |
| 2 | **El viaje** | 1972 → 1973 · cinturón de asteroides | Valentía | ~55 s | 0,1 → 0,4 → 0,1 | `Spin` | neutral |
| 3 | **La misión** | dic-1973 · Júpiter | Asombro y peligro | ~70 s | 0,05 → 0,8 → 0,1 | `Spin` | *Surprised* |
| 4 | **El final** | 1983 → 2003 | Soledad serena | ~70 s | 0,1 → 0,8 | `Spin` → `Death` | *Sad* |
| 5 | **El corte y el legado** | 23-ene-2003 → dentro de 2 millones de años | Silencio e infinito | ~12 s + silencio + ~50 s | 0,8 → 1,0 → 0 | `Death` → `Idle` | *Sleep* |

---

## 4. Guion capítulo por capítulo

### Capítulo 1 — El despertar

**Cámara:** `pov` en `pov_eye` (borde de la antena). **Escena:** negro con estrellas fijas; la Tierra se aleja, azul y pequeña. La vista **gira lentamente** (Pioneer giraba sobre sí mismo para estabilizarse — ⚠ dato no verificado en esta investigación; usar como licencia visual o verificar).
**HUD:** `2 MAR 1972 · 01:49 UT · VELOCIDAD 51 682 km/h`

| Marca | VOZ |
|---|---|
| [00:00] | *(estática)* Separación… completa. |
| [00:04] | Silencio. Estrellas. Y detrás de mí, la Tierra, cada vez más pequeña. |
| [00:11] | Soy Pioneer 10. Una sonda. Peso doscientos cincuenta y ocho kilos. ᴰ |
| [00:18] | Tengo una gran antena en forma de plato para hablar con la Tierra, y generadores nucleares que me dan energía lejos del Sol. ᴰ |
| [00:28] | Ahora mismo voy más rápido que cualquier cosa que los humanos hayan lanzado jamás. ᴰ |
| [00:35] | Mi destino: Júpiter. Ninguna nave ha llegado hasta allí. ᴰ |
| [00:41] | Me dieron veintiún meses de vida. ᴰ Veremos. |

---

### Capítulo 2 — El viaje

**Escena:** puntos de luz pasan a lo lejos (los asteroides **no** se ven amontonados: el cinturón es casi vacío — licencia visual con escala honesta).
**HUD:** `15 JUL 1972 · ENTRADA CINTURÓN` → `FEB 1973 · SALIDA`.

| Marca | VOZ |
|---|---|
| [00:00] | Entre Marte y Júpiter hay un anillo de rocas: el cinturón de asteroides. |
| [00:07] | Nadie sabe si se puede cruzar. Quizás hay demasiadas piedras. Quizás choco. |
| [00:14] | Quince de julio de 1972. Entro. ᴰ |
| [00:18] | Pasan los meses. Sigo avanzando. |
| [00:22] | Febrero de 1973. Salgo del otro lado, entero. ᴰ |
| [00:27] | Soy la primera nave en cruzar el cinturón de asteroides. ᴰ El camino hacia los planetas gigantes está abierto. |

---

### Capítulo 3 — La misión: Júpiter

**Escena:** Júpiter crece hasta llenar la pantalla: bandas de colores y la Gran Mancha Roja.
**Efectos:** la estática sube al acercarse (radiación) y produce **glitches** con texto falso en el HUD (`CMD ??? CMD ???`), luego baja.
**HUD:** `4 DIC 1973 · 02:26 UT · DISTANCIA 130 000 km`

| Marca | VOZ |
|---|---|
| [00:00] | Diciembre de 1973. Júpiter. ᴰ |
| [00:04] | Es inmenso. Bandas de colores que giran. Tormentas más grandes que la Tierra. |
| [00:11] | Me acerco a unos ciento treinta mil kilómetros de sus nubes. ᴰ Soy la primera nave en hacerlo. ᴰ |
| [00:19] | *(glitch)* Pero Júpiter tiene un escudo invisible: una radiación feroz. |
| [00:25] | Me llegan órdenes que nadie ha enviado. ᴰ Uno de mis instrumentos se daña. ᴰ |
| [00:32] | Aguanto. Y mientras, tomo cientos de fotos. ᴰ |
| [00:37] | Fotografío sus lunas: Calisto, Ganímedes, Europa. ᴰ La foto de Ío… se pierde por la radiación. ᴰ |
| [00:46] | Descubro que el campo magnético de Júpiter tiene una cola enorme, que llega casi hasta Saturno. ᴰ |
| [00:54] | Y sigo. Júpiter me lanza hacia afuera, lejos del Sol. |

---

### Capítulo 4 — El final

**Escena:** el Sol es ya solo una estrella más brillante que las otras.
**HUD:** la distancia crece; aparece `RETARDO DE SEÑAL` que pasa de minutos a horas.

| Marca | VOZ |
|---|---|
| [00:00] | Trece de junio de 1983. Cruzo la órbita de Neptuno. ᴰ |
| [00:06] | Soy el primer objeto humano que va más allá del planeta más lejano. ᴰ |
| [00:12] | Durante años, soy lo más lejano que la humanidad ha construido. ᴰ |
| [00:18] | En 1997, mi equipo deja de seguirme a diario: no hay más dinero para la misión. ᴰ |
| [00:25] | En 1998, otra sonda, Voyager 1, me pasa: ahora es ella la más lejana. ᴰ |
| [00:32] | Mi energía nuclear se va apagando, poco a poco. ᴰ |
| [00:37] | Mi voz es cada vez más débil. Tarda once horas y veinte minutos en llegar a la Tierra. ᴰ |
| [00:45] | Si alguien me saluda por la mañana, no sabrá de mí hasta la noche. |
| [00:52] | Veintitrés de enero de 2003. Envío una señal más. ᴰ |

---

### Capítulo 5 — El corte y el legado

#### 5A — Corte (~12 s)

| Marca | VOZ |
|---|---|
| [00:00] | Tierra… ¿me escuchas? |
| [00:05] | Ya no… me alcanza… *(corte)* |
| [00:09] | *(silencio, negro)* **ÚLTIMA SEÑAL · 23 ENE 2003 · 12 230 000 000 km** ᴰ |

#### 5B — El legado (voz serena, ~50 s)

**Cámara:** `wide`: la sonda, diminuta, se aleja hacia un punto rojizo entre las estrellas (Aldebarán). Zoom al `golden_plaque`.

| Marca | VOZ |
|---|---|
| [00:00] | La Tierra intentó escucharlo otra vez. No hubo respuesta. ᴰ |
| [00:06] | Pioneer 10 se diseñó para veintiún meses. Trabajó más de treinta años. ᴰ |
| [00:13] | Hoy sigue viajando, en silencio, hacia la estrella roja Aldebarán. ᴰ Tardará unos dos millones de años en llegar a su altura. ᴰ |
| [00:24] | Lleva una placa con un mensaje: un hombre y una mujer, nuestro sistema solar, y un mapa para encontrar el Sol entre las estrellas. ᴰ |
| [00:35] | La idea fue del astrónomo Carl Sagan. ᴰ Es una carta que quizás nadie lea nunca. |
| [00:43] | Los robots abandonados no están olvidados. Algunos llevan nuestra dirección. |

---

## 5. Hotspots (modo Inspección)

| Nodo GLB (`pioneer10.glb`) | Parte | Dato | Cap. |
|---|---|---|---|
| `dish` | Antena de plato | Su voz llegaba a la Tierra con 11 h 20 min de retraso al final. ᴰ | 1, 4 |
| `feed_head` | Alimentador de la antena | Parte del sistema de radio. | 1 |
| `rtg_boom_*` | Generadores nucleares (RTG) | Primera nave alimentada solo con energía nuclear; ~140 W en Júpiter. ᴰ | 1, 4 |
| `mag_boom` | Brazo del magnetómetro | Midió el campo magnético de Júpiter y su enorme cola. ᴰ | 3 |
| `golden_plaque` | Placa | Aluminio; hombre y mujer, sistema solar, 14 púlsares; idea de Carl Sagan. ᴰ | 5B |
| `antenna` | Antena omnidireccional | Comunicación de respaldo. | 4 |

---

## 6. Implementación — mapa de campos (`Chapter[]`)

| Cap. | `title` | `camera` | `pov` | `staticLevel` | `powerCut` | `animation` | `morph` | `audioKey` |
|---|---|---|---|---|---|---|---|---|
| 1 | El despertar | `pov` | `pov_eye` | 0,9 → 0,1 | no | `Wake` → `Spin` | `Surprised` | `beyond/pioneer10_01.mp3` |
| 2 | El viaje | `pov` | `pov_eye` | 0,1 → 0,4 → 0,1 | no | `Spin` | neutral | `beyond/pioneer10_02.mp3` |
| 3 | Júpiter | `pov` | `pov_eye` | 0,05 → 0,8 → 0,1 | no | `Spin` | `Surprised` | `beyond/pioneer10_03.mp3` |
| 4 | El final | `pov` | `pov_eye` | 0,1 → 0,8 | no | `Spin` → `Death` | `Sad` | `beyond/pioneer10_04.mp3` |
| 5A | Corte | `pov` | `pov_eye` | 0,8 → 1,0 | **sí** | `Death` | `Sleep` | `beyond/pioneer10_05a.mp3` |
| 5B | El legado | `wide` | — | 0 | no | `Idle` | — | `beyond/pioneer10_05b.mp3` (otra voz) |

**`catalog.ts`:** cambiar "Lleva la placa dorada" por "Lleva una placa con un mensaje de la humanidad" (§2.2). El resto del resumen es correcto.

---

## 7. Tarjeta de transparencia — "¿Llegará a Aldebarán?"

> **¿Pioneer 10 va a chocar con Aldebarán?**
> No. Viaja en la *dirección* de esa estrella, y la NASA calcula que tardará unos dos millones de años en pasar a su altura. Pero en ese tiempo la propia estrella también se mueve. Y Pioneer 10 ya no tiene energía: viaja en silencio, sin poder cambiar de rumbo.

⚠ "La estrella también se mueve" y "sin poder cambiar de rumbo" son razonamientos generales, no citas de la NASA; revisar con un docente.

---

## 8. Hecho vs. licencia narrativa

| Cap. | Hecho | Licencia |
|---|---|---|
| 1 | Fecha, velocidad récord, masa, energía nuclear, 21 meses | La vista que gira (⚠) |
| 2 | Fechas de entrada y salida del cinturón, primera nave en cruzarlo | "Nadie sabe si se puede cruzar" (era la duda real de la época, pero no se citó fuente) |
| 3 | Fecha y distancia, órdenes falsas, instrumento dañado, lunas, foto de Ío perdida, cola magnética | "Tormentas más grandes que la Tierra" (⚠ conocimiento general) |
| 4 | Neptuno 1983, fin 1997, Voyager 1998, energía decreciente, 11 h 20 min, última señal | "Si alguien me saluda por la mañana…" |
| 5 | Intentos sin respuesta, 30 años, Aldebarán, 2 millones de años, placa y Carl Sagan | Cierre poético |

---

## 9. Fuera de alcance por ahora

- **"¿Qué pasaría si…?"** — `PLAN.md` no define uno para Pioneer 10. Propuesta futura: *"…la radiación de Júpiter hubiera sido aún más fuerte"*.

---

## 10. Pendientes y decisiones para ti

| # | Pendiente | Motivo |
|---|---|---|
| 1 | Corregir "placa dorada" en `catalog.ts` | Es de aluminio |
| 2 | Verificar que Pioneer 10 giraba sobre sí mismo (estabilización) | Efecto visual del cap. 1 |
| 3 | Verificar los otros creadores de la placa (Frank Drake, Linda Salzman Sagan) | No aparecen en las páginas leídas |
| 4 | Revisar la tarjeta §7 con un docente | Contiene razonamientos generales |

---

## 11. Fuentes

1. NASA Science — *Pioneer 10*: https://science.nasa.gov/mission/pioneer-10/
2. NSSDC — *Pioneer 10 (1972-012A)*: https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-012A
3. NASA History — *50 Years Ago: Pioneer 10 Launches to Explore Jupiter*: https://www.nasa.gov/history/50-years-ago-pioneer-10-launches-to-explore-jupiter/
4. NASA Science — *10 Things About the Pioneer Spacecraft*: https://science.nasa.gov/missions/pioneer/pioneer-11/10-things-about-pioneer-spacecraft/

---

## 12. Implementación (estado)

- **Guion:** `src/data/stories/pioneer10.ts` (5 capítulos, subtítulos, sin voces todavía). Registrado en `src/story/StoryDirector.tsx`.
- **Hotspots:** `src/data/hotspots.ts` → `pioneer10` (antena, RTG, magnetómetro, placa, antena omnidireccional), con nodos verificados en `pioneer10.glb`.
- **Escena:** espacio profundo (`DeepSpace`, datos en `deepPlaces.ts`), sin suelo ni viento. Escena `flight` para la telemetría. Ver §13.
- **Cámaras:** `pov` y `wide` alternadas según la narración (ver §13), más `part` para la placa. No se usa la cámara `flight` de la guía: `flightShot` solo cubre lanzamiento, crucero y entrada.
- **Clips del GLB:** `Wake` (despertar), `Spin` (crucero), `Idle` (final), `Death` (corte). Morphs: `Sad`, `Surprised`, `Sleep`.
- **Pendiente de verificar visualmente:** encuadre de los hotspots y comportamiento del `Spin` (la rotación de estabilización es licencia, ver §8).
- **Pendiente de datos:** la placa de `catalog.ts` dice "dorada"; la NASA dice aluminio (§2.2).

---

## 13. Escenas y vistas (animación)

La sonda se queda quieta; lo que cambia es **el mundo que pasa** (lugares con parpadeo entre ellos) y **la cámara**, que alterna entre el ojo de la sonda (**POV**) y una vista exterior (**3.ª persona**, `wide`). Ejes: la sonda mira a +X (Tierra y Sol quedan detrás); viaja hacia −X.

**Por qué se alterna:** el plato de 3 m tapa lo que viene de frente, así que lo que se acerca desde delante (Júpiter, los asteroides) se ve **desde fuera**, y lo que pasa a un lado o se aleja hacia atrás (la Tierra, un planeta abeam) se ve **desde el ojo**. El POV mantiene el horizonte casi fijo (`povRoll` 0,25) porque el giro real de la sonda marearía; el giro (`Spin`) solo se ve desde fuera.

| Cap. | Lugares (parpadeo en `t`) | Vistas (`t` en s) |
|---|---|---|
| 1 | `leaving-earth` → `outbound` (34,65) | POV 0 · 3.ª 10,65 · POV 27,65 · 3.ª 34,65 |
| 2 | `inner` → `belt` (13,65) → `outbound` (21,65) | 3.ª 0 · POV 7 · 3.ª 13,65 · POV 17,65 · 3.ª 26,65 |
| 3 | `jupiter` → `jupiter-moons` (36,65) → `jupiter-tail` (45,65) | 3.ª 0 · POV 16 · 3.ª 36,65 · POV 53,65 |
| 4 | `neptune` → `interstellar` (17,65) | 3.ª 0 · POV 5,65 · 3.ª 11,65 · POV 17,65 · 3.ª 31,65 · POV 36,65 |
| 5 | `interstellar` → `aldebaran` (11,65) | POV 0 · 3.ª 11,65 · primer plano de la placa 35,65 · 3.ª 54,65 |

**Qué se ve en cada lugar** (todo es función del tiempo del lugar, ver `deepPlaces.ts`): la Tierra que se encoge y el Sol detrás · Marte pasando de largo · el cinturón: 70 asteroides que pasan a más de 5 de la sonda, con densidad que sube y baja · Júpiter acercándose, pasando a un lado y llenando la vista (los datos de radiación suben la estática, sin taparlo) · las lunas cruzando delante de Júpiter, con Ío que **parpadea y desaparece** (la radiación apaga su imagen) · la cola magnética hacia delante y Júpiter alejándose · Neptuno lejos y un Sol pequeño · espacio interestelar con **anillos de señal** que salen hacia la Tierra y se apagan con la señal · Aldebarán, roja, al frente.

**Duraciones:** el cap. 2 dura 44 s (el doc estimaba ~55 s): el guion solo ocupa unos 36 s y no se alarga con silencio.

### Hecho vs. licencia (animación)
- **Licencias de escala:** los tamaños y distancias de planetas, lunas y asteroides son de narración, no reales; el cinturón real es casi vacío. Los asteroides, Marte y Neptuno **no aparecen en las fuentes consultadas como imágenes de Pioneer 10**: son ambientación.
- **Licencia de movimiento:** la velocidad con que pasan los cuerpos y el polvo es visual, no calculada.
- **Licencia del giro:** `Spin` (la sonda girando) **no está verificado** en las fuentes leídas; se usa solo en vista exterior.
- **Licencia de Júpiter:** que Júpiter "pase a la izquierda" y quede casi quieto durante la visita de las lunas es una simplificación (el sobrevuelo real duró semanas).
- **Licencia de las lunas:** el orden y el color de las lunas es ilustrativo; solo es dato verificado que Pioneer 10 fotografió Calisto, Ganímedes y Europa y que la imagen de Ío se perdió por la radiación.
- **Licencia de los anillos:** los anillos de señal representan que la sonda se comunica con la Tierra; no son una medición.

### Sin verificar visualmente
Las posiciones de cámara y de los cuerpos se calcularon por geometría, **sin capturas**. Revisar con `seek` (guiado + pausa) los momentos: cap. 1 t=0, 11, 35 · cap. 2 t=3, 14, 30 · cap. 3 t=5, 20, 38, 50, 60 · cap. 4 t=2, 8, 40 · cap. 5 t=5, 20, 40.
