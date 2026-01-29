'use client'

import { useAuthContext } from '@/context/AuthContext'

/**
 * Custom hook that consumes the global AuthContext.
 * This maintains the existing API for components using useAuth()
 * while ensuring state is shared globally across the app.
 */
export function useAuth() {
  return useAuthContext()
}
