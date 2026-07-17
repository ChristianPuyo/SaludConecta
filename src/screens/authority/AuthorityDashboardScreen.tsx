import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { HealthApiService } from '../../services/healthApi';
import { useReports } from '../../context/ReportsContext';
import { useLanguage } from '../../context/LanguageContext';
import type { DistrictRisk } from '../../data/mockData';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const RISK_COLOR: Record<string, string> = {
  alto: colors.danger,
  medio: colors.warning,
  bajo: colors.success,
};

export function AuthorityDashboardScreen() {
  const [risks, setRisks] = useState<DistrictRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  // Use real reports from context for accurate total count
  const { reports } = useReports();

  useEffect(() => {
    (async () => {
      try {
        const data = await HealthApiService.getDistrictRisks();
        setRisks(data);
      } catch (error) {
        console.error('Error fetching dashboard risks:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Real metrics derived from live data
  const totalReports = reports.length;
  const alertDistricts = risks.filter((d) => d.risk === 'alto').length;
  const maxCases = risks.length > 0 ? Math.max(...risks.map((d) => d.cases)) : 1;

  // Count high-risk reports from citizen data
  const highRiskReports = reports.filter((r) => r.risk === 'alto').length;
  const mediumRiskReports = reports.filter((r) => r.risk === 'medio').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t.dash_title}</Text>
      <Text style={styles.subtitle}>{t.dash_subtitle}</Text>

      {/* Main KPI Row */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Ionicons name="document-text-outline" size={20} color={colors.primary} />
          <Text style={styles.kpiNumber}>{totalReports}</Text>
          <Text style={styles.kpiLabel}>{t.dash_kpi_reports}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Ionicons name="warning-outline" size={20} color={colors.danger} />
          <Text style={[styles.kpiNumber, { color: colors.danger }]}>{alertDistricts}</Text>
          <Text style={styles.kpiLabel}>{t.dash_kpi_alert_districts}</Text>
        </View>
        <View style={styles.kpiCard}>
          <Ionicons name="map-outline" size={20} color={colors.secondary} />
          <Text style={styles.kpiNumber}>{risks.length}</Text>
          <Text style={styles.kpiLabel}>{t.dash_kpi_monitored}</Text>
        </View>
      </View>

      {/* Risk breakdown from real reports */}
      {totalReports > 0 && (
        <View style={styles.riskBreakdownCard}>
          <Text style={styles.sectionTitle}>{t.dash_risk_breakdown_title}</Text>
          <Text style={styles.sectionSubtitle}>{t.dash_risk_breakdown_subtitle(totalReports)}</Text>
          <View style={styles.riskBreakdownRow}>
            <View style={styles.riskBreakdownItem}>
              <View style={[styles.riskDot, { backgroundColor: colors.danger }]} />
              <Text style={styles.riskBreakdownCount}>{highRiskReports}</Text>
              <Text style={styles.riskBreakdownLabel}>{t.dash_risk_high}</Text>
            </View>
            <View style={styles.riskBreakdownItem}>
              <View style={[styles.riskDot, { backgroundColor: colors.warning }]} />
              <Text style={styles.riskBreakdownCount}>{mediumRiskReports}</Text>
              <Text style={styles.riskBreakdownLabel}>{t.dash_risk_medium}</Text>
            </View>
            <View style={styles.riskBreakdownItem}>
              <View style={[styles.riskDot, { backgroundColor: colors.success }]} />
              <Text style={styles.riskBreakdownCount}>
                {totalReports - highRiskReports - mediumRiskReports}
              </Text>
              <Text style={styles.riskBreakdownLabel}>{t.dash_risk_low}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Bar chart by district */}
      <Text style={styles.sectionTitle}>{t.dash_district_chart_title}</Text>
      <View style={styles.card}>
        {risks.map((district) => (
          <View key={district.district} style={styles.barRow}>
            <Text style={styles.barLabel} numberOfLines={1}>{district.district}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${(district.cases / maxCases) * 100}%`,
                    backgroundColor: RISK_COLOR[district.risk],
                  },
                ]}
              />
            </View>
            <Text style={styles.barValue}>{district.cases}</Text>
          </View>
        ))}
      </View>

      {/* Predictive AI card */}
      <View style={styles.predictiveCard}>
        <View style={styles.predictiveHeader}>
          <Ionicons name="analytics-outline" size={20} color="#6366F1" />
          <Text style={styles.predictiveTitle}>{t.dash_predictive_title}</Text>
        </View>
        <Text style={styles.predictiveText}>{t.dash_predictive_text}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  content: { padding: 20, gap: 14 },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary },

  kpiRow: { flexDirection: 'row', gap: 10 },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  kpiNumber: { fontSize: 22, fontWeight: '800', color: colors.primary },
  kpiLabel: { fontSize: 10, color: colors.textSecondary, textAlign: 'center', fontWeight: '500' },

  riskBreakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  riskBreakdownRow: { flexDirection: 'row', justifyContent: 'space-around' },
  riskBreakdownItem: { alignItems: 'center', gap: 4 },
  riskDot: { width: 12, height: 12, borderRadius: 6 },
  riskBreakdownCount: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  riskBreakdownLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  sectionSubtitle: { fontSize: 12, color: colors.textSecondary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { width: 90, fontSize: 11, color: colors.textPrimary, fontWeight: '600' },
  barTrack: { flex: 1, height: 10, borderRadius: 999, backgroundColor: colors.background, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 999 },
  barValue: { width: 26, fontSize: 12, color: colors.textSecondary, textAlign: 'right', fontWeight: '600' },

  predictiveCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  predictiveHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  predictiveTitle: { fontSize: 15, fontWeight: '700', color: '#4338CA' },
  predictiveText: { fontSize: 13, color: '#4338CA', lineHeight: 19 },
});
