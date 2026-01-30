
'use client'

import React, { useState } from 'react'
import PageLayout from '@/components/PageLayout'
import { ChatHeader } from './components/ChatHeader'
import { ChatHero } from './components/ChatHero'
import { ChatInput } from './components/ChatInput'
import { AvailableModels } from './components/AvailableModels'

export default function StartChatPage() {
  const [selectedModel, setSelectedModel] = useState<any>(null)

  return (
    <PageLayout>
      <div className="flex flex-col min-h-screen bg-[#F8F8F8]">
        <main className="flex-1 flex flex-col">
          {/* Hero Section */}
          <ChatHero />

          {/* Chat Input Container */}
          <ChatInput selectedModel={selectedModel} />

          {/* Available Models Section */}
          <AvailableModels 
            selectedModelId={selectedModel?._id || selectedModel?.id} 
            onSelect={setSelectedModel} 
          />
        </main>
      </div>
    </PageLayout>
  )
}
