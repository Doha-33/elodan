export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  modelId: string;
  createdAt: string;
  lastMessage?: string;
  isPinned?: boolean;
  color?: string;
}