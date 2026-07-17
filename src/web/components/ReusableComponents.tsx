/**
 * ReusableComponents - Biblioteca de componentes UI reutilizables para SaludConecta.
 * Incluye DataCard, StatusBadge, SectionGrid, ActionBar, EmptyState, PageHeader,
 * MetricRow, ResourceCard, FilterBar y Timeline. Cada componente está diseñado
 * para presentar datos de salud, métricas, recursos educativos y líneas de tiempo
 * de forma consistente en toda la plataforma.
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export function DataCard({ title, value, subtitle, icon, color, onPress }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  onPress?: () => void;
}) {
  const card = (
    <View style={[styles.dataCard, onPress && styles.dataCardPressable]}>
      <View style={styles.dataCardTop}>
        <Text style={[styles.dataCardValue, { color: color || colors.textPrimary }]}>{value}</Text>
        {icon && (
          <View style={[styles.dataCardIcon, { backgroundColor: (color || colors.primary) + '15' }]}>
            <Ionicons name={icon} size={20} color={color || colors.primary} />
          </View>
        )}
      </View>
      <Text style={styles.dataCardTitle}>{title}</Text>
      {subtitle && <Text style={styles.dataCardSubtitle}>{subtitle}</Text>}
    </View>
  );

  if (onPress) return <Pressable onPress={onPress}>{card}</Pressable>;
  return card;
}

export function StatusBadge({ label, status }: {
  label: string;
  status: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}) {
  const statusColors = {
    success: { bg: '#DCFCE7', text: '#166534' },
    warning: { bg: '#FEF3C7', text: '#92400E' },
    danger: { bg: '#FEE2E2', text: '#991B1B' },
    info: { bg: '#DBEAFE', text: '#1E40AF' },
    neutral: { bg: '#F1F5F9', text: '#475569' },
  };
  const c = statusColors[status];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.text }]}>{label}</Text>
    </View>
  );
}

export function SectionGrid({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <View style={styles.sectionGrid}>
      {title && <Text style={styles.sectionGridTitle}>{title}</Text>}
      <View style={styles.sectionGridContent}>{children}</View>
    </View>
  );
}

export function ActionBar({ actions }: {
  actions: { label: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void; primary?: boolean }[];
}) {
  return (
    <View style={styles.actionBar}>
      {actions.map((action, i) => (
        <Pressable
          key={i}
          style={[styles.actionBtn, action.primary && styles.actionBtnPrimary]}
          onPress={action.onPress}
        >
          <Ionicons name={action.icon} size={18} color={action.primary ? '#fff' : colors.primary} />
          <Text style={[styles.actionLabel, action.primary && styles.actionLabelPrimary]}>{action.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function EmptyState({ icon, title, subtitle }: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={48} color={colors.border} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </View>
  );
}

export function PageHeader({ title, subtitle, children }: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.pageHeader}>
      <View style={styles.pageHeaderText}>
        <Text style={styles.pageTitle}>{title}</Text>
        {subtitle && <Text style={styles.pageSubtitle}>{subtitle}</Text>}
      </View>
      {children && <View style={styles.pageHeaderActions}>{children}</View>}
    </View>
  );
}

export function MetricRow({ metrics }: {
  metrics: { label: string; value: string | number; trend?: 'up' | 'down' | 'stable'; color?: string }[];
}) {
  return (
    <View style={styles.metricRow}>
      {metrics.map((m, i) => (
        <View key={i} style={styles.metricItem}>
          <View style={styles.metricValueRow}>
            <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
            {m.trend && (
              <Ionicons
                name={m.trend === 'up' ? 'trending-up' : m.trend === 'down' ? 'trending-down' : 'remove'}
                size={16}
                color={m.trend === 'up' ? colors.success : m.trend === 'down' ? colors.danger : colors.textSecondary}
              />
            )}
          </View>
          <Text style={styles.metricLabel}>{m.label}</Text>
        </View>
      ))}
    </View>
  );
}

export function ResourceCard({ title, description, icon, onPress }: {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.resourceCard} onPress={onPress}>
      <View style={styles.resourceIcon}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <Text style={styles.resourceTitle}>{title}</Text>
      <Text style={styles.resourceDesc}>{description}</Text>
    </Pressable>
  );
}

export function FilterBar({ filters, active, onFilter }: {
  filters: { id: string; label: string }[];
  active: string;
  onFilter: (id: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
      {filters.map(f => (
        <Pressable
          key={f.id}
          style={[styles.filterChip, active === f.id && styles.filterChipActive]}
          onPress={() => onFilter(f.id)}
        >
          <Text style={[styles.filterText, active === f.id && styles.filterTextActive]}>{f.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export function Timeline({ items }: {
  items: { date: string; title: string; description: string; icon?: keyof typeof Ionicons.glyphMap }[];
}) {
  return (
    <View style={styles.timeline}>
      {items.map((item, i) => (
        <View key={i} style={styles.timelineItem}>
          <View style={styles.timelineDot}>
            <Ionicons name={item.icon || 'ellipse'} size={10} color={colors.primary} />
          </View>
          <View style={styles.timelineContent}>
            <Text style={styles.timelineDate}>{item.date}</Text>
            <Text style={styles.timelineTitle}>{item.title}</Text>
            <Text style={styles.timelineDesc}>{item.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dataCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 180,
  },
  dataCardPressable: {},
  dataCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dataCardValue: {
    fontSize: 32,
    fontWeight: '800',
  },
  dataCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataCardTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 4,
  },
  dataCardSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionGrid: {
    marginBottom: 24,
  },
  sectionGridTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  sectionGridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionBar: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  actionBtnPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  actionLabelPrimary: {
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  pageHeaderText: {},
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  pageHeaderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  metricItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 150,
    flex: 1,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  resourceCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    width: 200,
    gap: 8,
  },
  resourceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  resourceDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  filterBar: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: '#fff',
  },
  timeline: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    paddingLeft: 0,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
    borderLeftWidth: 0,
  },
  timelineDate: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
  },
  timelineDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
