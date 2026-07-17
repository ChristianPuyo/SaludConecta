import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';

export function MapLegend() {
  const { t } = useLanguage();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t.legend_title}</Text>
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: colors.danger }]} />
        <Text style={styles.label}>{t.legend_high}</Text>
      </View>
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: colors.warning }]} />
        <Text style={styles.label}>{t.legend_medium}</Text>
      </View>
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: colors.success }]} />
        <Text style={styles.label}>{t.legend_low}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 12,
    padding: 10,
    gap: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  title: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
