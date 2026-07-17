import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeIn, Layout } from 'react-native-reanimated';
import { MOCK_DISTRICT_RISK } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';
import { RiskBadge } from '../../components/RiskBadge';
import type { RiskLevel } from '../../components/RiskBadge';

const RISK_COLOR: Record<string, string> = {
  alto: '#DC2626',
  medio: '#D97706',
  bajo: '#16A34A',
};

function simulateRisk(cases: number): RiskLevel {
  if (cases >= 30) return 'alto';
  if (cases >= 15) return 'medio';
  return 'bajo';
}

export function AuthorityDashboardScreen() {
  const { colors } = useTheme();
  const [simAdjustments, setSimAdjustments] = useState<Record<string, number>>({});

  const totalCases = MOCK_DISTRICT_RISK.reduce((sum, d) => sum + d.cases, 0);
  const simulatedTotal = MOCK_DISTRICT_RISK.reduce((sum, d) => sum + d.cases + (simAdjustments[d.district] ?? 0), 0);
  const hasSim = Object.values(simAdjustments).some((v) => v !== 0);

  const adjust = (district: string, delta: number) => {
    setSimAdjustments((prev) => {
      const current = prev[district] ?? 0;
      const next = current + delta;
      if (next === 0) {
        const copy = { ...prev };
        delete copy[district];
        return copy;
      }
      return { ...prev, [district]: next };
    });
  };

  const reset = () => setSimAdjustments({});

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeIn.duration(500)}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Centro de Análisis</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Vigilancia epidemiológica en tiempo real · Ucayali</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(200).springify()} style={styles.kpiRow}>
        <View style={[styles.kpiCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.kpiNumber, { color: colors.primary }]}>
            {hasSim ? simulatedTotal : totalCases}
          </Text>
          <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Reportes totales</Text>
          {hasSim && (
            <Text style={[styles.simBadge, { color: colors.warning }]}>
              {simulatedTotal > totalCases ? '+' : ''}{simulatedTotal - totalCases} simulado
            </Text>
          )}
        </View>
        <View style={[styles.kpiCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.kpiNumber, { color: colors.danger }]}>
            {hasSim
              ? MOCK_DISTRICT_RISK.filter((d) => simulateRisk(d.cases + (simAdjustments[d.district] ?? 0)) === 'alto').length
              : MOCK_DISTRICT_RISK.filter((d) => d.risk === 'alto').length}
          </Text>
          <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Distritos en alerta</Text>
        </View>
        <View style={[styles.kpiCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.kpiNumber, { color: colors.primary }]}>{MOCK_DISTRICT_RISK.length}</Text>
          <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Distritos monitoreados</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(350).springify()}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Incidencia por distrito</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {MOCK_DISTRICT_RISK.map((district, index) => {
            const adjusted = simAdjustments[district.district] ?? 0;
            const simulatedCases = district.cases + adjusted;
            const maxCases = Math.max(...MOCK_DISTRICT_RISK.map((d) => d.cases + (simAdjustments[d.district] ?? 0)));
            const simRisk = simulateRisk(simulatedCases);
            return (
              <Animated.View
                key={district.district}
                entering={FadeInDown.duration(300).delay(400 + index * 80)}
                layout={Layout.springify()}
              >
                <Text style={[styles.barLabel, { color: colors.textPrimary }]}>{district.district}</Text>
                <View style={styles.barRow}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${(simulatedCases / maxCases) * 100}%`,
                          backgroundColor: RISK_COLOR[adjusted ? simRisk : district.risk],
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barValue, { color: colors.textSecondary }]}>
                    {adjusted ? `${district.cases}→${simulatedCases}` : simulatedCases}
                  </Text>
                </View>
                {adjusted !== 0 && (
                  <View style={styles.simControls}>
                    <RiskBadge level={simRisk} />
                    <Text style={[styles.simDelta, { color: adjusted > 0 ? colors.danger : colors.success }]}>
                      {adjusted > 0 ? `+${adjusted}` : adjusted}
                    </Text>
                  </View>
                )}
              </Animated.View>
            );
          })}
        </View>
      </Animated.View>

      <AnimatedCard delay={500}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>🔮 Simulador de escenarios</Text>
        <Text style={[styles.simHint, { color: colors.textSecondary }]}>
          Ajusta los casos por distrito para ver cómo cambiarían las alertas
        </Text>
        {MOCK_DISTRICT_RISK.map((district) => {
          const adjusted = simAdjustments[district.district] ?? 0;
          return (
            <View key={district.district} style={styles.simRow}>
              <Text style={[styles.simDistrict, { color: colors.textPrimary }]}>{district.district}</Text>
              <Text style={[styles.simCount, { color: colors.textSecondary }]}>
                {district.cases + adjusted} casos
              </Text>
              <View style={styles.simBtnRow}>
                <Pressable onPress={() => adjust(district.district, -10)} style={[styles.simBtn, { borderColor: colors.border }]}>
                  <Text style={{ color: colors.textPrimary }}>-10</Text>
                </Pressable>
                <Pressable onPress={() => adjust(district.district, -1)} style={[styles.simBtn, { borderColor: colors.border }]}>
                  <Text style={{ color: colors.textPrimary }}>-1</Text>
                </Pressable>
                <Pressable onPress={() => adjust(district.district, 1)} style={[styles.simBtn, { borderColor: colors.border }]}>
                  <Text style={{ color: colors.textPrimary }}>+1</Text>
                </Pressable>
                <Pressable onPress={() => adjust(district.district, 10)} style={[styles.simBtn, { borderColor: colors.border }]}>
                  <Text style={{ color: colors.textPrimary }}>+10</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
        {hasSim && (
          <Pressable onPress={reset} style={[styles.resetBtn, { borderColor: colors.danger }]}>
            <Text style={{ color: colors.danger, fontWeight: '700' }}>Restablecer simulación</Text>
          </Pressable>
        )}
      </AnimatedCard>

      <Animated.View entering={FadeInDown.duration(400).delay(700).springify()}>
        <View style={[styles.predictiveCard, { backgroundColor: hasSim ? '#FEF2F2' : '#EEF2FF' }]}>
          <Text style={styles.predictiveTitle}>
            {hasSim ? '⚠️ Proyección simulada' : '🔮 Analítica predictiva'}
          </Text>
          <Text style={styles.predictiveText}>
            {hasSim
              ? `Con los ajustes actuales, ${MOCK_DISTRICT_RISK
                  .filter((d) => simulateRisk(d.cases + (simAdjustments[d.district] ?? 0)) === 'alto')
                  .map((d) => d.district)
                  .join(', ') || 'ningún distrito'} estaría en alerta roja.`
              : 'Basado en patrones históricos, se estima un incremento de casos de dengue en Callería durante las próximas semanas.'}
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

function AnimatedCard({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(delay).springify()}
      style={[styles.card, style]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 26, fontWeight: '800' },
  subtitle: { fontSize: 14 },
  kpiRow: { flexDirection: 'row', gap: 10 },
  kpiCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1 },
  kpiNumber: { fontSize: 24, fontWeight: '800' },
  kpiLabel: { fontSize: 11, textAlign: 'center', marginTop: 4 },
  simBadge: { fontSize: 10, fontWeight: '700', marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  card: { borderRadius: 16, padding: 16, gap: 8 },
  barLabel: { fontSize: 13, fontWeight: '600' },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  barTrack: { flex: 1, height: 10, borderRadius: 999, backgroundColor: '#E2E8F0', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 999 },
  barValue: { fontSize: 12, width: 60, textAlign: 'right' },
  simControls: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  simDelta: { fontSize: 13, fontWeight: '800' },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  simHint: { fontSize: 12, marginBottom: 4 },
  simRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, flexWrap: 'wrap', gap: 6 },
  simDistrict: { fontWeight: '600', fontSize: 13, width: 90 },
  simCount: { fontSize: 12, width: 60 },
  simBtnRow: { flexDirection: 'row', gap: 4 },
  simBtn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  resetBtn: { borderWidth: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginTop: 8 },
  predictiveCard: { borderRadius: 16, padding: 16, gap: 6 },
  predictiveTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  predictiveText: { fontSize: 13, color: '#475569', lineHeight: 18 },
});
