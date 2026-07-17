import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AuthorityDashboardScreen } from '../screens/authority/AuthorityDashboardScreen';
import { RiskMapScreen } from '../screens/authority/RiskMapScreen';
import { AlertsScreen } from '../screens/authority/AlertsScreen';
import { SettingsScreen } from '../screens/citizen/SettingsScreen';
import { SwitchRoleButton } from '../components/SwitchRoleButton';
import { colors } from '../theme/colors';

export type AuthorityTabParamList = {
  Dashboard: undefined;
  RiskMap: undefined;
  Alerts: undefined;
  MoreTab: undefined;
};

export type AuthorityStackParamList = {
  Settings: undefined;
};

const Tab = createBottomTabNavigator<AuthorityTabParamList>();
const MoreStack = createNativeStackNavigator<AuthorityStackParamList>();

function MoreStackScreen() {
  return (
    <MoreStack.Navigator screenOptions={{ headerShown: false }}>
      <MoreStack.Screen name="Settings" component={SettingsScreen} />
    </MoreStack.Navigator>
  );
}

export function AuthorityNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => <SwitchRoleButton />,
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
        component={RiskMapScreen}
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
      <Tab.Screen
        name="MoreTab"
        component={MoreStackScreen}
        options={{
          title: 'Más',
          tabBarIcon: ({ color, size }) => <Ionicons name="ellipsis-horizontal-circle-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
