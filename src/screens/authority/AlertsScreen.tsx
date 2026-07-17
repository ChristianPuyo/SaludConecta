import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MOCK_ALERTS, type EpidemicAlert } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';
import { RiskBadge } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import type { Translations } from '../../i18n';

const ALERT_TITLE_MAP: Partial<Record<string, keyof Translations>> = {
  'Posible brote de dengue': 'alertDengue',
  'Incremento de casos respiratorios': 'alertRespiratory',
};

const ALERT_DETAIL_MAP: Partial<Record<string, keyof Translations>> = {
  '35 reportes de fiebre en los últimos 7 días dentro del mismo sector.': 'alertDengueDetail',
  '18 reportes de tos y fiebre en la última semana.': 'alertRespiratoryDetail',
};

const ALERT_DATE_MAP: Partial<Record<string, keyof Translations>> = {
  'Hoy, 08:12': 'dateTodayTime',
  'Ayer, 19:40': 'dateYesterday',
};

export function AlertsScreen() {
  const { t } = useLanguage();

  const translateAlertField = (value: string, map: Partial<Record<string, keyof Translations>>) => {
    const key = map[value];
    return key ? t(key) : value;
  };

  const renderItem = ({ item }: { item: EpidemicAlert }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{translateAlertField(item.title, ALERT_TITLE_MAP)}</Text>
        <RiskBadge level={item.risk} />
      </View>
      <Text style={styles.cardDistrict}>{item.district} · {translateAlertField(item.date, ALERT_DATE_MAP)}</Text>
      <Text style={styles.cardDetail}>{translateAlertField(item.detail, ALERT_DETAIL_MAP)}</Text>
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
        <View style={styles.header}>
          <Text style={styles.title}>{t('alerts')}</Text>
          <Text style={styles.subtitle}>
            {t('alertsSubtitle')}
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  header: { marginBottom: 12, gap: 4 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12, gap: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  cardDistrict: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  cardDetail: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
});
