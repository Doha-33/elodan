'use client'

import { useState } from 'react'
import { X, Download, Save, Trash2, Check, Loader2 } from 'lucide-react'
import { videoEffectService } from '@/lib/services/videoEffect.service'
import { useToast } from '@/components/ui/Toast'
import { useConfirm } from '@/components/ui/ConfirmModal'
import { cn } from '@/lib/utils'

interface VideoLightboxProps {
  video: any
  onClose: () => void
  onRefresh: () => void
}

export function VideoLightbox({ video, onClose, onRefresh }: VideoLightboxProps) {
  const [isSaving, setIsSaving] = useState(false)
  const { showToast } = useToast()
  const { confirm } = useConfirm()

  const handleDownload = async () => {
    try {
      const response = await fetch(video.videoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `elodan-effect-${video.id}.mp4`
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      showToast('Download failed', 'error')
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await videoEffectService.saveToGallery(video.id)
      showToast('Saved to gallery!', 'success')
      onRefresh()
    } catch (err: any) {
      showToast(err.message || 'Failed to save', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Delete Creation',
      message: 'Are you sure you want to delete this? This action is permanent.',
      confirmText: 'Delete',
      confirmStyle: 'danger'
    })

    if (!ok) return

    try {
      await videoEffectService.deleteEffect(video.id)
      showToast('Deleted', 'success')
      onRefresh()
      onClose()
    } catch (err) {
      showToast('Delete failed', 'error')
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-300 font-[Inter]">
      {/* Top Bar */}
      <div className="absolute top-0 inset-x-0 p-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden">
            <img src={video.inputImageUrl} className="w-full h-full object-cover" alt="Source" />
          </div>
          <div>
            <h2 className="text-white text-[16px] font-black uppercase tracking-tight">
              {video.effectScene?.replace(/_/g, ' ') || 'Cinematic Effect'}
            </h2>
            <p className="text-white/50 text-[12px] font-bold uppercase tracking-widest">
              {video.cost} Tokens • {new Date(video.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all border border-white/10 active:scale-90"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Video Container */}
      <div className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(168,85,247,0.2)] bg-black animate-in zoom-in-95 duration-500">
        <video 
          src={video.videoUrl} 
          className="w-full h-full object-contain"
          autoPlay
          loop
          controls
          playsInline
        />
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-500">
        <button
          onClick={handleDownload}
          className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black uppercase tracking-widest text-[12px] border border-white/10 transition-all active:scale-95"
        >
          <Download className="w-5 h-5" />
          Download
        </button>

        <button
          disabled={video.isSaved || isSaving}
          onClick={handleSave}
          className={cn(
            "flex items-center gap-3 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[12px] transition-all active:scale-95 shadow-xl",
            video.isSaved 
              ? "bg-green-500 text-white" 
              : "bg-purple-600 hover:bg-purple-500 text-white"
          )}
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : video.isSaved ? (
            <><Check className="w-5 h-5" /> Saved to Gallery</>
          ) : (
            <><Save className="w-5 h-5" /> Save to Gallery</>
          )}
        </button>

        <button
          onClick={handleDelete}
          className="w-[56px] h-[56px] flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl border border-red-500/20 transition-all active:scale-95"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}