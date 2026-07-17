import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { EducationalArticle, ArticleCategory } from '../../models/education';
import { EducationService } from '../../services/educationService';
import { SearchBar } from '../../components/SearchBar';
import { EmptyState } from '../../components/EmptyState';
import { colors } from '../../theme/colors';
import type { CitizenStackParamList } from '../../navigation/CitizenNavigator';
import { EDUCATION_CATEGORIES } from '../../utils/constants';

type Nav = NativeStackNavigationProp<CitizenStackParamList>;

export function EducationScreen() {
  const navigation = useNavigation<Nav>();
  const [articles, setArticles] = useState<EducationalArticle[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | null>(null);

  useEffect(() => { EducationService.getAll().then(setArticles); }, []);

  const filtered = articles.filter((a) => {
    if (selectedCategory && a.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Centro de Educación</Text>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar artículos..." />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow} contentContainerStyle={styles.categoriesContent}>
        <Pressable style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]} onPress={() => setSelectedCategory(null)}>
          <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>Todos</Text>
        </Pressable>
        {EDUCATION_CATEGORIES.map((cat) => (
          <Pressable key={cat.id} style={[styles.categoryChip, selectedCategory === cat.id && styles.categoryChipActive]} onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id as ArticleCategory)}>
            <Ionicons name={cat.icon as any} size={16} color={selectedCategory === cat.id ? '#fff' : colors.textSecondary} />
            <Text style={[styles.categoryText, selectedCategory === cat.id && styles.categoryTextActive]}>{cat.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => navigation.navigate('ArticleDetail', { articleId: item.id })}>
            <View style={styles.cardHeader}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{EDUCATION_CATEGORIES.find((c) => c.id === item.category)?.label ?? item.category}</Text>
              </View>
              <Text style={styles.readTime}>{item.readTime} min</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.description}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<EmptyState icon="book-outline" title="Sin resultados" description="No se encontraron artículos para esta búsqueda." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingBottom: 0, gap: 8 },
  title: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  categoriesRow: { maxHeight: 48, marginTop: 12, marginBottom: 4 },
  categoriesContent: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  categoryTextActive: { color: '#fff' },
  listContent: { padding: 20, gap: 10 },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryBadge: { backgroundColor: '#F0FDFA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  categoryBadgeText: { fontSize: 11, fontWeight: '600', color: colors.primary },
  readTime: { fontSize: 11, color: colors.textSecondary },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  cardDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
});
