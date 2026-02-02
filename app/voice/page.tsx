
"use client";

import { useState, useEffect, useCallback } from "react";
import PageLayout from "@/components/PageLayout";
import { VoiceSettings } from "./components/VoiceSettings";
import { VoiceHistory } from "./components/VoiceHistory";
import { voiceService } from "@/lib/services/voice.service";
import { useAuth } from "@/hooks/useAuth";
import { useConfirm } from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/ui/Toast";
import { Plus, History } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VoicePage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mobileView, setMobileView] = useState<"editor" | "history">("editor");

  const { isAuthenticated } = useAuth();
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  const fetchHistory = useCallback(async (silent = false) => {
    if (!isAuthenticated) return;
    if (!silent) setIsLoading(true);
    try {
      const data = await voiceService.getHistory(1, 20);
      setHistory(data || []);
    } catch (err) {
      console.error("Failed to load voice history", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleGenerate = async (data: any) => {
    setIsGenerating(true);
    try {
      await voiceService.generateVoice(data);
      showToast("Generation successful!", "success");
      await fetchHistory(true);
      if (window.innerWidth < 1024) setMobileView("history");
    } catch (err: any) {
      showToast(err.message || "Voice generation failed", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete Voice Clip",
      message: "Are you sure you want to delete this clip permanently?",
      confirmText: "Delete",
      confirmStyle: "danger",
      icon: "delete",
    });

    if (!ok) return;

    try {
      await voiceService.deleteGeneration(id);
      setHistory(prev => prev.filter(i => i._id !== id && i.id !== id));
      showToast("Deleted successfully", "success");
    } catch (e) {
      showToast("Failed to delete", "error");
    }
  };

  const handleRegenerate = async (item: any) => {
    handleGenerate({
      text: item.text,
      modelId: item.modelId?._id || item.modelId,
      voiceId: item.voiceId?.voiceId || item.voiceId,
      language: item.language
    });
  };

  return (
    <PageLayout>
      {/* Mobile View Toggle */}
      <div className="lg:hidden flex p-1.5 bg-[#E9E7E7] rounded-2xl mb-4 w-full max-w-[320px] mx-auto shadow-inner font-[Inter]">
        <button
          onClick={() => setMobileView("editor")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all",
            mobileView === "editor" ? "bg-white text-[#110C0C] shadow-md" : "text-[#8A8A8A]",
          )}
        >
          <Plus className="w-4 h-4" /> Create
        </button>
        <button
          onClick={() => setMobileView("history")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all",
            mobileView === "history" ? "bg-white text-[#110C0C] shadow-md" : "text-[#8A8A8A]",
          )}
        >
          <History className="w-4 h-4" /> Library
        </button>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-180px)] lg:h-[calc(100vh-90px)] bg-[#FEFBFB] overflow-hidden font-[Inter] rounded-[2px] border border-[#F0F0F3] shadow-sm">
        <div className={cn("h-full lg:block", mobileView === "editor" ? "block w-full lg:w-auto" : "hidden")}>
          <VoiceSettings 
            onGenerate={handleGenerate} 
            isGenerating={isGenerating} 
          />
        </div>

        <div className={cn("flex-1 flex flex-col min-w-0 bg-white h-full lg:flex", mobileView === "history" ? "flex w-full" : "hidden")}>
           <VoiceHistory 
             history={history} 
             onDelete={handleDelete} 
             onRegenerate={handleRegenerate}
             isLoading={isLoading} 
           />
        </div>
      </div>
    </PageLayout>
  );
}
