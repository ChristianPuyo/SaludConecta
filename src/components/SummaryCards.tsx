import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { RiskBadge, type RiskLevel } from './RiskBadge';

interface SummaryCardsProps {
  lastReport?: {
    date: string;
    symptoms: string[];
    risk: RiskLevel;
  };
  onPressRisk?: () => void;
  onPressLastReport?: () => void;
}

export function SummaryCards({ lastReport, onPressRisk, onPressLastReport }: SummaryCardsProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 700;

  const handleRiskPress = () => {
    if (onPressRisk) {
      onPressRisk();
    } else {
      Alert.alert(
        'Riesgo del distrito',
        'Consulta información preventiva basada en los reportes recientes de tu distrito.'
      );
    }
  };

  return (
    <View style={[styles.container, isDesktop && styles.containerDesktop]}>
      {/* Risk card */}
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={handleRiskPress}
      >
        <View style={styles.cardTop}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </View>
        <Text style={styles.cardTitle}>Riesgo actual en tu distrito</Text>
        <RiskBadge level="medio" />
        <Text style={styles.cardHint}>Callería · Basado en reportes de los últimos 7 días</Text>
      </Pressable>

      {/* Last report card */}
      {lastReport ? (
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={onPressLastReport}
        >
          <View style={styles.cardTop}>
            <View style={[styles.iconCircle, { backgroundColor: '#E8F0FE' }]}>
              <Ionicons name="document-text-outline" size={20} color={colors.blue} />
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </View>
          <Text style={styles.cardTitle}>Tu último reporte ({lastReport.date})</Text>
          <Text style={styles.cardSymptoms}>{lastReport.symptoms.join(', ')}</Text>
          <RiskBadge level={lastReport.risk} />
        </Pressable>
      ) : (
        <View style={[styles.card, styles.cardEmpty]}>
          <View style={[styles.iconCircle, { backgroundColor: '#F0F4F8' }]}>
            <Ionicons name="document-text-outline" size={20} color={colors.textMuted} />
          </View>
          <Text style={styles.cardTitle}>Tu último reporte</Text>
          <Text style={styles.emptyText}>Aún no tienes reportes registrados.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  containerDesktop: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surfaceWhite,
    borderRadius: 16,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: '#D7E6E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardPressed: {
    shadowOpacity: 0.08,
    elevation: 3,
    transform: [{ scale: 0.99 }],
  },
  cardEmpty: {
    opacity: 0.7,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5F3EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardSymptoms: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardHint: {
    fontSize: 12,
    color: colors.textMuted,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
