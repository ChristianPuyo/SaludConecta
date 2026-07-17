import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface ReportSymptomsCardProps {
  onPress?: () => void;
}

export function ReportSymptomsCard({ onPress }: ReportSymptomsCardProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 700;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
    >
      <View style={[styles.content, isDesktop && styles.contentDesktop]}>
        {/* Left: illustration */}
        <View style={styles.illustrationArea}>
          <View style={styles.phoneShape}>
            <View style={styles.phoneScreen}>
              <View style={styles.phoneLine} />
              <View style={[styles.phoneLine, { width: '70%' }]} />
              <View style={[styles.phoneLine, { width: '85%' }]} />
              <View style={styles.phoneCheck}>
                <Ionicons name="checkmark" size={10} color="#fff" />
              </View>
            </View>
          </View>
        </View>

        {/* Center: text */}
        <View style={styles.textSection}>
          <Text style={styles.title}>¿Tienes algún síntoma?</Text>
          <Text style={styles.description}>
            Reporta tus síntomas y ayuda a tu comunidad a mantenerse protegida.
          </Text>
        </View>

        {/* Right: button */}
        <View style={styles.buttonArea}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={onPress}
          >
            <Ionicons name="add-circle-outline" size={16} color="#fff" />
            <Text style={styles.buttonText}>Reportar síntomas</Text>
            <Ionicons name="arrow-forward" size={14} color="#fff" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E5F3EF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C5EDD8',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  cardPressed: {
    shadowOpacity: 0.06,
    elevation: 2,
    transform: [{ scale: 0.995 }],
  },
  content: {
    gap: 16,
  },
  contentDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  illustrationArea: {
    alignItems: 'center',
  },
  phoneShape: {
    width: 56,
    height: 72,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary + '40',
    backgroundColor: colors.surfaceWhite,
    padding: 6,
  },
  phoneScreen: {
    flex: 1,
    gap: 5,
    paddingTop: 8,
    alignItems: 'flex-start',
  },
  phoneLine: {
    height: 4,
    width: '90%',
    borderRadius: 2,
    backgroundColor: colors.primary + '20',
  },
  phoneCheck: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSection: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonArea: {
    alignItems: 'flex-start',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#075C50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
