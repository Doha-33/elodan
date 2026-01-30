'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
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
  Search,
  MoreHorizontal,
  RotateCcw,
  Loader2,
  Plus,
  History as HistoryIcon,
  Mic2
} from 'lucide-react'
import { GenerateButton } from '@/components/ui/GenerateButton'

export default function VoicePage() {
  const { isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const { confirm } = useConfirm()
  
  // -- State --
  const [text, setText] = useState('')
  const [models, setModels] = useState<any[]>([])
  const [voices, setVoices] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Selection State
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [selectedVoice, setSelectedVoice] = useState<any>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<any>({ code: 'en', name: 'English' })
  
  // UI State
  const [activeModal, setActiveModal] = useState<'model' | 'voice' | 'language' | null>(null)
  const [mobileView, setMobileView] = useState<'editor' | 'history'>('editor')

  // -- Fetch Init --
  useEffect(() => {
    const init = async () => {
      try {
        const m = await voiceService.getModels()
        setModels(m || [])
        if (m?.length > 0) {
          const defaultModel = m.find((i: any) => i.isDefault) || m[0]
          setSelectedModel(defaultModel)
          // Load voices for default model
          const v = await voiceService.getVoices(defaultModel.id || defaultModel._id)
          setVoices(v || [])
          if (v?.length > 0) setSelectedVoice(v[0])
          
          if (defaultModel.supportedLanguages?.length > 0) {
            setSelectedLanguage(defaultModel.supportedLanguages[0])
          }
        }
        if (isAuthenticated) fetchHistory()
      } catch (err) {
        showToast('Failed to load initial data', 'error')
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

  // -- Actions --
  const handleModelSelect = async (model: any) => {
    setSelectedModel(model)
    setActiveModal(null)
    // Update voices for new model
    try {
      const v = await voiceService.getVoices(model.id || model._id)
      setVoices(v || [])
      setSelectedVoice(v?.length > 0 ? v[0] : null)
      if (model.supportedLanguages?.length > 0) {
        setSelectedLanguage(model.supportedLanguages[0])
      }
    } catch (e) {}
  }

  const handleGenerate = async () => {
    if (!text.trim()) return showToast('Please enter some text', 'warning')
    if (!selectedModel) return showToast('Please select an engine', 'warning')

    setIsGenerating(true)
    // Add temp item to history for loading state
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
      const res = await voiceService.generateVoice({
        text: text.trim(),
        modelId: selectedModel._id || selectedModel.id,
        language: selectedLanguage?.code
      })
      
      // Update history
      fetchHistory()
      setText('')
      showToast('Generation successful!', 'success')
    } catch (err: any) {
      showToast(err.message || 'Generation failed', 'error')
      // Remove temp item on fail
      setHistory(prev => prev.filter(i => i._id !== tempId))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: 'Delete Voice',
      message: 'Are you sure you want to delete this generation?',
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
      {/* Mobile Toggle */}
      <div className="lg:hidden flex p-1.5 bg-[#E9E7E7] rounded-2xl mb-4 w-full max-w-[320px] mx-auto shadow-inner">
        <button onClick={() => setMobileView('editor')} className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all", mobileView === 'editor' ? "bg-white text-[#110C0C] shadow-md" : "text-[#8A8A8A]")}>
          <Plus className="w-4 h-4" /> Create
        </button>
        <button onClick={() => setMobileView('history')} className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all", mobileView === 'history' ? "bg-white text-[#110C0C] shadow-md" : "text-[#8A8A8A]")}>
          <HistoryIcon className="w-4 h-4" /> History
        </button>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-180px)] lg:h-[calc(100vh-90px)] bg-[#FEFBFB] overflow-hidden font-[Inter] rounded-[2px] border border-[#F0F0F3] shadow-sm">
        
        {/* Sidebar - Settings */}
        <div className={cn("w-full lg:w-[420px] h-full bg-white border-r border-[#E5E5E8] p-6 flex flex-col overflow-y-auto elegant-scroll lg:block", mobileView === 'editor' ? "block" : "hidden")}>
          <div className="mb-6">
             <div className="px-4 py-2 bg-[#F8F8F8] border border-[#E5E5E8] rounded-full w-fit">
                <span className="text-[12px] font-bold text-[#110C0C]">Text to Speech</span>
             </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[14px] font-semibold text-[#110C0C] mb-2">Text</label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter any text to turn it into natural speech — feel free to specify the tone or mood you want"
                className="w-full h-[180px] p-4 bg-white border border-[#E5E5E8] rounded-2xl text-[14px] leading-relaxed text-[#110C0C] focus:outline-none focus:ring-2 focus:ring-[#110C0C]/5 transition-all resize-none elegant-scroll"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-[14px] font-semibold text-[#110C0C]">Settings</h3>
              
              {/* Model Selector */}
              <div className="space-y-1.5">
                <label className="text-[12px] text-[#8A8A8A] font-medium ml-1">Model</label>
                <button onClick={() => setActiveModal('model')} className="w-full flex items-center justify-between p-4 bg-[#F8F8F8] border border-transparent hover:border-gray-200 rounded-2xl transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-sm overflow-hidden">
                       <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[14px] font-bold text-[#110C0C]">{selectedModel?.name || 'Select Engine'}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8A8A8A] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Voice Selector */}
              <div className="space-y-1.5">
                <label className="text-[12px] text-[#8A8A8A] font-medium ml-1">Voice</label>
                <button onClick={() => setActiveModal('voice')} className="w-full flex items-center justify-between p-4 bg-[#F8F8F8] border border-transparent hover:border-gray-200 rounded-2xl transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-white"><Play className="w-3 h-3 fill-current" /></div>
                      <div className="text-left">
                        <p className="text-[14px] font-bold text-[#110C0C]">{selectedVoice?.name || 'Select Voice'}</p>
                        <p className="text-[10px] text-[#8A8A8A] font-medium uppercase tracking-widest">{selectedVoice?.gender || 'Natural & Warm'}</p>
                      </div>
                   </div>
                   <ChevronRight className="w-4 h-4 text-[#8A8A8A] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Language Selector */}
              <div className="space-y-1.5">
                <label className="text-[12px] text-[#8A8A8A] font-medium ml-1">Language</label>
                <button onClick={() => setActiveModal('language')} className="w-full flex items-center justify-between p-4 bg-[#F8F8F8] border border-transparent hover:border-gray-200 rounded-2xl transition-all group">
                   <span className="text-[14px] font-bold text-[#110C0C]">{selectedLanguage?.name || 'Select Language'}</span>
                   <ChevronRight className="w-4 h-4 text-[#8A8A8A] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <GenerateButton 
              onClick={handleGenerate} 
              isLoading={isGenerating} 
              credits={selectedModel?.creditCostPerSecond ? selectedModel.creditCostPerSecond * 20 : 40} 
              className="w-full h-[58px]" 
            />
          </div>
        </div>

        {/* Main Content - History */}
        <div className={cn("flex-1 bg-white h-full overflow-y-auto elegant-scroll lg:block", mobileView === 'history' ? "block" : "hidden")}>
          <div className="p-8 space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-xl text-gray-400"><Mic2 className="w-5 h-5" /></div>
                <h2 className="text-[18px] font-black text-[#110C0C] uppercase tracking-tight">Audio Library</h2>
              </div>
            </div>

            {history.length === 0 && !isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                 <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mb-6"><Volume2 className="w-10 h-10" /></div>
                 <h3 className="text-[16px] font-bold text-[#110C0C]">Voice Not Found</h3>
                 <p className="text-[13px] text-[#8A8A8A]">Start creating your first voice clip</p>
              </div>
            ) : (
              <div className="space-y-10">
                {history.map((item) => (
                  <AudioHistoryCard key={item._id} item={item} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- MODALS --- */}
        {/* Model Modal */}
        {activeModal === 'model' && (
          <div className="absolute inset-0 z-[100] bg-black/10 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
            <div className="bg-white w-full max-w-[400px] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b flex justify-between items-center">
                <span className="font-bold text-[#110C0C]">Select Engine</span>
                <button onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-2 space-y-1 max-h-[450px] overflow-y-auto elegant-scroll">
                {models.map((m) => (
                  <button 
                    key={m._id} 
                    onClick={() => handleModelSelect(m)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group",
                      selectedModel?._id === m._id ? "bg-purple-50" : "hover:bg-gray-50"
                    )}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center overflow-hidden">
                       {/* Placeholder for model banner/logo from design */}
                       <div className="text-[12px] font-black text-purple-600">{m.name.split(' ')[0]}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-[#110C0C]">{m.name}</p>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{m.description}</p>
                    </div>
                    {selectedModel?._id === m._id && <Check className="w-4 h-4 text-purple-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Voices Modal */}
        {activeModal === 'voice' && (
          <div className="absolute inset-0 z-[100] bg-black/10 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
            <div className="bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b flex justify-between items-center">
                <span className="font-bold text-[#110C0C]">Voices</span>
                <button onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto elegant-scroll">
                {voices.map((v) => (
                  <button 
                    key={v.voiceId} 
                    onClick={() => { setSelectedVoice(v); setActiveModal(null); }}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left",
                      selectedVoice?.voiceId === v.voiceId ? "border-purple-600 bg-purple-50" : "border-gray-50 bg-[#FBFBFB] hover:border-gray-200"
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                      <Play className="w-3 h-3 fill-gray-400 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[#110C0C] truncate">{v.name}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{v.gender || 'Natural'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Language Modal */}
        {activeModal === 'language' && (
          <div className="absolute inset-0 z-[100] bg-black/10 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveModal(null)}>
            <div className="bg-white w-full max-w-[450px] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b flex justify-between items-center">
                <span className="font-bold text-[#110C0C]">Select Language</span>
                <button onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2 max-h-[450px] overflow-y-auto elegant-scroll">
                {selectedModel?.supportedLanguages?.map((lang: any) => (
                  <button 
                    key={lang.code} 
                    onClick={() => { setSelectedLanguage(lang); setActiveModal(null); }}
                    className={cn(
                      "px-5 py-4 rounded-xl border transition-all text-left font-bold text-[13px]",
                      selectedLanguage?.code === lang.code ? "bg-[#110C0C] text-white" : "bg-gray-50 hover:bg-gray-100 text-[#110C0C]"
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
  const [duration, setDuration] = useState(0)
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-4">
         <div className="px-5 py-1.5 bg-[#F8F8F8] border border-[#E5E5E8] rounded-full text-[12px] font-bold text-[#110C0C]">
            Text to Speech
         </div>
         <span className="text-[12px] text-gray-400 font-bold">{new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>

      <div className="bg-white rounded-[32px] border border-[#E5E5E8] overflow-hidden group shadow-sm hover:shadow-md transition-all">
         <div className="p-8">
            <div className="flex items-start justify-between gap-8 mb-8">
               <p className="text-[15px] font-bold text-[#110C0C] leading-relaxed flex-1 line-clamp-2">{item.text}</p>
               <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase text-gray-500 tracking-widest">{item.modelId?.name || 'Neural Engine'}</span>
                  <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase text-gray-500 tracking-widest">{item.duration ? `${item.duration}s` : 'Auto'}</span>
                  <span className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-black uppercase text-gray-500 tracking-widest">{item.language || 'English'}</span>
               </div>
            </div>

            <div className="relative h-[160px] bg-[#F9F9FB] rounded-2xl flex flex-col items-center justify-center p-6 border border-[#F0F0F3] overflow-hidden">
               {isProcessing ? (
                 <>
                   <div className="relative w-16 h-16 flex items-center justify-center mb-4">
                      <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
                      <div className="absolute inset-0 border-4 border-[#110C0C] border-t-transparent rounded-full animate-spin" />
                      <Volume2 className="w-6 h-6 text-[#110C0C]" />
                   </div>
                   <h4 className="text-[14px] font-bold text-[#110C0C]">Generating your voice</h4>
                   <p className="text-[11px] text-gray-400 mt-1">Voice will be ready in a few seconds</p>
                 </>
               ) : (
                 <>
                   <div className="flex items-center gap-10 z-10">
                      <button onClick={() => { if(audioRef.current) audioRef.current.currentTime -= 10 }} className="p-2 text-gray-400 hover:text-[#110C0C] transition-colors"><RotateCcw className="w-5 h-5 -scale-x-100" /></button>
                      <button onClick={togglePlay} className="w-14 h-14 bg-[#110C0C] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                      </button>
                      <button onClick={() => { if(audioRef.current) audioRef.current.currentTime += 10 }} className="p-2 text-gray-400 hover:text-[#110C0C] transition-colors"><RotateCcw className="w-5 h-5" /></button>
                   </div>
                   
                   <div className="w-full mt-6 flex items-center gap-4">
                      <span className="text-[11px] font-bold text-gray-400 tabular-nums min-w-[35px]">{formatTime(audioRef.current?.currentTime || 0)}</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden relative group/progress cursor-pointer">
                         <div className="h-full bg-[#110C0C] transition-all duration-100" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-[11px] font-bold text-gray-400 tabular-nums min-w-[35px]">{formatTime(audioRef.current?.duration || 0)}</span>
                   </div>
                   <audio 
                    ref={audioRef} 
                    src={item.audioUrl} 
                    onTimeUpdate={handleTimeUpdate} 
                    onEnded={() => setIsPlaying(false)} 
                    onLoadedMetadata={(e) => setDuration((e.target as any).duration)}
                    className="hidden" 
                   />
                 </>
               )}
            </div>

            <div className="flex items-center gap-3 mt-6">
               <button onClick={togglePlay} disabled={isProcessing} className="flex-1 h-[52px] bg-white border border-[#E5E5E8] rounded-xl flex items-center justify-center gap-2 text-[14px] font-bold text-[#110C0C] hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50">
                  <Play className="w-4 h-4 fill-current" /> Regenerate
               </button>
               <button onClick={() => onDelete(item._id)} className="h-[52px] w-[52px] bg-white border border-[#E5E5E8] rounded-xl flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all">
                  <Trash2 className="w-5 h-5" />
               </button>
               <button onClick={() => window.open(item.audioUrl)} disabled={isProcessing} className="h-[52px] w-[52px] bg-white border border-[#E5E5E8] rounded-xl flex items-center justify-center text-[#110C0C] hover:bg-gray-50 transition-all">
                  <Download className="w-5 h-5" />
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}
