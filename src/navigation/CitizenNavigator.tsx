import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CitizenHomeScreen } from '../screens/citizen/CitizenHomeScreen';
import { ReportSymptomsScreen } from '../screens/citizen/ReportSymptomsScreen';
import { MyReportsScreen } from '../screens/citizen/MyReportsScreen';
import { SwitchRoleButton } from '../components/SwitchRoleButton';
import { colors } from '../theme/colors';

export type CitizenTabParamList = {
  Home: undefined;
  ReportSymptoms: undefined;
  MyReports: undefined;
};

const Tab = createBottomTabNavigator<CitizenTabParamList>();

export function CitizenNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => <SwitchRoleButton />,
        headerTitleStyle: {
          fontWeight: '800',
          color: colors.textPrimary,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
          borderTopColor: '#E2E8F0',
          backgroundColor: '#FFFFFF',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={CitizenHomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ReportSymptoms"
        component={ReportSymptomsScreen}
        options={{
          title: 'Reportar',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="MyReports"
        component={MyReportsScreen}
        options={{
          title: 'Mis Reportes',
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
