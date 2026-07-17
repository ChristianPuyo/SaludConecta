import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { SymptomReport } from '../../models/report';
import { reportRepo } from '../../repositories';
import { RecommendationEngine } from '../../domain/recommendations/RecommendationEngine';
import { RiskBadge } from '../../components/RiskBadge';
import { SearchBar } from '../../components/SearchBar';
import { EmptyState } from '../../components/EmptyState';
import { LoadingScreen } from '../../components/ui/LoadingScreen';
import { ErrorView } from '../../components/ui/ErrorView';
import { colors } from '../../theme/colors';
import { timeAgo } from '../../utils/date';

export function MedicalHistoryScreen() {
  const [reports, setReports] = useState<SymptomReport[]>([]);
  const [filtered, setFiltered] = useState<SymptomReport[]>([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    const result = await reportRepo.getAll();
    if (result.success) {
      setReports(result.data);
    } else {
      setError('Error al cargar el historial');
    }
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(reports);
    } else {
      const q = search.toLowerCase();
      setFiltered(reports.filter((r) =>
        r.symptoms.some((s) => s.toLowerCase().includes(q)) ||
        r.diagnosis.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q)
      ));
    }
  }, [search, reports]);

  if (isLoading) return <LoadingScreen message="Cargando historial..." />;
  if (error) return <ErrorView message={error} onRetry={load} />;

  const renderItem = ({ item }: { item: SymptomReport }) => {
    const isExpanded = expandedId === item.id;
    const recommendations = isExpanded ? RecommendationEngine.generateForReport(item.id, item.risk) : [];

    return (
      <Pressable style={styles.card} onPress={() => setExpandedId(isExpanded ? null : item.id)}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.cardDate}>{timeAgo(item.timestamp)}</Text>
            <RiskBadge level={item.risk} />
          </View>
          <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />
        </View>

        <Text style={styles.cardSymptoms}>{item.symptoms.join(', ')}</Text>
        <Text style={styles.cardDistrict}>{item.district}{item.community ? ` · ${item.community}` : ''}</Text>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.diagnosisBox}>
              <Text style={styles.diagnosisLabel}>Diagnóstico sugerido</Text>
              <Text style={styles.diagnosisText}>{item.diagnosis}</Text>
            </View>

            {recommendations.length > 0 && (
              <View style={styles.recsBox}>
                <Text style={styles.recsTitle}>Recomendaciones</Text>
                {recommendations.map((rec) => (
                  <View key={rec.id} style={styles.recItem}>
                    <Ionicons
                      name={rec.priority === 'alta' ? 'alert-circle' : rec.priority === 'media' ? 'information-circle' : 'checkmark-circle'}
                      size={18}
                      color={rec.priority === 'alta' ? colors.danger : rec.priority === 'media' ? colors.warning : colors.success}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.recTitle}>{rec.title}</Text>
                      <Text style={styles.recDesc}>{rec.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={filtered}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Historial Médico</Text>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar por síntoma, diagnóstico o distrito..." />
        </View>
      }
      ListEmptyComponent={<EmptyState icon="document-text-outline" title="No hay reportes" description="Tus reportes aparecerán aquí con recomendaciones personalizadas." />}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  header: { gap: 8, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardDate: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  cardSymptoms: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  cardDistrict: { fontSize: 12, color: colors.textSecondary, marginBottom: 6 },
  expandedContent: { marginTop: 12, gap: 12 },
  diagnosisBox: { backgroundColor: '#F0FDFA', borderRadius: 12, padding: 12 },
  diagnosisLabel: { fontSize: 11, fontWeight: '600', color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 4 },
  diagnosisText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  recsBox: { gap: 8 },
  recsTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  recItem: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  recTitle: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  recDesc: { fontSize: 12, color: colors.textSecondary },
});
