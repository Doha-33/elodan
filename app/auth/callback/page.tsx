'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiClient } from '@/lib/api-client'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    const refreshToken = searchParams.get('refreshToken')

    if (accessToken) {
      apiClient.setToken(accessToken)
      // Redirect to home page where AuthContext will verify the token
      router.push('/')
    } else {
      const error = searchParams.get('error') || 'Google authentication failed'
      router.push(`/signin?error=${encodeURIComponent(error)}`)
    }
  }, [router, searchParams])

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#110C0C]"></div>
      <p className="text-[#8A8A8A] animate-pulse">Authenticating...</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Suspense fallback={
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#110C0C]"></div>
      }>
        <CallbackHandler />
      </Suspense>
    </div>
  )
}
