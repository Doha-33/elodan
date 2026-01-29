'use client'

import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
}

interface TabSwitchProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
}

export function TabSwitch({ tabs, activeTab, onChange, className }: TabSwitchProps) {
  return (
    <div 
      className={cn(
        "flex items-start gap-2 p-1 bg-[#E9E7E7] rounded-xl font-[Inter]",
        className
      )}
      data-node-id="993:11285"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg text-[12px] font-semibold text-[#110C0C]",
              "transition-all duration-200",
              isActive 
                ? "bg-white border border-[#E5E5E8] shadow-sm" 
                : "bg-transparent hover:bg-white/50"
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
