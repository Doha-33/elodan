"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { PromptInput } from "@/components/ui/PromptInput";
import { GenerateButton } from "@/components/ui/GenerateButton";
import { TabSwitch } from "@/components/ui/TabSwitch";
import { videoService } from "@/lib/services/video.service";
import { useToast } from "@/components/ui/Toast";
import { compressImage } from "@/lib/utils/image";
import { cn } from "@/lib/utils";
import {
  X,
  ChevronRight,
} from "lucide-react";


interface VideoSettingsProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onGenerated?: () => void;
  onGenerateStart?: (data: any) => void;
}

export function VideoSettings({
  activeTab = "text-to-video",
  onTabChange,
  onGenerated,
  onGenerateStart,
}: VideoSettingsProps) {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [externalRefUrl, setExternalRefUrl] = useState<string | null>(null);

  const [openDropdown, setOpenDropdown] = useState<
    "model" | "dim" | "res" | null
  >(null);

  const [settings, setSettings] = useState<any>({
    duration: 5,
    aspect_ratio: "1:1",
    resolution: "720p",
  });

  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle URL Params
  useEffect(() => {
    const urlPrompt = searchParams.get("prompt");
    const urlRef = searchParams.get("ref");
    const urlMode = searchParams.get("mode");

    if (urlPrompt) setPrompt(urlPrompt);
    if (urlRef) setExternalRefUrl(urlRef);
    if (urlMode === "image") {
      onTabChange?.("image-to-video");
    } else if (urlMode === "text") {
      onTabChange?.("text-to-video");
    }
  }, [searchParams, onTabChange]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const type =
          activeTab === "text-to-video" ? "text_to_video" : "image_to_video";
        const data = await videoService.getModels(type);
        setModels(data);
        if (data.length > 0) {
          const initialModel = data[0];
          setSelectedModel(initialModel);
          const defaults: any = {};
          initialModel.parameters?.forEach((p: any) => {
            if (p.default !== undefined) defaults[p.name] = p.default;
          });
          setSettings((prev: any) => ({ ...prev, ...defaults }));
        }
      } catch (err) {
        console.error("Failed to load models", err);
      }
    };
    fetchModels();
  }, [activeTab]);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        showToast("Please select an image file", "error");
        return;
      }
      setInputImage(file);
      setPreview(URL.createObjectURL(file));
      setExternalRefUrl(null);
    },
    [showToast],
  );

  const handleImprove = async () => {
    if (!prompt || !selectedModel) return;
    try {
      const { improvedPrompt } = await videoService.improvePrompt(
        prompt,
        selectedModel._id || selectedModel.id,
      );
      setPrompt(improvedPrompt);
      showToast("Prompt improved!", "success");
    } catch (e) {
      showToast("Failed to improve prompt", "error");
    }
  };

  const handleSurprise = async () => {
    onGenerateStart?.({ prompt: "Surprise Video", type: activeTab });
    setIsGenerating(true);
    try {
      await videoService.surpriseMe();
      showToast("Surprise video started!", "success");
      onGenerated?.();
    } catch (e: any) {
      showToast(e?.message, "error");
      onGenerated?.();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !selectedModel) return;
    if (activeTab === "image-to-video" && !inputImage && !externalRefUrl) {
      showToast("Please upload a reference image", "warning");
      return;
    }

    onGenerateStart?.({ prompt, type: activeTab, duration: settings.duration, aspectRatio: settings.aspect_ratio });
    setIsGenerating(true);
    try {
      let imageToUpload = inputImage;
      if (activeTab === "image-to-video" && inputImage) {
        imageToUpload = await compressImage(inputImage, 3.0);
      }

      const payload = {
        modelId: selectedModel._id || selectedModel.id,
        prompt,
        ...settings,
        image: imageToUpload || undefined,
        // @ts-ignore
        imageUrl: externalRefUrl || undefined
      };

      if (activeTab === "text-to-video") {
        await videoService.textToVideo(payload);
      } else {
        await videoService.imageToVideo(payload);
      }

      showToast("Video generation started!", "success");
      onGenerated?.();
      setPrompt("");
      setInputImage(null);
      setPreview(null);
      setExternalRefUrl(null);
    } catch (err: any) {
      showToast(err.message || "Generation failed", "error");
      onGenerated?.();
    } finally {
      setIsGenerating(false);
    }
  };

  const ASPECT_RATIO_LABELS: Record<string, string> = {
    "1:1": "1:1 Square",
    "16:9": "16:9 Widescreen",
    "9:16": "9:16 Vertical",
    "4:3": "4:3 Traditional",
    "21:9": "21:9 Ultrawide",
    "3:2": "3:2 Standard",
    "2:3": "2:3 Portrait",
  };

  const availableDurations = useMemo(() => {
    return selectedModel?.supportedDurations?.length > 0 ? selectedModel.supportedDurations : [5, 10];
  }, [selectedModel]);

  const availableRatios = useMemo(() => {
    return selectedModel?.supportedAspectRatios?.length > 0 ? selectedModel.supportedAspectRatios : ["1:1", "16:9", "9:16", "4:3"];
  }, [selectedModel]);

  const availableResolutions = useMemo(() => {
    return selectedModel?.supportedResolutions?.length > 0 ? selectedModel.supportedResolutions : ["720p", "1080p"];
  }, [selectedModel]);

  // Sync settings with selected model defaults
  useEffect(() => {
    if (selectedModel) {
      setSettings((prev: any) => ({
        ...prev,
        duration: availableDurations.includes(prev.duration) ? prev.duration : availableDurations[0],
        aspect_ratio: availableRatios.includes(prev.aspect_ratio) ? prev.aspect_ratio : availableRatios[0],
        resolution: availableResolutions.includes(prev.resolution) ? prev.resolution : availableResolutions[0],
      }));
    }
  }, [selectedModel, availableDurations, availableRatios, availableResolutions]);

  return (
    <div className="w-[420px] h-full bg-white border-r border-[#E5E5E8] p-6 flex flex-col font-[Inter] overflow-y-auto scrollbar-hide relative text-left">
      <div className="mb-6">
        <TabSwitch
          tabs={[
            { id: "text-to-video", label: "Text to Video" },
            { id: "image-to-video", label: "Image to Video" },
          ]}
          activeTab={activeTab}
          onChange={onTabChange || (() => {})}
        />
      </div>

      {activeTab === "image-to-video" && (
        <div className="mb-6">
          <label className="block text-[14px] font-semibold text-[#110C0C] mb-2">
            Reference Image
          </label>
          <div
            onClick={() => document.getElementById("vid-img-upload")?.click()}
            className="w-full h-[120px] border-2 border-dashed border-[#E5E5E8] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 bg-[#F8F8F8] overflow-hidden group relative"
          >
            {(preview || externalRefUrl) ? (
              <>
                <img src={preview || externalRefUrl || ''} className="w-full h-full object-cover" alt="Preview" />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setInputImage(null);
                    setPreview(null);
                    setExternalRefUrl(null);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <img src="/assets/icons/ui/image.svg" className="w-10 h-10 opacity-30 mb-2" />
                <p className="text-[12px] text-[#8A8A8A] font-bold">Upload image</p>
              </>
            )}
            <input
              id="vid-img-upload"
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
          </div>
        </div>
      )}

      <div className="mb-6 text-left">
        <PromptInput
          value={prompt}
          onChange={setPrompt}
          onSurpriseMe={handleSurprise}
          onImprovePrompt={handleImprove}
          onClear={() => setPrompt("")}
          placeholder={activeTab === "image-to-video" ? "How'd you like to animate this?" : "Describe your video idea..."}
        />
      </div>

      <div className="text-[14px] font-semibold text-[#110C0C] mb-4 text-left">Settings</div>

      <div className="space-y-4 text-left">
        <div className="bg-[#F5F5F5] p-4 rounded-[20px] space-y-2">
          <label className="block text-[13px] font-medium text-[#110C0C]">Model</label>
          <button onClick={() => setOpenDropdown("model")} className="w-full h-[64px] flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <img src={selectedModel?.icon || "/assets/icons/brands/Component 1-2.svg"} className="w-9 h-9 rounded-lg object-contain bg-gray-50" alt="Model" />
              <span className="text-[14px] font-bold text-[#110C0C]">{selectedModel?.name || "Select Model"}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#8A8A8A]" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#F5F5F5] p-4 rounded-[20px] space-y-2">
            <label className="block text-[13px] font-medium text-[#110C0C]">Dimension</label>
            <button onClick={() => setOpenDropdown("dim")} className="w-full h-[64px] flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
               <span className="text-[14px] font-bold text-[#110C0C]">{settings.aspect_ratio}</span>
               <ChevronRight className="w-3.5 h-3.5 text-[#8A8A8A]" />
            </button>
          </div>

          <div className="bg-[#F5F5F5] p-4 rounded-[20px] space-y-2">
            <label className="block text-[13px] font-medium text-[#110C0C]">Resolution</label>
            <button onClick={() => { if (availableResolutions.length > 1) setOpenDropdown("res") }} className="w-full h-[64px] flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
               <span className="text-[14px] font-bold text-[#110C0C]">{settings.resolution}</span>
               {availableResolutions.length > 1 && <ChevronRight className="w-3.5 h-3.5 text-[#8A8A8A]" />}
            </button>
          </div>
        </div>

        <div className="bg-[#F5F5F5] p-4 rounded-[20px] space-y-3">
          <label className="block text-[13px] font-medium text-[#110C0C]">Duration</label>
          <div className="grid grid-cols-5 gap-2">
            {availableDurations.map((dur: number) => (
              <button key={dur} onClick={() => setSettings({ ...settings, duration: dur })} className={cn("h-[44px] flex items-center justify-center rounded-xl text-[13px] font-bold transition-all shadow-sm", settings.duration === dur ? "bg-black text-white" : "bg-white text-[#110C0C] hover:bg-gray-50")}>
                {dur} S
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <GenerateButton onClick={handleGenerate} isLoading={isGenerating} credits={selectedModel?.creditCostPerSecond ? Math.ceil(selectedModel.creditCostPerSecond * settings.duration) : 40} className="w-full" />
      </div>

      {/* Model List Dropdown */}
      {openDropdown === "model" && (
        <div className="absolute inset-0 z-[100] bg-black/10 flex items-center justify-center p-4" onClick={() => setOpenDropdown(null)}>
          <div className="bg-white w-full max-w-[380px] rounded-[32px] shadow-2xl overflow-hidden border border-[#E5E5E8]" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex justify-between items-center">
              <span className="font-bold">Model</span>
              <button onClick={() => setOpenDropdown(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-2 space-y-1">
              {models.map((m) => (
                <button key={m._id || m.id} onClick={() => { setSelectedModel(m); setOpenDropdown(null); }} className={cn("w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left", selectedModel?._id === m._id ? "bg-purple-50" : "hover:bg-gray-50")}>
                  <img src={m.icon || "/assets/icons/brands/Component 1-2.svg"} className="w-10 h-10 rounded-lg object-contain bg-gray-50" alt={m.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-[#110C0C]">{m.name}</p>
                    <p className="text-[11px] text-[#8A8A8A] line-clamp-1">{m.description || m.provider}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dimension Dropdown */}
      {openDropdown === "dim" && (
        <div className="absolute inset-0 z-[100] bg-black/10 flex items-center justify-center p-4" onClick={() => setOpenDropdown(null)}>
          <div className="bg-white w-full max-w-[380px] rounded-[32px] shadow-2xl overflow-hidden border border-[#E5E5E8]" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex justify-between items-center">
              <span className="font-bold">Aspect Ratio</span>
              <button onClick={() => setOpenDropdown(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="p-2 space-y-1">
              {availableRatios.map((ratio: string) => (
                <button key={ratio} onClick={() => { setSettings({ ...settings, aspect_ratio: ratio }); setOpenDropdown(null); }} className={cn("w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left", settings.aspect_ratio === ratio ? "bg-purple-50" : "hover:bg-gray-50")}>
                  <div className={cn("w-6 h-6 border-2 border-[#110C0C] rounded-sm", 
                    ratio === "1:1" ? "aspect-square" : 
                    ratio === "16:9" ? "aspect-video" : 
                    ratio === "9:16" ? "h-6 w-3" : "w-6 h-4"
                  )} />
                  <span className="text-[14px] font-bold text-[#110C0C]">{ASPECT_RATIO_LABELS[ratio] || ratio}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Resolution Dropdown */}
      {openDropdown === "res" && (
        <div className="absolute inset-0 z-[100] bg-black/10 flex items-center justify-center p-4" onClick={() => setOpenDropdown(null)}>
          <div className="bg-white w-full max-w-[380px] rounded-[32px] shadow-2xl overflow-hidden border border-[#E5E5E8]" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex justify-between items-center">
              <span className="font-bold">Resolution</span>
              <button onClick={() => setOpenDropdown(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="p-2 space-y-1">
              {availableResolutions.map((res: string) => (
                <button key={res} onClick={() => { setSettings({ ...settings, resolution: res }); setOpenDropdown(null); }} className={cn("w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left", settings.resolution === res ? "bg-purple-50" : "hover:bg-gray-50")}>
                  <span className="text-[14px] font-bold text-[#110C0C]">{res}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
