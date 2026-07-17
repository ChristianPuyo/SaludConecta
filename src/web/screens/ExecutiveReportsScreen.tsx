/**
 * ExecutiveReportsScreen - Panel de generación y exportación de reportes ejecutivos de salud.
 * Permite seleccionar entre reportes epidemiológicos, de cobertura, vacunación, recursos o personalizados.
 * Incluye filtro por período y acciones de exportación a PDF, CSV y Excel.
 */
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { PageHeader, FilterBar, DataCard, MetricRow, ActionBar } from '../components/ReusableComponents';

const PERIODS = [
  { id: 'month', label: 'Este Mes' },
  { id: 'quarter', label: 'Trimestre' },
  { id: 'semester', label: 'Semestre' },
  { id: 'year', label: 'Año' },
];

const reportTypes = [
  { id: 'epidemiological', label: 'Epidemiológico', icon: 'pulse' as const, desc: 'Casos, tendencias y distribución' },
  { id: 'coverage', label: 'Cobertura', icon: 'checkmark-circle' as const, desc: 'Vacunación y atenciones' },
  { id: 'vaccination', label: 'Vacunación', icon: 'shield-checkmark' as const, desc: 'Esquema nacional de vacunas' },
  { id: 'resources', label: 'Recursos', icon: 'medkit' as const, desc: 'Inventario y asignación' },
  { id: 'custom', label: 'Personalizado', icon: 'options' as const, desc: 'Selecciona indicadores' },
];

export function ExecutiveReportsScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [period, setPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('epidemiological');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1500));
    setGenerating(false);
    setGenerated(true);
  };

  const handleExport = (format: string) => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
    }, 1000);
  };

  const reports = [
    { label: 'Total Casos', value: '1,247', trend: 'up' as const, color: colors.danger },
    { label: 'Recuperados', value: '892', trend: 'up' as const, color: colors.success },
    { label: 'Activos', value: '328', trend: 'down' as const, color: colors.warning },
    { label: 'Tasa Mortalidad', value: '2.1%', trend: 'down' as const, color: colors.primary },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Reportes Ejecutivos'} subtitle={subtitle || 'Análisis y exportación de datos'} />

      <FilterBar filters={PERIODS} active={period} onFilter={setPeriod} />

      <Text style={styles.sectionTitle}>Tipo de Reporte</Text>
      <View style={styles.reportTypes}>
        {reportTypes.map(r => (
          <Pressable
            key={r.id}
            style={[styles.reportTypeCard, selectedReport === r.id && styles.reportTypeActive]}
            onPress={() => setSelectedReport(r.id)}
          >
            <View style={[styles.reportTypeIcon, { backgroundColor: selectedReport === r.id ? colors.primary + '20' : colors.background }]}>
              <Ionicons name={r.icon} size={22} color={selectedReport === r.id ? colors.primary : colors.textSecondary} />
            </View>
            <Text style={[styles.reportTypeLabel, selectedReport === r.id && { color: colors.primary }]}>{r.label}</Text>
            <Text style={styles.reportTypeDesc}>{r.desc}</Text>
          </Pressable>
        ))}
      </View>

      <MetricRow metrics={reports} />

      <ActionBar
        actions={[
          { label: 'Generar Reporte', icon: 'document-text', onPress: handleGenerate, primary: true },
          { label: 'Exportar PDF', icon: 'document', onPress: () => handleExport('pdf') },
          { label: 'Exportar CSV', icon: 'grid', onPress: () => handleExport('csv') },
          { label: 'Exportar Excel', icon: 'grid-outline', onPress: () => handleExport('excel') },
        ]}
      />

      {generating && (
        <View style={styles.generating}>
          <Ionicons name="hourglass" size={24} color={colors.primary} />
          <Text style={styles.generatingText}>Generando reporte...</Text>
        </View>
      )}

      {generated && !generating && (
        <View style={styles.generated}>
          <Ionicons name="checkmark-circle" size={24} color={colors.success} />
          <Text style={styles.generatedText}>Reporte generado exitosamente</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40, gap: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginTop: 8, marginBottom: 8 },
  reportTypes: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  reportTypeCard: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: colors.border, width: '47%', gap: 4,
  },
  reportTypeActive: { borderColor: colors.primary, backgroundColor: colors.primary + '08' },
  reportTypeIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  reportTypeLabel: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  reportTypeDesc: { fontSize: 11, color: colors.textSecondary },
  generating: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', paddingVertical: 20 },
  generatingText: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  generated: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', paddingVertical: 20 },
  generatedText: { fontSize: 14, color: colors.success, fontWeight: '600' },
});
