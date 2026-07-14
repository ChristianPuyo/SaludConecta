import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import type { RoleOption } from '../types/role';

interface RoleCardProps {
  option: RoleOption;
  onSelect: (id: string) => void;
}

export function RoleCard({ option, onSelect }: RoleCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onSelect(option.id)}
      accessibilityRole="button"
      accessibilityLabel={`${option.title}. ${option.badge}. ${option.description}`}
      accessibilityHint={option.actionText}
    >
      <View style={styles.iconArea}>
        <View style={styles.iconCircle}>
          <Ionicons name={option.icon as any} size={30} color={colors.primary} />
        </View>
      </View>

      <View style={styles.textContent}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{option.title}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{option.badge}</Text>
        </View>
        <Text style={styles.description}>{option.description}</Text>
        <View style={styles.actionRow}>
          <Text style={styles.actionText}>{option.actionText}</Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color={colors.primaryLight}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceTranslucent,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.surfaceTranslucentBorder,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },
  cardPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderColor: colors.accent,
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 6,
  },
  iconArea: {
    paddingTop: 4,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  textContent: {
    flex: 1,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(212, 180, 95, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(212, 180, 95, 0.25)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryLight,
  },
});
