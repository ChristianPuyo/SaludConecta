import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useReports } from '../../context/ReportsContext';
import { colors } from '../../theme/colors';

// Base de conocimiento simple: no diagnostica, solo orienta.
// Cada síntoma clave tiene info educativa + recomendación + señal de "acudir ya".
type SymptomInfo = { info: string; recomendacion: string; urgente?: boolean };

const KNOWLEDGE_BASE: { [key: string]: SymptomInfo } = {
  Fiebre: {
    info: 'La fiebre puede ser señal de infecciones comunes en la zona, como dengue o infecciones respiratorias.',
    recomendacion: 'Hidrátate bien, descansa y controla tu temperatura cada pocas horas.',
  },
  Vómitos: {
    info: 'Los vómitos frecuentes pueden llevar a deshidratación rápidamente, especialmente en niños y adultos mayores.',
    recomendacion: 'Toma sorbos pequeños de agua o suero oral con frecuencia.',
    urgente: true,
  },
  Diarrea: {
    info: 'La diarrea prolongada puede indicar una infección intestinal.',
    recomendacion: 'Mantén una hidratación constante y evita alimentos irritantes.',
  },
  Tos: {
    info: 'La tos persistente puede estar relacionada con infecciones respiratorias.',
    recomendacion: 'Evita el contacto cercano con otras personas y cúbrete al toser.',
  },
  'Dolor muscular': {
    info: 'El dolor muscular junto a fiebre es un patrón asociado a enfermedades como el dengue.',
    recomendacion: 'Descansa lo más posible y evita el esfuerzo físico.',
  },
  'Dolor de cabeza': {
    info: 'El dolor de cabeza intenso combinado con fiebre requiere atención especial.',
    recomendacion: 'Descansa en un ambiente tranquilo y mantente hidratado.',
  },
};

export function AssistantScreen() {
  const { reports } = useReports();
  const lastReport = reports[0];
  const [selectedSymptoms] = useState<string[]>(lastReport?.symptoms ?? []);

  const urgente = selectedSymptoms.some((s) => KNOWLEDGE_BASE[s]?.urgente);
  const combinacionRiesgo =
    selectedSymptoms.includes('Fiebre') && selectedSymptoms.includes('Dolor muscular');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Asistente de Orientación Preventiva</Text>
      <Text style={styles.subtitle}>
        No reemplaza a un médico. Solo te da información educativa según tus síntomas reportados.
      </Text>

      {selectedSymptoms.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardText}>
            Aún no tienes síntomas reportados. Ve a "Reportar" para que el asistente pueda orientarte.
          </Text>
        </View>
      ) : (
        <>
          {(urgente || combinacionRiesgo) && (
            <View style={[styles.card, styles.alertCard]}>
              <Text style={styles.alertTitle}>⚠️ Te recomendamos acudir a un centro de salud</Text>
              <Text style={styles.cardText}>
                La combinación de síntomas que reportaste requiere evaluación profesional pronto.
              </Text>
            </View>
          )}

          {selectedSymptoms.map((symptom) => {
            const kb = KNOWLEDGE_BASE[symptom];
            if (!kb) return null;
            return (
              <View key={symptom} style={styles.card}>
                <Text style={styles.cardLabel}>{symptom.toUpperCase()}</Text>
                <Text style={styles.cardText}>{kb.info}</Text>
                <Text style={styles.recomendacion}>💡 {kb.recomendacion}</Text>
              </View>
            );
          })}
        </>
      )}

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          Este asistente no realiza diagnósticos médicos. Su función es exclusivamente
          informativa y preventiva. Ante síntomas graves o persistentes, acude a tu centro
          de salud más cercano.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, gap: 6, borderWidth: 1, borderColor: colors.border },
  cardLabel: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  cardText: { fontSize: 14, color: colors.textPrimary, lineHeight: 20 },
  recomendacion: { fontSize: 14, color: colors.primary, fontWeight: '600', marginTop: 4 },
  alertCard: { backgroundColor: '#fef2f2', borderColor: '#dc2626' },
  alertTitle: { fontSize: 15, fontWeight: '800', color: '#dc2626' },
  disclaimer: { marginTop: 8, padding: 12, borderRadius: 12, backgroundColor: '#f0f9ff' },
  disclaimerText: { fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
});