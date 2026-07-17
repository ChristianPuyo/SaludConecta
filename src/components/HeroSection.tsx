import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { UcayaliMap } from './UcayaliMap';

interface HeroSectionProps {
  onExplorePress?: () => void;
  onHowItWorksPress?: () => void;
}

export function HeroSection({ onExplorePress, onHowItWorksPress }: HeroSectionProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;
  const isDesktop = width >= 1024;

  return (
    <View style={[styles.container, isDesktop && styles.containerDesktop]}>
      {/* Left column: Text */}
      <View style={[styles.textColumn, isDesktop && styles.textColumnDesktop]}>
        {/* Tag */}
        <View style={styles.tag}>
          <Ionicons name="radio" size={12} color={colors.primary} />
          <Text style={styles.tagText}>Sistema inteligente de vigilancia epidemiológica</Text>
        </View>

        {/* Title */}
        <View style={styles.titleBlock}>
          <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
            Guardian{'\n'}Salud AI
          </Text>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Prevención temprana y análisis epidemiológico para la{' '}
          <Text style={styles.subtitleHighlight}>Amazonía Peruana</Text>.
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          Detectamos patrones, clasificamos el riesgo y generamos alertas oportunas para proteger a nuestras comunidades.
        </Text>

        {/* Buttons */}
        <View style={[styles.buttons, isMobile && styles.buttonsMobile]}>
          <Pressable
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
            onPress={onExplorePress}
          >
            <Text style={styles.primaryButtonText}>Explorar el sistema</Text>
            <View style={styles.primaryButtonIcon}>
              <Ionicons name="arrow-forward" size={14} color={colors.textLight} />
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
            onPress={onHowItWorksPress}
          >
            <Ionicons name="play-circle-outline" size={18} color={colors.primary} />
            <Text style={styles.secondaryButtonText}>Ver cómo funciona</Text>
          </Pressable>
        </View>
      </View>

      {/* Right column: Map */}
      {(isDesktop || isTablet) && (
        <View style={styles.mapColumn}>
          <UcayaliMap />
        </View>
      )}

      {/* Map below text on mobile */}
      {isMobile && (
        <View style={styles.mapMobileContainer}>
          <UcayaliMap />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
  containerDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 48,
  },
  textColumn: {
    gap: 16,
    flex: 1,
  },
  textColumnDesktop: {
    maxWidth: 480,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F8F0',
    borderWidth: 1,
    borderColor: '#C5EDD8',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: 0.2,
  },
  titleBlock: {
    gap: 4,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primaryDark,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  titleDesktop: {
    fontSize: 42,
    lineHeight: 46,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  subtitleHighlight: {
    color: colors.primary,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 22,
    maxWidth: 420,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  buttonsMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  primaryButtonText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButtonIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  secondaryButtonPressed: {
    backgroundColor: 'rgba(21, 150, 111, 0.05)',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  mapColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapMobileContainer: {
    alignItems: 'center',
  },
});
