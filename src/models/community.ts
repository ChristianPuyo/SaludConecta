/**
 * Community - Define las interfaces y tipos para la comunidad y soporte.
 * Incluye las entidades de publicaciones, comentarios, eventos y tickets de soporte.
 */
export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  likes: number;
  comments: CommunityComment[];
  shares: number;
  tags: string[];
  category: 'general' | 'health_tip' | 'question' | 'experience' | 'event' | 'alert';
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  createdAt: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'talk' | 'campaign' | 'vaccination' | 'screening';
  date: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  organizer: string;
  imageUrl?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: 'technical' | 'medical' | 'account' | 'other';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  attachments: string[];
  createdAt: string;
}
