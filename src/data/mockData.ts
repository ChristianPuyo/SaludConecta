import type { RiskLevel } from '../components/RiskBadge';

export interface SymptomReport {
  id: string;
  date: string;
  district: string;
  symptoms: string[];
  risk: RiskLevel;
}

export const MOCK_CITIZEN_REPORTS: SymptomReport[] = [
  { id: '1', date: 'Hoy', district: 'Callería', symptoms: ['Fiebre', 'Dolor muscular', 'Dolor de cabeza'], risk: 'alto' },
  { id: '2', date: 'Ayer', district: 'Callería', symptoms: ['Tos', 'Fiebre'], risk: 'medio' },
  { id: '3', date: 'Hace 2 días', district: 'Yarinacocha', symptoms: ['Diarrea', 'Vómitos'], risk: 'medio' },
  { id: '4', date: 'Hace 3 días', district: 'Callería', symptoms: ['Fiebre'], risk: 'bajo' },
  { id: '5', date: 'Hace 4 días', district: 'Manantay', symptoms: ['Tos', 'Dolor de cabeza'], risk: 'bajo' },
  { id: '6', date: 'Hace 5 días', district: 'Callería', symptoms: ['Fiebre', 'Dolor muscular'], risk: 'medio' },
  { id: '7', date: 'Hace 1 semana', district: 'Yarinacocha', symptoms: ['Tos'], risk: 'bajo' },
  { id: '8', date: 'Hace 1 semana', district: 'Campoverde', symptoms: ['Dolor muscular'], risk: 'bajo' },
  { id: '9', date: 'Hace 2 semanas', district: 'Callería', symptoms: ['Fiebre', 'Tos', 'Dolor muscular'], risk: 'alto' },
  { id: '10', date: 'Hace 2 semanas', district: 'Manantay', symptoms: ['Diarrea'], risk: 'bajo' },
  { id: '11', date: 'Hace 3 semanas', district: 'Callería', symptoms: ['Tos'], risk: 'bajo' },
  { id: '12', date: 'Hace 3 semanas', district: 'Yarinacocha', symptoms: ['Fiebre', 'Vómitos'], risk: 'medio' },
];

export const SYMPTOM_LIST = ['Fiebre', 'Tos', 'Dolor muscular', 'Diarrea', 'Vómitos', 'Dolor de cabeza'];

export function getSymptomStats(reports: SymptomReport[]): { symptom: string; count: number }[] {
  const stats: Record<string, number> = {};
  for (const r of reports) {
    for (const s of r.symptoms) {
      stats[s] = (stats[s] || 0) + 1;
    }
  }
  return SYMPTOM_LIST.map((s) => ({ symptom: s, count: stats[s] || 0 })).sort((a, b) => b.count - a.count);
}

export function getWeeklyReportCounts(reports: SymptomReport[]): { label: string; count: number }[] {
  const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const counts = [0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < reports.length; i++) {
    counts[i % 7] += 1;
  }
  return labels.map((label, i) => ({ label, count: counts[i] }));
}

export function getRiskDistribution(reports: SymptomReport[]): { level: RiskLevel; count: number }[] {
  const dist: Record<string, number> = { bajo: 0, medio: 0, alto: 0 };
  for (const r of reports) {
    dist[r.risk] = (dist[r.risk] || 0) + 1;
  }
  return [
    { level: 'bajo', count: dist.bajo },
    { level: 'medio', count: dist.medio },
    { level: 'alto', count: dist.alto },
  ];
}

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
  {
    id: 'a3',
    title: 'Casos de diarrea en aumento',
    district: 'Manantay',
    detail: '12 reportes de diarrea y vómitos en el último mes.',
    risk: 'medio',
    date: 'Hace 2 días',
  },
];

export interface School {
  id: string;
  name: string;
  district: string;
  students: number;
  alerts: string[];
  risk: RiskLevel;
}

export const MOCK_SCHOOLS: School[] = [
  { id: 's1', name: 'IEI San Martín', district: 'Callería', students: 320, alerts: ['3 casos de fiebre esta semana', 'Fumigación pendiente'], risk: 'medio' },
  { id: 's2', name: 'IEI Nueva Esperanza', district: 'Callería', students: 180, alerts: ['1 caso de dengue confirmado'], risk: 'alto' },
  { id: 's3', name: 'IEI Alto Purús', district: 'Yarinacocha', students: 245, alerts: ['Ventilación mejorada'], risk: 'bajo' },
  { id: 's4', name: 'IEI San Pablo', district: 'Manantay', students: 190, alerts: ['2 casos respiratorios'], risk: 'medio' },
  { id: 's5', name: 'IEI Campoverde', district: 'Campoverde', students: 150, alerts: [], risk: 'bajo' },
];

export interface MedicalResource {
  id: string;
  name: string;
  type: 'hospital' | 'centro_salud' | 'clinica' | 'farmacia';
  district: string;
  address: string;
  phone: string;
  services: string[];
  hours: string;
}

export const MOCK_MEDICAL_RESOURCES: MedicalResource[] = [
  { id: 'm1', name: 'Hospital Regional de Ucayali', type: 'hospital', district: 'Callería', address: 'Av. San Martín 1250', phone: '(061) 57-2222', services: ['Emergencia', 'Laboratorio', 'Rayos X', 'Cirugía', 'Vacunación'], hours: '24 horas' },
  { id: 'm2', name: 'Centro de Salud Callería I', type: 'centro_salud', district: 'Callería', address: 'Jr. Pucallpa 456', phone: '(061) 57-3344', services: ['Atención general', 'Vacunación', 'Control prenatal'], hours: '7:00 - 15:00' },
  { id: 'm3', name: 'Centro de Salud Yarinacocha', type: 'centro_salud', district: 'Yarinacocha', address: 'Av. Fiscal 789', phone: '(061) 57-4455', services: ['Atención general', 'Pediatría', 'Laboratorio'], hours: '7:00 - 15:00' },
  { id: 'm4', name: 'Clínica San Pablo', type: 'clinica', district: 'Manantay', address: 'Calle Los Pinos 123', phone: '(061) 57-5566', services: ['Consulta general', 'Odontología', 'Farmacia'], hours: '8:00 - 20:00' },
  { id: 'm5', name: 'Farmacia Salud Total', type: 'farmacia', district: 'Callería', address: 'Av. Constitución 456', phone: '(061) 57-6677', services: ['Medicamentos', 'Pruebas rápidas'], hours: '8:00 - 22:00' },
  { id: 'm6', name: 'Centro de Salud Campoverde', type: 'centro_salud', district: 'Campoverde', address: 'Jr. principal s/n', phone: '(061) 57-7788', services: ['Atención general', 'Maternidad'], hours: '7:00 - 15:00' },
];

export interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  department: string;
}

export const MOCK_CONTACTS: Contact[] = [
  { id: 'c1', name: 'DIRESA Ucayali', role: 'Dirección Regional de Salud', phone: '(061) 57-1010', email: 'diresa@ucayali.gob.pe', department: 'Emergencias' },
  { id: 'c2', name: 'Sistema de Emergencias', role: 'Línea de Emergencia', phone: '116', department: 'Emergencias' },
  { id: 'c3', name: 'Centro de Emergencias Callería', role: 'Centro de Atención', phone: '(061) 57-2020', department: 'Emergencias' },
  { id: 'c4', name: 'Dr. Carlos Mendoza', role: 'Médico General', phone: '(061) 57-3030', department: 'Consulta General' },
  { id: 'c5', name: 'Lic. María Torres', role: 'Enfermera Jefe', phone: '(061) 57-4040', department: 'Enfermería' },
  { id: 'c6', name: 'Psic. Ana García', role: 'Psicóloga Comunitaria', phone: '(061) 57-5050', department: 'Salud Mental' },
  { id: 'c7', name: 'Nutricionista Pedro López', role: 'Nutricionista', phone: '(061) 57-6060', department: 'Nutrición' },
  { id: 'c8', name: 'Brigada de Fumigación', role: 'Control Vectorial', phone: '(061) 57-7070', department: 'Control Vectorial' },
];

export const RESOURCE_TYPE_LABELS: Record<MedicalResource['type'], string> = {
  hospital: 'Hospital',
  centro_salud: 'Centro de Salud',
  clinica: 'Clínica',
  farmacia: 'Farmacia',
};

export const RESOURCE_TYPE_ICONS: Record<MedicalResource['type'], string> = {
  hospital: 'hospital',
  centro_salud: 'medkit',
  clinica: 'medical',
  farmacia: 'medication',
};

export interface SymptomRecommendation {
  symptom: string;
  medications: { name: string; dose: string; frequency: string; precautions: string }[];
  homeRemedies: string[];
  warnings: string[];
  preventions: string[];
}

export const SYMPTOM_RECOMMENDATIONS: Record<string, SymptomRecommendation> = {
  Fiebre: {
    symptom: 'Fiebre',
    medications: [
      { name: 'Paracetamol', dose: '500 mg', frequency: 'Cada 6-8 horas', precautions: 'No exceder 4g/día. Evitar con hígado dañado.' },
      { name: 'Ibuprofeno', dose: '400 mg', frequency: 'Cada 8 horas', precautions: 'Tomar con alimentos. Evitar si hay problemas gástricos.' },
    ],
    homeRemedies: [
      'Mantenerse hidratado con agua y líquidos claros',
      'Aplicar paños tibios en frente y axilas',
      'Descansar en un lugar fresco y ventilado',
      'Usar ropa ligera y holgada',
    ],
    warnings: [
      'Si la fiebre supera 39°C o dura más de 3 días, acudir al centro de salud',
      'Buscar atención urgente si hay convulsiones o confusión',
    ],
    preventions: [
      'Mantener buena ventilación en el hogar',
      'Consumir alimentos nutritivos y cítricos',
      'Evitar corrientes de aire frío',
    ],
  },
  Tos: {
    symptom: 'Tos',
    medications: [
      { name: 'Dextrometorfano', dose: '15 mg', frequency: 'Cada 6-8 horas', precautions: 'No exceder 120 mg/día. Evitar con medicamentos para el estómago.' },
      { name: 'Ambroxol', dose: '30 mg', frequency: 'Cada 12 horas', precautions: 'Tomar con abundante agua. No usar con antitusivos simultáneamente.' },
    ],
    homeRemedies: [
      'Beber miel con agua caliente (no en niños menores de 1 año)',
      'Inhalar vapor de eucalipto',
      'Gárgaras de agua tibia con sal',
      'Mantener ambientes húmedos',
    ],
    warnings: [
      'Acudir al médico si la tos persiste más de 2 semanas',
      'Buscar atención urgente si hay sangre en el esputo',
    ],
    preventions: [
      'Evitar el humo del cigarrillo y leña',
      'Usar mascarilla en lugares polvorientos',
      'Mantener ventanas abiertas para ventilación',
    ],
  },
  'Dolor muscular': {
    symptom: 'Dolor muscular',
    medications: [
      { name: 'Ibuprofeno', dose: '400 mg', frequency: 'Cada 8 horas', precautions: 'Tomar con alimentos. Evitar si hay problemas renales.' },
      { name: 'Paracetamol', dose: '500 mg', frequency: 'Cada 6-8 horas', precautions: 'Alternar con Ibuprofeno. No exceder 4g/día.' },
    ],
    homeRemedies: [
      'Aplicar compresas frías las primeras 48 horas',
      'Después aplicar compresas tibias',
      'Masaje suave con aceite esencial de lavanda',
      'Estiramientos suaves y movilización',
    ],
    warnings: [
      'Si el dolor es intenso y persistente, acudir al médico',
      'Buscar atención si hay hinchazón, enrojecimiento o fiebre',
    ],
    preventions: [
      'Calentar antes de actividad física',
      'Evitar esfuerzos excesivos',
      'Mantener buena postura al sentarse',
    ],
  },
  Diarrea: {
    symptom: 'Diarrea',
    medications: [
      { name: 'Sales de rehidratación oral (SRO)', dose: '1 litro', frequency: 'Tras cada deposición', precautions: 'Preparar según indicaciones del paquete. No agregar azúcar.' },
      { name: 'Loperamida', dose: '2 mg', frequency: 'Cada 4-6 horas', precautions: 'Máximo 8 mg/día. No usar en niños menores de 6 años.' },
    ],
    homeRemedies: [
      'Tomar abundantes líquidos: agua, caldo, suero casero',
      'Consumir arroz blanco y plátano',
      'Evitar lácteos, café y comidas grasas',
      'Lavarse las manos frecuentemente',
    ],
    warnings: [
      'Buscar atención urgente si hay sangre en las heces',
      'Acudir al médico si hay signos de deshidratación (boca seca, orina oscura)',
    ],
    preventions: [
      'Lavarse las manos antes de comer y después de ir al baño',
      'Consumir agua hervida o embotellada',
      'Evitar alimentos crudos de origen desconocido',
    ],
  },
  Vómitos: {
    symptom: 'Vómitos',
    medications: [
      { name: 'Metoclopramida', dose: '10 mg', frequency: 'Cada 8 horas', precautions: 'Tomar 30 min antes de comer. Evitar en pacientes con Parkinson.' },
      { name: 'Ondansetrón', dose: '4 mg', frequency: 'Cada 8 horas', precautions: 'Puede causar dolor de cabeza. No exceder 24 mg/día.' },
    ],
    homeRemedies: [
      'Tomar sorbos pequeños de líquidos claros',
      'Esperar 30 minutos después del vómito para ingerir alimentos',
      'Consumir gelatina, tostadas o arroz blanco',
      'Evitar olores fuertes y comidas grasas',
    ],
    warnings: [
      'Buscar atención urgente si el vómito contiene sangre',
      'Acudir al médico si no se toleran líquidos por más de 12 horas',
    ],
    preventions: [
      'Comer en porciones pequeñas y frecuentes',
      'Mantener alimentos a temperatura adecuada',
      'Evitar cambiar bruscamente de dieta',
    ],
  },
  'Dolor de cabeza': {
    symptom: 'Dolor de cabeza',
    medications: [
      { name: 'Paracetamol', dose: '500 mg', frequency: 'Cada 6-8 horas', precautions: 'No exceder 4g/día. Evitar con alcohol.' },
      { name: 'Naproxeno', dose: '250 mg', frequency: 'Cada 12 horas', precautions: 'Tomar con alimentos. Evitar si hay problemas renales.' },
    ],
    homeRemedies: [
      'Descansar en un lugar oscuro y silencioso',
      'Aplicar compresas frías en la frente',
      'Masaje suave en sienes y nuca',
      'Beber agua y evitar pantallas brillantes',
    ],
    warnings: [
      'Buscar atención urgente si el dolor es repentino e intenso',
      'Acudir al médico si se acompaña de fiebre alta, rigidez de cuello o visión borrosa',
    ],
    preventions: [
      'Mantener horarios regulares de sueño',
      'Evitar el estrés excesivo',
      'Consumir abundantes líquidos',
    ],
  },
};

export const PREVENTIVE_TIPS = [
  { id: 'p1', title: 'Agua segura', description: 'Bebe solo agua hervida o embotellada. En la Amazonía, el agua sin tratamiento puede causar enfermedades diarreicas.', icon: 'water' },
  { id: 'p2', title: 'Protección contra mosquitos', description: 'Usa repelente y ropa de manga larga al atardecer. El dengue y la malaria son comunes en la región.', icon: 'bug' },
  { id: 'p3', title: 'Ventilación del hogar', description: 'Mantén ventanas abiertas y evita acumular agua estancada cerca de tu vivienda.', icon: 'home' },
  { id: 'p4', title: 'Lavado de manos', description: 'Lávate las manos con frecuencia, especialmente antes de comer y después de ir al baño.', icon: 'hand-left' },
  { id: 'p5', title: 'Alimentación saludable', description: 'Consume frutas y verduras locales. Mantén una dieta balanceada para fortalecer tu sistema inmunológico.', icon: 'nutrition' },
];

export const HEALTH_STATISTICS = {
  totalReports: 88,
  activeAlerts: 3,
  vaccinated: 2450,
  communitiesMonitored: 12,
};
