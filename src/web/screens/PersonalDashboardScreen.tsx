/**
 * PersonalDashboardScreen - Panel personalizado para el profesional de salud con métricas de desempeño y pacientes asignados.
 * Visible para médicos y personal clínico. Incluye timeline de actividad, indicadores y accesos rápidos.
 */
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { SectionHeader } from '../../components/SectionHeader';
import { MetricRow, PageHeader, Timeline, SectionGrid } from '../components/ReusableComponents';
import { ReportService } from '../../services/reportService';
import { MedicationService } from '../../services/medicationService';
import type { SymptomReport } from '../../models/report';
import type { Medication } from '../../models/medication';

export function PersonalDashboardScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [reports, setReports] = useState<SymptomReport[]>([]);
  const [meds, setMeds] = useState<Medication[]>([]);

  useEffect(() => {
    (async () => {
      const r = await ReportService.getAll();
      setReports(r);
      const m = await MedicationService.getActive();
      setMeds(m);
    })();
  }, []);

  const weeklyReports = reports.filter(r => {
    const weekAgo = Date.now() - 7 * 86400000;
    return r.timestamp >= weekAgo;
  });

  const monthlyReports = reports.filter(r => {
    const monthAgo = Date.now() - 30 * 86400000;
    return r.timestamp >= monthAgo;
  });

  const symptomCounts: Record<string, number> = {};
  reports.forEach(r => r.symptoms?.forEach((s: string) => { symptomCounts[s] = (symptomCounts[s] || 0) + 1; }));
  const topSymptoms = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCount = topSymptoms.length > 0 ? topSymptoms[0][1] : 1;

  const timelineItems = reports.slice(0, 5).map(r => ({
    date: r.date,
    title: r.diagnosis || 'Reporte de síntomas',
    description: r.symptoms?.join(', ') || '',
    icon: r.risk === 'alto' ? 'warning' as const : 'checkmark-circle' as const,
  }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Dashboard Personal'} subtitle={subtitle || 'Tus estadísticas de salud'} />

      <MetricRow
        metrics={[
          { label: 'Esta Semana', value: weeklyReports.length, color: colors.primary },
          { label: 'Este Mes', value: monthlyReports.length, color: colors.secondary },
          { label: 'Total Reportes', value: reports.length, color: colors.warning },
          { label: 'Medicamentos', value: meds.length, color: colors.danger },
        ]}
      />

      <SectionHeader title="Síntomas Frecuentes" />
      <SectionGrid>
        {topSymptoms.map(([symptom, count], i) => (
          <View key={i} style={styles.symptomBar}>
            <Text style={styles.symptomLabel}>{symptom}</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${(count / maxCount) * 100}%` }]} />
            </View>
            <Text style={styles.symptomCount}>{count}</Text>
          </View>
        ))}
      </SectionGrid>

      <SectionHeader title="Actividad Reciente" />
      <Timeline items={timelineItems} />

      <SectionHeader title="Metas" />
      <View style={styles.goals}>
        <View style={styles.goalCard}>
          <Text style={styles.goalValue}>{meds.filter(m => m.active).length}/{meds.length}</Text>
          <Text style={styles.goalLabel}>Adherencia a medicamentos</Text>
        </View>
        <View style={styles.goalCard}>
          <Text style={styles.goalValue}>{reports.length}</Text>
          <Text style={styles.goalLabel}>Días con reporte</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  symptomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  symptomLabel: { fontSize: 13, fontWeight: '500', color: colors.textPrimary, width: 120 },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  symptomCount: { fontSize: 12, color: colors.textSecondary, width: 30, textAlign: 'right' },
  goals: { flexDirection: 'row', gap: 12 },
  goalCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 4,
  },
  goalValue: { fontSize: 28, fontWeight: '800', color: colors.primary },
  goalLabel: { fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
});
