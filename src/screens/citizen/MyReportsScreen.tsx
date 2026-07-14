import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useReports } from '../../context/ReportsContext';
import { colors } from '../../theme/colors';
import { DISEASE_LABELS, DISEASE_COLORS, type SymptomReport } from '../../data/mockData';

export function MyReportsScreen() {
  const { reports } = useReports();

  const renderItem = ({ item }: { item: SymptomReport }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardDate}>{item.date}</Text>
        <View style={[styles.riskBadge, { backgroundColor: item.risk === 'alto' ? '#FEE2E2' : item.risk === 'medio' ? '#FEF3C7' : '#DCFCE7' }]}>
          <Text style={[styles.riskBadgeText, { color: item.risk === 'alto' ? colors.danger : item.risk === 'medio' ? colors.warning : colors.success }]}>
            Riesgo {item.risk}
          </Text>
        </View>
      </View>
      <View style={styles.cardMeta}>
        <Text style={styles.cardDistrict}>{item.district} · {item.community}</Text>
        {item.diseaseType && (
          <View style={[styles.diseaseTag, { backgroundColor: DISEASE_COLORS[item.diseaseType] + '20' }]}>
            <Text style={[styles.diseaseTagText, { color: DISEASE_COLORS[item.diseaseType] }]}>
              {DISEASE_LABELS[item.diseaseType]}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.cardSymptoms}>{item.symptoms.join(', ')}</Text>
      {item.riskExplanation && (
        <Text style={styles.riskExplanation}>💡 {item.riskExplanation}</Text>
      )}
      {(item.age || item.sex) && (
        <Text style={styles.demographicInfo}>
          {item.age ? `${item.age} años` : ''}{item.age && item.sex ? ' · ' : ''}{item.sex === 'M' ? 'Masculino' : item.sex === 'F' ? 'Femenino' : ''}
        </Text>
      )}
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
        <View style={styles.header}>
          <Text style={styles.title}>Mis reportes</Text>
          <Text style={styles.subtitle}>{reports.length} reporte(s) registrado(s)</Text>
        </View>
      }
      ListEmptyComponent={<Text style={styles.empty}>Aún no tienes reportes.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 12 },
  header: { marginBottom: 4, gap: 2 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary },
  card: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 16, gap: 6,
    borderWidth: 1, borderColor: colors.border, marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDate: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  riskBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  riskBadgeText: { fontWeight: '700', fontSize: 12, textTransform: 'capitalize' },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDistrict: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  diseaseTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  diseaseTagText: { fontSize: 10, fontWeight: '600' },
  cardSymptoms: { fontSize: 14, color: colors.textSecondary },
  riskExplanation: { fontSize: 12, color: colors.textSecondary, fontStyle: 'italic', lineHeight: 17 },
  demographicInfo: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 },
});
