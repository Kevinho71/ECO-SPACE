# Historia de Mars Pathfinder — guion inmersivo en primera persona

> **Proyecto:** *Abandoned but not Forgotten* (EcoSpace) · **Robot:** Mars Pathfinder (módulo "Carl Sagan Memorial Station") + rover **Sojourner**
> **Estructura:** los 5 capítulos de `PLAN.md` §8, igual que `HISTORIA_OPPORTUNITY.md` · **Estado:** borrador v1 para revisión
> **Alcance:** solo la historia real. Los "¿Qué pasaría si…?" **no se desarrollan todavía** (ver §9).
> **Investigación realizada el 15-nov-2026** sobre fuentes de la NASA, el JPL y el NSSDC.

---

## 1. Idea central y reglas de la narración

**Qué vive el usuario:** *es* el módulo de aterrizaje de Pathfinder, una estación con forma de flor que se abre en Marte. A su lado viaja **Sojourner**, el primer vehículo con ruedas en otro planeta, pequeño como un horno de microondas. El narrador es la estación; Sojourner es su compañero: **la historia es una amistad**.

| Regla | Cómo se aplica |
|---|---|
| **Primera persona, presente** | La estación habla. Sojourner no habla: se mueve, y la estación lo mira. |
| **Mostrar, no enumerar** | El aterrizaje con airbags se vive como una pelota gigante que rebota; las rocas tienen nombres de dibujos animados. |
| **Rigor primero** | Datos en §2; licencias en §8. |
| **Sin causas inventadas** | El final ocurrió **"por razones desconocidas"** (NSSDC). El guion no inventa un motivo. |
| **Sin género gramatical** | "Soy una estación", "mi compañero de seis ruedas" → preferir "Sojourner". |

---

## 2. Ficha de datos verificados

### 2.1 Datos de la misión

| Dato | Valor | Fuente |
|---|---|---|
| Lanzamiento | 4-dic-1996, 06:58 UT (1:58 a. m. hora del Este), Delta II, Cabo Cañaveral | NASA [1]; NSSDC [2] |
| Crucero | ~7 meses (212 días, calculado de las fechas) | Calculado de [1][2] |
| Entrada | ~7 300 m/s (≈ 26 000 km/h). El escudo térmico la frena a 400 m/s en ~160 s | NSSDC [2] |
| Secuencia de aterrizaje | Escudo → paracaídas de 12,5 m → airbags inflados en ~0,3 s (bola de 5,2 m) → retrocohetes a 98 m → cable cortado a 21,5 m → caída | NSSDC [2] |
| Impacto y rebotes | ~18 m/s; **al menos 15 rebotes**; el primero, de unos 15 m de alto (NASA) / 12 m (NSSDC); se detuvo ~2,5 min después, a ~1 km del primer impacto | NASA [1]; NSSDC [2][4] |
| Aterrizaje | **4-jul-1997**, 16:57 UT | NASA [1]; NSSDC [2][4] |
| Lugar | **Ares Vallis**, una antigua llanura de inundación; 19,33° N, 33,55° O | NASA [1]; NSSDC [2][4] |
| Nombre de la estación | **Carl Sagan Memorial Station**, en honor al astrónomo, fallecido el año anterior | NASA [1]; NSSDC [4] |
| Nombre del rover | **Sojourner**, por **Sojourner Truth**, luchadora por los derechos civiles en EE. UU. | NASA [1] |
| Sojourner | 10,6 kg; 30 cm de alto; seis ruedas; **el primer vehículo con ruedas en otro planeta** | NASA [1]; JPL [3] |
| Bajada de Sojourner | Noche del 5-jul (hora de EE. UU.) = 6-jul ~05:40 UT, sol 2, por una rampa | NASA [1]; NSSDC [2][4] |
| Rocas | **Barnacle Bill** (parecida a una andesita volcánica), **Yogi**, **Scooby-Doo** (sedimentaria de suelo compactado) | NSSDC [5] |
| Datos enviados | Más de **16 500** imágenes de la estación y **550** del rover; más de **15** análisis químicos | NASA [1] |
| Hallazgos | Marte fue, en el pasado, **cálido y húmedo**; piedras redondeadas y posibles **conglomerados formados en agua corriente**; un gran **diluvio** pasó por Ares Vallis; **remolinos de polvo**; **nubes de hielo de agua** al amanecer; polvo **magnético** | NASA [1]; NSSDC [5] |
| Vida prevista | Estación: **30 días**. Sojourner: **7 días** | NSSDC [6]; JPL [3] |
| Vida real | Sojourner: **83 días**. Estación: **3 veces** lo previsto | JPL [3]; NSSDC [6] |
| Última transmisión | **27-sep-1997**; comunicación perdida "**por razones desconocidas**" | NASA [1]; NSSDC [2][4] |
| Fin de la misión | **10-mar-1998**, tras el último intento sin respuesta | NSSDC [6] |
| Coste | ~265 millones de dólares (incluye lanzamiento y operaciones); ejemplo del estilo "**más rápido, mejor, más barato**" | NSSDC [2][6] |
| Legado | El sistema de airbags y pétalos "se usó después, en varias versiones, para aterrizar otros rovers en Marte" | JPL [3] |

### 2.2 Discrepancias y cómo resolverlas

| Tema | Conflicto | Decisión |
|---|---|---|
| Altura del primer rebote | 15 m (NASA, NSSDC MESUR) vs 12 m (NSSDC catálogo) | Voz: **"más de diez metros"** (cierto con ambas cifras). |
| Número de rebotes | "unos 15" / "más de 15" / "al menos 15" | Voz: **"al menos quince veces"**. |
| Fecha de la bajada de Sojourner | 5-jul (EE. UU.) vs 6-jul (UT) | HUD: **SOL 2**; sin fecha en voz. |
| Altura a la que se inflan los airbags | ~100 m (NASA) vs ~10 s antes del suelo (NSSDC) | No decir la altura de los airbags; sí los retrocohetes "a unos cien metros". |
| Coordenadas en `catalog.ts` | `[19.13, -33.22]` vs NSSDC **19,33° N, 33,55° O** | **Corregir** `latlon` a `[19.33, -33.55]` (§10). |
| Distancia recorrida por Sojourner, concurso del nombre | No aparecen en las páginas leídas | **No se usan.** |
| Causa del final | Se suele hablar de batería y frío; las fuentes oficiales dicen "razones desconocidas" | **No dar causa.** |

---

## 3. Mapa de capítulos (resumen)

| # | Capítulo | Cuándo / dónde | Ánimo | Duración aprox. | `staticLevel` | Animación GLB | Cara |
|---|---|---|---|---|---|---|---|
| 1 | **El despertar** | 4-jul-1997 · Ares Vallis | Curiosidad | ~50 s | 0,9 → 0,1 | `Open` → `Idle` | *Surprised* |
| 2 | **El viaje** *(registro)* | dic-1996 → jul-1997 | Vértigo | ~75 s | 0,3 → 1,0 → 0,2 | `Open` | *Surprised* |
| 3 | **La misión** *(2 escenas)* | jul–sep 1997 | Alegría | ~100 s | 0,05 | `Idle`, `Drive` (Sojourner) | neutral |
| 4 | **El final** | 27-sep-1997 | Incertidumbre | ~50 s | 0,1 → 0,7 | `Idle` → `Death` | *Sad* |
| 5 | **El corte y el legado** | 1997 → 1998 → hoy | Silencio y gratitud | ~10 s + silencio + ~50 s | 0,7 → 1,0 → 0 | `Death` | *Sleep* |

---

## 4. Guion capítulo por capítulo

### Capítulo 1 — El despertar

**Cámara:** `pov` en `pov_eye` (`mast_head`). **Escena:** los pétalos se abren y aparece un llano rocoso de color óxido bajo un cielo rosado-anaranjado.
**HUD:** `SOL 001 · 4 JUL 1997 · ARES VALLIS`
**SFX:** viento marciano muy suave.

| Marca | VOZ |
|---|---|
| [00:00] | *(estática)* Sistemas… despertando. |
| [00:04] | Mis pétalos se abren, como una flor de metal. *(clip `Open`)* |
| [00:09] | Piedras. Muchas piedras, de todos los tamaños, regadas por un llano rojizo. |
| [00:16] | Soy una estación en Marte. Me pusieron el nombre de Carl Sagan, un astrónomo que soñaba con este planeta. ᴰ |
| [00:25] | No vengo sin compañía. Sobre uno de mis pétalos viaja Sojourner: un rover pequeñito, de seis ruedas. ᴰ |
| [00:34] | Estamos en Ares Vallis: hace mucho tiempo, aquí corrió una inundación gigante. ᴰ |
| [00:41] | Pero antes de contarte qué encontramos… déjame recordar cómo llegamos. *(→ cap. 2)* |

---

### Capítulo 2 — El viaje (registro de vuelo)

**HUD:** `4 DIC 1996 · LANZAMIENTO` → `CRUCERO` → `4 JUL 1997 · ENTRADA` → `PARACAÍDAS` → `AIRBAGS` → `COHETES` → `REBOTE 1…15` → `REPOSO`.
**Efectos:** la pantalla gira y salta en cada rebote (con opción de reducir movimiento).

| Marca | VOZ |
|---|---|
| [00:00] | Reproduciendo registro de vuelo. |
| [00:04] | Cuatro de diciembre de 1996. Un cohete Delta II nos lanza desde Florida. ᴰ |
| [00:11] | Siete meses de viaje en silencio. ᴰ |
| [00:16] | Cuatro de julio de 1997. Entro en el aire de Marte a más de veinticinco mil kilómetros por hora. ᴰ |
| [00:24] | Mi escudo se pone al rojo. Se abre un paracaídas. ᴰ |
| [00:30] | Y entonces me envuelvo en airbags: soy una pelota gigante de más de cinco metros. ᴰ |
| [00:37] | A unos cien metros del suelo, unos cohetes me frenan. ᴰ Se corta el cable… y caigo. |
| [00:44] | *(golpe)* ¡Boing! Reboto más de diez metros hacia arriba. ᴰ |
| [00:49] | Y otra vez. Y otra. Al menos quince rebotes. ᴰ |
| [00:55] | Ruedo durante dos minutos y medio, casi un kilómetro… ᴰ y me detengo. |
| [01:03] | Se desinflan los airbags. Me abro. |

---

### Capítulo 3 — La misión

#### Escena 3A — Las primeras ruedas

**Cámara:** `pov` mirando a Sojourner bajar por la rampa (clip `Drive` en `sojourner`).

| Marca | VOZ |
|---|---|
| [00:00] | Sol dos. Sojourner se levanta hasta su altura completa: treinta centímetros. ᴰ |
| [00:07] | Baja por una rampa, despacito… y sus ruedas tocan Marte. |
| [00:13] | Es la primera vez que un vehículo con ruedas rueda por otro planeta. ᴰ |
| [00:19] | Le pusieron Sojourner por Sojourner Truth, una mujer que luchó por la libertad y la igualdad. ᴰ |
| [00:27] | Lo primero que hace es acercarse a una roca. Los científicos la llaman Barnacle Bill. ᴰ |

#### Escena 3B — Rocas con nombre y un pasado de agua

| Marca | VOZ |
|---|---|
| [00:00] | Cada roca recibe un apodo: Barnacle Bill, Yogi, Scooby-Doo. ᴰ |
| [00:07] | Sojourner las toca con su instrumento y nos dice de qué están hechas. Hacemos más de quince análisis químicos. ᴰ |
| [00:15] | Yo miro todo con mi cámara: más de dieciséis mil quinientas imágenes. ᴰ |
| [00:22] | Hay piedras redondeadas, como las de un río. Y rocas hechas de piedritas pegadas, que se forman con agua que corre. ᴰ |
| [00:32] | Marte, hace mucho, fue más cálido y húmedo. ᴰ |
| [00:37] | Veo nubes de hielo al amanecer. ᴰ Y remolinos de polvo que pasan bailando junto a mí. ᴰ |
| [00:45] | A Sojourner le dieron siete días de vida. Lleva más de ochenta. ᴰ A mí me dieron treinta. Llevo el triple. ᴰ |

**Hotspots:** `sojourner`, `soj_mast`, `soj_wheel_*`, `petal_*`, `mast_head`.

---

### Capítulo 4 — El final

**HUD:** `SOL 083 · 27 SEP 1997` *(sol aproximado: verificar)*; `SEÑAL` parpadea.

| Marca | VOZ |
|---|---|
| [00:00] | Veintisiete de septiembre de 1997. ᴰ |
| [00:05] | Envío mis datos a la Tierra, como cada día. |
| [00:10] | Sojourner está cerca, esperando instrucciones que pasan a través de mí. |
| [00:17] | Termino la transmisión. ᴰ |
| [00:21] | Y después… no sé qué pasa. Nadie lo sabe. ᴰ |
| [00:27] | *(estática sube)* Mi voz no vuelve a llegar a la Tierra. |

---

### Capítulo 5 — El corte y el legado

#### 5A — Corte (~10 s)

| Marca | VOZ |
|---|---|
| [00:00] | Sojourner… sigue ahí. |
| [00:04] | Yo… *(corte)* |
| [00:07] | *(silencio, negro)* **ÚLTIMA TRANSMISIÓN · 27 SEP 1997** ᴰ |

#### 5B — El legado (voz serena, ~50 s)

| Marca | VOZ |
|---|---|
| [00:00] | La Tierra siguió escuchando durante meses. El 10 de marzo de 1998, el equipo dio la misión por terminada. ᴰ |
| [00:09] | Nunca se supo por qué se apagó la estación. ᴰ |
| [00:14] | Pathfinder demostró que se podía llegar a Marte de forma más rápida y más barata. ᴰ |
| [00:21] | Y su forma de aterrizar, con airbags y pétalos, se volvió a usar para llevar otros rovers a Marte. ᴰ Años después, Opportunity rebotó igual. |
| [00:32] | La estación Carl Sagan y Sojourner siguen en Ares Vallis, juntos, mirando las piedras que estudiaron. |
| [00:41] | Los robots abandonados no están olvidados. |

**Enlace con Opportunity:** "Opportunity rebotó igual" se apoya en `HISTORIA_OPPORTUNITY.md` §2 (airbags, NSSDC 2003-032A).

---

## 5. Hotspots (modo Inspección)

| Nodo GLB (`pathfinder.glb`) | Parte | Dato | Cap. |
|---|---|---|---|
| `petal_*` | Pétalos | Se abren como una flor; tienen paneles solares. | 1 |
| `mast` / `mast_head` | Mástil con cámara | Más de 16 500 imágenes. ᴰ | 1, 3B |
| `sojourner` | Rover Sojourner | 10,6 kg, 30 cm; primer vehículo con ruedas en otro planeta; 83 días (previsto: 7). ᴰ | 3 |
| `soj_wheel_*` | Ruedas de Sojourner | Seis ruedas. ᴰ | 3A |
| `soj_mast` | Instrumento de Sojourner | Analizaba la química de rocas como Barnacle Bill. ᴰ | 3B |
| `antenna` | Antena | La voz de los dos: Sojourner hablaba con la Tierra a través de la estación. | 4 |

---

## 6. Implementación — mapa de campos (`Chapter[]`)

| Cap. | `title` | `camera` | `pov` | `staticLevel` | `powerCut` | `animation` | `morph` | `audioKey` |
|---|---|---|---|---|---|---|---|---|
| 1 | El despertar | `pov` | `pov_eye` | 0,9 → 0,1 | no | `Open` → `Idle` | `Surprised` | `mars/pathfinder_01.mp3` |
| 2 | El viaje | `pov` (telemetría) | — | 0,3 → 1,0 → 0,2 | no | `Open` | `Surprised` | `mars/pathfinder_02.mp3` |
| 3A | Las primeras ruedas | `pov` | `pov_eye` | 0,05 | no | `Drive` | neutral | `mars/pathfinder_03a.mp3` |
| 3B | Rocas con nombre | `pov` | `pov_eye` | 0,05 | no | `Idle` | neutral | `mars/pathfinder_03b.mp3` |
| 4 | El final | `pov` | `pov_eye` | 0,1 → 0,7 | no | `Idle` → `Death` | `Sad` | `mars/pathfinder_04.mp3` |
| 5A | Corte | `pov` | `pov_eye` | 0,7 → 1,0 | **sí** | `Death` | `Sleep` | `mars/pathfinder_05a.mp3` |
| 5B | El legado | `wide` | — | 0 | no | — | — | `mars/pathfinder_05b.mp3` (otra voz) |

**`catalog.ts`:** corregir `latlon` a `[19.33, -33.55]`. El resumen ("el primer rover en Marte, con un aterrizaje protegido por airbags que rebotaron") es correcto.

---

## 7. Tarjeta de transparencia — "¿Por qué se apagó?"

> **¿Se quedó Pathfinder sin batería?**
> Es lo que muchos suponen, pero la NASA nunca lo confirmó. La última transmisión llegó el 27 de septiembre de 1997 y, según los registros oficiales, la comunicación se perdió "por razones desconocidas". En ciencia, a veces la respuesta honesta es "no lo sabemos".

---

## 8. Hecho vs. licencia narrativa

| Cap. | Hecho | Licencia |
|---|---|---|
| 1 | Nombre Carl Sagan, Sojourner, Ares Vallis y su inundación | "Flor de metal" |
| 2 | Fechas, velocidad de entrada, secuencia, ≥15 rebotes, >10 m, 2,5 min, ~1 km | "¡Boing!" |
| 3 | Primer vehículo con ruedas, Sojourner Truth, nombres de rocas, cifras de imágenes y análisis, agua, nubes, remolinos, vidas previstas y reales | La relación de amistad |
| 4 | Última transmisión 27-sep-1997, causa desconocida | Que Sojourner "espera instrucciones" ese día |
| 5 | Fin 10-mar-1998, "más rápido, mejor, más barato", airbags reutilizados | Cierre poético |

---

## 9. Fuera de alcance por ahora

- **"¿Qué pasaría si…?"** — `PLAN.md` no define uno para Pathfinder. Propuesta futura: *"…los airbags no hubieran aguantado los rebotes"*.

---

## 10. Pendientes y decisiones para ti

| # | Pendiente | Motivo |
|---|---|---|
| 1 | Corregir `latlon` en `catalog.ts` | Coordenadas oficiales distintas |
| 2 | Confirmar el número de sol del 27-sep-1997 para el HUD | No se verificó |
| 3 | Buscar en el JPL la distancia total recorrida por Sojourner | Dato atractivo que no figura en las páginas leídas |

---

## 11. Fuentes

1. NASA Science — *Mars Pathfinder*: https://science.nasa.gov/mission/mars-pathfinder/
2. NSSDC — *Mars Pathfinder (1996-068A)*: https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A
3. JPL — *Mars Pathfinder / Sojourner Rover*: https://www.jpl.nasa.gov/missions/mars-pathfinder-sojourner-rover
4. NSSDC — *Mars Pathfinder (MESUR)*: https://nssdc.gsfc.nasa.gov/planetary/mesur.html
5. NSSDC — *Mars Pathfinder Science Results*: https://nssdc.gsfc.nasa.gov/planetary/marspath_results.html
6. NSSDC — *Mars Pathfinder Status Report* (10-mar-1998): https://nssdc.gsfc.nasa.gov/planetary/text/marspath_status.txt
