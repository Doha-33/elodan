'use client'

import { useEffect } from 'react'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // اختيارياً: تسجيل الخطأ في خدمة تتبع الأخطاء
    console.error('Application Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4 font-[Inter]">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-xl border border-[#E5E5E8] p-10 text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-[24px] font-black text-[#110C0C] mb-2 tracking-tight">Something went wrong</h1>
        <p className="text-[14px] text-[#8A8A8A] font-medium mb-8 leading-relaxed">
          {error.message || "An unexpected error occurred while processing your request. Please try again."}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full h-[54px] bg-[#110C0C] text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-md"
          >
            <RotateCcw className="w-5 h-5" />
            Try again
          </button>
          
          <Link href="/">
            <button className="w-full h-[54px] bg-white border border-[#D3D3D3] text-[#110C0C] rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all active:scale-95">
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </Link>
        </div>
        
        {error.digest && (
          <p className="mt-6 text-[10px] text-gray-300 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
