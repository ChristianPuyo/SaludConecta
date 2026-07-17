import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MOCK_ALERTS, type EpidemicAlert } from '../../data/mockData';
import { RiskBadge } from '../../components/RiskBadge';
import { colors, borderRadius, spacing, typography } from '../../theme/colors';

export function AlertsScreen() {
  const renderItem = ({ item, index }: { item: EpidemicAlert; index: number }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(25)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay: index * 100, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, friction: 8, delay: index * 100, useNativeDriver: true }),
      ]).start();
    }, []);

    return (
      <Animated.View style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <View style={styles.alertIconWrap}>
                <Ionicons name="warning" size={16} color={colors.danger} />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
            <RiskBadge level={item.risk} />
          </View>
          <View style={styles.cardDistrictRow}>
            <Ionicons name="location" size={12} color={colors.textMuted} />
            <Text style={styles.cardDistrict}>{item.district} · {item.date}</Text>
          </View>
          <Text style={styles.cardDetail}>{item.detail}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={MOCK_ALERTS}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Alertas generadas por IA</Text>
          <Text style={styles.subtitle}>
            Patrones detectados automáticamente a partir de los reportes ciudadanos
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.xl, paddingBottom: 40 },
  header: { marginBottom: spacing.xl, gap: spacing.xs },
  title: { fontSize: typography.xxxl, fontWeight: '900', color: colors.textPrimary },
  subtitle: { fontSize: typography.md, color: colors.textSecondary },
  card: {
    backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md, gap: spacing.sm,
    ...colors.shadowMd,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  alertIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.dangerMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: typography.base, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  cardDistrictRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  cardDistrict: { fontSize: typography.sm, color: colors.textSecondary, fontWeight: '600' },
  cardDetail: { fontSize: typography.sm, color: colors.textSecondary, lineHeight: 20 },
});
