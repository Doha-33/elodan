import { apiClient } from '../api-client'
import { API_ENDPOINTS } from '../config'

export interface GenerateEffectData {
  imageUrl?: string
  image?: File
  effectScene: string
  prompt?: string
}

export const videoEffectService = {
  async getModels(): Promise<any[]> {
    const response = await apiClient.get(API_ENDPOINTS.videoEffects.getModels)
    return response.data || []
  },

  async getCategories(): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.videoEffects.categories)
    return response.data || { categories: [] }
  },

  async generate(data: GenerateEffectData): Promise<any> {
    const { image, ...restData } = data
    
    if (image) {
      const formData = new FormData()
      // Send effectScene and prompt as part of form data
      if (restData.effectScene) formData.append('effectScene', restData.effectScene)
      if (restData.prompt) formData.append('prompt', restData.prompt)
      
      // Use the key 'image' as specified in the prompt
      formData.append('image', image)
      
      const response = await apiClient.postFormData(API_ENDPOINTS.videoEffects.generate, formData)
      return response.data // Contains data object with videoUrl etc.
    } else {
      const response = await apiClient.post(API_ENDPOINTS.videoEffects.generate, restData)
      return response.data
    }
  },

  async getHistory(limit = 10, skip = 0): Promise<any[]> {
    const response = await apiClient.get(API_ENDPOINTS.videoEffects.getHistory, {
      params: { limit, skip }
    })
    // Based on provided JSON: { success: true, count: 1, data: [...] }
    return (response.data || []).map((item: any) => ({
      ...item,
      id: item._id || item.id // Ensure we have a consistent id field
    }))
  },

  async saveToGallery(effectId: string): Promise<any> {
    const response = await apiClient.post(API_ENDPOINTS.videoEffects.save(effectId))
    return response.data
  },

  async deleteEffect(effectId: string): Promise<void> {
    // Standard delete endpoint for video effects
    await apiClient.delete(`/video-effects/${effectId}`)
  }
}