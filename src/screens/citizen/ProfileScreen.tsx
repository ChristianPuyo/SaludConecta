import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../../context/ProfileContext';
import type { UserProfile } from '../../models/profile';
import { colors } from '../../theme/colors';
import { BLOOD_TYPES, DISTRICTS } from '../../utils/constants';

export function ProfileScreen() {
  const { profile, saveProfile, hasProfile } = useProfile();
  const [editing, setEditing] = useState(!hasProfile);
  const [form, setForm] = useState<UserProfile>(
    profile ?? {
      name: '', age: 0, sex: 'masculino', weight: 0, height: 0,
      bloodType: '', chronicDiseases: [], allergies: [], medications: [],
      emergencyContact: { name: '', phone: '' },
      address: '', community: '', district: '',
      createdAt: '', updatedAt: '',
    }
  );
  const [chronicInput, setChronicInput] = useState('');
  const [allergyInput, setAllergyInput] = useState('');
  const [medInput, setMedInput] = useState('');

  const update = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addToList = (field: 'chronicDiseases' | 'allergies' | 'medications', input: string, setInput: (v: string) => void) => {
    if (input.trim()) {
      update(field, [...form[field], input.trim()]);
      setInput('');
    }
  };

  const removeFromList = (field: 'chronicDiseases' | 'allergies' | 'medications', index: number) => {
    update(field, form[field].filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Ingresa tu nombre');
      return;
    }
    await saveProfile(form);
    setEditing(false);
    Alert.alert('Perfil guardado');
  };

  if (!editing && hasProfile) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.primary} />
          </View>
          <Text style={styles.name}>{profile!.name}</Text>
          <Text style={styles.detail}>{profile!.age} años · {profile!.sex}</Text>
          <Text style={styles.detail}>{profile!.district}{profile!.community ? ` · ${profile!.community}` : ''}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Salud</Text>
          <InfoRow label="Grupo sanguíneo" value={profile!.bloodType || 'No registrado'} />
          <InfoRow label="Peso" value={profile!.weight ? `${profile!.weight} kg` : 'No registrado'} />
          <InfoRow label="Estatura" value={profile!.height ? `${profile!.height} cm` : 'No registrado'} />
        </View>

        {profile!.chronicDiseases.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Enfermedades Crónicas</Text>
            {profile!.chronicDiseases.map((d, i) => <Text key={i} style={styles.listItem}>· {d}</Text>)}
          </View>
        )}

        {profile!.allergies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alergias</Text>
            {profile!.allergies.map((a, i) => <Text key={i} style={styles.listItem}>· {a}</Text>)}
          </View>
        )}

        {profile!.emergencyContact.name && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contacto de Emergencia</Text>
            <InfoRow label="Nombre" value={profile!.emergencyContact.name} />
            <InfoRow label="Teléfono" value={profile!.emergencyContact.phone} />
          </View>
        )}

        <Pressable style={styles.editButton} onPress={() => setEditing(true)}>
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{hasProfile ? 'Editar Perfil' : 'Completa tu Perfil'}</Text>
      <Text style={styles.subtitle}>Esta información se usará en tus reportes</Text>

      <Field label="Nombre completo">
        <TextInput style={styles.input} value={form.name} onChangeText={(v) => update('name', v)} placeholder="Ej: Juan Pérez" placeholderTextColor={colors.textSecondary} />
      </Field>

      <View style={styles.row}>
        <Field label="Edad" style={styles.halfField}>
          <TextInput style={styles.input} value={form.age ? String(form.age) : ''} onChangeText={(v) => update('age', Number(v) || 0)} keyboardType="numeric" placeholder="25" placeholderTextColor={colors.textSecondary} />
        </Field>
        <Field label="Sexo" style={styles.halfField}>
          <View style={styles.sexRow}>
            {(['masculino', 'femenino'] as const).map((s) => (
              <Pressable key={s} style={[styles.sexOption, form.sex === s && styles.sexOptionActive]} onPress={() => update('sex', s)}>
                <Text style={[styles.sexText, form.sex === s && styles.sexTextActive]}>{s === 'masculino' ? 'Masculino' : 'Femenino'}</Text>
              </Pressable>
            ))}
          </View>
        </Field>
      </View>

      <View style={styles.row}>
        <Field label="Peso (kg)" style={styles.halfField}>
          <TextInput style={styles.input} value={form.weight ? String(form.weight) : ''} onChangeText={(v) => update('weight', Number(v) || 0)} keyboardType="numeric" placeholder="70" placeholderTextColor={colors.textSecondary} />
        </Field>
        <Field label="Estatura (cm)" style={styles.halfField}>
          <TextInput style={styles.input} value={form.height ? String(form.height) : ''} onChangeText={(v) => update('height', Number(v) || 0)} keyboardType="numeric" placeholder="165" placeholderTextColor={colors.textSecondary} />
        </Field>
      </View>

      <Field label="Grupo sanguíneo">
        <View style={styles.chipsWrap}>
          {BLOOD_TYPES.map((bt) => (
            <Pressable key={bt} style={[styles.chip, form.bloodType === bt && styles.chipActive]} onPress={() => update('bloodType', bt)}>
              <Text style={[styles.chipText, form.bloodType === bt && styles.chipTextActive]}>{bt}</Text>
            </Pressable>
          ))}
        </View>
      </Field>

      <Field label="Enfermedades crónicas">
        <View style={styles.tagInput}>
          <TextInput style={styles.tagInputField} value={chronicInput} onChangeText={setChronicInput} placeholder="Ej: Diabetes" placeholderTextColor={colors.textSecondary} />
          <Pressable onPress={() => addToList('chronicDiseases', chronicInput, setChronicInput)} style={styles.addBtn}>
            <Ionicons name="add" size={20} color="#fff" />
          </Pressable>
        </View>
        {form.chronicDiseases.map((d, i) => (
          <View key={i} style={styles.tag}>
            <Text style={styles.tagText}>{d}</Text>
            <Pressable onPress={() => removeFromList('chronicDiseases', i)}><Ionicons name="close" size={16} color={colors.textSecondary} /></Pressable>
          </View>
        ))}
      </Field>

      <Field label="Alergias">
        <View style={styles.tagInput}>
          <TextInput style={styles.tagInputField} value={allergyInput} onChangeText={setAllergyInput} placeholder="Ej: Penicilina" placeholderTextColor={colors.textSecondary} />
          <Pressable onPress={() => addToList('allergies', allergyInput, setAllergyInput)} style={styles.addBtn}>
            <Ionicons name="add" size={20} color="#fff" />
          </Pressable>
        </View>
        {form.allergies.map((a, i) => (
          <View key={i} style={styles.tag}>
            <Text style={styles.tagText}>{a}</Text>
            <Pressable onPress={() => removeFromList('allergies', i)}><Ionicons name="close" size={16} color={colors.textSecondary} /></Pressable>
          </View>
        ))}
      </Field>

      <Field label="Contacto de Emergencia">
        <TextInput style={[styles.input, { marginBottom: 8 }]} value={form.emergencyContact.name} onChangeText={(v) => update('emergencyContact', { ...form.emergencyContact, name: v })} placeholder="Nombre del contacto" placeholderTextColor={colors.textSecondary} />
        <TextInput style={styles.input} value={form.emergencyContact.phone} onChangeText={(v) => update('emergencyContact', { ...form.emergencyContact, phone: v })} placeholder="Teléfono" keyboardType="phone-pad" placeholderTextColor={colors.textSecondary} />
      </Field>

      <Field label="Dirección">
        <TextInput style={styles.input} value={form.address} onChangeText={(v) => update('address', v)} placeholder="Tu dirección" placeholderTextColor={colors.textSecondary} />
      </Field>

      <Field label="Distrito">
        <View style={styles.chipsWrap}>
          {DISTRICTS.map((d) => (
            <Pressable key={d} style={[styles.chip, form.district === d && styles.chipActive]} onPress={() => update('district', d)}>
              <Text style={[styles.chipText, form.district === d && styles.chipTextActive]}>{d}</Text>
            </Pressable>
          ))}
        </View>
      </Field>

      <Field label="Comunidad / Localidad">
        <TextInput style={styles.input} value={form.community} onChangeText={(v) => update('community', v)} placeholder="Ej: Pueblo Libre" placeholderTextColor={colors.textSecondary} />
      </Field>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{hasProfile ? 'Guardar Cambios' : 'Crear Perfil'}</Text>
      </Pressable>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style?: any }) {
  return (
    <View style={[{ marginBottom: 14 }, style]}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 16 },
  header: { alignItems: 'center', gap: 4, marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F0FDFA', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  name: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  detail: { fontSize: 14, color: colors.textSecondary },
  section: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  infoLabel: { fontSize: 13, color: colors.textSecondary },
  infoValue: { fontSize: 13, color: colors.textPrimary, fontWeight: '600' },
  listItem: { fontSize: 13, color: colors.textPrimary, paddingVertical: 2 },
  editButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  editButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  row: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: colors.surface, color: colors.textPrimary, fontSize: 14 },
  sexRow: { flexDirection: 'row', gap: 8 },
  sexOption: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  sexOptionActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  sexText: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  sexTextActive: { color: '#fff' },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  chipTextActive: { color: '#fff' },
  tagInput: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  tagInputField: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: colors.surface, color: colors.textPrimary, fontSize: 14 },
  addBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F0FDFA', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginBottom: 4, alignSelf: 'flex-start' },
  tagText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  saveButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
