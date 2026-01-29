'use client'

import { useState } from 'react'
import { Video as VideoIcon, Download, Trash2, X, Maximize2, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VideoCardProps {
  videoUrl?: string
  thumbnail?: string
  duration?: string
  isPlaceholder?: boolean
  isLoading?: boolean
  prompt?: string
}

export function VideoCard({ videoUrl, thumbnail, duration, isPlaceholder = false, isLoading = false, prompt }: VideoCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleDownload = async () => {
    if (!videoUrl) return
    const a = document.createElement('a')
    a.href = videoUrl
    a.download = `elodan-video-${Date.now()}.mp4`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  if (isPlaceholder || isLoading) {
    return (
      <div className="w-full aspect-video bg-[#F1F1F1] border border-[#E5E5E8] rounded-[24px] flex flex-col items-center justify-center gap-4 p-6 relative overflow-hidden group">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[3px] border-[#110C0C]/5 shadow-inner" />
          <div className="bg-white p-3 rounded-full shadow-sm z-10">
            <VideoIcon className="w-6 h-6 text-[#8A8A8A]" />
          </div>
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#110C0C] animate-spin" />
        </div>
        
        <div className="text-center z-10">
          <p className="text-[15px] font-bold text-[#110C0C] tracking-tight">Generate your video</p>
          <p className="text-[12px] text-[#8A8A8A] font-medium opacity-80 mt-1">Video will be ready in a few seconds</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div 
        className="w-full aspect-video bg-black border border-[#E5E5E8] rounded-[24px] overflow-hidden group cursor-pointer relative shadow-sm hover:shadow-lg transition-all duration-300"
        onClick={() => setIsOpen(true)}
      >
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={prompt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <video 
            src={videoUrl}
            className="w-full h-full object-cover"
            muted
            playsInline
            loop
          />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
             <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>
        {duration && (
           <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-[10px] font-bold">
             {duration}
           </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300 backdrop-blur-sm">
          <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-white hover:opacity-70 transition-opacity bg-white/10 rounded-full p-2">
            <X className="w-8 h-8" />
          </button>

          <div className="relative max-w-5xl w-full bg-white rounded-[40px] p-8 overflow-hidden flex flex-col gap-6 animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="flex justify-end items-center gap-3">
              <button onClick={handleDownload} className="w-12 h-12 bg-[#F8F8F8] hover:bg-gray-100 rounded-full flex items-center justify-center transition-all text-[#110C0C]"><Download className="w-5 h-5" /></button>
              <button className="w-12 h-12 bg-[#F8F8F8] hover:bg-red-50 rounded-full flex items-center justify-center transition-all text-[#110C0C] hover:text-red-600"><Trash2 className="w-5 h-5" /></button>
              <button className="w-12 h-12 bg-[#F8F8F8] hover:bg-gray-100 rounded-full flex items-center justify-center transition-all text-[#110C0C]"><Maximize2 className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden rounded-[24px] bg-black border border-[#E5E5E8]">
              <video 
                src={videoUrl} 
                className="max-w-full max-h-[60vh]" 
                controls 
                autoPlay 
                loop
              />
            </div>
            <div className="px-4">
              <p className="text-[16px] text-[#110C0C] font-bold leading-relaxed">{prompt}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
