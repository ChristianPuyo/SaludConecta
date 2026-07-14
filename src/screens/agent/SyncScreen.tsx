import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useVisits, type CommunityVisit } from '../../context/VisitsContext';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export function SyncScreen() {
  const { visits, syncAll, isSyncing } = useVisits();
  const pending = visits.filter((v) => !v.synced);

  const renderItem = ({ item }: { item: CommunityVisit }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>{item.patientName}</Text>
          <Text style={styles.cardSubtitle}>📍 {item.community}</Text>
        </View>
        <Text style={[styles.status, item.synced ? styles.synced : styles.pending]}>
          {item.synced ? '✓ Sincronizado' : '⏳ Pendiente'}
        </Text>
      </View>

      <View style={styles.visitMetaRow}>
        {item.isPregnant && (
          <View style={[styles.tag, styles.pregnantTag]}>
            <Text style={styles.pregnantTagText}>🤰 Gestante</Text>
          </View>
        )}
        <View style={[styles.tag, item.vaccinesUpToDate ? styles.vaccinesOkTag : styles.vaccinesPendingTag]}>
          <Text style={item.vaccinesUpToDate ? styles.vaccinesOkTagText : styles.vaccinesPendingTagText}>
            💉 Vacunas {item.vaccinesUpToDate ? 'al día' : 'pendientes'}
          </Text>
        </View>
      </View>

      {(item.temperature || item.bloodPressure || item.glucose || item.weight || item.height) && (
        <View style={styles.vitalsRow}>
          {item.temperature ? (
            <View style={styles.vitalItem}>
              <Ionicons name="thermometer-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.vitalText}>{item.temperature}°C</Text>
            </View>
          ) : null}
          {item.bloodPressure ? (
            <View style={styles.vitalItem}>
              <Ionicons name="pulse" size={14} color={colors.textSecondary} />
              <Text style={styles.vitalText}>{item.bloodPressure}</Text>
            </View>
          ) : null}
          {item.glucose ? (
            <View style={styles.vitalItem}>
              <Ionicons name="water-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.vitalText}>Gluc: {item.glucose}</Text>
            </View>
          ) : null}
          {item.weight ? (
            <View style={styles.vitalItem}>
              <Ionicons name="scale-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.vitalText}>{item.weight} kg</Text>
            </View>
          ) : null}
        </View>
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
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12, gap: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  status: { fontSize: 13, fontWeight: '600' },
  synced: { color: colors.success },
  pending: { color: colors.warning },
  visitMetaRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  pregnantTag: { backgroundColor: '#FEE2E2' },
  pregnantTagText: { color: colors.danger, fontSize: 11, fontWeight: '700' },
  vaccinesOkTag: { backgroundColor: '#DCFCE7' },
  vaccinesOkTagText: { color: colors.success, fontSize: 11, fontWeight: '700' },
  vaccinesPendingTag: { backgroundColor: '#FEF3C7' },
  vaccinesPendingTagText: { color: colors.warning, fontSize: 11, fontWeight: '700' },
  vitalsRow: { flexDirection: 'row', gap: 12, marginTop: 4, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10, flexWrap: 'wrap' },
  vitalItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  vitalText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 },
});
