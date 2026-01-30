'use client'

import { useState, useEffect, useCallback } from 'react'
import PageLayout from '@/components/PageLayout'
import { VideoEffectSettings } from './components/VideoEffectSettings'
import { VideoEffectHistory } from './components/VideoEffectHistory'
import { VideoLightbox } from './components/VideoLightbox'
import { videoEffectService } from '@/lib/services/videoEffect.service'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Plus, History } from 'lucide-react'

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
      <div className="lg:hidden flex p-1.5 bg-[#E9E7E7] rounded-2xl mb-4 w-full max-w-[320px] mx-auto shadow-inner">
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
          <History className="w-4 h-4" /> History
        </button>
      </div>

      <div className="flex flex-col h-[calc(100vh-180px)] lg:h-[calc(100vh-90px)] bg-[#FEFBFB]">
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
                <div className="w-8 h-8 border-4 border-[#110C0C]/10 border-t-purple-500 rounded-full animate-spin" />
              </div>
            ) : history.length > 0 ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-6 lg:px-8 pt-6 pb-2 border-b border-[#E5E5E8] flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="px-4 lg:px-5 py-1.5 bg-[#F8F8F8] border border-[#E5E5E8] rounded-full">
                        <span className="text-[12px] lg:text-[13px] font-black text-[#110C0C] uppercase tracking-tighter">My Library</span>
                      </div>
                      <span className="text-[11px] lg:text-[12px] text-[#8A8A8A] font-bold uppercase tracking-widest">
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
              <div className="flex-1 flex items-center justify-center text-[#8A8A8A] flex-col gap-6 font-[Inter]">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-purple-50 rounded-[2rem] lg:rounded-[2.5rem] flex items-center justify-center border border-purple-100/50 shadow-inner">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-purple-300 lg:w-[40px] lg:h-[40px]">
                    <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4zM3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" fill="currentColor" fillOpacity="0.3" />
                    <path d="M12 2L15 8L22 9L17 14L18.5 21L12 17L5.5 21L7 14L2 9L9 8L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-center px-6">
                  <p className="text-lg font-black text-[#110C0C] mb-1 uppercase tracking-tighter">No effects yet</p>
                  <p className="text-[13px] font-medium text-gray-400 max-w-[320px]">
                    Bring your images to life on the sidebar.
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
