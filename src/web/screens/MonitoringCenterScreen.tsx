/**
 * MonitoringCenterScreen - Centro de monitoreo en tiempo real con indicadores de ocupación hospitalaria, recursos disponibles y alertas.
 * Muestra el estado de hospitales por distrito, métricas de reportes recientes y alertas activas de alto riesgo.
 * Orientada a administradores y personal de emergencia para la gestión de capacidad hospitalaria.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { PageHeader, MetricRow, DataCard, StatusBadge, FilterBar } from '../components/ReusableComponents';
import { ReportService } from '../../services/reportService';

const REGIONS = [
  { id: 'all', label: 'Todas' },
  { id: 'Callería', label: 'Callería' },
  { id: 'Yarinacocha', label: 'Yarinacocha' },
  { id: 'Manantay', label: 'Manantay' },
];

const hospitals = [
  { id: 'h1', name: 'Hospital Regional', occupancy: 78, capacity: 200, district: 'Callería' },
  { id: 'h2', name: 'Centro de Salud Yarinacocha', occupancy: 45, capacity: 80, district: 'Yarinacocha' },
  { id: 'h3', name: 'Posta Médica Manantay', occupancy: 22, capacity: 40, district: 'Manantay' },
];

export function MonitoringCenterScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [reports, setReports] = useState<any[]>([]);
  const [region, setRegion] = useState('all');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    ReportService.getAll().then(setReports).catch(() => {});
    const interval = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const now = Date.now();
  const last24h = reports.filter(r => r.timestamp >= now - 86400000);
  const last7d = reports.filter(r => r.timestamp >= now - 7 * 86400000);

  const filteredHospitals = region === 'all' ? hospitals : hospitals.filter(h => h.district === region);

  const alertCount = last7d.filter(r => r.risk === 'alto').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Centro de Monitoreo'} subtitle={subtitle || `Actualizado: ${time.toLocaleTimeString('es')}`} />

      <FilterBar filters={REGIONS} active={region} onFilter={setRegion} />

      <MetricRow
        metrics={[
          { label: 'Últimas 24h', value: last24h.length, color: colors.primary },
          { label: 'Últimos 7 días', value: last7d.length, color: colors.secondary },
          { label: 'Alertas activas', value: alertCount, color: colors.danger },
          { label: 'Hospitales', value: filteredHospitals.length, color: colors.warning },
        ]}
      />

      <Text style={styles.sectionTitle}>Ocupación Hospitalaria</Text>
      {filteredHospitals.map(h => {
        const pct = Math.round((h.occupancy / h.capacity) * 100);
        return (
          <View key={h.id} style={styles.hospitalCard}>
            <View style={styles.hospitalHeader}>
              <Text style={styles.hospitalName}>{h.name}</Text>
              <StatusBadge
                label={pct > 80 ? 'Crítico' : pct > 60 ? 'Alerta' : 'Normal'}
                status={pct > 80 ? 'danger' : pct > 60 ? 'warning' : 'success'}
              />
            </View>
            <View style={styles.occupancyRow}>
              <View style={styles.occBar}>
                <View style={[styles.occFill, { width: `${pct}%`, backgroundColor: pct > 80 ? colors.danger : pct > 60 ? colors.warning : colors.success }]} />
              </View>
              <Text style={styles.occText}>{h.occupancy}/{h.capacity}</Text>
            </View>
          </View>
        );
      })}

      <Text style={styles.sectionTitle}>Recursos Disponibles</Text>
      <View style={styles.resourceGrid}>
        <DataCard title="Ambulancias" value="12" subtitle="6 en ruta" icon="car" color={colors.primary} />
        <DataCard title="Médicos" value="48" subtitle="disponibles" icon="medkit" color={colors.secondary} />
        <DataCard title="Camas UCI" value="24" subtitle="8 libres" icon="bed" color={colors.warning} />
        <DataCard title="Vacunas" value="1,240" subtitle="en stock" icon="shield-checkmark" color={colors.success} />
      </View>

      <Text style={styles.sectionTitle}>Alertas Recientes</Text>
      {last7d.filter(r => r.risk === 'alto').slice(0, 5).map((a, i) => (
        <View key={i} style={styles.alertRow}>
          <StatusBadge label="Alto" status="danger" />
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>{a.diagnosis || 'Alerta de riesgo'}</Text>
            <Text style={styles.alertMeta}>{a.date} • {a.district || 'Sin distrito'}</Text>
          </View>
        </View>
      ))}
      {alertCount === 0 && (
        <Text style={styles.emptyText}>Sin alertas activas en este momento</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: 24, marginBottom: 12 },
  hospitalCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  hospitalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  hospitalName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  occupancyRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  occBar: { flex: 1, height: 10, backgroundColor: colors.border, borderRadius: 5, overflow: 'hidden' },
  occFill: { height: '100%', borderRadius: 5 },
  occText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, width: 60, textAlign: 'right' },
  resourceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 6 },
  alertTitle: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  alertMeta: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  emptyText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', paddingVertical: 20 },
});
