import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  { id: 'Calleria', name: 'Calleria (Pucallpa)', x: '46%', y: '45%' },
  { id: 'Yarinacocha', name: 'Yarinacocha', x: '58%', y: '25%' },
  { id: 'Manantay', name: 'Manantay', x: '56%', y: '68%' },
  { id: 'Campoverde', name: 'Campoverde', x: '30%', y: '78%' },
  { id: 'Nueva Requena', name: 'N. Requena', x: '22%', y: '20%' },
];

export function RiskMapScreen() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Calleria');
  const selectedData = MOCK_DISTRICT_RISK.find((d) => d.district === selectedDistrict) || MOCK_DISTRICT_RISK[0];

  const RISK_MESSAGE: Record<string, string> = {
    alto: 'Alerta maxima: brote activo. Priorizar fumigacion y distribucion de mosquiteros.',
    medio: 'Vigilancia moderada: incremento paulatino de reportes febriles. Continuar monitoreo.',
    bajo: 'Distrito bajo control. Sin anomalias en los patrones historicos.',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Mapa de Riesgo</Text>
      <Text style={styles.subtitle}>Selecciona un distrito para ver detalles.</Text>

      <View style={styles.mapContainer}>
        <View style={styles.river} />

        {DISTRICT_COORDS.map((coord) => {
          const data = MOCK_DISTRICT_RISK.find((d) => d.district === coord.id) || { risk: 'bajo' };
          const dotColor =
            data.risk === 'alto' ? colors.danger : data.risk === 'medio' ? colors.warning : colors.success;
          const isSelected = selectedDistrict === coord.id;

          return (
            <Pressable
              key={coord.id}
              style={[styles.node, { left: coord.x, top: coord.y }, isSelected && styles.nodeActive]}
              onPress={() => setSelectedDistrict(coord.id)}
            >
              {isSelected && <View style={[styles.pulseCircle, { borderColor: dotColor }]} />}
              <View style={[styles.dot, { backgroundColor: dotColor }, isSelected && styles.dotSelected]} />
              <Text style={[styles.nodeText, isSelected && styles.nodeTextActive]}>{coord.name}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.legendRow}>
        {[
          { color: colors.danger, label: 'Alto' },
          { color: colors.warning, label: 'Medio' },
          { color: colors.success, label: 'Bajo' },
        ].map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.auditCard, { borderLeftColor: RISK_COLOR[selectedData.risk] }]}>
        <View style={styles.auditHeader}>
          <Text style={styles.auditTitle}>{selectedData.district}</Text>
          <RiskBadge level={selectedData.risk} />
        </View>
        <View style={styles.auditCasesRow}>
          <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.auditCases}>{selectedData.cases} casos activos</Text>
        </View>
        <View style={styles.auditStatusRow}>
          <Ionicons
            name={selectedData.risk === 'alto' ? 'alert-circle' : selectedData.risk === 'medio' ? 'warning' : 'checkmark-circle'}
            size={16}
            color={RISK_COLOR[selectedData.risk]}
          />
          <Text style={[styles.auditStatus, { color: colors.textSecondary }]}>
            {RISK_MESSAGE[selectedData.risk]}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const RISK_COLOR: Record<string, string> = {
  alto: colors.danger,
  medio: colors.warning,
  bajo: colors.success,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 2 },
  mapContainer: {
    height: 260,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  river: {
    position: 'absolute',
    left: '42%',
    top: -50,
    width: 28,
    height: 360,
    borderWidth: 3,
    borderColor: '#0284C7',
    borderStyle: 'dashed',
    borderRadius: 140,
    opacity: 0.35,
  },
  node: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -36 }, { translateY: -14 }],
    width: 72,
    gap: 3,
  },
  nodeActive: { zIndex: 10 },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  dotSelected: { width: 14, height: 14, borderRadius: 7 },
  pulseCircle: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  nodeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 4,
  },
  nodeTextActive: { color: '#fff', fontSize: 10 },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  auditCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
  },
  auditHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  auditTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  auditCasesRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  auditCases: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  auditStatusRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: 2 },
  auditStatus: { fontSize: 12, lineHeight: 18, flex: 1 },
});
