/**
 * Sidebar - Componente de navegación lateral principal de SaludConecta.
 * Renderiza un menú colapsable con secciones e ítems dinámicos según el rol del usuario.
 * Muestra distinctivos de notificaciones no leídas, selector de rol activo,
 * e integra iconografía de Ionicons para facilitar la navegación en escritorio.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import type { UserRole } from '../../types/role';

export interface SidebarSection {
  id: string;
  title: string;
  items: SidebarItem[];
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: number;
}

interface SidebarProps {
  sections: SidebarSection[];
  activeSection: string;
  activeItem: string;
  onItemPress: (sectionId: string, itemId: string) => void;
  role: UserRole;
  userName?: string;
  onRoleSwitch: () => void;
}

export function Sidebar({ sections, activeSection, activeItem, onItemPress, role, userName, onRoleSwitch }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { width } = useWindowDimensions();
  const isCompact = width < 1100;

  const roleColors: Record<UserRole, string> = {
    citizen: colors.primary,
    agent: colors.secondary,
    authority: colors.warning,
  };

  const roleLabels: Record<UserRole, string> = {
    citizen: 'Ciudadano',
    agent: 'Agente',
    authority: 'Autoridad',
  };

  const sidebarWidth = collapsed ? 64 : isCompact ? 200 : 260;

  return (
    <View style={[styles.container, { width: sidebarWidth }]}>
      <View style={styles.header}>
        <View style={[styles.logo, { width: collapsed ? 40 : undefined }]}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>SC</Text>
          </View>
          {!collapsed && <Text style={styles.logoTitle}>SaludConecta</Text>}
        </View>
        <Pressable onPress={() => setCollapsed(!collapsed)} style={styles.collapseBtn}>
          <Ionicons name={collapsed ? 'chevron-forward' : 'chevron-back'} size={18} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={[styles.roleBadge, { borderColor: roleColors[role] }]}>
        <View style={[styles.roleDot, { backgroundColor: roleColors[role] }]} />
        {!collapsed && <Text style={styles.roleText}>{roleLabels[role]}</Text>}
      </View>

      <ScrollView style={styles.nav} showsVerticalScrollIndicator={false}>
        {sections.map(section => (
          <View key={section.id} style={styles.section}>
            {!collapsed && <Text style={styles.sectionTitle}>{section.title}</Text>}
            {section.items.map(item => {
              const isActive = activeSection === section.id && activeItem === item.id;
              return (
                <Pressable
                  key={item.id}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                  onPress={() => onItemPress(section.id, item.id)}
                >
                  <View style={[styles.navIcon, isActive && styles.navIconActive]}>
                    <Ionicons name={item.icon} size={20} color={isActive ? '#fff' : colors.textSecondary} />
                  </View>
                  {!collapsed && (
                    <View style={styles.navLabelRow}>
                      <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
                      {item.badge ? (
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>{item.badge}</Text>
                        </View>
                      ) : null}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.switchBtn} onPress={onRoleSwitch}>
          <Ionicons name="swap-horizontal" size={18} color={colors.primary} />
          {!collapsed && <Text style={styles.switchText}>Cambiar rol</Text>}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  collapseBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 12,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  nav: {
    flex: 1,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 2,
  },
  navItemActive: {
    backgroundColor: colors.primary,
  },
  navIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconActive: {
    backgroundColor: 'transparent',
  },
  navLabelRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  navLabelActive: {
    color: '#fff',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: colors.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 12,
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  switchText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
});
