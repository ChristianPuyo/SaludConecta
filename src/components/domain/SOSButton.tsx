import React, { useRef } from 'react';
import { Pressable, Text, StyleSheet, Animated, Alert, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SOS_PHONE, EMERGENCY_LINES } from '../../constants';

export function SOSButton() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const startPulse = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const handlePress = () => {
    startPulse();
    Alert.alert(
      '🚨 Emergencia',
      '¿Qué deseas hacer?',
      [
        ...EMERGENCY_LINES.map((line) => ({
          text: `${line.name} (${line.phone})`,
          onPress: () => {
            const url = Platform.OS === 'ios' ? `tel:${line.phone}` : `tel:${line.phone}`;
            Linking.openURL(url).catch(() => {
              Alert.alert('Error', `Llama al ${line.phone} desde tu teléfono`);
            });
          },
        })),
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable style={styles.button} onPress={handlePress}>
        <Ionicons name="call" size={24} color="#fff" />
        <Text style={styles.text}>SOS</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    zIndex: 100,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  text: { color: '#fff', fontSize: 10, fontWeight: '800', marginTop: 1 },
});
