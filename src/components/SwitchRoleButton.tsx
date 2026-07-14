import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { colors } from '../theme/colors';

export function SwitchRoleButton() {
  const { clearRole } = useRole();

  return (
    <Pressable onPress={clearRole} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} hitSlop={8}>
      <View style={styles.iconWrap}>
        <Ionicons name="swap-horizontal" size={14} color={colors.primary} />
      </View>
      <Text style={styles.text}>Cambiar rol</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginRight: 8,
    borderRadius: 999,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  iconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
});
