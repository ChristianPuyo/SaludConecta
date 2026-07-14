import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useVisits } from '../../context/VisitsContext';
import { colors } from '../../theme/colors';
import type { AgentTabParamList } from '../../navigation/AgentNavigator';

type Nav = BottomTabNavigationProp<AgentTabParamList, 'RegisterVisit'>;

const VACCINE_OPTIONS = ['COVID-19', 'Influenza', 'VPH', 'Hepatitis B', 'Tétanos', 'Fiebre Amarilla'];

export function RegisterVisitScreen() {
  const navigation = useNavigation<Nav>();
  const { addVisit } = useVisits();
  const [patientName, setPatientName] = useState('');
  const [community, setCommunity] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'M' | 'F' | ''>('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [glucose, setGlucose] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [selectedVaccines, setSelectedVaccines] = useState<string[]>([]);
  const [isPregnant, setIsPregnant] = useState(false);
  const [pregnancyWeeks, setPregnancyWeeks] = useState('');

  const toggleVaccine = (v: string) => {
    setSelectedVaccines((prev) =>
      prev.includes(v) ? prev.filter((item) => item !== v) : [...prev, v]
    );
  };

  const handleSave = () => {
    if (!patientName || !community) {
      Alert.alert('Completa al menos el nombre y la comunidad');
      return;
    }
    addVisit({
      patientName,
      community,
      age: age ? parseInt(age, 10) : undefined,
      sex: (sex as 'M' | 'F') || undefined,
      bloodPressure,
      glucose,
      temperature,
      weight,
      height,
      vaccines: selectedVaccines.length > 0 ? selectedVaccines : undefined,
      pregnant: isPregnant || undefined,
      pregnancyWeeks: isPregnant && pregnancyWeeks ? parseInt(pregnancyWeeks, 10) : undefined,
    });
    Alert.alert('Guardado localmente', 'La visita se sincronizará cuando haya conexión.');
    setPatientName('');
    setCommunity('');
    setAge('');
    setSex('');
    setBloodPressure('');
    setGlucose('');
    setTemperature('');
    setWeight('');
    setHeight('');
    setSelectedVaccines([]);
    setIsPregnant(false);
    setPregnancyWeeks('');
    navigation.navigate('Sync');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Registrar visita</Text>
      <Text style={styles.subtitle}>Datos del paciente y signos vitales</Text>

      {/* Datos del paciente */}
      <Text style={styles.sectionLabel}>Datos del paciente</Text>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Nombre del paciente *</Text>
        <TextInput style={styles.input} value={patientName} onChangeText={setPatientName} placeholderTextColor={colors.textSecondary} />
      </View>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Comunidad *</Text>
        <TextInput style={styles.input} value={community} onChangeText={setCommunity} placeholderTextColor={colors.textSecondary} />
      </View>
      <View style={styles.row}>
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Edad</Text>
          <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" placeholderTextColor={colors.textSecondary} />
        </View>
        <View style={{ width: 12 }} />
        <View style={[styles.fieldGroup, { flex: 1 }]}>
          <Text style={styles.label}>Sexo</Text>
          <View style={styles.sexRow}>
            <Pressable onPress={() => setSex(sex === 'M' ? '' : 'M')} style={[styles.sexBtn, sex === 'M' && styles.sexBtnActive]}>
              <Text style={[styles.sexBtnText, sex === 'M' && styles.sexBtnTextActive]}>M</Text>
            </Pressable>
            <Pressable onPress={() => setSex(sex === 'F' ? '' : 'F')} style={[styles.sexBtn, sex === 'F' && styles.sexBtnActive]}>
              <Text style={[styles.sexBtnText, sex === 'F' && styles.sexBtnTextActive]}>F</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Signos vitales */}
      <Text style={styles.sectionLabel}>Signos vitales</Text>
      {[
        { label: 'Presión arterial', value: bloodPressure, onChange: setBloodPressure, placeholder: 'Ej: 120/80' },
        { label: 'Glucosa (mg/dL)', value: glucose, onChange: setGlucose, placeholder: 'Ej: 95' },
        { label: 'Temperatura (°C)', value: temperature, onChange: setTemperature, placeholder: 'Ej: 36.5' },
        { label: 'Peso (kg)', value: weight, onChange: setWeight, placeholder: 'Ej: 62' },
        { label: 'Talla (cm)', value: height, onChange: setHeight, placeholder: 'Ej: 160' },
      ].map((field) => (
        <View key={field.label} style={styles.fieldGroup}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={styles.input}
            value={field.value}
            onChangeText={field.onChange}
            placeholder={field.placeholder}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      ))}

      {/* Vacunas */}
      <Text style={styles.sectionLabel}>Vacunas aplicadas</Text>
      <View style={styles.chipsWrap}>
        {VACCINE_OPTIONS.map((v) => {
          const active = selectedVaccines.includes(v);
          return (
            <Pressable key={v} onPress={() => toggleVaccine(v)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{active ? '✓ ' : ''}{v}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Embarazo */}
      <Text style={styles.sectionLabel}>Embarazo</Text>
      <Pressable onPress={() => setIsPregnant(!isPregnant)} style={[styles.pregnantBtn, isPregnant && styles.pregnantBtnActive]}>
        <Text style={[styles.pregnantBtnText, isPregnant && styles.pregnantBtnTextActive]}>
          {isPregnant ? '✓ Embarazada' : 'No embarazada'}
        </Text>
      </Pressable>
      {isPregnant && (
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Semanas de gestación</Text>
          <TextInput
            style={styles.input}
            value={pregnancyWeeks}
            onChangeText={setPregnancyWeeks}
            keyboardType="numeric"
            placeholder="Ej: 22"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      )}

      <Pressable style={styles.primaryButton} onPress={handleSave}>
        <Text style={styles.primaryButtonText}>Guardar visita</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 4 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginTop: 12, marginBottom: 4 },
  fieldGroup: { marginBottom: 10 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 },
  input: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  row: { flexDirection: 'row' },
  sexRow: { flexDirection: 'row', gap: 8 },
  sexBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
    alignItems: 'center',
  },
  sexBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  sexBtnText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  sexBtnTextActive: { color: '#fff' },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999,
    borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textPrimary, fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: '#fff' },
  pregnantBtn: {
    paddingVertical: 12, borderRadius: 12, borderWidth: 1,
    borderColor: colors.border, backgroundColor: colors.surface, alignItems: 'center', marginBottom: 10,
  },
  pregnantBtnActive: { backgroundColor: '#FDF2F8', borderColor: '#EC4899' },
  pregnantBtnText: { fontWeight: '600', color: colors.textSecondary },
  pregnantBtnTextActive: { color: '#EC4899' },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
