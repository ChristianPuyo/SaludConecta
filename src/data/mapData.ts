import type { RiskLevel } from '../components/RiskBadge';

export type DiseaseType = 'Dengue' | 'Malaria' | 'Leptospirosis' | 'EDA' | 'IRA';

export const DISEASES: DiseaseType[] = ['Dengue', 'Malaria', 'Leptospirosis', 'EDA', 'IRA'];

export const DISEASE_ICONS: Record<DiseaseType, string> = {
  Dengue: '🦟',
  Malaria: '🩸',
  Leptospirosis: '💧',
  EDA: '🦠',
  IRA: '🫁',
};

// Centro del mapa: Pucallpa, Ucayali, Perú
export const UCAYALI_CENTER = {
  latitude: -8.3791,
  longitude: -74.5539,
  latitudeDelta: 1.4,
  longitudeDelta: 1.4,
};

export interface DistrictGeoData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  population: number;
  radiusKm: number; // para el círculo de calor en el mapa
}

// Coordenadas GPS reales de los distritos de la Provincia de Coronel Portillo, Ucayali
export const DISTRICTS_GEO: DistrictGeoData[] = [
  {
    id: 'calleria',
    name: 'Callería',
    latitude: -8.3791,
    longitude: -74.5539,
    population: 172000,
    radiusKm: 18,
  },
  {
    id: 'yarinacocha',
    name: 'Yarinacocha',
    latitude: -8.2363,
    longitude: -74.6076,
    population: 95000,
    radiusKm: 14,
  },
  {
    id: 'manantay',
    name: 'Manantay',
    latitude: -8.4203,
    longitude: -74.6142,
    population: 88000,
    radiusKm: 12,
  },
  {
    id: 'campoverde',
    name: 'Campo Verde',
    latitude: -8.3980,
    longitude: -75.0250,
    population: 24000,
    radiusKm: 10,
  },
  {
    id: 'nueva-requena',
    name: 'Nueva Requena',
    latitude: -8.0550,
    longitude: -74.9380,
    population: 16000,
    radiusKm: 9,
  },
];

export interface DistrictEpiData {
  cases: number;
  risk: RiskLevel;
  trend: 'up' | 'down' | 'stable';
  weeklyHistory: number[]; // últimas 6 semanas
  lastUpdate: string;
  description: string;
}

export const DISEASE_DATA: Record<DiseaseType, Record<string, DistrictEpiData>> = {
  Dengue: {
    Callería: {
      cases: 42, risk: 'alto', trend: 'up',
      weeklyHistory: [12, 18, 24, 31, 38, 42],
      lastUpdate: 'Hoy, 06:00',
      description: 'Conglomerado activo en el sector norte. Alta densidad de Aedes aegypti confirmada por brigadas.',
    },
    Yarinacocha: {
      cases: 21, risk: 'medio', trend: 'stable',
      weeklyHistory: [18, 19, 22, 20, 21, 21],
      lastUpdate: 'Hoy, 06:00',
      description: 'Casos estables. Zona lacustre con criaderos potenciales en riberas del lago Yarinacocha.',
    },
    Manantay: {
      cases: 18, risk: 'medio', trend: 'down',
      weeklyHistory: [28, 26, 23, 21, 19, 18],
      lastUpdate: 'Hoy, 06:00',
      description: 'Tendencia decreciente tras campaña de fumigación de la semana pasada.',
    },
    'Campo Verde': {
      cases: 5, risk: 'bajo', trend: 'stable',
      weeklyHistory: [4, 5, 6, 5, 5, 5],
      lastUpdate: 'Ayer, 18:00',
      description: 'Zona rural con baja densidad poblacional. Sin conglomerados activos.',
    },
    'Nueva Requena': {
      cases: 2, risk: 'bajo', trend: 'down',
      weeklyHistory: [6, 5, 4, 3, 2, 2],
      lastUpdate: 'Ayer, 18:00',
      description: 'Situación controlada. Agentes comunitarios en vigilancia activa.',
    },
  },
  Malaria: {
    Callería: {
      cases: 15, risk: 'medio', trend: 'stable',
      weeklyHistory: [12, 13, 15, 14, 15, 15],
      lastUpdate: 'Hoy, 06:00',
      description: 'Casos de P. vivax predominantes. Brigadas de diagnóstico activas.',
    },
    Yarinacocha: {
      cases: 35, risk: 'alto', trend: 'up',
      weeklyHistory: [15, 18, 22, 28, 32, 35],
      lastUpdate: 'Hoy, 06:00',
      description: 'Brote activo en comunidades nativas ribereñas. Se requiere intervención urgente.',
    },
    Manantay: {
      cases: 9, risk: 'bajo', trend: 'stable',
      weeklyHistory: [8, 9, 10, 9, 9, 9],
      lastUpdate: 'Hoy, 06:00',
      description: 'Bajo número de casos. Vigilancia de rutina activa.',
    },
    'Campo Verde': {
      cases: 18, risk: 'medio', trend: 'up',
      weeklyHistory: [10, 12, 13, 15, 17, 18],
      lastUpdate: 'Ayer, 18:00',
      description: 'Incremento asociado a temporada de lluvias. Alerta preventiva emitida.',
    },
    'Nueva Requena': {
      cases: 27, risk: 'alto', trend: 'up',
      weeklyHistory: [10, 14, 18, 22, 25, 27],
      lastUpdate: 'Ayer, 18:00',
      description: 'Zona de alta endemicidad histórica. Operativo de respuesta en curso.',
    },
  },
  Leptospirosis: {
    Callería: {
      cases: 8, risk: 'bajo', trend: 'stable',
      weeklyHistory: [7, 8, 8, 9, 8, 8],
      lastUpdate: 'Hoy, 06:00',
      description: 'Casos esporádicos vinculados a zonas de inundación temporal.',
    },
    Yarinacocha: {
      cases: 6, risk: 'bajo', trend: 'down',
      weeklyHistory: [10, 9, 8, 7, 6, 6],
      lastUpdate: 'Hoy, 06:00',
      description: 'Reducción tras intervención de saneamiento básico.',
    },
    Manantay: {
      cases: 29, risk: 'alto', trend: 'up',
      weeklyHistory: [10, 14, 18, 22, 26, 29],
      lastUpdate: 'Hoy, 06:00',
      description: 'Brote activo post-inundación. Zonas de mercados y riberas afectadas.',
    },
    'Campo Verde': {
      cases: 12, risk: 'medio', trend: 'stable',
      weeklyHistory: [11, 12, 13, 12, 12, 12],
      lastUpdate: 'Ayer, 18:00',
      description: 'Exposición ocupacional en agricultores y pescadores de la zona.',
    },
    'Nueva Requena': {
      cases: 4, risk: 'bajo', trend: 'down',
      weeklyHistory: [8, 7, 6, 5, 4, 4],
      lastUpdate: 'Ayer, 18:00',
      description: 'Tendencia decreciente. Campaña de concientización en curso.',
    },
  },
  EDA: {
    Callería: {
      cases: 38, risk: 'alto', trend: 'up',
      weeklyHistory: [20, 24, 28, 32, 36, 38],
      lastUpdate: 'Hoy, 06:00',
      description: 'Alta incidencia en población infantil. Problemas de agua potable reportados en sector este.',
    },
    Yarinacocha: {
      cases: 22, risk: 'medio', trend: 'stable',
      weeklyHistory: [20, 21, 22, 23, 22, 22],
      lastUpdate: 'Hoy, 06:00',
      description: 'Casos moderados. Sistema de agua con cloración deficiente reportada.',
    },
    Manantay: {
      cases: 31, risk: 'alto', trend: 'up',
      weeklyHistory: [15, 19, 23, 27, 29, 31],
      lastUpdate: 'Hoy, 06:00',
      description: 'Tendencia ascendente preocupante. Alta densidad poblacional con saneamiento insuficiente.',
    },
    'Campo Verde': {
      cases: 14, risk: 'medio', trend: 'down',
      weeklyHistory: [20, 18, 17, 16, 14, 14],
      lastUpdate: 'Ayer, 18:00',
      description: 'Mejoría tras distribución de sales de rehidratación oral.',
    },
    'Nueva Requena': {
      cases: 8, risk: 'bajo', trend: 'stable',
      weeklyHistory: [7, 8, 9, 8, 8, 8],
      lastUpdate: 'Ayer, 18:00',
      description: 'Situación controlada con acceso a agua segura mejorado.',
    },
  },
  IRA: {
    Callería: {
      cases: 45, risk: 'alto', trend: 'up',
      weeklyHistory: [25, 30, 35, 39, 42, 45],
      lastUpdate: 'Hoy, 06:00',
      description: 'Temporada de alta incidencia. Saturación en centros de salud nivel I-3.',
    },
    Yarinacocha: {
      cases: 48, risk: 'alto', trend: 'up',
      weeklyHistory: [28, 32, 37, 42, 46, 48],
      lastUpdate: 'Hoy, 06:00',
      description: 'Mayor carga en el hospital regional. Niños menores de 5 años son el grupo más afectado.',
    },
    Manantay: {
      cases: 26, risk: 'medio', trend: 'stable',
      weeklyHistory: [24, 25, 26, 26, 25, 26],
      lastUpdate: 'Hoy, 06:00',
      description: 'Casos estables pero elevados. Humedad ambiental propicia la propagación.',
    },
    'Campo Verde': {
      cases: 19, risk: 'medio', trend: 'down',
      weeklyHistory: [25, 24, 22, 21, 20, 19],
      lastUpdate: 'Ayer, 18:00',
      description: 'Descenso sostenido. Clima más seco favorece la reducción de casos.',
    },
    'Nueva Requena': {
      cases: 11, risk: 'bajo', trend: 'stable',
      weeklyHistory: [10, 11, 12, 11, 11, 11],
      lastUpdate: 'Ayer, 18:00',
      description: 'Zona con baja densidad. Vigilancia de rutina activa.',
    },
  },
};

// Criaderos de vectores geolocalizados (para la capa "Criaderos")
export interface VectorFocus {
  id: string;
  latitude: number;
  longitude: number;
  type: 'agua_estancada' | 'basural' | 'desague' | 'rio';
  description: string;
  reportedAt: string;
}

export const VECTOR_FOCI: VectorFocus[] = [
  { id: 'vf1', latitude: -8.3650, longitude: -74.5400, type: 'agua_estancada', description: 'Recipientes con agua estancada post-lluvia', reportedAt: 'Hace 1 día' },
  { id: 'vf2', latitude: -8.3900, longitude: -74.5700, type: 'desague', description: 'Canal de desagüe obstruido sector mercado', reportedAt: 'Hace 2 días' },
  { id: 'vf3', latitude: -8.2450, longitude: -74.6000, type: 'agua_estancada', description: 'Ribera con pozas temporales', reportedAt: 'Hace 3 horas' },
  { id: 'vf4', latitude: -8.4100, longitude: -74.6300, type: 'basural', description: 'Llantas abandonadas con agua acumulada', reportedAt: 'Hace 5 horas' },
  { id: 'vf5', latitude: -8.0700, longitude: -74.9200, type: 'rio', description: 'Zona ribereña con acumulación de maleza', reportedAt: 'Hace 1 día' },
  { id: 'vf6', latitude: -8.4050, longitude: -75.0400, type: 'agua_estancada', description: 'Arrozales inundados sin drenaje', reportedAt: 'Hace 4 horas' },
];
