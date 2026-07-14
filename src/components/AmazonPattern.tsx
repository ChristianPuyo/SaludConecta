import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export function AmazonPattern() {
  return (
    <View style={styles.container} pointerEvents="none">
      <View style={[styles.curve, styles.curve1]} />
      <View style={[styles.curve, styles.curve2]} />
      <View style={[styles.curve, styles.curve3]} />
      <View style={[styles.dot, styles.dot1]} />
      <View style={[styles.dot, styles.dot2]} />
      <View style={[styles.dot, styles.dot3]} />
      <View style={[styles.dot, styles.dot4]} />
      <View style={[styles.dot, styles.dot5]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    opacity: 0.06,
  },
  curve: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 200,
  },
  curve1: {
    width: 300,
    height: 300,
    top: -80,
    right: -100,
    transform: [{ rotate: '15deg' }],
  },
  curve2: {
    width: 250,
    height: 250,
    top: 60,
    left: -120,
    transform: [{ rotate: '-30deg' }],
  },
  curve3: {
    width: 200,
    height: 200,
    bottom: 100,
    right: -60,
    transform: [{ rotate: '45deg' }],
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  dot1: { top: '15%', left: '20%' },
  dot2: { top: '40%', right: '15%' },
  dot3: { top: '65%', left: '10%' },
  dot4: { bottom: '20%', right: '25%' },
  dot5: { bottom: '35%', left: '30%' },
});
