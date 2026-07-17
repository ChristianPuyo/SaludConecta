import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useReports } from '../../context/ReportsContext';
import { colors } from '../../theme/colors';
import type { RiskLevel } from '../../components/RiskBadge';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import type { CitizenTabParamList } from '../../navigation/CitizenNavigator';

type Nav = BottomTabNavigationProp<CitizenTabParamList, 'ReportSymptoms'>;

import { Ionicons } from '@expo/vector-icons';

const SYMPTOMS = ['Fiebre', 'Diarrea', 'Tos', 'Vómitos', 'Dolor muscular', 'Dolor de cabeza'];

interface AnalysisResult {
  risk: RiskLevel;
  reasoning: string;
}

function analyzeSymptoms(symptoms: string[], ageNum?: number, sexStr?: string): AnalysisResult {
  const hasFever = symptoms.includes('Fiebre');
  const hasDiarrhea = symptoms.includes('Diarrea');
  const hasVomiting = symptoms.includes('Vómitos');
  const hasMusclePain = symptoms.includes('Dolor muscular');
  const hasHeadache = symptoms.includes('Dolor de cabeza');
  const hasCough = symptoms.includes('Tos');

  let risk: RiskLevel = 'bajo';
  let reasons: string[] = [];

  if (hasFever && (hasMusclePain || hasHeadache || hasVomiting)) {
    if (hasVomiting || symptoms.length >= 3) {
      risk = 'alto';
      reasons.push("Presenta síndrome febril agudo acompañado de síntomas gastrointestinales y dolores corporales severos.");
      reasons.push("Alerta compatible con Dengue con signos de alarma o Malaria. Requiere evaluación médica inmediata en un centro de salud.");
    } else {
      risk = 'medio';
      reasons.push("Fiebre acompañada de dolor muscular/cefalea.");
      reasons.push("Posible sospecha de Dengue clásico o virus similar. Se recomienda reposo, hidratación abundante y control térmico.");
    }
  } 
  else if (hasDiarrhea && hasVomiting) {
    risk = 'alto';
    reasons.push("Presencia simultánea de diarrea y vómitos, lo cual incrementa severamente el riesgo de deshidratación aguda.");
    reasons.push("Compatible con EDA (Enfermedad Diarreica Aguda). Se sugiere iniciar sales de rehidratación oral y acudir al puesto de salud.");
  } else if (hasDiarrhea) {
    risk = 'medio';
    reasons.push("Presencia de diarrea sin vómitos. Riesgo de deshidratación moderado.");
    reasons.push("Se recomienda ingesta constante de líquidos seguros y dieta blanda.");
  }
  else if (hasCough && hasFever) {
    risk = 'medio';
    reasons.push("Combinación de tos y fiebre, compatible con Infección Respiratoria Aguda (IRA).");
    reasons.push("Monitorear la frecuencia respiratoria y la temperatura. En caso de agitación al respirar, acudir a emergencias.");
  } else if (hasCough) {
    risk = 'bajo';
    reasons.push("Tos aislada sin fiebre ni otros signos de alarma.");
    reasons.push("Se sugiere mantener buena hidratación y observar evolución de los síntomas.");
  } else {
    if (symptoms.length >= 3) {
      risk = 'medio';
      reasons.push("Múltiples síntomas inespecíficos activos.");
      reasons.push("Se recomienda observación y descanso en el hogar.");
    } else {
      risk = 'bajo';
      reasons.push("Sintomatología inespecífica leve aislada.");
      reasons.push("Sin criterios de alarma epidemiológica. Reposo en domicilio.");
    }
  }

  // Modificador por edad (grupos vulnerables)
  if (ageNum && (ageNum < 5 || ageNum > 65) && risk !== 'alto' && symptoms.length > 0) {
    risk = 'medio';
    reasons.push(`Ajuste de riesgo: Paciente en grupo vulnerable por edad (${ageNum} años). Se eleva la alerta para mayor precaución.`);
  }

  return {
    risk,
    reasoning: reasons.join(' ')
  };
}

// Symptom display map: Spanish key → localized display name
const SYMPTOM_DISPLAY_MAP = {
  'Fiebre':         (t: ReturnType<typeof useLanguage>['t']) => t.report_symptom_fever,
  'Diarrea':        (t: ReturnType<typeof useLanguage>['t']) => t.report_symptom_diarrhea,
  'Tos':            (t: ReturnType<typeof useLanguage>['t']) => t.report_symptom_cough,
  'Vómitos':        (t: ReturnType<typeof useLanguage>['t']) => t.report_symptom_vomiting,
  'Dolor muscular': (t: ReturnType<typeof useLanguage>['t']) => t.report_symptom_muscle_pain,
  'Dolor de cabeza':(t: ReturnType<typeof useLanguage>['t']) => t.report_symptom_headache,
} as const;

export function ReportSymptomsScreen() {
  const navigation = useNavigation<Nav>();
  const { addReport } = useReports();
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string[]>([]); // Spanish keys as source of truth
  const [district, setDistrict] = useState('');
  const [community, setCommunity] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'Masculino' | 'Femenino' | ''>('');
  
  // Modal states
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const toggleSymptom = (symptomKey: string) => {
    setSelected((prev) =>
      prev.includes(symptomKey) ? prev.filter((item) => item !== symptomKey) : [...prev, symptomKey]
    );
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      Alert.alert(t.error, t.alert_symptom_validation);
      return;
    }
    
    const ageNum = age ? parseInt(age, 10) : undefined;
    const analysis = analyzeSymptoms(selected, ageNum, sex || undefined);
    
    setResult(analysis);
    setShowResult(true);

    addReport({
      id: Date.now().toString(),
      date: 'Hoy',
      district: district || 'Callería',
      community: community || 'General',
      age: ageNum,
      sex: sex || undefined,
      symptoms: selected.map(k => SYMPTOM_DISPLAY_MAP[k as keyof typeof SYMPTOM_DISPLAY_MAP]?.(t) ?? k),
      risk: analysis.risk,
      reasoning: analysis.reasoning,
    });
  };

  const handleCloseModal = () => {
    setShowResult(false);
    setSelected([]);
    setDistrict('');
    setCommunity('');
    setAge('');
    setSex('');
    setResult(null);
    navigation.navigate('MyReports');
  };

  // Color mapping for modal
  const cardColor = {
    bajo: { bg: '#E8F5E9', border: '#C8E6C9', text: colors.success, icon: 'checkmark-circle-outline' },
    medio: { bg: '#FFFDE7', border: '#FFF9C4', text: colors.warning, icon: 'warning-outline' },
    alto: { bg: '#FFEBEE', border: '#FFCDD2', text: colors.danger, icon: 'alert-circle-outline' },
  }[result?.risk || 'bajo'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Language Switcher */}
      <LanguageSwitcher />

      <Text style={styles.title}>{t.report_title}</Text>
      <Text style={styles.subtitle}>{t.report_subtitle}</Text>

      <View style={styles.chipsWrap}>
        {SYMPTOMS.map((symptomKey) => {
          const active = selected.includes(symptomKey);
          const displayName = SYMPTOM_DISPLAY_MAP[symptomKey as keyof typeof SYMPTOM_DISPLAY_MAP]?.(t) ?? symptomKey;
          return (
            <Pressable
              key={symptomKey}
              onPress={() => toggleSymptom(symptomKey)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{displayName}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>{t.report_personal_data}</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder={t.report_age}
          placeholderTextColor={colors.textSecondary}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <View style={styles.sexContainer}>
          <Pressable
            style={[styles.sexButton, sex === 'Masculino' && styles.sexButtonActive]}
            onPress={() => setSex('Masculino')}
          >
            <Text style={[styles.sexText, sex === 'Masculino' && styles.sexTextActive]}>{t.report_sex_male[0]}</Text>
          </Pressable>
          <Pressable
            style={[styles.sexButton, sex === 'Femenino' && styles.sexButtonActive]}
            onPress={() => setSex('Femenino')}
          >
            <Text style={[styles.sexText, sex === 'Femenino' && styles.sexTextActive]}>{t.report_sex_female[0]}</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.sectionLabel}>{t.report_location}</Text>
      <TextInput
        style={styles.input}
        placeholder={t.report_district_placeholder}
        placeholderTextColor={colors.textSecondary}
        value={district}
        onChangeText={setDistrict}
      />
      <TextInput
        style={styles.input}
        placeholder={t.report_community_placeholder}
        placeholderTextColor={colors.textSecondary}
        value={community}
        onChangeText={setCommunity}
      />

      <Pressable style={styles.primaryButton} onPress={handleSubmit}>
        <Text style={styles.primaryButtonText}>{t.report_submit}</Text>
      </Pressable>

      {/* MODAL EXPLICATIVO DE IA */}
      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Ionicons name={cardColor.icon as any} size={48} color={cardColor.text} />
              <Text style={[styles.modalRiskTitle, { color: cardColor.text }]}>
                {(result?.risk || '').toUpperCase()}
              </Text>
              <Text style={styles.modalMeta}>{t.report_modal_title}</Text>
            </View>

            <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalScrollContent}>
              <View style={[styles.reasonCard, { backgroundColor: cardColor.bg, borderColor: cardColor.border }]}>
                <Text style={styles.reasonLabel}>{t.report_modal_analysis_label}</Text>
                <Text style={styles.reasonText}>{result?.reasoning}</Text>
              </View>

              <Text style={styles.disclaimerTitle}>⚠️ {t.error}</Text>
              <Text style={styles.disclaimerText}>{t.report_modal_disclaimer}</Text>
            </ScrollView>

            <Pressable style={styles.modalCloseButton} onPress={handleCloseModal}>
              <Text style={styles.modalCloseButtonText}>{t.report_modal_button}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  sectionLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginTop: 10, marginBottom: 2 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  sexContainer: { flexDirection: 'row', gap: 6 },
  sexButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sexButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  sexText: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  sexTextActive: { color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  
  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: colors.surface, borderRadius: 24, width: '100%', maxHeight: '80%', padding: 24, gap: 16, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10 },
  modalHeader: { alignItems: 'center', gap: 4 },
  modalRiskTitle: { fontSize: 24, fontWeight: '900', letterSpacing: 0.5 },
  modalMeta: { fontSize: 12, color: colors.textSecondary },
  modalScroll: { flex: 1, marginVertical: 8 },
  modalScrollContent: { gap: 14 },
  reasonCard: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 8 },
  reasonLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  reasonText: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  disclaimerTitle: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  disclaimerText: { fontSize: 11, color: colors.textSecondary, lineHeight: 16 },
  modalCloseButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  modalCloseButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
