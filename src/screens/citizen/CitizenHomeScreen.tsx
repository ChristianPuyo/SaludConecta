import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Linking, ImageBackground, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useReports } from '../../context/ReportsContext';
import { RiskBadge } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import {
  MOCK_DISTRICT_RISK,
  MOCK_ALERTS,
  SYMPTOM_RECOMMENDATIONS,
  PREVENTIVE_TIPS,
  HEALTH_STATISTICS,
  getRiskDistribution,
} from '../../data/mockData';
import type { CitizenStackParamList } from '../../navigation/CitizenStackNavigator';

type Nav = NavigationProp<CitizenStackParamList>;

export function CitizenHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { reports } = useReports();
  const lastReport = reports[0];
  const riskDist = getRiskDistribution(reports);
  const [expandedSymptom, setExpandedSymptom] = useState<string | null>(null);

  const goToReportSymptoms = () => {
    navigation.getParent()?.navigate('ReportSymptoms');
  };

  const callEmergency = () => {
    Alert.alert(
      'Emergencia',
      '¿Deseas llamar al sistema de emergencias (116)?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Llamar', onPress: () => Linking.openURL('tel:116') },
      ],
    );
  };

  const getRecommendation = (symptom: string) => {
    return SYMPTOM_RECOMMENDATIONS[symptom] || null;
  };

  const getAvailableSymptoms = () => {
    if (!lastReport) return [];
    return lastReport.symptoms.filter((s) => SYMPTOM_RECOMMENDATIONS[s]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <ImageBackground
          source={require('../../../assets/hospital.jpg')}
          style={styles.headerImageBg}
          imageStyle={styles.headerImage}
        />
        <LinearGradient
          colors={['rgba(2, 132, 199, 0.95)', 'rgba(56, 189, 248, 0.4)', 'rgba(2, 132, 199, 0.95)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>Hola 👋</Text>
                <Text style={styles.subtitle}>Guardian Salud AI cuida de tu comunidad</Text>
              </View>
              <Pressable style={styles.emergencyButton} onPress={callEmergency}>
                <Ionicons name="call" size={20} color="#FFF" />
              </Pressable>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{HEALTH_STATISTICS.totalReports}</Text>
                <Text style={styles.statLabel}>Reportes</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#FCD34D' }]}>{HEALTH_STATISTICS.activeAlerts}</Text>
                <Text style={styles.statLabel}>Alertas</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{HEALTH_STATISTICS.vaccinated}</Text>
                <Text style={styles.statLabel}>Vacunados</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{HEALTH_STATISTICS.communitiesMonitored}</Text>
                <Text style={styles.statLabel}>Comunidades</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.contentArea}>
        {/* RIESGO DISTRITO */}
        <View style={styles.sectionHeader}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}>RIESGO ACTUAL EN TU DISTRITO</Text>
        </View>

        <View style={styles.districtCard}>
          <LinearGradient colors={['#F0FDFA', '#FFFFFF']} style={styles.districtCardGradient}>
            <View style={styles.districtInfo}>
              <Text style={styles.districtName}>Callería</Text>
              <Text style={styles.districtDetail}>42 reportes activos en tu zona</Text>
            </View>
            <View style={styles.riskBadgeContainer}>
              <RiskBadge level="medio" />
            </View>
          </LinearGradient>
          <View style={styles.districtStats}>
            {riskDist.map((r) => (
              <View key={r.level} style={styles.districtStatItem}>
                <View
                  style={[
                    styles.districtStatDot,
                    { backgroundColor: r.level === 'alto' ? '#EF4444' : r.level === 'medio' ? '#F59E0B' : '#22C55E' },
                  ]}
                />
                <Text style={styles.districtStatText}>
                  {r.count} {r.level}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ULTIMO REPORTE */}
        {lastReport && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={16} color={colors.primary} />
              <Text style={styles.sectionTitle}>TU ÚLTIMO REPORTE ({lastReport.date.toUpperCase()})</Text>
            </View>

            <View style={styles.reportCard}>
              <LinearGradient colors={['#FFF7ED', '#FFFFFF']} style={styles.reportCardGradient}>
                <View style={styles.reportInfo}>
                  <Text style={styles.symptomsText}>{lastReport.symptoms.join(', ')}</Text>
                  <Text style={styles.reportDistrict}>Distrito: {lastReport.district}</Text>
                </View>
                <RiskBadge level={lastReport.risk} />
              </LinearGradient>
            </View>
          </>
        )}

        {/* RECOMENDACIONES MEDICAMENTOS */}
        {getAvailableSymptoms().length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="medical" size={16} color={colors.primary} />
              <Text style={styles.sectionTitle}>RECOMENDACIONES PARA TUS SÍNTOMAS</Text>
            </View>

            {getAvailableSymptoms().map((symptom) => {
              const rec = getRecommendation(symptom);
              if (!rec) return null;
              const isExpanded = expandedSymptom === symptom;

              return (
                <Pressable
                  key={symptom}
                  style={({ pressed }) => [styles.recommendationCard, pressed && styles.recommendationCardPressed]}
                  onPress={() => setExpandedSymptom(isExpanded ? null : symptom)}
                >
                  <LinearGradient colors={['#F0F9FF', '#FFFFFF']} style={styles.recommendationGradient}>
                    <View style={styles.recommendationHeader}>
                      <View style={styles.recommendationTitleRow}>
                        <Ionicons name="pulse" size={18} color={colors.primary} />
                        <Text style={styles.recommendationTitle}>{rec.symptom}</Text>
                      </View>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color={colors.textSecondary}
                      />
                    </View>

                    {isExpanded && (
                      <View style={styles.recommendationContent}>
                        {/* Medicamentos */}
                        <View style={styles.recSection}>
                          <Text style={styles.recSectionTitle}>💊 Medicamentos sugeridos</Text>
                          {rec.medications.map((med, i) => (
                            <View key={i} style={styles.medItem}>
                              <View style={styles.medHeader}>
                                <Text style={styles.medName}>{med.name}</Text>
                                <Text style={styles.medDose}>{med.dose}</Text>
                              </View>
                              <Text style={styles.medFrequency}>Frecuencia: {med.frequency}</Text>
                              <Text style={styles.medPrecautions}>⚠️ {med.precautions}</Text>
                            </View>
                          ))}
                        </View>

                        {/* Remedios caseros */}
                        <View style={styles.recSection}>
                          <Text style={styles.recSectionTitle}>🌿 Remedios caseros</Text>
                          {rec.homeRemedies.map((remedy, i) => (
                            <View key={i} style={styles.remedyItem}>
                              <Ionicons name="checkmark-circle" size={14} color="#22C55E" />
                              <Text style={styles.remedyText}>{remedy}</Text>
                            </View>
                          ))}
                        </View>

                        {/* Advertencias */}
                        <View style={[styles.recSection, { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 12 }]}>
                          <Text style={[styles.recSectionTitle, { color: '#DC2626' }]}>🚨 Advertencias</Text>
                          {rec.warnings.map((warning, i) => (
                            <View key={i} style={styles.warningItem}>
                              <Ionicons name="alert" size={14} color="#DC2626" />
                              <Text style={styles.warningText}>{warning}</Text>
                            </View>
                          ))}
                        </View>

                        {/* Prevenciones */}
                        <View style={[styles.recSection, { backgroundColor: '#F0FDF4', borderRadius: 12, padding: 12 }]}>
                          <Text style={[styles.recSectionTitle, { color: '#16A34A' }]}>🛡️ Prevención</Text>
                          {rec.preventions.map((prev, i) => (
                            <View key={i} style={styles.preventionItem}>
                              <Ionicons name="shield-checkmark" size={14} color="#16A34A" />
                              <Text style={styles.preventionText}>{prev}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </LinearGradient>
                </Pressable>
              );
            })}
          </>
        )}

        {/* TIPS PREVENTIVOS */}
        <View style={styles.sectionHeader}>
          <Ionicons name="bulb" size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}>CONSEJOS PREVENTIVOS</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tipsScroll}>
          {PREVENTIVE_TIPS.map((tip) => (
            <Pressable
              key={tip.id}
              style={({ pressed }) => [styles.tipCard, pressed && styles.tipCardPressed]}
              onPress={() => Alert.alert(tip.title, tip.description)}
            >
              <View style={styles.tipIcon}>
                <Ionicons name={tip.icon as any} size={22} color={colors.primary} />
              </View>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription} numberOfLines={2}>
                {tip.description}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* ALERTAS RECIENTES */}
        <View style={styles.sectionHeader}>
          <Ionicons name="alert-circle" size={16} color={colors.danger} />
          <Text style={styles.sectionTitle}>ALERTAS COMUNITARIAS</Text>
        </View>

        {MOCK_ALERTS.slice(0, 2).map((alert) => (
          <Pressable
            key={alert.id}
            style={({ pressed }) => [styles.alertCard, pressed && styles.alertCardPressed]}
            onPress={() => Alert.alert(alert.title, `${alert.detail}\n\nDistrito: ${alert.district}\nFecha: ${alert.date}`)}
          >
            <View style={[styles.alertIconWrap, { backgroundColor: alert.risk === 'alto' ? '#FEE2E2' : '#FEF3C7' }]}>
              <Ionicons
                name={alert.risk === 'alto' ? 'alert-circle' : 'information-circle'}
                size={20}
                color={alert.risk === 'alto' ? '#EF4444' : '#F59E0B'}
              />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertDetail} numberOfLines={1}>{alert.detail}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
          </Pressable>
        ))}

        {/* BOTONES RAPIDOS */}
        <View style={styles.sectionHeader}>
          <Ionicons name="flash" size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}>ACCIONES RÁPIDAS</Text>
        </View>

        <View style={styles.quickActions}>
          <Pressable
            style={({ pressed }) => [styles.quickAction, pressed && styles.quickActionPressed]}
            onPress={goToReportSymptoms}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="add-circle" size={24} color="#2563EB" />
            </View>
            <Text style={styles.quickActionText}>Reportar{'\n'}Síntomas</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.quickAction, pressed && styles.quickActionPressed]}
            onPress={() => navigation.navigate('SaludEscolar')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="school" size={24} color="#059669" />
            </View>
            <Text style={styles.quickActionText}>Salud{'\n'}Escolar</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.quickAction, pressed && styles.quickActionPressed]}
            onPress={() => navigation.navigate('RecursosMedicos')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="medical" size={24} color="#DB2777" />
            </View>
            <Text style={styles.quickActionText}>Recursos{'\n'}Médicos</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.quickAction, pressed && styles.quickActionPressed]}
            onPress={() => navigation.navigate('Directorio')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="call" size={24} color="#D97706" />
            </View>
            <Text style={styles.quickActionText}>Directorio{'\n'}Contactos</Text>
          </Pressable>
        </View>

        {/* BOTON REPORTAR */}
        <Pressable
          style={({ pressed }) => [styles.reportButton, pressed && styles.reportButtonPressed]}
          onPress={goToReportSymptoms}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.reportButtonGradient}
          >
            <Text style={styles.reportButtonText}>Reportar síntomas ahora</Text>
            <View style={styles.plusIconContainer}>
              <Ionicons name="add" size={22} color="#fff" />
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1 },
  headerContainer: {
    height: 220,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    marginBottom: -10,
  },
  headerImageBg: {
    ...StyleSheet.absoluteFillObject,
  },
  headerImage: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    flex: 1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greeting: { fontSize: 30, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' },
  emergencyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 12,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 10, color: 'rgba(255, 255, 255, 0.8)', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255, 255, 255, 0.3)' },
  contentArea: { padding: 20, gap: 14, marginTop: -10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, letterSpacing: 0.5 },
  districtCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  districtCardGradient: { padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  districtInfo: { flex: 1, gap: 4 },
  districtName: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  districtDetail: { fontSize: 12, color: colors.textSecondary },
  riskBadgeContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  districtStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  districtStatItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  districtStatDot: { width: 8, height: 8, borderRadius: 4 },
  districtStatText: { fontSize: 11, color: colors.textSecondary, textTransform: 'capitalize' },
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
  reportCardGradient: { padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reportInfo: { flex: 1, gap: 4 },
  symptomsText: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  reportDistrict: { fontSize: 12, color: colors.textSecondary },
  recommendationCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  recommendationCardPressed: { transform: [{ scale: 0.98 }] },
  recommendationGradient: { padding: 14 },
  recommendationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recommendationTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recommendationTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  recommendationContent: { marginTop: 14, gap: 12 },
  recSection: { gap: 6 },
  recSectionTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  medItem: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 10, gap: 4 },
  medHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  medName: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  medDose: { fontSize: 12, fontWeight: '600', color: colors.primary, backgroundColor: '#F0FDFA', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  medFrequency: { fontSize: 11, color: colors.textSecondary },
  medPrecautions: { fontSize: 11, color: '#D97706', fontStyle: 'italic' },
  remedyItem: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 2 },
  remedyText: { fontSize: 12, color: colors.textSecondary, flex: 1 },
  warningItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, paddingVertical: 2 },
  warningText: { fontSize: 12, color: '#DC2626', flex: 1, lineHeight: 16 },
  preventionItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, paddingVertical: 2 },
  preventionText: { fontSize: 12, color: '#16A34A', flex: 1, lineHeight: 16 },
  tipsScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  tipCard: {
    width: 140,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tipCardPressed: { transform: [{ scale: 0.97 }], backgroundColor: '#F0FDF4' },
  tipIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0FDFA', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  tipTitle: { fontSize: 12, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  tipDescription: { fontSize: 10, color: colors.textSecondary, lineHeight: 14 },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  alertCardPressed: { backgroundColor: '#F8FAFC', transform: [{ scale: 0.98 }] },
  alertIconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  alertContent: { flex: 1, gap: 2 },
  alertTitle: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  alertDetail: { fontSize: 11, color: colors.textSecondary },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActionPressed: { backgroundColor: '#F0FDF4', transform: [{ scale: 0.95 }] },
  quickActionIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  quickActionText: { fontSize: 10, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },
  reportButton: {
    marginTop: 8,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  reportButtonPressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  reportButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  reportButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  plusIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
