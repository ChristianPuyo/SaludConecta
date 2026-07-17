import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { ROLE_OPTIONS } from '../types/role';
import { colors } from '../theme/colors';

export function RoleSelectorScreen() {
  const { selectRole } = useRole();
  const { t } = useLanguage();

  const getRoleTranslations = (roleId: string) => {
    switch (roleId) {
      case 'citizen': return { title: t.role_citizen_title, desc: t.role_citizen_desc };
      case 'agent':   return { title: t.role_agent_title,   desc: t.role_agent_desc };
      case 'authority': return { title: t.role_authority_title, desc: t.role_authority_desc };
      default: return { title: '', desc: '' };
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ── Language Switcher (top right) ── */}
      <LanguageSwitcher />

      {/* ── App Identity ── */}
      <Text style={styles.appName}>{t.app_name}</Text>
      <Text style={styles.tagline}>{t.app_tagline}</Text>

      {/* ── Role Cards ── */}
      <Text style={styles.prompt}>{t.role_select_prompt}</Text>
      <View style={styles.optionsList}>
        {ROLE_OPTIONS.map((option) => {
          const { title, desc } = getRoleTranslations(option.id);
          return (
            <Pressable
              key={option.id}
              style={styles.card}
              onPress={() => selectRole(option.id)}
              accessibilityRole="button"
              accessibilityLabel={title}
            >
              <View style={styles.iconWrap}>
                <Ionicons name={option.icon as any} size={26} color={colors.primary} />
              </View>
              <View style={styles.cardTextWrap}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardDescription}>{desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'center',
    gap: 12,
  },
  appName: { fontSize: 28, fontWeight: '800', color: colors.primaryDark, textAlign: 'center', marginTop: 16 },
  tagline: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginBottom: 16 },
  prompt: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  optionsList: { gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextWrap: { flex: 1, gap: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  cardDescription: { fontSize: 12, color: colors.textSecondary },
});
