/**
 * WebDashboardScreen - Panel principal de la web con resumen de métricas clave, alertas activas y riesgo comunitario.
 * Visible para administradores y gestores de salud pública. Carga indicadores en tiempo real desde la API.
 */
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { RiskBadge, type RiskLevel } from '../../components/RiskBadge';
import { StatCard } from '../../components/StatCard';
import { SectionHeader } from '../../components/SectionHeader';
import { MetricRow, SectionGrid, PageHeader } from '../components/ReusableComponents';
import { ReportService } from '../../services/reportService';
import { MedicationService } from '../../services/medicationService';
import { useProfile } from '../../context/ProfileContext';
import { useNotifications } from '../../context/NotificationContext';
import type { SymptomReport } from '../../models/report';

export function WebDashboardScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [reportCount, setReportCount] = useState(0);
  const [medCount, setMedCount] = useState(0);
  const [lastReport, setLastReport] = useState<SymptomReport | null>(null);
  const { profile } = useProfile();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    (async () => {
      const reports = await ReportService.getAll();
      setReportCount(reports.length);
      setLastReport(reports[0] || null);
      const meds = await MedicationService.getActive();
      setMedCount(meds.length);
    })();
  }, []);

  const quickActions = [
    { icon: 'medkit-outline' as const, label: 'Reportar Síntomas', color: colors.danger },
    { icon: 'document-text-outline' as const, label: 'Historial Médico', color: colors.secondary },
    { icon: 'calendar-outline' as const, label: 'Agendar Cita', color: colors.primary },
    { icon: 'map-outline' as const, label: 'Mapa de Riesgo', color: colors.warning },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Dashboard'} subtitle={subtitle || `Bienvenido, ${profile?.name || 'Usuario'}`} />

      <MetricRow
        metrics={[
          { label: 'Reportes', value: reportCount, color: colors.danger },
          { label: 'Medicamentos', value: medCount, color: colors.secondary },
          { label: 'Notificaciones', value: unreadCount, color: colors.warning },
        ]}
      />

      <SectionHeader title="Riesgo del Distrito" />
      <RiskBadge level={'bajo' as RiskLevel} />

      <SectionHeader title="Acceso Rápido" />
      <SectionGrid>
        {quickActions.map((a, i) => (
          <Pressable key={i} style={[styles.quickCard, { borderLeftColor: a.color }]}>
            <Ionicons name={a.icon} size={28} color={a.color} />
            <Text style={styles.quickLabel}>{a.label}</Text>
          </Pressable>
        ))}
      </SectionGrid>

      {lastReport && (
        <>
          <SectionHeader title="Último Reporte" action={{ label: 'Ver todos', onPress: () => {} }} />
          <View style={styles.lastReport}>
            <Text style={styles.reportDate}>{lastReport.date}</Text>
            <Text style={styles.reportDiagnosis}>{lastReport.diagnosis}</Text>
            <Text style={styles.reportSymptoms}>{lastReport.symptoms?.join(', ')}</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  quickCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    minWidth: 160,
    flex: 1,
    gap: 8,
    alignItems: 'center',
  },
  quickLabel: { fontSize: 12, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },
  lastReport: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  reportDate: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  reportDiagnosis: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  reportSymptoms: { fontSize: 13, color: colors.textSecondary },
});
