'use client'

import { TextareaHTMLAttributes, useState } from 'react'
import { cn } from '@/lib/utils'

const SURPRISE_ICON = "/assets/icons/ui/SVGRepo_iconCarrier-1.svg"
const IMPROVE_ICON = "/assets/icons/ui/SVGRepo_iconCarrier-2.svg"
const CLEAR_ICON = "/assets/icons/ui/SVGRepo_iconCarrier-3.svg"
const EXPAND_ICON = "/assets/icons/ui/SVGRepo_iconCarrier-4.svg"

type PromptState = 'empty' | 'value' | 'focus'

interface PromptInputProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string
  state?: PromptState
  onSurpriseMe?: () => void
  onImprovePrompt?: () => void
  onClear?: () => void
  onChange?: (value: string) => void
  showActionButtons?: boolean
}

export function PromptInput({
  label = 'Prompt',
  state,
  value: controlledValue,
  onSurpriseMe,
  onImprovePrompt,
  onClear,
  onChange,
  showActionButtons = true,
  className,
  placeholder = 'a cinematic photo of a lone figure with determined facial features and olive skin tone standing at the edge of a rugged cliff, gazing out at a vibrant glowing horizon with hues of warm orange and soft pink, set against a dramatic sky',
  ...props
}: PromptInputProps) {
  const [internalValue, setInternalValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  
  const value = controlledValue !== undefined ? controlledValue : internalValue
  const hasValue = Boolean(value && String(value).trim().length > 0)
  
  // Determine current state
  const currentState = state || (isFocused ? 'focus' : hasValue ? 'value' : 'empty')

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  const handleClear = () => {
    if (controlledValue === undefined) {
      setInternalValue('')
    }
    onChange?.('')
    onClear?.()
  }

  return (
    <div 
      className={cn("flex flex-col gap-2 font-[Inter]", className)}
      data-node-id="993:11293"
    >
      {/* Label */}
      <label className="text-[14px] font-normal text-[#110C0C] tracking-[0.1px]">
        {label}
      </label>

      {/* Textarea Container */}
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "w-full min-h-[120px] px-4 py-3 rounded-xl resize-none",
            "text-[14px] font-normal text-[#110C0C] tracking-[0.1px]",
            "placeholder:text-[#8A8A8A]",
            "border transition-all duration-200",
            "focus:outline-none",
            // Border colors based on state
            currentState === 'focus' 
              ? "border-[#110C0C] ring-2 ring-[#110C0C]/10" 
              : "border-[#E5E5E8]",
            // Background
            "bg-white"
          )}
          {...props}
        />

        {/* Action Buttons Row */}
        {showActionButtons && (
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              {/* Surprise Me Button */}
              <button
                type="button"
                onClick={onSurpriseMe}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg",
                  "text-[12px] font-normal text-[#110C0C]",
                  "border border-[#E5E5E8] bg-white",
                  "hover:bg-gray-50 active:scale-95",
                  "transition-all duration-200"
                )}
              >
                <img src={SURPRISE_ICON} alt="" className="w-4 h-4" />
                <span>Surprise Me</span>
              </button>

              {/* Improve Prompt Button */}
              <button
                type="button"
                onClick={onImprovePrompt}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg",
                  "text-[12px] font-normal text-[#110C0C]",
                  "border border-[#E5E5E8] bg-white",
                  "hover:bg-gray-50 active:scale-95",
                  "transition-all duration-200"
                )}
              >
                <img src={IMPROVE_ICON} alt="" className="w-4 h-4" />
                <span>Improve prompt</span>
              </button>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Clear Button - Only show when has value */}
              {hasValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className={cn(
                    "w-5 h-5 flex items-center justify-center",
                    "hover:opacity-70 active:scale-95",
                    "transition-all duration-200"
                  )}
                  aria-label="Clear"
                >
                  <img src={CLEAR_ICON} alt="" className="w-full h-full" />
                </button>
              )}

              {/* Expand Button */}
              <button
                type="button"
                className={cn(
                  "w-5 h-5 flex items-center justify-center",
                  "hover:opacity-70 active:scale-95",
                  "transition-all duration-200"
                )}
                aria-label="Expand"
              >
                <img src={EXPAND_ICON} alt="" className="w-full h-full" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
