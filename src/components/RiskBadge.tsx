import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export type RiskLevel = 'bajo' | 'medio' | 'alto';

const RISK_STYLES: Record<RiskLevel, { bg: string; text: string; border: string; icon: string; label: string }> = {
  bajo: { bg: '#F0FDF4', text: colors.successDark, border: '#86EFAC', icon: 'checkmark-circle', label: 'Riesgo Bajo' },
  medio: { bg: '#FFFBEB', text: colors.warningDark, border: '#FCD34D', icon: 'alert-circle', label: 'Riesgo Medio' },
  alto: { bg: '#FEF2F2', text: colors.dangerDark, border: '#FCA5A5', icon: 'warning', label: 'Riesgo Alto' },
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  const style = RISK_STYLES[level];
  return (
    <View style={[styles.badge, { backgroundColor: style.bg, borderColor: style.border }]}>
      <Ionicons name={style.icon as any} size={13} color={style.text} />
      <Text style={[styles.text, { color: style.text }]}>{style.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  text: { fontWeight: '700', fontSize: 11 },
});
