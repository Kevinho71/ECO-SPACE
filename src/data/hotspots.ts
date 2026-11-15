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
      id: 'antenna',
      node: 'antenna',
      title: 'Antenas',
      fact: 'Comunicación con la Tierra y los orbitadores',
      explain:
        'Habla con la Tierra por banda X y con los orbitadores en Marte por UHF. Gracias a esos orbitadores, la NASA recibía sus datos.',
      offset: [0, 0.55, 0],
    },
  ],
}
