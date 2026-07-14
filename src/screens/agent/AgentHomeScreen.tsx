import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useVisits } from '../../context/VisitsContext';
import { colors, shadows } from '../../theme/colors';
import type { AgentTabParamList } from '../../navigation/AgentNavigator';

type Nav = BottomTabNavigationProp<AgentTabParamList, 'Home'>;

export function AgentHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { visits } = useVisits();
  const pending = visits.filter((v) => !v.synced).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBanner}>
        <View style={styles.headerTextWrap}>
          <Text style={styles.title}>Panel de Control</Text>
          <Text style={styles.subtitle}>Salud comunitaria · Amazonía</Text>
        </View>
        <View style={styles.badgeWrap}>
          <Text style={styles.badgeText}>Agente</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="clipboard-outline" size={20} color={colors.primary} />
          </View>
          <Text style={styles.statNumber}>{visits.length}</Text>
          <Text style={styles.statLabel}>Visitas registradas</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: pending > 0 ? colors.warningLight : colors.successLight }]}>
            <Ionicons 
              name={pending > 0 ? "cloud-offline-outline" : "cloud-done-outline"} 
              size={20} 
              color={pending > 0 ? colors.warning : colors.success} 
            />
          </View>
          <Text style={[styles.statNumber, pending > 0 && { color: colors.warning }]}>{pending}</Text>
          <Text style={styles.statLabel}>Pendientes de sincronizar</Text>
        </View>
      </View>

      <View style={styles.offlineBanner}>
        <Ionicons name="wifi-outline" size={18} color={colors.secondary} />
        <Text style={styles.offlineText}>Modo offline activo: los datos se guardan de forma segura en tu dispositivo</Text>
      </View>

      <Pressable 
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.primaryButtonPressed
        ]} 
        onPress={() => navigation.navigate('RegisterVisit')}
      >
        <Ionicons name="add" size={22} color="#fff" />
        <Text style={styles.primaryButtonText}>Registrar nueva visita</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  headerBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.sm,
  },
  headerTextWrap: { gap: 2 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: colors.textSecondary },
  badgeWrap: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: colors.primaryDark, textTransform: 'uppercase', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: { 
    flex: 1, 
    backgroundColor: colors.surface, 
    borderRadius: 20, 
    padding: 16, 
    borderWidth: 1.5, 
    borderColor: colors.border,
    gap: 8,
    ...shadows.sm,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: { fontSize: 32, fontWeight: '900', color: colors.textPrimary, letterSpacing: -1 },
  statLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '600', lineHeight: 16 },
  offlineBanner: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10, 
    backgroundColor: colors.secondaryLight, 
    borderRadius: 16, 
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#EFF6FF',
  },
  offlineText: { flex: 1, color: colors.secondary, fontSize: 13, fontWeight: '600', lineHeight: 18 },
  primaryButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 6,
    backgroundColor: colors.primary, 
    borderRadius: 16, 
    paddingVertical: 16, 
    marginTop: 8,
    ...shadows.md,
  },
  primaryButtonPressed: { backgroundColor: colors.primaryDark, opacity: 0.95 },
  primaryButtonText: { color: '#fff', fontWeight: '800', fontSize: 16, letterSpacing: -0.2 },
});

