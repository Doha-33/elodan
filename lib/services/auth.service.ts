
import { apiClient } from '../api-client'
import { API_ENDPOINTS } from '../config'

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    accessToken?: string
    refreshToken?: string
    user: {
      id: string
      email: string
      name: string
      role: string
      avatar?: string | null
    }
  }
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface LoginData {
  email: string
  password: string
}

export const authService = {
  async register(data: RegisterData): Promise<any> {
    return apiClient.post(API_ENDPOINTS.auth.register, data)
  },

  async login(data: LoginData): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.auth.login, data)
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.logout)
    } catch (e) {
      console.error("Logout failed on server", e)
    }
  },

  async refresh(): Promise<AuthResponse> {
    // نرسل طلب فارغ لأن الـ Refresh Token غالباً موجود في الـ Cookies (httpOnly)
    return apiClient.post<AuthResponse>(API_ENDPOINTS.auth.refresh, {})
  },

  async requestPasswordReset(data: { email: string }): Promise<{ message: string }> {
    return apiClient.post(API_ENDPOINTS.auth.resetPasswordRequest, data)
  },

  async confirmPasswordReset(data: { token: string, newPassword: string }): Promise<{ message: string }> {
    return apiClient.post(API_ENDPOINTS.auth.resetPasswordConfirm, data)
  },

  async getCurrentUser(): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.auth.me)
    // دعم هيكلين مختلفين للبيانات (data.user أو الكائن مباشرة)
    return response.data?.user || response.data || response
  },

  async loginWithGoogle(code: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(API_ENDPOINTS.auth.google, { code })
  },
}
