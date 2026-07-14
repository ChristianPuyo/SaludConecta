import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { ROLE_OPTIONS } from '../types/role';
import { colors } from '../theme/colors';

export function RoleSelectorScreen() {
  const { selectRole } = useRole();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
      {/* Top Banner Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/welcome_banner.png')}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />
        <View style={styles.bannerTextWrap}>
          <Text style={styles.bannerTag}>SISTEMA INTELIGENTE</Text>
          <Text style={styles.bannerTitle}>Guardian Salud AI</Text>
        </View>
      </View>

      {/* Login / Selection Card Container */}
      <View style={styles.loginCard}>
        <View style={styles.lockHeader}>
          <View style={styles.lockBadge}>
            <Ionicons name={"lock-closed" as any} size={18} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.loginTitle}>Iniciar Sesión</Text>
            <Text style={styles.loginSubtitle}>Vigilancia epidemiológica comunitaria Ucayali</Text>
          </View>
        </View>

        <Text style={styles.prompt}>Selecciona tu perfil de acceso para continuar:</Text>

        <View style={styles.optionsList}>
          {ROLE_OPTIONS.map((option) => {
            // Contextual colors per role card
            const roleColors =
              option.id === 'citizen'
                ? { iconBg: '#F0FDFA', iconColor: colors.primary, cardBorder: '#E2E8F0' }
                : option.id === 'agent'
                ? { iconBg: '#EFF6FF', iconColor: colors.secondary, cardBorder: '#E2E8F0' }
                : { iconBg: '#FEE2E2', iconColor: colors.danger, cardBorder: '#E2E8F0' };

            return (
              <Pressable
                key={option.id}
                style={({ pressed }) => [
                  styles.card,
                  { borderColor: roleColors.cardBorder },
                  pressed && styles.cardPressed,
                ]}
                onPress={() => selectRole(option.id)}
              >
                <View style={[styles.iconWrap, { backgroundColor: roleColors.iconBg }]}>
                  <Ionicons name={option.icon as any} size={24} color={roleColors.iconColor} />
                </View>
                <View style={styles.cardTextWrap}>
                  <Text style={styles.cardTitle}>{option.title}</Text>
                  <Text style={styles.cardDescription}>{option.description}</Text>
                </View>
                <View style={styles.arrowWrap}>
                  <Ionicons name={"arrow-forward-outline" as any} size={18} color={colors.textSecondary} />
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>DIRESA Ucayali · Gobierno Regional de Ucayali</Text>
          <Text style={styles.version}>Versión 2.1.0 (Offline-First Enabled)</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' }, // Dark background matches dark theme banner
  contentContainer: { flexGrow: 1 },
  imageContainer: {
    height: 220,
    position: 'relative',
    width: '100%',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)', // Tint to blend image with the app container
  },
  bannerTextWrap: {
    position: 'absolute',
    bottom: 45,
    left: 24,
    gap: 2,
  },
  bannerTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 2,
  },
  bannerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  loginCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    gap: 16,
  },
  lockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  lockBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  loginSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  prompt: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  optionsList: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  cardPressed: {
    backgroundColor: '#F1F5F9',
    borderColor: colors.primary,
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextWrap: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  cardDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
  },
  arrowWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 24,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  version: {
    fontSize: 9,
    color: colors.textSecondary,
    opacity: 0.8,
  },
});
