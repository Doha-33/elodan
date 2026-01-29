
'use client'

import React, { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const CREDIT_ICON = "/assets/icons/ui/coin.svg"

type GenerateButtonVariant = 'default' | 'hover' | 'disabled' | 'loading'

// Use ButtonHTMLAttributes for standard button attributes to ensure compatibility with standard props like onClick and className
export interface GenerateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GenerateButtonVariant
  credits?: number
  showCredits?: boolean
  isLoading?: boolean
}

export function GenerateButton({ 
  variant = 'default',
  credits = 40,
  showCredits = true,
  isLoading = false,
  className,
  disabled,
  children,
  onClick,
  ...props 
}: GenerateButtonProps) {
  const isDisabled = disabled || isLoading

  return (
    <button
      className={cn(
        // Base styles
        "relative flex items-center justify-center gap-2 px-4 py-2 rounded-2xl",
        "font-[Inter] text-[16px] font-normal text-white",
        "transition-all duration-200",
        // Gradient background
        "bg-gradient-to-r from-[#5A0A0A] to-[#110C0C]",
        // Overlay effects for variants
        variant === 'hover' && "before:absolute before:inset-0 before:bg-black/10 before:rounded-2xl",
        variant === 'disabled' && "opacity-50 cursor-not-allowed",
        isLoading && "opacity-80 cursor-wait",
        // Default hover if not disabled
        !isDisabled && variant === 'default' && "hover:before:absolute hover:before:inset-0 hover:before:bg-black/10 hover:before:rounded-2xl",
        // Active state
        !isDisabled && "active:scale-[0.98]",
        className
      )}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10">
        {isLoading ? 'Generating...' : children || 'Generate'}
      </span>
      
      {showCredits && (
        <div className="relative z-10 flex items-center gap-0.5 px-2 py-1 bg-white rounded-2xl">
          <img src={CREDIT_ICON} alt="" className="w-5 h-5" />
          <span className="text-[14px] font-normal text-[#110C0C] tracking-[0.1px]">
            {credits} credits
          </span>
        </div>
      )}
    </button>
  )
}
