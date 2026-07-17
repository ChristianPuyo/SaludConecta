import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useReports } from '../../context/ReportsContext';
import { RiskBadge } from '../../components/RiskBadge';
import { colors, borderRadius, spacing, typography } from '../../theme/colors';
import { DISEASE_LABELS, DISEASE_COLORS, type DiseaseType } from '../../data/mockData';
import type { CitizenTabParamList } from '../../navigation/CitizenNavigator';

type Nav = BottomTabNavigationProp<CitizenTabParamList, 'Home'>;

function AnimatedSection({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: object }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }, style]}>
      {children}
    </Animated.View>
  );
}

export function CitizenHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { reports } = useReports();
  const lastReport = reports[0];

  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(30)).current;
  const heroScale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(heroSlide, { toValue: 0, friction: 8, useNativeDriver: true }),
      Animated.spring(heroScale, { toValue: 1, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const totalReports = reports.length;
  const highRisk = reports.filter((r) => r.risk === 'alto').length;
  const latestWeek = reports.filter((r) => {
    const d = new Date(r.date);
    const now = new Date();
    return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <Animated.View style={[styles.hero, {
        opacity: heroFade,
        transform: [{ translateY: heroSlide }, { scale: heroScale }],
      }]}>
        {/* Decorative circles */}
        <View style={styles.heroDecorCircle1} />
        <View style={styles.heroDecorCircle2} />

        <View style={styles.heroContent}>
          <View style={styles.heroTextSection}>
            <View style={styles.greetingRow}>
              <Text style={styles.greeting}>Hola</Text>
              <Text style={styles.waveEmoji}>👋</Text>
            </View>
            <Text style={styles.heroTitle}>Guardian Salud AI</Text>
            <Text style={styles.heroSubtitle}>Cuidando de tu comunidad</Text>
          </View>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarRing}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={24} color="#fff" />
              </View>
            </View>
            <View style={styles.avatarDot} />
          </View>
        </View>
      </Animated.View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        {[
          { icon: 'document-text', value: totalReports, label: 'Reportes', bg: '#F0FDFA', iconBg: '#CCFBF1', color: colors.primary },
          { icon: 'time', value: latestWeek, label: 'Esta semana', bg: '#FFFBEB', iconBg: '#FDE68A', color: colors.warning },
          { icon: highRisk > 0 ? 'warning' : 'checkmark-circle', value: highRisk, label: 'Riesgo alto', bg: highRisk > 0 ? '#FEE2E2' : '#DCFCE7', iconBg: highRisk > 0 ? '#FCA5A5' : '#86EFAC', color: highRisk > 0 ? colors.danger : colors.success },
        ].map((stat, i) => (
          <AnimatedSection key={i} delay={200 + i * 100}>
            <View style={[styles.statCard, { backgroundColor: stat.bg }]}>
              <View style={[styles.statIconWrap, { backgroundColor: stat.iconBg }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={[styles.statNumber, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          </AnimatedSection>
        ))}
      </View>

      {/* Risk Card */}
      <AnimatedSection delay={500}>
        <View style={styles.riskCard}>
          <View style={styles.riskCardHeader}>
            <View style={styles.riskCardIconWrap}>
              <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.riskCardTitle}>Riesgo en tu distrito</Text>
              <Text style={styles.riskCardHint}>Callería · Últimos 7 días</Text>
            </View>
          </View>
          <View style={styles.riskCardContent}>
            <RiskBadge level="medio" size="lg" />
          </View>
        </View>
      </AnimatedSection>

      {/* Last Report */}
      {lastReport && (
        <AnimatedSection delay={600}>
          <View style={styles.lastReportCard}>
            <View style={styles.lastReportHeader}>
              <View style={styles.lastReportIconWrap}>
                <Ionicons name="time-outline" size={16} color={colors.primary} />
              </View>
              <Text style={styles.lastReportDate}>Último reporte · {lastReport.date}</Text>
            </View>
            <View style={styles.lastReportMeta}>
              {lastReport.diseaseType && (
                <View style={[styles.diseaseTag, { backgroundColor: DISEASE_COLORS[lastReport.diseaseType] + '15' }]}>
                  <Text style={[styles.diseaseTagText, { color: DISEASE_COLORS[lastReport.diseaseType] }]}>
                    {DISEASE_LABELS[lastReport.diseaseType]}
                  </Text>
                </View>
              )}
              <RiskBadge level={lastReport.risk} size="sm" />
            </View>
            <Text style={styles.lastReportSymptoms}>{lastReport.symptoms.join(' · ')}</Text>
            {lastReport.riskExplanation && (
              <View style={styles.explanationRow}>
                <Ionicons name="bulb-outline" size={14} color={colors.warning} />
                <Text style={styles.lastReportExplanation}>{lastReport.riskExplanation}</Text>
              </View>
            )}
          </View>
        </AnimatedSection>
      )}

      {/* Quick Actions */}
      <AnimatedSection delay={700}>
        <Text style={styles.sectionTitle}>Accesos rápidos</Text>
      </AnimatedSection>
      <View style={styles.actionsRow}>
        {[
          { icon: 'add-circle', label: 'Reportar', sublabel: 'síntomas', bg: '#FEE2E2', color: colors.danger, screen: 'ReportSymptoms' as const },
          { icon: 'megaphone', label: 'Ver', sublabel: 'campañas', bg: '#EDE9FE', color: colors.info, screen: 'Campaigns' as const },
          { icon: 'document-text', label: 'Mis', sublabel: 'reportes', bg: '#DBEAFE', color: colors.secondary, screen: 'MyReports' as const },
        ].map((action, i) => (
          <AnimatedSection key={action.screen} delay={800 + i * 100} style={{ flex: 1 }}>
            <Pressable
              style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
              onPress={() => navigation.navigate(action.screen)}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: action.bg }]}>
                <Ionicons name={action.icon as any} size={28} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
              <Text style={styles.actionSublabel}>{action.sublabel}</Text>
            </Pressable>
          </AnimatedSection>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 40 },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    overflow: 'hidden',
    ...colors.shadowPrimary,
  },
  heroDecorCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroDecorCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTextSection: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  greeting: { fontSize: typography.lg, fontWeight: '600', color: colors.primaryMuted },
  waveEmoji: { fontSize: 20 },
  heroTitle: { fontSize: typography.xxl, fontWeight: '900', color: '#fff', marginTop: spacing.xs },
  heroSubtitle: { fontSize: typography.md, color: 'rgba(153, 246, 228, 0.8)', marginTop: spacing.xs },
  avatarContainer: {
    position: 'relative',
  },
  avatarRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4ADE80',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  statNumber: { fontSize: typography.xxl, fontWeight: '900' },
  statLabel: { fontSize: typography.xs, color: colors.textSecondary, fontWeight: '600', textAlign: 'center' },
  riskCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadowMd,
  },
  riskCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  riskCardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskCardTitle: { fontSize: typography.base, fontWeight: '700', color: colors.textPrimary },
  riskCardHint: { fontSize: typography.xs, color: colors.textSecondary, marginTop: 2 },
  riskCardContent: { gap: spacing.sm },
  lastReportCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadowSm,
    gap: spacing.md,
  },
  lastReportHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  lastReportIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastReportDate: { fontSize: typography.sm, color: colors.textSecondary, fontWeight: '600' },
  lastReportMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  diseaseTag: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  diseaseTagText: { fontSize: typography.xs, fontWeight: '700' },
  lastReportSymptoms: { fontSize: typography.base, color: colors.textPrimary, fontWeight: '600' },
  explanationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: '#FFFBEB',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  lastReportExplanation: { fontSize: typography.sm, color: colors.textSecondary, fontStyle: 'italic', lineHeight: 18, flex: 1 },
  sectionTitle: { fontSize: typography.lg, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  actionsRow: { flexDirection: 'row', gap: spacing.md },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadowSm,
  },
  actionCardPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  actionIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionLabel: { fontSize: typography.base, fontWeight: '700', color: colors.textPrimary },
  actionSublabel: { fontSize: typography.xs, color: colors.textSecondary },
});
