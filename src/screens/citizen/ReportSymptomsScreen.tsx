import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useReports } from '../../context/ReportsContext';
import { colors } from '../../theme/colors';
import { SYMPTOM_RECOMMENDATIONS, MOCK_DISTRICT_RISK } from '../../data/mockData';
import type { RiskLevel } from '../../components/RiskBadge';
import type { CitizenStackParamList } from '../../navigation/CitizenStackNavigator';

type Nav = NativeStackNavigationProp<CitizenStackParamList, 'ReportSymptoms'>;

interface SymptomOption {
  name: string;
  icon: string;
  color: string;
  description: string;
}

const SYMPTOM_OPTIONS: SymptomOption[] = [
  { name: 'Fiebre', icon: 'thermometer', color: '#EF4444', description: 'Temperatura elevada' },
  { name: 'Tos', icon: 'medkit', color: '#F59E0B', description: 'Tos seca o con flema' },
  { name: 'Dolor muscular', icon: 'barbell', color: '#8B5CF6', description: 'Dolor en cuerpo' },
  { name: 'Diarrea', icon: 'water', color: '#06B6D4', description: 'Malestar estomacal' },
  { name: 'Vómitos', icon: 'refresh', color: '#EC4899', description: 'Náuseas y vómitos' },
  { name: 'Dolor de cabeza', icon: 'finger-print', color: '#F97316', description: 'Cefalea intensa' },
];

const DISTRICTS = ['Callería', 'Yarinacocha', 'Manantay', 'Campoverde', 'Nueva Requena'];

const AGE_RANGES = ['0-5 años', '6-12 años', '13-17 años', '18-35 años', '36-55 años', '56+ años'];

function classifyRisk(symptomCount: number, hasFever: boolean, age: string): RiskLevel {
  if (symptomCount >= 3 && hasFever) return 'alto';
  if (symptomCount >= 2 || (symptomCount >= 1 && hasFever)) return 'medio';
  return 'bajo';
}

function getRiskColor(risk: RiskLevel): string {
  if (risk === 'alto') return '#EF4444';
  if (risk === 'medio') return '#F59E0B';
  return '#22C55E';
}

function getRiskLabel(risk: RiskLevel): string {
  if (risk === 'alto') return 'Riesgo Alto';
  if (risk === 'medio') return 'Riesgo Medio';
  return 'Riesgo Bajo';
}

export function ReportSymptomsScreen() {
  const navigation = useNavigation<Nav>();
  const { addReport } = useReports();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [district, setDistrict] = useState('');
  const [community, setCommunity] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState(1);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom],
    );
  };

  const predictedRisk = classifyRisk(
    selectedSymptoms.length,
    selectedSymptoms.includes('Fiebre'),
    ageRange,
  );

  const canProceedStep2 = selectedSymptoms.length > 0;
  const canSubmit = canProceedStep2 && district.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) {
      Alert.alert('Campos requeridos', 'Selecciona al menos un síntoma y tu distrito.');
      return;
    }

    const risk = classifyRisk(
      selectedSymptoms.length,
      selectedSymptoms.includes('Fiebre'),
      ageRange,
    );

    addReport({
      id: Date.now().toString(),
      date: 'Hoy',
      district,
      symptoms: selectedSymptoms,
      risk,
    });

    Alert.alert(
      'Reporte enviado correctamente',
      `Tu reporte fue clasificado como ${getRiskLabel(risk)}.\n\nGracias por ayudar a proteger a tu comunidad.`,
      [
        {
          text: 'Ver recomendaciones',
          onPress: () => navigation.goBack(),
        },
      ],
    );

    setSelectedSymptoms([]);
    setDistrict('');
    setCommunity('');
    setAgeRange('');
    setNotes('');
    setStep(1);
  };

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Selecciona tus síntomas</Text>
      <Text style={styles.stepSubtitle}>Elige todos los que presentas actualmente</Text>

      <View style={styles.symptomsGrid}>
        {SYMPTOM_OPTIONS.map((symptom) => {
          const isActive = selectedSymptoms.includes(symptom.name);
          return (
            <Pressable
              key={symptom.name}
              style={({ pressed }) => [
                styles.symptomCard,
                isActive && { backgroundColor: symptom.color + '15', borderColor: symptom.color },
                pressed && styles.symptomCardPressed,
              ]}
              onPress={() => toggleSymptom(symptom.name)}
            >
              <View style={[styles.symptomIcon, { backgroundColor: symptom.color + '20' }]}>
                <Ionicons name={symptom.icon as any} size={24} color={symptom.color} />
              </View>
              <Text style={[styles.symptomName, isActive && { color: symptom.color }]}>
                {symptom.name}
              </Text>
              <Text style={styles.symptomDesc}>{symptom.description}</Text>
              {isActive && (
                <View style={[styles.checkBadge, { backgroundColor: symptom.color }]}>
                  <Ionicons name="checkmark" size={12} color="#FFF" />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {selectedSymptoms.length > 0 && (
        <View style={styles.selectedPreview}>
          <Text style={styles.selectedLabel}>{selectedSymptoms.length} síntoma(s) seleccionado(s)</Text>
          <View style={styles.selectedTags}>
            {selectedSymptoms.map((s) => (
              <View key={s} style={styles.selectedTag}>
                <Text style={styles.selectedTagText}>{s}</Text>
                <Pressable onPress={() => toggleSymptom(s)}>
                  <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Información personal</Text>
      <Text style={styles.stepSubtitle}>Cuéntanos sobre ti para una mejor clasificación</Text>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Rango de edad *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ageScroll}>
          {AGE_RANGES.map((range) => (
            <Pressable
              key={range}
              style={({ pressed }) => [
                styles.ageChip,
                ageRange === range && styles.ageChipActive,
                pressed && styles.ageChipPressed,
              ]}
              onPress={() => setAgeRange(range)}
            >
              <Text style={[styles.ageChipText, ageRange === range && styles.ageChipTextActive]}>
                {range}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Distrito *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.districtScroll}>
          {DISTRICTS.map((d) => (
            <Pressable
              key={d}
              style={({ pressed }) => [
                styles.districtChip,
                district === d && styles.districtChipActive,
                pressed && styles.districtChipPressed,
              ]}
              onPress={() => setDistrict(d)}
            >
              <Ionicons
                name="location"
                size={14}
                color={district === d ? '#FFF' : colors.textSecondary}
              />
              <Text style={[styles.districtChipText, district === d && styles.districtChipTextActive]}>
                {d}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Comunidad o barrio</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="home" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Ej: San Martín, Centro"
            placeholderTextColor={colors.textSecondary}
            value={community}
            onChangeText={setCommunity}
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Notas adicionales (opcional)</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="document-text" size={18} color={colors.textSecondary} />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Describe cómo te sientes, cuándo empezaron los síntomas..."
            placeholderTextColor={colors.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Resumen de tu reporte</Text>
      <Text style={styles.stepSubtitle}>Revisa la información antes de enviar</Text>

      {/* Risk Preview */}
      <View style={[styles.riskPreviewCard, { borderLeftColor: getRiskColor(predictedRisk) }]}>
        <View style={styles.riskPreviewHeader}>
          <Ionicons name="shield-checkmark" size={24} color={getRiskColor(predictedRisk)} />
          <View>
            <Text style={styles.riskPreviewLabel}>Clasificación IA</Text>
            <Text style={[styles.riskPreviewLevel, { color: getRiskColor(predictedRisk) }]}>
              {getRiskLabel(predictedRisk)}
            </Text>
          </View>
        </View>
        <Text style={styles.riskPreviewDetail}>
          {selectedSymptoms.length} síntoma(s) reportado(s)
          {district ? ` • Distrito: ${district}` : ''}
          {ageRange ? ` • Edad: ${ageRange}` : ''}
        </Text>
      </View>

      {/* Symptoms Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryCardTitle}>Síntomas seleccionados</Text>
        <View style={styles.summarySymptoms}>
          {selectedSymptoms.map((s) => {
            const opt = SYMPTOM_OPTIONS.find((o) => o.name === s);
            return (
              <View key={s} style={[styles.summarySymptomItem, { borderLeftColor: opt?.color || colors.primary }]}>
                <Ionicons name={opt?.icon as any || 'medical'} size={16} color={opt?.color || colors.primary} />
                <Text style={styles.summarySymptomText}>{s}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Recommendations - Full Detail */}
      {selectedSymptoms.map((s) => {
        const rec = SYMPTOM_RECOMMENDATIONS[s];
        if (!rec) return null;
        const opt = SYMPTOM_OPTIONS.find((o) => o.name === s);
        return (
          <View key={s} style={styles.fullRecommendationCard}>
            <View style={[styles.fullRecHeader, { backgroundColor: (opt?.color || colors.primary) + '15' }]}>
              <Ionicons name={opt?.icon as any || 'medical'} size={20} color={opt?.color || colors.primary} />
              <Text style={[styles.fullRecTitle, { color: opt?.color || colors.primary }]}>{rec.symptom}</Text>
            </View>

            {/* Medications */}
            <View style={styles.fullRecSection}>
              <Text style={styles.fullRecSectionTitle}>💊 Medicamentos sugeridos</Text>
              {rec.medications.map((med, i) => (
                <View key={i} style={styles.fullMedItem}>
                  <View style={styles.fullMedHeader}>
                    <Text style={styles.fullMedName}>{med.name}</Text>
                    <Text style={styles.fullMedDose}>{med.dose}</Text>
                  </View>
                  <Text style={styles.fullMedFreq}>⏰ {med.frequency}</Text>
                  <Text style={styles.fullMedWarn}>⚠️ {med.precautions}</Text>
                </View>
              ))}
            </View>

            {/* Home Remedies */}
            <View style={styles.fullRecSection}>
              <Text style={styles.fullRecSectionTitle}>🌿 Remedios caseros</Text>
              {rec.homeRemedies.map((remedy, i) => (
                <View key={i} style={styles.fullRemedyItem}>
                  <Ionicons name="checkmark-circle" size={14} color="#22C55E" />
                  <Text style={styles.fullRemedyText}>{remedy}</Text>
                </View>
              ))}
            </View>

            {/* Warnings */}
            <View style={[styles.fullRecSection, styles.fullWarningBox]}>
              <Text style={[styles.fullRecSectionTitle, { color: '#DC2626' }]}>🚨 Busca atención médica si:</Text>
              {rec.warnings.map((warning, i) => (
                <View key={i} style={styles.fullWarningItem}>
                  <Ionicons name="alert" size={14} color="#DC2626" />
                  <Text style={styles.fullWarningText}>{warning}</Text>
                </View>
              ))}
            </View>

            {/* Preventions */}
            <View style={[styles.fullRecSection, styles.fullPreventionBox]}>
              <Text style={[styles.fullRecSectionTitle, { color: '#16A34A' }]}>🛡️ Prevención</Text>
              {rec.preventions.map((prev, i) => (
                <View key={i} style={styles.fullPreventionItem}>
                  <Ionicons name="shield-checkmark" size={14} color="#16A34A" />
                  <Text style={styles.fullPreventionText}>{prev}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}

      {/* Personal Info Summary */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.infoText}>{district || 'No especificado'}</Text>
        </View>
        {community ? (
          <View style={styles.infoRow}>
            <Ionicons name="home" size={16} color={colors.primary} />
            <Text style={styles.infoText}>{community}</Text>
          </View>
        ) : null}
        {ageRange ? (
          <View style={styles.infoRow}>
            <Ionicons name="people" size={16} color={colors.primary} />
            <Text style={styles.infoText}>{ageRange}</Text>
          </View>
        ) : null}
        {notes ? (
          <View style={styles.infoRow}>
            <Ionicons name="document-text" size={16} color={colors.primary} />
            <Text style={styles.infoText} numberOfLines={2}>{notes}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Progress Steps */}
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={styles.progressStep}>
              <View style={[styles.progressDot, step >= s && styles.progressDotActive]}>
                {step > s ? (
                  <Ionicons name="checkmark" size={12} color="#FFF" />
                ) : (
                  <Text style={[styles.progressDotText, step >= s && styles.progressDotTextActive]}>{s}</Text>
                )}
              </View>
              {s < 3 ? <View style={[styles.progressLine, step > s && styles.progressLineActive]} /> : null}
            </View>
          ))}
        </View>

        <View style={styles.stepLabels}>
          <Text style={[styles.stepLabel, step >= 1 && styles.stepLabelActive]}>Síntomas</Text>
          <Text style={[styles.stepLabel, step >= 2 && styles.stepLabelActive]}>Datos</Text>
          <Text style={[styles.stepLabel, step >= 3 && styles.stepLabelActive]}>Confirmar</Text>
        </View>

        {/* Step Content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomBar}>
        {step > 1 && (
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
            onPress={() => setStep(step - 1)}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
            <Text style={styles.backButtonText}>Atrás</Text>
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.nextButton,
            pressed && styles.nextButtonPressed,
            ((step === 1 && !canProceedStep2) || (step === 2 && !canSubmit)) && styles.nextButtonDisabled,
          ]}
          onPress={() => {
            if (step < 3) {
              setStep(step + 1);
            } else {
              handleSubmit();
            }
          }}
          disabled={(step === 1 && !canProceedStep2) || (step === 2 && !canSubmit)}
        >
          <LinearGradient
            colors={
              (step === 1 && !canProceedStep2) || (step === 2 && !canSubmit)
                ? ['#94A3B8', '#94A3B8']
                : [colors.primary, colors.primaryDark]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {step === 3 ? 'Enviar reporte' : 'Siguiente'}
            </Text>
            <Ionicons
              name={step === 3 ? 'send' : 'arrow-forward'}
              size={18}
              color="#FFF"
            />
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressStep: { flexDirection: 'row', alignItems: 'center' },
  progressDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotActive: { backgroundColor: colors.primary },
  progressDotText: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  progressDotTextActive: { color: '#FFF' },
  progressLine: { width: 40, height: 2, backgroundColor: '#E2E8F0', marginHorizontal: 4 },
  progressLineActive: { backgroundColor: colors.primary },
  stepLabels: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 },
  stepLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  stepLabelActive: { color: colors.primary },
  stepContent: { gap: 16 },
  stepTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  stepSubtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
  symptomsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  symptomCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    position: 'relative',
  },
  symptomCardPressed: { transform: [{ scale: 0.97 }] },
  symptomIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  symptomName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  symptomDesc: { fontSize: 11, color: colors.textSecondary },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPreview: { backgroundColor: '#F0F9FF', borderRadius: 12, padding: 12 },
  selectedLabel: { fontSize: 12, fontWeight: '600', color: colors.primary, marginBottom: 8 },
  selectedTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedTagText: { fontSize: 12, fontWeight: '600', color: '#2563EB' },
  formGroup: { gap: 8 },
  formLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  ageScroll: { marginHorizontal: -4, paddingHorizontal: 4 },
  ageChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: 8,
  },
  ageChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  ageChipPressed: { transform: [{ scale: 0.97 }] },
  ageChipText: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  ageChipTextActive: { color: '#FFF' },
  districtScroll: { marginHorizontal: -4, paddingHorizontal: 4 },
  districtChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: 8,
  },
  districtChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  districtChipPressed: { transform: [{ scale: 0.97 }] },
  districtChipText: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  districtChipTextActive: { color: '#FFF' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 14,
  },
  riskPreviewCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  riskPreviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  riskPreviewLabel: { fontSize: 12, color: colors.textSecondary },
  riskPreviewLevel: { fontSize: 18, fontWeight: '800' },
  riskPreviewDetail: { fontSize: 12, color: colors.textSecondary },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryCardTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  summarySymptoms: { gap: 8 },
  summarySymptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
  },
  summarySymptomText: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  fullRecommendationCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  fullRecHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fullRecTitle: { fontSize: 16, fontWeight: '800' },
  fullRecSection: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  fullRecSectionTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginBottom: 10 },
  fullMedItem: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 10, marginBottom: 8, gap: 4 },
  fullMedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fullMedName: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  fullMedDose: { fontSize: 12, fontWeight: '600', color: colors.primary, backgroundColor: '#F0FDFA', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  fullMedFreq: { fontSize: 11, color: colors.textSecondary },
  fullMedWarn: { fontSize: 11, color: '#D97706', fontStyle: 'italic' },
  fullRemedyItem: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 3 },
  fullRemedyText: { fontSize: 12, color: colors.textSecondary, flex: 1, lineHeight: 16 },
  fullWarningBox: { backgroundColor: '#FEF2F2' },
  fullWarningItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, paddingVertical: 3 },
  fullWarningText: { fontSize: 12, color: '#DC2626', flex: 1, lineHeight: 16 },
  fullPreventionBox: { backgroundColor: '#F0FDF4' },
  fullPreventionItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, paddingVertical: 3 },
  fullPreventionText: { fontSize: 12, color: '#16A34A', flex: 1, lineHeight: 16 },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { fontSize: 13, color: colors.textPrimary, flex: 1 },
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonPressed: { backgroundColor: '#F8FAFC' },
  backButtonText: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  nextButton: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  nextButtonPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  nextButtonDisabled: { opacity: 0.6 },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  nextButtonText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});
