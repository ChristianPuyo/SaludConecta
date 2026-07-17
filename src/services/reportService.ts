import type { SymptomReport } from '../models/report';
import type { RiskLevel, ReportStatus } from '../types/health';
import { StorageService } from './storage';

const KEY = 'reports';

function classifyRisk(symptomCount: number, hasFever: boolean): RiskLevel {
  if (symptomCount >= 3 && hasFever) return 'alto';
  if (symptomCount >= 2) return 'medio';
  return 'bajo';
}

function suggestDiagnosis(symptoms: string[], risk: RiskLevel): string {
  const s = symptoms.map((x) => x.toLowerCase());
  if (s.includes('fiebre') && s.includes('dolor muscular')) return 'Posible dengue';
  if (s.includes('tos') && s.includes('fiebre')) return 'Posible infección respiratoria';
  if (s.includes('diarrea') && s.includes('vómitos')) return 'Posible infección gastrointestinal';
  if (risk === 'alto') return 'Requiere evaluación médica urgente';
  if (risk === 'medio') return 'Posible infección leve';
  return 'Síntomas leves — monitorear';
}

export const ReportService = {
  async getAll(): Promise<SymptomReport[]> {
    return (await StorageService.get<SymptomReport[]>(KEY)) ?? [];
  },

  async add(data: {
    district: string;
    community: string;
    symptoms: string[];
    age?: number;
    sex?: string;
  }): Promise<SymptomReport> {
    const reports = await this.getAll();
    const hasFever = data.symptoms.includes('Fiebre');
    const risk = classifyRisk(data.symptoms.length, hasFever);

    const report: SymptomReport = {
      id: Date.now().toString(),
      date: 'Hoy',
      timestamp: Date.now(),
      district: data.district || 'Callería',
      community: data.community || '',
      symptoms: data.symptoms,
      risk,
      diagnosis: suggestDiagnosis(data.symptoms, risk),
      status: 'pendiente',
      age: data.age,
      sex: data.sex,
    };

    reports.unshift(report);
    await StorageService.set(KEY, reports);
    return report;
  },

  async updateStatus(id: string, status: ReportStatus): Promise<void> {
    const reports = await this.getAll();
    const idx = reports.findIndex((r) => r.id === id);
    if (idx !== -1) {
      reports[idx].status = status;
      await StorageService.set(KEY, reports);
    }
  },

  async getByDistrict(district: string): Promise<SymptomReport[]> {
    const all = await this.getAll();
    return all.filter((r) => r.district === district);
  },

  async getRecent(days: number = 7): Promise<SymptomReport[]> {
    const all = await this.getAll();
    const cutoff = Date.now() - days * 86400000;
    return all.filter((r) => r.timestamp >= cutoff);
  },
};
