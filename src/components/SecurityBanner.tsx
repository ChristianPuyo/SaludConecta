import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export function SecurityBanner() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.banner}>
      <View style={[styles.leftContent, isMobile && styles.leftContentMobile]}>
        <View style={styles.lockIcon}>
          <Ionicons name="lock-closed" size={20} color={colors.primaryDark} />
        </View>
        <View style={styles.textContent}>
          <Text style={styles.mainText}>Tu información está segura con nosotros.</Text>
          <Text style={styles.secondaryText}>
            Cumplimos con altos estándares de seguridad, privacidad y protección de datos.
          </Text>
        </View>
      </View>

      {!isMobile && (
        <View style={styles.rightContent}>
          <Ionicons name="shield" size={20} color={colors.primaryDark} />
          <Text style={styles.badgeText}>Datos protegidos</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  leftContentMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  lockIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
    gap: 4,
  },
  mainText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  secondaryText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
  },
});
