import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface LandingHeaderProps {
  onHelpPress?: () => void;
  onAboutPress?: () => void;
}

export function LandingHeader({ onHelpPress, onAboutPress }: LandingHeaderProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const handleNavPress = (section: string) => {
    Alert.alert(section, `Navegando a: ${section}`, [{ text: 'OK' }]);
  };

  return (
    <View style={styles.header}>
      {/* Left: Logo + text */}
      <View style={styles.leftSection}>
        <View style={styles.logoContainer}>
          <Ionicons name="shield-checkmark" size={22} color={colors.textLight} />
        </View>
        <View style={styles.textSection}>
          <Text style={styles.appTitle}>Guardian Salud AI</Text>
          {!isMobile && (
            <Text style={styles.appSubtitle}>Inteligencia que protege vidas</Text>
          )}
        </View>
      </View>

      {/* Center: Nav links (desktop only) */}
      {!isMobile && !isTablet && (
        <View style={styles.centerSection}>
          <Pressable style={styles.navButton} onPress={() => handleNavPress('Inicio')}>
            <Text style={styles.navButtonText}>Inicio</Text>
          </Pressable>
          <Pressable style={styles.navButton} onPress={() => handleNavPress('Cómo funciona')}>
            <Text style={styles.navButtonText}>¿Cómo funciona?</Text>
          </Pressable>
          <Pressable style={styles.navButton} onPress={onAboutPress}>
            <Text style={styles.navButtonText}>Sobre el sistema</Text>
          </Pressable>
          <Pressable style={styles.navButton} onPress={() => handleNavPress('Recursos')}>
            <Text style={styles.navButtonText}>Recursos</Text>
          </Pressable>
          <Pressable style={styles.navButton} onPress={onHelpPress}>
            <Text style={styles.navButtonText}>Contacto</Text>
          </Pressable>
        </View>
      )}

      {/* Right: Status + Login */}
      <View style={styles.rightSection}>
        {!isMobile && (
          <View style={styles.statusContainer}>
            <View style={styles.statusDot} />
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusLabel}>Sistema operativo</Text>
              <Text style={styles.statusValue}>Conectado</Text>
            </View>
          </View>
        )}
        <Pressable style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(57, 213, 186, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(57, 213, 186, 0.3)',
  },
  textSection: {
    gap: 1,
  },
  appTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 0.3,
  },
  appSubtitle: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 0.2,
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  navButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  navButtonText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '500',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
  },
  statusTextContainer: {
    gap: 0,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statusValue: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.55)',
  },
  loginButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: 'rgba(57, 213, 186, 0.2)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(57, 213, 186, 0.35)',
  },
  loginButtonText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },
});
