import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AgentHomeScreen } from '../screens/agent/AgentHomeScreen';
import { RegisterVisitScreen } from '../screens/agent/RegisterVisitScreen';
import { SyncScreen } from '../screens/agent/SyncScreen';
import { SwitchRoleButton } from '../components/SwitchRoleButton';
import { ThemeToggle } from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

export type AgentTabParamList = {
  Home: undefined;
  RegisterVisit: undefined;
  Sync: undefined;
};

const Tab = createBottomTabNavigator<AgentTabParamList>();

export function AgentNavigator() {
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
        component={AgentHomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="RegisterVisit"
        component={RegisterVisitScreen}
        options={{
          title: 'Nueva Visita',
          tabBarIcon: ({ color, size }) => <Ionicons name="medkit-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Sync"
        component={SyncScreen}
        options={{
          title: 'Sincronizar',
          tabBarIcon: ({ color, size }) => <Ionicons name="sync-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
