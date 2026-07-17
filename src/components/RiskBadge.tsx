import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';

export type RiskLevel = 'bajo' | 'medio' | 'alto';

const RISK_STYLES: Record<RiskLevel, { bg: string; text: string }> = {
  bajo: { bg: '#DCFCE7', text: colors.success },
  medio: { bg: '#FEF3C7', text: colors.warning },
  alto: { bg: '#FEE2E2', text: colors.danger },
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  const { t } = useLanguage();
  const style = RISK_STYLES[level];
  const label = level === 'alto' ? t.risk_badge_high : level === 'medio' ? t.risk_badge_medium : t.risk_badge_low;
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start' },
  text: { fontWeight: '700', fontSize: 12 },
});
