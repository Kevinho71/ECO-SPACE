# Historia de Eagle — guion inmersivo en primera persona

> **Proyecto:** *Abandoned but not Forgotten* (EcoSpace) · **Robot:** Apollo 11 LM "Eagle" — **etapa de descenso** (la parte que se quedó en la Luna)
> **Estructura:** los 5 capítulos de `PLAN.md` §8, igual que `HISTORIA_OPPORTUNITY.md` · **Estado:** borrador v1 para revisión
> **Alcance:** solo la historia real. Los "¿Qué pasaría si…?" **no se desarrollan todavía** (ver §9).
> **Investigación realizada el 15-nov-2026** sobre fuentes de la NASA y el NSSDC; cada dato lleva su fuente en §2 y §11.

---

## 1. Idea central y reglas de la narración

**Qué vive el usuario:** *es* la etapa de descenso de Eagle: la mitad inferior, dorada, del módulo lunar. Lleva a dos personas hasta la Luna, las sostiene en la superficie y, al final, les sirve de plataforma de lanzamiento… y se queda. Es el único robot del catálogo que **transportó personas**.

| Regla | Cómo se aplica |
|---|---|
| **Primera persona, presente** | "Siento el motor", no "Eagle sintió". Solo el cierre del cap. 5 va en tercera persona. |
| **Mostrar, no enumerar** | Las alarmas del ordenador son pitidos que interrumpen la cuenta; los segundos de combustible son una voz desde Houston. |
| **Rigor primero** | Todo número, fecha o cita está en §2. Lo que es licencia narrativa va en §8. |
| **Sin género gramatical** | "Soy la etapa de descenso" / "soy una máquina". Evitar adjetivos con género sobre el narrador. |
| **Las personas son protagonistas** | Armstrong y Aldrin hablan con sus **citas reales** (en inglés con subtítulo). El robot no inventa diálogos de los astronautas. |
| **Registro para escolares** | Frases cortas, una idea por frase. |

**Dispositivo narrativo:** igual que Opportunity. Cap. 1 empieza **ya posado** en el Mar de la Tranquilidad; cap. 2 reproduce el "registro de vuelo" (lanzamiento → descenso con alarmas).

---

## 2. Ficha de datos verificados

### 2.1 Datos de la misión

| Dato | Valor | Fuente |
|---|---|---|
| Nombre | Apollo 11 Lunar Module "Eagle" (NSSDC 1969-059C) | NSSDC [1] |
| Lanzamiento | 16-jul-1969, 13:32 UT (9:32 a. m. hora de Florida, EDT), cohete Saturn V, Cabo Cañaveral | NSSDC [1][2] |
| Tripulación | Neil A. Armstrong (comandante), Edwin "Buzz" Aldrin (piloto del LM) y Michael Collins (piloto del módulo de mando, se quedó en órbita) | NSSDC [2]; NASA [3] |
| Alunizaje | 20-jul-1969, 20:17:40 UT (4:17:40 p. m. EDT) | NSSDC [1][2] |
| Lugar | Mare Tranquilitatis (Mar de la Tranquilidad), 0,674° N, 23,473° E | NSSDC [1] |
| Alarmas 1202 / 1201 | El ordenador se sobrecargó: un interruptor del radar mal configurado le hacía procesar datos que "en realidad no estaban". En el control de la misión sabían que el ordenador estaba diseñado para reiniciarse y seguir, así que la misión siguió adelante | ALSJ — ensayo de Peter Adler alojado en nasa.gov [5] ⚠ ver §2.2 |
| "60 segundos" | Charlie Duke (CapCom en Houston) avisa "60 seconds" de combustible antes de la llamada "Bingo" (aterrizar en 20 s o abortar) | ALSJ, transcripción del alunizaje [6] ⚠ ver §2.2 |
| Primera frase tras posarse | *"Houston, Tranquility Base here — the Eagle has landed"* | NSSDC [1] |
| Primer paso | 21-jul 02:56:15 UT (20-jul, 10:56 p. m. EDT): *"That's one small step for man, one giant leap for mankind"* | NSSDC [1] |
| Paseo lunar | Armstrong salió a las 02:56:15 UT; la escotilla se cerró a las 05:11:13 UT (≈ 2 h 15 min). Aldrin pasó 1 h 41 min en la superficie | NSSDC [1] |
| Experimentos que se quedaron | EASEP (48 kg): sismómetro pasivo y detector de polvo, a ~17 m al sur del LM; y el **reflector láser** (LRRR), a unos 5 m del EASEP | NSSDC [1][4] |
| Reflector láser | 100 "cubos de esquina" de sílice en un panel de aluminio de 46 cm. **No necesita energía**. Mide la distancia Tierra-Luna con precisión de ~2 cm y muestra que la Luna se aleja de la Tierra | JPL [7] |
| ¿Se sigue usando? | Sí: un documento de la NASA de 2023 (aniversario) lo describe como "still in use today" | NASA 2023 [8] ⚠ leído solo por resumen de búsqueda |
| Placa (texto literal) | *"Here men from the planet Earth first set foot on the Moon July 1969, A.D. We came in peace for all mankind."* Va en una pata, detrás de la escalera | NSSDC [1] |
| Tiempo en la superficie | 21 h 36 min (del alunizaje al despegue) | NSSDC [1] |
| Despegue de la etapa de ascenso | 21-jul-1969, 17:54:01 UT | NSSDC [1] |
| La etapa de descenso | "Sirvió de plataforma para lanzar la etapa de ascenso y se quedó en la Luna" | NSSDC [1] |
| Masa de la etapa de descenso | 2 034 kg en seco + 8 248 kg de combustible al inicio | NSSDC [1] |
| Destino de la etapa de ascenso | Desconocido; se supone que cayó a la Luna en 1-4 meses | NSSDC [1][9] |

### 2.2 Discrepancias y cómo resolverlas

| Tema | Conflicto | Decisión |
|---|---|---|
| Tiempo en la superficie | 21 h 36 min (NSSDC) vs "22 horas" (NASA, redondeado) | Voz: "casi un día entero". HUD: 21 h 36 min. |
| Primera frase de Armstrong | "for man" (NSSDC) vs "for [a] man" (NASA) | Subtítulo con la versión del NSSDC; no entrar en la polémica. |
| Combustible al tocar suelo | La cifra "quedaban 7 segundos" circula mucho; un resumen de la NASA (SP-4029) dice que el análisis posterior dio **45 s** | **No decir cuántos segundos quedaban.** Solo usar el aviso real de "60 segundos". ⚠ Verificar SP-4029 (PDF no se pudo leer). |
| Alarmas: quién dio el "go" | Los nombres (Steve Bales, Jack Garman) no aparecen en las páginas leídas | **No nombrar** a nadie; decir "en Houston". |
| Bandera derribada por el chorro del despegue | No aparece en ninguna página oficial leída | **No se usa.** |
| Experimento de viento solar | Se suele decir que "se quedó"; el NSSDC indica que se guardó en las cajas de muestras (volvió a la Tierra) | No mencionarlo entre lo que se quedó. |
| "La Luna se aleja 3,8 cm al año" | No figura en la página del JPL leída (3,8 cm es el diámetro de cada cubo) | **No dar la cifra**; decir "se aleja poco a poco". |

---

## 3. Mapa de capítulos (resumen)

| # | Capítulo | Cuándo / dónde | Ánimo | Duración aprox. | `staticLevel` | Animación GLB | Cara (morph) |
|---|---|---|---|---|---|---|---|
| 1 | **El despertar** | 20-jul-1969 · Mar de la Tranquilidad | Asombro | ~55 s | 0,9 → 0,1 | `Wake` → `Idle` | neutral → *Surprised* |
| 2 | **El viaje** *(registro de vuelo)* | 16 → 20-jul-1969 | Tensión máxima | ~90 s | 0,3 → 1,0 → 0,1 | `Land` | *Surprised* |
| 3 | **La misión** *(2 escenas)* | 20 → 21-jul-1969 | Emoción y orgullo | ~100 s | 0,05 | `Idle` | neutral |
| 4 | **El final** | 21-jul-1969, 17:54 UT | Despedida | ~60 s | 0,1 → 0,6 | `Idle` → `Death` | *Sad* |
| 5 | **El corte y el legado** | 1969 → hoy | Silencio y orgullo | ~12 s + silencio + ~50 s | 0,6 → 1,0 → 0 | `Death` | *Sleep* |

---

## 4. Guion capítulo por capítulo

> **Notación:** `[mm:ss]` marca estimada · **VOZ** = narración/subtítulo · *(cursiva)* = cámara/efectos · **HUD** = telemetría · `ᴰ` = dato verificado de §2.

### Capítulo 1 — El despertar

**Cámara:** `pov` en `pov_eye` (placa frontal, a la altura de las ventanas). **Escena:** llano gris, cielo **negro** con el Sol duro; la Tierra pequeña en el cielo.
**HUD:** `20 JUL 1969 · 20:17:40 UT · MARE TRANQUILITATIS · CONTACTO`
**SFX:** **silencio lunar** (no hay aire: nada de viento), solo el tono de telemetría y el zumbido interno.

| Marca | VOZ |
|---|---|
| [00:00] | *(estática)* Contacto. Motor… apagado. |
| [00:04] | Polvo gris que cae despacio. Y después, quietud total. Aquí no hay aire que haga ruido. |
| [00:12] | Soy la etapa de descenso de Eagle: la mitad de abajo, dorada, de un módulo lunar. ᴰ |
| [00:19] | Tengo cuatro patas, un motor que frena y tanques de combustible. Arriba de mí va la cabina con dos personas. |
| [00:27] | Estamos en la Luna. En una llanura llamada Mar de la Tranquilidad. ᴰ Aunque se llama "mar", no tiene ni una gota de agua. |
| [00:36] | Dentro, una voz habla con la Tierra: *"Houston, Tranquility Base here — the Eagle has landed."* ᴰ *(subtítulo: "Houston, aquí Base Tranquilidad. El Águila ha aterrizado.")* |
| [00:46] | Lo logramos. Pero llegar fue lo más difícil… déjame recordar. *(estática → cap. 2)* |

**Hotspots:** `face_plate` (ventanas), `leg_*` (patas), `descent_engine`.

---

### Capítulo 2 — El viaje (registro de vuelo)

**Cámara:** pantalla de telemetría; en el descenso, vista temblorosa del suelo acercándose.
**HUD:** `16 JUL 1969 · LANZAMIENTO` → `ÓRBITA LUNAR` → `DESCENSO` → `ALARMA 1202` → `60 s` → `CONTACTO`.
**SFX:** rugido del Saturn V, silencio, **pitido de alarma**, voces de radio (filtradas), motor de descenso.

| Marca | VOZ |
|---|---|
| [00:00] | Reproduciendo registro de vuelo. |
| [00:04] | Dieciséis de julio de 1969. El cohete más grande de su época, un Saturn V, nos lanza desde Florida. ᴰ |
| [00:12] | Somos tres personas y tres naves. Michael Collins se quedará en órbita alrededor de la Luna. ᴰ Neil Armstrong y Buzz Aldrin bajarán conmigo. ᴰ |
| [00:23] | Veinte de julio. Nos separamos y empezamos a bajar. Mi motor frena la caída. |
| [00:30] | *(pitido)* De pronto, una alarma: "1202". Luego otra. |
| [00:35] | El ordenador está saturado: recibe datos de un radar que no debería estar mirándolos. ᴰ |
| [00:42] | En Houston saben que el ordenador está hecho para reiniciarse y seguir trabajando. ᴰ La respuesta llega: seguimos. |
| [00:50] | Abajo hay rocas. Armstrong toma el control y busca un sitio plano. |
| [00:57] | Desde la Tierra, una voz cuenta el combustible: *"60 seconds."* ᴰ |
| [01:03] | Mis patas buscan el suelo. Polvo. Más polvo… |
| [01:09] | Contacto. Son las 20:17 del 20 de julio de 1969, en la Tierra. ᴰ *(silencio; estática a 0,1)* |

**Reglas:** no decir cuántos segundos de combustible quedaban al tocar suelo (§2.2); no nombrar al controlador que dio el "go". *"Abajo hay rocas… busca un sitio plano"* → ⚠ verificar en ALSJ antes de grabar (ver §10).

---

### Capítulo 3 — La misión (2 escenas)

#### Escena 3A — El primer paso

| Marca | VOZ |
|---|---|
| [00:00] | Seis horas después, se abre la escotilla. ᴰ |
| [00:05] | Armstrong baja por mi escalera. Yo siento cada peldaño. |
| [00:11] | Pisa el polvo y dice: *"That's one small step for man, one giant leap for mankind."* ᴰ *(subtítulo: "Es un pequeño paso para un hombre, un gran salto para la humanidad.")* |
| [00:22] | Después baja Aldrin. Los dos caminan, saltan, recogen piedras. ᴰ |
| [00:29] | En una de mis patas hay una placa. Ellos la leen en voz alta. ᴰ |

*(Placa en pantalla, con traducción:)* **"Here men from the planet Earth first set foot on the Moon July 1969, A.D. We came in peace for all mankind."** — *"Aquí, hombres del planeta Tierra pisaron la Luna por primera vez, julio de 1969 d. C. Vinimos en paz en nombre de toda la humanidad."*

#### Escena 3B — Los regalos que se quedan

| Marca | VOZ |
|---|---|
| [00:00] | Antes de irse, dejan instrumentos en el suelo. |
| [00:05] | Un sismómetro, para escuchar si la Luna tiembla. ᴰ |
| [00:10] | Y un espejo especial: cien pequeños cubos de cristal que devuelven la luz justo al lugar de donde vino. ᴰ |
| [00:19] | Desde la Tierra le dispararán rayos láser. Medirán cuánto tarda la luz en ir y volver… y así sabrán, al centímetro, a qué distancia está la Luna. ᴰ |
| [00:30] | Ese espejo no necesita baterías. ᴰ Nunca se cansará. |

**Hotspots:** `ladder`, `laser_reflector`, `seismometer`.

---

### Capítulo 4 — El final

**Cámara:** `pov`. Hacia el final, mirada hacia arriba: la cabina se separa y sube.
**HUD:** `21 JUL 1969 · 17:54:01 UT · DESPEGUE ETAPA DE ASCENSO`.
**Efectos:** vibración, polvo que vuela, luz del motor de ascenso, `status_light` palpita.

| Marca | VOZ |
|---|---|
| [00:00] | Casi un día entero en la Luna. ᴰ Es hora de volver a casa. |
| [00:06] | Pero no todo vuelve. Solo sube la cabina: la etapa de ascenso. |
| [00:12] | Yo me quedo. Mi trabajo final es ser su plataforma de lanzamiento. ᴰ |
| [00:19] | Cuenta atrás. *(estática a 0,4)* El motor de arriba se enciende sobre mí. |
| [00:25] | La cabina se separa y sube, cada vez más pequeña, hacia Michael Collins. |
| [00:33] | Buen viaje. *(silencio; la cámara sigue el punto de luz hasta perderlo)* |

---

### Capítulo 5 — El corte y el legado

#### 5A — Silencio (Eagle, ~12 s)

| Marca | VOZ |
|---|---|
| [00:00] | Ya no tengo a quién llevar. |
| [00:04] | Mis sistemas… se… *(corte)* |
| [00:08] | *(silencio, negro)* **ETAPA DE DESCENSO · TRANQUILITY BASE · DESDE 1969** |

#### 5B — El legado (voz serena, tercera persona, ~50 s)

| Marca | VOZ |
|---|---|
| [00:00] | La etapa de descenso de Eagle sigue en el Mar de la Tranquilidad, con su placa. ᴰ |
| [00:07] | A su lado quedó el reflector láser. Décadas después, los científicos todavía le envían pulsos de luz desde la Tierra. ᴰ |
| [00:16] | Gracias a él sabemos que la Luna se aleja de nosotros, poco a poco. ᴰ |
| [00:23] | La cabina que despegó aquel día se perdió; nadie sabe dónde cayó. ᴰ Pero esta base sigue en su sitio, marcando el lugar. |
| [00:33] | Doce personas caminaron por la Luna entre 1969 y 1972. Las dos primeras bajaron por esta escalera. |
| [00:42] | Los robots abandonados no están olvidados. *(cierre poético)* |

**Nota de rigor:** "doce personas caminaron por la Luna" es un dato muy conocido pero **no se verificó en esta investigación** → verificar en nasa.gov antes de grabar o quitar la línea.

---

## 5. Hotspots (modo Inspección)

| Nodo GLB (`eagle.glb`) | Parte | Dato para el inspector | Cap. |
|---|---|---|---|
| `face_plate` / `pov_eye` | Ventanas (la "cara") | Por aquí miraban Armstrong y Aldrin al bajar. *(La cabina real era la etapa de ascenso, que no está en el modelo.)* | 1 |
| `descent_stage` | Cuerpo dorado | 2 034 kg vacío; llevaba 8 248 kg de combustible. ᴰ El dorado es aislante térmico. | 1, 2 |
| `descent_engine` | Motor de descenso | Frenaba la caída hasta posarse. | 2 |
| `leg_*` / `footpad_*` | Patas | Cuatro patas con platos para no hundirse en el polvo. | 1, 2 |
| `ladder` | Escalera | Por aquí bajaron los dos primeros humanos en la Luna. ᴰ | 3A |
| `laser_reflector` | Reflector láser | 100 cubos de cristal; sin energía; precisión ~2 cm; se sigue usando. ᴰ | 3B, 5B |
| `seismometer` | Sismómetro | Escuchaba los temblores de la Luna. ᴰ | 3B |
| `ascent_mount` | Soporte de la etapa de ascenso | Desde aquí despegó la cabina el 21-jul-1969. ᴰ | 4 |
| `dish` / `antenna` | Antenas | Comunicación con la Tierra. | 1 |

---

## 6. Implementación — mapa de campos (`Chapter[]`)

| Cap. | `title` | `camera` | `pov` | `staticLevel` | `powerCut` | `animation` | `morph` | `audioKey` |
|---|---|---|---|---|---|---|---|---|
| 1 | El despertar | `pov` | `pov_eye` | 0,9 → 0,1 | no | `Wake` → `Idle` | `Surprised` | `moon/eagle_01.mp3` |
| 2 | El viaje | `pov` (telemetría) | — | 0,3 → 1,0 → 0,1 | no | `Land` | `Surprised` | `moon/eagle_02.mp3` |
| 3A | El primer paso | `pov` | `pov_eye` | 0,05 | no | `Idle` | neutral | `moon/eagle_03a.mp3` |
| 3B | Los regalos | `inspect` | — | 0,05 | no | `Idle` | neutral | `moon/eagle_03b.mp3` |
| 4 | El final | `pov` | `pov_eye` | 0,1 → 0,6 | no | `Idle` → `Death` | `Sad` | `moon/eagle_04.mp3` |
| 5A | Silencio | `pov` | `pov_eye` | 0,6 → 1,0 | **sí** | `Death` | `Sleep` | `moon/eagle_05a.mp3` |
| 5B | El legado | `wide` | — | 0 | no | — | — | `moon/eagle_05b.mp3` (otra voz) |

**Audio:** las citas de Armstrong deben usar el **audio original de la NASA** (dominio público) en lugar de voz sintética. Ambiente lunar: **silencio absoluto** + telemetría (sin viento).
**Datos para `catalog.ts`:** el resumen actual ("Su reflector láser aún se usa hoy") es correcto según [8]; pero el reflector es un experimento separado, no parte de la etapa de descenso → matiz en el inspector, no en el resumen.

---

## 7. Tarjeta de transparencia — "¿Cuánto combustible quedaba?"

> **¿Es verdad que a Eagle le quedaban solo unos segundos de combustible?**
> Se dijo mucho. Durante el descenso, Houston avisó "60 segundos" y luego "30 segundos" antes del límite de seguridad. Pero el análisis posterior de la NASA calculó que quedaba más de lo que parecía. Moraleja: los avisos en vivo y los datos finales no siempre coinciden.

⚠ Publicar solo después de verificar SP-4029 (§10).

---

## 8. Hecho vs. licencia narrativa

| Cap. | Hecho | Licencia |
|---|---|---|
| 1 | Fecha/hora, lugar, cita "The Eagle has landed" | Que la etapa "sienta" y "hable"; el polvo cayendo despacio |
| 2 | Saturn V, tripulación, alarmas 1202/1201 y su causa, aviso "60 seconds" | El orden exacto y el ritmo; "Armstrong toma el control" (⚠ verificar) |
| 3 | Primer paso y cita, placa literal, EASEP, reflector | "Siento cada peldaño" |
| 4 | Despegue 21-jul 17:54 UT; la etapa de descenso fue plataforma y se quedó | "Buen viaje" |
| 5 | Reflector en uso, la Luna se aleja, destino desconocido de la etapa de ascenso | 5A completo (la etapa de descenso no tiene un "apagado" documentado: es un recurso dramático) |

---

## 9. Fuera de alcance por ahora

- **"¿Qué pasaría si…?"** reservado: *"…la alarma 1202 hubiera obligado a abortar"* (`PLAN.md` §8). Sin guion todavía.

---

## 10. Pendientes y decisiones para ti

| # | Pendiente | Motivo |
|---|---|---|
| 1 | ~~Verificar que Armstrong tomó el control manual~~ **Resuelto (15-nov-2026):** ALSJ y NASA coinciden en que pasó a control manual para evitar un campo de rocas junto al cráter West ("aterrizar largo"). La **altura** a la que lo hizo difiere entre fuentes: no se da. | Cap. 2 |
| 2 | Leer SP-4029 (PDF demasiado grande para la herramienta) para confirmar los 45 s de combustible | **La tarjeta de transparencia ya no da la cifra**, solo que "quedaba más de lo que parecía"; sigue pendiente si se quiere dar el número |
| 3 | ~~Confirmar "doce personas caminaron por la Luna"~~ **Resuelto:** NASA Science, *Moonwalkers*: 12 astronautas, Apolo 11 a 17 (1969–1972) | Cap. 5B |
| 4 | Conseguir el audio original de la NASA de las dos citas | Más fuerza y rigor que una voz sintética |
| 5 | Confirmar el documento de 2023 sobre el reflector (solo se vio por buscador). Se usa "más de cincuenta años después, los científicos todavía lo usan", apoyado en un resumen de ILRS (también solo por buscador) | Dato del legado |
| 6 | El modelo no incluye la cabina (etapa de ascenso): se dibuja de forma esquemática en `extras.tsx` | Fidelidad visual |

---

## 11. Fuentes

1. NSSDC — *Apollo 11 Lunar Module / EASEP (1969-059C)*: https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C
2. NSSDC — *Apollo 11*: https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo11info.html
3. NASA — *Apollo 11 Mission Overview*: https://www.nasa.gov/mission/apollo-11/
4. NSSDC — *Laser Ranging Retro-Reflector (1969-059C-04)*: https://nssdc.gsfc.nasa.gov/nmc/experiment/display.action?id=1969-059C-04
5. ALSJ — *Apollo 11 Program Alarms* (ensayo de Peter Adler, 1998, alojado en nasa.gov): https://www.nasa.gov/wp-content/uploads/static/history/alsj/a11/a11.1201-pa.html
6. ALSJ — *The First Lunar Landing* (transcripción): https://history.nasa.gov/alsj/a11/a11.landing.html ⚠ leída solo vía resumen de búsqueda
7. JPL — *Apollo 11 Experiment Still Going Strong after 35 Years* (2004): https://www.jpl.nasa.gov/news/apollo-11-experiment-still-going-strong-after-35-years/
8. NASA — *Apollo 11 Anniversary Lithograph* (2023): https://assets.science.nasa.gov/content/dam/science/psd/lunar-science/2023/09/Apollo11AnniversaryLitho_updated.pdf ⚠ leído solo vía resumen de búsqueda
9. NSSDC — *Apollo: Where are they now?*: https://nssdc.gsfc.nasa.gov/planetary/lunar/apolloloc.html
10. NASA SP-4029 — *Apollo by the Numbers*, resumen Apollo 11: https://history.nasa.gov/SP-4029/Apollo_11a_Summary.htm ⚠ no se pudo leer (PDF > 10 MB)

---

## 12. Implementación (estado)

- **Guion:** `src/data/stories/eagle.ts` (5 capítulos, subtítulos, sin voces). Registrado en `StoryDirector.tsx`. Textos de las pantallas (inicio, exploración, cierre) propios en `texts`.
- **Hotspots:** `hotspots.ts` → `eagle`: escalera, sismómetro, reflector láser, motor, etapa de descenso y patas (nodos verificados en `eagle.glb`). Los usan las cámaras de primer plano y el modo exploración.
- **Escena:** siempre `flight` (en la Luna no hay viento: solo telemetría). Cámaras `pov`, `wide` y `part`. El POV cuelga de `face_plate` (el modelo no tiene `mast_head`).
- **Cabina (etapa de ascenso):** no está en el GLB. `src/three/extras.tsx` la dibuja sobre `ascent_mount` y la hace despegar con las pistas `tracks.ascent` (altura) y `tracks.fire` (motor). Se registra por misión en `MISSION_EXTRAS`.
- **Alarma:** nuevo `SfxKind` `'alarm'` (pitidos de las alarmas 1202).

### Escenas y vistas
| Cap. | Lugares (parpadeo en `t`) | Vistas (`t` en s) |
|---|---|---|
| 1 | `tranquility` | POV 0 · 3.ª 11,65 · POV 26,65 · 3.ª 35,65 |
| 2 | `earth-orbit` → `translunar` (11,65) → `lunar-orbit` (22,65) → `descent` (29,65) → `tranquility` (69,65) | POV 0 · 3.ª 11,65 · POV 22,65 · 3.ª 29,65 (llama del motor) · POV 57,65 · 3.ª 69,65 |
| 3 | `tranquility` | 3.ª 0 · escalera 4,65 · POV 21,65 · sismómetro 39,65 · reflector 49,65 · 3.ª 69,65 |
| 4 | `tranquility` | POV 0 · 3.ª 5,65 · la cámara sube siguiendo a la cabina desde 24,4 |
| 5 | `tranquility` | POV 0 · 3.ª 11,65 · reflector 18,65 · 3.ª 26,65 · escalera 42,65 · 3.ª 51,65 |

### Cambios respecto al guion de §4 (por verificación o por rigor)
- **Cap. 2:** se quitó "el cohete más grande de su época" (no verificado) y "tres naves" (inexacto). El control manual de Armstrong ya está **verificado**: "el ordenador nos lleva hacia un campo de piedras, y Armstrong toma el control".
- **Cap. 3:** "Seis horas después" → "Unas seis horas y media después del alunizaje" (20:17:40 UT → 02:56:15 UT). Se quitó "saltan" (no verificado). "Nunca se cansará" → "Años después, seguía funcionando perfectamente" (JPL, 2004). "Al centímetro" → "con un error de unos dos centímetros".
- **Cap. 5:** "Décadas después, los científicos todavía le envían pulsos de luz" → "Más de cincuenta años después, los científicos todavía lo usan". La cabina: "se cree que cayó sobre la Luna unos meses después" (NSSDC).
- **Tarjeta de transparencia:** sin la cifra de segundos (ver §10 #2).
- **Duraciones:** 54 · 80 · 80 · 44 · 62 s (≈ 5 min 20 s). El cap. 4 dura 44 s (el doc decía ~60 s): el guion ocupa unos 38 s.

### Licencias de la animación
- **Escala y distancia:** la Luna y la Tierra no están a escala (la Luna debajo es una esfera de radio 700, la Tierra de 600). El viaje de tres días se resume en 11 s.
- **Descenso:** la altura y la velocidad con que sube la superficie son ilustrativas. No se muestra el campo de rocas ni el cráter West.
- **Sin astronautas:** no hay figuras de Armstrong ni Aldrin: se cuentan con la escalera, los subtítulos y las tarjetas con sus citas. La cabina es un modelo esquemático.
- **Llama del motor de descenso:** representa el frenado; su aspecto no es una réplica.
- **Escalera:** en el modelo 3D sube hacia fuera (la parte de arriba queda más lejos del cuerpo que la de abajo): es una imperfección del modelo, no un dato.

### Sin verificar visualmente
Posiciones de cámara, encuadre de los primeros planos y la cabina se calcularon por geometría, **sin capturas**. Revisar con `seek`: cap. 1 t=0, 15, 38 · cap. 2 t=2, 15, 25, 31, 60, 72 · cap. 3 t=2, 8, 25, 42, 55, 72 · cap. 4 t=8, 22, 30, 38 · cap. 5 t=5, 20, 45, 56.
