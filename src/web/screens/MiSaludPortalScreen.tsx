/**
 * MiSaludPortalScreen - Portal personal del paciente con acceso a su historial clínico, resultados y gestiones activas.
 * Utilizado por pacientes registrados. Muestra citas próximas, documentos recientes y notificaciones.
 */
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { SectionHeader } from '../../components/SectionHeader';
import { StatCard } from '../../components/StatCard';
import { PageHeader, DataCard, SectionGrid } from '../components/ReusableComponents';
import { useProfile } from '../../context/ProfileContext';
import { useHealth } from '../../context/HealthContext';

export function MiSaludPortalScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const { profile } = useProfile();
  const { latest } = useHealth();

  const bmi = profile ? (profile.weight / ((profile.height / 100) * (profile.height / 100))).toFixed(1) : '--';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Mi Salud'} subtitle={subtitle || 'Portal de salud personal'} />

      {profile && (
        <>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={32} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileMeta}>{profile.age} años • Tipo {profile.bloodType}</Text>
              <Text style={styles.profileMeta}>Alergias: {profile.allergies?.join(', ') || 'Ninguna'}</Text>
            </View>
          </View>

          <SectionHeader title="Medidas Corporales" />
          <View style={styles.statsRow}>
            <StatCard value={`${profile.height} cm`} label="Altura" color={colors.primary} />
            <StatCard value={`${profile.weight} kg`} label="Peso" color={colors.secondary} />
            <StatCard value={bmi} label="IMC" color={colors.warning} />
          </View>
        </>
      )}

      {latest && (
        <>
          <SectionHeader title="Métricas Recientes" />
          <SectionGrid>
            {latest.bloodPressureSystolic && (
              <DataCard
                title="Presión Arterial"
                value={`${latest.bloodPressureSystolic}/${latest.bloodPressureDiastolic || '--'}`}
                icon="pulse-outline"
                color={colors.danger}
              />
            )}
            {latest.heartRate && (
              <DataCard title="Frecuencia Cardíaca" value={`${latest.heartRate} lpm`} icon="heart-outline" color={colors.danger} />
            )}
            {latest.glucose && (
              <DataCard title="Glucosa" value={`${latest.glucose} mg/dL`} icon="flask-outline" color={colors.warning} />
            )}
          </SectionGrid>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  profileMeta: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
});
