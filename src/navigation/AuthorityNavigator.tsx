import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthorityDashboardScreen } from '../screens/authority/AuthorityDashboardScreen';
import { RiskMapScreen } from '../screens/authority/RiskMapScreen';
import { AlertsScreen } from '../screens/authority/AlertsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import { AuthorityTabParamList, AuthorityStackParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<AuthorityTabParamList>();
const Stack = createNativeStackNavigator<AuthorityStackParamList>();

function AuthorityTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: '800', color: colors.textPrimary },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AuthorityDashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Estadísticas"
        component={AlertsScreen}
        options={{
          title: 'Estadísticas',
          tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Mapa"
        component={RiskMapScreen}
        options={{
          title: 'Mapa de Riesgo',
          tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AuthorityNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AuthorityTabs"
        component={AuthorityTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}


