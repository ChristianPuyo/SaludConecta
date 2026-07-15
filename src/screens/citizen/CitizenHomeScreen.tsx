import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useReports } from '../../context/ReportsContext';
import { RiskBadge } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import type { CitizenStackParamList } from '../../navigation/CitizenStackNavigator';

type Nav = NavigationProp<CitizenStackParamList>;

export function CitizenHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { reports } = useReports();
  const lastReport = reports[0];

  const goToReportSymptoms = () => {
    const parentNav = navigation.getParent();
    if (parentNav) {
      parentNav.navigate('ReportSymptoms');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={[colors.primaryDark, colors.primary, '#14B8A6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.greeting}>Hola 👋</Text>
        <Text style={styles.subtitle}>Guardian Salud AI cuida de tu comunidad</Text>

        <View style={styles.headerDecoration}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
        </View>
      </LinearGradient>

      <View style={styles.contentArea}>
        <View style={styles.sectionHeader}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.sectionTitle}>RIESGO ACTUAL EN TU DISTRITO</Text>
        </View>

        <View style={styles.districtCard}>
          <LinearGradient
            colors={['#F0FDFA', '#FFFFFF']}
            style={styles.districtCardGradient}
          >
            <View style={styles.districtInfo}>
              <Text style={styles.districtName}>Callería</Text>
              <Text style={styles.districtDetail}>Reporte Info: Callería 3S 303120</Text>
            </View>
            <View style={styles.riskBadgeContainer}>
              <RiskBadge level="bajo" />
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
            </View>
          </LinearGradient>
        </View>

        {lastReport && (
          <>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={16} color={colors.primary} />
              <Text style={styles.sectionTitle}>TU ÚLTIMO REPORTE ({lastReport.date.toUpperCase()})</Text>
            </View>

            <View style={styles.reportCard}>
              <LinearGradient
                colors={['#FFF7ED', '#FFFFFF']}
                style={styles.reportCardGradient}
              >
                <View style={styles.reportInfo}>
                  <Text style={styles.symptomsText}>{lastReport.symptoms.join(', ')}</Text>
                </View>
                <View style={styles.riskBadgeContainer}>
                  <RiskBadge level={lastReport.risk} />
                  <Ionicons name="warning" size={18} color={colors.warning} />
                </View>
              </LinearGradient>
            </View>
          </>
        )}

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
            <Text style={styles.reportButtonText}>Reportar síntomas</Text>
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  headerDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 200,
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute',
    top: -30,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  circle2: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  contentArea: {
    padding: 20,
    gap: 16,
    marginTop: -10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
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
  districtCardGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  districtInfo: {
    flex: 1,
    gap: 4,
  },
  districtName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  districtDetail: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  riskBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reportInfo: {
    flex: 1,
  },
  symptomsText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  reportButton: {
    marginTop: 12,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  reportButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  reportButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  reportButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },
  plusIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
