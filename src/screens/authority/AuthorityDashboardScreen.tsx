import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, ActivityIndicator, Platform, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { MOCK_DISTRICT_RISK, MOCK_DISTRICT_COMPARISON, DistrictComparison } from '../../data/mockData';
import { colors } from '../../theme/colors';
import { RiskBadge } from '../../components/RiskBadge';

const RISK_COLOR: Record<string, string> = {
  alto: colors.danger,
  medio: colors.warning,
  bajo: colors.success,
};

const STATUS_COLOR: Record<string, string> = {
  'En alerta': colors.danger,
  'Monitoreo': colors.warning,
  'Normal': colors.success,
};

const SYMPTOMS_BY_DISTRICT: Record<string, string[]> = {
  'Callería': ['Fiebre alta', 'Dolor muscular', 'Dolor de cabeza', 'Náuseas', 'Erupción cutánea'],
  'Yarinacocha': ['Fiebre', 'Tos persistente', 'Dolor torácico', 'Fatiga'],
  'Manantay': ['Fiebre moderada', 'Dolor articular', 'Malestar general'],
  'Campoverde': ['Tos leve', 'Congestión nasal', 'Dolor de garganta'],
  'Nueva Requena': ['Tos esporádica', 'Rinorrea', 'Sinusitis leve'],
};

const PREVENTIVE_RECOMMENDATIONS: Record<string, string[]> = {
  'Callería': [
    'Evitar acumulación de agua estancada en recipients y neumáticos.',
    'Usar repelente con DEET o icaridina cada 4 horas.',
    'Acudir al centro de salud ante fiebre persistente mayor a 38°C.',
    'Colocar mosquiteros en ventanas y puertas.',
  ],
  'Yarinacocha': [
    'Mantener ventilación adecuada en viviendas.',
    'Reportar síntomas respiratorios al agente comunitario más cercano.',
    'Hidratarse adecuadamente si presenta fiebre.',
    'Evitar automedicarse, consultar profesional de salud.',
  ],
  'Manantay': [
    'Reforzar medidas de higiene personal y comunitaria.',
    'Asistir a jornadas de vacunación programadas.',
    'Consultar al centro de salud ante síntomas persistentes.',
  ],
  'Campoverde': [
    'Mantener hábitos de higiene de manos frecuentes.',
    'Cubrirse boca y nariz al toser o estornudar.',
    'Buscar atención médica si los síntomas empeoran.',
  ],
  'Nueva Requena': [
    'Mantener ambientes ventilados y limpios.',
    'Reportar cambios en la salud al agente comunitario.',
    'Asistir a controles de salud periódicos.',
  ],
};

function getCurrentDateTime(): string {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function getRiskLabel(risk: string): string {
  const labels: Record<string, string> = { alto: 'Alto', medio: 'Moderado', bajo: 'Bajo' };
  return labels[risk] || risk;
}

function getRiskColorHex(risk: string): string {
  return RISK_COLOR[risk] || '#64748B';
}

function generateReportHTML(c1: DistrictComparison, c2: DistrictComparison): string {
  const higherReports = c1.reports > c2.reports ? c1 : c2;
  const lowerReports = c1.reports > c2.reports ? c2 : c1;
  const higherTrend = parseFloat(c1.trend) > parseFloat(c2.trend) ? c1 : c2;
  const conclusion = `${higherReports.district} presenta mayor nivel de riesgo (${getRiskLabel(higherReports.risk)}) y una tendencia de crecimiento superior (${higherReports.trend}) a ${lowerReports.district}. Guardian Salud IA recomienda priorizar acciones de vigilancia e intervención en ${higherReports.district}.${higherTrend.district !== higherReports.district ? ` Adicionalmente, ${higherTrend.district} muestra la mayor tasa de crecimiento y debe ser monitoreado de cerca.` : ''}`;

  const recs1 = PREVENTIVE_RECOMMENDATIONS[c1.district] || [];
  const recs2 = PREVENTIVE_RECOMMENDATIONS[c2.district] || [];

  const renderRecs = (recs: string[]) =>
    recs.map((r) => `<li style="margin-bottom:6px;color:#475569;font-size:13px;line-height:1.5;">${r}</li>`).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Informe Comparativo - Guardian Salud IA</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; color: #0F172A; padding: 32px; }
    .header { text-align: center; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 2px solid #E2E8F0; }
    .brand { font-size: 12px; font-weight: 700; color: #0F766E; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
    .title { font-size: 22px; font-weight: 800; color: #0F172A; margin-bottom: 4px; }
    .subtitle { font-size: 16px; font-weight: 700; color: #0F766E; margin-bottom: 4px; }
    .date { font-size: 12px; color: #475569; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 15px; font-weight: 700; color: #115E59; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #E2E8F0; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    th { background: #115E59; color: #fff; padding: 10px 12px; font-size: 12px; font-weight: 700; text-align: center; }
    th:first-child { text-align: left; }
    td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #E2E8F0; }
    td:first-child { font-weight: 600; color: #475569; }
    td:not(:first-child) { text-align: center; font-weight: 700; }
    .risk-alto { color: #DC2626; }
    .risk-medio { color: #D97706; }
    .risk-bajo { color: #16A34A; }
    .prioritized { background: #FEF3C7; border: 1.5px solid #D97706; border-radius: 10px; padding: 14px 16px; }
    .prioritized-name { font-size: 17px; font-weight: 800; color: #D97706; margin-bottom: 4px; }
    .prioritized-reason { font-size: 13px; color: #475569; }
    .ai-card { background: #F0F4FF; border: 1px solid #D6E0FF; border-left: 4px solid #2563EB; border-radius: 10px; padding: 16px; }
    .ai-title { font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 8px; }
    .ai-text { font-size: 13px; color: #475569; line-height: 1.6; }
    .recs-section { margin-bottom: 16px; }
    .recs-title { font-size: 13px; font-weight: 700; color: #0F766E; margin-bottom: 6px; }
    ul { padding-left: 18px; }
    .footer { text-align: center; margin-top: 28px; padding-top: 16px; border-top: 1px solid #E2E8F0; font-size: 11px; color: #94A3B8; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">Guardian Salud IA</div>
    <div class="title">Informe Comparativo Epidemiológico</div>
    <div class="subtitle">${c1.district} vs ${c2.district}</div>
    <div class="date">Generado el ${getCurrentDateTime()}</div>
  </div>

  <div class="section">
    <div class="section-title">Comparación de Indicadores</div>
    <table>
      <thead>
        <tr><th>Indicador</th><th>${c1.district}</th><th>${c2.district}</th></tr>
      </thead>
      <tbody>
        <tr><td>Reportes totales</td><td class="risk-${c1.risk}">${c1.reports}</td><td class="risk-${c2.risk}">${c2.reports}</td></tr>
        <tr><td>Nivel de riesgo</td><td class="risk-${c1.risk}">${getRiskLabel(c1.risk)}</td><td class="risk-${c2.risk}">${getRiskLabel(c2.risk)}</td></tr>
        <tr><td>Tendencia</td><td class="${c1.trend.startsWith('+') ? 'risk-alto' : 'risk-bajo'}">${c1.trend}</td><td class="${c2.trend.startsWith('+') ? 'risk-alto' : 'risk-bajo'}">${c2.trend}</td></tr>
        <tr><td>Enfermedad predominante</td><td>${c1.predominantDisease}</td><td>${c2.predominantDisease}</td></tr>
        <tr><td>Estado actual</td><td>${c1.status}</td><td>${c2.status}</td></tr>
        <tr><td>Última actualización</td><td>${c1.lastUpdate}</td><td>${c2.lastUpdate}</td></tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Distrito Priorizado</div>
    <div class="prioritized">
      <div class="prioritized-name">${higherReports.district}</div>
      <div class="prioritized-reason">Mayor cantidad de reportes (${higherReports.reports}) y nivel de riesgo ${getRiskLabel(higherReports.risk)}.</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Recomendación de Guardian Salud IA</div>
    <div class="ai-card">
      <div class="ai-text">${conclusion}</div>
    </div>
  </div>

  <div class="section recs-section">
    <div class="section-title">Recomendaciones Preventivas</div>
    <div class="recs-title">${c1.district}</div>
    <ul>${renderRecs(recs1)}</ul>
    <div class="recs-title" style="margin-top:12px;">${c2.district}</div>
    <ul>${renderRecs(recs2)}</ul>
  </div>

  <div class="footer">
    <div>Guardian Salud IA · Sistema de Vigilancia Epidemiológica</div>
    <div>Generado automáticamente el ${getCurrentDateTime()}</div>
  </div>
</body>
</html>`;
}

export function AuthorityDashboardScreen() {
  const totalCases = MOCK_DISTRICT_RISK.reduce((sum, d) => sum + d.cases, 0);
  const alertDistricts = MOCK_DISTRICT_RISK.filter((d) => d.risk === 'alto').length;
  const maxCases = Math.max(...MOCK_DISTRICT_RISK.map((d) => d.cases));

  const [district1, setDistrict1] = useState('');
  const [district2, setDistrict2] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [selectionMessage, setSelectionMessage] = useState('');

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailDistrict, setDetailDistrict] = useState<DistrictComparison | null>(null);

  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isPressedClose, setIsPressedClose] = useState(false);

  const [detailPressed, setDetailPressed] = useState<string | null>(null);

  const comparison1 = MOCK_DISTRICT_COMPARISON.find((d) => d.district === district1);
  const comparison2 = MOCK_DISTRICT_COMPARISON.find((d) => d.district === district2);

  const isCompareEnabled = district1 !== '' && district2 !== '' && district1 !== district2;

  const handleSelectDistrict1 = (district: string) => {
    if (district === district2) {
      setDistrict2('');
      setSelectionMessage('Selecciona otro distrito para continuar.');
      setShowComparison(false);
    } else {
      setSelectionMessage('');
    }
    setDistrict1(district);
  };

  const handleSelectDistrict2 = (district: string) => {
    if (district === district1) {
      setDistrict1('');
      setSelectionMessage('Selecciona otro distrito para continuar.');
      setShowComparison(false);
    } else {
      setSelectionMessage('');
    }
    setDistrict2(district);
  };

  const handleCompare = () => {
    if (!isCompareEnabled) return;
    setShowComparison(true);
    setSelectionMessage('');
  };

  const generateRecommendation = useCallback(() => {
    if (!comparison1 || !comparison2) return '';
    const higher = comparison1.reports > comparison2.reports ? comparison1 : comparison2;
    return `${higher.district} presenta mayor cantidad de reportes (${higher.reports}), mayor tendencia de crecimiento (${higher.trend}) y un nivel de riesgo ${higher.risk}. Se recomienda priorizar brigadas de intervención y vigilancia activa en este distrito.`;
  }, [comparison1, comparison2]);

  const generateReportConclusion = useCallback(() => {
    if (!comparison1 || !comparison2) return '';
    const higherReports = comparison1.reports > comparison2.reports ? comparison1 : comparison2;
    const lowerReports = comparison1.reports > comparison2.reports ? comparison2 : comparison1;
    const higherTrend = parseFloat(comparison1.trend) > parseFloat(comparison2.trend) ? comparison1 : comparison2;
    return `${higherReports.district} presenta mayor nivel de riesgo (${higherReports.risk}) y una tendencia de crecimiento superior (${higherReports.trend}) a ${lowerReports.district}. Guardian Salud IA recomienda priorizar acciones de vigilancia e intervención en ${higherReports.district}.${higherTrend.district !== higherReports.district ? ` Additionally, ${higherTrend.district} muestra la mayor tasa de crecimiento y debe ser monitoreado de cerca.` : ''}`;
  }, [comparison1, comparison2]);

  const handleOpenDetail = (district: DistrictComparison) => {
    setDetailDistrict(district);
    setDetailModalVisible(true);
  };

  const handleOpenReport = () => {
    if (!comparison1 || !comparison2 || !showComparison) {
      Alert.alert('Comparación requerida', 'Primero compara dos distritos diferentes.');
      return;
    }
    setIsGeneratingReport(true);
    setTimeout(() => {
      setIsGeneratingReport(false);
      setReportModalVisible(true);
    }, 1200);
  };

  const handleCloseReport = () => {
    setReportModalVisible(false);
    setIsDownloading(false);
    setIsSharing(false);
  };

  const handleDownloadReport = async () => {
    if (!comparison1 || !comparison2 || !showComparison) {
      Alert.alert('Comparación requerida', 'Primero compara dos distritos diferentes.');
      return;
    }
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const html = generateReportHTML(comparison1, comparison2);

      if (Platform.OS === 'web') {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
        } else {
          Alert.alert(
            'Bloqueado por el navegador',
            'El navegador bloqueó la ventana emergente. Permite las ventanas emergentes y vuelve a intentar.',
          );
        }
        setIsDownloading(false);
        return;
      }

      const { uri } = await Print.printToFileAsync({ html });
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
      } else {
        Alert.alert('PDF generado', `El archivo se guardó en:\n${uri}`);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el informe. Intenta nuevamente.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareReport = async () => {
    if (!comparison1 || !comparison2 || !showComparison) {
      Alert.alert('Comparación requerida', 'Primero compara dos distritos diferentes.');
      return;
    }
    if (isSharing) return;

    setIsSharing(true);
    try {
      if (Platform.OS === 'web') {
        if (navigator.share) {
          const html = generateReportHTML(comparison1, comparison2);
          const blob = new Blob([html], { type: 'text/html' });
          const file = new File([blob], `Informe_${comparison1.district}_vs_${comparison2.district}.html`, { type: 'text/html' });
          await navigator.share({ title: `Informe ${comparison1.district} vs ${comparison2.district}`, files: [file] });
        } else {
          Alert.alert(
            'Función no disponible',
            'La función de compartir no está disponible en este navegador. Puedes guardar el informe como PDF usando "Descargar informe".',
          );
        }
        setIsSharing(false);
        return;
      }

      const html = generateReportHTML(comparison1, comparison2);
      const { uri } = await Print.printToFileAsync({ html });
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
      } else {
        Alert.alert('No disponible', 'La función de compartir no está disponible en este dispositivo. El PDF se guardó en: ' + uri);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo compartir el informe. Intenta nuevamente.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Centro de Análisis</Text>
      <Text style={styles.subtitle}>Vigilancia epidemiológica en tiempo real · Ucayali</Text>

      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiNumber}>{totalCases}</Text>
          <Text style={styles.kpiLabel}>Reportes totales</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={[styles.kpiNumber, { color: colors.danger }]}>{alertDistricts}</Text>
          <Text style={styles.kpiLabel}>Distritos en alerta</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiNumber}>{MOCK_DISTRICT_RISK.length}</Text>
          <Text style={styles.kpiLabel}>Distritos monitoreados</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Incidencia por distrito</Text>
      <View style={styles.card}>
        {MOCK_DISTRICT_RISK.map((district) => (
          <View key={district.district} style={styles.barRow}>
            <Text style={styles.barLabel}>{district.district}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${(district.cases / maxCases) * 100}%`,
                    backgroundColor: RISK_COLOR[district.risk],
                  },
                ]}
              />
            </View>
            <Text style={styles.barValue}>{district.cases}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Comparador de distritos</Text>
      <Text style={styles.sectionSubtitle}>
        Compara indicadores clave entre dos distritos para priorizar intervenciones
      </Text>

      <View style={styles.card}>
        {selectionMessage !== '' && (
          <View style={styles.selectionMessageContainer}>
            <Text style={styles.selectionMessageText}>{selectionMessage}</Text>
          </View>
        )}

        <View style={styles.selectorsRow}>
          <View style={styles.selectorContainer}>
            <Text style={styles.selectorLabel}>Distrito 1</Text>
            <ScrollView horizontal={false} style={styles.districtList}>
              {MOCK_DISTRICT_COMPARISON.map((d) => {
                const isDisabled = d.district === district2;
                const isSelected = district1 === d.district;
                return (
                  <Pressable
                    key={d.district}
                    style={[
                      styles.districtOption,
                      isSelected && styles.districtOptionSelected,
                      isDisabled && styles.districtOptionDisabled,
                    ]}
                    onPress={() => handleSelectDistrict1(d.district)}
                    disabled={isDisabled}
                    accessibilityLabel={`Seleccionar ${d.district} como distrito 1${isDisabled ? ', no disponible' : ''}`}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected, disabled: isDisabled }}
                    accessibilityHint={isDisabled ? 'Este distrito ya está seleccionado en el otro campo' : undefined}
                  >
                    <Text
                      style={[
                        styles.districtOptionText,
                        isSelected && styles.districtOptionTextSelected,
                        isDisabled && styles.districtOptionTextDisabled,
                      ]}
                    >
                      {d.district}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.selectorContainer}>
            <Text style={styles.selectorLabel}>Distrito 2</Text>
            <ScrollView horizontal={false} style={styles.districtList}>
              {MOCK_DISTRICT_COMPARISON.map((d) => {
                const isDisabled = d.district === district1;
                const isSelected = district2 === d.district;
                return (
                  <Pressable
                    key={d.district}
                    style={[
                      styles.districtOption,
                      isSelected && styles.districtOptionSelected,
                      isDisabled && styles.districtOptionDisabled,
                    ]}
                    onPress={() => handleSelectDistrict2(d.district)}
                    disabled={isDisabled}
                    accessibilityLabel={`Seleccionar ${d.district} como distrito 2${isDisabled ? ', no disponible' : ''}`}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: isSelected, disabled: isDisabled }}
                    accessibilityHint={isDisabled ? 'Este distrito ya está seleccionado en el otro campo' : undefined}
                  >
                    <Text
                      style={[
                        styles.districtOptionText,
                        isSelected && styles.districtOptionTextSelected,
                        isDisabled && styles.districtOptionTextDisabled,
                      ]}
                    >
                      {d.district}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>

        <Pressable
          style={[styles.compareButton, !isCompareEnabled && styles.compareButtonDisabled]}
          onPress={handleCompare}
          disabled={!isCompareEnabled}
          accessibilityLabel="Comparar distritos seleccionados"
          accessibilityHint="Selecciona dos distritos diferentes para habilitar esta función"
          accessibilityRole="button"
          accessibilityState={{ disabled: !isCompareEnabled }}
        >
          <Text style={[styles.compareButtonText, !isCompareEnabled && styles.compareButtonTextDisabled]}>
            Comparar distritos
          </Text>
        </Pressable>
      </View>

      {showComparison && comparison1 && comparison2 && (
        <>
          <View style={styles.comparisonContainer}>
            <View style={styles.comparisonHeader}>
              <Text style={styles.comparisonColumnName}>{comparison1.district}</Text>
              <Text style={styles.comparisonColumnName}>{comparison2.district}</Text>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonIndicator}>Reportes</Text>
              <View style={styles.comparisonValues}>
                <View style={styles.comparisonValueContainer}>
                  <Text style={[styles.comparisonValue, { color: RISK_COLOR[comparison1.risk] }]}>
                    {comparison1.reports}
                  </Text>
                  <View style={styles.miniBarTrack}>
                    <View
                      style={[
                        styles.miniBarFill,
                        {
                          width: `${(comparison1.reports / Math.max(comparison1.reports, comparison2.reports)) * 100}%`,
                          backgroundColor: RISK_COLOR[comparison1.risk],
                        },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.comparisonValueContainer}>
                  <Text style={[styles.comparisonValue, { color: RISK_COLOR[comparison2.risk] }]}>
                    {comparison2.reports}
                  </Text>
                  <View style={styles.miniBarTrack}>
                    <View
                      style={[
                        styles.miniBarFill,
                        {
                          width: `${(comparison2.reports / Math.max(comparison1.reports, comparison2.reports)) * 100}%`,
                          backgroundColor: RISK_COLOR[comparison2.risk],
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonIndicator}>Nivel de riesgo</Text>
              <View style={styles.comparisonValues}>
                <View style={styles.comparisonValueContainer}>
                  <RiskBadge level={comparison1.risk} />
                </View>
                <View style={styles.comparisonValueContainer}>
                  <RiskBadge level={comparison2.risk} />
                </View>
              </View>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonIndicator}>Tendencia</Text>
              <View style={styles.comparisonValues}>
                <View style={styles.comparisonValueContainer}>
                  <Text
                    style={[
                      styles.comparisonValue,
                      { color: comparison1.trend.startsWith('+') ? colors.danger : colors.success },
                    ]}
                  >
                    {comparison1.trend}
                  </Text>
                  <View style={styles.miniBarTrack}>
                    <View
                      style={[
                        styles.miniBarFill,
                        {
                          width: `${Math.abs(parseInt(comparison1.trend))}%`,
                          backgroundColor: comparison1.trend.startsWith('+') ? colors.danger : colors.success,
                        },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.comparisonValueContainer}>
                  <Text
                    style={[
                      styles.comparisonValue,
                      { color: comparison2.trend.startsWith('+') ? colors.danger : colors.success },
                    ]}
                  >
                    {comparison2.trend}
                  </Text>
                  <View style={styles.miniBarTrack}>
                    <View
                      style={[
                        styles.miniBarFill,
                        {
                          width: `${Math.abs(parseInt(comparison2.trend))}%`,
                          backgroundColor: comparison2.trend.startsWith('+') ? colors.danger : colors.success,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonIndicator}>Enfermedad predominante</Text>
              <View style={styles.comparisonValues}>
                <View style={styles.comparisonValueContainer}>
                  <Text style={styles.comparisonValue}>{comparison1.predominantDisease}</Text>
                </View>
                <View style={styles.comparisonValueContainer}>
                  <Text style={styles.comparisonValue}>{comparison2.predominantDisease}</Text>
                </View>
              </View>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonIndicator}>Estado actual</Text>
              <View style={styles.comparisonValues}>
                <View style={styles.comparisonValueContainer}>
                  <Text style={[styles.comparisonValue, { color: STATUS_COLOR[comparison1.status] || colors.textPrimary }]}>
                    {comparison1.status}
                  </Text>
                </View>
                <View style={styles.comparisonValueContainer}>
                  <Text style={[styles.comparisonValue, { color: STATUS_COLOR[comparison2.status] || colors.textPrimary }]}>
                    {comparison2.status}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.comparisonRow}>
              <Text style={styles.comparisonIndicator}>Última actualización</Text>
              <View style={styles.comparisonValues}>
                <View style={styles.comparisonValueContainer}>
                  <Text style={styles.comparisonValue}>{comparison1.lastUpdate}</Text>
                </View>
                <View style={styles.comparisonValueContainer}>
                  <Text style={styles.comparisonValue}>{comparison2.lastUpdate}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}>Recomendación de Guardian Salud IA</Text>
            <Text style={styles.recommendationText}>{generateRecommendation()}</Text>
          </View>

          <View style={styles.actionsRow}>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                detailPressed === comparison1.district && pressed && styles.secondaryButtonPressed,
              ]}
              onPress={() => handleOpenDetail(comparison1)}
              onPressIn={() => setDetailPressed(comparison1.district)}
              onPressOut={() => setDetailPressed(null)}
              accessibilityLabel={`Ver detalle de ${comparison1.district}`}
              accessibilityHint="Abre un panel con información detallada del distrito"
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>Ver detalle de {comparison1.district}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                detailPressed === comparison2.district && pressed && styles.secondaryButtonPressed,
              ]}
              onPress={() => handleOpenDetail(comparison2)}
              onPressIn={() => setDetailPressed(comparison2.district)}
              onPressOut={() => setDetailPressed(null)}
              accessibilityLabel={`Ver detalle de ${comparison2.district}`}
              accessibilityHint="Abre un panel con información detallada del distrito"
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>Ver detalle de {comparison2.district}</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.reportButton,
              pressed && styles.reportButtonPressed,
              isGeneratingReport && styles.reportButtonLoading,
            ]}
            onPress={handleOpenReport}
            disabled={isGeneratingReport}
            accessibilityLabel="Generar informe comparativo"
            accessibilityHint="Genera un informe completo de comparación entre los dos distritos"
            accessibilityRole="button"
            accessibilityState={{ disabled: isGeneratingReport }}
          >
            {isGeneratingReport ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.reportButtonText}>Generando informe...</Text>
              </View>
            ) : (
              <Text style={styles.reportButtonText}>Generar informe comparativo</Text>
            )}
          </Pressable>
        </>
      )}

      <View style={styles.predictiveCard}>
        <Text style={styles.predictiveTitle}>Analítica predictiva</Text>
        <Text style={styles.predictiveText}>
          Basado en patrones históricos, se estima un incremento de casos de dengue en Callería durante las
          próximas semanas.
        </Text>
      </View>

      {/* Modal de Detalle del Distrito */}
      <Modal
        visible={detailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalle del Distrito</Text>
              <Pressable
                style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
                onPress={() => setDetailModalVisible(false)}
                accessibilityLabel="Cerrar detalle del distrito"
                accessibilityRole="button"
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            {detailDistrict && (
              <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalBodyContent}>
                <View style={styles.detailDistrictHeader}>
                  <Text style={styles.detailDistrictName}>{detailDistrict.district}</Text>
                  <RiskBadge level={detailDistrict.risk} />
                </View>

                <View style={styles.detailGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Reportes totales</Text>
                    <Text style={[styles.detailValue, { color: RISK_COLOR[detailDistrict.risk] }]}>
                      {detailDistrict.reports}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Nivel de riesgo</Text>
                    <Text style={[styles.detailValue, { color: RISK_COLOR[detailDistrict.risk] }]}>
                      {detailDistrict.risk.charAt(0).toUpperCase() + detailDistrict.risk.slice(1)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Tendencia</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        { color: detailDistrict.trend.startsWith('+') ? colors.danger : colors.success },
                      ]}
                    >
                      {detailDistrict.trend}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Enfermedad predominante</Text>
                    <Text style={styles.detailValue}>{detailDistrict.predominantDisease}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Estado actual</Text>
                    <Text style={[styles.detailValue, { color: STATUS_COLOR[detailDistrict.status] || colors.textPrimary }]}>
                      {detailDistrict.status}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Última actualización</Text>
                    <Text style={styles.detailValue}>{detailDistrict.lastUpdate}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Síntomas más reportados</Text>
                  <View style={styles.symptomsList}>
                    {(SYMPTOMS_BY_DISTRICT[detailDistrict.district] || []).map((symptom, index) => (
                      <View key={index} style={styles.symptomChip}>
                        <Text style={styles.symptomText}>{symptom}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Recomendaciones preventivas</Text>
                  <View style={styles.recommendationsList}>
                    {(PREVENTIVE_RECOMMENDATIONS[detailDistrict.district] || []).map((rec, index) => (
                      <View key={index} style={styles.recommendationItem}>
                        <Text style={styles.recommendationBullet}>•</Text>
                        <Text style={styles.recommendationItemText}>{rec}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de Informe Comparativo */}
      <Modal
        visible={reportModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseReport}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Informe comparativo epidemiológico</Text>
              <Pressable
                style={({ pressed }) => [styles.closeButton, pressed && styles.closeButtonPressed]}
                onPress={handleCloseReport}
                accessibilityLabel="Cerrar informe"
                accessibilityRole="button"
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            {comparison1 && comparison2 && (
              <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalBodyContent}>
                <View style={styles.reportHeader}>
                  <Text style={styles.reportDate}>{getCurrentDateTime()}</Text>
                  <Text style={styles.reportSubtitle}>
                    {comparison1.district} vs {comparison2.district}
                  </Text>
                </View>

                <View style={styles.reportSection}>
                  <Text style={styles.reportSectionTitle}>Comparación de indicadores</Text>
                  <View style={styles.reportTable}>
                    <View style={styles.reportTableHeader}>
                      <Text style={styles.reportTableHeaderText}>Indicador</Text>
                      <Text style={styles.reportTableHeaderText}>{comparison1.district}</Text>
                      <Text style={styles.reportTableHeaderText}>{comparison2.district}</Text>
                    </View>
                    <View style={styles.reportTableRow}>
                      <Text style={styles.reportTableLabel}>Reportes</Text>
                      <Text style={[styles.reportTableValue, { color: RISK_COLOR[comparison1.risk] }]}>{comparison1.reports}</Text>
                      <Text style={[styles.reportTableValue, { color: RISK_COLOR[comparison2.risk] }]}>{comparison2.reports}</Text>
                    </View>
                    <View style={styles.reportTableRow}>
                      <Text style={styles.reportTableLabel}>Riesgo</Text>
                      <Text style={[styles.reportTableValue, { color: RISK_COLOR[comparison1.risk] }]}>{comparison1.risk.charAt(0).toUpperCase() + comparison1.risk.slice(1)}</Text>
                      <Text style={[styles.reportTableValue, { color: RISK_COLOR[comparison2.risk] }]}>{comparison2.risk.charAt(0).toUpperCase() + comparison2.risk.slice(1)}</Text>
                    </View>
                    <View style={styles.reportTableRow}>
                      <Text style={styles.reportTableLabel}>Tendencia</Text>
                      <Text style={[styles.reportTableValue, { color: comparison1.trend.startsWith('+') ? colors.danger : colors.success }]}>{comparison1.trend}</Text>
                      <Text style={[styles.reportTableValue, { color: comparison2.trend.startsWith('+') ? colors.danger : colors.success }]}>{comparison2.trend}</Text>
                    </View>
                    <View style={styles.reportTableRow}>
                      <Text style={styles.reportTableLabel}>Enfermedad</Text>
                      <Text style={styles.reportTableValue}>{comparison1.predominantDisease}</Text>
                      <Text style={styles.reportTableValue}>{comparison2.predominantDisease}</Text>
                    </View>
                    <View style={[styles.reportTableRow, { borderBottomWidth: 0 }]}>
                      <Text style={styles.reportTableLabel}>Estado</Text>
                      <Text style={[styles.reportTableValue, { color: STATUS_COLOR[comparison1.status] || colors.textPrimary }]}>{comparison1.status}</Text>
                      <Text style={[styles.reportTableValue, { color: STATUS_COLOR[comparison2.status] || colors.textPrimary }]}>{comparison2.status}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.reportSection}>
                  <Text style={styles.reportSectionTitle}>Distrito priorizado</Text>
                  <View style={styles.prioritizedCard}>
                    <Text style={styles.prioritizedName}>
                      {comparison1.reports > comparison2.reports ? comparison1.district : comparison2.district}
                    </Text>
                    <Text style={styles.prioritizedReason}>
                      Mayor cantidad de reportes ({comparison1.reports > comparison2.reports ? comparison1.reports : comparison2.reports}) y nivel de riesgo{' '}
                      {comparison1.reports > comparison2.reports ? comparison1.risk : comparison2.risk}
                    </Text>
                  </View>
                </View>

                <View style={styles.reportSection}>
                  <Text style={styles.reportSectionTitle}>Recomendación de Guardian Salud IA</Text>
                  <View style={styles.aiRecommendationCard}>
                    <Text style={styles.aiRecommendationText}>{generateReportConclusion()}</Text>
                  </View>
                </View>

                <View style={styles.reportActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.reportActionButton,
                      styles.reportActionButtonClose,
                      pressed && styles.reportActionButtonPressed,
                    ]}
                    onPress={handleCloseReport}
                    onPressIn={() => setIsPressedClose(true)}
                    onPressOut={() => setIsPressedClose(false)}
                    accessibilityLabel="Cerrar informe"
                    accessibilityRole="button"
                  >
                    <Text style={[styles.reportActionButtonText, styles.reportActionButtonCloseText]}>Cerrar</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.reportActionButton,
                      styles.reportActionButtonDownload,
                      (pressed || isDownloading) && styles.reportActionButtonPressed,
                      isDownloading && styles.reportActionButtonLoading,
                    ]}
                    onPress={handleDownloadReport}
                    disabled={isDownloading || isSharing}
                    accessibilityLabel="Descargar informe como PDF"
                    accessibilityHint="Genera y descarga el informe comparativo como archivo PDF"
                    accessibilityRole="button"
                    accessibilityState={{ disabled: isDownloading || isSharing }}
                  >
                    {isDownloading ? (
                      <View style={styles.actionLoadingRow}>
                        <ActivityIndicator color="#FFFFFF" size="small" />
                        <Text style={[styles.reportActionButtonText, styles.reportActionButtonDownloadText]}>Generando...</Text>
                      </View>
                    ) : (
                      <Text style={[styles.reportActionButtonText, styles.reportActionButtonDownloadText]}>Descargar informe</Text>
                    )}
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.reportActionButton,
                      styles.reportActionButtonShare,
                      (pressed || isSharing) && styles.reportActionButtonPressed,
                      isSharing && styles.reportActionButtonLoading,
                    ]}
                    onPress={handleShareReport}
                    disabled={isDownloading || isSharing}
                    accessibilityLabel="Compartir informe"
                    accessibilityHint="Genera el PDF y abre el menú de compartir del sistema"
                    accessibilityRole="button"
                    accessibilityState={{ disabled: isDownloading || isSharing }}
                  >
                    {isSharing ? (
                      <View style={styles.actionLoadingRow}>
                        <ActivityIndicator color="#FFFFFF" size="small" />
                        <Text style={[styles.reportActionButtonText, styles.reportActionButtonShareText]}>Generando...</Text>
                      </View>
                    ) : (
                      <Text style={[styles.reportActionButtonText, styles.reportActionButtonShareText]}>Compartir informe</Text>
                    )}
                  </Pressable>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 32, gap: 16 },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary },
  kpiRow: { flexDirection: 'row', gap: 10 },
  kpiCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  kpiNumber: { fontSize: 24, fontWeight: '800', color: colors.primary },
  kpiLabel: { fontSize: 11, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, marginTop: 8 },
  sectionSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: -10, marginBottom: 4 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 12 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { width: 100, fontSize: 12, color: colors.textPrimary, fontWeight: '600' },
  barTrack: { flex: 1, height: 10, borderRadius: 999, backgroundColor: colors.background, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 999 },
  barValue: { width: 28, fontSize: 12, color: colors.textSecondary, textAlign: 'right' },
  selectionMessageContainer: { backgroundColor: '#FEF3C7', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.warning },
  selectionMessageText: { fontSize: 13, fontWeight: '600', color: colors.warning, textAlign: 'center' },
  selectorsRow: { flexDirection: 'row', gap: 14 },
  selectorContainer: { flex: 1, gap: 6 },
  selectorLabel: { fontSize: 13, fontWeight: '700', color: colors.primaryDark, marginBottom: 4, letterSpacing: 0.3 },
  districtList: { maxHeight: 130, borderWidth: 1.5, borderColor: colors.border, borderRadius: 14, overflow: 'hidden', backgroundColor: colors.background },
  districtOption: { paddingVertical: 11, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  districtOptionSelected: { backgroundColor: colors.primary },
  districtOptionDisabled: { backgroundColor: '#F1F5F9', opacity: 0.5 },
  districtOptionText: { fontSize: 13, fontWeight: '500', color: colors.textPrimary },
  districtOptionTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  districtOptionTextDisabled: { color: '#94A3B8' },
  compareButton: { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 6, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  compareButtonDisabled: { backgroundColor: '#94A3B8', shadowOpacity: 0, elevation: 0 },
  compareButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },
  compareButtonTextDisabled: { color: '#CBD5E1' },
  comparisonContainer: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  comparisonHeader: { flexDirection: 'row', backgroundColor: colors.primaryDark, borderBottomWidth: 0 },
  comparisonColumnName: { flex: 1, fontSize: 15, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', paddingVertical: 14, letterSpacing: 0.3 },
  comparisonRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  comparisonIndicator: { width: 150, fontSize: 12, fontWeight: '700', color: colors.textSecondary, paddingVertical: 13, paddingLeft: 14, backgroundColor: '#F8FAFC' },
  comparisonValues: { flex: 1, flexDirection: 'row' },
  comparisonValueContainer: { flex: 1, paddingVertical: 11, paddingHorizontal: 10, alignItems: 'center' },
  comparisonValue: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  miniBarTrack: { width: '100%', height: 5, borderRadius: 999, backgroundColor: '#E9EDF3', overflow: 'hidden', marginTop: 5 },
  miniBarFill: { height: '100%', borderRadius: 999 },
  recommendationCard: { backgroundColor: '#F0F4FF', borderRadius: 16, padding: 18, gap: 8, borderWidth: 1, borderColor: '#D6E0FF', borderLeftWidth: 4, borderLeftColor: colors.secondary },
  recommendationTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, letterSpacing: 0.2 },
  recommendationText: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
  actionsRow: { flexDirection: 'row', gap: 12 },
  secondaryButton: { flex: 1, backgroundColor: colors.surface, borderRadius: 12, paddingVertical: 13, alignItems: 'center', borderWidth: 1.5, borderColor: colors.border },
  secondaryButtonPressed: { backgroundColor: '#F1F5F9', borderColor: colors.primary },
  secondaryButtonText: { fontSize: 13, fontWeight: '700', color: colors.primary, letterSpacing: 0.2 },
  reportButton: { backgroundColor: colors.secondary, borderRadius: 14, paddingVertical: 15, alignItems: 'center', shadowColor: colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  reportButtonPressed: { backgroundColor: '#1D4ED8', shadowOpacity: 0.35 },
  reportButtonLoading: { backgroundColor: '#60A5FA', shadowOpacity: 0.1 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reportButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', letterSpacing: 0.3 },
  predictiveCard: { backgroundColor: '#EEF2FF', borderRadius: 16, padding: 16, gap: 6 },
  predictiveTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  predictiveText: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, flex: 1 },
  closeButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  closeButtonPressed: { backgroundColor: colors.border },
  closeButtonText: { fontSize: 18, fontWeight: '700', color: colors.textSecondary },
  modalBody: { flex: 1 },
  modalBodyContent: { padding: 20, gap: 20 },
  detailDistrictHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailDistrictName: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  detailItem: { width: '47%', backgroundColor: colors.background, borderRadius: 12, padding: 14 },
  detailLabel: { fontSize: 11, fontWeight: '600', color: colors.textSecondary, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  detailValue: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  detailSection: { gap: 10 },
  detailSectionTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  symptomsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  symptomChip: { backgroundColor: '#FEF3C7', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: colors.warning },
  symptomText: { fontSize: 13, fontWeight: '600', color: colors.warning },
  recommendationsList: { gap: 10 },
  recommendationItem: { flexDirection: 'row', gap: 8 },
  recommendationBullet: { fontSize: 14, fontWeight: '700', color: colors.primary, marginTop: 2 },
  recommendationItemText: { fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 18 },
  reportHeader: { alignItems: 'center', gap: 6, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  reportDate: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  reportSubtitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  reportSection: { gap: 12 },
  reportSectionTitle: { fontSize: 16, fontWeight: '700', color: colors.primaryDark },
  reportTable: { backgroundColor: colors.background, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  reportTableHeader: { flexDirection: 'row', backgroundColor: colors.primaryDark, paddingVertical: 12, paddingHorizontal: 14 },
  reportTableHeaderText: { flex: 1, fontSize: 12, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  reportTableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 10, paddingHorizontal: 14 },
  reportTableLabel: { width: 100, fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  reportTableValue: { flex: 1, fontSize: 13, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' },
  prioritizedCard: { backgroundColor: '#FEF3C7', borderRadius: 14, padding: 16, borderWidth: 1.5, borderColor: colors.warning },
  prioritizedName: { fontSize: 18, fontWeight: '800', color: colors.warning, marginBottom: 4 },
  prioritizedReason: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  aiRecommendationCard: { backgroundColor: '#F0F4FF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#D6E0FF', borderLeftWidth: 4, borderLeftColor: colors.secondary },
  aiRecommendationText: { fontSize: 14, color: colors.textSecondary, lineHeight: 22, fontWeight: '500' },
  reportActions: { flexDirection: 'row', gap: 10, paddingTop: 8 },
  reportActionButton: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1.5 },
  reportActionButtonClose: { backgroundColor: colors.surface, borderColor: colors.border },
  reportActionButtonCloseText: { color: colors.textSecondary },
  reportActionButtonDownload: { backgroundColor: colors.primary, borderColor: colors.primary },
  reportActionButtonDownloadText: { color: '#FFFFFF' },
  reportActionButtonShare: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  reportActionButtonShareText: { color: '#FFFFFF' },
  reportActionButtonPressed: { opacity: 0.7 },
  reportActionButtonLoading: { opacity: 0.8 },
  reportActionButtonText: { fontSize: 13, fontWeight: '700', letterSpacing: 0.2 },
  actionLoadingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});