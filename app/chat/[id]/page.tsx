'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import PageLayout from '@/components/PageLayout'
import { ChatInput } from '@/app/start-chat/components/ChatInput'
import { chatService } from '@/lib/services/chat.service'
import { ChatMessage } from '@/types'
import { RotateCcw, Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

const BOT_ICON = "/assets/icons/brands/gpt.svg"
const USER_IMG = "/assets/images/gallery/image to image.png"

export default function ChatSessionPage() {
  const { id } = useParams()
  const sessionId = id as string
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copyingId, setCopyingId] = useState<string | null>(null)
  const { showToast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await chatService.getHistory(sessionId)
        setMessages(history)
      } catch (error) {
        console.error("Failed to load chat history", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchHistory()
  }, [sessionId])

  useEffect(scrollToBottom, [messages])

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopyingId(id)
    showToast("Message copied to clipboard", "success")
    setTimeout(() => setCopyingId(null), 2000)
  }

  const handleFeedback = (type: 'up' | 'down') => {
    showToast(type === 'up' ? "Glad you liked it!" : "Sorry about that. Feedback recorded.", "info")
  }

  const handleRegenerate = async () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')
    if (lastUserMsg) {
      showToast("Regenerating response...", "info")
      try {
        const response = await chatService.sendMessage(sessionId, lastUserMsg.content)
        // نأخذ رد الذكاء الاصطناعي فقط لتجنب مضاعفة رسالة المستخدم
        const aiResponse = response.find(m => m.role === 'assistant')
        if (aiResponse) {
          setMessages(prev => {
            const filtered = prev.filter(m => m.id !== 'temp-ai')
            // إذا كانت آخر رسالة هي assistant، نستبدلها
            if (filtered[filtered.length - 1].role === 'assistant') {
              return [...filtered.slice(0, -1), aiResponse]
            }
            return [...filtered, aiResponse]
          })
        }
      } catch (e) {
        showToast("Failed to regenerate response", "error")
      }
    }
  }

  const handleNewMessages = (newMsgs: ChatMessage | ChatMessage[]) => {
    if (Array.isArray(newMsgs)) {
      setMessages(prev => {
        const filtered = prev.filter(m => !m.id.startsWith('temp-'));
        return [...filtered, ...newMsgs];
      });
    } else {
      setMessages(prev => [...prev, newMsgs]);
    }
  }

  return (
    <PageLayout>
      <div className="flex flex-col h-[calc(100vh-120px)] bg-white font-[Inter]">
        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-10 scrollbar-hide">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-[#110C0C]/10 border-t-[#110C0C] rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 py-20">No messages yet. Say hi!</div>
          ) : (
            messages.map((msg, index) => (
              <div key={msg.id || index} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-gray-100 bg-white">
                   <img 
                    src={msg.role === 'user' ? USER_IMG : BOT_ICON} 
                    alt={msg.role} 
                    className={`w-full h-full object-cover ${msg.role === 'assistant' ? 'p-1' : ''}`}
                   />
                </div>
                <div className="flex flex-col gap-2 max-w-[85%]">
                  {msg.role === 'assistant' && (
                    <span className="text-[13px] font-bold text-[#110C0C]/60 mb-1 ml-1">ChatGPT</span>
                  )}
                  <div className={`p-5 rounded-[22px] text-[15px] leading-relaxed shadow-sm transition-all duration-300 ${
                    msg.role === 'user' 
                      ? 'bg-[#110C0C] text-white rounded-tr-none' 
                      : 'bg-[#F2F2F2] text-[#110C0C] rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                  
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 mt-1 ml-1">
                      <button 
                        onClick={handleRegenerate} 
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors group" 
                        title="Regenerate"
                      >
                        <RotateCcw className="w-4 h-4 text-gray-400 group-hover:text-[#110C0C]" />
                      </button>
                      <button 
                        onClick={() => handleCopy(msg.id, msg.content)} 
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors group" 
                        title="Copy"
                      >
                        {copyingId === msg.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400 group-hover:text-[#110C0C]" />
                        )}
                      </button>
                      <button 
                        onClick={() => handleFeedback('up')} 
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors group" 
                        title="Good response"
                      >
                        <ThumbsUp className="w-4 h-4 text-gray-400 group-hover:text-[#110C0C]" />
                      </button>
                      <button 
                        onClick={() => handleFeedback('down')} 
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors group" 
                        title="Bad response"
                      >
                        <ThumbsDown className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="pt-4">
          {/* Removed {null} children to fix required children type error */}
          <ChatInput sessionId={sessionId} onMessageSent={handleNewMessages} />
        </div>
      </div>
    </PageLayout>
  )
}