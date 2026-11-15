import type { PartFocus, Story } from '../story'

// Historia de Mars Pathfinder + Sojourner — transcripción de HISTORIA_PATHFINDER.md, con cambios de escena,
// alternancia 1.ª ↔ 3.ª persona y presentación inicial de sus piezas. Datos con fuentes NASA/JPL/NSSDC (ver §2 y §11).
// Voces pendientes: solo subtítulos.
//
// Vistas: 'pov' = 1.ª persona (cámara del mástil) · 'wide' / 'part' = 3.ª persona.
// La historia es una amistad: la estación habla; Sojourner no habla, se mueve.
// El final se cuenta "por razones desconocidas": no se inventa ninguna causa.

const ARES = 'ARES VALLIS'

const focus = (node: string, hotspot: string, dist: number, az: number, el: number): PartFocus => ({ node, hotspot, dist, az, el })

export const pathfinderStory: Story = {
  missionId: 'pathfinder',
  texts: { exploreLabel: 'Explorar el módulo', exploreHint: 'Arrastra para girar alrededor de Pathfinder · pulsa los puntos brillantes o usa los botones para moverlo' },
  // La estación es pequeña: la cámara exterior se acerca.
  view: { wideDist: 3.8, wideTarget: 0.4 },
  intro: {
    kicker: 'Mars Pathfinder · Carl Sagan Memorial Station',
    name: 'Pathfinder',
    blurb:
      'Vas a vivir su historia desde dentro: eres una estación con forma de flor, y a tu lado viaja Sojourner, el primer rover en otro planeta. A ratos la cámara se aleja para que los veas juntos. Mira alrededor arrastrando.',
    button: 'Despertar a la estación',
    short: 'Pathfinder',
  },
  chapters: [
    // -----------------------------------------------------------------------
    // 1 · EL DESPERTAR — 1.ª persona, presentación de sus piezas en 3.ª, de vuelta a 1.ª
    // -----------------------------------------------------------------------
    {
      id: 'despertar',
      title: 'Capítulo 1 · El despertar',
      subtitle: '4 de julio de 1997 · Ares Vallis, Marte',
      duration: 86,
      audioKey: 'mars/pathfinder_01.mp3',
      place0: 'aresvallis',
      jumps: [{ t: 15.6, to: 'aresvallis' }], // parpadeo: de mirar a verme desde fuera
      marks: [
        { t: 0, label: 'Despertar' },
        { t: 23.5, label: 'Mis piezas' },
        { t: 60, label: 'Ares Vallis' },
      ],
      cues: [
        { t: 0, text: 'Sistemas… despertando.' },
        { t: 3, text: 'Mis pétalos se abren, como una flor de metal.' },
        { t: 8, text: 'Piedras. Muchas piedras, de todos los tamaños, regadas por un llano rojizo.' },
        { t: 15, text: 'Soy una estación en Marte. Me pusieron el nombre de Carl Sagan, un astrónomo que soñaba con este planeta.' },
        { t: 22, text: 'No vengo sin compañía. Déjame enseñarte cómo somos.' },
        { t: 24, text: 'Estos son mis pétalos: se abren como una flor y llevan paneles solares.' },
        { t: 31, text: 'Este es mi mástil, con una cámara: mis ojos. Con ella haré más de dieciséis mil quinientas imágenes.' },
        { t: 39, text: 'Esta antena es la voz de los dos: Sojourner habla con la Tierra a través de mí.' },
        { t: 46, text: 'Y este es Sojourner: un rover de seis ruedas, pequeño como un horno de microondas. Pesa diez kilos y medio y mide treinta centímetros.' },
        { t: 53, text: 'En su cabeza lleva un instrumento con el que analiza la química de las rocas.' },
        { t: 61, text: 'Estamos en Ares Vallis: hace mucho tiempo, aquí corrió una inundación gigante.' },
        { t: 69, text: 'Venimos a descubrir qué fue de ese agua.' },
        { t: 77, text: 'Pero antes de contarte qué encontramos… déjame recordar cómo llegamos.' },
      ],
      camera: [
        { t: 0, v: 'pov' },
        { t: 15.9, v: 'wide' },
        { t: 23.5, v: 'part' },
        { t: 60, v: 'pov' },
      ],
      partFocus: [
        { t: 0, v: null },
        { t: 23.5, v: focus('petal_2', 'petals', 2.2, 1.0, 0.5) },
        { t: 30.5, v: focus('mast_head', 'mast', 1.5, 0.6, 0.1) },
        { t: 38.5, v: focus('antenna', 'antenna', 1.6, 2.4, 0.3) },
        { t: 45.5, v: focus('sojourner', 'sojourner', 1.3, -0.7, 0.3) },
        { t: 52.5, v: focus('soj_mast', 'sojmast', 1.0, -0.7, 0.25) },
        { t: 60, v: null },
      ],
      pan: [
        { t: 0, v: 0 },
        { t: 8, v: 0.5 },
        { t: 13, v: -0.4 },
        { t: 15, v: 0 },
        { t: 60, v: 0 },
        { t: 68, v: -0.8 },
        { t: 76, v: 0 },
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
      battery: [{ t: 0, v: 0.9 }],
      signal: [
        { t: 0, v: 0.3 },
        { t: 9, v: 1 },
      ],
      clips: [
        { t: 0, v: 'Open' },
        { t: 3, v: 'Idle' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 2, v: 'Surprised' },
        { t: 7, v: null },
      ],
      hud: [
        { t: 0, v: { sol: '001', date: '4 JUL 1997', place: ARES } },
        { t: 23.5, v: { sol: '001', date: '4 JUL 1997', place: ARES, phase: 'MIS PIEZAS' } },
        { t: 60, v: { sol: '001', date: '4 JUL 1997', place: ARES } },
      ],
      sfx: [{ t: 0, v: 'boot' }],
    },

    // -----------------------------------------------------------------------
    // 2 · EL VIAJE (registro de vuelo, 3.ª persona) → rebotes con airbags → 1.ª persona
    // Las etapas comparten línea de tiempo con `FT` (flightPath.ts): no mover sin cambiar FT.
    // Licencia: la caída y los rebotes se ven sobre un cráter pequeño y con 5 rebotes (real: al menos 15).
    // -----------------------------------------------------------------------
    {
      id: 'viaje',
      title: 'Capítulo 2 · El viaje',
      subtitle: 'Registro de vuelo · diciembre de 1996 → julio de 1997',
      duration: 90,
      audioKey: 'mars/pathfinder_02.mp3',
      place0: 'launch',
      jumps: [
        { t: 22.5, to: 'cruise' },
        { t: 29.9, to: 'cruise' },
        { t: 37.5, to: 'entry' },
        { t: 48.5, to: 'eagle' }, // descenso y rebotes
        { t: 77.9, to: 'aresvallis' }, // abro los ojos ya en Ares Vallis
      ],
      marks: [
        { t: 0, label: 'Lanzamiento' },
        { t: 23, label: 'Crucero' },
        { t: 38, label: 'Entrada' },
        { t: 49, label: 'Airbags' },
      ],
      robot: [
        { t: 0, v: false },
        { t: 78, v: true },
      ],
      cues: [
        { t: 0, text: 'Reproduciendo registro de vuelo.' },
        { t: 5, text: 'Cuatro de diciembre de 1996. Un cohete Delta II nos lanza desde Florida.' },
        { t: 14, text: 'Voy plegado dentro de una cápsula, como una flor cerrada, con Sojourner a cuestas.' },
        { t: 23, text: 'Siete meses de viaje en silencio.' },
        { t: 31, text: 'Poco a poco, Marte crece delante de nosotros.' },
        { t: 38, text: 'Cuatro de julio de 1997. Entro en el aire de Marte a más de veinticinco mil kilómetros por hora.' },
        { t: 44, text: 'Mi escudo se pone al rojo.' },
        { t: 49, text: 'Se abre un paracaídas.' },
        { t: 54, text: 'A unos cien metros del suelo, unos cohetes me frenan.' },
        { t: 60, text: 'Y entonces me envuelvo en airbags: soy una pelota gigante de más de cinco metros.' },
        { t: 65, text: '¡Boing! Reboto hacia arriba. Y otra vez. Y otra. Al menos quince veces.' },
        { t: 71, text: 'Ruedo durante dos minutos y medio, casi un kilómetro…' },
        { t: 75, text: '…y me detengo.' },
        { t: 79, text: 'Se desinflan los airbags. Me abro.' },
        { t: 85, text: 'A mi lado, Sojourner espera su turno.' },
      ],
      camera: [
        { t: 0, v: 'flight' },
        { t: 78.2, v: 'pov' },
      ],
      pan: [{ t: 0, v: 0 }],
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
        { t: 60, v: 0.3 },
        { t: 65, v: 0.5 },
        { t: 73, v: 0.25 },
        { t: 78.2, v: 0.7 },
        { t: 82, v: 0.2 },
        { t: 90, v: 0.15 },
      ],
      shake: [
        { t: 0, v: 0 },
        { t: 5.5, v: 0.15 },
        { t: 21, v: 0.1 },
        { t: 22, v: 0 },
        { t: 38, v: 0.35 },
        { t: 48, v: 0.2 },
        { t: 49, v: 0.05 },
        { t: 60, v: 0.25 },
        { t: 65, v: 0.7 },
        { t: 73, v: 0.2 },
        { t: 74.5, v: 0 },
      ],
      battery: [{ t: 0, v: 1 }],
      signal: [
        { t: 0, v: 0.9 },
        { t: 49, v: 0.4 },
        { t: 60, v: 0.15 },
        { t: 79, v: 0.5 },
        { t: 88, v: 1 },
      ],
      clips: [
        { t: 0, v: 'Idle' },
        { t: 78.2, v: 'Open' },
        { t: 82, v: 'Idle' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 38, v: 'Surprised' },
        { t: 75, v: null },
      ],
      hud: [
        { t: 0, v: { date: 'DIC 1996', place: 'REGISTRO DE VUELO', phase: 'PREPARANDO LANZAMIENTO' } },
        { t: 5, v: { date: '4 DIC 1996', place: 'CABO CAÑAVERAL', phase: 'LANZAMIENTO · DELTA II' } },
        { t: 23, v: { date: '1996 → 1997', place: 'ESPACIO ENTRE LA TIERRA Y MARTE', phase: 'CRUCERO · ~7 MESES' } },
        { t: 38, v: { date: '4 JUL 1997', place: 'ATMÓSFERA DE MARTE', phase: 'ENTRADA · >25 000 km/h' } },
        { t: 49, v: { date: '4 JUL 1997', place: 'ATMÓSFERA DE MARTE', phase: 'PARACAÍDAS' } },
        { t: 54, v: { date: '4 JUL 1997', place: 'ATMÓSFERA DE MARTE', phase: 'RETROCOHETES · ~100 m' } },
        { t: 60, v: { date: '4 JUL 1997', place: 'ATMÓSFERA DE MARTE', phase: 'AIRBAGS' } },
        { t: 65, v: { date: '4 JUL 1997', place: ARES, phase: 'IMPACTO · AL MENOS 15 REBOTES' } },
        { t: 73, v: { date: '4 JUL 1997', place: ARES, phase: 'DETENIDO · ~1 km DEL IMPACTO' } },
        { t: 78.2, v: { sol: '001', date: '4 JUL 1997', place: ARES, phase: 'PÉTALOS ABIERTOS' } },
      ],
      sfx: [
        { t: 5, v: 'rumble' },
        { t: 38, v: 'rumble' },
        { t: 49, v: 'chute' },
        { t: 54, v: 'retro' },
        { t: 60, v: 'airbag' },
        { t: 65, v: 'tumble' },
        { t: 78.2, v: 'unfold' },
      ],
      cards: [{ at: 66, dur: 6, kind: 'note', text: 'PRIMER REBOTE · MÁS DE 10 m DE ALTO' }],
    },

    // -----------------------------------------------------------------------
    // 3 · LA MISIÓN — 3A las primeras ruedas · 3B rocas con nombre y un pasado de agua
    // -----------------------------------------------------------------------
    {
      id: 'mision',
      title: 'Capítulo 3 · La misión',
      subtitle: 'Julio → septiembre de 1997 · Una amistad en Marte',
      duration: 94,
      audioKey: 'mars/pathfinder_03.mp3',
      place0: 'aresvallis',
      jumps: [
        { t: 12.7, to: 'aresvallis' }, // a mis ojos, mirando a Sojourner
        { t: 33.6, to: 'aresvallis' }, // 3B
        { t: 48.6, to: 'aresvallis' }, // mi cámara
        { t: 78.6, to: 'aresvallis' }, // otra vez desde fuera
      ],
      marks: [
        { t: 0, label: '3A · Las primeras ruedas' },
        { t: 33.5, label: '3B · Rocas con nombre' },
      ],
      cues: [
        { t: 0, text: 'Sol dos. Sojourner se levanta hasta su altura completa: treinta centímetros.' },
        { t: 7, text: 'Baja por una rampa, despacito… y sus ruedas tocan Marte.' },
        { t: 13.5, text: 'Es la primera vez que un vehículo con ruedas rueda por otro planeta.' },
        { t: 19.5, text: 'Le pusieron Sojourner por Sojourner Truth, una mujer que luchó por la libertad y la igualdad.' },
        { t: 27, text: 'Lo primero que hace es acercarse a una roca. Los científicos la llaman Barnacle Bill.' },
        { t: 34, text: 'Cada roca recibe un apodo: Barnacle Bill, Yogi, Scooby-Doo.' },
        { t: 41, text: 'Sojourner las toca con su instrumento y nos dice de qué están hechas. Hacemos más de quince análisis químicos.' },
        { t: 49, text: 'Yo miro todo con mi cámara: más de dieciséis mil quinientas imágenes.' },
        { t: 56, text: 'Hay piedras redondeadas, como las de un río. Y rocas hechas de piedritas pegadas, que se forman con agua que corre.' },
        { t: 66, text: 'Marte, hace mucho, fue más cálido y húmedo.' },
        { t: 71, text: 'Veo nubes de hielo al amanecer. Y remolinos de polvo que pasan bailando junto a mí.' },
        { t: 79, text: 'A Sojourner le dieron siete días de vida. Lleva más de ochenta.' },
        { t: 86, text: 'A mí me dieron treinta. Llevo el triple.' },
      ],
      camera: [
        { t: 0, v: 'wide' },
        { t: 6.8, v: 'part' },
        { t: 13, v: 'pov' },
        { t: 19, v: 'wide' },
        { t: 27, v: 'part' },
        { t: 33.9, v: 'pov' },
        { t: 41, v: 'part' },
        { t: 48.9, v: 'pov' },
        { t: 66, v: 'wide' },
        { t: 71, v: 'pov' },
        { t: 78.9, v: 'wide' },
      ],
      partFocus: [
        { t: 0, v: null },
        { t: 6.8, v: focus('sojourner', 'sojourner', 1.6, -0.8, 0.3) },
        { t: 13, v: null },
        { t: 27, v: focus('sojourner', 'sojourner', 1.4, -1.5, 0.25) },
        { t: 33.9, v: null },
        { t: 41, v: focus('soj_mast', 'sojmast', 1.0, -1.2, 0.25) },
        { t: 48.9, v: null },
      ],
      // Mirada del POV: hacia Sojourner (a la derecha) en 3A; panorámica con mi cámara en 3B.
      pan: [
        { t: 0, v: 0 },
        { t: 13, v: -0.9 },
        { t: 19, v: -0.9 },
        { t: 33.9, v: -0.9 },
        { t: 48.9, v: 0.6 },
        { t: 56, v: -0.6 },
        { t: 64, v: 0.3 },
        { t: 71, v: 0.3 },
        { t: 78, v: -0.5 },
      ],
      gaze: [{ t: 0, v: 0 }],
      scene: [{ t: 0, v: 'surface' }],
      staticLevel: [
        { t: 0, v: 0.5 },
        { t: 3, v: 0.08 },
        { t: 94, v: 0.05 },
      ],
      // Remolinos de polvo (suaves).
      dust: [
        { t: 0, v: 0 },
        { t: 70, v: 0 },
        { t: 73, v: 0.3 },
        { t: 78, v: 0.3 },
        { t: 81, v: 0 },
      ],
      battery: [{ t: 0, v: 0.9 }],
      signal: [{ t: 0, v: 1 }],
      clips: [
        { t: 0, v: 'Idle' },
        { t: 6.5, v: 'Drive!' }, // Sojourner baja por la rampa y se aleja (una sola vez)
      ],
      expressions: [
        { t: 0, v: null },
        { t: 13.5, v: 'Surprised' },
        { t: 20, v: null },
      ],
      hud: [
        { t: 0, v: { sol: '002', date: '5 JUL 1997', place: ARES, phase: 'SOJOURNER · PRIMERAS RUEDAS' } },
        { t: 33.9, v: { date: 'JUL → SEP 1997', place: ARES, phase: 'ROCAS CON NOMBRE' } },
        { t: 56, v: { date: 'JUL → SEP 1997', place: ARES, phase: 'MARTE: CÁLIDO Y HÚMEDO' } },
        { t: 79, v: { date: 'SEP 1997', place: ARES, phase: 'PREVISTO: 7 y 30 DÍAS' } },
      ],
      sfx: [{ t: 7, v: 'unfold' }],
      cards: [
        { at: 34.5, dur: 6, kind: 'note', text: 'BARNACLE BILL · YOGI · SCOOBY-DOO' },
        { at: 56.5, dur: 8, kind: 'note', text: 'PIEDRAS REDONDEADAS · CONGLOMERADOS FORMADOS EN AGUA CORRIENTE' },
        { at: 80, dur: 12, kind: 'note', text: 'SOJOURNER: 7 DÍAS PREVISTOS → 83 REALES · ESTACIÓN: 30 DÍAS → 3 VECES MÁS' },
      ],
    },

    // -----------------------------------------------------------------------
    // 4 · EL FINAL — sin causa conocida
    // -----------------------------------------------------------------------
    {
      id: 'final',
      title: 'Capítulo 4 · El final',
      subtitle: '27 de septiembre de 1997',
      duration: 38,
      audioKey: 'mars/pathfinder_04.mp3',
      place0: 'aresvallis',
      jumps: [
        { t: 4.6, to: 'aresvallis' },
        { t: 16.6, to: 'aresvallis' },
      ],
      cues: [
        { t: 0, text: 'Veintisiete de septiembre de 1997.' },
        { t: 5, text: 'Envío mis datos a la Tierra, como cada día.' },
        { t: 10, text: 'Sojourner está cerca, esperando instrucciones que pasan a través de mí.' },
        { t: 17, text: 'Termino la transmisión.' },
        { t: 21, text: 'Y después… no sé qué pasa. Nadie lo sabe.' },
        { t: 27, text: 'Mi voz no vuelve a llegar a la Tierra.' },
      ],
      camera: [
        { t: 0, v: 'wide' },
        { t: 4.9, v: 'part' },
        { t: 10, v: 'wide' },
        { t: 16.9, v: 'pov' },
      ],
      partFocus: [
        { t: 0, v: null },
        { t: 4.9, v: focus('antenna', 'antenna', 1.6, 2.4, 0.3) },
        { t: 10, v: null },
      ],
      pan: [
        { t: 0, v: 0 },
        { t: 16.9, v: -0.9 },
        { t: 38, v: -0.9 },
      ],
      gaze: [{ t: 0, v: 0 }],
      scene: [{ t: 0, v: 'surface' }],
      staticLevel: [
        { t: 0, v: 0.08 },
        { t: 17, v: 0.1 },
        { t: 24, v: 0.4 },
        { t: 28, v: 0.7 },
        { t: 38, v: 0.8 },
      ],
      battery: [{ t: 0, v: 0.6 }],
      signal: [
        { t: 0, v: 1 },
        { t: 17, v: 0.8 },
        { t: 22, v: 0.4 },
        { t: 27, v: 0.1 },
      ],
      hold: 'Drive',
      clips: [{ t: 0, v: 'Idle' }],
      expressions: [
        { t: 0, v: null },
        { t: 21, v: 'Sad' },
      ],
      hud: [
        { t: 0, v: { date: '27 SEP 1997', place: ARES, phase: 'TRANSMISIÓN DIARIA' } },
        { t: 17, v: { date: '27 SEP 1997', place: ARES, phase: 'FIN DE LA TRANSMISIÓN' } },
      ],
      sfx: [
        { t: 5.2, v: 'relay' },
        { t: 27.5, v: 'relay' },
      ],
    },

    // -----------------------------------------------------------------------
    // 5 · EL CORTE Y EL LEGADO (~60 s)
    // -----------------------------------------------------------------------
    {
      id: 'legado',
      title: 'Capítulo 5 · El corte y el legado',
      subtitle: '1997 → 1998 → hoy',
      duration: 60,
      audioKey: 'mars/pathfinder_05.mp3',
      place0: 'aresvallis',
      marks: [
        { t: 0, label: 'Corte' },
        { t: 12, label: 'El legado' },
      ],
      powerCutAt: 5.8,
      cues: [
        { t: 0, text: 'Sojourner… sigue ahí.' },
        { t: 3.5, text: 'Yo…' },
        { t: 12, voice: 'narrator', text: 'La Tierra siguió escuchando durante meses. El 10 de marzo de 1998, el equipo dio la misión por terminada.' },
        { t: 21, voice: 'narrator', text: 'Nunca se supo por qué se apagó la estación.' },
        { t: 26, voice: 'narrator', text: 'Pathfinder demostró que se podía llegar a Marte de forma más rápida y más barata.' },
        {
          t: 33,
          voice: 'narrator',
          text: 'Y su forma de aterrizar, con airbags y pétalos, se volvió a usar para llevar otros rovers a Marte. Años después, Opportunity rebotó igual.',
        },
        {
          t: 44,
          voice: 'narrator',
          text: 'La estación Carl Sagan y Sojourner siguen en Ares Vallis, juntos, mirando las piedras que estudiaron.',
        },
        { t: 53, voice: 'narrator', text: 'Los robots abandonados no están olvidados.' },
      ],
      camera: [
        { t: 0, v: 'pov' },
        { t: 11.9, v: 'wide' },
        { t: 33, v: 'part' },
        { t: 44, v: 'wide' },
      ],
      partFocus: [
        { t: 0, v: null },
        { t: 33, v: focus('airbag_0', 'airbags', 2.2, 0.3, 0.3) },
        { t: 44, v: null },
      ],
      pan: [{ t: 0, v: -0.9 }],
      gaze: [{ t: 0, v: 0 }],
      scene: [{ t: 0, v: 'surface' }],
      staticLevel: [
        { t: 0, v: 0.7 },
        { t: 3.5, v: 0.85 },
        { t: 5.8, v: 1 },
        { t: 7.5, v: 1 },
        { t: 11.9, v: 0 },
      ],
      powerOff: [
        { t: 0, v: 0 },
        { t: 5.8, v: 0 },
        { t: 7, v: 1 },
        { t: 12.5, v: 1 },
        { t: 15.5, v: 0 },
      ],
      battery: [{ t: 0, v: 0.6 }],
      signal: [{ t: 0, v: 0.1 }, { t: 5.8, v: 0 }],
      hold: 'Drive',
      clips: [{ t: 0, v: 'Death' }],
      expressions: [
        { t: 0, v: 'Sad' },
        { t: 5.8, v: 'Sleep' },
      ],
      hud: [
        { t: 0, v: { date: '27 SEP 1997', place: ARES, phase: 'SIN RESPUESTA' } },
        { t: 7, v: { date: '', place: '', hidden: true } },
      ],
      sfx: [
        { t: 5.6, v: 'powerdown' },
        { t: 6.9, v: 'relay' },
      ],
      cards: [
        { at: 7.6, dur: 4.2, kind: 'note', text: 'ÚLTIMA TRANSMISIÓN · 27 SEP 1997' },
        { at: 21, dur: 6, kind: 'note', text: 'COMUNICACIÓN PERDIDA «POR RAZONES DESCONOCIDAS» · NSSDC' },
      ],
    },
  ],

  // Modo Explorar: escenario base y acciones del robot (clips del GLB).
  explore: {
    place: 'aresvallis',
    drive: { kind: 'rover-node', node: 'sojourner', maxSpeed: 0.7, radius: 14, label: 'Manejar a Sojourner' },
    actions: [
      { id: 'open', label: 'Abrir pétalos', hint: 'Los tres pétalos se despliegan', clip: 'Open', duration: 3, focus: 'petals' },
      { id: 'drive', label: 'Soltar a Sojourner', hint: 'El rover baja por la rampa', clip: 'Drive!', duration: 10, focus: 'sojourner' },
      { id: 'airbags', label: 'Inflar airbags', hint: 'Los airbags se hinchan y se pliegan', motion: 'pathfinder-airbags', duration: 6, focus: 'airbags' },
      { id: 'camera', label: 'Mirar con la cámara', hint: 'La cabeza del mástil gira', motion: 'pathfinder-camera', duration: 7, focus: 'mast' },
    ],
  },

  whatIfs: [
    {
      id: 'airbags',
      question: 'los airbags no hubieran aguantado los rebotes',
      imagine:
        'Si los airbags se hubieran roto en los primeros impactos, el módulo habría golpeado el suelo sin amortiguación y Sojourner quizá nunca habría bajado por su rampa.',
      reality:
        'Pathfinder chocó a unos 18 m/s y rebotó al menos 15 veces; el primer rebote superó los diez metros de altura. Se detuvo unos 2,5 minutos después, a cerca de un kilómetro del primer impacto.',
      science:
        'Los airbags se inflaron en unos 0,3 s hasta formar una bola de 5,2 m y absorbieron la energía rebotando en vez de frenar de golpe. Según el JPL, el sistema de airbags y pétalos se usó después, en varias versiones, para aterrizar otros rovers en Marte.',
      sources: [
        { label: 'JPL — Mars Pathfinder / Sojourner Rover', url: 'https://www.jpl.nasa.gov/missions/mars-pathfinder-sojourner-rover' },
        { label: 'NSSDC — Mars Pathfinder (1996-068A)', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A' },
      ],
      focus: 'airbags',
      action: 'airbags',
    },
  ],

  transparency: {
    title: '¿Se quedó Pathfinder sin batería?',
    body: 'Es lo que muchos suponen, pero la NASA nunca lo confirmó. La última transmisión llegó el 27 de septiembre de 1997 y, según los registros oficiales, la comunicación se perdió «por razones desconocidas». En ciencia, a veces la respuesta honesta es «no lo sabemos».',
    sources: [
      {
        label: 'NSSDC · Mars Pathfinder (1996-068A)',
        url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1996-068A',
      },
      {
        label: 'NSSDC · Informe de estado de Mars Pathfinder (10-mar-1998)',
        url: 'https://nssdc.gsfc.nasa.gov/planetary/text/marspath_status.txt',
      },
    ],
  },
}
