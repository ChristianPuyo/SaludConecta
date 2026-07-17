/**
 * AchievementsHubScreen - Centro de logros y reconocimientos que motiva la participación del usuario.
 * Muestra el progreso de desbloqueo de logros, racha de actividad y una cuadrícula con el estado de cada objetivo.
 * Utilizada para gamificación y engagement dentro de la plataforma.
 */
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { PageHeader, SectionGrid, MetricRow } from '../components/ReusableComponents';
import type { Achievement } from '../../models/achievement';

export function AchievementsHubScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [streakDays] = useState(7);

  useEffect(() => {
    const mock: Achievement[] = [
      { id: 'a1', label: 'Primer Reporte', description: 'Realiza tu primer reporte de síntomas', icon: 'document-text', unlocked: true, progress: 1, target: 1 },
      { id: 'a2', label: 'Vigilante', description: '10 reportes realizados', icon: 'eye', unlocked: false, progress: 6, target: 10 },
      { id: 'a3', label: 'Estrella Comunitaria', description: 'Ayuda a 5 miembros de la comunidad', icon: 'people', unlocked: true, progress: 5, target: 5 },
      { id: 'a4', label: 'Estudiante', description: 'Completa 3 cursos en Academia SC', icon: 'school', unlocked: false, progress: 1, target: 3 },
      { id: 'a5', label: 'Vacunado', description: 'Registra tu esquema de vacunación completo', icon: 'shield-checkmark', unlocked: false, progress: 3, target: 4 },
      { id: 'a6', label: 'Difusor', description: 'Comparte 5 artículos educativos', icon: 'share', unlocked: true, progress: 5, target: 5 },
      { id: 'a7', label: 'Racha de 7 días', description: 'Mantén actividad durante 7 días seguidos', icon: 'flame', unlocked: true, progress: 7, target: 7 },
      { id: 'a8', label: 'Líder Comunitario', description: 'Organiza un evento comunitario', icon: 'trophy', unlocked: false, progress: 0, target: 1 },
      { id: 'a9', label: 'Experto en Dengue', description: 'Completa el curso de prevención del dengue', icon: 'medal', unlocked: false, progress: 2, target: 5 },
      { id: 'a10', label: 'Corazón Solidario', description: 'Ayuda a reportar una emergencia', icon: 'heart', unlocked: true, progress: 1, target: 1 },
    ];
    setAchievements(mock);
  }, []);

  const unlocked = achievements.filter(a => a.unlocked).length;
  const total = achievements.length;
  const progress = total > 0 ? Math.round((unlocked / total) * 100) : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Reconocimientos'} subtitle={subtitle || `${unlocked}/${total} logros desbloqueados`} />

      <MetricRow
        metrics={[
          { label: 'Desbloqueados', value: unlocked, color: colors.success },
          { label: 'Progreso', value: `${progress}%`, color: colors.primary },
          { label: 'Racha', value: `${streakDays} días`, color: colors.warning },
        ]}
      />

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <SectionGrid title={`Salud (${achievements.filter(a => a.unlocked).length}/${achievements.length})`}>
        <View style={styles.achievementGrid}>
          {achievements.map(a => (
            <View key={a.id} style={styles.achievementItem}>
              <View style={[styles.achievementIcon, a.unlocked && styles.achievementIconUnlocked]}>
                <Ionicons name={(a.icon || 'trophy-outline') as any} size={20} color={a.unlocked ? '#fff' : colors.textSecondary} />
              </View>
              <Text style={[styles.achievementLabel, a.unlocked && styles.achievementLabelUnlocked]}>{a.label}</Text>
              {!a.unlocked && (
                <View style={styles.achievementProgress}>
                  <View style={[styles.achievementProgressFill, { width: `${Math.min(100, (a.progress / a.target) * 100)}%` }]} />
                </View>
              )}
            </View>
          ))}
        </View>
      </SectionGrid>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  progressBar: {
    height: 8, backgroundColor: colors.border, borderRadius: 4,
    overflow: 'hidden', marginBottom: 24,
  },
  progressFill: {
    height: '100%', backgroundColor: colors.primary, borderRadius: 4,
  },
  achievementGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
  },
  achievementItem: {
    backgroundColor: colors.surface, borderRadius: 14, padding: 12,
    borderWidth: 1, borderColor: colors.border, width: '47%', gap: 6, alignItems: 'center',
  },
  achievementIcon: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  achievementIconUnlocked: { backgroundColor: colors.success },
  achievementLabel: { fontSize: 12, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },
  achievementLabelUnlocked: { color: colors.success },
  achievementProgress: { height: 4, backgroundColor: colors.border, borderRadius: 2, width: '100%', overflow: 'hidden' },
  achievementProgressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
});
