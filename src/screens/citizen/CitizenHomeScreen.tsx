import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useReports } from '../../context/ReportsContext';
import { useLanguage } from '../../context/LanguageContext';
import { RiskBadge } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import type { CitizenTabParamList } from '../../navigation/CitizenNavigator';
import type { Translations } from '../../i18n';

type Nav = BottomTabNavigationProp<CitizenTabParamList, 'Home'>;

const SYMPTOM_MAP: Partial<Record<string, keyof Translations>> = {
  'Fiebre': 'symptomFever',
  'Dolor muscular': 'symptomMusclePain',
  'Tos': 'symptomCough',
};

const DATE_MAP: Partial<Record<string, keyof Translations>> = {
  'Hace 2 días': 'date2Days',
  'Hace 3 semanas': 'date3Weeks',
};

export function CitizenHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { reports } = useReports();
  const { t } = useLanguage();
  const lastReport = reports[0];

  const translateSymptom = (symptom: string) => {
    const key = SYMPTOM_MAP[symptom];
    return key ? t(key) : symptom;
  };

  const translateDate = (date: string) => {
    const key = DATE_MAP[date];
    return key ? t(key) : date;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('citizenGreeting')}</Text>
      <Text style={styles.subtitle}>{t('citizenSubtitle')}</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>{t('currentRisk')}</Text>
        <RiskBadge level="medio" />
        <Text style={styles.cardHint}>{t('districtInfo')}</Text>
      </View>

      {lastReport && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t('lastReport')} ({translateDate(lastReport.date)})</Text>
          <Text style={styles.cardText}>{lastReport.symptoms.map(translateSymptom).join(', ')}</Text>
          <RiskBadge level={lastReport.risk} />
        </View>
      )}

      <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('ReportSymptoms')}>
        <Text style={styles.primaryButtonText}>{t('reportSymptoms')}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: 8 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, gap: 8, borderWidth: 1, borderColor: colors.border },
  cardLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase' },
  cardHint: { fontSize: 12, color: colors.textSecondary },
  cardText: { fontSize: 15, color: colors.textPrimary },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
