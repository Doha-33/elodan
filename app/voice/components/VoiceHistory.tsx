
"use client";

import { VoiceCard } from "./VoiceCard";
import { Mic2, History } from "lucide-react";

interface VoiceHistoryProps {
  history: any[];
  onDelete: (id: string) => void;
  onRegenerate: (item: any) => void;
  isLoading: boolean;
}

export function VoiceHistory({ history, onDelete, onRegenerate, isLoading }: VoiceHistoryProps) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F1F1F1]">
        <div className="w-10 h-10 border-4 border-[#110C0C]/10 border-t-[#110C0C] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F1F1F1] font-[Inter]">
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between bg-[#F1F1F1] z-10">
        <div className="flex items-center gap-5">
          <div className="px-5 py-2 bg-[#F8F8F8] border border-[#E5E5E8] rounded-full shadow-sm">
            <span className="text-[13px] font-black text-[#110C0C] uppercase tracking-tighter flex items-center gap-2">
              <History className="w-4 h-4 opacity-40" />
              Generation Library
            </span>
          </div>
          <span className="text-[11px] text-[#8A8A8A] font-black uppercase tracking-widest opacity-40">
            {history.length} Neural Clips
          </span>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4 elegant-scroll">
        {history.length > 0 ? (
          history.map((item) => (
            <VoiceCard 
              key={item._id || item.id} 
              item={item} 
              onDelete={onDelete} 
              onRegenerate={onRegenerate} 
            />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-[#8A8A8A] gap-8">
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center border border-gray-100 shadow-inner group">
              <Mic2 className="w-10 h-10 lg:w-14 lg:h-14 text-gray-200 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="text-center space-y-2 px-6">
              <h3 className="text-[20px] lg:text-[22px] font-black text-[#110C0C] uppercase tracking-tighter">
                Studio Empty
              </h3>
              <p className="text-[14px] lg:text-[15px] font-medium max-w-[340px] leading-relaxed opacity-50">
                You haven't crafted any neural voices yet. Enter a script to start your first narration.
              </p>
            </div>
          </div>
        )}
        {/* Extra spacer for bottom scrolling visibility */}
        <div className="h-12" />
      </div>
    </div>
  );
}
