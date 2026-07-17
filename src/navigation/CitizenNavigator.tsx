import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CitizenHomeScreen } from '../screens/citizen/CitizenHomeScreen';
import { ReportSymptomsScreen } from '../screens/citizen/ReportSymptomsScreen';
import { IaScannerScreen } from '../screens/citizen/IaScannerScreen';
import { MyReportsScreen } from '../screens/citizen/MyReportsScreen';
import { SwitchRoleButton } from '../components/SwitchRoleButton';
import { BackButton } from '../components/BackButton';
import { useLanguage } from '../context/LanguageContext';
import { colors } from '../theme/colors';

export type CitizenTabParamList = {
  Home: undefined;
  ReportSymptoms: undefined;
  Scanner: undefined;
  MyReports: undefined;
};

const Tab = createBottomTabNavigator<CitizenTabParamList>();

export function CitizenNavigator() {
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
        name="Home"
        component={CitizenHomeScreen}
        options={{
          title: t.tab_home,
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ReportSymptoms"
        component={ReportSymptomsScreen}
        options={{
          title: t.tab_report,
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Scanner"
        component={IaScannerScreen}
        options={{
          title: t.tab_scanner,
          tabBarIcon: ({ color, size }) => <Ionicons name="camera-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="MyReports"
        component={MyReportsScreen}
        options={{
          title: t.tab_my_reports,
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
