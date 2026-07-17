import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Linking } from 'react-native';
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

export function RecursosMedicosScreen() {
  const call = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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

      <Text style={styles.sectionTitle}>Recursos Disponibles</Text>

      {MOCK_MEDICAL_RESOURCES.map((resource) => (
        <Pressable
          key={resource.id}
          onPress={() =>
            Alert.alert(resource.name, `Tipo: ${RESOURCE_TYPE_LABELS[resource.type]}\nDirección: ${resource.address}\nHorario: ${resource.hours}\n\nServicios:\n${resource.services.map((s) => `• ${s}`).join('\n')}`, [
              { text: 'Cerrar' },
              { text: 'Llamar', onPress: () => call(resource.phone) },
            ])
          }
          style={({ pressed }) => [styles.resourceCard, pressed && styles.resourceCardPressed]}
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
                <Text style={styles.resourceType}>{RESOURCE_TYPE_LABELS[resource.type]} • {resource.district}</Text>
              </View>
              <Pressable
                style={styles.callButton}
                onPress={() => call(resource.phone)}
              >
                <Ionicons name="call" size={18} color="#059669" />
              </Pressable>
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
            </View>

            <View style={styles.servicesRow}>
              {resource.services.slice(0, 3).map((service, i) => (
                <View key={i} style={styles.serviceTag}>
                  <Text style={styles.serviceText}>{service}</Text>
                </View>
              ))}
              {resource.services.length > 3 && (
                <Text style={styles.moreServices}>+{resource.services.length - 3}</Text>
              )}
            </View>
          </LinearGradient>
        </Pressable>
      ))}
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
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
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
  resourceCardGradient: { padding: 16 },
  resourceHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceInfo: { flex: 1 },
  resourceName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  resourceType: { fontSize: 12, color: colors.textSecondary },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceDetails: { marginTop: 10, gap: 4 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: 12, color: colors.textSecondary },
  servicesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  serviceTag: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  serviceText: { fontSize: 10, fontWeight: '600', color: '#2563EB' },
  moreServices: { fontSize: 10, color: colors.textSecondary, alignSelf: 'center' },
});
