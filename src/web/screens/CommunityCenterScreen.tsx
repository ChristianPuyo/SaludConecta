/**
 * CommunityCenterScreen - Centro comunitario con foros, grupos de apoyo y actividades de participación ciudadana en salud.
 * Permite a los usuarios interactuar, compartir experiencias y acceder a recursos locales.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { CommunityService } from '../../services/communityService';
import type { CommunityPost, CommunityEvent } from '../../models/community';
import { PageHeader, FilterBar, ActionBar, EmptyState, StatusBadge } from '../components/ReusableComponents';

const CATEGORIES = [
  { id: 'all', label: 'General' },
  { id: 'health_tip', label: 'Consejos' },
  { id: 'question', label: 'Preguntas' },
  { id: 'experience', label: 'Experiencias' },
  { id: 'event', label: 'Eventos' },
];

const MOCK_POSTS: CommunityPost[] = [
  { id: '1', userId: 'u1', userName: 'María García', content: 'Comparto mi experiencia con el dengue, los síntomas y cómo lo traté en casa.', likes: 15, comments: [], shares: 3, tags: [], category: 'experience', isPinned: false, createdAt: '2026-07-15', updatedAt: '2026-07-15' },
  { id: '2', userId: 'u2', userName: 'Carlos López', content: '¿Alguien sabe dónde puedo vacunar a mi hijo de 2 años en Iquitos?', likes: 8, comments: [], shares: 1, tags: [], category: 'question', isPinned: false, createdAt: '2026-07-14', updatedAt: '2026-07-14' },
  { id: '3', userId: 'u3', userName: 'Ana Torres', content: 'Consejo: siempre hiervan el agua antes de beberla, especialmente en temporada de lluvias.', likes: 24, comments: [], shares: 10, tags: [], category: 'health_tip', isPinned: false, createdAt: '2026-07-13', updatedAt: '2026-07-13' },
  { id: '4', userId: 'u4', userName: 'Pedro Sánchez', content: 'Recordatorio: Campaña de desparasitación este sábado en el centro de salud.', likes: 12, comments: [], shares: 5, tags: [], category: 'event', isPinned: false, createdAt: '2026-07-12', updatedAt: '2026-07-12' },
];

const MOCK_EVENTS: CommunityEvent[] = [
  { id: 'e1', title: 'Taller de Primeros Auxilios', description: 'Aprende técnicas básicas de emergencia.', type: 'workshop', date: '2026-08-01', location: 'Centro de Salud Bellavista', maxParticipants: 50, currentParticipants: 28, organizer: 'MINSA' },
  { id: 'e2', title: 'Campaña de Vacunación', description: 'Vacunación gratuita para toda la comunidad.', type: 'vaccination', date: '2026-07-25', location: 'Plaza de Armas', maxParticipants: 200, currentParticipants: 145, organizer: 'DIRESA' },
  { id: 'e3', title: 'Charla sobre Nutrición Infantil', description: 'Consejos para una alimentación saludable en niños.', type: 'talk', date: '2026-08-10', location: 'Auditorio Municipal', maxParticipants: 100, currentParticipants: 42, organizer: 'Hospital Regional' },
];

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  health_tip: 'bulb', question: 'help-circle', experience: 'chatbubbles', event: 'calendar', all: 'apps',
};

export function CommunityCenterScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    CommunityService.getPosts().then((data) => setPosts(data.length > 0 ? data : MOCK_POSTS)).catch(() => setPosts(MOCK_POSTS));
    CommunityService.getEvents().then((data) => setEvents(data.length > 0 ? data : MOCK_EVENTS)).catch(() => setEvents(MOCK_EVENTS));
  }, []);

  const filtered = posts.filter((p) => activeCategory === 'all' || p.category === activeCategory);

  const categoryLabels: Record<string, string> = {
    health_tip: 'Consejo', question: 'Pregunta', experience: 'Experiencia', event: 'Evento',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Centro Comunitario'} subtitle={subtitle || 'Comparte y aprende con la comunidad'} />
      <ActionBar actions={[
        { label: 'Nuevo Post', icon: 'create-outline', onPress: () => {}, primary: true },
        { label: 'Crear Evento', icon: 'calendar', onPress: () => {} },
      ]} />
      <View style={{ height: 12 }} />
      <FilterBar filters={CATEGORIES} active={activeCategory} onFilter={setActiveCategory} />
      {filtered.length === 0 ? (
        <EmptyState icon="chatbox-ellipses-outline" title="Sin publicaciones" subtitle="Sé el primero en compartir algo con la comunidad." />
      ) : (
        <View style={styles.postsList}>
          {filtered.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={16} color={colors.primary} />
                </View>
                <View style={styles.postUserInfo}>
                  <Text style={styles.postUserName}>{post.userName}</Text>
                  <Text style={styles.postDate}>{post.createdAt}</Text>
                </View>
                <StatusBadge label={categoryLabels[post.category] || post.category} status="info" />
              </View>
              <Text style={styles.postContent}>{post.content}</Text>
              <View style={styles.postActions}>
                <Pressable style={styles.postActionBtn}>
                  <Ionicons name="heart-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.postActionText}>{post.likes}</Text>
                </Pressable>
                <Pressable style={styles.postActionBtn}>
                  <Ionicons name="chatbubble-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.postActionText}>{post.comments.length}</Text>
                </Pressable>
                <Pressable style={styles.postActionBtn}>
                  <Ionicons name="share-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.postActionText}>{post.shares}</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
      <View style={styles.eventsSection}>
        <Text style={styles.sectionTitle}>Próximos Eventos</Text>
        {events.length === 0 ? (
          <EmptyState icon="calendar-outline" title="Sin eventos" subtitle="No hay eventos programados próximamente." />
        ) : (
          <View style={styles.eventsList}>
            {events.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventDateBadge}>
                  <Text style={styles.eventDateDay}>{new Date(event.date).getDate()}</Text>
                  <Text style={styles.eventDateMonth}>
                    {new Date(event.date).toLocaleString('es', { month: 'short' })}
                  </Text>
                </View>
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDesc} numberOfLines={1}>{event.description}</Text>
                  <View style={styles.eventMeta}>
                    <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
                    <Text style={styles.eventMetaText}>{event.location}</Text>
                  </View>
                </View>
                <View style={styles.eventParticipants}>
                  <Text style={styles.eventPartCount}>{event.currentParticipants}/{event.maxParticipants}</Text>
                  <Text style={styles.eventPartLabel}>participantes</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  postsList: { gap: 12, marginTop: 12 },
  postCard: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  postUserInfo: { flex: 1 },
  postUserName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  postDate: { fontSize: 11, color: colors.textSecondary },
  postContent: { fontSize: 14, color: colors.textPrimary, lineHeight: 20, marginBottom: 12 },
  postActions: { flexDirection: 'row', gap: 20 },
  postActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  postActionText: { fontSize: 12, color: colors.textSecondary },
  eventsSection: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  eventsList: { gap: 10 },
  eventCard: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: colors.border, gap: 12, alignItems: 'center',
  },
  eventDateBadge: {
    width: 50, height: 50, borderRadius: 12, backgroundColor: colors.primary + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  eventDateDay: { fontSize: 18, fontWeight: '800', color: colors.primary },
  eventDateMonth: { fontSize: 10, fontWeight: '600', color: colors.primary, textTransform: 'uppercase' },
  eventInfo: { flex: 1, gap: 2 },
  eventTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  eventDesc: { fontSize: 12, color: colors.textSecondary },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  eventMetaText: { fontSize: 11, color: colors.textSecondary },
  eventParticipants: { alignItems: 'center' },
  eventPartCount: { fontSize: 14, fontWeight: '700', color: colors.primary },
  eventPartLabel: { fontSize: 10, color: colors.textSecondary },
});
