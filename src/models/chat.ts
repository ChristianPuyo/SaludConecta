export type ChatSender = 'user' | 'bot';

export interface ChatMessage {
  id: string;
  text: string;
  sender: ChatSender;
  timestamp: string;
}

export interface FAQEntry {
  keywords: string[];
  answer: string;
  category: string;
}
