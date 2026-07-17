import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MOCK_DISTRICT_RISK } from '../../data/mockData';
import { ReportService } from '../../services/reportService';
import { NotificationService } from '../../services/notificationService';
import { StatCard } from '../../components/StatCard';
import { SectionHeader } from '../../components/SectionHeader';
import { colors } from '../../theme/colors';

const RISK_COLOR: Record<string, string> = { alto: colors.danger, medio: colors.warning, bajo: colors.success };

export function AuthorityDashboardScreen() {
  const [reportCount, setReportCount] = useState(0);
  const [recentAlerts, setRecentAlerts] = useState(0);

  useEffect(() => {
    (async () => {
      const reports = await ReportService.getAll();
      setReportCount(reports.length);
      const notifs = await NotificationService.getAll();
      setRecentAlerts(notifs.filter((n) => n.type === 'alerta_epidemiologica').length);
    })();
  }, []);

  const totalCases = MOCK_DISTRICT_RISK.reduce((sum, d) => sum + d.cases, 0);
  const alertDistricts = MOCK_DISTRICT_RISK.filter((d) => d.risk === 'alto').length;
  const maxCases = Math.max(...MOCK_DISTRICT_RISK.map((d) => d.cases));

  const growthRate = '+12%'; // simulated

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Centro de Análisis</Text>
      <Text style={styles.subtitle}>Vigilancia epidemiológica en tiempo real · Ucayali</Text>

      <View style={styles.kpiRow}>
        <StatCard value={reportCount || totalCases} label="Reportes totales" />
        <StatCard value={alertDistricts} label="Distritos en alerta" color={alertDistricts > 0 ? colors.danger : undefined} />
        <StatCard value={MOCK_DISTRICT_RISK.length} label="Distritos monitoreados" />
      </View>

      <View style={styles.kpiRow}>
        <StatCard value={growthRate} label="Crecimiento semanal" color={colors.danger} />
        <StatCard value={recentAlerts} label="Alertas generadas" color={recentAlerts > 0 ? colors.warning : undefined} />
      </View>

      <SectionHeader title="Incidencia por distrito" />

      <View style={styles.card}>
        {MOCK_DISTRICT_RISK.map((district) => (
          <View key={district.district} style={styles.barRow}>
            <Text style={styles.barLabel}>{district.district}</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${(district.cases / maxCases) * 100}%`, backgroundColor: RISK_COLOR[district.risk] }]} />
            </View>
            <Text style={styles.barValue}>{district.cases}</Text>
          </View>
        ))}
      </View>

      <View style={styles.predictiveCard}>
        <Text style={styles.predictiveTitle}>🔮 Analítica predictiva</Text>
        <Text style={styles.predictiveText}>
          Basado en patrones históricos, se estima un incremento de casos de dengue en Callería durante las próximas semanas. Se recomienda activar campañas preventivas.
        </Text>
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>📊 Grupos etarios más afectados</Text>
        <Text style={styles.insightText}>· 0-12 años: 28% de los reportes</Text>
        <Text style={styles.insightText}>· 13-25 años: 22% de los reportes</Text>
        <Text style={styles.insightText}>· 26-50 años: 35% de los reportes</Text>
        <Text style={styles.insightText}>· 50+ años: 15% de los reportes</Text>
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightTitle}>🦠 Enfermedades más frecuentes</Text>
        <Text style={styles.insightText}>1. Dengue (42 reportes)</Text>
        <Text style={styles.insightText}>2. Infecciones respiratorias (28 reportes)</Text>
        <Text style={styles.insightText}>3. Enfermedades diarreicas (15 reportes)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 12 },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary },
  kpiRow: { flexDirection: 'row', gap: 10 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 10 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { width: 100, fontSize: 12, color: colors.textPrimary, fontWeight: '600' },
  barTrack: { flex: 1, height: 10, borderRadius: 999, backgroundColor: colors.background, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 999 },
  barValue: { width: 28, fontSize: 12, color: colors.textSecondary, textAlign: 'right' },
  predictiveCard: { backgroundColor: '#EEF2FF', borderRadius: 16, padding: 16, gap: 6 },
  predictiveTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  predictiveText: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  insightCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 4 },
  insightTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  insightText: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
});
