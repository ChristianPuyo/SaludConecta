import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../../context/RoleContext';
import { useProfile } from '../../context/ProfileContext';
import { ExportService } from '../../services/exportService';
import { StorageService } from '../../services/storage';
import { colors } from '../../theme/colors';
import { APP_VERSION } from '../../utils/constants';

export function SettingsScreen() {
  const { clearRole } = useRole();
  const { clearProfile } = useProfile();
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const handleClearAllData = () => {
    Alert.alert(
      'Borrar todos los datos',
      'Esta acción eliminará todos tus datos locales: perfil, reportes, medicamentos, vacunas, etc. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar todo',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearAll();
            await clearProfile();
            Alert.alert('Datos eliminados');
          },
        },
      ]
    );
  };

  const handleExportData = async () => {
    const content = await ExportService.exportReportsToText();
    Alert.alert('Exportación lista', `Historial médico exportado (${content.length} caracteres).`);
  };

  const handleChangeRole = () => {
    Alert.alert('Cambiar rol', '¿Estás seguro de cambiar de rol?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cambiar', onPress: () => clearRole() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Configuración</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
            <Text style={styles.settingLabel}>Notificaciones</Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: colors.border, true: colors.primary }} />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name="sync-outline" size={20} color={colors.textPrimary} />
            <Text style={styles.settingLabel}>Sincronización automática</Text>
          </View>
          <Switch value={autoSync} onValueChange={setAutoSync} trackColor={{ false: colors.border, true: colors.primary }} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos</Text>

        <Pressable style={styles.actionRow} onPress={handleExportData}>
          <Ionicons name="download-outline" size={20} color={colors.textPrimary} />
          <Text style={styles.actionLabel}>Exportar historial médico</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </Pressable>

        <Pressable style={styles.actionRow} onPress={handleClearAllData}>
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
          <Text style={[styles.actionLabel, { color: colors.danger }]}>Borrar todos los datos</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>

        <Pressable style={styles.actionRow} onPress={handleChangeRole}>
          <Ionicons name="people-outline" size={20} color={colors.textPrimary} />
          <Text style={styles.actionLabel}>Cambiar rol de usuario</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información</Text>
        <InfoRow label="Versión" value={APP_VERSION} />
        <InfoRow label="Aplicación" value="Guardian Salud AI" />
        <InfoRow label="Propósito" value="Vigilancia epidemiológica para la Amazonía" />
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: 16 },
  section: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  settingLabel: { fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  actionLabel: { flex: 1, fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  infoLabel: { fontSize: 13, color: colors.textSecondary },
  infoValue: { fontSize: 13, color: colors.textPrimary, fontWeight: '600' },
});
