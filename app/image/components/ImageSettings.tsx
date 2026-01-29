"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { PromptInput } from "@/components/ui/PromptInput";
import { GenerateButton } from "@/components/ui/GenerateButton";
import { TabSwitch } from "@/components/ui/TabSwitch";
import { imageService } from "@/lib/services/image.service";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { ChevronRight, X, Check } from "lucide-react";

export function ImageSettings({
  activeTab = "text-to-image",
  onTabChange,
  onGenerated,
  onGenerateStart,
}: any) {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [selectedDim, setSelectedDim] = useState({
    id: "1:1",
    name: "1:1 Square",
  });

  const [inputImage, setInputImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [externalRefUrl, setExternalRefUrl] = useState<string | null>(null);

  const [openDropdown, setOpenDropdown] = useState<
    "model" | "style" | "dim" | null
  >(null);
  const { showToast } = useToast();

  // Handle URL Params for "Create Similar"
  useEffect(() => {
    const urlPrompt = searchParams.get("prompt");
    const urlRef = searchParams.get("ref");
    const urlMode = searchParams.get("mode");

    if (urlPrompt) setPrompt(urlPrompt);
    if (urlRef) {
      setExternalRefUrl(urlRef);
      // We don't have the File object, but we show the preview
    }
    if (urlMode === "image") {
      onTabChange?.("image-to-image");
    } else if (urlMode === "text") {
      onTabChange?.("text-to-image");
    }
  }, [searchParams, onTabChange]);

  useEffect(() => {
    imageService.getModels().then((res) => {
      const data = res.data || [];
      setModels(data);
      if (data.length > 0) setSelectedModel(data[0]);
    });
  }, []);

  const handleImprove = async () => {
    if (!prompt || !selectedModel) return;
    try {
      const res = await imageService.improvePrompt(prompt, selectedModel._id);
      setPrompt(res.data.improvedPrompt);
    } catch (e) {
      showToast("Failed to improve prompt", "error");
    }
  };

  const handleSurprise = async () => {
    onGenerateStart?.({
      prompt: "Surprise Me",
      type: activeTab,
      aspectRatio: selectedDim.id,
    });
    setIsGenerating(true);
    try {
      await imageService.generateImage({ generationType: "surprise-me" });
      onGenerated?.();
    } catch (e: any) {
      showToast(e?.message, "error");
      onGenerated?.();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    if (activeTab === "text-to-image" && !prompt) return;
    if (activeTab === "image-to-image" && !inputImage && !externalRefUrl) {
      showToast("Please upload an image", "warning");
      return;
    }

    onGenerateStart?.({ prompt, type: activeTab, aspectRatio: selectedDim.id });
    setIsGenerating(true);

    try {
      await imageService.generateImage({
        prompt,
        modelId: selectedModel?._id,
        aspectRatio: selectedDim.id,
        generationType: activeTab as any,
        inputImage: inputImage || undefined,
        // @ts-ignore - Handle external URL if the service supports it
        imageUrl: externalRefUrl || undefined,
      });
      onGenerated?.();
      setPrompt("");
      setInputImage(null);
      setPreview(null);
      setExternalRefUrl(null);
    } catch (e: any) {
      showToast(e.message || "Generation failed", "error");
      onGenerated?.();
    } finally {
      setIsGenerating(false);
    }
  };

  const DIMENSIONS = [
    { id: "1:1", name: "Square (1:1)", w: 1, h: 1 },
    { id: "4:3", name: "Landscape (4:3)", w: 4, h: 3 },
    { id: "3:4", name: "Portrait (3:4)", w: 3, h: 4 },
    { id: "16:9", name: "Widescreen (16:9)", w: 16, h: 9 },
  ];

  return (
    <div className="w-[420px] h-full bg-white border-r border-[#E5E5E8] p-6 flex flex-col font-[Inter] overflow-y-auto scrollbar-hide relative">
      <div className="mb-6">
        <TabSwitch
          tabs={[
            { id: "text-to-image", label: "Text to Image" },
            { id: "image-to-image", label: "Image to Image" },
          ]}
          activeTab={activeTab}
          onChange={onTabChange}
        />
      </div>

      {activeTab === "image-to-image" && (
        <div className="mb-6">
          <label className="block text-[14px] font-semibold text-[#110C0C] mb-2">
            Reference Image
          </label>
          <div
            onClick={() => document.getElementById("img-upload")?.click()}
            className="w-full h-[120px] border-2 border-dashed border-[#E5E5E8] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 bg-[#F8F8F8] overflow-hidden group relative"
          >
            {preview || externalRefUrl ? (
              <>
                <img
                  src={preview || externalRefUrl || ""}
                  className="w-full h-full object-cover"
                  alt="Preview"
                />
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
                <img
                  src="/assets/icons/ui/image.svg"
                  className="w-10 h-10 opacity-30 mb-2"
                />
                <p className="text-[12px] text-[#8A8A8A] font-bold">
                  Upload image
                </p>
                <p className="text-[10px] text-[#BDBDBD]">
                  Support: jpg, png Max file size: 10MB
                </p>
              </>
            )}
            <input
              id="img-upload"
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  setInputImage(file);
                  setPreview(URL.createObjectURL(file));
                  setExternalRefUrl(null); // Local upload overrides external
                }
              }}
            />
          </div>
        </div>
      )}

      <div className="mb-6">
        <PromptInput
          value={prompt}
          onChange={setPrompt}
          onSurpriseMe={handleSurprise}
          onImprovePrompt={handleImprove}
          onClear={() => setPrompt("")}
          placeholder={
            activeTab === "image-to-image"
              ? "Your image is ready — describe how you'd like to bring it to life"
              : "Describe your image you want to create"
          }
        />
      </div>

      <div className="text-[14px] font-semibold text-[#110C0C] mb-4">
        Settings
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[12px] text-[#8A8A8A]">Model</label>
          <button
            onClick={() => setOpenDropdown("model")}
            className="w-full flex items-center justify-between p-3 border border-[#E5E5E8] rounded-xl hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/icons/brands/Component 1-2.svg"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[14px] font-medium">
                {selectedModel?.name || "Select Model"}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-[12px] text-[#8A8A8A]">Dimension</label>
          <button
            onClick={() => setOpenDropdown("dim")}
            className="w-full flex items-center justify-between p-3 border border-[#E5E5E8] rounded-xl hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border border-[#E5E5E8] rounded-sm" />
              <span className="text-[14px] font-medium">
                {selectedDim.name}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
          </button>
        </div>

        {/* Dynamic AI Insight Card */}
        {selectedModel && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-indigo-50/50 relative group/insight">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/10 rounded-full -mr-16 -mt-16 blur-3xl transition-all duration-700 group-hover/insight:scale-125" />
            <div className="p-4 relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <div className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black uppercase rounded shadow-sm">
                  AI Insight
                </div>
                <div className="h-px flex-1 bg-blue-100" />
              </div>

              <p className="text-[11px] font-medium text-blue-900/80 line-clamp-2 leading-relaxed mb-3">
                {selectedModel.description ||
                  "Harness advanced AI to create pixel-perfect visuals with this optimized model."}
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/70 backdrop-blur-md p-3 rounded-xl border border-white/50 shadow-sm group-hover/insight:bg-white transition-colors duration-300">
                  <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mb-1">
                    High Quality
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedModel.supportedResolutions
                      ?.slice(-2)
                      .map((res: string) => (
                        <span
                          key={res}
                          className="text-[10px] font-black text-blue-800 bg-blue-100/20 px-1.5 py-0.5 rounded border border-blue-100"
                        >
                          {res}
                        </span>
                      ))}
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-md p-3 rounded-xl border border-white/50 shadow-sm group-hover/insight:bg-white transition-colors duration-300">
                  <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mb-1">
                    Efficiency
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-black text-blue-800">
                      98% Faster
                    </span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-1 h-2 rounded-full",
                            i <= 4 ? "bg-blue-600" : "bg-gray-200",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto pt-6">
        <GenerateButton
          onClick={handleGenerate}
          isLoading={isGenerating}
          credits={selectedModel?.creditCostPerGeneration || 40}
          className="w-full"
        />
      </div>

      {/* Model Dropdown */}
      {openDropdown === "model" && (
        <div
          className="absolute inset-0 z-50 bg-black/10 flex items-center justify-center p-4"
          onClick={() => setOpenDropdown(null)}
        >
          <div
            className="bg-white w-full max-w-[380px] rounded-2xl shadow-2xl overflow-hidden border border-[#E5E5E8]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <span className="font-bold">Model</span>
              <button onClick={() => setOpenDropdown(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-2 space-y-2 elegant-scroll">
              {models.map((m) => (
                <div
                  key={m._id}
                  onClick={() => {
                    setSelectedModel(m);
                    setOpenDropdown(null);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer"
                >
                  <img
                    src={m.icon || "/assets/icons/brands/gpt.svg"}
                    className="w-10 h-10 rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="text-[14px] font-bold">{m.name}</p>
                    <p className="text-[11px] text-[#8A8A8A] line-clamp-2">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dimension Dropdown */}
      {openDropdown === "dim" && (
        <div
          className="absolute inset-0 z-50 bg-black/10 flex items-center justify-center p-4"
          onClick={() => setOpenDropdown(null)}
        >
          <div
            className="bg-white w-full max-w-[360px] rounded-2xl shadow-2xl overflow-hidden border border-[#E5E5E8]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <span className="font-bold">Dimension</span>
              <button onClick={() => setOpenDropdown(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 space-y-1">
              {DIMENSIONS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setSelectedDim(d);
                    setOpenDropdown(null);
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl",
                    selectedDim.id === d.id
                      ? "bg-[#F8F8F8]"
                      : "hover:bg-gray-50",
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 border rounded flex items-center justify-center",
                      selectedDim.id === d.id
                        ? "bg-[#110C0C] border-[#110C0C]"
                        : "border-[#E5E5E8]",
                    )}
                  >
                    {selectedDim.id === d.id && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-[14px] font-medium">{d.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
