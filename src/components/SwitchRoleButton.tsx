import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { colors, borderRadius } from '../theme/colors';

export function SwitchRoleButton() {
  const { clearRole } = useRole();
  return (
    <Pressable onPress={clearRole} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} hitSlop={8}>
      <Ionicons name="swap-horizontal" size={16} color={colors.primary} />
      <Text style={styles.text}>Cambiar</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.2)',
    marginRight: 8,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  text: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
});
