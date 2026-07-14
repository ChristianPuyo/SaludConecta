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

  const handleSave = () => {
    if (!patientName.trim() || !community.trim()) {
      Alert.alert('Faltan Datos', 'Completa al menos el nombre del paciente y la comunidad.');
      return;
    }

    // Validate temperature if entered
    if (temperature.trim()) {
      const tempNum = parseFloat(temperature);
      if (isNaN(tempNum) || tempNum < 32 || tempNum > 43) {
        Alert.alert('Dato Incorrecto', 'La temperatura debe ser un número válido entre 32°C y 43°C.');
        return;
      }
    }

    // Validate glucose if entered
    if (glucose.trim()) {
      const glucoseNum = parseFloat(glucose);
      if (isNaN(glucoseNum) || glucoseNum <= 0) {
        Alert.alert('Dato Incorrecto', 'El valor de glucosa debe ser un número positivo.');
        return;
      }
    }

    // Validate weight if entered
    if (weight.trim()) {
      const weightNum = parseFloat(weight);
      if (isNaN(weightNum) || weightNum <= 0) {
        Alert.alert('Dato Incorrecto', 'El peso debe ser un número positivo (kg).');
        return;
      }
    }

    // Validate height if entered
    if (height.trim()) {
      const heightNum = parseFloat(height);
      if (isNaN(heightNum) || heightNum <= 0) {
        Alert.alert('Dato Incorrecto', 'La talla debe ser un número positivo en centímetros.');
        return;
      }
    }

    addVisit({ patientName, community, bloodPressure, glucose, temperature, weight, height });
    Alert.alert('Guardado Localmente', 'La visita se guardó en el almacenamiento de este dispositivo y se sincronizará cuando tengas red.');
    
    setPatientName('');
    setCommunity('');
    setBloodPressure('');
    setGlucose('');
    setTemperature('');
    setWeight('');
    setHeight('');
    navigation.navigate('Sync');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Registrar visita médica</Text>

      {[
        { label: 'Nombre del paciente', value: patientName, onChange: setPatientName, placeholder: 'Ej. Juan Pérez López', keyboardType: 'default' },
        { label: 'Comunidad / Caserío', value: community, onChange: setCommunity, placeholder: 'Ej. Puerto Callao', keyboardType: 'default' },
        { label: 'Presión arterial', value: bloodPressure, onChange: setBloodPressure, placeholder: 'Ej. 120/80 (mmHg)', keyboardType: 'numbers-and-punctuation' },
        { label: 'Glucosa', value: glucose, onChange: setGlucose, placeholder: 'Ej. 90 (mg/dL)', keyboardType: 'numeric' },
        { label: 'Temperatura', value: temperature, onChange: setTemperature, placeholder: 'Ej. 36.5 (°C)', keyboardType: 'decimal-pad' },
        { label: 'Peso (kg)', value: weight, onChange: setWeight, placeholder: 'Ej. 72.4', keyboardType: 'decimal-pad' },
        { label: 'Talla (cm)', value: height, onChange: setHeight, placeholder: 'Ej. 168', keyboardType: 'numeric' },
      ].map((field) => (
        <View key={field.label} style={styles.fieldGroup}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={styles.input}
            value={field.value}
            onChangeText={field.onChange}
            placeholder={field.placeholder}
            placeholderTextColor={colors.textSecondary}
            keyboardType={field.keyboardType as any}
          />
        </View>
      ))}

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
    marginTop: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
