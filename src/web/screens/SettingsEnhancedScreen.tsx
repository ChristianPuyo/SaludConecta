/**
 * SettingsEnhancedScreen - Pantalla de configuración general de la plataforma.
 * Agrupa secciones de perfil, notificaciones, seguridad, preferencias de idioma, gestión de datos y acerca de.
 * Permite al usuario personalizar su experiencia y administrar su cuenta.
 */
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { PageHeader, SectionGrid, EmptyState } from '../components/ReusableComponents';
import { useProfile } from '../../context/ProfileContext';

export function SettingsEnhancedScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const { profile } = useProfile();
  const [notifyReports, setNotifyReports] = useState(true);
  const [notifyAlerts, setNotifyAlerts] = useState(true);
  const [notifyCampaigns, setNotifyCampaigns] = useState(false);
  const [language, setLanguage] = useState('Español');

  const SettingRow = ({ icon, label, value, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string; onPress: () => void }) => (
    <Pressable style={styles.settingRow} onPress={onPress}>
      <Ionicons name={icon} size={20} color={colors.textSecondary} />
      <Text style={styles.settingLabel}>{label}</Text>
      {value && <Text style={styles.settingValue}>{value}</Text>}
      <Ionicons name="chevron-forward" size={16} color={colors.border} />
    </Pressable>
  );

  const ToggleRow = ({ icon, label, value, onToggle }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: boolean; onToggle: (v: boolean) => void }) => (
    <View style={styles.settingRow}>
      <Ionicons name={icon} size={20} color={colors.textSecondary} />
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch value={value} onValueChange={onToggle} trackColor={{ true: colors.primary + '50', false: colors.border }} thumbColor={value ? colors.primary : '#f4f3f4'} />
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Configuración'} subtitle={subtitle || 'Preferencias de la plataforma'} />

      <SectionGrid title="Perfil">
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{profile?.name || 'Usuario'}</Text>
            <Text style={styles.profileEmail}>{profile?.community || 'usuario@saludconecta.pe'}</Text>
          </View>
          <Pressable style={styles.editBtn}>
            <Ionicons name="create-outline" size={18} color={colors.primary} />
          </Pressable>
        </View>
        <SettingRow icon="call-outline" label="Teléfono" value={profile?.emergencyContact?.phone || 'Agregar'} onPress={() => {}} />
        <SettingRow icon="location-outline" label="Dirección" value={profile?.district || 'Agregar'} onPress={() => {}} />
        <SettingRow icon="medkit-outline" label="Tipo de Sangre" value={profile?.bloodType || 'Agregar'} onPress={() => {}} />
      </SectionGrid>

      <SectionGrid title="Notificaciones">
        <ToggleRow icon="warning-outline" label="Alertas de salud" value={notifyAlerts} onToggle={setNotifyAlerts} />
        <ToggleRow icon="document-text-outline" label="Reportes" value={notifyReports} onToggle={setNotifyReports} />
        <ToggleRow icon="megaphone-outline" label="Campañas" value={notifyCampaigns} onToggle={setNotifyCampaigns} />
      </SectionGrid>

      <SectionGrid title="Seguridad">
        <SettingRow icon="lock-closed-outline" label="Cambiar contraseña" onPress={() => {}} />
        <SettingRow icon="shield-checkmark-outline" label="Verificación en dos pasos" value="Desactivado" onPress={() => {}} />
        <SettingRow icon="finger-print-outline" label="Biometría" value="Activado" onPress={() => {}} />
      </SectionGrid>

      <SectionGrid title="Preferencias">
        <SettingRow icon="globe-outline" label="Idioma" value={language} onPress={() => setLanguage(language === 'Español' ? 'English' : 'Español')} />
        <SettingRow icon="moon-outline" label="Tema oscuro" value="No disponible" onPress={() => {}} />
        <SettingRow icon="cellular-outline" label="Modo sin conexión" value="Desactivado" onPress={() => {}} />
      </SectionGrid>

      <SectionGrid title="Datos">
        <SettingRow icon="download-outline" label="Exportar mis datos" onPress={() => {}} />
        <SettingRow icon="cloud-upload-outline" label="Sincronizar ahora" onPress={() => {}} />
        <Pressable style={[styles.settingRow, { borderColor: colors.danger + '30' }]} onPress={() => {}}>
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
          <Text style={[styles.settingLabel, { color: colors.danger }]}>Eliminar cuenta</Text>
        </Pressable>
      </SectionGrid>

      <SectionGrid title="Acerca de">
        <SettingRow icon="information-circle-outline" label="Versión" value="1.0.0" onPress={() => {}} />
        <SettingRow icon="document-text-outline" label="Términos y condiciones" onPress={() => {}} />
        <SettingRow icon="shield-outline" label="Privacidad" onPress={() => {}} />
      </SectionGrid>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: colors.border, marginBottom: 8,
  },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  profileName: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  profileEmail: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  editBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary + '10', alignItems: 'center', justifyContent: 'center' },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14,
    paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  settingLabel: { flex: 1, fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
  settingValue: { fontSize: 13, color: colors.textSecondary },
});
