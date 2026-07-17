import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useRole } from '../context/RoleContext';
import { useLanguage } from '../context/LanguageContext';
import { colors } from '../theme/colors';

export function SwitchRoleButton() {
  const { clearRole } = useRole();
  const { t } = useLanguage();
  return (
    <Pressable onPress={clearRole} style={styles.button} hitSlop={8}>
      <Text style={styles.text}>{t('switchRole')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { paddingHorizontal: 12 },
  text: { color: colors.primary, fontWeight: '600' },
});
