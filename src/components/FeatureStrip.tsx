import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const FEATURES = [
  {
    icon: 'notifications-outline' as const,
    title: 'Alertas tempranas',
    description: 'Notificaciones oportunas para actuar a tiempo.',
  },
  {
    icon: 'analytics-outline' as const,
    title: 'Analítica predictiva',
    description: 'Modelos de IA que anticipan riesgos y tendencias.',
  },
  {
    icon: 'map-outline' as const,
    title: 'Mapas inteligentes',
    description: 'Inteligencia territorial para una mejor toma de decisiones.',
  },
  {
    icon: 'shield-checkmark-outline' as const,
    title: 'Datos seguros',
    description: 'Protección y sincronización segura de la información.',
  },
];

export function FeatureStrip() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  return (
    <View style={styles.container}>
      <View style={[styles.grid, isMobile && styles.gridMobile, isTablet && styles.gridTablet]}>
        {FEATURES.map((feature, index) => (
          <View key={feature.title} style={styles.featureItem}>
            <View style={styles.iconContainer}>
              <Ionicons name={feature.icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
            {index < FEATURES.length - 1 && !isMobile && (
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
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  gridTablet: {
    flexWrap: 'wrap',
    gap: 16,
  },
  gridMobile: {
    flexDirection: 'column',
    gap: 16,
  },
  featureItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    position: 'relative',
    paddingRight: 16,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F8F0',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureText: {
    flex: 1,
    gap: 3,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  featureDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  separator: {
    position: 'absolute',
    right: 0,
    top: 4,
    bottom: 4,
    width: 1,
    backgroundColor: colors.border,
  },
});
