import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CitizenHomeScreen } from '../screens/citizen/CitizenHomeScreen';
import { ReportSymptomsScreen } from '../screens/citizen/ReportSymptomsScreen';
import { MyReportsScreen } from '../screens/citizen/MyReportsScreen';
import { HealthCalculatorScreen } from '../screens/citizen/HealthCalculatorScreen';
import { SwitchRoleButton } from '../components/SwitchRoleButton';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export type CitizenTabParamList = {
  Home: undefined;
  ReportSymptoms: undefined;
  MyReports: undefined;
  HealthCalculator: undefined;
};

const Tab = createBottomTabNavigator<CitizenTabParamList>();

export function CitizenNavigator() {
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
        name="HealthCalculator"
        component={HealthCalculatorScreen}
        options={{
          title: 'Calculadora',
          tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
