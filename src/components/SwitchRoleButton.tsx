import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { colors } from '../theme/colors';

export function SwitchRoleButton() {
  const { clearRole } = useRole();
  return (
    <Pressable
      onPress={clearRole}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      hitSlop={12}
    >
      <Ionicons name="swap-horizontal" size={13} color={colors.primaryDark} />
      <Text style={styles.text}>Cambiar rol</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: colors.primaryLight,
    marginRight: 14,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  text: { color: colors.primaryDark, fontWeight: '700', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.2 },
});

