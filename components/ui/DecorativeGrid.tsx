'use client'

import React from 'react'

export function DecorativeGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.4] overflow-hidden" aria-hidden="true">
      <div className="flex flex-wrap h-full w-full">
        {Array.from({ length: 200 }).map((_, i) => (
          <div 
            key={i} 
            className="border-[#f16a6c]/10 border-[0.5px] w-[20px] h-[20px]"
          />
        ))}
      </div>
    </div>
  )
}
