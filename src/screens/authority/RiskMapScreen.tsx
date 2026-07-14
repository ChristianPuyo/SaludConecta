import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MOCK_DISTRICT_RISK } from '../../data/mockData';
import { RiskBadge } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import { SafeScreen } from '../../components/SafeScreen';
import { Card } from '../../components/Card';

export function RiskMapScreen() {
  return (
    <SafeScreen scrollable contentContainerStyle={styles.content}>
      <Text style={styles.title}>Mapa de riesgo</Text>
      <Text style={styles.subtitle}>
        Vista previa por distrito. La integración con mapa geoespacial interactivo está en desarrollo.
      </Text>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.danger }]} />
          <Text style={styles.legendText}>Alto</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.warning }]} />
          <Text style={styles.legendText}>Medio</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>Bajo</Text>
        </View>
      </View>

      {MOCK_DISTRICT_RISK.map((district) => (
        <Card key={district.district} style={styles.card}>
          <View>
            <Text style={styles.cardTitle}>{district.district}</Text>
            <Text style={styles.cardSubtitle}>{district.cases} casos activos</Text>
          </View>
          <RiskBadge level={district.risk} />
        </Card>
      ))}
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 12 },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 4 },
  legendRow: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 999 },
  legendText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardSubtitle: { fontSize: 12, color: colors.textSecondary },
});

