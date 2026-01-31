import { apiClient } from '../api-client'
import { API_ENDPOINTS } from '../config'

export const offerService = {
  async getOffers(): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.offers.getAll)
    return response.data
  },

  async getLatestOffer(): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.offers.getLatest)
    return response.data
  },

  async validateOffer(offerId: string, targetType: 'plan' | 'bundle', targetId: string): Promise<any> {
    const response = await apiClient.post(API_ENDPOINTS.offers.validate, { 
      offerId, 
      targetType, 
      targetId 
    })
    return response.data
  }
}
