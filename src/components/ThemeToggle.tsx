import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme();

  const getIconName = () => {
    switch (theme) {
      case 'light':
        return 'sunny';
      case 'dark':
        return 'moon';
      case 'system':
        return 'phone-portrait';
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Claro';
      case 'dark':
        return 'Oscuro';
      case 'system':
        return 'Sistema';
    }
  };

  return (
    <Pressable style={styles.button} onPress={toggleTheme} hitSlop={8}>
      <Ionicons name={getIconName() as any} size={18} color={colors.primary} />
      <Text style={[styles.text, { color: colors.primary }]}>{getLabel()}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
  },
  text: {
    fontWeight: '600',
    fontSize: 13,
  },
});
