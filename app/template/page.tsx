'use client'

import { useState, useEffect, useCallback } from 'react'
import PageLayout from '@/components/PageLayout'
import { VideoEffectSettings } from './components/VideoEffectSettings'
import { VideoEffectHistory } from './components/VideoEffectHistory'
import { VideoLightbox } from './components/VideoLightbox'
import { videoEffectService } from '@/lib/services/videoEffect.service'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Plus, History, Sparkles } from 'lucide-react'

export default function VideoEffectPage() {
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [mobileView, setMobileView] = useState<'editor' | 'history'>('editor')
  const { isAuthenticated } = useAuth()

  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const data = await videoEffectService.getHistory(20, 0)
      setHistory(data)
    } catch (err) {
      console.error("Failed to load history", err)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleGenerated = (newVideoData: any) => {
    fetchHistory()
    if (newVideoData) {
      setSelectedVideo({
        ...newVideoData,
        id: newVideoData._id || newVideoData.id
      })
      if (window.innerWidth < 1024) setMobileView('history')
    }
  }

  return (
    <PageLayout>
      <div className="lg:hidden flex p-1.5 bg-[#E9E7E7] rounded-2xl mb-4 w-full max-w-[320px] mx-auto shadow-inner font-[Inter]">
        <button 
          onClick={() => setMobileView('editor')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all",
            mobileView === 'editor' ? "bg-white text-[#110C0C] shadow-md" : "text-[#8A8A8A]"
          )}
        >
          <Plus className="w-4 h-4" /> Templates
        </button>
        <button 
          onClick={() => setMobileView('history')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all",
            mobileView === 'history' ? "bg-white text-[#110C0C] shadow-md" : "text-[#8A8A8A]"
          )}
        >
          <History className="w-4 h-4" /> My Library
        </button>
      </div>

      <div className="flex flex-col h-[calc(100vh-180px)] lg:h-[calc(100vh-90px)] bg-[#FEFBFB] rounded-[2px] overflow-hidden border border-[#F0F0F3] shadow-sm font-[Inter]">
        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
          <div className={cn(
            "h-full lg:block",
            mobileView === 'editor' ? "block w-full lg:w-auto" : "hidden"
          )}>
            <VideoEffectSettings 
              onGenerated={handleGenerated}
            />
          </div>
          
          <div className={cn(
            "flex-1 flex flex-col overflow-hidden bg-white lg:flex",
            mobileView === 'history' ? "flex w-full" : "hidden"
          )}>
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gray-100 border-t-red-600 rounded-full animate-spin" />
              </div>
            ) : history.length > 0 ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-8 lg:px-10 pt-8 pb-4 border-b border-[#E5E5E8] flex items-center justify-between bg-white z-10">
                   <div className="flex items-center gap-5">
                      <div className="px-5 py-2 bg-[#F8F8F8] border border-[#E5E5E8] rounded-full">
                        <span className="text-[13px] font-black text-[#110C0C] uppercase tracking-tighter">Effect History</span>
                      </div>
                      <span className="text-[12px] text-[#8A8A8A] font-black uppercase tracking-widest opacity-60">
                        {history.length} Creations
                      </span>
                   </div>
                </div>
                <VideoEffectHistory 
                  effects={history} 
                  onRefresh={fetchHistory} 
                  onSelectVideo={setSelectedVideo}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[#8A8A8A] flex-col gap-8 p-10">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-50 rounded-[40px] flex items-center justify-center border border-gray-100 shadow-inner">
                  <Sparkles className="w-10 h-10 lg:w-14 lg:h-14 text-gray-200" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-[20px] font-black text-[#110C0C] uppercase tracking-tighter">Your Library is empty</p>
                  <p className="text-[14px] font-medium text-gray-400 max-w-[320px] leading-relaxed">
                    Upload a photo and select an AI template to generate stunning motion effects.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedVideo && (
        <VideoLightbox 
          video={selectedVideo} 
          onClose={() => setSelectedVideo(null)}
          onRefresh={fetchHistory}
        />
      )}
    </PageLayout>
  )
}