import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useVisits } from '../../context/VisitsContext';
import { colors } from '../../theme/colors';
import type { AgentTabParamList } from '../../types/navigation';
import { SafeScreen } from '../../components/SafeScreen';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import type { Ionicons } from '@expo/vector-icons';

type Nav = BottomTabNavigationProp<AgentTabParamList, 'RegisterVisit'>;

interface FieldConfig {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
}

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
    if (!patientName || !community) {
      Alert.alert('Falta información', 'Completa al menos el nombre del paciente y la comunidad.');
      return;
    }
    
    // Validaciones básicas de formato
    if (temperature && (parseFloat(temperature) < 30 || parseFloat(temperature) > 45)) {
      Alert.alert('Valor inválido', 'La temperatura debe estar entre 30 y 45 °C.');
      return;
    }

    addVisit({ patientName, community, bloodPressure, glucose, temperature, weight, height });
    Alert.alert('Guardado localmente', 'La visita se ha guardado localmente y se sincronizará cuando haya conexión.');
    setPatientName('');
    setCommunity('');
    setBloodPressure('');
    setGlucose('');
    setTemperature('');
    setWeight('');
    setHeight('');
    navigation.navigate('Sync');
  };

  const fields: FieldConfig[] = [
    {
      label: 'Nombre del paciente',
      value: patientName,
      onChange: setPatientName,
      placeholder: 'Ej. Juan Pérez',
      icon: 'person-outline',
    },
    {
      label: 'Comunidad',
      value: community,
      onChange: setCommunity,
      placeholder: 'Ej. Santa Clara',
      icon: 'home-outline',
    },
    {
      label: 'Presión arterial',
      value: bloodPressure,
      onChange: setBloodPressure,
      placeholder: 'Ej. 120/80 mmHg',
      icon: 'heart-outline',
    },
    {
      label: 'Glucosa',
      value: glucose,
      onChange: setGlucose,
      placeholder: 'Ej. 95 mg/dL',
      icon: 'water-outline',
      keyboardType: 'numeric',
    },
    {
      label: 'Temperatura',
      value: temperature,
      onChange: setTemperature,
      placeholder: 'Ej. 36.5 °C',
      icon: 'thermometer-outline',
      keyboardType: 'decimal-pad',
    },
    {
      label: 'Peso (kg)',
      value: weight,
      onChange: setWeight,
      placeholder: 'Ej. 72.5 kg',
      icon: 'speedometer-outline',
      keyboardType: 'decimal-pad',
    },
    {
      label: 'Talla (cm)',
      value: height,
      onChange: setHeight,
      placeholder: 'Ej. 170 cm',
      icon: 'resize-outline',
      keyboardType: 'numeric',
    },
  ];

  return (
    <SafeScreen
      scrollable
      keyboardAvoiding
      dismissKeyboardOnTap
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Registrar visita</Text>
      <Text style={styles.subtitle}>Completa las métricas de salud obtenidas en la visita domiciliaria</Text>

      <View style={styles.form}>
        {fields.map((field) => (
          <InputField
            key={field.label}
            label={field.label}
            value={field.value}
            onChangeText={field.onChange}
            placeholder={field.placeholder}
            icon={field.icon}
            keyboardType={field.keyboardType || 'default'}
          />
        ))}

        <Button
          title="Guardar visita"
          onPress={handleSave}
          icon="save-outline"
          style={styles.primaryButton}
        />
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 16 },
  form: { gap: 4 },
  primaryButton: { marginTop: 16 },
});

