import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RoleProvider } from './src/context/RoleContext';
import { ReportsProvider } from './src/context/ReportsContext';
import { VisitsProvider } from './src/context/VisitsContext';
// ===== INICIO MODIFICACIÓN (Iteración: Toast + IMC) =====
import { ToastProvider } from './src/components/Toast';
// ===== FIN MODIFICACIÓN (Iteración: Toast + IMC) =====
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* ===== INICIO MODIFICACIÓN (Iteración: Toast + IMC) ===== */}
      <ToastProvider>
      {/* ===== FIN MODIFICACIÓN (Iteración: Toast + IMC) ===== */}
        <RoleProvider>
          <ReportsProvider>
            <VisitsProvider>
              <NavigationContainer>
                <RootNavigator />
                <StatusBar style="auto" />
              </NavigationContainer>
            </VisitsProvider>
          </ReportsProvider>
        </RoleProvider>
      {/* ===== INICIO MODIFICACIÓN (Iteración: Toast + IMC) ===== */}
      </ToastProvider>
      {/* ===== FIN MODIFICACIÓN (Iteración: Toast + IMC) ===== */}
    </SafeAreaProvider>
  );
}
