import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { useLanguage } from '../context/LanguageContext';
import { ROLE_OPTIONS } from '../types/role';
import { colors } from '../theme/colors';
import type { Language } from '../i18n';

const LANG_OPTIONS: { id: Language; label: string }[] = [
  { id: 'es', label: 'ESP' },
  { id: 'shp', label: 'SHP' },
  { id: 'ash', label: 'ASH' },
];

export function RoleSelectorScreen() {
  const { selectRole } = useRole();
  const { language, setLanguage, t } = useLanguage();
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const langButtons = (
    <View style={styles.langRow}>
      {LANG_OPTIONS.map((lang) => (
        <Pressable
          key={lang.id}
          style={[styles.langBtn, language === lang.id && styles.langBtnActive]}
          onPress={() => setLanguage(lang.id)}
        >
          <Text style={[styles.langBtnText, language === lang.id && styles.langBtnTextActive]}>
            {lang.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  if (isDesktop) {
    return (
      <View style={styles.splitContainer}>
        <View style={styles.leftPanel}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="medical" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.logoText}>SALUD AI</Text>
            {langButtons}
          </View>
          
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>{t('welcome')}</Text>
            <Text style={styles.welcomeDescription}>
              {t('welcomeDescription')}
            </Text>
          </View>

          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
        </View>

        <View style={styles.rightPanel}>
          <ScrollView contentContainerStyle={styles.rightContent}>
            <Text style={styles.prompt}>{t('selectRole')}</Text>

            <View style={styles.optionsList}>
              {ROLE_OPTIONS.map((option) => (
                <Pressable key={option.id} style={styles.card} onPress={() => selectRole(option.id)}>
                  <View style={styles.iconWrap}>
                    <Ionicons name={option.icon as any} size={26} color={colors.primary} />
                  </View>
                  <View style={styles.cardTextWrap}>
                    <Text style={styles.cardTitle}>{t(`role${option.id.charAt(0).toUpperCase() + option.id.slice(1)}` as any)}</Text>
                    <Text style={styles.cardDescription}>{t(`role${option.id.charAt(0).toUpperCase() + option.id.slice(1)}Desc` as any)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </Pressable>
              ))}
            </View>

            <Pressable style={styles.reportButton}>
              <Ionicons name="flag-outline" size={20} color="#FFFFFF" />
              <Text style={styles.reportButtonText}>{t('reportProblem')}</Text>
            </Pressable>

            <Text style={styles.termsText}>{t('terms')}</Text>
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mobileContainer}>
      <View style={styles.mobileHeader}>
        <View style={styles.mobileLogoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="medical" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.mobileLogoText}>SALUD AI</Text>
          {langButtons}
        </View>
        
        <Text style={styles.mobileWelcomeTitle}>{t('welcome')}</Text>
        <Text style={styles.mobileWelcomeDescription}>
          {t('welcomeDescription')}
        </Text>

        <View style={styles.mobileDecorativeCircle} />
      </View>

      <ScrollView style={styles.mobileScrollView} contentContainerStyle={styles.mobileContent}>
        <Text style={styles.prompt}>{t('selectRole')}</Text>

        <View style={styles.optionsList}>
          {ROLE_OPTIONS.map((option) => (
            <Pressable key={option.id} style={styles.card} onPress={() => selectRole(option.id)}>
              <View style={styles.iconWrap}>
                <Ionicons name={option.icon as any} size={26} color={colors.primary} />
              </View>
              <View style={styles.cardTextWrap}>
                <Text style={styles.cardTitle}>{t(`role${option.id.charAt(0).toUpperCase() + option.id.slice(1)}` as any)}</Text>
                <Text style={styles.cardDescription}>{t(`role${option.id.charAt(0).toUpperCase() + option.id.slice(1)}Desc` as any)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.reportButton}>
          <Ionicons name="flag-outline" size={20} color="#FFFFFF" />
          <Text style={styles.reportButtonText}>{t('reportProblem')}</Text>
        </Pressable>

        <Text style={styles.termsText}>{t('terms')}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    position: 'absolute',
    top: 40,
    left: 40,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  welcomeContent: {
    zIndex: 1,
  },
  welcomeTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 50,
  },
  welcomeDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    top: 60,
    right: -40,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    bottom: 80,
    left: -30,
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  rightContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 40,
  },
  prompt: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  optionsList: {
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextWrap: {
    flex: 1,
    gap: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  mobileContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mobileHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  mobileLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  mobileLogoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  mobileWelcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
    lineHeight: 40,
  },
  mobileWelcomeDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 19,
  },
  mobileDecorativeCircle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    top: 40,
    right: -30,
  },
  mobileScrollView: {
    flex: 1,
  },
  mobileContent: {
    padding: 24,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  termsText: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 16,
  },
  langRow: {
    flexDirection: 'row',
    gap: 6,
    marginLeft: 12,
  },
  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  langBtnActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  langBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 1,
  },
  langBtnTextActive: {
    color: colors.primary,
  },
});
