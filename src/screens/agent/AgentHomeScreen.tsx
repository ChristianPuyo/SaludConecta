import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useVisits } from '../../context/VisitsContext';
import { colors, borderRadius, spacing, typography } from '../../theme/colors';
import type { AgentTabParamList } from '../../navigation/AgentNavigator';
import { Ionicons } from '@expo/vector-icons';

type Nav = BottomTabNavigationProp<AgentTabParamList, 'Home'>;

function AnimatedSection({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: object }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }, style]}>
      {children}
    </Animated.View>
  );
}

export function AgentHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { visits } = useVisits();
  const pending = visits.filter((v) => !v.synced).length;
  const synced = visits.filter((v) => v.synced).length;
  const pregnant = visits.filter((v) => v.pregnant).length;

  const heroFade = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(heroSlide, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Hero Header */}
      <Animated.View style={[styles.heroHeader, { opacity: heroFade, transform: [{ translateY: heroSlide }] }]}>
        <View style={styles.heroDecorCircle1} />
        <View style={styles.heroDecorCircle2} />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Panel del Agente</Text>
          <Text style={styles.heroSubtitle}>Registra la salud de tu comunidad</Text>
        </View>
      </Animated.View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        {[
          { icon: 'people-outline', value: visits.length, label: 'Visitas totales', color: colors.primary, bg: '#F0FDFA' },
          { icon: 'checkmark-circle-outline', value: synced, label: 'Sincronizadas', color: colors.success, bg: '#DCFCE7' },
          { icon: 'sync-outline', value: pending, label: 'Pendientes', color: pending > 0 ? colors.warning : colors.success, bg: pending > 0 ? '#FFFBEB' : '#DCFCE7' },
        ].map((stat, i) => (
          <AnimatedSection key={i} delay={200 + i * 100}>
            <View style={[styles.statCard, { backgroundColor: stat.bg }]}>
              <Ionicons name={stat.icon as any} size={22} color={stat.color} />
              <Text style={[styles.statNumber, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          </AnimatedSection>
        ))}
      </View>

      {/* Banners */}
      <AnimatedSection delay={500}>
        {pregnant > 0 && (
          <View style={styles.pregnantBanner}>
            <View style={styles.pregnantIconWrap}>
              <Ionicons name="heart" size={16} color="#BE185D" />
            </View>
            <Text style={styles.pregnantText}>{pregnant} paciente(s) embarazada(s)</Text>
          </View>
        )}
      </AnimatedSection>

      <AnimatedSection delay={600}>
        <View style={styles.offlineBanner}>
          <View style={styles.offlineIconWrap}>
            <Ionicons name="wifi-outline" size={16} color={colors.secondary} />
          </View>
          <Text style={styles.offlineText}>Modo offline activo · Los datos se sincronizan cuando hay conexión</Text>
        </View>
      </AnimatedSection>

      {/* Últimas Visitas */}
      {visits.length > 0 && (
        <>
          <AnimatedSection delay={700}>
            <Text style={styles.sectionTitle}>Últimas visitas</Text>
          </AnimatedSection>
          {visits.slice(0, 3).map((visit, i) => (
            <AnimatedSection key={visit.id} delay={800 + i * 100}>
              <View style={styles.visitCard}>
                <View style={styles.visitHeader}>
                  <View style={styles.visitHeaderLeft}>
                    <View style={styles.avatarWrap}>
                      <Text style={styles.avatarText}>{visit.patientName.charAt(0)}</Text>
                    </View>
                    <View>
                      <Text style={styles.visitName}>{visit.patientName}</Text>
                      <Text style={styles.visitCommunity}>{visit.community}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, visit.synced ? styles.statusSynced : styles.statusPending]}>
                    <View style={[styles.statusDot, { backgroundColor: visit.synced ? colors.success : colors.warning }]} />
                    <Text style={[styles.statusText, visit.synced ? styles.statusTextSynced : styles.statusTextPending]}>
                      {visit.synced ? 'Sync' : 'Pendiente'}
                    </Text>
                  </View>
                </View>

                <View style={styles.vitalsGrid}>
                  {[
                    { icon: '🌡', value: visit.temperature || 'N/A', unit: '°C', label: 'Temp.' },
                    { icon: '💊', value: visit.bloodPressure || 'N/A', unit: '', label: 'PA' },
                    { icon: '🩸', value: visit.glucose || 'N/A', unit: '', label: 'Glucosa' },
                  ].map((vital, vi) => (
                    <View key={vi} style={styles.vitalItem}>
                      <Text style={styles.vitalIcon}>{vital.icon}</Text>
                      <Text style={styles.vitalValue}>{vital.value}{vital.unit}</Text>
                      <Text style={styles.vitalLabel}>{vital.label}</Text>
                    </View>
                  ))}
                </View>

                {visit.vaccines && visit.vaccines.length > 0 && (
                  <View style={styles.vaccineRow}>
                    <Ionicons name="medkit-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.vaccineText}>Vacunas: {visit.vaccines.join(', ')}</Text>
                  </View>
                )}
                {visit.pregnant && (
                  <View style={styles.pregnantRow}>
                    <Ionicons name="heart" size={14} color="#BE185D" />
                    <Text style={styles.pregnantVisitText}>Embarazada - {visit.pregnancyWeeks || '?'} semanas</Text>
                  </View>
                )}
              </View>
            </AnimatedSection>
          ))}
        </>
      )}

      {/* Botón principal */}
      <AnimatedSection delay={1100}>
        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          onPress={() => navigation.navigate('RegisterVisit')}
        >
          <Ionicons name="add-circle" size={22} color="#fff" />
          <Text style={styles.primaryButtonText}>Registrar nueva visita</Text>
        </Pressable>
      </AnimatedSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 24 },
  heroHeader: {
    backgroundColor: colors.secondary,
    paddingTop: 60,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    position: 'relative',
  },
  heroDecorCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroDecorCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroOverlay: { paddingHorizontal: 24, gap: 4, position: 'relative', zIndex: 1 },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#fff' },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginTop: -20 },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...colors.shadowMd,
  },
  statNumber: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 10, color: colors.textSecondary, textAlign: 'center', fontWeight: '600' },
  pregnantBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FDF2F8',
    borderRadius: borderRadius.xl,
    padding: 14,
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FBCFE8',
  },
  pregnantIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FCE7F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pregnantText: { color: '#BE185D', fontSize: 13, fontWeight: '600', flex: 1 },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: borderRadius.xl,
    padding: 14,
    marginHorizontal: 20,
    marginTop: 12,
  },
  offlineIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineText: { color: colors.secondary, fontSize: 12, fontWeight: '600', flex: 1 },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  visitCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginHorizontal: 20,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...colors.shadowMd,
  },
  visitHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  visitHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: colors.primary },
  visitName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  visitCommunity: { fontSize: 12, color: colors.textSecondary },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  statusSynced: { backgroundColor: colors.successMuted },
  statusPending: { backgroundColor: colors.warningMuted },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusTextSynced: { color: colors.success },
  statusTextPending: { color: colors.warning },
  vitalsGrid: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: 12,
  },
  vitalItem: { flex: 1, alignItems: 'center', gap: 2 },
  vitalIcon: { fontSize: 16 },
  vitalValue: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  vitalLabel: { fontSize: 9, color: colors.textSecondary, fontWeight: '600' },
  vaccineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDFA',
    borderRadius: borderRadius.md,
    padding: 10,
  },
  vaccineText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  pregnantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FDF2F8',
    borderRadius: borderRadius.md,
    padding: 10,
  },
  pregnantVisitText: { fontSize: 11, color: '#BE185D', fontWeight: '600' },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 8,
    ...colors.shadowPrimary,
  },
  primaryButtonPressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
