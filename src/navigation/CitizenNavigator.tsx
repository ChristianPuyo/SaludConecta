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
        headerTitleStyle: { fontWeight: '800', color: colors.textPrimary, fontSize: 16 },
        tabBarActiveTintColor: colors.primary,
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
        name="Home"
        component={CitizenHomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="ReportSymptoms"
        component={ReportSymptomsScreen}
        options={{
          title: 'Reportar',
          tabBarIcon: ({ color, size }) => <Ionicons name="pulse" size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="MyReports"
        component={MyReportsScreen}
        options={{
          title: 'Mis Reportes',
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text" size={size - 2} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
