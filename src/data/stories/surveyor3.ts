import type { Keyframe, PartFocus, Story, WideShot } from '../story'

// Historia de Surveyor 3 — transcripción de HISTORIA_SURVEYOR3.md (5 capítulos).
// Luna: no hay aire, así que la escena es siempre 'flight' (solo telemetría, sin viento).
// El robot mira hacia +X (la cámara de TV). Lugares: 'earth-orbit' → 'translunar' → 'moon-approach' (DeepSpace)
// → 'oceanus' (LunarScene). Pistas (`tracks`): ver MISSION_EXTRAS.surveyor3 en three/extras.tsx.
// Datos verificados con NASA y NSSDC (ver HISTORIA_SURVEYOR3.md §2 y §11). Voces pendientes: solo subtítulos.

/** Centro aproximado de la nave. */
const S: [number, number, number] = [0, 1.3, 0]

// --- Vistas exteriores ---
const WIDE_S: WideShot = { dist: 8, height: 2.4, az: 0.9, swing: 0.2, target: S }
const WIDE_S_FAR: WideShot = { dist: 12, height: 3, az: 0.4, swing: 0.2, target: S }
/** Desde el lado de la Tierra mirando hacia delante: la Luna crece al frente. */
const WIDE_AHEAD: WideShot = { dist: 9, height: 1.0, az: 0.5, swing: 0.15, target: S }
/** Para ver los rebotes (hasta ~10 m de altura). */
const WIDE_BOUNCE: WideShot = { dist: 17, height: 6, az: 0.9, swing: 0.05, target: [0, 4, 0] }
/** Visita del Apolo 12: Surveyor 3 en el origen y el módulo lunar a unos 30 m (a escala de narración). */
const WIDE_VISIT: WideShot = { dist: 34, height: 9, az: 0.9, swing: 0.05, target: [12, 3, -9.5] }
const WIDE_NEAR: WideShot = { dist: 9, height: 1.8, az: 1.0, swing: 0.1, target: [1.4, 1.1, -0.8] }
const WIDE_FAREWELL: WideShot = { dist: 30, height: 8, az: 0.9, swing: 0.1, target: [8, 2, -6] }

// --- Primeros planos (la cámara gira ≈0,09 rad/s: el ángulo inicial es el que mejor se ve al principio del tramo) ---
const PART_TV: PartFocus = { node: 'tv_head', hotspot: 'tv', dist: 2.4, az: -0.15, el: 0.25 }
const PART_SAMPLER: PartFocus = { node: 'sampler_lower', hotspot: 'sampler', dist: 3.2, az: -0.2, el: 0.25 }
const PART_SOLAR: PartFocus = { node: 'solar_panel', hotspot: 'solar', dist: 3.0, az: -0.5, el: 0.45 }

const OCEANUS = 'OCEANUS PROCELLARUM · 3,0° S 23,4° O'

/**
 * La nave está apoyada en la ladera de un cráter (≈14° reales). Aquí se inclina solo ≈7°: el suelo del escenario es llano y con
 * más inclinación las patas de atrás quedarían en el aire. Se levanta un poco para no hundir las de delante.
 */
const SLOPE_TILT = [{ t: 0, v: -0.12 }]
const SLOPE_LIFT = [{ t: 0, v: 0.14 }]

/** Un salto (m de altura, parabólico) desde `t0` durante `dur` s. `sink` negativo = hacia arriba. */
function hop(t0: number, dur: number, h: number, steps = 6): Keyframe<number>[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const u = i / steps
    return { t: t0 + u * dur, v: -h * 4 * u * (1 - u) }
  })
}

export const surveyor3Story: Story = {
  missionId: 'surveyor3',
  // Pantallas que rodean a la historia (inicio, exploración y cierre).
  texts: {
    kicker: 'NASA · Surveyor 3 · 1967',
    name: 'Surveyor 3',
    intro:
      'Vas a vivir su historia desde dentro: tus ojos serán su cámara de televisión. A ratos te verás desde fuera. Mira alrededor arrastrando.',
    startLabel: '▶ Despertar a Surveyor 3',
    exploreLabel: 'Explorar la nave',
    exploreHint: 'Arrastra para girar alrededor de la nave · pulsa los puntos brillantes para ver sus partes',
    endKicker: '¿Bacterias en la Luna?',
  },
  chapters: [
    // -----------------------------------------------------------------------
    // 1 · EL DESPERTAR   (ladera de un cráter, Océano de las Tormentas, 20 de abril de 1967)
    // -----------------------------------------------------------------------
    {
      id: 'despertar',
      title: 'Capítulo 1 · El despertar',
      subtitle: 'Océano de las Tormentas · 20 de abril de 1967',
      duration: 50,
      audioKey: 'moon/surveyor3_01.mp3',
      place0: 'oceanus',
      cues: [
        { t: 0, text: 'Motores… apagados. Por fin.' },
        { t: 5, text: 'Estoy inclinado. Mis patas se apoyan en la ladera de un cráter.' },
        { t: 11, text: 'Soy Surveyor 3. Un explorador sin tripulación: nadie viaja dentro de mí.' },
        {
          t: 18,
          text: 'Tengo una cámara que mira a través de un espejo, un brazo con una pala, y un panel que bebe la luz del Sol.',
        },
        { t: 27, text: 'Estoy en la Luna, en un lugar llamado Océano de las Tormentas.' },
        { t: 33, text: 'Mi misión: averiguar si este suelo puede sostener a una nave con personas. Dentro de poco, vendrán.' },
        { t: 42, text: 'Pero mi llegada… fue un poco movida. Déjame recordarla.' },
      ],
      // Ojo (la ladera) → exterior al presentarse → la cámara, el brazo y el panel de cerca → ojo → exterior → ojo.
      camera: [
        { t: 0, v: 'pov' },
        { t: 10.65, v: 'wide' },
        { t: 17.65, v: 'part' },
        { t: 26.65, v: 'pov' },
        { t: 32.65, v: 'wide' },
        { t: 41.65, v: 'pov' },
      ],
      wide: [
        { t: 10.65, v: WIDE_S },
        { t: 32.65, v: WIDE_S_FAR },
      ],
      // La frase "una cámara… un brazo… un panel" se enseña pieza por pieza.
      partFocus: [
        { t: 0, v: null },
        { t: 17.65, v: PART_TV },
        { t: 21.3, v: PART_SAMPLER },
        { t: 24, v: PART_SOLAR },
      ],
      pan: [
        { t: 0, v: 0 },
        { t: 26.65, v: 0.15 },
        { t: 41.65, v: 0 },
      ],
      tracks: { tilt: SLOPE_TILT, lift: SLOPE_LIFT },
      scene: [{ t: 0, v: 'flight' }],
      staticLevel: [
        { t: 0, v: 0.9 },
        { t: 4, v: 0.5 },
        { t: 9, v: 0.15 },
        { t: 30, v: 0.08 },
        { t: 45, v: 0.1 },
        { t: 50, v: 0.6 },
      ],
      battery: [{ t: 0, v: 1 }],
      signal: [
        { t: 0, v: 0.6 },
        { t: 9, v: 1 },
      ],
      clips: [
        { t: 0, v: 'Wake' },
        { t: 4, v: 'Idle' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 2, v: 'Surprised' },
        { t: 5.5, v: null },
      ],
      hud: [{ t: 0, v: { date: '20 ABR 1967 · 00:04 UT', place: OCEANUS, phase: 'CONTACTO' } }],
      sfx: [{ t: 0, v: 'boot' }],
    },

    // -----------------------------------------------------------------------
    // 2 · EL VIAJE   (registro de vuelo: lanzamiento → camino a la Luna → descenso → tres contactos)
    // -----------------------------------------------------------------------
    {
      id: 'viaje',
      title: 'Capítulo 2 · El viaje',
      subtitle: 'Registro de vuelo · 17 → 20 de abril de 1967',
      duration: 60,
      audioKey: 'moon/surveyor3_02.mp3',
      place0: 'earth-orbit',
      jumps: [
        { t: 10.65, to: 'translunar' },
        { t: 18.65, to: 'moon-approach' },
        { t: 29.65, to: 'oceanus' },
      ],
      cues: [
        { t: 0, text: 'Reproduciendo mi registro de vuelo.' },
        { t: 4, text: 'Diecisiete de abril de 1967. Un cohete Atlas-Centaur me lanza desde Florida.' },
        { t: 11, text: 'Tres días después, la Luna crece frente a mí. Mis motores se encienden para frenar.' },
        { t: 19, text: 'Mis radares miran el suelo… pero el suelo brilla demasiado. Pierdo la referencia.' },
        { t: 26, text: 'Debería apagar los motores. No lo hago.' },
        { t: 30, text: 'Toco la Luna… y reboto, alto, como una pelota: unos diez metros.' },
        { t: 36, text: 'Toco otra vez. Reboto de nuevo, unos tres metros.' },
        { t: 41, text: 'Desde la Tierra, mi equipo envía una orden: apagar motores.' },
        { t: 46, text: 'Tercer contacto. Me quedo quieto. Treinta y cuatro segundos después del primer golpe.' },
        { t: 53, text: 'Estoy entero. Abro mi ojo.' },
      ],
      // Ojo en el lanzamiento → exterior hacia la Luna → ojo al perder los radares → exterior para ver los rebotes → ojo en el 2.º golpe
      // → exterior al apagar los motores → ojo al abrir el ojo.
      camera: [
        { t: 0, v: 'pov' },
        { t: 10.65, v: 'wide' },
        { t: 18.65, v: 'pov' },
        { t: 29.65, v: 'wide' },
        { t: 35.65, v: 'pov' },
        { t: 40.65, v: 'wide' },
        { t: 52.65, v: 'pov' },
      ],
      wide: [
        { t: 10.65, v: WIDE_AHEAD },
        { t: 29.65, v: WIDE_BOUNCE },
        { t: 40.65, v: WIDE_S },
      ],
      // Los tres contactos (la escala de tiempo está comprimida: ver HISTORIA_SURVEYOR3.md §12). sink negativo = hacia arriba.
      sink: [
        { t: 0, v: 0 },
        { t: 30, v: 0 },
        ...hop(30, 5.9, 10),
        { t: 35.9, v: 0 },
        ...hop(36, 3, 3, 5),
        { t: 39, v: 0 },
        { t: 43.4, v: 0 },
        ...hop(43.4, 1.6, 0.45, 4),
      ],
      tracks: {
        // Los motores siguen encendidos hasta la orden de la Tierra (43 s en el relato).
        fire: [
          { t: 0, v: 0 },
          { t: 29.9, v: 0 },
          { t: 30, v: 1 },
          { t: 43, v: 1 },
          { t: 43.3, v: 0 },
        ],
        // Al quedarse quieta, queda apoyada en la ladera.
        tilt: [
          { t: 0, v: 0 },
          { t: 44.8, v: 0 },
          { t: 45.5, v: -0.12 },
        ],
        lift: [
          { t: 0, v: 0 },
          { t: 44.8, v: 0 },
          { t: 45.5, v: 0.14 },
        ],
      },
      scene: [{ t: 0, v: 'flight' }],
      // La estática salta un instante con cada suceso; el resto del tiempo se mantiene baja para ver el descenso y los rebotes.
      staticLevel: [
        { t: 0, v: 0.3 },
        { t: 4, v: 0.4 },
        { t: 9, v: 0.15 },
        { t: 18.65, v: 0.12 },
        { t: 19.2, v: 0.5 },
        { t: 21, v: 0.25 },
        { t: 26, v: 0.25 },
        { t: 26.4, v: 0.45 },
        { t: 28, v: 0.2 },
        { t: 29.65, v: 0.12 },
        { t: 30, v: 0.5 },
        { t: 32, v: 0.12 },
        { t: 35.9, v: 0.12 },
        { t: 36, v: 0.45 },
        { t: 38, v: 0.12 },
        { t: 44.9, v: 0.12 },
        { t: 45, v: 0.4 },
        { t: 47, v: 0.1 },
        { t: 60, v: 0.1 },
      ],
      shake: [
        { t: 0, v: 0 },
        { t: 3.5, v: 0 },
        { t: 4, v: 0.5 },
        { t: 9, v: 0.4 },
        { t: 10.4, v: 0 },
        { t: 29.65, v: 0 },
        { t: 30, v: 0.7 },
        { t: 31, v: 0.05 },
        { t: 35.8, v: 0 },
        { t: 36, v: 0.5 },
        { t: 37, v: 0.05 },
        { t: 44.9, v: 0 },
        { t: 45, v: 0.4 },
        { t: 46.5, v: 0 },
      ],
      battery: [{ t: 0, v: 1 }],
      signal: [
        { t: 0, v: 0.9 },
        { t: 18.65, v: 0.5 },
        { t: 45, v: 1 },
      ],
      clips: [{ t: 0, v: 'Idle' }],
      expressions: [
        { t: 0, v: null },
        { t: 19, v: 'Surprised' },
        { t: 47, v: null },
      ],
      hud: [
        { t: 0, v: { date: 'ABR 1967', place: 'REGISTRO DE VUELO', phase: 'PREPARANDO EL LANZAMIENTO' } },
        { t: 4, v: { date: '17 ABR 1967 · 07:05 UT', place: 'CABO CAÑAVERAL', phase: 'LANZAMIENTO · ATLAS-CENTAUR' } },
        { t: 11, v: { date: 'ABR 1967', place: 'ENTRE LA TIERRA Y LA LUNA', phase: 'CAMINO A LA LUNA' } },
        { t: 19, v: { date: '20 ABR 1967', place: 'DESCENSO', phase: 'RADAR: SIN REFERENCIA' } },
        { t: 26, v: { date: '20 ABR 1967', place: 'DESCENSO', phase: 'LOS MOTORES SIGUEN ENCENDIDOS' } },
        { t: 30, v: { date: '20 ABR 1967 · 00:04:17 UT', place: OCEANUS, phase: 'CONTACTO 1 · T+0 s' } },
        { t: 36, v: { date: '20 ABR 1967', place: OCEANUS, phase: 'CONTACTO 2' } },
        { t: 41, v: { date: '20 ABR 1967', place: OCEANUS, phase: 'ORDEN DESDE LA TIERRA' } },
        { t: 43, v: { date: '20 ABR 1967', place: OCEANUS, phase: 'T+34 s · MOTORES APAGADOS' } },
        { t: 45, v: { date: '20 ABR 1967 · 00:04:53 UT', place: OCEANUS, phase: 'CONTACTO 3 (FINAL) · T+36 s' } },
      ],
      sfx: [
        { t: 4, v: 'rumble' },
        { t: 11.3, v: 'retro' },
        { t: 30, v: 'thud' },
        { t: 35.9, v: 'thud' },
        { t: 45, v: 'thud' },
      ],
    },

    // -----------------------------------------------------------------------
    // 3 · LA MISIÓN   (las fotos y la pala: ¿aguanta el suelo?)
    // -----------------------------------------------------------------------
    {
      id: 'mision',
      title: 'Capítulo 3 · La misión',
      subtitle: 'Abril–mayo de 1967 · ¿aguanta el suelo?',
      duration: 56,
      audioKey: 'moon/surveyor3_03.mp3',
      place0: 'oceanus',
      marks: [
        { t: 0, label: 'Las fotos' },
        { t: 19, label: 'La pala' },
      ],
      cues: [
        { t: 0, text: 'Envío mi primera foto a la Tierra menos de una hora después de llegar.' },
        { t: 6, text: 'Luego otra, y otra. Cada una tarda unos veinte segundos en formarse.' },
        { t: 13, text: 'Miro el suelo, las piedras, el horizonte. Miro mis propias patas.' },
        { t: 19, text: 'Y entonces, mi brazo. Bajo la pala y araño el suelo.' },
        { t: 25, text: 'Cavo cuatro zanjas. Aprieto. Golpeo. Mido cuánto se hunde.' },
        { t: 33, text: 'El suelo se comporta como arena húmeda.' },
        { t: 38, text: 'La respuesta a mi misión es sí: este suelo puede sostener un módulo lunar con astronautas.' },
        { t: 46, text: 'En total, envío seis mil trescientas veintiséis fotos.' },
      ],
      // Ojo mirando el paisaje → primer plano de la pala trabajando → exterior con la respuesta → ojo.
      camera: [
        { t: 0, v: 'pov' },
        { t: 18.65, v: 'part' },
        { t: 37.65, v: 'wide' },
        { t: 45.65, v: 'pov' },
      ],
      wide: [{ t: 37.65, v: WIDE_S_FAR }],
      partFocus: [
        { t: 0, v: null },
        { t: 18.65, v: PART_SAMPLER },
      ],
      // Mira el suelo, las piedras y el horizonte (cue 13).
      pan: [
        { t: 0, v: 0 },
        { t: 13, v: 0 },
        { t: 14.5, v: 0.9 },
        { t: 16.5, v: -0.9 },
        { t: 18.65, v: 0 },
        { t: 56, v: 0 },
      ],
      tracks: { tilt: SLOPE_TILT, lift: SLOPE_LIFT },
      scene: [{ t: 0, v: 'flight' }],
      staticLevel: [
        { t: 0, v: 0.12 },
        { t: 4, v: 0.05 },
        { t: 56, v: 0.05 },
      ],
      battery: [{ t: 0, v: 1 }],
      signal: [{ t: 0, v: 1 }],
      clips: [
        { t: 0, v: 'Idle' },
        { t: 18.65, v: 'Dig' },
        { t: 37.65, v: 'Idle' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 38, v: 'Surprised' },
        { t: 44, v: null },
      ],
      hud: [
        { t: 0, v: { date: '20 ABR 1967', place: OCEANUS, phase: 'PRIMERA IMAGEN · MENOS DE 1 h TRAS ATERRIZAR' } },
        { t: 6, v: { date: 'ABR 1967', place: OCEANUS, phase: 'UNA IMAGEN CADA ~20 s' } },
        { t: 19, v: { date: 'ABR 1967', place: OCEANUS, phase: 'PALA · BRAZO DE 1,5 m' } },
        { t: 25, v: { date: 'ABR 1967', place: OCEANUS, phase: 'CAVANDO · 4 ZANJAS' } },
        { t: 33, v: { date: 'ABR 1967', place: OCEANUS, phase: 'SUELO: COMO ARENA HÚMEDA' } },
        { t: 38, v: { date: 'ABR 1967', place: OCEANUS, phase: 'SUELO APTO PARA UN MÓDULO LUNAR' } },
        { t: 46, v: { date: 'ABR–MAY 1967', place: OCEANUS, phase: '6 326 IMÁGENES ENVIADAS' } },
      ],
      cards: [
        {
          at: 38,
          dur: 8,
          kind: 'note',
          text: 'RESISTENCIA DEL SUELO ≈ 10 psi (0,7 kg/cm²) · LO BASTANTE FIRME PARA UN MÓDULO LUNAR APOLO',
        },
      ],
    },

    // -----------------------------------------------------------------------
    // 4 · EL FINAL   (atardecer lunar y últimos datos)
    // -----------------------------------------------------------------------
    {
      id: 'final',
      title: 'Capítulo 4 · El final',
      subtitle: '3 de mayo de 1967 · puesta de Sol',
      duration: 38,
      audioKey: 'moon/surveyor3_04.mp3',
      place0: 'oceanus',
      cues: [
        { t: 0, text: 'Dos semanas de luz. Así es un día en la Luna.' },
        { t: 6, text: 'Ahora el Sol se esconde detrás del horizonte.' },
        { t: 11, text: 'Llega la noche lunar: otras dos semanas de oscuridad y un frío terrible.' },
        { t: 18, text: 'Mi panel ya no encuentra luz.' },
        { t: 22, text: 'Envío mis últimos datos a la Tierra. Cuatro de mayo de 1967.' },
        { t: 29, text: 'Quizá, cuando vuelva el Sol, despierte…' },
      ],
      // Ojo → exterior para ver caer la luz → primer plano del panel sin luz → ojo para los últimos datos.
      camera: [
        { t: 0, v: 'pov' },
        { t: 5.65, v: 'wide' },
        { t: 17.65, v: 'part' },
        { t: 21.65, v: 'pov' },
      ],
      wide: [{ t: 5.65, v: WIDE_S_FAR }],
      partFocus: [
        { t: 0, v: null },
        { t: 17.65, v: PART_SOLAR },
      ],
      // La luz baja, se vuelve cálida y se apaga (el Sol se vuelve un disco pálido): `dust` lo controla.
      dust: [
        { t: 0, v: 0 },
        { t: 6, v: 0.15 },
        { t: 11, v: 0.5 },
        { t: 18, v: 0.9 },
        { t: 22, v: 1 },
        { t: 38, v: 1 },
      ],
      tracks: { tilt: SLOPE_TILT, lift: SLOPE_LIFT },
      scene: [{ t: 0, v: 'flight' }],
      staticLevel: [
        { t: 0, v: 0.08 },
        { t: 22, v: 0.2 },
        { t: 29, v: 0.5 },
        { t: 38, v: 0.6 },
      ],
      battery: [
        { t: 0, v: 1 },
        { t: 11, v: 0.7 },
        { t: 18, v: 0.4 },
        { t: 22, v: 0.2 },
        { t: 29, v: 0.08 },
      ],
      signal: [
        { t: 0, v: 1 },
        { t: 22, v: 0.7 },
        { t: 29, v: 0.3 },
      ],
      clips: [{ t: 0, v: 'Idle' }],
      expressions: [
        { t: 0, v: null },
        { t: 18, v: 'Sad' },
      ],
      hud: [
        { t: 0, v: { date: '3 MAY 1967', place: OCEANUS, phase: 'ATARDECER LUNAR' } },
        { t: 11, v: { date: '3 MAY 1967', place: OCEANUS, phase: 'COMIENZA LA NOCHE LUNAR · ~2 SEMANAS' } },
        { t: 22, v: { date: '4 MAY 1967 · 00:04 UT', place: OCEANUS, phase: 'ÚLTIMOS DATOS' } },
      ],
    },

    // -----------------------------------------------------------------------
    // 5 · EL CORTE Y LA VISITA   (silencio → Apolo 12 → la cámara en un museo)
    // -----------------------------------------------------------------------
    {
      id: 'legado',
      title: 'Capítulo 5 · El corte y la visita',
      subtitle: '4 de mayo de 1967 → 20 de noviembre de 1969 → hoy',
      duration: 80,
      audioKey: 'moon/surveyor3_05.mp3',
      place0: 'oceanus',
      // Parpadeo = salto en el tiempo: dos años y medio después, de noche a día.
      jumps: [{ t: 20.65, to: 'oceanus' }],
      marks: [
        { t: 0, label: 'Silencio' },
        { t: 12, label: 'Sin despertar' },
        { t: 21, label: 'Apolo 12' },
      ],
      powerCutAt: 6.5,
      cues: [
        { t: 0, text: 'Hace frío. Mucho frío.' },
        { t: 4, text: 'Mi ojo… se…' },
        {
          t: 12,
          voice: 'narrator',
          text: 'Surveyor 3 no volvió a despertar. Pero había cumplido: el suelo podía sostener a una nave tripulada.',
        },
        { t: 21, voice: 'narrator', text: 'Dos años y medio después, el 19 de noviembre de 1969, llegó el Apolo 12.' },
        {
          t: 28,
          voice: 'narrator',
          text: 'Su viaje empezó con un susto: dos rayos alcanzaron el cohete al despegar. Los astronautas siguieron adelante.',
        },
        { t: 37, voice: 'narrator', text: 'Y aterrizaron a menos de doscientos metros de Surveyor 3.' },
        {
          t: 43,
          voice: 'narrator',
          text: 'Pete Conrad y Alan Bean caminaron hasta él: un robot que había llegado a la Luna mucho antes que ellos.',
        },
        {
          t: 52,
          voice: 'narrator',
          text: 'Le quitaron la cámara y la pala, y se las llevaron a la Tierra para estudiar qué le hace la Luna a una máquina.',
        },
        {
          t: 61,
          voice: 'narrator',
          text: 'Hoy, esa cámara está en un museo, en Washington. El resto de Surveyor 3 sigue allí, en la ladera de su cráter.',
        },
        {
          t: 70,
          voice: 'narrator',
          text: 'Los robots abandonados no están olvidados. A veces, incluso, alguien vuelve a buscarlos.',
        },
      ],
      // Ojo hasta el corte; después, siempre exterior: la nave inerte → el encuentro entre las dos naves → la cámara se la llevan → adiós.
      camera: [
        { t: 0, v: 'pov' },
        { t: 11.65, v: 'wide' },
      ],
      wide: [
        { t: 11.65, v: WIDE_S },
        { t: 36.65, v: WIDE_VISIT },
        { t: 51.65, v: WIDE_NEAR },
        { t: 60.65, v: WIDE_FAREWELL },
      ],
      // De noche (4 de mayo de 1967) a día (19 de noviembre de 1969), dentro del parpadeo.
      dust: [
        { t: 0, v: 1 },
        { t: 20.6, v: 1 },
        { t: 20.95, v: 0 },
        { t: 80, v: 0 },
      ],
      tracks: {
        tilt: SLOPE_TILT,
        lift: SLOPE_LIFT,
        // Apolo 12: el módulo desciende con su motor y se posa; los astronautas caminan hasta Surveyor 3 y vuelven.
        lmShow: [
          { t: 0, v: 0 },
          { t: 36.6, v: 0 },
          { t: 36.7, v: 1 },
        ],
        lmAlt: [
          { t: 36.65, v: 55 },
          { t: 39, v: 20 },
          { t: 41, v: 5 },
          { t: 42, v: 0 },
        ],
        lmFire: [
          { t: 0, v: 0 },
          { t: 36.6, v: 0 },
          { t: 36.7, v: 1 },
          { t: 41.6, v: 1 },
          { t: 42, v: 0 },
        ],
        astro: [
          { t: 0, v: 0 },
          { t: 42.9, v: 0 },
          { t: 43, v: 1 },
          { t: 66, v: 1 },
          { t: 66.1, v: 0 },
        ],
        walk: [
          { t: 0, v: 0 },
          { t: 43, v: 0 },
          { t: 51, v: 1 },
          { t: 56, v: 1 },
          { t: 64, v: 0 },
        ],
        // Se llevan la cámara de TV y la pala.
        strip: [
          { t: 0, v: 0 },
          { t: 55.5, v: 0 },
          { t: 56, v: 1 },
        ],
      },
      scene: [{ t: 0, v: 'flight' }],
      staticLevel: [
        { t: 0, v: 0.8 },
        { t: 4, v: 0.9 },
        { t: 6.5, v: 1 },
        { t: 8, v: 0 },
        { t: 80, v: 0 },
      ],
      powerOff: [
        { t: 0, v: 0 },
        { t: 6.5, v: 0 },
        { t: 8, v: 1 },
        { t: 11, v: 1 },
        { t: 12, v: 0 },
      ],
      battery: [
        { t: 0, v: 0.05 },
        { t: 6.5, v: 0 },
      ],
      signal: [
        { t: 0, v: 0.2 },
        { t: 6.5, v: 0 },
      ],
      clips: [{ t: 0, v: 'Death' }],
      expressions: [
        { t: 0, v: 'Sad' },
        { t: 6.5, v: 'Sleep' },
      ],
      hud: [
        { t: 0, v: { date: '4 MAY 1967', place: OCEANUS, phase: 'NOCHE LUNAR' } },
        { t: 8, v: { date: '', place: '', hidden: true } },
      ],
      sfx: [
        { t: 6.5, v: 'powerdown' },
        { t: 7.9, v: 'relay' },
        { t: 36.7, v: 'retro' },
      ],
      cards: [
        { at: 9, dur: 4, kind: 'note', text: 'SEÑAL PERDIDA · 4 MAY 1967' },
        { at: 21, dur: 6, kind: 'note', text: '19 NOV 1969 · 31 MESES DESPUÉS' },
        { at: 28, dur: 8, kind: 'note', text: 'APOLO 12 · 14 NOV 1969 · DOS RAYOS EN EL DESPEGUE' },
        {
          at: 61,
          dur: 9,
          kind: 'note',
          text: 'CÁMARA DE TV · MUSEO NACIONAL DEL AIRE Y EL ESPACIO · WASHINGTON D. C.',
        },
      ],
    },
  ],

  // Modo Explorar: escenario base y acciones del robot (clips del GLB).
  explore: {
    place: 'oceanus',
    actions: [
      { id: 'wake', label: 'Encender la cámara', hint: 'La cámara de TV se orienta', clip: 'Wake', duration: 3, focus: 'tv' },
      { id: 'dig', label: 'Excavar', hint: 'El brazo hunde su pala en el suelo', clip: 'Dig', duration: 4, focus: 'sampler' },
      { id: 'look', label: 'Mirar alrededor', hint: 'La cámara de TV gira a un lado y a otro', motion: 'surveyor3-tv', duration: 7, focus: 'tv' },
    ],
  },

  whatIfs: [
    {
      id: 'apolo12',
      question: 'el Apolo 12 no hubiera aterrizado junto a Surveyor 3',
      imagine:
        'Sin esa visita, Surveyor 3 habría seguido solo en la ladera de su cráter, y su cámara y su pala se habrían quedado en la Luna.',
      reality:
        'El 19 de noviembre de 1969 el Apolo 12 alunizó a unos 180 m de Surveyor 3. Los astronautas caminaron hasta él y se llevaron su cámara y su pala a la Tierra.',
      science:
        'Posarse tan cerca de una nave ya instalada exigió una precisión notable para la época. Y traer piezas que habían pasado 31 meses en la Luna permitió analizarlas en la Tierra.',
      sources: [
        { label: 'NASA Science — Surveyor 3', url: 'https://science.nasa.gov/mission/surveyor-3/' },
        { label: 'NSSDC — Surveyor 3 (1967-035A)', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A' },
      ],
      focus: 'sampler',
      action: 'dig',
    },
  ],

  transparency: {
    title: '¿Sobrevivieron bacterias en la Luna dentro de la cámara?',
    body: 'Al analizar la cámara que trajo el Apolo 12, los científicos encontraron una bacteria (Streptococcus mitis) en una espuma del interior. Durante años se contó que había sobrevivido 31 meses en la Luna. Pero los informes de la NASA no lo dejan claro: pudo estar allí desde antes del lanzamiento, o llegar después, ya en la Tierra, durante el análisis. Las demás piezas de la cámara no tenían bacterias. Por eso esta historia no lo cuenta como un hecho.',
    sources: [
      {
        label: 'NASA · A Microbe on the Moon (material educativo)',
        url: 'https://science.nasa.gov/wp-content/uploads/2023/04/A_Microbe_on_the_Moon_TAGGED.pdf',
      },
      {
        label: 'NASA · In Situ Biological Contamination Studies of the Moon (Glavin et al.)',
        url: 'https://ntrs.nasa.gov/api/citations/20100036597/downloads/20100036597.pdf',
      },
      {
        label: 'NSSDC · Surveyor 3 (1967-035A)',
        url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1967-035A',
      },
    ],
  },
}
