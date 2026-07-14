import type { RiskLevel } from '../components/RiskBadge';

export interface SymptomReport {
  id: string;
  date: string;
  district: string;
  community?: string;
  age?: number;
  sex?: string;
  symptoms: string[];
  risk: RiskLevel;
  reasoning?: string;
}

export const MOCK_CITIZEN_REPORTS: SymptomReport[] = [
  { 
    id: '1', 
    date: 'Hace 2 días', 
    district: 'Callería', 
    community: 'San José',
    age: 28,
    sex: 'Masculino',
    symptoms: ['Fiebre', 'Dolor muscular'], 
    risk: 'medio',
    reasoning: 'Presenta fiebre combinada con dolor muscular, síntomas compatibles con infecciones virales como el Dengue en etapa inicial. Se recomienda monitorear temperatura e hidratación.'
  },
  { 
    id: '2', 
    date: 'Hace 3 semanas', 
    district: 'Callería', 
    community: 'Yarinacocha Sector 2',
    age: 45,
    sex: 'Femenino',
    symptoms: ['Tos'], 
    risk: 'bajo',
    reasoning: 'Sintomatología respiratoria leve aislada. Sin fiebre ni signos de alarma. Se sugiere descanso y monitoreo preventivo.'
  },
];

export interface DistrictRisk {
  district: string;
  risk: RiskLevel;
  cases: number;
}

export const MOCK_DISTRICT_RISK: DistrictRisk[] = [
  { district: 'Callería', risk: 'alto', cases: 42 },
  { district: 'Yarinacocha', risk: 'medio', cases: 21 },
  { district: 'Manantay', risk: 'medio', cases: 18 },
  { district: 'Campoverde', risk: 'bajo', cases: 5 },
  { district: 'Nueva Requena', risk: 'bajo', cases: 2 },
];

export interface EpidemicAlert {
  id: string;
  title: string;
  district: string;
  detail: string;
  risk: RiskLevel;
  date: string;
}

export const MOCK_ALERTS: EpidemicAlert[] = [
  {
    id: 'a1',
    title: 'Posible brote de dengue',
    district: 'Callería',
    detail: '35 reportes de fiebre en los últimos 7 días dentro del mismo sector.',
    risk: 'alto',
    date: 'Hoy, 08:12',
  },
  {
    id: 'a2',
    title: 'Incremento de casos respiratorios',
    district: 'Yarinacocha',
    detail: '18 reportes de tos y fiebre en la última semana.',
    risk: 'medio',
    date: 'Ayer, 19:40',
  },
];
