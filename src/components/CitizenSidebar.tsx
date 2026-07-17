import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface CitizenSidebarProps {
  activeItem?: string;
  onItemPress?: (item: string) => void;
}

const MENU_ITEMS = [
  { id: 'home', label: 'Inicio', icon: 'home-outline' as const },
  { id: 'reports', label: 'Mis Reportes', icon: 'document-text-outline' as const },
  { id: 'info', label: 'Información', icon: 'information-circle-outline' as const },
  { id: 'tips', label: 'Consejos', icon: 'bulb-outline' as const },
  { id: 'settings', label: 'Configuración', icon: 'settings-outline' as const },
];

export function CitizenSidebar({ activeItem = 'home', onItemPress }: CitizenSidebarProps) {
  const handlePress = (item: string) => {
    if (item === 'info' || item === 'tips' || item === 'settings') {
      Alert.alert(
        item === 'info' ? 'Información' : item === 'tips' ? 'Consejos' : 'Configuración',
        'Esta sección estará disponible próximamente.',
        [{ text: 'OK' }]
      );
      return;
    }
    onItemPress?.(item);
  };

  return (
    <View style={styles.sidebar}>
      {/* Logo */}
      <View style={styles.logoSection}>
        <View style={styles.logoIcon}>
          <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
        </View>
        <View style={styles.logoText}>
          <Text style={styles.logoTitle}>Guardian</Text>
          <Text style={styles.logoSubtitle}>Salud AI</Text>
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {MENU_ITEMS.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <Pressable
              key={item.id}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => handlePress(item.id)}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={isActive ? colors.primary : colors.textSecondary}
              />
              <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>Sistema activo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 220,
    backgroundColor: '#F0F8F5',
    borderRightWidth: 1,
    borderRightColor: colors.borderLight,
    paddingTop: 24,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '25',
  },
  logoText: {
    gap: 0,
  },
  logoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 18,
  },
  logoSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 14,
  },
  menu: {
    flex: 1,
    gap: 4,
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  menuItemActive: {
    backgroundColor: colors.primary + '12',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  menuLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
  },
  statusText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
