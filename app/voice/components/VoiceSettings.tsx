
"use client";

import { useState, useEffect, useMemo } from "react";
import { PromptInput } from "@/components/ui/PromptInput";
import { GenerateButton } from "@/components/ui/GenerateButton";
import { voiceService } from "@/lib/services/voice.service";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { ChevronRight, Check, Sparkles, Volume2, Globe, Music, Mic2, Play } from "lucide-react";

export function VoiceSettings({
  onGenerate,
  isGenerating
}: {
  onGenerate: (data: any) => void;
  isGenerating: boolean;
}) {
  const [text, setText] = useState("");
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [selectedVoice, setSelectedVoice] = useState<any>(null);
  const [selectedLang, setSelectedLang] = useState<any>(null);
  const [openDropdown, setOpenDropdown] = useState<"model" | "voice" | "lang" | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const mList = await voiceService.getModels();
        setModels(mList);
        if (mList.length > 0) {
          const initial = mList.find((m: any) => m.isDefault) || mList[0];
          handleModelChange(initial);
        }
      } catch (e) {
        showToast("Failed to load voice engines", "error");
      }
    };
    fetchInit();
  }, []);

  const handleModelChange = (model: any) => {
    setSelectedModel(model);
    // استخراج الأصوات واللغات من كائن الموديل مباشرة كما في الـ JSON المقدم
    const voices = model.supportedVoices || [];
    const langs = model.supportedLanguages || [];
    
    if (voices.length > 0) setSelectedVoice(voices[0]);
    if (langs.length > 0) setSelectedLang(langs[0]);
    
    setOpenDropdown(null);
  };

  const handleGenerate = () => {
    if (!text.trim()) {
      showToast("Please enter some text", "warning");
      return;
    }
    if (!selectedModel) {
      showToast("Select an engine", "warning");
      return;
    }
    
    onGenerate({
      text,
      modelId: selectedModel._id || selectedModel.id,
      voiceId: selectedVoice?.voiceId || null,
      language: selectedLang?.code || 'en'
    });
    setText("");
  };

  return (
    <div className="w-full lg:w-[420px] h-full bg-white border-r border-[#E5E5E8] p-6 flex flex-col font-[Inter] overflow-y-auto elegant-scroll relative">
      <div className="mb-6 flex items-center justify-between">
         <div className="px-5 py-2 bg-[#F8F8F8] border border-[#E5E5E8] rounded-full w-fit">
            <span className="text-[12px] font-black text-[#110C0C] uppercase tracking-tighter">Voice Lab</span>
         </div>
         <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg border border-red-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Neural AI</span>
         </div>
      </div>

      <div className="mb-8">
        <PromptInput
          label="Script"
          value={text}
          onChange={setText}
          placeholder="Enter the text you want the AI to speak... Keep it natural for best results."
          showActionButtons={false}
          className="h-full"
        />
        <div className="flex items-center justify-between mt-2 px-1">
           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Max 2000 chars</span>
           <span className={cn("text-[10px] font-black uppercase", text.length > 1800 ? "text-red-500" : "text-[#8A8A8A]")}>
            {text.length} Characters
           </span>
        </div>
      </div>

      <div className="text-[14px] font-bold text-[#110C0C] mb-5 px-1 uppercase tracking-tight flex items-center gap-2">
        <div className="w-1.5 h-4 bg-red-600 rounded-full" />
        Configuration
      </div>

      <div className="space-y-4">
        {/* Model Selection */}
        <div className="bg-[#F5F5F5] p-4 rounded-[24px] space-y-2 relative">
          <label className="text-[11px] text-[#8A8A8A] font-black uppercase tracking-widest ml-1">AI Neural Engine</label>
          <button
            onClick={() => setOpenDropdown(openDropdown === "model" ? null : "model")}
            className="w-full h-[64px] flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E5E8] shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-[#110C0C] flex items-center justify-center text-white shadow-lg shadow-red-100">
                <Mic2 className="w-5 h-5" />
              </div>
              <span className="text-[14px] font-black text-[#110C0C] truncate max-w-[180px]">
                {selectedModel?.name || "Loading engines..."}
              </span>
            </div>
            <ChevronRight className={cn("w-4 h-4 text-[#8A8A8A] transition-transform duration-300", openDropdown === "model" && "rotate-90")} />
          </button>

          {openDropdown === "model" && (
            <div className="absolute top-[calc(100%-8px)] left-4 right-4 z-50 mt-2 bg-white rounded-2xl shadow-2xl border border-[#E5E5E8] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="max-h-[280px] overflow-y-auto p-2 space-y-1 elegant-scroll">
                {models.map((m) => (
                  <button
                    key={m._id}
                    onClick={() => handleModelChange(m)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group",
                      selectedModel?._id === m._id ? "bg-red-50" : "hover:bg-gray-50"
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#110C0C] text-white flex items-center justify-center text-[10px] font-black uppercase flex-shrink-0 group-hover:scale-110 transition-transform">
                      V{m.priority > 5 ? '1' : '0'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[#110C0C] truncate">{m.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium truncate uppercase tracking-widest">{m.provider}</p>
                    </div>
                    {selectedModel?._id === m._id && <Check className="w-4 h-4 text-red-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Voice Selection */}
        <div className="bg-[#F5F5F5] p-4 rounded-[24px] space-y-2 relative">
          <label className="text-[11px] text-[#8A8A8A] font-black uppercase tracking-widest ml-1">Speaker Profile</label>
          <button
            onClick={() => setOpenDropdown(openDropdown === "voice" ? null : "voice")}
            className="w-full h-[64px] flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E5E8] shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl border border-gray-100 flex items-center justify-center bg-gray-50 group-hover:bg-white transition-colors shadow-inner">
                <Volume2 className="w-4 h-4 text-[#110C0C]" />
              </div>
              <div className="text-left">
                <p className="text-[14px] font-black text-[#110C0C] truncate max-w-[180px]">
                  {selectedVoice?.name || "Default Speaker"}
                </p>
                <p className="text-[10px] text-[#8A8A8A] font-bold uppercase tracking-widest">{selectedVoice?.gender || 'Dynamic'}</p>
              </div>
            </div>
            <ChevronRight className={cn("w-4 h-4 text-[#8A8A8A] transition-transform duration-300", openDropdown === "voice" && "rotate-90")} />
          </button>

          {openDropdown === "voice" && (
            <div className="absolute top-[calc(100%-8px)] left-4 right-4 z-50 mt-2 bg-white rounded-2xl shadow-2xl border border-[#E5E5E8] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="max-h-[280px] overflow-y-auto p-2 space-y-1 elegant-scroll">
                {(selectedModel?.supportedVoices || []).map((v: any) => (
                  <button
                    key={v.voiceId}
                    onClick={() => { setSelectedVoice(v); setOpenDropdown(null); }}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                      selectedVoice?.voiceId === v.voiceId ? "bg-gray-50 border border-gray-100" : "hover:bg-gray-50 border border-transparent"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center shadow-sm text-[#110C0C]">
                        <Play className="w-3 h-3 fill-current" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[#110C0C]">{v.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{v.gender}</p>
                    </div>
                    {selectedVoice?.voiceId === v.voiceId && <Check className="w-4 h-4 text-[#110C0C]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Language Selection */}
        <div className="bg-[#F5F5F5] p-4 rounded-[24px] space-y-2 relative">
          <label className="text-[11px] text-[#8A8A8A] font-black uppercase tracking-widest ml-1">Target Language</label>
          <button
            onClick={() => setOpenDropdown(openDropdown === "lang" ? null : "lang")}
            className="w-full h-[64px] flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E5E8] shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-[#8A8A8A]" />
              <span className="text-[14px] font-black text-[#110C0C] uppercase tracking-tighter">
                {selectedLang?.name || "English"}
              </span>
            </div>
            <ChevronRight className={cn("w-4 h-4 text-[#8A8A8A] transition-transform duration-300", openDropdown === "lang" && "rotate-90")} />
          </button>

          {openDropdown === "lang" && (
            <div className="absolute top-[calc(100%-8px)] left-4 right-4 z-50 mt-2 bg-white rounded-2xl shadow-2xl border border-[#E5E5E8] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="grid grid-cols-2 gap-1 p-2 max-h-[280px] overflow-y-auto elegant-scroll">
                {(selectedModel?.supportedLanguages || []).map((l: any) => (
                  <button
                    key={l.code}
                    onClick={() => { setSelectedLang(l); setOpenDropdown(null); }}
                    className={cn(
                      "p-3 rounded-xl text-left text-[12px] font-black uppercase tracking-tight transition-all",
                      selectedLang?.code === l.code ? "bg-[#110C0C] text-white shadow-lg" : "hover:bg-gray-50 text-[#110C0C]"
                    )}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto pt-8">
        <GenerateButton
          onClick={handleGenerate}
          isLoading={isGenerating}
          credits={selectedModel?.creditCostPerSecond ? Math.max(6, Math.ceil(text.length / 50) * selectedModel.creditCostPerSecond) : 40}
          className="w-full h-[66px] rounded-[24px] shadow-2xl shadow-red-100"
        />
      </div>
    </div>
  );
}
