import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { UserAchievements } from '../../models/achievement';
import { storage } from '../../storage/AsyncStorageAdapter';
import { AchievementCard } from '../../components/domain/AchievementCard';
import { colors } from '../../theme/colors';

export function AchievementsScreen() {
  const [achievements, setAchievements] = useState<UserAchievements | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await storage.get<UserAchievements>('user_achievements');
      if (result.success && result.data) setAchievements(result.data);
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) return null;
  if (!achievements) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="trophy-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.emptyText}>Completa acciones para desbloquear logros</Text>
      </View>
    );
  }

  const unlocked = achievements.achievements.filter((a) => a.unlocked).length;
  const total = achievements.achievements.length;

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={achievements.achievements}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <AchievementCard achievement={item} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Logros</Text>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{achievements.points}</Text>
              <Text style={styles.statLabel}>Puntos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{achievements.level}</Text>
              <Text style={styles.statLabel}>Nivel</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{unlocked}/{total}</Text>
              <Text style={styles.statLabel}>Logros</Text>
            </View>
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  header: { gap: 12, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  statsCard: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: colors.border },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.background },
  emptyText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
});
