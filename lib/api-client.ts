import { API_CONFIG, API_ENDPOINTS } from './config'

interface RequestOptions extends RequestInit {
  params?: Record<string, any>
}

class ApiClient {
  private baseURL: string
  private timeout: number
  private isRefreshing = false
  private refreshSubscribers: ((token: string) => void)[] = []
  private tokenKey = 'elodan_access_token'

  constructor() {
    this.baseURL = API_CONFIG.baseURL
    this.timeout = API_CONFIG.timeout
  }

  public setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token)
    }
  }

  public clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey)
    }
  }

  public getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey)
    }
    return null
  }

  private subscribeTokenRefresh(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb)
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((cb) => cb(token))
    this.refreshSubscribers = []
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    let url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`
    if (params) {
      const queryString = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) queryString.append(key, String(value))
      })
      const query = queryString.toString()
      if (query) url += (url.includes('?') ? '&' : '?') + query
    }
    return url
  }

  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options
    const url = this.buildUrl(endpoint, params)
    
    const executeRequest = async (): Promise<Response> => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)
      
      const token = this.getToken()
      
      // Fixed: Conditionally set headers to avoid overriding FormData boundary
      const headers = {
        ...API_CONFIG.headers,
        ...fetchOptions.headers,
      } as Record<string, string>

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      // CRITICAL: When sending FormData, the browser MUST set the Content-Type 
      // automatically to include the boundary string.
      if (fetchOptions.body instanceof FormData) {
        delete headers['Content-Type']
      }

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          headers,
          signal: controller.signal,
          credentials: 'include',
        })
        clearTimeout(timeoutId)
        return response
      } catch (err) {
        clearTimeout(timeoutId)
        throw err
      }
    }

    try {
      let response = await executeRequest()

      // Handle session expiration (401)
      if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
        if (!this.isRefreshing) {
          this.isRefreshing = true
          try {
            const refreshRes = await fetch(`${this.baseURL}${API_ENDPOINTS.auth.refresh}`, {
              method: 'POST',
              credentials: 'include',
              headers: API_CONFIG.headers
            })

            if (refreshRes.ok) {
              const refreshData = await refreshRes.json()
              const newToken = refreshData.data?.accessToken || refreshData.accessToken
              if (newToken) {
                this.setToken(newToken)
                this.isRefreshing = false
                this.onRefreshed(newToken)
              } else {
                throw new Error('Invalid refresh payload')
              }
            } else {
              throw new Error('Refresh failed')
            }
          } catch (err) {
            this.isRefreshing = false
            this.clearToken()
            this.refreshSubscribers = []
            throw { status: 401, message: 'Session expired' }
          }
        }

        return new Promise((resolve, reject) => {
          this.subscribeTokenRefresh(() => {
            executeRequest()
              .then(async (res) => {
                if (!res.ok) {
                  const errorBody = await res.json().catch(() => ({}))
                  reject({ status: res.status, message: errorBody.message || 'Retry failed' })
                } else {
                  resolve(await res.json())
                }
              })
              .catch(reject)
          })
        })
      }

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw { status: response.status, message: errorBody.message || 'API Error', data: errorBody }
      }

      return await response.json()
    } catch (error: any) {
      if (error.name === 'AbortError') throw new Error('Request timeout')
      throw error
    }
  }

  async get<T = any>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T = any>(endpoint: string, data?: any, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T = any>(endpoint: string, data?: any, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T = any>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  async postFormData<T = any>(endpoint: string, formData: FormData, options?: any) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: formData })
  }

  async patchFormData<T = any>(endpoint: string, formData: FormData, options?: any) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body: formData })
  }
}

export const apiClient = new ApiClient()