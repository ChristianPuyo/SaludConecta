import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useReports } from '../../context/ReportsContext';
import { RiskBadge } from '../../components/RiskBadge';
import { colors, shadows } from '../../theme/colors';
import type { CitizenTabParamList } from '../../navigation/CitizenNavigator';

type Nav = BottomTabNavigationProp<CitizenTabParamList, 'Home'>;

export function CitizenHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { reports, districtRisks } = useReports();
  const lastReport = reports[0];
  const calleriaRisk = districtRisks.find((d) => d.district === 'Callería')?.risk || 'medio';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.welcomeBanner}>
        <View style={styles.welcomeLeft}>
          <Text style={styles.title}>Hola 👋</Text>
          <Text style={styles.subtitle}>Vigilancia y prevención de salud comunitaria en tiempo real.</Text>
        </View>
        <View style={styles.welcomeIconWrap}>
          <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardTitleWrap}>
            <Ionicons name="navigate-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.cardLabel}>Riesgo en tu distrito</Text>
          </View>
          <Text style={styles.districtName}>Callería</Text>
        </View>
        <View style={styles.badgeRow}>
          <RiskBadge level={calleriaRisk} />
          <Text style={styles.cardHint}>Basado en reportes de los últimos 7 días</Text>
        </View>
      </View>

      {lastReport ? (
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleWrap}>
              <Ionicons name="medical-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.cardLabel}>Último reporte enviado</Text>
            </View>
            <Text style={styles.reportTime}>{lastReport.date}</Text>
          </View>
          
          <Text style={styles.symptomsList}>{lastReport.symptoms.join(' · ')}</Text>
          
          <View style={styles.badgeRow}>
            <RiskBadge level={lastReport.risk} />
            <Text style={styles.cardHint}>Clasificado por el asistente de IA</Text>
          </View>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Ionicons name="heart-outline" size={24} color={colors.textMuted} />
          <Text style={styles.emptyCardText}>No has registrado reportes de salud en los últimos días.</Text>
        </View>
      )}

      <Pressable 
        style={({ pressed }) => [
          styles.primaryButton, 
          pressed && styles.primaryButtonPressed
        ]} 
        onPress={() => navigation.navigate('ReportSymptoms')}
      >
        <Ionicons name="alert-circle-outline" size={20} color="#fff" />
        <Text style={styles.primaryButtonText}>Reportar síntomas ahora</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  welcomeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.sm,
  },
  welcomeLeft: { flex: 1, marginRight: 12 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 4, lineHeight: 18 },
  welcomeIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 12,
    ...shadows.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: colors.border,
    paddingBottom: 10,
  },
  cardTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardLabel: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.3 },
  districtName: { fontSize: 14, fontWeight: '800', color: colors.primaryDark },
  reportTime: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  symptomsList: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, paddingVertical: 4 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' },
  cardHint: { fontSize: 11, color: colors.textSecondary, fontWeight: '500' },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    gap: 8,
    borderStyle: 'dashed',
  },
  emptyCardText: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
    ...shadows.md,
  },
  primaryButtonPressed: { backgroundColor: colors.primaryDark, opacity: 0.95 },
  primaryButtonText: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: -0.2 },
});

