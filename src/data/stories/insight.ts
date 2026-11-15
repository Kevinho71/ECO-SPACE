import type { PartFocus, Story } from '../story'

// Historia de InSight — transcripción de HISTORIA_INSIGHT.md, con cambios de escena, alternancia 1.ª ↔ 3.ª persona
// y presentación inicial de sus piezas. Datos con fuentes NASA/JPL (ver §2 y §11 del documento).
// Voces pendientes: solo subtítulos.
//
// Vistas: 'pov' = 1.ª persona (cámara del mástil) · 'wide' / 'part' = 3.ª persona.
// Cada cambio de vista grande va dentro de un parpadeo (jump a t, el lugar cambia en t+0,3).
// InSight no se mueve: su aventura es escuchar. El "deterioro" (`damage`) es el polvo sobre sus paneles.

const ELY = 'ELYSIUM PLANITIA'

const focus = (node: string, hotspot: string, dist: number, az: number, el: number): PartFocus => ({ node, hotspot, dist, az, el })

export const insightStory: Story = {
  missionId: 'insight',
  texts: { exploreLabel: 'Explorar a InSight', exploreHint: 'Arrastra para girar alrededor de InSight · pulsa los puntos brillantes o usa los botones para moverlo' },
  intro: {
    kicker: 'Módulo de aterrizaje geofísico · Marte',
    name: 'InSight',
    blurb:
      'Vas a vivir su historia desde dentro: sus ojos serán los tuyos. A ratos la cámara se aleja para que lo veas desde fuera. No se mueve: su aventura es escuchar. Mira alrededor arrastrando.',
    button: 'Despertar a InSight',
    short: 'InSight',
  },
  chapters: [
    // -----------------------------------------------------------------------
    // 1 · EL DESPERTAR — 1.ª persona, presentación de sus piezas en 3.ª, de vuelta a 1.ª
    // -----------------------------------------------------------------------
    {
      id: 'despertar',
      title: 'Capítulo 1 · El despertar',
      subtitle: '26 de noviembre de 2018 · Elysium Planitia, Marte',
      duration: 88,
      audioKey: 'mars/insight_01.mp3',
      place0: 'elysium',
      jumps: [{ t: 15.6, to: 'elysium' }], // parpadeo: de mirar a verme desde fuera
      marks: [
        { t: 0, label: 'Contacto' },
        { t: 21.5, label: 'Mis piezas' },
        { t: 64.5, label: 'Mi misión' },
      ],
      cues: [
        { t: 0, text: 'Contacto. Paneles… abriéndose.' },
        { t: 6, text: 'Una llanura enorme y plana. Casi sin piedras.' },
        { t: 11, text: 'Soy InSight. No tengo ruedas: no vine a viajar. Vine a escuchar.' },
        { t: 18, text: 'Déjame enseñarte cómo soy.' },
        { t: 22, text: 'Este es mi brazo, de casi dos metros. Con él coloco mis instrumentos sobre el suelo.' },
        { t: 29, text: 'Estos son mis paneles solares, redondos como abanicos: dos metros doscientos de diámetro cada uno. Sin Sol, no tengo energía.' },
        { t: 36, text: 'Y este es mi oído: un sismómetro. Con él escucho temblar a Marte.' },
        { t: 44, text: 'Este es el topo: una sonda de calor que debe martillar el suelo y hundirse cinco metros.' },
        { t: 51, text: 'Mis ojos: una cámara en lo alto de un mástil.' },
        { t: 58, text: 'Y esta antena me permite hablar con la Tierra.' },
        { t: 65, text: 'Estoy en Elysium Planitia, en Marte. Elegimos este lugar porque es plano y tranquilo.' },
        { t: 72, text: 'Mi misión: descubrir cómo es Marte por dentro. Su corteza, su manto, su corazón.' },
        { t: 80, text: 'Pero primero… déjame recordar cómo llegué.' },
      ],
      camera: [
        { t: 0, v: 'pov' },
        { t: 15.9, v: 'wide' },
        { t: 21.5, v: 'part' },
        { t: 64.5, v: 'pov' },
      ],
      partFocus: [
        { t: 0, v: null },
        { t: 21.5, v: focus('arm', 'arm', 3.2, -0.9, 0.3) },
        { t: 28.5, v: focus('panel_L', 'panels', 5.2, 1.4, 0.35) },
        { t: 35.5, v: focus('seis_dome', 'seis', 2.8, 2.4, 0.5) },
        { t: 43.5, v: focus('hp3_mole', 'mole', 2.5, 1.1, 0.4) },
        { t: 50.5, v: focus('mast_head', 'camera', 2.3, 0.6, 0.12) },
        { t: 57.5, v: focus('antenna', 'antenna', 2.5, 2.5, 0.25) },
        { t: 64.5, v: null },
      ],
      pan: [
        { t: 0, v: 0 },
        { t: 5, v: 0.5 },
        { t: 12, v: -0.4 },
        { t: 15, v: 0 },
        { t: 64.5, v: 0 },
        { t: 72, v: 0.5 },
        { t: 80, v: 0 },
      ],
      scene: [{ t: 0, v: 'surface' }],
      staticLevel: [
        { t: 0, v: 0.9 },
        { t: 4, v: 0.5 },
        { t: 9, v: 0.12 },
        { t: 18, v: 0.05 },
        { t: 78, v: 0.1 },
        { t: 83, v: 0.5 },
        { t: 88, v: 1 },
      ],
      battery: [{ t: 0, v: 1 }],
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
        { t: 0, v: { sol: '000', date: '26 NOV 2018', place: ELY } },
        { t: 21.5, v: { sol: '000', date: '26 NOV 2018', place: ELY, phase: 'MIS PIEZAS' } },
        { t: 64.5, v: { sol: '000', date: '26 NOV 2018', place: ELY } },
      ],
      sfx: [{ t: 0, v: 'boot' }],
    },

    // -----------------------------------------------------------------------
    // 2 · EL VIAJE (registro de vuelo, 3.ª persona) → contacto → 1.ª persona
    // Las etapas del espacio comparten línea de tiempo con `FT` (flightPath.ts): no mover sin cambiar FT.
    // -----------------------------------------------------------------------
    {
      id: 'viaje',
      title: 'Capítulo 2 · El viaje',
      subtitle: 'Registro de vuelo · mayo → noviembre de 2018',
      duration: 70,
      audioKey: 'mars/insight_02.mp3',
      place0: 'launch',
      jumps: [
        { t: 22.5, to: 'cruise' },
        { t: 29.9, to: 'cruise' },
        { t: 37.5, to: 'entry' },
        { t: 48.5, to: 'elysium' }, // contacto: ya estoy en el suelo
        { t: 59.7, to: 'elysium' }, // abro los ojos dentro de mí
      ],
      marks: [
        { t: 0, label: 'Lanzamiento' },
        { t: 23, label: 'Crucero' },
        { t: 38, label: 'Entrada' },
        { t: 49, label: 'Contacto' },
      ],
      robot: [
        { t: 0, v: false },
        { t: 48.8, v: true },
      ],
      cues: [
        { t: 0, text: 'Reproduciendo mi registro de vuelo.' },
        { t: 5, text: 'Cinco de mayo de 2018, de madrugada en California. Un cohete Atlas V me lanza desde la costa del Pacífico.' },
        { t: 14, text: 'No viajo sin compañía: detrás de mí van dos satélites diminutos, del tamaño de un maletín. Se llaman MarCO.' },
        { t: 23, text: 'Seis meses y medio después, llego a Marte.' },
        { t: 31, text: 'Ellos van a contarle a la Tierra, en directo, cómo aterrizo.' },
        { t: 38, text: 'Veintiséis de noviembre. Entro en la atmósfera. Mi escudo arde.' },
        { t: 44, text: 'Se abre un paracaídas y, al final, mis cohetes me frenan.' },
        { t: 49.5, text: 'Contacto. En la Tierra reciben la señal.' },
        { t: 54, text: 'Abro mis paneles. Tengo energía.' },
        { t: 60.5, text: 'Estoy en casa.' },
      ],
      camera: [
        { t: 0, v: 'flight' },
        { t: 48.8, v: 'wide' },
        { t: 53.5, v: 'part' },
        { t: 60, v: 'pov' },
      ],
      partFocus: [
        { t: 0, v: null },
        { t: 53.5, v: focus('panel_L', 'panels', 5.2, 1.4, 0.35) },
        { t: 60, v: null },
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
        { t: 50, v: 0.12 },
        { t: 59.5, v: 0.2 },
        { t: 60, v: 0.6 },
        { t: 63, v: 0.1 },
        { t: 70, v: 0.1 },
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
        { t: 60, v: 1 },
      ],
      clips: [
        { t: 0, v: 'Idle' },
        { t: 49, v: 'Wake' },
        { t: 53, v: 'Idle' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 38, v: 'Surprised' },
        { t: 56, v: null },
      ],
      hud: [
        { t: 0, v: { date: 'MAY 2018', place: 'REGISTRO DE VUELO', phase: 'PREPARANDO LANZAMIENTO' } },
        { t: 5, v: { date: '5 MAY 2018', place: 'BASE DE VANDENBERG · CALIFORNIA', phase: 'LANZAMIENTO · ATLAS V' } },
        { t: 23, v: { date: '2018', place: 'ESPACIO ENTRE LA TIERRA Y MARTE', phase: 'CRUCERO · CON LOS MarCO' } },
        { t: 38, v: { date: '26 NOV 2018', place: 'ATMÓSFERA DE MARTE', phase: 'ENTRADA' } },
        { t: 49, v: { sol: '000', date: '26 NOV 2018', place: ELY, phase: 'CONTACTO' } },
        { t: 54, v: { sol: '000', date: '26 NOV 2018', place: ELY, phase: 'PANELES ABIERTOS' } },
        { t: 60, v: { sol: '000', date: '26 NOV 2018', place: ELY } },
      ],
      sfx: [
        { t: 5, v: 'rumble' },
        { t: 38, v: 'rumble' },
        { t: 49, v: 'thud' },
        { t: 54, v: 'unfold' },
      ],
    },

    // -----------------------------------------------------------------------
    // 3 · LA MISIÓN — 3A el oído en el suelo · 3B el topo que no pudo · 3C el corazón de Marte
    // -----------------------------------------------------------------------
    {
      id: 'mision',
      title: 'Capítulo 3 · La misión',
      subtitle: '2018 → 2022 · Escuchando a Marte',
      duration: 128,
      audioKey: 'mars/insight_03.mp3',
      place0: 'elysium',
      jumps: [
        { t: 13.7, to: 'elysium' }, // del brazo a mis ojos
        { t: 33.6, to: 'elysium' }, // 3B
        { t: 48.6, to: 'elysium' }, // el suelo apelmazado, mirando abajo
        { t: 83.6, to: 'elysium' }, // 3C
      ],
      marks: [
        { t: 0, label: '3A · El oído en el suelo' },
        { t: 33.5, label: '3B · El topo que no pudo' },
        { t: 83.5, label: '3C · El corazón de Marte' },
      ],
      cues: [
        { t: 0, text: 'Con mi brazo levanto con cuidado mi instrumento más importante: un sismómetro.' },
        { t: 7, text: 'Lo pongo en el suelo y lo cubro con una cúpula, para que el viento no lo moleste.' },
        { t: 14.5, text: 'Ahora escucho. Día y noche.' },
        { t: 18, text: '¿Lo oyes? Es un martemoto. Marte tiembla.' },
        { t: 25, text: 'Cada temblor viaja por dentro del planeta y me trae noticias de lo que atraviesa.' },
        { t: 34, text: 'Mi otro instrumento es un «topo»: una sonda que debía martillar el suelo y hundirse cinco metros para medir el calor de Marte.' },
        { t: 44, text: 'Martillea. Y martillea. Pero no baja.' },
        { t: 49, text: 'El suelo aquí se apelmaza: no le da al topo el agarre que necesita.' },
        { t: 55, text: 'Mi equipo lo intenta todo durante casi dos años. Hasta lo empujo con mi pala.' },
        { t: 62, text: 'En enero de 2021, tras quinientos golpes más, se rinden.' },
        { t: 68, text: 'Uno de ellos lo dice así: «Lo dimos todo, pero Marte y nuestro heroico topo siguen siendo incompatibles».' },
        { t: 77, text: 'A veces la ciencia también es esto: aprender de lo que no sale.' },
        { t: 84.5, text: 'Cuatro de mayo de 2022. El temblor más grande que nadie ha sentido jamás en otro planeta: magnitud cinco.' },
        { t: 94, text: 'En total escucho mil trescientos diecinueve martemotos.' },
        { t: 99, text: 'Con ellos, los científicos dibujan el interior de Marte.' },
        { t: 104, text: 'Su corteza es más delgada de lo que pensaban. Su manto, más frío que el de la Tierra.' },
        { t: 112, text: 'Y su corazón, el núcleo, es líquido y más grande de lo esperado: mil ochocientos treinta kilómetros de radio.' },
        { t: 121, text: 'Solo con escuchar, el interior de otro planeta deja de ser un misterio.' },
      ],
      camera: [
        { t: 0, v: 'part' },
        { t: 14, v: 'pov' },
        { t: 27, v: 'wide' },
        { t: 33.9, v: 'part' },
        { t: 48.9, v: 'pov' },
        { t: 55, v: 'part' },
        { t: 62, v: 'wide' },
        { t: 83.9, v: 'pov' },
        { t: 94, v: 'wide' },
        { t: 112, v: 'part' },
        { t: 122, v: 'wide' },
      ],
      partFocus: [
        { t: 0, v: focus('arm', 'arm', 3.2, -0.9, 0.3) },
        { t: 14, v: null },
        { t: 33.9, v: focus('hp3_mole', 'mole', 2.5, 1.1, 0.4) },
        { t: 48.9, v: null },
        { t: 55, v: focus('arm', 'arm', 3.4, -1.1, 0.35) },
        { t: 62, v: null },
        { t: 112, v: focus('seis_dome', 'seis', 2.8, 2.4, 0.5) },
        { t: 122, v: null },
      ],
      // Mirada del POV: hacia atrás (el sismómetro) en 3A, hacia el suelo delante en 3B.
      pan: [
        { t: 0, v: 0 },
        { t: 14, v: 2.5 },
        { t: 26, v: 2.5 },
        { t: 27, v: 0 },
        { t: 83.9, v: 0 },
      ],
      gaze: [
        { t: 0, v: 0.1 },
        { t: 48.9, v: 0.1 },
        { t: 49.5, v: -0.3 },
        { t: 54.9, v: -0.3 },
        { t: 55, v: 0.1 },
      ],
      scene: [{ t: 0, v: 'surface' }],
      staticLevel: [
        { t: 0, v: 0.05 },
        { t: 84, v: 0.05 },
        { t: 85, v: 0.3 },
        { t: 90, v: 0.3 },
        { t: 93, v: 0.05 },
        { t: 128, v: 0.05 },
      ],
      // Los martemotos se sienten como vibración de cámara (solo en 1.ª persona).
      shake: [
        { t: 0, v: 0 },
        { t: 17.9, v: 0 },
        { t: 19, v: 0.25 },
        { t: 22, v: 0.25 },
        { t: 24, v: 0 },
        { t: 84.5, v: 0 },
        { t: 85.5, v: 0.8 },
        { t: 90, v: 0.6 },
        { t: 93.5, v: 0 },
      ],
      battery: [{ t: 0, v: 0.95 }],
      signal: [{ t: 0, v: 1 }],
      clips: [
        { t: 0, v: 'Dig' },
        { t: 12, v: 'Idle' },
        { t: 55, v: 'Dig' },
        { t: 62, v: 'Idle' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 44, v: 'Sad' },
        { t: 52, v: null },
        { t: 84.5, v: 'Surprised' },
        { t: 94, v: null },
      ],
      hud: [
        { t: 0, v: { sol: '000+', date: '2018 → 2022', place: ELY, phase: 'SISMÓMETRO · SEIS' } },
        { t: 33.9, v: { date: '2019 → 2021', place: ELY, phase: 'EL TOPO · HP³' } },
        { t: 62, v: { date: '14 ENE 2021', place: ELY, phase: 'FIN DEL INTENTO' } },
        { t: 83.9, v: { sol: '1 222', date: '4 MAY 2022', place: ELY, phase: 'SISMO · MAGNITUD ~5' } },
        { t: 94, v: { date: '2018 → 2022', place: ELY, phase: '1 319 MARTEMOTOS' } },
      ],
      sfx: [
        { t: 18, v: 'quake' },
        { t: 44, v: 'hammer' },
        { t: 85, v: 'quake' },
      ],
      cards: [
        { at: 62.5, dur: 5, kind: 'note', text: 'FIN DEL INTENTO DEL TOPO · 14 ENE 2021' },
        {
          at: 68,
          dur: 9,
          kind: 'quote',
          text: '“We’ve given it everything we’ve got, but Mars and our heroic mole remain incompatible.”',
          author: 'Tilman Spohn, investigador principal del HP³',
          source: 'JPL, 14 ene 2021',
        },
        { at: 104, dur: 7, kind: 'note', text: 'CORTEZA · CAPA SUPERIOR ~10 km · CAPAS MÁS DENSAS HASTA ~40 km' },
        { at: 112, dur: 8, kind: 'note', text: 'NÚCLEO LÍQUIDO · RADIO 1 830 km · MANTO HASTA 1 560 km DE PROFUNDIDAD' },
      ],
    },

    // -----------------------------------------------------------------------
    // 4 · EL FINAL — el polvo cubre los paneles, poco a poco
    // -----------------------------------------------------------------------
    {
      id: 'final',
      title: 'Capítulo 4 · El final',
      subtitle: '2022 · La luz se apaga poco a poco',
      duration: 60,
      audioKey: 'mars/insight_04.mp3',
      place0: 'elysium',
      jumps: [
        { t: 7.6, to: 'elysium' },
        { t: 17.6, to: 'elysium' },
        { t: 22.6, to: 'elysium' }, // el selfie
        { t: 43.6, to: 'elysium' },
      ],
      cues: [
        { t: 0, text: 'Marte es un planeta de polvo. Y el polvo cae sobre mis paneles, poco a poco.' },
        { t: 8, text: 'Mi equipo inventa un truco: echo tierra con mi pala sobre los paneles en días de viento, para que el viento barra el polvo.' },
        { t: 18, text: 'Ayuda un poco. Pero cada día tengo menos energía.' },
        { t: 23, text: 'Abril de 2022: me hago mi último selfie. Mis paneles ya están naranjas de polvo.' },
        { t: 31, text: 'A finales de año produzco menos de una quinta parte de la energía con la que llegué.' },
        { t: 38, text: 'Apago casi todo. Solo dejo despierto mi oído: el sismómetro.' },
        { t: 44, text: 'Once de diciembre. Saco una de mis últimas fotos: mi sismómetro, quieto en el suelo.' },
        { t: 52, text: 'Quince de diciembre de 2022. Envío un mensaje a la Tierra.' },
      ],
      camera: [
        { t: 0, v: 'part' },
        { t: 7.9, v: 'wide' },
        { t: 17.9, v: 'pov' },
        { t: 22.9, v: 'wide' },
        { t: 38, v: 'part' },
        { t: 43.9, v: 'pov' },
        { t: 52, v: 'part' },
      ],
      partFocus: [
        { t: 0, v: focus('panel_L', 'panels', 5.2, 1.4, 0.35) },
        { t: 7.9, v: null },
        { t: 38, v: focus('seis_dome', 'seis', 2.8, 2.4, 0.5) },
        { t: 43.9, v: null },
        { t: 52, v: focus('antenna', 'antenna', 2.5, 2.5, 0.25) },
      ],
      pan: [
        { t: 0, v: 0 },
        { t: 43.9, v: 2.5 },
        { t: 52, v: 2.5 },
      ],
      gaze: [{ t: 0, v: 0.1 }],
      // Polvo sobre los paneles: de limpios a naranjas.
      damage: [
        { t: 0, v: 0.1 },
        { t: 18, v: 0.45 },
        { t: 23, v: 0.65 },
        { t: 31, v: 0.85 },
        { t: 38, v: 1 },
      ],
      scene: [{ t: 0, v: 'surface' }],
      staticLevel: [
        { t: 0, v: 0.1 },
        { t: 20, v: 0.15 },
        { t: 31, v: 0.3 },
        { t: 44, v: 0.5 },
        { t: 52, v: 0.7 },
        { t: 60, v: 0.7 },
      ],
      battery: [
        { t: 0, v: 0.7 },
        { t: 18, v: 0.5 },
        { t: 31, v: 0.2 },
        { t: 38, v: 0.08 },
        { t: 52, v: 0.04 },
      ],
      signal: [
        { t: 0, v: 1 },
        { t: 38, v: 0.6 },
        { t: 52, v: 0.3 },
      ],
      clips: [
        { t: 0, v: 'Idle' },
        { t: 8, v: 'Dig' },
        { t: 17.9, v: 'Idle' },
      ],
      expressions: [
        { t: 0, v: null },
        { t: 31, v: 'Sad' },
      ],
      hud: [
        { t: 0, v: { sol: '1 100+', date: '2022', place: ELY, phase: 'POLVO SOBRE LOS PANELES' } },
        { t: 22.9, v: { sol: '1 211', date: '24 ABR 2022', place: ELY, phase: 'ÚLTIMO SELFIE' } },
        { t: 31, v: { date: 'FINALES DE 2022', place: ELY, phase: 'PANELES: <20 % DE SU CAPACIDAD' } },
        { t: 43.9, v: { sol: '1 436', date: '11 DIC 2022', place: ELY, phase: 'UNA DE MIS ÚLTIMAS FOTOS' } },
        { t: 52, v: { date: '15 DIC 2022', place: ELY, phase: 'ÚLTIMA COMUNICACIÓN' } },
      ],
      sfx: [
        { t: 22.7, v: 'blink' },
        { t: 52.5, v: 'relay' },
      ],
    },

    // -----------------------------------------------------------------------
    // 5 · EL CORTE Y EL LEGADO (~60 s)
    // -----------------------------------------------------------------------
    {
      id: 'legado',
      title: 'Capítulo 5 · El corte y el legado',
      subtitle: '15 de diciembre de 2022 → hoy',
      duration: 60,
      audioKey: 'mars/insight_05.mp3',
      place0: 'elysium',
      marks: [
        { t: 0, label: 'Corte' },
        { t: 12, label: 'El legado' },
      ],
      powerCutAt: 6.2,
      cues: [
        { t: 0, text: 'Sigo escuchando…' },
        { t: 3.5, text: '…pero ya casi no…' },
        { t: 12, voice: 'narrator', text: 'La Tierra volvió a llamar. InSight no respondió.' },
        { t: 17, voice: 'narrator', text: 'El 21 de diciembre de 2022, la NASA dio por terminada la misión.' },
        { t: 23, voice: 'narrator', text: 'Había venido para unos dos años. Trabajó más de cuatro.' },
        {
          t: 29,
          voice: 'narrator',
          text: 'Escuchó mil trescientos diecinueve martemotos, y gracias a ellos hoy sabemos que Marte tiene un núcleo líquido.',
        },
        { t: 39, voice: 'narrator', text: 'Sus datos se seguirán estudiando durante años.' },
        { t: 44, voice: 'narrator', text: 'InSight sigue en Elysium Planitia, con su oído apoyado en el suelo.' },
        { t: 51, voice: 'narrator', text: 'Los robots abandonados no están olvidados.' },
      ],
      camera: [
        { t: 0, v: 'pov' },
        { t: 11.9, v: 'wide' },
        { t: 23, v: 'part' },
        { t: 29, v: 'wide' },
        { t: 44, v: 'part' },
        { t: 51, v: 'wide' },
      ],
      partFocus: [
        { t: 0, v: null },
        { t: 23, v: focus('panel_L', 'panels', 5.2, 1.4, 0.35) },
        { t: 29, v: null },
        { t: 44, v: focus('seis_dome', 'seis', 2.8, 2.4, 0.5) },
        { t: 51, v: null },
      ],
      pan: [{ t: 0, v: 2.5 }],
      gaze: [{ t: 0, v: 0.1 }],
      damage: [{ t: 0, v: 1 }],
      scene: [{ t: 0, v: 'surface' }],
      staticLevel: [
        { t: 0, v: 0.7 },
        { t: 3.5, v: 0.85 },
        { t: 6.2, v: 1 },
        { t: 7.5, v: 1 },
        { t: 11.9, v: 0 },
      ],
      powerOff: [
        { t: 0, v: 0 },
        { t: 6.2, v: 0 },
        { t: 7.4, v: 1 },
        { t: 12.5, v: 1 },
        { t: 15.5, v: 0 },
      ],
      battery: [{ t: 0, v: 0.04 }, { t: 6.2, v: 0 }],
      signal: [{ t: 0, v: 0.3 }, { t: 6.2, v: 0 }],
      clips: [{ t: 0, v: 'Death' }],
      expressions: [
        { t: 0, v: 'Sad' },
        { t: 6.2, v: 'Sleep' },
      ],
      hud: [
        { t: 0, v: { date: '15 DIC 2022', place: ELY, phase: 'ÚLTIMA COMUNICACIÓN' } },
        { t: 7.4, v: { date: '', place: '', hidden: true } },
      ],
      sfx: [
        { t: 6.0, v: 'powerdown' },
        { t: 7.3, v: 'relay' },
      ],
      cards: [{ at: 8, dur: 4, kind: 'note', text: 'ÚLTIMA COMUNICACIÓN · 15 DIC 2022' }],
    },
  ],

  // Modo Explorar: escenario base y acciones del robot (clips del GLB).
  explore: {
    place: 'elysium',
    actions: [
      { id: 'wake', label: 'Desplegar paneles', hint: 'Los paneles se abren y el mástil se levanta', clip: 'Wake', duration: 3, focus: 'panels' },
      { id: 'dig', label: 'Mover el brazo', hint: 'El brazo se extiende hacia el suelo', clip: 'Dig', duration: 5, focus: 'arm' },
      { id: 'mole', label: 'Hacer trabajar al topo', hint: 'El topo martillea y se hunde unos centímetros', motion: 'insight-mole', duration: 6, focus: 'mole' },
    ],
  },

  whatIfs: [
    {
      id: 'topo',
      question: 'el topo (HP³) hubiera logrado excavar',
      imagine:
        'Con el agarre necesario, el topo habría ido martilleando hasta unos cinco metros de profundidad y habría medido cuánto calor sale del interior de Marte.',
      reality:
        'El suelo se apelmazaba y no le daba la fricción que necesitaba. El topo quedó apenas bajo la superficie; su último intento fue de 500 golpes el 9 de enero de 2021 y el fin se anunció el 14 de enero.',
      science:
        'Un topo que avanza a golpes solo funciona si el suelo le da fricción. Tilman Spohn, investigador principal del HP³, lo resumió: “We’ve given it everything we’ve got, but Mars and our heroic mole remain incompatible” (“Lo dimos todo, pero Marte y nuestro heroico topo siguen siendo incompatibles”).',
      sources: [
        { label: 'JPL — NASA InSight’s “Mole” Ends Its Journey on Mars', url: 'https://www.jpl.nasa.gov/news/nasa-insights-mole-ends-its-journey-on-mars/' },
        { label: 'JPL — NASA Retires InSight Mars Lander Mission', url: 'https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science/' },
      ],
      focus: 'mole',
      action: 'mole',
    },
  ],

  transparency: {
    title: '¿Escribió InSight «mi energía está muy baja, puede que esta sea la última imagen que envíe»?',
    body: 'No. Esa frase la escribió el equipo de la misión en sus redes sociales, hablando como si fuera el robot. Lo que InSight sí envió fueron datos y fotos, hasta su última comunicación, el 15 de diciembre de 2022. En esta historia, InSight cuenta lo que pasó con sus propias palabras.',
    sources: [
      {
        label: 'JPL · La NASA retira la misión InSight (21-dic-2022)',
        url: 'https://www.jpl.nasa.gov/news/nasa-retires-insight-mars-lander-mission-after-years-of-science/',
      },
      {
        label: 'NASA · Despedida de InSight',
        url: 'https://www.nasa.gov/image-article/saying-farewell-insight-mars-lander/',
      },
    ],
  },
}
