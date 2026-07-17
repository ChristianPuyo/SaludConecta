import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../../context/ProfileContext';
import { useReportSymptoms } from '../../hooks/useReportSymptoms';
import { RecommendationEngine } from '../../domain/recommendations/RecommendationEngine';
import { NotificationService } from '../../services/notificationService';
import { RiskBadge } from '../../components/RiskBadge';
import { ChipGroup } from '../../components/ui/ChipGroup';
import { colors } from '../../theme/colors';
import { SYMPTOMS_LIST, DISTRICTS } from '../../constants';

export function ReportSymptomsScreen() {
  const navigation = useNavigation<any>();
  const { profile } = useProfile();

  const {
    selectedSymptoms,
    district,
    community,
    riskPreview,
    isSubmitting,
    toggleSymptom,
    setDistrict,
    setCommunity,
    submit,
    reset,
  } = useReportSymptoms(profile?.district, profile?.community);

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert('Selecciona al menos un síntoma');
      return;
    }
    const report = await submit(profile?.age, profile?.sex);
    if (!report) return;

    const recommendations = RecommendationEngine.generateForReport(report.id, report.risk);
    const emergencyMsg = RecommendationEngine.getEmergencyMessage(report.risk);

    if (report.risk === 'alto') {
      await NotificationService.add({
        title: 'Alerta de salud',
        body: emergencyMsg ?? 'Tu reporte fue clasificado como riesgo ALTO.',
        type: 'recomendacion',
        date: new Date().toISOString(),
      });
    }

    Alert.alert(
      'Reporte enviado',
      `Riesgo: ${report.risk.toUpperCase()}\nDiagnóstico: ${report.diagnosis}\n\nRecomendaciones:\n${recommendations.map((r) => `• ${r.title}`).join('\n')}\n\n${emergencyMsg ?? ''}`.trim(),
      [{ text: 'OK', onPress: () => { reset(); navigation.navigate('MyReports'); } }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>¿Cómo te sientes hoy?</Text>
      <Text style={styles.subtitle}>Selecciona todos los síntomas que presentas</Text>

      <View style={styles.chipsWrap}>
        {SYMPTOMS_LIST.map((symptom) => {
          const active = selectedSymptoms.includes(symptom);
          return (
            <Pressable key={symptom} onPress={() => toggleSymptom(symptom)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{symptom}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>Distrito</Text>
      <View style={styles.chipsWrap}>
        {DISTRICTS.map((d) => (
          <Pressable key={d} style={[styles.chip, district === d && styles.chipActive]} onPress={() => setDistrict(d)}>
            <Text style={[styles.chipText, district === d && styles.chipTextActive]}>{d}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Comunidad / Localidad</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Pueblo Libre, Bajo Amazonas"
        placeholderTextColor={colors.textSecondary}
        value={community}
        onChangeText={setCommunity}
      />

      {riskPreview && (
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Clasificación de riesgo</Text>
          <RiskBadge level={riskPreview} />
        </View>
      )}

      <Pressable style={[styles.primaryButton, isSubmitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.primaryButtonText}>{isSubmitting ? 'Enviando...' : 'Enviar reporte'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginTop: 4 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textPrimary, fontWeight: '600', fontSize: 14 },
  chipTextActive: { color: '#fff' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: colors.surface, color: colors.textPrimary, fontSize: 14 },
  previewCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F0FDFA', borderRadius: 12, padding: 12 },
  previewTitle: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
