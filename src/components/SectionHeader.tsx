import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface SectionHeaderProps {
  title: string;
  action?: { label: string; onPress: () => void };
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {action && (
        <Pressable onPress={action.onPress} style={styles.action}>
          <Text style={styles.actionText}>{action.label}</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 8 },
  title: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  action: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  actionText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
});
