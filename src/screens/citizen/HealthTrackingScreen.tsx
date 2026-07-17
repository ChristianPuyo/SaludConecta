import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { HealthIndicator } from '../../models/healthIndicator';
import { HealthTrackingService } from '../../services/healthTrackingService';
import { SectionHeader } from '../../components/SectionHeader';
import { colors } from '../../theme/colors';
import { formatShortDate } from '../../utils/date';

export function HealthTrackingScreen() {
  const [indicators, setIndicators] = useState<HealthIndicator[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [temperature, setTemperature] = useState('');
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');
  const [glucose, setGlucose] = useState('');
  const [weight, setWeight] = useState('');
  const [heartRate, setHeartRate] = useState('');

  useEffect(() => {
    HealthTrackingService.getRecent(30).then(setIndicators);
  }, []);

  const handleAdd = async () => {
    const data: Omit<HealthIndicator, 'id' | 'timestamp'> = {
      date: new Date().toISOString(),
      notes: '',
    };
    if (temperature) data.temperature = Number(temperature);
    if (bpSystolic && bpDiastolic) {
      data.bloodPressureSystolic = Number(bpSystolic);
      data.bloodPressureDiastolic = Number(bpDiastolic);
    }
    if (glucose) data.glucose = Number(glucose);
    if (weight) data.weight = Number(weight);
    if (heartRate) data.heartRate = Number(heartRate);

    await HealthTrackingService.add(data);
    const updated = await HealthTrackingService.getRecent(30);
    setIndicators(updated);
    setTemperature('');
    setBpSystolic('');
    setBpDiastolic('');
    setGlucose('');
    setWeight('');
    setHeartRate('');
    setShowForm(false);
    Alert.alert('Registro guardado');
  };

  const latest = indicators[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Seguimiento de Salud</Text>
        <Pressable style={styles.addBtn} onPress={() => setShowForm(!showForm)}>
          <Ionicons name={showForm ? 'close' : 'add'} size={22} color="#fff" />
        </Pressable>
      </View>

      {latest && (
        <View style={styles.latestCard}>
          <Text style={styles.latestTitle}>Último registro</Text>
          <Text style={styles.latestDate}>{formatShortDate(latest.date)}</Text>
          <View style={styles.latestGrid}>
            {latest.temperature && <IndicatorBox label="Temperatura" value={`${latest.temperature}°C`} />}
            {latest.bloodPressureSystolic && <IndicatorBox label="Presión Arterial" value={`${latest.bloodPressureSystolic}/${latest.bloodPressureDiastolic}`} />}
            {latest.glucose && <IndicatorBox label="Glucosa" value={`${latest.glucose} mg/dL`} />}
            {latest.weight && <IndicatorBox label="Peso" value={`${latest.weight} kg`} />}
            {latest.heartRate && <IndicatorBox label="Frecuencia Cardíaca" value={`${latest.heartRate} lpm`} />}
          </View>
        </View>
      )}

      {showForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Nuevo registro</Text>
          <View style={styles.formRow}>
            <Field label="Temperatura (°C)" value={temperature} onChange={setTemperature} keyboardType="decimal-pad" />
            <Field label="Frec. Cardíaca (lpm)" value={heartRate} onChange={setHeartRate} keyboardType="decimal-pad" />
          </View>
          <View style={styles.formRow}>
            <Field label="Presión Sistólica" value={bpSystolic} onChange={setBpSystolic} keyboardType="decimal-pad" />
            <Field label="Presión Diastólica" value={bpDiastolic} onChange={setBpDiastolic} keyboardType="decimal-pad" />
          </View>
          <View style={styles.formRow}>
            <Field label="Glucosa (mg/dL)" value={glucose} onChange={setGlucose} keyboardType="decimal-pad" />
            <Field label="Peso (kg)" value={weight} onChange={setWeight} keyboardType="decimal-pad" />
          </View>
          <Pressable style={styles.saveBtn} onPress={handleAdd}>
            <Text style={styles.saveBtnText}>Guardar registro</Text>
          </Pressable>
        </View>
      )}

      <SectionHeader title="Historial" />

      {indicators.map((ind) => (
        <View key={ind.id} style={styles.historyCard}>
          <Text style={styles.historyDate}>{formatShortDate(ind.date)}</Text>
          <View style={styles.historyGrid}>
            {ind.temperature && <Text style={styles.historyItem}>🌡 {ind.temperature}°C</Text>}
            {ind.bloodPressureSystolic && <Text style={styles.historyItem}>🩺 {ind.bloodPressureSystolic}/{ind.bloodPressureDiastolic}</Text>}
            {ind.glucose && <Text style={styles.historyItem}>💉 {ind.glucose}</Text>}
            {ind.weight && <Text style={styles.historyItem}>⚖️ {ind.weight}kg</Text>}
            {ind.heartRate && <Text style={styles.historyItem}>❤️ {ind.heartRate}</Text>}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function IndicatorBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.indicatorBox}>
      <Text style={styles.indicatorValue}>{value}</Text>
      <Text style={styles.indicatorLabel}>{label}</Text>
    </View>
  );
}

function Field({ label, value, onChange, keyboardType }: { label: string; value: string; onChange: (v: string) => void; keyboardType?: any }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChange} keyboardType={keyboardType} placeholderTextColor={colors.textSecondary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  addBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  latestCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  latestTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  latestDate: { fontSize: 12, color: colors.textSecondary, marginBottom: 12 },
  latestGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  indicatorBox: { backgroundColor: '#F0FDFA', borderRadius: 12, padding: 12, alignItems: 'center', minWidth: 80, flex: 1 },
  indicatorValue: { fontSize: 16, fontWeight: '800', color: colors.primary },
  indicatorLabel: { fontSize: 10, color: colors.textSecondary, textAlign: 'center', marginTop: 2 },
  formCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12, gap: 10 },
  formTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  formRow: { flexDirection: 'row', gap: 10 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: colors.background, color: colors.textPrimary, fontSize: 14 },
  saveBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '700' },
  historyCard: { backgroundColor: colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  historyDate: { fontSize: 12, color: colors.textSecondary, fontWeight: '600', marginBottom: 6 },
  historyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  historyItem: { fontSize: 13, color: colors.textPrimary, fontWeight: '500' },
});
