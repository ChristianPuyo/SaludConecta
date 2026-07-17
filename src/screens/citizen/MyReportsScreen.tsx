import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useReports } from '../../context/ReportsContext';
import { useLanguage } from '../../context/LanguageContext';
import { RiskBadge } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import type { SymptomReport } from '../../data/mockData';
import type { Translations } from '../../i18n';

const SYMPTOM_MAP: Partial<Record<string, keyof Translations>> = {
  'Fiebre': 'symptomFever',
  'Dolor muscular': 'symptomMusclePain',
  'Tos': 'symptomCough',
};

const DATE_MAP: Partial<Record<string, keyof Translations>> = {
  'Hace 2 días': 'date2Days',
  'Hace 3 semanas': 'date3Weeks',
};

export function MyReportsScreen() {
  const { reports } = useReports();
  const { t } = useLanguage();

  const translateSymptom = (symptom: string) => {
    const key = SYMPTOM_MAP[symptom];
    return key ? t(key) : symptom;
  };

  const translateDate = (date: string) => {
    const key = DATE_MAP[date];
    return key ? t(key) : date;
  };

  const renderItem = ({ item }: { item: SymptomReport }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardDate}>{translateDate(item.date)}</Text>
        <RiskBadge level={item.risk} />
      </View>
      <Text style={styles.cardDistrict}>{item.district}</Text>
      <Text style={styles.cardSymptoms}>{item.symptoms.map(translateSymptom).join(', ')}</Text>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={reports}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={<Text style={styles.title}>{t('myReports')}</Text>}
      ListEmptyComponent={<Text style={styles.empty}>{t('noReports')}</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, gap: 6, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDate: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  cardDistrict: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardSymptoms: { fontSize: 14, color: colors.textSecondary },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 },
});
