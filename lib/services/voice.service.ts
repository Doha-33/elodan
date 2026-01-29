import { apiClient } from '../api-client'

export interface GenerateVoiceData {
  modelId: string
  text: string
  language: string
  voiceId?: string
}

export const voiceService = {
  /**
   * Fetches all available voice models
   * Endpoint: /voice/models
   * Response: { success: true, data: [ ... ] }
   */
  async getModels(): Promise<any[]> {
    const response = await apiClient.get('/voice/models')
    return response.data || []
  },

  /**
   * Fetches available voices for a specific model
   * Endpoint: /voice/voices?modelId=...
   * Response: { success: true, data: [ ... ] }
   */
  async getVoices(modelId: string): Promise<any[]> {
    const response = await apiClient.get(`/voice/voices`, { params: { modelId } })
    return response.data || []
  },

  /**
   * Generates a voice clip from text
   * Endpoint: /voice/generate
   * Payload: { modelId, text, language, voiceId? }
   */
  async generateVoice(data: GenerateVoiceData): Promise<any> {
    const response = await apiClient.post('/voice/generate', data)
    // The response.data usually contains the created voice object with audioUrl
    return response.data || response
  },

  /**
   * Gets generation history with pagination
   * Endpoint: /voice/history?page=1&limit=10
   * Response: { success: true, data: [ ... ], pagination: { ... } }
   */
  async getHistory(page = 1, limit = 10): Promise<any[]> {
    const response = await apiClient.get('/voice/history', { params: { page, limit } })
    return response.data || []
  },

  /**
   * Saves a generated voice clip to the gallery
   * Endpoint: /voice/save/{{voiceGenerationId}}
   */
  async saveToGallery(voiceGenerationId: string): Promise<any> {
    const response = await apiClient.post(`/voice/save/${voiceGenerationId}`)
    return response.data || response
  },

  /**
   * Deletes a voice generation from history
   * Endpoint: /voice/{{voiceGenerationId}}
   */
  async deleteGeneration(voiceGenerationId: string): Promise<void> {
    await apiClient.delete(`/voice/${voiceGenerationId}`)
  },
}
