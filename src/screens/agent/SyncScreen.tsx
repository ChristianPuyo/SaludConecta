import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVisits, type CommunityVisit } from '../../context/VisitsContext';
import { colors, shadows } from '../../theme/colors';

export function SyncScreen() {
  const { visits, syncAll, isSyncing } = useVisits();
  const pending = visits.filter((v) => !v.synced);

  const renderItem = ({ item }: { item: CommunityVisit }) => (
    <View style={[styles.card, { borderLeftColor: item.synced ? colors.success : colors.warning }]}>
      <View style={styles.cardHeader}>
        <View style={styles.patientInfo}>
          <Ionicons name="person-circle" size={32} color={colors.textSecondary} />
          <View>
            <Text style={styles.cardTitle}>{item.patientName}</Text>
            <Text style={styles.cardSubtitle}>{item.community}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, item.synced ? styles.statusSynced : styles.statusPending]}>
          <Ionicons 
            name={item.synced ? "checkmark-circle" : "hourglass-outline"} 
            size={12} 
            color={item.synced ? colors.successDark : colors.warningDark} 
          />
          <Text style={[styles.statusText, item.synced ? { color: colors.successDark } : { color: colors.warningDark }]}>
            {item.synced ? 'Sincronizado' : 'Pendiente'}
          </Text>
        </View>
      </View>

      <View style={styles.pillsRow}>
        {!!item.temperature && (
          <View style={styles.pill}>
            <Ionicons name="thermometer" size={13} color={colors.textSecondary} />
            <Text style={styles.pillText}>{item.temperature} °C</Text>
          </View>
        )}
        {!!item.bloodPressure && (
          <View style={styles.pill}>
            <Ionicons name="pulse" size={13} color={colors.textSecondary} />
            <Text style={styles.pillText}>{item.bloodPressure}</Text>
          </View>
        )}
        {!!item.glucose && (
          <View style={styles.pill}>
            <Ionicons name="water" size={13} color={colors.textSecondary} />
            <Text style={styles.pillText}>{item.glucose} mg/dL</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name="cloud-offline-outline" size={38} color={colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>Sin visitas registradas</Text>
      <Text style={styles.emptyText}>
        Las visitas que registres en el campo aparecerán en esta lista para su sincronización.
      </Text>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={visits}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Sincronización</Text>
          <Text style={styles.subtitle}>{pending.length} visita(s) pendiente(s) por subir</Text>
          <Pressable
            style={({ pressed }) => [
              styles.syncButton,
              pending.length === 0 && styles.syncButtonDisabled,
              pressed && pending.length > 0 && styles.syncButtonPressed,
            ]}
            onPress={syncAll}
            disabled={pending.length === 0 || isSyncing}
          >
            {isSyncing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.syncButtonContent}>
                <Ionicons name="cloud-upload" size={18} color="#fff" />
                <Text style={styles.syncButtonText}>Sincronizar ahora</Text>
              </View>
            )}
          </Pressable>
        </View>
      }
      ListEmptyComponent={renderEmpty}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 30 },
  header: { gap: 8, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: colors.textSecondary },
  syncButton: { backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 8, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
  syncButtonPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  syncButtonDisabled: { backgroundColor: colors.border, elevation: 0 },
  syncButtonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  syncButtonText: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: -0.2 },
  card: { backgroundColor: colors.surface, borderRadius: 20, padding: 16, borderWidth: 1.5, borderColor: colors.border, borderLeftWidth: 5, marginBottom: 12, gap: 12, ...shadows.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  patientInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  cardSubtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 1, fontWeight: '600' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  statusSynced: { backgroundColor: colors.successLight },
  statusPending: { backgroundColor: colors.warningLight },
  statusText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.2 },
  pillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surfaceMuted, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.borderLight },
  pillText: { fontSize: 12, color: colors.textSecondary, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 80, paddingHorizontal: 32, gap: 8 },
  emptyIconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  emptyText: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },
});

