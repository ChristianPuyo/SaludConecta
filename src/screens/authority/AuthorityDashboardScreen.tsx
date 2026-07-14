import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useReports } from '../../context/ReportsContext';
import { colors, shadows } from '../../theme/colors';

const RISK_COLOR: Record<string, string> = {
  alto: colors.danger,
  medio: colors.warning,
  bajo: colors.success,
};

export function AuthorityDashboardScreen() {
  const { districtRisks } = useReports();
  const totalCases = districtRisks.reduce((sum, d) => sum + d.cases, 0);
  const alertDistricts = districtRisks.filter((d) => d.risk === 'alto').length;
  const maxCases = Math.max(...districtRisks.map((d) => d.cases));

  const kpis = [
    { label: 'Casos Totales', value: totalCases, icon: 'document-text-outline' as const, color: colors.primary, bg: colors.primaryLight },
    { label: 'En Alerta', value: alertDistricts, icon: 'alert-circle-outline' as const, color: colors.danger, bg: colors.dangerLight },
    { label: 'Monitoreados', value: districtRisks.length, icon: 'map-outline' as const, color: colors.secondary, bg: colors.secondaryLight },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Centro de Análisis</Text>
        <Text style={styles.subtitle}>Vigilancia epidemiológica en tiempo real · Región Ucayali</Text>
      </View>

      <View style={styles.kpiRow}>
        {kpis.map((kpi) => (
          <View key={kpi.label} style={styles.kpiCard}>
            <View style={[styles.kpiIconWrap, { backgroundColor: kpi.bg }]}>
              <Ionicons name={kpi.icon} size={18} color={kpi.color} />
            </View>
            <Text style={[styles.kpiNumber, kpi.color === colors.danger && { color: colors.danger }]}>{kpi.value}</Text>
            <Text style={styles.kpiLabel}>{kpi.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Distribución por Distrito</Text>
      <View style={styles.card}>
        {districtRisks.map((district) => (
          <View key={district.district} style={styles.barRow}>
            <View style={styles.barInfo}>
              <Text style={styles.barLabel}>{district.district}</Text>
              <Text style={styles.barValue}>{district.cases} casos</Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${maxCases > 0 ? (district.cases / maxCases) * 100 : 0}%`,
                    backgroundColor: RISK_COLOR[district.risk],
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.predictiveCard}>
        <View style={styles.predictiveHeader}>
          <Ionicons name="sparkles" size={18} color={colors.secondary} />
          <Text style={styles.predictiveTitle}>Analítica Predictiva (IA)</Text>
        </View>
        <Text style={styles.predictiveText}>
          Basado en reportes acumulados y factores estacionales, se estima una tendencia al alza de brotes febriles en el distrito de Callería en las próximas 2 semanas. Se recomienda intensificar control de vectores.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  header: { gap: 4 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: colors.textSecondary },
  kpiRow: { flexDirection: 'row', gap: 10 },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 4,
    ...shadows.sm,
  },
  kpiIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  kpiNumber: { fontSize: 22, fontWeight: '900', color: colors.textPrimary, letterSpacing: -0.5 },
  kpiLabel: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, textAlign: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, marginTop: 8, marginLeft: 2 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 16,
    ...shadows.sm,
  },
  barRow: { gap: 6 },
  barInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  barLabel: { fontSize: 13, color: colors.textPrimary, fontWeight: '700' },
  barValue: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  barTrack: { height: 8, borderRadius: 99, backgroundColor: colors.background, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 99 },
  predictiveCard: {
    backgroundColor: colors.secondaryLight,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E0F2FE',
    gap: 8,
    ...shadows.sm,
  },
  predictiveHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  predictiveTitle: { fontSize: 14, fontWeight: '800', color: colors.secondary, textTransform: 'uppercase', letterSpacing: 0.3 },
  predictiveText: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, fontWeight: '500' },
});

