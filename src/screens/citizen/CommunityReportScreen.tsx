import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommunityReportService } from '../../services/communityReportService';
import { colors } from '../../theme/colors';
import { COMMUNITY_REPORT_TYPES, DISTRICTS } from '../../utils/constants';

export function CommunityReportScreen() {
  const [type, setType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [district, setDistrict] = useState('');
  const [community, setCommunity] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    if (!type) {
      Alert.alert('Selecciona el tipo de reporte');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Describe el problema');
      return;
    }
    await CommunityReportService.add({
      type: type as any,
      description: description.trim(),
      location: location.trim(),
      district: district || 'Callería',
      community: community.trim(),
      reporterName: name.trim() || 'Anónimo',
    });
    Alert.alert('Reporte enviado', 'Las autoridades revisarán tu reporte.');
    setType(null);
    setDescription('');
    setLocation('');
    setDistrict('');
    setCommunity('');
    setName('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Reporte Comunitario</Text>
      <Text style={styles.subtitle}>Notifica problemas de salubridad en tu comunidad</Text>

      <Text style={styles.sectionLabel}>Tipo de reporte</Text>
      <View style={styles.typeGrid}>
        {COMMUNITY_REPORT_TYPES.map((t) => (
          <Pressable key={t.id} style={[styles.typeCard, type === t.id && styles.typeCardActive]} onPress={() => setType(t.id)}>
            <Ionicons name={t.icon as any} size={24} color={type === t.id ? '#fff' : colors.primary} />
            <Text style={[styles.typeLabel, type === t.id && styles.typeLabelActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe el problema detalladamente..."
        placeholderTextColor={colors.textSecondary}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.sectionLabel}>Ubicación específica</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Ej: Calle Los Olivos, frente a la plaza"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.sectionLabel}>Distrito</Text>
      <View style={styles.chipsWrap}>
        {DISTRICTS.map((d) => (
          <Pressable key={d} style={[styles.chip, district === d && styles.chipActive]} onPress={() => setDistrict(d)}>
            <Text style={[styles.chipText, district === d && styles.chipTextActive]}>{d}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Comunidad / Localidad</Text>
      <TextInput style={styles.input} value={community} onChangeText={setCommunity} placeholder="Nombre de la comunidad" placeholderTextColor={colors.textSecondary} />

      <Text style={styles.sectionLabel}>Tu nombre (opcional)</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre del reportante" placeholderTextColor={colors.textSecondary} />

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Ionicons name="send" size={18} color="#fff" />
        <Text style={styles.submitButtonText}>Enviar reporte</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 16 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8, marginTop: 4 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  typeCard: { width: '47%', backgroundColor: colors.surface, borderRadius: 16, padding: 16, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: colors.border },
  typeCardActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeLabel: { fontSize: 12, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },
  typeLabelActive: { color: '#fff' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: colors.surface, color: colors.textPrimary, fontSize: 14 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  chipTextActive: { color: '#fff' },
  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, marginTop: 16 },
  submitButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
