import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useVisits } from '../../context/VisitsContext';
import { colors, shadows } from '../../theme/colors';
import type { AgentTabParamList } from '../../navigation/AgentNavigator';
import { Ionicons } from '@expo/vector-icons';

type Nav = BottomTabNavigationProp<AgentTabParamList, 'Home'>;

export function AgentHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { visits } = useVisits();
  const pending = visits.filter((v) => !v.synced).length;
  const synced = visits.filter((v) => v.synced).length;
  const pregnant = visits.filter((v) => v.pregnant).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Header */}
      <View style={styles.heroHeader}>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Panel del Agente</Text>
          <Text style={styles.heroSubtitle}>Registra la salud de tu comunidad</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderLeftColor: colors.primary }]}>
          <Ionicons name="people-outline" size={20} color={colors.primary} />
          <Text style={styles.statNumber}>{visits.length}</Text>
          <Text style={styles.statLabel}>Visitas totales</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: colors.success }]}>
          <Ionicons name="checkmark-circle-outline" size={20} color={colors.success} />
          <Text style={[styles.statNumber, { color: colors.success }]}>{synced}</Text>
          <Text style={styles.statLabel}>Sincronizadas</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: pending > 0 ? colors.warning : colors.success }]}>
          <Ionicons name="sync-outline" size={20} color={pending > 0 ? colors.warning : colors.success} />
          <Text style={[styles.statNumber, { color: pending > 0 ? colors.warning : colors.success }]}>{pending}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
      </View>

      {/* Banners */}
      {pregnant > 0 && (
        <View style={styles.pregnantBanner}>
          <Ionicons name="heart-outline" size={18} color="#BE185D" />
          <Text style={styles.pregnantText}>{pregnant} paciente(s) embarazada(s)</Text>
        </View>
      )}

      <View style={styles.offlineBanner}>
        <Ionicons name="wifi-outline" size={18} color={colors.secondary} />
        <Text style={styles.offlineText}>Modo offline activo · Los datos se sincronizan cuando hay conexión</Text>
      </View>

      {/* Últimas Visitas */}
      {visits.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Últimas visitas</Text>
          {visits.slice(0, 3).map((visit) => (
            <View key={visit.id} style={styles.visitCard}>
              <View style={styles.visitHeader}>
                <View style={styles.visitHeaderLeft}>
                  <View style={styles.avatarWrap}>
                    <Text style={styles.avatarText}>{visit.patientName.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.visitName}>{visit.patientName}</Text>
                    <Text style={styles.visitCommunity}>{visit.community}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, visit.synced ? styles.statusSynced : styles.statusPending]}>
                  <Text style={[styles.statusText, visit.synced ? styles.statusTextSynced : styles.statusTextPending]}>
                    {visit.synced ? 'Sync' : 'Pendiente'}
                  </Text>
                </View>
              </View>

              <View style={styles.vitalsGrid}>
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalIcon}>🌡</Text>
                  <Text style={styles.vitalValue}>{visit.temperature || 'N/A'}°C</Text>
                  <Text style={styles.vitalLabel}>Temp.</Text>
                </View>
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalIcon}>💊</Text>
                  <Text style={styles.vitalValue}>{visit.bloodPressure || 'N/A'}</Text>
                  <Text style={styles.vitalLabel}>PA</Text>
                </View>
                <View style={styles.vitalItem}>
                  <Text style={styles.vitalIcon}>🩸</Text>
                  <Text style={styles.vitalValue}>{visit.glucose || 'N/A'}</Text>
                  <Text style={styles.vitalLabel}>Glucosa</Text>
                </View>
              </View>

              {visit.vaccines && visit.vaccines.length > 0 && (
                <View style={styles.vaccineRow}>
                  <Ionicons name="medkit-outline" size={12} color={colors.textSecondary} />
                  <Text style={styles.vaccineText}>Vacunas: {visit.vaccines.join(', ')}</Text>
                </View>
              )}
              {visit.pregnant && (
                <View style={styles.pregnantRow}>
                  <Ionicons name="heart" size={12} color="#BE185D" />
                  <Text style={styles.pregnantVisitText}>Embarazada - {visit.pregnancyWeeks || '?'} semanas</Text>
                </View>
              )}
            </View>
          ))}
        </>
      )}

      {/* Botón principal */}
      <Pressable
        style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
        onPress={() => navigation.navigate('RegisterVisit')}
      >
        <Ionicons name="add-circle-outline" size={22} color="#fff" />
        <Text style={styles.primaryButtonText}>Registrar nueva visita</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 24 },
  heroHeader: {
    backgroundColor: colors.secondary,
    paddingTop: 60,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroOverlay: { paddingHorizontal: 24, gap: 4 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#fff' },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginTop: -20 },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    borderLeftWidth: 3,
    ...shadows.medium,
  },
  statNumber: { fontSize: 22, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 10, color: colors.textSecondary, textAlign: 'center', fontWeight: '600' },
  pregnantBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FDF2F8',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FBCFE8',
  },
  pregnantText: { color: '#BE185D', fontSize: 13, fontWeight: '600' },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 20,
    marginTop: 12,
  },
  offlineText: { color: colors.secondary, fontSize: 12, fontWeight: '600', flex: 1 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  visitCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    gap: 12,
    ...shadows.medium,
  },
  visitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  visitHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: colors.primary },
  visitName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  visitCommunity: { fontSize: 12, color: colors.textSecondary },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  statusSynced: { backgroundColor: colors.successLight },
  statusPending: { backgroundColor: colors.warningLight },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusTextSynced: { color: colors.success },
  statusTextPending: { color: colors.warning },
  vitalsGrid: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 10,
  },
  vitalItem: { flex: 1, alignItems: 'center', gap: 2 },
  vitalIcon: { fontSize: 16 },
  vitalValue: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  vitalLabel: { fontSize: 9, color: colors.textSecondary, fontWeight: '600' },
  vaccineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    padding: 8,
  },
  vaccineText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  pregnantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FDF2F8',
    borderRadius: 8,
    padding: 8,
  },
  pregnantVisitText: { fontSize: 11, color: '#BE185D', fontWeight: '600' },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 8,
    ...shadows.primary,
  },
  primaryButtonPressed: { transform: [{ scale: 0.98 }] },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
