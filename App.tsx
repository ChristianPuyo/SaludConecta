import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RoleProvider } from './src/context/RoleContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { ReportsProvider } from './src/context/ReportsContext';
import { VisitsProvider } from './src/context/VisitsContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
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
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
