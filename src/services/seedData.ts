/**
 * seedData - Servicio de inicialización de datos demo para SaludConecta.
 * Puebla la aplicación con reportes de síntomas, medicamentos, campañas,
 * cursos y documentos de ejemplo. Utiliza AsyncStorage para ejecutarse
 * una sola vez y facilitar la demostración del sistema en entornos de desarrollo.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReportService } from './reportService';
import { MedicationService } from './medicationService';
import { CampaignService } from './campaignService';
import { CourseService } from './courseService';
import { DocumentService } from './documentService';

export async function seedDemoData() {
  const hasSeed = await AsyncStorage.getItem('@saludconecta/seed_executed');
  if (hasSeed) return;

  await ReportService.add({
    district: 'Callería', community: 'Pucallpa',
    symptoms: ['Fiebre alta', 'Dolor de cabeza', 'Dolor muscular'],
  });
  await ReportService.add({
    district: 'Callería', community: 'Pucallpa',
    symptoms: ['Tos', 'Congestión nasal'],
  });
  await ReportService.add({
    district: 'Yarinacocha', community: 'Yarinacocha',
    symptoms: ['Dolor abdominal', 'Náuseas', 'Vómitos'],
  });
  await ReportService.add({
    district: 'Manantay', community: 'Manantay',
    symptoms: ['Fiebre', 'Dolor detrás de ojos', 'Sarpullido'],
  });
  await ReportService.add({
    district: 'Callería', community: 'Pucallpa',
    symptoms: ['Dolor de garganta'],
  });

  const now = new Date();
  await MedicationService.add({
    name: 'Paracetamol', dosage: '500mg', frequency: 'Cada 8 horas',
    schedule: ['08:00', '16:00', '22:00'], active: true, notes: '',
  });
  await MedicationService.add({
    name: 'Ibuprofeno', dosage: '400mg', frequency: 'Cada 12 horas',
    schedule: ['08:00', '20:00'], active: true, notes: '',
  });
  await MedicationService.add({
    name: 'Suero Oral', dosage: '1 sobre', frequency: 'Cada 6 horas',
    schedule: ['06:00', '12:00', '18:00', '00:00'], active: true, notes: '',
  });

  const campaignService = CampaignService;
  await campaignService.save({
    id: 'cam1', title: 'Vacunación contra el Dengue', description: 'Campaña nacional de vacunación en Loreto',
    objective: 'Vacunar al 80% de la población objetivo', type: 'vaccination',
    status: 'active', target: 'age_group', targetCriteria: { ageGroup: '5-60' },
    startDate: '2026-07-01', endDate: '2026-09-30',
    coverage: 45, participants: 22500, targetParticipants: 50000,
    createdAt: '2026-06-15', updatedAt: '2026-07-17', createdBy: 'admin',
    resources: [], metrics: { impressions: 150000, reach: 85000, engagement: 12000, conversions: 4500 },
  });
  await campaignService.save({
    id: 'cam2', title: 'Prevención del Cólera', description: 'Campaña de prevención tras lluvias intensas',
    objective: 'Reducir riesgo de brote', type: 'prevention',
    status: 'active', target: 'district', targetCriteria: { district: 'Callería' },
    startDate: '2026-07-10', endDate: '2026-08-10',
    coverage: 30, participants: 12000, targetParticipants: 40000,
    createdAt: '2026-07-05', updatedAt: '2026-07-17', createdBy: 'admin',
    resources: [], metrics: { impressions: 45000, reach: 28000, engagement: 5600, conversions: 1200 },
  });
  await campaignService.save({
    id: 'cam3', title: 'Semana de la Salud Mental', description: 'Actividades y charlas sobre salud mental',
    objective: 'Concientizar sobre salud mental', type: 'awareness',
    status: 'active', target: 'general',
    startDate: '2026-08-01', endDate: '2026-08-07',
    coverage: 0, participants: 3400, targetParticipants: 10000,
    createdAt: '2026-07-10', updatedAt: '2026-07-17', createdBy: 'admin',
    resources: [], metrics: { impressions: 25000, reach: 18000, engagement: 8900, conversions: 3400 },
  });

  const courseService = CourseService;
  await courseService.save({
    id: 'c1', title: 'Prevención del Dengue', description: 'Curso completo sobre prevención del dengue',
    summary: 'Aprende todo sobre el dengue', category: 'disease_prevention', level: 'basic',
    status: 'published', duration: 60, lessons: [
      { id: 'l1', courseId: 'c1', title: 'Introducción al Dengue', content: '', type: 'text', duration: 10, order: 1, completed: false },
      { id: 'l2', courseId: 'c1', title: 'Síntomas y Diagnóstico', content: '', type: 'video', duration: 15, order: 2, completed: false },
      { id: 'l3', courseId: 'c1', title: 'Prevención en el Hogar', content: '', type: 'text', duration: 10, order: 3, completed: false },
    ],
    enrolledCount: 45, completedCount: 28, rating: 4.5, tags: ['dengue', 'prevención', 'mosquito'],
    createdAt: '2026-06-01', updatedAt: '2026-07-01',
  });
  await courseService.save({
    id: 'c2', title: 'Primeros Auxilios Básicos', description: 'Aprende técnicas básicas de emergencia',
    summary: 'Salva vidas', category: 'first_aid', level: 'basic',
    status: 'published', duration: 45, lessons: [
      { id: 'l4', courseId: 'c2', title: 'Evaluación de la Escena', content: '', type: 'text', duration: 10, order: 1, completed: false },
      { id: 'l5', courseId: 'c2', title: 'RCP Básico', content: '', type: 'video', duration: 20, order: 2, completed: false },
    ],
    enrolledCount: 120, completedCount: 89, rating: 4.8, tags: ['primeros auxilios', 'emergencia', 'rcp'],
    createdAt: '2026-05-15', updatedAt: '2026-06-20',
  });

  await DocumentService.save({
    id: 'd1', title: 'Protocolo Nacional de Dengue', description: 'Protocolo oficial de atención',
    category: 'protocol', access: 'public', fileUrl: '', fileType: 'pdf', fileSize: 2400,
    author: 'MINSA', publisher: 'Ministerio de Salud', publishDate: '2026-01-15', version: '3.2',
    tags: ['dengue', 'protocolo', 'oficial'], downloadCount: 1230, relatedDocuments: [],
  });
  await DocumentService.save({
    id: 'd2', title: 'Reporte Epidemiológico Q2 2026', description: 'Reporte trimestral de vigilancia',
    category: 'report', access: 'public', fileUrl: '', fileType: 'pdf', fileSize: 5600,
    author: 'DIRESA Ucayali', publisher: 'DIRESA', publishDate: '2026-07-01', version: '1.0',
    tags: ['reporte', 'epidemiología'], downloadCount: 456, relatedDocuments: [],
  });

  await AsyncStorage.setItem('@saludconecta/seed_executed', 'true');
}
