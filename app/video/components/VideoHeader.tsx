'use client'

import Link from 'next/link'
import { CreditsBadge } from '@/components/ui/CreditsBadge'

const UPGRADE_ICON = "/assets/icons/ui/SVGRepo_iconCarrier-5.svg"
const PROFILE_IMG = "/assets/images/gallery/image to image.png"

export function VideoHeader() {
  return (
    <header className="flex items-center justify-end px-8 py-4 gap-4 font-[Inter] bg-white border-b border-[#E5E5E8]">
      {/* Credits Display */}
      <CreditsBadge credits={100} />

      {/* Upgrade Button */}
      <Link href="/price">
        <button 
          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#110C0C] to-[#5A0A0A] text-white rounded-3xl font-normal text-[14px] tracking-[0.1px] hover:opacity-90 transition-all shadow-md"
        >
          <img src={UPGRADE_ICON} alt="" className="w-5 h-5 object-contain" />
          Upgrade plan
        </button>
      </Link>
      
      {/* Profile */}
      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E5E5E8] shadow-sm">
        <img 
          src={PROFILE_IMG} 
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
    </header>
  )
}
