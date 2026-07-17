/**
 * HealthAcademyScreen - Academia de salud con cursos, talleres y material formativo para profesionales y comunidad.
 * Permite inscribirse en capacitaciones, ver progreso y acceder a certificaciones.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { CourseService } from '../../services/courseService';
import type { Course, Enrollment } from '../../models/course';
import { PageHeader, FilterBar, StatusBadge, EmptyState } from '../components/ReusableComponents';

const LEVELS = [
  { id: 'all', label: 'Todos' },
  { id: 'basic', label: 'Básico' },
  { id: 'intermediate', label: 'Intermedio' },
  { id: 'advanced', label: 'Avanzado' },
];

const MOCK_COURSES: Course[] = [
  { id: '1', title: 'Prevención de Enfermedades Tropicales', description: 'Aprende a prevenir enfermedades comunes en la región.', summary: '', category: 'disease_prevention', level: 'basic', status: 'published', duration: 120, lessons: [], enrolledCount: 45, completedCount: 12, rating: 4.5, tags: [], createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '2', title: 'Primeros Auxilios Comunitarios', description: 'Técnicas básicas de primeros auxilios para tu comunidad.', summary: '', category: 'first_aid', level: 'basic', status: 'published', duration: 90, lessons: [], enrolledCount: 78, completedCount: 34, rating: 4.8, tags: [], createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '3', title: 'Nutrición y Dieta Balanceada', description: 'Claves para una alimentación saludable.', summary: '', category: 'nutrition', level: 'intermediate', status: 'published', duration: 150, lessons: [], enrolledCount: 23, completedCount: 8, rating: 4.2, tags: [], createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '4', title: 'Epidemiología Aplicada', description: 'Conceptos avanzados de epidemiología para profesionales.', summary: '', category: 'epidemiology', level: 'advanced', status: 'published', duration: 240, lessons: [], enrolledCount: 15, completedCount: 3, rating: 4.6, tags: [], createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '5', title: 'Salud Mental Comunitaria', description: 'Identifica y apoya problemas de salud mental.', summary: '', category: 'mental_health', level: 'intermediate', status: 'published', duration: 180, lessons: [], enrolledCount: 56, completedCount: 21, rating: 4.7, tags: [], createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { id: '6', title: 'Cuidados Materno-Infantiles', description: 'Atención y cuidados para madres y niños.', summary: '', category: 'maternal_health', level: 'basic', status: 'published', duration: 110, lessons: [], enrolledCount: 34, completedCount: 10, rating: 4.4, tags: [], createdAt: '2026-01-01', updatedAt: '2026-01-01' },
];

const LEVEL_LABELS: Record<string, string> = { basic: 'Básico', intermediate: 'Intermedio', advanced: 'Avanzado' };
const LEVEL_STATUS: Record<string, 'success' | 'warning' | 'info'> = { basic: 'success', intermediate: 'warning', advanced: 'info' };

export function HealthAcademyScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [activeLevel, setActiveLevel] = useState('all');

  useEffect(() => {
    CourseService.getPublished().then((data) => {
      setCourses(data.length > 0 ? data : MOCK_COURSES);
    }).catch(() => setCourses(MOCK_COURSES));
    CourseService.getEnrollments('current-user').then(setEnrollments).catch(() => {});
  }, []);

  const filtered = courses.filter((c) => activeLevel === 'all' || c.level === activeLevel);

  const handleEnroll = async (courseId: string) => {
    try {
      const enrollment = await CourseService.enroll('current-user', courseId);
      setEnrollments((prev) => [...prev, enrollment]);
    } catch {}
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Academia de Salud'} subtitle={subtitle || 'Cursos y capacitaciones'} />
      <FilterBar filters={LEVELS} active={activeLevel} onFilter={setActiveLevel} />
      {filtered.length === 0 ? (
        <EmptyState icon="school-outline" title="Sin cursos" subtitle="No hay cursos disponibles para este nivel." />
      ) : (
        <View style={styles.grid}>
          {filtered.map((course) => {
            const enrollment = enrollments.find((e) => e.courseId === course.id);
            const isEnrolled = !!enrollment;
            return (
              <View key={course.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <StatusBadge label={LEVEL_LABELS[course.level] || course.level} status={LEVEL_STATUS[course.level] || 'info'} />
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color={colors.warning} />
                    <Text style={styles.ratingText}>{course.rating.toFixed(1)}</Text>
                  </View>
                </View>
                <Text style={styles.cardTitle}>{course.title}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>{course.description}</Text>
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.metaText}>{course.duration} min</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.metaText}>{course.enrolledCount} inscritos</Text>
                  </View>
                </View>
                {isEnrolled && enrollment ? (
                  <View style={styles.progressSection}>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${enrollment.progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{enrollment.progress}% completado</Text>
                  </View>
                ) : null}
                {!isEnrolled ? (
                  <Pressable style={styles.enrollBtn} onPress={() => handleEnroll(course.id)}>
                    <Ionicons name="add-circle-outline" size={16} color="#fff" />
                    <Text style={styles.enrollText}>Inscribirse</Text>
                  </Pressable>
                ) : null}
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  grid: { gap: 14 },
  card: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  cardDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: 10 },
  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: colors.textSecondary },
  progressSection: { marginBottom: 4 },
  progressBarBg: { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  progressBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },
  progressText: { fontSize: 11, color: colors.primary, fontWeight: '600' },
  enrollBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 10, marginTop: 6,
  },
  enrollText: { fontSize: 13, fontWeight: '600', color: '#fff' },
});
