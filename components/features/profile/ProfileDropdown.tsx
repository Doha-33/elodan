'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { subscriptionService } from '@/lib/services/subscription.service'
import { cn } from '@/lib/utils'
import { Settings, LogOut, Diamond, ChevronRight } from 'lucide-react'

const PROFILE_IMG = "/assets/images/backgrounds/Ellipse 491.svg"

interface ProfileDropdownProps {
  onOpenProfile: () => void
}

export function ProfileDropdown({ onOpenProfile }: ProfileDropdownProps) {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [subData, setSubData] = useState<any>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await subscriptionService.getCurrentSubscription()
        setSubData(res.data?.subscription)
      } catch (e) {}
    }
    fetchSub()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const creditsUsed = subData?.meta?.creditsIncluded - (subData?.currentCredits || 0)
  const totalCredits = subData?.meta?.creditsIncluded || 50
  const progress = Math.min(100, (creditsUsed / totalCredits) * 100)

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full overflow-hidden border border-[#E5E5E8] shadow-sm hover:ring-2 hover:ring-[#110C0C]/10 transition-all"
      >
        <img src={user?.avatar || PROFILE_IMG} alt="Profile" className="w-full h-full object-cover" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[280px] bg-white rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-[#E5E5E8] py-6 px-5 z-[100] animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img src={user?.avatar || PROFILE_IMG} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[16px] font-bold text-[#110C0C] truncate">{user?.name || 'Ahmed Ali'}</p>
              <p className="text-[12px] text-[#8A8A8A] truncate">{user?.email || 'Ahmed Ali@gmail.com'}</p>
            </div>
          </div>

          <div className="bg-[#F8F8F8] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-bold text-[#110C0C]">{subData?.meta?.planName || 'Free plan'}</span>
              <div className="flex items-center gap-1">
                <Diamond className="w-3.5 h-3.5 text-[#5A0A0A]" />
                <span className="text-[11px] text-[#8A8A8A]">
                  <span className="font-bold text-[#110C0C]">{Math.floor(creditsUsed || 0)}</span>/{totalCredits} Credits used
                </span>
              </div>
            </div>
            <div className="w-full h-1.5 bg-[#E5E5E8] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#5A0A0A] to-[#110C0C] transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Link href="/price" onClick={() => setIsOpen(false)}>
            <button className="w-full flex items-center justify-center gap-2 py-3 mb-4 bg-gradient-to-r from-[#5A0A0A] to-[#110C0C] text-white rounded-xl text-[14px] font-bold hover:opacity-90 transition-all shadow-md">
              <Diamond className="w-4 h-4" />
              Upgrade plan
            </button>
          </Link>

          <div className="space-y-1">
            <button 
              onClick={() => { onOpenProfile(); setIsOpen(false); }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group text-left"
            >
              <Settings className="w-5 h-5 text-gray-400 group-hover:text-[#110C0C]" />
              <span className="text-[14px] font-medium text-gray-700 group-hover:text-[#110C0C]">Manage account</span>
            </button>
            <button 
              onClick={() => { logout(); setIsOpen(false); }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors group text-left"
            >
              <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
              <span className="text-[14px] font-medium text-gray-700 group-hover:text-red-600">Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}