import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useReports } from '../../context/ReportsContext';
import { RiskBadge } from '../../components/RiskBadge';
import { AnimatedButton } from '../../components/AnimatedButton';
import { colors } from '../../theme/colors';
import type { CitizenTabParamList } from '../../navigation/CitizenNavigator';

type Nav = BottomTabNavigationProp<CitizenTabParamList, 'Home'>;

export function CitizenHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { reports } = useReports();
  const lastReport = reports[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeIn.duration(500)}>
        <Text style={styles.title}>Hola 👋</Text>
        <Text style={styles.subtitle}>Guardian Salud AI cuida de tu comunidad</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(200).springify()} style={styles.card}>
        <Text style={styles.cardLabel}>Riesgo actual en tu distrito</Text>
        <RiskBadge level="medio" />
        <Text style={styles.cardHint}>Callería · Basado en reportes de los últimos 7 días</Text>
      </Animated.View>

      {lastReport && (
        <Animated.View entering={FadeInDown.duration(400).delay(350).springify()} style={styles.card}>
          <Text style={styles.cardLabel}>Tu último reporte ({lastReport.date})</Text>
          <Text style={styles.cardText}>{lastReport.symptoms.join(', ')}</Text>
          <RiskBadge level={lastReport.risk} />
        </Animated.View>
      )}

      <Animated.View entering={FadeInDown.duration(400).delay(500).springify()}>
        <AnimatedButton
          title="Reportar síntomas"
          onPress={() => navigation.navigate('ReportSymptoms')}
        />
      </Animated.View>
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
});
