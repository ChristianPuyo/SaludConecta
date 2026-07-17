/**
 * EpidemiologicalObservatoryScreen - Observatorio epidemiológico que presenta reportes de salud clasificados por nivel de riesgo.
 * Muestra métricas clave (total, alto/medio/bajo riesgo), distribución por distrito, síntomas más reportados y una línea de tiempo.
 * Utilizada por personal de salud pública para vigilancia basada en datos. Carga datos desde ReportService y permite filtrar por período.
 */
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { PageHeader, MetricRow, FilterBar, DataCard, StatusBadge, Timeline } from '../components/ReusableComponents';
import { ReportService } from '../../services/reportService';
import { RiskBadge } from '../../components/RiskBadge';

const PERIODS = [
  { id: '7d', label: '7 días' },
  { id: '30d', label: '30 días' },
  { id: '90d', label: '90 días' },
  { id: '1y', label: '1 año' },
];

export function EpidemiologicalObservatoryScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [reports, setReports] = useState<any[]>([]);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    ReportService.getAll().then(setReports).catch(() => {});
  }, []);

  const now = Date.now();
  const periodMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
  const days = periodMap[period] || 30;
  const cutoff = now - days * 86400000;

  const filtered = reports.filter(r => r.timestamp >= cutoff);
  const total = filtered.length;
  const highRisk = filtered.filter(r => r.risk === 'alto').length;
  const mediumRisk = filtered.filter(r => r.risk === 'medio').length;
  const lowRisk = filtered.filter(r => r.risk === 'bajo').length;

  const districtCounts: Record<string, { total: number; high: number }> = {};
  filtered.forEach(r => {
    const d = r.district || 'Desconocido';
    if (!districtCounts[d]) districtCounts[d] = { total: 0, high: 0 };
    districtCounts[d].total++;
    if (r.risk === 'alto') districtCounts[d].high++;
  });
  const districtList = Object.entries(districtCounts)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.total - a.total);

  const symptomCounts: Record<string, number> = {};
  filtered.forEach(r => r.symptoms?.forEach((s: string) => { symptomCounts[s] = (symptomCounts[s] || 0) + 1; }));
  const topSymptom = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1])[0];

  const alerts = districtList.filter(d => d.high > 2).slice(0, 3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Observatorio Epidemiológico'} subtitle={subtitle || 'Vigilancia basada en datos'} />

      <FilterBar filters={PERIODS} active={period} onFilter={setPeriod} />

      <MetricRow
        metrics={[
          { label: 'Total Reportes', value: total, color: colors.primary },
          { label: 'Alto Riesgo', value: highRisk, color: colors.danger },
          { label: 'Riesgo Medio', value: mediumRisk, color: colors.warning },
          { label: 'Bajo Riesgo', value: lowRisk, color: colors.success },
        ]}
      />

      {topSymptom && (
        <DataCard title="Síntoma más reportado" value={topSymptom[0]} subtitle={`${topSymptom[1]} reportes`} icon="pulse" color={colors.danger} />
      )}

      <Text style={styles.sectionTitle}>Alerta por Distrito</Text>
      {alerts.length === 0 ? (
        <View style={styles.card}><Text style={styles.cardText}>Sin alertas activas en este período</Text></View>
      ) : (
        alerts.map((d, i) => (
          <View key={i} style={styles.alertCard}>
            <RiskBadge level="alto" />
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>{d.name}</Text>
              <Text style={styles.alertDesc}>{d.high} casos de alto riesgo • {d.total} totales</Text>
            </View>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>Reportes por Distrito</Text>
      {districtList.map((d, i) => (
        <View key={i} style={styles.districtRow}>
          <Text style={styles.districtName}>{d.name}</Text>
          <View style={styles.districtBar}>
            <View style={[styles.districtBarFill, { width: `${(d.total / Math.max(...districtList.map(x => x.total))) * 100}%` }]} />
          </View>
          <Text style={styles.districtCount}>{d.total}</Text>
        </View>
      ))}

      <Timeline items={filtered.slice(0, 5).map(r => ({
        date: r.date,
        title: r.diagnosis || 'Reporte registrado',
        description: `${r.symptoms?.join(', ')} • ${r.district || 'Sin distrito'}`,
        icon: r.risk === 'alto' ? 'warning' as const : 'checkmark-circle' as const,
      }))} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40, gap: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: 20, marginBottom: 8 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  cardText: { fontSize: 14, color: colors.textSecondary },
  alertCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  alertTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  alertDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  districtRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  districtName: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, width: 120 },
  districtBar: { flex: 1, height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  districtBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  districtCount: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, width: 40, textAlign: 'right' },
});
