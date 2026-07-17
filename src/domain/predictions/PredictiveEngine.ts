import type { RiskLevel } from '../../types/health';

export interface DistrictPrediction {
  district: string;
  currentRisk: RiskLevel;
  predictedRisk: RiskLevel;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  casesLastWeek: number;
  predictedCasesNextWeek: number;
  alert: boolean;
  factors: string[];
}

export interface CommunityVulnerability {
  community: string;
  district: string;
  vulnerabilityScore: number;
  vulnerabilityLevel: 'baja' | 'media' | 'alta';
  factors: string[];
}

export class PredictiveEngine {
  static predictTrend(
    district: string,
    casesLast7: number,
    casesPrevious7: number,
    currentRisk: RiskLevel
  ): DistrictPrediction {
    const change = ((casesLast7 - casesPrevious7) / Math.max(casesPrevious7, 1)) * 100;
    const trend = change > 20 ? 'up' : change < -20 ? 'down' : 'stable';

    let predictedRisk: RiskLevel = currentRisk;
    if (trend === 'up' && casesLast7 > 10) {
      predictedRisk = currentRisk === 'bajo' ? 'medio' : 'alto';
    }
    if (trend === 'down' && casesLast7 < 5) {
      predictedRisk = currentRisk === 'alto' ? 'medio' : 'bajo';
    }

    const confidence = Math.min(Math.abs(change) / 100, 0.95);
    const predictedCases = Math.round(casesLast7 * (1 + change / 100));

    const factors: string[] = [];
    if (change > 0) factors.push(`Incremento del ${Math.round(change)}% en la última semana`);
    if (casesLast7 > 20) factors.push('Alta incidencia de casos');
    if (casesPrevious7 === 0 && casesLast7 > 0) factors.push('Nuevos casos detectados');

    const alert = trend === 'up' && predictedRisk === 'alto';

    return {
      district,
      currentRisk,
      predictedRisk,
      trend,
      confidence,
      casesLastWeek: casesLast7,
      predictedCasesNextWeek: Math.max(predictedCases, 0),
      alert,
      factors,
    };
  }

  static calculateVulnerability(
    community: string,
    district: string,
    cases: number,
    population: number,
    hasHealthCenter: boolean,
    distanceToCenterKm: number
  ): CommunityVulnerability {
    const factors: string[] = [];
    let score = 0;

    const incidence = cases / Math.max(population, 1);
    if (incidence > 0.1) {
      score += 30;
      factors.push('Alta incidencia de casos');
    } else if (incidence > 0.05) {
      score += 15;
      factors.push('Incidencia moderada de casos');
    }

    if (!hasHealthCenter) {
      score += 25;
      factors.push('Sin centro de salud en la comunidad');
    }

    if (distanceToCenterKm > 20) {
      score += 20;
      factors.push(`Distancia al centro de salud: ${distanceToCenterKm} km`);
    } else if (distanceToCenterKm > 10) {
      score += 10;
      factors.push('Distancia moderada al centro de salud');
    }

    let vulnerabilityLevel: 'baja' | 'media' | 'alta';
    if (score >= 40) {
      vulnerabilityLevel = 'alta';
    } else if (score >= 20) {
      vulnerabilityLevel = 'media';
    } else {
      vulnerabilityLevel = 'baja';
    }

    return {
      community,
      district,
      vulnerabilityScore: score,
      vulnerabilityLevel,
      factors,
    };
  }
}
