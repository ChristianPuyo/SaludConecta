import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_CAMPAIGNS, type SmartCampaign, DISEASE_LABELS, DISEASE_COLORS } from '../../data/mockData';
import { RiskBadge } from '../../components/RiskBadge';
import { colors, borderRadius, spacing, typography } from '../../theme/colors';

const RISK_FOR_DISEASE: Record<string, 'bajo' | 'medio' | 'alto'> = {
  dengue: 'alto', respiratoria: 'medio', diarrea: 'medio', malaria: 'alto', leptospirosis: 'alto', otra: 'bajo',
};

export function SmartCampaignsScreen() {
  const renderItem = ({ item, index }: { item: SmartCampaign; index: number }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(25)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 100, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 8, delay: index * 100, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, delay: index * 100, useNativeDriver: true }),
      ]).start();
    }, []);

    return (
      <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }]}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.iconWrap, { backgroundColor: DISEASE_COLORS[item.diseaseType] + '15' }]}>
                <Ionicons name="megaphone" size={20} color={DISEASE_COLORS[item.diseaseType]} />
              </View>
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.cardMeta}>
                  <Ionicons name="location" size={12} color={colors.textMuted} />
                  <Text style={styles.cardDistrict}>{item.district}</Text>
                </View>
              </View>
            </View>
            <RiskBadge level={RISK_FOR_DISEASE[item.diseaseType] || 'bajo'} size="sm" />
          </View>
          <Text style={styles.cardDetail}>{item.description}</Text>
          <View style={styles.cardFooter}>
            <View style={styles.statBadge}>
              <Ionicons name="people" size={14} color={colors.textMuted} />
              <Text style={styles.statText}>{item.notificationsSent} notificados</Text>
            </View>
            <View style={[styles.statusBadge, item.active ? styles.activeBadge : styles.inactiveBadge]}>
              <View style={[styles.statusDot, { backgroundColor: item.active ? colors.success : colors.textMuted }]} />
              <Text style={[styles.statusText, item.active ? styles.activeText : styles.inactiveText]}>
                {item.active ? 'Activa' : 'Inactiva'}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={MOCK_CAMPAIGNS}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Campañas Inteligentes</Text>
          <Text style={styles.subtitle}>Recomendaciones preventivas generadas por IA</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoIconWrap}>
              <Ionicons name="bulb" size={20} color={colors.warning} />
            </View>
            <Text style={styles.infoText}>
              La IA detecta incrementos de enfermedades y genera campañas contextuales para tu comunidad.
            </Text>
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 40 },
  header: { marginBottom: spacing.xl, gap: spacing.sm },
  title: { fontSize: typography.xxxl, fontWeight: '900', color: colors.textPrimary },
  subtitle: { fontSize: typography.md, color: colors.textSecondary },
  infoCard: {
    flexDirection: 'row', gap: spacing.md, backgroundColor: '#FFFBEB',
    borderRadius: borderRadius.xl, padding: spacing.lg, marginTop: spacing.md, alignItems: 'flex-start',
    borderWidth: 1, borderColor: '#FDE68A',
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: { fontSize: typography.sm, color: colors.textSecondary, flex: 1, lineHeight: 20 },
  card: {
    backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md, gap: spacing.md,
    ...colors.shadowMd,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, flex: 1 },
  iconWrap: { width: 44, height: 44, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center' },
  cardHeaderText: { flex: 1, gap: spacing.xs },
  cardTitle: { fontSize: typography.base, fontWeight: '700', color: colors.textPrimary, lineHeight: 20 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  cardDistrict: { fontSize: typography.sm, color: colors.textMuted, fontWeight: '600' },
  cardDetail: { fontSize: typography.sm, color: colors.textSecondary, lineHeight: 20 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.borderLight },
  statBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  statText: { fontSize: typography.sm, color: colors.textMuted, fontWeight: '600' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: typography.sm, fontWeight: '700' },
  activeText: { color: colors.success },
  inactiveText: { color: colors.textMuted },
  activeBadge: { backgroundColor: '#DCFCE7' },
  inactiveBadge: { backgroundColor: colors.surfaceMuted },
});
