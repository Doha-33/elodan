'use client'

import { VideoCard } from './VideoCard'
import { RefreshCw, Trash2, Clock } from 'lucide-react'

interface VideoHistoryProps {
  generations: any[]
  onRegenerate?: (gen: any) => void
  onDelete?: (id: string) => void
}

export function VideoHistory({ generations, onRegenerate, onDelete }: VideoHistoryProps) {
  return (
    <div className="h-full overflow-y-auto p-8 font-[Inter] space-y-16 scroll-smooth elegant-scroll">
      {generations.map((gen: any) => (
        <div key={gen.id} className="animate-in fade-in slide-in-from-bottom-6 duration-500">
          {/* Header Row */}
          <div className="flex items-center gap-4 mb-6">
            <div className="px-6 py-2 bg-[#F8F8F8] border border-[#E5E5E8] rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#110C0C]/10" />
              <span className="text-[13px] font-bold text-[#110C0C]">
                {gen.type === 'text-to-video' ? "Text to Video" : "Image to Video"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#8A8A8A] opacity-60">
              <Clock className="w-3.5 h-3.5" />
              {gen.date}
            </div>
          </div>

          {/* Prompt and Badges */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-10 mb-5">
              <p className="text-[15px] text-[#110C0C] font-bold flex-1 leading-relaxed tracking-tight">
                {gen.prompt}
              </p>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="px-3 py-1.5 bg-white border border-[#E5E5E8] rounded-xl text-[11px] text-[#110C0C] ">
                  {gen.model}
                </span>
                <span className="px-3 py-1.5 bg-white border border-[#E5E5E8] rounded-xl text-[11px] text-[#110C0C]">
                  {gen.duration}
                </span>
                <span className="px-3 py-1.5 bg-white border border-[#E5E5E8] rounded-xl text-[11px] text-[#110C0C] flex items-center gap-2">
                  <div className="w-3 h-2 border border-[#110C0C] rounded-sm opacity-40" /> {gen.ratio}
                </span>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <VideoCard 
              videoUrl={gen.videoUrl}
              thumbnail={gen.thumbnail}
              isLoading={gen.isLoading}
              duration={gen.duration}
              prompt={gen.prompt}
            />
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onRegenerate?.(gen)}
              disabled={gen.isLoading}
              className="flex items-center gap-2.5 px-6 py-3 bg-white border border-[#E5E5E8] rounded-[14px] text-[14px] font-bold text-[#110C0C] hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 opacity-60 ${gen.isLoading ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
            <button 
              onClick={() => onDelete?.(gen.id)}
              disabled={gen.isLoading}
              className="flex items-center gap-2.5 px-6 py-3 bg-white border border-[#E5E5E8] rounded-[14px] text-[14px] font-bold text-[#110C0C] hover:bg-red-50 hover:text-[#711013] transition-all shadow-sm active:scale-95 disabled:opacity-50 group"
            >
              <Trash2 className="w-4 h-4 opacity-60 group-hover:text-red-500" />
              Delete
            </button>
          </div>
        </div>
      ))}
      <div className="h-10" />
    </div>
  )
}
