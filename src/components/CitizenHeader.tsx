import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface CitizenHeaderProps {
  onSwitchRole?: () => void;
}

export function CitizenHeader({ onSwitchRole }: CitizenHeaderProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 700;

  return (
    <View style={styles.header}>
      <View style={styles.textSection}>
        <Text style={[styles.greeting, isDesktop && styles.greetingDesktop]}>
          Hola, ciudadano 👋
        </Text>
        <Text style={styles.subtitle}>Guardian Salud AI cuida de tu comunidad</Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.switchButton, pressed && styles.switchButtonPressed]}
        onPress={onSwitchRole}
      >
        <Ionicons name="swap-horizontal-outline" size={16} color={colors.primary} />
        <Text style={styles.switchButtonText}>Cambiar rol</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    gap: 12,
  },
  textSection: {
    flex: 1,
    gap: 4,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 32,
  },
  greetingDesktop: {
    fontSize: 30,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceWhite,
  },
  switchButtonPressed: {
    backgroundColor: colors.primary + '08',
    borderColor: colors.primary + '30',
  },
  switchButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
});
