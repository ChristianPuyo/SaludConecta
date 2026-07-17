import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Medication } from '../../models/medication';
import { MedicationService } from '../../services/medicationService';
import { SearchBar } from '../../components/SearchBar';
import { EmptyState } from '../../components/EmptyState';
import { colors } from '../../theme/colors';

const HOURS = ['06:00', '08:00', '12:00', '14:00', '18:00', '20:00', '22:00'];

export function MedicationsScreen() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [selectedHours, setSelectedHours] = useState<string[]>([]);

  const load = useCallback(async () => {
    const data = await MedicationService.getAll();
    setMedications(data);
  }, []);

  useEffect(() => { load(); }, []);

  const toggleHour = (h: string) => {
    setSelectedHours((prev) => prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]);
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      Alert.alert('Ingresa el nombre del medicamento');
      return;
    }
    await MedicationService.add({
      name: name.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      schedule: selectedHours,
      active: true,
      notes: '',
    });
    setName('');
    setDosage('');
    setFrequency('');
    setSelectedHours([]);
    setShowForm(false);
    await load();
  };

  const toggleActive = async (med: Medication) => {
    await MedicationService.update({ ...med, active: !med.active });
    await load();
  };

  const handleRemove = async (id: string) => {
    await MedicationService.remove(id);
    await load();
  };

  const filtered = medications.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q);
  });

  const activeMedications = medications.filter((m) => m.active);
  const now = new Date();
  const currentHour = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const upcoming = activeMedications.filter((m) => m.schedule.some((h) => h >= currentHour.substring(0, 5)));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Medicamentos</Text>
        <Pressable style={styles.addButton} onPress={() => setShowForm(!showForm)}>
          <Ionicons name={showForm ? 'close' : 'add'} size={22} color="#fff" />
        </Pressable>
      </View>

      {showForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Nuevo medicamento</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre del medicamento" placeholderTextColor={colors.textSecondary} />
          <TextInput style={styles.input} value={dosage} onChangeText={setDosage} placeholder="Dosis (ej: 500mg)" placeholderTextColor={colors.textSecondary} />
          <TextInput style={styles.input} value={frequency} onChangeText={setFrequency} placeholder="Frecuencia (ej: Cada 8 horas)" placeholderTextColor={colors.textSecondary} />
          <Text style={styles.scheduleLabel}>Horarios</Text>
          <View style={styles.hoursWrap}>
            {HOURS.map((h) => (
              <Pressable key={h} style={[styles.hourChip, selectedHours.includes(h) && styles.hourChipActive]} onPress={() => toggleHour(h)}>
                <Text style={[styles.hourText, selectedHours.includes(h) && styles.hourTextActive]}>{h}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable style={styles.saveBtn} onPress={handleAdd}>
            <Text style={styles.saveBtnText}>Guardar medicamento</Text>
          </Pressable>
        </View>
      )}

      {activeMedications.length > 0 && (
        <View style={styles.upcomingBanner}>
          <Ionicons name="timer-outline" size={18} color={colors.primary} />
          <Text style={styles.upcomingText}>
            {upcoming.length > 0 ? `${upcoming.length} medicamento(s) pendiente(s) hoy` : 'No hay medicamentos pendientes hoy'}
          </Text>
        </View>
      )}

      <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar medicamento..." />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.card, !item.active && styles.cardInactive]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardName, !item.active && styles.cardNameInactive]}>{item.name}</Text>
              <View style={styles.cardActions}>
                <Pressable onPress={() => toggleActive(item)} hitSlop={8}>
                  <Ionicons name={item.active ? 'toggle' : 'toggle-outline'} size={24} color={item.active ? colors.primary : colors.textSecondary} />
                </Pressable>
                <Pressable onPress={() => handleRemove(item.id)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={20} color={colors.danger} />
                </Pressable>
              </View>
            </View>
            {item.dosage && <Text style={styles.cardDetail}>Dosis: {item.dosage}</Text>}
            {item.frequency && <Text style={styles.cardDetail}>Frecuencia: {item.frequency}</Text>}
            {item.schedule.length > 0 && (
              <View style={styles.scheduleRow}>
                {item.schedule.map((h) => (
                  <View key={h} style={styles.scheduleChip}>
                    <Text style={styles.scheduleChipText}>{h}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="medkit-outline" title="Sin medicamentos" description="Agrega tus medicamentos para recibir recordatorios." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  addButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  formCard: { marginHorizontal: 20, marginBottom: 12, backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 10 },
  formTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: colors.surface, color: colors.textPrimary, fontSize: 14 },
  scheduleLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  hoursWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  hourChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: colors.border },
  hourChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  hourText: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  hourTextActive: { color: '#fff' },
  saveBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  upcomingBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F0FDFA', marginHorizontal: 20, borderRadius: 12, padding: 12, marginBottom: 8 },
  upcomingText: { flex: 1, fontSize: 13, color: colors.primary, fontWeight: '600' },
  listContent: { padding: 20, paddingTop: 8, gap: 10 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  cardInactive: { opacity: 0.6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  cardNameInactive: { textDecorationLine: 'line-through' },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardDetail: { fontSize: 13, color: colors.textSecondary },
  scheduleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  scheduleChip: { backgroundColor: '#F0FDFA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  scheduleChipText: { fontSize: 11, fontWeight: '600', color: colors.primary },
});
