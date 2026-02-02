
"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Download, 
  Trash2, 
  RotateCcw, 
  Mic2,
  AlertCircle,
  Clock,
  FastForward,
  Rewind
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceCardProps {
  item: any;
  onDelete: (id: string) => void;
  onRegenerate: (item: any) => void;
}

export function VoiceCard({ item, onDelete, onRegenerate }: VoiceCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const isFailed = item.status === 'failed';
  const isProcessing = item.status === 'processing' || (!item.audioUrl && !isFailed);
  const audioSrc = item.audioUrl;

  const togglePlay = () => {
    if (!audioRef.current || isProcessing || isFailed) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const seek = (amount: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += amount;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 font-[Inter]">
      {/* Header Info */}
      <div className="flex items-center gap-4 mb-3">
         <div className="px-4 py-1.5 bg-white border border-[#E5E5E8] rounded-full flex items-center gap-2 shadow-sm">
            <div className={cn("w-2 h-2 rounded-full", isFailed ? "bg-red-500" : isProcessing ? "bg-amber-500 animate-pulse" : "bg-green-500")} />
            <span className="text-[11px] font-black text-[#110C0C] uppercase tracking-tighter">
              {isFailed ? "Failed" : isProcessing ? "Processing" : "Audio Ready"}
            </span>
         </div>
         <span className="text-[12px] text-gray-400 font-bold opacity-60">
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) : 'Recently'}
         </span>
      </div>

      <div className="bg-white rounded-[32px] border border-[#E5E5E8] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
         <div className="p-6 md:p-8">
            {/* Content Meta */}
            <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-6">
               <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-[#110C0C] leading-relaxed line-clamp-2 tracking-tight mb-2">
                    {item.text}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#F5F5F5] rounded-lg text-[10px] font-black uppercase text-[#8A8A8A] border border-transparent">
                      {item.modelId?.name || "Standard AI"}
                    </span>
                    <span className="px-2.5 py-1 bg-[#F5F5F5] rounded-lg text-[10px] font-black uppercase text-[#8A8A8A] border border-transparent">
                      {item.language?.toUpperCase() || "EN"}
                    </span>
                  </div>
               </div>
               
               <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F8F8] rounded-xl border border-[#E5E5E8]">
                  <img src="/assets/icons/ui/coin.svg" className="w-3.5 h-3.5" alt="cost" />
                  <span className="text-[12px] font-black text-[#110C0C]">{item.cost || 0}</span>
               </div>
            </div>

            {/* Specialized Audio Player UI */}
            <div className={cn(
              "relative h-[140px] rounded-[24px] border transition-all duration-500 overflow-hidden flex flex-col items-center justify-center p-6",
              isFailed ? "bg-red-50/50 border-red-100" : "bg-[#F9F9FB] border-[#F0F0F3]"
            )}>
               {isFailed ? (
                 <div className="flex flex-col items-center text-center gap-2">
                    <AlertCircle className="w-8 h-8 text-red-500 mb-1" />
                    <p className="text-[13px] font-bold text-red-600">Generation Failed</p>
                    <p className="text-[11px] text-red-400 font-medium max-w-[240px] line-clamp-1">{item.errorMessage || "Unknown provider error"}</p>
                 </div>
               ) : isProcessing ? (
                 <div className="flex flex-col items-center gap-4">
                   <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full animate-spin" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="32" stroke="#E5E5E8" strokeWidth="4" fill="none" />
                        <circle cx="40" cy="40" r="32" stroke="#110C0C" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="60 140" />
                      </svg>
                      <Mic2 className="w-5 h-5 text-[#110C0C]" />
                   </div>
                   <div className="text-center">
                      <h4 className="text-[13px] font-black text-[#110C0C] uppercase tracking-tighter">Synthesizing Voice</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Neural processing...</p>
                   </div>
                 </div>
               ) : (
                 <>
                   {/* Controls */}
                   <div className="flex items-center gap-8 z-10 mb-4">
                      <button onClick={() => seek(-5)} className="p-2 text-gray-400 hover:text-[#110C0C] transition-colors active:scale-90">
                        <Rewind className="w-5 h-5 fill-current" />
                      </button>
                      
                      <button 
                        onClick={togglePlay} 
                        className="w-14 h-14 bg-[#110C0C] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all group/btn"
                      >
                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                      </button>

                      <button onClick={() => seek(5)} className="p-2 text-gray-400 hover:text-[#110C0C] transition-colors active:scale-90">
                        <FastForward className="w-5 h-5 fill-current" />
                      </button>
                   </div>
                   
                   {/* Progress Slider */}
                   <div className="w-full flex items-center gap-4 px-2">
                      <span className="text-[11px] font-black text-[#110C0C] tabular-nums min-w-[35px]">
                        {formatTime(currentTime)}
                      </span>
                      <div 
                        className="flex-1 h-1.5 bg-[#E5E5E8] rounded-full overflow-hidden relative cursor-pointer group/bar"
                        onClick={(e) => {
                          if (!audioRef.current) return;
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const targetTime = (x / rect.width) * audioRef.current.duration;
                          audioRef.current.currentTime = targetTime;
                        }}
                      >
                         <div className="h-full bg-[#110C0C] transition-all duration-100 relative" style={{ width: `${progress}%` }}>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#110C0C] rounded-full shadow-md scale-0 group-hover/bar:scale-100 transition-transform" />
                         </div>
                      </div>
                      <span className="text-[11px] font-bold text-gray-400 tabular-nums min-w-[35px] text-right">
                        {formatTime(duration || item.duration || 0)}
                      </span>
                   </div>

                   <audio 
                    ref={audioRef} 
                    src={audioSrc} 
                    onTimeUpdate={handleTimeUpdate} 
                    onLoadedMetadata={onLoadedMetadata}
                    onEnded={() => setIsPlaying(false)} 
                    onPause={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                    className="hidden" 
                   />
                 </>
               )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-3 mt-6">
               <button 
                onClick={() => onRegenerate(item)} 
                disabled={isProcessing}
                className="flex-1 h-[52px] bg-white border border-[#E5E5E8] rounded-[16px] flex items-center justify-center gap-2.5 text-[14px] font-bold text-[#110C0C] hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
               >
                  <RotateCcw className="w-4 h-4 opacity-60" /> 
                  <span className="hidden sm:inline">Regenerate</span>
                  <span className="sm:hidden">Retry</span>
               </button>
               
               <button 
                onClick={() => audioSrc && window.open(audioSrc)} 
                disabled={isProcessing || isFailed}
                className="h-[52px] px-5 bg-white border border-[#E5E5E8] rounded-[16px] flex items-center justify-center text-[#110C0C] hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-30"
               >
                  <Download className="w-5 h-5" />
               </button>

               <button 
                onClick={() => onDelete(item._id || item.id)} 
                className="h-[52px] px-5 bg-white border border-[#E5E5E8] rounded-[16px] flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm active:scale-95"
               >
                  <Trash2 className="w-5 h-5" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
