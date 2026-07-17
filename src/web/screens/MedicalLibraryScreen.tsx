/**
 * MedicalLibraryScreen - Biblioteca médica digital con catálogo de publicaciones, guías clínicas y recursos educativos.
 * Ofrece búsqueda, filtros por categoría y visualización de contenido académico.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { EducationService } from '../../services/educationService';
import type { EducationalArticle } from '../../models/education';
import { PageHeader, FilterBar, EmptyState } from '../components/ReusableComponents';

const CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'general', label: 'Enfermedades' },
  { id: 'prevencion', label: 'Prevención' },
  { id: 'alimentacion', label: 'Nutrición' },
  { id: 'salud_infantil', label: 'Salud Mental' },
  { id: 'primeros_auxilios', label: 'Primeros Auxilios' },
];

const MOCK_ARTICLES: EducationalArticle[] = [
  { id: '1', title: 'Prevención del Dengue', description: 'Aprende a proteger a tu familia del dengue.', category: 'prevencion', readTime: 5, content: '', featured: false, createdAt: '2026-06-01' },
  { id: '2', title: 'Alimentación Saludable', description: 'Claves para una dieta balanceada.', category: 'alimentacion', readTime: 7, content: '', featured: false, createdAt: '2026-05-15' },
  { id: '3', title: 'Salud Mental en la Comunidad', description: 'Reconoce las señales de alerta.', category: 'salud_infantil', readTime: 4, content: '', featured: false, createdAt: '2026-04-20' },
  { id: '4', title: 'Primeros Auxilios Básicos', description: 'Acciones inmediatas ante emergencias.', category: 'primeros_auxilios', readTime: 6, content: '', featured: false, createdAt: '2026-03-10' },
  { id: '5', title: 'Enfermedades Respiratorias', description: 'Cómo prevenir infecciones respiratorias.', category: 'general', readTime: 5, content: '', featured: false, createdAt: '2026-02-20' },
  { id: '6', title: 'Nutrición Infantil', description: 'Guía de alimentación para los más pequeños.', category: 'alimentacion', readTime: 8, content: '', featured: false, createdAt: '2026-01-15' },
];

export function MedicalLibraryScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [articles, setArticles] = useState<EducationalArticle[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    EducationService.getAll().then((data) => {
      setArticles(data.length > 0 ? data : MOCK_ARTICLES);
    }).catch(() => setArticles(MOCK_ARTICLES));
  }, []);

  const filtered = articles.filter((a) => {
    if (activeCategory !== 'all' && a.category !== activeCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
    }
    return true;
  });

  const categoryMap: Record<string, string> = {
    general: 'Enfermedades', prevencion: 'Prevención', alimentacion: 'Nutrición',
    salud_infantil: 'Salud Mental', primeros_auxilios: 'Primeros Auxilios',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PageHeader title={title || 'Biblioteca Médica'} subtitle={subtitle || 'Artículos y recursos de salud'} />
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar artículos..."
          placeholderTextColor={colors.textSecondary}
        />
        {search ? (
          <Pressable onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>
      <FilterBar filters={CATEGORIES} active={activeCategory} onFilter={setActiveCategory} />
      {filtered.length === 0 ? (
        <EmptyState icon="book-outline" title="Sin resultados" subtitle="No se encontraron artículos para esta búsqueda." />
      ) : (
        <View style={styles.grid}>
          {filtered.map((article) => (
            <Pressable key={article.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{categoryMap[article.category] || article.category}</Text>
                </View>
                <Ionicons name="heart-outline" size={18} color={colors.textSecondary} />
              </View>
              <Text style={styles.cardTitle}>{article.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{article.description}</Text>
              <View style={styles.cardFooter}>
                <View style={styles.readTime}>
                  <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.readTimeText}>{article.readTime} min</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.primary} />
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1,
    borderColor: colors.border, marginBottom: 16, gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary, padding: 0 },
  grid: { gap: 12 },
  card: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryBadge: { backgroundColor: colors.primary + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  categoryText: { fontSize: 11, fontWeight: '600', color: colors.primary },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  cardDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  readTime: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  readTimeText: { fontSize: 12, color: colors.textSecondary },
});
