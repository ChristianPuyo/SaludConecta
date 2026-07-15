import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useRole } from '../context/RoleContext';
import { RoleSelectorScreen } from '../screens/RoleSelectorScreen';
import { CitizenStackNavigator } from './CitizenStackNavigator';
import { AgentNavigator } from './AgentNavigator';
import { AuthorityNavigator } from './AuthorityNavigator';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { role, isLoading } = useRole();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!role ? (
        <Stack.Screen name="RoleSelector" component={RoleSelectorScreen} />
      ) : role === 'citizen' ? (
        <Stack.Screen name="CitizenApp" component={CitizenStackNavigator} />
      ) : role === 'agent' ? (
        <Stack.Screen name="AgentApp" component={AgentNavigator} />
      ) : (
        <Stack.Screen name="AuthorityApp" component={AuthorityNavigator} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
});
