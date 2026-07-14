import React from 'react';
import { ActivityIndicator, ImageBackground, View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRole } from '../context/RoleContext';
import { RoleSelectorScreen } from '../screens/RoleSelectorScreen';
import { CitizenNavigator } from './CitizenNavigator';
import { AgentNavigator } from './AgentNavigator';
import { AuthorityNavigator } from './AuthorityNavigator';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();
const backgroundImage = require('../../assets/fondo pri.jpg');

export function RootNavigator() {
  const { role, isLoading } = useRole();

  if (isLoading) {
    return (
      <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!role ? (
          <Stack.Screen name="RoleSelector" component={RoleSelectorScreen} />
        ) : role === 'citizen' ? (
          <Stack.Screen name="CitizenApp" component={CitizenNavigator} />
        ) : role === 'agent' ? (
          <Stack.Screen name="AgentApp" component={AgentNavigator} />
        ) : (
          <Stack.Screen name="AuthorityApp" component={AuthorityNavigator} />
        )}
      </Stack.Navigator>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
});
