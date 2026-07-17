import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { colors } from '../theme/colors';

export function SwitchRoleButton() {
  const { clearRole } = useRole();

  return (
    <Pressable
      onPress={clearRole}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      hitSlop={8}
    >
      <Ionicons name="swap-horizontal" size={14} color={colors.primary} />
      <Text style={styles.text}>Cambiar rol</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  text: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 11,
  },
});
