import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useVisits, type CommunityVisit } from '../../context/VisitsContext';
import { colors } from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

type SyncState = 'idle' | 'syncing' | 'success' | 'error';

export function SyncScreen() {
  const { visits, syncAll, isSyncing } = useVisits();
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const { t } = useLanguage();
  const pending = visits.filter((v) => !v.synced);
  const synced = visits.filter((v) => v.synced);

  const handleSync = async () => {
    if (pending.length === 0) {
      Alert.alert(t.alert_sync_no_pending_title, t.alert_sync_no_pending_body);
      return;
    }
    setSyncState('syncing');
    try {
      await syncAll();
      setSyncState('success');
      // Reset after showing success
      setTimeout(() => setSyncState('idle'), 3000);
    } catch {
      setSyncState('error');
      setTimeout(() => setSyncState('idle'), 3000);
    }
  };

  const renderItem = ({ item }: { item: CommunityVisit }) => (
    <View style={[styles.card, item.synced && styles.cardSynced]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleArea}>
          <Text style={styles.cardTitle}>{item.patientName}</Text>
          <Text style={styles.cardSubtitle}>📍 {item.community}</Text>
        </View>
        <View style={[styles.statusBadge, item.synced ? styles.statusBadgeSynced : styles.statusBadgePending]}>
          <Ionicons
            name={item.synced ? 'cloud-done-outline' : 'cloud-upload-outline'}
            size={12}
            color={item.synced ? colors.success : colors.warning}
          />
          <Text style={[styles.statusText, item.synced ? styles.statusSynced : styles.statusPending]}>
            {item.synced ? t.sync_status_synced : t.sync_status_pending}
          </Text>
        </View>
      </View>

      <View style={styles.visitMetaRow}>
        {item.isPregnant && (
          <View style={[styles.tag, styles.pregnantTag]}>
            <Text style={styles.pregnantTagText}>{t.sync_tag_pregnant}</Text>
          </View>
        )}
        <View style={[styles.tag, item.vaccinesUpToDate ? styles.vaccinesOkTag : styles.vaccinesPendingTag]}>
          <Text style={item.vaccinesUpToDate ? styles.vaccinesOkTagText : styles.vaccinesPendingTagText}>
            {item.vaccinesUpToDate ? t.sync_tag_vaccines_ok : t.sync_tag_vaccines_pending}
          </Text>
        </View>
      </View>

      {(item.temperature || item.bloodPressure || item.glucose || item.weight) && (
        <View style={styles.vitalsRow}>
          {item.temperature ? (
            <View style={styles.vitalItem}>
              <Ionicons name="thermometer-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.vitalText}>{item.temperature}°C</Text>
            </View>
          ) : null}
          {item.bloodPressure ? (
            <View style={styles.vitalItem}>
              <Ionicons name="pulse" size={13} color={colors.textSecondary} />
              <Text style={styles.vitalText}>{item.bloodPressure}</Text>
            </View>
          ) : null}
          {item.glucose ? (
            <View style={styles.vitalItem}>
              <Ionicons name="water-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.vitalText}>Gluc: {item.glucose}</Text>
            </View>
          ) : null}
          {item.weight ? (
            <View style={styles.vitalItem}>
              <Ionicons name="scale-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.vitalText}>{item.weight} kg</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );

  const ListHeader = (
    <View style={styles.header}>
      <Text style={styles.title}>{t.sync_title}</Text>
      <Text style={styles.subtitle}>{t.sync_subtitle}</Text>

      {/* Summary stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderColor: colors.warning + '55' }]}>
          <Text style={[styles.statNumber, { color: colors.warning }]}>{pending.length}</Text>
          <Text style={styles.statLabel}>{t.sync_stat_pending}</Text>
        </View>
        <View style={[styles.statCard, { borderColor: colors.success + '55' }]}>
          <Text style={[styles.statNumber, { color: colors.success }]}>{synced.length}</Text>
          <Text style={styles.statLabel}>{t.sync_stat_synced}</Text>
        </View>
        <View style={[styles.statCard, { borderColor: colors.primary + '55' }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>{visits.length}</Text>
          <Text style={styles.statLabel}>{t.sync_stat_total}</Text>
        </View>
      </View>

      {/* Sync feedback banner */}
      {syncState === 'success' && (
        <View style={[styles.feedbackBanner, styles.feedbackSuccess]}>
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
          <Text style={[styles.feedbackText, { color: colors.success }]}>
            {t.sync_feedback_success(visits.length)}
          </Text>
        </View>
      )}
      {syncState === 'error' && (
        <View style={[styles.feedbackBanner, styles.feedbackError]}>
          <Ionicons name="alert-circle" size={20} color={colors.danger} />
          <Text style={[styles.feedbackText, { color: colors.danger }]}>
            {t.sync_feedback_error}
          </Text>
        </View>
      )}

      {/* Sync button */}
      <Pressable
        style={[
          styles.syncButton,
          pending.length === 0 && styles.syncButtonDisabled,
          syncState === 'success' && styles.syncButtonSuccess,
          syncState === 'error' && styles.syncButtonError,
        ]}
        onPress={handleSync}
        disabled={isSyncing || syncState === 'syncing'}
      >
        {isSyncing || syncState === 'syncing' ? (
          <>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={styles.syncButtonText}>{t.sync_btn_syncing(pending.length)}</Text>
          </>
        ) : syncState === 'success' ? (
          <>
            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
            <Text style={styles.syncButtonText}>{t.sync_btn_done}</Text>
          </>
        ) : syncState === 'error' ? (
          <>
            <Ionicons name="refresh-outline" size={18} color="#fff" />
            <Text style={styles.syncButtonText}>{t.sync_btn_retry}</Text>
          </>
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
            <Text style={styles.syncButtonText}>
              {t.sync_btn_idle(pending.length)}
            </Text>
          </>
        )}
      </Pressable>

      {visits.length > 0 && (
        <Text style={styles.listHeader}>
          {t.sync_history_label(visits.length)}
        </Text>
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
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Ionicons name="clipboard-outline" size={44} color={colors.border} />
          <Text style={styles.emptyTitle}>{t.sync_empty_title}</Text>
          <Text style={styles.emptySubtitle}>{t.sync_empty_subtitle}</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },

  // Header
  header: { gap: 12, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },

  // Stats row
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    gap: 2,
  },
  statNumber: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 10, color: colors.textSecondary, textAlign: 'center', fontWeight: '500' },

  // Feedback banners
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    padding: 12,
  },
  feedbackSuccess: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0' },
  feedbackError: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA' },
  feedbackText: { fontSize: 13, fontWeight: '600', flex: 1, lineHeight: 18 },

  // Sync button
  syncButton: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  syncButtonDisabled: { backgroundColor: colors.border },
  syncButtonSuccess: { backgroundColor: colors.success },
  syncButtonError: { backgroundColor: colors.danger },
  syncButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  listHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 4,
  },

  // Visit cards
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    gap: 10,
  },
  cardSynced: { opacity: 0.75 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitleArea: { flex: 1, gap: 2 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardSubtitle: { fontSize: 12, color: colors.textSecondary },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusBadgeSynced: { backgroundColor: '#F0FDF4' },
  statusBadgePending: { backgroundColor: '#FFFBEB' },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusSynced: { color: colors.success },
  statusPending: { color: colors.warning },

  // Tags
  visitMetaRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  pregnantTag: { backgroundColor: '#FEE2E2' },
  pregnantTagText: { color: colors.danger, fontSize: 11, fontWeight: '700' },
  vaccinesOkTag: { backgroundColor: '#DCFCE7' },
  vaccinesOkTagText: { color: colors.success, fontSize: 11, fontWeight: '700' },
  vaccinesPendingTag: { backgroundColor: '#FEF3C7' },
  vaccinesPendingTagText: { color: colors.warning, fontSize: 11, fontWeight: '700' },

  // Vitals
  vitalsRow: {
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    flexWrap: 'wrap',
  },
  vitalItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  vitalText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },

  // Empty state
  emptyState: { alignItems: 'center', gap: 10, paddingVertical: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  emptySubtitle: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 18, paddingHorizontal: 20 },
});
