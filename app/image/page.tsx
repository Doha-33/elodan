'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import PageLayout from '@/components/PageLayout'
import { ImageSettings } from './components/ImageSettings'
import { GenerationHistory } from './components/GenerationHistory'
import { imageService } from '@/lib/services/image.service'
import { useAuth } from '@/hooks/useAuth'
import { useConfirm } from '@/components/ui/ConfirmModal'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import { Image as ImageIcon, Plus, History } from 'lucide-react'

export default function ImagePage() {
  const [activeTab, setActiveTab] = useState('text-to-image')
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pendingGen, setPendingGen] = useState<any>(null)
  const [mobileView, setMobileView] = useState<'editor' | 'history'>('editor')
  
  const { isAuthenticated } = useAuth()
  const { confirm } = useConfirm()
  const { showToast } = useToast()

  const fetchHistory = useCallback(async (showFullLoader = true) => {
    if (!isAuthenticated) return
    if (showFullLoader) setIsLoading(true)
    try {
      const res = await imageService.getHistory()
      const data = res.data || []
      
      const transformed = data.map((item: any) => ({
        id: item._id,
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { 
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
        }) : 'Unknown date',
        prompt: item.prompt,
        model: item.modelId?.name || "Neural Engine",
        style: item.style || "Cinematic",
        ratio: item.aspectRatio || "1:1",
        images: [item.previewUrl],
        type: item.generationType || 'text-to-image',
        raw: item 
      }))
      
      setHistory(transformed)
    } catch (err) {
      console.error("Failed to load image history", err)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleGenerateStart = (data: any) => {
    setPendingGen({
      id: 'pending-' + Date.now(),
      isLoading: true,
      prompt: data.prompt || "Generating your vision...",
      type: data.type,
      date: 'Just now',
      model: 'AI Engine',
      style: 'Processing',
      ratio: data.aspectRatio || '1:1',
      images: []
    })
    // تلقائياً انتقل للهيستوري في الموبايل لمتابعة التوليد
    if (window.innerWidth < 1024) setMobileView('history')
  }

  const handleGenerated = () => {
    setPendingGen(null)
    fetchHistory(false)
  }

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: 'Delete Images',
      message: 'Are you sure you want to delete these images?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmStyle: 'danger',
      icon: 'delete'
    })

    if (!ok) return

    try {
      await imageService.deleteGeneration(id)
      showToast('Deleted successfully', 'success')
      fetchHistory(false)
    } catch (e) {
      showToast('Failed to delete', 'error')
    }
  }

  const handleRegenerate = async (gen: any) => {
    setHistory(prev => prev.map(item => item.id === gen.id ? { ...item, isLoading: true } : item))
    try {
      await imageService.generateImage({
        prompt: gen.prompt,
        modelId: gen.raw?.modelId?._id || gen.raw?.modelId,
        aspectRatio: gen.ratio,
        generationType: gen.type
      })
      showToast('Regeneration started...', 'info')
      setTimeout(() => fetchHistory(false), 5000)
    } catch (e: any) {
      showToast(e.message || 'Regeneration failed', 'error')
      setHistory(prev => prev.map(item => item.id === gen.id ? { ...item, isLoading: false } : item))
    }
  }

  const filteredHistory = useMemo(() => {
    const list = history.filter(item => item.type === activeTab)
    if (pendingGen && pendingGen.type === activeTab) {
      return [pendingGen, ...list]
    }
    return list
  }, [history, activeTab, pendingGen])

  return (
    <PageLayout>
      {/* Mobile View Toggle */}
      <div className="lg:hidden flex p-1.5 bg-[#E9E7E7] rounded-2xl mb-4 w-full max-w-[320px] mx-auto shadow-inner">
        <button 
          onClick={() => setMobileView('editor')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all",
            mobileView === 'editor' ? "bg-white text-[#110C0C] shadow-md" : "text-[#8A8A8A]"
          )}
        >
          <Plus className="w-4 h-4" /> Create
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

      <div className="flex flex-col lg:flex-row h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)] bg-[#FEFBFB] overflow-hidden font-[Inter] rounded-[32px] border border-[#F0F0F3] shadow-sm">
        <div className={cn(
          "h-full lg:block", 
          mobileView === 'editor' ? "block w-full lg:w-auto" : "hidden"
        )}>
          <ImageSettings 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            onGenerated={handleGenerated}
            onGenerateStart={handleGenerateStart}
          />
        </div>

        <div className={cn(
          "flex-1 flex flex-col min-w-0 bg-white h-full lg:flex",
          mobileView === 'history' ? "flex w-full" : "hidden"
        )}>
          <div className="px-6 lg:px-10 pt-8 pb-4 border-b border-[#F0F0F3] flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-5">
              <div className="px-4 lg:px-6 py-2 bg-[#F8F8F8] border border-[#E5E5E8] rounded-full">
                <span className="text-[12px] lg:text-[14px] text-[#110C0C]">
                  {activeTab === 'text-to-image' ? "Text to Image" : "Image to Image"}
                </span>
              </div>
              <span className="text-[11px] lg:text-[12px] text-[#8A8A8A] tracking-tighter opacity-40">
                {filteredHistory.length} creations
              </span>
            </div>
          </div>

          <div className="flex-1 min-h-0 relative bg-white">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#110C0C]/10 border-t-[#110C0C] rounded-full animate-spin" />
              </div>
            ) : filteredHistory.length > 0 ? (
              <GenerationHistory 
                generations={filteredHistory} 
                onDelete={handleDelete}
                onRegenerate={handleRegenerate}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-[#8A8A8A] gap-6 lg:gap-8">
                <div className="w-20 h-20 lg:w-28 lg:h-28 bg-gray-50 rounded-[2.5rem] lg:rounded-[3rem] flex items-center justify-center border border-gray-100 shadow-inner">
                  <ImageIcon className="w-8 h-8 lg:w-12 lg:h-12 text-gray-200" />
                </div>
                <div className="text-center space-y-2 px-4">
                  <h3 className="text-[18px] lg:text-[20px] font-black text-[#110C0C] uppercase tracking-tighter">Empty Gallery</h3>
                  <p className="text-[13px] lg:text-[14px] font-medium max-w-[320px] leading-relaxed opacity-60">
                    You haven't generated any {activeTab.replace('-', ' ')} yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
