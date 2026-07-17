import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useReports } from '../../context/ReportsContext';
import { RiskBadge, type RiskLevel } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import {
  MOCK_DISTRICT_RISK,
  MOCK_ALERTS,
  getSymptomStats,
  getRiskDistribution,
} from '../../data/mockData';

const RISK_COLORS: Record<RiskLevel, string> = {
  alto: '#EF4444',
  medio: '#F59E0B',
  bajo: '#22C55E',
};

const SYMPTOM_ICONS: Record<string, string> = {
  Fiebre: '🌡️',
  'Dolor muscular': '💪',
  Tos: '🫁',
  Diarrea: '🤢',
  Vómitos: '🤮',
  'Dolor de cabeza': '🤕',
};

export function MyReportsScreen() {
  const navigation = useNavigation<any>();
  const { reports } = useReports();

  const symptomStats = getSymptomStats(reports);
  const maxCount = Math.max(...symptomStats.map((s) => s.count), 1);
  const riskDist = getRiskDistribution(reports);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="shield-checkmark" size={28} color={colors.primary} />
          <Text style={styles.appName}>Guardian Salud</Text>
        </View>
        <Pressable onPress={() => Alert.alert('Perfil', 'Próximamente: configuración de usuario')}>
          <Ionicons name="person-circle" size={32} color={colors.textSecondary} />
        </Pressable>
      </View>

      <Text style={styles.mainTitle}>Mapas de Salud Comunitaria</Text>

      <View style={styles.cardsRow}>
        <View style={[styles.mapCard, styles.flexTwo]}>
          <LinearGradient colors={['#F0FDFA', '#ECFDF5']} style={styles.mapCardGradient}>
            <View style={styles.mapCardHeader}>
              <Text style={styles.mapCardTitle}>Riesgo por distrito</Text>
              <Pressable onPress={() => Alert.alert('Filtrar', 'Próximamente: filtros de distrito')}>
                <Ionicons name="ellipsis-horizontal" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.districtList}>
              {MOCK_DISTRICT_RISK.map((d) => (
                <View key={d.district} style={styles.districtRow}>
                  <View style={styles.districtLeft}>
                    <View style={[styles.districtDot, { backgroundColor: RISK_COLORS[d.risk] }]} />
                    <Text style={styles.districtName}>{d.district}</Text>
                  </View>
                  <View style={styles.districtRight}>
                    <Text style={styles.districtCases}>{d.cases} casos</Text>
                    <RiskBadge level={d.risk} />
                  </View>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        <View style={[styles.reportCard, styles.flexOne]}>
          <LinearGradient colors={['#FFFBEB', '#FFFFFF']} style={styles.reportCardGradient}>
            <Text style={styles.reportCardTitle}>Reportes por síntoma</Text>

            <View style={styles.chartContainer}>
              {symptomStats.slice(0, 5).map((s) => (
                <View key={s.symptom} style={styles.chartBar}>
                  <Text style={styles.chartValue}>{s.count}</Text>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${Math.max((s.count / maxCount) * 100, 8)}%`,
                        backgroundColor: s.count >= 5 ? colors.danger : s.count >= 3 ? colors.warning : colors.primary,
                      },
                    ]}
                  />
                  <Text style={styles.chartLabel}>{SYMPTOM_ICONS[s.symptom] || '🩺'}</Text>
                </View>
              ))}
            </View>

            <View style={styles.legendRow}>
              {riskDist.map((r) => (
                <View key={r.level} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: RISK_COLORS[r.level] }]} />
                  <Text style={styles.legendText}>
                    {r.level.charAt(0).toUpperCase() + r.level.slice(1)}: {r.count}
                  </Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.alertsCard}>
        <LinearGradient colors={['#F0F9FF', '#FFFFFF']} style={styles.alertsCardGradient}>
          <View style={styles.alertsHeader}>
            <Text style={styles.alertsTitle}>Alertas comunitarias</Text>
            <Pressable onPress={() => navigation.navigate('AuthorityApp')}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </Pressable>
          </View>

          {MOCK_ALERTS.map((alert) => (
            <Pressable
              key={alert.id}
              onPress={() => Alert.alert(alert.title, `${alert.detail}\n\nDistrito: ${alert.district}\nFecha: ${alert.date}`)}
              style={({ pressed }) => [styles.alertItem, pressed && styles.alertItemPressed]}
            >
              <View
                style={[
                  styles.alertIconContainer,
                  { backgroundColor: alert.risk === 'alto' ? '#FEE2E2' : '#FEF3C7' },
                ]}
              >
                <Ionicons
                  name={alert.risk === 'alto' ? 'alert-circle' : 'information-circle'}
                  size={20}
                  color={alert.risk === 'alto' ? '#EF4444' : '#F59E0B'}
                />
              </View>
              <View style={styles.alertInfo}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertDetail}>{alert.detail}</Text>
                <Text style={styles.alertTime}>{alert.date}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </Pressable>
          ))}
        </LinearGradient>
      </View>

      <Pressable
        style={({ pressed }) => [styles.createButton, pressed && styles.createButtonPressed]}
        onPress={() => navigation.getParent()?.navigate('ReportSymptoms')}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.createButtonGradient}
        >
          <View style={styles.createButtonIcon}>
            <Ionicons name="add" size={24} color="#fff" />
          </View>
          <Text style={styles.createButtonText}>CREAR REPORTE DE SÍNTOMAS</Text>
        </LinearGradient>
      </Pressable>

      <View style={styles.bottomCards}>
        <Pressable
          style={({ pressed }) => [styles.bottomCard, pressed && styles.bottomCardPressed]}
          onPress={() => navigation.navigate('SaludEscolar')}
        >
          <View style={[styles.bottomCardIcon, { backgroundColor: '#DBEAFE' }]}>
            <Ionicons name="school" size={22} color="#2563EB" />
          </View>
          <Text style={styles.bottomCardTitle}>Salud Escolar</Text>
          <Text style={styles.bottomCardSubtext}>Alertas Escolares</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.bottomCard, pressed && styles.bottomCardPressed]}
          onPress={() => navigation.navigate('RecursosMedicos')}
        >
          <View style={[styles.bottomCardIcon, { backgroundColor: '#FCE7F3' }]}>
            <Ionicons name="medical" size={22} color="#DB2777" />
          </View>
          <Text style={styles.bottomCardTitle}>Recursos Médicos</Text>
          <Text style={styles.bottomCardSubtext}>Clínicas Cercanas</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.bottomCard, pressed && styles.bottomCardPressed]}
          onPress={() => navigation.navigate('Directorio')}
        >
          <View style={[styles.bottomCardIcon, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="call" size={22} color="#059669" />
          </View>
          <Text style={styles.bottomCardTitle}>Directorio</Text>
          <Text style={styles.bottomCardSubtext}>Contactos Importantes</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  appName: { fontSize: 18, fontWeight: '800', color: colors.primary },
  mainTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: 16 },
  cardsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  flexOne: { flex: 1 },
  flexTwo: { flex: 1.2 },
  mapCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  mapCardGradient: { padding: 14 },
  mapCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mapCardTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  districtList: { gap: 8 },
  districtRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  districtLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  districtDot: { width: 8, height: 8, borderRadius: 4 },
  districtName: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  districtRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  districtCases: { fontSize: 11, color: colors.textSecondary },
  reportCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  reportCardGradient: { padding: 14 },
  reportCardTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
    marginBottom: 12,
    paddingBottom: 4,
  },
  chartBar: { alignItems: 'center', flex: 1 },
  chartValue: { fontSize: 9, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  bar: { width: 20, borderRadius: 4, marginBottom: 4 },
  chartLabel: { fontSize: 14 },
  legendRow: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', gap: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendText: { fontSize: 9, color: colors.textSecondary },
  alertsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  alertsCardGradient: { padding: 14 },
  alertsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertsTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  seeAllText: { fontSize: 12, color: colors.primary, fontWeight: '600' },
  alertItem: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  alertItemPressed: { backgroundColor: '#F8FAFC', borderRadius: 8 },
  alertIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertInfo: { flex: 1, gap: 2 },
  alertTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  alertDetail: { fontSize: 11, color: colors.textSecondary, lineHeight: 16 },
  alertTime: { fontSize: 10, color: colors.textSecondary, marginTop: 2 },
  createButton: {
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    marginBottom: 16,
  },
  createButtonPressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  createButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14, letterSpacing: 0.5 },
  bottomCards: { flexDirection: 'row', gap: 10 },
  bottomCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bottomCardPressed: { backgroundColor: '#F0FDF4', transform: [{ scale: 0.97 }] },
  bottomCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bottomCardTitle: { fontSize: 11, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  bottomCardSubtext: { fontSize: 9, color: colors.textSecondary, textAlign: 'center', marginTop: 2 },
});
