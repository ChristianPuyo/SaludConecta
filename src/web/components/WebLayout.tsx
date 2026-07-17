/**
 * WebLayout - Layout principal de la versión web de SaludConecta.
 * Combina el Sidebar de navegación con un área de contenido dinámico.
 * Se adapta a dispositivos móviles ocultando la barra lateral y mostrando
 * solo el contenido hijo, garantizando una experiencia responsive.
 */
import React from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import type { UserRole } from '../../types/role';
import { Sidebar } from './Sidebar';
import type { SidebarSection } from './Sidebar';

interface WebLayoutProps {
  sections: SidebarSection[];
  activeSection: string;
  activeItem: string;
  onItemPress: (sectionId: string, itemId: string) => void;
  role: UserRole;
  userName?: string;
  onRoleSwitch: () => void;
  children: React.ReactNode;
}

export function WebLayout({
  sections,
  activeSection,
  activeItem,
  onItemPress,
  role,
  userName,
  onRoleSwitch,
  children,
}: WebLayoutProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  if (Platform.OS !== 'web' || isMobile) {
    return <>{children}</>;
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <Sidebar
        sections={sections}
        activeSection={activeSection}
        activeItem={activeItem}
        onItemPress={onItemPress}
        role={role}
        userName={userName}
        onRoleSwitch={onRoleSwitch}
      />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
});
