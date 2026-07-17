import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useReports } from '../../context/ReportsContext';
import { RiskBadge } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import { AutoCarousel } from '../../components/AutoCarousel';
import { BannerSlide } from '../../components/BannerSlide';
import type { SymptomReport } from '../../data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_MARGIN = 20;

const CAROUSEL_ITEMS = [
  {
    imageSource: require('../../img/img3.png'),
    icon: 'documents',
    tag: 'Historial',
    title: 'Tus reportes en un solo lugar',
    subtitle: 'Revisa todos los reportes epidemiologicos que has enviado.',
  },
  {
    imageSource: require('../../img/img.png'),
    icon: 'shield-checkmark',
    tag: 'Seguimiento',
    title: 'Monitorea tu estado',
    subtitle: 'Cada reporte registra el nivel de riesgo clasificado por la IA.',
  },
];

export function MyReportsScreen() {
  const { reports } = useReports();

  const renderItem = ({ item }: { item: SymptomReport }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.dateIconWrap}>
            <Ionicons name="calendar" size={12} color={colors.textSecondary} />
          </View>
          <Text style={styles.cardDate}>{item.date}</Text>
        </View>
        <RiskBadge level={item.risk} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.districtRow}>
          <Ionicons name="location" size={13} color={colors.textTertiary} />
          <Text style={styles.cardDistrict}>{item.district}</Text>
        </View>
        <View style={styles.symptomsRow}>
          {item.symptoms.map((s) => (
            <View key={s} style={styles.symptomTag}>
              <Text style={styles.symptomText}>{s}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={reports}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={
        <>
          <AutoCarousel
            height={220}
            items={CAROUSEL_ITEMS.map((item, i) => (
              <BannerSlide key={i} {...item} />
            ))}
          />
          <View style={styles.headerSection}>
            <View style={styles.headerIcon}>
              <Ionicons name="document-text" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.title}>Mis Reportes</Text>
              <Text style={styles.subtitle}>Historial de reportes epidemiologicos</Text>
            </View>
          </View>
        </>
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="document-outline" size={36} color={colors.textTertiary} />
          </View>
          <Text style={styles.emptyTitle}>Sin reportes aun</Text>
          <Text style={styles.emptyDesc}>Tus reportes epidemiologicos apareceran aqui.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: CAROUSEL_MARGIN, paddingTop: 12, gap: 10 },
  headerSection: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  headerIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateIconWrap: { width: 22, height: 22, borderRadius: 7, backgroundColor: colors.borderLight, alignItems: 'center', justifyContent: 'center' },
  cardDate: { fontSize: 11, color: colors.textTertiary, fontWeight: '600' },
  cardBody: { gap: 6 },
  districtRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardDistrict: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  symptomsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  symptomTag: { backgroundColor: colors.borderLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  symptomText: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 40, gap: 10 },
  emptyIconWrap: { width: 64, height: 64, borderRadius: 20, backgroundColor: colors.borderLight, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  emptyDesc: { fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
});
