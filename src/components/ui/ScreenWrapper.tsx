import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: boolean;
}

export function ScreenWrapper({ children, style, padding = true }: ScreenWrapperProps) {
  return <View style={[styles.container, padding && styles.padding, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  padding: { padding: 20 },
});
