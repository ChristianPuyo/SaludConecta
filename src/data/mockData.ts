import type { RiskLevel } from '../components/RiskBadge';

// ── Tipos de enfermedad ──
export type DiseaseType = 'respiratoria' | 'diarrea' | 'dengue' | 'malaria' | 'leptospirosis' | 'otra';

export const DISEASE_LABELS: Record<DiseaseType, string> = {
  respiratoria: 'Enfermedad Respiratoria',
  diarrea: 'Diarrea',
  dengue: 'Dengue',
  malaria: 'Malaria',
  leptospirosis: 'Leptospirosis',
  otra: 'Otra',
};

export const DISEASE_COLORS: Record<DiseaseType, string> = {
  respiratoria: '#3B82F6',   // azul
  diarrea: '#F59E0B',        // ámbar
  dengue: '#EF4444',         // rojo
  malaria: '#8B5CF6',        // púrpura
  leptospirosis: '#EC4899',  // rosa
  otra: '#6B7280',           // gris
};

// ── Reportes de síntomas ciudadanos ──
export interface SymptomReport {
  id: string;
  date: string;
  district: string;
  community: string;
  symptoms: string[];
  risk: RiskLevel;
  diseaseType: DiseaseType;
  age?: number;
  sex?: 'M' | 'F';
  riskExplanation?: string;
}

export const MOCK_CITIZEN_REPORTS: SymptomReport[] = [
  {
    id: '1', date: '2026-07-12', district: 'Callería', community: 'San Juan',
    symptoms: ['Fiebre', 'Dolor muscular', 'Dolor de cabeza'], risk: 'medio',
    diseaseType: 'dengue', age: 34, sex: 'F',
    riskExplanation: '3 síntomas reportados incluyendo fiebre. Clasificado como riesgo MEDIO.',
  },
  {
    id: '2', date: '2026-07-11', district: 'Callería', community: 'Avenida Industrial',
    symptoms: ['Tos', 'Fiebre'], risk: 'medio',
    diseaseType: 'respiratoria', age: 67, sex: 'M',
    riskExplanation: '2 síntomas respiratorios con fiebre en paciente mayor. Riesgo MEDIO.',
  },
  {
    id: '3', date: '2026-07-10', district: 'Yarinacocha', community: 'Santa Rosa',
    symptoms: ['Diarrea', 'Vómitos'], risk: 'medio',
    diseaseType: 'diarrea', age: 8, sex: 'F',
    riskExplanation: '2 síntomas gastrointestinales en menor de edad. Riesgo MEDIO.',
  },
  {
    id: '4', date: '2026-07-09', district: 'Callería', community: 'Centro',
    symptoms: ['Fiebre', 'Dolor muscular', 'Dolor de cabeza', 'Tos'], risk: 'alto',
    diseaseType: 'dengue', age: 29, sex: 'M',
    riskExplanation: '4 síntomas incluyendo fiebre y dolor muscular. Clasificado como riesgo ALTO. Posible dengue.',
  },
  {
    id: '5', date: '2026-07-08', district: 'Manantay', community: 'La Libertad',
    symptoms: ['Tos'], risk: 'bajo',
    diseaseType: 'respiratoria', age: 45, sex: 'F',
    riskExplanation: '1 solo síntoma leve. Riesgo BAJO.',
  },
];

// ── Riesgo por distrito ──
export interface DistrictRisk {
  district: string;
  risk: RiskLevel;
  cases: number;
  diseases: DiseaseType[];
  lat?: number;
  lng?: number;
}

export const MOCK_DISTRICT_RISK: DistrictRisk[] = [
  { district: 'Callería', risk: 'alto', cases: 42, diseases: ['dengue', 'respiratoria'], lat: -8.38, lng: -74.56 },
  { district: 'Yarinacocha', risk: 'medio', cases: 21, diseases: ['diarrea', 'respiratoria'], lat: -8.33, lng: -74.57 },
  { district: 'Manantay', risk: 'medio', cases: 18, diseases: ['respiratoria', 'dengue'], lat: -8.30, lng: -74.60 },
  { district: 'Campoverde', risk: 'bajo', cases: 5, diseases: ['respiratoria'], lat: -8.45, lng: -74.48 },
  { district: 'Nueva Requena', risk: 'bajo', cases: 2, diseases: ['diarrea'], lat: -8.28, lng: -74.65 },
];

// ── Evolución semanal (para el dashboard) ──
export interface WeeklyEvolution {
  week: string;
  totalCases: number;
  dengue: number;
  respiratoria: number;
  diarrea: number;
  malaria: number;
}

export const MOCK_WEEKLY_EVOLUTION: WeeklyEvolution[] = [
  { week: 'Sem 1 (jun)', totalCases: 18, dengue: 4, respiratoria: 8, diarrea: 5, malaria: 1 },
  { week: 'Sem 2 (jun)', totalCases: 25, dengue: 7, respiratoria: 10, diarrea: 6, malaria: 2 },
  { week: 'Sem 3 (jun)', totalCases: 32, dengue: 10, respiratoria: 12, diarrea: 8, malaria: 2 },
  { week: 'Sem 4 (jun)', totalCases: 38, dengue: 14, respiratoria: 13, diarrea: 9, malaria: 2 },
  { week: 'Sem 1 (jul)', totalCases: 45, dengue: 18, respiratoria: 14, diarrea: 11, malaria: 2 },
  { week: 'Sem 2 (jul)', totalCases: 52, dengue: 22, respiratoria: 15, diarrea: 12, malaria: 3 },
];

// ── Alertas epidémicas ──
export interface EpidemicAlert {
  id: string;
  title: string;
  district: string;
  detail: string;
  risk: RiskLevel;
  date: string;
  diseaseType: DiseaseType;
}

export const MOCK_ALERTS: EpidemicAlert[] = [
  {
    id: 'a1', title: 'Posible brote de dengue en Callería',
    district: 'Callería',
    detail: '35 reportes de fiebre y dolor muscular en los últimos 7 días dentro del mismo sector San Juan. Patrón consistente con transmisión activa de dengue.',
    risk: 'alto', date: 'Hoy, 08:12', diseaseType: 'dengue',
  },
  {
    id: 'a2', title: 'Incremento de casos respiratorios en Yarinacocha',
    district: 'Yarinacocha',
    detail: '18 reportes de tos y fiebre en la última semana. Se recomienda intensificar vigilancia en comunidades aledañas.',
    risk: 'medio', date: 'Ayer, 19:40', diseaseType: 'respiratoria',
  },
  {
    id: 'a3', title: 'Alerta de diarrea aguda en Manantay',
    district: 'Manantay',
    detail: '8 casos de diarrea y vómitos en menores de 5 años en la comunidad La Libertad. Verificar calidad del agua.',
    risk: 'medio', date: 'Hace 2 días', diseaseType: 'diarrea',
  },
];

// ── Campañas inteligentes ──
export interface SmartCampaign {
  id: string;
  title: string;
  description: string;
  district: string;
  diseaseType: DiseaseType;
  active: boolean;
  createdAt: string;
  notificationsSent: number;
}

export const MOCK_CAMPAIGNS: SmartCampaign[] = [
  {
    id: 'c1',
    title: 'Prevención del Dengue - Callería',
    description: 'Se han detectado 22 casos de dengue en Callería en las últimas 2 semanas. Usa repelente, elimina aguas estancadas y acude al centro de salud si presentas fiebre con dolor muscular.',
    district: 'Callería', diseaseType: 'dengue', active: true,
    createdAt: '2026-07-12', notificationsSent: 156,
  },
  {
    id: 'c2',
    title: 'Campaña Respiratoria - Ucayali',
    description: 'Incremento de enfermedades respiratorias. Protégete con mascarilla en espacios cerrados, mantén ventilación y consulta si la tos persiste más de 3 días.',
    district: 'Todos', diseaseType: 'respiratoria', active: true,
    createdAt: '2026-07-10', notificationsSent: 432,
  },
  {
    id: 'c3',
    title: 'Agua segura en Manantay',
    description: 'Se recomienda hervir el agua antes de consumir. Lavarse las manos frecuentemente. Si presentas diarrea con vómitos, acude al centro de salud más cercano.',
    district: 'Manantay', diseaseType: 'diarrea', active: true,
    createdAt: '2026-07-08', notificationsSent: 89,
  },
];

// ── Predicciones IA ──
export interface AIPrediction {
  id: string;
  title: string;
  description: string;
  confidence: number; // 0-100
  district: string;
  diseaseType: DiseaseType;
}

export const MOCK_PREDICTIONS: AIPrediction[] = [
  {
    id: 'p1',
    title: 'Incremento esperado de dengue en Callería',
    description: 'Basado en patrones históricos de los últimos 3 años, se estima un incremento del 35% en casos de dengue durante las próximas 3 semanas en Callería.',
    confidence: 78, district: 'Callería', diseaseType: 'dengue',
  },
  {
    id: 'p2',
    title: 'Riesgo de expansión respiratoria',
    description: 'Los casos respiratorios en Yarinacocha muestran una tendencia creciente. Se recomienda intensificar campañas preventivas.',
    confidence: 65, district: 'Yarinacocha', diseaseType: 'respiratoria',
  },
];

// ── Visitas del agente (expandidas) ──
export interface CommunityVisit {
  id: string;
  patientName: string;
  community: string;
  age?: number;
  sex?: 'M' | 'F';
  bloodPressure: string;
  glucose: string;
  temperature: string;
  weight: string;
  height: string;
  vaccines?: string[];
  pregnant?: boolean;
  pregnancyWeeks?: number;
  synced: boolean;
  date: string;
}

export const MOCK_VISITS: CommunityVisit[] = [
  {
    id: 'v1', patientName: 'María García', community: 'San Juan', age: 32, sex: 'F',
    bloodPressure: '120/80', glucose: '95', temperature: '36.5', weight: '62', height: '160',
    vaccines: ['COVID-19', 'Influenza'], synced: true, date: '2026-07-11',
  },
  {
    id: 'v2', patientName: 'Juan Pérez', community: 'Avenida Industrial', age: 58, sex: 'M',
    bloodPressure: '140/90', glucose: '110', temperature: '36.8', weight: '78', height: '172',
    vaccines: ['COVID-19'], synced: true, date: '2026-07-11',
  },
  {
    id: 'v3', patientName: 'Ana López', community: 'Santa Rosa', age: 24, sex: 'F',
    bloodPressure: '110/70', glucose: '88', temperature: '36.4', weight: '55', height: '158',
    vaccines: ['COVID-19', 'Influenza', 'VPH'], pregnant: true, pregnancyWeeks: 22, synced: false, date: '2026-07-12',
  },
];
