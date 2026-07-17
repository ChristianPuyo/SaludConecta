/**
 * SmartMapScreen - Mapa interactivo con geolocalización de centros de salud, brotes y recursos disponibles.
 * Utilizado por gestores para monitorear la cobertura sanitaria y eventos en el territorio.
 */
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { RiskBadge, type RiskLevel } from '../../components/RiskBadge';
import { PageHeader, FilterBar, DataCard } from '../components/ReusableComponents';

interface DistrictData {
  name: string;
  risk: RiskLevel;
  cases: number;
  trend: 'up' | 'down' | 'stable';
}

const DISTRICTS: DistrictData[] = [
  { name: 'Callería', risk: 'alto', cases: 45, trend: 'up' },
  { name: 'Yarinacocha', risk: 'medio', cases: 28, trend: 'stable' },
  { name: 'Manantay', risk: 'medio', cases: 32, trend: 'down' },
  { name: 'Nueva Requena', risk: 'bajo', cases: 8, trend: 'stable' },
  { name: 'Campo Verde', risk: 'bajo', cases: 5, trend: 'down' },
];

const TREND_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  up: 'trending-up',
  down: 'trending-down',
  stable: 'remove',
};
const TREND_COLORS: Record<string, string> = {
  up: colors.danger,
  down: colors.success,
  stable: colors.textSecondary,
};

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'alto', label: 'Riesgo Alto' },
  { id: 'medio', label: 'Riesgo Medio' },
  { id: 'bajo', label: 'Riesgo Bajo' },
];

export function SmartMapScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [filter, setFilter] = useState('todos');

  const filtered = DISTRICTS.filter(d => filter === 'todos' || d.risk === filter);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Mapa de Riesgo'} subtitle={subtitle || 'Vista general de distritos'} />

      <View style={styles.overview}>
        {DISTRICTS.map(d => (
          <RiskBadge key={d.name} level={d.risk} />
        ))}
      </View>

      <FilterBar filters={FILTERS} active={filter} onFilter={setFilter} />

      {filtered.map(d => (
        <View key={d.name} style={styles.districtCard}>
          <View style={styles.districtHeader}>
            <Text style={styles.districtName}>{d.name}</Text>
            <RiskBadge level={d.risk} />
          </View>
          <View style={styles.districtStats}>
            <DataCard title="Casos" value={d.cases} icon="people-outline" color={colors.danger} />
            <View style={styles.trendCard}>
              <Ionicons name={TREND_ICONS[d.trend]} size={28} color={TREND_COLORS[d.trend]} />
              <Text style={[styles.trendLabel, { color: TREND_COLORS[d.trend] }]}>
                {d.trend === 'up' ? 'Al alza' : d.trend === 'down' ? 'A la baja' : 'Estable'}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  overview: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  districtCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    gap: 16,
  },
  districtHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  districtName: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  districtStats: { flexDirection: 'row', gap: 12 },
  trendCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 4,
  },
  trendLabel: { fontSize: 12, fontWeight: '600' },
});
