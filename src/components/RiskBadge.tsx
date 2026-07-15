import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export type RiskLevel = 'bajo' | 'medio' | 'alto';

const RISK_STYLES: Record<RiskLevel, { bg: string; text: string; label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  bajo: { bg: '#DCFCE7', text: colors.success, label: 'Riesgo bajo', icon: 'checkmark-circle' },
  medio: { bg: '#FEF3C7', text: colors.warning, label: 'Riesgo medio', icon: 'warning' },
  alto: { bg: '#FEE2E2', text: colors.danger, label: 'Riesgo alto', icon: 'alert-circle' },
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  const style = RISK_STYLES[level];
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.text }]}>{style.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '700',
    fontSize: 12,
  },
});
