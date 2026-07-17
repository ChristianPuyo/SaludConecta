import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CitizenHomeScreen } from '../screens/citizen/CitizenHomeScreen';
import { ReportSymptomsScreen } from '../screens/citizen/ReportSymptomsScreen';
import { MyReportsScreen } from '../screens/citizen/MyReportsScreen';
import { AssistantScreen } from '../screens/citizen/AssistantScreen';
import { NearbyHealthMapScreen } from '../screens/citizen/NearbyHealthMapScreen';
import { SwitchRoleButton } from '../components/SwitchRoleButton';
import { colors } from '../theme/colors';

export type CitizenTabParamList = {
  Home: undefined;
  ReportSymptoms: undefined;
  MyReports: undefined;
  Assistant: undefined;
  NearbyHealth: undefined;
};

const Tab = createBottomTabNavigator<CitizenTabParamList>();

export function CitizenNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => <SwitchRoleButton />,
        tabBarActiveTintColor: colors.primary,
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
      <Tab.Screen
        name="Assistant"
        component={AssistantScreen}
        options={{
          title: 'Asistente',
          tabBarIcon: ({ color, size }) => <Ionicons name="sparkles-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="NearbyHealth"
        component={NearbyHealthMapScreen}
        options={{
          title: 'Cerca de ti',
          tabBarIcon: ({ color, size }) => <Ionicons name="location-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}