# Historia de InSight — guion inmersivo en primera persona

> **Proyecto:** *Abandoned but not Forgotten* (EcoSpace) · **Robot:** InSight (módulo de aterrizaje geofísico en Marte)
> **Estructura:** los 5 capítulos de `PLAN.md` §8, igual que `HISTORIA_OPPORTUNITY.md` · **Estado:** borrador v1 para revisión
> **Alcance:** solo la historia real. Los "¿Qué pasaría si…?" **no se desarrollan todavía** (ver §9).
> **Investigación realizada el 15-nov-2026** sobre fuentes de la NASA, el JPL y el NSSDC.

---

## 1. Idea central y reglas de la narración

**Qué vive el usuario:** *es* InSight, un robot que **no se mueve**: su aventura es **escuchar**. Pone un oído en el suelo de Marte y siente los "martemotos" para descubrir cómo es el planeta por dentro. Su historia tiene un fracaso honesto (el "topo" que no pudo cavar) y un final lento: el polvo lo va tapando.

| Regla | Cómo se aplica |
|---|---|
| **Primera persona, presente** | Igual que Opportunity. |
| **Mostrar, no enumerar** | Los sismos se **oyen** (sonificación real de la NASA) y se sienten como vibración de cámara suave. |
| **Rigor primero** | Datos en §2; licencias en §8. |
| **Sin "últimas palabras" atribuidas al robot** | La frase famosa *"My power's really low…"* **no la envió el robot** (§2.3). |
| **Sin género gramatical** | "Soy un módulo de aterrizaje", "me quedo quieto" → "me quedo sin moverme". |

---

## 2. Ficha de datos verificados

### 2.1 Datos de la misión

| Dato | Valor | Fuente |
|---|---|---|
| Lanzamiento | 5-may-2018, 11:05 UT (4:05 a. m. hora del Pacífico), Atlas V 401, base de Vandenberg (California) | NASA [1]; NSSDC [2] |
| Compañeros de viaje | Dos minisatélites **MarCO** (del tamaño de un maletín) viajaron detrás y retransmitieron el aterrizaje | NASA [1]; NSSDC [2] |
| Aterrizaje | **26-nov-2018**, 19:52:59 UT (11:52 a. m. hora del Pacífico) | NASA [1]; NSSDC [2] |
| Lugar | **Elysium Planitia**, ~4,5° N, 135,9° E | NASA [1] |
| Cuerpo | 360 kg al aterrizar; brazo robótico de 1,8 m; dos paneles solares de 2,2 m de diámetro | NSSDC [2]; NASA [1] |
| Instrumentos | **SEIS** (sismómetro, de Francia/CNES), **HP³** ("el topo", sonda de calor de Alemania/DLR), **RISE** (seguimiento por radio del bamboleo de Marte) | NSSDC [2]; JPL [3] |
| Martemotos detectados | **1 319** en total | JPL [3]; JPL edu [6] |
| El mayor | Magnitud **~5**, el **4-may-2022** (sol 1 222): "el mayor sismo jamás observado en otro planeta". El récord anterior era de 4,2 (25-ago-2021) | JPL [4] |
| El núcleo | **Líquido**, más grande de lo esperado: radio de **1 830 km**; menos denso de lo previsto (con elementos ligeros mezclados con hierro) | JPL edu [6] |
| La corteza | Más delgada de lo esperado: capa superior de ~**10 km**; capas más densas hasta ~**40 km** | JPL edu [6] |
| El manto | Más frío que el de la Tierra; llega hasta **1 560 km** de profundidad | JPL edu [6] |
| El topo (HP³) | Diseñado para bajar **5 m**; el suelo **se apelmazaba** y no le daba fricción; acabó apenas bajo la superficie. Último intento: 500 golpes el 9-ene-2021; fin anunciado el **14-ene-2021** | JPL [3][5] |
| Cita sobre el topo | Tilman Spohn (investigador principal del HP³): *"We've given it everything we've got, but Mars and our heroic mole remain incompatible."* | JPL [5] |
| Polvo y energía | El polvo cubrió los paneles. A finales de 2022 producían **menos del 20 %** de su capacidad original. El equipo usó la pala para dejar caer tierra sobre los paneles en días de viento, para que el viento arrastrara el polvo | JPL [3][7] |
| Selfie final | 24-abr-2022 (sol 1 211): "InSight's Final Selfie" | JPL [8] |
| Una de sus últimas imágenes | 11-dic-2022 (sol 1 436): el sismómetro sobre el suelo | JPL [9] |
| Última comunicación | **15-dic-2022** | JPL [3]; NSSDC [2] |
| Sin respuesta | 18-dic-2022 no respondió | NASA [10] |
| Fin de la misión | **21-dic-2022**, tras dos sesiones seguidas sin respuesta | JPL [3] |
| Duración | Misión principal: ~2 años (un año marciano), hasta nov-2020; extendida hasta dic-2022: **más de 4 años** en Marte | NSSDC [2]; JPL [3] |

### 2.2 Discrepancias y cómo resolverlas

| Tema | Conflicto | Decisión |
|---|---|---|
| Fecha del final | Última comunicación 15-dic (JPL, NSSDC) vs "fin de misión" 15-dic (página de ciencia) vs declaración 21-dic (JPL) | Voz: "el 15 de diciembre llegó su último mensaje; el 21, la NASA se despidió". |
| Profundidad del topo | NSSDC: "unos 40 cm"; JPL: la sonda (que mide 40 cm) quedó "justo bajo la superficie" | Usar la versión del JPL. |
| "Imagen final" | Selfie final (abr-2022) vs una de las últimas imágenes (dic-2022) | Decir **"mi último selfie"** para abril y **"una de mis últimas fotos"** para diciembre. |
| Longitud en `catalog.ts` | `135.6` vs NASA **135,9° E** | Corregir a `[4.5, 135.9]` (§10). |
| "Siete minutos de terror" | No aparece en las páginas leídas de InSight | No usarlo. |
| "Primer lanzamiento interplanetario desde la costa oeste" | No aparece en las páginas leídas | No usarlo hasta verificar. |

### 2.3 La "última frase" de InSight — corrección importante

`catalog.ts` (`lastWords`) y `PLAN.md` §11 dan como documentada *"My power's really low, so this may be the last image I can send"*. **No se encontró en ninguna página oficial de la NASA o el JPL.** La frase circuló en las redes sociales de la misión en diciembre de 2022, escrita **por el equipo** en primera persona, **no transmitida por el robot**.

**Decisión:** igual que con Opportunity, el robot describe lo que sí pasó (poca energía, una de sus últimas fotos, último contacto el 15-dic) y una **tarjeta de transparencia** (§7) explica el origen. **Corregir `lastWords`** y la nota de `PLAN.md` §11.

---

## 3. Mapa de capítulos (resumen)

| # | Capítulo | Cuándo / dónde | Ánimo | Duración aprox. | `staticLevel` | Animación GLB | Cara |
|---|---|---|---|---|---|---|---|
| 1 | **El despertar** | 26-nov-2018 · Elysium Planitia | Calma | ~50 s | 0,9 → 0,1 | `Wake` → `Idle` | *Surprised* |
| 2 | **El viaje** *(registro)* | may → nov 2018 | Tensión | ~65 s | 0,3 → 1,0 → 0,2 | `Wake` | *Surprised* |
| 3 | **La misión** *(3 escenas)* | 2018 → 2022 | Escucha, frustración, asombro | ~140 s | 0,05 | `Dig`, `Idle` | neutral |
| 4 | **El final** | 2022 | Cansancio sereno | ~60 s | 0,1 → 0,7 | `Idle` → `Death` | *Sad* |
| 5 | **El corte y el legado** | 15-dic-2022 → hoy | Silencio y gratitud | ~12 s + silencio + ~50 s | 0,7 → 1,0 → 0 | `Death` | *Sleep* |

---

## 4. Guion capítulo por capítulo

### Capítulo 1 — El despertar

**Cámara:** `pov` en `pov_eye` (cámara del brazo). **Escena:** una llanura **muy plana y lisa**, casi sin rocas, de color óxido.
**HUD:** `SOL 000 · 26 NOV 2018 · ELYSIUM PLANITIA`

| Marca | VOZ |
|---|---|
| [00:00] | *(estática)* Contacto. Paneles… abriéndose. *(clip `Wake`)* |
| [00:06] | Una llanura enorme y plana. Casi sin piedras. |
| [00:11] | Soy InSight. No tengo ruedas: no vine a viajar. Vine a escuchar. |
| [00:18] | Tengo un brazo largo, de casi dos metros, ᴰ y dos paneles solares redondos, como abanicos. ᴰ |
| [00:26] | Estoy en Elysium Planitia, en Marte. ᴰ Elegimos este lugar porque es plano y tranquilo. |
| [00:33] | Mi misión: descubrir cómo es Marte por dentro. Su corteza, su manto, su corazón. ᴰ |
| [00:41] | Pero primero… déjame recordar cómo llegué. *(→ cap. 2)* |

---

### Capítulo 2 — El viaje (registro de vuelo)

**HUD:** `5 MAY 2018 · VANDENBERG` → `CRUCERO · MarCO A/B` → `26 NOV 2018 · ENTRADA` → `PARACAÍDAS` → `COHETES` → `CONTACTO`.

| Marca | VOZ |
|---|---|
| [00:00] | Reproduciendo registro de vuelo. |
| [00:04] | Cinco de mayo de 2018, de madrugada en California. Un cohete Atlas V me lanza desde la costa del Pacífico. ᴰ |
| [00:13] | No viajo sin compañía: detrás de mí van dos satélites diminutos, del tamaño de un maletín. Se llaman MarCO. ᴰ |
| [00:22] | Seis meses y medio después, llego a Marte. Ellos van a contarle a la Tierra, en directo, cómo aterrizo. ᴰ |
| [00:31] | Veintiséis de noviembre. Entro en la atmósfera. Mi escudo arde. Se abre el paracaídas. |
| [00:39] | Al final, mis cohetes me frenan hasta posarme con suavidad. *(nota: InSight no usó airbags)* |
| [00:45] | Contacto. ᴰ En la Tierra, mi equipo grita y se abraza. |
| [00:51] | Abro mis paneles. Tengo energía. Estoy en casa. |

**Nota de rigor:** "mi equipo grita y se abraza" es licencia (escena conocida pero no verificada en esta investigación); puede sustituirse por "en la Tierra reciben la señal".

---

### Capítulo 3 — La misión (3 escenas)

#### Escena 3A — El oído en el suelo

**Cámara:** `pov` desde el brazo (`arm`) colocando el sismómetro (`seis_dome`) en el suelo.

| Marca | VOZ |
|---|---|
| [00:00] | Con mi brazo, levanto con cuidado mi instrumento más importante: un sismómetro. ᴰ |
| [00:07] | Lo pongo en el suelo y lo cubro con una cúpula, para que el viento no lo moleste. |
| [00:14] | Ahora escucho. Día y noche. |
| [00:18] | *(sonido grave, sonificación NASA)* ¿Lo oyes? Es un martemoto. Marte tiembla. |
| [00:25] | Cada temblor viaja por dentro del planeta y me trae noticias de lo que atraviesa. |

#### Escena 3B — El topo que no pudo

**Cámara:** `pov` hacia el topo (no hay nodo propio en el GLB: usar `arm` + efecto).

| Marca | VOZ |
|---|---|
| [00:00] | Mi otro instrumento es un "topo": una sonda que debía martillar el suelo y hundirse cinco metros para medir el calor de Marte. ᴰ |
| [00:10] | *(golpecitos)* Martillea. Y martillea. Pero no baja. |
| [00:15] | El suelo aquí se apelmaza: no le da al topo el agarre que necesita. ᴰ |
| [00:21] | Mi equipo lo intenta todo durante casi dos años. Hasta lo empujo con mi pala. ᴰ |
| [00:29] | En enero de 2021, tras quinientos golpes más, se rinden. ᴰ |
| [00:35] | Uno de ellos lo dice así: *"Lo dimos todo, pero Marte y nuestro heroico topo siguen siendo incompatibles."* ᴰ |
| [00:44] | A veces la ciencia también es esto: aprender de lo que no sale. |

#### Escena 3C — El corazón de Marte

| Marca | VOZ |
|---|---|
| [00:00] | Cuatro de mayo de 2022. *(vibración fuerte)* El temblor más grande que nadie ha sentido jamás en otro planeta: magnitud cinco. ᴰ |
| [00:10] | En total escucho mil trescientos diecinueve martemotos. ᴰ |
| [00:15] | Con ellos, los científicos dibujan el interior de Marte. |
| [00:20] | Su corteza es más delgada de lo que pensaban. ᴰ Su manto, más frío que el de la Tierra. ᴰ |
| [00:28] | Y su corazón, el núcleo, es líquido y más grande de lo esperado: mil ochocientos treinta kilómetros de radio. ᴰ |
| [00:38] | Soy el primero en ver el interior de otro planeta… solo escuchando. |

**Nota:** "el primero en ver el interior de otro planeta" ⚠ — es la idea central de la misión, pero la frase literal no está en las páginas leídas; suavizar si no se confirma.

---

### Capítulo 4 — El final

**Efectos:** capa de polvo (morph/tinte naranja) que va cubriendo los paneles; la luz no baja de golpe como en Opportunity: **se apaga poco a poco**.
**HUD:** `BAT` cae por tramos durante 2022.

| Marca | VOZ |
|---|---|
| [00:00] | Marte es un planeta de polvo. Y el polvo cae sobre mis paneles, poco a poco. ᴰ |
| [00:08] | Mi equipo inventa un truco: echo tierra con mi pala sobre los paneles en días de viento, para que el viento barra el polvo. ᴰ |
| [00:18] | Ayuda un poco. Pero cada día tengo menos energía. |
| [00:23] | Abril de 2022: me hago mi último selfie. ᴰ Mis paneles ya están naranjas de polvo. |
| [00:31] | A finales de año produzco menos de una quinta parte de la energía con la que llegué. ᴰ |
| [00:38] | Apago casi todo. Solo dejo despierto mi oído: el sismómetro. ᴰ |
| [00:44] | Once de diciembre. Saco una de mis últimas fotos: mi sismómetro, quieto en el suelo. ᴰ |
| [00:52] | Quince de diciembre de 2022. Envío un mensaje a la Tierra. ᴰ |

---

### Capítulo 5 — El corte y el legado

#### 5A — Corte (~12 s)

| Marca | VOZ |
|---|---|
| [00:00] | Sigo escuchando… |
| [00:04] | …pero ya casi no… *(corte)* |
| [00:08] | *(silencio, negro)* **ÚLTIMA COMUNICACIÓN · 15 DIC 2022** ᴰ |

#### 5B — El legado (voz serena, ~50 s)

| Marca | VOZ |
|---|---|
| [00:00] | La Tierra volvió a llamar. InSight no respondió. ᴰ |
| [00:05] | El 21 de diciembre de 2022, la NASA dio por terminada la misión. ᴰ |
| [00:11] | Había venido para unos dos años. Trabajó más de cuatro. ᴰ |
| [00:17] | Escuchó mil trescientos diecinueve martemotos, ᴰ y gracias a ellos hoy sabemos que Marte tiene un núcleo líquido. ᴰ |
| [00:27] | Sus datos se seguirán estudiando durante años. |
| [00:32] | InSight sigue en Elysium Planitia, con su oído apoyado en el suelo. |
| [00:39] | Los robots abandonados no están olvidados. |

---

## 5. Hotspots (modo Inspección)

| Nodo GLB (`insight.glb`) | Parte | Dato | Cap. |
|---|---|---|---|
| `seis_dome` | Sismómetro SEIS (con cúpula) | 1 319 martemotos; el mayor, magnitud ~5 (4-may-2022). Hecho en Francia (CNES). ᴰ | 3A, 3C |
| `arm` | Brazo robótico | 1,8 m. Colocó los instrumentos y empujó el topo. ᴰ | 3A, 3B |
| `panel_L` / `panel_R` | Paneles solares | 2,2 m de diámetro cada uno; a finales de 2022, menos del 20 % de su energía. ᴰ | 1, 4 |
| `mast` / `mast_head` | Cámara | Hizo su "selfie final" el 24-abr-2022. ᴰ | 4 |
| `antenna` | Antena | Último mensaje: 15-dic-2022. ᴰ | 4, 5 |
| *(sin nodo)* | Topo HP³ | Debía bajar 5 m; el suelo apelmazado no lo dejó. **Propuesta:** añadir un nodo `mole` en `blender/models/insight.py`. ᴰ | 3B |

---

## 6. Implementación — mapa de campos (`Chapter[]`)

| Cap. | `title` | `camera` | `pov` | `staticLevel` | `powerCut` | `animation` | `morph` | `audioKey` |
|---|---|---|---|---|---|---|---|---|
| 1 | El despertar | `pov` | `pov_eye` | 0,9 → 0,1 | no | `Wake` → `Idle` | `Surprised` | `mars/insight_01.mp3` |
| 2 | El viaje | `pov` (telemetría) | — | 0,3 → 1,0 → 0,2 | no | `Wake` | `Surprised` | `mars/insight_02.mp3` |
| 3A | El oído en el suelo | `pov` | `pov_eye` | 0,05 | no | `Idle` | neutral | `mars/insight_03a.mp3` |
| 3B | El topo | `pov` | `pov_eye` | 0,05 | no | `Dig` | `Sad` (breve) | `mars/insight_03b.mp3` |
| 3C | El corazón de Marte | `pov` | `pov_eye` | 0,05 → 0,3 (sismo) → 0,05 | no | `Idle` | `Surprised` | `mars/insight_03c.mp3` |
| 4 | El final | `pov` | `pov_eye` | 0,1 → 0,7 | no | `Idle` → `Death` | `Sad` | `mars/insight_04.mp3` |
| 5A | Corte | `pov` | `pov_eye` | 0,7 → 1,0 | **sí** | `Death` | `Sleep` | `mars/insight_05a.mp3` |
| 5B | El legado | `wide` | — | 0 | no | — | — | `mars/insight_05b.mp3` (otra voz) |

**Audio:** usar la **sonificación oficial del sismo de magnitud 5** (JPL, PIA25281, dominio público) en la escena 3C.
**`catalog.ts`:** corregir `latlon` a `[4.5, 135.9]` y `lastWords` (§2.3). El resumen ("Escuchó martemotos y reveló el interior de Marte") es correcto.

---

## 7. Tarjeta de transparencia — "¿Qué dijo de verdad?"

> **¿Escribió InSight "mi energía está muy baja, puede que esta sea la última imagen que envíe"?**
> No. Esa frase la escribió el equipo de la misión en sus redes sociales, hablando como si fuera el robot. Lo que InSight sí envió fueron datos y fotos, hasta su última comunicación, el 15 de diciembre de 2022.

---

## 8. Hecho vs. licencia narrativa

| Cap. | Hecho | Licencia |
|---|---|---|
| 1 | Llanura plana, brazo 1,8 m, paneles, misión de estudiar el interior | "Vine a escuchar" |
| 2 | Fechas, Atlas V, Vandenberg, MarCO, aterrizaje | "Mi equipo grita y se abraza" |
| 3 | SEIS, topo (5 m, suelo apelmazado, ene-2021, cita de Spohn), sismo M5, 1 319 sismos, núcleo, corteza, manto | Sonido del sismo como experiencia "oída" por el robot |
| 4 | Polvo, truco de la pala, selfie abr-2022, <20 %, foto 11-dic, último mensaje 15-dic | El orden emocional |
| 5 | Sin respuesta, 21-dic-2022, >4 años | Cierre poético |

---

## 9. Fuera de alcance por ahora

- **"¿Qué pasaría si…?"** reservado: *"…el topo (HP³) hubiera logrado excavar"* (`PLAN.md` §8).

---

## 10. Pendientes y decisiones para ti

| # | Pendiente | Motivo |
|---|---|---|
| 1 | **Corregir `lastWords` en `catalog.ts` y la nota de `PLAN.md` §11** | La frase no la envió el robot (§2.3) |
| 2 | Corregir `latlon` a `[4.5, 135.9]` | Coordenada oficial |
| 3 | Añadir nodo `mole` al modelo de InSight | Hotspot del topo |
| 4 | Verificar "primer lanzamiento interplanetario desde la costa oeste" | Dato atractivo para el cap. 2 |
| 5 | Encontrar la publicación original del equipo (dic-2022) para citarla en la tarjeta | Fuente de §7 |

---

## 11. Fuentes

1. NASA Science — *InSight*: https://science.nasa.gov/mission/insight/
2. NSSDC — *InSight (2018-042A)*: https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2018-042A
3. JPL — *NASA Retires InSight Mars Lander Mission After Years of Science* (21-dic-2022): https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science/
4. JPL — *NASA's InSight Records Monster Quake on Mars* (9-may-2022): https://www.jpl.nasa.gov/news/nasas-insight-records-monster-quake-on-mars/
5. JPL — *NASA InSight's 'Mole' Ends Its Journey on Mars* (14-ene-2021): https://www.jpl.nasa.gov/news/nasa-insights-mole-ends-its-journey-on-mars/
6. JPL Education — *How InSight Revealed the Heart of Mars*: https://www.jpl.nasa.gov/edu/resources/teachable-moment/how-insight-revealed-the-heart-of-mars/
7. JPL — *NASA Prepares to Say 'Farewell' to InSight Spacecraft* (1-nov-2022): https://www.jpl.nasa.gov/news/nasa-prepares-to-say-farewell-to-insight-spacecraft/
8. JPL — *InSight's Final Selfie* (PIA25287): https://www.jpl.nasa.gov/images/pia25287-insights-final-selfie/
9. JPL — *One of InSight's Last Images* (PIA25680): https://www.jpl.nasa.gov/images/pia25680-one-of-insights-last-images/
10. NASA — *Saying 'Farewell' to InSight Mars Lander*: https://www.nasa.gov/image-article/saying-farewell-insight-mars-lander/
11. JPL — *Seismogram and Sonification of InSight's Big Martian Quake* (PIA25281): https://www.jpl.nasa.gov/images/pia25281-seismogram-and-sonification-of-insights-big-martian-quake/
