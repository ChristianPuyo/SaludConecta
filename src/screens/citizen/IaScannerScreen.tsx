import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

type ScanMode = 'vector' | 'test';

export function IaScannerScreen() {
  const [mode, setMode] = useState<ScanMode>('vector');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{
    detected: boolean;
    title: string;
    description: string;
    recommendation: string;
    confidence: string;
  } | null>(null);

  const startScan = () => {
    setScanning(true);
    setResult(null);

    // Simulate AI computing over local pixels
    setTimeout(() => {
      setScanning(false);
      if (mode === 'vector') {
        setResult({
          detected: true,
          title: 'CRIADERO DETECTADO (Alto Riesgo)',
          confidence: '94.8% de certeza',
          description: 'Se identificaron focos larvarios compatibles con el vector Aedes aegypti (transmisor de Dengue/Zika/Chikungunya) en el agua estancada.',
          recommendation: 'Vierte el agua acumulada sobre tierra seca (no en desagües). Lava las paredes del recipiente con cepillo y detergente para eliminar huevecillos adheridos.',
        });
      } else {
        setResult({
          detected: true,
          title: 'PRUEBA POSITIVA PARA DENGUE NS1',
          confidence: '98.2% de certeza',
          description: 'La visión computacional identificó la presencia de una banda biológica en la zona del antígeno NS1 de la tira reactiva.',
          recommendation: 'Indica una infección activa. Se sugiere reposo absoluto, hidratación constante con sales de rehidratación oral (suero) y acudir al puesto de salud. Evita la automedicación (no usar aspirina ni ibuprofeno).',
        });
      }
    }, 2500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Escáner de Visión IA</Text>
      <Text style={styles.subtitle}>
        Usa la cámara del dispositivo para identificar focos larvarios o interpretar pruebas rápidas de laboratorio localmente.
      </Text>

      {/* Mode Switcher */}
      <View style={styles.modeContainer}>
        <Pressable
          style={[styles.modeButton, mode === 'vector' && styles.modeButtonActive]}
          onPress={() => { setMode('vector'); setResult(null); }}
        >
          <Ionicons name="bug-outline" size={20} color={mode === 'vector' ? '#fff' : colors.textSecondary} />
          <Text style={[styles.modeText, mode === 'vector' && styles.modeTextActive]}>Criadero</Text>
        </Pressable>

        <Pressable
          style={[styles.modeButton, mode === 'test' && styles.modeButtonActive]}
          onPress={() => { setMode('test'); setResult(null); }}
        >
          <Ionicons name="flask-outline" size={20} color={mode === 'test' ? '#fff' : colors.textSecondary} />
          <Text style={[styles.modeText, mode === 'test' && styles.modeTextActive]}>Prueba Rápida</Text>
        </Pressable>
      </View>

      {/* Camera Viewport Simulator */}
      <View style={styles.viewportContainer}>
        {/* Neon Corners */}
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />

        {scanning ? (
          <View style={styles.scanOverlay}>
            <View style={styles.glowingLaser} />
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.scanText}>IA escaneando píxeles locales...</Text>
          </View>
        ) : result ? (
          <View style={styles.scanOverlay}>
            <Ionicons name="checkmark-circle" size={48} color="#10B981" />
            <Text style={[styles.scanText, { color: '#10B981', fontWeight: '700' }]}>Escaneo Completado</Text>
          </View>
        ) : (
          <View style={styles.idleOverlay}>
            <Ionicons
              name={mode === 'vector' ? 'water-outline' : 'barcode-outline'}
              size={64}
              color="#475569"
            />
            <Text style={styles.idleText}>
              {mode === 'vector'
                ? 'Apunta a recipientes de agua estancada'
                : 'Encuadra la tira de prueba rápida'}
            </Text>
          </View>
        )}
      </View>

      {/* Action Button */}
      {!scanning && (
        <Pressable style={styles.scanButton} onPress={startScan}>
          <Ionicons name="camera-outline" size={20} color="#fff" />
          <Text style={styles.scanButtonText}>
            {result ? 'Volver a Escanear' : 'Iniciar Escaneo IA'}
          </Text>
        </Pressable>
      )}

      {/* Result Card */}
      {result && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Ionicons name="shield-checkmark" size={24} color={colors.danger} />
            <View>
              <Text style={styles.resultTitle}>{result.title}</Text>
              <Text style={styles.resultConfidence}>{result.confidence}</Text>
            </View>
          </View>

          <Text style={styles.resultDescription}>{result.description}</Text>

          <View style={styles.adviceContainer}>
            <Text style={styles.adviceLabel}>📋 Recomendación Médica:</Text>
            <Text style={styles.adviceText}>{result.recommendation}</Text>
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
  modeContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', padding: 4, borderRadius: 14, gap: 4 },
  modeButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
  modeButtonActive: { backgroundColor: colors.primary },
  modeText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  modeTextActive: { color: '#fff' },

  // Camera Viewport
  viewportContainer: {
    height: 220,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#334155',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  corner: { position: 'absolute', width: 24, height: 24, borderColor: '#10B981', borderWidth: 0 },
  topLeft: { top: 16, left: 16, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  topRight: { top: 16, right: 16, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  bottomLeft: { bottom: 16, left: 16, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
  bottomRight: { bottom: 16, right: 16, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  
  scanOverlay: { alignItems: 'center', gap: 12 },
  scanText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  glowingLaser: {
    position: 'absolute',
    width: '200%',
    height: 2,
    backgroundColor: '#10B981',
    top: '50%',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  
  idleOverlay: { alignItems: 'center', gap: 8, paddingHorizontal: 40 },
  idleText: { color: '#64748B', fontSize: 13, fontWeight: '600', textAlign: 'center', lineHeight: 18 },

  // Action Button
  scanButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scanButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // Result card
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  resultHeader: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  resultTitle: { fontSize: 15, fontWeight: '800', color: colors.danger },
  resultConfidence: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  resultDescription: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  
  adviceContainer: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, gap: 4, borderLeftWidth: 3, borderLeftColor: colors.primary },
  adviceLabel: { fontSize: 12, fontWeight: '700', color: colors.primary },
  adviceText: { fontSize: 12, color: colors.textSecondary, lineHeight: 16 },
});
