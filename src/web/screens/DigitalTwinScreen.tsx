/**
 * DigitalTwinScreen - Gemelo digital de distritos que replica indicadores de salud en tiempo real.
 * Muestra población, índice de riesgo, indicadores clave (dengue, vacunación, agua potable, desnutrición) y predicciones.
 * Permite seleccionar entre distintos distritos para comparar su estado sanitario y proyecciones.
 */
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { PageHeader, MetricRow, DataCard, StatusBadge, Timeline } from '../components/ReusableComponents';
import type { DigitalTwin, HealthIndicator } from '../../models/simulation';

const mockTwins: DigitalTwin[] = [
  {
    id: 'dt1', districtId: 'Callería', name: 'Callería',
    population: 84500,
    healthIndicators: [
      { name: 'Casos de Dengue', value: 45, baseline: 30, trend: 'up', status: 'critical' },
      { name: 'Tasa Vacunación', value: 68, baseline: 80, trend: 'down', status: 'warning' },
      { name: 'Acceso Agua Potable', value: 82, baseline: 85, trend: 'stable', status: 'good' },
      { name: 'Desnutrición Infantil', value: 12, baseline: 15, trend: 'down', status: 'good' },
    ],
    riskScore: 68,
    predictions: [
      { metric: 'Casos de Dengue', currentValue: 45, predictedValue: 78, confidence: 85, timeframe: '30 días' },
      { metric: 'Ocupación Hospitalaria', currentValue: 62, predictedValue: 81, confidence: 78, timeframe: '30 días' },
    ],
    lastUpdated: '2026-07-17',
  },
  {
    id: 'dt2', districtId: 'Yarinacocha', name: 'Yarinacocha',
    population: 62300,
    healthIndicators: [
      { name: 'Casos de Dengue', value: 28, baseline: 25, trend: 'stable', status: 'good' },
      { name: 'Tasa Vacunación', value: 75, baseline: 80, trend: 'up', status: 'good' },
      { name: 'Acceso Agua Potable', value: 78, baseline: 85, trend: 'stable', status: 'warning' },
      { name: 'Desnutrición Infantil', value: 15, baseline: 15, trend: 'stable', status: 'warning' },
    ],
    riskScore: 42,
    predictions: [
      { metric: 'Casos de Dengue', currentValue: 28, predictedValue: 35, confidence: 82, timeframe: '30 días' },
    ],
    lastUpdated: '2026-07-17',
  },
];

const indicatorColors: Record<string, string> = {
  good: colors.success, warning: colors.warning, critical: colors.danger,
};

export function DigitalTwinScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [selectedId, setSelectedId] = useState('dt1');
  const twin = mockTwins.find(t => t.id === selectedId) || mockTwins[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Gemelo Digital'} subtitle={subtitle || `Última actualización: ${twin.lastUpdated}`} />

      <View style={styles.selectorRow}>
        {mockTwins.map(t => (
          <Pressable
            key={t.id}
            style={[styles.selectorChip, selectedId === t.id && styles.selectorChipActive]}
            onPress={() => setSelectedId(t.id)}
          >
            <Text style={[styles.selectorText, selectedId === t.id && styles.selectorTextActive]}>{t.name}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.districtTitle}>{twin.name}</Text>
      <DataCard title="Población" value={twin.population.toLocaleString()} icon="people" color={colors.primary} />

      <View style={styles.riskGauge}>
        <Text style={styles.riskLabel}>Índice de Riesgo</Text>
        <View style={styles.gaugeBar}>
          <View style={[styles.gaugeFill, { width: `${twin.riskScore}%`, backgroundColor: twin.riskScore > 60 ? colors.danger : twin.riskScore > 40 ? colors.warning : colors.success }]} />
        </View>
        <Text style={[styles.riskValue, { color: twin.riskScore > 60 ? colors.danger : twin.riskScore > 40 ? colors.warning : colors.success }]}>
          {twin.riskScore}/100
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Indicadores de Salud</Text>
      {twin.healthIndicators.map((indicator, i) => (
        <View key={i} style={styles.indicatorRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.indicatorName}>{indicator.name}</Text>
            <View style={styles.indicatorBar}>
              <View style={[styles.indicatorFill, { width: `${Math.min(100, (indicator.value / indicator.baseline) * 100)}%` }]} />
            </View>
          </View>
          <StatusBadge
            label={`${indicator.value}`}
            status={indicator.status === 'critical' ? 'danger' : indicator.status === 'warning' ? 'warning' : 'success'}
          />
        </View>
      ))}

      <Text style={styles.sectionTitle}>Predicciones</Text>
      {twin.predictions.map((pred, i) => (
        <View key={i} style={styles.predictionCard}>
          <View style={styles.predictionHeader}>
            <Text style={styles.predictionMetric}>{pred.metric}</Text>
            <StatusBadge label={`${pred.confidence}% confianza`} status={pred.confidence > 80 ? 'success' : 'warning'} />
          </View>
          <View style={styles.predictionValues}>
            <View style={styles.predValueBox}>
              <Text style={styles.predLabel}>Actual</Text>
              <Text style={styles.predCurrent}>{pred.currentValue}</Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
            <View style={styles.predValueBox}>
              <Text style={styles.predLabel}>Predicción</Text>
              <Text style={styles.predFuture}>{pred.predictedValue}</Text>
            </View>
          </View>
          <Text style={styles.predTimeframe}>Próximos {pred.timeframe}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40, gap: 12 },
  selectorRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  selectorChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  selectorChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  selectorText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  selectorTextActive: { color: '#fff' },
  districtTitle: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  riskGauge: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border, gap: 8 },
  riskLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase' },
  gaugeBar: { height: 12, backgroundColor: colors.border, borderRadius: 6, overflow: 'hidden' },
  gaugeFill: { height: '100%', borderRadius: 6 },
  riskValue: { fontSize: 28, fontWeight: '800', textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: 12 },
  indicatorRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border },
  indicatorName: { fontSize: 13, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  indicatorBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  indicatorFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  predictionCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 10 },
  predictionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  predictionMetric: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  predictionValues: { flexDirection: 'row', alignItems: 'center', gap: 12, justifyContent: 'center' },
  predValueBox: { alignItems: 'center', gap: 2 },
  predLabel: { fontSize: 11, color: colors.textSecondary },
  predCurrent: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  predFuture: { fontSize: 24, fontWeight: '800', color: colors.warning },
  predTimeframe: { fontSize: 11, color: colors.textSecondary, textAlign: 'center' },
});
