"use client";

import { useState, useEffect } from "react";
import { chatService } from "@/lib/services/chat.service";
import { Loader2 } from "lucide-react";
import { IoIosArrowForward } from "react-icons/io";

const MODEL_ICONS: Record<string, string> = {
  Google: "/assets/icons/brands/gemini.svg",
  Meta: "/assets/icons/brands/gpt.svg",
  DeepSeek: "/assets/icons/brands/Component 1-1.svg",
  MiniMax: "/assets/icons/brands/gpt.svg",
};

interface AvailableModelsProps {
  selectedModelId?: string;
  onSelect: (model: any) => void;
}

export function AvailableModels({
  selectedModelId,
  onSelect,
}: AvailableModelsProps) {
  const [models, setModels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await chatService.getModels();
        setModels(data);
        // Auto-select default model if nothing is selected
        if (!selectedModelId) {
          const defaultModel = data.find((m: any) => m.isDefault);
          if (defaultModel) onSelect(defaultModel);
        }
      } catch (error) {
        console.error("Failed to fetch models", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModels();
  }, []);

  return (
    <div
      className="max-w-[880px] mx-auto w-full px-4 mt-4 mb-24 font-[Inter]"
      data-node-id="273:7360"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center">
          <img src="/assets/icons/brands/Component 1.svg" alt="Models" className="w-4 h-4" />
        </div>
        <h3 className="text-[15px] font-semibold leading-[22px] text-[#110C0C]">
          Available Models
        </h3>
      </div>

      {/* Model Cards Grid */}
      <div className="relative group/carousel">
        {isLoading ? (
          <div className="flex items-center justify-center h-[135px] w-full">
            <Loader2 className="w-8 h-8 animate-spin text-[#F04549]" />
          </div>
        ) : (
          <div
            className="
  flex gap-2
  overflow-x-auto
  whitespace-nowrap
  pb-2
  scrollbar-thin scrollbar-thumb-[#E5E5E8] scrollbar-track-transparent
"
          >
            {models.map((model) => {
              const modelId = model._id || model.id;
              const isSelected = selectedModelId === modelId;

              return (
                <button
                  key={modelId}
                  onClick={() => onSelect(model)}
                  className={`
                    group/card relative bg-white border rounded-[16px] 
                    w-full h-[135px] px-5 py-4
                    flex flex-col items-start gap-2
                    transition-all duration-200 cursor-pointer
                    ${
                      isSelected
                        ? "border-[#F04549] bg-[#F04549]/5 shadow-sm"
                        : "border-[#EFEFEF] hover:border-[#E5E5E8] hover:bg-[#F8F8F8]"
                    }
                  `}
                >
                  {/* Icon */}
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-[#EFEFEF] p-1 flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover/card:scale-105">
                    <img
                      src={
                        model.icon ||
                        MODEL_ICONS[model.provider] ||
                        "/assets/icons/brands/gemini.svg"
                      }
                      alt={model.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Title and Pro Badge */}
                  <div className="flex items-center justify-between w-full">
                    <h4 className="text-[15px] font-semibold leading-[22px] text-[#110C0C] flex items-center gap-2 truncate">
                      {model.name}
                      {!model.isFree && (
                        <span className="px-1.5 py-0.5 bg-[#F04549]/10 text-[#F04549] text-[10px] font-bold uppercase rounded-md">
                          Pro
                        </span>
                      )}
                    </h4>
                  </div>

                  {/* Description */}
                  <p className="text-[13px] font-normal leading-[1.3] text-[#888888] text-left">
                    {model.description.length > 10
                      ? model.description.slice(0, 20) + "…"
                      : model.description}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {/* Carousel Arrow */}
        <button
          className="absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-[#E5E5E8] rounded-full shadow-lg flex items-center justify-center"
          aria-label="Next models"
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
}
