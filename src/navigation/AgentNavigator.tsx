import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AgentHomeScreen } from '../screens/agent/AgentHomeScreen';
import { RegisterVisitScreen } from '../screens/agent/RegisterVisitScreen';
import { SyncScreen } from '../screens/agent/SyncScreen';
import { SwitchRoleButton } from '../components/SwitchRoleButton';
import { colors } from '../theme/colors';

export type AgentTabParamList = {
  Home: undefined;
  RegisterVisit: undefined;
  Sync: undefined;
};

const Tab = createBottomTabNavigator<AgentTabParamList>();

export function AgentNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: () => <SwitchRoleButton />,
        headerTitleStyle: { fontWeight: '800', color: colors.textPrimary, fontSize: 16 },
        tabBarActiveTintColor: colors.secondary,
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
        component={AgentHomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="RegisterVisit"
        component={RegisterVisitScreen}
        options={{
          title: 'Nueva Visita',
          tabBarIcon: ({ color, size }) => <Ionicons name="medkit" size={size - 2} color={color} />,
        }}
      />
      <Tab.Screen
        name="Sync"
        component={SyncScreen}
        options={{
          title: 'Sincronizar',
          tabBarIcon: ({ color, size }) => <Ionicons name="sync" size={size - 2} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
