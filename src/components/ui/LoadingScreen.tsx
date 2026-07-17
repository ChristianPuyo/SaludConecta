import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Cargando...' }: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: 12,
  },
  message: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
});
