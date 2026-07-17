import { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RoleProvider } from './src/context/RoleContext';
import { ReportsProvider } from './src/context/ReportsContext';
import { VisitsProvider } from './src/context/VisitsContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SplashScreen } from './src/components/SplashScreen';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <SafeAreaProvider>
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}
      {splashDone && (
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
      )}
    </SafeAreaProvider>
  );
}
