import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { HealthCenter, HealthCenterType } from '../../models/healthCenter';
import { HealthCenterService } from '../../services/healthCenterService';
import { SearchBar } from '../../components/SearchBar';
import { EmptyState } from '../../components/EmptyState';
import { colors } from '../../theme/colors';

const FILTERS: Array<{ id: HealthCenterType | 'all'; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'hospital', label: 'Hospitales' },
  { id: 'posta', label: 'Postas' },
  { id: 'farmacia', label: 'Farmacias' },
];

export function HealthCentersScreen() {
  const [centers, setCenters] = useState<HealthCenter[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<HealthCenterType | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { HealthCenterService.getAll().then(setCenters); }, []);

  const filtered = centers.filter((c) => {
    if (filter !== 'all' && c.type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.district.toLowerCase().includes(q) || c.services.some((s) => s.toLowerCase().includes(q));
    }
    return true;
  });

  const getIcon = (type: HealthCenterType) => {
    switch (type) {
      case 'hospital': return 'medkit';
      case 'posta': return 'medkit-outline';
      case 'farmacia': return 'medical';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Centros de Salud</Text>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar centros..." />
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable key={f.id} style={[styles.filterChip, filter === f.id && styles.filterChipActive]} onPress={() => setFilter(f.id)}>
            <Text style={[styles.filterText, filter === f.id && styles.filterTextActive]}>{f.label}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isExpanded = expandedId === item.id;
          return (
            <Pressable style={styles.card} onPress={() => setExpandedId(isExpanded ? null : item.id)}>
              <View style={styles.cardHeader}>
                <View style={styles.cardLeft}>
                  <View style={styles.iconWrap}>
                    <Ionicons name={getIcon(item.type)} size={22} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <Text style={styles.cardType}>{item.type === 'hospital' ? 'Hospital' : item.type === 'posta' ? 'Posta Médica' : 'Farmacia'}</Text>
                  </View>
                </View>
                <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textSecondary} />
              </View>
              <Text style={styles.cardAddress}>{item.address}</Text>
              <Text style={styles.cardDistrict}>{item.district}</Text>

              {isExpanded && (
                <View style={styles.expandedSection}>
                  {item.phone && (
                    <View style={styles.infoRow}>
                      <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                      <Text style={styles.infoText}>{item.phone}</Text>
                    </View>
                  )}
                  {item.hours && (
                    <View style={styles.infoRow}>
                      <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                      <Text style={styles.infoText}>{item.hours}</Text>
                    </View>
                  )}
                  <View style={styles.servicesWrap}>
                    <Text style={styles.servicesTitle}>Servicios:</Text>
                    {item.services.map((s, i) => (
                      <View key={i} style={styles.serviceChip}>
                        <Text style={styles.serviceText}>{s}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </Pressable>
          );
        }}
        ListEmptyComponent={<EmptyState icon="location-outline" title="Sin resultados" description="No se encontraron centros de salud." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingBottom: 8, gap: 8 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  filterTextActive: { color: '#fff' },
  listContent: { padding: 20, paddingTop: 4, gap: 10 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  cardLeft: { flexDirection: 'row', gap: 12, flex: 1 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F0FDFA', alignItems: 'center', justifyContent: 'center' },
  cardName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  cardType: { fontSize: 12, color: colors.textSecondary },
  cardAddress: { fontSize: 13, color: colors.textSecondary, marginBottom: 2 },
  cardDistrict: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  expandedSection: { marginTop: 12, gap: 8, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 13, color: colors.textPrimary },
  servicesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  servicesTitle: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, width: '100%', marginBottom: 2 },
  serviceChip: { backgroundColor: '#F0FDFA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  serviceText: { fontSize: 11, fontWeight: '600', color: colors.primary },
});
