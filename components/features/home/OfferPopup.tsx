"use client";

import { useState, useEffect } from 'react';
import { X, Tag, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/config';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export function OfferPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 4 });
  const [bundle, setBundle] = useState<any>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Show popup after 1.5 seconds on first load in this session
    const hasSeenOffer = sessionStorage.getItem('elodan_offer_seen');
    if (!hasSeenOffer) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Fetch the first bundle when popup opens
      const fetchBundle = async () => {
        try {
          const response = await apiClient.get(API_ENDPOINTS.bundles.getAll);
          const bundles = response.data?.bundles || response.bundles || [];
          if (bundles.length > 0) {
            setBundle(bundles[0]);
          }
        } catch (error) {
          console.error("Failed to fetch bundle for offer", error);
        }
      };
      fetchBundle();
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('elodan_offer_seen', 'true');
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      showToast("Please sign in to claim this offer", "info");
      router.push("/signin");
      return;
    }

    if (!bundle) return;

    setIsPurchasing(true);
    try {
      const response = await apiClient.post(API_ENDPOINTS.bundles.purchase, {
        bundleId: bundle._id
      });
      
      const checkoutUrl = response.data?.checkoutUrl || response.checkoutUrl;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        showToast("Successfully initiated purchase", "success");
      }
    } catch (error: any) {
      showToast(error.message || "Failed to process purchase", "error");
    } finally {
      setIsPurchasing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 font-[Inter]">
      <div className="relative w-full max-w-[668px] h-auto md:h-[341px] bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-all border border-gray-100"
        >
          <X className="w-5 h-5 text-[#110C0C]" />
        </button>

        {/* Left Side: Content */}
        <div className="flex-1 bg-[#F2F2F2] p-8 md:p-10 flex flex-col items-center justify-center text-center">
          <div className="mb-3">
            <Tag className="w-8 h-8 text-[#711013] -rotate-45" />
          </div>
          
          <p className="text-[10px] font-black text-[#110C0C] uppercase tracking-[0.2em] mb-3 opacity-70">
            Don't miss out on
          </p>
          
          <h2 className="text-[16px] font-black text-[#110C0C] leading-[1.2] mb-6 max-w-[320px]">
            {bundle ? `Unlock your creative power with ${bundle.name}` : "Unlock your creative power save up to 20%"}
          </h2>

          {/* Countdown Timer */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex flex-col gap-1">
               <span className="text-[10px] font-bold text-[#8A8A8A] uppercase">Hours</span>
               <div className="flex gap-1">
                  <div className="w-8 h-10 bg-[#310A0A] rounded-lg flex items-center justify-center text-white text-[16px] font-black">0</div>
                  <div className="w-8 h-10 bg-[#310A0A] rounded-lg flex items-center justify-center text-white text-[16px] font-black">{timeLeft.hours}</div>
               </div>
            </div>
            
            <div className="text-[20px] font-black text-[#310A0A] self-end mb-2">:</div>

            <div className="flex flex-col gap-1">
               <span className="text-[10px] font-bold text-[#8A8A8A] uppercase">Minutes</span>
               <div className="flex gap-1">
                  <div className="w-8 h-10 bg-[#310A0A] rounded-lg flex items-center justify-center text-white text-[16px] font-black">0</div>
                  <div className="w-8 h-10 bg-[#310A0A] rounded-lg flex items-center justify-center text-white text-[16px] font-black">{timeLeft.minutes}</div>
               </div>
            </div>
          </div>

          <button 
            onClick={handlePurchase}
            disabled={isPurchasing}
            className="w-full h-[54px] bg-gradient-to-r from-[#1A0505] to-[#110C0C] text-white rounded-2xl font-bold text-[12px] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isPurchasing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : bundle ? (
              `Get ${bundle.includedCredits} Credits for $${bundle.price}`
            ) : (
              "Get up to 20%"
            )}
          </button>
        </div>

        {/* Right Side: Image/Visual */}
        <div className="w-full md:w-[45%] relative min-h-[220px] md:min-h-full">
           <img 
            src="/assets/images/gallery/offer.png" 
            alt="Offer Celebration" 
            className="absolute inset-0 w-full h-full object-cover"
           />
           
           <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}
