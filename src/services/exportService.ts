import type { SymptomReport } from '../models/report';
import type { CommunityVisit } from '../models/visit';
import { ReportService } from './reportService';

export const ExportService = {
  async exportReportsToText(): Promise<string> {
    const reports = await ReportService.getAll();
    const lines = [
      '=== HISTORIAL MÉDICO - Guardian Salud AI ===',
      `Exportado: ${new Date().toLocaleDateString()}`,
      '',
      ...reports.map(
        (r) =>
          `[${r.date}] ${r.district} - ${r.symptoms.join(', ')} | Riesgo: ${r.risk} | Diagnóstico: ${r.diagnosis} | Estado: ${r.status}`
      ),
      '',
      `Total de reportes: ${reports.length}`,
    ];
    return lines.join('\n');
  },

  async exportVisitsToText(visits: CommunityVisit[]): Promise<string> {
    const lines = [
      '=== VISITAS COMUNITARIAS - Guardian Salud AI ===',
      `Exportado: ${new Date().toLocaleDateString()}`,
      '',
      ...visits.map(
        (v) =>
          `Paciente: ${v.patientName} | Comunidad: ${v.community} | PA: ${v.bloodPressure} | Glucosa: ${v.glucose} | Temp: ${v.temperature} | Peso: ${v.weight} | Talla: ${v.height} | Sincronizado: ${v.synced ? 'Sí' : 'No'}`
      ),
      '',
      `Total de visitas: ${visits.length}`,
    ];
    return lines.join('\n');
  },

  async download(filename: string, content: string): Promise<void> {
    console.log(`[Export] File "${filename}" ready with ${content.length} chars.`);
  },
};
