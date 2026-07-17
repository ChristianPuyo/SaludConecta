import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthorityDashboardScreen } from '../screens/authority/AuthorityDashboardScreen';
import { RiskMapScreen } from '../screens/authority/RiskMapScreen';
import { AlertsScreen } from '../screens/authority/AlertsScreen';
import { SwitchRoleButton } from '../components/SwitchRoleButton';
import { colors } from '../theme/colors';

export type AuthorityTabParamList = {
  Dashboard: undefined;
  RiskMap: undefined;
  Alerts: undefined;
};

const Tab = createBottomTabNavigator<AuthorityTabParamList>();

export function AuthorityNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => <SwitchRoleButton />,
        headerTitleStyle: { fontWeight: '800', color: colors.textPrimary, fontSize: 16 },
        tabBarActiveTintColor: colors.danger,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
          paddingTop: 4,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
          borderTopWidth: 0.5,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AuthorityDashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="RiskMap"
        component={RiskMapScreen}
        options={{
          title: 'Mapa de Riesgo',
          tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          title: 'Alertas',
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications" size={size - 2} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
