import type { Story } from '../story'

// Historia de Opportunity (MER-B, "Oppy") — transcripción de HISTORIA_OPPORTUNITY.md.
// Datos verificados con fuentes NASA/JPL (ver §2 y §11 del documento). Voces pendientes: solo subtítulos.

const MARS = 'MERIDIANI PLANUM'

export const opportunityStory: Story = {
  missionId: 'opportunity',
  chapters: [
    // -----------------------------------------------------------------------
    // 1 · EL DESPERTAR
    // -----------------------------------------------------------------------
    {
      id: 'despertar',
      title: 'Capítulo 1 · El despertar',
      subtitle: 'Sol 1 · Meridiani Planum, Marte',
      duration: 96,
      audioKey: 'mars/opportunity_01.mp3',
      place0: 'eagle',
      cues: [
        { t: 0, text: 'Señal… estable. Sistemas… despertando.' },
        { t: 5, text: 'Abro los ojos. Primero solo hay luz… y polvo anaranjado.' },
        { t: 11, text: 'Un llano rojizo, plano, hasta donde alcanzo a ver.' },
        { t: 16, text: 'Soy Opportunity. Los ingenieros me llaman Oppy. Déjame enseñarte cómo soy.' },
        { t: 21, text: 'Estos son mis ojos: dos cámaras en lo alto de un mástil, a casi un metro y medio del suelo.' },
        { t: 27, text: 'Este es mi brazo, con microscopio y herramientas de geólogo: puedo raspar una roca para mirar por dentro.' },
        { t: 34, text: 'Estos son mis paneles solares. Beben la luz del Sol: sin Sol, no tengo energía.' },
        { t: 40, text: 'Tengo seis ruedas con una suspensión que se adapta al terreno. Soy lento: menos de cuatro centímetros por segundo.' },
        { t: 47, text: 'Y esta antena me permite hablar con la Tierra.' },
        { t: 53, text: 'Estoy en Marte. Dentro de un cráter pequeño, en una región llamada Meridiani Planum.' },
        {
          t: 60,
          text: 'Me enviaron aquí porque, desde el cielo, vieron hematita: un mineral que casi siempre nace donde hubo agua.',
        },
        { t: 69, text: 'Mi trabajo es leer estas rocas y responder una pregunta: ¿hubo agua aquí?' },
        {
          t: 75,
          text: 'Me dieron noventa soles —noventa días marcianos— para lograrlo. Tengo un gemelo, Spirit, al otro lado del planeta; llegó tres semanas antes.',
        },
        { t: 89, text: 'Pero primero… déjame recordar cómo llegué.' },
      ],
      camera: [
        { t: 0, v: 'pov' },
        { t: 20.5, v: 'part' },
        { t: 52.5, v: 'pov' },
      ],
      partFocus: [
        { t: 0, v: null },
        { t: 20.5, v: { node: 'mast_head', hotspot: 'pancam', dist: 1.7, az: 0.55, el: 0.12 } },
        { t: 26.5, v: { node: 'arm_turret', hotspot: 'arm', dist: 2.6, az: -1.0, el: 0.38 } },
        { t: 33.5, v: { node: 'deck', hotspot: 'panels', dist: 3.6, az: 2.5, el: 0.5 } },
        { t: 39.5, v: { node: 'wheel_RM', hotspot: 'wheels', dist: 3.0, az: 1.25, el: 0.12 } },
        { t: 46.5, v: { node: 'antenna', hotspot: 'antenna', dist: 1.9, az: 2.5, el: 0.25 } },
        { t: 52.5, v: null },
      ],
      scene: [{ t: 0, v: 'surface' }],
      staticLevel: [
        { t: 0, v: 0.95 },
        { t: 4, v: 0.55 },
        { t: 9, v: 0.15 },
        { t: 20, v: 0.06 },
        { t: 82, v: 0.1 },
        { t: 89, v: 0.5 },
        { t: 96, v: 1 },
      ],
      battery: [{ t: 0, v: 1 }],
      signal: [
        { t: 0, v: 0.3 },
        { t: 9, v: 1 },
      ],
      clips: [
        { t: 0, v: 'Wake' },
        { t: 3, v: 'Idle' },
        { t: 39.5, v: 'Drive' }, // las ruedas giran mientras las enseña
        { t: 46.5, v: 'Idle' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 2, v: 'Surprised' },
        { t: 5.5, v: null },
      ],
      hud: [
        { t: 0, v: { sol: '001', date: '25 ENE 2004 (UTC)', place: MARS } },
        { t: 20.5, v: { sol: '001', date: '25 ENE 2004 (UTC)', place: MARS, phase: 'MIS PIEZAS' } },
        { t: 52.5, v: { sol: '001', date: '25 ENE 2004 (UTC)', place: MARS } },
      ],
      sfx: [{ t: 0, v: 'boot' }],
    },

    // -----------------------------------------------------------------------
    // 2 · EL VIAJE (registro de vuelo)
    // -----------------------------------------------------------------------
    {
      id: 'viaje',
      title: 'Capítulo 2 · El viaje',
      subtitle: 'Registro de vuelo · julio de 2003 → enero de 2004',
      duration: 94,
      audioKey: 'mars/opportunity_02.mp3',
      place0: 'launch',
      // Cortes con los ojos cerrados: pad de lanzamiento → espacio → entrada → descenso sobre el cráter → "abro los ojos".
      jumps: [
        { t: 22.5, to: 'cruise' },
        { t: 29.9, to: 'cruise' }, // de mirar hacia la Tierra a mirar hacia Marte
        { t: 37.5, to: 'entry' },
        { t: 48.5, to: 'eagle' },
        { t: 77.9, to: 'eagle' }, // abre los ojos dentro del robot
      ],
      robot: [
        { t: 0, v: false },
        { t: 78, v: true },
      ],
      cues: [
        { t: 0, text: 'Reproduciendo mi registro de vuelo.' },
        {
          t: 5,
          text: 'La noche del 7 de julio de 2003, hora de Florida, un cohete Delta II me lanza desde Cabo Cañaveral.',
        },
        {
          t: 14,
          text: 'Voy plegado dentro de una cápsula, como un origami: ruedas recogidas, paneles cerrados, mástil acostado.',
        },
        { t: 23, text: 'No veo nada. Durante unos siete meses cruzo la oscuridad entre dos planetas.' },
        { t: 31, text: 'Hace unas semanas terminó el crucero. Ahora empieza lo difícil.' },
        {
          t: 38,
          text: 'Veinticinco de enero de 2004. Entro en la atmósfera de Marte a diecinueve mil trescientos kilómetros por hora.',
        },
        { t: 49, text: 'El aire me golpea. Se abre un paracaídas.' },
        { t: 54, text: 'A unos cien metros del suelo, se encienden los cohetes que me frenan.' },
        { t: 60, text: 'Se inflan los airbags. Todo se vuelve blanco y ruidoso.' },
        { t: 65, text: 'Toco el suelo a unos cincuenta kilómetros por hora… y rebote, y ruedo, y rebote…' },
        { t: 73, text: '…hasta detenerme dentro de un cráter pequeño.' },
        { t: 79, text: 'Se abren mis paneles. Durante cuatro días practico cómo bajar de mi plataforma.' },
        { t: 87, text: 'Y entonces mis ruedas tocan Marte por primera vez.' },
      ],
      camera: [
        { t: 0, v: 'flight' },
        { t: 78.2, v: 'pov' },
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
        { t: 60, v: 0.3 },
        { t: 65, v: 0.5 },
        { t: 73, v: 0.25 },
        { t: 78.2, v: 0.7 },
        { t: 82, v: 0.2 },
        { t: 94, v: 0.15 },
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
        { t: 78.2, v: 'Wake' },
        { t: 89, v: 'Idle' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 38, v: 'Surprised' },
        { t: 75, v: null },
      ],
      hud: [
        { t: 0, v: { date: 'JUL 2003', place: 'REGISTRO DE VUELO', phase: 'PREPARANDO LANZAMIENTO' } },
        { t: 5, v: { date: '7 JUL 2003', place: 'CABO CAÑAVERAL', phase: 'LANZAMIENTO · DELTA II' } },
        { t: 23, v: { date: '2003', place: 'ESPACIO ENTRE LA TIERRA Y MARTE', phase: 'CRUCERO · ~7 MESES' } },
        { t: 31, v: { date: '11 DIC 2003', place: 'ESPACIO ENTRE LA TIERRA Y MARTE', phase: 'FIN DEL CRUCERO' } },
        { t: 38, v: { date: '25 ENE 2004', place: 'ATMÓSFERA DE MARTE', phase: 'ENTRADA · 19 300 km/h' } },
        { t: 49, v: { date: '25 ENE 2004', place: 'ATMÓSFERA DE MARTE', phase: 'PARACAÍDAS' } },
        { t: 54, v: { date: '25 ENE 2004', place: 'ATMÓSFERA DE MARTE', phase: 'RETROCOHETES · ~100 m' } },
        { t: 60, v: { date: '25 ENE 2004', place: 'ATMÓSFERA DE MARTE', phase: 'AIRBAGS' } },
        { t: 65, v: { date: '25 ENE 2004', place: MARS, phase: 'IMPACTO · ~50 km/h' } },
        { t: 73, v: { date: '25 ENE 2004', place: MARS, phase: 'DETENIDO EN UN CRÁTER PEQUEÑO' } },
        { t: 79, v: { sol: '001', date: '25 ENE 2004 (UTC)', place: MARS, phase: 'PANELES DESPLEGADOS' } },
        { t: 87, v: { sol: '001', date: '25 ENE 2004 (UTC)', place: MARS, phase: 'EGRESO · 4 DÍAS' } },
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
    },

    // -----------------------------------------------------------------------
    // 3 · LA MISIÓN (3 escenas, ~104 s)
    // -----------------------------------------------------------------------
    {
      id: 'mision',
      title: 'Capítulo 3 · La misión',
      subtitle: 'Cráter Eagle → Purgatory Dune → Endeavour · 2004–2015',
      duration: 104,
      audioKey: 'mars/opportunity_03.mp3',
      place0: 'eagle',
      jumps: [
        { t: 33.6, to: 'purgatory' },
        { t: 63.6, to: 'plains' },
        { t: 69.7, to: 'endurance' },
        { t: 74.7, to: 'victoria' },
        { t: 80.7, to: 'endeavour' },
      ],
      marks: [
        { t: 0, label: 'Las esferas · 2004' },
        { t: 34, label: 'Atrapado en la arena · 2005' },
        { t: 64, label: 'El camino largo · 2006–2015' },
      ],
      cues: [
        // 3A
        { t: 0, text: 'Acerco mi brazo a la roca y la miro con mi microscopio.' },
        {
          t: 5,
          text: 'Hay capas finas, como las páginas de un libro. Y por el suelo, esferitas regadas como arándanos.',
        },
        {
          t: 13,
          text: 'Los científicos las llaman blueberries. Son bolitas de hematita, formadas cuando agua subterránea ácida empapó la roca.',
        },
        { t: 22, text: 'Me enviaron a buscar pruebas de agua. Las acabo de encontrar.' },
        { t: 28, text: 'Soy el primer rover que estudia rocas sedimentarias en otro planeta.' },
        // 3B
        {
          t: 34,
          text: 'Veintiséis de abril de 2005. Mis ruedas se hunden en una duna de arena suelta. Giro y giro… y no avanzo.',
        },
        {
          t: 43,
          text: 'Pasan cinco semanas. En la Tierra, mis ingenieros copian mi situación en un cajón de arena del JPL y ensayan cómo sacarme.',
        },
        { t: 52, text: 'Llegan sus órdenes. Mis ruedas giran despacio… y salgo.' },
        {
          t: 57,
          text: 'La rueda delantera derecha gasta más energía de la cuenta, así que a veces avanzo… de reversa.',
        },
        // 3C
        { t: 64, text: 'Me pidieron recorrer mil metros. Sigo andando.' },
        { t: 70, text: 'Bajo por las pendientes inclinadas del cráter Endurance.' },
        { t: 75, text: 'Exploro el cráter Victoria durante casi dos años.' },
        {
          t: 81,
          text: 'En 2011 llego a Endeavour. Allí hay vetas de yeso y arcillas formadas en agua de pH neutro: las condiciones más amigables para la vida microbiana antigua.',
        },
        {
          t: 93,
          text: 'Veinticuatro de marzo de 2015, sol 3 968: mi cuenta pasa los cuarenta y dos con ciento noventa y cinco metros. Es la distancia de un maratón.',
        },
      ],
      camera: [
        { t: 0, v: 'part' }, // arranca mirando el brazo sobre la roca
        { t: 6, v: 'pov' },
        { t: 38, v: 'wide' }, // se ven las ruedas hundidas
        { t: 50, v: 'pov' },
        { t: 82, v: 'wide' }, // el rover rodando por el borde de Endeavour
        { t: 92, v: 'pov' },
      ],
      partFocus: [
        { t: 0, v: { node: 'arm_turret', hotspot: 'none', dist: 2.6, az: -1.0, el: 0.38 } },
        { t: 6, v: null },
      ],
      // La mirada recorre las capas de la roca y las esferas.
      pan: [
        { t: 0, v: 0 },
        { t: 6, v: 0 },
        { t: 13, v: -0.6 },
        { t: 26, v: 0.6 },
        { t: 34, v: 0 },
      ],
      scene: [{ t: 0, v: 'surface' }],
      staticLevel: [
        { t: 0, v: 0.12 },
        { t: 4, v: 0.05 },
        { t: 104, v: 0.05 },
      ],
      // Distancia recorrida en cada lugar (se reinicia con los ojos cerrados). La velocidad es acelerada a propósito
      // para que se note el avance (el rover real iba a menos de 4 cm/s).
      robotX: [
        { t: 0, v: 0 },
        { t: 52, v: 0 },
        { t: 62, v: 4 },
        { t: 63.85, v: 4.6 },
        { t: 63.9, v: 0 },
        { t: 69.7, v: 3.5 },
        { t: 69.95, v: 3.5 },
        { t: 70, v: 0 },
        { t: 74.7, v: 4 },
        { t: 74.95, v: 4 },
        { t: 75, v: 0 },
        { t: 80.7, v: 3 },
        { t: 80.95, v: 3 },
        { t: 81, v: 0 },
        { t: 104, v: 18 },
      ],
      // Atascado en Purgatory Dune: las ruedas se hunden y patinan; luego sale.
      sink: [
        { t: 0, v: 0 },
        { t: 34, v: 0 },
        { t: 38, v: 0.16 },
        { t: 52, v: 0.16 },
        { t: 57, v: 0 },
      ],
      slip: [
        { t: 0, v: 0 },
        { t: 34, v: 0 },
        { t: 35, v: 1 },
        { t: 52, v: 1 },
        { t: 54.5, v: 0 },
      ],
      battery: [{ t: 0, v: 1 }],
      signal: [{ t: 0, v: 1 }],
      clips: [
        { t: 0, v: 'Idle' },
        { t: 34, v: 'Drive' }, // las ruedas giran sin avanzar (atascado); después avanza
      ],
      expressions: [
        { t: 0, v: null },
        { t: 22, v: 'Surprised' },
        { t: 27, v: null },
      ],
      hud: [
        { t: 0, v: { date: '2004', place: 'CRÁTER EAGLE · MERIDIANI PLANUM' } },
        { t: 34, v: { date: '26 ABR 2005', place: 'PURGATORY DUNE' } },
        { t: 64, v: { date: '2006 → 2015', place: 'CRÁTERES ENDURANCE · VICTORIA · ENDEAVOUR' } },
        { t: 93, v: { sol: '3 968', date: '24 MAR 2015', place: 'MARATHON VALLEY · 42,195 km' } },
      ],
      cards: [
        {
          at: 22,
          dur: 9,
          kind: 'quote',
          text: '“From the get-go, Opportunity delivered on our search for evidence regarding water.”',
          author: 'Steve Squyres, investigador principal de los rovers (Cornell)',
          source: 'NASA, 2019',
        },
        {
          at: 95,
          dur: 8,
          kind: 'quote',
          text: '“Still, running a marathon on Mars feels pretty cool.”',
          author: 'Steve Squyres, investigador principal (Cornell)',
          source: 'JPL, 2015',
        },
      ],
    },

    // -----------------------------------------------------------------------
    // 4 · EL FINAL (~62 s)
    // -----------------------------------------------------------------------
    {
      id: 'final',
      title: 'Capítulo 4 · El final',
      subtitle: 'Perseverance Valley · mayo–junio de 2018',
      duration: 62,
      audioKey: 'mars/opportunity_04.mp3',
      place0: 'endeavour',
      jumps: [{ t: 0.1, to: 'perseverance' }],
      // Panorámica: la mirada barre el horizonte mientras "toma" las 354 fotos; luego, una deriva lenta.
      pan: [
        { t: 0, v: -1.0 },
        { t: 7, v: -1.0 },
        { t: 16, v: 1.0 },
        { t: 22, v: 0 },
        { t: 62, v: 0.3 },
      ],
      cues: [
        {
          t: 0,
          text: 'Sol cinco mil ochenta y cuatro. Estoy en Perseverance Valley, en el borde del cráter Endeavour.',
        },
        {
          t: 7,
          text: 'Hago lo que mejor sé hacer: mirar. Tomo un panorama completo, foto a foto: trescientas cincuenta y cuatro imágenes.',
        },
        { t: 16, text: 'Pero la luz cambia. El Sol se vuelve un disco pálido. El cielo se pone marrón.' },
        {
          t: 23,
          text: 'Desde la órbita, mis colegas ven nacer una tormenta de polvo. Yo funciono con el Sol: si el Sol se va, me quedo sin batería.',
        },
        {
          t: 32,
          text: 'El seis de junio mi energía cae y paso a funcionar al mínimo. Algunas fotos del panorama quedarán en blanco y negro.',
        },
        { t: 40, text: 'Diez de junio de 2018. Sol cinco mil ciento once.' },
        {
          t: 44,
          text: 'Preparo un último paquete de datos para la Tierra: casi no me queda energía, afuera hay unos veintinueve grados bajo cero… y aquí, en pleno día, es de noche.',
        },
        { t: 54, text: 'Lo envío. Y espero la respuesta…' },
      ],
      camera: [
        { t: 0, v: 'pov' },
        { t: 24, v: 'wide' }, // se ve al rover bajo el cielo que se oscurece
        { t: 32, v: 'pov' },
      ],
      scene: [{ t: 0, v: 'surface' }],
      staticLevel: [
        { t: 0, v: 0.1 },
        { t: 32, v: 0.2 },
        { t: 44, v: 0.4 },
        { t: 54, v: 0.55 },
        { t: 58, v: 0.7 },
        { t: 62, v: 0.7 },
      ],
      dust: [
        { t: 0, v: 0 },
        { t: 14, v: 0.15 },
        { t: 23, v: 0.45 },
        { t: 32, v: 0.65 },
        { t: 44, v: 0.9 },
        { t: 56, v: 1 },
        { t: 62, v: 1 },
      ],
      battery: [
        { t: 0, v: 0.85 },
        { t: 23, v: 0.7 },
        { t: 32, v: 0.4 },
        { t: 44, v: 0.22 },
        { t: 54, v: 0.1 },
        { t: 62, v: 0.04 },
      ],
      signal: [
        { t: 0, v: 1 },
        { t: 32, v: 0.8 },
        { t: 56, v: 0.45 },
        { t: 62, v: 0.3 },
      ],
      clips: [
        { t: 0, v: 'Idle' },
        { t: 54, v: 'Death' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 32, v: 'Sad' },
      ],
      hud: [
        { t: 0, v: { sol: '5 084', date: '13 MAY 2018', place: 'PERSEVERANCE VALLEY' } },
        { t: 32, v: { date: '6 JUN 2018', place: 'PERSEVERANCE VALLEY' } },
        { t: 40, v: { sol: '5 111', date: '10 JUN 2018', place: 'PERSEVERANCE VALLEY' } },
        { t: 44, v: { sol: '5 111', date: '10 JUN 2018', place: 'PERSEVERANCE VALLEY', temp: '−29 °C' } },
      ],
      cards: [
        {
          at: 54,
          dur: 8,
          kind: 'note',
          text: 'ÚLTIMA SEÑAL RECIBIDA POR LA TIERRA · 10 JUN 2018',
        },
      ],
    },

    // -----------------------------------------------------------------------
    // 5 · EL CORTE ELÉCTRICO Y EL LEGADO (~68 s)
    // -----------------------------------------------------------------------
    {
      id: 'legado',
      title: 'Capítulo 5 · El corte eléctrico y el legado',
      subtitle: '10 de junio de 2018 → hoy',
      duration: 68,
      audioKey: 'mars/opportunity_05.mp3',
      place0: 'perseverance',
      marks: [
        { t: 0, label: 'Corte eléctrico' },
        { t: 15, label: 'El legado' },
      ],
      powerCutAt: 8.2,
      cues: [
        { t: 0, text: 'Mis paneles ya no encuentran el Sol.' },
        { t: 5, text: 'Mis ojos… se…' },
        { t: 15, voice: 'narrator', text: 'La Tierra no dejó de llamar: durante ocho meses, los ingenieros enviaron más de mil comandos.' },
        { t: 22, voice: 'narrator', text: 'El 13 de febrero de 2019, la NASA dio la misión por terminada.' },
        {
          t: 28,
          voice: 'narrator',
          text: 'Opportunity fue diseñado para noventa soles y mil metros. Trabajó casi quince años y recorrió cuarenta y cinco kilómetros: unas sesenta veces más de lo previsto.',
        },
        {
          t: 39,
          voice: 'narrator',
          text: 'Descansa en Perseverance Valley. «No puedo pensar en un lugar más adecuado para que Opportunity perdure en la superficie de Marte», dijo el director del JPL.',
        },
        {
          t: 50,
          voice: 'narrator',
          text: 'Abrió el camino de Curiosity, y lo que aprendió ayudó a diseñar los rovers que vinieron después.',
        },
        {
          t: 58,
          voice: 'narrator',
          text: 'Los robots abandonados no están olvidados. Se quedan mirando el horizonte, esperando que alguien cuente su historia.',
        },
      ],
      camera: [
        { t: 0, v: 'pov' },
        { t: 9.6, v: 'wide' },
        { t: 28, v: 'part' }, // primer plano lento de sus ojos
        { t: 39, v: 'wide' },
        { t: 50, v: 'part' }, // y de sus ruedas, quietas
        { t: 58, v: 'wide' },
      ],
      partFocus: [
        { t: 0, v: null },
        { t: 28, v: { node: 'mast_head', hotspot: 'none', dist: 2.6, az: 0.9, el: 0.1 } },
        { t: 39, v: null },
        { t: 50, v: { node: 'wheel_RM', hotspot: 'none', dist: 3.2, az: 1.1, el: 0.12 } },
        { t: 58, v: null },
      ],
      scene: [{ t: 0, v: 'surface' }],
      staticLevel: [
        { t: 0, v: 0.7 },
        { t: 5, v: 0.85 },
        { t: 8.2, v: 1 },
        { t: 9.4, v: 0 },
        { t: 68, v: 0 },
      ],
      powerOff: [
        { t: 0, v: 0 },
        { t: 8.2, v: 0 },
        { t: 9.4, v: 1 },
        { t: 13.5, v: 1 },
        { t: 16.5, v: 0 },
      ],
      dust: [
        { t: 0, v: 1 },
        { t: 16, v: 1 },
        { t: 50, v: 0.3 },
        { t: 68, v: 0.3 },
      ],
      battery: [{ t: 0, v: 0.03 }, { t: 8.2, v: 0 }],
      signal: [{ t: 0, v: 0.3 }, { t: 8.2, v: 0 }],
      clips: [{ t: 0, v: 'Death' }],
      expressions: [
        { t: 0, v: 'Sad' },
        { t: 8.2, v: 'Sleep' },
      ],
      hud: [
        { t: 0, v: { sol: '5 111', date: '10 JUN 2018', place: 'PERSEVERANCE VALLEY', temp: '−29 °C' } },
        { t: 9.4, v: { date: '', place: '', hidden: true } },
      ],
      sfx: [
        { t: 8.0, v: 'powerdown' },
        { t: 9.3, v: 'relay' },
      ],
      cards: [
        { at: 9.8, dur: 5, kind: 'note', text: 'SEÑAL PERDIDA · 10 JUN 2018' },
        {
          at: 39,
          dur: 10,
          kind: 'quote',
          text: '“I cannot think of a more appropriate place for Opportunity to endure on the surface of Mars.”',
          author: 'Michael Watkins, director del JPL',
          source: 'NASA, 13 feb 2019',
        },
      ],
    },
  ],

  // -------------------------------------------------------------------------
  // MODO EXPLORAR · escenario, acciones y tarjetas "¿Qué pasaría si…?" (siempre HIPOTÉTICAS)
  // -------------------------------------------------------------------------
  explore: {
    place: 'eagle', // cráter Eagle: el primer lugar de Oppy, con el rover entero a la vista
    drive: { kind: 'wheels', maxSpeed: 3.2, label: 'Explorar la zona con Oppy' },
    actions: [
      { id: 'wake', label: 'Despertar', hint: 'Despliega paneles y levanta el mástil', clip: 'Wake', duration: 3, focus: 'pancam' },
      { id: 'drive', label: 'Rodar', hint: 'Giran sus seis ruedas', clip: 'Drive', duration: 6 },
      { id: 'arm', label: 'Extender el brazo', hint: 'Mueve el brazo con sus instrumentos', motion: 'opportunity-arm', duration: 6 },
      { id: 'look', label: 'Mirar alrededor', hint: 'Gira la cabeza del mástil con la Pancam', motion: 'opportunity-look', duration: 7, focus: 'pancam' },
    ],
  },
  whatIfs: [
    {
      id: 'tormenta',
      question: 'la tormenta de polvo de 2018 no hubiera tapado el Sol',
      imagine:
        'Con el cielo despejado, los paneles seguirían recibiendo luz cada mañana y la batería se recargaría. Oppy terminaría su panorama completo y seguiría bajando por Perseverance Valley; quizá otro golpe de viento limpiaría los paneles, como tantas veces antes.',
      reality:
        'En 2018 una tormenta de polvo cubrió Marte. El 10 de junio el rover envió su último paquete de datos, con el cielo muy oscuro y unos −29 °C; el Sol casi no llegó a sus paneles durante unos cuatro meses.',
      science:
        'Opportunity no tenía motor nuclear: vivía de la luz solar. El JPL estimó una opacidad (tau) de 10,8 el 10 de junio, es decir, casi nada de Sol llegaba al suelo. Por eso un rover diseñado para 90 días resistió casi quince años… hasta una noche de polvo.',
      sources: [
        {
          label: 'JPL — Opportunity Hunkers Down During Dust Storm',
          url: 'https://www.jpl.nasa.gov/news/opportunity-hunkers-down-during-dust-storm/',
        },
      ],
      focus: 'panels',
    },
  ],

  transparency: {
    title: '¿Dijo Opportunity “mi batería está baja y se hace de noche”?',
    body: 'No con esas palabras. Lo último que recibió la Tierra, el 10 de junio de 2018, fue un paquete de datos: poca energía, unos 29 grados bajo cero y una noche oscura y perpetua sobre su ubicación. La frase famosa es una traducción poética de un periodista, escrita en 2019. En esta historia, Oppy cuenta lo que mostraban los datos con sus propias palabras.',
    sources: [
      {
        label: 'JPL · Opportunity Hunkers Down During Dust Storm',
        url: 'https://www.jpl.nasa.gov/news/opportunity-hunkers-down-during-dust-storm/',
      },
      {
        label: 'NASA · Fin de la misión de Opportunity (13-feb-2019)',
        url: 'https://www.nasa.gov/news-release/nasas-record-setting-opportunity-rover-mission-on-mars-comes-to-end',
      },
    ],
  },
}
