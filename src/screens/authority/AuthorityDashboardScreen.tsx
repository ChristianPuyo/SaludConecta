import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MOCK_DISTRICT_RISK } from '../../data/mockData';
import { colors } from '../../theme/colors';
import { SafeScreen } from '../../components/SafeScreen';
import { Card } from '../../components/Card';

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
    <SafeScreen scrollable contentContainerStyle={styles.content}>
      <Text style={styles.title}>Centro de Análisis</Text>
      <Text style={styles.subtitle}>Vigilancia epidemiológica en tiempo real · Ucayali</Text>

      <View style={styles.kpiRow}>
        <Card style={styles.kpiCard}>
          <Text style={styles.kpiNumber}>{totalCases}</Text>
          <Text style={styles.kpiLabel}>Reportes totales</Text>
        </Card>
        <Card style={styles.kpiCard}>
          <Text style={[styles.kpiNumber, { color: colors.danger }]}>{alertDistricts}</Text>
          <Text style={styles.kpiLabel}>Distritos en alerta</Text>
        </Card>
        <Card style={styles.kpiCard}>
          <Text style={styles.kpiNumber}>{MOCK_DISTRICT_RISK.length}</Text>
          <Text style={styles.kpiLabel}>Monitoreados</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>Incidencia por distrito</Text>
      <Card style={styles.card}>
        {MOCK_DISTRICT_RISK.map((district) => (
          <View key={district.district} style={styles.barRow}>
            <Text style={styles.barLabel}>{district.district}</Text>
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
            <Text style={styles.barValue}>{district.cases}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.predictiveCard} bordered={false}>
        <Text style={styles.predictiveTitle}>🔮 Analítica predictiva</Text>
        <Text style={styles.predictiveText}>
          Basado en patrones históricos, se estima un incremento de casos de dengue en Callería durante las
          próximas semanas.
        </Text>
      </Card>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary },
  kpiRow: { flexDirection: 'row', gap: 10 },
  kpiCard: { flex: 1, padding: 14, alignItems: 'center' },
  kpiNumber: { fontSize: 24, fontWeight: '800', color: colors.primary },
  kpiLabel: { fontSize: 11, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginTop: 4 },
  card: { gap: 12 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { width: 100, fontSize: 12, color: colors.textPrimary, fontWeight: '600' },
  barTrack: { flex: 1, height: 10, borderRadius: 999, backgroundColor: colors.background, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 999 },
  barValue: { width: 28, fontSize: 12, color: colors.textSecondary, textAlign: 'right' },
  predictiveCard: { backgroundColor: colors.infoLight, gap: 6 },
  predictiveTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  predictiveText: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
});

