import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export type RiskLevel = 'bajo' | 'medio' | 'alto';

const RISK_STYLES: Record<RiskLevel, { bg: string; text: string; label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  bajo: { bg: '#DCFCE7', text: colors.success, label: 'Riesgo bajo', icon: 'shield-checkmark-outline' },
  medio: { bg: '#FEF3C7', text: colors.warning, label: 'Riesgo medio', icon: 'warning-outline' },
  alto: { bg: '#FEE2E2', text: colors.danger, label: 'Riesgo alto', icon: 'alert-circle-outline' },
};

export function RiskBadge({ level, size = 'small' }: { level: RiskLevel; size?: 'small' | 'medium' }) {
  const style = RISK_STYLES[level];
  const isSmall = size === 'small';

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }, isSmall ? styles.badgeSmall : styles.badgeMedium]}>
      <Ionicons name={style.icon} size={isSmall ? 12 : 16} color={style.text} />
      <Text style={[styles.text, { color: style.text }, isSmall ? styles.textSmall : styles.textMedium]}>
        {style.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  badgeSmall: { paddingHorizontal: 10, paddingVertical: 4 },
  badgeMedium: { paddingHorizontal: 14, paddingVertical: 6 },
  text: { fontWeight: '700' },
  textSmall: { fontSize: 11 },
  textMedium: { fontSize: 13 },
});
