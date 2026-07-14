import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useReports } from '../../context/ReportsContext';
import { RiskBadge } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import type { SymptomReport } from '../../data/mockData';

export function MyReportsScreen() {
  const { reports } = useReports();

  const renderItem = ({ item }: { item: SymptomReport }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerInfo}>
          <Text style={styles.cardDate}>{item.date}</Text>
          <Text style={styles.cardLocation}>
            {item.district}
            {item.community ? ` · ${item.community}` : ''}
          </Text>
        </View>
        <RiskBadge level={item.risk} />
      </View>

      {item.age || item.sex ? (
        <Text style={styles.patientMeta}>
          Paciente: {item.age ? `${item.age} años` : ''}
          {item.age && item.sex ? ' · ' : ''}
          {item.sex ? item.sex : ''}
        </Text>
      ) : null}

      <View style={styles.symptomsContainer}>
        <Text style={styles.symptomsLabel}>Síntomas:</Text>
        <Text style={styles.cardSymptoms}>{item.symptoms.join(', ')}</Text>
      </View>

      {item.reasoning ? (
        <View style={styles.reasoningCard}>
          <Text style={styles.reasoningTitle}>🔍 Análisis Explicativo de la IA</Text>
          <Text style={styles.reasoningText}>{item.reasoning}</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={reports}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={<Text style={styles.title}>Mis reportes</Text>}
      ListEmptyComponent={<Text style={styles.empty}>Aún no tienes reportes.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  card: { backgroundColor: colors.surface, borderRadius: 20, padding: 18, gap: 10, borderWidth: 1, borderColor: colors.border, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerInfo: { gap: 2 },
  cardDate: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },
  cardLocation: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  patientMeta: { fontSize: 12, color: colors.textSecondary, backgroundColor: colors.background, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  symptomsContainer: { flexDirection: 'row', gap: 6, alignItems: 'center', flexWrap: 'wrap' },
  symptomsLabel: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  cardSymptoms: { fontSize: 13, color: colors.textSecondary },
  reasoningCard: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, borderLeftWidth: 3, borderLeftColor: colors.primary, marginTop: 4, gap: 4 },
  reasoningTitle: { fontSize: 12, fontWeight: '700', color: colors.primary },
  reasoningText: { fontSize: 12, color: colors.textSecondary, lineHeight: 16 },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 },
});
