import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { ROLE_OPTIONS } from '../types/role';
import { colors } from '../theme/colors';

const logoImage = require('../../assets/fondo pri.jpg');

export function RoleSelectorScreen() {
  const { selectRole } = useRole();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.appName}>Guardian Salud AI</Text>
      <Text style={styles.tagline}>SaludConecta · Vigilancia epidemiológica para la Amazonía</Text>

      <Text style={styles.prompt}>¿Con qué rol vas a ingresar?</Text>

      <View style={styles.optionsList}>
        {ROLE_OPTIONS.map((option) => (
          <Pressable key={option.id} style={styles.card} onPress={() => selectRole(option.id)}>
            <View style={styles.iconWrap}>
              <Ionicons name={option.icon as any} size={26} color={colors.primary} />
            </View>
            <View style={styles.cardTextWrap}>
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardDescription}>{option.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: 'transparent', padding: 24, justifyContent: 'center', gap: 12 },
  logoContainer: { alignItems: 'center', marginBottom: 14 },
  logo: { width: 112, height: 112, borderRadius: 28, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff' },
  appName: { fontSize: 28, fontWeight: '800', color: colors.primaryDark, textAlign: 'center' },
  tagline: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 16 },
  prompt: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  optionsList: { gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0FDFA', alignItems: 'center', justifyContent: 'center' },
  cardTextWrap: { flex: 1, gap: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  cardDescription: { fontSize: 12, color: colors.textSecondary },
});
