import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';

export type RiskLevel = 'bajo' | 'medio' | 'alto';

const RISK_STYLES: Record<RiskLevel, { bg: string; text: string; label: string; icon: string; shadow: object }> = {
  bajo: {
    bg: '#DCFCE7',
    text: colors.success,
    label: 'Riesgo bajo',
    icon: '✓',
    shadow: { shadowColor: colors.success, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },
  },
  medio: {
    bg: '#FEF3C7',
    text: colors.warning,
    label: 'Riesgo medio',
    icon: '⚠',
    shadow: { shadowColor: colors.warning, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2 },
  },
  alto: {
    bg: '#FEE2E2',
    text: colors.danger,
    label: 'Riesgo alto',
    icon: '🚨',
    shadow: { shadowColor: colors.danger, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 },
  },
};

export function RiskBadge({ level, size = 'md' }: { level: RiskLevel; size?: 'sm' | 'md' | 'lg' }) {
  const style = RISK_STYLES[level];
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (level === 'alto') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [level]);

  const sizeStyles = {
    sm: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
    md: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
    lg: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  };

  const textStyles = {
    sm: { fontSize: 10, fontWeight: '700' as const },
    md: { fontSize: 12, fontWeight: '700' as const },
    lg: { fontSize: 14, fontWeight: '800' as const },
  };

  return (
    <Animated.View
      style={[
        styles.badge,
        sizeStyles[size],
        { backgroundColor: style.bg, ...style.shadow },
        level === 'alto' && { transform: [{ scale: pulseAnim }] },
      ]}
    >
      <Text style={styles.icon}>{style.icon}</Text>
      <Text style={[styles.text, textStyles[size], { color: style.text }]}>{style.label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  icon: { fontSize: 10 },
  text: {},
});
