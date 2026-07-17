import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
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
    if (temperature.trim()) {
      const tempNum = parseFloat(temperature);
      if (isNaN(tempNum) || tempNum < 32 || tempNum > 43) {
        Alert.alert('Dato Incorrecto', 'La temperatura debe ser entre 32 y 43 grados.');
        return;
      }
    }
    if (glucose.trim()) {
      const glucoseNum = parseFloat(glucose);
      if (isNaN(glucoseNum) || glucoseNum <= 0) {
        Alert.alert('Dato Incorrecto', 'El valor de glucosa debe ser un numero positivo.');
        return;
      }
    }
    if (weight.trim()) {
      const weightNum = parseFloat(weight);
      if (isNaN(weightNum) || weightNum <= 0) {
        Alert.alert('Dato Incorrecto', 'El peso debe ser un numero positivo (kg).');
        return;
      }
    }
    if (height.trim()) {
      const heightNum = parseFloat(height);
      if (isNaN(heightNum) || heightNum <= 0) {
        Alert.alert('Dato Incorrecto', 'La talla debe ser un numero positivo en cm.');
        return;
      }
    }

    addVisit({ patientName, community, bloodPressure, glucose, temperature, weight, height });
    Alert.alert(
      'Guardado Localmente',
      'La visita se guardo y se sincronizara cuando tengas red.'
    );

    setPatientName('');
    setCommunity('');
    setBloodPressure('');
    setGlucose('');
    setTemperature('');
    setWeight('');
    setHeight('');
    navigation.navigate('Sync');
  };

  const fields = [
    { label: 'Nombre del paciente', value: patientName, onChange: setPatientName, placeholder: 'Ej. Juan Perez', icon: 'person-outline', keyboardType: 'default' },
    { label: 'Comunidad / Caserio', value: community, onChange: setCommunity, placeholder: 'Ej. Puerto Callao', icon: 'home-outline', keyboardType: 'default' },
    { label: 'Presion arterial', value: bloodPressure, onChange: setBloodPressure, placeholder: 'Ej. 120/80 mmHg', icon: 'pulse-outline', keyboardType: 'numbers-and-punctuation' },
    { label: 'Glucosa (mg/dL)', value: glucose, onChange: setGlucose, placeholder: 'Ej. 90', icon: 'water-outline', keyboardType: 'numeric' },
    { label: 'Temperatura (C)', value: temperature, onChange: setTemperature, placeholder: 'Ej. 36.5', icon: 'thermometer-outline', keyboardType: 'decimal-pad' },
    { label: 'Peso (kg)', value: weight, onChange: setWeight, placeholder: 'Ej. 72.4', icon: 'body-outline', keyboardType: 'decimal-pad' },
    { label: 'Talla (cm)', value: height, onChange: setHeight, placeholder: 'Ej. 168', icon: 'resize-outline', keyboardType: 'numeric' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerSection}>
        <View style={styles.headerIcon}>
          <Ionicons name="medkit" size={20} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.title}>Nueva Visita</Text>
          <Text style={styles.subtitle}>Registrar datos del paciente en campo</Text>
        </View>
      </View>

      {fields.map((field) => (
        <View key={field.label} style={styles.fieldGroup}>
          <Text style={styles.label}>{field.label}</Text>
          <View style={styles.inputWrap}>
            <Ionicons name={field.icon as any} size={17} color={colors.textTertiary} />
            <TextInput
              style={styles.input}
              value={field.value}
              onChangeText={field.onChange}
              placeholder={field.placeholder}
              placeholderTextColor={colors.textTertiary}
              keyboardType={field.keyboardType as any}
            />
          </View>
        </View>
      ))}

      <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]} onPress={handleSave}>
        <Ionicons name="save-outline" size={18} color="#fff" />
        <Text style={styles.primaryButtonText}>Guardar visita localmente</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 10 },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  fieldGroup: { gap: 4 },
  label: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 14,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    marginTop: 12,
    marginBottom: 16,
  },
  primaryButtonPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
