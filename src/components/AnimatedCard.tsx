import React from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../theme/colors';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
}

export function AnimatedCard({ children, delay = 0, style }: AnimatedCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(delay).springify()}
      style={[styles.card, style]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
