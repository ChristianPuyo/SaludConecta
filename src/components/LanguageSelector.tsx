import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES, type Language } from '../i18n';
import { colors } from '../theme/colors';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [visible, setVisible] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.id === language);

  return (
    <>
      <Pressable onPress={() => setVisible(true)} style={styles.button} hitSlop={8}>
        <Ionicons name="globe-outline" size={20} color={colors.primary} />
      </Pressable>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.sheet}>
            <Text style={styles.title}>Idioma / Language</Text>
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang.id}
                style={[styles.option, language === lang.id && styles.optionActive]}
                onPress={() => {
                  setLanguage(lang.id);
                  setVisible(false);
                }}
              >
                <Text style={[styles.optionText, language === lang.id && styles.optionTextActive]}>
                  {lang.nativeName}
                </Text>
                {language === lang.id && <Ionicons name="checkmark" size={20} color={colors.primary} />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: { paddingHorizontal: 8 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    maxWidth: 320,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionActive: {
    backgroundColor: '#F0FDFA',
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  optionTextActive: {
    color: colors.primary,
  },
});
