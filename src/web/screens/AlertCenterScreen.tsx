/**
 * AlertCenterScreen - Centro de alertas y notificaciones del sistema con filtros por tipo, prioridad y estado.
 * Permite a los usuarios visualizar, clasificar y dar seguimiento a eventos críticos de salud.
 */
import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { PageHeader, FilterBar, StatusBadge, EmptyState } from '../components/ReusableComponents';
import { useNotifications } from '../../context/NotificationContext';

const FILTERS = [
  { id: 'todas', label: 'Todas' },
  { id: 'no_leidas', label: 'No leídas' },
  { id: 'importantes', label: 'Importantes' },
  { id: 'archivadas', label: 'Archivadas' },
];

const TYPE_COLORS: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
  riesgo_distrito: 'danger',
  alerta_epidemiologica: 'danger',
  campania_medica: 'info',
  vacunacion: 'info',
  medicamento: 'warning',
  recomendacion: 'neutral',
};

const TYPE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  riesgo_distrito: 'warning',
  alerta_epidemiologica: 'shield-outline',
  campania_medica: 'megaphone-outline',
  vacunacion: 'bandage-outline',
  medicamento: 'medkit-outline',
  recomendacion: 'bulb-outline',
};

export function AlertCenterScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [filter, setFilter] = useState('todas');

  const filtered = notifications.filter(n => {
    if (filter === 'todas') return true;
    if (filter === 'no_leidas') return !n.read;
    if (filter === 'importantes') return n.type === 'riesgo_distrito' || n.type === 'alerta_epidemiologica';
    if (filter === 'archivadas') return n.read;
    return true;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Centro de Alertas'} subtitle={subtitle || `${unreadCount} sin leer`} />

      <FilterBar filters={FILTERS} active={filter} onFilter={setFilter} />

      {filtered.length === 0 ? (
        <EmptyState icon="notifications-off-outline" title="Sin alertas" subtitle="No tienes alertas en esta categoría" />
      ) : (
        filtered.map(n => (
          <Pressable key={n.id} style={[styles.alertCard, !n.read && styles.alertUnread]} onPress={() => markAsRead(n.id)}>
            <View style={styles.alertLeft}>
              <View style={styles.alertIconWrap}>
                <Ionicons name={TYPE_ICONS[n.type] || 'notifications-outline'} size={20} color={colors.primary} />
              </View>
              <View style={styles.alertContent}>
                <Text style={[styles.alertTitle, !n.read && styles.alertTitleUnread]}>{n.title}</Text>
                <Text style={styles.alertBody} numberOfLines={2}>{n.body}</Text>
                <Text style={styles.alertDate}>{n.date}</Text>
              </View>
            </View>
            <StatusBadge label={n.type.replace(/_/g, ' ')} status={TYPE_COLORS[n.type] || 'neutral'} />
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  alertUnread: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    backgroundColor: colors.primary + '05',
  },
  alertLeft: { flexDirection: 'row', gap: 12, flex: 1 },
  alertIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContent: { flex: 1, gap: 2 },
  alertTitle: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  alertTitleUnread: { fontWeight: '800' },
  alertBody: { fontSize: 12, color: colors.textSecondary, lineHeight: 16 },
  alertDate: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
});
