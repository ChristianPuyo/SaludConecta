import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const TIPS = [
  { icon: 'water-outline' as const, text: 'Lávate las manos con frecuencia.' },
  { icon: 'leaf-outline' as const, text: 'Bebe agua segura.' },
  { icon: 'restaurant-outline' as const, text: 'Consume alimentos bien cocidos.' },
  { icon: 'sparkles-outline' as const, text: 'Mantén tu entorno limpio.' },
];

export function HealthTips() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 700;
  const isMobile = width < 700;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consejos para cuidarte</Text>

      <View style={[styles.tipsGrid, isDesktop && styles.tipsGridDesktop, isMobile && styles.tipsGridMobile]}>
        {TIPS.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <View style={styles.tipIcon}>
              <Ionicons name={tip.icon} size={18} color={colors.primary} />
            </View>
            <Text style={styles.tipText}>{tip.text}</Text>
            {isDesktop && index < TIPS.length - 1 && (
              <View style={styles.separator} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D7E6E2',
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tipsGrid: {
    gap: 14,
  },
  tipsGridDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 0,
  },
  tipsGridMobile: {
    flexDirection: 'column',
    gap: 12,
  },
  tipItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    position: 'relative',
    paddingRight: 16,
  },
  tipIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E5F3EF',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tipText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  separator: {
    position: 'absolute',
    right: 0,
    top: 4,
    bottom: 4,
    width: 1,
    backgroundColor: colors.borderLight,
  },
});
