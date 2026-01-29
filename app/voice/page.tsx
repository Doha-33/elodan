'use client'

import { useState, useEffect, useRef } from 'react'
import PageLayout from '@/components/PageLayout'
import { voiceService } from '@/lib/services/voice.service'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import { 
  Play, 
  Pause, 
  Download, 
  Save, 
  Trash2, 
  Volume2, 
  Languages, 
  Sparkles, 
  Clock, 
  Headphones,
  Settings2,
  Loader2,
  Check,
  Plus,
  History
} from 'lucide-react'
import { GenerateButton } from '@/components/ui/GenerateButton'
import { useConfirm } from '@/components/ui/ConfirmModal'

export default function VoicePage() {
  const { isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const { confirm } = useConfirm()
  
  const [text, setText] = useState('Elodan is the best ai portal in the world. Experience the future of neural text-to-speech.')
  const [models, setModels] = useState<any[]>([])
  const [voices, setVoices] = useState<any[]>([])
  const [selectedModelId, setSelectedModelId] = useState('')
  const [selectedVoiceId, setSelectedVoiceId] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [isGenerating, setIsGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [isSavingToGallery, setIsSavingToGallery] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<'editor' | 'history'>('editor')
  
  // Fix: Derive selectedModel from models list using selectedModelId for use in JSX
  const selectedModel = models.find(m => (m.id || m._id) === selectedModelId);

  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        const m = await voiceService.getModels();
        setModels(m || []);
        if (m && m.length > 0) {
          const initialModel = m.find((model: any) => model.isDefault) || m[0];
          setSelectedModelId(initialModel.id || initialModel._id);
        }
        if (isAuthenticated) fetchHistory();
      } catch (err) {
        showToast('Failed to load voice engines', 'error');
      }
    };
    init();
  }, [isAuthenticated]);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const h = await voiceService.getHistory(1, 20);
      setHistory(h || []);
    } catch (err) {
      console.error("History load failed", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (selectedModelId) {
      const currentModel = models.find(m => (m.id || m._id) === selectedModelId);
      voiceService.getVoices(selectedModelId).then((v) => {
        setVoices(v || []);
        if (v && v.length > 0) setSelectedVoiceId(v[0].voiceId || v[0].id || v[0]._id);
      }).catch(() => {
        if (currentModel?.supportedVoices) {
          setVoices(currentModel.supportedVoices);
          setSelectedVoiceId(currentModel.supportedVoices[0]?.voiceId || currentModel.supportedVoices[0]?.id);
        }
      });
      if (currentModel?.supportedLanguages) {
        const isLangSupported = currentModel.supportedLanguages.some((l: any) => l.code === selectedLanguage);
        if (!isLangSupported && currentModel.supportedLanguages.length > 0) setSelectedLanguage(currentModel.supportedLanguages[0].code);
      }
    }
  }, [selectedModelId, models]);

  const handleGenerate = async () => {
    if (!isAuthenticated) return showToast('Please sign in', 'warning');
    if (!text.trim() || !selectedModelId) return showToast('Enter text and select engine', 'warning');
    
    setIsGenerating(true);
    try {
      const response = await voiceService.generateVoice({
        text: text.trim(),
        modelId: selectedModelId,
        voiceId: selectedVoiceId || undefined,
        language: selectedLanguage
      });
      const newAudioUrl = response.audioUrl || response.data?.audioUrl;
      if (newAudioUrl) {
        setAudioUrl(newAudioUrl);
        showToast('Speech generated!', 'success');
        if (window.innerWidth < 1024) setMobileView('history');
      }
      fetchHistory();
    } catch (err: any) {
      showToast(err.message || "Generation failed", 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename || 'elodan-voice.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.remove();
    } catch (err) { showToast('Download failed', 'error'); }
  };

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

      <div className="flex flex-col lg:flex-row h-[calc(100vh-160px)] lg:h-[calc(100vh-66px)] bg-[#FEFBFB] overflow-hidden font-[Inter]">
        <div className={cn(
          "w-full lg:w-[400px] bg-white border-r border-[#E5E5E8] flex flex-col p-6 overflow-y-auto elegant-scroll lg:block",
          mobileView === 'editor' ? "block h-full" : "hidden"
        )}>
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg">
                <Volume2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black text-[#110C0C] tracking-tight uppercase">Voice Studio</h1>
                <p className="text-[10px] text-[#8A8A8A] font-black uppercase tracking-widest">Neural TTS Engine</p>
              </div>
            </div>
          </header>

          <div className="space-y-6 flex-1">
            <div>
              <label className="flex items-center gap-2 text-[11px] font-black text-[#110C0C] mb-3 uppercase tracking-widest opacity-70">
                <Settings2 className="w-3.5 h-3.5 text-pink-500" />
                Select Engine
              </label>
              <div className="space-y-2">
                {models.map(m => (
                  <button key={m.id || m._id} disabled={m.isLocked} onClick={() => setSelectedModelId(m.id || m._id)} className={cn("w-full flex items-center justify-between p-3 lg:p-4 rounded-2xl border-2 transition-all text-left group", selectedModelId === (m.id || m._id) ? "border-pink-500 bg-pink-50/20 shadow-sm" : "border-[#F8F8F8] bg-[#F8F8F8] hover:border-gray-200")}>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-[13px] lg:text-[14px] font-black tracking-tight", selectedModelId === (m.id || m._id) ? "text-[#110C0C]" : "text-[#514647]")}>{m.name}</p>
                      <p className="text-[9px] lg:text-[10px] text-[#8A8A8A] uppercase font-bold tracking-tight">{m.provider}</p>
                    </div>
                    {selectedModelId === (m.id || m._id) && <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-md"><Check className="w-3 h-3" strokeWidth={4} /></div>}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-[#8A8A8A] mb-2 uppercase tracking-widest">Language</label>
                <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} className="w-full h-11 px-3 bg-[#F8F8F8] border-2 border-transparent rounded-2xl text-[12px] font-bold text-[#110C0C] focus:outline-none appearance-none transition-all shadow-inner">
                  {selectedModel?.supportedLanguages?.map((l: any) => <option key={l.code} value={l.code}>{l.name}</option>) || <option value="en">English</option>}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#8A8A8A] mb-2 uppercase tracking-widest">Voice Profile</label>
                <select value={selectedVoiceId} onChange={(e) => setSelectedVoiceId(e.target.value)} className="w-full h-11 px-3 bg-[#F8F8F8] border-2 border-transparent rounded-2xl text-[12px] font-bold text-[#110C0C] focus:outline-none appearance-none transition-all shadow-inner">
                  {voices.map(v => <option key={v.voiceId || v.id} value={v.voiceId || v.id}>{v.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-[11px] font-black text-[#110C0C] mb-3 uppercase tracking-widest opacity-70">Script Content</label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-32 lg:h-44 p-4 bg-[#F8F8F8] border-2 border-transparent rounded-3xl text-[14px] leading-relaxed text-[#110C0C] focus:outline-none focus:border-pink-500/30 focus:bg-white transition-all resize-none shadow-inner scrollbar-hide" placeholder="Share your thoughts!" />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E5E5E8]">
            <GenerateButton onClick={handleGenerate} isLoading={isGenerating} credits={selectedModel?.creditCostPerSecond || 5} className="w-full h-[58px] lg:h-[60px] rounded-3xl shadow-xl transition-all" />
          </div>
        </div>

        <div className={cn(
          "flex-1 flex flex-col bg-[#FDFDFD] relative overflow-hidden lg:flex",
          mobileView === 'history' ? "flex h-full w-full" : "hidden"
        )}>
          <div className="h-auto lg:h-[42%] flex flex-col items-center justify-center p-6 lg:p-8 border-b border-[#E5E5E8] bg-gradient-to-b from-white to-[#FEFBFB]">
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] p-6 lg:p-10 shadow-lg border border-pink-100/50 flex flex-col items-center relative overflow-hidden">
               {/* Player Content Here - same as previous version but responsive padding */}
               {audioUrl && (
                  <div className="flex flex-col items-center gap-6 w-full z-10">
                    <button onClick={togglePlay} className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#110C0C] flex items-center justify-center text-white shadow-2xl transition-all">
                      {isPlaying ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white ml-1.5" />}
                    </button>
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleDownload(audioUrl, 'voice.mp3')} className="px-4 py-2 bg-pink-50 text-pink-600 font-black uppercase text-[10px] rounded-xl">Download</button>
                      <button className="px-4 py-2 bg-gray-50 text-gray-700 font-black uppercase text-[10px] rounded-xl">Save</button>
                    </div>
                  </div>
               )}
               <audio ref={audioRef} src={audioUrl || ''} onEnded={() => setIsPlaying(false)} className="hidden" />
            </div>
          </div>

          <div className="flex-1 flex flex-col p-6 lg:p-10 overflow-hidden">
            <header className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-xl"><Clock className="w-4 h-4 text-gray-400" /></div>
                <h2 className="text-[14px] lg:text-[16px] font-black text-[#110C0C] uppercase tracking-tight">Clip History</h2>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto space-y-4 elegant-scroll">
              {isLoadingHistory ? <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-pink-500" /></div> : history.map(item => (
                <div key={item.id || item._id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all">
                  <button onClick={() => { setAudioUrl(item.audioUrl); setText(item.text); }} className="w-10 h-10 rounded-xl bg-[#F8F8F8] flex items-center justify-center text-[#110C0C]"><Play className="w-4 h-4 fill-current" /></button>
                  <div className="flex-1 min-w-0"><p className="text-[13px] font-bold text-[#110C0C] truncate leading-tight">{item.text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
