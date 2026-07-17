import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Achievement } from '../../models/achievement';
import { colors } from '../../theme/colors';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <View style={[styles.card, achievement.unlocked && styles.cardUnlocked]}>
      <View style={[styles.iconWrap, achievement.unlocked && styles.iconWrapUnlocked]}>
        <Ionicons
          name={(achievement.icon || 'trophy-outline') as any}
          size={22}
          color={achievement.unlocked ? '#fff' : colors.textSecondary}
        />
      </View>
      <View style={styles.info}>
        <Text style={[styles.label, achievement.unlocked && styles.labelUnlocked]}>
          {achievement.label}
        </Text>
        <Text style={styles.desc}>{achievement.description}</Text>
        {!achievement.unlocked && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(achievement.progress / achievement.target) * 100}%` },
              ]}
            />
          </View>
        )}
      </View>
      {achievement.unlocked && (
        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  cardUnlocked: { backgroundColor: '#F0FDFA', borderColor: colors.success + '40' },
  iconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  iconWrapUnlocked: { backgroundColor: colors.success },
  info: { flex: 1, gap: 2 },
  label: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  labelUnlocked: { color: colors.success },
  desc: { fontSize: 12, color: colors.textSecondary },
  progressBar: { height: 4, borderRadius: 2, backgroundColor: colors.border, marginTop: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
});
