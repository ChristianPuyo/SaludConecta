import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { ROLE_OPTIONS } from '../types/role';
import { colors, shadows } from '../theme/colors';

export function RoleSelectorScreen() {
  const { selectRole } = useRole();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hero Header */}
      <View style={styles.heroHeader}>
        <View style={styles.heroOverlay}>
          <View style={styles.heroIconWrap}>
            <Ionicons name="shield-checkmark" size={48} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>Guardian Salud AI</Text>
          <Text style={styles.heroSubtitle}>Vigilancia Epidemiológica Inteligente</Text>
          <Text style={styles.heroTagline}>Protegiendo la Amazonía Peruana</Text>
        </View>
      </View>

      {/* Role Selection */}
      <View style={styles.sectionContainer}>
        <Text style={styles.prompt}>¿Cómo vas a ingresar?</Text>
        <Text style={styles.promptHint}>Selecciona tu rol para continuar</Text>

        <View style={styles.optionsList}>
          {ROLE_OPTIONS.map((option, index) => {
            const accentColors = [colors.primary, colors.secondary, colors.accentPurple];
            const accent = accentColors[index % 3];
            return (
              <Pressable
                key={option.id}
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => selectRole(option.id)}
              >
                <View style={[styles.iconWrap, { backgroundColor: accent + '15' }]}>
                  <Ionicons name={option.icon as any} size={28} color={accent} />
                </View>
                <View style={styles.cardTextWrap}>
                  <Text style={styles.cardTitle}>{option.title}</Text>
                  <Text style={styles.cardDescription}>{option.description}</Text>
                </View>
                <View style={[styles.arrowWrap, { backgroundColor: accent + '10' }]}>
                  <Ionicons name="chevron-forward" size={20} color={accent} />
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Ionicons name="heart" size={12} color={colors.textTertiary} />
        <Text style={styles.footerText}>Guardian Salud AI v1.0 · Ucayali, Perú</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background },
  heroHeader: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroOverlay: {
    alignItems: 'center',
    gap: 8,
  },
  heroIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  heroTagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  sectionContainer: {
    padding: 24,
    gap: 12,
  },
  prompt: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  promptHint: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  optionsList: { gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    borderColor: colors.primary,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextWrap: { flex: 1, gap: 3 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  cardDescription: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  arrowWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 11,
    color: colors.textTertiary,
  },
});
