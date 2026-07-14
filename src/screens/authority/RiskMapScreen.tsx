import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MOCK_DISTRICT_RISK, type DiseaseType, DISEASE_LABELS, DISEASE_COLORS } from '../../data/mockData';
import { RiskBadge } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';

const DISEASE_FILTERS: { key: DiseaseType | 'all'; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'respiratoria', label: '🫁 Respiratoria' },
  { key: 'dengue', label: '🦟 Dengue' },
  { key: 'diarrea', label: '💧 Diarrea' },
  { key: 'malaria', label: '🔬 Malaria' },
  { key: 'leptospirosis', label: '🐀 Leptospirosis' },
];

export function RiskMapScreen() {
  const [activeFilter, setActiveFilter] = useState<DiseaseType | 'all'>('all');

  const filteredDistricts = activeFilter === 'all'
    ? MOCK_DISTRICT_RISK
    : MOCK_DISTRICT_RISK.filter((d) => d.diseases.includes(activeFilter));

  const totalCases = filteredDistricts.reduce((sum, d) => sum + d.cases, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Mapa de Riesgo</Text>
      <Text style={styles.subtitle}>
        {activeFilter === 'all'
          ? 'Vista general por distrito en Ucayali'
          : `Filtrado por: ${DISEASE_LABELS[activeFilter]}`}
      </Text>

      {/* Filtros de enfermedad */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <View style={styles.filterRow}>
          {DISEASE_FILTERS.map((f) => {
            const active = activeFilter === f.key;
            return (
              <Pressable
                key={f.key}
                onPress={() => setActiveFilter(f.key)}
                style={[styles.filterBtn, active && styles.filterBtnActive]}
              >
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{f.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Resumen */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total de casos activos</Text>
        <Text style={styles.summaryNumber}>{totalCases}</Text>
        <Text style={styles.summaryHint}>{filteredDistricts.length} distrito(s) con casos</Text>
      </View>

      {/* Leyenda de colores por tipo de enfermedad */}
      <Text style={styles.sectionTitle}>Leyenda por enfermedad</Text>
      <View style={styles.legendGrid}>
        {Object.entries(DISEASE_LABELS).filter(([k]) => k !== 'otra').map(([key, label]) => (
          <View key={key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: DISEASE_COLORS[key as DiseaseType] }]} />
            <Text style={styles.legendText}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Mapa visual simulado */}
      <Text style={styles.sectionTitle}>Mapa de Ucayali</Text>
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapEmoji}>🗺️</Text>
          <Text style={styles.mapText}>Mapa geoespacial interactivo</Text>
          <Text style={styles.mapHint}>Próximamente con react-native-maps</Text>
        </View>
        {/* Marcadores simulados */}
        {MOCK_DISTRICT_RISK.map((d) => (
          <View
            key={d.district}
            style={[
              styles.mapMarker,
              {
                left: `${((d.lng || -74.56) + 75) * 100}%`,
                top: `${((d.lat || -8.35) + 9) * 100}%`,
                backgroundColor: d.risk === 'alto' ? colors.danger : d.risk === 'medio' ? colors.warning : colors.success,
              },
            ]}
          >
            <Text style={styles.markerText}>{d.district.substring(0, 3)}</Text>
          </View>
        ))}
      </View>

      {/* Lista de distritos */}
      <Text style={styles.sectionTitle}>Detalle por distrito</Text>
      {filteredDistricts.map((district) => (
        <View key={district.district} style={styles.card}>
          <View style={styles.cardLeft}>
            <Text style={styles.cardTitle}>{district.district}</Text>
            <Text style={styles.cardSubtitle}>{district.cases} casos activos</Text>
            <View style={styles.diseaseTags}>
              {district.diseases.map((d) => (
                <View key={d} style={[styles.diseaseTag, { backgroundColor: DISEASE_COLORS[d] + '20' }]}>
                  <Text style={[styles.diseaseTagText, { color: DISEASE_COLORS[d] }]}>{DISEASE_LABELS[d]}</Text>
                </View>
              ))}
            </View>
          </View>
          <RiskBadge level={district.risk} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 10 },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 4 },
  filterScroll: { marginBottom: 4 },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
  },
  filterBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  filterTextActive: { color: '#fff' },
  summaryCard: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', gap: 4,
  },
  summaryLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase' },
  summaryNumber: { fontSize: 32, fontWeight: '800', color: colors.primary },
  summaryHint: { fontSize: 12, color: colors.textSecondary },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginTop: 8 },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 999 },
  legendText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  mapContainer: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: colors.border, height: 200, position: 'relative', overflow: 'hidden',
  },
  mapPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  mapEmoji: { fontSize: 40 },
  mapText: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  mapHint: { fontSize: 11, color: colors.textSecondary },
  mapMarker: {
    position: 'absolute', width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff',
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4,
  },
  markerText: { fontSize: 8, fontWeight: '800', color: '#fff' },
  card: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: colors.border, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
  },
  cardLeft: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardSubtitle: { fontSize: 12, color: colors.textSecondary },
  diseaseTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  diseaseTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  diseaseTagText: { fontSize: 10, fontWeight: '600' },
});
