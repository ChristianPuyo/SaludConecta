import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useVisits } from '../../context/VisitsContext';
import { colors, shadows } from '../../theme/colors';
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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSave = async () => {
    if (!patientName.trim() || !community.trim()) {
      Alert.alert('Datos incompletos', 'Completa al menos el nombre del paciente y la comunidad.');
      return;
    }
    await addVisit({
      patientName: patientName.trim(),
      community: community.trim(),
      bloodPressure: bloodPressure.trim(),
      glucose: glucose.trim(),
      temperature: temperature.trim(),
      weight: weight.trim(),
      height: height.trim(),
    });
    Alert.alert('Guardado localmente', 'La visita se ha guardado en el dispositivo y se sincronizará cuando haya conexión.');
    setPatientName('');
    setCommunity('');
    setBloodPressure('');
    setGlucose('');
    setTemperature('');
    setWeight('');
    setHeight('');
    navigation.navigate('Sync');
  };

  const sections = [
    {
      title: 'Datos del Paciente',
      icon: 'person-outline' as const,
      fields: [
        { label: 'Nombre del paciente', value: patientName, onChange: setPatientName, placeholder: 'Ej. Juan Pérez', icon: 'person-outline' as const },
        { label: 'Comunidad', value: community, onChange: setCommunity, placeholder: 'Ej. Callería', icon: 'navigate-outline' as const },
      ],
    },
    {
      title: 'Signos Vitales y Medidas',
      icon: 'pulse-outline' as const,
      fields: [
        { label: 'Presión arterial', value: bloodPressure, onChange: setBloodPressure, placeholder: 'Ej. 120/80 mmHg', icon: 'pulse-outline' as const },
        { label: 'Glucosa', value: glucose, onChange: setGlucose, placeholder: 'Ej. 90 mg/dL', icon: 'water-outline' as const },
        { label: 'Temperatura', value: temperature, onChange: setTemperature, placeholder: 'Ej. 36.5 °C', icon: 'thermometer-outline' as const },
        { label: 'Peso (kg)', value: weight, onChange: setWeight, placeholder: 'Ej. 70 kg', icon: 'fitness-outline' as const },
        { label: 'Talla (cm)', value: height, onChange: setHeight, placeholder: 'Ej. 170 cm', icon: 'resize-outline' as const },
      ],
    },
  ];

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
        <Text style={styles.title}>Registrar Visita</Text>
        <Text style={styles.subtitle}>Ingresa la información clínica recolectada en campo</Text>

        {sections.map((section) => (
          <View key={section.title} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconWrap}>
                <Ionicons name={section.icon} size={18} color={colors.primary} />
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>

            <View style={styles.fieldsList}>
              {section.fields.map((field) => {
                const isFocused = focusedField === field.label;
                return (
                  <View key={field.label} style={styles.fieldGroup}>
                    <Text style={styles.label}>{field.label}</Text>
                    <View style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}>
                      <Ionicons 
                        name={field.icon} 
                        size={18} 
                        color={isFocused ? colors.primary : colors.textMuted} 
                        style={styles.inputIcon} 
                      />
                      <TextInput
                        style={styles.input}
                        value={field.value}
                        onChangeText={field.onChange}
                        placeholder={field.placeholder}
                        placeholderTextColor={colors.textPlaceholder}
                        onFocus={() => setFocusedField(field.label)}
                        onBlur={() => setFocusedField(null)}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
          onPress={handleSave}
        >
          <Ionicons name="save" size={18} color="#fff" />
          <Text style={styles.primaryButtonText}>Guardar visita localmente</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 4 },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 16,
    ...shadows.sm,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionIconWrap: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.2 },
  fieldsList: { gap: 14 },
  fieldGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: '800', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.3, marginLeft: 2 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 12,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1,
    paddingVertical: 12,
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
    marginTop: 8, 
    shadowColor: colors.primary, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 8, 
    elevation: 2 
  },
  primaryButtonPressed: { backgroundColor: colors.primaryDark, opacity: 0.95, transform: [{ scale: 0.98 }] },
  primaryButtonText: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: -0.2 },
});


