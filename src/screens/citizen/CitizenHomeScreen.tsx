import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useReports } from '../../context/ReportsContext';
import { RiskBadge } from '../../components/RiskBadge';
import { colors, shadows } from '../../theme/colors';
import { DISEASE_LABELS, DISEASE_COLORS } from '../../data/mockData';
import type { CitizenTabParamList } from '../../navigation/CitizenNavigator';
import { Ionicons } from '@expo/vector-icons';

type Nav = BottomTabNavigationProp<CitizenTabParamList, 'Home'>;

export function CitizenHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { reports } = useReports();
  const lastReport = reports[0];

  const totalReports = reports.length;
  const highRisk = reports.filter((r) => r.risk === 'alto').length;
  const latestWeek = reports.filter((r) => {
    const d = new Date(r.date);
    const now = new Date();
    return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Header */}
      <View style={styles.heroHeader}>
        <View style={styles.heroOverlay}>
          <Text style={styles.greeting}>Hola 👋</Text>
          <Text style={styles.heroTitle}>Guardian Salud AI</Text>
          <Text style={styles.heroSubtitle}>Cuidando de tu comunidad</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderLeftColor: colors.primary }]}>
          <Ionicons name="document-text-outline" size={20} color={colors.primary} />
          <Text style={styles.statNumber}>{totalReports}</Text>
          <Text style={styles.statLabel}>Reportes</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: colors.warning }]}>
          <Ionicons name="time-outline" size={20} color={colors.warning} />
          <Text style={[styles.statNumber, { color: colors.warning }]}>{latestWeek}</Text>
          <Text style={styles.statLabel}>Esta semana</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: highRisk > 0 ? colors.danger : colors.success }]}>
          <Ionicons name={highRisk > 0 ? "alert-circle-outline" : "checkmark-circle-outline"} size={20} color={highRisk > 0 ? colors.danger : colors.success} />
          <Text style={[styles.statNumber, { color: highRisk > 0 ? colors.danger : colors.success }]}>{highRisk}</Text>
          <Text style={styles.statLabel}>Riesgo alto</Text>
        </View>
      </View>

      {/* Riesgo Actual */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Riesgo en tu zona</Text>
        </View>
        <View style={styles.riskInfo}>
          <View>
            <Text style={styles.riskDistrict}>Callería</Text>
            <Text style={styles.riskHint}>Basado en reportes de los últimos 7 días</Text>
          </View>
          <RiskBadge level="medio" size="medium" />
        </View>
      </View>

      {/* Último Reporte */}
      {lastReport && (
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="clipboard-outline" size={20} color={colors.accentPurple} />
            <Text style={styles.sectionTitle}>Tu último reporte</Text>
          </View>
          <View style={styles.reportMeta}>
            <Text style={styles.reportDate}>{lastReport.date}</Text>
            {lastReport.diseaseType && (
              <View style={[styles.diseaseTag, { backgroundColor: DISEASE_COLORS[lastReport.diseaseType] + '20' }]}>
                <Text style={[styles.diseaseTagText, { color: DISEASE_COLORS[lastReport.diseaseType] }]}>
                  {DISEASE_LABELS[lastReport.diseaseType]}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.reportText}>{lastReport.symptoms.join(', ')}</Text>
          {lastReport.riskExplanation && (
            <View style={styles.explanationBox}>
              <Ionicons name="bulb-outline" size={14} color={colors.warning} />
              <Text style={styles.riskExplanation}>{lastReport.riskExplanation}</Text>
            </View>
          )}
          <RiskBadge level={lastReport.risk} />
        </View>
      )}

      {/* Accesos Rápidos */}
      <Text style={styles.quickActionsTitle}>Accesos rápidos</Text>
      <View style={styles.quickActions}>
        <Pressable
          style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
          onPress={() => navigation.navigate('ReportSymptoms')}
        >
          <View style={[styles.actionIconWrap, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
          </View>
          <Text style={styles.actionLabel}>Reportar síntomas</Text>
          <Text style={styles.actionHint}>Registrar nuevos síntomas</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
          onPress={() => navigation.navigate('Campaigns')}
        >
          <View style={[styles.actionIconWrap, { backgroundColor: colors.accentAmber + '15' }]}>
            <Ionicons name="megaphone-outline" size={28} color={colors.accentAmber} />
          </View>
          <Text style={styles.actionLabel}>Campañas</Text>
          <Text style={styles.actionHint}>Recomendaciones IA</Text>
        </Pressable>
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
  greeting: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#fff' },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: -20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    borderLeftWidth: 3,
    ...shadows.medium,
  },
  statNumber: { fontSize: 22, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 10, color: colors.textSecondary, textAlign: 'center', fontWeight: '600' },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 16,
    gap: 10,
    ...shadows.medium,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  riskInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riskDistrict: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  riskHint: { fontSize: 11, color: colors.textSecondary },
  reportMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reportDate: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  diseaseTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  diseaseTagText: { fontSize: 10, fontWeight: '700' },
  reportText: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  explanationBox: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 10,
    alignItems: 'flex-start',
  },
  riskExplanation: { fontSize: 12, color: colors.textSecondary, lineHeight: 17, flex: 1 },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  quickActions: { flexDirection: 'row', gap: 12, paddingHorizontal: 20 },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    gap: 8,
    ...shadows.medium,
  },
  actionCardPressed: { transform: [{ scale: 0.97 }] },
  actionIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  actionHint: { fontSize: 11, color: colors.textSecondary, textAlign: 'center' },
});
