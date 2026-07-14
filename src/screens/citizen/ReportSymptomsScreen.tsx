import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useReports } from '../../context/ReportsContext';
import { colors } from '../../theme/colors';
import type { RiskLevel } from '../../components/RiskBadge';
import type { CitizenTabParamList } from '../../navigation/CitizenNavigator';

type Nav = BottomTabNavigationProp<CitizenTabParamList, 'ReportSymptoms'>;

const SYMPTOMS = ['Fiebre', 'Diarrea', 'Tos', 'Vómitos', 'Dolor muscular', 'Dolor de cabeza'];
const DISTRICTS = ['Callería', 'Yarinacocha', 'Manantay', 'Campoverde', 'Nueva Requena'];

function classifySymptoms(symptoms: string[]): { risk: RiskLevel; diagnosis: string; recommendation: string } {
  const hasFever = symptoms.includes('Fiebre');
  const hasMusclePain = symptoms.includes('Dolor muscular');
  const hasHeadache = symptoms.includes('Dolor de cabeza');
  const hasCough = symptoms.includes('Tos');
  const hasDiarrhea = symptoms.includes('Diarrea');
  const hasVomit = symptoms.includes('Vómitos');

  if (hasFever && (hasMusclePain || hasHeadache)) {
    return {
      risk: 'alto',
      diagnosis: 'Sospecha de Dengue / Malaria',
      recommendation: 'Síntomas compatibles con Dengue o Malaria. Acude de inmediato al centro de salud y no te automediques.'
    };
  }

  if (hasCough && hasFever) {
    return {
      risk: 'medio',
      diagnosis: 'Infección Respiratoria',
      recommendation: 'Síntomas respiratorios detectados. Usa mascarilla, mantente en reposo y monitorea tu temperatura.'
    };
  }

  if (hasDiarrhea || hasVomit) {
    return {
      risk: 'medio',
      diagnosis: 'Infección Gastrointestinal',
      recommendation: 'Síntomas digestivos. Evita la deshidratación tomando abundante agua de mesa o suero oral.'
    };
  }

  if (symptoms.length >= 2) {
    return {
      risk: 'medio',
      diagnosis: 'Síntomas múltiples',
      recommendation: 'Monitorea tus síntomas. Si empeoran o presentas fiebre persistente, acude al puesto de salud.'
    };
  }

  return {
    risk: 'bajo',
    diagnosis: 'Síntomas leves',
    recommendation: 'Mantente en observación. Si las molestias persisten por más de 48 horas, consulta a un profesional.'
  };
}

export function ReportSymptomsScreen() {
  const navigation = useNavigation<Nav>();
  const { addReport } = useReports();
  const [selected, setSelected] = useState<string[]>([]);
  const [district, setDistrict] = useState('');
  const [community, setCommunity] = useState('');
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);

  const toggleSymptom = (symptom: string) => {
    setSelected((prev) =>
      prev.includes(symptom) ? prev.filter((item) => item !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    if (selected.length === 0) {
      Alert.alert('Error', 'Selecciona al menos un síntoma para continuar.');
      return;
    }
    if (!district) {
      Alert.alert('Error', 'Selecciona tu distrito.');
      return;
    }
    if (!community.trim()) {
      Alert.alert('Error', 'Ingresa el nombre de tu comunidad.');
      return;
    }

    const assessment = classifySymptoms(selected);

    addReport({
      id: Date.now().toString(),
      date: 'Hoy',
      district,
      symptoms: selected,
      risk: assessment.risk,
    });

    Alert.alert(
      'Reporte Enviado con Éxito',
      `Diagnóstico preliminar: ${assessment.diagnosis}\nClasificación: RIESGO ${assessment.risk.toUpperCase()}\n\nRecomendación:\n${assessment.recommendation}`,
      [
        {
          text: 'Entendido',
          onPress: () => {
            setSelected([]);
            setDistrict('');
            setCommunity('');
            navigation.navigate('MyReports');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>¿Cómo te sientes hoy?</Text>
      <Text style={styles.subtitle}>Selecciona los síntomas que presentas en las últimas 24 horas.</Text>

      <Text style={styles.label}>Síntomas</Text>
      <View style={styles.chipsWrap}>
        {SYMPTOMS.map((symptom) => {
          const active = selected.includes(symptom);
          return (
            <Pressable
              key={symptom}
              onPress={() => toggleSymptom(symptom)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{symptom}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Distrito de residencia</Text>
      <Pressable style={styles.pickerButton} onPress={() => setIsDistrictModalOpen(true)}>
        <Text style={[styles.pickerButtonText, !district && { color: colors.textSecondary }]}>
          {district || 'Selecciona tu distrito...'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </Pressable>

      <Text style={styles.label}>Comunidad / Barrio</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. San José, Puerto Callao, etc."
        placeholderTextColor={colors.textSecondary}
        value={community}
        onChangeText={setCommunity}
      />

      <Pressable style={styles.primaryButton} onPress={handleSubmit}>
        <Text style={styles.primaryButtonText}>Enviar reporte epidemiológico</Text>
      </Pressable>

      {/* Modal para selección de Distrito */}
      <Modal visible={isDistrictModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecciona tu distrito</Text>
              <Pressable onPress={() => setIsDistrictModalOpen(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>
            <FlatList
              data={DISTRICTS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.modalOption}
                  onPress={() => {
                    setDistrict(item);
                    setIsDistrictModalOpen(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{item}</Text>
                  {district === item && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 14 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 6, lineHeight: 20 },
  label: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginTop: 8 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textPrimary, fontWeight: '600', fontSize: 14 },
  chipTextActive: { color: '#fff' },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  pickerButtonText: { fontSize: 15, color: colors.textPrimary },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontSize: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 18,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '50%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalOptionText: { fontSize: 16, color: colors.textPrimary },
});
