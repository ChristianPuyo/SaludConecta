import { Platform } from 'react-native';
import { type SymptomReport } from '../data/mockData';

function generateReportHTML(reports: SymptomReport[]): string {
  const rows = reports.map((report) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #E2E8F0;">${report.date}</td>
      <td style="padding: 8px; border-bottom: 1px solid #E2E8F0;">${report.district}</td>
      <td style="padding: 8px; border-bottom: 1px solid #E2E8F0;">${report.symptoms.join(', ')}</td>
      <td style="padding: 8px; border-bottom: 1px solid #E2E8F0; font-weight: bold; color: ${
        report.risk === 'alto' ? '#DC2626' : report.risk === 'medio' ? '#D97706' : '#16A34A'
      };">${report.risk.toUpperCase()}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; color: #0F172A; }
        h1 { color: #0F766E; font-size: 24px; margin-bottom: 4px; }
        .subtitle { color: #475569; font-size: 14px; margin-bottom: 20px; }
        .kpi-row { display: flex; gap: 16px; margin-bottom: 20px; }
        .kpi { flex: 1; background: #F8FAFC; border-radius: 8px; padding: 12px; text-align: center; }
        .kpi-number { font-size: 24px; font-weight: 800; color: #0F766E; }
        .kpi-label { font-size: 12px; color: #475569; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th { background: #F1F5F9; padding: 8px; text-align: left; font-size: 12px; color: #475569; text-transform: uppercase; }
        .footer { margin-top: 24px; font-size: 11px; color: #94A3B8; text-align: center; }
      </style>
    </head>
    <body>
      <h1>Guardian Salud AI</h1>
      <p class="subtitle">Reporte de Vigilancia Epidemiologica · ${new Date().toLocaleDateString('es-PE')}</p>

      <div class="kpi-row">
        <div class="kpi">
          <div class="kpi-number">${reports.length}</div>
          <div class="kpi-label">Total reportes</div>
        </div>
        <div class="kpi">
          <div class="kpi-number">${reports.filter(r => r.risk === 'alto').length}</div>
          <div class="kpi-label">Riesgo alto</div>
        </div>
        <div class="kpi">
          <div class="kpi-number">${reports.filter(r => r.risk === 'medio').length}</div>
          <div class="kpi-label">Riesgo medio</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Distrito</th>
            <th>Sintomas</th>
            <th>Riesgo</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div class="footer">
        Generado por Guardian Salud AI · SaludConecta · Vigilancia Epidemiologica para la Amazonia
      </div>
    </body>
    </html>
  `;
}

export async function generateReportPDF(reports: SymptomReport[]): Promise<string> {
  if (Platform.OS === 'web') {
    const html = generateReportHTML(reports);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
    return '';
  }

  const Print = require('expo-print');
  const html = generateReportHTML(reports);
  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });
  return uri;
}

export async function shareReportPDF(reports: SymptomReport[]): Promise<void> {
  if (Platform.OS === 'web') {
    await generateReportPDF(reports);
    return;
  }

  const Sharing = require('expo-sharing');
  const uri = await generateReportPDF(reports);
  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: 'Compartir reporte PDF',
    UTI: 'com.adobe.pdf',
  });
}
