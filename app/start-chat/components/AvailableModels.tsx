'use client'

import { useState } from 'react'

const MODEL_ICONS = {
  gpt5: "/assets/icons/brands/gpt.svg",
  gemini: "/assets/icons/brands/gemini.svg",
  claude: "/assets/icons/brands/Component 1-1.svg",
  gpt4o: "/assets/icons/brands/gpt.svg",
}

const ARROW_ICON = "/assets/icons/ui/Vector 3.svg";

const models = [
  {
    id: 'gpt5',
    name: 'OpenAI GPT-5',
    description: "OpenAI's GPT-5 sets a new standard in...",
    icon: MODEL_ICONS.gpt5,
  },
  {
    id: 'gemini',
    name: 'Google Gemini 2.5',
    description: 'Gemini, Google\'s most advanced AI for you...',
    icon: MODEL_ICONS.gemini,
  },
  {
    id: 'claude',
    name: 'Claude 3',
    description: "Anthropic's Claude 3 is excellent for complex....",
    icon: MODEL_ICONS.claude,
  },
  {
    id: 'gpt4o',
    name: 'OpenAI GPT-4o',
    description: "Open AI's GPT-4o is stronger and faster ....",
    isPro: true,
    icon: MODEL_ICONS.gpt4o,
  },
]

export function AvailableModels() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {models.map((model) => {
            const isSelected = selectedModel === model.id
            const isHovered = false // Will be handled by CSS hover

            return (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`
                  group/card relative bg-white border rounded-[16px] 
                  w-full h-[135px] px-5 py-4
                  flex flex-col items-start gap-2
                  transition-all duration-200 cursor-pointer
                  ${isSelected 
                    ? 'border-[#F04549] bg-[#F04549]/5' 
                    : 'border-[#EFEFEF] hover:border-[#E5E5E8] hover:bg-[#F8F8F8]'
                  }
                `}
                data-node-id="1:9468"
              >
                {/* Icon */}
                <div className="w-[18px] h-[18px] flex-shrink-0">
                  <img src={model.icon} alt="" className="w-full h-full object-contain" />
                </div>

                {/* Title and Pro Badge */}
                <div className="flex items-center justify-between w-full">
                  <h4 className="text-[15px] font-semibold leading-[22px] text-[#110C0C] flex items-center gap-2">
                    {model.name}
                    {model.isPro && (
                      <span className="px-1.5 py-0.5 bg-[#F04549]/10 text-[#F04549] text-[10px] font-bold uppercase rounded-md">
                        Pro
                      </span>
                    )}
                  </h4>
                </div>

                {/* Description */}
                <p className="text-[13px] font-normal leading-[13px] text-[#888888]">
                  {model.description}
                </p>
              </button>
            )
          })}
        </div>

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
