/**
 * NationalDirectoryScreen - Directorio nacional de establecimientos y profesionales de salud con buscador y filtros.
 * Permite localizar centros por nombre, ubicación, especialidad y nivel de atención.
 */
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { SearchBar } from '../../components/SearchBar';
import { PageHeader, FilterBar, EmptyState } from '../components/ReusableComponents';
import { HealthCenterService } from '../../services/healthCenterService';
import type { HealthCenter, HealthCenterType } from '../../models/healthCenter';

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'hospital', label: 'Hospitales' },
  { id: 'posta', label: 'Centros de Salud' },
  { id: 'farmacia', label: 'Farmacias' },
];

const TYPE_LABELS: Record<HealthCenterType, string> = {
  hospital: 'Hospital',
  posta: 'Centro de Salud',
  farmacia: 'Farmacia',
};

const TYPE_COLORS: Record<HealthCenterType, string> = {
  hospital: colors.danger,
  posta: colors.primary,
  farmacia: colors.warning,
};

export function NationalDirectoryScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [centers, setCenters] = useState<HealthCenter[]>([]);
  const [filter, setFilter] = useState('todos');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const data = await HealthCenterService.getAll();
      setCenters(data);
    })();
  }, []);

  const filtered = centers.filter(c => {
    if (filter !== 'todos' && c.type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Directorio Nacional'} subtitle={subtitle || 'Centros de salud y farmacias'} />

      <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar centros, distritos..." />

      <FilterBar filters={FILTERS} active={filter} onFilter={setFilter} />

      {filtered.length === 0 ? (
        <EmptyState icon="search-outline" title="Sin resultados" subtitle="No se encontraron centros con los filtros seleccionados" />
      ) : (
        filtered.map(c => (
          <View key={c.id} style={styles.centerCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[c.type] + '15' }]}>
                <Text style={[styles.typeText, { color: TYPE_COLORS[c.type] }]}>{TYPE_LABELS[c.type]}</Text>
              </View>
              <Ionicons name="ellipsis-vertical" size={18} color={colors.textSecondary} />
            </View>
            <Text style={styles.centerName}>{c.name}</Text>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.infoText}>{c.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.infoText}>{c.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.infoText}>{c.hours}</Text>
            </View>
            {c.district && (
              <View style={styles.infoRow}>
                <Ionicons name="map-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.infoText}>{c.district}</Text>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  centerCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    gap: 8,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
  typeText: { fontSize: 11, fontWeight: '700' },
  centerName: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 13, color: colors.textSecondary, flex: 1 },
});
