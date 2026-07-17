import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_DISTRICT_RISK, MOCK_WEEKLY_EVOLUTION, MOCK_PREDICTIONS, DISEASE_LABELS, DISEASE_COLORS, type DiseaseType } from '../../data/mockData';
import { colors, borderRadius, spacing, typography } from '../../theme/colors';

const RISK_COLOR: Record<string, string> = { alto: colors.danger, medio: colors.warning, bajo: colors.success };
type WeeklyDiseaseKey = 'respiratoria' | 'dengue' | 'diarrea' | 'malaria';
const TRACKED_DISEASES: WeeklyDiseaseKey[] = ['respiratoria', 'dengue', 'diarrea', 'malaria'];

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

export function AuthorityDashboardScreen() {
  const [showPredictions, setShowPredictions] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const totalCases = MOCK_DISTRICT_RISK.reduce((sum, d) => sum + d.cases, 0);
  const alertDistricts = MOCK_DISTRICT_RISK.filter((d) => d.risk === 'alto').length;
  const maxCases = Math.max(...MOCK_DISTRICT_RISK.map((d) => d.cases));
  const latestWeek = MOCK_WEEKLY_EVOLUTION[MOCK_WEEKLY_EVOLUTION.length - 1];
  const prevWeek = MOCK_WEEKLY_EVOLUTION[MOCK_WEEKLY_EVOLUTION.length - 2];
  const trend = latestWeek.totalCases - prevWeek.totalCases;

  const diseaseCounts: Record<string, number> = {};
  MOCK_DISTRICT_RISK.forEach((d) => { d.diseases.forEach((dis) => { diseaseCounts[dis] = (diseaseCounts[dis] || 0) + d.cases; }); });
  const topDisease = Object.entries(diseaseCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Hero Header */}
        <AnimatedSection delay={0}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.title}>Centro de Análisis</Text>
              <Text style={styles.subtitle}>Vigilancia epidemiológica · Ucayali</Text>
            </View>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>EN VIVO</Text>
            </View>
          </View>
        </AnimatedSection>

        {/* KPIs */}
        <View style={styles.kpiRow}>
          {[
            { icon: 'document-text', value: totalCases, label: 'Reportes totales', bg: '#F0FDFA', color: colors.primary },
            { icon: 'warning', value: alertDistricts, label: 'En alerta', bg: colors.dangerMuted, color: colors.danger },
            { icon: trend > 0 ? 'trending-up' : 'trending-down', value: `${trend > 0 ? '+' : ''}${trend}`, label: 'vs semana', bg: trend > 0 ? '#FEE2E2' : '#DCFCE7', color: trend > 0 ? colors.danger : colors.success },
          ].map((kpi, i) => (
            <AnimatedSection key={i} delay={100 + i * 100}>
              <View style={[styles.kpiCard, { backgroundColor: kpi.bg }]}>
                <Ionicons name={kpi.icon as any} size={24} color={kpi.color} />
                <Text style={[styles.kpiNumber, { color: kpi.color }]}>{kpi.value}</Text>
                <Text style={styles.kpiLabel}>{kpi.label}</Text>
              </View>
            </AnimatedSection>
          ))}
        </View>

        {/* Dominant Disease */}
        <AnimatedSection delay={400}>
          <View style={styles.dominantCard}>
            <View style={styles.dominantLeft}>
              <Text style={styles.dominantLabel}>Enfermedad predominante</Text>
              <Text style={styles.dominantValue}>{topDisease ? DISEASE_LABELS[topDisease[0] as DiseaseType] : 'N/A'}</Text>
              <Text style={styles.dominantHint}>{topDisease ? `${topDisease[1]} casos reportados` : ''}</Text>
            </View>
            <View style={[styles.dominantDot, { backgroundColor: topDisease ? DISEASE_COLORS[topDisease[0] as DiseaseType] : '#ccc' }]} />
          </View>
        </AnimatedSection>

        {/* Weekly Evolution */}
        <AnimatedSection delay={500}>
          <Text style={styles.sectionTitle}>📊 Evolución semanal</Text>
        </AnimatedSection>
        <AnimatedSection delay={550}>
          <View style={styles.chartCard}>
            {MOCK_WEEKLY_EVOLUTION.map((week, i) => {
              const barWidth = (week.totalCases / latestWeek.totalCases) * 100;
              const isLatest = i === MOCK_WEEKLY_EVOLUTION.length - 1;
              return (
                <View key={week.week} style={styles.barRow}>
                  <Text style={[styles.barLabel, isLatest && styles.barLabelActive]}>{week.week}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${barWidth}%`, backgroundColor: isLatest ? colors.primary : colors.border }]} />
                  </View>
                  <Text style={[styles.barValue, isLatest && styles.barValueActive]}>{week.totalCases}</Text>
                </View>
              );
            })}
          </View>
        </AnimatedSection>

        {/* Disease Trends */}
        <AnimatedSection delay={650}>
          <Text style={styles.sectionTitle}>📈 Tendencia por enfermedad</Text>
        </AnimatedSection>
        <AnimatedSection delay={700}>
          <View style={styles.trendCard}>
            {TRACKED_DISEASES.map((key) => {
              const label = DISEASE_LABELS[key as DiseaseType];
              const first = MOCK_WEEKLY_EVOLUTION[0][key];
              const last = latestWeek[key];
              const change = last - first;
              return (
                <View key={key} style={styles.trendRow}>
                  <View style={styles.trendLeft}>
                    <View style={[styles.trendDot, { backgroundColor: DISEASE_COLORS[key as DiseaseType] }]} />
                    <Text style={styles.trendLabel}>{label}</Text>
                  </View>
                  <View style={[styles.trendBadge, { backgroundColor: change > 0 ? colors.dangerMuted : colors.successMuted }]}>
                    <Ionicons name={change > 0 ? 'arrow-up' : 'arrow-down'} size={12} color={change > 0 ? colors.danger : colors.success} />
                    <Text style={[styles.trendChange, { color: change > 0 ? colors.danger : colors.success }]}>{Math.abs(change)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </AnimatedSection>

        {/* District Incidence */}
        <AnimatedSection delay={800}>
          <Text style={styles.sectionTitle}>🗺️ Incidencia por distrito</Text>
        </AnimatedSection>
        <AnimatedSection delay={850}>
          <View style={styles.card}>
            {MOCK_DISTRICT_RISK.map((district) => (
              <View key={district.district} style={styles.barRow}>
                <Text style={styles.barLabel}>{district.district}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${(district.cases / maxCases) * 100}%`, backgroundColor: RISK_COLOR[district.risk] }]} />
                </View>
                <Text style={styles.barValue}>{district.cases}</Text>
              </View>
            ))}
          </View>
        </AnimatedSection>

        {/* AI Predictions */}
        <AnimatedSection delay={950}>
          <View style={styles.predictionHeader}>
            <Text style={styles.sectionTitle}>🔮 Analítica predictiva IA</Text>
            <Pressable onPress={() => setShowPredictions(!showPredictions)}>
              <Ionicons name={showPredictions ? 'chevron-up' : 'chevron-down'} size={20} color={colors.primary} />
            </Pressable>
          </View>
        </AnimatedSection>
        {showPredictions && MOCK_PREDICTIONS.map((pred, i) => (
          <AnimatedSection key={pred.id} delay={1000 + i * 100}>
            <View style={styles.predictionCard}>
              <View style={styles.predictionTop}>
                <Text style={styles.predictionTitle}>{pred.title}</Text>
                <View style={styles.confidenceBadge}>
                  <Text style={styles.confidenceText}>{pred.confidence}%</Text>
                </View>
              </View>
              <Text style={styles.predictionText}>{pred.description}</Text>
              <View style={styles.predictionMeta}>
                <Ionicons name="location" size={12} color={colors.textMuted} />
                <Text style={styles.predictionMetaText}>{pred.district} · {DISEASE_LABELS[pred.diseaseType]}</Text>
              </View>
            </View>
          </AnimatedSection>
        ))}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 40 },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xl },
  title: { fontSize: typography.xxxl, fontWeight: '900', color: colors.textPrimary },
  subtitle: { fontSize: typography.md, color: colors.textSecondary, marginTop: spacing.xs },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.dangerMuted, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger },
  liveText: { fontSize: typography.xs, fontWeight: '800', color: colors.danger },
  kpiRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  kpiCard: { flex: 1, borderRadius: borderRadius.xl, padding: spacing.lg, alignItems: 'center', gap: spacing.xs, ...colors.shadowMd },
  kpiNumber: { fontSize: typography.xxxl, fontWeight: '900' },
  kpiLabel: { fontSize: typography.xs, color: colors.textSecondary, fontWeight: '600', textAlign: 'center' },
  dominantCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl, ...colors.shadowMd,
  },
  dominantLeft: { gap: spacing.xs },
  dominantLabel: { fontSize: typography.xs, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase' },
  dominantValue: { fontSize: typography.xl, fontWeight: '800', color: colors.textPrimary },
  dominantHint: { fontSize: typography.sm, color: colors.textSecondary },
  dominantDot: { width: 24, height: 24, borderRadius: 12 },
  sectionTitle: { fontSize: typography.lg, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md, marginTop: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.md, ...colors.shadowMd },
  chartCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.sm, ...colors.shadowMd },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  barLabel: { width: 80, fontSize: typography.sm, color: colors.textMuted, fontWeight: '600' },
  barLabelActive: { color: colors.textPrimary, fontWeight: '700' },
  barTrack: { flex: 1, height: 12, borderRadius: borderRadius.full, backgroundColor: colors.surfaceMuted, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: borderRadius.full },
  barValue: { width: 32, fontSize: typography.sm, color: colors.textMuted, textAlign: 'right', fontWeight: '600' },
  barValueActive: { color: colors.primary, fontWeight: '800' },
  trendCard: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, gap: spacing.md, ...colors.shadowMd },
  trendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trendLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  trendDot: { width: 12, height: 12, borderRadius: 6 },
  trendLabel: { fontSize: typography.md, fontWeight: '600', color: colors.textPrimary },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  trendChange: { fontSize: typography.sm, fontWeight: '800' },
  predictionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg },
  predictionCard: { backgroundColor: colors.infoMuted, borderRadius: borderRadius.xl, padding: spacing.lg, gap: spacing.sm, marginBottom: spacing.md, borderWidth: 1, borderColor: '#DDD6FE' },
  predictionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  predictionTitle: { fontSize: typography.base, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  confidenceBadge: { backgroundColor: colors.info, borderRadius: borderRadius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  confidenceText: { fontSize: typography.xs, fontWeight: '800', color: '#fff' },
  predictionText: { fontSize: typography.sm, color: colors.textSecondary, lineHeight: 20 },
  predictionMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  predictionMetaText: { fontSize: typography.xs, color: colors.textMuted, fontWeight: '600' },
});
