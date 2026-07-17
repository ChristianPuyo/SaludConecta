import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { MOCK_DISTRICT_RISK, type DiseaseType, DISEASE_LABELS, DISEASE_COLORS } from '../../data/mockData';
import { RiskBadge } from '../../components/RiskBadge';
import { colors, borderRadius, spacing, typography } from '../../theme/colors';

const DISEASE_FILTERS: { key: DiseaseType | 'all'; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'respiratoria', label: '🫁 Respiratoria' },
  { key: 'dengue', label: '🦟 Dengue' },
  { key: 'diarrea', label: '💧 Diarrea' },
  { key: 'malaria', label: '🔬 Malaria' },
  { key: 'leptospirosis', label: '🐀 Leptospirosis' },
];

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {children}
    </Animated.View>
  );
}

export function RiskMapScreen() {
  const [activeFilter, setActiveFilter] = useState<DiseaseType | 'all'>('all');

  const filteredDistricts = activeFilter === 'all'
    ? MOCK_DISTRICT_RISK
    : MOCK_DISTRICT_RISK.filter((d) => d.diseases.includes(activeFilter));

  const totalCases = filteredDistricts.reduce((sum, d) => sum + d.cases, 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <AnimatedSection delay={0}>
        <Text style={styles.title}>Mapa de Riesgo</Text>
        <Text style={styles.subtitle}>
          {activeFilter === 'all'
            ? 'Vista general por distrito en Ucayali'
            : `Filtrado por: ${DISEASE_LABELS[activeFilter]}`}
        </Text>
      </AnimatedSection>

      {/* Filtros de enfermedad */}
      <AnimatedSection delay={100}>
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
      </AnimatedSection>

      {/* Resumen */}
      <AnimatedSection delay={200}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total de casos activos</Text>
          <Text style={styles.summaryNumber}>{totalCases}</Text>
          <Text style={styles.summaryHint}>{filteredDistricts.length} distrito(s) con casos</Text>
        </View>
      </AnimatedSection>

      {/* Leyenda de colores por tipo de enfermedad */}
      <AnimatedSection delay={300}>
        <Text style={styles.sectionTitle}>Leyenda por enfermedad</Text>
      </AnimatedSection>
      <AnimatedSection delay={350}>
        <View style={styles.legendGrid}>
          {Object.entries(DISEASE_LABELS).filter(([k]) => k !== 'otra').map(([key, label]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: DISEASE_COLORS[key as DiseaseType] }]} />
              <Text style={styles.legendText}>{label}</Text>
            </View>
          ))}
        </View>
      </AnimatedSection>

      {/* Mapa visual simulado */}
      <AnimatedSection delay={400}>
        <Text style={styles.sectionTitle}>Mapa de Ucayali</Text>
      </AnimatedSection>
      <AnimatedSection delay={450}>
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapEmoji}>🗺️</Text>
            <Text style={styles.mapText}>Mapa geoespacial interactivo</Text>
            <Text style={styles.mapHint}>Próximamente con react-native-maps</Text>
          </View>
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
      </AnimatedSection>

      {/* Lista de distritos */}
      <AnimatedSection delay={550}>
        <Text style={styles.sectionTitle}>Detalle por distrito</Text>
      </AnimatedSection>
      {filteredDistricts.map((district, i) => (
        <AnimatedSection key={district.district} delay={600 + i * 80}>
          <View style={styles.card}>
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
        </AnimatedSection>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 40 },
  title: { fontSize: typography.xxxl, fontWeight: '900', color: colors.textPrimary },
  subtitle: { fontSize: typography.md, color: colors.textSecondary, marginBottom: spacing.sm },
  filterScroll: { marginBottom: 4 },
  filterRow: { flexDirection: 'row', gap: spacing.sm },
  filterBtn: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full,
    borderWidth: 2, borderColor: colors.border, backgroundColor: colors.surface,
  },
  filterBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary, ...colors.shadowPrimary },
  filterText: { fontSize: typography.sm, fontWeight: '600', color: colors.textSecondary },
  filterTextActive: { color: '#fff' },
  summaryCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.xl,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', gap: spacing.xs,
    ...colors.shadowMd,
  },
  summaryLabel: { fontSize: typography.sm, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase' },
  summaryNumber: { fontSize: 36, fontWeight: '900', color: colors.primary },
  summaryHint: { fontSize: typography.sm, color: colors.textSecondary },
  sectionTitle: { fontSize: typography.lg, fontWeight: '700', color: colors.textPrimary, marginTop: spacing.lg, marginBottom: spacing.sm },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: typography.xs, color: colors.textSecondary, fontWeight: '600' },
  mapContainer: {
    backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.border, height: 200, position: 'relative', overflow: 'hidden',
    ...colors.shadowMd,
  },
  mapPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  mapEmoji: { fontSize: 40 },
  mapText: { fontSize: typography.md, fontWeight: '700', color: colors.textPrimary },
  mapHint: { fontSize: typography.xs, color: colors.textSecondary },
  mapMarker: {
    position: 'absolute', width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff',
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4,
  },
  markerText: { fontSize: 8, fontWeight: '800', color: '#fff' },
  card: {
    backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.border, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm,
    ...colors.shadowMd,
  },
  cardLeft: { flex: 1, gap: spacing.xs },
  cardTitle: { fontSize: typography.base, fontWeight: '700', color: colors.textPrimary },
  cardSubtitle: { fontSize: typography.sm, color: colors.textSecondary },
  diseaseTags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.xs },
  diseaseTag: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  diseaseTagText: { fontSize: typography.xs, fontWeight: '600' },
});
