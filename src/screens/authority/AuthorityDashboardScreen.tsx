import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_DISTRICT_RISK } from '../../data/mockData';
import { colors } from '../../theme/colors';

const RISK_COLOR: Record<string, string> = {
  alto: colors.danger,
  medio: colors.warning,
  bajo: colors.success,
};

export function AuthorityDashboardScreen() {
  const totalCases = MOCK_DISTRICT_RISK.reduce((sum, d) => sum + d.cases, 0);
  const alertDistricts = MOCK_DISTRICT_RISK.filter((d) => d.risk === 'alto').length;
  const maxCases = Math.max(...MOCK_DISTRICT_RISK.map((d) => d.cases));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.title}>Centro de Análisis</Text>
        <Text style={styles.subtitle}>Vigilancia epidemiológica en tiempo real · Ucayali</Text>
      </View>

      {/* KPI Cards Board */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Ionicons name={"documents-outline" as any} size={20} color={colors.primary} />
          <Text style={styles.kpiNumber}>{totalCases}</Text>
          <Text style={styles.kpiLabel}>Reportes Totales</Text>
        </View>

        <View style={styles.kpiCard}>
          <Ionicons name={"alert-circle-outline" as any} size={20} color={colors.danger} />
          <Text style={[styles.kpiNumber, { color: colors.danger }]}>{alertDistricts}</Text>
          <Text style={styles.kpiLabel}>En Alerta Alta</Text>
        </View>

        <View style={styles.kpiCard}>
          <Ionicons name={"map-outline" as any} size={20} color={colors.secondary} />
          <Text style={styles.kpiNumber}>{MOCK_DISTRICT_RISK.length}</Text>
          <Text style={styles.kpiLabel}>Zonas Activas</Text>
        </View>
      </View>

      {/* Bar Chart Section */}
      <Text style={styles.sectionTitle}>Incidencia por Distrito</Text>
      <View style={styles.chartCard}>
        {MOCK_DISTRICT_RISK.map((district) => (
          <View key={district.district} style={styles.barRow}>
            <View style={styles.barHeader}>
              <View style={styles.barLabelWrap}>
                <View style={[styles.statusIndicator, { backgroundColor: RISK_COLOR[district.risk] }]} />
                <Text style={styles.barLabel}>{district.district}</Text>
              </View>
              <Text style={styles.barValue}>{district.cases} casos</Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${(district.cases / maxCases) * 100}%`,
                    backgroundColor: RISK_COLOR[district.risk],
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Predictive Analytical Report */}
      <View style={styles.predictiveCard}>
        <View style={styles.predictiveHeader}>
          <Ionicons name={"sparkles" as any} size={20} color={colors.secondary} />
          <Text style={styles.predictiveTitle}>🔮 Analítica Predictiva IA</Text>
        </View>
        <Text style={styles.predictiveText}>
          Basado en patrones de lluvias e históricos estacionales, se proyecta un incremento del 24% en reportes febriles compatibles con dengue en **Callería** para las próximas 3 semanas. Se recomienda iniciar campañas preventivas focalizadas.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  header: { gap: 4, marginVertical: 4 },
  title: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: colors.textSecondary },
  kpiRow: { flexDirection: 'row', gap: 10 },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  kpiNumber: { fontSize: 24, fontWeight: '800', color: colors.primary, marginTop: 2 },
  kpiLabel: { fontSize: 11, fontWeight: '600', color: colors.textSecondary, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginTop: 6, letterSpacing: -0.2 },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  barRow: { gap: 6 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  barLabelWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusIndicator: { width: 8, height: 8, borderRadius: 4 },
  barLabel: { fontSize: 14, color: colors.textPrimary, fontWeight: '700' },
  barTrack: { height: 10, borderRadius: 5, backgroundColor: '#F1F5F9', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  barValue: { fontSize: 13, color: colors.textSecondary, fontWeight: '700' },
  predictiveCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 20,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  predictiveHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  predictiveTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  predictiveText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
});
