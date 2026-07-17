import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { EducationalArticle } from '../../models/education';
import { EducationService } from '../../services/educationService';
import { FavoriteButton } from '../../components/FavoriteButton';
import { colors } from '../../theme/colors';
import type { CitizenStackParamList } from '../../navigation/CitizenNavigator';
import { EDUCATION_CATEGORIES } from '../../utils/constants';

type RouteProps = RouteProp<CitizenStackParamList, 'ArticleDetail'>;

export function ArticleDetailScreen() {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();
  const [article, setArticle] = useState<EducationalArticle | null>(null);

  useEffect(() => {
    EducationService.getById(route.params.articleId).then((a) => {
      setArticle(a ?? null);
      if (a) navigation.setOptions({ title: a.title } as any);
    });
  }, [route.params.articleId]);

  if (!article) return null;

  const category = EDUCATION_CATEGORIES.find((c) => c.id === article.category);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.meta}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category?.label ?? article.category}</Text>
          </View>
          <Text style={styles.readTime}>{article.readTime} min de lectura</Text>
        </View>
        <FavoriteButton type="article" itemId={article.id} />
      </View>

      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.description}>{article.description}</Text>
      <View style={styles.divider} />
      <Text style={styles.contentText}>{article.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  meta: { gap: 6 },
  categoryBadge: { backgroundColor: '#F0FDFA', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start' },
  categoryText: { fontSize: 12, fontWeight: '600', color: colors.primary },
  readTime: { fontSize: 12, color: colors.textSecondary },
  title: { fontSize: 24, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  description: { fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: 16 },
  divider: { height: 1, backgroundColor: colors.border, marginBottom: 16 },
  contentText: { fontSize: 15, color: colors.textPrimary, lineHeight: 24 },
});
