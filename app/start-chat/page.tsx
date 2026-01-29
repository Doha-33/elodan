'use client'

import React from 'react'
import PageLayout from '@/components/PageLayout'
import { ChatHeader } from './components/ChatHeader'
// Fix: Corrected import path for ChatHero
import { ChatHero } from './components/ChatHero'
import { ChatInput } from './components/ChatInput'
import { AvailableModels } from './components/AvailableModels'

// Renaming the relative import path if needed, but assuming components are in same dir
export default function StartChatPage() {
  return (
    <PageLayout>
      <div className="flex flex-col min-h-screen bg-[#F8F8F8]">

        <main className="flex-1 flex flex-col">
          {/* Hero Section */}
          {/* Removed {null} children to fix property mismatch error */}
          <ChatHero />

          {/* Chat Input Container */}
          {/* Removed {null} children to fix property mismatch error */}
          <ChatInput />

          {/* Available Models Section */}
          <AvailableModels />
        </main>
      </div>
    </PageLayout>
  )
}