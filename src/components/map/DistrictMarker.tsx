import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import type { DistrictGeoData, DistrictEpiData } from '../../data/mapData';
import { colors } from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';

interface DistrictMarkerProps {
  district: DistrictGeoData;
  epiData: DistrictEpiData;
  isSelected: boolean;
  onPress: () => void;
}

function getRiskColor(risk: string): string {
  if (risk === 'alto') return colors.danger;
  if (risk === 'medio') return colors.warning;
  return colors.success;
}

export function DistrictMarker({ district, epiData, isSelected, onPress }: DistrictMarkerProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const riskColor = getRiskColor(epiData.risk);
  const { t } = useLanguage();

  useEffect(() => {
    if (epiData.risk === 'alto') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.4, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [epiData.risk, pulseAnim]);

  return (
    <Marker
      coordinate={{ latitude: district.latitude, longitude: district.longitude }}
      onPress={onPress}
      tracksViewChanges={false}
    >
      {/* Custom marker view */}
      <View style={styles.markerWrapper}>
        {/* Pulse ring — only for high risk */}
        {epiData.risk === 'alto' && (
          <Animated.View
            style={[
              styles.pulseRing,
              { borderColor: riskColor, transform: [{ scale: pulseAnim }] },
            ]}
          />
        )}
        {/* Core bubble */}
        <View style={[styles.markerCore, { backgroundColor: riskColor, borderColor: isSelected ? '#fff' : 'rgba(255,255,255,0.6)' }]}>
          <Text style={styles.markerCases}>{epiData.cases}</Text>
        </View>
        {/* District name tag */}
        <View style={[styles.nameTag, isSelected && styles.nameTagSelected]}>
          <Text style={[styles.nameText, isSelected && styles.nameTextSelected]} numberOfLines={1}>
            {district.name}
          </Text>
        </View>
      </View>

      {/* Callout popup */}
      <Callout tooltip>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>{district.name}</Text>
          <Text style={styles.calloutDetail}>
            {t.marker_cases(epiData.cases, epiData.risk.toUpperCase())}
          </Text>
          <Text style={styles.calloutHint}>{t.marker_hint}</Text>
        </View>
      </Callout>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    opacity: 0.5,
  },
  markerCore: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  markerCases: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  nameTag: {
    marginTop: 3,
    backgroundColor: 'rgba(15,23,42,0.75)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  nameTagSelected: {
    backgroundColor: colors.primary,
  },
  nameText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  nameTextSelected: {
    fontWeight: '800',
  },
  callout: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    minWidth: 180,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  calloutDetail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  calloutHint: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
});
