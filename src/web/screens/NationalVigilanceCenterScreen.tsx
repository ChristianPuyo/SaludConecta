/**
 * NationalVigilanceCenterScreen - Centro nacional de vigilancia para el monitoreo de la salud pública a nivel país.
 * Presenta métricas de distritos activos, posibles brotes y alertas de vigilancia filtrables por severidad.
 * Carga datos desde ReportService y muestra una visión consolidada para la toma de decisiones epidemiológicas.
 */
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { PageHeader, MetricRow, FilterBar, DataCard, StatusBadge } from '../components/ReusableComponents';
import { RiskBadge } from '../../components/RiskBadge';
import { ReportService } from '../../services/reportService';
import type { VigilanceAlert } from '../../models/simulation';

const SEVERITY_FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: 'critical', label: 'Críticas' },
  { id: 'high', label: 'Altas' },
  { id: 'medium', label: 'Medias' },
  { id: 'low', label: 'Bajas' },
];

export function NationalVigilanceCenterScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [reports, setReports] = useState<any[]>([]);
  const [severity, setSeverity] = useState('all');

  useEffect(() => {
    ReportService.getAll().then(setReports).catch(() => {});
  }, []);

  const now = Date.now();
  const last7d = reports.filter(r => r.timestamp >= now - 7 * 86400000);
  const last30d = reports.filter(r => r.timestamp >= now - 30 * 86400000);

  const districtMap: Record<string, number> = {};
  last30d.forEach(r => {
    const d = r.district || 'Desconocido';
    districtMap[d] = (districtMap[d] || 0) + 1;
  });
  const activeDistricts = Object.entries(districtMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const outbreakDistricts = activeDistricts.filter(d => d.count > 10);

  const alertsList: VigilanceAlert[] = last7d
    .filter(r => r.risk === 'alto')
    .map((r, i) => ({
      id: `alert-${i}`,
      type: r.diagnosis?.toLowerCase().includes('dengue') ? 'outbreak' : 'spike',
      severity: r.risk === 'alto' ? 'high' as const : 'medium' as const,
      title: r.diagnosis || 'Alerta sanitaria',
      description: r.symptoms?.join(', ') || '',
      district: r.district || 'Desconocido',
      affectedCount: 1,
      timestamp: r.date,
      status: 'new' as const,
      recommendations: ['Monitorear casos', 'Notificar autoridades'],
    }));

  const filtered = severity === 'all' ? alertsList : alertsList.filter(a => {
    const map: Record<string, string> = { critical: 'critical', high: 'high', medium: 'medium', low: 'low' };
    return a.severity === map[severity];
  });

  const severityColor: Record<string, string> = {
    critical: colors.danger, high: colors.warning, medium: colors.warning, low: colors.success,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Centro Nacional de Vigilancia'} subtitle={subtitle || 'Monitoreo nacional de salud pública'} />

      <MetricRow
        metrics={[
          { label: 'Distritos activos', value: activeDistricts.length, color: colors.primary },
          { label: 'Posibles brotes', value: outbreakDistricts.length, color: colors.danger },
          { label: 'Alertas 7 días', value: alertsList.length, color: colors.warning },
          { label: 'Reportes 30 días', value: last30d.length, color: colors.secondary },
        ]}
      />

      <Text style={styles.sectionTitle}>Vista Nacional por Distrito</Text>
      {activeDistricts.length === 0 ? (
        <View style={styles.card}><Text style={styles.cardText}>No hay datos disponibles</Text></View>
      ) : (
        <View style={styles.districtGrid}>
          {activeDistricts.slice(0, 8).map((d, i) => (
            <View key={i} style={styles.districtCard}>
              <Text style={styles.districtName}>{d.name}</Text>
              <RiskBadge level={d.count > 10 ? 'alto' : d.count > 5 ? 'medio' : 'bajo'} />
              <Text style={styles.districtCount}>{d.count} reportes</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.sectionTitle}>Alertas de Vigilancia</Text>
      <FilterBar filters={SEVERITY_FILTERS} active={severity} onFilter={setSeverity} />

      {filtered.length === 0 ? (
        <View style={styles.card}><Text style={styles.cardText}>No hay alertas activas</Text></View>
      ) : (
        filtered.map(a => (
          <View key={a.id} style={[styles.alertCard, { borderLeftColor: severityColor[a.severity], borderLeftWidth: 4 }]}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Text style={styles.alertTitle}>{a.title}</Text>
                <StatusBadge
                  label={a.severity.charAt(0).toUpperCase() + a.severity.slice(1)}
                  status={a.severity === 'critical' || a.severity === 'high' ? 'danger' : 'warning'}
                />
              </View>
              <Text style={styles.alertDesc}>{a.district} • {a.timestamp}</Text>
              <Text style={styles.alertRecommendations}>{a.recommendations.join(' • ')}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: 24, marginBottom: 12 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  cardText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  districtGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  districtCard: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: colors.border, width: '47%', gap: 4, alignItems: 'center',
  },
  districtName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  districtCount: { fontSize: 11, color: colors.textSecondary },
  alertCard: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: colors.border, marginBottom: 8, flexDirection: 'row', alignItems: 'center',
  },
  alertTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  alertDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  alertRecommendations: { fontSize: 11, color: colors.primary, marginTop: 4, fontWeight: '500' },
});
