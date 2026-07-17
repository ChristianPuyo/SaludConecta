/**
 * SocialCommunityScreen - Red social comunitaria para compartir publicaciones relacionadas con salud.
 * Permite crear publicaciones, dar me gusta, ordenar por recientes o populares, e interactuar con la comunidad.
 * Carga datos desde CommunityService y actualiza el muro de forma dinámica.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { PageHeader, FilterBar, EmptyState } from '../components/ReusableComponents';
import { CommunityService } from '../../services/communityService';
import type { CommunityPost } from '../../models/community';

const sortFilters = [
  { id: 'recientes', label: 'Recientes' },
  { id: 'populares', label: 'Populares' },
  { id: 'siguiendo', label: 'Siguiendo' },
];

export function SocialCommunityScreen({ title, subtitle }: { title?: string; subtitle?: string }) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [sortBy, setSortBy] = useState('recientes');
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      let result = await CommunityService.getPosts();
      if (sortBy === 'populares') result.sort((a, b) => b.likes - a.likes);
      else if (sortBy === 'recientes') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPosts(result);
    } catch { /* service handles internally */ }
    setLoading(false);
  }, [sortBy]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const handleLike = useCallback(async (postId: string) => {
    await CommunityService.likePost(postId);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  }, []);

  const handlePost = useCallback(async () => {
    if (!newPost.trim()) return;
    const post: CommunityPost = {
      id: Date.now().toString(),
      userId: 'current',
      userName: 'Usuario',
      content: newPost.trim(),
      likes: 0,
      comments: [],
      shares: 0,
      tags: [],
      category: 'general',
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await CommunityService.savePost(post);
    setPosts(prev => [post, ...prev]);
    setNewPost('');
  }, [newPost]);

  return (
    <ScrollView style={styles.container}>
      <PageHeader title={title || 'Comunidad'} subtitle={subtitle || 'Comparte y conéctate con tu comunidad'} />

      <View style={styles.createPost}>
        <TextInput
          style={styles.postInput}
          placeholder="¿Qué quieres compartir?"
          placeholderTextColor={colors.textSecondary}
          value={newPost}
          onChangeText={setNewPost}
          multiline
        />
        <Pressable style={[styles.postBtn, !newPost.trim() && styles.postBtnDisabled]} onPress={handlePost} disabled={!newPost.trim()}>
          <Ionicons name="send" size={18} color="#fff" />
          <Text style={styles.postBtnText}>Publicar</Text>
        </Pressable>
      </View>

      <FilterBar filters={sortFilters} active={sortBy} onFilter={setSortBy} />

      {posts.length === 0 && !loading ? (
        <EmptyState icon="chatbubbles" title="Sin publicaciones" subtitle="Sé el primero en compartir algo con tu comunidad" />
      ) : (
        <View style={styles.feed}>
          {posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={18} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.postUserName}>{post.userName}</Text>
                  <Text style={styles.postDate}>{new Date(post.createdAt).toLocaleDateString()}</Text>
                </View>
              </View>
              <Text style={styles.postContent}>{post.content}</Text>
              <View style={styles.postActions}>
                <Pressable style={styles.actionBtn} onPress={() => handleLike(post.id)}>
                  <Ionicons name="heart" size={18} color={post.likes > 0 ? colors.danger : colors.textSecondary} />
                  <Text style={styles.actionText}>{post.likes}</Text>
                </Pressable>
                <View style={styles.actionBtn}>
                  <Ionicons name="chatbubble" size={18} color={colors.textSecondary} />
                  <Text style={styles.actionText}>{post.comments.length}</Text>
                </View>
                <View style={styles.actionBtn}>
                  <Ionicons name="share-social" size={18} color={colors.textSecondary} />
                  <Text style={styles.actionText}>{post.shares}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.background },
  createPost: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
    gap: 12,
  },
  postInput: { fontSize: 14, color: colors.textPrimary, minHeight: 60, textAlignVertical: 'top' },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
  },
  postBtnDisabled: { opacity: 0.5 },
  postBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  feed: { gap: 12 },
  postCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  postUserName: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  postDate: { fontSize: 12, color: colors.textSecondary },
  postContent: { fontSize: 14, color: colors.textPrimary, lineHeight: 20 },
  postActions: { flexDirection: 'row', gap: 20, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
});
