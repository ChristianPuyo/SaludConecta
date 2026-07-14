import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';

export function BackgroundDecorations() {
  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.gradientLayer} />

      <View style={[styles.bubble, styles.bubbleLeft]} />
      <View style={[styles.bubble, styles.bubbleLeftInner]} />

      <View style={[styles.bubble, styles.bubbleTopRight]} />
      <View style={[styles.bubble, styles.bubbleTopRightInner]} />

      <View style={[styles.bubble, styles.bubbleBottomRight]} />
      <View style={[styles.bubble, styles.bubbleBottomRightInner]} />

      <View style={[styles.bubble, styles.bubbleCenter]} />

      <View style={[styles.geoShape, styles.geo1]} />
      <View style={[styles.geoShape, styles.geo2]} />
      <View style={[styles.geoShape, styles.geo3]} />
      <View style={[styles.geoShape, styles.geo4]} />
      <View style={[styles.geoShape, styles.geo5]} />

      <View style={[styles.debugLine, styles.debugLine1]} />
      <View style={[styles.debugLine, styles.debugLine2]} />
      <View style={[styles.debugLine, styles.debugLine3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gradientLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
  },

  bubble: {
    position: 'absolute',
    borderRadius: 9999,
  },
  bubbleLeft: {
    width: 420,
    height: 420,
    top: '10%',
    left: -140,
    backgroundColor: 'rgba(82, 168, 216, 0.12)',
  },
  bubbleLeftInner: {
    width: 280,
    height: 280,
    top: '18%',
    left: -60,
    backgroundColor: 'rgba(34, 166, 168, 0.08)',
  },
  bubbleTopRight: {
    width: 360,
    height: 360,
    top: -100,
    right: -100,
    backgroundColor: 'rgba(34, 166, 168, 0.10)',
  },
  bubbleTopRightInner: {
    width: 240,
    height: 240,
    top: -40,
    right: -30,
    backgroundColor: 'rgba(82, 168, 216, 0.07)',
  },
  bubbleBottomRight: {
    width: 320,
    height: 320,
    bottom: -80,
    right: -100,
    backgroundColor: 'rgba(255, 244, 217, 0.35)',
  },
  bubbleBottomRightInner: {
    width: 200,
    height: 200,
    bottom: -20,
    right: -40,
    backgroundColor: 'rgba(251, 232, 236, 0.25)',
  },
  bubbleCenter: {
    width: 200,
    height: 200,
    top: '45%',
    left: '50%',
    marginLeft: -100,
    backgroundColor: 'rgba(184, 230, 232, 0.10)',
  },

  geoShape: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: 'rgba(11, 111, 115, 0.06)',
  },
  geo1: {
    width: 80,
    height: 80,
    top: '20%',
    right: '15%',
    transform: [{ rotate: '45deg' }],
  },
  geo2: {
    width: 50,
    height: 50,
    top: '60%',
    left: '12%',
    transform: [{ rotate: '20deg' }],
  },
  geo3: {
    width: 35,
    height: 35,
    top: '35%',
    right: '25%',
    backgroundColor: 'rgba(212, 180, 95, 0.06)',
    borderWidth: 0,
  },
  geo4: {
    width: 60,
    height: 60,
    bottom: '25%',
    left: '20%',
    transform: [{ rotate: '-15deg' }],
  },
  geo5: {
    width: 25,
    height: 25,
    top: '75%',
    right: '30%',
    backgroundColor: 'rgba(251, 232, 236, 0.15)',
    borderWidth: 0,
  },

  debugLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(11, 111, 115, 0.03)',
  },
  debugLine1: {
    width: '60%',
    top: '30%',
    left: '20%',
    transform: [{ rotate: '-5deg' }],
  },
  debugLine2: {
    width: '45%',
    top: '55%',
    left: '30%',
    transform: [{ rotate: '3deg' }],
  },
  debugLine3: {
    width: '35%',
    top: '78%',
    left: '10%',
    transform: [{ rotate: '-2deg' }],
  },
});
