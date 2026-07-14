import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useReports } from '../../context/ReportsContext';
import { RiskBadge } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import type { CitizenTabParamList } from '../../types/navigation';
import { SafeScreen } from '../../components/SafeScreen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

type Nav = BottomTabNavigationProp<CitizenTabParamList, 'Home'>;

export function CitizenHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { reports } = useReports();
  const lastReport = reports[0];

  return (
    <SafeScreen scrollable contentContainerStyle={styles.content}>
      <Text style={styles.title}>Hola 👋</Text>
      <Text style={styles.subtitle}>Guardian Salud AI cuida de tu comunidad</Text>

      <Card style={styles.card}>
        <Text style={styles.cardLabel}>Riesgo actual en tu distrito</Text>
        <RiskBadge level="medio" />
        <Text style={styles.cardHint}>Callería · Basado en reportes de los últimos 7 días</Text>
      </Card>

      {lastReport && (
        <Card style={styles.card}>
          <Text style={styles.cardLabel}>Tu último reporte ({lastReport.date})</Text>
          <Text style={styles.cardText}>{lastReport.symptoms.join(', ')}</Text>
          <RiskBadge level={lastReport.risk} />
        </Card>
      )}

      <Button
        title="Reportar síntomas"
        onPress={() => navigation.navigate('ReportSymptoms')}
        icon="add-circle-outline"
        style={styles.primaryButton}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: 8 },
  card: { gap: 8 },
  cardLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase' },
  cardHint: { fontSize: 12, color: colors.textSecondary },
  cardText: { fontSize: 15, color: colors.textPrimary },
  primaryButton: { marginTop: 8 },
});

