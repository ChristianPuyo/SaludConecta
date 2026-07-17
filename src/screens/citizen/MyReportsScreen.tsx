// ===== INICIO MODIFICACIÓN (Iteración: Búsqueda en reportes) =====
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable } from 'react-native';
// ===== FIN MODIFICACIÓN (Iteración: Búsqueda en reportes) =====
import { Ionicons } from '@expo/vector-icons';
import { useReports } from '../../context/ReportsContext';
import { RiskBadge } from '../../components/RiskBadge';
import { colors, shadows } from '../../theme/colors';
import type { SymptomReport } from '../../data/mockData';

const RISK_BORDER_COLOR = {
  bajo: colors.success,
  medio: colors.warning,
  alto: colors.danger,
};

export function MyReportsScreen() {
  const { reports } = useReports();

  // ===== INICIO MODIFICACIÓN (Iteración: Búsqueda en reportes) =====
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);

  const filteredReports = useMemo(() => {
    if (!search.trim()) return reports;
    const query = search.trim().toLowerCase();
    return reports.filter(
      (r) =>
        r.district.toLowerCase().includes(query) ||
        r.symptoms.some((s) => s.toLowerCase().includes(query)) ||
        r.risk.includes(query)
    );
  }, [reports, search]);
  // ===== FIN MODIFICACIÓN (Iteración: Búsqueda en reportes) =====

  const renderItem = ({ item }: { item: SymptomReport }) => (
    <View style={[styles.card, { borderLeftColor: RISK_BORDER_COLOR[item.risk] }]}>
      <View style={styles.cardHeader}>
        <View style={styles.locationWrap}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.cardDistrict}>{item.district}</Text>
        </View>
        <RiskBadge level={item.risk} />
      </View>

      <View style={styles.tagsContainer}>
        {item.symptoms.map((symptom) => (
          <View key={symptom} style={styles.symptomTag}>
            <Text style={styles.symptomTagText}>{symptom}</Text>
          </View>
        ))}
      </View>

      <View style={styles.cardFooter}>
        <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
        <Text style={styles.cardDate}>Reportado: {item.date}</Text>
      </View>
    </View>
  );

  // ===== INICIO MODIFICACIÓN (Iteración: Búsqueda en reportes) =====
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name="document-text-outline" size={38} color={colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>
        {search.trim() ? 'Sin resultados de búsqueda' : 'Sin reportes registrados'}
      </Text>
      <Text style={styles.emptyText}>
        {search.trim()
          ? 'Ningún reporte coincide con tu búsqueda. Intenta con otro término.'
          : 'Aquí aparecerá tu historial clínico de síntomas reportados a la comunidad.'}
      </Text>
    </View>
  );
  // ===== FIN MODIFICACIÓN (Iteración: Búsqueda en reportes) =====

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      // ===== INICIO MODIFICACIÓN (Iteración: Búsqueda en reportes) =====
      data={filteredReports}
      // ===== FIN MODIFICACIÓN (Iteración: Búsqueda en reportes) =====
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      // ===== INICIO MODIFICACIÓN (Iteración: Búsqueda en reportes) =====
      ListHeaderComponent={
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Mis reportes</Text>
          <View style={[styles.searchWrapper, focused && styles.searchWrapperFocused]}>
            <Ionicons
              name="search-outline"
              size={18}
              color={focused ? colors.primary : colors.textMuted}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por síntoma, distrito o riesgo…"
              placeholderTextColor={colors.textPlaceholder}
              value={search}
              onChangeText={setSearch}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} hitSlop={8}>
                <Ionicons name="close-circle" size={16} color={colors.textMuted} />
              </Pressable>
            )}
          </View>
          <Text style={styles.resultCount}>
            {filteredReports.length} reporte{filteredReports.length !== 1 ? 's' : ''}
          </Text>
        </View>
      }
      // ===== FIN MODIFICACIÓN (Iteración: Búsqueda en reportes) =====
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 30 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },

  // ===== INICIO MODIFICACIÓN (Iteración: Búsqueda en reportes) =====
  headerContainer: { gap: 12, marginBottom: 8 },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 2,
    ...shadows.sm,
  },
  searchWrapperFocused: {
    borderColor: colors.primary,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  resultCount: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.2,
    marginLeft: 2,
  },
  // ===== FIN MODIFICACIÓN (Iteración: Búsqueda en reportes) =====

  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderLeftWidth: 5,
    marginBottom: 12,
    gap: 12,
    ...shadows.sm,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  locationWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardDistrict: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 2 },
  symptomTag: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  symptomTagText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1.5,
    borderTopColor: colors.borderLight,
    paddingTop: 10,
  },
  cardDate: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 80, paddingHorizontal: 32, gap: 8 },
  emptyIconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  emptyText: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },
});
