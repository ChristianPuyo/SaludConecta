import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import MapView, { MapType } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  UCAYALI_CENTER,
  DISTRICTS_GEO,
  DISEASE_DATA,
  DISEASES,
  DISEASE_ICONS,
  VECTOR_FOCI,
  type DiseaseType,
} from '../../data/mapData';
import { MapCacheService, type MapCacheStatus } from '../../services/mapCacheService';
import { colors } from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';
import { RiskBadge } from '../../components/RiskBadge';
import { HeatOverlay } from '../../components/map/HeatOverlay';
import { DistrictMarker } from '../../components/map/DistrictMarker';
import { MapLegend } from '../../components/map/MapLegend';
import { OfflineStatusBanner } from '../../components/map/OfflineStatusBanner';
import { DownloadMapModal } from '../../components/map/DownloadMapModal';

type MapLayer = 'cases' | 'vectors' | 'prediction';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const PANEL_COLLAPSED_HEIGHT = 180;
const PANEL_EXPANDED_HEIGHT = 420;

const WEEKS_LABELS = ['S-5', 'S-4', 'S-3', 'S-2', 'S-1', 'Hoy'];

function getRiskColor(risk: string): string {
  if (risk === 'alto') return colors.danger;
  if (risk === 'medio') return colors.warning;
  return colors.success;
}

function getTrendIcon(trend: string): { name: string; color: string } {
  if (trend === 'up') return { name: 'trending-up', color: colors.danger };
  if (trend === 'down') return { name: 'trending-down', color: colors.success };
  return { name: 'remove', color: colors.textSecondary };
}

// Mini sparkline chart using pure React Native Views
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const barWidth = 28;

  return (
    <View style={sparkStyles.container}>
      {data.map((val, i) => {
        const heightPct = ((val - min) / range) * 100;
        const isLast = i === data.length - 1;
        return (
          <View key={i} style={sparkStyles.barWrapper}>
            <View
              style={[
                sparkStyles.bar,
                {
                  height: Math.max(6, (heightPct / 100) * 52),
                  backgroundColor: isLast ? color : `${color}55`,
                  width: barWidth,
                },
              ]}
            />
            <Text style={sparkStyles.barLabel}>{WEEKS_LABELS[i]}</Text>
          </View>
        );
      })}
    </View>
  );
}

const sparkStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 72,
    paddingTop: 8,
  },
  barWrapper: { alignItems: 'center', gap: 4 },
  bar: { borderRadius: 4, minHeight: 6 },
  barLabel: { fontSize: 9, color: colors.textSecondary, fontWeight: '600' },
});

export function RiskMapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  
  // [i18n & FIX] Refactorización Completa del Mapa
  // 1. Se integró el hook useLanguage para hacer que TODOS los textos del mapa, leyendas
  //    y métricas sean reactivos al cambio de idioma (sin necesidad de recargar).
  // 2. Todos los strings quemados en la UI ahora consumen claves de `t.*`
  const { t } = useLanguage();

  const MAP_LAYERS: { id: MapLayer; label: string; icon: string }[] = [
    { id: 'cases', label: t.map_layer_cases, icon: 'pulse-outline' },
    { id: 'vectors', label: t.map_layer_vectors, icon: 'bug-outline' },
    { id: 'prediction', label: t.map_layer_prediction, icon: 'analytics-outline' },
  ];

  const [selectedDisease, setSelectedDisease] = useState<DiseaseType>('Dengue');
  const [selectedLayer, setSelectedLayer] = useState<MapLayer>('cases');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('calleria');
  const [mapType, setMapType] = useState<MapType>('standard');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<MapCacheStatus>({
    isDownloaded: false,
    downloadedAt: null,
    regionName: 'Coronel Portillo, Ucayali',
    estimatedSizeMB: 42,
    tileCount: 8400,
  });
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  const panelAnim = useRef(new Animated.Value(PANEL_COLLAPSED_HEIGHT)).current;

  // ── Load cache status on mount ──────────────────────────────────────────
  useEffect(() => {
    MapCacheService.getStatus().then(setCacheStatus);
  }, []);

  // ── Animate bottom panel ─────────────────────────────────────────────────
  useEffect(() => {
    Animated.spring(panelAnim, {
      toValue: isPanelExpanded ? PANEL_EXPANDED_HEIGHT : PANEL_COLLAPSED_HEIGHT,
      useNativeDriver: false,
      tension: 60,
      friction: 10,
    }).start();
  }, [isPanelExpanded, panelAnim]);

  // ── Derived data ─────────────────────────────────────────────────────────
  const activeDisease = DISEASE_DATA[selectedDisease];
  const selectedDistrict = DISTRICTS_GEO.find((d) => d.id === selectedDistrictId)!;
  const selectedEpiData = activeDisease[selectedDistrict.name];
  const trendIcon = getTrendIcon(selectedEpiData.trend);
  const riskColor = getRiskColor(selectedEpiData.risk);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleMarkerPress = useCallback(
    (districtId: string) => {
      setSelectedDistrictId(districtId);
      setIsPanelExpanded(true);
      const geo = DISTRICTS_GEO.find((d) => d.id === districtId);
      if (geo && mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: geo.latitude - 0.08,
            longitude: geo.longitude,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          },
          600
        );
      }
    },
    []
  );

  const handleRecenter = () => {
    mapRef.current?.animateToRegion(UCAYALI_CENTER, 700);
    setIsPanelExpanded(false);
  };

  const handleToggleMapType = () => {
    setMapType((prev) => (prev === 'standard' ? 'satellite' : 'standard'));
  };

  const handleCampaign = () => {
    Alert.alert(
      t.alert_campaign_title,
      t.alert_campaign_body(selectedDisease, selectedDistrict.name),
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.yes,
          onPress: () =>
            Alert.alert(
              t.alert_campaign_sent_title,
              t.alert_campaign_sent_body(
                selectedDisease,
                selectedDistrict.name,
                selectedDistrict.population.toLocaleString()
              )
            ),
        },
      ]
    );
  };

  const refreshCacheStatus = async () => {
    const status = await MapCacheService.getStatus();
    setCacheStatus(status);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      {/* ── MAP ── */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={UCAYALI_CENTER}
        mapType={mapType}
        showsUserLocation
        showsCompass={false}
        showsScale
        rotateEnabled={false}
      >
        {/* Heat overlays — only for cases layer */}
        {selectedLayer === 'cases' &&
          DISTRICTS_GEO.map((district) => {
            const epi = activeDisease[district.name];
            return epi ? (
              <HeatOverlay key={district.id} district={district} epiData={epi} />
            ) : null;
          })}

        {/* District markers */}
        {selectedLayer !== 'prediction' &&
          DISTRICTS_GEO.map((district) => {
            const epi = activeDisease[district.name];
            return epi ? (
              <DistrictMarker
                key={district.id}
                district={district}
                epiData={epi}
                isSelected={selectedDistrictId === district.id}
                onPress={() => handleMarkerPress(district.id)}
              />
            ) : null;
          })}

        {/* Vector foci markers — only for vectors layer */}
        {selectedLayer === 'vectors' &&
          VECTOR_FOCI.map((focus) => {
            const focusIcons: Record<string, string> = {
              agua_estancada: '💧',
              basural: '🗑️',
              desague: '🔄',
              rio: '🌊',
            };
            return (
              <DistrictMarker
                key={focus.id}
                district={{
                  id: focus.id,
                  name: focusIcons[focus.type] + ' ' + focus.description.substring(0, 16) + '…',
                  latitude: focus.latitude,
                  longitude: focus.longitude,
                  population: 0,
                  radiusKm: 3,
                }}
                epiData={{
                  cases: 0,
                  risk: 'medio',
                  trend: 'stable',
                  weeklyHistory: [],
                  lastUpdate: focus.reportedAt,
                  description: focus.description,
                }}
                isSelected={false}
                onPress={() => {}}
              />
            );
          })}
      </MapView>

      {/* ── TOP CONTROLS ── */}
      <View style={[styles.topControls, { top: insets.top + 8 }]}>
        {/* Disease filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.diseaseChips}
        >
          {DISEASES.map((disease) => {
            const isActive = selectedDisease === disease;
            return (
              <Pressable
                key={disease}
                onPress={() => setSelectedDisease(disease)}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <Text style={styles.chipIcon}>{DISEASE_ICONS[disease]}</Text>
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {disease}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Offline status banner */}
        <OfflineStatusBanner cacheStatus={cacheStatus} />
      </View>

      {/* ── RIGHT SIDE BUTTONS ── */}
      <View style={[styles.sideButtons, { top: insets.top + 90 }]}>
        <Pressable style={styles.iconBtn} onPress={handleToggleMapType}>
          <Ionicons
            name={mapType === 'standard' ? 'planet-outline' : 'map-outline'}
            size={20}
            color={colors.textPrimary}
          />
        </Pressable>
        <Pressable style={styles.iconBtn} onPress={handleRecenter}>
          <Ionicons name="locate-outline" size={20} color={colors.textPrimary} />
        </Pressable>
        <Pressable
          style={[styles.iconBtn, cacheStatus.isDownloaded && styles.iconBtnActive]}
          onPress={() => setShowDownloadModal(true)}
        >
          <Ionicons
            name={cacheStatus.isDownloaded ? 'cloud-done-outline' : 'cloud-download-outline'}
            size={20}
            color={cacheStatus.isDownloaded ? colors.primary : colors.textPrimary}
          />
        </Pressable>
      </View>

      {/* ── LAYER SELECTOR ── */}
      <View style={styles.layerSelector}>
        {MAP_LAYERS.map((layer) => {
          const isActive = selectedLayer === layer.id;
          return (
            <Pressable
              key={layer.id}
              onPress={() => setSelectedLayer(layer.id)}
              style={[styles.layerBtn, isActive && styles.layerBtnActive]}
            >
              <Ionicons
                name={layer.icon as any}
                size={14}
                color={isActive ? '#fff' : colors.textSecondary}
              />
              <Text style={[styles.layerText, isActive && styles.layerTextActive]}>
                {layer.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* ── MAP LEGEND ── */}
      <MapLegend />

      {/* ── BOTTOM DETAIL PANEL ── */}
      <Animated.View style={[styles.panel, { height: panelAnim }]}>
        {/* Panel handle */}
        <Pressable
          style={styles.panelHandle}
          onPress={() => setIsPanelExpanded((prev) => !prev)}
        >
          <View style={styles.handleBar} />
        </Pressable>

        {/* Panel header */}
        <View style={styles.panelHeader}>
          <View style={styles.panelTitleRow}>
            <Text style={styles.panelTitle}>{selectedDistrict.name}</Text>
            <RiskBadge level={selectedEpiData.risk} />
          </View>
          <Text style={styles.panelSubtitle}>
            {DISEASE_ICONS[selectedDisease]} {selectedDisease} · {t.map_updated(selectedEpiData.lastUpdate)}
          </Text>
        </View>

        {/* Metrics row */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: riskColor }]}>
              {selectedEpiData.cases}
            </Text>
            <Text style={styles.metricLabel}>{t.map_active_cases}</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricCard}>
            <View style={styles.trendRow}>
              <Ionicons name={trendIcon.name as any} size={18} color={trendIcon.color} />
              <Text style={[styles.metricValue, { color: trendIcon.color }]}>
                {selectedEpiData.trend === 'up'
                  ? t.map_trend_up
                  : selectedEpiData.trend === 'down'
                  ? t.map_trend_down
                  : t.map_trend_stable}
              </Text>
            </View>
            <Text style={styles.metricLabel}>{t.map_trend}</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>
              {(selectedDistrict.population / 1000).toFixed(0)}K
            </Text>
            <Text style={styles.metricLabel}>{t.map_population}</Text>
          </View>
        </View>

        {/* Expanded content */}
        {isPanelExpanded && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.expandedContent}
          >
            {/* Description */}
            <View style={styles.descriptionCard}>
              <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.descriptionText}>{selectedEpiData.description}</Text>
            </View>

            {/* Sparkline chart */}
            <View style={styles.chartSection}>
              <Text style={styles.chartTitle}>{t.map_chart_title}</Text>
              <Sparkline data={selectedEpiData.weeklyHistory} color={riskColor} />
              <View style={styles.chartFooter}>
                <Text style={styles.chartFooterText}>
                  {t.map_chart_peak(Math.max(...selectedEpiData.weeklyHistory))}
                </Text>
                <Text style={styles.chartFooterText}>
                  {t.map_chart_min(Math.min(...selectedEpiData.weeklyHistory))}
                </Text>
              </View>
            </View>

            {/* Campaign button */}
            <Pressable style={styles.campaignBtn} onPress={handleCampaign}>
              <Ionicons name="megaphone-outline" size={18} color="#fff" />
              <Text style={styles.campaignBtnText}>{t.map_btn_campaign}</Text>
            </Pressable>
          </ScrollView>
        )}

        {/* Collapsed quick-action */}
        {!isPanelExpanded && (
          <Pressable style={styles.expandHint} onPress={() => setIsPanelExpanded(true)}>
            <Text style={styles.expandHintText}>{t.map_btn_expand}</Text>
            <Ionicons name="chevron-up" size={14} color={colors.primary} />
          </Pressable>
        )}
      </Animated.View>

      {/* ── DOWNLOAD MODAL ── */}
      <DownloadMapModal
        visible={showDownloadModal}
        cacheStatus={cacheStatus}
        onClose={() => setShowDownloadModal(false)}
        onDownloadComplete={refreshCacheStatus}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  // Map
  map: { flex: 1 },

  // Top controls
  topControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 14,
    gap: 8,
  },
  diseaseChips: {
    gap: 7,
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  chipActive: { backgroundColor: colors.primary },
  chipIcon: { fontSize: 14 },
  chipText: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  chipTextActive: { color: '#fff' },

  // Side buttons
  sideButtons: {
    position: 'absolute',
    right: 14,
    gap: 8,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  iconBtnActive: { backgroundColor: '#F0FDF9', borderWidth: 1.5, borderColor: colors.primary },

  // Layer selector
  layerSelector: {
    position: 'absolute',
    bottom: PANEL_COLLAPSED_HEIGHT + 12,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 4,
    gap: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  layerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  layerBtnActive: { backgroundColor: colors.primary },
  layerText: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  layerTextActive: { color: '#fff' },

  // Bottom panel
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 10,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  panelHandle: { alignItems: 'center', paddingVertical: 10 },
  handleBar: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },
  panelHeader: { gap: 4, marginBottom: 12 },
  panelTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  panelTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  panelSubtitle: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },

  // Metrics
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    marginBottom: 4,
  },
  metricCard: { flex: 1, alignItems: 'center', gap: 3 },
  metricValue: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  metricLabel: { fontSize: 10, color: colors.textSecondary, fontWeight: '600', textAlign: 'center' },
  metricDivider: { width: 1, height: 34, backgroundColor: colors.border },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },

  // Expanded content
  expandedContent: { gap: 14, paddingBottom: 16 },
  descriptionCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#F0FDF9',
    borderRadius: 14,
    padding: 12,
    alignItems: 'flex-start',
  },
  descriptionText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  // Chart
  chartSection: { gap: 6 },
  chartTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  chartFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  chartFooterText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },

  // Campaign
  campaignBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  campaignBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Expand hint
  expandHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  expandHintText: { fontSize: 13, color: colors.primary, fontWeight: '700' },
});
