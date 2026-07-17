import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useVisits, type CommunityVisit } from '../../context/VisitsContext';
import { AnimatedButton } from '../../components/AnimatedButton';
import { colors } from '../../theme/colors';

export function SyncScreen() {
  const { visits, syncAll, isSyncing } = useVisits();
  const pending = visits.filter((v) => !v.synced);

  const renderItem = ({ item, index }: { item: CommunityVisit; index: number }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 100).springify()}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.patientName}</Text>
        <Text style={styles.cardSubtitle}>{item.community}</Text>
        <Text style={[styles.status, item.synced ? styles.synced : styles.pending]}>
          {item.synced ? '✓ Sincronizado' : '⏳ Pendiente'}
        </Text>
      </View>
    </Animated.View>
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
          <Animated.View entering={FadeIn.duration(500)}>
            <Text style={styles.title}>Sincronización</Text>
            <Text style={styles.subtitle}>{pending.length} visita(s) pendiente(s)</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <AnimatedButton
              title={isSyncing ? 'Sincronizando...' : 'Sincronizar ahora'}
              onPress={syncAll}
              disabled={pending.length === 0 || isSyncing}
              variant="secondary"
            />
          </Animated.View>
        </View>
      }
      ListEmptyComponent={
        <Animated.View entering={FadeIn.duration(500)}>
          <Text style={styles.empty}>No hay visitas registradas todavía.</Text>
        </Animated.View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  header: { gap: 8, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardSubtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  status: { fontSize: 13, fontWeight: '600' },
  synced: { color: colors.success },
  pending: { color: colors.warning },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 },
});
