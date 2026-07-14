import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable, Alert } from 'react-native';
import type { DistrictRisk } from '../../data/mockData';
import { RiskBadge, type RiskLevel } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

type DiseaseType = 'Dengue' | 'Malaria' | 'Leptospirosis' | 'EDA' | 'IRA';

const DISEASES: DiseaseType[] = ['Dengue', 'Malaria', 'Leptospirosis', 'EDA', 'IRA'];

// Simulated data adjustment factors based on disease type
const DISEASE_DATA: Record<DiseaseType, Record<string, { cases: number; risk: RiskLevel }>> = {
  Dengue: {
    'Callería': { cases: 42, risk: 'alto' },
    'Yarinacocha': { cases: 21, risk: 'medio' },
    'Manantay': { cases: 18, risk: 'medio' },
    'Campoverde': { cases: 5, risk: 'bajo' },
    'Nueva Requena': { cases: 2, risk: 'bajo' },
  },
  Malaria: {
    'Callería': { cases: 15, risk: 'medio' },
    'Yarinacocha': { cases: 35, risk: 'alto' },
    'Manantay': { cases: 9, risk: 'bajo' },
    'Campoverde': { cases: 18, risk: 'medio' },
    'Nueva Requena': { cases: 27, risk: 'alto' },
  },
  Leptospirosis: {
    'Callería': { cases: 8, risk: 'bajo' },
    'Yarinacocha': { cases: 6, risk: 'bajo' },
    'Manantay': { cases: 29, risk: 'alto' },
    'Campoverde': { cases: 12, risk: 'medio' },
    'Nueva Requena': { cases: 4, risk: 'bajo' },
  },
  EDA: {
    'Callería': { cases: 38, risk: 'alto' },
    'Yarinacocha': { cases: 22, risk: 'medio' },
    'Manantay': { cases: 31, risk: 'alto' },
    'Campoverde': { cases: 14, risk: 'medio' },
    'Nueva Requena': { cases: 8, risk: 'bajo' },
  },
  IRA: {
    'Callería': { cases: 45, risk: 'alto' },
    'Yarinacocha': { cases: 48, risk: 'alto' },
    'Manantay': { cases: 26, risk: 'medio' },
    'Campoverde': { cases: 19, risk: 'medio' },
    'Nueva Requena': { cases: 11, risk: 'bajo' },
  },
};

// Spatial positions of hotspots for the mock map of Ucayali
const DISTRICT_POSITIONS: Record<string, { top: any; left: any }> = {
  'Callería': { top: '48%', left: '52%' },
  'Yarinacocha': { top: '30%', left: '42%' },
  'Manantay': { top: '65%', left: '60%' },
  'Campoverde': { top: '55%', left: '25%' },
  'Nueva Requena': { top: '22%', left: '15%' },
};

export function RiskMapScreen() {
  const [selectedDisease, setSelectedDisease] = useState<DiseaseType>('Dengue');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Callería');
  const [loading, setLoading] = useState(false);

  const activeData = DISEASE_DATA[selectedDisease];
  const activeDistrictInfo = activeData[selectedDistrict];

  const handleLaunchCampaign = () => {
    Alert.alert(
      'Campañas Inteligentes con IA',
      `¿Deseas enviar una campaña educativa preventiva sobre ${selectedDisease} dirigida a todos los ciudadanos y agentes comunitarios del distrito de ${selectedDistrict}?\n\nLa IA adaptará el mensaje en base a la sintomatología actual registrada en la zona.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, Enviar Alerta', 
          onPress: () => {
            Alert.alert(
              'Alerta Enviada',
              `Campaña preventiva de ${selectedDisease} iniciada con IA para ${selectedDistrict}. Se ha enviado una notificación de alerta a 3,420 dispositivos móviles en la zona.`
            );
          }
        }
      ]
    );
  };

  const getRiskColor = (level: RiskLevel) => {
    if (level === 'alto') return colors.danger;
    if (level === 'medio') return colors.warning;
    return colors.success;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Mapas Inteligentes</Text>
      <Text style={styles.subtitle}>
        Vigilancia geoespacial de Ucayali. Selecciona una enfermedad y haz clic en los hotspots para analizar y actuar.
      </Text>

      {/* Disease selector chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.diseaseFilterScroll} contentContainerStyle={styles.diseaseFilterContainer}>
        {DISEASES.map((disease) => {
          const isActive = selectedDisease === disease;
          return (
            <Pressable
              key={disease}
              onPress={() => setSelectedDisease(disease)}
              style={[styles.diseaseChip, isActive && styles.diseaseChipActive]}
            >
              <Text style={[styles.diseaseChipText, isActive && styles.diseaseChipTextActive]}>
                {disease}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Interactive Mock Map Component */}
      <View style={styles.mapContainer}>
        <Text style={styles.mapWatermark}>UCAYALI · GEO-SATELITAL</Text>
        
        {/* Render simulated river line */}
        <View style={styles.riverLine1} />
        <View style={styles.riverLine2} />
        
        {/* Render Hotspot markers */}
        {Object.entries(activeData).map(([distName, info]) => {
          const isHighlighted = selectedDistrict === distName;
          const pos = DISTRICT_POSITIONS[distName];
          const dotColor = getRiskColor(info.risk);
          
          return (
            <Pressable
              key={distName}
              style={[
                styles.hotspotTouch,
                { top: pos.top, left: pos.left }
              ]}
              onPress={() => setSelectedDistrict(distName)}
            >
              <View style={[
                styles.hotspotPulse,
                { backgroundColor: dotColor, borderColor: dotColor },
                isHighlighted && styles.hotspotPulseActive
              ]} />
              <View style={[styles.hotspotCore, { backgroundColor: dotColor }]} />
              <Text style={[styles.hotspotLabel, isHighlighted && styles.hotspotLabelActive]}>
                {distName}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Selected District Control Card */}
      <View style={styles.actionCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>{selectedDistrict}</Text>
            <Text style={styles.cardSubtitle}>
              Monitoreo activo para: <Text style={{fontWeight: '700'}}>{selectedDisease}</Text>
            </Text>
          </View>
          <RiskBadge level={activeDistrictInfo.risk} />
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricNumber}>{activeDistrictInfo.cases}</Text>
            <Text style={styles.metricLabel}>Casos Activos</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricItem}>
            <Text style={[styles.metricNumber, { color: getRiskColor(activeDistrictInfo.risk) }]}>
              {activeDistrictInfo.risk.toUpperCase()}
            </Text>
            <Text style={styles.metricLabel}>Nivel de Alerta</Text>
          </View>
        </View>

        <Pressable style={styles.campaignButton} onPress={handleLaunchCampaign}>
          <Ionicons name="megaphone-outline" size={18} color="#fff" />
          <Text style={styles.campaignButtonText}>Enviar Campaña Preventiva IA</Text>
        </Pressable>
      </View>

      {/* District List Card */}
      <Text style={styles.sectionLabel}>Resumen General ({selectedDisease})</Text>
      <View style={styles.listCard}>
        {Object.entries(activeData).map(([distName, info]) => {
          const isSelected = selectedDistrict === distName;
          return (
            <Pressable
              key={distName}
              onPress={() => setSelectedDistrict(distName)}
              style={[styles.districtListItem, isSelected && styles.districtListItemSelected]}
            >
              <View style={styles.listItemLeft}>
                <Ionicons 
                  name="pin-outline" 
                  size={18} 
                  color={isSelected ? colors.primary : colors.textSecondary} 
                />
                <Text style={[styles.listItemName, isSelected && styles.listItemNameSelected]}>
                  {distName}
                </Text>
              </View>
              <View style={styles.listItemRight}>
                <Text style={styles.listItemCases}>{info.cases} casos</Text>
                <RiskBadge level={info.risk} />
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 14 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: 4, lineHeight: 18 },
  
  // Disease filters
  diseaseFilterScroll: { marginHorizontal: -20, marginBottom: 2 },
  diseaseFilterContainer: { paddingHorizontal: 20, gap: 8, flexDirection: 'row' },
  diseaseChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  diseaseChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  diseaseChipText: { color: colors.textSecondary, fontWeight: '600', fontSize: 13 },
  diseaseChipTextActive: { color: '#fff' },

  // Visual Map styles
  mapContainer: {
    height: 220,
    backgroundColor: '#0F172A', // Slate 900 for dark satellite feel
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 4,
  },
  mapWatermark: {
    position: 'absolute',
    top: 14,
    left: 14,
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 2,
  },
  riverLine1: {
    position: 'absolute',
    width: '120%',
    height: 4,
    backgroundColor: '#1E293B',
    transform: [{ rotate: '-25deg' }],
    top: '40%',
    opacity: 0.7,
  },
  riverLine2: {
    position: 'absolute',
    width: '120%',
    height: 3,
    backgroundColor: '#0EA5E9', // Glowing blue river representation
    transform: [{ rotate: '-22deg' }],
    top: '39%',
    opacity: 0.4,
  },

  // Map Hotspots
  hotspotTouch: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -30 }, { translateY: -30 }], // Center offset
    width: 60,
    height: 60,
  },
  hotspotCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  hotspotPulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.3,
  },
  hotspotPulseActive: {
    width: 36,
    height: 36,
    borderRadius: 18,
    opacity: 0.5,
    borderWidth: 1,
  },
  hotspotLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 4,
  },
  hotspotLabelActive: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },

  // Action card
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  cardSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  
  metricsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  metricItem: { flex: 1, alignItems: 'center', gap: 2 },
  metricNumber: { fontSize: 22, fontWeight: '800', color: colors.primary },
  metricLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  metricDivider: { width: 1, height: 35, backgroundColor: colors.border },

  campaignButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  campaignButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // List card
  sectionLabel: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginTop: 4 },
  listCard: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  districtListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  districtListItemSelected: {
    backgroundColor: '#F8FAFC',
  },
  listItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  listItemName: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  listItemNameSelected: { color: colors.primary, fontWeight: '700' },
  listItemRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  listItemCases: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
});
