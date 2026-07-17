import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';

type ScanMode = 'vector' | 'test';

interface ScanResult {
  detected: boolean;
  title: string;
  description: string;
  recommendation: string;
  confidence: string;
  risk: 'alto' | 'medio' | 'bajo';
}

function getRiskColor(risk: ScanResult['risk']): string {
  if (risk === 'alto') return colors.danger;
  if (risk === 'medio') return colors.warning;
  return colors.success;
}

function getRiskIcon(risk: ScanResult['risk']): string {
  if (risk === 'alto') return 'alert-circle';
  if (risk === 'medio') return 'warning';
  return 'checkmark-circle';
}

export function IaScannerScreen() {
  const [mode, setMode] = useState<ScanMode>('vector');
  const [scanning, setScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [resultIndex, setResultIndex] = useState(0);
  const { t } = useLanguage();

  // Varied AI results pool — rotates to avoid always showing the same result
  // Moved inside the component to access translations
  const VECTOR_RESULTS: ScanResult[] = [
    {
      detected: true,
      title: 'CRIADERO DETECTADO — Alto Riesgo',
      confidence: '94.8%',
      risk: 'alto',
      description:
        'Se identificaron focos larvarios compatibles con el vector Aedes aegypti (transmisor de Dengue/Zika/Chikungunya) en el agua estancada del recipiente analizado.',
      recommendation:
        'Vierte el agua acumulada sobre tierra seca (nunca en desagüe). Lava las paredes del recipiente con cepillo y detergente para eliminar los huevecillos adheridos. Repite el proceso cada 3 días.',
    },
    {
      detected: true,
      title: 'POSIBLE CRIADERO — Riesgo Medio',
      confidence: '71.3%',
      risk: 'medio',
      description:
        'Se detectó acumulación de agua en la imagen con condiciones favorables para la oviposición. No se identificaron larvas visibles, pero el contexto ambiental es de riesgo.',
      recommendation:
        'Elimina el agua acumulada y deja el recipiente boca abajo. Realiza una inspección visual detallada en 48 horas. Reporta el hallazgo al Agente Comunitario de Salud de tu zona.',
    },
    {
      detected: false,
      title: 'SIN CRIADERO DETECTADO — Riesgo Bajo',
      confidence: '88.1%',
      risk: 'bajo',
      description:
        'La imagen analizada no presenta evidencia de acumulación de agua estancada ni condiciones propias para el desarrollo de vectores biológicos.',
      recommendation:
        'El área parece estar en buen estado. Continúa con las revisiones preventivas semanales y mantén los recipientes tapados o volcados.',
    },
  ];

  const TEST_RESULTS: ScanResult[] = [
    {
      detected: true,
      title: 'PRUEBA POSITIVA PARA DENGUE NS1',
      confidence: '98.2%',
      risk: 'alto',
      description:
        'La visión computacional identificó una banda biológica en la zona del antígeno NS1 de la tira reactiva, indicando infección activa por el virus del Dengue.',
      recommendation:
        'Acude de inmediato al puesto de salud más cercano. Reposo absoluto, hidratación constante con sales de rehidratación oral. NO uses aspirina ni ibuprofeno — aumentan el riesgo de hemorragia. Solo paracetamol si hay fiebre.',
    },
    {
      detected: false,
      title: 'PRUEBA NEGATIVA — Sin Dengue NS1',
      confidence: '91.4%',
      risk: 'bajo',
      description:
        'No se detectó la banda reactiva del antígeno NS1 en la tira analizada. El resultado es negativo para infección activa por Dengue.',
      recommendation:
        'Resultado negativo, pero si los síntomas persisten por más de 48 horas (fiebre, dolor muscular), acude al centro de salud para una evaluación clínica completa. El Dengue puede no detectarse en los primeros días.',
    },
    {
      detected: true,
      title: 'RESULTADO INDETERMINADO',
      confidence: '55.6%',
      risk: 'medio',
      description:
        'La calidad de imagen no permite confirmar o descartar el resultado con alta certeza. La tira podría estar mojada, mal encuadrada o dañada.',
      recommendation:
        'Repite el escaneo con mejor iluminación, sosteniendo la tira sobre una superficie plana y blanca. Si los síntomas son fiebre alta + dolor articular, acude al puesto de salud sin esperar.',
    },
  ];

  const requestPermissionAndOpenCamera = useCallback(async () => {
    // [i18n & FIX] Request camera permission natively using expo-image-picker.
    // Anteriormente faltaba la solicitud real al sistema y los textos estaban hardcodeados.
    // Ahora usa las claves de traducción globales dinámicas (t.perm_camera_title, etc.)
    // y maneja correctamente si el usuario deniega el permiso con alertas en su idioma seleccionado.
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        t.perm_camera_title,
        t.perm_camera_body,
        [
          { text: t.cancel, style: 'cancel' },
          {
            text: t.perm_camera_retry,
            onPress: async () => {
              const retry = await ImagePicker.requestCameraPermissionsAsync();
              if (retry.status === 'granted') {
                launchCamera();
              } else {
                Alert.alert(
                  t.perm_camera_denied_title,
                  t.perm_camera_denied_body
                );
              }
            },
          },
        ]
      );
      return;
    }

    launchCamera();
  }, [mode, resultIndex, t]);

  const launchCamera = async () => {
    const pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.75,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (pickerResult.canceled) return;

    const uri = pickerResult.assets[0].uri;
    setCapturedImage(uri);
    setResult(null);
    setScanning(true);

    // Simulated AI inference delay (in real app: send image to ML model)
    setTimeout(() => {
      setScanning(false);
      const pool = mode === 'vector' ? VECTOR_RESULTS : TEST_RESULTS;
      const nextIndex = resultIndex % pool.length;
      setResult(pool[nextIndex]);
      setResultIndex((prev) => prev + 1);
    }, 2800);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setResult(null);
    setScanning(false);
  };

  const handleModeChange = (newMode: ScanMode) => {
    setMode(newMode);
    handleReset();
  };

  const riskColor = result ? getRiskColor(result.risk) : colors.primary;
  const riskIcon = result ? getRiskIcon(result.risk) : 'scan-outline';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t.scanner_title}</Text>
      <Text style={styles.subtitle}>{t.scanner_subtitle}</Text>

      {/* Mode Switcher */}
      <View style={styles.modeContainer}>
        <Pressable
          style={[styles.modeButton, mode === 'vector' && styles.modeButtonActive]}
          onPress={() => handleModeChange('vector')}
        >
          <Ionicons name="bug-outline" size={18} color={mode === 'vector' ? '#fff' : colors.textSecondary} />
          <Text style={[styles.modeText, mode === 'vector' && styles.modeTextActive]}>
            {t.scanner_mode_vector}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.modeButton, mode === 'test' && styles.modeButtonActive]}
          onPress={() => handleModeChange('test')}
        >
          <Ionicons name="flask-outline" size={18} color={mode === 'test' ? '#fff' : colors.textSecondary} />
          <Text style={[styles.modeText, mode === 'test' && styles.modeTextActive]}>
            {t.scanner_mode_test}
          </Text>
        </Pressable>
      </View>

      {/* Camera Viewport */}
      <View style={styles.viewportContainer}>
        {/* Corner markers */}
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />

        {scanning ? (
          <View style={styles.overlay}>
            <View style={styles.laserLine} />
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.overlayText}>{t.scanner_analyzing}</Text>
            <Text style={styles.overlaySubText}>{t.scanner_processing}</Text>
          </View>
        ) : capturedImage && result ? (
          <>
            <Image source={{ uri: capturedImage }} style={styles.capturedImage} resizeMode="cover" />
            <View style={styles.resultOverlayBadge}>
              <Ionicons name={riskIcon as any} size={16} color="#fff" />
              <Text style={styles.resultOverlayText}>{t.scanner_confidence_label(result.confidence)}</Text>
            </View>
          </>
        ) : capturedImage && !result ? (
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} resizeMode="cover" />
        ) : (
          <View style={styles.overlay}>
            <Ionicons
              name={mode === 'vector' ? 'water-outline' : 'barcode-outline'}
              size={52}
              color="#475569"
            />
            <Text style={styles.overlayText}>
              {mode === 'vector'
                ? t.scanner_viewport_vector_hint
                : t.scanner_viewport_test_hint}
            </Text>
            <Text style={styles.overlaySubText}>
              {t.scanner_offline_note}
            </Text>
          </View>
        )}
      </View>

      {/* Scan / Re-scan Button */}
      {!scanning && (
        <Pressable style={styles.scanButton} onPress={requestPermissionAndOpenCamera}>
          <Ionicons
            name={capturedImage ? 'camera-reverse-outline' : 'camera-outline'}
            size={20}
            color="#fff"
          />
          <Text style={styles.scanButtonText}>
            {result ? t.scanner_btn_retake : capturedImage ? t.scanner_btn_rescan : t.scanner_btn_open}
          </Text>
        </Pressable>
      )}

      {capturedImage && !scanning && (
        <Pressable style={styles.resetButton} onPress={handleReset}>
          <Ionicons name="trash-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.resetButtonText}>{t.scanner_btn_clear}</Text>
        </Pressable>
      )}

      {/* Result Card */}
      {result && (
        <View style={[styles.resultCard, { borderLeftColor: riskColor }]}>
          {/* Header */}
          <View style={styles.resultHeader}>
            <View style={[styles.resultIconWrap, { backgroundColor: `${riskColor}18` }]}>
              <Ionicons name={riskIcon as any} size={26} color={riskColor} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.resultTitle, { color: riskColor }]}>{result.title}</Text>
              <View style={styles.confidenceRow}>
                <View style={[styles.confidenceDot, { backgroundColor: riskColor }]} />
                <Text style={styles.resultConfidence}>{t.scanner_confidence_label(result.confidence)}</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.resultDescription}>{result.description}</Text>

          {/* Recommendation */}
          <View style={[styles.adviceContainer, { borderLeftColor: colors.primary }]}>
            <View style={styles.adviceHeader}>
              <Ionicons name="medical-outline" size={14} color={colors.primary} />
              <Text style={styles.adviceLabel}>{t.scanner_recommendation_label}</Text>
            </View>
            <Text style={styles.adviceText}>{result.recommendation}</Text>
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimerRow}>
            <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.disclaimerText}>
              {t.scanner_disclaimer}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 14 },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },

  // Mode Switcher
  modeContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    padding: 4,
    borderRadius: 14,
    gap: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modeButtonActive: { backgroundColor: colors.primary },
  modeText: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  modeTextActive: { color: '#fff' },

  // Camera Viewport
  viewportContainer: {
    height: 230,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    position: 'relative',
  },
  corner: { position: 'absolute', width: 22, height: 22, borderColor: '#10B981', borderWidth: 0 },
  topLeft: { top: 14, left: 14, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 7, zIndex: 10 },
  topRight: { top: 14, right: 14, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 7, zIndex: 10 },
  bottomLeft: { bottom: 14, left: 14, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 7, zIndex: 10 },
  bottomRight: { bottom: 14, right: 14, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 7, zIndex: 10 },

  capturedImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  resultOverlayBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    zIndex: 10,
  },
  resultOverlayText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  laserLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#10B981',
    top: '48%',
    opacity: 0.8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  overlay: { alignItems: 'center', gap: 10, paddingHorizontal: 30 },
  overlayText: { color: '#94A3B8', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  overlaySubText: { color: '#475569', fontSize: 11, textAlign: 'center' },

  // Buttons
  scanButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  scanButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  resetButtonText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },

  // Result card
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  resultHeader: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  resultIconWrap: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  resultTitle: { fontSize: 14, fontWeight: '800', flex: 1, lineHeight: 19 },
  confidenceRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  confidenceDot: { width: 7, height: 7, borderRadius: 4 },
  resultConfidence: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  resultDescription: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
  adviceContainer: {
    backgroundColor: '#F0FDF9',
    borderRadius: 12,
    padding: 13,
    gap: 6,
    borderLeftWidth: 3,
  },
  adviceHeader: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  adviceLabel: { fontSize: 12, fontWeight: '800', color: colors.primary },
  adviceText: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  disclaimerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
  },
  disclaimerText: { fontSize: 11, color: colors.textSecondary, lineHeight: 15, flex: 1 },
});
