import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Linking, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { MOCK_MEDICAL_RESOURCES, RESOURCE_TYPE_LABELS, RESOURCE_TYPE_ICONS } from '../../data/mockData';
import type { MedicalResource } from '../../data/mockData';

const TYPE_COLORS: Record<MedicalResource['type'], string> = {
  hospital: '#DBEAFE',
  centro_salud: '#D1FAE5',
  clinica: '#FCE7F3',
  farmacia: '#FEF3C7',
};

const TYPE_ICON_COLORS: Record<MedicalResource['type'], string> = {
  hospital: '#2563EB',
  centro_salud: '#059669',
  clinica: '#DB2777',
  farmacia: '#D97706',
};

const FILTER_OPTIONS: { label: string; value: MedicalResource['type'] | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Hospitales', value: 'hospital' },
  { label: 'Centros', value: 'centro_salud' },
  { label: 'Clínicas', value: 'clinica' },
  { label: 'Farmacias', value: 'farmacia' },
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
    Alert.alert('Llamar', `¿Deseas llamar a ${phone}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Llamar', onPress: () => Linking.openURL(`tel:${phone}`) },
    ]);
  };

  const openMaps = (address: string, district: string) => {
    const query = `${address}, ${district}, Ucayali, Perú`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    Linking.openURL(url);
  };

  const shareResource = (resource: MedicalResource) => {
    Alert.alert(
      'Compartir',
      `Compartir información de ${resource.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Copiar información',
          onPress: () => {
            const info = `${resource.name}\n${RESOURCE_TYPE_LABELS[resource.type]}\n${resource.address}\nTel: ${resource.phone}\nHorario: ${resource.hours}`;
            Alert.alert('Copiado', 'Información copiada al portapapeles');
          },
        },
      ],
    );
  };

  const openAllInMaps = () => {
    const query = MOCK_MEDICAL_RESOURCES.map((r) => `${r.address}, ${r.district}`).join(' | ');
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('hospitales Ucayali Perú')}`;
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* KPIs */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiNumber}>{MOCK_MEDICAL_RESOURCES.length}</Text>
          <Text style={styles.kpiLabel}>Recursos</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={[styles.kpiNumber, { color: '#059669' }]}>
            {MOCK_MEDICAL_RESOURCES.filter((r) => r.type === 'hospital' || r.type === 'centro_salud').length}
          </Text>
          <Text style={styles.kpiLabel}>Centros públicos</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={[styles.kpiNumber, { color: '#D97706' }]}>
            {MOCK_MEDICAL_RESOURCES.filter((r) => r.hours === '24 horas').length}
          </Text>
          <Text style={styles.kpiLabel}>24 horas</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, distrito o servicio..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {FILTER_OPTIONS.map((opt) => (
          <Pressable
            key={opt.value}
            style={({ pressed }) => [
              styles.filterChip,
              filter === opt.value && styles.filterChipActive,
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

      {/* Open in Maps Button */}
      <Pressable
        style={({ pressed }) => [styles.mapButton, pressed && styles.mapButtonPressed]}
        onPress={openAllInMaps}
      >
        <Ionicons name="map" size={18} color="#FFF" />
        <Text style={styles.mapButtonText}>Ver todos en el mapa</Text>
        <Ionicons name="open-outline" size={16} color="#FFF" />
      </Pressable>

      {/* Results Count */}
      <Text style={styles.resultsCount}>
        {filteredResources.length} recurso(s) encontrado(s)
      </Text>

      {/* Resources List */}
      {filteredResources.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="search" size={48} color={colors.border} />
          <Text style={styles.emptyTitle}>Sin resultados</Text>
          <Text style={styles.emptySubtitle}>No se encontraron recursos con esos criterios</Text>
        </View>
      ) : (
        filteredResources.map((resource) => (
          <Pressable
            key={resource.id}
            style={({ pressed }) => [styles.resourceCard, pressed && styles.resourceCardPressed]}
            onPress={() =>
              Alert.alert(
                resource.name,
                `Tipo: ${RESOURCE_TYPE_LABELS[resource.type]}\nDistrito: ${resource.district}\nDirección: ${resource.address}\nHorario: ${resource.hours}\nTeléfono: ${resource.phone}\n\nServicios:\n${resource.services.map((s) => `• ${s}`).join('\n')}`,
                [
                  { text: 'Cerrar', style: 'cancel' },
                  { text: '📞 Llamar', onPress: () => call(resource.phone) },
                  { text: '🗺️ Cómo llegar', onPress: () => openMaps(resource.address, resource.district) },
                  { text: '📤 Compartir', onPress: () => shareResource(resource) },
                ],
              )
            }
          >
            <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.resourceCardGradient}>
              <View style={styles.resourceHeader}>
                <View style={[styles.resourceIcon, { backgroundColor: TYPE_COLORS[resource.type] }]}>
                  <Ionicons
                    name={(RESOURCE_TYPE_ICONS[resource.type] as any) || 'medical'}
                    size={20}
                    color={TYPE_ICON_COLORS[resource.type]}
                  />
                </View>
                <View style={styles.resourceInfo}>
                  <Text style={styles.resourceName}>{resource.name}</Text>
                  <Text style={styles.resourceType}>
                    {RESOURCE_TYPE_LABELS[resource.type]} • {resource.district}
                  </Text>
                </View>
              </View>

              <View style={styles.resourceDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="location" size={12} color={colors.textSecondary} />
                  <Text style={styles.detailText}>{resource.address}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time" size={12} color={colors.textSecondary} />
                  <Text style={styles.detailText}>{resource.hours}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="call" size={12} color={colors.textSecondary} />
                  <Text style={styles.detailText}>{resource.phone}</Text>
                </View>
              </View>

              <View style={styles.servicesRow}>
                {resource.services.slice(0, 3).map((service, i) => (
                  <View key={i} style={styles.serviceTag}>
                    <Text style={styles.serviceText}>{service}</Text>
                  </View>
                ))}
                {resource.services.length > 3 && (
                  <View style={styles.serviceTag}>
                    <Text style={styles.serviceText}>+{resource.services.length - 3}</Text>
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <Pressable
                  style={({ pressed }) => [styles.actionButton, styles.callActionButton, pressed && styles.actionButtonPressed]}
                  onPress={() => call(resource.phone)}
                >
                  <Ionicons name="call" size={14} color="#FFF" />
                  <Text style={styles.actionButtonText}>Llamar</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [styles.actionButton, styles.mapsActionButton, pressed && styles.actionButtonPressed]}
                  onPress={() => openMaps(resource.address, resource.district)}
                >
                  <Ionicons name="map" size={14} color="#FFF" />
                  <Text style={styles.actionButtonText}>Cómo llegar</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [styles.actionButton, styles.shareActionButton, pressed && styles.actionButtonPressed]}
                  onPress={() => shareResource(resource)}
                >
                  <Ionicons name="share" size={14} color="#FFF" />
                </Pressable>
              </View>
            </LinearGradient>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40, gap: 12 },
  kpiRow: { flexDirection: 'row', gap: 10 },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  kpiNumber: { fontSize: 24, fontWeight: '800', color: colors.primary },
  kpiLabel: { fontSize: 11, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary },
  filterScroll: { marginHorizontal: -4, paddingHorizontal: 4 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipPressed: { opacity: 0.8 },
  filterChipText: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  filterChipTextActive: { color: '#FFF' },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
  },
  mapButtonPressed: { opacity: 0.9 },
  mapButtonText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  resultsCount: { fontSize: 12, color: colors.textSecondary },
  emptyState: { alignItems: 'center', padding: 40, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  emptySubtitle: { fontSize: 13, color: colors.textSecondary },
  resourceCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  resourceCardPressed: { transform: [{ scale: 0.98 }] },
  resourceCardGradient: { padding: 16, gap: 12 },
  resourceHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resourceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceInfo: { flex: 1 },
  resourceName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  resourceType: { fontSize: 12, color: colors.textSecondary },
  resourceDetails: { gap: 4 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 12, color: colors.textSecondary },
  servicesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  serviceTag: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  serviceText: { fontSize: 11, fontWeight: '600', color: colors.primary },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  actionButtonPressed: { opacity: 0.85, transform: [{ scale: 0.97 }] },
  callActionButton: { flex: 1, backgroundColor: '#059669' },
  mapsActionButton: { flex: 1, backgroundColor: '#2563EB' },
  shareActionButton: { width: 40, backgroundColor: '#6B7280' },
  actionButtonText: { color: '#FFF', fontWeight: '600', fontSize: 12 },
});
