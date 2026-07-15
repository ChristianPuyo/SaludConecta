import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useReports } from '../../context/ReportsContext';
import { RiskBadge, type RiskLevel } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import { MOCK_DISTRICT_RISK, MOCK_ALERTS } from '../../data/mockData';

const RISK_COLORS: Record<RiskLevel, string> = {
  alto: '#EF4444',
  medio: '#F59E0B',
  bajo: '#22C55E',
};

const SYMPTOM_ICONS: Record<string, string> = {
  'Fiebre': '🌡️',
  'Dolor muscular': '💪',
  'Tos': '🫁',
  'Diarrea': '🤢',
  'Vómitos': '🤮',
  'Dolor de cabeza': '🤕',
};

export function MyReportsScreen() {
  const navigation = useNavigation();
  const { reports } = useReports();
  const lastReport = reports[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="shield-checkmark" size={28} color={colors.primary} />
          <View>
            <Text style={styles.appName}>Guardian Salud</Text>
          </View>
        </View>
        <Ionicons name="person-circle" size={32} color={colors.textSecondary} />
      </View>

      <Text style={styles.mainTitle}>Mapas de Salud Comunitaria</Text>

      <View style={styles.cardsRow}>
        <View style={[styles.mapCard, styles.flexTwo]}>
          <LinearGradient
            colors={['#F0FDFA', '#ECFDF5']}
            style={styles.mapCardGradient}
          >
            <View style={styles.mapCardHeader}>
              <Text style={styles.mapCardTitle}>Riesgo comunitario en Callería</Text>
              <Ionicons name="ellipsis-horizontal" size={18} color={colors.textSecondary} />
            </View>

            <View style={styles.mapContainer}>
              <View style={styles.districtMap}>
                <View style={[styles.districtZone, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="location" size={14} color="#EF4444" />
                  <Text style={styles.zoneLabel}>Alto</Text>
                </View>
                <View style={[styles.districtZone, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="location" size={14} color="#F59E0B" />
                  <Text style={styles.zoneLabel}>Medio</Text>
                </View>
                <View style={[styles.districtZone, { backgroundColor: '#DCFCE7' }]}>
                  <Ionicons name="location" size={14} color="#22C55E" />
                  <Text style={styles.zoneLabel}>Bajo</Text>
                </View>
              </View>

              <View style={styles.mapPlaceholder}>
                <Ionicons name="map" size={48} color={colors.primary} />
                <Text style={styles.mapText}>Callería</Text>
                <Text style={styles.mapSubtext}>Zonas de Riesgo</Text>
              </View>
            </View>

            <View style={styles.mapLegend}>
              {MOCK_DISTRICT_RISK.slice(0, 3).map((d) => (
                <View key={d.district} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: RISK_COLORS[d.risk] }]} />
                  <Text style={styles.legendText}>{d.district}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        <View style={[styles.reportCard, styles.flexOne]}>
          <LinearGradient
            colors={['#FFFBEB', '#FFFFFF']}
            style={styles.reportCardGradient}
          >
            <Text style={styles.reportCardTitle}>Tu último reporte</Text>

            {lastReport && (
              <>
                <View style={styles.chartContainer}>
                  <View style={styles.chartBar}>
                    <View style={[styles.bar, { height: '40%', backgroundColor: '#FCD34D' }]} />
                    <Text style={styles.chartLabel}>E</Text>
                  </View>
                  <View style={styles.chartBar}>
                    <View style={[styles.bar, { height: '65%', backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.chartLabel}>F</Text>
                  </View>
                  <View style={styles.chartBar}>
                    <View style={[styles.bar, { height: '80%', backgroundColor: colors.primary }]} />
                    <Text style={styles.chartLabel}>M</Text>
                  </View>
                  <View style={styles.chartBar}>
                    <View style={[styles.bar, { height: '55%', backgroundColor: '#F59E0B' }]} />
                    <Text style={styles.chartLabel}>A</Text>
                  </View>
                  <View style={styles.chartBar}>
                    <View style={[styles.bar, { height: '30%', backgroundColor: '#FCD34D' }]} />
                    <Text style={styles.chartLabel}>M</Text>
                  </View>
                </View>

                <View style={styles.symptomsList}>
                  {lastReport.symptoms.map((symptom) => (
                    <View key={symptom} style={styles.symptomItem}>
                      <Text style={styles.symptomIcon}>{SYMPTOM_ICONS[symptom] || '🩺'}</Text>
                      <Text style={styles.symptomName}>{symptom}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </LinearGradient>
        </View>
      </View>

      <View style={styles.alertsCard}>
        <LinearGradient
          colors={['#F0F9FF', '#FFFFFF']}
          style={styles.alertsCardGradient}
        >
          <View style={styles.alertsHeader}>
            <Text style={styles.alertsTitle}>Alertas comunitarias</Text>
            <Ionicons name="ellipsis-horizontal" size={18} color={colors.textSecondary} />
          </View>

          {MOCK_ALERTS.map((alert) => (
            <View key={alert.id} style={styles.alertItem}>
              <View style={[styles.alertIconContainer, { backgroundColor: alert.risk === 'alto' ? '#FEE2E2' : '#FEF3C7' }]}>
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
            </View>
          ))}

          <Pressable style={styles.moreButton}>
            <Text style={styles.moreButtonText}>More tap tips</Text>
            <Ionicons name="chevron-down" size={16} color={colors.primary} />
          </Pressable>
        </LinearGradient>
      </View>

      <Pressable
        style={({ pressed }) => [styles.createButton, pressed && styles.createButtonPressed]}
        onPress={() => (navigation as any).getParent()?.navigate('ReportSymptoms')}
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
        <View style={styles.bottomCard}>
          <View style={[styles.bottomCardIcon, { backgroundColor: '#DBEAFE' }]}>
            <Ionicons name="school" size={22} color="#2563EB" />
          </View>
          <Text style={styles.bottomCardTitle}>Salud Escolar</Text>
          <Text style={styles.bottomCardSubtext}>Alertas Escolares</Text>
        </View>

        <View style={styles.bottomCard}>
          <View style={[styles.bottomCardIcon, { backgroundColor: '#FCE7F3' }]}>
            <Ionicons name="medical" size={22} color="#DB2777" />
          </View>
          <Text style={styles.bottomCardTitle}>Recursos Médicos</Text>
          <Text style={styles.bottomCardSubtext}>Clínicas Cercanas</Text>
        </View>

        <View style={styles.bottomCard}>
          <View style={[styles.bottomCardIcon, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="call" size={22} color="#059669" />
          </View>
          <Text style={styles.bottomCardTitle}>Directorio</Text>
          <Text style={styles.bottomCardSubtext}>Contactos Importantes</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  flexOne: {
    flex: 1,
  },
  flexTwo: {
    flex: 1.2,
  },
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
  mapCardGradient: {
    padding: 14,
  },
  mapCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mapCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  mapContainer: {
    marginBottom: 12,
  },
  districtMap: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  districtZone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  zoneLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  mapPlaceholder: {
    height: 120,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 4,
  },
  mapSubtext: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  mapLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
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
  reportCardGradient: {
    padding: 14,
  },
  reportCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
    marginBottom: 12,
    paddingBottom: 4,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: 4,
    marginBottom: 4,
  },
  chartLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  symptomsList: {
    gap: 6,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  symptomIcon: {
    fontSize: 14,
  },
  symptomName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
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
  alertsCardGradient: {
    padding: 14,
  },
  alertsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  alertItem: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  alertIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertInfo: {
    flex: 1,
    gap: 2,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  alertDetail: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  alertTime: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
  },
  moreButtonText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
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
  createButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
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
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  bottomCards: {
    flexDirection: 'row',
    gap: 10,
  },
  bottomCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  bottomCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bottomCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  bottomCardSubtext: {
    fontSize: 9,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});
