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

const RISK_BG: Record<string, string> = {
  alto: colors.dangerLight,
  medio: colors.warningLight,
  bajo: colors.successLight,
};

export function AuthorityDashboardScreen() {
  const totalCases = MOCK_DISTRICT_RISK.reduce((sum, d) => sum + d.cases, 0);
  const alertDistricts = MOCK_DISTRICT_RISK.filter((d) => d.risk === 'alto').length;
  const maxCases = Math.max(...MOCK_DISTRICT_RISK.map((d) => d.cases));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Centro de Analisis</Text>
        <Text style={styles.subtitle}>Vigilancia epidemiologica en tiempo real</Text>
      </View>

      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <View style={[styles.kpiIconWrap, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="documents" size={18} color={colors.primary} />
          </View>
          <Text style={styles.kpiNumber}>{totalCases}</Text>
          <Text style={styles.kpiLabel}>Reportes</Text>
        </View>

        <View style={styles.kpiCard}>
          <View style={[styles.kpiIconWrap, { backgroundColor: colors.dangerLight }]}>
            <Ionicons name="alert-circle" size={18} color={colors.danger} />
          </View>
          <Text style={[styles.kpiNumber, { color: colors.danger }]}>{alertDistricts}</Text>
          <Text style={styles.kpiLabel}>Alerta Alta</Text>
        </View>

        <View style={styles.kpiCard}>
          <View style={[styles.kpiIconWrap, { backgroundColor: colors.secondaryLight }]}>
            <Ionicons name="map" size={18} color={colors.secondary} />
          </View>
          <Text style={styles.kpiNumber}>{MOCK_DISTRICT_RISK.length}</Text>
          <Text style={styles.kpiLabel}>Zonas</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Incidencia por Distrito</Text>
      <View style={styles.chartCard}>
        {MOCK_DISTRICT_RISK.map((district) => (
          <View key={district.district} style={styles.barRow}>
            <View style={styles.barHeader}>
              <View style={styles.barLabelWrap}>
                <View style={[styles.statusIndicator, { backgroundColor: RISK_COLOR[district.risk] }]} />
                <Text style={styles.barLabel}>{district.district}</Text>
              </View>
              <View style={styles.barRight}>
                <View style={[styles.riskMiniBadge, { backgroundColor: RISK_BG[district.risk] }]}>
                  <Text style={[styles.riskMiniText, { color: RISK_COLOR[district.risk] }]}>
                    {district.risk.charAt(0).toUpperCase() + district.risk.slice(1)}
                  </Text>
                </View>
                <Text style={styles.barValue}>{district.cases}</Text>
              </View>
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

      <View style={styles.predictiveCard}>
        <View style={styles.predictiveHeader}>
          <View style={styles.predictiveIconWrap}>
            <Ionicons name="sparkles" size={16} color={colors.secondary} />
          </View>
          <Text style={styles.predictiveTitle}>Analitica Predictiva IA</Text>
        </View>
        <Text style={styles.predictiveText}>
          Basado en patrones de lluvias e historicos estacionales, se proyecta un incremento del 24% en reportes febriles
          compatibles con dengue en Calleria para las proximas 3 semanas. Se recomienda iniciar campanas preventivas.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 14 },
  header: { gap: 2, marginBottom: 2 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: colors.textSecondary },
  kpiRow: { flexDirection: 'row', gap: 8 },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  kpiNumber: { fontSize: 22, fontWeight: '800', color: colors.primary, marginTop: 2 },
  kpiLabel: { fontSize: 11, fontWeight: '600', color: colors.textSecondary, textAlign: 'center' },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.2 },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  barRow: { gap: 6 },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  barLabelWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusIndicator: { width: 8, height: 8, borderRadius: 4 },
  barLabel: { fontSize: 13, color: colors.textPrimary, fontWeight: '700' },
  barRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  riskMiniBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  riskMiniText: { fontSize: 10, fontWeight: '700' },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: colors.borderLight, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  barValue: { fontSize: 13, color: colors.textPrimary, fontWeight: '800', minWidth: 22, textAlign: 'right' },
  predictiveCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  predictiveHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  predictiveIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  predictiveTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  predictiveText: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
});
