import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { FamilyMember, FamilyRelationship } from '../../models/family';
import { familyRepo } from '../../repositories';
import { colors } from '../../theme/colors';
import { BLOOD_TYPES } from '../../constants';

const RELATIONSHIPS: FamilyRelationship[] = ['titular', 'pareja', 'hijo', 'padre', 'madre', 'abuelo', 'otro'];

export function FamilyScreen() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    const result = await familyRepo.getAll();
    if (result.success) setMembers(result.data);
  }, []);

  useEffect(() => { load(); }, []);

  const handleDelete = (id: string) => {
    Alert.alert('Eliminar miembro', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => { await familyRepo.remove(id); load(); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestión Familiar</Text>
        <Pressable style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
          <Ionicons name={showForm ? 'close' : 'add'} size={22} color="#fff" />
        </Pressable>
      </View>

      <Text style={styles.subtitle}>
        {members.length > 0
          ? `${members.length} miembro(s) registrado(s)`
          : 'Agrega a tu familia para gestionar su salud'}
      </Text>

      {showForm && (
        <MemberForm
          onSave={async (member) => {
            await familyRepo.add(member);
            setShowForm(false);
            load();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardMeta}>
                  {item.age} años · {item.sex === 'masculino' ? 'Masculino' : 'Femenino'} · {item.relationship}
                </Text>
              </View>
              <Pressable onPress={() => handleDelete(item.id)} hitSlop={8}>
                <Ionicons name="trash-outline" size={18} color={colors.danger} />
              </Pressable>
            </View>
            {item.chronicDiseases.length > 0 && (
              <Text style={styles.cardDetail}>Enfermedades: {item.chronicDiseases.join(', ')}</Text>
            )}
            {item.allergies.length > 0 && (
              <Text style={styles.cardDetail}>Alergias: {item.allergies.join(', ')}</Text>
            )}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Aún no has agregado familiares</Text>
          </View>
        }
      />
    </View>
  );
}

function MemberForm({ onSave, onCancel }: { onSave: (member: FamilyMember) => Promise<void>; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'masculino' | 'femenino' | 'otro'>('masculino');
  const [relationship, setRelationship] = useState<FamilyRelationship>('hijo');
  const [bloodType, setBloodType] = useState('');

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Ingresa el nombre'); return; }
    const member: FamilyMember = {
      id: Date.now().toString(),
      name: name.trim(),
      age: Number(age) || 0,
      sex,
      relationship,
      bloodType,
      chronicDiseases: [],
      allergies: [],
      medications: [],
      notes: '',
      createdAt: new Date().toISOString(),
    };
    await onSave(member);
  };

  return (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>Nuevo miembro</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre completo" placeholderTextColor={colors.textSecondary} />
      <View style={styles.row}>
        <TextInput style={[styles.input, { flex: 1 }]} value={age} onChangeText={setAge} placeholder="Edad" keyboardType="numeric" placeholderTextColor={colors.textSecondary} />
        <View style={styles.sexRow}>
          {(['masculino', 'femenino'] as const).map((s) => (
            <Pressable key={s} style={[styles.sexOption, sex === s && styles.sexOptionActive]} onPress={() => setSex(s)}>
              <Text style={[styles.sexText, sex === s && styles.sexTextActive]}>{s === 'masculino' ? 'M' : 'F'}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.chipsWrap}>
        {RELATIONSHIPS.map((r) => (
          <Pressable key={r} style={[styles.chip, relationship === r && styles.chipActive]} onPress={() => setRelationship(r)}>
            <Text style={[styles.chipText, relationship === r && styles.chipTextActive]}>{r}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.chipsWrap}>
        {BLOOD_TYPES.map((bt) => (
          <Pressable key={bt} style={[styles.chip, bloodType === bt && styles.chipActive]} onPress={() => setBloodType(bt)}>
            <Text style={[styles.chipText, bloodType === bt && styles.chipTextActive]}>{bt}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveBtnText}>Guardar</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { paddingHorizontal: 20, fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  addBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 20, paddingTop: 4 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0FDFA', alignItems: 'center', justifyContent: 'center' },
  cardName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardMeta: { fontSize: 12, color: colors.textSecondary },
  cardDetail: { fontSize: 12, color: colors.textSecondary, marginTop: 6 },
  emptyState: { alignItems: 'center', gap: 8, marginTop: 40 },
  emptyText: { fontSize: 14, color: colors.textSecondary },
  formCard: { marginHorizontal: 20, backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 10, marginBottom: 12 },
  formTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: colors.surface, color: colors.textPrimary, fontSize: 14 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  sexRow: { flexDirection: 'row', gap: 6 },
  sexOption: { width: 40, height: 40, borderRadius: 10, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  sexOptionActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  sexText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  sexTextActive: { color: '#fff' },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  chipTextActive: { color: '#fff' },
  saveBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '700' },
});
