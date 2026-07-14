import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export function WelcomeHero() {
  return (
    <View style={styles.container}>
      <View style={styles.illustrationContainer}>
        <View style={styles.illustrationBg}>
          <View style={styles.leafCircle1} />
          <View style={styles.leafCircle2} />
          <View style={styles.leafCircle3} />
          <View style={styles.iconGroup}>
            <View style={styles.illustrationIcon}>
              <Ionicons name="people" size={32} color={colors.surface} />
            </View>
            <View style={styles.miniIcon}>
              <Ionicons name="heart" size={16} color={colors.warning} />
            </View>
            <View style={[styles.miniIcon, styles.miniIconRight]}>
              <Ionicons name="phone-portrait" size={14} color={colors.surface} />
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.title}>La salud más cerca de tu comunidad</Text>
      <Text style={styles.description}>
        Recibe orientación, registra síntomas y mantente informado, incluso
        cuando estés lejos de un centro de salud.
      </Text>
      <Text style={styles.tagline}>
        Atención y orientación de salud, estés donde estés.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  illustrationContainer: {
    marginBottom: 20,
  },
  illustrationBg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  leafCircle1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -20,
    left: -20,
  },
  leafCircle2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -10,
    right: -10,
  },
  leafCircle3: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: 10,
    right: 10,
  },
  iconGroup: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniIcon: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 5,
    left: 10,
  },
  miniIconRight: {
    left: undefined,
    right: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
