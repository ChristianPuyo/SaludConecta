import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useReports } from '../../context/ReportsContext';
import { RiskBadge } from '../../components/RiskBadge';
import { colors, shadows } from '../../theme/colors';

export function RiskMapScreen() {
  const { districtRisks } = useReports();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Mapa de Riesgo</Text>
        <Text style={styles.subtitle}>
          Monitoreo geoespacial de brotes infecciosos y alertas por distritos.
        </Text>
      </View>

      <View style={styles.mapCanvas}>
        <Ionicons name="map-sharp" size={100} color={colors.primary} style={styles.mapCanvasIcon} />
        <View style={styles.radarPulse} />
        <View style={styles.radarRing1} />
        <View style={styles.radarRing2} />
        <View style={styles.radarLabelWrap}>
          <View style={styles.radarDot} />
          <Text style={styles.radarLabel}>Simulación GPS Activa</Text>
        </View>
        <Text style={styles.mapCanvasTitle}>Ucayali Satelital v2.4</Text>
        <Text style={styles.mapCanvasSubtitle}>Radar de vectores de dengue y malaria</Text>
      </View>

      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Escala de Alerta:</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors.danger }]} />
            <Text style={styles.legendText}>Alto</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors.warning }]} />
            <Text style={styles.legendText}>Medio</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors.success }]} />
            <Text style={styles.legendText}>Bajo</Text>
          </View>
        </View>
      </View>

      <View style={styles.districtsGrid}>
        {districtRisks.map((district) => (
          <View key={district.district} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardNameWrap}>
                <Ionicons name="location-sharp" size={16} color={colors.textSecondary} />
                <Text style={styles.cardTitle}>{district.district}</Text>
              </View>
              <RiskBadge level={district.risk} />
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.cardSubtitle}>{district.cases} casos reportados activos</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  header: { gap: 4 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: colors.textSecondary },
  mapCanvas: {
    height: 180,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 4,
    ...shadows.md,
  },
  mapCanvasIcon: { opacity: 0.12, position: 'absolute', transform: [{ scale: 1.5 }] },
  radarPulse: { position: 'absolute', width: 240, height: 240, borderRadius: 120, borderWidth: 1, borderColor: 'rgba(20, 184, 166, 0.05)', backgroundColor: 'rgba(20, 184, 166, 0.01)' },
  radarRing1: { position: 'absolute', width: 130, height: 130, borderRadius: 65, borderWidth: 1.5, borderColor: 'rgba(20, 184, 166, 0.1)' },
  radarRing2: { position: 'absolute', width: 60, height: 60, borderRadius: 30, borderWidth: 1.5, borderColor: 'rgba(20, 184, 166, 0.15)' },
  radarLabelWrap: { flexDirection: 'row', alignItems: 'center', gap: 6, position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(30, 41, 59, 0.7)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  radarDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  radarLabel: { fontSize: 10, fontWeight: '800', color: '#F8FAFC', textTransform: 'uppercase', letterSpacing: 0.5 },
  mapCanvasTitle: { fontSize: 17, fontWeight: '900', color: '#F8FAFC', zIndex: 1, letterSpacing: -0.2 },
  mapCanvasSubtitle: { fontSize: 11, fontWeight: '700', color: '#64748B', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.8, zIndex: 1 },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.sm,
  },
  legendTitle: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  legendRow: { flexDirection: 'row', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  districtsGrid: { gap: 12 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 12,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNameWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1.5,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  cardSubtitle: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
});
