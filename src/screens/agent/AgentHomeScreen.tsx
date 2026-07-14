import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useVisits } from '../../context/VisitsContext';
import { colors } from '../../theme/colors';
import type { AgentTabParamList } from '../../types/navigation';
import { SafeScreen } from '../../components/SafeScreen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

type Nav = BottomTabNavigationProp<AgentTabParamList, 'Home'>;

export function AgentHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { visits } = useVisits();
  const pending = visits.filter((v) => !v.synced).length;

  return (
    <SafeScreen scrollable contentContainerStyle={styles.content}>
      <Text style={styles.title}>Panel del Agente</Text>
      <Text style={styles.subtitle}>Registra la salud de tu comunidad, con o sin Internet</Text>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{visits.length}</Text>
          <Text style={styles.statLabel}>Visitas registradas</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={[styles.statNumber, pending > 0 && { color: colors.warning }]}>
            {pending}
          </Text>
          <Text style={styles.statLabel}>Pendientes de sincronizar</Text>
        </Card>
      </View>

      <View style={styles.offlineBanner}>
        <Text style={styles.offlineText}>📡 Modo offline activo: los datos se guardan en tu dispositivo</Text>
      </View>

      <Button
        title="Registrar nueva visita"
        onPress={() => navigation.navigate('RegisterVisit')}
        icon="medkit-outline"
        style={styles.primaryButton}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 15, color: colors.textSecondary },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
  offlineBanner: { backgroundColor: colors.secondaryLight, borderRadius: 12, padding: 12 },
  offlineText: { color: colors.secondary, fontSize: 13, fontWeight: '600' },
  primaryButton: { marginTop: 8 },
});

