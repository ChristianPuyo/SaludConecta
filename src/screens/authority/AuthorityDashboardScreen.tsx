import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MOCK_DISTRICT_RISK, MOCK_WEEKLY_EVOLUTION, MOCK_PREDICTIONS, DISEASE_LABELS, DISEASE_COLORS, type DiseaseType } from '../../data/mockData';
import { colors, shadows } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const RISK_COLOR: Record<string, string> = {
  alto: colors.danger,
  medio: colors.warning,
  bajo: colors.success,
};

type WeeklyDiseaseKey = 'respiratoria' | 'dengue' | 'diarrea' | 'malaria';
const TRACKED_DISEASES: WeeklyDiseaseKey[] = ['respiratoria', 'dengue', 'diarrea', 'malaria'];

export function AuthorityDashboardScreen() {
  const [showPredictions, setShowPredictions] = useState(true);

  const totalCases = MOCK_DISTRICT_RISK.reduce((sum, d) => sum + d.cases, 0);
  const alertDistricts = MOCK_DISTRICT_RISK.filter((d) => d.risk === 'alto').length;
  const maxCases = Math.max(...MOCK_DISTRICT_RISK.map((d) => d.cases));
  const latestWeek = MOCK_WEEKLY_EVOLUTION[MOCK_WEEKLY_EVOLUTION.length - 1];
  const prevWeek = MOCK_WEEKLY_EVOLUTION[MOCK_WEEKLY_EVOLUTION.length - 2];
  const trend = latestWeek.totalCases - prevWeek.totalCases;

  const diseaseCounts: Record<string, number> = {};
  MOCK_DISTRICT_RISK.forEach((d) => {
    d.diseases.forEach((dis) => {
      diseaseCounts[dis] = (diseaseCounts[dis] || 0) + d.cases;
    });
  });
  const topDisease = Object.entries(diseaseCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Header */}
      <View style={styles.heroHeader}>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Centro de Análisis</Text>
          <Text style={styles.heroSubtitle}>Vigilancia epidemiológica · Ucayali</Text>
        </View>
      </View>

      {/* KPI Cards */}
      <View style={styles.kpiRow}>
        <View style={[styles.kpiCard, { borderTopColor: colors.primary }]}>
          <Ionicons name="document-text-outline" size={22} color={colors.primary} />
          <Text style={styles.kpiNumber}>{totalCases}</Text>
          <Text style={styles.kpiLabel}>Reportes totales</Text>
        </View>
        <View style={[styles.kpiCard, { borderTopColor: colors.danger }]}>
          <Ionicons name="alert-circle-outline" size={22} color={colors.danger} />
          <Text style={[styles.kpiNumber, { color: colors.danger }]}>{alertDistricts}</Text>
          <Text style={styles.kpiLabel}>Distritos en alerta</Text>
        </View>
        <View style={[styles.kpiCard, { borderTopColor: trend > 0 ? colors.danger : colors.success }]}>
          <Ionicons name={trend > 0 ? "trending-up" : "trending-down"} size={22} color={trend > 0 ? colors.danger : colors.success} />
          <Text style={[styles.kpiNumber, { color: trend > 0 ? colors.danger : colors.success }]}>
            {trend > 0 ? '+' : ''}{trend}
          </Text>
          <Text style={styles.kpiLabel}>vs semana ant.</Text>
        </View>
      </View>

      {/* Enfermedad Predominante */}
      <View style={styles.dominantCard}>
        <View style={styles.dominantLeft}>
          <View style={styles.dominantHeader}>
            <Ionicons name="pulse-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.dominantLabel}>Enfermedad predominante</Text>
          </View>
          <Text style={styles.dominantValue}>{topDisease ? DISEASE_LABELS[topDisease[0] as DiseaseType] : 'N/A'}</Text>
          <Text style={styles.dominantHint}>{topDisease ? `${topDisease[1]} casos reportados` : ''}</Text>
        </View>
        <View style={[styles.dominantDot, { backgroundColor: topDisease ? DISEASE_COLORS[topDisease[0] as DiseaseType] : '#ccc' }]} />
      </View>

      {/* Evolución Semanal */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="bar-chart-outline" size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Evolución semanal</Text>
        </View>
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

      {/* Tendencia por Enfermedad */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="git-branch-outline" size={20} color={colors.accentPurple} />
          <Text style={styles.sectionTitle}>Tendencia por enfermedad</Text>
        </View>
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
              <View style={[styles.trendBadge, { backgroundColor: change > 0 ? colors.dangerLight : colors.successLight }]}>
                <Ionicons name={change > 0 ? "arrow-up" : "arrow-down"} size={12} color={change > 0 ? colors.danger : colors.success} />
                <Text style={[styles.trendChange, { color: change > 0 ? colors.danger : colors.success }]}>
                  {Math.abs(change)} casos
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Incidencia por Distrito */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="map-outline" size={20} color={colors.accentBlue} />
          <Text style={styles.sectionTitle}>Incidencia por distrito</Text>
        </View>
        {MOCK_DISTRICT_RISK.map((district) => (
          <View key={district.district} style={styles.barRow}>
            <Text style={styles.barLabel}>{district.district}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { width: `${(district.cases / maxCases) * 100}%`, backgroundColor: RISK_COLOR[district.risk] },
                ]}
              />
            </View>
            <Text style={styles.barValue}>{district.cases}</Text>
          </View>
        ))}
      </View>

      {/* Predicciones IA */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="sparkles" size={20} color={colors.accentPurple} />
          <Text style={styles.sectionTitle}>Analítica predictiva IA</Text>
        </View>
        <Pressable onPress={() => setShowPredictions(!showPredictions)}>
          <Text style={styles.toggleText}>{showPredictions ? 'Ocultar' : 'Mostrar'} predicciones</Text>
        </Pressable>
        {showPredictions && MOCK_PREDICTIONS.map((pred) => (
          <View key={pred.id} style={styles.predictionCard}>
            <View style={styles.predictionHeader}>
              <Text style={styles.predictionTitle}>{pred.title}</Text>
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>{pred.confidence}%</Text>
              </View>
            </View>
            <Text style={styles.predictionText}>{pred.description}</Text>
            <View style={styles.predictionMeta}>
              <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.predictionMetaText}>{pred.district} · {DISEASE_LABELS[pred.diseaseType]}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 24 },
  heroHeader: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroOverlay: { paddingHorizontal: 24, gap: 4 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#fff' },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  kpiRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginTop: -20 },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    borderTopWidth: 3,
    ...shadows.medium,
  },
  kpiNumber: { fontSize: 22, fontWeight: '800', color: colors.primary },
  kpiLabel: { fontSize: 10, color: colors.textSecondary, textAlign: 'center', fontWeight: '600' },
  dominantCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 16,
    ...shadows.medium,
  },
  dominantLeft: { gap: 4 },
  dominantHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dominantLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase' },
  dominantValue: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  dominantHint: { fontSize: 12, color: colors.textSecondary },
  dominantDot: { width: 24, height: 24, borderRadius: 12 },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 16,
    gap: 10,
    ...shadows.medium,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { width: 90, fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  barLabelActive: { color: colors.textPrimary, fontWeight: '700' },
  barTrack: { flex: 1, height: 10, borderRadius: 999, backgroundColor: '#F1F5F9', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 999 },
  barValue: { width: 28, fontSize: 11, color: colors.textSecondary, textAlign: 'right' },
  barValueActive: { color: colors.primary, fontWeight: '700' },
  trendRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  trendLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  trendDot: { width: 10, height: 10, borderRadius: 5 },
  trendLabel: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  trendChange: { fontSize: 11, fontWeight: '700' },
  toggleText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  predictionCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  predictionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  predictionTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  confidenceBadge: {
    backgroundColor: colors.accentPurple,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  confidenceText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  predictionText: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  predictionMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  predictionMetaText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
});
