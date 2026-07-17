import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { CitizenHomeScreen } from '../screens/citizen/CitizenHomeScreen';
import { ReportSymptomsScreen } from '../screens/citizen/ReportSymptomsScreen';
import { MyReportsScreen } from '../screens/citizen/MyReportsScreen';
import { ProfileScreen } from '../screens/citizen/ProfileScreen';
import { MedicalHistoryScreen } from '../screens/citizen/MedicalHistoryScreen';
import { EducationScreen } from '../screens/citizen/EducationScreen';
import { ArticleDetailScreen } from '../screens/citizen/ArticleDetailScreen';
import { VaccinationScreen } from '../screens/citizen/VaccinationScreen';
import { MedicationsScreen } from '../screens/citizen/MedicationsScreen';
import { HealthTrackingScreen } from '../screens/citizen/HealthTrackingScreen';
import { HealthCentersScreen } from '../screens/citizen/HealthCentersScreen';
import { CommunityReportScreen } from '../screens/citizen/CommunityReportScreen';
import { ChatScreen } from '../screens/citizen/ChatScreen';
import { SettingsScreen } from '../screens/citizen/SettingsScreen';
import { SOSScreen } from '../screens/citizen/SOSScreen';
import { FamilyScreen } from '../screens/citizen/FamilyScreen';
import { AchievementsScreen } from '../screens/citizen/AchievementsScreen';
import { SwitchRoleButton } from '../components/SwitchRoleButton';
import { SOSButton } from '../components/domain/SOSButton';
import { colors } from '../theme/colors';

export type CitizenTabParamList = {
  Home: undefined;
  ReportSymptoms: undefined;
  MyReports: undefined;
  HealthTab: undefined;
  MoreTab: undefined;
};

export type CitizenStackParamList = {
  Profile: undefined;
  MedicalHistory: undefined;
  Education: undefined;
  ArticleDetail: { articleId: string };
  Vaccination: undefined;
  Medications: undefined;
  HealthTracking: undefined;
  HealthCenters: undefined;
  CommunityReport: undefined;
  Chat: undefined;
  Settings: undefined;
  SOS: undefined;
  Family: undefined;
  Achievements: undefined;
};

const Tab = createBottomTabNavigator<CitizenTabParamList>();
const HealthStack = createNativeStackNavigator<CitizenStackParamList>();
const MoreStack = createNativeStackNavigator<CitizenStackParamList>();

function HealthStackScreen() {
  return (
    <HealthStack.Navigator screenOptions={{ headerShown: false }}>
      <HealthStack.Screen name="Profile" component={ProfileScreen} />
      <HealthStack.Screen name="MedicalHistory" component={MedicalHistoryScreen} />
      <HealthStack.Screen name="HealthTracking" component={HealthTrackingScreen} />
      <HealthStack.Screen name="Vaccination" component={VaccinationScreen} />
      <HealthStack.Screen name="Medications" component={MedicationsScreen} />
      <HealthStack.Screen name="Family" component={FamilyScreen} />
    </HealthStack.Navigator>
  );
}

function MoreStackScreen() {
  return (
    <MoreStack.Navigator screenOptions={{ headerShown: false }}>
      <MoreStack.Screen name="Education" component={EducationScreen} />
      <MoreStack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
      <MoreStack.Screen name="Chat" component={ChatScreen} />
      <MoreStack.Screen name="HealthCenters" component={HealthCentersScreen} />
      <MoreStack.Screen name="CommunityReport" component={CommunityReportScreen} />
      <MoreStack.Screen name="SOS" component={SOSScreen} />
      <MoreStack.Screen name="Achievements" component={AchievementsScreen} />
      <MoreStack.Screen name="Settings" component={SettingsScreen} />
    </MoreStack.Navigator>
  );
}

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
          title: 'Reportes',
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="HealthTab"
        component={HealthStackScreen}
        options={{
          title: 'Salud',
          tabBarIcon: ({ color, size }) => <Ionicons name="pulse-outline" color={color} size={size} />,
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
