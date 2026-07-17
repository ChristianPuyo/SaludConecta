import type { Recommendation } from '../models/recommendation';
import type { RiskLevel } from '../types/health';
import type { RecommendationPriority } from '../models/recommendation';

const RECOMMENDATIONS_BY_RISK: Record<RiskLevel, Array<{ title: string; description: string; priority: RecommendationPriority }>> = {
  bajo: [
    { title: 'Monitorear síntomas', description: 'Observa si los síntomas evolucionan en las próximas 24 horas.', priority: 'baja' },
    { title: 'Descanso e hidratación', description: 'Permanece en casa, toma abundante agua y evita esfuerzos físicos.', priority: 'baja' },
    { title: 'Evitar automedicación', description: 'No tomes medicamentos sin consultar a un profesional de salud.', priority: 'baja' },
  ],
  medio: [
    { title: 'Acudir al centro de salud', description: 'Visita tu posta o centro de salud más cercano para una evaluación.', priority: 'media' },
    { title: 'Aislamiento preventivo', description: 'Evita el contacto con otras personas mientras tengas síntomas.', priority: 'media' },
    { title: 'Monitorear temperatura', description: 'Toma tu temperatura cada 4 horas y registra cualquier cambio.', priority: 'media' },
    { title: 'No automedicarse', description: 'Acude a un médico antes de tomar cualquier medicamento.', priority: 'media' },
  ],
  alto: [
    { title: 'Buscar atención urgente', description: 'Dirígete al centro de salud más cercano de inmediato.', priority: 'alta' },
    { title: 'Llamar a emergencias', description: 'Si los síntomas son graves, llama al 911 o a la línea de emergencia local.', priority: 'alta' },
    { title: 'No automedicarse', description: 'No tomes ningún medicamento sin supervisión médica.', priority: 'alta' },
    { title: 'Evitar contacto', description: 'Permanece aislado y usa mascarilla si estás con otras personas.', priority: 'alta' },
    { title: 'Llevar acompañante', description: 'Si es posible, acude al centro de salud acompañado.', priority: 'alta' },
  ],
};

export const RecommendationService = {
  generateForRisk(reportId: string, risk: RiskLevel): Recommendation[] {
    const items = RECOMMENDATIONS_BY_RISK[risk];
    return items.map((item, i) => ({
      id: `${reportId}-rec-${i}`,
      reportId,
      ...item,
      createdAt: new Date().toISOString(),
    }));
  },
};
