/**
 * SimulationLabScreen - Laboratorio de simulación para modelado predictivo de escenarios de salud pública.
 * Permite ejecutar simulaciones de brotes, intervenciones y asignación de recursos con parámetros configurables.
 * Muestra resultados como infectados, recuperados, tasa de reproducción (R₀) y proyecciones temporales.
 */
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { PageHeader, StatusBadge, DataCard, ActionBar } from '../components/ReusableComponents';
import type { SimulationScenario, SimulationResults } from '../../models/simulation';

const mockScenarios: SimulationScenario[] = [
  {
    id: 's1', name: 'Brote de Dengue', description: 'Simular la propagación del dengue en Callería',
    type: 'outbreak', status: 'completed',
    parameters: { populationSize: 50000, infectionRate: 0.3, recoveryRate: 0.7, mortalityRate: 0.01, vaccinationRate: 0.4, containmentMeasures: [], timeHorizon: 90 },
    createdAt: '2026-06-01', updatedAt: '2026-06-15', createdBy: 'admin',
  },
  {
    id: 's2', name: 'Campaña de Vacunación', description: 'Evaluar el impacto de una campaña masiva de vacunación',
    type: 'intervention', status: 'draft',
    parameters: { populationSize: 100000, infectionRate: 0.2, recoveryRate: 0.8, mortalityRate: 0.005, vaccinationRate: 0.7, containmentMeasures: ['vacunación_masiva'], timeHorizon: 180 },
    createdAt: '2026-07-01', updatedAt: '2026-07-10', createdBy: 'admin',
  },
  {
    id: 's3', name: 'Asignación de Recursos', description: 'Optimizar la distribución de recursos médicos',
    type: 'resource', status: 'running',
    parameters: { populationSize: 75000, infectionRate: 0.25, recoveryRate: 0.75, mortalityRate: 0.008, vaccinationRate: 0.5, containmentMeasures: ['aislamiento', 'distanciamiento'], timeHorizon: 120 },
    createdAt: '2026-07-05', updatedAt: '2026-07-16', createdBy: 'admin',
  },
];

const mockResults: Record<string, SimulationResults> = {
  s1: {
    totalInfected: 12500, totalRecovered: 8750, totalDeaths: 125,
    peakInfectionDate: '2026-07-15', peakInfectionCount: 3200, durationDays: 75,
    r0: 2.4, herdImmunityThreshold: 58, dailyProjection: [],
  },
};

export function SimulationLabScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [scenarios] = useState(mockScenarios);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, SimulationResults>>(mockResults);

  const handleRun = async (id: string) => {
    setRunningId(id);
    await new Promise(r => setTimeout(r, 3000));
    setResults(prev => ({
      ...prev,
      [id]: {
        totalInfected: Math.floor(Math.random() * 20000) + 5000,
        totalRecovered: Math.floor(Math.random() * 15000) + 3000,
        totalDeaths: Math.floor(Math.random() * 200) + 20,
        peakInfectionDate: new Date(Date.now() + Math.random() * 30 * 86400000).toISOString().split('T')[0],
        peakInfectionCount: Math.floor(Math.random() * 5000) + 500,
        durationDays: Math.floor(Math.random() * 90) + 30,
        r0: Math.round((Math.random() * 3 + 1) * 10) / 10,
        herdImmunityThreshold: Math.floor(Math.random() * 40) + 40,
        dailyProjection: [],
      },
    }));
    setRunningId(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Laboratorio de Simulación'} subtitle={subtitle || 'Modelado predictivo de escenarios de salud'} />

      {scenarios.map(s => {
        const res = results[s.id];
        const isRunning = runningId === s.id;
        return (
          <View key={s.id} style={styles.scenarioCard}>
            <View style={styles.scenarioHeader}>
              <View>
                <Text style={styles.scenarioName}>{s.name}</Text>
                <Text style={styles.scenarioDesc}>{s.description}</Text>
              </View>
              <StatusBadge
                label={s.status === 'completed' ? 'Completado' : s.status === 'running' ? 'Ejecutando' : 'Borrador'}
                status={s.status === 'completed' ? 'success' : s.status === 'running' ? 'info' : 'neutral'}
              />
            </View>

            <View style={styles.paramsGrid}>
              <DataCard title="Población" value={s.parameters.populationSize.toLocaleString()} icon="people" color={colors.primary} />
              <DataCard title="Tasa Infección" value={`${(s.parameters.infectionRate * 100).toFixed(0)}%`} icon="trending-up" color={colors.danger} />
              <DataCard title="Tasa Vacunación" value={`${(s.parameters.vaccinationRate * 100).toFixed(0)}%`} icon="shield-checkmark" color={colors.success} />
              <DataCard title="Días" value={s.parameters.timeHorizon} icon="calendar" color={colors.secondary} />
            </View>

            {res && (
              <View style={styles.resultsSection}>
                <Text style={styles.resultsTitle}>Resultados</Text>
                <View style={styles.resultsGrid}>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultValue}>{res.totalInfected.toLocaleString()}</Text>
                    <Text style={styles.resultLabel}>Infectados</Text>
                  </View>
                  <View style={styles.resultItem}>
                    <Text style={[styles.resultValue, { color: colors.success }]}>{res.totalRecovered.toLocaleString()}</Text>
                    <Text style={styles.resultLabel}>Recuperados</Text>
                  </View>
                  <View style={styles.resultItem}>
                    <Text style={[styles.resultValue, { color: colors.danger }]}>{res.totalDeaths}</Text>
                    <Text style={styles.resultLabel}>Fallecidos</Text>
                  </View>
                  <View style={styles.resultItem}>
                    <Text style={[styles.resultValue, { color: colors.warning }]}>R₀={res.r0}</Text>
                    <Text style={styles.resultLabel}>Reproducción</Text>
                  </View>
                </View>
                <View style={styles.resultDetails}>
                  <Text style={styles.detailText}>Pico de infección: {res.peakInfectionDate} ({res.peakInfectionCount.toLocaleString()} casos)</Text>
                  <Text style={styles.detailText}>Duración: {res.durationDays} días</Text>
                  <Text style={styles.detailText}>Umbral inmunidad rebaño: {res.herdImmunityThreshold}%</Text>
                </View>
              </View>
            )}

            <ActionBar
              actions={[
                { label: isRunning ? 'Ejecutando...' : 'Ejecutar Simulación', icon: isRunning ? 'hourglass' : 'play', onPress: () => handleRun(s.id), primary: true },
                { label: 'Editar Parámetros', icon: 'settings', onPress: () => {} },
              ]}
            />
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40, gap: 16 },
  scenarioCard: {
    backgroundColor: colors.surface, borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: colors.border, gap: 16,
  },
  scenarioHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  scenarioName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  scenarioDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 2, maxWidth: '80%' },
  paramsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  resultsSection: { backgroundColor: colors.background, borderRadius: 14, padding: 16, gap: 12 },
  resultsTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, textTransform: 'uppercase' },
  resultsGrid: { flexDirection: 'row', gap: 8 },
  resultItem: {
    backgroundColor: colors.surface, borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: colors.border, flex: 1, alignItems: 'center', gap: 2,
  },
  resultValue: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  resultLabel: { fontSize: 10, color: colors.textSecondary, fontWeight: '600' },
  resultDetails: { gap: 4 },
  detailText: { fontSize: 12, color: colors.textSecondary },
});
