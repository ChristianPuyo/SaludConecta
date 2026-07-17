import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../../context/ProfileContext';
import { useNotifications } from '../../context/NotificationContext';
import { ReportService } from '../../services/reportService';
import { MedicationService } from '../../services/medicationService';
import { RiskBadge } from '../../components/RiskBadge';
import { StatCard } from '../../components/StatCard';
import { SectionHeader } from '../../components/SectionHeader';
import { colors } from '../../theme/colors';

export function CitizenHomeScreen() {
  const navigation = useNavigation<any>();
  const { profile, hasProfile } = useProfile();
  const { unreadCount } = useNotifications();
  const [reportCount, setReportCount] = useState(0);
  const [lastReport, setLastReport] = useState<any>(null);
  const [medCount, setMedCount] = useState(0);

  useEffect(() => {
    (async () => {
      const reports = await ReportService.getAll();
      setReportCount(reports.length);
      setLastReport(reports[0] ?? null);
      const meds = await MedicationService.getActive();
      setMedCount(meds.length);
    })();
  }, []);

  const goTo = (screen: string) => navigation.navigate(screen);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.greetingRow}>
        <View>
          <Text style={styles.title}>Hola{profile?.name ? ` ${profile.name.split(' ')[0]}` : ''} 👋</Text>
          <Text style={styles.subtitle}>Guardian Salud AI cuida de tu comunidad</Text>
        </View>
        {!hasProfile && (
          <Pressable style={styles.profilePrompt} onPress={() => goTo('Profile')}>
            <Text style={styles.profilePromptText}>+ Perfil</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.statsRow}>
        <StatCard value={reportCount} label="Mis reportes" />
        <StatCard value={medCount} label="Medicamentos" />
        <StatCard value={unreadCount} label="Notificaciones" color={unreadCount > 0 ? colors.warning : undefined} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Riesgo actual en tu distrito</Text>
        <RiskBadge level="medio" />
        <Text style={styles.cardHint}>Callería · Basado en reportes de los últimos 7 días</Text>
      </View>

      {lastReport && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Tu último reporte</Text>
          <Text style={styles.cardText}>{lastReport.symptoms.join(', ')}</Text>
          <View style={styles.cardRow}>
            <RiskBadge level={lastReport.risk} />
            <Text style={styles.cardDate}>{lastReport.date}</Text>
          </View>
        </View>
      )}

      <SectionHeader title="Acceso rápido" />

      <View style={styles.quickGrid}>
        <QuickAction icon="add-circle" label="Reportar" onPress={() => goTo('ReportSymptoms')} color={colors.primary} />
        <QuickAction icon="document-text" label="Historial" onPress={() => goTo('MedicalHistory')} color={colors.secondary} />
        <QuickAction icon="medkit" label="Medicamentos" onPress={() => goTo('Medications')} color={colors.success} />
        <QuickAction icon="book" label="Educación" onPress={() => goTo('Education')} color={colors.warning} />
        <QuickAction icon="chatbubbles" label="Asistente" onPress={() => goTo('Chat')} color={colors.primary} />
        <QuickAction icon="location" label="Centros" onPress={() => goTo('HealthCenters')} color={colors.danger} />
        <QuickAction icon="pulse" label="Salud" onPress={() => goTo('HealthTracking')} color={colors.secondary} />
        <QuickAction icon="shield-checkmark" label="Vacunas" onPress={() => goTo('Vaccination')} color={colors.success} />
      </View>

      <Pressable style={styles.reportButton} onPress={() => goTo('ReportSymptoms')}>
        <Text style={styles.reportButtonText}>Reportar síntomas</Text>
      </Pressable>
    </ScrollView>
  );
}

function QuickAction({ icon, label, onPress, color }: { icon: string; label: string; onPress: () => void; color: string }) {
  return (
    <Pressable style={styles.quickItem} onPress={onPress}>
      <View style={[styles.quickIcon, { backgroundColor: color + '20' }]}>
        <Text style={{ fontSize: 22 }}>{icon === 'add-circle' ? '➕' : icon === 'document-text' ? '📋' : icon === 'medkit' ? '💊' : icon === 'book' ? '📚' : icon === 'chatbubbles' ? '💬' : icon === 'location' ? '📍' : icon === 'pulse' ? '📊' : '✅'}</Text>
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 14 },
  greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  profilePrompt: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  profilePromptText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: 10 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, gap: 8, borderWidth: 1, borderColor: colors.border },
  cardLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase' },
  cardHint: { fontSize: 12, color: colors.textSecondary },
  cardText: { fontSize: 15, color: colors.textPrimary, fontWeight: '600' },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDate: { fontSize: 12, color: colors.textSecondary },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickItem: { width: '22%', alignItems: 'center', gap: 4, paddingVertical: 8 },
  quickIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 10, color: colors.textPrimary, fontWeight: '600', textAlign: 'center' },
  reportButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  reportButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
