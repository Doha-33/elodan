"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ProfileSidebar } from "./features/profile/ProfileSidebar";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  isPublic?: boolean;
}

export default function PageLayout({
  children,
  isPublic = false,
}: PageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublic) {
      router.push("/signin");
    }
  }, [isLoading, isAuthenticated, isPublic, router]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (!isPublic && (isLoading || !isAuthenticated)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#110C0C]/10 border-t-[#110C0C] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Sidebar Component */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Main Container */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-500 ease-in-out",
          // نستخدم padding-left بدلاً من margin-left لضمان بقاء الـ box model داخل الـ 100% عرض
          isCollapsed ? "lg:pl-[72px]" : "lg:pl-[245px]",
        )}
      >
        {/* Fixed Header */}
        <Header
          onMenuToggle={() => setSidebarOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          isCollapsed={isCollapsed}
        />

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-x-hidden bg-[#F9F9F9] scrollbar-elodan pt-[66px]">
          <div
            className={cn(
              "mx-auto w-full transition-all duration-500 ease-in-out px-4 md:px-8 py-6",
              // نتحكم في أقصى عرض للمحتوى الداخلي لضمان التمركز الجيد
              isCollapsed ? "max-w-[1440px]" : "max-w-[1240px]",
            )}
          >
            {children}
          </div>
        </main>
      </div>

      {/* Profile Slide-over */}
      <ProfileSidebar
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
