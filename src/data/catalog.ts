export type Location = 'moon' | 'mars' | 'beyond'

export interface Mission {
  id: string
  name: string
  nickname?: string
  location: Location
  celestialBody: string
  launchYear: string
  modelPath: string
  povAnchor?: string
  /** [lat, lon] en grados para ubicar el robot en el globo planetario. */
  latlon?: [number, number]
  summary: string
  lastWords?: string
}

export const MISSIONS: Mission[] = [
  {
    id: 'eagle',
    name: 'Apollo 11 LM "Eagle" (etapa de descenso)',
    nickname: 'Eagle',
    location: 'moon',
    celestialBody: 'Luna · Tranquility Base',
    launchYear: '1969',
    modelPath: '/models/moon/eagle.glb',
    povAnchor: 'pov_eye',
    latlon: [0.674, 23.473],
    summary: 'Primer alunizaje humano, el 20 de julio de 1969. Su reflector láser aún se usa hoy.',
  },
  {
    id: 'surveyor3',
    name: 'Surveyor 3',
    nickname: 'Surveyor 3',
    location: 'moon',
    celestialBody: 'Luna · Oceanus Procellarum',
    launchYear: '1967',
    modelPath: '/models/moon/surveyor3.glb',
    povAnchor: 'pov_eye',
    latlon: [-3.015, -23.418],
    summary: 'Aterrizó en 1967; el Apolo 12 alunizó a su lado y trajo su cámara de vuelta a la Tierra.',
  },
  {
    id: 'pathfinder',
    name: 'Mars Pathfinder + Sojourner',
    nickname: 'Pathfinder',
    location: 'mars',
    celestialBody: 'Marte · Ares Vallis',
    launchYear: '1996',
    modelPath: '/models/mars/pathfinder.glb',
    povAnchor: 'pov_eye',
    latlon: [19.13, -33.22],
    summary: '1997: el primer rover en Marte, con un aterrizaje protegido por airbags que rebotaron.',
  },
  {
    id: 'opportunity',
    name: 'Opportunity (MER-B)',
    nickname: 'Oppy',
    location: 'mars',
    celestialBody: 'Marte · Meridiani Planum',
    launchYear: '2003',
    modelPath: '/models/mars/opportunity.glb',
    povAnchor: 'pov_eye',
    latlon: [-1.95, -5.44],
    summary: 'Nació para durar 90 días y vivió 15 años. Encontró pruebas de agua en el pasado de Marte.',
    lastWords: 'My battery is low and it\'s getting dark.',
  },
  {
    id: 'insight',
    name: 'InSight',
    nickname: 'InSight',
    location: 'mars',
    celestialBody: 'Marte · Elysium Planitia',
    launchYear: '2018',
    modelPath: '/models/mars/insight.glb',
    povAnchor: 'pov_eye',
    latlon: [4.5, 135.6],
    summary: 'Escuchó "martemotos" y reveló el interior de Marte.',
    lastWords: 'My power\'s really low, so this may be the last image I can send.',
  },
  {
    id: 'ingenuity',
    name: 'Ingenuity (helicóptero)',
    nickname: 'Ingenuity',
    location: 'mars',
    celestialBody: 'Marte · Cráter Jezero',
    launchYear: '2021',
    modelPath: '/models/mars/ingenuity.glb',
    povAnchor: 'pov_eye',
    latlon: [18.4, 77.4],
    summary: 'El primer vuelo motorizado en otro planeta: 72 vuelos históricos.',
  },
  {
    id: 'pioneer10',
    name: 'Pioneer 10',
    nickname: 'Pioneer 10',
    location: 'beyond',
    celestialBody: 'Espacio profundo · rumbo a Aldebarán',
    launchYear: '1972',
    modelPath: '/models/beyond/pioneer10.glb',
    povAnchor: 'pov_eye',
    summary: 'Primera sonda en cruzar el cinturón de asteroides y visitar Júpiter. Lleva la placa dorada.',
  },
]
