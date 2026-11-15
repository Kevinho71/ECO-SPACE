// Partes clicables (modo Inspección) por misión. `node` es el nombre del nodo en el GLB.
// Datos verificados: HISTORIA_OPPORTUNITY.md §5 (NASA/NSSDC).

export interface Hotspot {
  id: string
  node: string
  title: string
  fact: string
  explain: string
  /** Desplazamiento local respecto al nodo, en metros. */
  offset?: [number, number, number]
}

export const HOTSPOTS: Record<string, Hotspot[]> = {
  opportunity: [
    {
      id: 'pancam',
      node: 'mast_head',
      title: 'Pancam · mis ojos',
      fact: 'Cámaras a ~1,4 m del suelo',
      explain:
        'Dos cámaras en lo alto del mástil toman fotos panorámicas. El mismo mástil sirve de periscopio al Mini-TES, un instrumento que mide el calor de las rocas.',
      offset: [0, 0.2, 0],
    },
    {
      id: 'arm',
      node: 'arm',
      title: 'Brazo con instrumentos',
      fact: 'Microscopio, espectrómetros y raspador',
      explain:
        'En la punta del brazo van el Microscopic Imager, el espectrómetro Mössbauer, el APXS y la herramienta RAT, que raspa las rocas para ver por dentro.',
      offset: [0.62, -0.18, -0.08],
    },
    {
      id: 'panels',
      node: 'panel_L',
      title: 'Paneles solares',
      fact: 'Hasta 140 W con pleno Sol',
      explain:
        'Oppy no tiene combustible: vive del Sol. El viento limpió el polvo de sus paneles varias veces, y una tormenta de polvo global fue lo que, al final, le quitó la luz.',
      offset: [0, 0.12, -0.5],
    },
    {
      id: 'wheel-rf',
      node: 'wheel_RF',
      title: 'Rueda delantera derecha',
      fact: 'Gastaba más energía de la cuenta',
      explain:
        'Esta rueda consumía corriente extra. Para alargar su vida, a veces el rover avanzaba de reversa. Son seis ruedas con suspensión rocker-bogie y una velocidad máxima de 3,75 cm/s.',
      offset: [0, 0.2, 0],
    },
    {
      id: 'wheels',
      node: 'wheel_RM',
      title: 'Seis ruedas',
      fact: 'Suspensión rocker-bogie · 3,75 cm/s máx.',
      explain:
        'Seis ruedas con una suspensión que se adapta al terreno: sube rocas y baja pendientes sin volcar. Su velocidad máxima es de solo 3,75 centímetros por segundo.',
      offset: [0, 0.35, 0],
    },
    {
      id: 'antenna',
      node: 'antenna',
      title: 'Antenas',
      fact: 'Comunicación con la Tierra y los orbitadores',
      explain:
        'Habla con la Tierra por banda X y con los orbitadores en Marte por UHF. Gracias a esos orbitadores, la NASA recibía sus datos.',
      offset: [0, 0.55, 0],
    },
  ],
  ingenuity: [
    {
      id: 'rotors',
      node: 'rotor_top',
      title: 'Dos rotores',
      fact: '~1,2 m de punta a punta',
      explain:
        'Dos rotores, uno sobre otro. El aire de Marte tiene menos del 1 % de la densidad del de la Tierra, así que giran muy rápido para sostener 1,8 kg. En el vuelo 72 las cuatro palas se partieron.',
      offset: [0, 0.12, 0],
    },
    {
      id: 'solar',
      node: 'solar_panel',
      title: 'Panel solar',
      fact: 'Un vuelo de 90 s por día marciano',
      explain: 'Carga las baterías con la luz del Sol: da energía para un vuelo de hasta 90 segundos por día marciano.',
      offset: [0, 0.15, 0],
    },
    {
      id: 'navcam',
      node: 'pov_eye',
      title: 'Cámara de navegación',
      fact: 'Sigue detalles del suelo',
      explain:
        'Mira el suelo para saber cuánto se mueve. En el vuelo 72 sobrevoló ondas de arena sin textura y casi no encontró detalles que seguir.',
      offset: [0.08, 0, 0],
    },
    {
      id: 'legs',
      node: 'leg_3',
      title: 'Cuatro patas',
      fact: '1,8 kg en total',
      explain: 'Cuatro patas ligeras sostienen todo el helicóptero. Se puso de pie sobre ellas el 3 de abril de 2021, ya suelto de Perseverance.',
      offset: [0.1, 0.2, 0.1],
    },
    {
      id: 'antenna',
      node: 'antenna',
      title: 'Antena',
      fact: 'Habla con la Tierra a través de Perseverance',
      explain:
        'Ingenuity no habla directo con la Tierra: sus datos pasan por Perseverance. Según el JPL, a finales de 2024 aún enviaba datos del clima una vez por semana.',
      offset: [0, 0.25, 0],
    },
    {
      id: 'wright',
      node: 'fuselage',
      title: 'Un trozo de historia',
      fact: 'Tela del Wright Flyer, a bordo',
      explain: 'Lleva un pedacito de tela del Wright Flyer, el avión de los hermanos Wright: un vuelo saluda al otro.',
      offset: [0.3, 0, 0],
    },
  ],
  insight: [
    {
      id: 'arm',
      node: 'arm',
      title: 'Brazo robótico',
      fact: '1,8 m de largo',
      explain: 'Colocó los instrumentos sobre el suelo y, con su pala, empujó el topo y echó tierra sobre los paneles para que el viento limpiara el polvo.',
      offset: [0.5, 0, 0],
    },
    {
      id: 'panels',
      node: 'panel_L',
      title: 'Paneles solares',
      fact: '2,2 m de diámetro cada uno',
      explain: 'El polvo los fue cubriendo: a finales de 2022 producían menos del 20 % de su capacidad original.',
      offset: [0, 0.1, 0.9],
    },
    {
      id: 'seis',
      node: 'seis_dome',
      title: 'Sismómetro SEIS',
      fact: '1 319 martemotos',
      explain: 'Su oído: de origen francés (CNES), escuchó 1 319 martemotos. El mayor, de magnitud ~5, fue el 4 de mayo de 2022.',
      offset: [0, 0.25, 0],
    },
    {
      id: 'mole',
      node: 'hp3_mole',
      title: 'El topo (HP³)',
      fact: 'Debía bajar 5 m',
      explain: 'Sonda de calor alemana (DLR). El suelo se apelmazaba y no le daba agarre: quedó justo bajo la superficie. La NASA dio por terminado el intento el 14 de enero de 2021.',
      offset: [0, 0.2, 0],
    },
    {
      id: 'camera',
      node: 'mast_head',
      title: 'Cámara del mástil',
      fact: 'Selfie final: 24 abr 2022',
      explain: 'Sus ojos en lo alto del mástil. Con sus cámaras tomó su último selfie, ya con los paneles anaranjados de polvo.',
      offset: [0, 0.2, 0],
    },
    {
      id: 'antenna',
      node: 'antenna',
      title: 'Antena',
      fact: 'Último mensaje: 15 dic 2022',
      explain: 'Por aquí hablaba con la Tierra. Su última comunicación fue el 15 de diciembre de 2022; el 21, la NASA dio por terminada la misión.',
      offset: [0, 0.3, 0],
    },
  ],
  pathfinder: [
    {
      id: 'petals',
      node: 'petal_2',
      title: 'Pétalos',
      fact: 'Se abren como una flor',
      explain: 'Los tres pétalos del módulo se abrieron como una flor de metal. Llevan paneles solares.',
      offset: [0.3, 0.1, 0],
    },
    {
      id: 'mast',
      node: 'mast_head',
      title: 'Mástil con cámara',
      fact: 'Más de 16 500 imágenes',
      explain: 'Los ojos de la estación Carl Sagan: envió más de 16 500 imágenes de Ares Vallis.',
      offset: [0, 0.15, 0],
    },
    {
      id: 'antenna',
      node: 'antenna',
      title: 'Antena',
      fact: 'La voz de los dos',
      explain: 'Sojourner hablaba con la Tierra a través de la estación. Su última transmisión llegó el 27 de septiembre de 1997.',
      offset: [0, 0.2, 0],
    },
    {
      id: 'sojourner',
      node: 'sojourner',
      title: 'Sojourner',
      fact: '10,6 kg · 30 cm · 83 días',
      explain: 'El primer vehículo con ruedas en otro planeta. Le daban 7 días de vida: duró 83. Su nombre honra a Sojourner Truth, luchadora por los derechos civiles.',
      offset: [0, 0.4, 0],
    },
    {
      id: 'sojmast',
      node: 'soj_mast',
      title: 'Instrumento de Sojourner',
      fact: 'Química de las rocas',
      explain: 'Con él analizaba de qué estaban hechas rocas como Barnacle Bill, Yogi o Scooby-Doo. Entre los dos hicieron más de 15 análisis químicos.',
      offset: [0, 0.1, 0],
    },
    {
      id: 'airbags',
      node: 'airbag_0',
      title: 'Airbags',
      fact: 'Bola de 5,2 m · al menos 15 rebotes',
      explain: 'Un sistema de airbags inflados en unos 0,3 s protegió el aterrizaje. Esa forma de aterrizar se usó después, en varias versiones, para llevar otros rovers a Marte.',
      offset: [0, 0.2, 0],
    },
  ],
  pioneer10: [
    {
      id: 'dish',
      node: 'dish_mesh',
      title: 'Antena de plato',
      fact: 'Al final, la señal tardaba más de 11 horas en llegar',
      explain:
        'Un plato que apuntaba a la Tierra. Al final de la misión, cada señal tardaba más de once horas en llegar: la sonda hablaba desde tan lejos que cada respuesta llegaba muy tarde.',
      offset: [0, 0.3, 0],
    },
    {
      id: 'rtg',
      node: 'rtg_boom_L',
      title: 'Generadores nucleares (RTG)',
      fact: 'Pioneer 10 fue la primera nave con energía solo nuclear',
      explain:
        'Convierten el calor de un material radiactivo en electricidad, porque tan lejos del Sol los paneles solares no servirían. Con los años, esa electricidad bajó hasta que ya no alcanzó para el transmisor.',
      offset: [0, 0.25, 0],
    },
    {
      id: 'mag',
      node: 'mag_boom',
      title: 'Magnetómetro',
      fact: 'Midió el campo magnético de Júpiter y su gran cola',
      explain:
        'Un brazo largo que aleja los sensores del cuerpo de la nave. Sus medidas ayudaron a descubrir que la magnetosfera de Júpiter tiene una cola que llega casi hasta la órbita de Saturno.',
      offset: [0, 0.2, 0],
    },
    {
      id: 'plaque',
      node: 'golden_plaque',
      title: 'Placa para quien la encuentre',
      fact: 'Aluminio, con un hombre, una mujer y el Sistema Solar',
      explain:
        'Una placa de aluminio con dibujos: un hombre y una mujer, el Sistema Solar y la posición del Sol entre catorce púlsares. La idea fue de Carl Sagan. Nadie sabe si alguien la encontrará.',
      offset: [0, 0.1, 0],
    },
    {
      id: 'antenna',
      node: 'antenna_omni',
      title: 'Antena omnidireccional',
      fact: 'Comunicación que no necesitaba apuntar con precisión',
      explain:
        'Recibe y envía señales en todas direcciones. Era la antena de respaldo, para cuando el plato principal no estaba bien orientado.',
      offset: [0, 0.2, 0],
    },
  ],
  eagle: [
    {
      id: 'ladder',
      node: 'ladder',
      title: 'Escalera',
      fact: 'Por aquí bajaron los dos primeros humanos en la Luna',
      explain:
        'Armstrong bajó primero y pisó el polvo lunar a las 02:56 UT del 21 de julio de 1969 (la noche del 20 en Florida). Después bajó Aldrin. En una de las patas, detrás de la escalera, va una placa que ambos leyeron en voz alta.',
      offset: [0.5, 0.6, 0],
    },
    {
      id: 'seismometer',
      node: 'seismometer',
      title: 'Sismómetro',
      fact: 'Escuchaba los temblores de la Luna',
      explain:
        'Forma parte del paquete de experimentos EASEP (48 kg en total): un sismómetro pasivo, hecho para medir la actividad sísmica de la Luna. Quedó a unos 17 m del módulo.',
      offset: [0, 0.45, 0],
    },
    {
      id: 'reflector',
      node: 'laser_reflector',
      title: 'Reflector láser',
      fact: '100 cubos de cristal · sin energía · precisión ~2 cm',
      explain:
        'Cien «cubos de esquina» de sílice en un panel de aluminio de 46 cm devuelven la luz láser hacia el lugar de donde vino. No necesita energía. Sirve para medir la distancia entre la Tierra y la Luna, y para comprobar que la Luna se aleja.',
      offset: [0, 0.4, 0],
    },
    {
      id: 'engine',
      node: 'descent_engine',
      title: 'Motor de descenso',
      fact: 'Frenó la caída hasta posarse',
      explain:
        'Encendido unos 756 segundos para bajar hasta la superficie. Después de aterrizar, la etapa de descenso ya no se movió: sirvió de plataforma de lanzamiento para la cabina.',
      offset: [0, -0.1, 0],
    },
    {
      id: 'stage',
      node: 'descent_stage',
      title: 'Etapa de descenso',
      fact: '2 034 kg en seco · 8 248 kg de combustible al inicio',
      explain:
        'La mitad de abajo del módulo lunar. Cuando la cabina despegó, esta etapa se quedó como plataforma de lanzamiento, y allí sigue.',
      offset: [1.2, 0.3, 0],
    },
    {
      id: 'legs',
      node: 'footpad_0',
      title: 'Patas con platos',
      fact: 'Cuatro patas para no hundirse en el polvo',
      explain: 'Cuatro patas con platos anchos que reparten el peso del módulo sobre el suelo lunar.',
      offset: [0, 0.3, 0],
    },
  ],
  surveyor3: [
    {
      id: 'tv',
      node: 'tv_head',
      title: 'Cámara de TV',
      fact: 'Dos lentes (25 y 100 mm) · ~20 s por imagen',
      explain:
        'Miraba a través de un espejo móvil y envió 6 326 imágenes a la Tierra. Hoy está en el Museo Nacional del Aire y el Espacio (Smithsonian), en Washington D. C.',
      offset: [0.4, 0.45, 0],
    },
    {
      id: 'sampler',
      node: 'sampler_lower',
      title: 'Brazo con pala',
      fact: 'Cuchara de 12 × 5 cm · cavó hasta 18 cm',
      explain:
        'Un brazo de 1,5 m con una cuchara. Cavó cuatro zanjas y repitió pruebas de carga y de impacto para saber cuánto aguantaba el suelo. La pala volvió a la Tierra con el Apolo 12.',
      offset: [0.15, 0.25, 0],
    },
    {
      id: 'solar',
      node: 'solar_panel',
      title: 'Panel solar',
      fact: 'Sin Sol, sin energía',
      explain:
        'Su energía venía del Sol. Cuando llegó la noche lunar (unas dos semanas de oscuridad), la nave se quedó sin luz y no volvió a despertar.',
      offset: [0, 0.2, 0],
    },
    {
      id: 'legs',
      node: 'footpad_0',
      title: 'Patas',
      fact: 'Tocó la Luna tres veces al aterrizar',
      explain:
        'Tres patas con platos de apoyo. En el aterrizaje los motores no se apagaron a tiempo y la nave tocó el suelo tres veces antes de quedarse quieta.',
      offset: [0, 0.3, 0],
    },
  ],
}
