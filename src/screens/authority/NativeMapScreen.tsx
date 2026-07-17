import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MOCK_DISTRICT_RISK } from '../../data/mockData';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';

const RISK_COLOR: Record<string, string> = {
  alto: colors.danger,
  medio: colors.warning,
  bajo: colors.success,
};

const DISTRICT_COORDS: Record<string, { latitude: number; longitude: number }> = {
  'Callería': { latitude: -8.4106, longitude: -74.5444 },
  'Yarinacocha': { latitude: -8.3300, longitude: -74.5100 },
  'Manantay': { latitude: -8.3800, longitude: -74.5200 },
  'Campoverde': { latitude: -8.4500, longitude: -74.6000 },
  'Nueva Requena': { latitude: -8.5000, longitude: -74.6500 },
};

export function NativeMapScreen() {
  const { location, error } = useCurrentLocation();
  const { colors: themeColors } = useTheme();

  const initialRegion = {
    latitude: location?.latitude ?? -8.4106,
    longitude: location?.longitude ?? -74.5444,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>Mapa de Riesgo</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          Distritos de Ucayali · Toca un marcador para ver detalles
        </Text>
      </Animated.View>

      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {MOCK_DISTRICT_RISK.map((district) => {
          const coords = DISTRICT_COORDS[district.district];
          if (!coords) return null;

          return (
            <Marker
              key={district.district}
              coordinate={coords}
              title={district.district}
              description={`${district.cases} casos activos - Riesgo ${district.risk}`}
              pinColor={RISK_COLOR[district.risk]}
            />
          );
        })}
      </MapView>

      <View style={[styles.legend, { backgroundColor: themeColors.surface }]}>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors.danger }]} />
            <Text style={[styles.legendText, { color: themeColors.textSecondary }]}>Alto</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors.warning }]} />
            <Text style={[styles.legendText, { color: themeColors.textSecondary }]}>Medio</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: colors.success }]} />
            <Text style={[styles.legendText, { color: themeColors.textSecondary }]}>Bajo</Text>
          </View>
        </View>
      </View>

      {error && (
        <View style={[styles.errorBanner, { backgroundColor: themeColors.surface }]}>
          <Text style={[styles.errorText, { color: colors.warning }]}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 16,
  },
  title: { fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 13, marginTop: 2 },
  map: { flex: 1 },
  legend: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 12,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  legendRow: { flexDirection: 'row', justifyContent: 'space-around' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, fontWeight: '600' },
  errorBanner: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  errorText: { fontSize: 12, fontWeight: '600' },
});
