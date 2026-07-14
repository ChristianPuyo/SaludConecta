import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { ROLE_OPTIONS } from '../types/role';
import { colors } from '../theme/colors';
import { SafeScreen } from '../components/SafeScreen';
import { Card } from '../components/Card';

export function RoleSelectorScreen() {
  const { selectRole } = useRole();

  return (
    <SafeScreen scrollable contentContainerStyle={styles.container}>
      <Text style={styles.appName}>Guardian Salud AI</Text>
      <Text style={styles.tagline}>SaludConecta · Vigilancia epidemiológica para la Amazonía</Text>

      <Text style={styles.prompt}>¿Con qué rol vas a ingresar?</Text>

      <View style={styles.optionsList}>
        {ROLE_OPTIONS.map((option) => (
          <Card
            key={option.id}
            onPress={() => selectRole(option.id)}
            style={styles.card}
            bordered
          >
            <View style={styles.iconWrap}>
              <Ionicons name={option.icon as any} size={26} color={colors.primary} />
            </View>
            <View style={styles.cardTextWrap}>
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardDescription}>{option.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Card>
        ))}
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: 'center',
    gap: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
    marginTop: 20,
  },
  tagline: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  prompt: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  optionsList: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextWrap: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

