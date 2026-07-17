import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Linking, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { EMERGENCY_LINES } from '../../constants';

export function SOSScreen() {
  const callNumber = (phone: string) => {
    const url = Platform.OS === 'ios' ? `tel:${phone}` : `tel:${phone}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', `Llama al ${phone} desde tu teléfono`);
    });
  };

  const shareLocation = () => {
    Alert.alert('Compartir ubicación', 'Función de geolocalización próximamente.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.sosIcon}>
          <Ionicons name="alert-circle" size={48} color="#fff" />
        </View>
        <Text style={styles.title}>¿Necesitas ayuda urgente?</Text>
        <Text style={styles.subtitle}>Selecciona una opción para recibir asistencia inmediata</Text>
      </View>

      <View style={styles.emergencyBanner}>
        <Ionicons name="warning" size={20} color="#fff" />
        <Text style={styles.emergencyText}>En caso de emergencia, llama al 911</Text>
      </View>

      {EMERGENCY_LINES.map((line) => (
        <Pressable key={line.phone} style={styles.callCard} onPress={() => callNumber(line.phone)}>
          <View style={styles.callIconWrap}>
            <Ionicons name="call" size={22} color="#fff" />
          </View>
          <View style={styles.callInfo}>
            <Text style={styles.callName}>{line.name}</Text>
            <Text style={styles.callPhone}>{line.phone}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </Pressable>
      ))}

      <Pressable style={styles.locationButton} onPress={shareLocation}>
        <Ionicons name="location-outline" size={20} color={colors.primary} />
        <Text style={styles.locationText}>Compartir ubicación actual</Text>
      </Pressable>

      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsTitle}>Mientras llega la ayuda:</Text>
        <Text style={styles.instructionItem}>1. Mantén la calma</Text>
        <Text style={styles.instructionItem}>2. No muevas a la persona accidentada si no es necesario</Text>
        <Text style={styles.instructionItem}>3. Si sabes primeros auxilios, aplica lo necesario</Text>
        <Text style={styles.instructionItem}>4. Ten a mano tus documentos personales</Text>
        <Text style={styles.instructionItem}>5. Informa a un familiar o vecino cercano</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F5' },
  content: { padding: 20, gap: 12 },
  header: { alignItems: 'center', gap: 8, marginBottom: 8 },
  sosIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#DC2626', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  emergencyBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#DC2626', borderRadius: 12, padding: 12 },
  emergencyText: { color: '#fff', fontWeight: '700', fontSize: 14, flex: 1 },
  callCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  callIconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  callInfo: { flex: 1 },
  callName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  callPhone: { fontSize: 18, fontWeight: '800', color: colors.primary, marginTop: 2 },
  locationButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.surface, borderRadius: 14, paddingVertical: 14, borderWidth: 1, borderColor: colors.border },
  locationText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  instructionsCard: { backgroundColor: '#EEF2FF', borderRadius: 16, padding: 16, gap: 6 },
  instructionsTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  instructionItem: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
});
