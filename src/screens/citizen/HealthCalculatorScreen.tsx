import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { AnimatedCard } from '../../components/AnimatedCard';
import { RiskBadge } from '../../components/RiskBadge';
import { calcIMC, calcFrecuenciaCardiaca, calcRiesgoDiabetes } from '../../utils/healthCalculations';
import type { RiskLevel } from '../../components/RiskBadge';

const PREGUNTAS_DIABETES = [
  { pregunta: '¿Tienes familiares (padres, hermanos, abuelos) diagnosticados con diabetes?', detalle: 'Los antecedentes familiares aumentan significativamente el riesgo de desarrollar diabetes tipo 2.' },
  { pregunta: '¿Sientes sed excesiva y necesitas beber agua constantemente?', detalle: 'La sed excesiva (polidipsia) es uno de los síntomas más comunes de la diabetes no controlada.' },
  { pregunta: '¿Has notado visión borrosa o dificultad para enfocar en los últimos meses?', detalle: 'Los niveles altos de azúcar pueden causar hinchazón en el cristalino del ojo, afectando la visión.' },
  { pregunta: '¿Tus heridas, cortes o rasguños tardan más de lo normal en sanar?', detalle: 'La mala circulación y el alto nivel de azúcar dificultan la cicatrización de heridas.' },
];

const CATEGORIA_IMC: Record<string, { label: string; risk: RiskLevel }> = {
  bajo: { label: 'Bajo peso', risk: 'medio' },
  normal: { label: 'Normal', risk: 'bajo' },
  sobrepeso: { label: 'Sobrepeso', risk: 'medio' },
  obesidad: { label: 'Obesidad', risk: 'alto' },
};

export function HealthCalculatorScreen() {
  const { colors, isDark } = useTheme();
  const [peso, setPeso] = useState('');
  const [talla, setTalla] = useState('');
  const [resultadoIMC, setResultadoIMC] = useState<{ imc: number; categoria: string } | null>(null);
  const [edad, setEdad] = useState('');
  const [resultadoFC, setResultadoFC] = useState<ReturnType<typeof calcFrecuenciaCardiaca> | null>(null);
  const [respuestas, setRespuestas] = useState<boolean[]>([false, false, false, false]);
  const [riesgoDiabetes, setRiesgoDiabetes] = useState<RiskLevel | null>(null);

  const handleCalcIMC = () => {
    const p = parseFloat(peso);
    const t = parseFloat(talla);
    if (!p || !t || t < 50 || t > 250 || p < 10 || p > 300) return;
    const result = calcIMC(p, t);
    setResultadoIMC(result);
  };

  const handleCalcFC = () => {
    const e = parseInt(edad, 10);
    if (!e || e < 1 || e > 150) return;
    setResultadoFC(calcFrecuenciaCardiaca(e));
  };

  const toggleRespuesta = (index: number) => {
    setRespuestas((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleCalcDiabetes = () => {
    const result = calcRiesgoDiabetes(respuestas);
    setRiesgoDiabetes(result);
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.surface,
      color: colors.textPrimary,
      borderColor: colors.border,
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.duration(400)}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Calculadora de Salud</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Evalúa tu estado de salud con estas herramientas
        </Text>
      </Animated.View>

      <AnimatedCard delay={100}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>IMC — Índice de Masa Corporal</Text>
        <TextInput
          style={inputStyle}
          placeholder="Peso (kg)"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={peso}
          onChangeText={setPeso}
        />
        <TextInput
          style={inputStyle}
          placeholder="Talla (cm)"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={talla}
          onChangeText={setTalla}
        />
        <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleCalcIMC}>
          <Text style={styles.buttonText}>Calcular IMC</Text>
        </Pressable>
        {resultadoIMC && (
          <View style={styles.resultRow}>
            <Text style={[styles.resultText, { color: colors.textPrimary }]}>
              IMC: {resultadoIMC.imc}
            </Text>
            <RiskBadge level={CATEGORIA_IMC[resultadoIMC.categoria]?.risk ?? 'bajo'} />
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 4 }}>
              {CATEGORIA_IMC[resultadoIMC.categoria]?.label ?? resultadoIMC.categoria}
            </Text>
          </View>
        )}
      </AnimatedCard>

      <AnimatedCard delay={200}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Frecuencia Cardíaca Saludable</Text>
        <TextInput
          style={inputStyle}
          placeholder="Tu edad"
          placeholderTextColor={colors.textSecondary}
          keyboardType="numeric"
          value={edad}
          onChangeText={setEdad}
        />
        <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleCalcFC}>
          <Text style={styles.buttonText}>Calcular zonas</Text>
        </Pressable>
        {resultadoFC && (
          <View style={{ gap: 4, marginTop: 8 }}>
            <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>
              FC Máxima: {resultadoFC.fcMax} lpm
            </Text>
            <Text style={{ color: colors.textSecondary }}>Quema grasa: {resultadoFC.zonaQuemaGrasa} lpm</Text>
            <Text style={{ color: colors.textSecondary }}>Cardio: {resultadoFC.zonaCardio} lpm</Text>
            <Text style={{ color: colors.textSecondary }}>Máximo: {resultadoFC.zonaMaxima} lpm</Text>
          </View>
        )}
      </AnimatedCard>

      <AnimatedCard delay={300}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Índice de Riesgo de Diabetes</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 8 }}>
          Responde con sinceridad las siguientes preguntas
        </Text>
        {PREGUNTAS_DIABETES.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => toggleRespuesta(index)}
            style={[styles.checkRow, { borderColor: colors.border }]}
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: colors.primary,
                  backgroundColor: respuestas[index] ? colors.primary : 'transparent',
                },
              ]}
            >
              {respuestas[index] && <Text style={{ color: '#fff', fontWeight: '800' }}>✓</Text>}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>{item.pregunta}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }}>{item.detalle}</Text>
            </View>
          </Pressable>
        ))}
        <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleCalcDiabetes}>
          <Text style={styles.buttonText}>Evaluar riesgo</Text>
        </Pressable>
        {riesgoDiabetes && (
          <View style={styles.resultRow}>
            <Text style={[styles.resultText, { color: colors.textPrimary }]}>Riesgo estimado:</Text>
            <RiskBadge level={riesgoDiabetes} />
          </View>
        )}
      </AnimatedCard>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 22, fontWeight: '800' },
  subtitle: { fontSize: 14, marginTop: 4 },
  cardTitle: { fontSize: 17, fontWeight: '700', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    fontSize: 15,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  resultRow: { marginTop: 12, gap: 6 },
  resultText: { fontSize: 16, fontWeight: '700' },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
