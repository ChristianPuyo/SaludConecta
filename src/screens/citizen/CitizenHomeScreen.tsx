import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useReports } from '../../context/ReportsContext';
import { useLanguage } from '../../context/LanguageContext';
import { RiskBadge } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import type { CitizenTabParamList } from '../../navigation/CitizenNavigator';

type Nav = BottomTabNavigationProp<CitizenTabParamList, 'Home'>;

export function CitizenHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { reports } = useReports();
  const { t } = useLanguage();
  const lastReport = reports[0];

  const PREVENTIVE_CAMPAIGNS = [
    {
      id: 'c1',
      title: t.home_campaign1_title,
      district: 'Callería',
      text: t.home_campaign1_text,
      icon: 'megaphone-outline',
      type: t.home_campaign_alert_type,
      color: colors.danger,
    },
    {
      id: 'c2',
      title: t.home_campaign2_title,
      district: 'Ucayali Rural',
      text: t.home_campaign2_text,
      icon: 'shield-outline',
      type: t.home_campaign_info_type,
      color: colors.secondary,
    },
  ];

  const HEALTH_TIPS = [
    { text: t.home_tip1 },
    { text: t.home_tip2 },
    { text: t.home_tip3 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t.home_greeting}</Text>
          <Text style={styles.subtitle}>{t.home_subtitle}</Text>
        </View>
        <Ionicons name="notifications-outline" size={24} color={colors.primary} />
      </View>

      {/* Main District Risk Card */}
      <View style={styles.riskCard}>
        <View style={styles.riskHeader}>
          <View>
            <Text style={styles.cardLabel}>{t.home_district_risk_label}</Text>
            <Text style={styles.districtName}>Callería, Ucayali</Text>
          </View>
          <RiskBadge level="medio" />
        </View>
        <Text style={styles.riskHint}>{t.home_risk_hint}</Text>
      </View>

      {/* Quick Action Navigation Grid */}
      <View style={styles.actionsGrid}>
        <Pressable
          style={[styles.actionButton, { borderColor: colors.primary }]}
          onPress={() => navigation.navigate('ReportSymptoms')}
        >
          <View style={[styles.actionIconWrap, { backgroundColor: '#F0FDFA' }]}>
            <Ionicons name="clipboard-outline" size={24} color={colors.primary} />
          </View>
          <Text style={styles.actionTitle}>{t.home_action_report_title}</Text>
          <Text style={styles.actionDesc}>{t.home_action_report_desc}</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, { borderColor: colors.secondary }]}
          onPress={() => navigation.navigate('Scanner')}
        >
          <View style={[styles.actionIconWrap, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="camera-outline" size={24} color={colors.secondary} />
          </View>
          <Text style={styles.actionTitle}>{t.home_action_scanner_title}</Text>
          <Text style={styles.actionDesc}>{t.home_action_scanner_desc}</Text>
        </Pressable>
      </View>

      {/* Last Report Status */}
      {lastReport && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t.home_last_report_label(lastReport.date)}</Text>
          <View style={styles.reportRow}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.cardText} numberOfLines={1}>
                {lastReport.symptoms.join(', ')}
              </Text>
              <Text style={styles.reportSub}>{lastReport.district}</Text>
            </View>
            <RiskBadge level={lastReport.risk} />
          </View>
        </View>
      )}

      {/* Active Preventive Campaigns */}
      <Text style={styles.sectionLabel}>{t.home_campaigns_section}</Text>
      {PREVENTIVE_CAMPAIGNS.map((camp) => (
        <View key={camp.id} style={styles.campaignCard}>
          <View style={styles.campaignHeader}>
            <View style={styles.campaignTitleRow}>
              <Ionicons name={camp.icon as any} size={20} color={camp.color} />
              <Text style={styles.campaignTitle}>{camp.title}</Text>
            </View>
            <Text style={[styles.campaignType, { color: camp.color, borderColor: camp.color }]}>
              {camp.type}
            </Text>
          </View>
          <Text style={styles.campaignText}>{camp.text}</Text>
          <Text style={styles.campaignLocation}>{t.home_campaign_directed(camp.district)}</Text>
        </View>
      ))}

      {/* Amazon Health Tips */}
      <Text style={styles.sectionLabel}>{t.home_tips_section}</Text>
      <View style={styles.tipsCard}>
        {HEALTH_TIPS.map((tip, idx) => (
          <View key={idx} style={styles.tipRow}>
            <Ionicons name="checkbox-outline" size={18} color={colors.success} style={{ marginTop: 2 }} />
            <Text style={styles.tipText}>{tip.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary },
  riskCard: {
    borderRadius: 24,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  riskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  districtName: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginTop: 2 },
  riskHint: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  actionsGrid: { flexDirection: 'row', gap: 12 },
  actionButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    gap: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionIconWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  actionTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  actionDesc: { fontSize: 11, color: colors.textSecondary },
  card: { backgroundColor: colors.surface, borderRadius: 20, padding: 16, gap: 10, borderWidth: 1, borderColor: colors.border },
  reportRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardText: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  reportSub: { fontSize: 12, color: colors.textSecondary },
  sectionLabel: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginTop: 8 },
  campaignCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, gap: 10 },
  campaignHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  campaignTitleRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  campaignTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  campaignType: { fontSize: 10, fontWeight: '700', borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  campaignText: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  campaignLocation: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  tipsCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: colors.border, gap: 12 },
  tipRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  tipText: { fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 18 },
});
