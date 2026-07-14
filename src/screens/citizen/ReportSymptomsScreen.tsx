import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useReports } from '../../context/ReportsContext';
import { colors } from '../../theme/colors';
import type { RiskLevel } from '../../components/RiskBadge';
import type { CitizenTabParamList } from '../../types/navigation';
import { SafeScreen } from '../../components/SafeScreen';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { Pressable } from 'react-native';
import { classifyRisk } from '../../utils/epidemiology';

type Nav = BottomTabNavigationProp<CitizenTabParamList, 'ReportSymptoms'>;

const SYMPTOMS = ['Fiebre', 'Diarrea', 'Tos', 'Vómitos', 'Dolor muscular', 'Dolor de cabeza'];


export function ReportSymptomsScreen() {
  const navigation = useNavigation<Nav>();
  const { addReport } = useReports();
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
      Alert.alert('Falta información', 'Selecciona al menos un síntoma para enviar el reporte.');
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
    setDistrict('');
    setCommunity('');
    navigation.navigate('MyReports');
  };

  return (
    <SafeScreen
      scrollable
      keyboardAvoiding
      dismissKeyboardOnTap
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>¿Cómo te sientes hoy?</Text>
      <Text style={styles.subtitle}>Selecciona todos los síntomas que presentas</Text>

      <View style={styles.chipsWrap}>
        {SYMPTOMS.map((symptom) => {
          const active = selected.includes(symptom);
          return (
            <Pressable
              key={symptom}
              onPress={() => toggleSymptom(symptom)}
              style={({ pressed }) => [
                styles.chip,
                active && styles.chipActive,
                pressed && styles.chipPressed,
              ]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{symptom}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.form}>
        <InputField
          label="Distrito"
          placeholder="Ej. Callería"
          icon="map-outline"
          value={district}
          onChangeText={setDistrict}
        />
        
        <InputField
          label="Comunidad / Sector"
          placeholder="Ej. San Francisco"
          icon="home-outline"
          value={community}
          onChangeText={setCommunity}
        />

        <Button
          title="Enviar reporte"
          onPress={handleSubmit}
          icon="paper-plane-outline"
          style={styles.primaryButton}
        />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 12 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipPressed: { opacity: 0.75 },
  chipText: { color: colors.textPrimary, fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  form: { gap: 8 },
  primaryButton: { marginTop: 12 },
});

