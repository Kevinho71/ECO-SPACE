import type { PartFocus, Story } from '../story'

// Historia de Ingenuity — transcripción de HISTORIA_INGENUITY.md (v2: con cambios de escena, 1.ª ↔ 3.ª persona
// y presentación inicial de sus piezas). Datos con fuentes NASA/JPL (ver §2 y §11 del documento).
// Voces pendientes: solo subtítulos.
//
// Vistas: 'pov' = 1.ª persona (cámara de navegación) · 'wide' / 'chase' / 'part' = 3.ª persona.
// Cada cambio de vista grande va dentro de un parpadeo (jump a t, el lugar cambia en t+0,3).

const JEZ = 'CRÁTER JEZERO'

const focus = (node: string, hotspot: string, dist: number, az: number, el: number): PartFocus => ({ node, hotspot, dist, az, el })

export const ingenuityStory: Story = {
  missionId: 'ingenuity',
  intro: {
    kicker: 'Mars 2020 · Helicóptero de Marte',
    name: 'Ingenuity',
    blurb:
      'Vas a vivir su historia desde dentro: sus ojos serán los tuyos. A ratos la cámara se aleja para que lo veas volar. Mira alrededor arrastrando.',
    button: 'Despertar a Ingenuity',
    short: 'Ingenuity',
  },
  chapters: [
    // -----------------------------------------------------------------------
    // 1 · EL DESPERTAR — 1.ª persona, presentación de sus piezas en 3.ª, de vuelta a 1.ª
    // -----------------------------------------------------------------------
    {
      id: 'despertar',
      title: 'Capítulo 1 · El despertar',
      subtitle: '3 de abril de 2021 · Cráter Jezero, Marte',
      duration: 86,
      audioKey: 'mars/ingenuity_01.mp3',
      place0: 'jezero',
      jumps: [{ t: 15.6, to: 'jezero' }], // parpadeo: de mirar a verme desde fuera
      marks: [
        { t: 0, label: 'Primer contacto' },
        { t: 22, label: 'Mis piezas' },
        { t: 60, label: 'Marte' },
      ],
      cues: [
        { t: 0, text: 'Contacto con el suelo. Cuatro patas… apoyadas.' },
        { t: 5, text: 'Por primera vez, nadie me sostiene.' },
        { t: 9, text: 'Veo alejarse unas ruedas enormes: es Perseverance, el rover que me trajo hasta aquí.' },
        { t: 16, text: 'Soy Ingenuity. Soy un helicóptero. Peso apenas un kilo ochocientos.' },
        { t: 22, text: 'Déjame enseñarte cómo soy.' },
        { t: 24, text: 'Estos son mis rotores: dos, uno sobre otro, de más de un metro de punta a punta. El aire de Marte es casi un vacío, así que tendrán que girar rapidísimo.' },
        { t: 31, text: 'Este es mi panel solar. Carga mis baterías: me da energía para un vuelo de hasta noventa segundos por cada día marciano.' },
        { t: 39, text: 'Este es mi ojo: una cámara que mira el suelo. Sigo sus detalles para saber cuánto me muevo.' },
        { t: 47, text: 'Estas son mis cuatro patas. Todo en mí es ligero, porque para volar tengo que pesar muy poco.' },
        { t: 54, text: 'Y esta antena me permite hablar con la Tierra a través de Perseverance.' },
        { t: 61, text: 'Estoy en Marte, en el cráter Jezero.' },
        { t: 67, text: 'Y voy a intentar algo que nadie ha hecho jamás: volar en otro planeta.' },
        { t: 77, text: 'Pero antes… déjame recordar cómo llegué.' },
      ],
      camera: [
        { t: 0, v: 'pov' },
        { t: 15.9, v: 'wide' },
        { t: 23.5, v: 'part' },
        { t: 60, v: 'pov' },
      ],
      partFocus: [
        { t: 0, v: null },
        { t: 23.5, v: focus('rotor_top', 'rotors', 4.4, 0.8, 0.12) },
        { t: 30.5, v: focus('solar_panel', 'solar', 2.8, 2.4, 0.55) },
        { t: 38.5, v: focus('pov_eye', 'navcam', 1.7, 0.45, 0.1) },
        { t: 46.5, v: focus('leg_3', 'legs', 2.4, 0.7, 0.12) },
        { t: 53.5, v: focus('antenna', 'antenna', 2.1, 2.5, 0.2) },
        { t: 60, v: null },
      ],
      pan: [
        { t: 60, v: 0 },
        { t: 66, v: 0.45 },
        { t: 73, v: -0.35 },
        { t: 80, v: 0 },
      ],
      gaze: [{ t: 0, v: 0.22 }],
      rover: [
        { t: 0, v: 9 },
        { t: 60, v: 30 },
      ],
      scene: [{ t: 0, v: 'surface' }],
      staticLevel: [
        { t: 0, v: 0.9 },
        { t: 4, v: 0.5 },
        { t: 9, v: 0.12 },
        { t: 18, v: 0.05 },
        { t: 76, v: 0.1 },
        { t: 81, v: 0.5 },
        { t: 86, v: 1 },
      ],
      battery: [{ t: 0, v: 0.75 }],
      signal: [
        { t: 0, v: 0.3 },
        { t: 9, v: 1 },
      ],
      clips: [
        { t: 0, v: 'Wake' },
        { t: 3, v: 'Idle' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 2, v: 'Surprised' },
        { t: 6, v: null },
      ],
      hud: [
        { t: 0, v: { date: '3 ABR 2021', place: JEZ } },
        { t: 23.5, v: { date: '3 ABR 2021', place: JEZ, phase: 'MIS PIEZAS' } },
        { t: 60, v: { date: '3 ABR 2021', place: JEZ } },
      ],
      sfx: [{ t: 0, v: 'boot' }],
    },

    // -----------------------------------------------------------------------
    // 2 · EL VIAJE (registro de vuelo, 3.ª persona) → me sueltan en Jezero → 1.ª persona
    // Las etapas del espacio comparten línea de tiempo con `FT` (flightPath.ts): no mover sin cambiar FT.
    // -----------------------------------------------------------------------
    {
      id: 'viaje',
      title: 'Capítulo 2 · El viaje',
      subtitle: 'Registro de vuelo · julio de 2020 → abril de 2021',
      duration: 90,
      audioKey: 'mars/ingenuity_02.mp3',
      place0: 'launch',
      jumps: [
        { t: 22.5, to: 'cruise' },
        { t: 29.9, to: 'cruise' },
        { t: 37.5, to: 'entry' },
        { t: 48.5, to: 'jezero' }, // llego a Jezero colgado bajo el rover
        { t: 65.7, to: 'jezero' }, // abro los ojos dentro de mí: ya estoy suelto
      ],
      marks: [
        { t: 0, label: 'Lanzamiento' },
        { t: 23, label: 'Crucero' },
        { t: 38, label: 'Llegada' },
        { t: 49, label: 'Despliegue' },
      ],
      robot: [
        { t: 0, v: false },
        { t: 48.8, v: true },
      ],
      cues: [
        { t: 0, text: 'Reproduciendo mi registro de vuelo.' },
        { t: 5, text: 'Treinta de julio de 2020. Despego desde Florida… pero no por mi cuenta: voy pegado a la panza de Perseverance.' },
        { t: 14, text: 'Voy colgado bajo el rover, con mis rotores plegados. No veo nada.' },
        { t: 23, text: 'Durante siete meses cruzo la oscuridad entre dos planetas.' },
        { t: 31, text: 'No puedo hacer nada: mi trabajo empieza en la superficie.' },
        { t: 38, text: 'Dieciocho de febrero de 2021. Perseverance entra en la atmósfera de Marte.' },
        { t: 44, text: 'Aterriza en el cráter Jezero. Yo sigo ahí abajo, esperando mi turno.' },
        { t: 50, text: 'Pasan semanas.' },
        { t: 54, text: 'Un día, el rover me suelta, poco a poco.' },
        { t: 66, text: 'Me pongo de pie sobre mis patas. Tres de abril.' },
        { t: 72, text: 'Y ahora viene lo difícil: el aire de Marte es tan fino que tiene menos del uno por ciento del de la Tierra.' },
        { t: 82, text: 'Para volar aquí, mis rotores tienen que girar rapidísimo.' },
      ],
      camera: [
        { t: 0, v: 'flight' },
        { t: 48.8, v: 'wide' },
        { t: 66, v: 'pov' },
        { t: 82, v: 'part' },
      ],
      partFocus: [
        { t: 0, v: null },
        { t: 82, v: focus('rotor_top', 'rotors', 3.2, 0.9, 0.3) },
      ],
      gaze: [{ t: 0, v: 0.22 }],
      // Colgado bajo el rover hasta que lo suelta (alt 0,4 = pegado a la panza).
      alt: [
        { t: 0, v: 0.4 },
        { t: 57, v: 0.4 },
        { t: 63, v: 0 },
      ],
      rover: [
        { t: 0, v: 999 },
        { t: 48.74, v: 999 },
        { t: 48.76, v: 0 },
        { t: 56, v: 0 },
        { t: 68, v: 4.5 },
        { t: 90, v: 4.5 },
      ],
      scene: [
        { t: 0, v: 'flight' },
        { t: 48.8, v: 'surface' },
      ],
      staticLevel: [
        { t: 0, v: 0.25 },
        { t: 5, v: 0.12 },
        { t: 22, v: 0.15 },
        { t: 30, v: 0.1 },
        { t: 37, v: 0.15 },
        { t: 41, v: 0.5 },
        { t: 48, v: 0.4 },
        { t: 50, v: 0.12 },
        { t: 65, v: 0.2 },
        { t: 66, v: 0.6 },
        { t: 70, v: 0.1 },
        { t: 90, v: 0.1 },
      ],
      shake: [
        { t: 0, v: 0 },
        { t: 5.5, v: 0.15 },
        { t: 21, v: 0.1 },
        { t: 22, v: 0 },
        { t: 38, v: 0.35 },
        { t: 48, v: 0.2 },
        { t: 49, v: 0 },
      ],
      battery: [{ t: 0, v: 1 }],
      signal: [
        { t: 0, v: 0.9 },
        { t: 49, v: 0.5 },
        { t: 66, v: 1 },
      ],
      clips: [
        { t: 0, v: 'Idle' },
        { t: 82.5, v: 'Wake' },
        { t: 84, v: 'Idle' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 38, v: 'Surprised' },
        { t: 60, v: null },
      ],
      hud: [
        { t: 0, v: { date: 'JUL 2020', place: 'REGISTRO DE VUELO', phase: 'PREPARANDO LANZAMIENTO' } },
        { t: 5, v: { date: '30 JUL 2020', place: 'CABO CAÑAVERAL', phase: 'LANZAMIENTO · CON PERSEVERANCE' } },
        { t: 23, v: { date: '2020 → 2021', place: 'ESPACIO ENTRE LA TIERRA Y MARTE', phase: 'CRUCERO · ~7 MESES' } },
        { t: 38, v: { date: '18 FEB 2021', place: 'ATMÓSFERA DE MARTE', phase: 'ENTRADA' } },
        { t: 49, v: { date: '26 MAR → 3 ABR 2021', place: JEZ, phase: 'DESPLIEGUE' } },
        { t: 66, v: { date: '3 ABR 2021', place: JEZ } },
      ],
      sfx: [
        { t: 5, v: 'rumble' },
        { t: 38, v: 'rumble' },
        { t: 57, v: 'unfold' },
        { t: 82.5, v: 'boot' },
      ],
    },

    // -----------------------------------------------------------------------
    // 3 · LA MISIÓN — 3A el primer vuelo · 3B más allá del plan (alterna 1.ª y 3.ª persona)
    // -----------------------------------------------------------------------
    {
      id: 'mision',
      title: 'Capítulo 3 · La misión',
      subtitle: 'Abril de 2021 → 2023 · 72 vuelos',
      duration: 106,
      audioKey: 'mars/ingenuity_03.mp3',
      place0: 'airfield',
      jumps: [
        { t: 3.6, to: 'airfield' }, // de verme en el suelo a mirar desde mis ojos
        { t: 40.2, to: 'airfield' }, // del primer plano de la tela al "ojo" mirando a Perseverance
        { t: 51.6, to: 'airfield' }, // 3B: el plan
        { t: 56.6, to: 'outcrop' }, // 3B: vuelo por delante de Perseverance
        { t: 68.6, to: 'outcrop' }, // 3B: récord de altura (mirando abajo)
        { t: 81.6, to: 'jezero' }, // 3B: invierno, polvo y averías
      ],
      marks: [
        { t: 0, label: '3A · El primer vuelo' },
        { t: 51.5, label: '3B · Más allá del plan' },
      ],
      rover: [
        { t: 0, v: 64 },
        { t: 51, v: 64 },
        { t: 56.7, v: 64 },
        { t: 56.8, v: 999 },
        { t: 81.8, v: 999 },
      ],
      cues: [
        { t: 0, text: 'Diecinueve de abril de 2021.' },
        { t: 4, text: 'Mis rotores empiezan a girar. Más rápido. Más rápido.' },
        { t: 9, text: 'Mis patas… se despegan del suelo.' },
        { t: 13, text: 'Subo. Un metro. Dos. Tres. Me quedo flotando en el aire de Marte.' },
        { t: 20, text: 'Bajo despacio… y me poso.' },
        { t: 25, text: 'Es el primer vuelo motorizado y controlado en otro planeta.' },
        { t: 31, text: 'Dentro de mí viaja un trocito de tela del primer avión de la historia, el de los hermanos Wright. Un vuelo saluda al otro.' },
        { t: 41, text: 'A lo lejos, Perseverance me mira. En la Tierra, mi equipo celebra.' },
        { t: 52, text: 'Me pidieron hasta cinco vuelos de prueba en treinta días.' },
        { t: 57, text: 'Hago el sexto. Y el décimo. Y el cincuenta.' },
        { t: 62, text: 'Me convierto en el explorador aéreo de Perseverance: le ayudo a ver lo que hay más adelante.' },
        { t: 69, text: 'Subo hasta veinticuatro metros de altura.' },
        { t: 74, text: 'Aterrizo en cuarenta y ocho lugares diferentes.' },
        { t: 82, text: 'Sobrevivo al invierno de Marte, a un sensor que se rompe, a tres aterrizajes de emergencia.' },
        { t: 90, text: 'Mi nombre me lo dio una estudiante de Alabama, Vaneeza Rupani. Dijo que el ingenio de la gente es lo que nos permite explorar el espacio.' },
        { t: 99, text: 'Creo que tenía razón.' },
      ],
      camera: [
        { t: 0, v: 'wide' },
        { t: 3.9, v: 'pov' },
        { t: 12.5, v: 'chase' },
        { t: 25, v: 'wide' },
        { t: 31, v: 'part' },
        { t: 40.5, v: 'pov' },
        { t: 51.9, v: 'wide' },
        { t: 56.9, v: 'chase' },
        { t: 68.9, v: 'pov' },
        { t: 81.9, v: 'wide' },
      ],
      partFocus: [
        { t: 0, v: null },
        { t: 31, v: focus('fuselage', 'wright', 2.6, 0.9, 0.2) },
        { t: 40.5, v: null },
      ],
      gaze: [
        { t: 0, v: 0.22 },
        { t: 68.5, v: 0.22 },
        { t: 68.9, v: -1.0 },
        { t: 81, v: -1.0 },
        { t: 81.9, v: 0.22 },
      ],
      // Vuelos: 3A (3 m, a la vista) y 3B (a baja altura delante del rover; 24 m de récord).
      alt: [
        { t: 0, v: 0 },
        { t: 8.5, v: 0 },
        { t: 13, v: 3 },
        { t: 19.5, v: 3 },
        { t: 25, v: 0 },
        { t: 56.9, v: 0 },
        { t: 58.5, v: 4 },
        { t: 62, v: 6 },
        { t: 68.4, v: 4 },
        { t: 69, v: 4 },
        { t: 75, v: 24 },
        { t: 77, v: 24 },
        { t: 81.5, v: 0 },
      ],
      tilt: [
        { t: 0, v: 0 },
        { t: 58, v: 0 },
        { t: 59.5, v: 0.14 },
        { t: 68.4, v: 0.14 },
        { t: 69, v: 0.12 },
        { t: 77, v: 0.12 },
        { t: 81.5, v: 0 },
      ],
      robotX: [
        { t: 0, v: 0 },
        { t: 56.85, v: 0 },
        { t: 58, v: 0 },
        { t: 68.4, v: 26 },
        { t: 68.85, v: 26 },
        { t: 68.9, v: 0 },
        { t: 75, v: 14 },
        { t: 81.5, v: 34 },
        { t: 81.85, v: 34 },
        { t: 81.9, v: 0 },
      ],
      scene: [{ t: 0, v: 'surface' }],
      staticLevel: [
        { t: 0, v: 0.5 },
        { t: 3, v: 0.12 },
        { t: 5, v: 0.05 },
        { t: 40, v: 0.2 },
        { t: 42, v: 0.05 },
        { t: 106, v: 0.05 },
      ],
      dust: [
        { t: 0, v: 0 },
        { t: 82, v: 0 },
        { t: 84, v: 0.5 },
        { t: 89, v: 0.5 },
        { t: 91, v: 0 },
      ],
      battery: [
        { t: 0, v: 0.8 },
        { t: 82, v: 0.8 },
        { t: 85, v: 0.35 },
        { t: 89, v: 0.35 },
        { t: 93, v: 0.8 },
      ],
      signal: [{ t: 0, v: 1 }],
      clips: [
        { t: 0, v: 'Idle' },
        { t: 4, v: 'Fly' },
        { t: 25.5, v: 'Idle' },
        { t: 56.9, v: 'Fly' },
        { t: 81.6, v: 'Idle' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 9, v: 'Surprised' },
        { t: 27, v: null },
      ],
      hud: [
        { t: 0, v: { date: '19 ABR 2021', place: JEZ, phase: 'VUELO 001', showAlt: true } },
        { t: 51.9, v: { date: '2021 → 2023', place: JEZ, phase: 'PLAN: HASTA 5 VUELOS EN 30 DÍAS' } },
        { t: 57, v: { date: '2021 → 2023', place: JEZ, phase: 'VUELOS 6 → 50…', showAlt: true } },
        { t: 69, v: { date: '2021 → 2023', place: JEZ, phase: 'ALTURA RÉCORD · 24 m', showAlt: true } },
        { t: 82, v: { date: '2021 → 2023', place: JEZ, phase: 'INVIERNO · POLVO · AVERÍAS' } },
        { t: 90, v: { date: '2021 → 2023', place: JEZ, phase: 'EL NOMBRE · CONCURSO "NAME THE ROVER"' } },
      ],
      sfx: [
        { t: 3.8, v: 'rotor' },
        { t: 56.9, v: 'rotor' },
      ],
    },

    // -----------------------------------------------------------------------
    // 4 · EL FINAL — vuelo 72 sobre arena lisa
    // -----------------------------------------------------------------------
    {
      id: 'final',
      title: 'Capítulo 4 · El final',
      subtitle: '18 de enero de 2024 · Vuelo 72',
      duration: 40,
      audioKey: 'mars/ingenuity_04.mp3',
      place0: 'sandwaves',
      jumps: [{ t: 4.6, to: 'sandwaves' }],
      cues: [
        { t: 0, text: 'Dieciocho de enero de 2024. Vuelo setenta y dos.' },
        { t: 5, text: 'Es un vuelo cortito: subir, mirar mis sistemas, bajar.' },
        { t: 11, text: 'Debajo de mí, solo ondas de arena. Lisas. Todas iguales.' },
        { t: 17, text: 'Mi navegación busca detalles en el suelo para saber cómo me muevo… y no encuentra casi nada.' },
        { t: 25, text: 'Bajo.' },
        { t: 28, text: 'Cinco metros. Tres.' },
        { t: 33, text: 'Uno…' },
        { t: 36, text: 'Pierdo a Perseverance.' },
      ],
      camera: [
        { t: 0, v: 'wide' },
        { t: 4.9, v: 'pov' },
        { t: 17, v: 'part' },
        { t: 25, v: 'chase' },
        { t: 31, v: 'pov' },
      ],
      partFocus: [
        { t: 0, v: null },
        { t: 17, v: focus('pov_eye', 'navcam', 2.0, 0.5, 0.1) },
        { t: 25, v: null },
      ],
      gaze: [
        { t: 0, v: 0.15 },
        { t: 4.9, v: 0.15 },
        { t: 8.5, v: -1.0 },
        { t: 40, v: -0.9 },
      ],
      alt: [
        { t: 0, v: 0 },
        { t: 5.8, v: 0 },
        { t: 14, v: 12 },
        { t: 25, v: 12 },
        { t: 28.5, v: 5 },
        { t: 31, v: 3 },
        { t: 34, v: 1 },
        { t: 40, v: 1 },
      ],
      shake: [
        { t: 0, v: 0 },
        { t: 33.5, v: 0 },
        { t: 36, v: 0.25 },
      ],
      scene: [{ t: 0, v: 'surface' }],
      staticLevel: [
        { t: 0, v: 0.1 },
        { t: 25, v: 0.1 },
        { t: 30, v: 0.4 },
        { t: 34, v: 0.8 },
        { t: 40, v: 0.8 },
      ],
      battery: [{ t: 0, v: 0.7 }],
      signal: [
        { t: 0, v: 1 },
        { t: 28, v: 0.8 },
        { t: 34, v: 0.3 },
        { t: 36, v: 0.1 },
      ],
      clips: [
        { t: 0, v: 'Idle' },
        { t: 5.2, v: 'Fly' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 17, v: 'Surprised' },
        { t: 25, v: null },
        { t: 33, v: 'Sad' },
      ],
      hud: [
        { t: 0, v: { date: '18 ENE 2024', place: JEZ, phase: 'VUELO 072 · PLAN: SUBIR 12 m', showAlt: true } },
        { t: 17, v: { date: '18 ENE 2024', place: JEZ, phase: 'NAV: TEXTURA BAJA', showAlt: true } },
        { t: 25, v: { date: '18 ENE 2024', place: JEZ, phase: 'DESCENSO', showAlt: true } },
      ],
      sfx: [{ t: 5, v: 'rotor' }],
      cards: [{ at: 17.5, dur: 6, kind: 'note', text: 'NAVEGACIÓN · TEXTURA DEL SUELO: BAJA' }],
    },

    // -----------------------------------------------------------------------
    // 5 · SEÑAL PERDIDA… Y EL LEGADO (~70 s). Ingenuity no se apagó: se perdió la señal, no la energía.
    // -----------------------------------------------------------------------
    {
      id: 'legado',
      title: 'Capítulo 5 · Señal perdida… y el legado',
      subtitle: '18 de enero de 2024 → hoy',
      duration: 70,
      audioKey: 'mars/ingenuity_05.mp3',
      place0: 'sandwaves',
      marks: [
        { t: 0, label: 'Señal perdida' },
        { t: 12, label: 'El legado' },
      ],
      cues: [
        { t: 2.2, text: '¿Me oyes?' },
        { t: 4.6, text: '¿Perse…?' },
        { t: 12, voice: 'narrator', text: 'Dos días después, la señal volvió. Ingenuity estaba de pie.' },
        { t: 18, voice: 'narrator', text: 'Pero sus palas se habían roto al tocar el suelo. Nunca volvería a volar.' },
        {
          t: 25,
          voice: 'narrator',
          text: 'El 25 de enero de 2024, la NASA dio por terminada su misión. Había venido a hacer cinco vuelos. Hizo setenta y dos.',
        },
        {
          t: 34,
          voice: 'narrator',
          text: 'Después, los ingenieros investigaron el accidente: el primero de un avión en otro mundo. Descubrieron que el suelo sin detalles había engañado a su navegación.',
        },
        {
          t: 46,
          voice: 'narrator',
          text: 'Y algo más: al menos hasta finales de 2024, Ingenuity seguía enviando datos del clima a Perseverance, una vez por semana.',
        },
        { t: 56, voice: 'narrator', text: 'Ya no vuela. Pero sigue hablando.' },
        { t: 62, voice: 'narrator', text: 'Los robots abandonados no están olvidados. Algunos, incluso, siguen trabajando.' },
      ],
      camera: [
        { t: 0, v: 'pov' },
        { t: 11.9, v: 'wide' },
        { t: 18, v: 'part' },
        { t: 25, v: 'wide' },
        { t: 34, v: 'part' },
        { t: 41.5, v: 'wide' },
        { t: 46, v: 'part' },
        { t: 55, v: 'wide' },
      ],
      partFocus: [
        { t: 0, v: null },
        { t: 18, v: focus('rotor_top', 'rotors', 3.0, 0.8, 0.28) },
        { t: 25, v: null },
        { t: 34, v: focus('pov_eye', 'navcam', 2.0, 0.5, 0.1) },
        { t: 41.5, v: null },
        { t: 46, v: focus('antenna', 'antenna', 2.2, 2.4, 0.2) },
        { t: 55, v: null },
      ],
      gaze: [
        { t: 0, v: -0.6 },
        { t: 0.8, v: -0.1 },
        { t: 3, v: 0.2 },
      ],
      // Caída desde ~1 m, golpe seco y palas rotas.
      alt: [
        { t: 0, v: 1 },
        { t: 0.8, v: 0 },
      ],
      tilt: [
        { t: 0, v: 0 },
        { t: 0.5, v: 0.3 },
        { t: 0.9, v: -0.12 },
        { t: 1.6, v: 0 },
      ],
      shake: [
        { t: 0, v: 0 },
        { t: 0.8, v: 0.9 },
        { t: 1.8, v: 0 },
      ],
      damage: [
        { t: 0, v: 0 },
        { t: 0.8, v: 0 },
        { t: 1.1, v: 1 },
      ],
      rover: [
        { t: 0, v: 999 },
        { t: 11.89, v: 999 },
        { t: 11.9, v: 55 },
      ],
      scene: [{ t: 0, v: 'surface' }],
      staticLevel: [
        { t: 0, v: 0.85 },
        { t: 4, v: 0.95 },
        { t: 5.6, v: 1 },
        { t: 7.5, v: 1 },
        { t: 11.9, v: 0 },
      ],
      powerOff: [
        { t: 0, v: 0 },
        { t: 5.6, v: 0 },
        { t: 6.6, v: 1 },
        { t: 12.5, v: 1 },
        { t: 15.5, v: 0 },
      ],
      battery: [{ t: 0, v: 0.6 }],
      signal: [
        { t: 0, v: 0.1 },
        { t: 5.6, v: 0 },
        { t: 12, v: 0.4 },
        { t: 30, v: 1 },
      ],
      clips: [
        { t: 0, v: 'Fly' },
        { t: 0.8, v: 'Death' },
        { t: 11.9, v: 'Idle' },
      ],
      expressions: [
        { t: 0, v: 'Sad' },
        { t: 5.6, v: 'Sleep' },
        { t: 11.9, v: null },
      ],
      hud: [
        { t: 0, v: { date: '18 ENE 2024', place: JEZ, phase: 'VUELO 072 · CONTACTO PERDIDO', showAlt: true } },
        { t: 6.6, v: { date: '', place: '', hidden: true } },
      ],
      sfx: [
        { t: 0.8, v: 'thud' },
        { t: 6.5, v: 'relay' },
      ],
      cards: [
        { at: 7.4, dur: 4.4, kind: 'note', text: 'SEÑAL PERDIDA · VUELO 072 · 18 ENE 2024' },
      ],
    },
  ],

  transparency: {
    title: '¿Dejó de funcionar Ingenuity?',
    body: 'No del todo. Sus palas se rompieron en enero de 2024 y ya no puede volar, pero según el JPL, a finales de 2024 todavía enviaba datos del clima y de prueba de su electrónica a Perseverance una vez por semana. Es un robot «abandonado»… que sigue trabajando.',
    sources: [
      {
        label: 'JPL · Fin de la misión de Ingenuity (25-ene-2024)',
        url: 'https://www.jpl.nasa.gov/news/after-three-years-on-mars-nasas-ingenuity-helicopter-mission-ends/',
      },
      {
        label: 'JPL · Primera investigación de un accidente aéreo en otro mundo (11-dic-2024)',
        url: 'https://www.jpl.nasa.gov/news/nasa-performs-first-aircraft-accident-investigation-on-another-world/',
      },
    ],
  },
}
