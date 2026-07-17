import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRole } from '../context/RoleContext';
import { RoleSelectorScreen } from '../screens/RoleSelectorScreen';
import { CitizenNavigator } from './CitizenNavigator';
import { AgentNavigator } from './AgentNavigator';
import { AuthorityNavigator } from './AuthorityNavigator';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { role, isLoading } = useRole();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingDot} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 300,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
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
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
});
