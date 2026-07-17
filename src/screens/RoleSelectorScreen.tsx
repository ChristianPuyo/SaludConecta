/**
 * RoleSelectorScreen - Landing page principal de SaludConecta.
 * Funciona como portal de bienvenida con hero, KPIs, estado epidemiológico,
 * mapa de riesgo, alertas, campañas activas, recursos educativos y
 * tarjetas de selección de rol (Ciudadano, Agente, Autoridad).
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRole } from '../context/RoleContext';
import { ROLE_OPTIONS } from '../types/role';
import { colors } from '../theme/colors';
import { RiskBadge } from '../components/RiskBadge';
import { ReportService } from '../services/reportService';
import { EducationService } from '../services/educationService';

export function RoleSelectorScreen() {
  const { selectRole } = useRole();
  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  const [reportCount, setReportCount] = useState(0);
  const [highRiskCount, setHighRiskCount] = useState(0);
  const [articles, setArticles] = useState<any[]>([]);
  const [stats, setStats] = useState({ weekly: 0, monthly: 0, alerts: 0 });

  useEffect(() => {
    (async () => {
      const reports = await ReportService.getAll();
      setReportCount(reports.length);
      setHighRiskCount(reports.filter(r => r.risk === 'alto').length);
      const weekAgo = Date.now() - 7 * 86400000;
      const monthAgo = Date.now() - 30 * 86400000;
      setStats({
        weekly: reports.filter(r => r.timestamp >= weekAgo).length,
        monthly: reports.filter(r => r.timestamp >= monthAgo).length,
        alerts: reports.filter(r => r.risk === 'alto' && r.timestamp >= weekAgo).length,
      });
      const arts = await EducationService.getAll();
      setArticles(arts.slice(0, 3));
    })();
  }, []);

  const districts = [
    { name: 'Callería', risk: 'alto' as const, cases: highRiskCount + 12 },
    { name: 'Yarinacocha', risk: 'medio' as const, cases: Math.floor(highRiskCount * 0.6) },
    { name: 'Manantay', risk: 'medio' as const, cases: Math.floor(highRiskCount * 0.4) },
    { name: 'Nueva Requena', risk: 'bajo' as const, cases: Math.floor(highRiskCount * 0.15) },
  ];

  const campaigns = [
    { title: 'Vacunación contra el Dengue', date: 'Jul-Sep 2026', progress: 45, icon: 'medkit' as const },
    { title: 'Prevención del Cólera', date: 'Jul-Ago 2026', progress: 30, icon: 'shield' as const },
    { title: 'Semana Salud Mental', date: 'Ago 2026', progress: 15, icon: 'bulb' as const },
  ];

  const features: Record<string, string[]> = {
    citizen: ['Reportar síntomas comunitarios', 'Historial médico personal', 'Alertas de salud local', 'Agenda de vacunación', 'Chat con IA de salud', 'Directorio de centros'],
    agent: ['Registro de visitas offline', 'Carga de datos comunitarios', 'Sincronización automática', 'Mapa de riesgo local', 'Seguimiento de pacientes', 'Reportes de campo'],
    authority: ['Dashboard epidemiológico', 'Mapas de calor interactivos', 'Alertas y notificaciones', 'Reportes ejecutivos', 'Gemelo digital de distritos', 'Simulación de escenarios'],
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <View style={styles.heroLogo}>
            <Ionicons name="shield-checkmark" size={32} color="#fff" />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Guardian Salud AI</Text>
            <Text style={styles.heroSubtitle}>SaludConecta · Plataforma de Vigilancia Epidemiológica</Text>
            <Text style={styles.heroDesc}>
              Sistema inteligente de monitoreo, reporte y análisis de salud pública para la Amazonía peruana.
              Empoderando a ciudadanos, agentes comunitarios y autoridades con datos en tiempo real.
            </Text>
          </View>
        </View>
        <View style={styles.heroActions}>
          <Pressable style={styles.heroBtnPrimary} onPress={() => selectRole('citizen')}>
            <Ionicons name="person" size={16} color="#fff" />
            <Text style={styles.heroBtnText}>Acceso Ciudadano</Text>
          </Pressable>
          <Pressable style={styles.heroBtnSecondary} onPress={() => selectRole('agent')}>
            <Ionicons name="medkit" size={16} color={colors.primary} />
            <Text style={[styles.heroBtnText, { color: colors.primary }]}>Agente Comunitario</Text>
          </Pressable>
          <Pressable style={styles.heroBtnSecondary} onPress={() => selectRole('authority')}>
            <Ionicons name="bar-chart" size={16} color={colors.primary} />
            <Text style={[styles.heroBtnText, { color: colors.primary }]}>Autoridad</Text>
          </Pressable>
        </View>
      </View>

      {/* KPIs */}
      <View style={[styles.kpiRow, isWide && styles.kpiRowWide]}>
        <KPI icon="document-text" value={stats.weekly} label="Reportes (7d)" color={colors.danger} />
        <KPI icon="warning" value={stats.alerts} label="Alertas activas" color={colors.warning} />
        <KPI icon="megaphone" value={campaigns.length} label="Campañas activas" color={colors.primary} />
        <KPI icon="pulse" value={highRiskCount} label="Alto riesgo" color={colors.danger} />
      </View>

      {/* Epidemiología + Mapa */}
      <View style={[styles.twoCol, isWide && styles.twoColWide]}>
        <View style={styles.panel}>
          <PanelHeader icon="eye" title="Estado Epidemiológico" />
          <View style={styles.epiGrid}>
            <View style={styles.epiItem}>
              <Text style={styles.epiLabel}>Reportes totales</Text>
              <Text style={styles.epiValue}>{reportCount}</Text>
            </View>
            <View style={styles.epiItem}>
              <Text style={styles.epiLabel}>Este mes</Text>
              <Text style={styles.epiValue}>{stats.monthly}</Text>
            </View>
            <View style={styles.epiItem}>
              <Text style={styles.epiLabel}>Riesgo general</Text>
              <RiskBadge level={highRiskCount > 5 ? 'alto' : highRiskCount > 2 ? 'medio' : 'bajo'} />
            </View>
            <View style={styles.epiItem}>
              <Text style={styles.epiLabel}>Última actualización</Text>
              <Text style={styles.epiDate}>Hoy {new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <PanelHeader icon="map" title="Riesgo por Distrito" />
          <View style={styles.mapGrid}>
            {districts.map(d => (
              <View key={d.name} style={styles.mapCard}>
                <Text style={styles.mapName}>{d.name}</Text>
                <RiskBadge level={d.risk} />
                <Text style={styles.mapCases}>{d.cases} casos</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Alertas recientes */}
      {stats.alerts > 0 && (
        <View style={styles.panel}>
          <PanelHeader icon="warning" title={`Alertas Recientes (${stats.alerts})`} />
          {Array.from({ length: Math.min(stats.alerts, 3) }).map((_, i) => (
            <View key={i} style={styles.alertRow}>
              <View style={styles.alertDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle}>Reporte de alto riesgo detectado</Text>
                <Text style={styles.alertMeta}>Requiere atención inmediata</Text>
              </View>
              <RiskBadge level="alto" />
            </View>
          ))}
        </View>
      )}

      {/* Campañas activas */}
      <View style={styles.panel}>
        <PanelHeader icon="megaphone" title="Campañas Activas" />
        <View style={[styles.campaignRow, isWide && styles.campaignRowWide]}>
          {campaigns.map((c, i) => (
            <View key={i} style={styles.campaignCard}>
              <View style={styles.campaignHead}>
                <View style={styles.campaignIcon}>
                  <Ionicons name={c.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.campaignDate}>{c.date}</Text>
              </View>
              <Text style={styles.campaignTitle}>{c.title}</Text>
              <View style={styles.campaignBar}>
                <View style={[styles.campaignBarFill, { width: `${c.progress}%` }]} />
              </View>
              <Text style={styles.campaignPct}>{c.progress}% cobertura</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recursos educativos */}
      {articles.length > 0 && (
        <View style={styles.panel}>
          <PanelHeader icon="book" title="Recursos Educativos" />
          <View style={[styles.articleRow, isWide && styles.articleRowWide]}>
            {articles.map(a => (
              <View key={a.id} style={styles.articleCard}>
                <View style={styles.articleBadge}>
                  <Text style={styles.articleBadgeText}>{a.category}</Text>
                </View>
                <Text style={styles.articleTitle}>{a.title}</Text>
                <Text style={styles.articleDesc} numberOfLines={2}>{a.description}</Text>
                <Text style={styles.articleMeta}>{a.readTime} min de lectura</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Roles */}
      <View style={styles.rolesSection}>
        <Text style={styles.sectionTitle}>Selecciona tu perfil de acceso</Text>
        <View style={[styles.roleGrid, isWide && styles.roleGridWide]}>
          {ROLE_OPTIONS.map(option => (
            <Pressable key={option.id} style={styles.roleCard} onPress={() => selectRole(option.id)}>
              <View style={styles.roleCardHeader}>
                <View style={styles.roleCardIcon}>
                  <Ionicons name={option.icon as any} size={28} color={colors.primary} />
                </View>
                <Text style={styles.roleCardTitle}>{option.title}</Text>
                <Text style={styles.roleCardDesc}>{option.description}</Text>
              </View>
              <View style={styles.roleFeatures}>
                {features[option.id].map((f, i) => (
                  <View key={i} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.roleCardFooter}>
                <Text style={styles.roleCardAction}>Ingresar como {option.title}</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.primary} />
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLogo}>
          <View style={styles.footerLogoIcon}><Text style={styles.footerLogoText}>SC</Text></View>
          <Text style={styles.footerName}>SaludConecta</Text>
        </View>
        <Text style={styles.footerTag}>Plataforma de Vigilancia Epidemiológica · MINSA</Text>
        <Text style={styles.footerVersion}>v1.0.0 · Powered by Guardian Salud AI</Text>
      </View>
    </ScrollView>
  );
}

function KPI({ icon, value, label, color }: { icon: keyof typeof Ionicons.glyphMap; value: number | string; label: string; color: string }) {
  return (
    <View style={styles.kpi}>
      <View style={[styles.kpiIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.kpiValue, { color }]}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

function PanelHeader({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) {
  return (
    <View style={styles.panelHeader}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <Text style={styles.panelTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 40 },

  /* Hero */
  hero: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 24, paddingVertical: 32,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    gap: 20,
  },
  heroContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  heroLogo: {
    width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroText: { flex: 1 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#fff' },
  heroSubtitle: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  heroDesc: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 8, lineHeight: 18, maxWidth: 600 },
  heroActions: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  heroBtnPrimary: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 11,
  },
  heroBtnSecondary: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 18, paddingVertical: 11,
  },
  heroBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  /* KPIs */
  kpiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 20, marginTop: -16 },
  kpiRowWide: { paddingHorizontal: 40 },
  kpi: {
    flex: 1, minWidth: 130, backgroundColor: colors.surface, borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: colors.border, gap: 4, alignItems: 'center',
  },
  kpiIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  kpiValue: { fontSize: 22, fontWeight: '800' },
  kpiLabel: { fontSize: 11, fontWeight: '600', color: colors.textSecondary, textAlign: 'center' },

  /* Panels */
  twoCol: { paddingHorizontal: 20, gap: 12 },
  twoColWide: { paddingHorizontal: 40, flexDirection: 'row' },
  panel: {
    backgroundColor: colors.surface, borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: colors.border, marginHorizontal: 20, marginTop: 14, gap: 12,
  },
  panelHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  panelTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },

  /* Epidemiología */
  epiGrid: { gap: 10 },
  epiItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  epiLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  epiValue: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  epiDate: { fontSize: 13, fontWeight: '600', color: colors.primary },

  /* Mapa */
  mapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  mapCard: {
    backgroundColor: colors.background, borderRadius: 12, padding: 12,
    width: '47%', gap: 4,
  },
  mapName: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  mapCases: { fontSize: 12, color: colors.textSecondary },

  /* Alertas */
  alertRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.danger + '08', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: colors.danger + '20',
  },
  alertDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger },
  alertTitle: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  alertMeta: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },

  /* Campañas */
  campaignRow: { gap: 10 },
  campaignRowWide: { flexDirection: 'row' },
  campaignCard: {
    backgroundColor: colors.background, borderRadius: 14, padding: 14, gap: 8,
    borderWidth: 1, borderColor: colors.border,
  },
  campaignHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  campaignIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  campaignDate: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  campaignTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  campaignBar: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  campaignBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  campaignPct: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },

  /* Artículos */
  articleRow: { gap: 10 },
  articleRowWide: { flexDirection: 'row' },
  articleCard: {
    backgroundColor: colors.background, borderRadius: 14, padding: 14, gap: 6,
    borderWidth: 1, borderColor: colors.border,
  },
  articleBadge: { alignSelf: 'flex-start', backgroundColor: colors.primary + '15', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  articleBadgeText: { fontSize: 10, fontWeight: '700', color: colors.primary, textTransform: 'uppercase' },
  articleTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  articleDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 16 },
  articleMeta: { fontSize: 11, color: colors.textSecondary },

  /* Roles */
  rolesSection: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: 14, textAlign: 'center' },
  roleGrid: { gap: 14 },
  roleGridWide: { flexDirection: 'row' },
  roleCard: {
    backgroundColor: colors.surface, borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: colors.border, gap: 14, flex: 1,
    borderTopWidth: 3, borderTopColor: colors.primary,
  },
  roleCardHeader: { gap: 8, alignItems: 'center' },
  roleCardIcon: {
    width: 56, height: 56, borderRadius: 16, backgroundColor: colors.primary + '12',
    alignItems: 'center', justifyContent: 'center',
  },
  roleCardTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  roleCardDesc: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', lineHeight: 16 },
  roleFeatures: { gap: 6, paddingVertical: 4 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  featureText: { fontSize: 12, color: colors.textPrimary, fontWeight: '500' },
  roleCardFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: colors.primary + '10', borderRadius: 12, paddingVertical: 12, marginTop: 4,
  },
  roleCardAction: { fontSize: 13, fontWeight: '700', color: colors.primary },

  /* Footer */
  footer: {
    alignItems: 'center', gap: 6, paddingVertical: 32, paddingHorizontal: 20, marginTop: 24,
    borderTopWidth: 1, borderTopColor: colors.border, marginHorizontal: 20,
  },
  footerLogo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  footerLogoIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  footerLogoText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  footerName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  footerTag: { fontSize: 11, color: colors.textSecondary },
  footerVersion: { fontSize: 10, color: colors.textSecondary },
});
