"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { videoEffectService } from "@/lib/services/videoEffect.service";
import { useToast } from "@/components/ui/Toast";
import { compressImage } from "@/lib/utils/image";
import { cn } from "@/lib/utils";
import {
  X,
  Check,
  Sparkles,
  Image as ImageIcon,
  User,
  Layers,
  Search,
  Filter,
  ChevronDown,
  Info,
} from "lucide-react";
import { GenerateButton } from "@/components/ui/GenerateButton";

export function VideoEffectSettings({
  onGenerated,
}: {
  onGenerated?: (data: any) => void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [faceOnly, setFaceOnly] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [scenes, setScenes] = useState<any[]>([]);
  const [selectedScene, setSelectedScene] = useState<any>(null);
  const [prompt, setPrompt] = useState("");
  const { showToast } = useToast();

  const [inputImage, setInputImage] = useState<File | null>(null);
  const [inputImagePreview, setInputImagePreview] = useState<string | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Categories initially
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const catsData = await videoEffectService.getCategories();
        // API returns { success: true, data: { categories: [...], totalCategories: 7 } }
        const items = catsData.data?.categories || catsData.categories || [];
        setCategories([{ name: "All", sceneCount: 0 }, ...items]);
      } catch (e) {
        console.error("Failed to fetch categories", e);
      }
    };
    fetchCats();
  }, []);

  // Fetch Models/Scenes whenever filters change
  useEffect(() => {
    const fetchModels = async () => {
      setIsLoading(true);
      try {
        const filters: any = {};
        if (selectedCategory !== "All") filters.category = selectedCategory;
        if (faceOnly !== null) filters.requiresFace = faceOnly;

        const modelsData = await videoEffectService.getModels(filters);

        // Flatten scenes from all returned models
        const allScenes = modelsData.flatMap((m) =>
          (m.scenes || m.data?.scenes || []).map((s: any) => ({
            ...s,
            isLocked: m.isLocked,
            modelName: m.name,
            provider: m.provider,
          })),
        );

        setScenes(allScenes);

        // Auto-select first scene if none selected or current one disappeared
        if (
          selectedScene &&
          !allScenes.find((s) => s.sceneId === selectedScene.sceneId)
        ) {
          setSelectedScene(null);
        } else if (!selectedScene && allScenes.length > 0) {
          setSelectedScene(allScenes.find((s) => !s.isLocked) || allScenes[0]);
        }
      } catch (err) {
        showToast("Failed to load templates", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchModels();
  }, [selectedCategory, faceOnly, showToast]);

  const filteredScenes = useMemo(() => {
    if (!searchQuery.trim()) return scenes;
    return scenes.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sceneId.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [scenes, searchQuery]);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        showToast("Please select an image file", "error");
        return;
      }
      setInputImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setInputImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    },
    [showToast],
  );

  const handleGenerate = async () => {
    if (!inputImage || !selectedScene) {
      showToast("Please upload an image and select a template", "warning");
      return;
    }

    setIsGenerating(true);
    try {
      const compressed = await compressImage(inputImage, 3.0);
      const res = await videoEffectService.generate({
        image: compressed,
        effectScene: selectedScene.sceneId,
        prompt: prompt || undefined,
      });

      if (res.success) {
        showToast("Processing started!", "success");
        onGenerated?.(res.data);
        setPrompt("");
      }
    } catch (err: any) {
      showToast(err.message || "Generation failed", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full lg:w-[440px] h-full bg-white border-r border-[#F0F0F3] flex flex-col font-[Inter] overflow-hidden">
      {/* Header */}
      <div className="p-7 pb-4 border-b border-gray-50 bg-white/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-[#110C0C] flex items-center justify-center shadow-lg shadow-red-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-[18px] font-black text-[#110C0C] tracking-tight uppercase">
              AI Templates
            </h1>
            <p className="text-[11px] text-[#8A8A8A] font-bold uppercase tracking-widest">
              Kling AI Engine
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto elegant-scroll px-7 py-6 space-y-8">
        {/* Upload Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <label className="text-[13px] font-black text-[#110C0C] uppercase tracking-tighter">
              Source Image
            </label>
            <span className="text-[10px] text-[#8A8A8A] font-bold">
              1:1 Recommended
            </span>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files[0])
                handleFileSelect(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "w-full h-[120px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden group relative transition",
              isDragging
                ? "border-red-500 bg-red-50"
                : "border-[#E5E5E8] bg-[#F8F8F8] hover:bg-gray-50",
            )}
          >
            {inputImagePreview ? (
              <>
                <img
                  src={inputImagePreview}
                  className="w-full h-full object-cover"
                  alt="Preview"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setInputImage(null);
                    setInputImagePreview(null);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <ImageIcon className="w-10 h-10 opacity-30 mb-2" />

                <p className="text-[12px] text-[#8A8A8A] font-bold">
                  Upload image
                </p>

                <p className="text-[10px] text-[#BDBDBD]">
                  Support: jpg, png Max file size: 10MB
                </p>
              </>
            )}

            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] && handleFileSelect(e.target.files[0])
              }
            />
          </div>
        </section>

        {/* Filter Controls Section */}
        <section className="space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <label className="text-[13px] font-black text-[#110C0C] uppercase tracking-tighter">
                Effect Filters
              </label>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-[#F0F0F3]">
                <Filter className="w-3 h-3 text-[#8A8A8A]" />
                <span className="text-[10px] font-bold text-[#8A8A8A] uppercase">
                  {filteredScenes.length} Found
                </span>
              </div>
            </div>

            {/* Premium Face Toggle */}
            <div className="flex items-center p-1 bg-[#F5F5F7] rounded-2xl w-full border border-[#E5E5E8] shadow-inner">
              <button
                onClick={() => setFaceOnly(null)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                  faceOnly === null
                    ? "bg-white text-[#110C0C] shadow-md border border-[#F0F0F3]"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                All
              </button>
              <button
                onClick={() => setFaceOnly(true)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                  faceOnly === true
                    ? "bg-white text-[#110C0C] shadow-md border border-[#F0F0F3]"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                <User className="w-3.5 h-3.5" /> Humans
              </button>
              <button
                onClick={() => setFaceOnly(false)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                  faceOnly === false
                    ? "bg-white text-[#110C0C] shadow-md border border-[#F0F0F3]"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                <Layers className="w-3.5 h-3.5" /> Scenery
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A] group-focus-within:text-red-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full h-[52px] pl-11 pr-4 bg-[#F9F9FB] border border-[#E5E5E8] rounded-2xl text-[14px] font-medium focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#110C0C] transition-all"
              />
            </div>
          </div>

          {/* Categories Scrollable Area */}
          <div className="relative">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 flex items-center gap-2",
                    selectedCategory === cat.name
                      ? "bg-[#110C0C] text-white border-[#110C0C] shadow-lg shadow-black/10"
                      : "bg-white text-[#8A8A8A] border-[#F0F0F3] hover:border-gray-300",
                  )}
                >
                  {cat.name}
                  {cat.sceneCount > 0 && (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded-md text-[9px] font-bold",
                        selectedCategory === cat.name
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-[#8A8A8A]",
                      )}
                    >
                      {cat.sceneCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Selection Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <label className="text-[13px] font-black text-[#110C0C] uppercase tracking-tighter">
              Select Style
            </label>
            <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center cursor-help group/info relative">
              <Info className="w-3 h-3 text-blue-500" />
              <div className="absolute bottom-full right-0 mb-2 w-48 p-3 bg-white border border-[#E5E5E8] rounded-xl shadow-xl text-[10px] font-medium text-gray-600 opacity-0 group-hover/info:opacity-100 transition-opacity z-50 pointer-events-none">
                Styles marked with a person icon work best for selfies and
                portraits.
              </div>
            </div>
          </div>

          <div className="min-h-[260px]">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-[#F9F9FB] rounded-[28px] border-2 border-transparent animate-pulse"
                  />
                ))}
              </div>
            ) : filteredScenes.length === 0 ? (
              <div className="py-16 text-center opacity-30 flex flex-col items-center gap-4 bg-[#F9F9FB] rounded-[32px] border-2 border-dashed border-[#E5E5E8]">
                <Layers className="w-12 h-12 text-[#8A8A8A]" />
                <p className="text-[14px] font-black uppercase tracking-widest">
                  No styles matched
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pb-4">
                {filteredScenes.map((scene) => (
                  <button
                    key={scene.sceneId}
                    disabled={scene.isLocked}
                    onClick={() => setSelectedScene(scene)}
                    className={cn(
                      "p-5 rounded-[32px] border-2 transition-all text-left flex flex-col gap-4 group relative",
                      selectedScene?.sceneId === scene.sceneId
                        ? "border-[#110C0C] bg-[#F5F5F7] shadow-md"
                        : "border-[#F0F0F3] hover:border-gray-300 bg-white hover:translate-y-[-2px]",
                      scene.isLocked &&
                        "opacity-40 grayscale cursor-not-allowed",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-[20px] flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 duration-500",
                          selectedScene?.sceneId === scene.sceneId
                            ? "bg-red-600 text-white"
                            : "bg-[#F9F9FB] text-[#8A8A8A] border border-gray-100",
                        )}
                      >
                        {scene.requiresFace ? (
                          <User className="w-6 h-6" />
                        ) : (
                          <Layers className="w-6 h-6" />
                        )}
                      </div>
                      {selectedScene?.sceneId === scene.sceneId && (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                          <Check
                            className="w-3.5 h-3.5 text-white"
                            strokeWidth={4}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[13px] font-black leading-tight block uppercase tracking-tighter truncate text-[#110C0C]">
                          {scene.name}
                        </span>
                        {scene.requiresFace && (
                           <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded-md border border-blue-100">
                             Face
                           </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <img
                          src="/assets/icons/ui/coin.svg"
                          className="w-3 h-3"
                        />
                        <span className="text-[10px] font-bold text-[#8A8A8A] uppercase tracking-widest">
                          {scene.creditCost}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer Area */}
      <div className="p-7 pt-5 bg-white border-t border-gray-50 shadow-[0_-20px_40px_rgba(0,0,0,0.02)] z-20">
        <div className="space-y-4">
          <div className="relative group">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Refine the motion effect (Optional)..."
              className="w-full h-24 p-5 bg-[#F9F9FB] border-2 border-[#F0F0F3] rounded-[24px] text-[14px] font-medium focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-[#110C0C] transition-all resize-none elegant-scroll"
            />
            <div className="absolute bottom-4 right-4 opacity-40">
              <Edit3 className="w-4 h-4" />
            </div>
          </div>

          <GenerateButton
            onClick={handleGenerate}
            isLoading={isGenerating}
            credits={selectedScene?.creditCost || 40}
            className="w-full h-[66px] rounded-[24px] shadow-2xl shadow-red-100"
            disabled={!inputImage || !selectedScene}
          />
        </div>
      </div>
    </div>
  );
}

function Edit3(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
