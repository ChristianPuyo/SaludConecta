import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useReports } from '../../context/ReportsContext';
import { colors, borderRadius, spacing, typography } from '../../theme/colors';
import type { RiskLevel } from '../../components/RiskBadge';
import type { DiseaseType } from '../../data/mockData';
import { AnimatedButton } from '../../components/AnimatedButton';
import type { CitizenTabParamList } from '../../navigation/CitizenNavigator';

type Nav = BottomTabNavigationProp<CitizenTabParamList, 'ReportSymptoms'>;

const SYMPTOMS = [
  { name: 'Fiebre', icon: '🌡️' },
  { name: 'Diarrea', icon: '💧' },
  { name: 'Tos', icon: '🫁' },
  { name: 'Vómitos', icon: '🤮' },
  { name: 'Dolor muscular', icon: '💪' },
  { name: 'Dolor de cabeza', icon: '🤕' },
];

const DISEASE_OPTIONS: { key: DiseaseType; label: string; icon: string; color: string }[] = [
  { key: 'respiratoria', label: 'Respiratoria', icon: '🫁', color: '#3B82F6' },
  { key: 'dengue', label: 'Dengue', icon: '🦟', color: '#EF4444' },
  { key: 'diarrea', label: 'Diarrea', icon: '💧', color: '#F59E0B' },
  { key: 'malaria', label: 'Malaria', icon: '🔬', color: '#8B5CF6' },
  { key: 'leptospirosis', label: 'Leptospirosis', icon: '🐀', color: '#EC4899' },
  { key: 'otra', label: 'Otra', icon: '❓', color: '#6B7280' },
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
    return `${count} síntomas reportados${ageNote} incluyendo fiebre. Clasificado como riesgo ALTO. Se recomienda acudir al centro de salud de forma urgente.`;
  }
  if (risk === 'medio') {
    return `${count} síntomas reportados${ageNote}${hasFever ? ' con fiebre' : ''}. Clasificado como riesgo MEDIO. Monitorea tus síntomas y consulta si empeoran.`;
  }
  return `${count} síntoma leve reportado${ageNote}. Riesgo BAJO. Descansa y mantente hidratado.`;
}

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {children}
    </Animated.View>
  );
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

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Header */}
        <AnimatedSection delay={0}>
          <View style={styles.header}>
            <Text style={styles.title}>¿Cómo te sientes hoy?</Text>
            <Text style={styles.subtitle}>Selecciona todos los síntomas que presentas</Text>
          </View>
        </AnimatedSection>

        {/* Symptoms */}
        <AnimatedSection delay={100}>
          <Text style={styles.sectionLabel}>Síntomas</Text>
        </AnimatedSection>
        <View style={styles.chipsWrap}>
          {SYMPTOMS.map((symptom, i) => {
            const active = selected.includes(symptom.name);
            return (
              <AnimatedSection key={symptom.name} delay={150 + i * 50}>
                <Pressable
                  onPress={() => toggleSymptom(symptom.name)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={styles.chipIcon}>{symptom.icon}</Text>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{symptom.name}</Text>
                </Pressable>
              </AnimatedSection>
            );
          })}
        </View>

        {/* Disease Type */}
        <AnimatedSection delay={400}>
          <Text style={styles.sectionLabel}>Tipo de enfermedad sospechada</Text>
        </AnimatedSection>
        <View style={styles.diseaseGrid}>
          {DISEASE_OPTIONS.map((d, i) => {
            const active = diseaseType === d.key;
            return (
              <AnimatedSection key={d.key} delay={450 + i * 50}>
                <Pressable
                  onPress={() => setDiseaseType(d.key)}
                  style={[styles.diseaseCard, active && { borderColor: d.color, backgroundColor: d.color + '10' }]}
                >
                  <Text style={styles.diseaseIcon}>{d.icon}</Text>
                  <Text style={[styles.diseaseLabel, active && { color: d.color }]}>{d.label}</Text>
                </Pressable>
              </AnimatedSection>
            );
          })}
        </View>

        {/* Demographics */}
        <AnimatedSection delay={700}>
          <Text style={styles.sectionLabel}>Datos demográficos</Text>
        </AnimatedSection>
        <AnimatedSection delay={750}>
          <View style={styles.row}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.label}>Edad</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: 34"
                placeholderTextColor={colors.textMuted}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
            </View>
            <View style={{ width: spacing.md }} />
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.label}>Sexo</Text>
              <View style={styles.sexRow}>
                <Pressable onPress={() => setSex(sex === 'M' ? '' : 'M')} style={[styles.sexBtn, sex === 'M' && styles.sexBtnActive]}>
                  <Ionicons name="male" size={16} color={sex === 'M' ? '#fff' : colors.textSecondary} />
                  <Text style={[styles.sexBtnText, sex === 'M' && styles.sexBtnTextActive]}>M</Text>
                </Pressable>
                <Pressable onPress={() => setSex(sex === 'F' ? '' : 'F')} style={[styles.sexBtn, sex === 'F' && styles.sexBtnActive]}>
                  <Ionicons name="female" size={16} color={sex === 'F' ? '#fff' : colors.textSecondary} />
                  <Text style={[styles.sexBtnText, sex === 'F' && styles.sexBtnTextActive]}>F</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </AnimatedSection>

        {/* Location */}
        <AnimatedSection delay={850}>
          <Text style={styles.sectionLabel}>Ubicación</Text>
        </AnimatedSection>
        <AnimatedSection delay={900}>
          <View style={styles.inputRow}>
            <View style={[styles.inputIconWrap, { flex: 1 }]}>
              <Ionicons name="location" size={18} color={colors.textMuted} />
              <TextInput style={styles.inputIcon} placeholder="Distrito" placeholderTextColor={colors.textMuted} value={district} onChangeText={setDistrict} />
            </View>
            <View style={{ width: spacing.md }} />
            <View style={[styles.inputIconWrap, { flex: 1 }]}>
              <Ionicons name="home" size={18} color={colors.textMuted} />
              <TextInput style={styles.inputIcon} placeholder="Comunidad" placeholderTextColor={colors.textMuted} value={community} onChangeText={setCommunity} />
            </View>
          </View>
        </AnimatedSection>

        {/* Submit */}
        <AnimatedSection delay={1000}>
          <AnimatedButton
            title="Enviar reporte"
            onPress={handleSubmit}
            variant="primary"
            size="lg"
            icon="📤"
            style={{ marginTop: spacing.xl }}
          />
        </AnimatedSection>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 40 },
  header: { marginBottom: spacing.xl },
  title: { fontSize: typography.xxl, fontWeight: '900', color: colors.textPrimary },
  subtitle: { fontSize: typography.md, color: colors.textSecondary, marginTop: spacing.xs },
  sectionLabel: { fontSize: typography.base, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md, marginTop: spacing.lg },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary, ...colors.shadowPrimary },
  chipIcon: { fontSize: 16 },
  chipText: { color: colors.textPrimary, fontWeight: '600', fontSize: typography.sm },
  chipTextActive: { color: '#fff' },
  diseaseGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  diseaseCard: {
    width: '30%',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    gap: spacing.xs,
  },
  diseaseIcon: { fontSize: 28 },
  diseaseLabel: { fontSize: typography.xs, fontWeight: '700', color: colors.textSecondary },
  row: { flexDirection: 'row' },
  fieldGroup: { marginBottom: spacing.md },
  label: { fontSize: typography.sm, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.xs },
  input: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: typography.base,
  },
  inputRow: { flexDirection: 'row' },
  inputIconWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  inputIcon: { flex: 1, color: colors.textPrimary, fontSize: typography.base, padding: 0 },
  sexRow: { flexDirection: 'row', gap: spacing.sm },
  sexBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  sexBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  sexBtnText: { fontSize: typography.sm, fontWeight: '600', color: colors.textSecondary },
  sexBtnTextActive: { color: '#fff' },
});
