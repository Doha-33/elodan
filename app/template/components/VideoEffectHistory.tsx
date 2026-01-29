'use client'

import { useState } from 'react'
import { videoEffectService } from '@/lib/services/videoEffect.service'
import { useToast } from '@/components/ui/Toast'
import { Download, Trash2, Play, Loader2, Save, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useConfirm } from '@/components/ui/ConfirmModal'

interface EffectHistoryProps {
  effects: any[]
  onRefresh?: () => void
  onSelectVideo: (video: any) => void
}

export function VideoEffectHistory({ effects, onRefresh, onSelectVideo }: EffectHistoryProps) {
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const { showToast } = useToast()
  const { confirm } = useConfirm()

  const handleSave = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setIsSaving(id)
    try {
      await videoEffectService.saveToGallery(id)
      showToast('Saved to gallery!', 'success')
      onRefresh?.()
    } catch (err: any) {
      showToast(err.message || 'Failed to save', 'error')
    } finally {
      setIsSaving(null)
    }
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const ok = await confirm({
      title: 'Delete Creation',
      message: 'Delete this generation permanently?',
      confirmText: 'Delete',
      confirmStyle: 'danger'
    })

    if (!ok) return

    try {
      await videoEffectService.deleteEffect(id)
      showToast('Deleted', 'success')
      onRefresh?.()
    } catch (err) {
      showToast('Delete failed', 'error')
    }
  }

  return (
    <div className="flex-1 h-full flex flex-col p-6 overflow-y-auto scrollbar-hide font-[Inter]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {effects.map((item) => (
          <div 
            key={item.id} 
            onClick={() => onSelectVideo(item)}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all cursor-pointer border-b-4 border-b-purple-500/0 hover:border-b-purple-500/40"
          >
            {/* Video Preview */}
            <div className="aspect-video relative bg-black overflow-hidden">
              {item.videoUrl ? (
                <>
                  <video 
                    src={item.videoUrl} 
                    className="w-full h-full object-cover"
                    muted
                    loop
                    onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                    onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                       <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                   <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-500 rounded-full animate-spin mb-3" />
                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Processing...</p>
                </div>
              )}
            </div>

            {/* Info Area */}
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-black text-[#110C0C] truncate uppercase tracking-tight">
                    {item.effectScene?.replace(/_/g, ' ') || 'Cinematic Effect'}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">
                    {item.cost} Tokens • {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  disabled={item.isSaved || isSaving === item.id}
                  onClick={(e) => handleSave(e, item.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                    item.isSaved ? "bg-green-50 text-green-600" : "bg-[#110C0C] text-white hover:bg-black"
                  )}
                >
                  {isSaving === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : item.isSaved ? <Check className="w-4 h-4" /> : 'Save'}
                </button>
                <button
                  onClick={(e) => handleDelete(e, item.id)}
                  className="w-11 h-11 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}