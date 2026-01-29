
import { apiClient } from '../api-client'
import { API_ENDPOINTS } from '../config'

export interface GenerateVideoData {
  modelId: string
  prompt: string
  image?: string // URL or base64 for image-to-video
  duration?: number
  aspect_ratio?: string
  camera_fixed?: boolean
  resolution?: string
}

export const videoService = {
  async getModels(type?: string): Promise<any[]> {
    const response = await apiClient.get(API_ENDPOINTS.video.getModels, {
      params: type ? { type } : undefined
    })
    return response.data || []
  },

  async textToVideo(data: GenerateVideoData): Promise<any> {
    const response = await apiClient.post(API_ENDPOINTS.video.textToVideo, data)
    return response.data
  },

  async imageToVideo(data: GenerateVideoData): Promise<any> {
    const response = await apiClient.post(API_ENDPOINTS.video.imageToVideo, data)
    return response.data
  },

  async surpriseMe(): Promise<any> {
    const response = await apiClient.post(API_ENDPOINTS.video.surpriseMe)
    return response.data
  },

  async improvePrompt(prompt: string, modelId: string): Promise<{ improvedPrompt: string }> {
    const response = await apiClient.post(API_ENDPOINTS.video.improvePrompt, { prompt, modelId })
    return response.data
  },

  async getHistory(limit = 10, skip = 0): Promise<any[]> {
    const response = await apiClient.get(API_ENDPOINTS.video.getHistory, {
      params: { limit, skip }
    })
    return (response.data || []).map((item: any) => ({
      ...item,
      id: item._id || item.id
    }))
  },

  async saveToGallery(generationId: string): Promise<any> {
    const response = await apiClient.post(API_ENDPOINTS.video.save(generationId))
    return response.data
  },

  async deleteGeneration(mediaId: string): Promise<void> {
    return apiClient.delete(API_ENDPOINTS.media.delete(mediaId))
  }
}
