import { apiClient } from '../api-client'
import { API_ENDPOINTS } from '../config'

export interface GenerateEffectData {
  image: File
  effectScene: string
  prompt?: string
}

export interface ModelFilters {
  requiresFace?: boolean
  category?: string
}

export const videoEffectService = {
  /**
   * Fetches available Kling AI models and their nested scenes.
   * Supports filtering via query parameters.
   * Endpoints handled:
   * - Get face Video Effects (?requiresFace=true)
   * - Get non face Video Effects (?requiresFace=false)
   * - Get Video Effects by Category (?category=...)
   */
  async getModels(filters?: ModelFilters): Promise<any[]> {
    const response = await apiClient.get(API_ENDPOINTS.videoEffects.getModels, {
      params: filters
    })
    return response.data || []
  },

  /**
   * Fetches category counts for the sidebar/tabs
   * Endpoint: /video-effects/categories
   */
  async getCategories(): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.videoEffects.categories)
    return response.data || { categories: [] }
  },

  /**
   * Generates video effect using multipart/form-data
   * Payload: image (File), effectScene (String), prompt (Optional String)
   */
  async generate(data: GenerateEffectData): Promise<any> {
    const formData = new FormData()
    formData.append('image', data.image)
    formData.append('effectScene', data.effectScene)
    if (data.prompt) formData.append('prompt', data.prompt)
    
    const response = await apiClient.postFormData(API_ENDPOINTS.videoEffects.generate, formData)
    return response.data || response
  },

  /**
   * Gets generation history with internal ID mapping
   */
  async getHistory(limit = 10, skip = 0): Promise<any[]> {
    const response = await apiClient.get(API_ENDPOINTS.videoEffects.getHistory, {
      params: { limit, skip }
    })
    return (response.data || []).map((item: any) => ({
      ...item,
      id: item._id || item.id
    }))
  },

  /**
   * Saves temporary effect generation to user's permanent gallery
   */
  async saveToGallery(effectId: string): Promise<any> {
    const response = await apiClient.post(API_ENDPOINTS.videoEffects.save(effectId))
    return response.data || response
  },

  /**
   * Deletes a video effect generation
   */
  async deleteEffect(effectId: string): Promise<void> {
    await apiClient.delete(`/video-effects/${effectId}`)
  }
}