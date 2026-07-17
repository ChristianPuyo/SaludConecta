import type { RiskLevel } from '../components/RiskBadge';

export interface SymptomReport {
  id: string;
  date: string;
  district: string;
  symptoms: string[];
  risk: RiskLevel;
}

export const MOCK_CITIZEN_REPORTS: SymptomReport[] = [
  { id: '1', date: 'Hace 2 días', district: 'Callería', symptoms: ['Fiebre', 'Dolor muscular'], risk: 'medio' },
  { id: '2', date: 'Hace 3 semanas', district: 'Callería', symptoms: ['Tos'], risk: 'bajo' },
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

export interface DistrictComparison {
  district: string;
  reports: number;
  risk: RiskLevel;
  trend: string;
  predominantDisease: string;
  status: string;
  lastUpdate: string;
}

export const MOCK_DISTRICT_COMPARISON: DistrictComparison[] = [
  {
    district: 'Callería',
    reports: 42,
    risk: 'alto',
    trend: '+25%',
    predominantDisease: 'Dengue',
    status: 'En alerta',
    lastUpdate: 'Hace 8 min',
  },
  {
    district: 'Yarinacocha',
    reports: 21,
    risk: 'medio',
    trend: '+8%',
    predominantDisease: 'Dengue',
    status: 'Monitoreo',
    lastUpdate: 'Hace 15 min',
  },
  {
    district: 'Manantay',
    reports: 18,
    risk: 'medio',
    trend: '+5%',
    predominantDisease: 'Influenza',
    status: 'Monitoreo',
    lastUpdate: 'Hace 22 min',
  },
  {
    district: 'Campoverde',
    reports: 5,
    risk: 'bajo',
    trend: '-2%',
    predominantDisease: 'Respiratorio',
    status: 'Normal',
    lastUpdate: 'Hace 45 min',
  },
  {
    district: 'Nueva Requena',
    reports: 2,
    risk: 'bajo',
    trend: '0%',
    predominantDisease: 'Respiratorio',
    status: 'Normal',
    lastUpdate: 'Hace 1 hora',
  },
];
