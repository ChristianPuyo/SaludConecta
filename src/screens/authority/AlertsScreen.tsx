import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { HealthApiService } from '../../services/healthApi';
import type { EpidemicAlert } from '../../data/mockData';
import { RiskBadge } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import { useEffect, useState } from 'react';

export function AlertsScreen() {
  const [alerts, setAlerts] = useState<EpidemicAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    (async () => {
      try {
        const data = await HealthApiService.getAlerts();
        setAlerts(data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderItem = ({ item }: { item: EpidemicAlert }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <RiskBadge level={item.risk} />
      </View>
      <Text style={styles.cardDistrict}>{item.district} · {item.date}</Text>
      <Text style={styles.cardDetail}>{item.detail}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={alerts}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>{t.alerts_title}</Text>
          <Text style={styles.subtitle}>{t.alerts_subtitle}</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  content: { padding: 20 },
  header: { marginBottom: 12, gap: 4 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    gap: 6,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  cardDistrict: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  cardDetail: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
});
