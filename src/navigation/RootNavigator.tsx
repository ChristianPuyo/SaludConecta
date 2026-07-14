import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';
import { LoginScreen } from '../screens/LoginScreen';
import { RoleSelectorScreen } from '../screens/RoleSelectorScreen';
import { CitizenNavigator } from './CitizenNavigator';
import { AgentNavigator } from './AgentNavigator';
import { AuthorityNavigator } from './AuthorityNavigator';
import { colors } from '../theme/colors';
import type { UserRole } from '../types/role';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { user, isLoading: authLoading } = useAuth();
  const { role, isLoading: roleLoading } = useRole();

  if (authLoading || roleLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!role ? (
        <Stack.Screen name="RoleSelector" component={RoleSelectorScreen} />
      ) : role === 'citizen' ? (
        <Stack.Screen name="CitizenApp" component={CitizenNavigator} />
      ) : role === 'agent' ? (
        <Stack.Screen name="AgentApp" component={AgentNavigator} />
      ) : role === 'authority' ? (
        <Stack.Screen name="AuthorityApp" component={AuthorityNavigator} />
      ) : (
        <Stack.Screen name="RoleSelector" component={RoleSelectorScreen} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
});
