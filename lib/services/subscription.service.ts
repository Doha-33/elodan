import { apiClient } from '../api-client'
import { API_ENDPOINTS } from '../config'

export const subscriptionService = {
  async getPlans(): Promise<any> {
    return apiClient.get(API_ENDPOINTS.plans.getAll)
  },

  async getCurrentSubscription(): Promise<any> {
    return apiClient.get(API_ENDPOINTS.subscriptions.current)
  },

  async subscribe(planId: string): Promise<any> {
    return apiClient.post(API_ENDPOINTS.subscriptions.subscribe, { planId })
  },

  async changePlan(newPlanId: string): Promise<any> {
    return apiClient.post(API_ENDPOINTS.subscriptions.changePlan, { newPlanId })
  }
}