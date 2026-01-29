"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { ProfileDropdown } from "./features/profile/ProfileDropdown";
import { subscriptionService } from "@/lib/services/subscription.service";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuToggle?: () => void;
  onOpenProfile?: () => void;
  isCollapsed?: boolean;
}

const UPGRADE_ICON = "/assets/icons/ui/SVGRepo_iconCarrier-3.svg";

export default function Header({
  onMenuToggle,
  onOpenProfile,
  isCollapsed,
}: HeaderProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [subData, setSubData] = useState<any>(null);
  useEffect(() => {
    const fetchSub = async () => {
      try {
        const res = await subscriptionService.getCurrentSubscription();
        setSubData(res.data?.subscription);
      } catch (e) {}
    };
    fetchSub();
  }, []);

  const currentCredits = subData?.currentCredits || 0;
  const isProfessionalPlan = subData?.meta?.planName === "Professional";

  return (
    <header
      className={cn(
        "fixed top-0 z-[50] h-[66px] bg-[#F9F9F9] border-b border-[#E5E5E8] flex items-center px-4 md:px-8 transition-all duration-300 ease-in-out",
        "left-0 w-full",
        isCollapsed
          ? "lg:left-[72px] lg:w-[calc(100%-72px)]"
          : "lg:left-[245px] lg:w-[calc(100%-245px)]",
      )}
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M4 6h16M4 12h16M4 18h16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isAuthenticated && !isLoading && (
          <span className="text-sm md:text-base font-semibold text-[#110C0C]">
            Welcome, {user?.name?.split(" ")[0] || "User"}
          </span>
        )}
      </div>

      {/* SPACER */}
      <div className="flex-1" />

      {/* RIGHT SIDE */}
      {!isLoading && isAuthenticated ? (
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-3xl border border-gray-200 shadow-sm">
            <img src="./assets/icons/ui/coin.svg" alt="" />
            <span className="font-bold text-[#110C0C]">
              {Math.floor(currentCredits || 0)}
            </span>
          </div>
          {!isProfessionalPlan && (
            <Link href="/price" className="hidden sm:block">
              <button className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-[#110C0C] to-[#5A0A0A] text-white rounded-3xl font-medium text-[13px] md:text-[14px] hover:opacity-90 transition-all shadow-md">
                <img src={UPGRADE_ICON} alt="" className="w-5 h-5" />
                Upgrade plan
              </button>
            </Link>
          )}

          <ProfileDropdown onOpenProfile={onOpenProfile || (() => {})} />
        </div>
      ) : !isLoading ? (
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/signup">
            <button className="px-4 md:px-6 py-2 bg-white border border-gray-200 text-gray-900 rounded-xl text-xs md:text-sm font-bold hover:bg-gray-50 transition-all">
              Sign up
            </button>
          </Link>
          <Link href="/signin">
            <button className="px-4 md:px-6 py-2 bg-[#110C0C] text-white rounded-xl text-xs md:text-sm font-bold hover:bg-black transition-all shadow-lg">
              Sign in
            </button>
          </Link>
        </div>
      ) : (
        <div className="h-10 w-24 md:w-32 animate-pulse bg-gray-200 rounded-xl" />
      )}
    </header>
  );
}
