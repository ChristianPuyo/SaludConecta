import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MOCK_DISTRICT_RISK } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';
import { RiskBadge } from '../../components/RiskBadge';

export function InteractiveMapScreen() {
  const { colors: themeColors } = useTheme();
  return (
    <ScrollView style={styles.fallbackContainer} contentContainerStyle={styles.fallbackContent}>
      <Text style={[styles.fallbackTitle, { color: themeColors.textPrimary }]}>
        Mapa de Riesgo
      </Text>
      <Text style={[styles.fallbackSubtitle, { color: themeColors.textSecondary }]}>
        Distritos de Ucayali · Vista previa por distrito
      </Text>
      {MOCK_DISTRICT_RISK.map((district, index) => (
        <Animated.View
          key={district.district}
          entering={FadeInDown.duration(400).delay(index * 100).springify()}
          style={[styles.fallbackCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}
        >
          <View style={styles.fallbackCardHeader}>
            <Text style={[styles.fallbackCardTitle, { color: themeColors.textPrimary }]}>{district.district}</Text>
            <RiskBadge level={district.risk} />
          </View>
          <Text style={[styles.fallbackCardCases, { color: themeColors.textSecondary }]}>
            {district.cases} casos activos
          </Text>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fallbackContainer: { flex: 1 },
  fallbackContent: { padding: 20, gap: 12 },
  fallbackTitle: { fontSize: 22, fontWeight: '800' },
  fallbackSubtitle: { fontSize: 14, marginBottom: 8 },
  fallbackCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 6,
  },
  fallbackCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fallbackCardTitle: { fontSize: 16, fontWeight: '700' },
  fallbackCardCases: { fontSize: 13 },
});
