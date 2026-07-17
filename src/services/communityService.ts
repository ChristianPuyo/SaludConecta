/**
 * CommunityService - Servicio que gestiona publicaciones, eventos comunitarios y tickets de soporte.
 * Proporciona métodos CRUD, interacciones sociales y filtros temporales.
 * Utiliza AsyncStorage para persistencia local.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CommunityPost, CommunityEvent, SupportTicket } from '../models/community';

const POSTS_KEY = '@saludconecta/community_posts';
const EVENTS_KEY = '@saludconecta/community_events';
const TICKETS_KEY = '@saludconecta/support_tickets';

export const CommunityService = {
  async getPosts(): Promise<CommunityPost[]> {
    const raw = await AsyncStorage.getItem(POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async savePost(post: CommunityPost): Promise<void> {
    const list = await this.getPosts();
    const idx = list.findIndex(p => p.id === post.id);
    if (idx >= 0) list[idx] = post;
    else list.unshift(post);
    await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(list));
  },

  async likePost(postId: string): Promise<void> {
    const posts = await this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.likes++;
      await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    }
  },

  async getEvents(): Promise<CommunityEvent[]> {
    const raw = await AsyncStorage.getItem(EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async saveEvent(event: CommunityEvent): Promise<void> {
    const list = await this.getEvents();
    const idx = list.findIndex(e => e.id === event.id);
    if (idx >= 0) list[idx] = event;
    else list.push(event);
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(list));
  },

  async getUpcomingEvents(): Promise<CommunityEvent[]> {
    const list = await this.getEvents();
    const now = new Date().toISOString();
    return list.filter(e => e.date >= now).sort((a, b) => a.date.localeCompare(b.date));
  },
};

export const SupportService = {
  async getTickets(userId?: string): Promise<SupportTicket[]> {
    const raw = await AsyncStorage.getItem(TICKETS_KEY);
    const list: SupportTicket[] = raw ? JSON.parse(raw) : [];
    return userId ? list.filter(t => t.userId === userId) : list;
  },

  async saveTicket(ticket: SupportTicket): Promise<void> {
    const list = await this.getTickets();
    const idx = list.findIndex(t => t.id === ticket.id);
    if (idx >= 0) list[idx] = ticket;
    else list.push(ticket);
    await AsyncStorage.setItem(TICKETS_KEY, JSON.stringify(list));
  },

  async getOpenTickets(): Promise<SupportTicket[]> {
    const list = await this.getTickets();
    return list.filter(t => t.status === 'open' || t.status === 'in_progress');
  },
};
