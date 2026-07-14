import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useVisits } from '../../context/VisitsContext';
import { colors } from '../../theme/colors';
import type { AgentTabParamList } from '../../navigation/AgentNavigator';

type Nav = BottomTabNavigationProp<AgentTabParamList, 'Home'>;

export function AgentHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { visits } = useVisits();
  const pending = visits.filter((v) => !v.synced).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.heroTextWrap}>
          <View style={styles.heroTagRow}>
            <View style={styles.heroDot} />
            <Text style={styles.heroTag}>Operación de campo</Text>
          </View>
          <Text style={styles.title}>Panel de Salud</Text>
          <Text style={styles.subtitle}>Vigilancia epidemiológica y control de campo · Ucayali</Text>
        </View>
        <View style={styles.statusPill}>
          <Ionicons name={"flash" as any} size={14} color={colors.primary} />
          <Text style={styles.statusText}>Activo</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.iconBadge, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name={"people" as any} size={20} color={colors.success} />
          </View>
          <Text style={styles.statNumber}>{visits.length}</Text>
          <Text style={styles.statLabel}>Pacientes Registrados</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.iconBadge, pending > 0 ? { backgroundColor: '#FEF3C7' } : { backgroundColor: '#F0FDF4' }]}>
            <Ionicons
              name={(pending > 0 ? 'cloud-upload-outline' : 'cloud-done-outline') as any}
              size={20}
              color={pending > 0 ? colors.warning : colors.success}
            />
          </View>
          <Text style={[styles.statNumber, pending > 0 && { color: colors.warning }]}>{pending}</Text>
          <Text style={styles.statLabel}>Pendientes de Envío</Text>
        </View>
      </View>

      <View style={styles.offlineBanner}>
        <View style={styles.offlineIconWrap}>
          <Ionicons name={"wifi-off" as any} size={20} color={colors.secondary} />
        </View>
        <View style={styles.offlineTextWrap}>
          <Text style={styles.offlineTitle}>Modo Sin Conexión Activo</Text>
          <Text style={styles.offlineText}>
            Toda la información médica se encripta y guarda localmente en el dispositivo. Sincroniza al volver a tener cobertura.
          </Text>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
        onPress={() => navigation.navigate('RegisterVisit')}
      >
        <View style={styles.actionIconWrap}>
          <Ionicons name={"add-circle" as any} size={24} color="#fff" />
        </View>
        <Text style={styles.actionButtonText}>Registrar Visita Médica</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 18 },
  heroCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  heroTextWrap: { flex: 1, gap: 6 },
  heroTagRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.secondary },
  heroTag: { fontSize: 11, fontWeight: '700', color: colors.secondary, textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  statusText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  statsRow: { flexDirection: 'row', gap: 14 },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  iconBadge: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  statNumber: { fontSize: 26, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, lineHeight: 16 },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  offlineIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineTextWrap: { flex: 1, gap: 2 },
  offlineTitle: { fontSize: 14, fontWeight: '700', color: colors.secondary },
  offlineText: { color: colors.textSecondary, fontSize: 12, lineHeight: 18 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    borderRadius: 22,
    paddingVertical: 18,
    marginTop: 8,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  actionButtonPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  actionIconWrap: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  actionButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
