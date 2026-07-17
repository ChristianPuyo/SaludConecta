import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export function SecurityBanner() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  return (
    <View style={styles.banner}>
      <View style={[styles.content, isMobile && styles.contentMobile]}>
        {/* Left: Lock + text */}
        <View style={styles.leftSection}>
          <Ionicons name="lock-closed" size={16} color={colors.accent} />
          <Text style={styles.mainText}>
            Seguridad, privacidad y confianza en cada dato.
          </Text>
        </View>

        {/* Separator */}
        <View style={[styles.separator, isMobile && styles.separatorMobile]} />

        {/* Right: Standards + badge */}
        <View style={styles.rightSection}>
          <Text style={styles.secondaryText}>
            Sistema alineado con estándares de salud pública.
          </Text>
          <View style={styles.badgeContainer}>
            <Ionicons name="shield-checkmark" size={12} color={colors.accent} />
            <Text style={styles.badgeText}>Datos protegidos</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  contentMobile: {
    flexDirection: 'column',
    gap: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  separator: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  separatorMobile: {
    width: 40,
    height: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  secondaryText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(57, 213, 186, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.accent,
  },
});
