'use client'

import { cn } from '@/lib/utils'

const CREDIT_ICON = "/assets/icons/ui/SVGRepo_iconCarrier.svg"

interface CreditsBadgeProps {
  credits: number
  variant?: 'default' | 'free'
  className?: string
}

export function CreditsBadge({ credits, variant = 'default', className }: CreditsBadgeProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-1.5 px-2 py-1.5 bg-white border border-[#E5E5E8] rounded-3xl font-[Inter]",
        className
      )}
      data-node-id="908:12888"
    >
      {variant === 'default' ? (
        <>
          <img src={CREDIT_ICON} alt="" className="w-6 h-6" />
          <span className="text-[16px] font-medium text-[#110C0C]">
            {credits}
          </span>
        </>
      ) : (
        <span className="text-[14px] font-medium text-[#110C0C] px-1">
          Free
        </span>
      )}
    </div>
  )
}
