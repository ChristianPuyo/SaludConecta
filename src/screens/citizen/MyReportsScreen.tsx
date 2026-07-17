import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useReports } from '../../context/ReportsContext';
import { RiskBadge } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import type { SymptomReport } from '../../data/mockData';

export function MyReportsScreen() {
  const { reports } = useReports();

  const renderItem = ({ item, index }: { item: SymptomReport; index: number }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 100).springify()}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardDate}>{item.date}</Text>
          <RiskBadge level={item.risk} />
        </View>
        <Text style={styles.cardDistrict}>{item.district}</Text>
        <Text style={styles.cardSymptoms}>{item.symptoms.join(', ')}</Text>
      </View>
    </Animated.View>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={reports}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={
        <Animated.View entering={FadeIn.duration(500)}>
          <Text style={styles.title}>Mis reportes</Text>
        </Animated.View>
      }
      ListEmptyComponent={
        <Animated.View entering={FadeIn.duration(500)}>
          <Text style={styles.empty}>Aún no tienes reportes.</Text>
        </Animated.View>
      }
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
