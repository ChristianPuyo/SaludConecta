import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { MOCK_ALERTS, type EpidemicAlert } from '../../data/mockData';
import { RiskBadge, type RiskLevel } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const RISK_COLORS: Record<RiskLevel, string> = {
  bajo: '#16A34A',
  medio: '#D97706',
  alto: '#DC2626',
};

const RISK_BG: Record<RiskLevel, string> = {
  bajo: '#DCFCE733',
  medio: '#FEF3C733',
  alto: '#FEE2E233',
};

const MAP_PADDING = 24;

interface AlertCluster {
  district: string;
  alerts: EpidemicAlert[];
  latitude: number;
  longitude: number;
  totalCases: number;
  highestRisk: RiskLevel;
}

function normalizeCoord(
  lat: number,
  lng: number,
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  width: number,
  height: number,
) {
  const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (width - MAP_PADDING * 2) + MAP_PADDING;
  const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * (height - MAP_PADDING * 2) + MAP_PADDING;
  return { x, y };
}

function getMarkerSize(risk: RiskLevel): number {
  switch (risk) {
    case 'alto': return 56;
    case 'medio': return 44;
    case 'bajo': return 34;
  }
}

export function AlertsScreen() {
  const [selectedCluster, setSelectedCluster] = useState<AlertCluster | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const clusters = useMemo(() => {
    const grouped = new Map<string, EpidemicAlert[]>();
    MOCK_ALERTS.forEach((alert) => {
      const existing = grouped.get(alert.district) || [];
      existing.push(alert);
      grouped.set(alert.district, existing);
    });

    return Array.from(grouped.entries()).map(([district, alerts]): AlertCluster => {
      const firstAlert = alerts[0];
      const riskOrder: Record<RiskLevel, number> = { bajo: 0, medio: 1, alto: 2 };
      const highestRisk = alerts.reduce((max, a) =>
        riskOrder[a.risk] > riskOrder[max.risk] ? a : max
      ).risk;

      const totalCases = alerts.reduce((sum, a) => {
        const match = a.detail.match(/(\d+)\s*reportes/);
        return sum + (match ? parseInt(match[1], 10) : 10);
      }, 0);

      return { district, alerts, latitude: firstAlert.location.latitude, longitude: firstAlert.location.longitude, totalCases, highestRisk };
    });
  }, []);

  const mapWidth = Dimensions.get('window').width - 40;
  const mapHeight = 220;

  const bounds = useMemo(() => {
    const lats = clusters.map((c) => c.latitude);
    const lngs = clusters.map((c) => c.longitude);
    return {
      minLat: Math.min(...lats) - 0.03,
      maxLat: Math.max(...lats) + 0.03,
      minLng: Math.min(...lngs) - 0.03,
      maxLng: Math.max(...lngs) + 0.03,
    };
  }, [clusters]);

  const positioned = useMemo(() => {
    return clusters.map((c) => {
      const pos = normalizeCoord(c.latitude, c.longitude, bounds, mapWidth, mapHeight);
      return { ...c, posX: pos.x, posY: pos.y };
    });
  }, [clusters, bounds, mapWidth, mapHeight]);

  const handleMarkerPress = (cluster: AlertCluster) => {
    setSelectedCluster(cluster);
    setModalVisible(true);
  };

  const getRiskIcon = (risk: RiskLevel): keyof typeof Ionicons.glyphMap => {
    switch (risk) {
      case 'alto': return 'warning';
      case 'medio': return 'alert-circle';
      case 'bajo': return 'information-circle';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Alertas generadas por IA</Text>
          <Text style={styles.subtitle}>Patrones detectados automáticamente a partir de los reportes ciudadanos</Text>
        </View>

        <View style={styles.mapSection}>
          <Text style={styles.mapTitle}>Mapa de calor - Zonas con más alertas</Text>
          <View style={styles.mapOuter}>
            <View style={[styles.mapFrame, { width: mapWidth, height: mapHeight }]}>
              <View style={styles.gridLineH1} />
              <View style={styles.gridLineH2} />
              <View style={styles.gridLineV1} />
              <View style={styles.gridLineV2} />
              <View style={[styles.mapLabel, { top: 6, left: 8 }]}>
                <Text style={styles.mapLabelText}>Callería</Text>
              </View>
              <View style={[styles.mapLabel, { top: 6, right: 8 }]}>
                <Text style={styles.mapLabelText}>Yarinacocha</Text>
              </View>
              <View style={[styles.mapLabel, { bottom: 6, left: 8 }]}>
                <Text style={styles.mapLabelText}>Campoverde</Text>
              </View>
              <View style={[styles.mapLabel, { bottom: 6, right: 8 }]}>
                <Text style={styles.mapLabelText}>Manantay</Text>
              </View>

              {positioned.map((c) => {
                const size = getMarkerSize(c.highestRisk);
                return (
                  <Pressable
                    key={c.district}
                    style={[
                      styles.heatMarker,
                      {
                        left: c.posX - size / 2,
                        top: c.posY - size / 2,
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        backgroundColor: RISK_COLORS[c.highestRisk] + '30',
                        borderColor: RISK_COLORS[c.highestRisk],
                      },
                    ]}
                    onPress={() => handleMarkerPress(c)}
                  >
                    <View style={[styles.heatInner, { backgroundColor: RISK_COLORS[c.highestRisk] }]}>
                      <Text style={styles.heatText}>{c.totalCases}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.legend}>
              <Text style={styles.legendTitle}>Nivel de riesgo</Text>
              <View style={styles.legendItems}>
                {(['alto', 'medio', 'bajo'] as RiskLevel[]).map((risk) => (
                  <View key={risk} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: RISK_COLORS[risk] }]} />
                    <Text style={styles.legendLabel}>{risk.charAt(0).toUpperCase() + risk.slice(1)}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.listTitle}>Todas las alertas</Text>
        {MOCK_ALERTS.map((alert) => (
          <View key={alert.id} style={styles.alertCard}>
            <View style={styles.alertCardHeader}>
              <Text style={styles.alertCardTitle}>{alert.title}</Text>
              <RiskBadge level={alert.risk} />
            </View>
            <Text style={styles.alertCardDate}>{alert.district} · {alert.date}</Text>
            <Text style={styles.alertCardDetail}>{alert.detail}</Text>
            {alert.detectedIssues.length > 0 && (
              <View style={styles.detectedSection}>
                <Text style={styles.detectedTitle}>Lo que detectó la IA:</Text>
                {alert.detectedIssues.map((issue, idx) => (
                  <View key={idx} style={styles.detectedItem}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
                    <Text style={styles.detectedText}>{issue}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {selectedCluster && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderLeft}>
                    <Ionicons name={getRiskIcon(selectedCluster.highestRisk)} size={24} color={RISK_COLORS[selectedCluster.highestRisk]} />
                    <Text style={styles.modalTitle}>{selectedCluster.district}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close-circle" size={28} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.modalStats}>
                  <View style={styles.modalStat}>
                    <Text style={styles.modalStatValue}>{selectedCluster.alerts.length}</Text>
                    <Text style={styles.modalStatLabel}>Alertas</Text>
                  </View>
                  <View style={styles.modalStatDivider} />
                  <View style={styles.modalStat}>
                    <Text style={[styles.modalStatValue, { color: RISK_COLORS[selectedCluster.highestRisk] }]}>{selectedCluster.totalCases}</Text>
                    <Text style={styles.modalStatLabel}>Reportes</Text>
                  </View>
                  <View style={styles.modalStatDivider} />
                  <View style={styles.modalStat}>
                    <RiskBadge level={selectedCluster.highestRisk} />
                    <Text style={styles.modalStatLabel}>Nivel máximo</Text>
                  </View>
                </View>
                <ScrollView style={styles.modalAlertsList} showsVerticalScrollIndicator={false}>
                  {selectedCluster.alerts.map((alert) => (
                    <View key={alert.id} style={styles.modalAlertCard}>
                      <View style={styles.modalAlertHeader}>
                        <Text style={styles.modalAlertTitle}>{alert.title}</Text>
                        <Text style={styles.modalAlertDate}>{alert.date}</Text>
                      </View>
                      <Text style={styles.modalAlertDetail}>{alert.detail}</Text>
                      <View style={styles.modalDetectedSection}>
                        <Text style={styles.modalDetectedTitle}>Síntomas detectados:</Text>
                        {alert.detectedIssues.map((issue, idx) => (
                          <View key={idx} style={styles.modalDetectedItem}>
                            <Ionicons name="medical" size={12} color={colors.primary} />
                            <Text style={styles.modalDetectedText}>{issue}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.modalFooter}>
                  <Text style={styles.modalFooterText}>Análisis generado por IA basado en {selectedCluster.totalCases} reportes ciudadanos</Text>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 16, gap: 4 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary },
  mapSection: { marginBottom: 20 },
  mapTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  mapOuter: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  mapFrame: {
    backgroundColor: '#E8F0FE',
    position: 'relative',
    overflow: 'hidden',
  },
  gridLineH1: { position: 'absolute', top: '33%', left: 0, right: 0, height: 1, backgroundColor: '#CBD5E1', opacity: 0.5 },
  gridLineH2: { position: 'absolute', top: '66%', left: 0, right: 0, height: 1, backgroundColor: '#CBD5E1', opacity: 0.5 },
  gridLineV1: { position: 'absolute', left: '33%', top: 0, bottom: 0, width: 1, backgroundColor: '#CBD5E1', opacity: 0.5 },
  gridLineV2: { position: 'absolute', left: '66%', top: 0, bottom: 0, width: 1, backgroundColor: '#CBD5E1', opacity: 0.5 },
  mapLabel: { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  mapLabelText: { fontSize: 9, fontWeight: '600', color: colors.textSecondary },
  heatMarker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  heatInner: {
    width: 24,
    height: 24,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heatText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  legend: { backgroundColor: colors.surface, padding: 12, borderTopWidth: 1, borderTopColor: colors.border },
  legendTitle: { fontSize: 11, fontWeight: '600', color: colors.textSecondary, marginBottom: 6 },
  legendItems: { flexDirection: 'row', gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 999 },
  legendLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '500' },
  listTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 10 },
  alertCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12, gap: 6 },
  alertCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  alertCardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  alertCardDate: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  alertCardDetail: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  detectedSection: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border, gap: 4 },
  detectedTitle: { fontSize: 12, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  detectedItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detectedText: { fontSize: 12, color: colors.textSecondary, flex: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%', paddingBottom: 32 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  modalStats: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 12 },
  modalStat: { alignItems: 'center', flex: 1, gap: 4 },
  modalStatValue: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  modalStatLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '500' },
  modalStatDivider: { width: 1, height: 32, backgroundColor: colors.border },
  modalAlertsList: { paddingHorizontal: 20, maxHeight: 400 },
  modalAlertCard: { backgroundColor: colors.background, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  modalAlertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  modalAlertTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  modalAlertDate: { fontSize: 11, color: colors.textSecondary },
  modalAlertDetail: { fontSize: 12, color: colors.textSecondary, lineHeight: 17, marginBottom: 8 },
  modalDetectedSection: { gap: 3 },
  modalDetectedTitle: { fontSize: 11, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  modalDetectedItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  modalDetectedText: { fontSize: 11, color: colors.textSecondary, flex: 1 },
  modalFooter: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border, marginTop: 4 },
  modalFooterText: { fontSize: 11, color: colors.textSecondary, textAlign: 'center', fontStyle: 'italic' },
});
