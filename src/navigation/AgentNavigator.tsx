import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AgentHomeScreen } from '../screens/agent/AgentHomeScreen';
import { RegisterVisitScreen } from '../screens/agent/RegisterVisitScreen';
import { SyncScreen } from '../screens/agent/SyncScreen';
import { SwitchRoleButton } from '../components/SwitchRoleButton';
import { useLanguage } from '../context/LanguageContext';
import { colors } from '../theme/colors';

export type AgentTabParamList = {
  Home: undefined;
  RegisterVisit: undefined;
  Sync: undefined;
};

const Tab = createBottomTabNavigator<AgentTabParamList>();

export function AgentNavigator() {
  const { t } = useLanguage();
  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => <SwitchRoleButton />,
        tabBarActiveTintColor: colors.primary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={AgentHomeScreen}
        options={{
          title: t('tabHome'),
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="RegisterVisit"
        component={RegisterVisitScreen}
        options={{
          title: t('tabNewVisit'),
          tabBarIcon: ({ color, size }) => <Ionicons name="medkit-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Sync"
        component={SyncScreen}
        options={{
          title: t('tabSync'),
          tabBarIcon: ({ color, size }) => <Ionicons name="sync-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
