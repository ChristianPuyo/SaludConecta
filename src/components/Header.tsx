import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface HeaderProps {
  onHelpPress?: () => void;
  onAboutPress?: () => void;
}

export function Header({ onHelpPress, onAboutPress }: HeaderProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
        </View>
        <View style={styles.textSection}>
          <Text style={styles.appTitle}>Guardian Salud AI</Text>
          <Text style={styles.appSubtitle}>Sistema inteligente de salud pública</Text>
        </View>
      </View>

      {!isMobile && (
        <View style={styles.rightSection}>
          <Pressable style={styles.navButton}>
            <Text style={styles.navButtonText}>Inicio</Text>
          </Pressable>
          <Pressable style={styles.navButton} onPress={onAboutPress}>
            <Text style={styles.navButtonText}>Sobre el proyecto</Text>
          </Pressable>
          <Pressable style={styles.navButton} onPress={onHelpPress}>
            <Text style={styles.navButtonText}>Ayuda</Text>
          </Pressable>
          <Pressable style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 76,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSection: {
    gap: 2,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  appSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 6,
    marginLeft: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
