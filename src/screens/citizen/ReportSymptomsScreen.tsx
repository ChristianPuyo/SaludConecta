import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useReports } from '../../context/ReportsContext';
import { colors, shadows } from '../../theme/colors';
import type { RiskLevel } from '../../components/RiskBadge';
import type { DiseaseType } from '../../data/mockData';
import type { CitizenTabParamList } from '../../navigation/CitizenNavigator';
import { Ionicons } from '@expo/vector-icons';

type Nav = BottomTabNavigationProp<CitizenTabParamList, 'ReportSymptoms'>;

const SYMPTOMS = [
  { name: 'Fiebre', icon: '🤒' },
  { name: 'Diarrea', icon: '💧' },
  { name: 'Tos', icon: '😷' },
  { name: 'Vómitos', icon: '🤢' },
  { name: 'Dolor muscular', icon: '💪' },
  { name: 'Dolor de cabeza', icon: '🤕' },
];

const DISEASE_OPTIONS: { key: DiseaseType; label: string; icon: string; color: string }[] = [
  { key: 'respiratoria', label: 'Respiratoria', icon: '🫁', color: colors.accentBlue },
  { key: 'diarrea', label: 'Diarrea', icon: '💧', color: colors.accentAmber },
  { key: 'dengue', label: 'Dengue', icon: '🦟', color: colors.danger },
  { key: 'malaria', label: 'Malaria', icon: '🔬', color: colors.accentPurple },
  { key: 'leptospirosis', label: 'Leptospirosis', icon: '🐀', color: colors.accentPink },
  { key: 'otra', label: 'Otra', icon: '❓', color: colors.textSecondary },
];

function classifyRisk(symptomCount: number, hasFever: boolean): RiskLevel {
  if (symptomCount >= 3 && hasFever) return 'alto';
  if (symptomCount >= 2) return 'medio';
  return 'bajo';
}

function getRiskExplanation(symptoms: string[], risk: RiskLevel, age?: number): string {
  const count = symptoms.length;
  const hasFever = symptoms.includes('Fiebre');
  const ageNote = age && age < 5 ? ' en paciente menor de 5 años' : age && age > 60 ? ' en paciente mayor' : '';

  if (risk === 'alto') {
    return `${count} síntomas reportados${ageNote} incluyendo fiebre. Riesgo ALTO. Acude al centro de salud urgente.`;
  }
  if (risk === 'medio') {
    return `${count} síntomas reportados${ageNote}${hasFever ? ' con fiebre' : ''}. Riesgo MEDIO. Monitorea tus síntomas.`;
  }
  return `${count} síntoma leve reportado${ageNote}. Riesgo BAJO. Descansa y mantente hidratado.`;
}

export function ReportSymptomsScreen() {
  const navigation = useNavigation<Nav>();
  const { addReport } = useReports();
  const [selected, setSelected] = useState<string[]>([]);
  const [district, setDistrict] = useState('');
  const [community, setCommunity] = useState('');
  const [diseaseType, setDiseaseType] = useState<DiseaseType>('dengue');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'M' | 'F' | ''>('');

  const toggleSymptom = (symptom: string) => {
    setSelected((prev) =>
      prev.includes(symptom) ? prev.filter((item) => item !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      Alert.alert('Selecciona al menos un síntoma');
      return;
    }
    const risk = classifyRisk(selected.length, selected.includes('Fiebre'));
    const ageNum = age ? parseInt(age, 10) : undefined;
    const riskExplanation = getRiskExplanation(selected, risk, ageNum);

    addReport({
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      district: district || 'Callería',
      community: community || 'Sin especificar',
      symptoms: selected,
      risk,
      diseaseType,
      age: ageNum,
      sex: (sex as 'M' | 'F') || undefined,
      riskExplanation,
    });
    Alert.alert(
      'Reporte enviado',
      `Tu reporte fue clasificado como riesgo ${risk.toUpperCase()}.\n\n💡 ${riskExplanation}\n\nGracias por ayudar a proteger a tu comunidad.`
    );
    setSelected([]);
    setDistrict('');
    setCommunity('');
    setAge('');
    setSex('');
    navigation.navigate('MyReports');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="document-text-outline" size={24} color={colors.primary} />
        <View>
          <Text style={styles.title}>¿Cómo te sientes hoy?</Text>
          <Text style={styles.subtitle}>Selecciona todos los síntomas que presentas</Text>
        </View>
      </View>

      {/* Síntomas */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionLabel}>Síntomas</Text>
        <View style={styles.chipsWrap}>
          {SYMPTOMS.map((s) => {
            const active = selected.includes(s.name);
            return (
              <Pressable
                key={s.name}
                onPress={() => toggleSymptom(s.name)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={styles.chipIcon}>{s.icon}</Text>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{s.name}</Text>
              </Pressable>
            );
          })}
        </View>
        {selected.length > 0 && (
          <Text style={styles.selectedCount}>{selected.length} síntoma(s) seleccionado(s)</Text>
        )}
      </View>

      {/* Tipo de enfermedad */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionLabel}>Tipo de enfermedad sospechada</Text>
        <View style={styles.diseaseGrid}>
          {DISEASE_OPTIONS.map((d) => {
            const active = diseaseType === d.key;
            return (
              <Pressable
                key={d.key}
                onPress={() => setDiseaseType(d.key)}
                style={[styles.diseaseCard, active && { borderColor: d.color, borderWidth: 2 }]}
              >
                <Text style={styles.diseaseIcon}>{d.icon}</Text>
                <Text style={[styles.diseaseLabel, active && { color: d.color }]}>{d.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Datos demográficos */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionLabel}>Datos demográficos (opcional)</Text>
        <View style={styles.row}>
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Edad</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej: 34"
              placeholderTextColor={colors.textTertiary}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>
          <View style={{ width: 12 }} />
          <View style={[styles.fieldGroup, { flex: 1 }]}>
            <Text style={styles.label}>Sexo</Text>
            <View style={styles.sexRow}>
              <Pressable
                onPress={() => setSex(sex === 'M' ? '' : 'M')}
                style={[styles.sexBtn, sex === 'M' && styles.sexBtnActive]}
              >
                <Ionicons name="male-outline" size={16} color={sex === 'M' ? '#fff' : colors.textSecondary} />
                <Text style={[styles.sexBtnText, sex === 'M' && styles.sexBtnTextActive]}>M</Text>
              </Pressable>
              <Pressable
                onPress={() => setSex(sex === 'F' ? '' : 'F')}
                style={[styles.sexBtn, sex === 'F' && styles.sexBtnActiveF]}
              >
                <Ionicons name="female-outline" size={16} color={sex === 'F' ? '#fff' : colors.textSecondary} />
                <Text style={[styles.sexBtnText, sex === 'F' && styles.sexBtnTextActive]}>F</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Ubicación */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionLabel}>Ubicación</Text>
        <View style={styles.locationRow}>
          <View style={[styles.locationInput, { flex: 1 }]}>
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
            <TextInput
              style={styles.locationInputText}
              placeholder="Distrito"
              placeholderTextColor={colors.textTertiary}
              value={district}
              onChangeText={setDistrict}
            />
          </View>
          <View style={[styles.locationInput, { flex: 1 }]}>
            <Ionicons name="map-outline" size={16} color={colors.textSecondary} />
            <TextInput
              style={styles.locationInputText}
              placeholder="Comunidad"
              placeholderTextColor={colors.textTertiary}
              value={community}
              onChangeText={setCommunity}
            />
          </View>
        </View>
      </View>

      {/* Botón enviar */}
      <Pressable
        style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed, selected.length === 0 && styles.primaryButtonDisabled]}
        onPress={handleSubmit}
        disabled={selected.length === 0}
      >
        <Ionicons name="send-outline" size={20} color="#fff" />
        <Text style={styles.primaryButtonText}>Enviar reporte</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    gap: 10,
    ...shadows.medium,
  },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipIcon: { fontSize: 14 },
  chipText: { color: colors.textPrimary, fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: '#fff' },
  selectedCount: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  diseaseGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  diseaseCard: {
    width: '30%',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    gap: 4,
  },
  diseaseIcon: { fontSize: 24 },
  diseaseLabel: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  row: { flexDirection: 'row' },
  fieldGroup: { marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.background,
    color: colors.textPrimary,
    fontSize: 14,
  },
  sexRow: { flexDirection: 'row', gap: 8 },
  sexBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  sexBtnActive: { backgroundColor: colors.accentBlue, borderColor: colors.accentBlue },
  sexBtnActiveF: { backgroundColor: colors.accentPink, borderColor: colors.accentPink },
  sexBtnText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  sexBtnTextActive: { color: '#fff' },
  locationRow: { flexDirection: 'row', gap: 10 },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.background,
  },
  locationInputText: { flex: 1, paddingVertical: 12, color: colors.textPrimary, fontSize: 14 },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    ...shadows.primary,
  },
  primaryButtonPressed: { transform: [{ scale: 0.98 }] },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
