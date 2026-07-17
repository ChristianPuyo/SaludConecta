import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { MOCK_CONTACTS } from '../../data/mockData';

const DEPT_COLORS: Record<string, string> = {
  Emergencias: '#FEE2E2',
  'Consulta General': '#DBEAFE',
  Enfermería: '#D1FAE5',
  'Salud Mental': '#EDE9FE',
  Nutrición: '#FEF3C7',
  'Control Vectorial': '#FCE7F3',
};

const DEPT_ICON_COLORS: Record<string, string> = {
  Emergencias: '#EF4444',
  'Consulta General': '#2563EB',
  Enfermería: '#059669',
  'Salud Mental': '#7C3AED',
  Nutrición: '#D97706',
  'Control Vectorial': '#DB2777',
};

export function DirectorioScreen() {
  const call = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const grouped = MOCK_CONTACTS.reduce<Record<string, typeof MOCK_CONTACTS>>((acc, c) => {
    if (!acc[c.department]) acc[c.department] = [];
    acc[c.department].push(c);
    return acc;
  }, {});

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiNumber}>{MOCK_CONTACTS.length}</Text>
          <Text style={styles.kpiLabel}>Contactos</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={[styles.kpiNumber, { color: '#EF4444' }]}>
            {MOCK_CONTACTS.filter((c) => c.department === 'Emergencias').length}
          </Text>
          <Text style={styles.kpiLabel}>Emergencias</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={[styles.kpiNumber, { color: '#059669' }]}>
            {Object.keys(grouped).length}
          </Text>
          <Text style={styles.kpiLabel}>Departamentos</Text>
        </View>
      </View>

      {Object.entries(grouped).map(([dept, contacts]) => (
        <View key={dept} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.deptDot, { backgroundColor: DEPT_COLORS[dept] || '#F1F5F9' }]}>
              <Ionicons
                name="people"
                size={14}
                color={DEPT_ICON_COLORS[dept] || colors.textSecondary}
              />
            </View>
            <Text style={styles.sectionTitle}>{dept}</Text>
            <Text style={styles.sectionCount}>{contacts.length}</Text>
          </View>

          {contacts.map((contact) => (
            <Pressable
              key={contact.id}
              onPress={() =>
                Alert.alert(contact.name, `Rol: ${contact.role}\nDepartamento: ${contact.department}\n${contact.email ? `Email: ${contact.email}\n` : ''}Teléfono: ${contact.phone}`, [
                  { text: 'Cerrar' },
                  { text: 'Llamar', onPress: () => call(contact.phone) },
                ])
              }
              style={({ pressed }) => [styles.contactCard, pressed && styles.contactCardPressed]}
            >
              <View style={styles.contactAvatar}>
                <Text style={styles.avatarText}>{contact.name.charAt(0)}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactRole}>{contact.role}</Text>
              </View>
              <Pressable style={styles.callButton} onPress={() => call(contact.phone)}>
                <Ionicons name="call" size={16} color="#059669" />
              </Pressable>
            </Pressable>
          ))}
        </View>
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
  section: { gap: 8 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  deptDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactCardPressed: { backgroundColor: '#F0FDF4', transform: [{ scale: 0.98 }] },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '800', color: colors.primary },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  contactRole: { fontSize: 12, color: colors.textSecondary },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
