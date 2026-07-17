import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVisits } from '../../context/VisitsContext';
import { colors } from '../../theme/colors';

export function AgentHomeScreen() {
  const { visits } = useVisits();
  const pending = visits.filter((v) => !v.synced).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <View style={styles.heroGlow} />
        <View style={styles.heroTextWrap}>
          <View style={styles.heroTagRow}>
            <View style={styles.heroDot} />
            <Text style={styles.heroTag}>OPERACION DE CAMPO</Text>
          </View>
          <Text style={styles.title}>Panel de Salud</Text>
          <Text style={styles.subtitle}>Vigilancia epidemiologica y control de campo</Text>
        </View>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Activo</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.iconBadge, { backgroundColor: colors.successLight }]}>
            <Ionicons name="people" size={20} color={colors.success} />
          </View>
          <Text style={styles.statNumber}>{visits.length}</Text>
          <Text style={styles.statLabel}>Pacientes Registrados</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.iconBadge, pending > 0 ? { backgroundColor: colors.warningLight } : { backgroundColor: colors.successLight }]}>
            <Ionicons
              name={(pending > 0 ? 'cloud-upload-outline' : 'cloud-done-outline') as any}
              size={20}
              color={pending > 0 ? colors.warning : colors.success}
            />
          </View>
          <Text style={[styles.statNumber, pending > 0 && { color: colors.warning }]}>{pending}</Text>
          <Text style={styles.statLabel}>Pendientes de Sincronizar</Text>
        </View>
      </View>

      <View style={styles.offlineBanner}>
        <View style={[styles.offlineIconWrap, { backgroundColor: colors.secondaryLight }]}>
          <Ionicons name="cloud-offline-outline" size={18} color={colors.secondary} />
        </View>
        <View style={styles.offlineTextWrap}>
          <Text style={styles.offlineTitle}>Modo Sin Conexion</Text>
          <Text style={styles.offlineText}>
            Los datos se encriptan y guardan localmente. Sincroniza al volver a tener cobertura.
          </Text>
        </View>
      </View>

      <View style={styles.infoBanner}>
        <View style={[styles.infoIconWrap, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="medkit" size={18} color={colors.primary} />
        </View>
        <View style={styles.infoTextWrap}>
          <Text style={styles.infoTitle}>Registrar visitas</Text>
          <Text style={styles.infoDesc}>
            Usa la pestana "Nueva Visita" en la barra inferior para registrar pacientes.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 14 },
  heroCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.secondaryLight,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    right: -12,
    top: -12,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  heroTextWrap: { flex: 1, gap: 4, zIndex: 1 },
  heroTagRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.secondary },
  heroTag: { fontSize: 10, fontWeight: '700', color: colors.secondary, letterSpacing: 0.8 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.secondaryLight,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  statusText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBadge: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statNumber: { fontSize: 24, fontWeight: '800', color: colors.primary, marginTop: 2 },
  statLabel: { fontSize: 11, fontWeight: '600', color: colors.textSecondary, lineHeight: 15 },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  offlineIconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  offlineTextWrap: { flex: 1, gap: 2 },
  offlineTitle: { fontSize: 13, fontWeight: '700', color: colors.secondary },
  offlineText: { color: colors.textSecondary, fontSize: 12, lineHeight: 17 },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F0FDF9',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  infoIconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  infoTextWrap: { flex: 1, gap: 2 },
  infoTitle: { fontSize: 13, fontWeight: '700', color: colors.primary },
  infoDesc: { color: colors.textSecondary, fontSize: 12, lineHeight: 17 },
});
