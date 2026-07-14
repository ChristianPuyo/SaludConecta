import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useVisits } from '../../context/VisitsContext';
import type { CommunityVisit } from '../../data/mockData';
import { colors } from '../../theme/colors';

export function SyncScreen() {
  const { visits, syncAll, isSyncing } = useVisits();
  const pending = visits.filter((v) => !v.synced);

  const renderItem = ({ item }: { item: CommunityVisit }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.patientName}</Text>
        <Text style={[styles.status, item.synced ? styles.synced : styles.pending]}>
          {item.synced ? '✓ Sincronizado' : '⏳ Pendiente'}
        </Text>
      </View>
      <Text style={styles.cardSubtitle}>{item.community} · {item.date}</Text>
      <View style={styles.vitalsRow}>
        <Text style={styles.vitalText}>🌡 {item.temperature || 'N/A'}°C</Text>
        <Text style={styles.vitalText}>💊 PA: {item.bloodPressure || 'N/A'}</Text>
        <Text style={styles.vitalText}>🩸 Glucosa: {item.glucose || 'N/A'}</Text>
      </View>
      {item.vaccines && item.vaccines.length > 0 && (
        <Text style={styles.vaccineText}>💉 Vacunas: {item.vaccines.join(', ')}</Text>
      )}
      {item.pregnant && (
        <Text style={styles.pregnantText}>🤰 Embarazada - {item.pregnancyWeeks || '?'} semanas</Text>
      )}
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={visits}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Sincronización</Text>
          <Text style={styles.subtitle}>{pending.length} visita(s) pendiente(s)</Text>
          <Pressable
            style={[styles.syncButton, pending.length === 0 && styles.syncButtonDisabled]}
            onPress={syncAll}
            disabled={pending.length === 0 || isSyncing}
          >
            {isSyncing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.syncButtonText}>Sincronizar ahora</Text>
            )}
          </Pressable>
        </View>
      }
      ListEmptyComponent={<Text style={styles.empty}>No hay visitas registradas todavía.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  header: { gap: 8, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary },
  syncButton: { backgroundColor: colors.secondary, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  syncButtonDisabled: { backgroundColor: colors.border },
  syncButtonText: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12, gap: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardSubtitle: { fontSize: 12, color: colors.textSecondary },
  status: { fontSize: 12, fontWeight: '600' },
  synced: { color: colors.success },
  pending: { color: colors.warning },
  vitalsRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  vitalText: { fontSize: 11, color: colors.textSecondary },
  vaccineText: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  pregnantText: { fontSize: 11, color: '#BE185D', fontWeight: '600', marginTop: 2 },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 },
});
