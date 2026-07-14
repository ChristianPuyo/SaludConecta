import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
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
      <View style={styles.heroCard}>
        <View style={styles.heroGlow} />
        <View style={styles.heroGlowSecondary} />
        <View style={styles.heroTextWrap}>
          <View style={styles.heroTagRow}>
            <View style={styles.heroDot} />
            <Text style={styles.heroTag}>Sistema de alerta comunitaria</Text>
          </View>
          <Text style={styles.welcomeTitle}>¡Hola! 👋</Text>
          <Text style={styles.welcomeSubtitle}>Guardian Salud AI activo para Ucayali</Text>
        </View>
        <View style={styles.locationBadge}>
          <Ionicons name={"location-sharp" as any} size={14} color={colors.primary} />
          <Text style={styles.locationText}>Callería</Text>
        </View>
      </View>

      <View style={styles.cardAlert}>
        <View style={styles.cardAccentBar} />
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardTitleWrap}>
            <Text style={styles.cardLabel}>Riesgo en tu distrito</Text>
            <Text style={styles.districtTitle}>Callería · Pucallpa</Text>
          </View>
          <View style={styles.iconPill}>
            <Ionicons name={"shield-checkmark" as any} size={20} color={colors.primary} />
          </View>
        </View>
        <View style={styles.badgeRow}>
          <RiskBadge level="medio" />
        </View>
        <Text style={styles.cardHint}>
          Vigilancia activa basada en reportes ciudadanos agregados de los últimos 7 días.
        </Text>
      </View>

      {lastReport ? (
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardLabel}>Tu último reporte</Text>
            <View style={styles.cardIconWrap}>
              <Ionicons name={"document-text-outline" as any} size={18} color={colors.textSecondary} />
            </View>
          </View>
          <Text style={styles.cardDate}>{lastReport.date}</Text>
          <Text style={styles.cardText}>{lastReport.symptoms.join(', ')}</Text>
          <View style={styles.badgeRow}>
            <RiskBadge level={lastReport.risk} />
          </View>
        </View>
      ) : (
        <View style={styles.cardEmpty}>
          <Ionicons name={"checkmark-circle-outline" as any} size={40} color={colors.success} />
          <Text style={styles.cardEmptyText}>No has registrado reportes de síntomas hoy.</Text>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
        onPress={() => navigation.navigate('ReportSymptoms')}
      >
        <View style={styles.actionButtonContent}>
          <View style={styles.actionIconWrap}>
            <Ionicons name={"pulse" as any} size={24} color="#fff" />
          </View>
          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>Reportar Síntomas</Text>
            <Text style={styles.actionDesc}>Tu reporte ayuda a detectar riesgos tempranos en la comunidad.</Text>
          </View>
          <View style={styles.actionArrowWrap}>
            <Ionicons name={"arrow-forward" as any} size={18} color="#fff" />
          </View>
        </View>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 20, gap: 16 },
  heroCard: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#F8FFFE',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    right: -18,
    top: -18,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
  },
  heroGlowSecondary: {
    position: 'absolute',
    left: -12,
    bottom: -18,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  heroTextWrap: { flex: 1, gap: 6, zIndex: 1 },
  heroTagRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  heroTag: { fontSize: 11, fontWeight: '700', color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.8 },
  welcomeTitle: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  welcomeSubtitle: { fontSize: 14, color: colors.textSecondary, lineHeight: 20 },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    zIndex: 1,
  },
  locationText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  cardAlert: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardAccentBar: {
    position: 'absolute',
    left: 18,
    top: 18,
    bottom: 18,
    width: 4,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 8 },
  cardTitleWrap: { flex: 1, gap: 2 },
  cardLabel: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  districtTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  iconPill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  cardIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeRow: { marginVertical: 2, paddingLeft: 8 },
  cardHint: { fontSize: 12, color: colors.textSecondary, lineHeight: 16, paddingLeft: 8 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardDate: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  cardText: { fontSize: 15, color: colors.textPrimary, lineHeight: 20 },
  cardEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  cardEmptyText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 18,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  actionButtonPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  actionButtonContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  actionIconWrap: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  actionTextWrap: { flex: 1, gap: 2 },
  actionTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  actionDesc: { fontSize: 12, color: 'rgba(255,255,255,0.86)', lineHeight: 16 },
  actionArrowWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
