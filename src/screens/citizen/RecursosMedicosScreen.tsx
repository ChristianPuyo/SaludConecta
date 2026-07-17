import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Linking, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { MOCK_MEDICAL_RESOURCES, RESOURCE_TYPE_LABELS, RESOURCE_TYPE_ICONS } from '../../data/mockData';
import type { MedicalResource } from '../../data/mockData';

const TYPE_COLORS: Record<MedicalResource['type'], string> = {
  hospital: '#3B82F6',
  centro_salud: '#10B981',
  clinica: '#EC4899',
  farmacia: '#F59E0B',
};

const TYPE_BG_COLORS: Record<MedicalResource['type'], string> = {
  hospital: '#EFF6FF',
  centro_salud: '#ECFDF5',
  clinica: '#FDF2F8',
  farmacia: '#FFFBEB',
};

const FILTER_OPTIONS: { label: string; value: MedicalResource['type'] | 'all'; color: string }[] = [
  { label: 'Todos', value: 'all', color: '#6B7280' },
  { label: 'Hospitales', value: 'hospital', color: '#3B82F6' },
  { label: 'Centros', value: 'centro_salud', color: '#10B981' },
  { label: 'Clinicas', value: 'clinica', color: '#EC4899' },
  { label: 'Farmacias', value: 'farmacia', color: '#F59E0B' },
];

export function RecursosMedicosScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<MedicalResource['type'] | 'all'>('all');

  const filteredResources = MOCK_MEDICAL_RESOURCES.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.district.toLowerCase().includes(search.toLowerCase()) ||
      r.services.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'all' || r.type === filter;
    return matchesSearch && matchesFilter;
  });

  const call = (phone: string) => {
    Alert.alert('Llamar', `Deseas llamar al ${phone}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Llamar ahora', onPress: () => Linking.openURL('tel:' + phone) },
    ]);
  };

  const openMaps = (address: string, district: string) => {
    const query = address + ', ' + district + ', Ucalli, Peru';
    const url = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
    Linking.openURL(url);
  };

  const shareResource = (resource: MedicalResource) => {
    Alert.alert('Compartir ' + resource.name, 'Direccion: ' + resource.address + '\nTel: ' + resource.phone, [
      { text: 'Cerrar', style: 'cancel' },
      { text: 'Copiar', onPress: () => Alert.alert('Copiado', 'Informacion copiada') },
    ]);
  };

  const openAllInMaps = () => {
    Linking.openURL('https://www.google.com/maps/search/hospitales+ucayali+peru');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.kpiRow}>
        <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.kpiCard}>
          <Ionicons name="medical" size={22} color="#FFF" />
          <Text style={styles.kpiNumber}>{MOCK_MEDICAL_RESOURCES.length}</Text>
          <Text style={styles.kpiLabel}>Recursos</Text>
        </LinearGradient>
        <LinearGradient colors={['#10B981', '#059669']} style={styles.kpiCard}>
          <Ionicons name="business" size={22} color="#FFF" />
          <Text style={styles.kpiNumber}>
            {MOCK_MEDICAL_RESOURCES.filter((r) => r.type === 'hospital' || r.type === 'centro_salud').length}
          </Text>
          <Text style={styles.kpiLabel}>Publicos</Text>
        </LinearGradient>
        <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.kpiCard}>
          <Ionicons name="time" size={22} color="#FFF" />
          <Text style={styles.kpiNumber}>
            {MOCK_MEDICAL_RESOURCES.filter((r) => r.hours === '24 horas').length}
          </Text>
          <Text style={styles.kpiLabel}>24 horas</Text>
        </LinearGradient>
      </View>

      <View style={styles.searchContainer}>
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.searchIconBg}>
          <Ionicons name="search" size={16} color="#FFF" />
        </LinearGradient>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar recurso, distrito o servicio..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color="#EF4444" />
          </Pressable>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {FILTER_OPTIONS.map((opt) => (
          <Pressable
            key={opt.value}
            style={({ pressed }) => [
              styles.filterChip,
              filter === opt.value && { backgroundColor: opt.color, borderColor: opt.color },
              pressed && styles.filterChipPressed,
            ]}
            onPress={() => setFilter(opt.value)}
          >
            <Text style={[styles.filterChipText, filter === opt.value && styles.filterChipTextActive]}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        style={({ pressed }) => [styles.mapButton, pressed && styles.mapButtonPressed]}
        onPress={openAllInMaps}
      >
        <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.mapButtonGradient}>
          <Ionicons name="map" size={18} color="#FFF" />
          <Text style={styles.mapButtonText}>Ver todos en el mapa</Text>
          <Ionicons name="open-outline" size={16} color="#FFF" />
        </LinearGradient>
      </Pressable>

      <View style={styles.resultsRow}>
        <Text style={styles.resultsCount}>{filteredResources.length} recurso(s)</Text>
        {filter !== 'all' && (
          <Pressable onPress={() => setFilter('all')}>
            <Text style={styles.clearFilter}>Limpiar filtro</Text>
          </Pressable>
        )}
      </View>

      {filteredResources.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Sin resultados</Text>
          <Text style={styles.emptySubtitle}>Intenta con otros criterios</Text>
        </View>
      ) : (
        filteredResources.map((resource) => {
          const typeColor = TYPE_COLORS[resource.type];
          const typeBg = TYPE_BG_COLORS[resource.type];
          return (
            <Pressable
              key={resource.id}
              style={({ pressed }) => [styles.resourceCard, pressed && styles.resourceCardPressed]}
              onPress={() =>
                Alert.alert(
                  resource.name,
                  'Tipo: ' + RESOURCE_TYPE_LABELS[resource.type] + '\nDireccion: ' + resource.address + '\nHorario: ' + resource.hours + '\n\nServicios:\n' + resource.services.map((s) => '- ' + s).join('\n'),
                  [
                    { text: 'Cerrar', style: 'cancel' },
                    { text: 'Llamar', onPress: () => call(resource.phone) },
                    { text: 'Como llegar', onPress: () => openMaps(resource.address, resource.district) },
                    { text: 'Compartir', onPress: () => shareResource(resource) },
                  ],
                )
              }
            >
              <LinearGradient colors={[typeBg, '#FFFFFF']} style={styles.cardGradient}>
                <View style={[styles.cardStrip, { backgroundColor: typeColor }]} />

                <View style={styles.cardContent}>
                  <View style={styles.resourceHeader}>
                    <View style={[styles.resourceIcon, { backgroundColor: typeColor + '20' }]}>
                      <Ionicons name={(RESOURCE_TYPE_ICONS[resource.type] as any) || 'medical'} size={24} color={typeColor} />
                    </View>
                    <View style={styles.resourceInfo}>
                      <Text style={styles.resourceName}>{resource.name}</Text>
                      <View style={styles.resourceTypeRow}>
                        <View style={[styles.typeBadge, { backgroundColor: typeColor + '20' }]}>
                          <Text style={[styles.typeBadgeText, { color: typeColor }]}>{RESOURCE_TYPE_LABELS[resource.type]}</Text>
                        </View>
                        <Text style={styles.resourceDistrict}>{resource.district}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.resourceDetails}>
                    <View style={styles.detailRow}>
                      <View style={[styles.detailIcon, { backgroundColor: '#EFF6FF' }]}>
                        <Ionicons name="location" size={12} color="#3B82F6" />
                      </View>
                      <Text style={styles.detailText}>{resource.address}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <View style={[styles.detailIcon, { backgroundColor: '#ECFDF5' }]}>
                        <Ionicons name="time" size={12} color="#10B981" />
                      </View>
                      <Text style={styles.detailText}>{resource.hours}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <View style={[styles.detailIcon, { backgroundColor: '#FEF3C7' }]}>
                        <Ionicons name="call" size={12} color="#F59E0B" />
                      </View>
                      <Text style={[styles.detailText, { fontWeight: '600' }]}>{resource.phone}</Text>
                    </View>
                  </View>

                  <View style={styles.servicesRow}>
                    {resource.services.map((service, i) => (
                      <View key={i} style={[styles.serviceTag, { backgroundColor: typeBg, borderColor: typeColor + '40' }]}>
                        <Text style={[styles.serviceText, { color: typeColor }]}>{service}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.actionRow}>
                    <Pressable
                      style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
                      onPress={() => call(resource.phone)}
                    >
                      <LinearGradient colors={['#10B981', '#059669']} style={styles.actionGradient}>
                        <Ionicons name="call" size={14} color="#FFF" />
                        <Text style={styles.actionButtonText}>Llamar</Text>
                      </LinearGradient>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
                      onPress={() => openMaps(resource.address, resource.district)}
                    >
                      <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.actionGradient}>
                        <Ionicons name="map" size={14} color="#FFF" />
                        <Text style={styles.actionButtonText}>Mapa</Text>
                      </LinearGradient>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [styles.actionShare, pressed && styles.actionButtonPressed]}
                      onPress={() => shareResource(resource)}
                    >
                      <LinearGradient colors={['#8B5CF6', '#6D28D9']} style={styles.actionShareGradient}>
                        <Ionicons name="share" size={14} color="#FFF" />
                      </LinearGradient>
                    </Pressable>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  kpiRow: { flexDirection: 'row', gap: 10 },
  kpiCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center', gap: 4 },
  kpiNumber: { fontSize: 22, fontWeight: '800', color: '#FFF' },
  kpiLabel: { fontSize: 10, color: 'rgba(255,255,255,0.9)', textAlign: 'center' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  searchIconBg: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary },
  filterScroll: { marginHorizontal: -4, paddingHorizontal: 4 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: 8,
  },
  filterChipPressed: { opacity: 0.85, transform: [{ scale: 0.95 }] },
  filterChipText: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  filterChipTextActive: { color: '#FFF' },
  mapButton: { borderRadius: 14, overflow: 'hidden' },
  mapButtonPressed: { opacity: 0.9 },
  mapButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  mapButtonText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  resultsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultsCount: { fontSize: 12, color: colors.textSecondary },
  clearFilter: { fontSize: 12, fontWeight: '600', color: '#EF4444' },
  emptyState: { alignItems: 'center', padding: 40, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  emptySubtitle: { fontSize: 13, color: colors.textSecondary },
  resourceCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  resourceCardPressed: { transform: [{ scale: 0.98 }] },
  cardGradient: { flexDirection: 'row' },
  cardStrip: { width: 6, borderTopLeftRadius: 16, borderBottomLeftRadius: 16 },
  cardContent: { flex: 1, padding: 16, gap: 12 },
  resourceHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resourceIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  resourceInfo: { flex: 1 },
  resourceName: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  resourceTypeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  typeBadgeText: { fontSize: 10, fontWeight: '700' },
  resourceDistrict: { fontSize: 11, color: colors.textSecondary },
  resourceDetails: { gap: 6 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailIcon: { width: 24, height: 24, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  detailText: { fontSize: 12, color: colors.textSecondary, flex: 1 },
  servicesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  serviceTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  serviceText: { fontSize: 10, fontWeight: '700' },
  actionRow: { flexDirection: 'row', gap: 8 },
  actionButton: { flex: 1, borderRadius: 12, overflow: 'hidden' },
  actionButtonPressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  actionGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  actionButtonText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
  actionShare: { width: 40, borderRadius: 12, overflow: 'hidden' },
  actionShareGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
