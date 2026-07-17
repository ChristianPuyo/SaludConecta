/**
 * WebNavigator - Orquestador principal de la navegación web de SaludConecta.
 * Configura las secciones del Sidebar y el registro de pantallas según el rol
 * (ciudadano, agente o autoridad). Gestiona el estado activo de navegación,
 * inicializa los datos demo y enruta la pantalla correspondiente a través de WebLayout.
 */
import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useRole } from '../../context/RoleContext';
import { seedDemoData } from '../../services/seedData';
import { useProfile } from '../../context/ProfileContext';
import { useNotifications } from '../../context/NotificationContext';
import { WebLayout } from '../components/WebLayout';
import type { SidebarSection } from '../components/Sidebar';
import type { UserRole } from '../../types/role';
import { colors } from '../../theme/colors';
import { RoleSelectorScreen } from '../../screens/RoleSelectorScreen';
import { CitizenNavigator } from '../../navigation/CitizenNavigator';

import { WebDashboardScreen } from '../screens/WebDashboardScreen';
import { MiSaludPortalScreen } from '../screens/MiSaludPortalScreen';
import { PersonalDashboardScreen } from '../screens/PersonalDashboardScreen';
import { MedicalAgendaScreen } from '../screens/MedicalAgendaScreen';
import { AlertCenterScreen } from '../screens/AlertCenterScreen';
import { SmartMapScreen } from '../screens/SmartMapScreen';
import { NationalDirectoryScreen } from '../screens/NationalDirectoryScreen';
import { MedicalLibraryScreen } from '../screens/MedicalLibraryScreen';
import { HealthAcademyScreen } from '../screens/HealthAcademyScreen';
import { AIHubScreen } from '../screens/AIHubScreen';
import { CommunityCenterScreen } from '../screens/CommunityCenterScreen';
import { CampaignCenterScreen } from '../screens/CampaignCenterScreen';
import { EpidemiologicalObservatoryScreen } from '../screens/EpidemiologicalObservatoryScreen';
import { MonitoringCenterScreen } from '../screens/MonitoringCenterScreen';
import { ExecutiveReportsScreen } from '../screens/ExecutiveReportsScreen';
import { DocumentCenterScreen } from '../screens/DocumentCenterScreen';
import { SocialCommunityScreen } from '../screens/SocialCommunityScreen';
import { AchievementsHubScreen } from '../screens/AchievementsHubScreen';
import { SettingsEnhancedScreen } from '../screens/SettingsEnhancedScreen';
import { HelpCenterScreen } from '../screens/HelpCenterScreen';
import { SimulationLabScreen } from '../screens/SimulationLabScreen';
import { DigitalTwinScreen } from '../screens/DigitalTwinScreen';
import { NationalVigilanceCenterScreen } from '../screens/NationalVigilanceCenterScreen';

interface ScreenEntry {
  section: string;
  item: string;
  component: React.ComponentType<any>;
  title: string;
  subtitle?: string;
}

function useSidebarConfig(role: UserRole, unreadCount: number): { sections: SidebarSection[]; screens: ScreenEntry[] } {
  const citizenSections: SidebarSection[] = [
    {
      id: 'principal',
      title: 'Principal',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'home' },
        { id: 'mi-salud', label: 'Mi Salud', icon: 'person-circle' },
        { id: 'dashboard-personal', label: 'Panel Personal', icon: 'stats-chart' },
      ],
    },
    {
      id: 'salud',
      title: 'Salud',
      items: [
        { id: 'agenda', label: 'Agenda Médica', icon: 'calendar' },
        { id: 'alertas', label: 'Centro de Alertas', icon: 'warning', badge: unreadCount || undefined },
        { id: 'mapa', label: 'Mapa Inteligente', icon: 'map' },
      ],
    },
    {
      id: 'recursos',
      title: 'Recursos',
      items: [
        { id: 'directorio', label: 'Directorio Nacional', icon: 'business' },
        { id: 'biblioteca', label: 'Biblioteca Médica', icon: 'library' },
        { id: 'academia', label: 'Academia SC', icon: 'school' },
        { id: 'centro-ia', label: 'Centro IA', icon: 'bulb' },
      ],
    },
    {
      id: 'comunidad',
      title: 'Comunidad',
      items: [
        { id: 'comunidad', label: 'Comunidad', icon: 'people' },
        { id: 'campanas', label: 'Campañas', icon: 'megaphone' },
      ],
    },
    {
      id: 'soporte',
      title: 'Soporte',
      items: [
        { id: 'logros', label: 'Reconocimientos', icon: 'trophy' },
        { id: 'ayuda', label: 'Centro de Ayuda', icon: 'help-circle' },
        { id: 'configuracion', label: 'Configuración', icon: 'settings' },
      ],
    },
  ];

  const authoritySections: SidebarSection[] = [
    {
      id: 'vigilancia',
      title: 'Vigilancia',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'home' },
        { id: 'observatorio', label: 'Observatorio Epid.', icon: 'eye' },
        { id: 'monitoreo', label: 'Centro de Monitoreo', icon: 'pulse' },
        { id: 'mapa', label: 'Mapa Inteligente', icon: 'map' },
      ],
    },
    {
      id: 'analisis',
      title: 'Análisis',
      items: [
        { id: 'alertas', label: 'Alertas', icon: 'warning', badge: unreadCount || undefined },
        { id: 'reportes', label: 'Reportes Ejecutivos', icon: 'document-text' },
        { id: 'documentos', label: 'Centro Documental', icon: 'folder-open' },
      ],
    },
    {
      id: 'premium',
      title: 'Premium',
      items: [
        { id: 'simulacion', label: 'Lab. Simulación', icon: 'flask' },
        { id: 'gemelo', label: 'Gemelo Digital', icon: 'layers' },
        { id: 'vigilancia-nac', label: 'Vigilancia Nacional', icon: 'shield' },
      ],
    },
    {
      id: 'recursos',
      title: 'Recursos',
      items: [
        { id: 'biblioteca', label: 'Biblioteca Médica', icon: 'library' },
        { id: 'academia', label: 'Academia SC', icon: 'school' },
        { id: 'centro-ia', label: 'Centro IA', icon: 'bulb' },
      ],
    },
    {
      id: 'soporte',
      title: 'Soporte',
      items: [
        { id: 'campanas', label: 'Campañas', icon: 'megaphone' },
        { id: 'ayuda', label: 'Centro de Ayuda', icon: 'help-circle' },
        { id: 'configuracion', label: 'Configuración', icon: 'settings' },
      ],
    },
  ];

  const agentSections: SidebarSection[] = [
    {
      id: 'principal',
      title: 'Principal',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'home' },
        { id: 'mi-salud', label: 'Mi Salud', icon: 'person-circle' },
        { id: 'agenda', label: 'Agenda Médica', icon: 'calendar' },
      ],
    },
    {
      id: 'operaciones',
      title: 'Operaciones',
      items: [
        { id: 'alertas', label: 'Alertas', icon: 'warning', badge: unreadCount || undefined },
        { id: 'mapa', label: 'Mapa de Riesgo', icon: 'map' },
        { id: 'directorio', label: 'Directorio', icon: 'business' },
      ],
    },
    {
      id: 'recursos',
      title: 'Recursos',
      items: [
        { id: 'biblioteca', label: 'Biblioteca', icon: 'library' },
        { id: 'academia', label: 'Capacitación', icon: 'school' },
        { id: 'centro-ia', label: 'Centro IA', icon: 'bulb' },
      ],
    },
    {
      id: 'soporte',
      title: 'Soporte',
      items: [
        { id: 'campanas', label: 'Campañas', icon: 'megaphone' },
        { id: 'ayuda', label: 'Ayuda', icon: 'help-circle' },
        { id: 'configuracion', label: 'Configuración', icon: 'settings' },
      ],
    },
  ];

  const sectionsByRole: Record<UserRole, SidebarSection[]> = {
    citizen: citizenSections,
    agent: agentSections,
    authority: authoritySections,
  };

  const screenRegistry: ScreenEntry[] = [
    { section: 'principal', item: 'dashboard', component: WebDashboardScreen, title: 'Dashboard', subtitle: 'Panel de control principal' },
    { section: 'principal', item: 'mi-salud', component: MiSaludPortalScreen, title: 'Mi Salud', subtitle: 'Portal personal de salud' },
    { section: 'principal', item: 'dashboard-personal', component: PersonalDashboardScreen, title: 'Panel Personal', subtitle: 'Métricas y estadísticas personales' },
    { section: 'salud', item: 'agenda', component: MedicalAgendaScreen, title: 'Agenda Médica', subtitle: 'Citas y calendario de salud' },
    { section: 'salud', item: 'alertas', component: AlertCenterScreen, title: 'Centro de Alertas', subtitle: 'Alertas y notificaciones de salud' },
    { section: 'salud', item: 'mapa', component: SmartMapScreen, title: 'Mapa Inteligente', subtitle: 'Mapa de riesgo epidemiológico' },
    { section: 'recursos', item: 'directorio', component: NationalDirectoryScreen, title: 'Directorio Nacional', subtitle: 'Centros de salud y servicios' },
    { section: 'recursos', item: 'biblioteca', component: MedicalLibraryScreen, title: 'Biblioteca Médica', subtitle: 'Recursos educativos de salud' },
    { section: 'recursos', item: 'academia', component: HealthAcademyScreen, title: 'Academia SaludConecta', subtitle: 'Cursos y capacitaciones' },
    { section: 'recursos', item: 'centro-ia', component: AIHubScreen, title: 'Centro de IA', subtitle: 'Asistencia inteligente de salud' },
    { section: 'comunidad', item: 'comunidad', component: CommunityCenterScreen, title: 'Centro Comunitario', subtitle: 'Conecta con tu comunidad' },
    { section: 'comunidad', item: 'campanas', component: CampaignCenterScreen, title: 'Centro de Campañas', subtitle: 'Campañas de salud pública' },
    { section: 'vigilancia', item: 'observatorio', component: EpidemiologicalObservatoryScreen, title: 'Observatorio Epidemiológico', subtitle: 'Vigilancia epidemiológica nacional' },
    { section: 'vigilancia', item: 'monitoreo', component: MonitoringCenterScreen, title: 'Centro de Monitoreo', subtitle: 'Monitoreo en tiempo real' },
    { section: 'analisis', item: 'reportes', component: ExecutiveReportsScreen, title: 'Reportes Ejecutivos', subtitle: 'Reportes y exportación de datos' },
    { section: 'analisis', item: 'documentos', component: DocumentCenterScreen, title: 'Centro Documental', subtitle: 'Documentos y normativas' },
    { section: 'comunidad', item: 'comunidad', component: SocialCommunityScreen, title: 'Comunidad Social', subtitle: 'Red social de salud' },
    { section: 'soporte', item: 'logros', component: AchievementsHubScreen, title: 'Reconocimientos', subtitle: 'Logros y badges' },
    { section: 'soporte', item: 'configuracion', component: SettingsEnhancedScreen, title: 'Configuración', subtitle: 'Preferencias de la plataforma' },
    { section: 'soporte', item: 'ayuda', component: HelpCenterScreen, title: 'Centro de Ayuda', subtitle: 'Soporte y asistencia' },
    { section: 'premium', item: 'simulacion', component: SimulationLabScreen, title: 'Laboratorio de Simulación', subtitle: 'Simulación de escenarios de salud' },
    { section: 'premium', item: 'gemelo', component: DigitalTwinScreen, title: 'Gemelo Digital', subtitle: 'Gemelo digital de distritos' },
    { section: 'premium', item: 'vigilancia-nac', component: NationalVigilanceCenterScreen, title: 'Vigilancia Nacional', subtitle: 'Centro nacional de vigilancia' },
  ];

  return { sections: sectionsByRole[role], screens: screenRegistry };
}

export function WebNavigator() {
  const { role, isLoading, clearRole } = useRole();
  const { profile } = useProfile();
  const { unreadCount } = useNotifications();
  const [activeSection, setActiveSection] = useState('principal');
  const [activeItem, setActiveItem] = useState('dashboard');

  useEffect(() => { seedDemoData(); }, []);

  const { sections, screens } = useSidebarConfig(role || 'citizen', unreadCount);

  const handleItemPress = (sectionId: string, itemId: string) => {
    setActiveSection(sectionId);
    setActiveItem(itemId);
  };

  const ActiveScreen = useMemo(() => {
    const entry = screens.find(s => s.section === activeSection && s.item === activeItem);
    return entry?.component || WebDashboardScreen;
  }, [activeSection, activeItem, screens]);

  const activeEntry = screens.find(s => s.section === activeSection && s.item === activeItem);

  if (isLoading) return null;
  if (!role) return <RoleSelectorScreen />;

  if (Platform.OS !== 'web') {
    return <CitizenNavigator />;
  }

  return (
    <WebLayout
      sections={sections}
      activeSection={activeSection}
      activeItem={activeItem}
      onItemPress={handleItemPress}
      role={role}
      userName={profile?.name}
      onRoleSwitch={clearRole}
    >
      <ActiveScreen title={activeEntry?.title} subtitle={activeEntry?.subtitle} />
    </WebLayout>
  );
}
