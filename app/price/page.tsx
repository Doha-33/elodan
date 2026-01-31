'use client'

import { useState, useEffect } from 'react'
import PageLayout from '@/components/PageLayout'
import { subscriptionService } from '@/lib/services/subscription.service'
import { offerService } from '@/lib/services/offer.service'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import { Check, Diamond } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { OfferModal } from './components/OfferModal'

export default function PricingPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly')
  const [currentSub, setCurrentSub] = useState<any>(null)
  const [activeOffer, setActiveOffer] = useState<any>(null)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const { showToast } = useToast()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, subRes, offerRes] = await Promise.all([
          subscriptionService.getPlans(),
          isAuthenticated ? subscriptionService.getCurrentSubscription() : Promise.resolve({ data: { subscription: null } }),
          offerService.getLatestOffer()
        ])
        setPlans(plansRes.data?.plans || [])
        setCurrentSub(subRes.data?.subscription)
        if (offerRes.success && offerRes.data?.offer) {
          setActiveOffer(offerRes.data.offer)
        }
      } catch (e) {
        showToast('Failed to load pricing information', 'error')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [isAuthenticated, showToast])

  const filteredPlans = plans.filter(p => p.interval === interval)
  
  const sortedPlans = [...filteredPlans].sort((a, b) => {
    const order = { 'Free': 1, 'Pro': 2, 'Professional': 3 }
    return (order[a.name as keyof typeof order] || 4) - (order[b.name as keyof typeof order] || 4)
  })

  const handleAction = async (planId: string, planName: string) => {
    if (!isAuthenticated) {
      showToast('Please sign in to subscribe', 'warning')
      return
    }

    // منع الضغط إذا كانت الخطة هي الحالية
    if (currentSub?.meta?.planName === planName && currentSub?.status === 'active') return

    setProcessingId(planId)
    try {
      // المنطق: إذا كان هناك اشتراك نشط (وليس ملغياً)، نستخدم change-plan
      if (currentSub && currentSub.status === 'active' && currentSub.stripeSubscriptionId) {
        const res = await subscriptionService.changePlan(planId)
        if (res.success) {
          showToast('Plan updated successfully!', 'success')
          // تحديث الصفحة لرؤية التغييرات
          window.location.reload()
        }
      } else {
        // إذا كان الاشتراك ملغى أو غير موجود، نفتح جلسة دفع جديدة
        const res = await subscriptionService.subscribe(planId, activeOffer?._id)
        if (res.data?.checkoutUrl) {
          window.location.href = res.data.checkoutUrl
        }
      }
    } catch (e: any) {
      // معالجة خطأ Stripe الخاص بالاشتراكات الملغاة بشكل آلي
      if (e.message?.includes('canceled subscription')) {
        try {
          const res = await subscriptionService.subscribe(planId, activeOffer?._id)
          if (res.data?.checkoutUrl) window.location.href = res.data.checkoutUrl
          return
        } catch (innerError) {}
      }
      showToast(e.message || 'Operation failed', 'error')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <PageLayout>
      <div className="max-w-[1200px] mx-auto py-12 px-4 font-[Inter]">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-[40px] md:text-[56px] font-bold text-[#110C0C] leading-tight mb-4 tracking-tighter">
            Choose a plan that fits <br /> <span className="text-[#5A0A0A]">your needs</span>
          </h1>
          <p className="text-[18px] text-[#514647] font-medium mb-12">
            Pick the plan that matches your goals and budget
          </p>

          {/* Offer Banner */}
          {activeOffer && (
            <div 
              onClick={() => setShowOfferModal(true)}
              className="max-w-2xl mx-auto mb-8 p-4 bg-[#5A0A0A]/10 border border-[#5A0A0A]/20 rounded-2xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-1000 cursor-pointer hover:bg-[#5A0A0A]/20 transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#5A0A0A] p-2 rounded-xl">
                  <Diamond className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-bold text-[#110C0C]">{activeOffer.title}</p>
                  <p className="text-[12px] text-[#514647]">{activeOffer.description}</p>
                </div>
              </div>
              <div className="bg-[#5A0A0A] text-white px-4 py-1.5 rounded-full text-[12px] font-black uppercase">
                {activeOffer.type === 'discount' ? `${activeOffer.value}% OFF` : 
                 activeOffer.type === 'bonus_credits' ? `+${activeOffer.value} Credits` :
                 `${activeOffer.value} Days Free`}
              </div>
            </div>
          )}

          {/* Offer Modal */}
          <OfferModal 
            isOpen={showOfferModal} 
            onClose={() => setShowOfferModal(false)} 
            offer={activeOffer} 
          />

          {/* Toggle Switch */}
          <div className="flex justify-center">
            <div className="bg-[#E9E7E7] p-1.5 rounded-full flex items-center">
              <button 
                onClick={() => setInterval('monthly')}
                className={cn(
                  "px-8 py-2.5 rounded-full text-[14px] font-bold transition-all",
                  interval === 'monthly' ? "bg-white text-[#110C0C] shadow-sm" : "text-gray-500"
                )}
              >
                Monthly
              </button>
              <button 
                onClick={() => setInterval('yearly')}
                className={cn(
                  "px-8 py-2.5 rounded-full text-[14px] font-bold transition-all flex items-center gap-2",
                  interval === 'yearly' ? "bg-white text-[#110C0C] shadow-sm" : "text-gray-500"
                )}
              >
                Yearly
                <span className="text-[10px] text-[#5A0A0A] font-black uppercase">up to 20% off</span>
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-[600px] bg-gray-50 rounded-[40px] animate-pulse" />
            ))
          ) : (
            sortedPlans.map((plan) => {
              const isPro = plan.name === 'Pro'
              const isCurrent = currentSub?.meta?.planName === plan.name && currentSub?.status === 'active'
              const isProcessing = processingId === plan._id

              return (
                <div 
                  key={plan._id}
                  className={cn(
                    "relative flex flex-col p-10 rounded-[40px] border transition-all duration-500 hover:translate-y-[-8px]",
                    isPro 
                      ? "bg-[#0A0404] text-white border-[#0A0404] shadow-[0_30px_60px_rgba(0,0,0,0.2)]" 
                      : "bg-white text-[#110C0C] border-[#E5E5E8] shadow-sm"
                  )}
                >
                  {isPro && (
                    <div className="absolute top-8 right-8 px-4 py-1.5 bg-white text-[#110C0C] rounded-full text-[12px] font-black uppercase">
                      Popular
                    </div>
                  )}

                  <h3 className="text-[28px] font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-[48px] font-black">$</span>
                    <span className="text-[64px] font-black leading-none">{plan.price}</span>
                    <span className={cn("text-[14px] font-medium", isPro ? "text-gray-400" : "text-[#8A8A8A]")}>
                      USD/ {interval === 'monthly' ? 'Month' : 'Year'}
                    </span>
                  </div>

                  <button 
                    disabled={isCurrent || isProcessing || plan.price === 0}
                    onClick={() => handleAction(plan._id, plan.name)}
                    className={cn(
                      "w-full py-4 rounded-xl text-[16px] font-black mb-10 transition-all flex items-center justify-center",
                      isPro 
                        ? "bg-white text-[#110C0C] hover:bg-gray-100" 
                        : isCurrent 
                          ? "bg-[#F8F8F8] text-gray-400 cursor-default" 
                          : "bg-[#110C0C] text-white hover:bg-black shadow-md"
                    )}
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isCurrent ? (
                      'Your current plan'
                    ) : currentSub && currentSub.status === 'active' ? (
                      'Change Plan'
                    ) : (
                      'Subscribe'
                    )}
                  </button>

                  <div className="flex-1 space-y-6">
                    <p className={cn("text-[14px] font-bold", isPro ? "text-red-400" : "text-[#5A0A0A]")}>
                      Great for : <span className={isPro ? 'text-white' : 'text-[#110C0C]'}>{plan.description || 'Your smart partner for tasks'}</span>
                    </p>
                    
                    <ul className="space-y-4">
                      {plan.featuresIncluded.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className={cn("w-5 h-5 flex-shrink-0", isPro ? "text-white" : "text-[#110C0C]")} />
                          <span className={cn("text-[14px] font-medium leading-snug", isPro ? "text-gray-300" : "text-[#514647]")}>
                            {feature}
                          </span>
                        </li>
                      ))}
                      <li className="flex items-start gap-3">
                        <Check className={cn("w-5 h-5 flex-shrink-0", isPro ? "text-white" : "text-[#110C0C]")} />
                        <span className={cn("text-[14px] font-medium leading-snug", isPro ? "text-gray-300" : "text-[#514647]")}>
                          {plan.creditsIncluded.toLocaleString()} Fast Tokens / {interval}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="text-center mt-20">
          <p className="text-[#8A8A8A] font-medium">
            You have any questions? <Link href="#" className="text-[#110C0C] font-bold hover:underline">Contact us</Link>
          </p>
        </div>
      </div>
    </PageLayout>
  )
}