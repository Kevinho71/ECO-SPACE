import type { Story, WideShot } from '../story'

// Historia de Pioneer 10 — transcripción de HISTORIA_PIONEER10.md (5 capítulos).
// Espacio profundo: no hay suelo ni viento. La escena es 'flight' (solo telemetría) y la sonda no camina:
// cambia el MUNDO que pasa a su alrededor (lugares de `deepPlaces.ts`, con parpadeo entre ellos) y la CÁMARA
// alterna entre el ojo de la sonda (pov) y una vista exterior (wide) según lo que cuenta la narración.
// Datos verificados con NASA y NSSDC (ver HISTORIA_PIONEER10.md §2 y §11). Voces pendientes: solo subtítulos.
//
// Ejes: la sonda mira hacia +X (la Tierra y el Sol quedan "detrás"); viaja hacia −X; −Z es la izquierda.
// Las panorámicas `pan` (rad, + = hacia la izquierda) siguen al planeta de turno mientras la cámara es POV.
// OJO: el plato de 3 m tapa lo que hay justo delante de la sonda: lo que viene "de frente" se ve en vista exterior.

const DEEP_SPACE = 'ESPACIO PROFUNDO'
/** Centro aproximado de la sonda (plato, brazos de los RTG y magnetómetro). */
const CENTER: [number, number, number] = [-0.3, -0.2, 0]

// --- Vistas exteriores (ver WideShot en data/story.ts) ---
/** Desde atrás de la sonda, mirando hacia la Tierra que se aleja. */
const WIDE_EARTH: WideShot = { dist: 8.5, height: 1.0, az: Math.PI - 0.35, swing: 0.2, target: CENTER }
/** Desde el lado de la Tierra, mirando hacia delante (Júpiter al frente). */
const WIDE_AHEAD: WideShot = { dist: 9, height: 0.8, az: 0.55, swing: 0.2, target: CENTER }
const WIDE_MARS: WideShot = { dist: 9, height: 1.2, az: 0.9, swing: 0.2, target: CENTER }
/** De frente a los asteroides que vienen hacia la cámara. */
const WIDE_BELT: WideShot = { dist: 8.5, height: 0.9, az: 0.1, swing: 0.12, target: CENTER }
/** Desde el costado: las lunas cruzan entre la sonda y Júpiter. */
const WIDE_MOONS: WideShot = { dist: 9, height: 1.2, az: 1.5, swing: 0.15, target: CENTER }
const WIDE_TAIL: WideShot = { dist: 12, height: 3.0, az: 1.45, swing: 0.1, target: CENTER }
const WIDE_NEPTUNE: WideShot = { dist: 9, height: 0.9, az: 0.5, swing: 0.15, target: CENTER }
/** Lejos: la sonda, pequeña en la inmensidad. */
const WIDE_LONELY: WideShot = { dist: 14, height: 2.0, az: 1.2, swing: 0.15, target: CENTER }
const WIDE_DIMMING: WideShot = { dist: 8, height: 0.8, az: 0.35, swing: 0.15, target: CENTER }
const WIDE_LEGACY: WideShot = { dist: 10, height: 1.0, az: 0.4, swing: 0.2, target: CENTER }
const WIDE_FAREWELL: WideShot = { dist: 20, height: 2.5, az: 0.25, swing: 0.15, target: CENTER }

/** Con el POV la sonda mantiene casi el horizonte (su giro real marearía): solo conserva un poco de balanceo. */
const POV_ROLL = [{ t: 0, v: 0.25 }]

export const pioneer10Story: Story = {
  missionId: 'pioneer10',
  // Pantallas que rodean a la historia (inicio, exploración y cierre).
  texts: {
    kicker: 'NASA · Sonda al espacio profundo · 1972',
    name: 'Pioneer 10',
    intro:
      'Vas a vivir su viaje desde dentro: tus ojos serán los suyos. A ratos te verás desde fuera, mientras cruza el cinturón de asteroides, pasa junto a Júpiter y se aleja de todo. Mira alrededor arrastrando.',
    startLabel: '▶ Despertar a Pioneer 10',
    exploreLabel: 'Explorar la sonda',
    exploreHint: 'Arrastra para girar alrededor de la sonda · pulsa los puntos brillantes para ver sus partes',
    endKicker: 'Una aclaración',
  },
  chapters: [
    // -----------------------------------------------------------------------
    // 1 · EL DESPERTAR   (Tierra que se aleja → destino: Júpiter)
    // -----------------------------------------------------------------------
    {
      id: 'despertar',
      title: 'Capítulo 1 · El despertar',
      subtitle: 'Marzo de 1972 · rumbo a Júpiter',
      duration: 52,
      audioKey: 'beyond/pioneer10_01.mp3',
      place0: 'leaving-earth',
      jumps: [{ t: 34.65, to: 'outbound' }],
      cues: [
        { t: 0, text: 'Separación… completa.' },
        { t: 4, text: 'Silencio. Estrellas. Y detrás de mí, la Tierra, cada vez más pequeña.' },
        { t: 11, text: 'Soy Pioneer 10. Una sonda. Peso doscientos cincuenta y ocho kilos.' },
        {
          t: 18,
          text: 'Tengo una gran antena en forma de plato para hablar con la Tierra, y generadores nucleares que me dan energía lejos del Sol.',
        },
        { t: 28, text: 'Ahora mismo voy más rápido que cualquier cosa que los humanos hayan lanzado jamás.' },
        { t: 35, text: 'Mi destino: Júpiter. Ninguna nave ha llegado hasta allí.' },
        { t: 41, text: 'Me dieron veintiún meses de vida. Veremos.' },
      ],
      // Ojo de la sonda (despierta mirando la Tierra) → verse desde fuera al presentarse → ojo → exterior al nombrar el destino.
      camera: [
        { t: 0, v: 'pov' },
        { t: 10.65, v: 'wide' },
        { t: 27.65, v: 'pov' },
        { t: 34.65, v: 'wide' },
      ],
      wide: [
        { t: 0, v: WIDE_EARTH },
        { t: 34.65, v: WIDE_AHEAD },
      ],
      pan: [
        { t: 0, v: 0.33 },
        { t: 10.65, v: 0.26 },
        { t: 27.65, v: 0.22 },
        { t: 34.65, v: 0.2 },
      ],
      povRoll: POV_ROLL,
      scene: [{ t: 0, v: 'flight' }],
      staticLevel: [
        { t: 0, v: 0.9 },
        { t: 4, v: 0.5 },
        { t: 9, v: 0.15 },
        { t: 30, v: 0.08 },
        { t: 52, v: 0.1 },
      ],
      battery: [{ t: 0, v: 1 }],
      signal: [
        { t: 0, v: 0.6 },
        { t: 9, v: 1 },
      ],
      // El giro (`Spin`) solo se ve desde fuera; en POV la sonda queda quieta.
      clips: [
        { t: 0, v: 'Wake' },
        { t: 3, v: 'Idle' },
        { t: 10.65, v: 'Spin' },
        { t: 27.65, v: 'Idle' },
        { t: 34.65, v: 'Spin' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 2, v: 'Surprised' },
        { t: 5.5, v: null },
      ],
      hud: [
        { t: 0, v: { date: '2 MAR 1972 (UT)', place: DEEP_SPACE, phase: 'VELOCIDAD 51 682 km/h' } },
        { t: 35, v: { date: '1972', place: DEEP_SPACE, phase: 'RUMBO A JÚPITER' } },
      ],
      sfx: [{ t: 0, v: 'boot' }],
    },

    // -----------------------------------------------------------------------
    // 2 · EL VIAJE   (órbita de Marte → cinturón de asteroides → de nuevo espacio abierto)
    // -----------------------------------------------------------------------
    {
      id: 'viaje',
      title: 'Capítulo 2 · El viaje',
      subtitle: 'Cinturón de asteroides · 1972–1973',
      duration: 44,
      audioKey: 'beyond/pioneer10_02.mp3',
      place0: 'inner',
      jumps: [
        { t: 13.65, to: 'belt' },
        { t: 21.65, to: 'outbound' },
      ],
      cues: [
        { t: 0, text: 'Entre Marte y Júpiter hay un anillo de rocas: el cinturón de asteroides.' },
        { t: 7, text: 'Nadie sabe si se puede cruzar. Quizás hay demasiadas piedras. Quizás choco.' },
        { t: 14, text: 'Quince de julio de 1972. Entro.' },
        { t: 18, text: 'Pasan los meses. Sigo avanzando.' },
        { t: 22, text: 'Febrero de 1973. Salgo del otro lado, entero.' },
        { t: 27, text: 'Soy la primera nave en cruzar el cinturón de asteroides. El camino hacia los planetas gigantes está abierto.' },
      ],
      // Exterior para ver Marte pasar → ojo siguiéndolo → exterior de cara a las rocas → ojo mientras pasan → exterior hacia Júpiter.
      camera: [
        { t: 0, v: 'wide' },
        { t: 7, v: 'pov' },
        { t: 13.65, v: 'wide' },
        { t: 17.65, v: 'pov' },
        { t: 26.65, v: 'wide' },
      ],
      wide: [
        { t: 0, v: WIDE_MARS },
        { t: 13.65, v: WIDE_BELT },
        { t: 26.65, v: WIDE_AHEAD },
      ],
      pan: [
        { t: 0, v: 2.25 },
        { t: 7, v: 2.25 },
        { t: 9.5, v: 1.55 },
        { t: 13.65, v: 0.39 },
        { t: 17.65, v: 0 },
        { t: 26.65, v: 0 },
      ],
      povRoll: POV_ROLL,
      scene: [{ t: 0, v: 'flight' }],
      // La estática se mantiene baja: con más, taparía los asteroides.
      staticLevel: [
        { t: 0, v: 0.1 },
        { t: 13.65, v: 0.12 },
        { t: 15, v: 0.25 },
        { t: 21.65, v: 0.25 },
        { t: 23, v: 0.08 },
        { t: 44, v: 0.08 },
      ],
      battery: [{ t: 0, v: 1 }],
      signal: [{ t: 0, v: 1 }],
      clips: [
        { t: 0, v: 'Spin' },
        { t: 7, v: 'Idle' },
        { t: 13.65, v: 'Spin' },
        { t: 17.65, v: 'Idle' },
        { t: 26.65, v: 'Spin' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 14, v: 'Surprised' },
        { t: 22, v: null },
      ],
      hud: [
        { t: 0, v: { date: '1972', place: 'ÓRBITA DE MARTE', phase: 'RUMBO AL CINTURÓN' } },
        { t: 13.65, v: { date: '15 JUL 1972', place: 'CINTURÓN DE ASTEROIDES', phase: 'ENTRADA' } },
        { t: 21.65, v: { date: 'FEB 1973', place: 'CINTURÓN DE ASTEROIDES', phase: 'SALIDA · PRIMERA NAVE EN CRUZARLO' } },
      ],
      flightEvents: [
        { t: 13.65, label: 'Entrada al cinturón · 15 jul 1972' },
        { t: 21.65, label: 'Salida del cinturón · feb 1973' },
      ],
    },

    // -----------------------------------------------------------------------
    // 3 · LA MISIÓN   (Júpiter: acercamiento → radiación → lunas → cola magnética → salida)
    // -----------------------------------------------------------------------
    {
      id: 'mision',
      title: 'Capítulo 3 · La misión',
      subtitle: 'Júpiter · diciembre de 1973',
      duration: 66,
      audioKey: 'beyond/pioneer10_03.mp3',
      place0: 'jupiter',
      jumps: [
        { t: 36.65, to: 'jupiter-moons' },
        { t: 45.65, to: 'jupiter-tail' },
      ],
      marks: [
        { t: 0, label: 'Acercamiento · dic 1973' },
        { t: 36.65, label: 'Lunas' },
        { t: 45.65, label: 'Cola magnética' },
      ],
      cues: [
        { t: 0, text: 'Diciembre de 1973. Júpiter.' },
        { t: 4, text: 'Es inmenso. Bandas de colores que giran. Tormentas más grandes que la Tierra.' },
        { t: 11, text: 'Me acerco a unos ciento treinta mil kilómetros de sus nubes. Soy la primera nave en hacerlo.' },
        { t: 19, text: 'Pero Júpiter tiene un escudo invisible: una radiación feroz.' },
        { t: 25, text: 'Me llegan órdenes que nadie ha enviado. Uno de mis instrumentos se daña.' },
        { t: 32, text: 'Aguanto. Y mientras, tomo cientos de fotos.' },
        { t: 37, text: 'Fotografío sus lunas: Calisto, Ganímedes, Europa. La foto de Ío… se pierde por la radiación.' },
        { t: 46, text: 'Descubro que el campo magnético de Júpiter tiene una cola enorme, que llega casi hasta Saturno.' },
        { t: 54, text: 'Y sigo. Júpiter me lanza hacia afuera, lejos del Sol.' },
      ],
      // Exterior mientras Júpiter se acerca de frente (el plato lo taparía desde dentro) → ojo cuando pasa a un lado y lo llena todo
      // → exterior para las lunas y la cola → ojo mirando cómo se aleja hacia atrás.
      camera: [
        { t: 0, v: 'wide' },
        { t: 16, v: 'pov' },
        { t: 36.65, v: 'wide' },
        { t: 53.65, v: 'pov' },
      ],
      wide: [
        { t: 0, v: WIDE_AHEAD },
        { t: 36.65, v: WIDE_MOONS },
        { t: 45.65, v: WIDE_TAIL },
      ],
      pan: [
        { t: 16, v: 2.28 },
        { t: 19, v: 1.99 },
        { t: 28, v: 1.76 },
        { t: 36.65, v: 1.63 },
        { t: 53.65, v: 1.0 },
        { t: 57.95, v: 0.66 },
        { t: 61.95, v: 0.32 },
        { t: 66, v: 0.14 },
      ],
      povRoll: POV_ROLL,
      scene: [{ t: 0, v: 'flight' }],
      // La radiación sube la estática, pero sin taparlo todo: Júpiter tiene que verse.
      staticLevel: [
        { t: 0, v: 0.05 },
        { t: 19, v: 0.4 },
        { t: 25, v: 0.55 },
        { t: 32, v: 0.4 },
        { t: 37, v: 0.2 },
        { t: 46, v: 0.3 },
        { t: 54, v: 0.08 },
        { t: 66, v: 0.08 },
      ],
      battery: [{ t: 0, v: 1 }],
      signal: [
        { t: 0, v: 1 },
        { t: 19, v: 0.6 },
        { t: 54, v: 0.85 },
      ],
      clips: [
        { t: 0, v: 'Spin' },
        { t: 16, v: 'Idle' },
        { t: 36.65, v: 'Spin' },
        { t: 53.65, v: 'Idle' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 11, v: 'Surprised' },
        { t: 32, v: null },
      ],
      hud: [
        { t: 0, v: { date: '4 DIC 1973', place: 'JÚPITER', phase: 'ACERCAMIENTO' } },
        { t: 11, v: { date: '4 DIC 1973', place: 'JÚPITER', phase: '≈ 130 000 km DE LAS NUBES' } },
        { t: 19, v: { date: 'DIC 1973', place: 'JÚPITER', phase: 'RADIACIÓN INTENSA' } },
        { t: 37, v: { date: 'DIC 1973', place: 'JÚPITER', phase: 'CALISTO · GANÍMEDES · EUROPA · ÍO' } },
        { t: 46, v: { date: 'DIC 1973', place: 'JÚPITER', phase: 'COLA MAGNÉTICA' } },
        { t: 54, v: { date: 'DIC 1973', place: 'JÚPITER', phase: 'SALIDA · RUMBO A SATURNO' } },
      ],
    },

    // -----------------------------------------------------------------------
    // 4 · EL FINAL   (Neptuno → espacio interestelar: la voz cada vez más débil)
    // -----------------------------------------------------------------------
    {
      id: 'final',
      title: 'Capítulo 4 · El final',
      subtitle: '1983 → 2003 · más allá de los planetas',
      duration: 60,
      audioKey: 'beyond/pioneer10_04.mp3',
      place0: 'neptune',
      jumps: [{ t: 17.65, to: 'interstellar' }],
      cues: [
        { t: 0, text: 'Trece de junio de 1983. Cruzo la órbita de Neptuno.' },
        { t: 6, text: 'Soy el primer objeto humano que va más allá del planeta más lejano.' },
        { t: 12, text: 'Durante años, soy lo más lejano que la humanidad ha construido.' },
        { t: 18, text: 'En 1997, mi equipo deja de seguirme a diario: no hay más dinero para la misión.' },
        { t: 25, text: 'En 1998, otra sonda, Voyager 1, me pasa: ahora es ella la más lejana.' },
        { t: 32, text: 'Mi energía nuclear se va apagando, poco a poco.' },
        { t: 37, text: 'Mi voz es cada vez más débil. Tarda once horas y veinte minutos en llegar a la Tierra.' },
        { t: 45, text: 'Si alguien me saluda por la mañana, no sabrá de mí hasta la noche.' },
        { t: 52, text: 'Veintitrés de enero de 2003. Envío una señal más.' },
      ],
      // Exterior con Neptuno delante → ojo viéndolo pasar → exterior: la sonda, pequeña → ojo: la señal → exterior: se apaga → ojo: la última señal.
      camera: [
        { t: 0, v: 'wide' },
        { t: 5.65, v: 'pov' },
        { t: 11.65, v: 'wide' },
        { t: 17.65, v: 'pov' },
        { t: 31.65, v: 'wide' },
        { t: 36.65, v: 'pov' },
      ],
      wide: [
        { t: 0, v: WIDE_NEPTUNE },
        { t: 11.65, v: WIDE_LONELY },
        { t: 31.65, v: WIDE_DIMMING },
      ],
      pan: [
        { t: 5.65, v: 2.27 },
        { t: 8.5, v: 1.76 },
        { t: 11.65, v: 1.09 },
        { t: 17.65, v: 0 },
        { t: 60, v: 0 },
      ],
      povRoll: POV_ROLL,
      scene: [{ t: 0, v: 'flight' }],
      staticLevel: [
        { t: 0, v: 0.1 },
        { t: 32, v: 0.45 },
        { t: 52, v: 0.7 },
        { t: 60, v: 0.7 },
      ],
      battery: [
        { t: 0, v: 0.4 },
        { t: 32, v: 0.2 },
        { t: 52, v: 0.05 },
      ],
      signal: [
        { t: 0, v: 0.9 },
        { t: 37, v: 0.4 },
        { t: 52, v: 0.2 },
      ],
      clips: [
        { t: 0, v: 'Spin' },
        { t: 5.65, v: 'Idle' },
        { t: 11.65, v: 'Spin' },
        { t: 17.65, v: 'Idle' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 32, v: 'Sad' },
      ],
      hud: [
        { t: 0, v: { date: '13 JUN 1983', place: 'FRONTERA DEL SISTEMA SOLAR', phase: 'CRUZA LA ÓRBITA DE NEPTUNO' } },
        { t: 25, v: { date: '1998', place: 'ESPACIO INTERESTELAR', phase: 'VOYAGER 1 SE VUELVE LA MÁS LEJANA' } },
        { t: 37, v: { date: '2002 – 2003', place: 'ESPACIO INTERESTELAR', phase: 'RETARDO DE SEÑAL · 11 h 20 min' } },
        { t: 52, v: { date: '23 ENE 2003', place: 'ESPACIO INTERESTELAR', phase: 'ÚLTIMA SEÑAL' } },
      ],
    },

    // -----------------------------------------------------------------------
    // 5 · EL CORTE Y EL LEGADO   (silencio → Aldebarán al frente → la placa → la despedida)
    // -----------------------------------------------------------------------
    {
      id: 'legado',
      title: 'Capítulo 5 · El corte y el legado',
      subtitle: '23 de enero de 2003 → hoy',
      duration: 66,
      audioKey: 'beyond/pioneer10_05.mp3',
      place0: 'interstellar',
      jumps: [{ t: 11.65, to: 'aldebaran' }],
      marks: [
        { t: 0, label: 'Corte de señal' },
        { t: 12, label: 'El legado' },
        { t: 36, label: 'La placa' },
      ],
      powerCutAt: 7,
      cues: [
        { t: 0, text: 'Tierra… ¿me escuchas?' },
        { t: 5, text: 'Ya no… me alcanza…' },
        { t: 12, voice: 'narrator', text: 'La Tierra intentó escucharlo otra vez. No hubo respuesta.' },
        { t: 18, voice: 'narrator', text: 'Pioneer 10 se diseñó para veintiún meses. Trabajó más de treinta años.' },
        {
          t: 25,
          voice: 'narrator',
          text: 'Hoy sigue viajando, en silencio, hacia la estrella roja Aldebarán. Tardará unos dos millones de años en llegar a sus proximidades.',
        },
        {
          t: 36,
          voice: 'narrator',
          text: 'Lleva una placa con un mensaje: un hombre y una mujer, nuestro sistema solar, y un mapa para encontrar el Sol entre las estrellas.',
        },
        { t: 47, voice: 'narrator', text: 'La idea fue del astrónomo Carl Sagan. Es una carta que quizás nadie lea nunca.' },
        { t: 55, voice: 'narrator', text: 'Los robots abandonados no están olvidados. Algunos llevan nuestra dirección.' },
      ],
      // Ojo hasta el corte → exterior: Aldebarán al frente → primer plano de la placa → exterior que se aleja en el cierre.
      camera: [
        { t: 0, v: 'pov' },
        { t: 11.65, v: 'wide' },
        { t: 35.65, v: 'part' },
        { t: 54.65, v: 'wide' },
      ],
      wide: [
        { t: 11.65, v: WIDE_LEGACY },
        { t: 54.65, v: WIDE_FAREWELL },
      ],
      // La placa va en un puntal delante del plato (cara hacia +X). La cámara gira ≈0,09 rad/s: en estos 19 s recorre
      // ≈1,7 rad, así que arranca a −0,85 y acaba en +0,86, siempre viendo la placa de frente (nunca de canto).
      partFocus: [
        { t: 0, v: null },
        { t: 35.65, v: { node: 'golden_plaque', hotspot: 'plaque', dist: 1.7, az: -0.85, el: 0.12 } },
      ],
      povRoll: POV_ROLL,
      scene: [{ t: 0, v: 'flight' }],
      staticLevel: [
        { t: 0, v: 0.8 },
        { t: 5, v: 0.9 },
        { t: 7, v: 1 },
        { t: 8.5, v: 0 },
        { t: 66, v: 0 },
      ],
      powerOff: [
        { t: 0, v: 0 },
        { t: 7, v: 0 },
        { t: 8.5, v: 1 },
        { t: 11, v: 1 },
        { t: 12, v: 0 },
      ],
      battery: [
        { t: 0, v: 0.03 },
        { t: 7, v: 0 },
      ],
      signal: [
        { t: 0, v: 0.1 },
        { t: 7, v: 0 },
      ],
      clips: [{ t: 0, v: 'Death' }],
      expressions: [
        { t: 0, v: 'Sad' },
        { t: 7, v: 'Sleep' },
      ],
      hud: [
        { t: 0, v: { date: '23 ENE 2003', place: 'ESPACIO INTERESTELAR · RUMBO A ALDEBARÁN', phase: 'SEÑAL A 11 h 20 min' } },
        { t: 8.5, v: { date: '', place: '', hidden: true } },
      ],
      sfx: [
        { t: 7, v: 'powerdown' },
        { t: 8.4, v: 'relay' },
      ],
      cards: [{ at: 9.5, dur: 4.5, kind: 'note', text: 'ÚLTIMA SEÑAL RECIBIDA · 23 ENE 2003 · 12 230 millones de km' }],
    },
  ],

  // Modo Explorar: escenario base y acciones del robot (clips del GLB).
  explore: {
    place: 'outbound',
    actions: [
      { id: 'wake', label: 'Despertar', hint: 'Mueve la cabeza de la antena', clip: 'Wake', duration: 3, focus: 'dish' },
      { id: 'spin', label: 'Girar la sonda', hint: 'Gira sobre su eje, como al estabilizarse', clip: 'Spin', duration: 13, focus: 'dish' },
      { id: 'boom', label: 'Desplegar el magnetómetro', hint: 'El brazo del magnetómetro se abre hacia fuera', motion: 'pioneer10-boom', duration: 6, focus: 'mag' },
    ],
  },

  whatIfs: [
    {
      id: 'radiacion',
      question: 'la radiación de Júpiter hubiera sido aún más fuerte',
      imagine:
        'Con más radiación, la electrónica de Pioneer 10 habría sufrido todavía más y quizá no habría podido completar el sobrevuelo ni enviar sus datos.',
      reality:
        'La radiación de Júpiter provocó órdenes falsas en la nave y dañó un instrumento (el fotopolarímetro); la imagen de Ío se perdió. Aun así, Pioneer 10 siguió su camino.',
      science:
        'Pioneer 10 fue la primera nave en visitar Júpiter y se encontró de cerca con una radiación capaz de alterar la electrónica de una sonda.',
      sources: [
        { label: 'NASA Science — Pioneer 10', url: 'https://science.nasa.gov/mission/pioneer-10/' },
        { label: 'NASA History — 50 Years Ago: Pioneer 10 Launches to Explore Jupiter', url: 'https://www.nasa.gov/history/50-years-ago-pioneer-10-launches-to-explore-jupiter/' },
      ],
      focus: 'mag',
      action: 'boom',
    },
  ],

  transparency: {
    title: '¿Pioneer 10 chocará con Aldebarán?',
    body: 'No. La sonda se dirige hacia esa estrella, y la NASA calcula que llegará a sus proximidades en unos dos millones de años. Desde 2003 no se recibe ninguna señal de ella: su energía nuclear se fue agotando, y ya no alcanzaba para transmitir. En esta historia, Pioneer 10 cuenta lo que vivió, sin prometer un encuentro que la NASA no anuncia.',
    sources: [
      {
        label: 'NASA Science · Pioneer 10',
        url: 'https://science.nasa.gov/mission/pioneer-10/',
      },
      {
        label: 'NSSDC · Pioneer 10 (1972-012A)',
        url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1972-012A',
      },
    ],
  },
}
