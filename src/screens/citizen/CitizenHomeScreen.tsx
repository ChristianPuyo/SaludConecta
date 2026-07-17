import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useReports } from '../../context/ReportsContext';
import { RiskBadge } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import { AutoCarousel } from '../../components/AutoCarousel';
import { BannerSlide } from '../../components/BannerSlide';
import type { CitizenTabParamList } from '../../navigation/CitizenNavigator';

type Nav = BottomTabNavigationProp<CitizenTabParamList, 'Home'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_MARGIN = 20;
const CAROUSEL_WIDTH = SCREEN_WIDTH - CAROUSEL_MARGIN * 2;

const CAROUSEL_ITEMS = [
  {
    imageSource: require('../../img/img.png'),
    icon: 'shield-checkmark',
    tag: 'Proteccion activa',
    title: 'Tu comunidad esta vigilada',
    subtitle: 'El sistema de alerta comunitaria monitorea patrones epidemiologicos en tiempo real.',
  },
  {
    imageSource: require('../../img/img1.png'),
    icon: 'pulse',
    tag: 'Salud preventiva',
    title: 'Reporta sintomas al instante',
    subtitle: 'Tu reporte ayuda a detectar brotes de enfermedades antes de que se propaguen.',
  },
  {
    imageSource: require('../../img/img2.png'),
    icon: 'analytics',
    tag: 'IA predictiva',
    title: 'Analisis inteligente',
    subtitle: 'La inteligencia artificial predice focos de riesgo en la region Ucayali.',
  },
];

export function CitizenHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { reports } = useReports();
  const lastReport = reports[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Carrusel automatico */}
      <AutoCarousel
        height={220}
        items={CAROUSEL_ITEMS.map((item, i) => (
          <BannerSlide key={i} {...item} />
        ))}
      />

      {/* Hero card */}
      <View style={styles.heroCard}>
        <View style={styles.heroGlow} />
        <View style={styles.heroTextWrap}>
          <View style={styles.heroTagRow}>
            <View style={styles.heroDot} />
            <Text style={styles.heroTag}>SISTEMA DE ALERTA COMUNITARIA</Text>
          </View>
          <Text style={styles.welcomeTitle}>Hola!</Text>
          <Text style={styles.welcomeSubtitle}>Guardian Salud AI activo para Ucayali</Text>
        </View>
        <View style={styles.locationBadge}>
          <Ionicons name="location-sharp" size={13} color={colors.primary} />
          <Text style={styles.locationText}>Calleria</Text>
        </View>
      </View>

      {/* Riesgo distrito */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Riesgo en tu distrito</Text>
      </View>

      <View style={styles.cardAlert}>
        <View style={styles.cardAccentBar} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleWrap}>
              <Text style={styles.districtTitle}>Calleria - Pucallpa</Text>
              <RiskBadge level="medio" />
            </View>
            <View style={styles.iconPill}>
              <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.cardHint}>
            Vigilancia activa basada en reportes ciudadanos de los ultimos 7 dias.
          </Text>
        </View>
      </View>

      {/* Ultimo reporte */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tu ultimo reporte</Text>
      </View>

      {lastReport ? (
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardTitleWrap}>
              <Text style={styles.cardDate}>{lastReport.date}</Text>
              <Text style={styles.cardDistrict}>{lastReport.district}</Text>
            </View>
            <RiskBadge level={lastReport.risk} />
          </View>
          <View style={styles.symptomsRow}>
            {lastReport.symptoms.map((s) => (
              <View key={s} style={styles.symptomTag}>
                <Text style={styles.symptomText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.cardEmpty}>
          <Ionicons name="checkmark-circle" size={36} color={colors.success} />
          <Text style={styles.cardEmptyText}>No has registrado reportes de sintomas hoy.</Text>
        </View>
      )}

      {/* Boton moderno Reportar */}
      <Pressable
        style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
        onPress={() => navigation.navigate('ReportSymptoms')}
      >
        <View style={styles.ctaGlow} />
        <View style={styles.ctaContent}>
          <View style={styles.ctaIconWrap}>
            <Ionicons name="pulse" size={22} color="#fff" />
          </View>
          <View style={styles.ctaTextWrap}>
            <Text style={styles.ctaTitle}>Reportar Sintomas</Text>
            <Text style={styles.ctaDesc}>Registrar nuevos sintomas ahora</Text>
          </View>
          <View style={styles.ctaArrow}>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </View>
        </View>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: CAROUSEL_MARGIN, paddingTop: 12, gap: 12 },
  heroCard: {
    position: 'relative',
    backgroundColor: '#F0FDF9',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    right: -12,
    top: -12,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
  },
  heroTextWrap: { flex: 1, gap: 4, zIndex: 1 },
  heroTagRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary },
  heroTag: { fontSize: 10, fontWeight: '700', color: colors.primary, letterSpacing: 0.8 },
  welcomeTitle: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  welcomeSubtitle: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#99F6E4',
    zIndex: 1,
  },
  locationText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  sectionHeader: { marginTop: 4 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardAlert: {
    position: 'relative',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.warning,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  cardContent: { padding: 14, paddingLeft: 18, gap: 8 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitleWrap: { flex: 1, gap: 4 },
  districtTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  iconPill: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHint: { fontSize: 11, color: colors.textSecondary, lineHeight: 16 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardDate: { fontSize: 11, color: colors.textTertiary, fontWeight: '600' },
  cardDistrict: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  symptomsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  symptomTag: {
    backgroundColor: colors.borderLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  symptomText: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  cardEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 22,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  cardEmptyText: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },
  /* Boton CTA moderno */
  ctaButton: {
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 4,
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
  },
  ctaButtonPressed: {
    transform: [{ scale: 0.97 }],
    elevation: 3,
    shadowOpacity: 0.15,
  },
  ctaGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
    borderRadius: 18,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: 'transparent',
  },
  ctaIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  ctaTextWrap: { flex: 1, gap: 2 },
  ctaTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  ctaDesc: { fontSize: 11, color: 'rgba(255,255,255,0.8)', lineHeight: 15 },
  ctaArrow: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
