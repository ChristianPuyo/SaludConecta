import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useReports } from '../../context/ReportsContext';
import { colors, borderRadius, spacing, typography } from '../../theme/colors';
import { DISEASE_LABELS, DISEASE_COLORS, type SymptomReport } from '../../data/mockData';

export function MyReportsScreen() {
  const { reports } = useReports();

  const renderItem = ({ item, index }: { item: SymptomReport; index: number }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(25)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 80, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 8, delay: index * 80, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, delay: index * 80, useNativeDriver: true }),
      ]).start();
    }, []);

    const riskColor = item.risk === 'alto' ? colors.danger : item.risk === 'medio' ? colors.warning : colors.success;
    const riskBg = item.risk === 'alto' ? colors.dangerMuted : item.risk === 'medio' ? colors.warningMuted : colors.successMuted;

    return (
      <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }]}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardDateRow}>
              <View style={styles.dateIconWrap}>
                <Ionicons name="calendar-outline" size={14} color={colors.primary} />
              </View>
              <Text style={styles.cardDate}>{item.date}</Text>
            </View>
            <View style={[styles.riskBadge, { backgroundColor: riskBg }]}>
              <Text style={[styles.riskBadgeText, { color: riskColor }]}>
                {item.risk === 'alto' ? '🚨' : item.risk === 'medio' ? '⚠️' : '✓'} {item.risk.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.cardMeta}>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color={colors.textMuted} />
              <Text style={styles.cardDistrict}>{item.district} · {item.community}</Text>
            </View>
            {item.diseaseType && (
              <View style={[styles.diseaseTag, { backgroundColor: DISEASE_COLORS[item.diseaseType] + '15' }]}>
                <Text style={[styles.diseaseTagText, { color: DISEASE_COLORS[item.diseaseType] }]}>
                  {DISEASE_LABELS[item.diseaseType]}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.cardSymptoms}>{item.symptoms.join(' · ')}</Text>
          {item.riskExplanation && (
            <View style={styles.explanationRow}>
              <Ionicons name="bulb-outline" size={14} color={colors.warning} />
              <Text style={styles.riskExplanation}>{item.riskExplanation}</Text>
            </View>
          )}
          {(item.age || item.sex) && (
            <View style={styles.demographicRow}>
              {item.age && <Text style={styles.demographicText}>👤 {item.age} años</Text>}
              {item.sex && <Text style={styles.demographicText}>🚻 {item.sex === 'M' ? 'Masculino' : 'Femenino'}</Text>}
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={reports}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Mis reportes</Text>
          <View style={styles.countBadge}>
            <Ionicons name="document-text" size={16} color={colors.primary} />
            <Text style={styles.countText}>{reports.length} reporte(s)</Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="document-outline" size={48} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Sin reportes</Text>
          <Text style={styles.emptySubtitle}>Tus reportes de síntomas aparecerán aquí</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  title: { fontSize: typography.xxl, fontWeight: '900', color: colors.textPrimary },
  countBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: '#F0FDFA', paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1, borderColor: 'rgba(15, 118, 110, 0.15)' },
  countText: { fontSize: typography.sm, fontWeight: '700', color: colors.primary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...colors.shadowMd,
    gap: spacing.sm,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dateIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDate: { fontSize: typography.sm, color: colors.textMuted, fontWeight: '600' },
  riskBadge: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  riskBadgeText: { fontSize: typography.xs, fontWeight: '800' },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  cardDistrict: { fontSize: typography.base, fontWeight: '700', color: colors.textPrimary },
  diseaseTag: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  diseaseTagText: { fontSize: typography.xs, fontWeight: '700' },
  cardSymptoms: { fontSize: typography.md, color: colors.textSecondary, lineHeight: 20 },
  explanationRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs, backgroundColor: '#FFFBEB', padding: spacing.sm, borderRadius: borderRadius.md },
  riskExplanation: { fontSize: typography.sm, color: colors.textSecondary, fontStyle: 'italic', lineHeight: 18, flex: 1 },
  demographicRow: { flexDirection: 'row', gap: spacing.md },
  demographicText: { fontSize: typography.sm, color: colors.textMuted, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', paddingTop: 60, gap: spacing.md },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: { fontSize: typography.xl, fontWeight: '700', color: colors.textPrimary },
  emptySubtitle: { fontSize: typography.md, color: colors.textSecondary },
});
