import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_ALERTS, type EpidemicAlert } from '../../data/mockData';
import { RiskBadge } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';

const RISK_BG: Record<string, string> = {
  alto: colors.dangerLight,
  medio: colors.warningLight,
  bajo: colors.successLight,
};

const RISK_ICON: Record<string, string> = {
  alto: 'alert-circle',
  medio: 'warning',
  bajo: 'checkmark-circle',
};

export function AlertsScreen() {
  const renderItem = ({ item }: { item: EpidemicAlert }) => (
    <View style={[styles.card, { borderLeftColor: item.risk === 'alto' ? colors.danger : item.risk === 'medio' ? colors.warning : colors.success }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.iconWrap, { backgroundColor: RISK_BG[item.risk] }]}>
            <Ionicons name={RISK_ICON[item.risk] as any} size={16} color={item.risk === 'alto' ? colors.danger : item.risk === 'medio' ? colors.warning : colors.success} />
          </View>
          <View style={styles.cardTitleWrap}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDistrict}>{item.district} - {item.date}</Text>
          </View>
        </View>
        <RiskBadge level={item.risk} />
      </View>
      <Text style={styles.cardDetail}>{item.detail}</Text>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={MOCK_ALERTS}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={
        <View style={styles.headerSection}>
          <View style={styles.headerIcon}>
            <Ionicons name="notifications" size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.title}>Alertas IA</Text>
            <Text style={styles.subtitle}>Patrones detectados automaticamente</Text>
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 10 },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    gap: 8,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, flex: 1 },
  iconWrap: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  cardTitleWrap: { flex: 1, gap: 2 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, lineHeight: 19 },
  cardDistrict: { fontSize: 11, color: colors.textTertiary, fontWeight: '600' },
  cardDetail: { fontSize: 12, color: colors.textSecondary, lineHeight: 18, paddingLeft: 40 },
});
