import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface ConnectivityStatusProps {
  isOnline?: boolean;
}

export function ConnectivityStatus({ isOnline = true }: ConnectivityStatusProps) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.dot,
          { backgroundColor: isOnline ? colors.success : colors.warning },
        ]}
      />
      <Text style={styles.text}>
        {isOnline ? 'Con conexión' : 'Conectividad limitada'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignSelf: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
