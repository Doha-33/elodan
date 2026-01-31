'use client'

import { X, Diamond, Calendar, Target, Zap, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OfferModalProps {
  isOpen: boolean
  onClose: () => void
  offer: any
}

export function OfferModal({ isOpen, onClose, offer }: OfferModalProps) {
  if (!isOpen || !offer) return null

  const getStartDateStr = () => new Date(offer.startDate).toLocaleDateString()
  const getEndDateStr = () => new Date(offer.endDate).toLocaleDateString()

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#110C0C]/60 backdrop-blur-md animate-in fade-in duration-300 px-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[40px] shadow-2xl max-w-[500px] w-full overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Background Gradient */}
        <div className="relative h-32 bg-gradient-to-br from-[#5A0A0A] to-[#110C0C] flex items-center justify-center">
          <Diamond className="w-12 h-12 text-white/20 absolute top-[-10px] left-[-10px] rotate-12" />
          <Diamond className="w-16 h-16 text-white/10 absolute bottom-[-20px] right-20 -rotate-12" />
          
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20">
            <Diamond className="w-8 h-8 text-white" />
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-10 font-[Inter]">
          <div className="text-center mb-8">
            <h2 className="text-[28px] font-black text-[#110C0C] mb-2 leading-tight">
              {offer.title}
            </h2>
            <p className="text-[#514647] text-[16px] leading-relaxed">
              {offer.description}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-4 mb-10">
            <div className="flex items-center gap-4 p-5 bg-[#F8F8F8] rounded-[24px] border border-[#E5E5E8]">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Zap className="w-6 h-6 text-[#5A0A0A]" />
              </div>
              <div className="flex-1">
                <p className="text-[12px] text-[#8A8A8A] font-bold uppercase tracking-wider">Offer Type</p>
                <div className="flex items-center justify-between">
                  <p className="text-[16px] font-black text-[#110C0C]">
                    {offer.type === 'discount' ? 'Exclusive Discount' : 
                     offer.type === 'bonus_credits' ? 'Bonus Tokens' : 'Trial Extension'}
                  </p>
                  <div className="bg-[#5A0A0A] text-white px-4 py-1.5 rounded-full text-[12px] font-black uppercase">
                    {offer.type === 'discount' ? `${offer.value}% OFF` : 
                     offer.type === 'bonus_credits' ? `+${offer.value} Tokens` :
                     `${offer.value} Days Free`}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-[#F8F8F8] rounded-[24px] border border-[#E5E5E8]">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Target className="w-6 h-6 text-[#5A0A0A]" />
              </div>
              <div>
                <p className="text-[12px] text-[#8A8A8A] font-bold uppercase tracking-wider">Applies To</p>
                <p className="text-[16px] font-black text-[#110C0C] capitalize">
                  {offer.appliesTo === 'all' ? 'All Plans & Bundles' : offer.appliesTo}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-[#F8F8F8] rounded-[24px] border border-[#E5E5E8]">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Calendar className="w-6 h-6 text-[#5A0A0A]" />
              </div>
              <div>
                <p className="text-[12px] text-[#8A8A8A] font-bold uppercase tracking-wider">Validity Period</p>
                <p className="text-[16px] font-black text-[#110C0C]">
                  {getStartDateStr()} — {getEndDateStr()}
                </p>
              </div>
            </div>

            {offer.usageLimit && (
              <div className="flex items-center gap-4 p-5 bg-[#F8F8F8] rounded-[24px] border border-[#E5E5E8]">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <Clock className="w-6 h-6 text-[#5A0A0A]" />
                </div>
                <div>
                  <p className="text-[12px] text-[#8A8A8A] font-bold uppercase tracking-wider">Remaining Uses</p>
                  <p className="text-[16px] font-black text-[#110C0C]">
                    {(offer.usageLimit - offer.usedCount).toLocaleString()} spots left
                  </p>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={onClose}
            className="w-full py-5 bg-[#110C0C] text-white rounded-[24px] text-[16px] font-black hover:bg-black transition-all shadow-xl active:scale-95"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  )
}
