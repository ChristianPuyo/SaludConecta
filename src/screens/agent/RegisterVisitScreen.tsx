import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useVisits } from '../../context/VisitsContext';
import { colors } from '../../theme/colors';
import type { AgentTabParamList } from '../../navigation/AgentNavigator';

type Nav = BottomTabNavigationProp<AgentTabParamList, 'RegisterVisit'>;

export function RegisterVisitScreen() {
  const navigation = useNavigation<Nav>();
  const { addVisit } = useVisits();
  const [patientName, setPatientName] = useState('');
  const [community, setCommunity] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [glucose, setGlucose] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [isPregnant, setIsPregnant] = useState(false);
  const [vaccinesUpToDate, setVaccinesUpToDate] = useState(true);

  const handleSave = () => {
    if (!patientName || !community) {
      Alert.alert('Completa al menos el nombre y la comunidad');
      return;
    }
    addVisit({ 
      patientName, 
      community, 
      bloodPressure, 
      glucose, 
      temperature, 
      weight, 
      height,
      isPregnant,
      vaccinesUpToDate
    });
    Alert.alert('Guardado localmente', 'La visita se sincronizará cuando haya conexión.');
    setPatientName('');
    setCommunity('');
    setBloodPressure('');
    setGlucose('');
    setTemperature('');
    setWeight('');
    setHeight('');
    setIsPregnant(false);
    setVaccinesUpToDate(true);
    navigation.navigate('Sync');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Registrar visita</Text>

      {[
        { label: 'Nombre del paciente', value: patientName, onChange: setPatientName },
        { label: 'Comunidad', value: community, onChange: setCommunity },
        { label: 'Presión arterial', value: bloodPressure, onChange: setBloodPressure },
        { label: 'Glucosa', value: glucose, onChange: setGlucose },
        { label: 'Temperatura (°C)', value: temperature, onChange: setTemperature },
        { label: 'Peso (kg)', value: weight, onChange: setWeight },
        { label: 'Talla (cm)', value: height, onChange: setHeight },
      ].map((field) => (
        <View key={field.label} style={styles.fieldGroup}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={styles.input}
            value={field.value}
            onChangeText={field.onChange}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      ))}

      <View style={styles.toggleRow}>
        <View style={styles.toggleField}>
          <Text style={styles.label}>¿Es gestante?</Text>
          <View style={styles.pillContainer}>
            <Pressable
              style={[styles.pillButton, isPregnant && styles.pillActive]}
              onPress={() => setIsPregnant(true)}
            >
              <Text style={[styles.pillText, isPregnant && styles.pillTextActive]}>Sí</Text>
            </Pressable>
            <Pressable
              style={[styles.pillButton, !isPregnant && styles.pillActive]}
              onPress={() => setIsPregnant(false)}
            >
              <Text style={[styles.pillText, !isPregnant && styles.pillTextActive]}>No</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.toggleField}>
          <Text style={styles.label}>¿Vacunas al día?</Text>
          <View style={styles.pillContainer}>
            <Pressable
              style={[styles.pillButton, vaccinesUpToDate && styles.pillActive]}
              onPress={() => setVaccinesUpToDate(true)}
            >
              <Text style={[styles.pillText, vaccinesUpToDate && styles.pillTextActive]}>Sí</Text>
            </Pressable>
            <Pressable
              style={[styles.pillButton, !vaccinesUpToDate && styles.pillActive]}
              onPress={() => setVaccinesUpToDate(false)}
            >
              <Text style={[styles.pillText, !vaccinesUpToDate && styles.pillTextActive]}>No</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Pressable style={styles.primaryButton} onPress={handleSave}>
        <Text style={styles.primaryButtonText}>Guardar visita localmente</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 4 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: 12 },
  fieldGroup: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  toggleRow: { flexDirection: 'row', gap: 16, marginBottom: 16, marginTop: 4 },
  toggleField: { flex: 1, gap: 4 },
  pillContainer: { flexDirection: 'row', gap: 6, backgroundColor: '#E2E8F0', padding: 3, borderRadius: 12 },
  pillButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 9, backgroundColor: 'transparent' },
  pillActive: { backgroundColor: colors.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  pillText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  pillTextActive: { color: colors.primary },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
