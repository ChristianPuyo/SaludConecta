import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, TextInput, ScrollView } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useAlerts, type EmergencyLevel } from '../../context/AlertsContext';
import { MOCK_DISTRICT_RISK } from '../../data/mockData';
import { RiskBadge } from '../../components/RiskBadge';
import { useTheme } from '../../context/ThemeContext';
import type { EpidemicAlert } from '../../data/mockData';

const LEVELS: { key: EmergencyLevel; label: string; color: string; desc: string }[] = [
  { key: 'alerta', label: 'Alerta', color: '#D97706', desc: 'Vigilancia intensificada' },
  { key: 'emergencia', label: 'Emergencia', color: '#DC2626', desc: 'Activación de brigadas' },
  { key: 'crisis', label: 'Crisis', color: '#7C3AED', desc: 'Respuesta inmediata requerida' },
];

export function AlertsScreen() {
  const { colors } = useTheme();
  const { alerts, declareEmergency } = useAlerts();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(MOCK_DISTRICT_RISK[0].district);
  const [selectedLevel, setSelectedLevel] = useState<EmergencyLevel>('alerta');
  const [description, setDescription] = useState('');

  const handleDeclare = () => {
    if (!description.trim()) return;
    declareEmergency(selectedDistrict, selectedLevel, description.trim());
    setModalVisible(false);
    setDescription('');
    setSelectedLevel('alerta');
  };

  const renderItem = ({ item, index }: { item: EpidemicAlert; index: number }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 100).springify()}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{item.title}</Text>
          <RiskBadge level={item.risk} />
        </View>
        <Text style={[styles.cardDistrict, { color: colors.textSecondary }]}>{item.district} · {item.date}</Text>
        <Text style={[styles.cardDetail, { color: colors.textSecondary }]}>{item.detail}</Text>
      </View>
    </Animated.View>
  );

  return (
    <>
      <FlatList
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>Alertas generadas por IA</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Patrones detectados automáticamente a partir de los reportes ciudadanos
                </Text>
              </View>
              <Pressable
                onPress={() => setModalVisible(true)}
                style={[styles.declareBtn, { backgroundColor: colors.danger }]}
              >
                <Text style={styles.declareBtnText}>+ Declarar</Text>
              </Pressable>
            </View>
          </Animated.View>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <ScrollView style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Declarar Emergencia Sanitaria</Text>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Distrito</Text>
            <View style={styles.districtRow}>
              {MOCK_DISTRICT_RISK.map((d) => (
                <Pressable
                  key={d.district}
                  onPress={() => setSelectedDistrict(d.district)}
                  style={[
                    styles.chip,
                    {
                      borderColor: colors.border,
                      backgroundColor: selectedDistrict === d.district ? colors.primary : colors.surface,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: selectedDistrict === d.district ? '#fff' : colors.textPrimary,
                      fontWeight: '600',
                      fontSize: 13,
                    }}
                  >
                    {d.district}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Nivel de emergencia</Text>
            <View style={{ gap: 8 }}>
              {LEVELS.map((level) => (
                <Pressable
                  key={level.key}
                  onPress={() => setSelectedLevel(level.key)}
                  style={[
                    styles.levelRow,
                    {
                      borderColor: selectedLevel === level.key ? level.color : colors.border,
                      backgroundColor: selectedLevel === level.key ? level.color + '15' : 'transparent',
                    },
                  ]}
                >
                  <View style={[styles.radio, { borderColor: level.color, backgroundColor: selectedLevel === level.key ? level.color : 'transparent' }]}>
                    {selectedLevel === level.key && <View style={styles.radioInner} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>{level.label}</Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{level.desc}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Descripción</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.background, color: colors.textPrimary, borderColor: colors.border }]}
              placeholder="Describe la situación..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />

            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={[styles.modalBtn, { borderColor: colors.border, borderWidth: 1 }]}
              >
                <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handleDeclare}
                style={[styles.modalBtn, { backgroundColor: colors.danger }]}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>Declarar Emergencia</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  header: { marginBottom: 12, gap: 4 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  title: { fontSize: 22, fontWeight: '800' },
  subtitle: { fontSize: 13 },
  declareBtn: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  declareBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  card: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 12, gap: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: '700', flex: 1 },
  cardDistrict: { fontSize: 12, fontWeight: '600' },
  cardDetail: { fontSize: 13, lineHeight: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, gap: 16, maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  label: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  districtRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: 12, padding: 14 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 8, height: 8, borderRadius: 4 },
  textArea: { borderRadius: 12, borderWidth: 1, padding: 14, fontSize: 14, minHeight: 80, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalBtn: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
});
