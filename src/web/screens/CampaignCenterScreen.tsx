/**
 * CampaignCenterScreen - Centro de campañas de salud pública con creación, monitoreo y reportes de impacto.
 * Utilizado por administradores para gestionar iniciativas de prevención y promoción sanitaria.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { CampaignService } from '../../services/campaignService';
import type { Campaign } from '../../models/campaign';
import { PageHeader, FilterBar, StatusBadge, ActionBar, EmptyState } from '../components/ReusableComponents';

const STATUSES = [
  { id: 'all', label: 'Todas' },
  { id: 'active', label: 'Activas' },
  { id: 'upcoming', label: 'Próximas' },
  { id: 'completed', label: 'Completadas' },
];

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: '1', title: 'Vacunación contra el Dengue', description: 'Campaña de vacunación masiva en la región Loreto.', objective: 'Vacunar al 80% de la población objetivo.', type: 'vaccination', status: 'active', target: 'general', startDate: '2026-07-01', endDate: '2026-09-30', coverage: 45, participants: 4500, targetParticipants: 10000, createdAt: '2026-06-15', updatedAt: '2026-07-17', createdBy: 'admin', resources: [], metrics: { impressions: 0, reach: 0, engagement: 0, conversions: 0 } },
  { id: '2', title: 'Prevención de Malaria', description: 'Distribución de mosquiteros y repelentes en comunidades amazónicas.', objective: 'Reducir incidencia de malaria en un 30%.', type: 'prevention', status: 'active', target: 'district', targetCriteria: { district: 'Iquitos' }, startDate: '2026-06-15', endDate: '2026-08-15', coverage: 62, participants: 6200, targetParticipants: 10000, createdAt: '2026-06-01', updatedAt: '2026-07-17', createdBy: 'admin', resources: [], metrics: { impressions: 0, reach: 0, engagement: 0, conversions: 0 } },
  { id: '3', title: 'Tamizaje de Diabetes', description: 'Jornadas de detección temprana de diabetes tipo 2.', objective: 'Identificar casos no diagnosticados.', type: 'screening', status: 'draft', target: 'age_group', targetCriteria: { ageGroup: '40-60' }, startDate: '2026-09-01', endDate: '2026-11-30', coverage: 0, participants: 0, targetParticipants: 5000, createdAt: '2026-07-10', updatedAt: '2026-07-17', createdBy: 'admin', resources: [], metrics: { impressions: 0, reach: 0, engagement: 0, conversions: 0 } },
  { id: '4', title: 'Campaña de Salud Escolar', description: 'Revisiones médicas en instituciones educativas.', objective: 'Evaluar salud de 3000 estudiantes.', type: 'screening', status: 'completed', target: 'general', startDate: '2026-03-01', endDate: '2026-05-30', coverage: 95, participants: 2850, targetParticipants: 3000, createdAt: '2026-02-15', updatedAt: '2026-06-01', createdBy: 'admin', resources: [], metrics: { impressions: 0, reach: 0, engagement: 0, conversions: 0 } },
  { id: '5', title: 'Jornada de Desparasitación', description: 'Desparasitación gratuita para niños y adultos.', objective: 'Desparasitar a 8000 personas.', type: 'prevention', status: 'completed', target: 'general', startDate: '2026-04-01', endDate: '2026-06-30', coverage: 88, participants: 7040, targetParticipants: 8000, createdAt: '2026-03-20', updatedAt: '2026-07-01', createdBy: 'admin', resources: [], metrics: { impressions: 0, reach: 0, engagement: 0, conversions: 0 } },
];

const STATUS_CONFIG: Record<string, { label: string; status: 'success' | 'warning' | 'info' | 'neutral' }> = {
  active: { label: 'Activa', status: 'success' },
  upcoming: { label: 'Próxima', status: 'info' },
  completed: { label: 'Completada', status: 'neutral' },
  draft: { label: 'Borrador', status: 'neutral' },
  paused: { label: 'Pausada', status: 'warning' },
  cancelled: { label: 'Cancelada', status: 'warning' },
};

const TYPE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  vaccination: 'medkit', prevention: 'shield', screening: 'search', awareness: 'bulb', education: 'school',
};

export function CampaignCenterScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeStatus, setActiveStatus] = useState('all');

  useEffect(() => {
    CampaignService.getAll().then((data) => {
      setCampaigns(data.length > 0 ? data : MOCK_CAMPAIGNS);
    }).catch(() => setCampaigns(MOCK_CAMPAIGNS));
  }, []);

  const getStatusCategory = (status: string): 'active' | 'upcoming' | 'completed' => {
    if (status === 'draft' || status === 'paused') return 'upcoming';
    if (status === 'completed' || status === 'cancelled') return 'completed';
    return 'active';
  };

  const filtered = campaigns.filter((c) => {
    if (activeStatus === 'all') return true;
    return getStatusCategory(c.status) === activeStatus;
  });

  const getProgress = (c: Campaign): number => {
    if (c.targetParticipants === 0) return 0;
    return Math.min(100, Math.round((c.participants / c.targetParticipants) * 100));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Centro de Campañas'} subtitle={subtitle || 'Gestión de campañas de salud'} />
      <ActionBar actions={[
        { label: 'Nueva Campaña', icon: 'add-circle', onPress: () => {}, primary: true },
        { label: 'Ver Reportes', icon: 'document-text', onPress: () => {} },
      ]} />
      <View style={{ height: 12 }} />
      <FilterBar filters={STATUSES} active={activeStatus} onFilter={setActiveStatus} />
      {filtered.length === 0 ? (
        <EmptyState icon="megaphone-outline" title="Sin campañas" subtitle="No hay campañas para este filtro." />
      ) : (
        <View style={styles.list}>
          {filtered.map((campaign) => {
            const cfg = STATUS_CONFIG[campaign.status] || { label: campaign.status, status: 'neutral' as const };
            const progress = getProgress(campaign);
            return (
              <View key={campaign.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.cardTypeIcon}>
                    <Ionicons name={TYPE_ICONS[campaign.type] || 'megaphone'} size={20} color={colors.primary} />
                  </View>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitle}>{campaign.title}</Text>
                    <Text style={styles.cardDesc} numberOfLines={1}>{campaign.description}</Text>
                  </View>
                  <StatusBadge label={cfg.label} status={cfg.status} />
                </View>
                <View style={styles.progressSection}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{progress}% de cobertura</Text>
                </View>
                <View style={styles.metricsRow}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{campaign.participants}</Text>
                    <Text style={styles.metricLabel}>Participantes</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{campaign.targetParticipants}</Text>
                    <Text style={styles.metricLabel}>Meta</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{campaign.startDate}</Text>
                    <Text style={styles.metricLabel}>Inicio</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricValue}>{campaign.endDate}</Text>
                    <Text style={styles.metricLabel}>Fin</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  list: { gap: 14, marginTop: 12 },
  card: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  cardTop: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  cardTypeIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  cardHeaderText: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  progressSection: { marginBottom: 12 },
  progressBarBg: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  progressBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  progressText: { fontSize: 11, color: colors.textSecondary },
  metricsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metricItem: { minWidth: '22%', flex: 1 },
  metricValue: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  metricLabel: { fontSize: 10, color: colors.textSecondary },
});
