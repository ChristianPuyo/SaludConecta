import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVisits, type CommunityVisit } from '../../context/VisitsContext';
import { colors } from '../../theme/colors';

export function SyncScreen() {
  const { visits, syncAll, isSyncing } = useVisits();
  const pending = visits.filter((v) => !v.synced);

  const renderItem = ({ item }: { item: CommunityVisit }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={[styles.cardIconWrap, { backgroundColor: item.synced ? colors.successLight : colors.warningLight }]}>
          <Ionicons
            name={item.synced ? 'checkmark-circle' : 'time-outline' as any}
            size={18}
            color={item.synced ? colors.success : colors.warning}
          />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.patientName}</Text>
          <Text style={styles.cardSubtitle}>{item.community}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: item.synced ? colors.successLight : colors.warningLight }]}>
        <Text style={[styles.statusText, { color: item.synced ? colors.successDark : colors.warningDark }]}>
          {item.synced ? 'Sync' : 'Pendiente'}
        </Text>
      </View>
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
          <View style={styles.headerSection}>
            <View style={styles.headerIcon}>
              <Ionicons name="sync" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.title}>Sincronizacion</Text>
              <Text style={styles.subtitle}>
                {pending.length > 0 ? `${pending.length} visita(s) pendiente(s)` : 'Todo sincronizado'}
              </Text>
            </View>
          </View>
          <Pressable
            style={[styles.syncButton, (pending.length === 0 || isSyncing) && styles.syncButtonDisabled]}
            onPress={syncAll}
            disabled={pending.length === 0 || isSyncing}
          >
            {isSyncing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
                <Text style={styles.syncButtonText}>Sincronizar ahora</Text>
              </>
            )}
          </Pressable>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-done-circle-outline" size={44} color={colors.textTertiary} />
          <Text style={styles.empty}>No hay visitas registradas.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  header: { gap: 14, marginBottom: 16 },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.secondary,
    borderRadius: 14,
    paddingVertical: 14,
  },
  syncButtonDisabled: { backgroundColor: colors.border },
  syncButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  cardIconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1, gap: 1 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  cardSubtitle: { fontSize: 12, color: colors.textSecondary },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 11, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 40, gap: 8 },
  empty: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
});
