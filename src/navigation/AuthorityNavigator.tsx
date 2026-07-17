import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthorityDashboardScreen } from '../screens/authority/AuthorityDashboardScreen';
import { InteractiveMapScreen } from '../screens/authority/InteractiveMapScreen';
import { AlertsScreen } from '../screens/authority/AlertsScreen';
import { SwitchRoleButton } from '../components/SwitchRoleButton';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export type AuthorityTabParamList = {
  Dashboard: undefined;
  RiskMap: undefined;
  Alerts: undefined;
};

const Tab = createBottomTabNavigator<AuthorityTabParamList>();

export function AuthorityNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ThemeToggle />
            <SwitchRoleButton />
          </View>
        ),
        tabBarActiveTintColor: colors.primary,
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
        name="RiskMap"
        component={InteractiveMapScreen}
        options={{
          title: 'Mapa de Riesgo',
          tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, size }) => <Ionicons name="warning-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
