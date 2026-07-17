import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RoleOption } from '../types/role';
import { colors } from '../theme/colors';

interface RoleCardProps {
  option: RoleOption;
  onPress: () => void;
  color: string;
  buttonColor: string;
  badge?: string;
}

export function RoleCard({ option, onPress, color, buttonColor, badge }: RoleCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      {/* Illustration background */}
      <View style={[styles.illustrationBg, { backgroundColor: color + '08' }]}>
        <View style={[styles.illustrationShape1, { backgroundColor: color + '0A' }]} />
        <View style={[styles.illustrationShape2, { backgroundColor: color + '06' }]} />
        <View style={[styles.illustrationShape3, { backgroundColor: color + '08' }]} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Top row: Icon + badge */}
        <View style={styles.topRow}>
          <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
            <Ionicons name={option.icon as any} size={26} color={color} />
          </View>
          {badge && (
            <View style={[styles.badge, { backgroundColor: color + '12' }]}>
              <Text style={[styles.badgeText, { color }]}>{badge}</Text>
            </View>
          )}
        </View>

        {/* Title + description */}
        <View style={styles.textSection}>
          <Text style={styles.title}>{option.title}</Text>
          <Text style={styles.description}>{option.description}</Text>
        </View>

        {/* Button */}
        <View style={[styles.buttonRow, { borderTopColor: color + '15' }]}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: buttonColor },
              pressed && styles.buttonPressed,
            ]}
            onPress={onPress}
          >
            <Text style={styles.buttonText}>
              {option.id === 'citizen'
                ? 'Ingresar como ciudadano'
                : option.id === 'agent'
                ? 'Ingresar como agente'
                : 'Ingresar como analista'}
            </Text>
            <View style={styles.arrowContainer}>
              <Ionicons name="arrow-forward" size={14} color={colors.textLight} />
            </View>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surfaceWhite,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 260,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: {
    shadowOpacity: 0.12,
    elevation: 4,
    transform: [{ scale: 0.99 }],
  },
  illustrationBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    overflow: 'hidden',
  },
  illustrationShape1: {
    position: 'absolute',
    top: -20,
    right: -10,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  illustrationShape2: {
    position: 'absolute',
    top: 10,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  illustrationShape3: {
    position: 'absolute',
    top: 30,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  content: {
    flex: 1,
    padding: 18,
    gap: 14,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  textSection: {
    gap: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  buttonRow: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: colors.textLight,
    fontSize: 13,
    fontWeight: '600',
  },
  arrowContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
