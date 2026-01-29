'use client'

import { useEffect } from 'react'
// Fix: Changed useRouter import from next/navigation to next/router to resolve export error
import { useRouter } from 'next/router'

export default function ProfileRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to home as profile is now a sidebar triggered globally
    router.replace('/')
  }, [router])

  return null
}