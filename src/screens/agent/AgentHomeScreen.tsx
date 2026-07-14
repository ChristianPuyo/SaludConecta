import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useVisits } from '../../context/VisitsContext';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import type { AgentTabParamList } from '../../navigation/AgentNavigator';

type Nav = BottomTabNavigationProp<AgentTabParamList, 'Home'>;

const AGENT_TASKS = [
  { id: 't1', desc: 'Control vectorial en estanque comunitario (Sector San José)', done: false },
  { id: 't2', desc: 'Ficha familiar en comunidad nativa Callería', done: true },
  { id: 't3', desc: 'Distribución de mosquiteros y repelente local', done: false },
];

export function AgentHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { visits } = useVisits();
  const pending = visits.filter((v) => !v.synced).length;
  
  // Extract critical patients (pregnant or high fever)
  const criticalPatients = visits.filter(
    v => v.isPregnant || (v.temperature && parseFloat(v.temperature) >= 38.0)
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Panel del Agente</Text>
      <Text style={styles.subtitle}>Vigilancia epidemiológica comunitaria y visitas de campo</Text>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Ionicons name="people-outline" size={24} color={colors.primary} />
          <Text style={styles.statNumber}>{visits.length}</Text>
          <Text style={styles.statLabel}>Pacientes visitados</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons 
            name="cloud-upload-outline" 
            size={24} 
            color={pending > 0 ? colors.warning : colors.success} 
          />
          <Text style={[styles.statNumber, pending > 0 && { color: colors.warning }]}>
            {pending}
          </Text>
          <Text style={styles.statLabel}>Visitas offline por subir</Text>
        </View>
      </View>

      {/* Connection Indicator Banner */}
      <View style={styles.offlineBanner}>
        <Ionicons name="radio-outline" size={20} color={colors.secondary} />
        <Text style={styles.offlineText}>
          Modo Offline-First activo. Registra visitas sin cobertura y sincronízalas en el centro médico.
        </Text>
      </View>

      {/* Critical Monitoring Group */}
      <Text style={styles.sectionLabel}>⚠️ Pacientes en Seguimiento Crítico ({criticalPatients.length})</Text>
      {criticalPatients.length > 0 ? (
        <View style={styles.criticalCard}>
          {criticalPatients.slice(0, 3).map((pat) => (
            <View key={pat.id} style={styles.criticalRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.criticalName}>{pat.patientName}</Text>
                <Text style={styles.criticalCommunity}>📍 {pat.community}</Text>
              </View>
              <View style={styles.criticalBadgeRow}>
                {pat.isPregnant && (
                  <View style={[styles.badge, { backgroundColor: '#FEE2E2' }]}>
                    <Text style={[styles.badgeText, { color: colors.danger }]}>Gestante</Text>
                  </View>
                )}
                {pat.temperature && parseFloat(pat.temperature) >= 38.0 && (
                  <View style={[styles.badge, { backgroundColor: '#FEF3C7' }]}>
                    <Text style={[styles.badgeText, { color: colors.warning }]}>{pat.temperature}°C</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No hay alertas de gestantes ni fiebre alta registradas localmente.</Text>
        </View>
      )}

      {/* Community Tasks */}
      <Text style={styles.sectionLabel}>📋 Tareas Pendientes en Comunidad</Text>
      <View style={styles.tasksCard}>
        {AGENT_TASKS.map((task) => (
          <View key={task.id} style={styles.taskRow}>
            <Ionicons 
              name={task.done ? "checkmark-circle" : "ellipse-outline"} 
              size={20} 
              color={task.done ? colors.success : colors.textSecondary} 
            />
            <Text style={[styles.taskText, task.done && styles.taskTextDone]}>
              {task.desc}
            </Text>
          </View>
        ))}
      </View>

      {/* Main CTA */}
      <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('RegisterVisit')}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.primaryButtonText}>Registrar Visita Médica</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { 
    flex: 1, 
    backgroundColor: colors.surface, 
    borderRadius: 20, 
    padding: 16, 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: colors.border,
    gap: 4,
    elevation: 1,
  },
  statNumber: { fontSize: 26, fontWeight: '800', color: colors.primary, marginTop: 4 },
  statLabel: { fontSize: 11, color: colors.textSecondary, textAlign: 'center', fontWeight: '500' },
  offlineBanner: { 
    flexDirection: 'row', 
    backgroundColor: '#EFF6FF', 
    borderRadius: 16, 
    padding: 14, 
    gap: 10, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  offlineText: { color: colors.secondary, fontSize: 12, fontWeight: '600', flex: 1, lineHeight: 16 },
  
  sectionLabel: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, marginTop: 4 },
  
  // Critical
  criticalCard: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  criticalRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.border 
  },
  criticalName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  criticalCommunity: { fontSize: 12, color: colors.textSecondary },
  criticalBadgeRow: { flexDirection: 'row', gap: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  emptyCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  emptyText: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },

  // Tasks
  tasksCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 12 },
  taskRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  taskText: { fontSize: 13, color: colors.textSecondary, flex: 1 },
  taskTextDone: { textDecorationLine: 'line-through', color: '#94A3B8' },

  primaryButton: { 
    backgroundColor: colors.primary, 
    borderRadius: 14, 
    paddingVertical: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    flexDirection: 'row', 
    gap: 8,
    marginTop: 8 
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
