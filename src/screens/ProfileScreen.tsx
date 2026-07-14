import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { colors } from '../theme/colors';
import { SafeScreen } from '../components/SafeScreen';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export function ProfileScreen() {
  const { role, clearRole } = useRole();

  const getRoleDetails = () => {
    switch (role) {
      case 'citizen':
        return {
          title: 'Ciudadano',
          icon: 'person-outline',
          description: 'Acceso para reporte de síntomas y alertas comunitarias.',
          color: colors.primary,
        };
      case 'agent':
        return {
          title: 'Agente Comunitario',
          icon: 'medkit-outline',
          description: 'Acceso para registro de visitas de salud y sincronización offline.',
          color: colors.secondary,
        };
      case 'authority':
        return {
          title: 'Autoridad / Analista',
          icon: 'bar-chart-outline',
          description: 'Acceso a tableros de control, mapas de riesgo y analítica predictiva.',
          color: colors.danger,
        };
      default:
        return {
          title: 'Usuario',
          icon: 'help-circle-outline',
          description: 'Rol no especificado.',
          color: colors.textSecondary,
        };
    }
  };

  const details = getRoleDetails();

  return (
    <SafeScreen scrollable contentContainerStyle={styles.content}>
      <Text style={styles.title}>Mi Perfil</Text>

      {/* Tarjeta de Información de Usuario */}
      <Card style={styles.profileCard}>
        <View style={[styles.avatar, { backgroundColor: details.color + '15' }]}>
          <Ionicons name={details.icon as any} size={40} color={details.color} />
        </View>
        <Text style={styles.roleTitle}>{details.title}</Text>
        <Text style={styles.roleDesc}>{details.description}</Text>
      </Card>

      {/* Tarjeta de Información de la Aplicación */}
      <Card style={styles.infoCard}>
        <Text style={styles.sectionHeader}>Información de SaludConecta</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Versión</Text>
          <Text style={styles.infoValue}>1.0.0 (Expo SDK 54)</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Región de Cobertura</Text>
          <Text style={styles.infoValue}>Ucayali, Amazonía Peruana</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Sistema IA</Text>
          <Text style={styles.infoValue}>Guardian Salud AI v1.0</Text>
        </View>
      </Card>

      {/* Tarjeta de Ajustes */}
      <Card style={styles.actionsCard}>
        <Text style={styles.sectionHeader}>Acciones de Cuenta</Text>
        <Text style={styles.warningText}>
          Si deseas cambiar a otro perfil de usuario para realizar tareas de análisis o de registro de visitas, puedes cerrar tu sesión actual.
        </Text>
        <Button
          title="Cambiar de Rol / Salir"
          onPress={clearRole}
          variant="outline"
          icon="log-out-outline"
          style={styles.logoutButton}
          textStyle={{ color: colors.danger }}
        />
      </Card>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  profileCard: { alignItems: 'center', padding: 24, gap: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  roleTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  roleDesc: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },
  infoCard: { gap: 12 },
  sectionHeader: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 8 },
  infoLabel: { fontSize: 13, color: colors.textSecondary },
  infoValue: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  actionsCard: { gap: 12 },
  warningText: { fontSize: 12, color: colors.textSecondary, lineHeight: 16 },
  logoutButton: { borderColor: colors.danger, borderStyle: 'solid' },
});
