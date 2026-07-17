/**
 * MedicalAgendaScreen - Agenda médica con calendario de citas, filtros por especialidad y estado, y gestión de turnos.
 * Usada por profesionales y administrativos para organizar la atención diaria.
 */
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { SectionHeader } from '../../components/SectionHeader';
import { PageHeader, FilterBar, ActionBar, StatusBadge, EmptyState } from '../components/ReusableComponents';
import { MedicationService } from '../../services/medicationService';
import type { Medication } from '../../models/medication';

const MOCK_APPOINTMENTS = [
  { id: '1', doctor: 'Dr. García', specialty: 'Medicina General', date: '20 Jul 2026', time: '10:00', status: 'pendiente' as const },
  { id: '2', doctor: 'Dra. Torres', specialty: 'Pediatría', date: '22 Jul 2026', time: '14:30', status: 'pendiente' as const },
  { id: '3', doctor: 'Dr. López', specialty: 'Cardiología', date: '15 Jul 2026', time: '08:00', status: 'completada' as const },
  { id: '4', doctor: 'Dra. Ruiz', specialty: 'Dermatología', date: '10 Jul 2026', time: '11:00', status: 'cancelada' as const },
];

const FILTERS = [
  { id: 'todas', label: 'Todas' },
  { id: 'pendientes', label: 'Pendientes' },
  { id: 'completadas', label: 'Completadas' },
  { id: 'canceladas', label: 'Canceladas' },
];

const STATUS_MAP: Record<string, 'info' | 'success' | 'danger'> = {
  pendiente: 'info',
  completada: 'success',
  cancelada: 'danger',
};

export function MedicalAgendaScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [filter, setFilter] = useState('todas');
  const [meds, setMeds] = React.useState<Medication[]>([]);

  React.useEffect(() => {
    (async () => {
      const m = await MedicationService.getActive();
      setMeds(m);
    })();
  }, []);

  const filtered = MOCK_APPOINTMENTS.filter(a => {
    if (filter === 'todas') return true;
    return a.status === filter;
  });

  const pastVisits = MOCK_APPOINTMENTS.filter(a => a.status === 'completada');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Agenda Médica'} subtitle={subtitle || 'Tus citas y recordatorios'} />

      <FilterBar filters={FILTERS} active={filter} onFilter={setFilter} />

      <SectionHeader title="Próximas Citas" />
      {filtered.length === 0 ? (
        <EmptyState icon="calendar-outline" title="Sin citas" subtitle="No hay citas en esta categoría" />
      ) : (
        filtered.map(a => (
          <View key={a.id} style={styles.appointmentCard}>
            <View style={styles.apptLeft}>
              <View style={styles.apptIcon}>
                <Ionicons name="calendar-clear-outline" size={22} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.apptDoctor}>{a.doctor}</Text>
                <Text style={styles.apptSpecialty}>{a.specialty}</Text>
                <Text style={styles.apptDateTime}>{a.date} • {a.time}</Text>
              </View>
            </View>
            <StatusBadge label={a.status.charAt(0).toUpperCase() + a.status.slice(1)} status={STATUS_MAP[a.status]} />
          </View>
        ))
      )}

      <SectionHeader title="Visitas Pasadas" />
      {pastVisits.length === 0 ? (
        <EmptyState icon="time-outline" title="Sin historial" subtitle="No hay visitas completadas aún" />
      ) : (
        pastVisits.map(a => (
          <View key={a.id} style={styles.pastVisit}>
            <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            <Text style={styles.pastText}>{a.doctor} - {a.specialty}</Text>
            <Text style={styles.pastDate}>{a.date}</Text>
          </View>
        ))
      )}

      {meds.length > 0 && (
        <>
          <SectionHeader title="Recordatorios de Medicamentos" />
          {meds.map(m => (
            <View key={m.id} style={styles.medReminder}>
              <Ionicons name="medkit-outline" size={20} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={styles.medName}>{m.name} {m.dosage}</Text>
                <Text style={styles.medSchedule}>{m.frequency} • {m.schedule?.join(', ')}</Text>
              </View>
            </View>
          ))}
        </>
      )}

      <ActionBar actions={[{ label: 'Nueva Cita', icon: 'add-circle-outline', onPress: () => {}, primary: true }]} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  apptLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  apptIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  apptDoctor: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  apptSpecialty: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  apptDateTime: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  pastVisit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pastText: { flex: 1, fontSize: 13, color: colors.textPrimary },
  pastDate: { fontSize: 12, color: colors.textSecondary },
  medReminder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  medName: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  medSchedule: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
});
