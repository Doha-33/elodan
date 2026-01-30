'use client'

import React, { useState, useEffect, useRef } from 'react'
import PageLayout from '@/components/PageLayout'
import { voiceService } from '@/lib/services/voice.service'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'
import { useConfirm } from '@/components/ui/ConfirmModal'
import { cn } from '@/lib/utils'
import { 
  Play, 
  Pause, 
  Download, 
  Trash2, 
  ChevronRight, 
  X, 
  Check, 
  Volume2, 
  Sparkles,
  RotateCcw,
  Mic2,
  Plus,
  History as HistoryIcon
} from 'lucide-react'
import { GenerateButton } from '@/components/ui/GenerateButton'

export default function VoicePage() {
  const { isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const { confirm } = useConfirm()
  
  const [text, setText] = useState('')
  const [models, setModels] = useState<any[]>([])
  const [voices, setVoices] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [selectedVoice, setSelectedVoice] = useState<any>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<any>({ code: 'en', name: 'English' })
  const [activeModal, setActiveModal] = useState<'model' | 'voice' | 'language' | null>(null)
  const [mobileView, setMobileView] = useState<'editor' | 'history'>('editor')

  useEffect(() => {
    const init = async () => {
      try {
        const m = await voiceService.getModels()
        setModels(m || [])
        if (m?.length > 0) {
          const defaultModel = m.find((i: any) => i.isDefault) || m[0]
          setSelectedModel(defaultModel)
          const v = await voiceService.getVoices(defaultModel._id || defaultModel.id)
          setVoices(v || [])
          if (v?.length > 0) setSelectedVoice(v[0])
          if (defaultModel.supportedLanguages?.length > 0) {
            setSelectedLanguage(defaultModel.supportedLanguages[0])
          }
        }
        if (isAuthenticated) fetchHistory()
      } catch (err) {
        showToast('Failed to load engines', 'error')
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [isAuthenticated])

  const fetchHistory = async () => {
    try {
      const h = await voiceService.getHistory(1, 20)
      setHistory(h || [])
    } catch (e) {}
  }

  const handleModelSelect = async (model: any) => {
    setSelectedModel(model)
    setActiveModal(null)
    try {
      const v = await voiceService.getVoices(model._id || model.id)
      setVoices(v || [])
      setSelectedVoice(v?.length > 0 ? v[0] : null)
      if (model.supportedLanguages?.length > 0) {
        setSelectedLanguage(model.supportedLanguages[0])
      }
    } catch (e) {}
  }

  const handleGenerate = async () => {
    if (!text.trim()) return showToast('Please enter text to speak', 'warning')
    if (!selectedModel) return showToast('Select an engine first', 'warning')

    setIsGenerating(true)
    const tempId = 'temp-' + Date.now()
    setHistory(prev => [{
      _id: tempId,
      text: text,
      status: 'processing',
      createdAt: new Date().toISOString(),
      modelId: selectedModel,
      voiceId: selectedVoice
    }, ...prev])

    if (window.innerWidth < 1024) setMobileView('history')

    try {
      await voiceService.generateVoice({
        text: text.trim(),
        modelId: selectedModel._id || selectedModel.id,
        voiceId: selectedVoice?.voiceId,
        language: selectedLanguage?.code
      })
      fetchHistory()
      setText('')
      showToast('Generation complete!', 'success')
    } catch (err: any) {
      showToast(err.message || 'Generation failed', 'error')
      setHistory(prev => prev.filter(i => i._id !== tempId))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: 'Delete Voice Clip',
      message: 'This will permanently remove this clip from your library.',
      confirmText: 'Delete',
      confirmStyle: 'danger'
    })
    if (!ok) return
    try {
      await voiceService.deleteGeneration(id)
      setHistory(prev => prev.filter(i => i._id !== id))
      showToast('Deleted', 'success')
    } catch (e) {
      showToast('Delete failed', 'error')
    }
  }

  return (
    <PageLayout>
      <div className="lg:hidden flex p-1.5 bg-[#E9E7E7] rounded-2xl mb-4 w-full max-w-[320px] mx-auto shadow-inner font-[Inter]">
        <button onClick={() => setMobileView('editor')} className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all", mobileView === 'editor' ? "bg-white text-[#110C0C] shadow-md" : "text-[#8A8A8A]")}>
          <Plus className="w-4 h-4" /> Create
        </button>
        <button onClick={() => setMobileView('history')} className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all", mobileView === 'history' ? "bg-white text-[#110C0C] shadow-md" : "text-[#8A8A8A]")}>
          <HistoryIcon className="w-4 h-4" /> Library
        </button>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-180px)] lg:h-[calc(100vh-90px)] bg-[#FEFBFB] overflow-hidden rounded-[2px] border border-[#F0F0F3] shadow-sm relative font-[Inter]">
        
        {/* Sidebar Settings */}
        <div className={cn("w-full lg:w-[420px] h-full bg-white border-r border-[#E5E5E8] p-6 flex flex-col overflow-y-auto elegant-scroll", mobileView === 'editor' ? "block" : "hidden lg:block")}>
          <div className="mb-6">
             <div className="px-4 py-2 bg-[#F8F8F8] border border-[#E5E5E8] rounded-full w-fit">
                <span className="text-[12px] font-bold text-[#110C0C]">Text to Speech</span>
             </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[14px] font-semibold text-[#110C0C]">Input Text</label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type anything you want the AI to say..."
                className="w-full h-[180px] p-4 bg-white border border-[#E5E5E8] rounded-2xl text-[14px] leading-relaxed text-[#110C0C] focus:outline-none focus:ring-2 focus:ring-[#110C0C]/5 transition-all resize-none elegant-scroll"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-[14px] font-semibold text-[#110C0C]">Advanced Settings</h3>
              
              <div className="space-y-1.5">
                <label className="text-[12px] text-[#8A8A8A] font-medium ml-1">AI Engine</label>
                <button onClick={() => setActiveModal('model')} className="w-full flex items-center justify-between p-4 bg-[#F8F8F8] border border-transparent hover:border-gray-200 rounded-2xl transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-[#110C0C] flex items-center justify-center text-white shadow-sm overflow-hidden">
                       <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[14px] font-bold text-[#110C0C] truncate max-w-[200px]">{selectedModel?.name || 'Select Engine'}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8A8A8A] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] text-[#8A8A8A] font-medium ml-1">Voice Profile</label>
                <button onClick={() => setActiveModal('voice')} className="w-full flex items-center justify-between p-4 bg-[#F8F8F8] border border-transparent hover:border-gray-200 rounded-2xl transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-white"><Play className="w-3 h-3 fill-[#110C0C]" /></div>
                      <div className="text-left">
                        <p className="text-[14px] font-bold text-[#110C0C] truncate max-w-[180px]">{selectedVoice?.name || 'Select Voice'}</p>
                        <p className="text-[10px] text-[#8A8A8A] font-medium uppercase tracking-widest">{selectedVoice?.gender || 'Dynamic'}</p>
                      </div>
                   </div>
                   <ChevronRight className="w-4 h-4 text-[#8A8A8A] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] text-[#8A8A8A] font-medium ml-1">Output Language</label>
                <button onClick={() => setActiveModal('language')} className="w-full flex items-center justify-between p-4 bg-[#F8F8F8] border border-transparent hover:border-gray-200 rounded-2xl transition-all group">
                   <span className="text-[14px] font-bold text-[#110C0C]">{selectedLanguage?.name || 'English (US)'}</span>
                   <ChevronRight className="w-4 h-4 text-[#8A8A8A] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <GenerateButton 
              onClick={handleGenerate} 
              isLoading={isGenerating} 
              credits={selectedModel?.creditCostPerSecond ? selectedModel.creditCostPerSecond * 15 : 40} 
              className="w-full h-[58px]" 
            />
          </div>
        </div>

        {/* Main Content History */}
        <div className={cn("flex-1 bg-white h-full overflow-y-auto elegant-scroll", mobileView === 'history' ? "block" : "hidden lg:block")}>
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gray-50 rounded-2xl text-[#110C0C]"><Mic2 className="w-5 h-5" /></div>
                <h2 className="text-[18px] font-black text-[#110C0C] uppercase tracking-tight">Audio Creations</h2>
              </div>
              <span className="text-[12px] text-gray-400 font-bold">{history.length} Clips</span>
            </div>

            {history.length === 0 && !isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center text-center opacity-40">
                 <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center mb-6 shadow-inner"><Volume2 className="w-10 h-10" /></div>
                 <h3 className="text-[18px] font-black text-[#110C0C] uppercase tracking-tighter">No audio found</h3>
                 <p className="text-[13px] font-medium text-[#8A8A8A] max-w-[240px]">Start transforming your words into professional speech clips</p>
              </div>
            ) : (
              <div className="space-y-12 max-w-4xl mx-auto">
                {history.map((item) => (
                  <AudioHistoryCard key={item._id} item={item} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {activeModal === 'model' && (
          <div className="absolute inset-0 z-[100] bg-black/10 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
            <div className="bg-white w-full max-w-[420px] rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div className="p-7 border-b flex justify-between items-center bg-gray-50/50">
                <span className="font-black uppercase tracking-tighter text-[#110C0C]">Select Engine</span>
                <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all"><X className="w-4 h-4 text-[#110C0C]" /></button>
              </div>
              <div className="p-3 space-y-2 max-h-[500px] overflow-y-auto elegant-scroll">
                {models.map((m) => (
                  <button 
                    key={m._id} 
                    onClick={() => handleModelSelect(m)}
                    className={cn(
                      "w-full flex items-center gap-5 p-4 rounded-3xl transition-all text-left group border-2",
                      selectedModel?._id === m._id ? "bg-red-50/30 border-red-100" : "hover:bg-gray-50 border-transparent"
                    )}
                  >
                    <div className="w-16 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-black flex items-center justify-center overflow-hidden shadow-md">
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">{m.name.split(' ')[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-black text-[#110C0C] tracking-tight">{m.name}</p>
                      <p className="text-[11px] text-gray-500 font-medium line-clamp-1">{m.description || 'Standard quality neural speech'}</p>
                    </div>
                    {selectedModel?._id === m._id && <Check className="w-5 h-5 text-red-600" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeModal === 'voice' && (
          <div className="absolute inset-0 z-[100] bg-black/10 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
            <div className="bg-white w-full max-w-[540px] rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div className="p-7 border-b flex justify-between items-center">
                <span className="font-black uppercase tracking-tighter text-[#110C0C]">Voices Library</span>
                <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all"><X className="w-4 h-4 text-[#110C0C]" /></button>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[550px] overflow-y-auto elegant-scroll">
                {voices.map((v) => (
                  <button 
                    key={v.voiceId} 
                    onClick={() => { setSelectedVoice(v); setActiveModal(null); }}
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-[28px] border-2 transition-all text-left group",
                      selectedVoice?.voiceId === v.voiceId ? "border-[#110C0C] bg-[#F8F8F8]" : "border-gray-50 bg-[#FBFBFB] hover:border-gray-200"
                    )}
                  >
                    <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Play className="w-3.5 h-3.5 fill-[#110C0C] text-[#110C0C]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-black text-[#110C0C] tracking-tight">{v.name}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{v.gender || 'Neural'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeModal === 'language' && (
          <div className="absolute inset-0 z-[100] bg-black/10 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
            <div className="bg-white w-full max-w-[480px] rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div className="p-7 border-b flex justify-between items-center">
                <span className="font-black uppercase tracking-tighter text-[#110C0C]">Select Language</span>
                <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all"><X className="w-4 h-4 text-[#110C0C]" /></button>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto elegant-scroll">
                {selectedModel?.supportedLanguages?.map((lang: any) => (
                  <button 
                    key={lang.code} 
                    onClick={() => { setSelectedLanguage(lang); setActiveModal(null); }}
                    className={cn(
                      "px-6 py-4 rounded-2xl border-2 transition-all text-left font-black text-[13px] tracking-tight",
                      selectedLanguage?.code === lang.code ? "bg-[#110C0C] text-white border-[#110C0C]" : "bg-gray-50 hover:bg-gray-100 border-transparent text-[#110C0C]"
                    )}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </PageLayout>
  )
}

function AudioHistoryCard({ item, onDelete }: { item: any, onDelete: (id: string) => void }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const isProcessing = item.status === 'processing'
  
  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.pause()
    else audioRef.current.play()
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setProgress(p)
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-[Inter]">
      <div className="flex items-center gap-4 mb-4">
         <div className="px-5 py-2 bg-[#F8F8F8] border border-[#E5E5E8] rounded-full text-[12px] font-black text-[#110C0C] uppercase tracking-tighter">
            Audio Clip
         </div>
         <span className="text-[12px] text-gray-400 font-black opacity-60">
            {new Date(item.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
         </span>
      </div>

      <div className="bg-white rounded-[40px] border border-[#E5E5E8] overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500">
         <div className="p-8 lg:p-10">
            <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
               <p className="text-[16px] font-black text-[#110C0C] leading-relaxed flex-1 line-clamp-2 tracking-tight">{item.text}</p>
               <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                  <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-500 tracking-widest">{item.modelId?.name || 'Neural AI'}</span>
                  <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase text-gray-500 tracking-widest">{item.language || 'EN'}</span>
               </div>
            </div>

            <div className="relative h-[180px] bg-[#F9F9FB] rounded-[32px] flex flex-col items-center justify-center p-8 border border-[#F0F0F3] overflow-hidden group/player">
               {isProcessing ? (
                 <>
                   <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                      <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                      <div className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                      <Mic2 className="w-6 h-6 text-[#110C0C]" />
                   </div>
                   <h4 className="text-[14px] font-black text-[#110C0C] uppercase tracking-tighter">Generating Voice</h4>
                   <p className="text-[11px] text-gray-400 mt-1 font-bold uppercase tracking-widest">Available in seconds</p>
                 </>
               ) : (
                 <>
                   <div className="flex items-center gap-12 z-10">
                      <button onClick={() => { if(audioRef.current) audioRef.current.currentTime -= 10 }} className="p-2 text-gray-400 hover:text-[#110C0C] transition-colors"><RotateCcw className="w-5 h-5 -scale-x-100" /></button>
                      <button onClick={togglePlay} className="w-16 h-16 bg-[#110C0C] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all">
                        {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
                      </button>
                      <button onClick={() => { if(audioRef.current) audioRef.current.currentTime += 10 }} className="p-2 text-gray-400 hover:text-[#110C0C] transition-colors"><RotateCcw className="w-5 h-5" /></button>
                   </div>
                   
                   <div className="w-full mt-8 flex items-center gap-5 px-4">
                      <span className="text-[11px] font-black text-[#110C0C] tabular-nums min-w-[35px]">{formatTime(audioRef.current?.currentTime || 0)}</span>
                      <div 
                        className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden relative cursor-pointer"
                        onClick={(e) => {
                          if (!audioRef.current) return;
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          audioRef.current.currentTime = (x / rect.width) * audioRef.current.duration;
                        }}
                      >
                         <div className="h-full bg-gradient-to-r from-red-600 to-black transition-all duration-100" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-[11px] font-black text-gray-400 tabular-nums min-w-[35px]">{formatTime(audioRef.current?.duration || 0)}</span>
                   </div>
                   <audio 
                    ref={audioRef} 
                    src={item.audioUrl} 
                    onTimeUpdate={handleTimeUpdate} 
                    onEnded={() => setIsPlaying(false)} 
                    className="hidden" 
                   />
                 </>
               )}
            </div>

            <div className="flex items-center gap-4 mt-8">
               <button onClick={togglePlay} disabled={isProcessing} className="flex-1 h-[56px] bg-white border-2 border-[#E5E5E8] rounded-2xl flex items-center justify-center gap-3 text-[14px] font-black uppercase tracking-widest text-[#110C0C] hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50">
                  <Play className="w-4 h-4 fill-current" /> Regenerate
               </button>
               <button onClick={() => onDelete(item._id)} className="h-[56px] w-[56px] bg-white border-2 border-[#E5E5E8] rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm">
                  <Trash2 className="w-5 h-5" />
               </button>
               <button onClick={() => window.open(item.audioUrl)} disabled={isProcessing} className="h-[56px] w-[56px] bg-white border-2 border-[#E5E5E8] rounded-2xl flex items-center justify-center text-[#110C0C] hover:bg-gray-50 transition-all shadow-sm">
                  <Download className="w-5 h-5" />
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}