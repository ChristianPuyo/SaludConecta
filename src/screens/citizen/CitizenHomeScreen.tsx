import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useReports } from '../../context/ReportsContext';
import { RiskBadge } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import type { CitizenTabParamList } from '../../navigation/CitizenNavigator';

type Nav = BottomTabNavigationProp<CitizenTabParamList, 'Home'>;

export function CitizenHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { reports } = useReports();
  const lastReport = reports[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Hola 👋</Text>
      <Text style={styles.subtitle}>Guardian Salud AI cuida de tu comunidad</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Riesgo actual en tu distrito</Text>
        <RiskBadge level="medio" />
        <Text style={styles.cardHint}>Callería · Basado en reportes de los últimos 7 días</Text>
      </View>

      {lastReport && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Tu último reporte ({lastReport.date})</Text>
          <Text style={styles.cardText}>{lastReport.symptoms.join(', ')}</Text>
          <RiskBadge level={lastReport.risk} />
        </View>
      )}

      <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('ReportSymptoms')}>
        <Text style={styles.primaryButtonText}>Reportar síntomas</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: 8 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, gap: 8, borderWidth: 1, borderColor: colors.border },
  cardLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase' },
  cardHint: { fontSize: 12, color: colors.textSecondary },
  cardText: { fontSize: 15, color: colors.textPrimary },
  primaryButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
