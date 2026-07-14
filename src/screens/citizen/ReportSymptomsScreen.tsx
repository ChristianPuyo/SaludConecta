import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useReports } from '../../context/ReportsContext';
import { colors, shadows } from '../../theme/colors';
import type { RiskLevel } from '../../components/RiskBadge';
import type { CitizenTabParamList } from '../../navigation/CitizenNavigator';

type Nav = BottomTabNavigationProp<CitizenTabParamList, 'ReportSymptoms'>;

const SYMPTOMS = ['Fiebre', 'Diarrea', 'Tos', 'Vómitos', 'Dolor muscular', 'Dolor de cabeza'];

function classifyRisk(symptomCount: number, hasFever: boolean): RiskLevel {
  if (symptomCount >= 3 && hasFever) return 'alto';
  if (symptomCount >= 2) return 'medio';
  return 'bajo';
}

export function ReportSymptomsScreen() {
  const navigation = useNavigation<Nav>();
  const { addReport } = useReports();
  const [selected, setSelected] = useState<string[]>([]);
  const [district, setDistrict] = useState('');
  const [community, setCommunity] = useState('');
  const [districtFocused, setDistrictFocused] = useState(false);
  const [communityFocused, setCommunityFocused] = useState(false);

  const toggleSymptom = (symptom: string) => {
    setSelected((prev) =>
      prev.includes(symptom) ? prev.filter((item) => item !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      Alert.alert('Selección vacía', 'Por favor, selecciona al menos un síntoma para continuar.');
      return;
    }
    const risk = classifyRisk(selected.length, selected.includes('Fiebre'));
    await addReport({
      id: Date.now().toString(),
      date: 'Hoy',
      district: district.trim() || 'Callería',
      symptoms: selected,
      risk,
    });
    Alert.alert(
      'Reporte enviado',
      `La IA clasificó tu reporte como riesgo ${risk.toUpperCase()}. Gracias por ayudar a proteger a tu comunidad.`
    );
    setSelected([]);
    setDistrict('');
    setCommunity('');
    navigation.navigate('MyReports');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>¿Cómo te sientes hoy?</Text>
        <Text style={styles.subtitle}>Selecciona todos los síntomas que presentas en este momento</Text>

        <View style={styles.chipsWrap}>
          {SYMPTOMS.map((symptom) => {
            const active = selected.includes(symptom);
            return (
              <Pressable
                key={symptom}
                onPress={() => toggleSymptom(symptom)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <View style={styles.chipInner}>
                  {active && <Ionicons name="checkmark-circle" size={16} color="#fff" style={styles.chipIcon} />}
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{symptom}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Ubicación del reporte</Text>
        
        <View style={[styles.inputWrapper, districtFocused && styles.inputWrapperFocused]}>
          <Ionicons 
            name="map-outline" 
            size={18} 
            color={districtFocused ? colors.primary : colors.textMuted} 
            style={styles.inputIcon} 
          />
          <TextInput
            style={styles.input}
            placeholder="Distrito (Ej. Callería)"
            placeholderTextColor={colors.textPlaceholder}
            value={district}
            onChangeText={setDistrict}
            onFocus={() => setDistrictFocused(true)}
            onBlur={() => setDistrictFocused(false)}
          />
        </View>

        <View style={[styles.inputWrapper, communityFocused && styles.inputWrapperFocused]}>
          <Ionicons 
            name="home-outline" 
            size={18} 
            color={communityFocused ? colors.primary : colors.textMuted} 
            style={styles.inputIcon} 
          />
          <TextInput
            style={styles.input}
            placeholder="Comunidad / Asentamiento Humano"
            placeholderTextColor={colors.textPlaceholder}
            value={community}
            onChangeText={setCommunity}
            onFocus={() => setCommunityFocused(true)}
            onBlur={() => setCommunityFocused(false)}
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
          onPress={handleSubmit}
        >
          <Ionicons name="paper-plane" size={18} color="#fff" />
          <Text style={styles.primaryButtonText}>Enviar reporte a la comunidad</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 14 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 10, lineHeight: 18 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipInner: { flexDirection: 'row', alignItems: 'center' },
  chipIcon: { marginRight: 6 },
  chipText: { color: colors.textPrimary, fontWeight: '700', fontSize: 13 },
  chipTextActive: { color: '#fff' },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 12, marginBottom: 2, marginLeft: 2 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    ...shadows.sm,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    paddingVertical: 14,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary, 
    borderRadius: 16, 
    paddingVertical: 16, 
    marginVertical: 16, 
    shadowColor: colors.primary, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 8, 
    elevation: 2 
  },
  primaryButtonPressed: { backgroundColor: colors.primaryDark, opacity: 0.95, transform: [{ scale: 0.98 }] },
  primaryButtonText: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: -0.2 },
});

