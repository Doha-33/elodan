import { apiClient } from '../api-client'
import { API_ENDPOINTS } from '../config'

export interface GenerateImageData {
  prompt?: string
  modelId?: string
  resolution?: string
  quality?: string
  aspectRatio?: string
  generationType: 'text-to-image' | 'image-to-image' | 'surprise-me'
  inputImage?: File
}

export const imageService = {
  async getModels(): Promise<any> {
    return apiClient.get(API_ENDPOINTS.image.getModels)
  },

  async generateImage(data: GenerateImageData): Promise<any> {
    const resolution = data.resolution || '1024x1024'

    if (data.generationType === 'surprise-me') {
      return apiClient.post(API_ENDPOINTS.image.generate, {
        generationType: 'surprise-me',
        resolution: resolution
      })
    }

    if (data.inputImage) {
      const formData = new FormData()
      formData.append('prompt', data.prompt || '')
      formData.append('modelId', data.modelId || '')
      formData.append('resolution', resolution)
      formData.append('aspectRatio', data.aspectRatio || '1:1')
      formData.append('generationType', data.generationType)
      formData.append('inputImage', data.inputImage)
      return apiClient.postFormData(API_ENDPOINTS.image.generate, formData)
    }

    // Fix: Spread data and ensure resolution is included for text-to-image requests
    return apiClient.post(API_ENDPOINTS.image.generate, {
      ...data,
      resolution: resolution
    })
  },

  async improvePrompt(prompt: string, modelId: string): Promise<any> {
    return apiClient.post(API_ENDPOINTS.image.improvePrompt, { prompt, modelId })
  },

  async getHistory(): Promise<any> {
    return apiClient.get(API_ENDPOINTS.image.getHistory)
  },

  async saveToGallery(generationId: string): Promise<any> {
    return apiClient.post(API_ENDPOINTS.image.save(generationId))
  },

  async deleteGeneration(id: string): Promise<any> {
    return apiClient.delete(API_ENDPOINTS.image.delete(id))
  }
}