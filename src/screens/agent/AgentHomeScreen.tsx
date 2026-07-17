import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useVisits } from '../../context/VisitsContext';
import { ReportService } from '../../services/reportService';
import { StatCard } from '../../components/StatCard';
import { SectionHeader } from '../../components/SectionHeader';
import { colors } from '../../theme/colors';
import type { AgentTabParamList } from '../../navigation/AgentNavigator';

type Nav = BottomTabNavigationProp<AgentTabParamList, 'Home'>;

export function AgentHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { visits } = useVisits();
  const [communityReportsCount, setCommunityReportsCount] = useState(0);

  useEffect(() => {
    (async () => {
      const reports = await ReportService.getAll();
      setCommunityReportsCount(reports.length);
    })();
  }, []);

  const pendingSync = visits.filter((v) => !v.synced).length;
  const highRiskPatients = visits.filter((v) => {
    const bp = parseInt(v.bloodPressure?.split('/')[0] || '0', 10);
    const temp = parseFloat(v.temperature || '0');
    return bp > 140 || temp > 38;
  }).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Panel del Agente</Text>
      <Text style={styles.subtitle}>Registra la salud de tu comunidad, con o sin Internet</Text>

      <View style={styles.statsRow}>
        <StatCard value={visits.length} label="Visitas" />
        <StatCard value={pendingSync} label="Pendientes sync" color={pendingSync > 0 ? colors.warning : undefined} />
        <StatCard value={highRiskPatients} label="Alto riesgo" color={highRiskPatients > 0 ? colors.danger : undefined} />
      </View>

      <View style={styles.offlineBanner}>
        <Text style={styles.offlineText}>📡 Modo offline activo: los datos se guardan en tu dispositivo</Text>
      </View>

      <SectionHeader title="Acceso rápido" />

      <View style={styles.quickGrid}>
        <QuickAction icon="medkit" label="Nueva Visita" onPress={() => navigation.navigate('RegisterVisit')} color={colors.primary} />
        <QuickAction icon="sync" label="Sincronizar" onPress={() => navigation.navigate('Sync')} color={colors.secondary} />
      </View>

      {visits.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Últimas visitas</Text>
          {visits.slice(0, 3).map((v) => (
            <View key={v.id} style={styles.visitCard}>
              <View style={styles.visitInfo}>
                <Text style={styles.visitName}>{v.patientName}</Text>
                <Text style={styles.visitCommunity}>{v.community}</Text>
              </View>
              <View style={[styles.syncDot, { backgroundColor: v.synced ? colors.success : colors.warning }]} />
            </View>
          ))}
        </View>
      )}

      <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('RegisterVisit')}>
        <Text style={styles.primaryButtonText}>Registrar nueva visita</Text>
      </Pressable>
    </ScrollView>
  );
}

function QuickAction({ icon, label, onPress, color }: { icon: string; label: string; onPress: () => void; color: string }) {
  return (
    <Pressable style={[styles.quickCard, { borderColor: color + '40' }]} onPress={onPress}>
      <Text style={styles.quickIcon}>{icon === 'medkit' ? '💉' : '🔄'}</Text>
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary },
  statsRow: { flexDirection: 'row', gap: 10 },
  offlineBanner: { backgroundColor: '#EFF6FF', borderRadius: 12, padding: 12 },
  offlineText: { color: colors.secondary, fontSize: 13, fontWeight: '600' },
  quickGrid: { flexDirection: 'row', gap: 12 },
  quickCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 20, alignItems: 'center', gap: 8, borderWidth: 1 },
  quickIcon: { fontSize: 32 },
  quickLabel: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  section: { gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  visitCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border },
  visitInfo: { gap: 2 },
  visitName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  visitCommunity: { fontSize: 12, color: colors.textSecondary },
  syncDot: { width: 10, height: 10, borderRadius: 5 },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
