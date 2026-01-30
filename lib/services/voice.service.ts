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
   */
  async getModels(): Promise<any[]> {
    const response = await apiClient.get('/voice/models')
    return response.data || []
  },

  /**
   * Fetches available voices for a specific model
   * Endpoint: /voice/voices?modelId=...
   */
  async getVoices(modelId: string): Promise<any[]> {
    const response = await apiClient.get(`/voice/voices`, { params: { modelId } })
    return response.data || []
  },

  /**
   * Generates a voice clip from text
   * Payload: { modelId, text, language, voiceId? }
   */
  async generateVoice(data: GenerateVoiceData): Promise<any> {
    const response = await apiClient.post('/voice/generate', data)
    return response.data || response
  },

  /**
   * Gets generation history with pagination
   * Response matches: { success: true, data: [ ... ], pagination: { ... } }
   */
  async getHistory(page = 1, limit = 10): Promise<any[]> {
    const response = await apiClient.get('/voice/history', { params: { page, limit } })
    // Standardize _id to id if needed, but keeping original structure as per API spec
    return response.data || []
  },

  /**
   * Saves a generated voice clip to the gallery
   */
  async saveToGallery(voiceGenerationId: string): Promise<any> {
    const response = await apiClient.post(`/voice/save/${voiceGenerationId}`)
    return response.data || response
  },

  /**
   * Deletes a voice generation from history
   */
  async deleteGeneration(voiceGenerationId: string): Promise<void> {
    await apiClient.delete(`/voice/${voiceGenerationId}`)
  },
}