import type { RiskLevel } from '../../types/health';

export interface Recommendation {
  id: string;
  reportId: string;
  title: string;
  description: string;
  priority: 'baja' | 'media' | 'alta';
  category: 'accion' | 'consejo' | 'urgencia';
  createdAt: string;
}

const RISK_RECOMMENDATIONS: Record<RiskLevel, Array<Omit<Recommendation, 'id' | 'reportId' | 'createdAt'>>> = {
  bajo: [
    { title: 'Monitorear síntomas', description: 'Observa si los síntomas evolucionan en las próximas 24 horas.', priority: 'baja', category: 'consejo' },
    { title: 'Descanso e hidratación', description: 'Permanece en casa, toma abundante agua y evita esfuerzos físicos.', priority: 'baja', category: 'consejo' },
    { title: 'Evitar automedicación', description: 'No tomes medicamentos sin consultar a un profesional de salud.', priority: 'baja', category: 'consejo' },
    { title: 'Lavado de manos frecuente', description: 'Lávate las manos con agua y jabón para prevenir contagios.', priority: 'baja', category: 'consejo' },
  ],
  medio: [
    { title: 'Acudir al centro de salud', description: 'Visita tu posta o centro de salud más cercano para una evaluación profesional.', priority: 'media', category: 'accion' },
    { title: 'Aislamiento preventivo', description: 'Evita el contacto con otras personas mientras tengas síntomas activos.', priority: 'media', category: 'accion' },
    { title: 'Monitorear temperatura', description: 'Toma tu temperatura cada 4 horas y registra cualquier cambio significativo.', priority: 'media', category: 'accion' },
    { title: 'Usar mascarilla', description: 'Si debes salir, usa mascarilla para proteger a los demás.', priority: 'media', category: 'consejo' },
  ],
  alto: [
    { title: 'Buscar atención urgente', description: 'Dirígete al centro de salud más cercano de inmediato. No esperes.', priority: 'alta', category: 'urgencia' },
    { title: 'Llamar a emergencias', description: 'Si los síntomas son graves, llama al 911 o a la línea de emergencia local (106 SAMU).', priority: 'alta', category: 'urgencia' },
    { title: 'No automedicarse', description: 'No tomes ningún medicamento sin supervisión médica. Puede empeorar tu condición.', priority: 'alta', category: 'consejo' },
    { title: 'Aislarse completamente', description: 'Permanece en una habitación separada y usa mascarilla si hay otras personas.', priority: 'alta', category: 'accion' },
    { title: 'Ir acompañado', description: 'Si es posible, acude al centro de salud acompañado de un familiar.', priority: 'media', category: 'accion' },
  ],
};

export class RecommendationEngine {
  static generateForReport(reportId: string, risk: RiskLevel): Recommendation[] {
    const items = RISK_RECOMMENDATIONS[risk];
    const now = new Date().toISOString();
    return items.map((item, i) => ({
      ...item,
      id: `${reportId}-rec-${i}`,
      reportId,
      createdAt: now,
    }));
  }

  static getEmergencyMessage(risk: RiskLevel): string | null {
    if (risk === 'alto') {
      return '🚨 Tu reporte indica riesgo ALTO. Busca atención médica URGENTE. Llama al 106 (SAMU) o 911.';
    }
    if (risk === 'medio') {
      return '⚠️ Tu reporte indica riesgo MEDIO. Te recomendamos acudir a un centro de salud en las próximas horas.';
    }
    return null;
  }
}
