import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

function MapMarker({ color, style }: { color: string; style?: object }) {
  return (
    <View style={[styles.marker, style]}>
      <View style={[styles.markerDot, { backgroundColor: color }]} />
      <View style={[styles.markerRing, { borderColor: color }]} />
    </View>
  );
}

function TopoLine({ style }: { style?: object }) {
  return <View style={[styles.topoLine, style]} />;
}

function InfoCard({ title, value, subtitle }: { title: string; value?: string; subtitle: string }) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoCardTitle}>{title}</Text>
      {value && <Text style={styles.infoCardValue}>{value}</Text>}
      <Text style={styles.infoCardSubtitle}>{subtitle}</Text>
    </View>
  );
}

export function UcayaliMap() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const mapSize = isMobile ? 260 : 220;

  return (
    <View style={[styles.container, isMobile && styles.containerMobile]}>
      {/* Map illustration */}
      <View style={[styles.mapFrame, { width: mapSize, height: mapSize }]}>
        {/* Background terrain */}
        <View style={styles.terrainBg} />

        {/* Topographic lines */}
        <TopoLine style={[styles.topo1]} />
        <TopoLine style={[styles.topo2]} />
        <TopoLine style={[styles.topo3]} />
        <TopoLine style={[styles.topo4]} />

        {/* River shape */}
        <View style={styles.river} />
        <View style={styles.riverBranch} />

        {/* Territory outline */}
        <View style={styles.territoryOutline} />

        {/* Connection dots */}
        <View style={[styles.connDot, { top: '25%', left: '30%' }]} />
        <View style={[styles.connDot, { top: '45%', left: '55%' }]} />
        <View style={[styles.connDot, { top: '65%', left: '40%' }]} />
        <View style={[styles.connDot, { top: '35%', left: '70%' }]} />

        {/* Connection lines */}
        <View style={[styles.connLine, { top: '28%', left: '33%', width: 40, transform: [{ rotate: '25deg' }] }]} />
        <View style={[styles.connLine, { top: '48%', left: '50%', width: 35, transform: [{ rotate: '-15deg' }] }]} />

        {/* Markers */}
        <MapMarker color={colors.primary} style={{ top: '20%', left: '25%' }} />
        <MapMarker color={colors.blue} style={{ top: '40%', left: '50%' }} />
        <MapMarker color={colors.purple} style={{ top: '60%', left: '35%' }} />
        <MapMarker color={colors.warning} style={{ top: '35%', left: '65%' }} />

        {/* Label */}
        <View style={styles.mapLabel}>
          <Text style={styles.mapLabelText}>UCAYALI</Text>
        </View>
      </View>

      {/* Info cards */}
      <View style={[styles.infoCards, isMobile && styles.infoCardsMobile]}>
        <InfoCard title="Amazonía Peruana" subtitle="Región Ucayali" />
        <InfoCard title="Cobertura activa" value="98%" subtitle="de distritos monitoreados" />
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>Nivel de riesgo</Text>
          <View style={styles.riskRow}>
            <View style={styles.riskItem}>
              <View style={[styles.riskDot, { backgroundColor: '#16A34A' }]} />
              <Text style={styles.riskLabel}>Bajo</Text>
            </View>
            <View style={styles.riskItem}>
              <View style={[styles.riskDot, { backgroundColor: colors.warning }]} />
              <Text style={styles.riskLabel}>Moderado</Text>
            </View>
            <View style={styles.riskItem}>
              <View style={[styles.riskDot, { backgroundColor: colors.danger }]} />
              <Text style={styles.riskLabel}>Alto</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  containerMobile: {
    width: '100%',
  },
  mapFrame: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#E8F5F0',
    overflow: 'hidden',
    position: 'relative',
  },
  terrainBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E8F5F0',
  },
  topo1: {
    position: 'absolute',
    top: '15%',
    left: '10%',
    width: '80%',
    height: 1,
    backgroundColor: 'rgba(21, 150, 111, 0.12)',
    borderRadius: 1,
    transform: [{ rotate: '-5deg' }],
  },
  topo2: {
    position: 'absolute',
    top: '35%',
    left: '5%',
    width: '90%',
    height: 1,
    backgroundColor: 'rgba(21, 150, 111, 0.1)',
    borderRadius: 1,
    transform: [{ rotate: '3deg' }],
  },
  topo3: {
    position: 'absolute',
    top: '55%',
    left: '8%',
    width: '85%',
    height: 1,
    backgroundColor: 'rgba(21, 150, 111, 0.08)',
    borderRadius: 1,
    transform: [{ rotate: '-2deg' }],
  },
  topo4: {
    position: 'absolute',
    top: '75%',
    left: '12%',
    width: '75%',
    height: 1,
    backgroundColor: 'rgba(21, 150, 111, 0.07)',
    borderRadius: 1,
    transform: [{ rotate: '4deg' }],
  },
  topoLine: {
    position: 'absolute',
  },
  river: {
    position: 'absolute',
    top: '20%',
    left: '42%',
    width: 4,
    height: '55%',
    backgroundColor: 'rgba(44, 188, 175, 0.35)',
    borderRadius: 2,
    transform: [{ rotate: '8deg' }],
  },
  riverBranch: {
    position: 'absolute',
    top: '45%',
    left: '30%',
    width: 3,
    height: '25%',
    backgroundColor: 'rgba(44, 188, 175, 0.25)',
    borderRadius: 2,
    transform: [{ rotate: '-12deg' }],
  },
  territoryOutline: {
    position: 'absolute',
    top: '10%',
    left: '15%',
    width: '70%',
    height: '80%',
    borderWidth: 1.5,
    borderColor: 'rgba(21, 150, 111, 0.2)',
    borderRadius: 20,
    borderStyle: 'dashed',
  },
  connDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(21, 150, 111, 0.25)',
  },
  connLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: 'rgba(21, 150, 111, 0.15)',
    borderRadius: 1,
  },
  marker: {
    position: 'absolute',
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    zIndex: 2,
  },
  markerRing: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    opacity: 0.4,
  },
  mapLabel: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(4, 63, 67, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  mapLabelText: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.textLight,
    letterSpacing: 1.5,
  },
  infoCards: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  infoCardsMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  infoCard: {
    backgroundColor: colors.surfaceWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 12,
    minWidth: 100,
    flex: 1,
    gap: 4,
  },
  infoCardTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  infoCardValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  infoCardSubtitle: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 14,
  },
  riskRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  riskDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  riskLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
