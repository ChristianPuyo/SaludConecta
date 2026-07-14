import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export type RiskLevel = 'bajo' | 'medio' | 'alto';

export function RiskBadge({ level }: { level: RiskLevel }) {
  const RISK_STYLES: Record<RiskLevel, { bg: string; dot: string; text: string; label: string }> = {
    bajo: { bg: colors.successLight, dot: colors.success, text: colors.successDark, label: 'Riesgo bajo' },
    medio: { bg: colors.warningLight, dot: colors.warning, text: colors.warningDark, label: 'Riesgo medio' },
    alto: { bg: colors.dangerLight, dot: colors.danger, text: colors.dangerDark, label: 'Riesgo alto' },
  };

  const style = RISK_STYLES[level];
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <View style={[styles.dot, { backgroundColor: style.dot }]} />
      <Text style={[styles.text, { color: style.text }]}>{style.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontWeight: '800',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});

