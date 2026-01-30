import { apiClient } from '../api-client'
import { API_ENDPOINTS } from '../config'
import { ChatMessage, ChatSession } from '@/types'

export const chatService = {
  // Added getModels to fetch available chat models from the backend
  async getModels(): Promise<any[]> {
    const response = await apiClient.get(API_ENDPOINTS.chat.getModels)
    const models = response.data || response || []
    return Array.isArray(models) ? models.map((m: any) => ({
      ...m,
      id: m._id || m.id
    })) : []
  },

  async createSession(modelId?: string): Promise<ChatSession> {
    const response = await apiClient.post(API_ENDPOINTS.chat.createSession, { modelId })
    const session = response.data || response
    return {
      ...session,
      id: session._id || session.id
    }
  },

  async getSessions(): Promise<ChatSession[]> {
    const response = await apiClient.get(API_ENDPOINTS.chat.getSessions)
    const sessions = response.data || response || []
    return Array.isArray(sessions) ? sessions.map((s: any) => ({
      ...s,
      id: s._id || s.id
    })) : []
  },

  async deleteSession(sessionId: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.chat.deleteSession(sessionId))
  },

  async updateSession(sessionId: string, data: { title?: string; color?: string; isPinned?: boolean }): Promise<ChatSession> {
    const response = await apiClient.request(API_ENDPOINTS.chat.deleteSession(sessionId), {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
    const session = response.data || response
    return {
      ...session,
      id: session._id || session.id
    }
  },

  async sendMessage(sessionId: string, message: string): Promise<ChatMessage[]> {
    const response = await apiClient.post(API_ENDPOINTS.chat.sendMessage(sessionId), { message })
    
    const { userMessage, aiMessage } = response.data || response
    
    return [
      {
        ...userMessage,
        id: userMessage._id || userMessage.id || `u-${Date.now()}`,
        role: 'user'
      },
      {
        ...aiMessage,
        id: aiMessage._id || aiMessage.id || `a-${Date.now()}`,
        role: 'assistant'
      }
    ]
  },

  async getHistory(sessionId: string): Promise<ChatMessage[]> {
    const response = await apiClient.get(API_ENDPOINTS.chat.getHistory(sessionId))
    const messages = response.data || response || []
    return Array.isArray(messages) ? messages.map((m: any) => ({
      ...m,
      id: m._id || m.id
    })) : []
  },
}