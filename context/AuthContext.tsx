
'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { authService, LoginData, RegisterData } from '@/lib/services/auth.service'
import { apiClient } from '@/lib/api-client'

interface AuthState {
  user: any | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  register: (data: RegisterData) => Promise<{ success: boolean; data?: any; error?: string }>
  login: (data: LoginData) => Promise<{ success: boolean; data?: any; error?: string }>
  logout: () => Promise<{ success: boolean }>
  requestPasswordReset: (email: string) => Promise<{ success: boolean; data?: any; error?: string }>
  confirmPasswordReset: (token: string, newPassword: string) => Promise<{ success: boolean; data?: any; error?: string }>
  updateUser: (userData: any) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
  })

  const checkAuth = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser()
      if (user && (user.id || user._id || user.email)) {
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      } else {
        setState({ user: null, isAuthenticated: false, isLoading: false, error: null })
      }
    } catch (error: any) {
      // If apiClient catches a failed refresh, it throws 401
      setState({ user: null, isAuthenticated: false, isLoading: false, error: null })
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const register = useCallback(async (data: RegisterData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await authService.register(data)
      setState((prev) => ({ ...prev, isLoading: false }))
      return { success: true, data: response }
    } catch (error: any) {
      setState((prev) => ({ ...prev, error: error.message || 'Registration failed', isLoading: false }))
      return { success: false, error: error.message }
    }
  }, [])

  const login = useCallback(async (data: LoginData) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await authService.login(data)
      
      const token = response.data?.accessToken || (response as any).accessToken
      if (token) {
        apiClient.setToken(token)
      }

      const user = response.data?.user || (response as any).user
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      return { success: true, data: response }
    } catch (error: any) {
      setState((prev) => ({ ...prev, error: error.message || 'Login failed', isLoading: false }))
      return { success: false, error: error.message }
    }
  }, [])

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try { 
      await authService.logout() 
    } catch (error) {}
    
    apiClient.clearToken()
    setState({ user: null, isAuthenticated: false, isLoading: false, error: null })
    return { success: true }
  }, [])

  const requestPasswordReset = useCallback(async (email: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await authService.requestPasswordReset({ email })
      setState((prev) => ({ ...prev, isLoading: false }))
      return { success: true, data: response }
    } catch (error: any) {
      setState((prev) => ({ ...prev, error: error.message, isLoading: false }))
      return { success: false, error: error.message }
    }
  }, [])

  const confirmPasswordReset = useCallback(async (token: string, newPassword: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await authService.confirmPasswordReset({ token, newPassword })
      setState((prev) => ({ ...prev, isLoading: false }))
      return { success: true, data: response }
    } catch (error: any) {
      setState((prev) => ({ ...prev, error: error.message, isLoading: false }))
      return { success: false, error: error.message }
    }
  }, [])

  const updateUser = useCallback((userData: any) => {
    setState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : userData,
    }))
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout, requestPasswordReset, confirmPasswordReset, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuthContext must be used within an AuthProvider')
  return context
}
