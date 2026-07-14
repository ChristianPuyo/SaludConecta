import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AgentHomeScreen } from '../screens/agent/AgentHomeScreen';
import { RegisterVisitScreen } from '../screens/agent/RegisterVisitScreen';
import { SyncScreen } from '../screens/agent/SyncScreen';
import { RiskMapScreen } from '../screens/authority/RiskMapScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import { AgentTabParamList, AgentStackParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<AgentTabParamList>();
const Stack = createNativeStackNavigator<AgentStackParamList>();

function AgentTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: '800', color: colors.textPrimary },
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
        name="Visitas"
        component={SyncScreen}
        options={{
          title: 'Visitas',
          tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Mapa"
        component={RiskMapScreen}
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export function AgentNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '800', color: colors.textPrimary },
      }}
    >
      <Stack.Screen
        name="AgentTabs"
        component={AgentTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegisterVisit"
        component={RegisterVisitScreen}
        options={{
          title: 'Registrar Visita',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
}


