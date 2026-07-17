import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Vaccination } from '../../models/vaccination';
import { VaccinationService } from '../../services/vaccinationService';
import { colors } from '../../theme/colors';

export function VaccinationScreen() {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);

  const load = useCallback(async () => {
    const data = await VaccinationService.getAll();
    setVaccinations(data);
  }, []);

  useEffect(() => { load(); }, []);

  const toggleStatus = async (v: Vaccination) => {
    const updated = { ...v, status: v.status === 'recibida' ? 'pendiente' as const : 'recibida' as const };
    await VaccinationService.update(updated);
    await load();
  };

  const renderItem = ({ item }: { item: Vaccination }) => (
    <Pressable style={styles.card} onPress={() => toggleStatus(item)}>
      <View style={styles.cardLeft}>
        <View style={[styles.checkbox, item.status === 'recibida' && styles.checkboxActive]}>
          {item.status === 'recibida' && <Ionicons name="checkmark" size={16} color="#fff" />}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, item.status === 'recibida' && styles.cardTitleDone]}>{item.name}</Text>
          <Text style={styles.cardDate}>Próxima dosis: {item.nextDose}</Text>
          {item.notes && <Text style={styles.cardNotes}>{item.notes}</Text>}
        </View>
      </View>
      <View style={[styles.statusBadge, item.status === 'recibida' ? styles.statusDone : styles.statusPending]}>
        <Text style={[styles.statusText, item.status === 'recibida' ? styles.statusTextDone : styles.statusTextPending]}>
          {item.status === 'recibida' ? 'Recibida' : 'Pendiente'}
        </Text>
      </View>
    </Pressable>
  );

  const pendingCount = vaccinations.filter((v) => v.status === 'pendiente').length;

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={vaccinations}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Calendario de Vacunación</Text>
          <Text style={styles.subtitle}>
            {pendingCount > 0 ? `Tienes ${pendingCount} vacuna(s) pendiente(s)` : 'Esquema de vacunación completo'}
          </Text>
          {pendingCount > 0 && (
            <View style={styles.alertBanner}>
              <Ionicons name="warning" size={18} color={colors.warning} />
              <Text style={styles.alertText}>Vacúnate a tiempo para proteger tu salud y la de tu comunidad</Text>
            </View>
          )}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  header: { gap: 6, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary },
  alertBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF3C7', borderRadius: 12, padding: 12, marginTop: 4 },
  alertText: { flex: 1, fontSize: 12, color: '#92400E', fontWeight: '600' },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: colors.success, borderColor: colors.success },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardTitleDone: { color: colors.textSecondary, textDecorationLine: 'line-through' },
  cardDate: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  cardNotes: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  statusDone: { backgroundColor: '#DCFCE7' },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusTextDone: { color: colors.success },
  statusTextPending: { color: colors.warning },
});
