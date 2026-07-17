import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface StatCardProps {
  value: string | number;
  label: string;
  color?: string;
}

export function StatCard({ value, label, color }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, color && { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  value: { fontSize: 24, fontWeight: '800', color: colors.primary },
  label: { fontSize: 11, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
});
