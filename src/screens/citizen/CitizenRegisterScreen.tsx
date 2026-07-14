import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../../context/RoleContext';
import { colors } from '../../theme/colors';

const GENDERS = [
  { id: 'masculino', label: 'Masculino', icon: 'male-outline' },
  { id: 'femenino', label: 'Femenino', icon: 'female-outline' },
];

const DISTRICT_SUGGESTIONS = ['Callería', 'Yarinacocha', 'Manantay', 'Campoverde', 'Nueva Requena'];

export function CitizenRegisterScreen() {
  const { saveCitizenProfile, clearRole } = useRole();
  const [fullName, setFullName] = useState('');
  const [dni, setDni] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('masculino');
  const [district, setDistrict] = useState('');
  const [community, setCommunity] = useState('');

  const handleRegister = async () => {
    if (!fullName.trim() || !dni.trim() || !age.trim() || !district.trim() || !community.trim()) {
      Alert.alert('Campos requeridos', 'Por favor, completa toda la información solicitada.');
      return;
    }

    const dniRegex = /^\d{8}$/;
    if (!dniRegex.test(dni.trim())) {
      Alert.alert('DNI inválido', 'El DNI debe contener exactamente 8 dígitos numéricos.');
      return;
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 120) {
      Alert.alert('Edad inválida', 'Por favor, introduce una edad válida.');
      return;
    }

    try {
      await saveCitizenProfile({
        fullName: fullName.trim(),
        dni: dni.trim(),
        age: age.trim(),
        gender,
        district: district.trim(),
        community: community.trim(),
      });
      Alert.alert('Registro completado', '¡Bienvenido a Guardian Salud AI!');
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la información del perfil.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scroll}>
        
        {/* Cabecera superior con botón de salida */}
        <View style={styles.header}>
          <Pressable onPress={clearRole} style={styles.backButton} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={colors.primaryDark} />
            <Text style={styles.backButtonText}>Cambiar rol</Text>
          </Pressable>
        </View>

        {/* Sección del Titulo del Formulario */}
        <View style={styles.formHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-add-outline" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.formTitle}>Ficha del Ciudadano</Text>
          <Text style={styles.formSubtitle}>
            Para reportar síntomas y recibir alertas personalizadas en Ucayali, necesitamos registrar tu información básica de salud.
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.formCard}>
          
          {/* Nombre Completo */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Nombre Completo</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Ej. Juan Pérez Celis"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          {/* DNI */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>DNI (Documento Nacional de Identidad)</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="card-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={dni}
                onChangeText={setDni}
                placeholder="Ej. 74839201"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                maxLength={8}
              />
            </View>
          </View>

          {/* Fila de Edad y Sexo */}
          <View style={styles.rowFields}>
            <View style={[styles.fieldGroup, { flex: 0.8 }]}>
              <Text style={styles.label}>Edad</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={age}
                  onChangeText={setAge}
                  placeholder="Años"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>
            </View>
            
            <View style={[styles.fieldGroup, { flex: 1.2 }]}>
              <Text style={styles.label}>Sexo biológico</Text>
              <View style={styles.genderSelectWrap}>
                {GENDERS.map((g) => (
                  <Pressable
                    key={g.id}
                    onPress={() => setGender(g.id)}
                    style={[styles.genderOption, gender === g.id && styles.genderOptionSelected]}
                  >
                    <Ionicons 
                      name={g.icon as any} 
                      size={16} 
                      color={gender === g.id ? '#FFFFFF' : colors.textSecondary} 
                    />
                    <Text style={[styles.genderOptionText, gender === g.id && styles.genderOptionTextSelected]}>
                      {g.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Distrito */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Distrito de Residencia</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="map-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={district}
                onChangeText={setDistrict}
                placeholder="Escribe tu distrito (ej. Callería)"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            
            {/* Sugerencias rápidas de distrito en Ucayali */}
            <View style={styles.suggestionsContainer}>
              {DISTRICT_SUGGESTIONS.map((d) => (
                <Pressable
                  key={d}
                  onPress={() => setDistrict(d)}
                  style={[styles.suggestionChip, district === d && styles.suggestionChipSelected]}
                >
                  <Text style={[styles.suggestionChipText, district === d && styles.suggestionChipTextSelected]}>
                    {d}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Comunidad */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Comunidad / Barrio</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="home-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={community}
                onChangeText={setCommunity}
                placeholder="Ej. Comunidad Nativa Yarina / Sector 4"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          {/* Botón de Enviar */}
          <Pressable style={styles.submitButton} onPress={handleRegister}>
            <Text style={styles.submitButtonText}>Guardar Datos y Entrar</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </Pressable>

        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContainer: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  
  header: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },

  formHeader: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  rowFields: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    color: colors.textPrimary,
    fontSize: 14,
  },

  // Selector de Género
  genderSelectWrap: {
    flexDirection: 'row',
    gap: 6,
    height: 48,
  },
  genderOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  genderOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderOptionText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  genderOptionTextSelected: {
    color: '#FFFFFF',
  },

  // Sugerencias de distritos
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  suggestionChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionChipSelected: {
    backgroundColor: '#E0F2FE',
    borderColor: colors.primary,
  },
  suggestionChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  suggestionChipTextSelected: {
    color: colors.primary,
  },

  // Botón Guardar
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
