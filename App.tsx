import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RoleProvider } from './src/context/RoleContext';
import { ReportsProvider } from './src/context/ReportsContext';
import { VisitsProvider } from './src/context/VisitsContext';
import { AlertsProvider } from './src/context/AlertsContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { RootNavigator } from './src/navigation/RootNavigator';

function AppContent() {
  const { isDark } = useTheme();
  return (
    <NavigationContainer>
      <RootNavigator />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RoleProvider>
          <ReportsProvider>
            <VisitsProvider>
              <AlertsProvider>
                <AppContent />
              </AlertsProvider>
            </VisitsProvider>
          </ReportsProvider>
        </RoleProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
