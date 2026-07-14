import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MOCK_CAMPAIGNS, type SmartCampaign, DISEASE_LABELS, DISEASE_COLORS, type DiseaseType } from '../../data/mockData';
import { RiskBadge } from '../../components/RiskBadge';
import { colors, shadows } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const RISK_FOR_DISEASE: Record<string, 'bajo' | 'medio' | 'alto'> = {
  dengue: 'alto',
  respiratoria: 'medio',
  diarrea: 'medio',
  malaria: 'alto',
  leptospirosis: 'alto',
  otra: 'bajo',
};

export function SmartCampaignsScreen() {
  const renderItem = ({ item }: { item: SmartCampaign }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.cardIconWrap, { backgroundColor: DISEASE_COLORS[item.diseaseType] + '15' }]}>
          <Ionicons name="megaphone" size={22} color={DISEASE_COLORS[item.diseaseType]} />
        </View>
        <View style={styles.cardTopRight}>
          <RiskBadge level={RISK_FOR_DISEASE[item.diseaseType] || 'bajo'} />
          <View style={[styles.statusDot, { backgroundColor: item.active ? colors.success : colors.textTertiary }]} />
        </View>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
          <Text style={styles.cardDistrict}>{item.district}</Text>
        </View>
        <View style={[styles.diseaseTag, { backgroundColor: DISEASE_COLORS[item.diseaseType] + '20' }]}>
          <Text style={[styles.diseaseTagText, { color: DISEASE_COLORS[item.diseaseType] }]}>
            {DISEASE_LABELS[item.diseaseType]}
          </Text>
        </View>
      </View>
      <Text style={styles.cardDetail}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.footerText}>{item.notificationsSent} notificados</Text>
        </View>
        <View style={[styles.footerItem, { backgroundColor: item.active ? colors.successLight : colors.backgroundAlt, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }]}>
          <Text style={[styles.footerText, { color: item.active ? colors.success : colors.textSecondary, fontWeight: '700' }]}>
            {item.active ? '● Activa' : '○ Inactiva'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={MOCK_CAMPAIGNS}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Ionicons name="megaphone" size={24} color={colors.primary} />
            <View>
              <Text style={styles.title}>Campañas Inteligentes</Text>
              <Text style={styles.subtitle}>Generadas automáticamente por IA</Text>
            </View>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoIconWrap}>
              <Ionicons name="bulb" size={18} color={colors.warning} />
            </View>
            <Text style={styles.infoText}>
              La IA detecta incrementos de enfermedades y genera campañas preventivas contextuales para tu comunidad.
            </Text>
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 16, gap: 12 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary },
  infoCard: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 14,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  infoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: { fontSize: 12, color: colors.textSecondary, flex: 1, lineHeight: 17 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    gap: 10,
    ...shadows.medium,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTopRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardDistrict: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  diseaseTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  diseaseTagText: { fontSize: 10, fontWeight: '700' },
  cardDetail: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
});
