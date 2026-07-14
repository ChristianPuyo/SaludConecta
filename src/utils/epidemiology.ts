import type { RiskLevel } from '../components/RiskBadge';

/**
 * Clasifica el nivel de riesgo epidemiológico en función de la cantidad de síntomas
 * presentados y de la presencia de fiebre como síntoma de alerta clave.
 * 
 * @param symptomCount Cantidad total de síntomas seleccionados.
 * @param hasFever Indica si el paciente presenta fiebre.
 * @returns 'alto' | 'medio' | 'bajo'
 */
export function classifyRisk(symptomCount: number, hasFever: boolean): RiskLevel {
  if (symptomCount >= 3 && hasFever) return 'alto';
  if (symptomCount >= 2) return 'medio';
  return 'bajo';
}
