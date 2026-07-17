import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthorityDashboardScreen } from '../screens/authority/AuthorityDashboardScreen';
import { RiskMapScreen } from '../screens/authority/RiskMapScreen';
import { AlertsScreen } from '../screens/authority/AlertsScreen';
import { SwitchRoleButton } from '../components/SwitchRoleButton';
import { BackButton } from '../components/BackButton';
import { useLanguage } from '../context/LanguageContext';
import { colors } from '../theme/colors';

export type AuthorityTabParamList = {
  Dashboard: undefined;
  RiskMap: undefined;
  Alerts: undefined;
};

const Tab = createBottomTabNavigator<AuthorityTabParamList>();

export function AuthorityNavigator() {
  const { t } = useLanguage();
  return (
    <Tab.Navigator
      screenOptions={{
        headerLeft: () => <BackButton />,
        headerRight: () => <SwitchRoleButton />,
        tabBarActiveTintColor: colors.primary,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AuthorityDashboardScreen}
        options={{
          title: t.tab_dashboard,
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="RiskMap"
        component={RiskMapScreen}
        options={{
          title: t.tab_risk_map,
          tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          title: t.tab_alerts,
          tabBarIcon: ({ color, size }) => <Ionicons name="warning-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
