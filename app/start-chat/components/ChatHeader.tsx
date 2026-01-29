'use client'

import React from 'react'
import Link from 'next/link'

const UPGRADE_ICON = "/assets/icons/ui/SVGRepo_iconCarrier-5.svg";
const PROFILE_IMG = "/assets/images/gallery/image to image.png";

export function ChatHeader() {
  return (
    <header className="flex items-center justify-end p-8 gap-4 font-[Inter]">
      <Link href="/price">
        <button 
          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#110C0C] to-[#5A0A0A] text-white rounded-3xl font-normal text-[14px] tracking-[0.1px] hover:opacity-90 transition-all shadow-md"
          data-node-id="164:13362"
        >
          <img src={UPGRADE_ICON} alt="" className="w-5 h-5 object-contain" />
          Upgrade plan
        </button>
      </Link>
      
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
