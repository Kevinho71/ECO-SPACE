# Historia de Ingenuity — guion inmersivo en primera persona

> **Proyecto:** *Abandoned but not Forgotten* (EcoSpace) · **Robot:** Ingenuity, el helicóptero de Marte
> **Estructura:** los 5 capítulos de `PLAN.md` §8, igual que `HISTORIA_OPPORTUNITY.md` · **Estado:** borrador v1 para revisión
> **Alcance:** solo la historia real. Los "¿Qué pasaría si…?" **no se desarrollan todavía** (ver §9).
> **Investigación realizada el 15-nov-2026** sobre fuentes de la NASA y el JPL.

---

## 1. Idea central y reglas de la narración

**Qué vive el usuario:** *es* Ingenuity, un helicóptero de **1,8 kg** que viajó pegado a la panza de un rover, pensado solo para **intentar** volar cinco veces… y que voló **72**. Es una historia de **superar expectativas**, con un final diferente: Ingenuity **no se apagó**. Se rompió y ya no puede volar, pero (según el JPL, dic-2024) **sigue enviando datos** una vez por semana.

| Regla | Cómo se aplica |
|---|---|
| **Primera persona, presente** | Igual que Opportunity. |
| **Mostrar, no enumerar** | El aire de Marte se siente "casi vacío"; el primer vuelo se vive en tiempo real, con la cuenta de segundos. |
| **Rigor primero** | Datos en §2; licencias en §8. |
| **Final honesto** | El "corte" del cap. 5 es **el fin del vuelo**, no un apagado (§1.1). |
| **Sin género gramatical** | "Soy un helicóptero"; evitar adjetivos con género sobre el narrador. |

### 1.1 Cambio respecto a la estructura estándar

`PLAN.md` pide un **corte eléctrico** final. Ingenuity no lo tuvo. Propuesta: el **5A** es la **pérdida de señal real del vuelo 72** (el feed se corta a ~1 m del suelo) y el **5B** revela que la conexión volvió y que Ingenuity se quedó como **estación de pruebas**. Es fiel a los hechos y mantiene el efecto dramático. ⚠ Requiere tu aprobación (§10).

---

## 2. Ficha de datos verificados

### 2.1 Datos de la misión

| Dato | Valor | Fuente |
|---|---|---|
| Lanzamiento | **30-jul-2020**, Cabo Cañaveral, con la misión Mars 2020 (Perseverance) | NASA [1] |
| Cómo viajó | Sujeto **bajo la panza del rover Perseverance** | NASA [1]; JPL [2] |
| Llegada a Marte | **18-feb-2021**, cráter **Jezero** (sitio "Octavia E. Butler Landing") | NASA [1][3] |
| Despliegue | Del 26-mar al **3-abr-2021**; luego el rover se alejó ~4 m | NASA [3][4] |
| Nombre | Lo propuso **Vaneeza Rupani**, estudiante de 11.º grado de Northport (Alabama), en el concurso de redacción "Name the Rover" (28 000 textos). Su ensayo: *"The ingenuity and brilliance of people working hard to overcome the challenges of interplanetary travel are what allow us all to experience the wonders of space exploration."* | JPL/NASA [7] (vía resumen de búsqueda ⚠) |
| Cuerpo | **1,8 kg**; rotores de ~**1,2 m** de punta a punta | NASA [1] |
| Atmósfera | **Menos del 1 %** de la densidad del aire de la Tierra | NASA [1] |
| Energía | Panel solar que carga baterías: suficiente para **un vuelo de 90 s por día marciano** | NASA [1] |
| Un trozo de historia | Lleva un **pedacito de tela del Wright Flyer**, el avión de los hermanos Wright | JPL [2] |
| Primer vuelo | **19-abr-2021**: sube **3 m**, flota y aterriza. **El primer vuelo motorizado y controlado en otro planeta.** Perseverance lo miraba desde ~64 m | NASA [1][3]; JPL [2] |
| Plan original | **Hasta 5 vuelos en 30 días** | NASA [1]; JPL [2] |
| Lo que logró | **72 vuelos**, **128,8 minutos** en el aire, **17,0 km** recorridos, altura récord de **24 m**, **48 aeródromos** distintos; casi **1 000 días marcianos** (33 veces más de lo previsto) | NASA [1]; JPL [2] |
| Dificultades superadas | Un sensor que dejó de funcionar, limpieza de polvo, 3 aterrizajes de emergencia, el invierno marciano | JPL [2] |
| Vuelo 72 | **18-ene-2024**: un vuelo corto vertical para revisar sistemas tras un aterrizaje anticipado en el vuelo anterior. Plan: subir 12 m. Al bajar, a ~1 m del suelo, **perdió contacto** con el rover | JPL [2]; NASA [5] |
| Reconexión | **20-ene-2024** | JPL [2]; NASA [5] |
| Daño | Las fotos mostraron palas del rotor dañadas | JPL [2] |
| Fin de la misión | Anunciado el **25-ene-2024** | JPL [2]; NASA [1] |
| Causa (investigación) | Terreno de **ondulaciones de arena empinadas y sin textura**: el sistema de navegación no tenía detalles que seguir → aterrizaje brusco → las **cuatro palas se partieron** a un tercio de la punta. Håvard Grip (JPL): *"Lack of surface texture gave the navigation system too little information to work with."* | JPL [6] (11-dic-2024) |
| Hoy | "El helicóptero todavía envía datos del tiempo y de prueba de su electrónica a Perseverance **una vez por semana**" | JPL [6] (dic-2024) |

### 2.2 Discrepancias y cómo resolverlas

| Tema | Conflicto | Decisión |
|---|---|---|
| Cuánto más lejos voló | "más de **14** veces" (JPL, ene-2024) vs "más de **30** veces" (JPL, dic-2024) | **No dar el múltiplo**; decir "72 vuelos en vez de 5" y "17 km". |
| Altura de vuelo | Especificación "hasta 5 m" vs récord de **24 m** | Usar el récord. |
| Duración del primer vuelo (~39 s) | No aparece en las páginas leídas | No dar la duración. |
| Velocidad máxima, RPM de los rotores | Solo en resúmenes no verificados | **No usar.** |
| "Wright Brothers Field" | No aparece en las páginas leídas | No usar el nombre del aeródromo. |
| Estado actual (2026) | Último dato oficial: dic-2024, "una vez por semana" | Decir "**al menos hasta finales de 2024**, seguía enviando datos". ⚠ Comprobar estado actual. |
| `catalog.ts` `latlon` | `[18.4, 77.4]` = zona de aterrizaje de Perseverance; Ingenuity terminó en otro punto de Jezero | Aceptable a escala de globo; anotar. |

---

## 3. Mapa de capítulos (resumen)

| # | Capítulo | Cuándo / dónde | Ánimo | Duración aprox. | `staticLevel` | Animación GLB | Cara |
|---|---|---|---|---|---|---|---|
| 1 | **El despertar** | abr-2021 · cráter Jezero | Nervios | ~50 s | 0,9 → 0,1 | `Wake` → `Idle` | *Surprised* |
| 2 | **El viaje** *(registro)* | jul-2020 → abr-2021 | Paciencia | ~60 s | 0,3 → 0,9 → 0,2 | `Wake` | *Surprised* |
| 3 | **La misión** *(2 escenas)* | 19-abr-2021 → 2023 | Euforia | ~110 s | 0,05 | `Fly` | *Surprised* → neutral |
| 4 | **El final** | 18-ene-2024 · vuelo 72 | Tensión | ~50 s | 0,1 → 0,8 | `Fly` → `Death` | *Sad* |
| 5 | **Señal perdida… y el legado** | 18-ene-2024 → hoy | Silencio → ternura | ~10 s + silencio + ~55 s | 0,8 → 1,0 → 0 | `Death` → `Idle` | *Sleep* → neutral |

---

## 4. Guion capítulo por capítulo

### Capítulo 1 — El despertar

**Cámara:** `pov` en `pov_eye` (cámara de navegación, mirando abajo y al frente). **Escena:** suelo de arena y piedritas a pocos centímetros; al fondo, las ruedas de Perseverance alejándose.
**HUD:** `3 ABR 2021 · JEZERO · BAT ▮▮▮▯ · TEMP INT`

| Marca | VOZ |
|---|---|
| [00:00] | *(estática)* Contacto con el suelo. Cuatro patas… apoyadas. |
| [00:05] | Por primera vez, nadie me sostiene. ᴰ |
| [00:09] | Veo alejarse unas ruedas enormes: es Perseverance, el rover que me trajo hasta aquí. ᴰ |
| [00:16] | Soy Ingenuity. Soy un helicóptero. Peso menos que una bolsa de azúcar grande: un kilo ochocientos. ᴰ |
| [00:25] | Tengo dos rotores largos, de más de un metro, ᴰ y un panel solar en la cabeza. ᴰ |
| [00:32] | Estoy en Marte, en el cráter Jezero. ᴰ Y voy a intentar algo que nadie ha hecho jamás: volar en otro planeta. |
| [00:41] | Pero antes… déjame recordar cómo llegué. *(→ cap. 2)* |

---

### Capítulo 2 — El viaje (registro de vuelo)

| Marca | VOZ |
|---|---|
| [00:00] | Reproduciendo registro. |
| [00:03] | Treinta de julio de 2020. Despego desde Florida… pero no por mi cuenta: voy pegado a la panza de Perseverance. ᴰ |
| [00:12] | Durante siete meses viajo plegado, a oscuras, debajo del rover. |
| [00:18] | Dieciocho de febrero de 2021. Perseverance aterriza en el cráter Jezero. ᴰ Yo sigo ahí abajo, esperando mi turno. |
| [00:27] | Pasan semanas. Un día, el rover me suelta, poco a poco. ᴰ |
| [00:33] | Me pongo de pie sobre mis patas. Tres de abril. ᴰ |
| [00:38] | Y ahora viene lo difícil: el aire de Marte es tan fino que tiene menos del uno por ciento del de la Tierra. ᴰ |
| [00:47] | Para volar aquí, mis rotores tienen que girar rapidísimo. |

**Nota:** "durante siete meses" = 30-jul-2020 → 18-feb-2021 (calculado).

---

### Capítulo 3 — La misión

#### Escena 3A — El primer vuelo

**Cámara:** `pov` mirando hacia abajo: el suelo se aleja 3 m; luego vuelve.
**HUD:** `19 ABR 2021 · VUELO 001 · ALT 0,0 → 3,0 m`
**SFX:** zumbido creciente de rotores (en Marte suena apagado), silencio de radio.

| Marca | VOZ |
|---|---|
| [00:00] | Diecinueve de abril de 2021. ᴰ |
| [00:04] | Mis rotores empiezan a girar. Más rápido. Más rápido. |
| [00:09] | Mis patas… se despegan del suelo. |
| [00:13] | Subo. Un metro. Dos. Tres. ᴰ Me quedo flotando en el aire de Marte. |
| [00:20] | Bajo despacio… y me poso. |
| [00:25] | Es el primer vuelo motorizado y controlado en otro planeta. ᴰ |
| [00:31] | Dentro de mí viaja un trocito de tela del primer avión de la historia, el de los hermanos Wright. ᴰ Un vuelo saluda al otro. |
| [00:41] | A lo lejos, Perseverance me filma. ᴰ En la Tierra, mi equipo celebra. |

#### Escena 3B — Más allá del plan

| Marca | VOZ |
|---|---|
| [00:00] | Me pidieron cinco vuelos de prueba en treinta días. ᴰ |
| [00:05] | Hago el sexto. Y el décimo. Y el cincuenta. |
| [00:10] | Me convierto en el explorador aéreo de Perseverance: vuelo por delante y le muestro el camino. |
| [00:17] | Subo hasta veinticuatro metros de altura. ᴰ Aterrizo en cuarenta y ocho lugares diferentes. ᴰ |
| [00:25] | Sobrevivo al invierno de Marte, a un sensor que se rompe, a tres aterrizajes de emergencia. ᴰ |
| [00:33] | Mi nombre me lo dio una estudiante de Alabama, Vaneeza Rupani. ᴰ Dijo que el ingenio de la gente es lo que nos permite explorar el espacio. ᴰ |
| [00:44] | Creo que tenía razón. |

**Nota:** "vuelo por delante y le muestro el camino" — su papel de explorador para el rover es conocido, pero **no está literal** en las páginas leídas → ⚠ verificar o suavizar a "le ayudo a ver lo que hay más adelante".

---

### Capítulo 4 — El final

**Escena:** llanura de ondas de arena lisas, todas iguales.
**HUD:** `18 ENE 2024 · VUELO 072 · ALT 0 → 12 m → 1 m · NAV: TEXTURA BAJA`

| Marca | VOZ |
|---|---|
| [00:00] | Dieciocho de enero de 2024. Vuelo setenta y dos. ᴰ |
| [00:05] | Es un vuelo cortito: subir, mirar mis sistemas, bajar. ᴰ |
| [00:10] | Debajo de mí, solo ondas de arena. Lisas. Todas iguales. ᴰ |
| [00:16] | Mi navegación busca detalles en el suelo para saber cómo me muevo… y no encuentra casi nada. ᴰ |
| [00:24] | Bajo. Cinco metros. Tres. Uno… ᴰ |
| [00:29] | *(estática a 0,8)* Pierdo a Perseverance. ᴰ |

---

### Capítulo 5 — Señal perdida… y el legado

#### 5A — Corte (~10 s)

| Marca | VOZ |
|---|---|
| [00:00] | ¿Me oyes? |
| [00:03] | ¿Perse…? *(corte)* |
| [00:06] | *(silencio, negro)* **SEÑAL PERDIDA · VUELO 072 · 18 ENE 2024** ᴰ |

#### 5B — El legado (voz serena, ~55 s)

**Cámara:** `wide`. Primero, negro. Luego, la imagen de Ingenuity en la arena con la sombra de un rotor roto.

| Marca | VOZ |
|---|---|
| [00:00] | Dos días después, la señal volvió. ᴰ Ingenuity estaba de pie. |
| [00:06] | Pero sus palas se habían roto al tocar el suelo. ᴰ Nunca volvería a volar. |
| [00:12] | El 25 de enero de 2024, la NASA dio por terminada su misión. ᴰ Había venido a hacer cinco vuelos. Hizo setenta y dos. ᴰ |
| [00:22] | Después, los ingenieros investigaron el accidente: el primero de un avión en otro mundo. Descubrieron que el suelo sin detalles había engañado a su navegación. ᴰ |
| [00:34] | Y algo más: al menos hasta finales de 2024, Ingenuity seguía enviando datos del clima a Perseverance, una vez por semana. ᴰ |
| [00:44] | Ya no vuela. Pero sigue hablando. |
| [00:48] | Los robots abandonados no están olvidados. Algunos, incluso, siguen trabajando. |

---

## 5. Hotspots (modo Inspección)

| Nodo GLB (`ingenuity.glb`) | Parte | Dato | Cap. |
|---|---|---|---|
| `rotor_top` / `rotor_bottom` | Rotores | ~1,2 m de punta a punta; en el vuelo 72 las cuatro palas se partieron. ᴰ El morph `rotor_damage` lo muestra. | 3, 4, 5B |
| `rotor_mast` | Eje de los rotores | Aquí va el pedacito de tela del Wright Flyer (ubicación aproximada: ⚠ verificar). ᴰ | 3A |
| `solar_panel` | Panel solar | Energía para un vuelo de 90 s por día marciano. ᴰ | 1 |
| `pov_eye` | Cámara de navegación | Seguía detalles del suelo; en arena lisa, casi no veía nada. ᴰ | 4 |
| `antenna` | Antena | Hablaba con la Tierra a través de Perseverance. ᴰ | 4, 5 |

---

## 6. Implementación — mapa de campos (`Chapter[]`)

| Cap. | `title` | `camera` | `pov` | `staticLevel` | `powerCut` | `animation` | `morph` | `audioKey` |
|---|---|---|---|---|---|---|---|---|
| 1 | El despertar | `pov` | `pov_eye` | 0,9 → 0,1 | no | `Wake` → `Idle` | `Surprised` | `mars/ingenuity_01.mp3` |
| 2 | El viaje | `pov` (telemetría) | — | 0,3 → 0,9 → 0,2 | no | `Wake` | `Surprised` | `mars/ingenuity_02.mp3` |
| 3A | El primer vuelo | `pov` | `pov_eye` | 0,05 | no | `Fly` | `Surprised` | `mars/ingenuity_03a.mp3` |
| 3B | Más allá del plan | `pov` | `pov_eye` | 0,05 | no | `Fly` | neutral | `mars/ingenuity_03b.mp3` |
| 4 | El final | `pov` | `pov_eye` | 0,1 → 0,8 | no | `Fly` → `Death` | `Sad` | `mars/ingenuity_04.mp3` |
| 5A | Señal perdida | `pov` | `pov_eye` | 0,8 → 1,0 | **sí** (corte de señal, no de energía) | `Death` | `Sleep` | `mars/ingenuity_05a.mp3` |
| 5B | El legado | `wide` | — | 0 | no | `Idle` | `rotor_damage` = 1 | `mars/ingenuity_05b.mp3` (otra voz) |

**`catalog.ts`:** el resumen ("El primer vuelo motorizado en otro planeta: 72 vuelos históricos") es correcto. No tiene `lastWords` (bien).

---

## 7. Tarjeta de transparencia — "¿Está muerto Ingenuity?"

> **¿Ingenuity dejó de funcionar?**
> No del todo. Sus palas se rompieron en enero de 2024 y ya no puede volar, pero según el JPL, a finales de 2024 todavía enviaba datos del clima a Perseverance una vez por semana. Es un robot "abandonado"… que sigue trabajando.

---

## 8. Hecho vs. licencia narrativa

| Cap. | Hecho | Licencia |
|---|---|---|
| 1 | 1,8 kg, rotores, panel, Jezero, despliegue 3-abr | "Por primera vez, nadie me sostiene" |
| 2 | Lanzamiento, viaje bajo la panza, llegada, atmósfera <1 % | "A oscuras" |
| 3 | Primer vuelo (3 m, 19-abr-2021), tela del Wright Flyer, 5 planeados, 72 hechos, 24 m, 48 aeródromos, dificultades, nombre | "Un vuelo saluda al otro"; el papel de explorador (⚠) |
| 4 | Vuelo 72, objetivo, terreno sin textura, pérdida de contacto a ~1 m | Cuenta regresiva de altura |
| 5 | Reconexión 20-ene, palas rotas, fin 25-ene, investigación, datos semanales (dic-2024) | "Sigue hablando" |

---

## 9. Fuera de alcance por ahora

- **"¿Qué pasaría si…?"** reservado: *"…las aspas no se hubieran dañado en el vuelo 72"* (`PLAN.md` §8).

---

## 10. Pendientes y decisiones para ti

| # | Pendiente | Motivo |
|---|---|---|
| 1 | **Aprobar el 5A como "señal perdida" en lugar de corte eléctrico** | Ingenuity no se apagó (§1.1) |
| 2 | Comprobar si en 2026 Ingenuity sigue enviando datos | Último dato oficial: dic-2024 |
| 3 | Verificar dónde va la tela del Wright Flyer en el helicóptero | Hotspot |
| 4 | Verificar la duración del primer vuelo | Dato atractivo, no confirmado |

---

## 11. Fuentes

1. NASA Science — *Ingenuity Mars Helicopter*: https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/
2. JPL — *After Three Years on Mars, NASA's Ingenuity Helicopter Mission Ends* (25-ene-2024): https://www.jpl.nasa.gov/news/after-three-years-on-mars-nasas-ingenuity-helicopter-mission-ends/
3. NASA Science — *First Video of NASA's Ingenuity Mars Helicopter in Flight*: https://science.nasa.gov/resource/first-video-of-nasas-ingenuity-mars-helicopter-in-flight
4. NASA Science — *Ingenuity's Complete Deployment*: https://science.nasa.gov/resource/ingenuitys-complete-deployment/
5. NASA Science — *Mars Helicopter Updates*: https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/mars-helicopter-updates/
6. JPL — *NASA Performs First Aircraft Accident Investigation on Another World* (11-dic-2024): https://www.jpl.nasa.gov/news/nasa-performs-first-aircraft-accident-investigation-on-another-world/
7. JPL — *Alabama High School Student Names NASA's Mars Helicopter*: https://www.jpl.nasa.gov/news/alabama-high-school-student-names-nasas-mars-helicopter/ ⚠ leído solo vía resumen de búsqueda
