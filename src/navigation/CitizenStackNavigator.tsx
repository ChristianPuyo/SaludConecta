import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CitizenNavigator } from './CitizenNavigator';
import { ReportSymptomsScreen } from '../screens/citizen/ReportSymptomsScreen';
import { SaludEscolarScreen } from '../screens/citizen/SaludEscolarScreen';
import { RecursosMedicosScreen } from '../screens/citizen/RecursosMedicosScreen';
import { DirectorioScreen } from '../screens/citizen/DirectorioScreen';
import { SwitchRoleButton } from '../components/SwitchRoleButton';
import { colors } from '../theme/colors';

export type CitizenStackParamList = {
  CitizenTabs: undefined;
  ReportSymptoms: undefined;
  SaludEscolar: undefined;
  RecursosMedicos: undefined;
  Directorio: undefined;
};

const Stack = createNativeStackNavigator<CitizenStackParamList>();

export function CitizenStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        headerTitleStyle: { fontWeight: '700', color: colors.textPrimary },
      }}
    >
      <Stack.Screen
        name="CitizenTabs"
        component={CitizenNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReportSymptoms"
        component={ReportSymptomsScreen}
        options={{
          title: 'Reportar Síntomas',
          headerRight: () => <SwitchRoleButton />,
        }}
      />
      <Stack.Screen
        name="SaludEscolar"
        component={SaludEscolarScreen}
        options={{
          title: 'Salud Escolar',
          headerRight: () => <SwitchRoleButton />,
        }}
      />
      <Stack.Screen
        name="RecursosMedicos"
        component={RecursosMedicosScreen}
        options={{
          title: 'Recursos Médicos',
          headerRight: () => <SwitchRoleButton />,
        }}
      />
      <Stack.Screen
        name="Directorio"
        component={DirectorioScreen}
        options={{
          title: 'Directorio de Contactos',
          headerRight: () => <SwitchRoleButton />,
        }}
      />
    </Stack.Navigator>
  );
}
