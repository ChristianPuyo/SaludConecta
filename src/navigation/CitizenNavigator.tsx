import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { CitizenHomeScreen } from '../screens/citizen/CitizenHomeScreen';
import { ReportSymptomsScreen } from '../screens/citizen/ReportSymptomsScreen';
import { MyReportsScreen } from '../screens/citizen/MyReportsScreen';
import { CitizenRegisterScreen } from '../screens/citizen/CitizenRegisterScreen';
import { SwitchRoleButton } from '../components/SwitchRoleButton';
import { useRole } from '../context/RoleContext';
import { colors } from '../theme/colors';

export type CitizenTabParamList = {
  Home: undefined;
  ReportSymptoms: undefined;
  MyReports: undefined;
};

const Tab = createBottomTabNavigator<CitizenTabParamList>();
const Stack = createNativeStackNavigator();

function CitizenTabNavigator() {
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
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ReportSymptoms"
        component={ReportSymptomsScreen}
        options={{
          title: 'Reportar',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="MyReports"
        component={MyReportsScreen}
        options={{
          title: 'Mis Reportes',
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function CitizenNavigator() {
  const { citizenProfile } = useRole();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!citizenProfile ? (
        <Stack.Screen name="CitizenRegister" component={CitizenRegisterScreen} />
      ) : (
        <Stack.Screen name="CitizenTabs" component={CitizenTabNavigator} />
      )}
    </Stack.Navigator>
  );
}

