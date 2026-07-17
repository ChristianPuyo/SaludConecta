import type { RiskLevel } from '../../types/health';

interface DiagnosisRule {
  keywords: string[];
  diagnosis: string;
  minMatch: number;
  priority: number;
}

const RULES: DiagnosisRule[] = [
  { keywords: ['fiebre', 'dolor muscular', 'dolor cabeza'], diagnosis: 'Posible dengue', minMatch: 2, priority: 1 },
  { keywords: ['fiebre', 'tos'], diagnosis: 'Posible infección respiratoria', minMatch: 2, priority: 2 },
  { keywords: ['diarrea', 'vómitos'], diagnosis: 'Posible infección gastrointestinal', minMatch: 2, priority: 3 },
  { keywords: ['tos', 'dificultad', 'respirar'], diagnosis: 'Posible infección respiratoria severa', minMatch: 2, priority: 1 },
  { keywords: ['fiebre', 'escalofríos', 'sudor'], diagnosis: 'Posible malaria', minMatch: 2, priority: 2 },
  { keywords: ['fiebre', 'sarpullido', 'dolor cabeza'], diagnosis: 'Posible dengue con signos de alarma', minMatch: 2, priority: 1 },
  { keywords: ['vómitos', 'diarrea', 'fiebre'], diagnosis: 'Posible infección gastrointestinal aguda', minMatch: 2, priority: 2 },
];

export class DiagnosisEngine {
  static suggest(symptoms: string[], risk: RiskLevel): string {
    const normalized = symptoms.map((s) => s.toLowerCase());

    const matches = RULES
      .map((rule) => ({
        rule,
        matchCount: rule.keywords.filter((kw) => normalized.some((s) => s.includes(kw))).length,
      }))
      .filter((m) => m.matchCount >= m.rule.minMatch)
      .sort((a, b) => a.rule.priority - b.rule.priority);

    if (matches.length > 0) {
      return matches[0].rule.diagnosis;
    }

    if (risk === 'alto') return 'Requiere evaluación médica urgente';
    if (risk === 'medio') return 'Posible infección leve — requiere monitoreo';
    return 'Síntomas leves — monitorear evolución';
  }
}
