import { Platform } from 'react-native';
import * as XLSX from 'xlsx';
import { type SymptomReport } from '../data/mockData';

export async function generateReportCSV(reports: SymptomReport[]): Promise<string> {
  const data = reports.map((report) => ({
    Fecha: report.date,
    Distrito: report.district,
    Sintomas: report.symptoms.join(', '),
    Riesgo: report.risk.toUpperCase(),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Reportes');
  const csv = XLSX.utils.sheet_to_csv(ws);

  if (Platform.OS === 'web') {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_salud_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    return url;
  }

  const FileSystem = require('expo-file-system');
  const fileName = `reporte_salud_${Date.now()}.csv`;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;
  await FileSystem.writeAsStringAsync(filePath, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  });
  return filePath;
}

export async function shareReportCSV(reports: SymptomReport[]): Promise<void> {
  if (Platform.OS === 'web') {
    await generateReportCSV(reports);
    return;
  }
  const Sharing = require('expo-sharing');
  const uri = await generateReportCSV(reports);
  await Sharing.shareAsync(uri, {
    mimeType: 'text/csv',
    dialogTitle: 'Compartir reporte CSV',
    UTI: 'public.comma-separated-values-text',
  });
}

export async function generateReportExcel(reports: SymptomReport[]): Promise<string> {
  const data = reports.map((report) => ({
    Fecha: report.date,
    Distrito: report.district,
    Sintomas: report.symptoms.join(', '),
    Riesgo: report.risk.toUpperCase(),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Reportes');

  if (Platform.OS === 'web') {
    const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_salud_${Date.now()}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
    return url;
  }

  const FileSystem = require('expo-file-system');
  const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
  const fileName = `reporte_salud_${Date.now()}.xlsx`;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;
  await FileSystem.writeAsStringAsync(filePath, wbout, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return filePath;
}

export async function shareReportExcel(reports: SymptomReport[]): Promise<void> {
  if (Platform.OS === 'web') {
    await generateReportExcel(reports);
    return;
  }
  const Sharing = require('expo-sharing');
  const uri = await generateReportExcel(reports);
  await Sharing.shareAsync(uri, {
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    dialogTitle: 'Compartir reporte Excel',
    UTI: 'org.openxmlformats.spreadsheetml.sheet',
  });
}
