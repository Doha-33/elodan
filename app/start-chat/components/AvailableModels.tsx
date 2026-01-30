
'use client'

import { useState, useEffect } from 'react'
import { chatService } from '@/lib/services/chat.service'
import { Loader2 } from 'lucide-react'

const MODEL_ICONS: Record<string, string> = {
  Google: "/assets/icons/brands/gemini.svg",
  Meta: "/assets/icons/brands/gpt.svg",
  DeepSeek: "/assets/icons/brands/Component 1-1.svg",
  MiniMax: "/assets/icons/brands/gpt.svg",
}

const ARROW_ICON = "/assets/icons/ui/Vector 3.svg";

interface AvailableModelsProps {
  selectedModelId?: string;
  onSelect: (model: any) => void;
}

export function AvailableModels({ selectedModelId, onSelect }: AvailableModelsProps) {
  const [models, setModels] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await chatService.getModels()
        setModels(data)
        // Auto-select default model if nothing is selected
        if (!selectedModelId) {
          const defaultModel = data.find((m: any) => m.isDefault);
          if (defaultModel) onSelect(defaultModel);
        }
      } catch (error) {
        console.error("Failed to fetch models", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchModels()
  }, [])

  return (
    <div className="max-w-[948px] mx-auto w-full px-4 mb-24 font-[Inter]" data-node-id="273:7360">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center">
           <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
             <circle cx="9" cy="9" r="8" stroke="#F04549" strokeOpacity="0.2" strokeWidth="2"/>
             <circle cx="9" cy="9" r="3" fill="#F04549"/>
           </svg>
        </div>
        <h3 className="text-[15px] font-semibold leading-[22px] text-[#110C0C]">Available Models</h3>
      </div>

      {/* Model Cards Grid */}
      <div className="relative group/carousel">
        {isLoading ? (
          <div className="flex items-center justify-center h-[135px] w-full">
            <Loader2 className="w-8 h-8 animate-spin text-[#F04549]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {models.map((model) => {
              const modelId = model._id || model.id
              const isSelected = selectedModelId === modelId

              return (
                <button
                  key={modelId}
                  onClick={() => onSelect(model)}
                  className={`
                    group/card relative bg-white border rounded-[16px] 
                    w-full h-[135px] px-5 py-4
                    flex flex-col items-start gap-2
                    transition-all duration-200 cursor-pointer
                    ${isSelected 
                      ? 'border-[#F04549] bg-[#F04549]/5 shadow-sm' 
                      : 'border-[#EFEFEF] hover:border-[#E5E5E8] hover:bg-[#F8F8F8]'
                    }
                  `}
                >
                  {/* Icon */}
                  <div className="w-[18px] h-[18px] flex-shrink-0">
                    <img 
                        src={MODEL_ICONS[model.provider] || "/assets/icons/brands/gemini.svg"} 
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
                  <p className="text-[13px] font-normal leading-[1.3] text-[#888888] text-left line-clamp-2">
                    {model.description}
                  </p>
                </button>
              )
            })}
          </div>
        )}

        {/* Carousel Arrow */}
        <button 
          className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-[#E5E5E8] rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 translate-x-4 group-hover/carousel:translate-x-0 transition-all duration-300"
          aria-label="Next models"
        >
          <img src={ARROW_ICON} alt="" className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
