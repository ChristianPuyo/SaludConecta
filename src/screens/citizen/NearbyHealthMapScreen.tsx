import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { MOCK_HEALTH_FACILITIES, type HealthFacility } from '../../data/mockData';
import { colors } from '../../theme/colors';

// Ubicación de referencia del ciudadano (Pucallpa centro).
// En una versión futura esto vendría del GPS real del dispositivo.
const USER_LOCATION = { latitude: -8.3833, longitude: -74.5333, label: 'Tu ubicación' };

// Límites geográficos aproximados de Ucayali (para ubicar los puntos dentro del mapa simple)
const BOUNDS = { minLat: -8.55, maxLat: -8.20, minLon: -74.90, maxLon: -74.45 };

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Convierte lat/long a una posición (%) dentro del recuadro del mapa simple
function toMapPosition(lat: number, lon: number) {
  const x = ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * 100;
  const y = (1 - (lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { left: `${Math.min(96, Math.max(2, x))}%`, top: `${Math.min(96, Math.max(2, y))}%` };
}

export function NearbyHealthMapScreen() {
  const facilities = MOCK_HEALTH_FACILITIES.map((f) => ({
    ...f,
    distance: distanceKm(USER_LOCATION.latitude, USER_LOCATION.longitude, f.latitude, f.longitude),
  })).sort((a, b) => a.distance - b.distance);

  const nearest = facilities[0];

  const openDirections = (facility: HealthFacility) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Establecimientos de salud cerca de ti</Text>
      <Text style={styles.subtitle}>Ordenados por distancia desde tu ubicación</Text>

      <View style={styles.mapBox}>
        <View style={[styles.pin, styles.userPin, toMapPosition(USER_LOCATION.latitude, USER_LOCATION.longitude) as any]}>
          <Text style={styles.pinIcon}>📍</Text>
        </View>
        {facilities.map((f) => (
          <View
            key={f.id}
            style={[styles.pin, f.id === nearest.id && styles.nearestPin, toMapPosition(f.latitude, f.longitude) as any]}
          >
            <Text style={styles.pinIcon}>{f.id === nearest.id ? '🏥' : '➕'}</Text>
          </View>
        ))}
        <Text style={styles.mapCaption}>Mapa referencial de Ucayali</Text>
      </View>

      <View style={styles.nearestCard}>
        <Text style={styles.nearestLabel}>MÁS CERCANO A TI</Text>
        <Text style={styles.nearestName}>{nearest.name}</Text>
        <Text style={styles.nearestDetail}>
          {nearest.type} · {nearest.district} · {nearest.distance.toFixed(1)} km
        </Text>
        <Pressable style={styles.directionsButton} onPress={() => openDirections(nearest)}>
          <Text style={styles.directionsButtonText}>Cómo llegar</Text>
        </Pressable>
      </View>

      <Text style={styles.listTitle}>Todos los establecimientos</Text>
      {facilities.map((f) => (
        <View key={f.id} style={styles.listItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.listItemName}>{f.name}</Text>
            <Text style={styles.listItemDetail}>{f.type} · {f.district}</Text>
          </View>
          <Text style={styles.listItemDistance}>{f.distance.toFixed(1)} km</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  mapBox: {
    height: 220,
    backgroundColor: '#e6f4ea',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  pin: { position: 'absolute', alignItems: 'center', transform: [{ translateX: -12 }, { translateY: -12 }] },
  pinIcon: { fontSize: 20 },
  userPin: { zIndex: 2 },
  nearestPin: { zIndex: 2 },
  mapCaption: { position: 'absolute', bottom: 6, right: 10, fontSize: 10, color: colors.textSecondary },
  nearestCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, gap: 4, borderWidth: 1, borderColor: colors.border },
  nearestLabel: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  nearestName: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  nearestDetail: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  directionsButton: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  directionsButtonText: { color: '#fff', fontWeight: '700' },
  listTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginTop: 8 },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listItemName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  listItemDetail: { fontSize: 12, color: colors.textSecondary },
  listItemDistance: { fontSize: 14, fontWeight: '800', color: colors.primary },
});