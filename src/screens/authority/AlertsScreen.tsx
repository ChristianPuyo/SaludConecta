import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_ALERTS, type EpidemicAlert } from '../../data/mockData';
import { RiskBadge } from '../../components/RiskBadge';
import { colors, shadows } from '../../theme/colors';

const RISK_BORDER_COLOR = {
  bajo: colors.success,
  medio: colors.warning,
  alto: colors.danger,
};

export function AlertsScreen() {
  const renderItem = ({ item }: { item: EpidemicAlert }) => (
    <View style={[styles.card, { borderLeftColor: RISK_BORDER_COLOR[item.risk] }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <Ionicons 
            name="warning" 
            size={18} 
            color={RISK_BORDER_COLOR[item.risk]} 
            style={styles.alertIcon} 
          />
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>
        <RiskBadge level={item.risk} />
      </View>
      <View style={styles.cardInfoRow}>
        <Ionicons name="navigate-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.cardDistrict}>{item.district}</Text>
        <Text style={styles.dotSeparator}>•</Text>
        <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.cardDate}>{item.date}</Text>
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
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Alertas por IA</Text>
          <Text style={styles.subtitle}>
            Patrones epidemiológicos detectados automáticamente a partir de reportes en campo
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 30 },
  header: { marginBottom: 16, gap: 4 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderLeftWidth: 5,
    marginBottom: 12,
    gap: 8,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
    paddingBottom: 8,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  alertIcon: { marginTop: -2 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  cardInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 2 },
  cardDistrict: { fontSize: 12, color: colors.textPrimary, fontWeight: '700' },
  dotSeparator: { fontSize: 12, color: colors.textMuted },
  cardDate: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  cardDetail: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, fontWeight: '500' },
});

