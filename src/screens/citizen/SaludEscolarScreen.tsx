import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RiskBadge } from '../../components/RiskBadge';
import { colors } from '../../theme/colors';
import { MOCK_SCHOOLS } from '../../data/mockData';

export function SaludEscolarScreen() {
  const totalStudents = MOCK_SCHOOLS.reduce((sum, s) => sum + s.students, 0);
  const alertSchools = MOCK_SCHOOLS.filter((s) => s.risk !== 'bajo').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiNumber}>{MOCK_SCHOOLS.length}</Text>
          <Text style={styles.kpiLabel}>Escuelas</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={[styles.kpiNumber, { color: colors.warning }]}>{alertSchools}</Text>
          <Text style={styles.kpiLabel}>Con alertas</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiNumber}>{totalStudents}</Text>
          <Text style={styles.kpiLabel}>Estudiantes</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Escuelas Monitoreadas</Text>

      {MOCK_SCHOOLS.map((school) => (
        <Pressable
          key={school.id}
          onPress={() =>
            Alert.alert(
              school.name,
              `Distrito: ${school.district}\nEstudiantes: ${school.students}\n\nAlertas:\n${school.alerts.length > 0 ? school.alerts.map((a) => `• ${a}`).join('\n') : '• Sin alertas activas'}`,
            )
          }
          style={({ pressed }) => [styles.schoolCard, pressed && styles.schoolCardPressed]}
        >
          <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.schoolCardGradient}>
            <View style={styles.schoolHeader}>
              <View style={styles.schoolIcon}>
                <Ionicons name="school" size={20} color={colors.primary} />
              </View>
              <View style={styles.schoolInfo}>
                <Text style={styles.schoolName}>{school.name}</Text>
                <Text style={styles.schoolDistrict}>{school.district} • {school.students} estudiantes</Text>
              </View>
              <RiskBadge level={school.risk} />
            </View>

            {school.alerts.length > 0 && (
              <View style={styles.alertsList}>
                {school.alerts.map((alert, i) => (
                  <View key={i} style={styles.alertRow}>
                    <Ionicons
                      name={school.risk === 'alto' ? 'alert-circle' : 'information-circle'}
                      size={14}
                      color={school.risk === 'alto' ? '#EF4444' : '#F59E0B'}
                    />
                    <Text style={styles.alertText}>{alert}</Text>
                  </View>
                ))}
              </View>
            )}
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
  schoolCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  schoolCardPressed: { transform: [{ scale: 0.98 }] },
  schoolCardGradient: { padding: 16 },
  schoolHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  schoolIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  schoolInfo: { flex: 1 },
  schoolName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  schoolDistrict: { fontSize: 12, color: colors.textSecondary },
  alertsList: { marginTop: 10, gap: 6 },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  alertText: { fontSize: 12, color: colors.textSecondary, flex: 1 },
});
