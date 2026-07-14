import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface AppHeaderProps {
  onAccessibilityPress?: () => void;
  accessibilityLabel?: string;
}

export function AppHeader({
  onAccessibilityPress,
  accessibilityLabel,
}: AppHeaderProps) {
  const [textScale, setTextScale] = useState(1);

  const toggleTextSize = () => {
    setTextScale((prev) => {
      const next = prev >= 1.3 ? 1 : prev + 0.1;
      return next;
    });
    onAccessibilityPress?.();
  };

  return (
    <View style={styles.header}>
      <View style={styles.logoRow}>
        <View style={styles.logoIcon}>
          <Ionicons name="medical" size={22} color={colors.surface} />
        </View>
        <Text style={styles.appName}>SaludConecta</Text>
      </View>

      <View style={styles.headerActions}>
        <Pressable
          style={({ pressed }) => [
            styles.headerBtn,
            pressed && styles.headerBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Seleccionar idioma"
        >
          <Ionicons name="language" size={20} color={colors.textSecondary} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.headerBtn,
            pressed && styles.headerBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel || 'Ajustes de accesibilidad'}
          onPress={toggleTextSize}
        >
          <Ionicons name="accessibility" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  headerBtnPressed: {
    backgroundColor: colors.backgroundAlt,
    opacity: 0.7,
  },
});
