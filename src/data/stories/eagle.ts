import type { PartFocus, Story, WideShot } from '../story'

// Historia de Eagle (Apolo 11, etapa de descenso) — transcripción de HISTORIA_EAGLE.md (5 capítulos).
// Luna: no hay aire, así que la escena es siempre 'flight' (solo sonido de telemetría, sin viento).
// El módulo mira hacia +X (escalera y cara); en el viaje la Tierra queda detrás (+X) y la Luna delante (−X).
// Lugares: 'earth-orbit' → 'translunar' → 'lunar-orbit' → 'descent' (DeepSpace) → 'tranquility' (LunarScene).
// Pistas: `tracks.ascent` (altura de la cabina al despegar) y `tracks.fire` (su motor) las lee MISSION_EXTRAS.eagle.
// Datos verificados con NASA/NSSDC/ALSJ (ver HISTORIA_EAGLE.md §2 y §11). Voces pendientes: solo subtítulos.

/** Centro aproximado del módulo (etapa de descenso + cabina). */
const LM: [number, number, number] = [0.3, 1.3, 0]

// --- Vistas exteriores ---
const WIDE_LM: WideShot = { dist: 8.5, height: 2.2, az: 0.7, swing: 0.2, target: LM }
const WIDE_LM_FAR: WideShot = { dist: 13, height: 3, az: 0.4, swing: 0.2, target: LM }
/** Desde el lado de la Tierra mirando hacia delante: la Luna crece al frente. */
const WIDE_AHEAD: WideShot = { dist: 9, height: 1.0, az: 0.5, swing: 0.15, target: LM }
/** Durante el descenso: se ve la llama del motor y la superficie que sube. */
const WIDE_DESCENT: WideShot = { dist: 9, height: 2.4, az: 0.9, swing: 0.1, target: [0, 0.8, 0] }
/** Cerca de la escotilla. */
const WIDE_CABIN: WideShot = { dist: 8, height: 2.4, az: 0.9, swing: 0.1, target: [1.2, 1.6, 0] }
const WIDE_PAD: WideShot = { dist: 9, height: 1.8, az: 0.9, swing: 0.05, target: [0, 1.3, 0] }
const WIDE_LEGACY: WideShot = { dist: 11, height: 2.5, az: 0.5, swing: 0.15, target: LM }
const WIDE_FAREWELL: WideShot = { dist: 22, height: 6, az: 0.3, swing: 0.15, target: LM }
/** Sigue a la cabina mientras sube (la cámara se mueve sola con suavidad). */
const follow = (h: number, dist: number, height: number): WideShot => ({
  dist,
  height,
  az: 0.9,
  swing: 0.05,
  target: [0, h * 0.9 + 2, 0],
})

// --- Primeros planos (la cámara gira ≈0,09 rad/s: el ángulo inicial es negativo para acabar de frente) ---
const PART_LADDER: PartFocus = { node: 'ladder', hotspot: 'ladder', dist: 3.4, az: -0.6, el: 0.18 }
const PART_SEISMOMETER: PartFocus = { node: 'seismometer', hotspot: 'seismometer', dist: 2.6, az: -0.3, el: 0.25 }
const PART_REFLECTOR: PartFocus = { node: 'laser_reflector', hotspot: 'reflector', dist: 2.8, az: -0.9, el: 0.35 }

const TRANQUILITY = 'MARE TRANQUILITATIS · 0,67° N 23,47° E'

export const eagleStory: Story = {
  missionId: 'eagle',
  // Pantallas que rodean a la historia (inicio, exploración y cierre).
  texts: {
    kicker: 'NASA · Apolo 11 · Módulo lunar «Eagle»',
    name: 'Eagle',
    intro:
      'Vas a vivir su historia desde dentro: tus ojos serán los de la etapa de descenso, la mitad dorada del módulo lunar que se quedó en la Luna. A ratos te verás desde fuera. Mira alrededor arrastrando.',
    startLabel: '▶ Despertar a Eagle',
    exploreLabel: 'Explorar el módulo',
    exploreHint: 'Arrastra para girar alrededor del módulo · pulsa los puntos brillantes para ver sus partes',
    endKicker: '¿Cuánto combustible quedaba?',
  },
  chapters: [
    // -----------------------------------------------------------------------
    // 1 · EL DESPERTAR   (Base Tranquilidad, 20 de julio de 1969)
    // -----------------------------------------------------------------------
    {
      id: 'despertar',
      title: 'Capítulo 1 · El despertar',
      subtitle: 'Mar de la Tranquilidad · 20 de julio de 1969',
      duration: 54,
      audioKey: 'moon/eagle_01.mp3',
      place0: 'tranquility',
      cues: [
        { t: 0, text: 'Contacto. Motor… apagado.' },
        { t: 4, text: 'Polvo gris que cae despacio. Y después, quietud total. Aquí no hay aire que haga ruido.' },
        { t: 12, text: 'Soy la etapa de descenso de Eagle: la mitad de abajo, dorada, de un módulo lunar.' },
        {
          t: 19,
          text: 'Tengo cuatro patas, un motor que frena y tanques de combustible. Arriba de mí va la cabina con dos personas.',
        },
        { t: 27, text: 'Estamos en la Luna. En una llanura llamada Mar de la Tranquilidad. Aunque se llama «mar», es una llanura de piedra y polvo.' },
        { t: 36, text: 'Dentro, una voz habla con la Tierra: «Houston, Tranquility Base here — the Eagle has landed.»' },
        { t: 46, text: 'Lo logramos. Pero llegar fue lo más difícil… déjame recordar.' },
      ],
      // Ojo del módulo (el polvo que cae) → verse desde fuera al presentarse → ojo → exterior con la radio.
      camera: [
        { t: 0, v: 'pov' },
        { t: 11.65, v: 'wide' },
        { t: 26.65, v: 'pov' },
        { t: 35.65, v: 'wide' },
      ],
      wide: [
        { t: 11.65, v: WIDE_LM },
        { t: 35.65, v: WIDE_LM_FAR },
      ],
      scene: [{ t: 0, v: 'flight' }],
      staticLevel: [
        { t: 0, v: 0.9 },
        { t: 4, v: 0.5 },
        { t: 9, v: 0.15 },
        { t: 30, v: 0.08 },
        { t: 54, v: 0.1 },
      ],
      battery: [{ t: 0, v: 1 }],
      signal: [
        { t: 0, v: 0.6 },
        { t: 9, v: 1 },
      ],
      clips: [
        { t: 0, v: 'Land' },
        { t: 4, v: 'Idle' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 2, v: 'Surprised' },
        { t: 5.5, v: null },
      ],
      hud: [
        { t: 0, v: { date: '20 JUL 1969 · 20:17:40 UT', place: TRANQUILITY, phase: 'CONTACTO' } },
        { t: 12, v: { date: '20 JUL 1969', place: TRANQUILITY } },
      ],
      sfx: [{ t: 0, v: 'boot' }],
    },

    // -----------------------------------------------------------------------
    // 2 · EL VIAJE   (registro de vuelo: lanzamiento → camino a la Luna → órbita → descenso → alunizaje)
    // -----------------------------------------------------------------------
    {
      id: 'viaje',
      title: 'Capítulo 2 · El viaje',
      subtitle: 'Registro de vuelo · 16 → 20 de julio de 1969',
      duration: 80,
      audioKey: 'moon/eagle_02.mp3',
      place0: 'earth-orbit',
      jumps: [
        { t: 11.65, to: 'translunar' },
        { t: 22.65, to: 'lunar-orbit' },
        { t: 29.65, to: 'descent' },
        { t: 69.65, to: 'tranquility' },
      ],
      cues: [
        { t: 0, text: 'Reproduciendo mi registro de vuelo.' },
        { t: 4, text: 'Dieciséis de julio de 1969. Un cohete Saturn V nos lanza desde Florida.' },
        {
          t: 12,
          text: 'Somos tres personas. Michael Collins se quedará en órbita alrededor de la Luna. Neil Armstrong y Buzz Aldrin bajarán conmigo.',
        },
        { t: 23, text: 'Veinte de julio. Nos separamos y empezamos a bajar. Mi motor frena la caída.' },
        { t: 30, text: 'De pronto, una alarma: «1202». Luego otra.' },
        { t: 35, text: 'El ordenador está saturado: recibe datos de un radar que no debería estar mirando.' },
        {
          t: 42,
          text: 'En Houston saben que el ordenador está hecho para reiniciarse y seguir trabajando. Llega la respuesta: seguimos.',
        },
        {
          t: 50,
          text: 'Abajo hay rocas. El ordenador nos lleva hacia un campo de piedras, y Armstrong toma el control: vuela un poco más lejos, buscando un sitio mejor.',
        },
        { t: 58, text: 'Desde la Tierra, una voz cuenta el combustible: «60 seconds».' },
        { t: 64, text: 'Mis patas buscan el suelo. Polvo. Más polvo…' },
        { t: 70, text: 'Contacto. Veinte de julio de 1969, 20:17 en hora universal.' },
      ],
      // Ojo en el lanzamiento → exterior hacia la Luna → ojo en órbita → exterior para ver la llama → ojo al buscar el suelo → exterior al posarse.
      camera: [
        { t: 0, v: 'pov' },
        { t: 11.65, v: 'wide' },
        { t: 22.65, v: 'pov' },
        { t: 29.65, v: 'wide' },
        { t: 57.65, v: 'pov' },
        { t: 69.65, v: 'wide' },
      ],
      wide: [
        { t: 11.65, v: WIDE_AHEAD },
        { t: 29.65, v: WIDE_DESCENT },
        { t: 69.65, v: WIDE_LM },
      ],
      scene: [{ t: 0, v: 'flight' }],
      // Las alarmas hacen saltar la estática un instante; el resto del tiempo se mantiene baja para ver el descenso.
      staticLevel: [
        { t: 0, v: 0.3 },
        { t: 4, v: 0.4 },
        { t: 9, v: 0.15 },
        { t: 29.65, v: 0.12 },
        { t: 30.2, v: 0.45 },
        { t: 31.5, v: 0.2 },
        { t: 33, v: 0.2 },
        { t: 33.3, v: 0.45 },
        { t: 34.5, v: 0.15 },
        { t: 69.5, v: 0.1 },
        { t: 70, v: 0.55 },
        { t: 72, v: 0.1 },
        { t: 80, v: 0.1 },
      ],
      shake: [
        { t: 0, v: 0 },
        { t: 3.5, v: 0 },
        { t: 4, v: 0.5 },
        { t: 9, v: 0.4 },
        { t: 11, v: 0 },
        { t: 29.65, v: 0 },
        { t: 30, v: 0.25 },
        { t: 31, v: 0 },
        { t: 33, v: 0.25 },
        { t: 34, v: 0 },
        { t: 66, v: 0.15 },
        { t: 69.4, v: 0.2 },
        { t: 70, v: 0.7 },
        { t: 72, v: 0 },
      ],
      battery: [{ t: 0, v: 1 }],
      signal: [
        { t: 0, v: 0.9 },
        { t: 29.65, v: 0.6 },
        { t: 58, v: 0.5 },
        { t: 70, v: 1 },
      ],
      clips: [
        { t: 0, v: 'Idle' },
        { t: 69.65, v: 'Land' },
        { t: 74, v: 'Idle' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 30, v: 'Surprised' },
        { t: 36, v: null },
        { t: 58, v: 'Surprised' },
        { t: 70, v: null },
      ],
      hud: [
        { t: 0, v: { date: 'JUL 1969', place: 'REGISTRO DE VUELO', phase: 'PREPARANDO EL LANZAMIENTO' } },
        { t: 4, v: { date: '16 JUL 1969 · 13:32 UT', place: 'CABO CAÑAVERAL', phase: 'LANZAMIENTO · SATURN V' } },
        { t: 12, v: { date: 'JUL 1969', place: 'ENTRE LA TIERRA Y LA LUNA', phase: 'CAMINO A LA LUNA' } },
        { t: 23, v: { date: '20 JUL 1969', place: 'ÓRBITA LUNAR', phase: 'SEPARACIÓN · COMIENZA EL DESCENSO' } },
        { t: 30, v: { date: '20 JUL 1969', place: 'DESCENSO', phase: 'ALARMA 1202' } },
        { t: 42, v: { date: '20 JUL 1969', place: 'DESCENSO', phase: 'EL ORDENADOR SE REINICIA Y SIGUE' } },
        { t: 50, v: { date: '20 JUL 1969', place: 'DESCENSO', phase: 'CONTROL MANUAL' } },
        { t: 58, v: { date: '20 JUL 1969', place: 'DESCENSO', phase: 'AVISO: «60 SEGUNDOS»' } },
        { t: 70, v: { date: '20 JUL 1969 · 20:17:40 UT', place: TRANQUILITY, phase: 'CONTACTO' } },
      ],
      sfx: [
        { t: 4, v: 'rumble' },
        { t: 23.3, v: 'retro' },
        { t: 30, v: 'alarm' },
        { t: 33, v: 'alarm' },
      ],
    },

    // -----------------------------------------------------------------------
    // 3 · LA MISIÓN   (el primer paso · los regalos que se quedan)
    // -----------------------------------------------------------------------
    {
      id: 'mision',
      title: 'Capítulo 3 · La misión',
      subtitle: 'El primer paso → los instrumentos · 20–21 de julio de 1969',
      duration: 80,
      audioKey: 'moon/eagle_03.mp3',
      place0: 'tranquility',
      marks: [
        { t: 0, label: 'El primer paso' },
        { t: 40, label: 'Los regalos que se quedan' },
      ],
      cues: [
        // 3A
        { t: 0, text: 'Unas seis horas y media después del alunizaje, se abre la escotilla.' },
        { t: 5, text: 'Armstrong baja por mi escalera. Yo siento cada peldaño.' },
        { t: 11, text: 'Pisa el polvo y dice: «That’s one small step for man, one giant leap for mankind.»' },
        { t: 22, text: 'Después baja Aldrin. Los dos caminan, miran y recogen piedras.' },
        { t: 29, text: 'En una de mis patas hay una placa. Ellos la leen en voz alta.' },
        // 3B
        { t: 40, text: 'Antes de irse, dejan instrumentos en el suelo.' },
        { t: 45, text: 'Un sismómetro, para escuchar si la Luna tiembla.' },
        { t: 50, text: 'Y un espejo especial: cien pequeños cubos de cristal que devuelven la luz justo al lugar de donde vino.' },
        {
          t: 59,
          text: 'Desde la Tierra le dispararán rayos láser. Medirán cuánto tarda la luz en ir y volver, y así sabrán a qué distancia está la Luna, con un error de unos dos centímetros.',
        },
        { t: 70, text: 'Ese espejo no necesita energía. Años después, seguía funcionando perfectamente.' },
      ],
      // Exterior en la escotilla → primer plano de la escalera → ojo → primeros planos de los instrumentos → exterior.
      camera: [
        { t: 0, v: 'wide' },
        { t: 4.65, v: 'part' },
        { t: 21.65, v: 'pov' },
        { t: 39.65, v: 'part' },
        { t: 69.65, v: 'wide' },
      ],
      wide: [
        { t: 0, v: WIDE_CABIN },
        { t: 69.65, v: WIDE_LM_FAR },
      ],
      partFocus: [
        { t: 0, v: null },
        { t: 4.65, v: PART_LADDER },
        { t: 39.65, v: PART_SEISMOMETER },
        { t: 49.65, v: PART_REFLECTOR },
      ],
      pan: [{ t: 21.65, v: 0.1 }],
      scene: [{ t: 0, v: 'flight' }],
      staticLevel: [
        { t: 0, v: 0.12 },
        { t: 4, v: 0.05 },
        { t: 80, v: 0.05 },
      ],
      battery: [{ t: 0, v: 1 }],
      signal: [{ t: 0, v: 1 }],
      clips: [{ t: 0, v: 'Idle' }],
      expressions: [
        { t: 0, v: null },
        { t: 11, v: 'Surprised' },
        { t: 17, v: null },
      ],
      hud: [
        { t: 0, v: { date: '20 JUL 1969', place: TRANQUILITY, phase: 'ESCOTILLA ABIERTA' } },
        { t: 11, v: { date: '21 JUL 1969 · 02:56:15 UT', place: TRANQUILITY, phase: 'PRIMER PASO' } },
        { t: 22, v: { date: '21 JUL 1969', place: TRANQUILITY, phase: 'PASEO LUNAR' } },
        { t: 40, v: { date: '21 JUL 1969', place: TRANQUILITY, phase: 'EXPERIMENTOS EASEP' } },
      ],
      cards: [
        {
          at: 11,
          dur: 10,
          kind: 'quote',
          text: '“That’s one small step for man, one giant leap for mankind.”',
          author: 'Neil Armstrong · «Es un pequeño paso para un hombre, un gran salto para la humanidad»',
          source: 'NSSDC, Apolo 11',
        },
        {
          at: 29,
          dur: 10,
          kind: 'quote',
          text: '“Here men from the planet Earth first set foot on the Moon July 1969, A.D. We came in peace for all mankind.”',
          author: 'Placa del módulo lunar · «Aquí, hombres del planeta Tierra pisaron la Luna por primera vez, julio de 1969 d. C. Vinimos en paz en nombre de toda la humanidad.»',
          source: 'NSSDC, Apolo 11',
        },
      ],
    },

    // -----------------------------------------------------------------------
    // 4 · EL FINAL   (la cabina despega y la etapa de descenso se queda)
    // -----------------------------------------------------------------------
    {
      id: 'final',
      title: 'Capítulo 4 · El final',
      subtitle: '21 de julio de 1969 · 17:54 UT',
      duration: 44,
      audioKey: 'moon/eagle_04.mp3',
      place0: 'tranquility',
      cues: [
        { t: 0, text: 'Casi un día entero en la Luna. Es hora de volver a casa.' },
        { t: 6, text: 'Pero no todo vuelve. Solo sube la cabina: la etapa de ascenso.' },
        { t: 12, text: 'Yo me quedo. Mi trabajo final es ser su plataforma de lanzamiento.' },
        { t: 19, text: 'Cuenta atrás. El motor de arriba se enciende sobre mí.' },
        { t: 25, text: 'La cabina se separa y sube, cada vez más pequeña, hacia Michael Collins.' },
        { t: 33, text: 'Buen viaje.' },
      ],
      // Ojo un momento → exterior para ver la cabina sobre mí → la cámara sube siguiéndola.
      camera: [
        { t: 0, v: 'pov' },
        { t: 5.65, v: 'wide' },
      ],
      wide: [
        { t: 5.65, v: WIDE_PAD },
        { t: 24.4, v: follow(0, 10, 2.5) },
        { t: 28, v: follow(4, 12, 4) },
        { t: 31, v: follow(18, 16, 7) },
        { t: 34, v: follow(52, 22, 12) },
        { t: 38, v: follow(120, 30, 16) },
      ],
      tracks: {
        ascent: [
          { t: 0, v: 0 },
          { t: 24.4, v: 0 },
          { t: 26, v: 0.5 },
          { t: 28, v: 4 },
          { t: 31, v: 18 },
          { t: 34, v: 52 },
          { t: 38, v: 120 },
          { t: 44, v: 260 },
        ],
        fire: [
          { t: 0, v: 0 },
          { t: 21, v: 0 },
          { t: 21.6, v: 1 },
          { t: 44, v: 1 },
        ],
      },
      scene: [{ t: 0, v: 'flight' }],
      staticLevel: [
        { t: 0, v: 0.08 },
        { t: 19, v: 0.1 },
        { t: 21, v: 0.35 },
        { t: 26, v: 0.3 },
        { t: 34, v: 0.15 },
        { t: 44, v: 0.1 },
      ],
      shake: [
        { t: 0, v: 0 },
        { t: 21, v: 0 },
        { t: 21.6, v: 0.3 },
        { t: 24.4, v: 0.5 },
        { t: 30, v: 0.25 },
        { t: 36, v: 0 },
      ],
      battery: [{ t: 0, v: 0.7 }],
      signal: [{ t: 0, v: 1 }],
      clips: [{ t: 0, v: 'Idle' }],
      expressions: [
        { t: 0, v: null },
        { t: 25, v: 'Sad' },
      ],
      hud: [
        { t: 0, v: { date: '21 JUL 1969', place: TRANQUILITY, phase: 'PREPARANDO EL DESPEGUE' } },
        { t: 19, v: { date: '21 JUL 1969 · 17:54:01 UT', place: TRANQUILITY, phase: 'DESPEGUE · ETAPA DE ASCENSO' } },
      ],
      sfx: [{ t: 21.2, v: 'retro' }],
    },

    // -----------------------------------------------------------------------
    // 5 · EL CORTE Y EL LEGADO
    // -----------------------------------------------------------------------
    {
      id: 'legado',
      title: 'Capítulo 5 · El corte y el legado',
      subtitle: '1969 → hoy',
      duration: 62,
      audioKey: 'moon/eagle_05.mp3',
      place0: 'tranquility',
      marks: [
        { t: 0, label: 'Silencio' },
        { t: 12, label: 'El legado' },
      ],
      powerCutAt: 6.5,
      cues: [
        { t: 0, text: 'Ya no tengo a quién llevar.' },
        { t: 4, text: 'Mis sistemas… se…' },
        { t: 12, voice: 'narrator', text: 'La etapa de descenso de Eagle sigue en el Mar de la Tranquilidad, junto a su placa.' },
        {
          t: 19,
          voice: 'narrator',
          text: 'A su lado quedó el reflector láser. Más de cincuenta años después, los científicos todavía lo usan.',
        },
        { t: 27, voice: 'narrator', text: 'Gracias a él sabemos que la Luna se aleja de nosotros, poco a poco.' },
        { t: 34, voice: 'narrator', text: 'Se cree que la cabina cayó sobre la Luna unos meses después; nadie sabe dónde.' },
        {
          t: 43,
          voice: 'narrator',
          text: 'Doce personas caminaron por la Luna entre 1969 y 1972. Las dos primeras bajaron por esta escalera.',
        },
        { t: 52, voice: 'narrator', text: 'Los robots abandonados no están olvidados.' },
      ],
      // Ojo hasta el corte → exterior → el reflector → exterior → la escalera → exterior que se aleja.
      camera: [
        { t: 0, v: 'pov' },
        { t: 11.65, v: 'wide' },
        { t: 18.65, v: 'part' },
        { t: 26.65, v: 'wide' },
        { t: 42.65, v: 'part' },
        { t: 51.65, v: 'wide' },
      ],
      wide: [
        { t: 11.65, v: WIDE_LEGACY },
        { t: 51.65, v: WIDE_FAREWELL },
      ],
      partFocus: [
        { t: 0, v: null },
        { t: 18.65, v: PART_REFLECTOR },
        { t: 42.65, v: PART_LADDER },
      ],
      scene: [{ t: 0, v: 'flight' }],
      staticLevel: [
        { t: 0, v: 0.8 },
        { t: 4, v: 0.9 },
        { t: 6.5, v: 1 },
        { t: 8, v: 0 },
        { t: 62, v: 0 },
      ],
      powerOff: [
        { t: 0, v: 0 },
        { t: 6.5, v: 0 },
        { t: 8, v: 1 },
        { t: 11, v: 1 },
        { t: 12, v: 0 },
      ],
      battery: [
        { t: 0, v: 0.04 },
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
        { t: 0, v: { date: '21 JUL 1969', place: TRANQUILITY, phase: 'SIN TRIPULACIÓN' } },
        { t: 8, v: { date: '', place: '', hidden: true } },
      ],
      sfx: [
        { t: 6.5, v: 'powerdown' },
        { t: 7.9, v: 'relay' },
      ],
      cards: [{ at: 9, dur: 4, kind: 'note', text: 'ETAPA DE DESCENSO · BASE TRANQUILIDAD · DESDE 1969' }],
    },
  ],

  transparency: {
    title: '¿Aterrizó Eagle casi sin combustible?',
    body: 'Se contó muchas veces que a Eagle le quedaban apenas unos segundos. Durante el descenso, Houston avisó «60 segundos» de combustible, y eso alimentó la leyenda. Pero el análisis posterior de la NASA indica que quedaba más de lo que parecía en directo: un aviso en vivo y el dato final no siempre coinciden. Por eso esta historia no da una cifra de lo que quedaba.',
    sources: [
      {
        label: 'ALSJ · El primer alunizaje (transcripción)',
        url: 'https://history.nasa.gov/alsj/a11/a11.landing.html',
      },
      {
        label: 'NASA SP-4029 · Apolo 11 (resumen)',
        url: 'https://history.nasa.gov/SP-4029/Apollo_11a_Summary.htm',
      },
      {
        label: 'NSSDC · Módulo lunar del Apolo 11 (1969-059C)',
        url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C',
      },
    ],
  },
}
