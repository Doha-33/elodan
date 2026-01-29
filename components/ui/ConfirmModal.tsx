
'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { X, AlertCircle, Trash2, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmStyle?: 'danger' | 'primary'
  icon?: 'warning' | 'delete' | 'info'
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined)

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider')
  }
  return context
}

const ConfirmIcon = ({ icon }: { icon?: string }) => {
  switch (icon) {
    case 'delete':
      return (
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-5 border border-red-100">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
      )
    case 'warning':
      return (
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-5 border border-amber-100">
          <AlertCircle className="w-6 h-6 text-amber-600" />
        </div>
      )
    case 'info':
    default:
      return (
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-5 border border-blue-100">
          <Info className="w-6 h-6 text-blue-600" />
        </div>
      )
  }
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null)

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts)
    setIsOpen(true)
    
    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve)
    })
  }, [])

  const handleConfirm = () => {
    setIsOpen(false)
    resolvePromise?.(true)
    setResolvePromise(null)
    setOptions(null)
  }

  const handleCancel = () => {
    setIsOpen(false)
    resolvePromise?.(false)
    setResolvePromise(null)
    setOptions(null)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      
      {/* Confirmation Modal */}
      {isOpen && options && (
        <div 
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300 font-[Inter]"
          onClick={handleCancel}
        >
          <div 
            className="bg-[#F2F2F2] rounded-[32px] shadow-2xl max-w-[440px] w-full mx-4 p-8 animate-in zoom-in-95 duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button Top Right */}
            <button 
              onClick={handleCancel}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 hover:bg-gray-50 transition-all text-gray-900"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-start">
              {/* <ConfirmIcon icon={options.icon} /> */}
              
              <h3 className="text-[20px] font-bold text-[#110C0C] mb-8 leading-tight">
                {options.title || 'Confirm Action'}
              </h3>
              
              <div className="w-full h-px bg-gray-300 mb-8 opacity-40" />

              <p className="text-[#110C0C] text-[16px] font-bold mb-8 leading-relaxed">
                {options.message}
              </p>
              
              <div className="flex items-center gap-4 w-full mt-4">
                <button
                  onClick={handleCancel}
                  className="flex-1 h-[52px] bg-white border border-[#D3D3D3] text-[#110C0C] rounded-2xl font-bold text-[14px] transition-all hover:bg-gray-50 active:scale-95"
                >
                  {options.cancelText || 'Cancel'}
                </button>
                <button
                  onClick={handleConfirm}
                  className={cn(
                    "flex-1 h-[52px] rounded-2xl font-bold text-[14px] text-white transition-all active:scale-95 shadow-md",
                    options.confirmStyle === 'danger' 
                      ? "bg-[#711013] hover:bg-[#5A0A0A]" 
                      : "bg-[#110C0C] hover:bg-black"
                  )}
                >
                  {options.confirmText || 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}
