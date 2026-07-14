import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MOCK_DISTRICT_RISK } from '../../data/mockData';
import { RiskBadge } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';

interface DistrictCoord {
  id: string;
  name: string;
  x: any;
  y: any;
}

const DISTRICT_COORDS: DistrictCoord[] = [
  { id: 'Callería', name: 'Callería (Pucallpa)', x: '46%', y: '45%' },
  { id: 'Yarinacocha', name: 'Yarinacocha', x: '58%', y: '25%' },
  { id: 'Manantay', name: 'Manantay', x: '56%', y: '68%' },
  { id: 'Campoverde', name: 'Campoverde', x: '30%', y: '78%' },
  { id: 'Nueva Requena', name: 'Nueva Requena', x: '22%', y: '20%' },
];

export function RiskMapScreen() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Callería');

  const selectedData = MOCK_DISTRICT_RISK.find((d) => d.district === selectedDistrict) || MOCK_DISTRICT_RISK[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Mapa de Riesgo Ucayali</Text>
      <Text style={styles.subtitle}>
        Visualización geográfica interactiva para la Amazonía. Presiona un distrito para auditar.
      </Text>

      {/* Map Board */}
      <View style={styles.mapContainer}>
        {/* Simulated River Ucayali flowing through */}
        <View style={styles.river} />

        {DISTRICT_COORDS.map((coord) => {
          const data = MOCK_DISTRICT_RISK.find((d) => d.district === coord.id) || { risk: 'bajo' };
          const dotColor =
            data.risk === 'alto'
              ? colors.danger
              : data.risk === 'medio'
              ? colors.warning
              : colors.success;

          const isSelected = selectedDistrict === coord.id;

          return (
            <Pressable
              key={coord.id}
              style={[
                styles.node,
                { left: coord.x, top: coord.y },
                isSelected && styles.nodeActive,
              ]}
              onPress={() => setSelectedDistrict(coord.id)}
            >
              <View style={[styles.pulseCircle, isSelected && { borderColor: dotColor }]} />
              <View style={[styles.dot, { backgroundColor: dotColor }]} />
              <Text style={[styles.nodeText, isSelected && styles.nodeTextActive]}>
                {coord.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
          <Text style={styles.legendText}>Alto riesgo</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
          <Text style={styles.legendText}>Medio riesgo</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>Bajo riesgo</Text>
        </View>
      </View>

      {/* Audited District Detail Card */}
      <View style={styles.auditCard}>
        <View style={styles.auditHeader}>
          <Text style={styles.auditTitle}>{selectedData.district}</Text>
          <RiskBadge level={selectedData.risk} />
        </View>
        <Text style={styles.auditCases}>{selectedData.cases} casos epidemiológicos activos</Text>
        <Text style={styles.auditStatus}>
          {selectedData.risk === 'alto'
            ? '⚠️ Alerta máxima: brote activo detectado. Priorizar fumigación y distribución de mosquiteros.'
            : selectedData.risk === 'medio'
            ? '⚠️ Vigilancia moderada: incremento paulatino de reportes febriles. Continuar monitoreo.'
            : '✓ Distrito bajo control. Sin anomalías en los patrones históricos.'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 14 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 4, lineHeight: 18 },
  mapContainer: {
    height: 280,
    backgroundColor: '#0F172A', // Dark mode map display for maximum aesthetic wow factor
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  river: {
    position: 'absolute',
    left: '42%',
    top: -50,
    width: 32,
    height: 380,
    borderWidth: 4,
    borderColor: '#0284C7',
    borderStyle: 'dashed',
    borderRadius: 160,
    opacity: 0.4,
  },
  node: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -40 }, { translateY: -15 }],
    width: 80,
    gap: 4,
  },
  nodeActive: {
    zIndex: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
  },
  pulseCircle: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  nodeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 4,
  },
  nodeTextActive: {
    color: '#fff',
    fontSize: 10,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  auditCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  auditHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  auditTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  auditCases: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  auditStatus: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginTop: 4 },
});
