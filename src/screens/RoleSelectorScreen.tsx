import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { ROLE_OPTIONS } from '../types/role';
import { colors } from '../theme/colors';

export function RoleSelectorScreen() {
  const { selectRole } = useRole();

  const roleColors: Record<string, { iconBg: string; iconColor: string }> = {
    citizen: { iconBg: colors.primaryLight, iconColor: colors.primary },
    agent: { iconBg: colors.secondaryLight, iconColor: colors.secondary },
    authority: { iconBg: colors.dangerLight, iconColor: colors.danger },
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} bounces={false}>
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

      <View style={styles.loginCard}>
        <View style={styles.lockHeader}>
          <View style={styles.lockBadge}>
            <Ionicons name="lock-closed" size={16} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.loginTitle}>Iniciar Sesion</Text>
            <Text style={styles.loginSubtitle}>Vigilancia epidemiologica comunitaria Ucayali</Text>
          </View>
        </View>

        <Text style={styles.prompt}>Selecciona tu perfil de acceso:</Text>

        <View style={styles.optionsList}>
          {ROLE_OPTIONS.map((option) => {
            const rc = roleColors[option.id];
            return (
              <Pressable
                key={option.id}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                onPress={() => selectRole(option.id)}
              >
                <View style={[styles.iconWrap, { backgroundColor: rc.iconBg }]}>
                  <Ionicons name={option.icon as any} size={22} color={rc.iconColor} />
                </View>
                <View style={styles.cardTextWrap}>
                  <Text style={styles.cardTitle}>{option.title}</Text>
                  <Text style={styles.cardDescription}>{option.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
              </Pressable>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>DIRESA Ucayali - Gobierno Regional de Ucayali</Text>
          <Text style={styles.version}>v2.1.0 - Offline-First</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  contentContainer: { flexGrow: 1 },
  imageContainer: { height: 220, position: 'relative', width: '100%' },
  bannerImage: { width: '100%', height: '100%' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 42, 0.45)' },
  bannerTextWrap: { position: 'absolute', bottom: 45, left: 24, gap: 2 },
  bannerTag: { fontSize: 10, fontWeight: '800', color: '#38BDF8', letterSpacing: 2 },
  bannerTitle: { fontSize: 32, fontWeight: '900', color: '#ffffff', letterSpacing: -0.5 },
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
  lockHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  lockBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  loginTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  loginSubtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  prompt: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 2 },
  optionsList: { gap: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardPressed: {
    backgroundColor: '#F8FAFC',
    borderColor: colors.primary,
    transform: [{ scale: 0.98 }],
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextWrap: { flex: 1, gap: 2 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardDescription: { fontSize: 12, color: colors.textSecondary, lineHeight: 16 },
  footer: { marginTop: 'auto', paddingTop: 20, alignItems: 'center', gap: 4 },
  footerText: { fontSize: 11, color: colors.textSecondary, fontWeight: '500' },
  version: { fontSize: 9, color: colors.textTertiary },
});
