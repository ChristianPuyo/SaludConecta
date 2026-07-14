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
        <Text style={styles.cardDate}>{item.date}</Text>
        <RiskBadge level={item.risk} />
      </View>
      <Text style={styles.cardDistrict}>{item.district}</Text>
      <Text style={styles.cardSymptoms}>{item.symptoms.join(', ')}</Text>
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
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, gap: 6, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardDate: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  cardDistrict: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardSymptoms: { fontSize: 14, color: colors.textSecondary },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40 },
});
