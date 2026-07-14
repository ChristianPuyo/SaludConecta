import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { ROLE_OPTIONS } from '../types/role';
import { colors, shadows } from '../theme/colors';

export function RoleSelectorScreen() {
  const { selectRole } = useRole();

  const roleColors = {
    citizen: { bg: colors.successLight, icon: colors.success },
    agent: { bg: colors.secondaryLight, icon: colors.secondary },
    authority: { bg: '#F3E8FF', icon: '#8B5CF6' },
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer} 
      style={styles.mainContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Design Accent Banner */}
      <View style={styles.topBanner}>
        <View style={styles.glow1} />
        <View style={styles.glow2} />
        <View style={styles.logoContainer}>
          <Ionicons name="pulse" size={44} color={colors.surface} />
        </View>
        <Text style={styles.appName}>SaludConecta</Text>
        <Text style={styles.tagline}>
          Vigilancia epidemiológica colaborativa y control de brotes en la Amazonía
        </Text>
      </View>

      <View style={styles.bottomSheet}>
        <Text style={styles.prompt}>Ingresar a la plataforma</Text>
        <Text style={styles.promptSub}>Selecciona tu perfil de acceso para continuar</Text>

        <View style={styles.optionsList}>
          {ROLE_OPTIONS.map((option) => {
            const roleStyle = roleColors[option.id] || { bg: colors.surfaceMuted, icon: colors.textSecondary };
            return (
              <Pressable
                key={option.id}
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.cardPressed,
                  { borderLeftColor: roleStyle.icon }
                ]}
                onPress={() => selectRole(option.id)}
              >
                <View style={[styles.iconWrap, { backgroundColor: roleStyle.bg }]}>
                  <Ionicons name={option.icon} size={22} color={roleStyle.icon} />
                </View>
                <View style={styles.cardTextWrap}>
                  <Text style={styles.cardTitle}>{option.title}</Text>
                  <Text style={styles.cardDescription}>{option.description}</Text>
                </View>
                <View style={styles.chevronWrap}>
                  <Ionicons name="arrow-forward" size={14} color={colors.textSecondary} />
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Ionicons name="shield-checkmark" size={14} color={colors.textMuted} />
          <Text style={styles.footerText}>Conexión local segura activa</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#0A4A45' }, // Deep organic forest teal
  scrollContainer: { flexGrow: 1, justifyContent: 'space-between' },
  topBanner: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  glow1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(20, 184, 166, 0.12)',
    top: -40,
    left: -40,
  },
  glow2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    bottom: -30,
    right: -30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...shadows.lg,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.surface,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: '#D1FAE5',
    marginTop: 8,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    ...shadows.lg,
  },
  prompt: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  promptSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 20,
    fontWeight: '600',
  },
  optionsList: { gap: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderLeftWidth: 5,
    ...shadows.sm,
  },
  cardPressed: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextWrap: { flex: 1, gap: 2 },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  cardDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    fontWeight: '500',
  },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
