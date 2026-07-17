/**
 * App - Punto de entrada principal de SaludConecta.
 * Configura los proveedores de contexto (Roles, Perfil, Reportes, Visitas,
 * Salud, Notificaciones y Favoritos) y selecciona el navegador adecuado
 * según la plataforma: WebNavigator para web o RootNavigator para móvil.
 */
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { RoleProvider } from './src/context/RoleContext';
import { ReportsProvider } from './src/context/ReportsContext';
import { VisitsProvider } from './src/context/VisitsContext';
import { ProfileProvider } from './src/context/ProfileContext';
import { HealthProvider } from './src/context/HealthContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { WebNavigator } from './src/web/navigation/WebNavigator';

export default function App() {
  const content = Platform.OS === 'web' ? <WebNavigator /> : <RootNavigator />;

  return (
    <SafeAreaProvider>
      <RoleProvider>
        <ProfileProvider>
          <ReportsProvider>
            <VisitsProvider>
              <HealthProvider>
                <NotificationProvider>
                  <FavoritesProvider>
                    <NavigationContainer>
                      {content}
                      <StatusBar style="auto" />
                    </NavigationContainer>
                  </FavoritesProvider>
                </NotificationProvider>
              </HealthProvider>
            </VisitsProvider>
          </ReportsProvider>
        </ProfileProvider>
      </RoleProvider>
    </SafeAreaProvider>
  );
}
