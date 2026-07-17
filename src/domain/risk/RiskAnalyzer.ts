import type { RiskLevel } from '../../types/health';

export interface RiskInput {
  symptomCount: number;
  hasFever: boolean;
  age?: number;
  hasChronicDiseases?: boolean;
  symptoms: string[];
}

export interface RiskAnalysisResult {
  level: RiskLevel;
  score: number;
  factors: string[];
}

export class RiskAnalyzer {
  static analyze(input: RiskInput): RiskAnalysisResult {
    const factors: string[] = [];
    let score = 0;

    if (input.hasFever) {
      score += 20;
      factors.push('Presencia de fiebre');
    }

    if (input.symptomCount >= 5) {
      score += 30;
      factors.push('Múltiples síntomas (5+)');
    } else if (input.symptomCount >= 3) {
      score += 20;
      factors.push('Múltiples síntomas (3+)');
    } else if (input.symptomCount >= 2) {
      score += 10;
    }

    if (input.hasFever && input.symptomCount >= 3) {
      score += 15;
      factors.push('Fiebre + síntomas múltiples');
    }

    if (input.age && input.age >= 60) {
      score += 10;
      factors.push('Adulto mayor (60+)');
    }

    if (input.age && input.age <= 5) {
      score += 10;
      factors.push('Infante (0-5 años)');
    }

    if (input.hasChronicDiseases) {
      score += 10;
      factors.push('Enfermedad crónica preexistente');
    }

    const dangerSymptoms = ['Dificultad respirar', 'Dolor en el pecho', 'Confusión', 'Desmayo', 'Convulsiones'];
    const hasDanger = input.symptoms.some((s) =>
      dangerSymptoms.some((d) => s.toLowerCase().includes(d.toLowerCase()))
    );
    if (hasDanger) {
      score += 25;
      factors.push('Síntomas de alarma');
    }

    let level: RiskLevel;
    if (score >= 50) {
      level = 'alto';
    } else if (score >= 20) {
      level = 'medio';
    } else {
      level = 'bajo';
    }

    return { level, score, factors };
  }
}
