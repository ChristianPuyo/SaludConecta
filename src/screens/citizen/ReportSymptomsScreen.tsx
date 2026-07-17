import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useReports } from '../../context/ReportsContext';
import { useLanguage } from '../../context/LanguageContext';
import { colors } from '../../theme/colors';
import type { RiskLevel } from '../../components/RiskBadge';
import type { CitizenTabParamList } from '../../navigation/CitizenNavigator';

type Nav = BottomTabNavigationProp<CitizenTabParamList, 'ReportSymptoms'>;

const SYMPTOMS_KEYS = ['fever', 'diarrhea', 'cough', 'vomiting', 'musclePain', 'headache'] as const;

function classifyRisk(symptomCount: number, hasFever: boolean): RiskLevel {
  if (symptomCount >= 3 && hasFever) return 'alto';
  if (symptomCount >= 2) return 'medio';
  return 'bajo';
}

export function ReportSymptomsScreen() {
  const navigation = useNavigation<Nav>();
  const { addReport } = useReports();
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string[]>([]);
  const [district, setDistrict] = useState('');
  const [community, setCommunity] = useState('');

  const toggleSymptom = (symptom: string) => {
    setSelected((prev) =>
      prev.includes(symptom) ? prev.filter((item) => item !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      Alert.alert(t('selectSymptomError'));
      return;
    }
    const risk = classifyRisk(selected.length, selected.includes(t('fever')));
    addReport({
      id: Date.now().toString(),
      date: t('today'),
      district: district || t('defaultDistrict'),
      symptoms: selected.map((key) => t(key as any)),
      risk,
    });
    Alert.alert(
      t('reportSent'),
      t('reportSentMsg', { risk: risk.toUpperCase() })
    );
    setSelected([]);
    setDistrict('');
    setCommunity('');
    navigation.navigate('MyReports');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('howAreYou')}</Text>
      <Text style={styles.subtitle}>{t('selectSymptoms')}</Text>

      <View style={styles.chipsWrap}>
        {SYMPTOMS_KEYS.map((symptomKey) => {
          const label = t(symptomKey);
          const active = selected.includes(label);
          return (
            <Pressable
              key={symptomKey}
              onPress={() => toggleSymptom(label)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <TextInput
        style={styles.input}
        placeholder={t('district')}
        placeholderTextColor={colors.textSecondary}
        value={district}
        onChangeText={setDistrict}
      />
      <TextInput
        style={styles.input}
        placeholder={t('community')}
        placeholderTextColor={colors.textSecondary}
        value={community}
        onChangeText={setCommunity}
      />

      <Pressable style={styles.primaryButton} onPress={handleSubmit}>
        <Text style={styles.primaryButtonText}>{t('sendReport')}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textPrimary, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
