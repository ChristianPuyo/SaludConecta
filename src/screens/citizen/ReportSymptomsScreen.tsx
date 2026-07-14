import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useReports } from '../../context/ReportsContext';
import { useRole } from '../../context/RoleContext';
import { colors } from '../../theme/colors';
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
  const { citizenProfile } = useRole();
  
  const [selected, setSelected] = useState<string[]>([]);
  const [district, setDistrict] = useState(citizenProfile?.district || '');
  const [community, setCommunity] = useState(citizenProfile?.community || '');

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
    addReport({
      id: Date.now().toString(),
      date: 'Hoy',
      district: district || 'Callería',
      symptoms: selected,
      risk,
    });
    Alert.alert(
      'Reporte enviado',
      `La IA clasificó tu reporte como riesgo ${risk.toUpperCase()}. Gracias por ayudar a proteger a tu comunidad.`
    );
    setSelected([]);
    // Mantener precargados los datos de perfil para el siguiente reporte
    setDistrict(citizenProfile?.district || '');
    setCommunity(citizenProfile?.community || '');
    navigation.navigate('MyReports');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Indicador de Perfil del Ciudadano */}
      {citizenProfile && (
        <View style={styles.profileCard}>
          <View style={styles.profileIconWrap}>
            <Ionicons name="person" size={20} color={colors.primary} />
          </View>
          <View style={styles.profileTextWrap}>
            <Text style={styles.profileName}>{citizenProfile.fullName}</Text>
            <Text style={styles.profileDetails}>
              {citizenProfile.age} años · {citizenProfile.gender.toUpperCase()}
            </Text>
          </View>
        </View>
      )}

      <Text style={styles.title}>¿Cómo te sientes hoy?</Text>
      <Text style={styles.subtitle}>Selecciona todos los síntomas que presentas</Text>

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

      <Text style={styles.inputLabel}>Ubicación del Reporte</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Distrito"
        placeholderTextColor={colors.textSecondary}
        value={district}
        onChangeText={setDistrict}
      />
      <TextInput
        style={styles.input}
        placeholder="Comunidad"
        placeholderTextColor={colors.textSecondary}
        value={community}
        onChangeText={setCommunity}
      />

      <Pressable style={styles.primaryButton} onPress={handleSubmit}>
        <Text style={styles.primaryButtonText}>Enviar reporte</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 12 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#E0F2FE',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 8,
  },
  profileIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTextWrap: {
    flex: 1,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  profileDetails: {
    fontSize: 11,
    color: colors.textSecondary,
  },
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
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
    marginBottom: -4,
  },
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
