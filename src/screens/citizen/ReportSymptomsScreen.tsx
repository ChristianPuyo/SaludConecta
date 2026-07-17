import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, Modal, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useReports } from '../../context/ReportsContext';
import { colors } from '../../theme/colors';
import { AutoCarousel } from '../../components/AutoCarousel';
import { BannerSlide } from '../../components/BannerSlide';
import type { RiskLevel } from '../../components/RiskBadge';
import type { CitizenTabParamList } from '../../navigation/CitizenNavigator';

type Nav = BottomTabNavigationProp<CitizenTabParamList, 'ReportSymptoms'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_MARGIN = 20;
const CAROUSEL_WIDTH = SCREEN_WIDTH - CAROUSEL_MARGIN * 2;

const CAROUSEL_ITEMS = [
  {
    imageSource: require('../../img/img1.png'),
    icon: 'document-text',
    tag: 'Paso 1',
    title: 'Selecciona tus sintomas',
    subtitle: 'Elige todos los sintomas que presentas en las ultimas 24 horas.',
  },
  {
    imageSource: require('../../img/img2.png'),
    icon: 'location',
    tag: 'Paso 2',
    title: 'Ubicacion geografica',
    subtitle: 'Indica tu distrito y comunidad para el mapeo epidemiologico.',
  },
  {
    imageSource: require('../../img/img3.png'),
    icon: 'shield-checkmark',
    tag: 'Paso 3',
    title: 'Obten tu diagnostico',
    subtitle: 'La IA analiza tus sintomas y clasifica el nivel de riesgo.',
  },
];

const SYMPTOMS = [
  { name: 'Fiebre', icon: 'thermometer' },
  { name: 'Diarrea', icon: 'water' },
  { name: 'Tos', icon: 'medical' },
  { name: 'Vomitos', icon: 'alert-circle' },
  { name: 'Dolor muscular', icon: 'body' },
  { name: 'Dolor de cabeza', icon: 'finger-print' },
];
const DISTRICTS = ['Calleria', 'Yarinacocha', 'Manantay', 'Campoverde', 'Nueva Requena'];

function classifySymptoms(symptoms: string[]): { risk: RiskLevel; diagnosis: string; recommendation: string } {
  const hasFever = symptoms.includes('Fiebre');
  const hasMusclePain = symptoms.includes('Dolor muscular');
  const hasHeadache = symptoms.includes('Dolor de cabeza');
  const hasCough = symptoms.includes('Tos');
  const hasDiarrhea = symptoms.includes('Diarrea');
  const hasVomit = symptoms.includes('Vomitos');

  if (hasFever && (hasMusclePain || hasHeadache)) {
    return { risk: 'alto', diagnosis: 'Sospecha de Dengue / Malaria', recommendation: 'Sintomas compatibles con Dengue o Malaria. Acude de inmediato al centro de salud y no te automediques.' };
  }
  if (hasCough && hasFever) {
    return { risk: 'medio', diagnosis: 'Infeccion Respiratoria', recommendation: 'Sintomas respiratorios detectados. Usa mascarilla, mantente en reposo y monitorea tu temperatura.' };
  }
  if (hasDiarrhea || hasVomit) {
    return { risk: 'medio', diagnosis: 'Infeccion Gastrointestinal', recommendation: 'Sintomas digestivos. Evita la deshidratacion tomando abundante agua de mesa o suero oral.' };
  }
  if (symptoms.length >= 2) {
    return { risk: 'medio', diagnosis: 'Sintomas multiples', recommendation: 'Monitorea tus sintomas. Si empeoran o presentas fiebre persistente, acude al puesto de salud.' };
  }
  return { risk: 'bajo', diagnosis: 'Sintomas leves', recommendation: 'Mantente en observacion. Si las molestias persisten por mas de 48 horas, consulta a un profesional.' };
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
      Alert.alert('Error', 'Selecciona al menos un sintoma para continuar.');
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
      'Reporte Enviado',
      `Diagnostico: ${assessment.diagnosis}\nRiesgo: ${assessment.risk.toUpperCase()}\n\n${assessment.recommendation}`,
      [{ text: 'Entendido', onPress: () => { setSelected([]); setDistrict(''); setCommunity(''); navigation.navigate('MyReports'); } }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Carrusel */}
      <AutoCarousel
        height={220}
        items={CAROUSEL_ITEMS.map((item, i) => (
          <BannerSlide key={i} {...item} />
        ))}
      />

      <View style={styles.headerSection}>
        <View style={styles.headerIcon}>
          <Ionicons name="pulse" size={20} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.title}>Reportar Sintomas</Text>
          <Text style={styles.subtitle}>Selecciona los sintomas de las ultimas 24 horas.</Text>
        </View>
      </View>

      <Text style={styles.label}>Sintomas</Text>
      <View style={styles.chipsGrid}>
        {SYMPTOMS.map((symptom) => {
          const active = selected.includes(symptom.name);
          return (
            <Pressable
              key={symptom.name}
              onPress={() => toggleSymptom(symptom.name)}
              style={({ pressed }) => [
                styles.chip,
                active && styles.chipActive,
                pressed && styles.chipPressed,
              ]}
            >
              <View style={[styles.chipIconWrap, active && styles.chipIconWrapActive]}>
                <Ionicons name={symptom.icon as any} size={20} color={active ? '#fff' : colors.primary} />
              </View>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{symptom.name}</Text>
              {active && (
                <View style={styles.chipCheck}>
                  <Ionicons name="checkmark" size={12} color="#fff" />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Distrito de residencia</Text>
      <Pressable
        style={({ pressed }) => [styles.pickerButton, pressed && styles.pickerPressed]}
        onPress={() => setIsDistrictModalOpen(true)}
      >
        <View style={styles.pickerIconWrap}>
          <Ionicons name="map" size={16} color={colors.primary} />
        </View>
        <Text style={[styles.pickerButtonText, !district && { color: colors.textTertiary }]}>
          {district || 'Selecciona tu distrito...'}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textTertiary} />
      </Pressable>

      <Text style={styles.label}>Comunidad / Barrio</Text>
      <View style={styles.inputWrap}>
        <View style={styles.inputIconWrap}>
          <Ionicons name="location" size={16} color={colors.primary} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Ej. San Jose, Puerto Callao..."
          placeholderTextColor={colors.textTertiary}
          value={community}
          onChangeText={setCommunity}
        />
      </View>

      {/* Boton CTA moderno */}
      <Pressable
        style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
        onPress={handleSubmit}
      >
        <View style={styles.ctaGlow} />
        <View style={styles.ctaContent}>
          <View style={styles.ctaIconWrap}>
            <Ionicons name="send" size={18} color="#fff" />
          </View>
          <View style={styles.ctaTextWrap}>
            <Text style={styles.ctaTitle}>Enviar reporte epidemiologico</Text>
            <Text style={styles.ctaDesc}>Tu reporte ayuda a proteger a la comunidad</Text>
          </View>
          <View style={styles.ctaArrow}>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </View>
        </View>
      </Pressable>

      <Modal visible={isDistrictModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecciona tu distrito</Text>
              <Pressable style={styles.modalClose} onPress={() => setIsDistrictModalOpen(false)}>
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </Pressable>
            </View>
            <FlatList
              data={DISTRICTS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.modalOption, district === item && styles.modalOptionActive]}
                  onPress={() => { setDistrict(item); setIsDistrictModalOpen(false); }}
                >
                  <View style={[styles.modalOptionIcon, { backgroundColor: district === item ? colors.primaryLight : colors.borderLight }]}>
                    <Ionicons name="location" size={16} color={district === item ? colors.primary : colors.textTertiary} />
                  </View>
                  <Text style={[styles.modalOptionText, district === item && { color: colors.primary, fontWeight: '700' }]}>{item}</Text>
                  {district === item && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
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
  content: { padding: CAROUSEL_MARGIN, paddingTop: 12, gap: 10 },
  headerSection: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 2 },
  headerIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  label: { fontSize: 12, fontWeight: '700', color: colors.textPrimary, marginTop: 4 },
  /* Chips tipo tarjeta */
  chipsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '48%' as any,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipPressed: { transform: [{ scale: 0.96 }] },
  chipActive: {
    backgroundColor: '#F0FDF9',
    borderColor: colors.primary,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  chipIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipIconWrapActive: { backgroundColor: colors.primary },
  chipText: { flex: 1, color: colors.textPrimary, fontWeight: '700', fontSize: 13 },
  chipTextActive: { color: colors.primary },
  chipCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* Picker */
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  pickerPressed: { borderColor: colors.primary, transform: [{ scale: 0.98 }] },
  pickerIconWrap: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  pickerButtonText: { flex: 1, fontSize: 14, color: colors.textPrimary },
  /* Input */
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
  },
  inputIconWrap: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, paddingVertical: 11, color: colors.textPrimary, fontSize: 14 },
  /* CTA Button moderno */
  ctaButton: {
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 10,
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
  },
  ctaButtonPressed: { transform: [{ scale: 0.97 }], elevation: 3, shadowOpacity: 0.15 },
  ctaGlow: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.primary, borderRadius: 18 },
  ctaContent: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15 },
  ctaIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  ctaTextWrap: { flex: 1, gap: 2 },
  ctaTitle: { fontSize: 15, fontWeight: '800', color: '#fff' },
  ctaDesc: { fontSize: 11, color: 'rgba(255,255,255,0.8)', lineHeight: 14 },
  ctaArrow: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  /* Modal */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '50%' },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 12 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  modalClose: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.borderLight, alignItems: 'center', justifyContent: 'center' },
  modalOption: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  modalOptionActive: { backgroundColor: '#F0FDF9' },
  modalOptionIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  modalOptionText: { flex: 1, fontSize: 14, color: colors.textPrimary },
});
