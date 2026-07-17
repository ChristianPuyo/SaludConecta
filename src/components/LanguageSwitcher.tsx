/**
 * LanguageSwitcher — Reusable i18n picker component
 *
 * Renders a segmented-control style button row for selecting the app language.
 * Calls `setLanguage()` from LanguageContext on each press.
 *
 * Usage:
 *   <LanguageSwitcher />           → right-aligned (default)
 *   <LanguageSwitcher centered />  → full-width centered
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGE_OPTIONS } from '../i18n/translations';
import { colors } from '../theme/colors';

interface LanguageSwitcherProps {
  centered?: boolean;
}

export function LanguageSwitcher({ centered }: LanguageSwitcherProps) {
  const { lang, setLanguage } = useLanguage();

  return (
    <View style={[styles.container, centered && styles.centered]}>
      {LANGUAGE_OPTIONS.map((opt) => (
        <Pressable
          key={opt.code}
          style={[styles.button, lang === opt.code && styles.buttonActive]}
          onPress={() => setLanguage(opt.code)}
          accessibilityRole="button"
          accessibilityLabel={`Select language: ${opt.label}`}
          accessibilityState={{ selected: lang === opt.code }}
        >
          <Text style={styles.flag}>{opt.flag}</Text>
          <Text style={[styles.label, lang === opt.code && styles.labelActive]}>
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    padding: 3,
    borderRadius: 10,
    alignSelf: 'flex-end',
  },
  centered: {
    alignSelf: 'stretch',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flex: 0,
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
  flag: {
    fontSize: 13,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  labelActive: {
    color: '#fff',
  },
});
