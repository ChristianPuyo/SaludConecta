import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useVisits } from '../../context/VisitsContext';
import { colors } from '../../theme/colors';
import type { AgentTabParamList } from '../../navigation/AgentNavigator';

type Nav = BottomTabNavigationProp<AgentTabParamList, 'Home'>;

export function AgentHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { visits } = useVisits();
  const pending = visits.filter((v) => !v.synced).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Panel del Agente</Text>
      <Text style={styles.subtitle}>Registra la salud de tu comunidad, con o sin Internet</Text>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{visits.length}</Text>
          <Text style={styles.statLabel}>Visitas registradas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, pending > 0 && { color: colors.warningText }]}>{pending}</Text>
          <Text style={styles.statLabel}>Pendientes de sincronizar</Text>
        </View>
      </View>

      <View style={styles.offlineBanner}>
        <Text style={styles.offlineText}>📡 Modo offline activo: los datos se guardan en tu dispositivo</Text>
      </View>

      <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('RegisterVisit')}>
        <Text style={styles.primaryButtonText}>Registrar nueva visita</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 15, color: colors.textSecondary },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  statNumber: { fontSize: 28, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
  offlineBanner: { backgroundColor: '#EFF6FF', borderRadius: 12, padding: 12 },
  offlineText: { color: colors.secondary, fontSize: 13, fontWeight: '600' },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
