import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useVisits, type CommunityVisit } from '../../context/VisitsContext';
import { colors } from '../../theme/colors';
import { SafeScreen } from '../../components/SafeScreen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export function SyncScreen() {
  const { visits, syncAll, isSyncing } = useVisits();
  const pending = visits.filter((v) => !v.synced);

  const renderItem = ({ item }: { item: CommunityVisit }) => (
    <Card style={styles.card}>
      <Text style={styles.cardTitle}>{item.patientName}</Text>
      <Text style={styles.cardSubtitle}>{item.community}</Text>
      <Text style={[styles.status, item.synced ? styles.synced : styles.pending]}>
        {item.synced ? '✓ Sincronizado' : '⏳ Pendiente'}
      </Text>
    </Card>
  );

  return (
    <SafeScreen>
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
            <Button
              title="Sincronizar ahora"
              onPress={syncAll}
              disabled={pending.length === 0}
              loading={isSyncing}
              variant="secondary"
              icon="sync-outline"
              style={styles.syncButton}
            />
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>No hay visitas registradas todavía.</Text>}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  header: { gap: 8, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary },
  syncButton: { marginTop: 8 },
  card: { marginBottom: 12, gap: 4 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardSubtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  status: { fontSize: 13, fontWeight: '600' },
  synced: { color: colors.success },
  pending: { color: colors.warning },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 },
});

